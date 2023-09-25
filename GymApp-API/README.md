# GymApp

<body>
<h1>
    API de entrenamiento
</h1>
<p>
    Desarrolo del backend de una página web pensada para la gestión de un gimnasio. Donde los usuarios administradores, pueden compartir ejercicios y rutinas de entrenamiento. Para que los clientes (usuarios no administradores), puedan ver los ejercicios y programar su propia rutina de entrenamientos.
</p>

<p>
<h2>
    Entidades
</h2>

<ul> 
    <h3>User:</h3>
    <li>id</li>
    <li>email</li>
    <li>user_name</li>
    <li>password</li>
    <li>role</li>
    <li>created_at</li>
</ul>

<ul>
  <h3>Activities:</h3>
  <li>id</li>
  <li>activity_name</li>
  <li>description</li>
  <li>image (opcional)</li>
  <li>typology</li>
  <li>muscle_group</li>
  <li>created_at</li>
</ul>

<h2> 
    Endpoints
</h2>
<ul>
  <li>GET /user/:id</li>
  <li>POST /user</li>
  <li>POST /login</li>
  <li>POST /activity</li>
  <li>GET /activity/:id</li>
  <li>PUT /activity/:id</li>
  <li>DELETE /activity/:id</li>
  
</ul>
</p>

<h2>
    Módulos de Node.js
</h2>

<ul>
  <ul>Para instalar los módulos necesarios ejecuta la siguiente línea en tu consola:
    <li>npm i nodemon bcrypt dotenv express express-fileupload jsonwebtoken morgan mysql2 sharp uuid</li>
  </ul> 
</ul>

</body>
