const db = require('./dbConnection');
const ReplyDTO = require('./ReplyDTO');

const CreateReply = (req, res, next) => {
  //게시글의 id,댓글의 id, 작성자의 id, 답글의 내용을 입력받아 DB에 추가한다.
  const replyData = req.body;

  const reply_bid = parseInt(req.body.reply_bid, 10);
  console.log('게시글 id(int DB):', reply_bid);
  console.log('답글_게시판 id(DB):', replyData.reply_bid);
  console.log('답글_회원 id(DB):', replyData.reply_mid);
  console.log('답글 내용(DB):', replyData.reply_content);
  console.log('답글 댓글 id(DB)', replyData.reply_cid);

  const query =
    'INSERT INTO polintech.reply (reply_content, reply_mid, reply_cid, reply_bid) VALUES (?, ?, ?, ?)';

  if (
    !replyData.reply_content ||
    !replyData.reply_mid ||
    !replyData.reply_cid ||
    !replyData.reply_bid
  ) {
    console.log('답글 정보 누락(DB)', replyData);
    res.status(400).json({error: '답글 정보가 누락되었습니다.'});
    return;
  }

  db.query(
    query,
    [
      replyData.reply_content,
      replyData.reply_mid,
      replyData.reply_cid,
      reply_bid,
    ],
    (error, results) => {
      if (error) {
        console.error('SQL 오류:', error);
        res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
        return;
      }
      console.log('답글 생성(DB) 성공');
      res.json({
        success: true,
        reply: {
          reply_id: results.insertId,
          ...replyData,
        },
      });
    },
  );
};

const EditReply = (req, res, next) => {
  //답글의 id,답글의 수정 내용을 입력받아 해당하는 답글을 DB에서 수정한다.
  const replyData = req.body;
  console.log('답글 수정(DB) 데이터 : ', replyData);
  const reply_id = parseInt(req.body.reply_id, 10);
  const query =
    'UPDATE polintech.reply SET reply_content = ? WHERE reply_id = ?';

  if (!replyData.reply_content || !replyData.reply_id) {
    res.status(400).json({error: '답글 정보가 누락되었습니다.'});
    return;
  }

  db.query(
    query,
    [replyData.reply_content, replyData.reply_id],
    (error, results) => {
      if (error) {
        console.error('SQL 오류:', error);
        res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
        return;
      }

      res.json({
        success: true,
        reply: replyData,
      });
    },
  );
};

const DeleteReply = (replyId, callback) => {
  //답글의 id를 입력받아 DB에서 해당하는 답글을 제거한다.
  console.log('답글 id:', replyId);
  const query = 'DELETE FROM polintech.reply WHERE reply_id = ?';

  db.query(query, [replyId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, {success: true, message: '답글이 삭제되었습니다.'});
  });
};

const ReplyList = (boardId, callback) => {
  //게시글의 id를 입력받아 DB에서 해당하는 답글 데이터를 출력한다.
  const query =
    'SELECT reply.*,member.member_nickname FROM polintech.reply' +
    ' JOIN polintech.member ON reply.reply_mid= member.member_id ' +
    'WHERE reply_bid = ? ORDER BY reply_id';

  db.query(query, [boardId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length === 0) {
      callback(null, 'No replies found.');
      return;
    }

    console.log('답글 조회(DB) 성공');
    console.log(results);
    const replys = results.map(replyData => new ReplyDTO(replyData));
    callback(null, replys);
  });
};

module.exports = {
  CreateReply,
  EditReply,
  DeleteReply,
  ReplyList,
};
