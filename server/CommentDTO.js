class CommentDTO {
  constructor({
    comment_id,
    comment_bid,
    comment_content,
    comment_mid,
    comment_postdate,
    member_nickname,
    member_name,
  }) {
    this.comment_id = comment_id;
    this.comment_bid = comment_bid;
    this.comment_content = comment_content;
    this.comment_mid = comment_mid;
    this.comment_postdate = comment_postdate;
    this.member_nickname = member_nickname;
    this.member_name=member_name;
  }

  toJSON() {
    return {
      comment_id: this.comment_id,
      comment_bid: this.comment_bid,
      comment_content: this.comment_content,
      comment_mid: this.comment_mid,
      comment_postdate: this.comment_postdate,
      member_nickname: this.member_nickname,
      member_name:this.member_name,
    };
  }
}

module.exports = CommentDTO;
