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

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute(request.payload, credentialId, threadId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(credentialId, threadId, commentId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async postCommentReplyHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addedReply = await addCommentUseCase.execute(request.payload, credentialId, threadId, commentId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentReplyHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    await deleteCommentUseCase.execute(credentialId, threadId, commentId, replyId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async putCommentLikeHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = {
      userId,
      threadId,
      commentId,
    }

    await likeCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
