import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import newman from 'newman';
import { MongoMemoryServer } from 'mongodb-memory-server';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const collectionPath = path.join(projectRoot, 'postman', 'collection.json');
const testRunId = randomBytes(5).toString('hex');
const adminUsername = `postman_admin_${testRunId}`;
const adminEmail = `${adminUsername}@example.test`;
const adminPassword = `PostmanTest-${randomBytes(8).toString('hex')}!`;
const jwtSecret = randomBytes(32).toString('hex');
const imagePath = path.join(os.tmpdir(), `music-playlist-postman-${testRunId}.png`);
const appLogs = [];

let mongo;
let cloudinaryMock;
let seedProcess;
let appProcess;

const rememberOutput = (target, chunk) => {
  appLogs.push(`${target}: ${chunk.toString()}`);
  if (appLogs.length > 80) appLogs.shift();
};

const getFreePort = async () => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
  return port;
};

const waitForHealth = async (url, child, timeoutMs = 30_000) => {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`API process exited early with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(`${url}/health`, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return;
      lastError = new Error(`Health endpoint returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`API did not become ready: ${lastError?.message ?? 'timeout'}`);
};

const runSeed = (env) =>
  new Promise((resolve, reject) => {
    seedProcess = spawn(process.execPath, ['src/seed/seed.js'], {
      cwd: projectRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    seedProcess.stdout.on('data', (chunk) => (output += chunk));
    seedProcess.stderr.on('data', (chunk) => (output += chunk));
    seedProcess.once('error', reject);
    seedProcess.once('exit', (code) => {
      seedProcess = null;
      if (code === 0) resolve();
      else reject(new Error(`Test database seed failed (exit ${code}):\n${output}`));
    });
  });

const runCollection = (collection, baseUrl) =>
  new Promise((resolve, reject) => {
    newman.run(
      {
        collection,
        reporters: [],
        timeoutRequest: 20_000,
      },
      (error, summary) => {
        if (error) return reject(error);
        resolve(summary);
      }
    );
  });

const stopProcess = async (child) => {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([
    once(child, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
};

try {
  mongo = await MongoMemoryServer.create({
    instance: { dbName: `music_playlist_postman_${testRunId}` },
  });

  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const cloudinaryPort = await getFreePort();
  cloudinaryMock = http.createServer((request, response) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      if (request.method !== 'POST' || Buffer.concat(chunks).length === 0) {
        response.writeHead(400);
        response.end();
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          public_id: `postman-test/${testRunId}`,
          secure_url: `https://res.cloudinary.test/postman-test/${testRunId}.png`,
          resource_type: 'image',
          format: 'png',
        })
      );
    });
  });
  cloudinaryMock.listen(cloudinaryPort, '127.0.0.1');
  await once(cloudinaryMock, 'listening');

  const env = {
    ...process.env,
    NODE_ENV: 'test',
    PORT: String(port),
    MONGO_URI: mongo.getUri(),
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: '10m',
    GEMINI_API_KEY: 'local-postman-test-disabled',
    MOCK_GEMINI: 'fallback',
    CLOUDINARY_CLOUD_NAME: 'local-postman-test',
    CLOUDINARY_API_KEY: 'local-postman-test-key',
    CLOUDINARY_API_SECRET: `local-postman-test-${testRunId}`,
    CLOUDINARY_UPLOAD_PREFIX: `http://127.0.0.1:${cloudinaryPort}`,
    ADMIN_USERNAME: adminUsername,
    ADMIN_EMAIL: adminEmail,
    ADMIN_PASSWORD: adminPassword,
  };

  await writeFile(
    imagePath,
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII=',
      'base64'
    )
  );

  await runSeed(env);

  appProcess = spawn(process.execPath, ['src/server.js'], {
    cwd: projectRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  appProcess.stdout.on('data', (chunk) => rememberOutput('stdout', chunk));
  appProcess.stderr.on('data', (chunk) => rememberOutput('stderr', chunk));

  await waitForHealth(baseUrl, appProcess);

  const collection = JSON.parse(await readFile(collectionPath, 'utf8'));
  const overrides = {
    prod_base_url: baseUrl,
    test_password: 'PostmanUserTest123!',
    admin_username: adminUsername,
    admin_password: adminPassword,
  };
  for (const variable of collection.variable) {
    if (Object.hasOwn(overrides, variable.key)) {
      variable.value = overrides[variable.key];
    }
  }

  const allRequests = [];
  const collectRequests = (items = []) => {
    for (const item of items) {
      if (item.request) allRequests.push(item);
      collectRequests(item.item);
    }
  };
  collectRequests(collection.item);

  const manualUpload = allRequests.find((item) => item.name.includes('[MANUAL:'));
  if (manualUpload) {
    const imageField = manualUpload.request.body?.formdata?.find(
      (field) => field.key === 'image' && field.type === 'file'
    );
    if (imageField) imageField.src = imagePath;
  }

  console.log(`Running ${allRequests.length} Postman requests against ${baseUrl}`);
  console.log('MongoDB: isolated in-memory database; Atlas is not used.');
  console.log('Cloudinary: upload requests are directed to a local test stub.');
  console.log('Gemini: disabled; the API fallback path is exercised locally.');

  const summary = await runCollection(collection, baseUrl);
  const stats = summary.run.stats;
  const failures = summary.run.failures;
  const passedAssertions = stats.assertions.total - stats.assertions.failed - stats.assertions.pending;

  console.log(
    `Requests: ${stats.requests.total - stats.requests.pending}/${stats.requests.total} executed; ` +
      `assertions: ${passedAssertions} passed, ${stats.assertions.failed} failed.`
  );

  if (failures.length) {
    console.error('\nFailed requests/assertions:');
    for (const failure of failures) {
      const requestName = failure.source?.name ?? 'Unknown request';
      const assertionName = failure.error?.test ?? failure.error?.name ?? failure.error?.assertion ?? 'Assertion';
      console.error(`- ${requestName}: ${assertionName} — ${failure.error?.message ?? 'failed'}`);
    }
  }

  if (stats.requests.pending > 0 || stats.assertions.failed > 0) {
    process.exitCode = 1;
  } else {
    console.log('All Postman collection requests and assertions passed.');
  }
} catch (error) {
  console.error(`Postman collection run failed: ${error.message}`);
  if (appLogs.length) console.error(appLogs.join(''));
  process.exitCode = 1;
} finally {
  await stopProcess(appProcess);
  await stopProcess(seedProcess);
  if (cloudinaryMock?.listening) {
    await new Promise((resolve, reject) =>
      cloudinaryMock.close((error) => (error ? reject(error) : resolve()))
    );
  }
  if (mongo) await mongo.stop();
  await unlink(imagePath).catch((error) => {
    if (error.code !== 'ENOENT') console.error(`Could not remove test image: ${error.message}`);
  });
}
