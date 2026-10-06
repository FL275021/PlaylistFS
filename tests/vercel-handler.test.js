import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import test from 'node:test';
import mongoose from 'mongoose';

process.env.MONGO_URI = 'mongodb://127.0.0.1:1/no_db?serverSelectionTimeoutMS=250';

const { default: handler } = await import('../api/index.js');

const startHandler = async () => {
  const server = http.createServer((req, res) => handler(req, res));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server;
};

test('Vercel health endpoint remains available without a MongoDB URI', async () => {
  const server = await startHandler();

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: 'success',
      message: 'API funcionando correctamente',
    });
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test('Vercel API reports database configuration failure as HTTP 503', async () => {
  const server = await startHandler();

  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: 'not-a-real-password' }),
      }
    );

    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      status: 'error',
      message: 'Database unavailable. Check the deployment database configuration.',
    });
  } finally {
    await mongoose.disconnect();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
