const { req, folder, bearer, statusIs, messageContains } = require('./helpers');

function buildCleanupFolder() {
  return folder('07 - Limpieza y Verificaciones entre Recursos', [
    req({
      name: 'Eliminar Género (Aún en Uso) - Conflicto (409)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_conflict_id}}'],
      headers: [bearer('admin_access_token')],
      description: 'genre_conflict_id sigue estando referenciado por conflict_playlist_id (creada en la carpeta de Playlists).',
      tests: [statusIs(409), messageContains('Explica que está en uso', 'used by')],
    }),

    req({
      name: 'Eliminar Playlist en Conflicto - Éxito (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{conflict_playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(204)],
    }),

    req({
      name: 'Eliminar Género (Ya Sin Uso) - Éxito (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_conflict_id}}'],
      headers: [bearer('admin_access_token')],
      description: 'Ahora que la playlist que lo referenciaba ya no existe, la misma eliminación que devolvió 409 antes debería funcionar.',
      tests: [statusIs(204)],
    }),

    req({
      name: 'Obtener Género por Id (Eliminado) - No Encontrado (404)',
      method: 'GET',
      path: ['api', 'v1', 'genres', '{{genre_conflict_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),
  ]);
}

module.exports = buildCleanupFolder;
