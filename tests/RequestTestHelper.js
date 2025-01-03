/* istanbul ignore file */
const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const RequestTestHelper = {
  async getAccessToken({
    username = 'usertest',
    password = 'secret',
    fullname = 'user test',
  } = {}) {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password,
        fullname,
      },
    });

    // login and get access token
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password,
      },
    });

    const {
      data: { accessToken }
    } = JSON.parse(response.payload);

    return accessToken;
  },

  async getThreadId({
    title = 'A thread',
    body = 'This is a thread',
  } = {}, accessToken) {
    accessToken = accessToken || await this.getAccessToken();

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title,
        body,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const {
      data: {
        addedThread: { id: threadId },
      }
    } = JSON.parse(response.payload);

    return threadId;
  },

  async getCommentId({
    content = 'a comment',
  } = {}, accessToken, threadId) {
    accessToken = accessToken || await this.getAccessToken();
    threadId = threadId || await this.getThreadId();

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const {
      data: {
        addedComment: { id: commentId },
      }
    } = JSON.parse(response.payload);

    return commentId;
  }
};

module.exports = RequestTestHelper;
