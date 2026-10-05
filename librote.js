// #region ToDo
/*Hola Lucas, como andas?
Ayer se me olvido decirte hoy pero la tablet no me esta dejando conectarme a la vpn con la password y el authenticador, te alcanzo la tablet y la hoja con el QR y la password? 

https://git.labanca.com.uy/labanca/tarjetas/tarjetasfrontend/-/blob/TRJBQM-158_club_del_este/README.md

http://redmine.desarrollo.labanca.com.uy/projects/bi/wiki/Software_de_Comportamiento?parent=Wiki


## TODO
- [ ] Deploy to Vercel + MongoDB Atlas, get a public URL, run the full collection against it once for real, and point `prod_base_url` at it before final submission.
- fix this translated tests:
Test checking for...	API now says...
"already registered"	"ya está registrado"
"Username or email is required"	"usuario o email es obligatorio"
"Invalid username/email or password"	"Credenciales inválidas"
"not logged in"	"No se recibió token"
"permission"	"permisos"
"already exists"	"ya existe"
"No image file"	"No se proporcionó"
"limited to"	"limited to" ✅ (this one still matches — mixed Spanish/English in the message)
"already in use"	"ya está en uso"
"no longer exists"	"ya no existe"
"used by"	"está usado por"


*/



// #region Hitos
/* Hito_0: (Definición de tema)
Definir la temática con la que se desea trabajar en los obligatorios. 
Pensar en las entidades que se van a crear y si cumplen con los requerimientos funcionales que se plantean en las letras.

ENTIDADES:  
Usuario: nombre, email, password(hash), role(user, admin), plan(plus, premium, default es plus).
Genero("categorias"): nombre, descripcion. (un genero no se puede borrar mientras este en uso), el o los generos se le asignan a cada playlist
Playlist("colecciones"): nombre, descripcion, Genero, ImageURL, canciones, Creador(usuario), resumen(AI). (Usuarios plus solo pueden crear 4, los premium ilimitadas)

-Subida de imágenes al servicio de alojamiento de imágenes de Vercel o a Cloudinary (UNO O OTRO)

-Investigación e implementación de algún endpoint que utilice algún recurso pertinente no visto en clase asegurándose que no haya límites por uso(ITUNES)


Hito_1:
(Configuración inicial y ruteo)
Crear el servidor y desarrollar el ruteo pensando en el versionado que solicita la aplicación y creando las rutas con los endpoints que serán necesarios.

Hito_2: (Controladores, validators y middlewares)
Agregar los controladores correspondientes a cada ruta e ir planteando los schemas de validación y middlewares necesarios para la aplicación.





x

 */ 

// #region Coman
generate_random_key_command:node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"







//#region Vercel + PostMan

https://music-playlist-dun.vercel.app/
https://vercel.com/esdonalgo-bit/playlist-fs/HPKntdJAzwoMNYazmRLhFmQ41LJw
https://esdonalgo-1807108.postman.co/workspace/FS_project~f51aca04-f69a-4d19-8b76-5c920ba16f38/http-request/58131361-feacf1cf-612c-4ad1-88f4-022dc472b9cc?sideView=variables






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
https://account.mongodb.com/account/login?n=https%3A%2F%2Fcloud.mongodb.com%2Fv2%2F6a9c2e2501f2dba75157b260&nextHash=%23clusters&signedOut=true



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
npm install mongodb

npm run seed




/* 

Fondo de donación compartida:
Un programa donde la empresa iguale económicamente las donaciones que los empleados realicen a fundaciones u organizaciones benéficas elegidas 
democráticamente por el equipo.

Mentorías para la inclusión laboral: Organizar "bootcamps" o programas de mentoría donde los empleados capaciten a jóvenes de sectores vulnerables 
o grupos subrepresentados, facilitando su inserción en el mercado laboral formal.

*/


//#region concep 

middleware:
-conector de sistemas, capa de traducción entre base de xDownloadOptions, hardware, SO y aplicaciones
-Ejemplos: Autenticacion, validaciones, registro, manejo de errores

/*







/*
//#region zTup
despues de agregar variables del env:
vercel --prod (crea el URL  https://music-playlist-bjzz50ogk-esdonalgo-bit.vercel.app )

https://vercel.com/esdonalgo-bit/playlist-fs/HPKntdJAzwoMNYazmRLhFmQ41LJw/vercel.app/health
music-playlist-git-main-esdonalgo-bit.vercel.app
music-playlist-bjzz50ogk-esdonalgo-bit.vercel.app

https://cloud.mongodb.com/v2/6a9c2e2501f2dba75157b260#/explorer/6a9c2f0d49e0752ff8db2f9b

mongodb+srv://UnmovedMover:FzZuH5Scv1F5vXXg@fsplaylists.v5tmq88.mongodb.net/?appName=FSPlaylists

PROBAR LOCALMENTE:
npm install
npm run seed            # crea usuario admin y generos iniciales
npm run dev              # http://localhost:4000    cambiarlo el la var prod_base_url si testeamos local
npm test                 # ejecuta las pruebas automatizadas locales
npm run test:collection  # ejecuta los 95 requests Postman en servicios locales aislados

En  http://localhost:4000/health.  {"status":"success","message":"API is up"}.


3. Vercel
Environment Variables: todo lo del .env 
vercel --prod, dsde consola

4. Seed BdD
MONGODB_URI="mongodb+srv://esdonalgo_db_user:2qHCuR53ysqXVVSk@fsplaylists.v5tmq88.mongodb.net" npm run seed





Phase 3: Run against production
In the collection Variables, set prod_base_url to https://music-playlist-bjzz50ogk-esdonalgo-bit.vercel.app, and Save.
Run the full collection with the Runner again.
Fix anything that behaves differently in prod. Typical suspects are missing env vars, the Cloudinary config, and Atlas network access.


Quick checklist before submitting
 Full collection passes against the Vercel URL
 prod_base_url has the remote URL in the exported JSON
 Every endpoint has tests for each status code implemented
 README updated (and mention any AI usage, since the assignment requires citing it)
 ZIP is under 40 MB with no node_modules
 You can explain every part of the code for the defense (Oct 5-8)

If you want, tell me what fails when you run it and I can help debug.

Incorporating new instructions into the walkthrough plan.

Those notes add a few things to the checklist. Here's how they change the plan.

1. Edge-case tests (limits)

Your current flow (4 playlists as plus, 5th gets 403, upgrade, 5th succeeds) is only half of what the professor asks for. Add:

Plus boundaries: the 4th playlist succeeds (201), the 5th fails (403). Testing both sides of the boundary catches off-by-one bugs.
Premium beyond the limit: after the upgrade, keep creating until you have 11 playlists. The professor's "11 documents" example fits well here, because 11 is also one more than your default page size of 10. One loop covers both the "premium has no limit" check and pagination: GET /playlists?page=1&limit=10 returns 10 items, and page=2 returns 1.
Plus users who delete: a plus user at 4 playlists deletes one, then can create again. This checks you count current playlists rather than a lifetime counter.
Upgrade edge cases: upgrading when already premium should return an error (the letter says it requires being on plus), and an admin hitting the upgrade endpoint should get the error you decided on.

You can write the loop as a repeated request in the runner, or use postman.setNextRequest() in a pre-request/test script, or simply add 11 requests to that folder.

2. Mongo doesn't validate references

Check that your services explicitly verify referenced documents exist:

POST /playlists and PATCH /playlists/:id with a genre ID that doesn't exist must return 404 or 400, not save.
A malformed ObjectId (genre: "abc") should return 400, which Joi or a CastError handler can cover.
POST /playlists/:id/tracks with a bad :id should also be handled.
Deleting a genre that's in use should be blocked (you already have this). Deleting a user should cascade their playlists (also covered).

Add a Postman request for each of these with a test for the expected status code.

3. Initial data in Atlas
Your npm run seed covers admin and genres. Consider also seeding one regular user and a few playlists, so the graders can explore the API without running the whole collection first.
Run the seed against Atlas (the MONGODB_URI="..." npm run seed command from before).
Take a backup with mongodump --uri="<atlas uri>" --out=./backup, or export from Atlas/Compass. Redo it now and then as the professor suggests, but don't put the backup in the ZIP unless you want to.
Make sure the Cleanup folder doesn't delete the seeded data.
4. Postman documentation and test style
Randomized values: use a pre-request script such as pm.collectionVariables.set("rand_user", "user_" + Date.now()), or {{$randomInt}} and {{$randomFirstName}} in bodies. This also fixes the duplicate-user problem on re-runs.
Test names and descriptions: rename tests to neutral wording, e.g. "This test validates that the response status is 403 when a plus user creates a fifth playlist", not "Here we test...". Add a short request description saying what is expected and why.
Publish: click the collection, open Overview → View complete documentation → Publish (top right), and save that public link. The link in the professor's message is his own example, so you need your own.
5. Cleanup before submitting
bash
# find leftover console statements
grep -rn "console\." --include=*.js . --exclude-dir=node_modules

# find unused dependencies and files
npx depcheck
npx knip
Remove console.log from the app code. The seed script is a gray area: the professor said to delete logs, so I'd keep at most one or two in seed.js or drop them too. If you do keep them, be ready to explain why.
Delete unused files, dependencies and env vars (for example, anything left from a Redis setup or other experiments). Keep .env.example with variable names only, never real secrets.
Exclude node_modules from the ZIP. The project should run both locally and on Vercel.
6. What goes in the ZIP
The whole project folder (no node_modules, no .env).
A .txt file with both URLs: the Vercel API URL and your published Postman documentation URL.
The exported Postman collection as JSON, with prod_base_url set to the Vercel URL.
Revised order of work
Add the missing tests (limit, 11 playlists, bad references, random data).
Run everything locally in the Collection Runner.
Clean up the code and unused files.
Deploy to Vercel + Atlas, seed Atlas, back it up.
Run the full collection against production.
Publish the Postman docs, export the JSON, and write the URL .txt.
Zip it and submit before 21:00 on 1/10.

If you paste your playlists service and controller, I can check that the reference validation and the plus/premium limit logic handle these edge cases.

on this step:
5. Read the results
request: error: localhost request not supported



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Quick checklist before submitting
 Full collection passes against the Vercel URL
 prod_base_url has the remote URL in the exported JSON
 Every endpoint has tests for each status code implemented
 README updated (and mention any AI usage, since the assignment requires citing it)
 ZIP is under 40 MB with no node_modules
 You can explain every part of the code for the defense (Oct 5-8)

If you want, tell me what fails when you run it and I can help debug. */












/*
21.Arquitectura de sistemas, desarrollo, especializaciones varias a eleccion

3.La capacidad técnica del equipo y el potencial que tenemos para modernizar la operativa. 
Valoro la iniciativa que tienen algunos técnicos para buscar soluciones que van más allá del soporte básico.

​4.​La capacidad e intención de querer mejorar y agilizar los procesos internos, y el talento interno. Actualmente, 
varios miembros del equipo hemos desarrollado herramientas propias de software y scripts para intentar agilizar el trabajo diario.

​5.Definir formalmente escalafones de Seniority (Junior, Semi-Senior, Senior) y crear roles específicos de especialización. 
Al separar el soporte hardware del soporte software y  definir las tareas de cada rol, el flujo de trabajo sería mucho más eficiente y justo."

6.Como mencione en puntos anteriores, considero que el equipo tiene un gran potencial para modernizar la operativa pero somos limitados por la 
estructura actual. Personalmente, he invertido mucho tiempo en desarrollar herramientas de automatización para reducir la carga manual en tareas 
monótonas, y poder invertir mas tiempo en tareas de mayor complejidad. Se que no soy e único que ha implementado o tenga la intención de implementar
 soluciones para mejorar la estructura, por eso creo que la reforma tiene la oportunidad no solo de generar un gran impacto positivo para todo el 
 equipo, sino también retener el talento técnico y potenciar el crecimiento de todo el departamento.
*/


/*
Totalmente en desacuerdo
En desacuerdo
Ni de acuerdo ni en desacuerdo
De acuerdo
Totalmente de acuerdo
No aplica / No tengo elementos para responder

Experiencia de trabajo:32443221

Equipo, desarrollo y motivación:244244234414
*/