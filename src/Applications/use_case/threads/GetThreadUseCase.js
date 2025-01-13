const ThreadDetails = require('../../../Domains/thread/entities/ThreadDetails');

class GetThreadUseCase {
  constructor({ threadRepository, getCommentUseCase }) {
    this._threadRepository = threadRepository;
    this._getCommentUseCase = getCommentUseCase;
  }

  async execute(threadId) {
    const threads = await this._threadRepository.getThreadById(threadId);

    const comments = (threads.length >= 1 && threads[0].comment_id)
      ? await Promise.all(threads.map(async (thread) => {
        const comment = await this._getCommentUseCase.execute(thread.comment_id);
        return comment;
      }))
      : [];

    const thread = new ThreadDetails({
      id: threads[0].thread_id,
      title: threads[0].thread_title,
      body: threads[0].thread_body,
      date: threads[0].thread_date,
      username: threads[0].thread_username,
      comments: comments,
    });

    return thread;
  }
}

module.exports = GetThreadUseCase;
