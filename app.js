var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.post('/form_receiver', (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  res.send(title + ', ' + description);
});
app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/topic/:id', (req, res) => {
  var topics = [
    'Javascript is ...',
    'Nodejs is ...',
    'Express is ...',
  ];
  var str = `
<a href="/topic?id=0">Javascript</a><br/>
<a href="/topic?id=1">Nodejs</a><br/>
<a href="/topic?id=2">Express</a><br/><br/>
  `;
  var id = req.params.id || 0;
  var output = str + topics[id];
  res.send(output);
});



app.get('/template', (req, res) => {
  res.render('temp', {title:'Jade',time:Date()});
});

app.get('/', (req, res) => {
  res.send('Hello home page!');
});

app.get('/dynamic', (req, res) => {
  var lis = '';
  for (var i = 0; i < 5; i++) {
    lis = lis + '<li>coding</li>';
  }
  var output = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    Hello, Dynamic!
    <ul>
      ${lis}
    </ul>
  </body>
</html>
  `;
  res.send(output);
});

app.get('/route', (req, res) => {
  res.send('Hello Router, <img src="/route.png" />');
});

app.get('/login', (req, res) => {
  res.send('<h1>Login please</h1>');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});


