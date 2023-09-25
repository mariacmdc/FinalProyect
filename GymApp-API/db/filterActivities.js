const { getConnection } = require('./db');

const typologyFilter = async (req, res, next) => {
  let connection;
  const typology = 'Performance';
  try {
    connection = await getConnection();
    const result = await connection.query(
      `
            SELECT * FROM activities WHERE typology = ?
            `,
      [typology]
    );
    return result;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  typologyFilter,
};
