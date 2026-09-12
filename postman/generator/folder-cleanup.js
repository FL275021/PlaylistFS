const { req, folder, bearer, statusIs, messageContains } = require('./helpers');

function buildCleanupFolder() {
  return folder('07 - Cleanup & Cross-Resource Checks', [
    req({
      name: 'Delete Genre (Still In Use) - Conflict (409)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_conflict_id}}'],
      headers: [bearer('admin_access_token')],
      description: 'genre_conflict_id is still referenced by conflict_playlist_id (created in the Playlists folder).',
      tests: [statusIs(409), messageContains('Explains it is in use', 'used by')],
    }),

    req({
      name: 'Delete Conflict Playlist - Success (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{conflict_playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(204)],
    }),

    req({
      name: 'Delete Genre (Now Unused) - Success (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_conflict_id}}'],
      headers: [bearer('admin_access_token')],
      description: 'Now that the referencing playlist is gone, the same delete that 409\'d above should succeed.',
      tests: [statusIs(204)],
    }),

    req({
      name: 'Get Genre By Id (Deleted) - Not Found (404)',
      method: 'GET',
      path: ['api', 'v1', 'genres', '{{genre_conflict_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),
  ]);
}

module.exports = buildCleanupFolder;
