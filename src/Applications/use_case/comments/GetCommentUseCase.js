const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/comments/entities/ReplyDetails');

class GetCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId) {
    const comments = await this._commentRepository.getCommentById(commentId);

    const replies = (comments.length >= 1 && comments[0].reply_id)
      ? comments.map((row) => new ReplyDetails({
        id: row.reply_id,
        username: row.reply_username,
        date: row.reply_date,
        content: row.reply_deleted
          ? '**balasan telah dihapus**' : row.reply_content,
      }))
      : [];

    const comment = new CommentDetails({
      id: comments[0].comment_id,
      username: comments[0].comment_username,
      date: comments[0].comment_date,
      replies: JSON.parse(JSON.stringify(replies)),
      content: comments[0].comment_deleted
        ? '**komentar telah dihapus**' : comments[0].comment_content,
    });

    return comment;
  }
}

module.exports = GetCommentUseCase;