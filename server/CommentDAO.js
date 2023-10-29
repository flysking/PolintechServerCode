const db = require('./dbConnection');
const CommentDTO = require('./CommentDTO');

const CreateComment = (req, res, next) => {
  const commentData = req.body;

  //   const comment_content = req.comment_content;
  //   const comment_mid = req.comment_mid;
  //   const board_id = req.board_id;
  console.log('아이디(DB):', req.body.board_id);
  console.log('boardId(DB)', req.body.comment_mid);
  console.log('댓글 내용(DB)', req.body.comment_content);
  console.log('commentData(db)', commentData.comment_content);
  const query =
    'INSERT INTO polintech.comment (comment_content, comment_mid, comment_bid ) VALUES (?, ?, ?)';

  if (
    !commentData.comment_content ||
    !commentData.comment_mid ||
    !commentData.board_id
  ) {
    console.log('댓글 정보 누락', commentData);
    res.status(400).json({error: '댓글 정보가 누락되었습니다.'});
    return;
  }
  db.query(
    query,
    [
      commentData.comment_content,
      commentData.comment_mid,
      commentData.board_id,
    ],
    (error, results) => {
      if (error) {
        console.error('SQL 오류:', error);
        res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
        return;
      }
      console.log('댓글 정보 : ', results);
      res.json({
        success: true,
        comment: {
          comment_id: results.insertId,
          ...commentData,
        },
      });
    },
  );
};

const EditComment = (req, res, next) => {
  const commentData = req.body;
  const query =
    'UPDATE polintech.comment SET comment_content = ? WHERE comment_id = ?';

  if (!commentData.comment_content || !commentData.comment_id) {
    res.status(400).json({error: '댓글 정보가 누락되었습니다.'});
    return;
  }

  db.query(
    query,
    [commentData.comment_content, commentData.comment_id],
    (error, results) => {
      if (error) {
        console.error('SQL 오류:', error);
        res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
        return;
      }

      res.json({
        success: true,
        comment: commentData,
      });
    },
  );
};

const DeleteComment = (commentId, callback) => {
  console.log('댓글 id : ', commentId);
  const query = 'DELETE FROM polintech.comment WHERE comment_id = ?';

  db.query(query, [commentId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, {success: true, message: '댓글이 삭제되었습니다.'});
  });
};

// const CommentList = (boardId, callback) => {
//   const query =
//     'SELECT * FROM polintech.comment WHERE board_id = ? ORDER BY comment_id DESC';

//   db.query(query, [boardId], (error, results) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }
//     console.log('댓글 조회(DB) 성고');
//     const comments = results.map(commentData => new CommentDTO(commentData));
//     callback(null, comments);
//   });
// };
const CommentList = (boardId, callback) => {
  const query =
    'SELECT comment.* ,member.member_nickname FROM polintech.comment' +
    ' JOIN polintech.member on comment.comment_mid  = member.member_id ' +
    ' WHERE comment_bid = ? ORDER BY comment_id DESC';

  db.query(query, [boardId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length === 0) {
      callback(null, 'No comments found.');
      return;
    }

    const comments = results.map(commentData => new CommentDTO(commentData));
    console.log('댓글 조회(DB) 성공', comments);
    callback(null, comments);
  });
};

module.exports = {
  CreateComment,
  EditComment,
  DeleteComment,
  CommentList,
};
