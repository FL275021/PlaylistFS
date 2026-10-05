import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import test from 'node:test';
import { createPlaylist, getPlaylist } from '../src/controllers/playlistController.js';
import Genre from '../src/models/Genre.js';
import Playlist from '../src/models/Playlist.js';

const originalGenreFindById = Genre.findById;
const originalPlaylistCreate = Playlist.create;
const originalPlaylistFindById = Playlist.findById;

test.afterEach(() => {
  Genre.findById = originalGenreFindById;
  Playlist.create = originalPlaylistCreate;
  Playlist.findById = originalPlaylistFindById;
});

test('Mongoose records Genre and User references but does not check referenced documents on validation', async () => {
  assert.equal(Playlist.schema.path('genre').options.ref, 'Genre');
  assert.equal(Playlist.schema.path('owner').options.ref, 'User');

  const playlist = new Playlist({
    name: 'Reference behavior',
    genre: new mongoose.Types.ObjectId(),
    owner: new mongoose.Types.ObjectId(),
  });

  await assert.doesNotReject(playlist.validate());
});

test('Playlist creation rejects a missing Genre before attempting to save', async () => {
  Genre.findById = async () => null;
  let createCalled = false;
  Playlist.create = async () => {
    createCalled = true;
  };

  let nextError;
  await createPlaylist(
    {
      body: { name: 'Missing genre', genre: '507f1f77bcf86cd799439011' },
      user: { _id: 'test-user-id' },
    },
    {},
    (error) => {
      nextError = error;
    }
  );

  assert.equal(nextError.status, 404);
  assert.match(nextError.message, /Género no encontrado/);
  assert.equal(createCalled, false);
});

test('Fetching a playlist populates its Genre name', async () => {
  const populateCalls = [];
  const playlist = {
    owner: 'test-user-id',
    async populate(path, fields) {
      populateCalls.push([path, fields]);
      this.genre = { name: 'Jazz' };
      return this;
    },
  };
  Playlist.findById = async () => playlist;

  let responseBody;
  const response = {
    status(statusCode) {
      assert.equal(statusCode, 200);
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  };

  await getPlaylist(
    { params: { id: 'test-playlist-id' }, user: { _id: 'test-user-id' } },
    response,
    (error) => {
      throw error;
    }
  );

  assert.deepEqual(populateCalls, [['genre', 'name']]);
  assert.equal(responseBody.data.playlist.genre.name, 'Jazz');
});
