// #region ToDo
/*
## TODO

- [x] Build out the Postman collection (folders per resource, tests per status code, `prod_base_url` collection variable).
- [ ] Deploy to Vercel + MongoDB Atlas, get a public URL, run the full collection against it once for real, and point `prod_base_url` at it before final submission.
- [ ] Obligatorio 2: React/Redux frontend consuming these endpoints.

left_at:
//Run npm install, then npm run seed — you should see console logs confirming MongoDB connected and the admin 
// user/genres were created. Then npm run dev and open http://localhost:4000/health in your browser; you should
//  see {"status":"success","message":"API is up"}.


-   Build out the Postman collection (folders per resource, tests per status code, `prod_base_url` collection variable) 
-   Deploy to Vercel + MongoDB Atlas and get a public URL.
-   Obligatorio 2: React/Redux frontend consuming these endpoints. 


Click Import.
Choose File.
Select music-playlist-api.postman_collection.json.
Click Import.
Postman will create the collection.
Before running it, update prod_base_url in the collection variables to your API URL, such as http://localhost:4000.
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
