/* eslint-disable camelcase */
const ThreadDetails = require('../../../../Domains/threads/entities/ThreadDetails');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const CommentDetails = require('../../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../../Domains/comments/entities/ReplyDetails');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly when there are comments', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreadsFromDb = [
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: 'comment-456',
      },
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: 'comment-789',
      },
    ];

    const mockCommentsFromDb = {
      'comment-456': [
        {
          comment_id: 'comment-456',
          comment_content: 'a comment',
          comment_username: 'dicoding',
          comment_date: '2025-01-01',
          comment_deleted: false,
          reply_id: 'reply-456',
          reply_content: 'a comment reply',
          reply_username: 'john',
          reply_date: '2025-01-01',
          reply_deleted: false,
        },
        {
          comment_id: 'comment-456',
          comment_content: 'a comment',
          comment_username: 'dicoding',
          comment_date: '2025-01-01',
          comment_deleted: false,
          reply_id: 'reply-789',
          reply_content: 'a comment reply',
          reply_username: 'dicoding',
          reply_date: '2025-01-01',
          reply_deleted: true,
        },
      ],
      'comment-789': [
        {
          comment_id: 'comment-789',
          comment_content: 'a comment',
          comment_username: 'dicoding',
          comment_date: '2025-01-01',
          comment_deleted: true,
          reply_id: null,
          reply_content: null,
          reply_username: null,
          reply_date: null,
          reply_deleted: null,
        },
      ]
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadsFromDb));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(mockCommentsFromDb[commentId]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const mockThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-01-01',
      username: 'dicoding',
      comments: [
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
              content: '**balasan telah dihapus**',
              date: '2025-01-01',
              username: 'dicoding',
            }),
          ],
          content: 'a comment',
        }),
        new CommentDetails({
          id: 'comment-789',
          username: 'dicoding',
          date: '2025-01-01',
          replies: [],
          content: '**komentar telah dihapus**',
        }),
      ]
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith('comment-456');
    expect(mockCommentRepository.getCommentById).toBeCalledWith('comment-789');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledTimes(2);
    expect(threadDetails).toEqual(mockThreadDetails);
  });

  it('should orchestrating the get thread action correctly when there are no comments', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreadsFromDb = [
      {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2025-01-01',
        thread_username: 'dicoding',
        comment_id: null,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadsFromDb));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
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
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(threadDetails).toEqual(mockThreadDetails);
  });

  it('should throw error when thread is not found', async () => {
    // Arrange
    const threadId = 'wrong-id';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => {
        throw new NotFoundError('Thread tidak ditemukan');
      });

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(getThreadUseCase.execute(threadId))
      .rejects.toThrowError(NotFoundError);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
  });
});