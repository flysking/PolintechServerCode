class BoardLikesDTO {
  constructor({
    boardlikes_id,
    boardlikes_bid,
    boardlikes_mid,
    boardlikes_postdate,
  }) {
    this.boardlikes_id = boardlikes_id;
    this.boardlikes_bid = boardlikes_bid;
    this.boardlikes_mid = boardlikes_mid;
    this.boardlikes_postdate = boardlikes_postdate;
  }
  toJSON() {
    return {
      boardlikes_id: this.boardlikes_id,
      boardlikes_bid: this.boardlikes_bid,
      boardlikes_mid: this.boardlikes_mid,
      boardlikes_postdate: this.boardlikes_postdate,
    };
  }
}

module.exports = BoardLikesDTO;
