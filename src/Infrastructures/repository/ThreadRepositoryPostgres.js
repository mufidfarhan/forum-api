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
      text:
        `SELECT
          threads.id AS thread_id,
          threads.title AS thread_title,
          threads.body AS thread_body,
          threads.created_at AS thread_date,
          thread_users.username AS thread_username,
          comments.id AS comment_id,
          comment_users.username AS comment_username,
          comments.created_at AS comment_date,
          comments.content AS comment_content,
          comments.is_delete AS comment_deleted
        FROM
          threads
        LEFT JOIN
          users AS thread_users ON threads.owner = thread_users.id
        LEFT JOIN
          comments ON threads.id = comments.thread_id
        LEFT JOIN
          users AS comment_users ON comments.owner = comment_users.id
        WHERE
          threads.id = $1
        ORDER BY
          comments.created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
