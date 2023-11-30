const db = require('./dbConnection');
const MemberDTO = require('./MemberDTO');
const bcrypt = require('bcrypt');

const getMemberByIdAndPassword = (id, pw, req, callback) => {
  //로그인
  const query =
    'SELECT * FROM polintech.member join polintech.major'
    +' on member.member_major=major.major_id WHERE member_id = ? AND member_pw = ?';

  db.query(query, [id, pw], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length > 0) {
      const hashedPassword = results[0].member_pw;
      bcrypt.compare(pw, hashedPassword, (err, res) => {
        if (res) {
          const memberDTO = new MemberDTO(results[0]);
          console.log('쿼리 결과:', results[0]); // 쿼리 결과 로그 출력
          callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
        } else {
          callback(null, null);
        }
      });
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};
const UpdateIsCert=(req,res)=>{
  const member_id = req.body;
  if(!member_id.member_id){
    res.status(400).json({error:'회원 정보가 없습니다.'});
   return;
}
  console.log('인증 요청한 유저',member_id.member_id);

  const query=
    'update polintech.member set member_iscert=1 where member_id=?';
    db.query(query,[member_id.member_id],(error,results)=>{
      if(error){
        console.error(error,'데이터베이스 업데이트 오류');
        res.status(500).json({
          message:'DB 업데이트 실패함',});
          return;
      }else{
        res.status(200).json({
          success:true,
          message:'DB 업데이트 성공~',});
          return;
      }
    });
};

const registerMember = (
  id, pw, name, nickname, engname, email, major, birth, gender,
  grade, req, callback,
) => {
  //회원가입
  bcrypt.hash(pw, 10, (err, pw) => {
  if (err) {
      callback(err, null);
      return;
  }

  console.log("db",req.body);
  console.log("grade",grade);

  const query = 'insert into polintech.member (member_id, member_pw, member_name, member_nickname, member_engname, member_email, member_major, member_birth, member_gender, member_grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            
  db.query(
    query,
    [
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
    ],
    (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (results.affectedRows > 0) {
        const memberDTO = new MemberDTO(results[0]);
        console.log('쿼리 결과:', results[0]); // 쿼리 결과 로그 출력
        callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
      } else {
        callback(null, null); // 에러가 없고, 결과가 없음
      }
    },
  );
  })
};

const login = (req, res) => {
  const {id, pw} = req.body;
  
  getMemberByIdAndPassword(id, pw, req, (error, memberDTO) => {
    console.log(req.body);
    if (error) {
      console.error(error);
      res.status(500).json({success: false});
      return;
    }

    if (memberDTO) {
      console.log('DTO 데이터:', memberDTO);
      res.json({
        success: true,
        member: {
          id: memberDTO.member_id,
          pw: memberDTO.member_pw,
          name: memberDTO.member_name,
          engname: memberDTO.member_engname,
          nickname: memberDTO.member_nickname,
          email: memberDTO.member_email,
          major: memberDTO.member_major,
          birth: memberDTO.member_birth,
          number: memberDTO.member_number,
          gender:memberDTO.member_gender,
          iscert:memberDTO.member_iscert,
          isAdmin: memberDTO.member_isadmin,
          grade: memberDTO.member_grade,
          majorname:memberDTO.major_name,
        },
      });
    } else {
      res.json({success: false});
    }
  });
};
const updateMember = (
  pw,
  nickname,
  gender,
) => {
  const query = 'UPDATE polintech.member SET  member_pw = ?, member_nickname = ?, member_gender = ? WHERE member_id = ?';

  db.query(query, 
  [
    pw,
    nickname,
    gender,
  ], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.affectedRows > 0) {
      const updatedMemberDTO = new MemberDTO({
        member_pw: pw,
        member_nickname: nickname,
        member_gender: gender,
      });

      callback(null, updatedMemberDTO);
    } else {
      callback(null, null);
    }
  });
};

const getMemberByEmail = (id, email, callback) => {
  // 이메일로 회원을 찾는 쿼리를 작성합니다.
  const query = 'SELECT member_id FROM polintech.member WHERE member_email = ?';

  db.query(query, [email], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('이메일로 찾은 회원 정보:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};

const getId = (id, callback) => {
  // 아이디를 찾는 쿼리를 작성합니다.
  const query = 'SELECT member_id FROM polintech.member WHERE member_id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('아이디 확인:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};

const getEmail = (email, callback) => {
  // 이메일을 찾는 쿼리를 작성합니다.
  const query = 'SELECT member_email FROM polintech.member WHERE member_email = ?';

  db.query(query, [email], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('아이디 확인:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};

const getPw = (pw, callback) => {
  // 비밀번호를 찾는 쿼리를 작성합니다.
  const query = 'SELECT member_pw FROM polintech.member WHERE member_pw = ?';

  db.query(query, [pw], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('비밀번호 확인:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};

const getPwIsLogginedOut = (id, callback) => {
  // 비로그인 상태에서 비밀번호를 찾는 쿼리를 작성합니다.
  const query = 'SELECT member_pw FROM polintech.member WHERE member_id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('비밀번호 확인:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};

const PwUpdate = (pw, newPw, callback) => {
  // 비밀번호를 업데이트하는 쿼리를 작성합니다.
  const query = 'UPDATE polintech.member SET member_pw = ? WHERE member_pw = ?';

  db.query(query, [newPw, pw], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.affectedRows  > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('비밀번호 재설정 확인:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};

const PwUpdateIsLogout = (id, newPw, callback) => {
  // 비로그인 상태에서 비밀번호를 업데이트하는 쿼리를 작성합니다.
  const query = 'UPDATE polintech.member SET member_pw = ? WHERE member_id = ?';

  db.query(query, [newPw, id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.affectedRows  > 0) {
      const memberDTO = new MemberDTO(results[0]);
      console.log('비밀번호 재설정 확인:', results[0]); // 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
}
module.exports = {
  getMemberByIdAndPassword,
  login,
  registerMember,
  UpdateIsCert,
  getMemberByEmail,
  getId,
  getEmail,
  getPw,
  updateMember,
  PwUpdate,
  PwUpdateIsLogout,
};
