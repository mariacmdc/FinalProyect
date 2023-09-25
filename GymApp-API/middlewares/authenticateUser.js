const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { SECRET } = process.env;

function authenticateUser(req, res, next) {
  try {
    // Obtener el token de la cabecera de autorización (Bearer Token)
    const token = req.header('Authorization');

    // Verificar si se proporcionó el token en la cabecera
    if (!token) {
      throw generateError('Token de autenticación no proporcionado', 401);
    }
    // Verificar y decodificar el token JWT

    let decodedToken;
    try {
      decodedToken = jwt.verify(token.replace('Bearer ', ''), SECRET);
    } catch (error) {
      throw generateError('Token de autenticación inválido', 401);
    }

    // Asegurarnos de que el token tenga la información necesaria
    if (!decodedToken || !decodedToken.id || !decodedToken.role) {
      throw generateError('Token de autenticación inválido', 401);
    }
    // Agregar el usuario y su rol a la solicitud para que otras rutas lo utilicen
    req.user = {
      id: decodedToken.id,
      role: decodedToken.role,
    };

    // Continuar con el siguiente middleware o ruta
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticateUser };
