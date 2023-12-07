const db = require('./dbConnection');
const ImageDTO=require('./ImageDTO');

const UploadToDB=(req,res)=>{
    const data=req.body;
    console.log(data);
    //이미지명, 이미지 형식, 업로드 한 유저의 아이디를 db에 저장합니다. 이미지 형식은 사용하는 코드에서 미리 약속한 값을 지정해줍니다.
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
    //게시글 이미지는 이미지 유형이 게시글 로 삽입됩니다.
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
  //특정 게시글에 등록된 이미지의 이름을 바꿉니다.
  //게시글의 이미지가 새롭게 등록이되면 이미지 서버에 새롭게 이미지가 업로드되고, db에는 이미지 명만 업데이트 되는 방식입니다.
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
  //특정 회원 학생증 용으로 업로드 된 이미지 중 가장 최근의 이미지를 보여줍니다.
  //이 덕분에 버킷에서 필터링을 할 필요가 없어집니다.
  const ReturnIdcImage = (member_id, callback) => {
    //이미지 확인
    console.log(member_id);
    const query = 'select * from polintech.image where image_mid = ? and image_category="학생증" order by image_id desc limit 1';
    db.query(query, [member_id], (error, results) => {
      if (error) {
        callback(error, null);
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
    ReturnIdcImage,
};