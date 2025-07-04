/* eslint-disable camelcase */
const CommentDetails = require('../../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../../Domains/comments/entities/ReplyDetails');
const CommentRepository = require('../../../../Infrastructures/repository/CommentRepositoryPostgres');
const GetCommentUseCase = require('../GetCommentUseCase');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('GetCommentUseCase', () => {
  it('should orchestrating the get comment action correctly when there are replies', async () => {
    // Arrange
    const commentId = 'comment-123';
    const mockCommentData = [
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        comment_like_count: '0',
        reply_id: 'reply-456',
        reply_content: 'a comment reply',
        reply_username: 'john',
        reply_date: '2025-01-01',
        reply_deleted: false,
        reply_like_count: '0'
      },
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        comment_like_count: '0',
        reply_id: 'reply-789',
        reply_content: 'second comment reply',
        reply_username: 'dicoding',
        reply_date: '2025-01-01',
        reply_deleted: false,
        reply_like_count: '0'
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentData));

    /** creating use case instance */
    const getCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const mockCommentDetails = new CommentDetails({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-01-01',
      replies: [
        new ReplyDetails({
          id: 'reply-456',
          content: 'a comment reply',
          date: '2025-01-01',
          username: 'john',
          likeCount: 0,
        }),
        new ReplyDetails({
          id: 'reply-789',
          content: 'second comment reply',
          date: '2025-01-01',
          username: 'dicoding',
          likeCount: 0,
        }),
      ],
      content: 'a comment',
      likeCount: 0,
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(commentDetails).toEqual(mockCommentDetails);
  });

  it('should orchestrating the get comment action correctly when there are deleted replies', async () => {
    // Arrange
    const commentId = 'comment-123';
    const mockCommentData = [
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        comment_like_count: '0',
        reply_id: 'reply-456',
        reply_content: 'a comment reply',
        reply_username: 'john',
        reply_date: '2025-01-01',
        reply_deleted: false,
        reply_like_count: '0',
      },
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        comment_like_count: '0',
        reply_id: 'reply-789',
        reply_content: 'second comment reply',
        reply_username: 'dicoding',
        reply_date: '2025-01-01',
        reply_deleted: true,
        reply_like_count: '0',
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentData));

    /** creating use case instance */
    const getCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const mockCommentDetails = new CommentDetails({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-01-01',
      replies: [
        new ReplyDetails({
          id: 'reply-456',
          content: 'a comment reply',
          date: '2025-01-01',
          username: 'john',
          likeCount: 0,
        }),
        new ReplyDetails({
          id: 'reply-789',
          content: '**balasan telah dihapus**',
          date: '2025-01-01',
          username: 'dicoding',
          likeCount: 0,
        }),
      ],
      content: 'a comment',
      likeCount: 0,
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(commentDetails).toEqual(mockCommentDetails);
  });

  it('should orchestrating the get comment action correctly when there are no replies', async () => {
    // Arrange
    const commentId = 'comment-123';
    const mockCommentData = [
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        comment_like_count: '0',
        reply_id: null,
        reply_content: null,
        reply_username: null,
        reply_date: null,
        reply_deleted: null,
        reply_like_count: null,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentData));

    /** creating use case instance */
    const getCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const mockCommentDetails = new CommentDetails({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-01-01',
      replies: [],
      content: 'a comment',
      likeCount: 0,
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(commentDetails).toEqual(mockCommentDetails);
  });

  it('should orchestrating the get comment action correctly when there are deleted comment', async () => {
    // Arrange
    const commentId = 'comment-123';
    const mockCommentData = [
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: true,
        comment_like_count: '0',
        reply_id: null,
        reply_content: null,
        reply_username: null,
        reply_date: null,
        reply_deleted: null,
        reply_like_count: null,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentData));

    /** creating use case instance */
    const getCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const mockCommentDetails = new CommentDetails({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-01-01',
      replies: [],
      content: '**komentar telah dihapus**',
      likeCount: 0,
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(commentDetails).toEqual(mockCommentDetails);
  });

  it('should throw error when comment is not found', async () => {
    // Arrange
    const commentId = 'wrong-id';

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => {
        throw new NotFoundError('Thread tidak ditemukan');
      });

    const getCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(getCommentUseCase.execute(commentId))
      .rejects.toThrowError(NotFoundError);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(commentId);
  });
});