const fs = require('fs');
const path = require('path');
const { uuid } = require('./helpers');

const buildAuthFolder = require('./folder-auth');
const buildGenresFolder = require('./folder-genres');
const buildPlaylistsCoreFolder = require('./folder-playlists-core');
const buildUsersFolder = require('./folder-users');
const buildPlaylistsAfterUpgradeFolder = require('./folder-playlists-after-upgrade');
const buildTracksFolder = require('./folder-tracks');
const buildCleanupFolder = require('./folder-cleanup');

const collection = {
  info: {
    _postman_id: uuid(),
    name: 'Music Playlist API - Obligatorio 1',
    description:
      'Full request + test suite for the Music Playlist API (ORT, Desarrollo Full Stack integrado con IA - Obligatorio 1).\n\n' +
      'Run order matters: folders are numbered and must be run top-to-bottom via Collection Runner (or "Run collection") ' +
      'for the collection variables each request depends on to be populated correctly - this mirrors the exact ' +
      'flows described in the assignment brief (invalid registration -> success -> duplicate; 4 playlists on the plus ' +
      'plan -> limit error -> plan upgrade -> 5th playlist succeeds).\n\n' +
      'Before running:\n' +
      '1. Run `npm run seed` against the database prod_base_url points at, so the pre-seeded admin account exists.\n' +
      '2. Set the `prod_base_url` variable (Collection > Variables tab) to your API\'s base URL.\n' +
      '3. Make sure `admin_username` / `admin_password` match your .env ADMIN_USERNAME / ADMIN_PASSWORD.\n' +
      '4. The one request marked [MANUAL] (cover image upload success case) needs a file attached by hand in the Postman UI - ' +
      'Postman collections cannot embed real file bytes portably, so this one can\'t run unattended.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [
    buildAuthFolder(),
    buildGenresFolder(),
    buildPlaylistsCoreFolder(),
    buildUsersFolder(),
    buildPlaylistsAfterUpgradeFolder(),
    buildTracksFolder(),
    buildCleanupFolder(),
  ],
  variable: [
    {
      key: 'prod_base_url',
      value: 'https://your-app-name.vercel.app',
      type: 'string',
      description:
        'Base URL of the deployed API (per assignment spec, documentation defaults to the remote URL). ' +
        'For local development, temporarily change this to http://localhost:4000 in the Variables tab, then change it back before final submission.',
    },
    {
      key: 'test_password',
      value: 'Password123!',
      type: 'string',
      description: 'Password used for every test-created user account.',
    },
    {
      key: 'admin_username',
      value: 'admin',
      type: 'string',
      description: 'Must match ADMIN_USERNAME in the API\'s .env (used by npm run seed).',
    },
    {
      key: 'admin_password',
      value: 'ChangeMe123!',
      type: 'string',
      description: 'Must match ADMIN_PASSWORD in the API\'s .env (used by npm run seed).',
    },
    { key: 'access_token', value: '', type: 'string' },
    { key: 'user1_username', value: '', type: 'string' },
    { key: 'user2_access_token', value: '', type: 'string' },
    { key: 'user2_username', value: '', type: 'string' },
    { key: 'user2_id', value: '', type: 'string' },
    { key: 'user3_id', value: '', type: 'string' },
    { key: 'admin_access_token', value: '', type: 'string' },
    { key: 'genre_id', value: '', type: 'string' },
    { key: 'genre_name', value: '', type: 'string' },
    { key: 'genre_conflict_id', value: '', type: 'string' },
    { key: 'playlist_id', value: '', type: 'string' },
    { key: 'conflict_playlist_id', value: '', type: 'string' },
    { key: 'track_id', value: '', type: 'string' },
  ],
};

const outPath = path.join(__dirname, 'music-playlist-api.postman_collection.json');
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2));
console.log(`Wrote ${outPath}`);

// --- basic structural validation ---
let totalRequests = 0;
const names = new Set();
let duplicateNames = [];

for (const f of collection.item) {
  for (const r of f.item) {
    totalRequests += 1;
    if (names.has(r.name)) duplicateNames.push(r.name);
    names.add(r.name);
  }
}

console.log(`Folders: ${collection.item.length}`);
console.log(`Total requests: ${totalRequests}`);
console.log(`Duplicate request names: ${duplicateNames.length ? duplicateNames.join(', ') : 'none'}`);

// Check every {{variable}} referenced in urls/bodies/headers is declared at collection level
const declaredVars = new Set(collection.variable.map((v) => v.key));
declaredVars.add('$timestamp'); // Postman dynamic variable, not declared by us

const varPattern = /{{\s*([a-zA-Z0-9_$]+)\s*}}/g;
const usedVars = new Set();

function scan(obj) {
  if (typeof obj === 'string') {
    let m;
    while ((m = varPattern.exec(obj))) usedVars.add(m[1]);
  } else if (Array.isArray(obj)) {
    obj.forEach(scan);
  } else if (obj && typeof obj === 'object') {
    Object.values(obj).forEach(scan);
  }
}
scan(collection.item);

const undeclared = [...usedVars].filter((v) => !declaredVars.has(v));
console.log(`Undeclared variables referenced: ${undeclared.length ? undeclared.join(', ') : 'none'}`);

const unused = [...declaredVars].filter((v) => v !== '$timestamp' && !usedVars.has(v));
console.log(`Declared but never used: ${unused.length ? unused.join(', ') : 'none'}`);
