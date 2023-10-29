class BoardDTO {
  constructor({
    board_id,
    board_title,
    board_content,
    board_mid,
    board_hits = 0,
    board_category,
    board_subcategory,
    board_postdate,
    member_nickname,
  }) {
    this.board_id = board_id;
    this.board_title = board_title;
    this.board_content = board_content;
    this.board_mid = board_mid;
    this.board_hits = board_hits;
    this.board_category = board_category;
    this.board_subcategory = board_subcategory;
    this.board_postdate = board_postdate;
    this.member_nickname = member_nickname;
  }
  toJSON() {
    return {
      board_id: this.board_id,
      board_title: this.board_title,
      board_content: this.board_content,
      board_mid: this.board_mid,
      board_hits: this.board_hits,
      board_category: this.board_category,
      board_subcategory: this.board_subcategory,
      board_postdate: this.board_postdate,
      member_nickname: this.member_nickname,
    };
  }
}

module.exports = BoardDTO;
