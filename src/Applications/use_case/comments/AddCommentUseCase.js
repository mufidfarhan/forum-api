const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, userId, threadId) {
    const newComment = new NewComment(useCasePayload);

    await this._threadRepository.getThreadById(threadId);

    return this._commentRepository.addComment(newComment, userId, threadId);
  }
}

module.exports = AddCommentUseCase;
