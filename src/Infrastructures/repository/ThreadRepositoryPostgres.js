const AddedThread = require('../../Domains/thread/entities/AddedThread');
const ThreadRepository = require('../../Domains/thread/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: `
        WITH added_thread AS (
          INSERT INTO threads
          VALUES($1, $2, $3, $4)
          RETURNING id, title, body, owner
        )
        SELECT
            at.id,
            at.title,
            at.body,
            u.username AS owner
        FROM added_thread at
        JOIN users u ON at.owner = u.id`,
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
