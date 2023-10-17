const db = require('./dbConnection');
const BoardLikesDTO = require('./BoardLikesDTO');

const CreateBoardLikes = (req, res) => {
  //게시글 좋아요 데이터 확인 및 생성 또는 삭제
  const boardLikeData = req.body;
  const memberId = req.body.memberId;
  const boardId = req.body.boardId;
  // 먼저 해당 사용자가 이미 좋아요를 했는지 확인
  SelectUserBoardLike(req, res, (error, results) => {
    if (error) {
      res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
      return;
    }

    if (results && results.length > 0) {
      // 이미 좋아요한 경우, 좋아요 삭제
      DeleteBoardLike(req, res, (delError, delResults) => {
        if (delError) {
          res
            .status(500)
            .json({error: '좋아요 삭제 중 오류가 발생하였습니다.'});
          return;
        }
        res.json({success: true, message: '좋아요가 제거되었습니다.'});
      });
    } else {
      // 아직 좋아요하지 않은 경우, 좋아요 추가
      console.log('좋아요 추가 시작'); // <-- 로그 추가
      const query =
        'INSERT INTO polintech.boardlikes (boardlikes_bid, boardlikes_mid) VALUES (?, ?)';

      if (!boardId || !memberId) {
        console.log('좋아요 정보 누락'); // <-- 로그 추가
        res.status(400).json({error: '게시글 좋아요 정보가 누락되었습니다.'});
        return;
      }

      db.query(query, [boardId, memberId], (insError, insResults) => {
        if (insError) {
          console.error('SQL 오류:', insError);
          res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
          return;
        }
        console.log('좋아요 추가 완료'); // <-- 로그 추가
        res.json({
          success: true,
          board: {
            board_id: insResults.insertId,
            ...boardLikeData,
          },
        });
      });
    }
  });
};

const SelectUserBoardLike = (req, res, callback) => {
  const memberId = req.body.memberId;
  const boardId = req.body.boardId;

  // boardlikes 테이블에서 좋아요 데이터 조회
  const query =
    'SELECT * FROM polintech.boardlikes WHERE boardlikes_bid = ? and boardlikes_mid = ?';

  db.query(query, [boardId, memberId], (error, results) => {
    if (error) {
      console.error('SQL 오류:', error);
      res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
      return;
    }

    // callback을 사용하여 결과 반환
    callback(null, results);
  });
};

const DeleteBoardLike = (req, res, callback) => {
  //좋아요 제거
  const memberId = req.body.memberId;
  const boardId = req.body.boardId;

  const query =
    'DELETE FROM polintech.boardlikes WHERE boardlikes_bid = ? and boardlikes_mid = ?';

  db.query(query, [boardId, memberId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results);
  });
};
const CountBoardLikes = (boardId, callback) => {
  const query =
    'SELECT COUNT(*) AS likeCount FROM polintech.boardlikes WHERE boardlikes_bid = ?';

  db.query(query, [boardId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results[0].likeCount);
  });
};

module.exports = {
  CreateBoardLikes,
  DeleteBoardLike,
  SelectUserBoardLike,
  CountBoardLikes,
};
