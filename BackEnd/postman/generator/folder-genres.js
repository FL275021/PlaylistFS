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
  return folder('02 - Géneros', [
    req({
      name: 'Crear Género - Error de Validación (400)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: '' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Crear Género - Prohibido para No Admin (403)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'ShouldNotBeCreated' }),
      tests: [statusIs(403), messageContains('Bloqueado por la verificación de rol', 'permission')],
    }),

    req({
      name: 'Crear Género - Sin Autenticación (401)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      body: jsonBody({ name: 'ShouldNotBeCreatedEither' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Crear Género - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: 'Pop {{$timestamp}}', description: 'Upbeat mainstream music' }),
      tests: [
        statusIs(201),
        bodyHasStatus('success'),
        fieldExists('El id del género está presente', '.data.genre.id'),
        saveVar('genre_id', '.data.genre.id'),
        saveVar('genre_name', '.data.genre.name'),
      ],
    }),

    req({
      name: 'Crear Género - Nombre Duplicado (409)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: '{{genre_name}}' }),
      tests: [statusIs(409), messageContains('Menciona el duplicado', 'already exists')],
    }),

    req({
      name: 'Crear Segundo Género (para la prueba de protección al eliminar) - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ name: 'Rock {{$timestamp}}', description: 'Guitar-driven genre' }),
      description: 'Se deja sin usar por ahora: se asigna a una playlist en la carpeta de Playlists y luego se usa para probar la protección contra eliminar un género en uso, en la carpeta de Limpieza.',
      tests: [statusIs(201), saveVar('genre_conflict_id', '.data.genre.id')],
    }),

    req({
      name: 'Obtener Todos los Géneros - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'genres'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        fieldExists('El arreglo de géneros está presente', '.data.genres'),
        fieldExists('Los metadatos de paginación están presentes', '.pagination'),
      ],
    }),

    req({
      name: 'Obtener Todos los Géneros - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'genres'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Obtener Género por Id - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("El género devuelto coincide con el id solicitado", function () {
  pm.expect(pm.response.json().data.genre.id).to.eql(pm.collectionVariables.get("genre_id"));
});`,
      ],
    }),

    req({
      name: 'Obtener Género por Id - No Encontrado (404)',
      method: 'GET',
      path: ['api', 'v1', 'genres', FAKE_ID],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Obtener Género por Id - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Actualizar Género - Éxito (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ description: 'Updated description via Postman test' }),
      tests: [
        statusIs(200),
        fieldEquals('La descripción fue actualizada', '.data.genre.description', 'Updated description via Postman test'),
      ],
    }),

    req({
      name: 'Actualizar Género - No Encontrado (404)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', FAKE_ID],
      headers: [bearer('admin_access_token')],
      body: jsonBody({ description: 'x' }),
      tests: [statusIs(404)],
    }),

    req({
      name: 'Actualizar Género - Prohibido para No Admin (403)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('access_token')],
      body: jsonBody({ description: 'hacked' }),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Actualizar Género - Sin Autenticación (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      body: jsonBody({ description: 'hacked' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Eliminar Género - No Encontrado (404)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', FAKE_ID],
      headers: [bearer('admin_access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Eliminar Género - Prohibido para No Admin (403)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      headers: [bearer('access_token')],
      description: 'Bloqueado por la verificación de rol antes de considerar siquiera la propiedad o el uso, por lo que genre_id sobrevive para la carpeta de Playlists.',
      tests: [statusIs(403)],
    }),

    req({
      name: 'Eliminar Género - Sin Autenticación (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'genres', '{{genre_id}}'],
      tests: [statusIs(401)],
    }),
  ]);
}

module.exports = buildGenresFolder;
