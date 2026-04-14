// Importa las librerías necesarias
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Importa el arreglo de usuarios y el middleware de autenticación
const users = require("./data/users");
const authMiddleware = require("./middleware/authMiddleware");

// Crea la aplicación Express
const app = express();

// Define el puerto donde correrá el servidor
const PORT = 3000;

// Clave secreta para firmar el JWT
const SECRET_KEY = "clave_super_secreta";

// Middleware generales
app.use(cors()); // Permite comunicación entre cliente y servidor
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Permite recibir datos de formularios
app.use(cookieParser()); // Permite leer cookies

// Sirve los archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, "../public")));

// Ruta principal que muestra la página de inicio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Ruta de login
app.post("/login", (req, res) => {
  // Obtiene el usuario y la contraseña enviados por el cliente
  const { username, password } = req.body;

  // Valida que ambos campos hayan sido ingresados
  if (!username || !password) {
    return res.status(400).json({
      message: "Debe ingresar usuario y contraseña."
    });
  }

  // Busca un usuario que coincida con las credenciales ingresadas
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  // Si no encuentra coincidencia, devuelve error 401
  if (!user) {
    return res.status(401).json({
      message: "Credenciales incorrectas. No autorizado."
    });
  }

  // Si las credenciales son correctas, genera un token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username }, // Datos que viajarán en el token
    SECRET_KEY, // Clave secreta
    { expiresIn: "1h" } // Expira en 1 hora
  );

  // Envía el token al cliente en una cookie segura
  res.cookie("token", token, {
    httpOnly: true, // Evita acceso desde JavaScript del cliente
    secure: false, // En un entorno HTTPS debería cambiarse a true
    maxAge: 60 * 60 * 1000 // Duración de 1 hora
  });

  // Respuesta si el login fue exitoso
  res.status(200).json({
    message: "Login exitoso."
  });
});

// Ruta privada protegida con middleware
app.get("/perfil", authMiddleware, (req, res) => {
  // Si el token es válido, devuelve acceso autorizado
  res.status(200).json({
    message: "Acceso autorizado a ruta privada.",
    user: req.user
  });
});

// Ruta para cerrar sesión
app.post("/logout", (req, res) => {
  // Elimina la cookie del token
  res.clearCookie("token");

  // Confirma el cierre de sesión
  res.status(200).json({
    message: "Sesión cerrada correctamente."
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
