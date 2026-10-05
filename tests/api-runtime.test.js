import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import app from '../src/app.js';
import { getUsage } from '../src/controllers/userController.js';
import Playlist from '../src/models/Playlist.js';
import { Plan } from '../src/constants/plan.constants.js';

const originalCountDocuments = Playlist.countDocuments;

test.afterEach(() => {
  Playlist.countDocuments = originalCountDocuments;
});

test('GET /health responds successfully without requiring a database connection', async () => {
  const server = app.listen(0);
  await once(server, 'listening');

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: 'success',
      message: 'API funcionando correctamente',
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('Plus usage reaches 100 percent at the limit', async () => {
  Playlist.countDocuments = async () => 4;
  const result = await getUsageResponse({ _id: 'plus-user-id', plan: Plan.plus });

  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body.data, {
    plan: Plan.plus,
    used: 4,
    limit: 4,
    percentageUsed: 100,
  });
});

test('Premium usage has no numeric cap even with 11 existing playlists', async () => {
  Playlist.countDocuments = async () => 11;
  const result = await getUsageResponse({ _id: 'premium-user-id', plan: Plan.premium });

  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body.data, {
    plan: Plan.premium,
    used: 11,
    limit: null,
    percentageUsed: null,
  });
});

async function getUsageResponse(user) {
  const response = {
    statusCode: null,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await getUsage({ user }, response);
  return response;
}
