const {
  req,
  folder,
  bearer,
  jsonBody,
  formDataBody,
  statusIs,
  bodyHasStatus,
  saveVar,
  fieldExists,
  fieldEquals,
  messageContains,
} = require('./helpers');

const FAKE_ID = '507f191e810c19729de860ea';

function buildPlaylistsCoreFolder() {
  return folder('03 - Playlists (Core)', [
    req({
      name: 'Create Playlist - Validation Error (400)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ description: 'Missing both name and genre' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Create Playlist - Genre Not Found (404)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Road Trip Mix', genre: FAKE_ID }),
      tests: [statusIs(404)],
    }),

    req({
      name: 'Create Playlist - No Auth (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      body: jsonBody({ name: 'Road Trip Mix', genre: FAKE_ID }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Create Playlist - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Road Trip Mix', description: 'Songs for a long drive', genre: '{{genre_id}}' }),
      description: 'Playlist #1 for this plus-plan user (1 of 4 allowed).',
      tests: [
        statusIs(201),
        bodyHasStatus('success'),
        fieldExists('Playlist id is present', '.data.playlist.id'),
        fieldEquals('isPublic defaults to true', '.data.playlist.isPublic', true),
        saveVar('playlist_id', '.data.playlist.id'),
      ],
    }),

    req({
      name: 'Get All Playlists - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        fieldExists('Pagination metadata is present', '.pagination'),
        `pm.test("List includes the created playlist", function () {
  const ids = pm.response.json().data.playlists.map((p) => p.id);
  pm.expect(ids).to.include(pm.collectionVariables.get("playlist_id"));
});`,
      ],
    }),

    req({
      name: 'Get All Playlists - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'playlists'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Get All Playlists - Filtered By Genre - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'playlists'],
      query: [{ key: 'genre', value: '{{genre_id}}' }],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("Every result matches the requested genre", function () {
  const genreId = pm.collectionVariables.get("genre_id");
  const playlists = pm.response.json().data.playlists;
  playlists.forEach((p) => pm.expect(p.genre.id).to.eql(genreId));
});`,
      ],
    }),

    req({
      name: 'Get Playlist By Id - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(200), fieldEquals('Name matches what was created', '.data.playlist.name', 'Road Trip Mix')],
    }),

    req({
      name: 'Get Playlist By Id - Not Found (404)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', FAKE_ID],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Get Playlist By Id - Forbidden Not Owner (403)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('user2_access_token')],
      description: 'user2 trying to read a playlist owned by user1.',
      tests: [statusIs(403)],
    }),

    req({
      name: 'Get Playlist By Id - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Update Playlist - Success (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Road Trip Mix (Updated)', description: 'Updated via Postman' }),
      tests: [statusIs(200), fieldEquals('Name was updated', '.data.playlist.name', 'Road Trip Mix (Updated)')],
    }),

    req({
      name: 'Update Playlist - Validation Error (400)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      body: jsonBody({ genre: 'not-a-valid-object-id' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Update Playlist - Not Owner (403)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('user2_access_token')],
      body: jsonBody({ name: 'Hijacked' }),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Update Playlist - No Auth (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      body: jsonBody({ name: 'Hijacked' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Add Track - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      headers: [bearer('access_token')],
      body: jsonBody({ title: 'Highway to Hell', artist: 'AC/DC', album: 'Highway to Hell', durationMs: 208000 }),
      tests: [
        statusIs(201),
        `const tracks = pm.response.json().data.playlist.tracks;
const last = tracks[tracks.length - 1];
pm.test("Track was appended with the right title", function () {
  pm.expect(last.title).to.eql("Highway to Hell");
});
pm.collectionVariables.set("track_id", last.id);`,
      ],
    }),

    req({
      name: 'Add Track - Validation Error (400)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      headers: [bearer('access_token')],
      body: jsonBody({ title: 'No Artist Provided' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Add Track - Not Owner (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      headers: [bearer('user2_access_token')],
      body: jsonBody({ title: 'Intruder', artist: 'Nobody' }),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Add Track - No Auth (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      body: jsonBody({ title: 'Intruder', artist: 'Nobody' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Upload Cover Image - No File (400)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      headers: [bearer('access_token')],
      body: formDataBody([]),
      tests: [statusIs(400), messageContains('Explains no file was sent', 'No image file')],
    }),

    req({
      name: 'Upload Cover Image - Not Owner (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      headers: [bearer('user2_access_token')],
      body: formDataBody([]),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Upload Cover Image - No Auth (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      body: formDataBody([]),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Upload Cover Image - Success (200) [MANUAL: attach an image file]',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      headers: [bearer('access_token')],
      body: formDataBody([{ key: 'image', type: 'file', src: [] }]),
      description:
        'File uploads cannot be embedded in an exported Postman collection. Before running this one request manually, click the "image" field and select any local image file, then Send. Requires valid Cloudinary credentials in the API\'s .env.',
      tests: [
        statusIs(200),
        fieldExists('Cover image URL was set', '.data.playlist.coverImageUrl'),
      ],
    }),

    req({
      name: 'Generate Vibe - Success (200)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'generate-vibe'],
      headers: [bearer('access_token')],
      description:
        'Works even without an ANTHROPIC_API_KEY configured - falls back to a default description, so this should always return 200.',
      tests: [
        statusIs(200),
        fieldExists('AI vibe summary is present', '.data.aiVibeSummary'),
        `pm.test("generatedByAI is a boolean", function () {
  pm.expect(pm.response.json().data.generatedByAI).to.be.a("boolean");
});`,
      ],
    }),

    req({
      name: 'Generate Vibe - Not Owner (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'generate-vibe'],
      headers: [bearer('user2_access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Generate Vibe - No Auth (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'generate-vibe'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Remove Track - Success (200)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks', '{{track_id}}'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("Track no longer appears in the playlist", function () {
  const removedId = pm.collectionVariables.get("track_id");
  const ids = pm.response.json().data.playlist.tracks.map((t) => t.id);
  pm.expect(ids).to.not.include(removedId);
});`,
      ],
    }),

    req({
      name: 'Remove Track - Not Owner (403)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks', '{{track_id}}'],
      headers: [bearer('user2_access_token')],
      description: 'Ownership is checked before track lookup, so this 403s even though the track was already removed above.',
      tests: [statusIs(403)],
    }),

    req({
      name: 'Remove Track - No Auth (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks', '{{track_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Create Playlist 2 (conflict-genre fixture) - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Rock Essentials', genre: '{{genre_conflict_id}}' }),
      description: 'Playlist #2 of 4. Deliberately tagged with genre_conflict_id so the Cleanup folder can prove the delete-in-use guard.',
      tests: [statusIs(201), saveVar('conflict_playlist_id', '.data.playlist.id')],
    }),

    req({
      name: 'Create Playlist 3 - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Chill Study Session', genre: '{{genre_id}}' }),
      description: 'Playlist #3 of 4.',
      tests: [statusIs(201)],
    }),

    req({
      name: 'Create Playlist 4 - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Late Night Vibes', genre: '{{genre_id}}' }),
      description: 'Playlist #4 of 4 - the plus-plan cap is now reached.',
      tests: [statusIs(201)],
    }),

    req({
      name: 'Create Playlist 5 - Limit Reached (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'One Too Many', genre: '{{genre_id}}' }),
      description: 'This is the "Ingreso de 5 documentos en plan plus -> Error en el documento 5 por límite" case from the assignment brief.',
      tests: [statusIs(403), messageContains('Explains the plan limit', 'limited to')],
    }),
  ]);
}

module.exports = buildPlaylistsCoreFolder;
