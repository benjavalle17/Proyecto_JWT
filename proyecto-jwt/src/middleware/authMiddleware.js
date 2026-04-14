// Importa la librería jsonwebtoken para verificar el token
const jwt = require("jsonwebtoken");

// Clave secreta usada para verificar el JWT
const SECRET_KEY = "clave_super_secreta";

// Middleware que protege las rutas privadas
function authMiddleware(req, res, next) {
  // Obtiene el token guardado en la cookie
  const token = req.cookies.token;

  // Si no existe token, se niega el acceso
  if (!token) {
    return res.status(401).json({
      message: "Acceso denegado. No existe token."
    });
  }
  try {
    // Verifica si el token es válido y no ha expirado
    const decoded = jwt.verify(token, SECRET_KEY);

    // Guarda la información del usuario decodificada en la petición
    req.user = decoded;

    // Permite continuar a la ruta protegida
    next();
  } catch (error) {
    // Si el token es inválido o expiró, devuelve error 401
    return res.status(401).json({
      message: "Token inválido o expirado."
    });
  }
}
// Exporta el middleware para usarlo en el servidor
module.exports = authMiddleware;
