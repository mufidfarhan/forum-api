const ThreadDetails = require('../../../Domains/thread/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const data = await this._threadRepository.getThreadById(threadId);

    const comments = (data.length >= 1 && data[0].comment_id)
      ? data.map((row) => new CommentDetails({
        id: row.comment_id,
        username: row.comment_username,
        date: row.comment_date,
        content: row.comment_deleted
          ? '**komentar telah dihapus**' : row.comment_content,
      }))
      : [];

    const thread = new ThreadDetails({
      id: data[0].thread_id,
      title: data[0].thread_title,
      body: data[0].thread_body,
      date: data[0].thread_date,
      username: data[0].thread_username,
      comments: JSON.parse(JSON.stringify(comments)), // konversi data kelas ke objek biasa
    });

    return JSON.parse(JSON.stringify(thread));
  }
}

module.exports = GetThreadUseCase;
