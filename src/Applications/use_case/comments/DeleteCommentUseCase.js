class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId, replyId) {
    await this._threadRepository.verifyThreadAvailability(threadId);

    if (replyId) {
      commentId = replyId;
    }

    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
