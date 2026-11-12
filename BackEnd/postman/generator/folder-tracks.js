const { req, folder, bearer, statusIs, fieldExists } = require('./helpers');

function buildTracksFolder() {
  return folder('06 - Canciones (Búsqueda en iTunes)', [
    req({
      name: 'Buscar Canciones - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'tracks', 'search'],
      query: [{ key: 'q', value: 'Bohemian Rhapsody' }],
      headers: [bearer('access_token')],
      description: 'Consulta la API gratuita de iTunes Search (sin clave y sin preocupaciones por límites de uso): el requisito de la tarea de un "recurso de terceros relevante para el dominio".',
      tests: [statusIs(200), fieldExists('El arreglo de canciones está presente', '.data.tracks')],
    }),

    req({
      name: 'Buscar Canciones - Falta el Parámetro de Búsqueda (400)',
      method: 'GET',
      path: ['api', 'v1', 'tracks', 'search'],
      headers: [bearer('access_token')],
      tests: [statusIs(400)],
    }),

    req({
      name: 'Buscar Canciones - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'tracks', 'search'],
      query: [{ key: 'q', value: 'Bohemian Rhapsody' }],
      tests: [statusIs(401)],
    }),
  ]);
}

module.exports = buildTracksFolder;
