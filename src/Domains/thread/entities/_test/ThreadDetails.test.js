/* eslint-disable camelcase */
const ThreadDetails = require('../ThreadDetails');

describe('a ThreadDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a body thread',
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should thow error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 123,
      body: 'a body thread',
      date: '2024-04-04',
      username: 'dicoding',
      comments: [],
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a body thread',
      date: '2024-04-04',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const threadDetails = new ThreadDetails(payload);

    // Assert
    expect(threadDetails.id).toEqual(payload.id);
    expect(threadDetails.title).toEqual(payload.title);
    expect(threadDetails.body).toEqual(payload.body);
    expect(threadDetails.date).toEqual(payload.date);
    expect(threadDetails.username).toEqual(payload.username);
    expect(threadDetails.comments).toEqual(payload.comments);
  });
});