# Music Playlist API

Backend for a music playlist app 

Users build playlists ("collections") tagged with genres ("categories"), search real track
metadata from a public music API, upload cover art, and get an AI-generated "vibe" description
for each playlist.

## Stack

Node.js · Express · MongoDB/Mongoose · JWT · Joi · BcryptJS · Cloudinary · Anthropic API

## Getting started

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, Cloudinary and Anthropic keys
npm run seed            # creates the admin user + starter genres
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

**Unprotected**
- `POST /auth/register` — crea un cuenta `user`/`plus`, inmediatamente retorna un JWT (frontend autologin)
- `POST /auth/login` — `{ identifier, password }`, `identifier` email

**Protected** (`Authorization: Bearer <token>`)
- `GET /auth/me`
- `PATCH /users/me/upgrade-plan` — plus → premium
- `GET /users/me/usage` — `{ plan, used, limit, percentageUsed }`, alimenta el frontend widget
- `GET/POST/PATCH/DELETE /genres` — cualquier usuario puede leer, solo admins pueden escribir
- `GET /playlists` — paginado + filtrado (`?genre=<id>&search=text&page=1&limit=10`), scoped para las playlist del usuario que lo llama
- `POST /playlists` — limite de 4 para usuarios `plus`(403), ilimitado para `premium`
- `GET/PATCH/DELETE /playlists/:id`
- `POST /playlists/:id/cover-image` — campo de `image`, sube a Cloudinary
- `GET /tracks/search?q=` — iTunes Search API (no key, no rate-limit risk)
- `POST /playlists/:id/tracks` / `DELETE /playlists/:id/tracks/:trackId`
- `POST /playlists/:id/generate-vibe` — descripcion generada por AI; devuelve la descripcion default si la llamada API falla

## Design notes

- Layered architecture: `routes → controllers → services → models`, with Joi validation and auth/plan-check middleware in front of every protected controller.
- Centralized error handling (`AppError` + `errorHandler`) normalizes Mongoose/JWT errors into consistent `{ status, message }` responses with correct status codes.
- OWASP API Top 10: `helmet`, `express-rate-limit` (stricter on `/auth`), `express-mongo-sanitize`, bcrypt hashing, JWT auth, server-side re-validation of everything the client sends (never trust the frontend's disabled-button logic alone).
- All business rules (4-playlist cap, genre-in-use delete guard, ownership checks) are enforced server-side, independent of the frontend.

## Deploying to Vercel

The app is exported without calling `.listen()`, wrapped by `api/index.js` as a serverless
function, and `vercel.json` rewrites every request to it. Set the same environment variables
from `.env` in the Vercel project settings, then `vercel --prod`.


