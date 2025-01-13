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
          comments.id AS comment_id
        FROM
          threads
        LEFT JOIN
          users AS thread_users ON threads.owner = thread_users.id
        LEFT JOIN
          comments AS comments ON threads.id = comments.thread_id AND comments.id LIKE 'comment-%'
        WHERE
          threads.id = $1
        ORDER BY
          comments.created_at ASC`,
      values: [threadId],
    };

    // `SELECT
    //       threads.id AS thread_id,
    //       threads.title AS thread_title,
    //       threads.body AS thread_body,
    //       threads.created_at AS thread_date,
    //       thread_users.username AS thread_username,
    //       comments.id AS comment_id,
    //       comments.content AS comment_content,
    //       comment_users.username AS comment_username,
    //       comments.created_at AS comment_date,
    //       comments.is_delete AS comment_delete,
    //       replies.id AS reply_id,
    //       replies.content AS reply_content,
    //       reply_users.username AS reply_username,
    //       replies.created_at AS reply_date,
    //       replies.is_delete AS reply_deleted
    //     FROM
    //       threads
    //     LEFT JOIN
    //       users AS thread_users ON threads.owner = thread_users.id
    //     LEFT JOIN
    //       comments AS comments ON threads.id = comments.thread_id AND comments.id LIKE 'comment-%'
    //     LEFT JOIN
    //       users AS comment_users ON comments.owner = comment_users.id
    //     LEFT JOIN
    //       comments AS replies ON comments.id = replies.parent_id AND replies.id LIKE 'reply-%'
    //     LEFT JOIN
    //       users AS reply_users ON replies.owner = reply_users.id
    //     WHERE
    //       threads.id = $1
    //     ORDER BY
    //       comments.created_at ASC,
    //       replies.created_at ASC`,

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
