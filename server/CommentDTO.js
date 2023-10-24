class CommentDTO {
  constructor({
    comment_id,
    comment_bid,
    comment_content,
    comment_mid,
    comment_postdate,
  }) {
    this.comment_id = comment_id;
    this.comment_bid = comment_bid;
    this.comment_content = comment_content;
    this.comment_mid = comment_mid;
    this.comment_postdate = comment_postdate;
  }

  toJSON() {
    return {
      comment_id: this.comment_id,
      comment_bid: this.comment_bid,
      comment_content: this.comment_content,
      comment_mid: this.comment_mid,
      comment_postdate: this.comment_postdate,
    };
  }
}

module.exports = CommentDTO;
