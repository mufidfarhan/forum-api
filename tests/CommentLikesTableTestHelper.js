/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLikeComment({
    id = 'like-123',
    userId = 'user-123',
    commentId = 'thread-123',
    createdAt = new Date().toISOString(),
    updatedAt = createdAt,
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5)',
      values: [id, userId, commentId, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;