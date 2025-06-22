const CommentDetails = require('../CommentDetails');

describe('a CommentDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: '2024-04-04',
      content: 'a comment',
      replies: [],
    };

    // Action & Assert
    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-04-04',
      content: 'a comment',
      replies: [],
    };

    // Action
    const commentDetails = new CommentDetails(payload);

    // Assert
    expect(commentDetails.id).toEqual(payload.id);
    expect(commentDetails.username).toEqual(payload.username);
    expect(commentDetails.date).toEqual(payload.date);
    expect(commentDetails.content).toEqual(payload.content);
    expect(commentDetails.replies).toEqual(payload.replies);
  });
});