const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, userId);
  }
}

module.exports = AddThreadUseCase;
