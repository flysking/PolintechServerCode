const mysql = require('mysql');

const db = mysql.createConnection({
  host: '34.64.181.70',
  user: 'flysking59',
  password: 'Ican8948@',
  database: 'polintech',
});

db.connect(error => {
  if (error) {
    console.error('데이터베이스 연결 실패:', error.stack);
    return;
  }
  console.log('데이터베이스에 연결되었습니다.');
});

module.exports = db;