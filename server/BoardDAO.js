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
//공지사항 조회
const BoardListNotice = callback => {
  //게시글 목록
  const query =
    'select board.*, member.member_nickname,member.member_name from polintech.board' +
    ' join polintech.member on board.board_mid = member.member_id' +
    ' where board_subcategory="공지" order by board.board_id desc';

  db.query(query, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    const boards = results.map(boardData => new BoardDTO(boardData));
    callback(null, boards);
  });
};
const BoardListPopular = callback => {
  //게시글 목록
  const query =
    'select board.*, member.member_nickname,member.member_name, COUNT(boardlikes.boardlikes_bid) AS like_count from polintech.board' +
    ' join polintech.member on board.board_mid = member.member_id' +
    ' join polintech.boardlikes ON board.board_id = boardlikes.boardlikes_bid' +
    ' group by board.board_id, member.member_nickname, member.member_name'+
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
const BoardSearch = (category, subcategory, word, callback) => {
  let query = '';
  const searchTerm = `%${word}%`;
  let query_category = 'WHERE board.board_category = ? AND';

  if (category == '전체') {
    query_category = 'WHERE';
  }
  if (subcategory === 'title') {
    console.log('제목에서 검색'); // 제목에서 검색

    query =
      'SELECT board.*, member.member_nickname ' +
      'FROM polintech.board ' +
      'JOIN polintech.member ON board.board_mid = member.member_id ' +
      query_category +
      ' board.board_title LIKE ? ' +
      'ORDER BY board.board_postdate DESC';
  } else if (subcategory === 'content') {
    console.log('본문에서 검색'); // 본문에서 검색
    query =
      'SELECT board.*, member.member_nickname ' +
      'FROM polintech.board ' +
      'JOIN polintech.member ON board.board_mid = member.member_id ' +
      query_category +
      ' board.board_content LIKE ? ' +
      'ORDER BY board.board_postdate DESC';
  }
  if (category == '전체') {
    db.query(query, searchTerm, (error, results) => {
      console.log('query : ', query);
      console.log('query_category : ', query_category);
      console.log('searchTerm : ', searchTerm);
      if (error) {
        callback(error, null);
        return;
      }
      const boards = results.map(boardData => new BoardDTO(boardData));
      console.log(boards);
      callback(null, boards);
    });
  } else {
    db.query(query, [category, searchTerm], (error, results) => {
      console.log('query : ', query);
      console.log('query_category : ', query_category);
      console.log('searchTerm : ', searchTerm);
      if (error) {
        callback(error, null);
        return;
      }
      const boards = results.map(boardData => new BoardDTO(boardData));
      console.log(boards);
      callback(null, boards);
    });
  }
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
  BoardListNotice,
  BoardListPopular,
  BoardListByCategory,
  BoardSearch,
};
