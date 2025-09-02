const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/comments/LikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const { id: credentialId } = req.auth.credentials;
      const { threadId } = req.params;
      const addedComment = await addCommentUseCase.execute(req.body, credentialId, threadId);

      res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const { id: credentialId } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      await deleteCommentUseCase.execute(credentialId, threadId, commentId);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  async postCommentReplyHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const { id: credentialId } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const addedReply = await addCommentUseCase.execute(req.body, credentialId, threadId, commentId);

      res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentReplyHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const { id: credentialId } = req.auth.credentials;
      const { threadId, commentId, replyId } = req.params;
      await deleteCommentUseCase.execute(credentialId, threadId, commentId, replyId);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  async putCommentLikeHandler(req, res, next) {
    try {
      const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
      const { id: userId } = req.auth.credentials;
      const { threadId, commentId } = req.params;

      const useCasePayload = {
        userId,
        threadId,
        commentId,
      };

      await likeCommentUseCase.execute(useCasePayload);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentsHandler;
