const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, objective, userId, threadId, commentId = null) {
    const { content } = newComment;
    const id = `${objective}-${this._idGenerator()}`;
    const isDelete = false;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, content, owner',
      values: [id, content, isDelete, userId, threadId, commentId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING *',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentById(commentId) {
    const query = {
      text:
        `SELECT
          comments.id AS comment_id,
          comments.content AS comment_content,
          comment_users.username AS comment_username,
          comments.created_at AS comment_date,
          comments.is_delete AS comment_deleted,
          replies.id AS reply_id,
          replies.content AS reply_content,
          reply_users.username AS reply_username,
          replies.created_at AS reply_date,
          replies.is_delete AS reply_deleted
        FROM
          comments
        LEFT JOIN
          users AS comment_users ON comments.owner = comment_users.id
        LEFT JOIN
          comments AS replies ON comments.id = replies.parent_id AND replies.id LIKE 'reply-%'
        LEFT JOIN
          users AS reply_users ON replies.owner = reply_users.id
        WHERE
          comments.id = $1
        ORDER BY
          comments.created_at ASC,
          replies.created_at ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    return result.rows;
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = CommentRepositoryPostgres;
