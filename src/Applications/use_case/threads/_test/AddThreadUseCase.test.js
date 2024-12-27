const NewThread = require('../../../../Domains/thread/entities/NewThread');
const AddedThread = require('../../../../Domains/thread/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/thread/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('NewThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const credentialId = 'user-123';
    const useCasePayload = {
      title: 'a thread',
      body: 'This is a thread',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: credentialId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: credentialId,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), credentialId);
  });
});