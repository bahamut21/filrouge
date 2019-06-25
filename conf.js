
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'JeCodePiedsNus',
  database: 'filrouge',
});
module.exports = connection;
