const NewThread = require('../../../Domains/thread/entities/NewThread');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const UserRepository = require('../../../Domains/thread/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('NewThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange

    const userId = 'user-123'
    const useCasePayload = {
      title: 'a thread',
      body: 'This is a thread',
    };

    const mockUserData = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    }

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: mockUserData.username,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockUserData))
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: mockUserData.username,
    }));
    expect(mockUserRepository.getUserById).toBeCalledWith(userId);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: mockUserData.username,
    }));
  });
});