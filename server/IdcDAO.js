const db = require('./dbConnection');
const IdcDTO=require('./IdcDTO');

const SearchIdc = (member_id, callback) => {
    const query =
    'select * from studentidc where idc_mid=? ';
    db.query(query, [member_id], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(new Error(member_id,' 회원의 학생증을 조회할 수 없습니다.'), null);
        return;
      }
      const idc = new IdcDTO(results[0]);
      console.log('idcDTO정보:',idc);
      callback(null, idc);
    });
  };

  //학과명을 담을 수 있도록 join을 사용해 발급된 학생증 정보를 불러옵니다.
  const MyIdc = (member_id, callback) => {
    const query =
    'select * from studentidc join member on studentidc.idc_mid=member.member_id' 
    +' join major on member.member_major=major.major_id where studentidc.idc_mid=? and idc_isaccept=1';
    db.query(query, [member_id], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(new Error(member_id,' 학생증 발급 대기중인 유저.'), null);
        return;
      }
      const idc = new IdcDTO(results[0]);
      console.log('idcDTO정보:',idc);
      callback(null, idc);
    });
  };

const IdcUpload=(req,res)=>{
    const data=req.body;
    console.log(data);
    const query='insert into polintech.studentidc (idc_mid) values (?)';
    if(
        !data.idc_mid
    ){
        res.status(400).json({error:'학생증 신청자를 찾을 수 없습니다'});
        return;
    }
    db.query(
        query,[
            data.idc_mid,
        ],
        (error,results)=>{
            if(error){
                console.error('학생증 생성 중 오류 발생',error);
                return;
            }
            console.log('학생증 신청 완료');
            return;
        }
    )
}
module.exports={
    IdcUpload,
    SearchIdc,
    MyIdc,
};