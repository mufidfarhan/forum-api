const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postCommentReplyHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
  // {
  //   method: 'DELETE',
  //   path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
  //   handler: handler.deleteCommentReplyHandler,
  //   options: {
  //     auth: 'forumapp_jwt',
  //   },
  // },
]);

module.exports = routes;
