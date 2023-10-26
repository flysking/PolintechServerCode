const db = require('./dbConnection');
const MemberDTO = require('./MemberDTO');

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
      const memberDTO = new MemberDTO(results[0]);
      console.log('쿼리 결과:', results[0]); // 쿼리 결과 로그 출력
      callback(null, memberDTO); // 에러가 없고, DTO 객체 반환
    } else {
      callback(null, null); // 에러가 없고, 결과가 없음
    }
  });
};
const UpdateIsCert=(req,res)=>{
  const member_id = req.body.member_id;
  console.log('인증 요청한 유저',member_id);
  const query=
    'update polintech.member set member_iscert=member_iscert+1 where member_id=?';
    db.query(query,[member_id],(error,results)=>{
      if(error){
        console.error(error,'데이터베이스 업데이트 오류');
        res.status(500).json({
          success:false,
          message:'DB 업데이트 실패함',});
      }else{
        res.status(200).json({
          success:true,
          message:'DB 업데이트 성공~',});
      }
    });
};

const registerMember = (
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
  grade,
  req,
  callback,
) => {
  //회원가입
  const query = 'insert into polintech.member (member_id, member_pw, member_name, member_nickname, member_engname, member_email, member_major, member_birth, member_gender, member_iscert, member_isadmin, member_regidate, member_reportcount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP, 0)';

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
      iscert,
      isAdmin,
      regidate,
      reportcount,
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

module.exports = {
  getMemberByIdAndPassword,
  login,
  registerMember,
  UpdateIsCert,
};
