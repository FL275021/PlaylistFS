const {
  req,
  folder,
  bearer,
  jsonBody,
  statusIs,
  saveVar,
  fieldExists,
  fieldEquals,
  messageContains,
} = require('./helpers');

const FAKE_ID = '507f191e810c19729de860ea';

function buildUsersFolder() {
  return folder('04 - Usuarios', [
    req({
      name: 'Obtener Uso - Plan Plus en el Límite (200)',
      method: 'GET',
      path: ['api', 'v1', 'users', 'me', 'usage'],
      headers: [bearer('access_token')],
      description: 'user1 ahora posee exactamente 4 playlists (ver el final de la carpeta de Playlists), por lo que debería mostrar 100% de uso.',
      tests: [
        statusIs(200),
        fieldEquals('El plan es plus', '.data.plan', 'plus'),
        fieldEquals('La cantidad usada es 4', '.data.used', 4),
        fieldEquals('El límite es 4', '.data.limit', 4),
        fieldEquals('El porcentaje usado es 100', '.data.percentageUsed', 100),
      ],
    }),

    req({
      name: 'Obtener Uso - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'users', 'me', 'usage'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Actualizar Mi Perfil - Éxito (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('access_token')],
      body: jsonBody({ username: 'user1updated{{$timestamp}}' }),
      tests: [
        statusIs(200),
        `pm.test("El nombre de usuario fue modificado", function () {
  pm.expect(pm.response.json().data.user.username).to.not.eql(pm.collectionVariables.get("user1_username"));
});`,
        saveVar('user1_username', '.data.user.username'),
      ],
    }),

    req({
      name: 'Actualizar Mi Perfil - Error de Validación (400)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('access_token')],
      body: jsonBody({ email: 'not-a-valid-email' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Actualizar Mi Perfil - Conflicto, Nombre de Usuario en Uso (409)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('access_token')],
      body: jsonBody({ username: '{{user2_username}}' }),
      tests: [statusIs(409), messageContains('Menciona el conflicto', 'already in use')],
    }),

    req({
      name: 'Actualizar Mi Perfil - Sin Autenticación (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      body: jsonBody({ username: 'shouldnotwork' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Mejorar Plan - Éxito (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me', 'upgrade-plan'],
      headers: [bearer('access_token')],
      description: 'Este es el paso "Cambio de plan al usuario" del flujo de ejemplo del enunciado de la tarea.',
      tests: [statusIs(200), fieldEquals('El plan ahora es premium', '.data.plan', 'premium')],
    }),

    req({
      name: 'Mejorar Plan - Ya es Premium (400)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me', 'upgrade-plan'],
      headers: [bearer('access_token')],
      tests: [statusIs(400)],
    }),

    req({
      name: 'Mejorar Plan - Sin Autenticación (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me', 'upgrade-plan'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Obtener Uso - Plan Premium (200)',
      method: 'GET',
      path: ['api', 'v1', 'users', 'me', 'usage'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        fieldEquals('El plan es premium', '.data.plan', 'premium'),
        fieldEquals('El límite es null (ilimitado)', '.data.limit', null),
        fieldEquals('El porcentaje usado es null', '.data.percentageUsed', null),
      ],
    }),

    req({
      name: 'Obtener Todos los Usuarios (Admin) - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'users'],
      headers: [bearer('admin_access_token')],
      tests: [
        statusIs(200),
        fieldExists('El arreglo de usuarios está presente', '.data.users'),
        fieldExists('Los metadatos de paginación están presentes', '.pagination'),
      ],
    }),

    req({
      name: 'Obtener Todos los Usuarios (Admin) - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'users'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Obtener Todos los Usuarios (Admin) - Prohibido para No Admin (403)',
      method: 'GET',
      path: ['api', 'v1', 'users'],
      headers: [bearer('access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Obtener Usuario por Id (Admin) - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('admin_access_token')],
      tests: [
        statusIs(200),
        `pm.test("El usuario devuelto coincide con el id solicitado", function () {
  pm.expect(pm.response.json().data.user.id).to.eql(pm.collectionVariables.get("user3_id"));
});`,
      ],
    }),

    req({
      name: 'Obtener Usuario por Id (Admin) - No Encontrado (404)',
      method: 'GET',
      path: ['api', 'v1', 'users', FAKE_ID],
      headers: [bearer('admin_access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Obtener Usuario por Id (Admin) - Prohibido para No Admin (403)',
      method: 'GET',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Obtener Usuario por Id (Admin) - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Eliminar Usuario (Admin) - Éxito (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('admin_access_token')],
      tests: [statusIs(204)],
    }),

    req({
      name: 'Eliminar Usuario (Admin) - No Encontrado (404)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('admin_access_token')],
      description: 'El mismo id de arriba, que ahora ya fue eliminado.',
      tests: [statusIs(404)],
    }),

    req({
      name: 'Eliminar Usuario (Admin) - Prohibido para No Admin (403)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', FAKE_ID],
      headers: [bearer('access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Eliminar Usuario (Admin) - Sin Autenticación (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', FAKE_ID],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Eliminar Mi Cuenta (Propia) - Éxito (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('user2_access_token')],
      description: 'user2 elimina su propia cuenta. Se eliminan en cascada todas sus playlists (user2 no tiene ninguna en este flujo).',
      tests: [statusIs(204)],
    }),

    req({
      name: 'Eliminar Mi Cuenta (Propia) - Token Inválido Tras la Eliminación (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('user2_access_token')],
      description: 'Reutiliza el token ya obsoleto de user2 para ejercitar específicamente el caso "el usuario al que pertenece este token ya no existe".',
      tests: [statusIs(401), messageContains('Explica el token obsoleto', 'no longer exists')],
    }),
  ]);
}

module.exports = buildUsersFolder;
