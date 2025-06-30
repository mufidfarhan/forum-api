class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, likeCount } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.likeCount = likeCount;
  }

  _verifyPayload({ id, username, date, content, likeCount }) {

    if (!id || !username || !date || !content) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof likeCount !== 'number') {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetails;
