/* eslint-disable camelcase */
const CommentDetails = require('../../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../../Domains/comments/entities/ReplyDetails');
const CommentRepository = require('../../../../Infrastructures/repository/CommentRepositoryPostgres');
const GetCommentUseCase = require('../GetCommentUseCase');

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
        reply_id: 'reply-456',
        reply_content: 'a comment reply',
        reply_username: 'john',
        reply_date: '2025-01-01',
        reply_deleted: false,
      },
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        reply_id: 'reply-789',
        reply_content: 'second comment reply',
        reply_username: 'dicoding',
        reply_date: '2025-01-01',
        reply_deleted: false,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
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
        }),
        new ReplyDetails({
          id: 'reply-789',
          content: 'second comment reply',
          date: '2025-01-01',
          username: 'dicoding',
        }),
      ],
      content: 'a comment',
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
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
        reply_id: 'reply-456',
        reply_content: 'a comment reply',
        reply_username: 'john',
        reply_date: '2025-01-01',
        reply_deleted: false,
      },
      {
        comment_id: 'comment-123',
        comment_content: 'a comment',
        comment_username: 'dicoding',
        comment_date: '2025-01-01',
        comment_deleted: false,
        reply_id: 'reply-789',
        reply_content: 'second comment reply',
        reply_username: 'dicoding',
        reply_date: '2025-01-01',
        reply_deleted: true,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
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
        }),
        new ReplyDetails({
          id: 'reply-789',
          content: '**komentar telah dihapus**',
          date: '2025-01-01',
          username: 'dicoding',
        }),
      ],
      content: 'a comment',
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
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
        reply_id: null,
        reply_content: null,
        reply_username: null,
        reply_date: null,
        reply_deleted: null,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
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
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
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
        reply_id: null,
        reply_content: null,
        reply_username: null,
        reply_date: null,
        reply_deleted: null,
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
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
    });

    // Action
    const commentDetails = await getCommentUseCase.execute(commentId);

    // Assert
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(commentDetails).toEqual(mockCommentDetails);
  });
});