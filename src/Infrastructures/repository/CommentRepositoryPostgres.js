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

  async addComment(newComment, userId, threadId) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const isDelete = false;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, isDelete, userId, threadId, createdAt, updatedAt],
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
