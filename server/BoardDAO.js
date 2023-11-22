const db = require('./dbConnection');
const BoardDTO = require('./BoardDTO');

const CreateBoard = (req, res, next) => {
  //게시글 생성
  //제목,내용,회원의 id 받음
  const boardData = req.body;
  console.log(boardData);
  const query =
    'INSERT INTO polintech.board (board_title, board_content, board_mid, board_category,board_subcategory) VALUES (?, ?, ?, ?, ?)';

  if (
    //게시글 정보가 누락되었을
    !boardData.board_title ||
    !boardData.board_content ||
    !boardData.board_mid ||
    !boardData.board_category ||
    !boardData.board_subcategory
  ) {
    res.status(400).json({error: '게시글 정보가 누락되었습니다.'});
    return;
  }

  db.query(
    query,
    [
      boardData.board_title,
      boardData.board_content,
      boardData.board_mid,
      boardData.board_category,
      boardData.board_subcategory,
    ],
    (error, results) => {
      if (error) {
        console.error('SQL 오류:', error);
        res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
        return;
      }

      res.json({
        success: true,
        board: {
          board_id: results.insertId,
          ...boardData,
        },
      });
    },
  );
};
const EditBoard = (req, res, next) => {
  //게시글 수정
  const boardData = req.body;
  const query =
    'UPDATE polintech.board SET board_title = ?, board_content = ? WHERE board_id = ?';

  if (
    !boardData.board_title ||
    !boardData.board_content ||
    !boardData.board_id
  ) {
    res.status(400).json({error: '게시글 정보가 누락되었습니다.'});
    return;
  }

  db.query(
    query,
    [boardData.board_title, boardData.board_content, boardData.board_id],
    (error, results) => {
      if (error) {
        console.error('SQL 오류:', error);
        res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
        return;
      }

      res.json({
        success: true,
        board: boardData,
      });
    },
  );
};

const BoardDetail = (boardId, callback) => {
  const query =
    'select board.*, member.member_nickname,member.member_name from polintech.board' +
    ' join polintech.member on board.board_mid = member.member_id' +
    ' where board_id = ?';

  db.query(query, [boardId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (results.length === 0) {
      callback(new Error('게시글을 찾을 수 없습니다.'), null);
      return;
    }
    const boards = new BoardDTO(results[0]);
    callback(null, boards);
  });
};
const BoardDelete = (boardId, callback) => {
  const query = 'DELETE FROM polintech.board WHERE board_id = ?'; // DELETE * FROM -> DELETE FROM으로 수정

  db.query(query, [boardId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, {success: true, message: '게시글이 삭제되었습니다.'});
  });
};

const BoardList = callback => {
  //게시글 목록
  const query =
    'select board.*, member.member_nickname,member.member_name from polintech.board' +
    ' join polintech.member on board.board_mid = member.member_id' +
    ' order by board.board_id desc';

  db.query(query, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    const boards = results.map(boardData => new BoardDTO(boardData));
    callback(null, boards);
  });
};
const BoardListByCategory = (category, callback) => {
  //게시글 목록
  const query =
    'select board.*, member.member_nickname,member.member_name from polintech.board' +
    ' join polintech.member on board.board_mid = member.member_id' +
    ' where board.board_category=? order by board.board_id desc';

  db.query(query,[category], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    const boards = results.map(boardData => new BoardDTO(boardData));
    callback(null, boards);
  });
};

const BoardHitsUpdate = (boardId, callback) => {
  //조회수 증가
  const query =
    'UPDATE polintech.board SET board_hits=board_hits+1 WHERE board_id=?';
  db.query(query, [boardId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results);
  });
};

module.exports = {
  CreateBoard,
  BoardDetail,
  BoardList,
  BoardHitsUpdate,
  EditBoard,
  BoardDelete,
  BoardListByCategory,
};
