const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../../Domains/comments/CommentLikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add like action correctly to a comment', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    const commentLike = {
      userId: 'user-123',
      commentId: 'comment-123',
    }

    const mockCommentLikeData = [];
    // {
    //   user_id: 'user-123',
    //   comment_id: 'comment-123',
    // };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.getLikeComment = jest.fn().mockImplementation(() => Promise.resolve(mockCommentLikeData))
    mockCommentLikeRepository.addLikeComment = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.getLikeComment).toBeCalledWith(commentLike);
    expect(mockCommentLikeRepository.addLikeComment).toBeCalledWith(commentLike);
  });

  it('should orchestrating the delete like action correctly to a comment', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    const commentLike = {
      userId: 'user-123',
      commentId: 'comment-123',
    }

    const mockCommentLikeData = [
      {
        user_id: 'user-123',
        comment_id: 'comment-123',
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.getLikeComment = jest.fn().mockImplementation(() => Promise.resolve(mockCommentLikeData))
    mockCommentLikeRepository.deleteLikeComment = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.getLikeComment).toBeCalledWith(commentLike);
    expect(mockCommentLikeRepository.deleteLikeComment).toBeCalledWith(commentLike);
  });
});