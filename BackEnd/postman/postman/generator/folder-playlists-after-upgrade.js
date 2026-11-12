const { req, folder, bearer, jsonBody, statusIs, saveVar, messageContains } = require('./helpers');

function buildPlaylistsAfterUpgradeFolder() {
  return folder('05 - Playlists (After Upgrade)', [
    req({
      name: 'Create 5th Playlist - Success After Upgrade (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'One Too Many (Retry)', genre: '{{genre_id}}' }),
      description: 'This is the "Cambio de plan al usuario -> Agrego documento 5" step from the assignment brief\'s example flow.',
      tests: [statusIs(201)],
    }),

    req({
      name: 'Delete Playlist (Main) - Success (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(204)],
    }),

    req({
      name: 'Get Playlist By Id (Deleted) - Not Found (404)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),
  ]);
}

module.exports = buildPlaylistsAfterUpgradeFolder;
