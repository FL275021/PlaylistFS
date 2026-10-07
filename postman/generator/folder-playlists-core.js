const {
  req,
  folder,
  bearer,
  jsonBody,
  formDataBody,
  statusIs,
  bodyHasStatus,
  saveVar,
  fieldExists,
  fieldEquals,
  messageContains,
} = require('./helpers');

const FAKE_ID = '507f191e810c19729de860ea';

function buildPlaylistsCoreFolder() {
  return folder('03 - Playlists (Núcleo)', [
    req({
      name: 'Crear Playlist - Error de Validación (400)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ description: 'Missing both name and genre' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Crear Playlist - Género No Encontrado (404)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Road Trip Mix', genre: FAKE_ID }),
      tests: [statusIs(404)],
    }),

    req({
      name: 'Crear Playlist - Sin Autenticación (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      body: jsonBody({ name: 'Road Trip Mix', genre: FAKE_ID }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Crear Playlist - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Road Trip Mix', description: 'Songs for a long drive', genre: '{{genre_id}}' }),
      description: 'Playlist #1 de este usuario con plan plus (1 de 4 permitidas).',
      tests: [
        statusIs(201),
        bodyHasStatus('success'),
        fieldExists('El id de la playlist está presente', '.data.playlist.id'),
        fieldEquals('isPublic es true por defecto', '.data.playlist.isPublic', true),
        saveVar('playlist_id', '.data.playlist.id'),
      ],
    }),

    req({
      name: 'Obtener Todas las Playlists - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        fieldExists('Los metadatos de paginación están presentes', '.pagination'),
        `pm.test("La lista incluye la playlist creada", function () {
  const ids = pm.response.json().data.playlists.map((p) => p.id);
  pm.expect(ids).to.include(pm.collectionVariables.get("playlist_id"));
});`,
      ],
    }),

    req({
      name: 'Obtener Todas las Playlists - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'playlists'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Obtener Todas las Playlists - Filtradas por Género - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'playlists'],
      query: [{ key: 'genre', value: '{{genre_id}}' }],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("Todos los resultados coinciden con el género solicitado", function () {
  const genreId = pm.collectionVariables.get("genre_id");
  const playlists = pm.response.json().data.playlists;
  playlists.forEach((p) => pm.expect(p.genre.id).to.eql(genreId));
});`,
      ],
    }),

    req({
      name: 'Obtener Playlist por Id - Éxito (200)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      tests: [statusIs(200), fieldEquals('El nombre coincide con el creado', '.data.playlist.name', 'Road Trip Mix')],
    }),

    req({
      name: 'Obtener Playlist por Id - No Encontrada (404)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', FAKE_ID],
      headers: [bearer('access_token')],
      tests: [statusIs(404)],
    }),

    req({
      name: 'Obtener Playlist por Id - Prohibido, No es el Propietario (403)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('user2_access_token')],
      description: 'user2 intenta leer una playlist que pertenece a user1.',
      tests: [statusIs(403)],
    }),

    req({
      name: 'Obtener Playlist por Id - Sin Autenticación (401)',
      method: 'GET',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Actualizar Playlist - Éxito (200)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Road Trip Mix (Updated)', description: 'Updated via Postman' }),
      tests: [statusIs(200), fieldEquals('El nombre fue actualizado', '.data.playlist.name', 'Road Trip Mix (Updated)')],
    }),

    req({
      name: 'Actualizar Playlist - Error de Validación (400)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('access_token')],
      body: jsonBody({ genre: 'not-a-valid-object-id' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Actualizar Playlist - No es el Propietario (403)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      headers: [bearer('user2_access_token')],
      body: jsonBody({ name: 'Hijacked' }),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Actualizar Playlist - Sin Autenticación (401)',
      method: 'PATCH',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}'],
      body: jsonBody({ name: 'Hijacked' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Agregar Canción - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      headers: [bearer('access_token')],
      body: jsonBody({ title: 'Highway to Hell', artist: 'AC/DC', album: 'Highway to Hell', durationMs: 208000 }),
      tests: [
        statusIs(201),
        `const tracks = pm.response.json().data.playlist.tracks;
const last = tracks[tracks.length - 1];
pm.test("La canción se agregó al final con el título correcto", function () {
  pm.expect(last.title).to.eql("Highway to Hell");
});
pm.collectionVariables.set("track_id", last.id);`,
      ],
    }),

    req({
      name: 'Agregar Canción - Error de Validación (400)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      headers: [bearer('access_token')],
      body: jsonBody({ title: 'No Artist Provided' }),
      tests: [statusIs(400)],
    }),

    req({
      name: 'Agregar Canción - No es el Propietario (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      headers: [bearer('user2_access_token')],
      body: jsonBody({ title: 'Intruder', artist: 'Nobody' }),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Agregar Canción - Sin Autenticación (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks'],
      body: jsonBody({ title: 'Intruder', artist: 'Nobody' }),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Subir Imagen de Portada - Sin Archivo (400)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      headers: [bearer('access_token')],
      body: formDataBody([]),
      tests: [statusIs(400), messageContains('Explica que no se envió ningún archivo', 'No image file')],
    }),

    req({
      name: 'Subir Imagen de Portada - No es el Propietario (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      headers: [bearer('user2_access_token')],
      body: formDataBody([]),
      tests: [statusIs(403)],
    }),

    req({
      name: 'Subir Imagen de Portada - Sin Autenticación (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      body: formDataBody([]),
      tests: [statusIs(401)],
    }),

    req({
      name: 'Subir Imagen de Portada - Éxito (200) [MANUAL: adjuntar un archivo de imagen]',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'cover-image'],
      headers: [bearer('access_token')],
      body: formDataBody([{ key: 'image', type: 'file', src: [] }]),
      description:
        'Los archivos no pueden incrustarse en una colección de Postman exportada. Antes de ejecutar manualmente esta solicitud, haz clic en el campo "image", selecciona cualquier imagen local y luego presiona Send. Requiere credenciales válidas de Cloudinary en el .env de la API.',
      tests: [
        statusIs(200),
        fieldExists('Se estableció la URL de la imagen de portada', '.data.playlist.coverImageUrl'),
      ],
    }),

    req({
      name: 'Generar Vibe - Éxito (200)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'generate-vibe'],
      headers: [bearer('access_token')],
      description:
        'Funciona incluso sin una ANTHROPIC_API_KEY configurada: recurre a una descripción por defecto, por lo que siempre debería devolver 200.',
      tests: [
        statusIs(200),
        fieldExists('El resumen del vibe generado por IA está presente', '.data.aiVibeSummary'),
        `pm.test("generatedByAI es un booleano", function () {
  pm.expect(pm.response.json().data.generatedByAI).to.be.a("boolean");
});`,
      ],
    }),

    req({
      name: 'Generar Vibe - No es el Propietario (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'generate-vibe'],
      headers: [bearer('user2_access_token')],
      tests: [statusIs(403)],
    }),

    req({
      name: 'Generar Vibe - Sin Autenticación (401)',
      method: 'POST',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'generate-vibe'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Eliminar Canción - Éxito (200)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks', '{{track_id}}'],
      headers: [bearer('access_token')],
      tests: [
        statusIs(200),
        `pm.test("La canción ya no aparece en la playlist", function () {
  const removedId = pm.collectionVariables.get("track_id");
  const ids = pm.response.json().data.playlist.tracks.map((t) => t.id);
  pm.expect(ids).to.not.include(removedId);
});`,
      ],
    }),

    req({
      name: 'Eliminar Canción - No es el Propietario (403)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks', '{{track_id}}'],
      headers: [bearer('user2_access_token')],
      description: 'La propiedad se verifica antes de buscar la canción, por lo que devuelve 403 aunque la canción ya haya sido eliminada arriba.',
      tests: [statusIs(403)],
    }),

    req({
      name: 'Eliminar Canción - Sin Autenticación (401)',
      method: 'DELETE',
      path: ['api', 'v1', 'playlists', '{{playlist_id}}', 'tracks', '{{track_id}}'],
      tests: [statusIs(401)],
    }),

    req({
      name: 'Crear Playlist 2 (fixture del género en conflicto) - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Rock Essentials', genre: '{{genre_conflict_id}}' }),
      description: 'Playlist #2 de 4. Etiquetada deliberadamente con genre_conflict_id para que la carpeta de Limpieza pueda probar la protección contra eliminar un género en uso.',
      tests: [statusIs(201), saveVar('conflict_playlist_id', '.data.playlist.id')],
    }),

    req({
      name: 'Crear Playlist 3 - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Chill Study Session', genre: '{{genre_id}}' }),
      description: 'Playlist #3 de 4.',
      tests: [statusIs(201)],
    }),

    req({
      name: 'Crear Playlist 4 - Éxito (201)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'Late Night Vibes', genre: '{{genre_id}}' }),
      description: 'Playlist #4 de 4: ya se alcanzó el tope del plan plus.',
      tests: [statusIs(201)],
    }),

    req({
      name: 'Crear Playlist 5 - Límite Alcanzado (403)',
      method: 'POST',
      path: ['api', 'v1', 'playlists'],
      headers: [bearer('access_token')],
      body: jsonBody({ name: 'One Too Many', genre: '{{genre_id}}' }),
      description: 'Este es el caso "Ingreso de 5 documentos en plan plus -> Error en el documento 5 por límite" del enunciado de la tarea.',
      tests: [statusIs(403), messageContains('Explica el límite del plan', 'limited to')],
    }),
  ]);
}

module.exports = buildPlaylistsCoreFolder;
