import assert from 'node:assert/strict';
import test from 'node:test';
import Playlist from '../src/models/Playlist.js';
import { enforcePlaylistLimit } from '../src/middlewares/planCheck.middleware.js';
import { Plan, PLUS_PLAYLIST_LIMIT } from '../src/constants/plan.constants.js';

const originalCountDocuments = Playlist.countDocuments;

test.afterEach(() => {
  Playlist.countDocuments = originalCountDocuments;
});

const runLimitMiddleware = async (plan, used) => {
  let nextCalled = false;
  let nextError;

  Playlist.countDocuments = async (filter) => {
    assert.deepEqual(filter, { owner: 'test-user-id' });
    return used;
  };

  await enforcePlaylistLimit(
    { user: { _id: 'test-user-id', plan } },
    {},
    (error) => {
      nextCalled = true;
      nextError = error;
    }
  );

  return { nextCalled, nextError };
};

test('Plus users can create playlists below the four-playlist limit', async () => {
  for (const used of [0, PLUS_PLAYLIST_LIMIT - 1]) {
    const { nextCalled, nextError } = await runLimitMiddleware(Plan.plus, used);
    assert.equal(nextCalled, true);
    assert.equal(nextError, undefined);
  }
});

test('Plus users are rejected at the limit and above it, including 11 existing playlists', async () => {
  for (const used of [PLUS_PLAYLIST_LIMIT, 11]) {
    const { nextCalled, nextError } = await runLimitMiddleware(Plan.plus, used);
    assert.equal(nextCalled, true);
    assert.equal(nextError.status, 403);
    assert.match(nextError.message, /4 playlists/);
  }
});

test('Premium users bypass the Plus limit even with 11 existing playlists', async () => {
  let countQueried = false;
  Playlist.countDocuments = async () => {
    countQueried = true;
    return 11;
  };

  let nextCalled = false;
  let nextError;
  await enforcePlaylistLimit(
    { user: { _id: 'premium-user-id', plan: Plan.premium } },
    {},
    (error) => {
      nextCalled = true;
      nextError = error;
    }
  );

  assert.equal(nextCalled, true);
  assert.equal(nextError, undefined);
  assert.equal(countQueried, false);
});
