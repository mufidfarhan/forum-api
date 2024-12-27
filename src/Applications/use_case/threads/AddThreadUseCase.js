const NewThread = require('../../../Domains/thread/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, credentialId);
  }
}

module.exports = AddThreadUseCase;
