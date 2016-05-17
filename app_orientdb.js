var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '!234qwer'
});
var db = server.use('o2');

app.locals.pretty = true;
app.set('views', './views_orientdb');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/topic/add', function(req, res) {
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    res.render('add', {topics:topics});
  });
});

app.post('/topic/add', function(req, res) {
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES (:title, :desc, :author)';
  db.query(sql,{
    params:{
      title:title,
      desc:desc,
      author:author,
    }
  }).then(function(results){
    res.redirect('/topic/' + encodeURIComponent(results[0]['@rid']));
  });
});

app.get('/topic/:id/edit', function(req, res) {
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    var sql = 'SELECT FROM topic WHERE @rid = :rid';
    var id = req.params.id;
    console.log('id : ' + id);
    db.query(sql, {params:{rid:id}}).then(function(topic) {
      console.log('topic: ' + topic);
      res.render('edit', {topics:topics, topic:topic[0]});
    });
  });
});

app.post('/topic/:id/edit', function(req, res) {
  var id = req.params.id;
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;
  var sql = 'UPDATE topic SET title = :title, description = :desc, author = :author WHERE @rid = :rid';
  db.query(sql,{
    params:{
      rid:id,
      title:title,
      desc:desc,
      author:author,
    }
  }).then(function(results){
    res.redirect('/topic/' + encodeURIComponent(id));
  });
});

app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    var sql = 'SELECT FROM topic WHERE @rid = :rid';
    var id = req.params.id;
    console.log('id : ' + id);
    if (id) {
      db.query(sql, {params:{rid:id}}).then(function(topic) {
        console.log('topic: ' + topic);
        res.render('view', {topics:topics, topic:topic[0]});
      });
    } else {
      res.render('view', {topics:topics});
    }
  });
});

app.get('/topic/:id/delete', function(req, res) {
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    var sql = 'SELECT FROM topic WHERE @rid = :rid';
    var id = req.params.id;
    console.log('id : ' + id);
    db.query(sql, {params:{rid:id}}).then(function(topic) {
      console.log('topic: ' + topic);
      res.render('delete', {topics:topics, topic:topic[0]});
    });
  });
});

app.post('/topic/:id/delete', function(req, res) {
  var id = req.params.id;
  var delYn = req.body.delYn;
  console.log('id : ' + id + ' , delYn : ' + delYn);
  var sql = 'DELETE FROM topic WHERE @rid = :rid';
  if (delYn == 'YES') {
    db.query(sql,{
      params:{
        rid:id,
      }
    }).then(function(results){
      res.redirect('/topic');
    });
  } else {
    res.redirect('/topic');
  }
});

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
});
