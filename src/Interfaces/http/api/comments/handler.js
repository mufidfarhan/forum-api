const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { id: threadId } = request.params;

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
}

module.exports = CommentsHandler;
