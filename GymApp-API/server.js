require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/user');

const {
  newActivityController,
  getActivityController,
  modifyActivityController,
  deleteActivityController,
  requireAdmin,
  getActivitiesController,
} = require('./controllers/activities');
const { typologyFilter } = require('./db/filterActivities');
const { likeActivity } = require('./controllers/likes');
const { authenticateUser } = require('./middlewares/authenticateUser');

const app = express();

app.use(express.json());
//agrego el middelware de fireupload para agregar las imagenes
app.use(fileUpload());
app.use(morgan('dev'));
app.use(cors());

//Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

//Rutas de activities
app.get('/activities', getActivitiesController);
app.post('/activity', requireAdmin, newActivityController);
app.get('/activity/:id', getActivityController);
app.put('/activity/:id', requireAdmin, modifyActivityController);
app.delete('/activity/:id', requireAdmin, deleteActivityController);
app.get('/activity', typologyFilter);

app.post('/activities/:activityId/like', authenticateUser, likeActivity);

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestion de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});
// Lanzamos el servidor
app.listen(3000, () => {
  console.log('Servidor funcionando! 🏋️💪');
});
