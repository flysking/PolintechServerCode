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
const UploadBoardImageToDB = (req, res) => {
    //게시글 이미지
    const data = req.body;
    console.log('게시글 이미지 업로드(DB)', data);
    const query =
      'insert into polintech.image (image_name,image_category,image_mid,image_bid) values (?,?,?,?)';
    if (
      //게시글 정보가 누락되었을
      !data.member_id ||
      !data.image_category ||
      !data.image_name ||
      !data.board_id
    ) {
      console.log('이미지 테이블 정보 누락'); // 실패 로그 추가
      res.status(400).json({error: '이미지 테이블 정보 누락'});
      return;
    }
    db.query(
      query,
      [data.image_name, data.image_category, data.member_id, data.board_id],
      (error, results) => {
        if (error) {
          console.error('SQL 오류:', error);
          res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
          return;
        }
        console.log('데이터베이스에 성공적으로 이미지 삽입됨'); // 성공 로그 추가
        res.json({
          success: true,
        });
      },
    );
  };
  const UpdateBoardImageToDB = (req, res, next) => {
    //게시글 수정
    const imageData = req.body;
    const query = 'UPDATE polintech.image SET image_name = ? WHERE image_bid = ?';
  
    if (!imageData.image_name || !imageData.board_id) {
      res.status(400).json({error: '게시글 정보가 누락되었습니다.'});
      return;
    }
  
    db.query(
      query,
      [imageData.image_name, imageData.board_id],
      (error, results) => {
        if (error) {
          console.error('SQL 오류:', error);
          res.status(500).json({error: '데이터베이스 오류가 발생하였습니다.'});
          return;
        }
        console.log('데이터베이스에 성공적으로 이미지 수정됨');
        res.json({
          success: true,
          image: imageData,
        });
      },
    );
  };
  const imageCheck = (board_id, callback) => {
    //이미지 확인
    console.log(board_id);
    const query = 'select * from polintech.image where image_bid = ?';
    db.query(query, [board_id], (error, results) => {
      if (error) {
        // callback(error, null);
        return;
      }
  
      if (results.length > 0) {
        const image = new ImageDTO(results[0]);
        console.log('이미지 데이터(DB) ', image);
        callback(null, image);
      } else {
        console.log('일치하는 이미지가 없습니다.');
        callback(null, null);
      }
    });
  };
  


module.exports={
    UploadToDB,
    UploadBoardImageToDB,
    UpdateBoardImageToDB,
    imageCheck,
};