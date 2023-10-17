const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemberDTO = require('./MemberDTO');
const MemberDAO = require('./MemberDAO');
const BoardDAO = require('./BoardDAO');
const BoardDTO = require('./BoardDTO');
const BoardLikesDAO = require('./BoardLikesDAO');
const BoardLikesDTO = require('./BoardLikesDTO');
const db = require('./dbConnection'); // DB 연결 모듈 가져오기

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
  //세션을 사용한다는 함수 다만 현재 사용x
  session({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
  }),
);

app.post('/login', MemberDAO.login);

app.post('/logout', (req, res) => {
  //아직은 사용x
  //현재 세션 말고 다른방식으로 로그아웃 구현됨
  req.session.destroy(); // 세션 파기
  res.json({success: true});
});

const handleSign = (req, res) => {
  const {
    id,
    pw,
    name,
    nickname,
    engname,
    email,
    major,
    birth,
    gender,
    iscert,
    isAdmin,
    regidate,
    reportcount,
  } = req.body;

  MemberDAO.registerMember(
    id,
    pw,
    name,
    nickname,
    engname,
    email,
    major,
    birth,
    gender,
    iscert,
    isAdmin,
    regidate,
    reportcount,
    req,
    (error, memberDTO) => {
      //회원가입 로직
      if (error) {
        console.error(error);
        res.status(500).json({success: false});
        return;
      }

      if (memberDTO) {
        console.log('DTO 데이터:', memberDTO); // 여기서 DTO 로그를 출력합니다.

        res.json({
          success: true,
          member: {
            id: memberDTO.member_id,
            pw: memberDTO.member_pw,
            name: memberDTO.member_name,
            nickname: memberDTO.member_nickname,
            engname: memberDTO.member_engname,
            email: memberDTO.member_email,
            major: memberDTO.member_major,
            birth: memberDTO.member_birth,
            gender: memberDTO.member_gender,
            iscert: memberDTO.member_iscert,
            isadmin: memberDTO.member_isadmin,
            regidate: memberDTO.member_regidate,
            reportcount: memberDTO.member_reportcount,
          },
        });
      } else {
        res.json({success: false});
      }
    },
  );
};

app.post('/Sign', handleSign);


app.post('/CreateBoard', BoardDAO.CreateBoard);
app.get('/BoardList', (req, res) => {
  //게시글 목록 조회
  BoardDAO.BoardList((error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});

// app.get('/BoardDetail/:boardId', (req, res) => {
//   //게시글 상세보기와 조회수 증가
//   const boardId = req.params.boardId;
//   BoardDAO.BoardHitsUpdate(boardId, error => {
//     if (error) {
//       console.error('조회수 업데이트 중 오류:', error);
//       return;
//     }

//     BoardDAO.BoardDetail(boardId, (error, board) => {
//       if (error) {
//         res
//           .status(500)
//           .json({error: '데이터베이스 오류가 발생하였습니다(상세보기).'});
//       }

//       res.json({success: true, board: board});
//     });

//   });
// });
app.get('/BoardDetail/:boardId', (req, res) => {
  const boardId = req.params.boardId;

  // 게시글 조회수 증가
  BoardDAO.BoardHitsUpdate(boardId, error => {
    if (error) {
      console.error('조회수 업데이트 중 오류:', error);
      return;
    }

    // 게시글 상세보기
    BoardDAO.BoardDetail(boardId, (error, board) => {
      if (error) {
        res
          .status(500)
          .json({error: '데이터베이스 오류가 발생하였습니다(상세보기).'});
        return; // 추가: 오류 발생 시 더 이상 진행되지 않도록
      }

      // 좋아요 갯수 가져오기
      BoardLikesDAO.CountBoardLikes(boardId, (likeError, likeCount) => {
        if (likeError) {
          console.error('좋아요 갯수 조회 중 오류:', likeError);
          res.status(500).json({
            error: '데이터베이스 오류가 발생하였습니다(좋아요 갯수 조회).',
          });
          return;
        }

        // 응답
        res.json({success: true, board: board, likes: likeCount});
      });
    });
  });
});

app.post('/LikePlus', (req, res) => {
  const memberId = req.body.memberId;
  const boardId = req.body.boardId;

  console.log('memberId:', memberId);
  console.log('boardId:', boardId);

  BoardLikesDAO.CreateBoardLikes(req, res, () => {
    // 좋아요가 성공적으로 처리된 후, 게시글의 좋아요 갯수를 조회합니다.
    BoardLikesDAO.CountBoardLikes(boardId, (likeError, likeCount) => {
      if (likeError) {
        console.error('좋아요 갯수 조회 중 오류:', likeError);
        res.status(500).json({
          error: '데이터베이스 오류가 발생하였습니다(좋아요 갯수 조회).',
        });
        return;
      }
      console.error('좋아요 갯수 조회 :', likeCount);
      // 응답: 좋아요 갯수와 함께 성공 메시지를 반환합니다.
      res.json({success: true, likes: likeCount});
      console.log('좋아요 갯수(server_버튼) :', likeCount);
    });
  });
});

// ... 기타 라우터 및 코드 ...

app.listen(3000, () => console.log('Server is running on port 3000'));
