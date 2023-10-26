const db = require('./dbConnection');
const ImageDTO=require('./ImageDTO');

const UploadToDB=(req,res)=>{
    const data=req.body;
    console.log(data);
    const query ='insert into polintech.image (image_name,image_category,image_mid) values (?,?,?)';
    if (
        //게시글 정보가 누락되었을
        !data.member_id ||
        !data.image_category ||
        !data.image_name
      ) {
        res.status(400).json({error: '이미지 테이블 정보 누락'});
        return;
      }
      db.query(
        query,[
            data.image_name,
            data.image_category,
            data.member_id,
        ],
        (error,results) => {
            if(error){
                console.error('SQL 오류:',error);
                res.status(500).json({error:'데이터베이스 오류가 발생하였습니다.'});
                return;
            }
            res.json({
                success:true,
            });
        },
      );
};

module.exports={
    UploadToDB,
};