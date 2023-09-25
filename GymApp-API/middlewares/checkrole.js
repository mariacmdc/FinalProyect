const { selectUserById } = require('../db/user');
const { generateError } = require('../helpers');

const isAdmin = async (req, res, next) => {
  try {
    const loggerdUser = await selectUserById(req.auth.id);

    if (loggerdUser.role !== 'admin') {
      const error = generateError(
        'Necesitas un administrador para poder borrar un usuario hacer una modificación en las actividades',
        403
      );
      return next(error);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;


//mas que nada se ha un const error, para que funcione el generate.
