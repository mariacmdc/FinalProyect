const { query } = require('express');
const { getConnection } = require('./db');

const createActivities = async (
  name,
  description,
  image,
  typology,
  muscleGroup
) => {
  let connection;

  try {
    connection = await getConnection();
    const [newActivities] = await connection.query(
      `
    INSERT INTO activities (activity_name, description, image, typology, muscle_group) VALUES(?,?,?,?,?)
    `,
      [name, description, image, typology, muscleGroup]
    );
    return newActivities.insertId;
  } finally {
    // connection.relese();
  }
};

const getActivities = async (queryParams) => {
  let connection;

  try {
    const { typology, muscle_group } = queryParams;
    connection = await getConnection();

    let sqlQuery = 'SELECT * FROM activities';
    const values = [];
    let clause = 'WHERE';

    if (typology) {
      sqlQuery += ` ${clause} typology LIKE ?`;
      values.push(`%${typology}%`);
      clause = 'AND';
    }

    if (muscle_group) {
      sqlQuery += ` ${clause} muscle_group LIKE ?`;
      values.push(`%${muscle_group}%`);
    }
    const [activities] = await connection.query(sqlQuery, values);

    return activities;
  } finally {
    if (connection) connection.release();
  }
};

const getActivityById = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [resultActivity] = await connection.query(
      `
      SELECT a.*, COUNT(l.id) likes FROM activities a LEFT JOIN likes l ON a.id = l.activity_id WHERE a.id = ? ;
      `,
      [id]
    );
    return resultActivity;
  } finally {
    // if (connection) connection.relese();
  }
};

const deleteById = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [resultDelete] = await connection.query(
      `
      DELETE FROM activities WHERE id = ? 
      `,
      [id]
    );
    return resultDelete;
  } finally {
    // if (connection) connection.relese();
  }
};

const modifyActivity = async (
  id,
  name,
  description,
  image,
  typology,
  muscleGroup
) => {
  let connection;

  try {
    connection = await getConnection();
    console.log(id);
    const [modifyActivity] = await connection.query(
      `
    UPDATE activities SET activity_name = ?, description = ?, image = ?, typology = ?, muscle_group = ? WHERE id = ?
    `,
      [name, description, image, typology, muscleGroup, id]
    );
    return modifyActivity;
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = {
  modifyActivity,
  deleteById,
  getActivityById,
  createActivities,
  getActivities,
};
