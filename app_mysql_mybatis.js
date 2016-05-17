var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var xss = require('node-xss').clean;
var mysql = require('mysql');
global.pool = mysql.createPool({
  connectionLimit: 20,
  host : 'localhost',
  user : 'root',
  password : '!234qwer',
  database : 'o2',
  waitForConnections:true,
  typeCast : true,
  multipleStatements: true
});
var mybatis = require('mybatisnodejs');

app.locals.pretty = true;
app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(mybatis.Contexto.domainMiddleware);
app.use(mybatis.Contexto.middlewareOnError);

var sessionFactory  = new mybatis.Principal().processe('C:/Users/User/dev/js/serverside_javascript/');
global.sessionFactory = sessionFactory;


app.listen(3000, function() {
  console.log('path : ' + path + ' , path.join(__dirname) : ' + path.join(__dirname));
  console.log('Connected, 3000 port!');
});
