const express = require('express');
const nodemailer = require('nodemailer');
const {Storage}=require('@google-cloud/storage');
const multer=require('multer')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemberDTO = require('./MemberDTO');
const MemberDAO = require('./MemberDAO');
const BoardDAO = require('./BoardDAO');
const BoardDTO = require('./BoardDTO');
const BoardLikesDAO = require('./BoardLikesDAO');
const BoardLikesDTO = require('./BoardLikesDTO');
const CommentDAO = require('./CommentDAO');
const CommentDTO = require('./CommentDTO');
const ImageDTO = require('./ImageDTO');
const ImageDAO = require('./ImageDAO');
const ReplyDAO = require('./ReplyDAO');
const ReplyDTO = require('./ReplyDTO');
const IdcDAO=require('./IdcDAO');
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

//------이미지 관련---------------
////구글 클라우드 업로드
const storage=new Storage({
  projectId:'groovy-smithy-402915',
  keyFilename:'./server/groovy-smithy-402915-06f6145216d9.json',
});

const bucket=storage.bucket('polintech_image');
const upload=multer({
  storage:multer.memoryStorage(),
});
app.post('/UploadCertificate',upload.single('image'),(req,res)=>{
  console.log('서버 연결 성공');
  if(!req.file){
    return res.status(400).send('파일이 없습니다.');
  }
  const folderPath = 'ServerImage/'; // 폴더 경로
  const fileName = req.file.originalname; // 파일 이름
  const filePath = folderPath + fileName; // 전체 파일 경로
  
  const file = bucket.file(filePath);
  const blobStream=file.createWriteStream({
    metadata:{
      contentType:req.file.mimetype,
    },
  });
  blobStream.on('error',(err)=>{
    console.error(err);
    res.status(500).send('이미지 업로드 중 오류발생');
  });

  blobStream.on('finish',()=>{
    res.status(200).json({message:'이미지가 성공적으로 업로드 되었습니다.'});
  });
  blobStream.end(req.file.buffer);
});
app.post('/UploadIdcImage',upload.single('image'),(req,res)=>{
  console.log('서버 연결 성공');
  const id=req.body.member_id;
  console.log('이미지신청자',id);
  if(!req.file){
    return res.status(400).send('파일이 없습니다.');
  }
  const folderPath = 'ServerImage/'; // 폴더 경로
  const fileName = id+'학생증'+req.file.originalname; // 파일 이름
  const filePath = folderPath + fileName; // 전체 파일 경로
  
  const file = bucket.file(filePath);
  const blobStream=file.createWriteStream({
    metadata:{
      contentType:req.file.mimetype,
    },
  });
  blobStream.on('error',(err)=>{
    console.error(err);
    res.status(500).send('이미지 업로드 중 오류발생');
  });

  blobStream.on('finish',()=>{
    res.status(200).json({message:'이미지가 성공적으로 업로드 되었습니다.'});
  });
  blobStream.end(req.file.buffer);
});

app.post('/UploadBoardImage', upload.single('image'), (req, res) => {
  //게시글 이미지(구글 클라우드로 전송)
  console.log('서버 연결 성공');
  if (!req.file) {
    return res.status(400).send('파일이 없습니다.');
  }
  const folderPath = 'ServerImage/'; // 폴더 경로

  const fileName = req.file.originalname; // 클라이언트에서 보낸 파일의 원래 이름을 사용
  const filePath = folderPath + fileName; // 전체 파일 경로
  console.log('파일 이름: ', fileName);
  const file = bucket.file(filePath);
  const blobStream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  blobStream.on('error', err => {
    console.error(err);
    res.status(500).send('이미지 업로드 중 오류발생');
  });

  blobStream.on('finish', () => {
    res.status(200).json({message: '이미지가 성공적으로 업로드 되었습니다.'});
  });
  blobStream.end(req.file.buffer);
});
app.get('/ImageCheck/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  ImageDAO.imageCheck(boardId, (error, imageData) => {
    if (error) {
      res
        .status(500)
        .json({error: '데이터베이스 오류가 발생하였습니다(이미지 조회).'});
      return;
    }
    console.log('imageData(server) : ', imageData);
    res.json({success: true, imageData});
  });
});
//----------------------------
//-----------이미지DB----------
app.post('/UploadToDB', ImageDAO.UploadToDB);
app.post('/UploadBoardImageToDB', ImageDAO.UploadBoardImageToDB);
app.post('/UpdateBoardImageToDB', ImageDAO.UpdateBoardImageToDB);
app.post('/UpdateIsCert',MemberDAO.UpdateIsCert);
//--------------------------  
//-----------학생증 관련-------
app.post('/UploadIdc',IdcDAO.IdcUpload);

app.get('/SearchIdc/:member_Id', (req, res) => {
  //학생증 검색
  const member_id = req.params.member_Id;
  console.log(member_id);

  IdcDAO.SearchIdc(member_id, (error, idc) => {
    if (error) {
      res
        .status(500)
        .json({error: '학생증 조회 중 오류가 발생했습니다.'});
      return; // 추가: 오류 발생 시 더 이상 진행되지 않도록
    }else{
      res.json({success: true, idc: idc });
      // 응답
    }
    });
});

app.get('/MyIdc/:member_Id', (req, res) => {
  //내가 신청한 학생증 확인
  const member_id = req.params.member_Id;
  console.log(member_id);
  IdcDAO.MyIdc(member_id, (error, idc) => {
    if (error) {
      res
        .status(500)
        .json({error: '학생증 조회 중 오류가 발생했습니다.'});
      return; // 추가: 오류 발생 시 더 이상 진행되지 않도록
    }else{
      res.json({success: true, idc: idc });
      // 응답
    }
    });
});
//----------------------------
//----로그인/회원가입 관련---------

app.post('/login', MemberDAO.login);

const handleSign = (req, res) => {
  console.log("server:",req.body);
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
    grade,
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
    grade,
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
            grade: memberDTO.member_grade,
          },
        });
      } else {
        res.json({success: false});
      }
    },
  );
};
app.post('/Sign', handleSign);

app.post('/UpdateMember',MemberDAO.UpdateMemberInfo);
app.post('/UpdateProfile',MemberDAO.UpdateProfile);



const generateRandomVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const verificationCode = generateRandomVerificationCode();

app.post('/EmailAuth', async (req, res) => {
  const { userEmail } = req.body;
  verificationCode = generateRandomVerificationCode(); // 새로운 코드 생성

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'polintechnoreply@gmail.com',
      pass: 'krwsldkwkbpmjxwq',
    },
  });

  try {
    const mailOptions = {
      from: '폴인텍 <polintechnoreply@gmail.com>',
      to: userEmail,
      subject: '폴인텍 회원가입 인증번호',
      html: `
        <html>
          <head>
            <div style="text-align: center;">
            <img src="../image/Logo" alt="폴인텍 로고">
          </head>
          <body>
            <div style="text-align: center;">
              <p>${verificationCode}</p>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('이메일 전송 오류:', error);
        res.status(500).send('메일 전송 실패');
      } else {
        console.log('이메일 전송:', info.response);
        res.status(200).send('메일 전송 성공!');
      }
    });
  } catch (error) {
    console.error('메일 전송 실패:', error);
    res.status(500).send('메일 전송 실패');
  }
});

//인증코드 초기화
app.post('/ClearVerificationCode', (req, res) => {
  verificationCode = '';
  res.status(200).send('인증코드 초기화됨');
});

//이메일 인증 코드 확인
app.post('/AuthCheck', (req, res) => {
  const { authCheck } = req.body;

  if (authCheck === verificationCode) {
    res.status(200).send('인증번호 일치');
  } else {
    res.status(400).send('인증번호 불일치');
  }
});

//이메일로 아이디 찾기
const handleFindIdByEmail = (req, res) => {
  const { id, email } = req.body;

  MemberDAO.getMemberByEmail(id, email, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('이메일로 찾은 회원 정보:', memberDTO.member_id);

      // 클라이언트에게 찾은 정보 전달
      res.json({
        success: true,
        member: {
          id: memberDTO.member_id,
          email: memberDTO.member_email,
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/findIdByEmail', handleFindIdByEmail);

//아이디 찾기
const handleFindId = (req, res) => {
  const { id } = req.body;

  MemberDAO.getId(id, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('아이디 등록 확인:', memberDTO.member_id);

      res.json({
        success: true,
        member: {
          id: memberDTO.member_id,
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/findId', handleFindId);

//이메일 찾기
const handleFindEmail = (req, res) => {
  const { email } = req.body;

  MemberDAO.getEmail(email, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('이메일 등록 확인:', memberDTO.member_email);

      res.json({
        success: true,
        member: {
          email: memberDTO.member_email,
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/findEmail', handleFindEmail);

//비밀번호 찾기
const handleFindPw = (req, res) => {
  const { pw } = req.body;

  MemberDAO.getPw(pw, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('비밀번호 일치 확인:', memberDTO.member_pw);

      res.json({
        success: true,
        member: {
          pw: memberDTO.member_pw,
          // 다른 필드도 추가할 수 있습니다.
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/findPw', handleFindPw);
//비로그인 상태에서 찾기
//비로그인 상태에서 비밀번호 찾기
const handleFindPwIdLogginedOut = (req, res) => {
  const { id } = req.body;

  MemberDAO.getPwIsLogginedOut(id, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('비밀번호 일치 확인:', memberDTO.member_id);

      res.json({
        success: true,
        member: {
          id: memberDTO.member_id,
          pw: memberDTO.member_pw,
          // 다른 필드도 추가할 수 있습니다.
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/findPwIsLogginedOut', handleFindPwIdLogginedOut);

//비밀번호 업데이트
const handlePwUpdate = (req, res) => {
  const { pw, newPw } = req.body;
  console.log("업데이트 확인:", req.body);

  MemberDAO.PwUpdate(pw, newPw, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('비밀번호 재설정 확인:', memberDTO.member_pw);

      res.json({
        success: true,
        member: {
          pw: memberDTO.member_pw,
          newPw: memberDTO.member_pw,
          // 다른 필드도 추가할 수 있습니다.
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/PwUpdate', handlePwUpdate);

//비로그인 비밀번호 업데이트
const handlePwUpdateIsLogginedOut = (req, res) => {
  const { id, newPw } = req.body;
  console.log("업데이트 확인:", req.body);

  MemberDAO.PwUpdateIsLogginedOut(id, newPw, (error, memberDTO) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false });
      return;
    }

    if (memberDTO) {
      console.log('비밀번호 재설정 확인:', memberDTO.member_pw);

      res.json({
        success: true,
        member: {
          id: memberDTO.member_id,
          newPw: memberDTO.member_pw,
          // 다른 필드도 추가할 수 있습니다.
        },
      });
    } else {
      res.json({ success: false });
    }
  });
};

app.post('/PwUpdateIsLogginedOut', handlePwUpdateIsLogginedOut);

app.post('/PwUpdate', handlePwUpdate);

//-------------------
//--------게시글 관련-----------
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
app.get('/BoardListNotice', (req, res) => {
  //게시글 목록 조회
  BoardDAO.BoardListNotice((error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});
app.get('/BoardListPopular', (req, res) => {
  //게시글 목록 조회
  BoardDAO.BoardListPopular((error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});

app.get('/BoardList/:category', (req, res) => {
  //게시글 목록 조회
  const category=req.params.category;
  BoardDAO.BoardListByCategory(category,(error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});
app.get('/BoardListNoticeByCate/:category', (req, res) => {
  //게시글 목록 조회
  const category=req.params.category;
  BoardDAO.BoardListNoticeByCate(category,(error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});
app.get('/BoardListPopularByCate/:category', (req, res) => {
  //게시글 목록 조회
  const category=req.params.category;
  BoardDAO.BoardListPopularByCate(category,(error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});


app.post('/BoardSearchList', (req, res) => {
  //게시글 검색
  const word = req.body.word;
  const subcategory = req.body.subcategory;
  const category = req.body.category;
  console.log('입력 단어 : ', word);
  console.log('subCategory : ', subcategory);
  console.log('카테고리 : ', category);
  BoardDAO.BoardSearch(category, subcategory, word, (error, boards) => {
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }
    res.json({success: true, boards});
    console.log('게시글 출력', boards);
  });
});

app.get('/BoardHitsUpdate/:boardId', (req, res) => {
  // 조회수 증가
  const boardId = req.params.boardId;
  BoardDAO.BoardHitsUpdate(boardId, error => {
    if (error) {
      console.error('조회수 업데이트 중 오류:', error);
      return;
    }
  });
});
app.get('/BoardDetail/:boardId', (req, res) => {
  //게시글 상세보기
  const boardId = req.params.boardId;

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

app.get('/BoardDetailUpdate/:boardId', (req, res) => {
  //게시글 상세보기(좋아요 변경시)
  const boardId = req.params.boardId;
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

app.post('/LikePlus', (req, res) => {
  //좋아요 추가
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
app.post('/EditBoard/', BoardDAO.EditBoard);
//게시글 수정

//-----------------------------------------------------------------------------------------
// ... 댓글 코드 ...
app.post('/CommentAdd', CommentDAO.CreateComment);
// 댓글 생성

app.get('/CommentList/:boardId', (req, res) => {
  // 댓글 조회 (특정 게시글의 모든 댓글을 가져오는 가정)
  const boardId = req.params.boardId;
  CommentDAO.CommentList(boardId, (error, comments) => {
    if (error) {
      res
        .status(500)
        .json({error: '데이터베이스 오류가 발생하였습니다(댓글 조회).'});
      return;
    }
    res.json({success: true, comments});
  });
});
app.post('/EditComment/', CommentDAO.EditComment);
//댓글 수정
app.delete('/DeleteComment/:comment_id', (req, res) => {
  //댓글 삭제
  const CommentId = req.params.comment_id;
  console.log(CommentId);
  CommentDAO.DeleteComment(CommentId, (error, result) => {
    if (error) {
      console.error('댓글 삭제 중 오류:', error);
      res.status(500).json({error: '댓글 삭제 중 오류가 발생하였습니다.'});
      return;
    }
    res.json(result);
  });
});
//-----------------------------------------------------------------------------------------
//답글 코드
app.get('/ReplyList/:boardId', (req, res) => {
  // 답글 조회 (특정 게시글의 모든 댓글을 가져오는 가정)
  const boardId = req.params.boardId;
  console.log('게시글 번호(답글) : ', boardId);
  ReplyDAO.ReplyList(boardId, (error, replys) => {
    if (error) {
      res
        .status(500)
        .json({error: '데이터베이스 오류가 발생하였습니다(댓글 조회).'});
      return;
    }
    console.log('답글(server) : ', replys);
    res.json({success: true, replys});
  });
});
app.post('/ReplyAdd', ReplyDAO.CreateReply);
//답글 생성
app.post('/EditReply/', ReplyDAO.EditReply);
//답글 수정
app.delete('/DeleteReply/:reply_id', (req, res) => {
  //답글 삭제
  const reply_id = req.params.reply_id;
  console.log(reply_id);
  ReplyDAO.DeleteReply(reply_id, (error, result) => {
    if (error) {
      console.error('답글 삭제 중 오류:', error);
      res.status(500).json({error: '답글 삭제 중 오류가 발생하였습니다.'});
      return;
    }
    res.json(result);
  });
});
//------------------------
// ... 기타 라우터 및 코드 ...

app.listen(3000, () => console.log('Server is running on port 3000'));
