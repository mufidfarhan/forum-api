const CommentLikeRepository = require('../../Domains/comments/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getLikeComment(payload) {
    const { userId, commentId } = payload;

    const query = {
      text: 'SELECT * FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    }

    const result = await this._pool.query(query);

    return result.rows;
  }

  async addLikeComment(payload) {
    const { userId, commentId } = payload;
    const id = `like-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5)',
      values: [id, userId, commentId, createdAt, updatedAt],
    }

    return await this._pool.query(query)
  }

  async deleteLikeComment(payload) {
    const { userId, commentId } = payload;

    const query = {
      text: 'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    }

    return await this._pool.query(query)
  }
}

module.exports = CommentLikeRepositoryPostgres;

