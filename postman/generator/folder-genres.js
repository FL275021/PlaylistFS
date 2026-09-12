const {
  req,
  folder,
  bearer,
  jsonBody,
  statusIs,
  bodyHasStatus,
  saveVar,
  fieldExists,
  fieldEquals,
  messageContains,
} = require('./helpers');

const FAKE_ID = '507f191e810c19729de860ea';

function buildGenresFolder() {
  return folder('02 - Genres', [
    req({
      name: 'Create Genre - Validation Error (400)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: '' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Create Genre - Forbidden Non-Admin (403)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'ShouldNotBeCreated' }),
      tests: [statusIs(403), messageContains('Blocked by role check', 'permission')],
    }),

    req({
      name: 'Create Genre - No Auth (401)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      body: jsonBody({ name: 'ShouldNotBeCreatedEither' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Create Genre - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: 'Pop {{$timestamp}}', description: 'Upbeat mainstream music' }),
      tests: [
        statusIs(201),
        bodyHasStatus('success'),
        fieldExists('Genre id is present', '.data.genre.id'),
        saveVar('genre_id', '.data.genre.id'),
        saveVar('genre_name', '.data.genre.name'),
      ],
    }),

    req({
      name: 'Create Genre - Duplicate Name (409)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: '{{genre_name}}' }),
      tests: [statusIs(409), messageContains('Mentions duplicate', 'already exists')],
    }),

    req({
      name: 'Create Second Genre (for delete-guard test later) - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: 'Rock {{$timestamp}}', description: 'Guitar-driven genre' }),
      description: 'Kept unused for now - assigned to a playlist in the Playlists folder, then used to prove the delete-in-use guard in the Cleanup folder.',
      tests: [statusIs(201), saveVar('genre_conflict_id', '.data.genre.id')],
    }),

    req({
      name: 'Get All Genres - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        fieldExists('Genres array is present', '.data.genres'),
        fieldExists('Pagination metadata is present', '.pagination'),
      ],
    }),

    req({
      name: 'Get All Genres - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'genres'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Get Genre By Id - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("Returned genre matches the requested id", function () {
  pm.expect(pm.response.json().data.genre.id).to.eql(pm.collectionVariables.get("genre_id"));
});`,
      ],
    }),

    req({
      name: 'Get Genre By Id - Not Found (404)',
      method: 'GET',
      path: ['api', 'v1', 'genres', FAKE_ID],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Get Genre By Id - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Update Genre - Success (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ description: 'Updated description via Postman test' }),
      tests: [
        statusIs(200),
        fieldEquals('Description was updated', '.data.genre.description', 'Updated description via Postman test'),
      ],
    }),

    req({
      name: 'Update Genre - Not Found (404)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', FAKE_ID],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ description: 'x' }),
      tests: [statusIs(404)],
    }),

    req({
      name: 'Update Genre - Forbidden Non-Admin (403)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('access_token')],
      body: jsonBody({ description: 'hacked' }),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Update Genre - No Auth (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      body: jsonBody({ description: 'hacked' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Delete Genre - Not Found (404)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', FAKE_ID],
      headers: [bearer('admin_access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Delete Genre - Forbidden Non-Admin (403)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('access_token')],
      description: 'Blocked by the role check before ownership/usage is even considered, so genre_id survives for the Playlists folder.',
      tests: [statusIs(403)],
    }),

    req({
      name: 'Delete Genre - No Auth (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      tests: [statusIs(401)],
    }),
  ]);
}

module.exports = buildGenresFolder;
