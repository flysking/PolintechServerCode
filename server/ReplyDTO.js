class ReplyDTO {
  constructor({
    reply_id,
    reply_cid,
    reply_content,
    reply_mid,
    reply_bid,
    reply_postdate,
    member_nickname,
    member_name,
  }) {
    this.reply_id = reply_id;
    this.reply_cid = reply_cid;
    this.reply_content = reply_content;
    this.reply_mid = reply_mid;
    this.reply_bid = reply_bid;
    this.reply_postdate = reply_postdate;
    this.member_nickname = member_nickname;
    this.member_name=member_name;
  }

  toJSON() {
    return {
      reply_id: this.reply_id,
      reply_cid: this.reply_cid,
      reply_content: this.reply_content,
      reply_mid: this.reply_mid,
      reply_bid: this.reply_bid,
      reply_postdate: this.reply_postdate,
      member_nickname: this.member_nickname,
      member_name:this.member_name,
    };
  }
}

module.exports = ReplyDTO;
