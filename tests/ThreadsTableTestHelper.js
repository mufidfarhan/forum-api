/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'a thread',
    body = 'a body thread',
    owner = 'user-123',
    createdAt = new Date().toISOString(),
    updatedAt = createdAt,
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
