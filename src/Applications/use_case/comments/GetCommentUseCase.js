const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/comments/entities/ReplyDetails');

class GetCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId) {
    const data = await this._commentRepository.getCommentById(commentId);

    const replies = (data.length >= 1 && data[0].reply_id)
      ? data.map((row) => new ReplyDetails({
        id: row.reply_id,
        username: row.reply_username,
        date: row.reply_date,
        content: row.reply_deleted
          ? '**balasan telah dihapus**' : row.reply_content,
      }))
      : [];

    const comment = new CommentDetails({
      id: data[0].comment_id,
      username: data[0].comment_username,
      date: data[0].comment_date,
      replies: JSON.parse(JSON.stringify(replies)),
      content: data[0].comment_deleted
        ? '**komentar telah dihapus**' : data[0].comment_content,
    });

    return comment;
  }
}

module.exports = GetCommentUseCase;