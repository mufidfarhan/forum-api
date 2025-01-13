/* eslint-disable camelcase */
const ThreadDetails = require('../../../../Domains/thread/entities/ThreadDetails');
const ThreadRepository = require('../../../../Domains/thread/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const GetCommentUseCase = require('../../comments/GetCommentUseCase');
const GetThreadUseCase = require('../GetThreadUseCase');
const CommentDetails = require('../../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../../Domains/comments/entities/ReplyDetails');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly when there are comments', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-456';

    const mockThreads = [
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: 'comment-456',
      },
    ];

    const mockComments = [
      new CommentDetails({
        id: 'comment-456',
        username: 'dicoding',
        date: '2025-01-01',
        replies: [
          new ReplyDetails({
            id: 'reply-456',
            content: 'a comment reply',
            date: '2025-01-01',
            username: 'john',
          }),
          new ReplyDetails({
            id: 'reply-789',
            content: '**komentar telah dihapus**',
            date: '2025-01-01',
            username: 'dicoding',
          }),
        ],
        content: 'a comment',
      }),
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockGetCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreads));
    mockGetCommentUseCase.execute = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      getCommentUseCase: mockGetCommentUseCase,
    });

    const mockThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-01-01',
      username: 'dicoding',
      comments: [
        [
          new CommentDetails({
            id: 'comment-456',
            username: 'dicoding',
            date: '2025-01-01',
            replies: [
              new ReplyDetails({
                id: 'reply-456',
                content: 'a comment reply',
                date: '2025-01-01',
                username: 'john',
              }),
              new ReplyDetails({
                id: 'reply-789',
                content: '**komentar telah dihapus**',
                date: '2025-01-01',
                username: 'dicoding',
              }),
            ],
            content: 'a comment',
          }),
        ]
      ]
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockGetCommentUseCase.execute).toBeCalledWith(commentId);
    expect(threadDetails).toEqual(mockThreadDetails);
  });

  it('should orchestrating the get thread action correctly when there are no comments', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreads = [
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: null,
      },
    ];

    const mockComments = [];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockGetCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreads));
    mockGetCommentUseCase.execute = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      getCommentUseCase: mockGetCommentUseCase,
    });

    const mockThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-01-01',
      username: 'dicoding',
      comments: []
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(threadDetails).toEqual(mockThreadDetails);
  });
});