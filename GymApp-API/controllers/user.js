const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/user');

const newUserController = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    console.log(name);
    console.log(email);
    console.log(password);
    console.log(req.body);

    //me queda validar con joi esta aparte, indicándole el mínimo de caracteres de la password y que el mail es un email
    if (!name || !email || !password) {
      throw generateError(
        'Debes completar un nombre, un mail y una contraseña',
        400
      );
    }
    const id = await createUser(name, email, password, role);

    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};
const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    console.log(id);
    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email | !password) {
      throw generateError('Debes enviar un mail y una password', 400);
    }
    //Recojo los datos de la base de datos del usuario con ese email
    const user = await getUserByEmail(email);

    //compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw generateError('la contraseña no coinciden', 401);
    }
    //Creo el playload del token
    const payload = { id: user.id, role: user.role };
    //Firmo el token
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });
    //Envío el token

    console.log(email, password);
    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  loginController,
};
