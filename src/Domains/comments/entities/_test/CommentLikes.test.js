const CommentLikes = require('../CommentLikes');

describe('a CommentLikes entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    }

    // Action and Assert
    expect(() => new CommentLikes(payload)).toThrowError('COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 123,
    };

    // Action and Assert
    expect(() => new CommentLikes(payload)).toThrowError('COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentLikes object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const commentLikes = new CommentLikes(payload);

    // Assert
    expect(commentLikes.userId).toEqual(payload.userId);
    expect(commentLikes.commentId).toEqual(payload.commentId);
  });
});