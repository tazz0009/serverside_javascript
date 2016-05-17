var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '!234qwer',
  database : 'o2'
});

connection.connect();

connection.query('SELECT * FROM topic', function(err, rows, fields) {
  if (err) {
    console.log(err);
  } else {
    for (var index in rows) {
      console.log(rows[index].title);
    }
  }
});

connection.end();
