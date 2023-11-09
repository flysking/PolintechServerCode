const db = require('./dbConnection');
const IdcDTO=require('./IdcDTO');

const SearchIdc = (member_id, callback) => {
    const query =
    'select * from studentidc where idc_mid=? and idc_isaccept=0';
    db.query(query, [member_id], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(new Error(member_id,' 회원의학생증을 조회할 수 없습니다.'), null);
        return;
      }
      const idc = new IdcDTO(results[0]);
      console.log('idcDTO정보:',idc);
      callback(null, idc);
    });
  };

  const MyIdc = (member_id, callback) => {
    const query =
    'select *, member_name from polintech.studentidc join polintech.member on studentidc.idc_mid=member.member_id where idc_mid=?';
    db.query(query, [member_id], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(new Error(member_id,' 회원의학생증을 조회할 수 없습니다.'), null);
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