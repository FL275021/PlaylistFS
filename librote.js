// #region ToDo
/*Hola Lucas, como andas?
Ayer se me olvido decirte hoy pero la tablet no me esta dejando conectarme a la vpn con la password y el authenticador, te alcanzo la tablet y la hoja con el QR y la password? 

https://git.labanca.com.uy/labanca/tarjetas/tarjetasfrontend/-/blob/TRJBQM-158_club_del_este/README.md

http://redmine.desarrollo.labanca.com.uy/projects/bi/wiki/Software_de_Comportamiento?parent=Wiki


Guía para defender OB1 frente a clase10
La idea central para explicar el proyecto es: OB1 conserva los patrones de backend trabajados en clase, pero los aplica a un dominio distinto —playlists y música— y agrega reglas de negocio e integraciones concretas. No conviene presentar como “nuevo” algo que ya aparece en clase10; sí se puede explicar cómo se amplió o adaptó.

1. Flujo de una petición
Como ejemplo, para crear una playlist:

Entrada en Vercel o en local. En Vercel, api/index.js adapta la aplicación para ejecutarse como función. En local, la aplicación se configura en src/app.js.
Middleware global. Express aplica Helmet, CORS, parseo JSON, sanitización contra operadores Mongo y rate limit para /api.
Enrutamiento versionado. Las rutas se montan bajo /api/v1; src/routes/v1/index.js distribuye la petición hacia auth, usuarios, géneros, playlists o pistas.
Middleware de ruta. En playlists, primero se exige autenticación; para crear, también se verifica el límite del plan, se sanitizan textos y se valida el body con Joi. El orden está en src/routes/v1/playlist.routes.js.
Controlador y reglas de negocio. src/controllers/playlistController.js confirma que exista el género, asigna el dueño desde el usuario autenticado y ejecuta la operación.
Persistencia y respuesta. Mongoose trabaja con los modelos —por ejemplo, src/models/Playlist.js— y la API devuelve datos JSON con el status code correspondiente.
Errores. Los errores pasan al middleware central src/middlewares/error.middleware.js, que traduce errores de Mongoose y JWT y centraliza el formato de respuesta.
Matiz importante: aunque el README describe routes → controllers → services → models, el CRUD de playlists y géneros consulta Mongoose directamente desde los controladores. La capa services se usa claramente para integraciones como Cloudinary, IA e iTunes, no como una capa uniforme para todo el CRUD. Es mejor reconocerlo si preguntan por la arquitectura.

2. Qué comparte con la clase y qué se amplía
Tema	Ya está en clase10	Cómo aparece en OB1
Express y rutas	Aplicación Express y routers para tareas	Se organizan por dominio y versión en /api/v1; ver src/routes/v1/index.js.
Autenticación y autorización	Middleware de autenticación y rol admin en las rutas de tareas; por ejemplo, clase10/src/v1/routes/tarea.routes.js	JWT en rutas protegidas, roles y verificación de propietario. La autenticación está en src/middlewares/auth.middleware.js.
Sanitización y rate limit	clase10 ya incluye módulos de sanitización y rate limit en su README y estructura	OB1 los aplica globalmente y también limita especialmente login y registro: src/middlewares/rateLimit.middleware.js.
MongoDB y populate	Las tareas referencian al usuario y tarea.services.js usa .populate("userId", ...): clase10/src/v1/services/tarea.services.js	Playlist referencia género y dueño. Se completa el género al consultar. Como la consigna aclara, ref no impone una clave foránea; por eso el controlador comprueba que el género exista antes de crear o cambiar una playlist.
Funcionalidad de dominio	CRUD de tareas por usuario	CRUD de playlists, géneros y pistas, junto con límites por plan, propiedad y prevención de borrado de géneros usados.
Recursos externos	La clase menciona IA, Axios y Redis	OB1 agrega búsqueda musical con iTunes, carga de portadas a Cloudinary y generación de descripción con IA. Redis pertenece al ejemplo de clase; no es parte central del flujo de OB1.
Por lo tanto, una buena respuesta a “¿qué hicieron que no se vio en clase?” sería: “Partimos de patrones vistos en clase —rutas, middleware, auth, roles, Mongo y sanitización— y los aplicamos al dominio del obligatorio. Lo específico que agregamos es el control del plan Plus/Premium, la gestión de playlists y géneros, la integración con iTunes y Cloudinary y el flujo de generación de descripciones con IA.”

3. Reglas de negocio que conviene poder explicar
Registro: el usuario se crea con rol user y plan plus; el usuario admin se crea aparte, no se puede elegir ese rol libremente al registrarse.
Plan Plus: permite hasta cuatro playlists. El middleware src/middlewares/planCheck.middleware.js cuenta las playlists del propietario y rechaza la siguiente con 403.
Plan Premium: el middleware sale antes de consultar el conteo, así que no le aplica el límite Plus. Esta distinción también se prueba para un usuario con 11 playlists en tests/playlist-limits.test.js.
Propiedad: el dueño se obtiene del token verificado, no del body enviado por el cliente. Para acceder o modificar una playlist, el controlador compara el dueño con el usuario autenticado y permite al admin la excepción prevista.
Géneros: son administrables por admin. No se puede borrar un género que esté asociado a playlists: responde 409 Conflict. La comprobación está en src/controllers/genreController.js.
Paginación: las consultas listadas usan APIFeatures; por ejemplo, por defecto página 1, límite 10 y máximo 100. Está en src/utils/apiFeatures.js.
Referencias Mongo: ref permite resolver datos con populate, pero MongoDB no garantiza por sí solo que el documento referenciado exista. OB1 valida explícitamente el género antes de guardar y carga su nombre al consultar; se cubre en tests/mongo-references.test.js.
4. Cumplimiento de la consigna
La consigna del obligatorio —PDF de la entrega— pide Node.js, Express, MongoDB/Mongoose, JWT, Joi, BcryptJS, middleware de protección, API v1, respuestas de error y status codes, CRUD de colecciones y categorías, límite de cuatro registros para Plus, paginación, imágenes, IA con fallback, un recurso de terceros, Postman y deploy en Vercel.

En el código revisado hay evidencia de:

API versionada y endpoints agrupados bajo /api/v1.
Validación de entrada con Joi, a través de validate(schema), que además elimina campos desconocidos y puede devolver errores de varios campos: src/middlewares/validate.middleware.js.
Protección JWT, autorización por rol, sanitización, rate limiting y manejo centralizado de errores.
CRUD de playlists y géneros, con paginación, filtro y búsqueda.
Límite Plus/Premium, incluida la comprobación de un caso extremo con 11 playlists premium.
Carga de portadas mediante Cloudinary y tratamiento del archivo con Multer; hay un límite configurado de 5 MB en las rutas de playlist.
IA no bloqueante: la generación de descripción intenta usar Gemini y ofrece una descripción por defecto si la IA no está disponible, en src/services/ai.service.js.
Integración pertinente con iTunes para buscar pistas: src/services/itunes.service.js.
Postman: hay siete carpetas y 95 requests para flujos de autenticación, géneros, playlists, usuarios, pistas y limpieza: postman/collection.json.
Dos precisiones para la defensa:

Postman no cubre por sí solo todos los límites de datos. Su flujo principal prueba cuatro playlists Plus, el rechazo de la quinta, la actualización a Premium y la creación posterior. El caso Premium con 11 se valida además en una prueba automatizada del middleware; es válido decirlo así, sin afirmar que el request de Postman crea las 11.
La subida exitosa de imagen requiere un archivo válido y Cloudinary configurado en un entorno real. La colección lo marca como request manual; la ejecución local completa anterior usó un stub, no fue una prueba de una subida real a Cloudinary.
5. Guion breve para recorrer Postman
En Auth, mostrar validación de registro, alta correcta, usuario duplicado, login con credenciales incorrectas y login correcto. Explicar que la colección guarda los tokens e IDs para los requests siguientes.
En Géneros, mostrar validación, acceso denegado a no-admin, alta y duplicado; luego consulta, actualización y borrado. El caso de borrado mientras el género está en uso se demuestra en la carpeta de limpieza.
En Playlists Core, crear una playlist con un género válido, listar y filtrar; luego enseñar el rechazo si el género no existe y el control de propietario.
Mostrar el ciclo Plus: cuatro altas correctas, quinta rechazada con 403, consulta de uso, cambio a Premium y quinta alta exitosa.
En Pistas, enseñar búsqueda iTunes con consulta y sin consulta; aclarar que depende del servicio externo.
Mostrar en Limpieza el conflicto 409 al intentar borrar un género en uso, eliminar primero la playlist y repetir el borrado.
Explicar que 204 significa operación exitosa sin cuerpo de respuesta; no esperar JSON en esos casos.
6. Preguntas probables y respuestas concisas
¿Por qué se valida un género si hay un ref?
“El ref de Mongoose documenta la referencia y permite populate, pero no fuerza una clave foránea ni confirma que exista el documento. Por eso lo consultamos antes de crear o cambiar la playlist.”

¿Cómo impiden que un usuario manipule su plan o dueño?
“El dueño se toma del usuario cargado a partir del JWT. El rol y el plan no se confían al body para crear una cuenta; el registro asigna los valores permitidos por el servidor.”

¿Qué pasa si falla Gemini?
“Se intenta generar la descripción y, si la IA no está disponible, se responde con una descripción predeterminada para que esa dependencia no impida usar la aplicación.”

¿Cuál es la diferencia entre 401 y 403?
“401 indica que falta autenticación o que el token no es válido. 403 indica que el usuario autenticado no tiene permiso o que una regla —como el límite Plus— impide la operación.”

¿Qué evidencia hay de pruebas?
“La colección Postman contiene 95 requests; en la ejecución local previa pasaron los 95 y 152 assertions. Además, hay pruebas automatizadas para los límites, referencias Mongo y el arranque de la API.”

7. Despliegue: no afirmar más de lo verificado
La última causa de 500 que compartiste fue una incompatibilidad ERR_REQUIRE_ESM entre sanitize-html y htmlparser2 en Node 24. Ya se había ajustado la dependencia para ese runtime y se verificó localmente; no tengo confirmación de que una implementación posterior en Vercel haya quedado desplegada y respondiendo correctamente. Para la defensa, separá “la prueba local” de “la verificación en producción” y, antes de afirmar que Vercel funciona, comprobá /health y un request de API contra el deployment vigente.
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
