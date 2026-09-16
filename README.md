# API Playlist

Usuarios crean sus playlists("colecciones") de diferentes generos("categorias"), con canciones traidas de una API publica
Buscan las canciones y las añaden, adjuntan y suben imagenes para la cubierta y pueden pedir una descripcion generada por IA
para cada playlist creada. 

## Stack

Node.js · Express · MongoDB/Mongoose · JWT · Joi · BcryptJS · Cloudinary · Anthropic API

## Para empezar

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
- OWASP(Open Web Application Security Project) API Top 10: `helmet`, `express-rate-limit` (stricto `/auth`), `express-mongo-sanitize`, hashing, JWT auth, revalidacion del lado del servidor de todo lo mandado por le client.
- Todas las reglas de negocio(4-playlist cap, Bloquea borrado de Genero En Uso , chequea prpietario) son del lado servidor, independientes del frontend.

## Vercel

La aplicacion es exportada sin llamar al `.listen()`, envuelto en `api/index.js` como una funcion, y `vercel.json` reescribe todas las request.
Setea las mismas variables de ambiente de `.env` en la configuración del proyecto en Vercel y despues ejecuta `vercel --prod`.

## Postman 

`postman/music-playlist-api.postman_collection.json` — 
una coleccion, 7 carpetas numeradas (Auth, Genres, Playlists Core, Users, Playlists After Upgrade, Tracks, Cleanup),
95 requests cubriendo cada codigo de estado para cada endpoint.

    **El Orden Del Mundo(directorios).** 
    Request guardan IDs/tokens en colecciones de variables para ser usado por futuras requests
    El flujo del limite de plan depende que corra en este orden:
    4 playlists son creadas por un `plus` → la quinta es rechazada (403) → sube de plan → la quinta es aceptada.


