/* istanbul ignore file */
const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const RequestTestHelper = {
  async addUserAndLogin({
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

  async addThread({
    title = 'A thread',
    body = 'This is a thread',
  } = {}, accessToken) {
    accessToken = accessToken || await this.addUserAndLogin();

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

  async addComment({
    content = 'a comment',
  } = {}, accessToken, threadId) {
    accessToken = accessToken || await this.addUserAndLogin();
    threadId = threadId || await this.addThread();

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
  },

  async addReply({
    content = 'a comment reply',
  } = {}, accessToken, threadId, commentId) {
    accessToken = accessToken || await this.addUserAndLogin();
    threadId = threadId || await this.addThread();
    commentId = commentId || await this.addComment();

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: {
        content,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const {
      data: {
        addedReply: { id: replyId },
      }
    } = JSON.parse(response.payload);

    return replyId;
  }
};

module.exports = RequestTestHelper;
