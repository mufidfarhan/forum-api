const AddedThread = require('../../Domains/thread/entities/AddedThread');
const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, userId) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, body, owner',
      values: [id, title, body, userId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const thread = result.rows[0];
    return thread;
  }
}

module.exports = ThreadRepositoryPostgres;
