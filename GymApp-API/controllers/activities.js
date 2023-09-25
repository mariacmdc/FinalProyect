const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const {
  modifyActivity,
  createActivities,
  getActivityById,
  deleteById,
  getActivities,
} = require('../db/activities');
const { generateError, processAndSavingImg } = require('../helpers');

const newActivityController = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const { name, description, typology, muscleGroup } = req.body;

    if (
      !name ||
      !description ||
      !typology ||
      !muscleGroup ||
      !req.files?.image
    ) {
      throw generateError('Debes enviar los valores correctos', 400);
    }

    // validar si existe actividad con el mismo nombre...

    console.log(req.files.image);

    const imageName = await processAndSavingImg(req.files.image.data, 1000);

    const id = await createActivities(
      name,
      description,
      imageName,
      typology,
      muscleGroup
    );

    const createdActivity = await getActivityById(id);

    res.send({
      status: 'Ok',
      message: `Activity created with Id: ${id}`,
      data: createdActivity,
    });
  } catch (error) {
    next(error);
  }
};

const getActivityController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await getActivityById(id);
    res.send({
      status: 'Ok',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

const getActivitiesController = async (req, res, next) => {
  try {
    console.log(req.query);
    const activities = await getActivities(req.query);

    res.send({
      status: 'Ok',
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

const modifyActivityController = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw generateError('Debes enviar algún campo para actualizar', 400);
    }

    const { id } = req.params;

    const activity = await getActivityById(id);

    if (!activity.id) {
      throw generateError('La actividad no existe', 404);
    }

    const updatedActivity = { ...activity, ...req.body };

    if (req.files?.image) {
      updatedActivity.image = await processAndSavingImg(
        req.files.image.data,
        1000
      );
    }

    await modifyActivity(updatedActivity);

    res.send({
      status: 'Ok',
      message: `Activity updated with Id: ${id}`,
      data: updatedActivity,
    });
  } catch (error) {
    next(error);
  }
};

const deleteActivityController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await deleteById(id);
    res.send({
      status: 'Ok',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};
function requireAdmin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];

  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  let payload = jwt.verify(token, process.env.SECRET);
  if (!payload) {
    return res.status(401).send('Unauthorized request');
  }
  if (payload.role != 'administrator') {
    return res.status(401).send('Unauthorized request');
  }
  next();
}

module.exports = {
  newActivityController,
  getActivityController,
  modifyActivityController,
  deleteActivityController,
  requireAdmin,
  getActivitiesController,
};
