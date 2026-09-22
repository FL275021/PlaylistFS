# API Playlist 

Usuarios crean sus playlists("colecciones") de diferentes generos("categorias"), con canciones traidas de una API publica
Buscan las canciones y las añaden, adjuntan y suben imagenes para la cubierta y pueden pedir una descripcion generada por IA
para cada playlist creada. 

## Stack

Node.js · Express · MongoDB/Mongoose · JWT · Joi · BcryptJS · Cloudinary · Anthropic API

## Para empezar

```bash
npm install
cp .env.example .env   #  MONGO_URI, JWT_SECRET, Cloudinary and Anthropic keys
npm run seed            # crea usuario admin y generos iniciales
npm run dev              # http://localhost:4000
```

Health check: `GET /health`

## Data model

| Model | Notes |
|---|---|
| `User` | `username`, `email`, `password` (hashed), `role` (`user`/`admin`, admin only via seed/DB), `plan` (`plus`/`premium`, default `plus`) |
| `Genre` | the "category" entity — `name`, `description`. Admin-managed. Can't be deleted while playlists reference it. |
| `Playlist` | the "collection" entity — `name`, `description`, `genre` (ref), `coverImageUrl`, `tracks[]`, `owner` (ref), `aiVibeSummary`, `isPublic` |

## Endpoints (`/api/v1`)

**Desprotejidos**
- `POST /auth/register` — creates a `user`/`plus` account, returns a JWT immediately (supports frontend auto-login)
- `POST /auth/login` — `{ identifier, password }`, `identifier` is username or email

**Protejidos** (`Authorization: Bearer <token>`)
- `GET /auth/me`
- `PATCH /users/me/upgrade-plan` — plus → premium
- `GET /users/me/usage` — `{ plan, used, limit, percentageUsed }`, feeds the frontend's usage widget
- `PATCH /users/me` — edit your own username/email
- `DELETE /users/me` — delete your own account (cascades to your playlists)
- `GET /users` · `GET /users/:id` · `DELETE /users/:id` — admin-only user management
- `GET/POST/PATCH/DELETE /genres` — reads open to any user, writes admin-only
- `GET /playlists` — paginated + filterable (`?genre=<id>&search=text&page=1&limit=10`), scoped to the caller's own playlists
- `POST /playlists` — blocked at 4 for `plus` users (403), unlimited for `premium`
- `GET/PATCH/DELETE /playlists/:id`
- `POST /playlists/:id/cover-image` — multipart `image` field, uploads to Cloudinary
- `GET /tracks/search?q=` — searches the iTunes Search API (no key, no rate-limit risk)
- `POST /playlists/:id/tracks` / `DELETE /playlists/:id/tracks/:trackId`
- `POST /playlists/:id/generate-vibe` — AI-generated description; falls back to a default sentence if the AI call fails, so this can never break the app

## Notas de diseño

- Arquitectura:`routes → controllers → services → models`, validación Joi, auth y chequeo de "plan" con middleware en cada controlador protegido.
- Handler para errores centralizado(`AppError` + `errorHandler`), toma los mensajes Mongoose/JWT y los devuelve como `{ status, message }`
- OWASP(Open Web Application Security Project) API Top 10: `helmet`, `express-rate-limit` (stricto `/auth`), `express-mongo-sanitize`, hashing, JWT auth, revalidacion del lado del servidor de todo lo mandado por le client.
- Todas las reglas de negocio(4-playlist cap, Bloquea borrado de Genero En Uso , chequea prpietario) son del lado servidor, independientes del frontend.

##  Vercel
La aplicacion es exportada sin llamar al `.listen()`, envuelto en `api/index.js` como una funcion, y `vercel.json` reescribe todas las request.
Setea las mismas variables de ambiente de `.env` en la configuración del proyecto en Vercel y despues ejecuta `vercel --prod`.

## Postman 
`postman/music-playlist-api.postman_collection.json` — one coleccion, 7 carpetas (Auth, Genres, Playlists Core, Users, Playlists After Upgrade, Tracks, Cleanup), 95 requests para cada codigo de estado implementado en cada endpoint.

**Importa el Orden**
Request guardan las IDs/tokens para futuras requests(`access_token`, `playlist_id`, `genre_id`), y el flujo de limite por plan depende de este orden:
Crea 4 playlists como `plus` -> la 5ta es rechazada (403) -> sube de plan -> crea la 5ta

**Antes de correrlo:**
1. `npm run seed` para BdD `prod_base_url` apunta a.
2. En la coleccion abrir **Variables** y modificar la `prod_base_url` como `http://localhost:4000` mientras se desarrolla, para el URL de despliegue de Vercel.
3. Confirmar `admin_username` / `admin_password` se el mismo en `.env` `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
4. La request **"Upload Cover Image - Success (200) \[MANUAL\]"**, necesita un archivo de imagen real adjuntado en la UI de Postman — Esta es la unica request de ese endpoint (400/401/403) que no es automatizada.

La coleccion fue generada por un script que toma la data en `postman/generator/`, si eso cambia editar `folder-*.js` y correr `node build.js` que genera otro json.


