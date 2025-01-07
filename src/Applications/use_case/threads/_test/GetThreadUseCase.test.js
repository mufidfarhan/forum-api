/* eslint-disable camelcase */
const ThreadDetails = require('../../../../Domains/thread/entities/ThreadDetails');
const CommentDetails = require('../../../../Domains/comments/entities/CommentDetails');
const ThreadRepository = require('../../../../Domains/thread/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly when there are no comments', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThreadData = [
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: 'comment-456',
        comment_username: 'johndoe',
        comment_date: '2025-01-02',
        comment_deleted: false,
        comment_content: 'A comment',
      },
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: 'comment-789',
        comment_username: 'janedoe',
        comment_date: '2025-01-03',
        comment_deleted: true,
        comment_content: 'Another comment',
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const expectedThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-01-01',
      username: 'dicoding',
      comments: [
        new CommentDetails({
          id: 'comment-456',
          username: 'johndoe',
          date: '2025-01-02',
          content: 'A comment',
        }),
        new CommentDetails({
          id: 'comment-789',
          username: 'janedoe',
          date: '2025-01-03',
          content: '**komentar telah dihapus**',
        }),
      ],
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(threadDetails).toEqual(JSON.parse(JSON.stringify(expectedThreadDetails)));
  });
});