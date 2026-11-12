const { req, folder, bearer, jsonBody, statusIs, saveVar, messageContains } = require('./helpers');

function buildPlaylistsAfterUpgradeFolder() {
  return folder('05 - Playlists (Después de la Mejora)', [
    req({
      name: 'Crear 5ta Playlist - Éxito Tras la Mejora (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'One Too Many (Retry)', genre: '{{genre_id}}' }),
      description: 'Este es el paso "Cambio de plan al usuario -> Agrego documento 5" del flujo de ejemplo del enunciado de la tarea.',
      tests: [statusIs(201)],
    }),

    req({
      name: 'Eliminar Playlist (Principal) - Éxito (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(204)],
    }),

    req({
      name: 'Obtener Playlist por Id (Eliminada) - No Encontrada (404)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),
  ]);
}

module.exports = buildPlaylistsAfterUpgradeFolder;
