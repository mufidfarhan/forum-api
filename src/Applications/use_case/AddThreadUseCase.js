const NewThread = require('../../Domains/thread/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(userId, useCasePayload) {
    const { username } = await this._userRepository.getUserById(userId)
    
    useCasePayload.owner = username;

    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
