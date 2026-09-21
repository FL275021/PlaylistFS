# Music Playlist API

Backend for a music playlist app — Obligatorio 1, Desarrollo Full Stack integrado con IA (ORT).

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
- `POST /auth/register` — creates a `user`/`plus` account, returns a JWT immediately (supports frontend auto-login)
- `POST /auth/login` — `{ identifier, password }`, `identifier` is username or email

**Protected** (`Authorization: Bearer <token>`)
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

## Design notes

- Layered architecture: `routes → controllers → services → models`, with Joi validation and auth/plan-check middleware in front of every protected controller.
- Centralized error handling (`AppError` + `errorHandler`) normalizes Mongoose/JWT errors into consistent `{ status, message }` responses with correct status codes.
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
