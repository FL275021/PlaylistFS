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
  return folder('04 - Users', [
    req({
      name: 'Get Usage - Plus Plan At Limit (200)',
      method: 'GET',
      path: ['api', 'v1', 'users', 'me', 'usage'],
      headers: [bearer('access_token')],
      description: 'user1 now owns exactly 4 playlists (see the end of the Playlists folder), so this should read 100% used.',
      tests: [
        statusIs(200),
        fieldEquals('Plan is plus', '.data.plan', 'plus'),
        fieldEquals('Used count is 4', '.data.used', 4),
        fieldEquals('Limit is 4', '.data.limit', 4),
        fieldEquals('Percentage used is 100', '.data.percentageUsed', 100),
      ],
    }),

    req({
      name: 'Get Usage - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'users', 'me', 'usage'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Update Me - Success (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('access_token')],
      body: jsonBody({ username: 'user1updated{{$timestamp}}' }),
      tests: [
        statusIs(200),
        `pm.test("Username was changed", function () {
  pm.expect(pm.response.json().data.user.username).to.not.eql(pm.collectionVariables.get("user1_username"));
});`,
        saveVar('user1_username', '.data.user.username'),
      ],
    }),

    req({
      name: 'Update Me - Validation Error (400)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('access_token')],
      body: jsonBody({ email: 'not-a-valid-email' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Update Me - Conflict Username Taken (409)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('access_token')],
      body: jsonBody({ username: '{{user2_username}}' }),
      tests: [statusIs(409), messageContains('Mentions conflict', 'already in use')],
    }),

    req({
      name: 'Update Me - No Auth (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me'],
      body: jsonBody({ username: 'shouldnotwork' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Upgrade Plan - Success (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me', 'upgrade-plan'],
      headers: [bearer('access_token')],
      description: 'This is the "Cambio de plan al usuario" step from the assignment brief\'s example flow.',
      tests: [statusIs(200), fieldEquals('Plan is now premium', '.data.plan', 'premium')],
    }),

    req({
      name: 'Upgrade Plan - Already Premium (400)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me', 'upgrade-plan'],
      headers: [bearer('access_token')],
      tests: [statusIs(400)],
    }),

    req({
      name: 'Upgrade Plan - No Auth (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'users', 'me', 'upgrade-plan'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Get Usage - Premium Plan (200)',
      method: 'GET',
      path: ['api', 'v1', 'users', 'me', 'usage'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        fieldEquals('Plan is premium', '.data.plan', 'premium'),
        fieldEquals('Limit is null (unlimited)', '.data.limit', null),
        fieldEquals('Percentage used is null', '.data.percentageUsed', null),
      ],
    }),

    req({
      name: 'Get All Users (Admin) - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'users'],
      headers: [bearer('admin_access_token')],
      tests: [
        statusIs(200),
        fieldExists('Users array is present', '.data.users'),
        fieldExists('Pagination metadata is present', '.pagination'),
      ],
    }),

    req({
      name: 'Get All Users (Admin) - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'users'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Get All Users (Admin) - Forbidden Non-Admin (403)',
      method: 'GET',
      path: ['api', 'v1', 'users'],
      headers: [bearer('access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Get User By Id (Admin) - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('admin_access_token')],
      tests: [
        statusIs(200),
        `pm.test("Returned user matches the requested id", function () {
  pm.expect(pm.response.json().data.user.id).to.eql(pm.collectionVariables.get("user3_id"));
});`,
      ],
    }),

    req({
      name: 'Get User By Id (Admin) - Not Found (404)',
      method: 'GET',
      path: ['api', 'v1', 'users', FAKE_ID],
      headers: [bearer('admin_access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Get User By Id (Admin) - Forbidden Non-Admin (403)',
      method: 'GET',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Get User By Id (Admin) - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Delete User (Admin) - Success (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('admin_access_token')],
      tests: [statusIs(204)],
    }),

    req({
      name: 'Delete User (Admin) - Not Found (404)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', '{{user3_id}}'],
      headers: [bearer('admin_access_token')],
      description: 'Same id as above, now already deleted.',
      tests: [statusIs(404)],
    }),

    req({
      name: 'Delete User (Admin) - Forbidden Non-Admin (403)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', FAKE_ID],
      headers: [bearer('access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Delete User (Admin) - No Auth (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', FAKE_ID],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Delete Me (Self) - Success (204)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('user2_access_token')],
      description: 'user2 deletes their own account. Cascades to delete any of their playlists (user2 has none in this flow).',
      tests: [statusIs(204)],
    }),

    req({
      name: 'Delete Me (Self) - Invalid Token After Deletion (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'users', 'me'],
      headers: [bearer('user2_access_token')],
      description: 'Reuses user2\'s now-stale token to specifically exercise the "user belonging to this token no longer exists" path.',
      tests: [statusIs(401), messageContains('Explains the stale token', 'no longer exists')],
    }),
  ]);
}

module.exports = buildUsersFolder;
