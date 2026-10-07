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

function buildAuthFolder() {
  return folder('01 - Autenticación', [
    req({
      name: 'Registro - Error de Validación (400)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({ username: 'ab', email: 'not-an-email', password: 'short' }),
      description: 'Nombre de usuario demasiado corto, email inválido y contraseña de menos de 8 caracteres: los tres errores deben reportarse.',
      tests: [
        statusIs(400),
        bodyHasStatus('fail'),
        fieldExists('El mensaje de error está presente', '.message'),
      ],
    }),

    req({
      name: 'Registro - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: 'user1{{$timestamp}}',
        email: 'user1{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      description:
        'Crea el usuario de prueba principal. Guarda el token de inmediato (inicio de sesión automático) y el nombre de usuario resultante para reutilizarlo en las solicitudes posteriores.',
      tests: [
        statusIs(201),
        bodyHasStatus('success'),
        fieldExists('El token está presente', '.token'),
        fieldExists('El id del usuario está presente', '.data.user.id'),
        fieldEquals('El rol por defecto es user', '.data.user.role', 'user'),
        fieldEquals('El plan por defecto es plus', '.data.user.plan', 'plus'),
        saveVar('access_token', '.token'),
        saveVar('user1_username', '.data.user.username'),
      ],
    }),

    req({
      name: 'Registro - Nombre de Usuario Duplicado (409)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: '{{user1_username}}',
        email: 'different{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      tests: [statusIs(409), bodyHasStatus('fail'), messageContains('Menciona el conflicto', 'already registered')],
    }),

    req({
      name: 'Inicio de Sesión - Error de Validación (400)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ password: '{{test_password}}' }),
      description: 'Omite por completo "identifier" para provocar el mensaje personalizado de campo obligatorio.',
      tests: [statusIs(400), messageContains('Se muestra el mensaje personalizado', 'Username or email is required')],
    }),

    req({
      name: 'Inicio de Sesión - Credenciales Inválidas (401)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ identifier: '{{user1_username}}', password: 'WrongPassword999!' }),
      tests: [statusIs(401), messageContains('Mensaje genérico de credenciales inválidas', 'Invalid username/email or password')],
    }),

    req({
      name: 'Inicio de Sesión - Éxito (200)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ identifier: '{{user1_username}}', password: '{{test_password}}' }),
      tests: [
        statusIs(200),
        bodyHasStatus('success'),
        fieldExists('El token está presente', '.token'),
        `pm.test("El nombre de usuario coincide con el usuario registrado", function () {
  pm.expect(pm.response.json().data.user.username).to.eql(pm.collectionVariables.get("user1_username"));
});`,
        saveVar('access_token', '.token'),
      ],
    }),

    req({
      name: 'Obtener Mi Perfil - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'auth', 'me'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("Devuelve el perfil propio del usuario autenticado", function () {
  pm.expect(pm.response.json().data.user.username).to.eql(pm.collectionVariables.get("user1_username"));
});`,
        fieldEquals('El plan es plus (aún sin mejorar)', '.data.user.plan', 'plus'),
      ],
    }),

    req({
      name: 'Obtener Mi Perfil - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'auth', 'me'],
      tests: [statusIs(401), messageContains('Explica que falta el token', 'not logged in')],
    }),

    req({
      name: 'Registro - Segundo Usuario (para pruebas de propiedad) - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: 'user2{{$timestamp}}',
        email: 'user2{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      description: 'Una segunda cuenta que se usa más adelante para probar las verificaciones de propiedad (403) sobre las playlists de otro usuario.',
      tests: [
        statusIs(201),
        saveVar('user2_access_token', '.token'),
        saveVar('user2_username', '.data.user.username'),
        saveVar('user2_id', '.data.user.id'),
      ],
    }),

    req({
      name: 'Registro - Tercer Usuario (objetivo de pruebas de admin) - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: 'user3{{$timestamp}}',
        email: 'user3{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      description: 'Una cuenta desechable usada únicamente como objetivo de las pruebas de admin para obtener/eliminar por id.',
      tests: [statusIs(201), saveVar('user3_id', '.data.user.id')],
    }),

    req({
      name: 'Inicio de Sesión como Admin - Éxito (200)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ identifier: '{{admin_username}}', password: '{{admin_password}}' }),
      description:
        'Requiere haber ejecutado `npm run seed` contra la base de datos a la que apunta esta colección, y que admin_username/admin_password coincidan con ADMIN_USERNAME/ADMIN_PASSWORD de tu .env.',
      tests: [
        statusIs(200),
        fieldEquals('El rol es admin', '.data.user.role', 'admin'),
        saveVar('admin_access_token', '.token'),
      ],
    }),
  ]);
}

module.exports = buildAuthFolder;
