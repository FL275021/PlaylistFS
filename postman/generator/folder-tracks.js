const { req, folder, bearer, statusIs, fieldExists } = require('./helpers');

function buildTracksFolder() {
  return folder('06 - Tracks (iTunes Search)', [
    req({
      name: 'Search Tracks - Success (200)',
      method: 'GET',
      path: ['api', 'v1', 'tracks', 'search'],
      query: [{ key: 'q', value: 'Bohemian Rhapsody' }],
      headers: [bearer('access_token')],
      description: 'Hits the free iTunes Search API (no key, no rate-limit concerns) - the assignment\'s "third-party resource relevant to the domain" requirement.',
      tests: [statusIs(200), fieldExists('Tracks array is present', '.data.tracks')],
    }),

    req({
      name: 'Search Tracks - Missing Query (400)',
      method: 'GET',
      path: ['api', 'v1', 'tracks', 'search'],
      headers: [bearer('access_token')],
      tests: [statusIs(400)],
    }),

    req({
      name: 'Search Tracks - No Auth (401)',
      method: 'GET',
      path: ['api', 'v1', 'tracks', 'search'],
      query: [{ key: 'q', value: 'Bohemian Rhapsody' }],
      tests: [statusIs(401)],
    }),
  ]);
}

module.exports = buildTracksFolder;
