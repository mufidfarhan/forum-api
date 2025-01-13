const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, userId, threadId, commentId) {
    const newComment = new NewComment(useCasePayload);

    await this._threadRepository.getThreadById(threadId);

    if (!commentId) {
      return this.addNewComment(newComment, userId, threadId);
    };

    return this.addCommentReply(newComment, userId, threadId, commentId);
  }

  async addNewComment(newComment, userId, threadId) {
    return this._commentRepository.addComment(newComment, 'comment', userId, threadId);
  }

  async addCommentReply(newComment, userId, threadId, commentId) {
    await this._commentRepository.getCommentById(commentId);

    return this._commentRepository.addComment(newComment, 'reply', userId, threadId, commentId);
  }
}

module.exports = AddCommentUseCase;
