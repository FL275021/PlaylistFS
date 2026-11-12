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
    name: 'Music Playlist',
    description:
      ' La única solicitud marcada como [MANUAL] (caso de éxito de la subida de imagen de portada) necesita que se adjunte un archivo a mano en la interfaz de Postman - ' +
      'las colecciones de Postman no pueden incrustar los bytes reales de un archivo de forma portable, por lo que esta no puede ejecutarse de forma desatendida.',
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
        'URL base de la API desplegada (según el enunciado, la documentación usa por defecto la URL remota). ' +
        'Para desarrollo local, cámbiala temporalmente a http://localhost:4000 en la pestaña Variables y luego vuelve a ponerla antes de la entrega final.',
    },
    {
      key: 'test_password',
      value: 'Password123!',
      type: 'string',
      description: 'Contraseña usada para todas las cuentas de usuario creadas en las pruebas.',
    },
    {
      key: 'admin_username',
      value: 'admin',
      type: 'string',
      description: 'Debe coincidir con ADMIN_USERNAME en el .env de la API (usado por npm run seed).',
    },
    {
      key: 'admin_password',
      value: 'Jamaica,123',
      type: 'string',
      description: 'Debe coincidir con ADMIN_PASSWORD en el .env de la API (usado por npm run seed).',
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
