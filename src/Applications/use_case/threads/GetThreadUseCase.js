const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/comments/entities/ReplyDetails');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    const threads = await this._threadRepository.getThreadById(threadId);

    const comments = (threads.length >= 1 && threads[0].comment_id)
      ? await Promise.all(threads.map(async (thread) => {
        return await this._getComment(thread.comment_id);
      }))
      : [];

    return new ThreadDetails({
      id: threads[0].thread_id,
      title: threads[0].thread_title,
      body: threads[0].thread_body,
      date: threads[0].thread_date,
      username: threads[0].thread_username,
      comments: comments,
    });
  }

  async _getComment(commentId) {
    const comment = await this._commentRepository.getCommentById(commentId);

    const replies = (comment.length >= 1 && comment[0].reply_id)
      ? comment.map((row) => new ReplyDetails({
        id: row.reply_id,
        username: row.reply_username,
        date: row.reply_date,
        content: row.reply_deleted
          ? '**balasan telah dihapus**' : row.reply_content,
        likeCount: Number(row.reply_like_count),
      }))
      : [];

    return new CommentDetails({
      id: comment[0].comment_id,
      username: comment[0].comment_username,
      date: comment[0].comment_date,
      replies: replies,
      content: comment[0].comment_deleted
        ? '**komentar telah dihapus**' : comment[0].comment_content,
      likeCount: Number(comment[0].comment_like_count),
    });
  }
}

module.exports = GetThreadUseCase;
