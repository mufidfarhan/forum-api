/* eslint-disable camelcase */
const ReplyDetails = require('../ReplyDetails');

describe('a ReplyDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: '2024-04-04',
      content: 'a comment reply'
    };

    // Action & Assert
    expect(() => new ReplyDetails(payload)).toThrowError('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replyDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-04-04',
      content: 'a comment reply'
    };

    // Action
    const replyDetails = new ReplyDetails(payload);

    // Assert
    expect(replyDetails.id).toEqual(payload.id);
    expect(replyDetails.username).toEqual(payload.username);
    expect(replyDetails.date).toEqual(payload.date);
    expect(replyDetails.content).toEqual(payload.content);
  });
});