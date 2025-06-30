class CommentLikeCount {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, totalLikes } = payload;

    this.commentId = commentId;
    this.totalLikes = totalLikes;
  }

  _verifyPayload({ commentId, totalLikes }) {
    if (!commentId || !totalLikes) {
      throw new Error('COMMENT_LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof totalLikes !== 'number') {
      throw new Error('COMMENT_LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLikeCount;
