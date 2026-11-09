# OB1 Music Frontend

Frontend en React para la API de playlists del Obligatorio 1.

## Desarrollo local

1. Inicia la API desde `../BackEnd` y verifica que esté disponible en `http://localhost:4000`.
2. Desde esta carpeta, instala dependencias y ejecuta Vite:

   ```bash
   npm install
   npm run dev
   ```

   3. Abre `http://localhost:5000/hito1.html` para el playground del Hito 1.

   Por defecto, el frontend consume `http://localhost:4000/api/v1`. Para apuntar a
   otra API, define `VITE_API_URL` en un archivo `.env.local`, por ejemplo:

```env
VITE_API_URL=https://tu-api.example.com/api/v1
```

El flujo de autenticación implementado incluye registro, inicio/cierre de
sesión, validación de formularios y restauración de sesión con `GET /auth/me`.
El dashboard aún es una base visual; la gestión de playlists se incorpora en
los siguientes hitos.

## Hito 1: pruebas AJAX - ejemplo en one file(cambiar) 

`hito1.html` es una página independiente con solicitudes `fetch` a los
endpoints de autenticación, usuarios, géneros, playlists, pistas, imágenes e
IA. Usa datos de demostración y muestra código HTTP, respuesta e historial.

Sigue el flujo recomendado: registrar usuario → login → consultar sesión →
géneros → playlists/pistas/imagen/IA → uso y plan → perfil y endpoints admin.
Las rutas de administrador requieren iniciar sesión con un usuario admin del
seed. Las solicitudes a iTunes requieren conexión a internet y la subida de
portada requiere las credenciales de Cloudinary del backend.

Usa solamente una base de datos local o de pruebas: la página puede crear y
eliminar recursos, cambiar una cuenta de prueba a Premium o borrar usuarios.
Los tokens de sesión se mantienen en memoria y la página solicita confirmación
antes de operaciones destructivas. Sirve la página desde Vite en vez de abrirla
con `file://`, para evitar bloqueos CORS del navegador.

## Verificación

```bash
npm run build
npm run lint
```
