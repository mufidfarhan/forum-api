const CommentLikeCount = require('../CommentLikeCount');

describe('a CommentLikeCount entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
    }

    // Action and Assert
    expect(() => new CommentLikeCount(payload)).toThrowError('COMMENT_LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      totalLikes: '12',
    };

    // Action and Assert
    expect(() => new CommentLikeCount(payload)).toThrowError('COMMENT_LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentLikes object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      totalLikes: 12,
    };

    // Action
    const commentLikes = new CommentLikeCount(payload);

    // Assert
    expect(commentLikes.commentId).toEqual(payload.commentId);
    expect(commentLikes.totalLikes).toEqual(payload.totalLikes);
  });
});