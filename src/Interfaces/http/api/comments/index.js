const express = require('express');
const CommentsHandler = require('./handler');

module.exports = (container, authenticateToken) => {
  const router = express.Router();
  const commentsHandler = new CommentsHandler(container);

  // Comments routes
  router.post('/threads/:threadId/comments', authenticateToken, commentsHandler.postCommentHandler);
  router.delete('/threads/:threadId/comments/:commentId', authenticateToken, commentsHandler.deleteCommentHandler);
  
  // Comment replies routes
  router.post('/threads/:threadId/comments/:commentId/replies', authenticateToken, commentsHandler.postCommentReplyHandler);
  router.delete('/threads/:threadId/comments/:commentId/replies/:replyId', authenticateToken, commentsHandler.deleteCommentReplyHandler);
  
  // Comment likes routes
  router.put('/threads/:threadId/comments/:commentId/likes', authenticateToken, commentsHandler.putCommentLikeHandler);

  return router;
};
