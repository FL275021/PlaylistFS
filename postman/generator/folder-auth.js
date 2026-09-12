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
  return folder('01 - Auth', [
    req({
      name: 'Register - Validation Error (400)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({ username: 'ab', email: 'not-an-email', password: 'short' }),
      description: 'Username too short, invalid email, password under 8 chars - all three should be reported.',
      tests: [
        statusIs(400),
        bodyHasStatus('fail'),
        fieldExists('Error message is present', '.message'),
      ],
    }),

    req({
      name: 'Register - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: 'user1{{$timestamp}}',
        email: 'user1{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      description:
        'Creates the primary test user. Saves the token immediately (auto-login) and the resolved username for reuse in later requests.',
      tests: [
        statusIs(201),
        bodyHasStatus('success'),
        fieldExists('Token is present', '.token'),
        fieldExists('User id is present', '.data.user.id'),
        fieldEquals('Role defaults to user', '.data.user.role', 'user'),
        fieldEquals('Plan defaults to plus', '.data.user.plan', 'plus'),
        saveVar('access_token', '.token'),
        saveVar('user1_username', '.data.user.username'),
      ],
    }),

    req({
      name: 'Register - Duplicate Username (409)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: '{{user1_username}}',
        email: 'different{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      tests: [statusIs(409), bodyHasStatus('fail'), messageContains('Mentions the conflict', 'already registered')],
    }),

    req({
      name: 'Login - Validation Error (400)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ password: '{{test_password}}' }),
      description: 'Omits "identifier" entirely to trigger the custom required-field message.',
      tests: [statusIs(400), messageContains('Custom message shown', 'Username or email is required')],
    }),

    req({
      name: 'Login - Invalid Credentials (401)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ identifier: '{{user1_username}}', password: 'WrongPassword999!' }),
      tests: [statusIs(401), messageContains('Generic invalid-credentials message', 'Invalid username/email or password')],
    }),

    req({
      name: 'Login - Success (200)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ identifier: '{{user1_username}}', password: '{{test_password}}' }),
      tests: [
        statusIs(200),
        bodyHasStatus('success'),
        fieldExists('Token is present', '.token'),
        `pm.test("Username matches the registered user", function () {
  pm.expect(pm.response.json().data.user.username).to.eql(pm.collectionVariables.get("user1_username"));
});`,
        saveVar('access_token', '.token'),
      ],
    }),

    req({
      name: 'Get Me - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'auth', 'me'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("Returns the logged-in user's own profile", function () {
  pm.expect(pm.response.json().data.user.username).to.eql(pm.collectionVariables.get("user1_username"));
});`,
        fieldEquals('Plan is plus (not yet upgraded)', '.data.user.plan', 'plus'),
      ],
    }),

    req({
      name: 'Get Me - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'auth', 'me'],
      tests: [statusIs(401), messageContains('Explains missing token', 'not logged in')],
    }),

    req({
      name: 'Register - Second User (for ownership tests) - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: 'user2{{$timestamp}}',
        email: 'user2{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      description: 'A second account used later to prove ownership checks (403) on another user\'s playlists.',
      tests: [
        statusIs(201),
        saveVar('user2_access_token', '.token'),
        saveVar('user2_username', '.data.user.username'),
        saveVar('user2_id', '.data.user.id'),
      ],
    }),

    req({
      name: 'Register - Third User (admin test target) - Success (201)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'register'],
      body: jsonBody({
        username: 'user3{{$timestamp}}',
        email: 'user3{{$timestamp}}@example.com',
        password: '{{test_password}}',
      }),
      description: 'A throwaway account used purely as the target of the admin GET/DELETE-by-id tests.',
      tests: [statusIs(201), saveVar('user3_id', '.data.user.id')],
    }),

    req({
      name: 'Login as Admin - Success (200)',
      method: 'POST',
      path: ['api', 'v1', 'auth', 'login'],
      body: jsonBody({ identifier: '{{admin_username}}', password: '{{admin_password}}' }),
      description:
        'Requires `npm run seed` to have been run against the database this collection points at, and that admin_username/admin_password match your .env ADMIN_USERNAME/ADMIN_PASSWORD.',
      tests: [
        statusIs(200),
        fieldEquals('Role is admin', '.data.user.role', 'admin'),
        saveVar('admin_access_token', '.token'),
      ],
    }),
  ]);
}

module.exports = buildAuthFolder;
