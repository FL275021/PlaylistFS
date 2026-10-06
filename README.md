# API Playlist 
Usuarios crean sus playlists("colecciones") de diferentes generos("categorias"), con canciones traidas de una API publica
Buscan las canciones y las añaden, adjuntan y suben imagenes para la cubierta y pueden pedir una descripcion generada por IA
para cada playlist creada. 

## Stack
Node.js · Express · MongoDB/Mongoose · JWT · Joi · BcryptJS · Cloudinary · Anthropic API

## Para empezar
```bash
npm install
npm run seed            # crea usuario admin y generos iniciales
npm run dev              # http://localhost:4000
npm test                 # ejecuta las pruebas automatizadas locales
npm run test:collection  # ejecuta los 95 requests Postman en servicios locales aislados
```

Health check: `GET /health`

Las pruebas automatizadas usan `node:test` y no se conectan a MongoDB Atlas. `npm run test:collection` inicia una base MongoDB en memoria y una API local, carga los datos iniciales de prueba y ejecuta todos los requests de `postman/collection.json`; no requiere ni lee credenciales de `.env`. Cloudinary se sustituye por un stub local y Gemini se desactiva para comprobar su respuesta de fallback. La búsqueda de pistas consulta iTunes y requiere conexión a internet. La colección ejecutada manualmente desde Postman crea y elimina datos, por lo que `prod_base_url` debe apuntar a un entorno desechable.

## Data model
| Model | Notas |
|---|---|
| `User` | `username`, `email`, `password` (hashed), `role` (`user`/`admin`, ADMIN se crea solo atraves seed/DB), `plan` (`plus`/`premium`, default `plus`) |
| `Genre` | La "Categoria" — `name`, `description`. Gestiona ADMIN. No se pueden borrar mientras estan siendo usadas. |
| `Playlist` | La "Coleccion"  — `name`, `description`, `genre` (ref-Genre), `coverImageUrl`, `tracks[]`, `owner` (ref-User), `aiVibeSummary`, `isPublic` |

## Endpoints (`/api/v1`)

**Desprotejidas**
- `POST /auth/register` — crea una cuenta `user`/`plus`, devuelve un JWT(token) inmediatamente (el frontend auto-login)
- `POST /auth/login` — `{ identifier, password }`, `identifier` el ID es el username o el email

**Protejidas** (`Authorization: Bearer <token>`)
- `GET /auth/me`
- `PATCH /users/me/upgrade-plan` — plus → premium
- `GET /users/me/usage` — `{ plan, used, limit, percentageUsed }`, alimenta el widget de uso del frontend
- `PATCH /users/me` — editar tu propio username o email
- `DELETE /users/me` — borra tu cuenta(y en cascada tus playlists)
- `GET /users` · `GET /users/:id` · `DELETE /users/:id` — Gestiona ADMIN
- `GET/POST/PATCH/DELETE /genres` — acceso a cualquier usuario, solo ADMIN edita
- `GET /playlists` —  paginable y filtrable (`?genre=<id>&search=text&page=1&limit=10`), solo muestra las playlist del que peticiona
- `POST /playlists` — maximo 4 para usuarios `plus`(403), ilimatado para usuarios `premium`
- `GET/PATCH/DELETE /playlists/:id`
- `POST /playlists/:id/cover-image` — campo `image`, lo sube a Cloudinary
- `GET /tracks/search?q=` — busca las canciones en iTunes API (sin key, ni limite)
- `POST /playlists/:id/tracks` / `DELETE /playlists/:id/tracks/:trackId`
- `POST /playlists/:id/generate-vibe` — descripcion generada por IA; si la llamada falla, muestra la que esta por defecto.

## Notas de diseño
- Arquitectura:`routes → controllers → services → models`, validación Joi, auth y chequeo de "plan" con middleware en cada controlador protegido.
- Handler para errores centralizado(`AppError` + `errorHandler`), toma los mensajes Mongoose/JWT y los devuelve como `{ status, message }`
- OWASP(Open Web Application Security Project) API Top 10: `helmet`, `express-rate-limit` (stricto `/auth`), `express-mongo-sanitize`, hashing, JWT auth, revalidacion del lado del servidor de todo lo mandado por le client.
- Todas las reglas de negocio(4-playlist cap, Bloquea borrado de Genero En Uso , chequea prpietario) son del lado servidor, independientes del frontend.
- `sanitize-html` usa una versión compatible con el runtime ESM de Vercel y fija `htmlparser2` a una versión con entrada CommonJS. No eliminar el override sin verificar el arranque en Vercel Node.js 24.

##  Vercel
La aplicacion es exportada sin llamar al `.listen()`, envuelto en `api/index.js` como una funcion, y `vercel.json` reescribe todas las request.
Setea las mismas variables de ambiente de `.env` en la configuración del proyecto en Vercel y despues ejecuta `vercel --prod`.
Configura `MONGO_URI` y `JWT_SECRET` en el entorno **Production** de Vercel. `/health` comprueba que la función HTTP responde, no la conexión con MongoDB; las solicitudes `/api/*` devuelven `503` si no se puede conectar a la base de datos.

## Postman 
`postman/music-playlist-api.postman_collection.json` — one coleccion, 7 carpetas (Auth, Genres, Playlists Core, Users, Playlists After Upgrade, Tracks, Cleanup), 95 requests para cada codigo de estado implementado en cada endpoint.

**Importa el Orden**
Request guardan las IDs/tokens para futuras requests(`access_token`, `playlist_id`, `genre_id`), y el flujo de limite por plan depende de este orden:
Crea 4 playlists como `plus` -> la 5ta es rechazada (403) -> sube de plan -> crea la 5ta

La coleccion fue generada por un script que toma la data en `postman/generator/`