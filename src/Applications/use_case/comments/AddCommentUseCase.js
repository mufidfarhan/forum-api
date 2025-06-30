const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, userId, threadId, commentId) {
    const newComment = new NewComment(useCasePayload);

    await this._threadRepository.verifyThreadAvailability(threadId);

    if (commentId) {
      return this._addCommentReply(newComment, userId, threadId, commentId);
    }
    
    return this._addNewComment(newComment, userId, threadId);
  }

  async _addNewComment(newComment, userId, threadId) {
    return this._commentRepository.addComment(newComment, 'comment', userId, threadId);
  }

  async _addCommentReply(newComment, userId, threadId, commentId) {
    await this._commentRepository.verifyCommentAvailability(commentId);
    return this._commentRepository.addComment(newComment, 'reply', userId, threadId, commentId);
  }
}

module.exports = AddCommentUseCase;
