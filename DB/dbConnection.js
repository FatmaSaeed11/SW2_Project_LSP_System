const mysql = require ("mysql");

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'lsp_system',
    port : '3306'
  });

  connection.connect((err)=> {
    if (err) throw err;//{
      //console.error('connecting error');
      //return;
    //}
   
    console.log('DB connected');
  });
  module.exports = connection;