const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

// Ruta para dar "like" a una publicación
const likeActivity = async (req, res, next) => {
  const activityId = req.params.activityId;
  const userId = req.user.id;
  console.log(activityId);
  const conn = await getConnection();
  try {
    // Verificar si el usuario pertenece al grupo específico que puede dar "like"
    // const [user] = await conn.query('SELECT * FROM users WHERE id = ?', [
    //   userId,
    // ]);
    // if (!user || user.role !== 'Cliente') {
    //   conn.release();
    //   return res
    //     .status(403)
    //     .json({ error: 'Usuario no autorizado para dar "like"' });
    // }

    // Verificar si el usuario ya dio "like" a la publicación previamente
    const [activity] = await conn.query(
      'SELECT * FROM activities WHERE id = ?',
      [activityId]
    );
    if (!activity) {
      throw generateError('Publicación no encontrada', 404);
    }
    const [[like]] = await conn.query(
      'SELECT * FROM likes WHERE user_id = ? AND activity_id = ?',
      [userId, activityId]
    );
    let didUserLike;
    if (like) {
      didUserLike = false;
      await conn.query(
        'DELETE FROM likes WHERE user_id = ? AND activity_id = ?',
        [userId, activityId]
      );
    } else {
      didUserLike = true;
      await conn.query(
        'INSERT INTO likes (user_id, activity_id) VALUES (?, ?)',
        [userId, activityId]
      );
    }

    const [[{ likes }]] = await conn.query(
      'SELECT COUNT(*) likes FROM likes WHERE activity_id = ?',
      [activityId]
    );
    const actionMSG = didUserLike ? 'dio' : 'quitó';
    res.json({
      data: { likes, didUserLike },
      message: `El usuario ${actionMSG} "like" a la publicación exitosamente`,
    });
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};

module.exports = { likeActivity };
