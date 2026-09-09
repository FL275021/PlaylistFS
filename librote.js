// #region ToDo

left_at:
//Run npm install, then npm run seed — you should see console logs confirming MongoDB connected and the admin 
// user/genres were created. Then npm run dev and open http://localhost:4000/health in your browser; you should
//  see {"status":"success","message":"API is up"}.

/*
- [ ] Build out the Postman collection (folders per resource, tests per status code, `prod_base_url` collection variable) 
- [ ] Deploy to Vercel + MongoDB Atlas and get a public URL.
- [ ] Obligatorio 2: React/Redux frontend consuming these endpoints. */


// #region Hitos
/* Hito_0: (Definición de tema)
Definir la temática con la que se desea trabajar en los obligatorios. 
Pensar en las entidades que se van a crear y si cumplen con los requerimientos funcionales que se plantean en las letras.

ENTIDADES:
Usuario: nombre, email, password(hash), role(user, admin), plan(plus, premium, default es plus).
Genero("categorias"): nombre, descripcion. (un genero no se puede borrar mientras este en uso)
Playlist("colecciones"): nombre, descripcion, Genero, ImageURL, canciones[], Creador(usuario), resumen(AI). (Usuarios plus solo pueden crear 4)


Hito_1:
(Configuración inicial y ruteo)
Crear el servidor y desarrollar el ruteo pensando en el versionado que solicita la aplicación y creando las rutas con los endpoints que serán necesarios.

Hito_2: (Controladores, validators y middlewares)
Agregar los controladores correspondientes a cada ruta e ir planteando los schemas de validación y middlewares necesarios para la aplicación.


 */

// #region Coman
generate_random_key_command:node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"







//#region Cloudinary
Cloud_name:
n9gqtkiy
Cloud_ID:
872517ccdefa860be3812de29962fb

API_key:
788638354614625
API_secret:
r4WPZ7UaKcp-XOs2hLNQCe8oyQ4






//#region mongoDB:
/* 
creator_user:
esdonalgo_db_user
2qHCuR53ysqXVVSk

operational_user:
UnmovedMover
AL97_Ea;BwZVT.v

mongodb_extension_vsc:
mongodb+srv://esdonalgo_db_user:<db_password>@fsplaylists.v5tmq88.mongodb.net/

Drive_URL:
mongodb+srv://<db_username>:<db_password>@fsplaylists.v5tmq88.mongodb.net/?appName=FSPlaylists

commands:
npm install mongodb */


//#region concep

middleware:
-conector de sistemas, capa de traducción entre base de xDownloadOptions, hardware, SO y aplicaciones
-Ejemplos: Autenticacion, validaciones, registro, manejo de errores