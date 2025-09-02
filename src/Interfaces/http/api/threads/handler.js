const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
      const { id: credentialId } = req.auth.credentials;
      const addedThread = await addThreadUseCase.execute(req.body, credentialId);

      res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadByIdHandler(req, res, next) {
    try {
      const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
      const { threadId } = req.params;
      const thread = await getThreadUseCase.execute(threadId);

      res.json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ThreadsHandler;
