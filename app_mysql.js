var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var xss = require('node-xss').clean;
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '!234qwer',
  database : 'o2'
});
connection.connect();
app.locals.pretty = true;
app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/topic/add', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  connection.query(sql, function(err, topics, fields) {
    res.render('add', {topics:topics});
  });
});

app.post('/topic/add', function(req, res) {
  var title = xss(req.body.title);
  var desc = xss(req.body.description);
  var author = xss(req.body.author);
  var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
  connection.query(sql, [title, desc, author], function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error!!!');
    } else {
      res.redirect('/topic/' + result.insertId);
    }
  });
});

app.get('/topic/:id/edit', function(req, res) {
  var sql = 'SELECT * FROM topic';
  connection.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id = ?';
      connection.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error!!!');
        } else {
          console.log('topic: ' + topic);
          res.render('edit', {topics:topics, topic:topic[0]});
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error!!!');
    }
  });
});

app.post('/topic/:id/edit', function(req, res) {
  var id = req.params.id;
  var title = xss(req.body.title);
  var desc = xss(req.body.description);
  var author = xss(req.body.author);
  console.log('id : ' + id + ' , title : ' + title + ' , desc : ' + desc + ' , author : ' + author);
  var sql = 'UPDATE topic SET title = ?, description = ?, author = ? WHERE id = ?';
  connection.query(sql, [title, desc, author, id], function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error!!!');
    } else {
      res.redirect('/topic/' + id);
    }
  });
});

app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  connection.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id = ?';
      connection.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
        } else {
          res.render('view', {topics:topics, topic:topic[0]});
        }
      });
    } else {
      res.render('view', {topics:topics});
    }
  });
});

app.get('/topic/:id/delete', function(req, res) {
  var sql = 'SELECT * FROM topic';
  connection.query(sql, function(err, topics, fields){
    var sql = 'SELECT * FROM topic WHERE id = ?';
    var id = req.params.id;
    connection.query(sql, [id], function(err, topic, fields) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!!!');
      } else {
        if (topic.length === 0) {
          console.log('There is no record.');
          res.status(500).send('Internal Server Error!!!');
        } else {
          console.log('topic: ' + topic);
          res.render('delete', {topics:topics, topic:topic[0]});
        }
      }
    });
  });
});

app.post('/topic/:id/delete', function(req, res) {
  var id = req.params.id;
  var delYn = req.body.delYn;
  console.log('id : ' + id);
  var sql = 'DELETE FROM topic WHERE id = ?';
  if (delYn == 'YES') {
    connection.query(sql, [id], function(err, result, fields) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!!!');
      } else {
        res.redirect('/topic/');
      }
    });
  } else {
    res.redirect('/topic/');
  }
});

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
});
