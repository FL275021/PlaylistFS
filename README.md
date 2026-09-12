# API Playlist

Usuarios crean sus playlists("colecciones") de diferentes generos("categorias"), con canciones traidas de una API publica
Buscan las canciones y las añaden, adjuntan y suben imagenes para la cubierta y pueden pedir una descripcion generada por IA
para cada playlist creada. 

## Stack

Node.js · Express · MongoDB/Mongoose · JWT · Joi · BcryptJS · Cloudinary · Anthropic API

## Getting started

```bash
npm install
cp .env.example .env   #  MONGO_URI, JWT_SECRET, Cloudinary, Anthropic keys
npm run seed            # crea usuario admin y generos iniciales
npm run dev              # http://localhost:4000
```

checkeador: `GET /health`

## Data model

| Model | Notes |
|---|---|
| `User` | `username`, `email`, `password` (hashed), `role` (`user`/`admin`, admin solo en el seedeado), `plan` (`plus`/`premium`, default es `plus`) |
| `Genero` | `name`, `description`. No se puede borrar mientras este siendo usado |
| `Playlist` | `name`, `description`, `genre` (ref), `coverImageUrl`, `tracks[]`, `owner` (ref), `aiVibeSummary`,`isPublic` |

## Endpoints (`/api/v1`)

**Desprotegidas**
- `POST /auth/register` — crea cuentas `user`/`plus`, devuelve JWT inmediatamente (frontend auto-login)
- `POST /auth/login` — `{ identifier, password }`, `identifier` user o email

**PRotegidas** (`Authorization: Bearer <token>`)
- `GET /auth/me`
- `PATCH /users/me/upgrade-plan` — plus → premium
- `GET /users/me/usage` — `{ plan, used, limit, percentageUsed }`, para el widget de uso
- `PATCH /users/me` — editar to propio username o mail
- `DELETE /users/me` — borrar tu propia cuenta(y tus playlists en cascada)
- `GET /users` · `GET /users/:id` · `DELETE /users/:id` — admin-only
- `GET/POST/PATCH/DELETE /genres` — cualquier usuario puede acceder, solo admin puede editar
- `GET /playlists` — paginadas y filtradas (`?genre=<id>&search=text&page=1&limit=10`), para las playlist del usuario logueado
- `POST /playlists` — maximas 4 playlist creadas para el usuario `plus`(403), ilimatadas para el usuario `premium`
- `GET/PATCH/DELETE /playlists/:id`
- `POST /playlists/:id/cover-image` — campo multiparte `image`, subido a a Cloudinary
- `GET /tracks/search?q=` — busca en la API iTunes para las canciones (no pide key ni tiene rate-limit)
- `POST /playlists/:id/tracks` / `DELETE /playlists/:id/tracks/:trackId`
- `POST /playlists/:id/generate-vibe` — descripcion generada por IA; devuelve frase default por si la llamada falla

## Notas de diseño

- Arquitectura:`routes → controllers → services → models`, validación Joi, auth y chequeo de "plan" con middleware en cada controlador protegido.
- Handler para errores centralizado(`AppError` + `errorHandler`), toma los mensajes Mongoose/JWT y los devuelve como `{ status, message }`

////////////////////////////////////////////////////////////////////////////////////////++++++++++++++++++++++++++++++++
- OWASP API Top 10: `helmet`, `express-rate-limit` (stricter on `/auth`), `express-mongo-sanitize`, bcrypt hashing, JWT auth, server-side re-validation of everything the client sends (never trust the frontend's disabled-button logic alone).
- All business rules (4-playlist cap, genre-in-use delete guard, ownership checks) are enforced server-side, independent of the frontend.

## Deploying to Vercel

The app is exported without calling `.listen()`, wrapped by `api/index.js` as a serverless
function, and `vercel.json` rewrites every request to it. Set the same environment variables
from `.env` in the Vercel project settings, then `vercel --prod`.

## Postman collection

`postman/music-playlist-api.postman_collection.json` — one collection, 7 numbered folders (Auth,
Genres, Playlists Core, Users, Playlists After Upgrade, Tracks, Cleanup), 95 requests covering
every implemented status code on every endpoint.

**Folder order matters.** Requests save IDs/tokens into collection variables for later requests
to use (e.g. `access_token`, `playlist_id`, `genre_id`), and the plan-limit flow specifically
depends on running in order: 4 playlists get created as `plus` → the 5th is rejected (403) →
plan is upgraded → the 5th succeeds. Use **Run collection** (Collection Runner), not individual
folders in isolation, on a first pass.

**Before running:**
1. `npm run seed` against whichever database `prod_base_url` points at (creates the admin account these tests log in as).
2. Open the collection's **Variables** tab and set `prod_base_url` — to `http://localhost:4000` while developing, to your deployed Vercel URL before final submission (the assignment requires the delivered collection to default to the remote URL).
3. Confirm `admin_username` / `admin_password` match your `.env`'s `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
4. One request, **"Upload Cover Image - Success (200) \[MANUAL\]"**, needs a real image file attached by hand in the Postman UI — Postman collections can't portably embed file bytes, so this is the one request per assignment that can't run unattended. Every other status code on that endpoint (400/401/403) is automated.

The collection was generated by a small script rather than hand-built in the Postman UI —
see `postman/generator/`. If requirements change, edit the relevant `folder-*.js` and run
`node build.js` to regenerate the JSON, instead of hand-editing 95 requests.

## Still to do

- [x] Build out the Postman collection (folders per resource, tests per status code, `prod_base_url` collection variable).
- [ ] Deploy to Vercel + MongoDB Atlas, get a public URL, run the full collection against it once for real, and point `prod_base_url` at it before final submission.
- [ ] Obligatorio 2: React/Redux frontend consuming these endpoints.