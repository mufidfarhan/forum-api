const CommentLikes = require('../../../Domains/comments/entities/CommentLikes');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository
  }

  async execute(useCasePayload) {
    const commentLike = new CommentLikes(useCasePayload);

    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvailability(useCasePayload.commentId);

    const getLikeComment = await this._commentLikeRepository.getLikeComment(commentLike);

    if (getLikeComment.length !== 0) {
      return await this._commentLikeRepository.deleteLikeComment(commentLike);
    }

    return await this._commentLikeRepository.addLikeComment(commentLike);
  }
}

module.exports = LikeCommentUseCase;