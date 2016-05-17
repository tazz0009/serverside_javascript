var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var app = express();
var options = {
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '!234qwer',
  database : 'o2'
};
var sessionStore = new MySQLStore(options);

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
  key:'!234qwer',
  secret:'!234qwer',
  store:sessionStore,
  resave:false,
  saveUninitialized:true
}));

app.get('/count', function(req, res) {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : ' + req.session.count);
});

app.get('/tmp', function(req, res) {
  res.send('result : ' + req.session.count);
});

app.get('/auth/login', function(req, res) {
  var output = `
<h1>Login</h1>
<form action="/auth/login" method="post">
  <p>
    <input type="text" name="username" placeholder="username" />
  </p>
  <p>
    <input type="password" name="password" placeholder="password" />
  </p>
  <p>
    <input type="submit" value="전송" />
  </p>
</form>
  `;
  res.send(output);
});

app.post('/auth/login', function(req, res) {
  var user = {
    username:'tazz009',
    password:'!234qwer',
    displayName:'최승환'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if (uname === user.username && pwd === user.password) {
    req.session.displayName = user.displayName;
    req.session.save(function() {
      res.redirect('/welcome');
    });
  } else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
});

app.get('/welcome', function(req, res) {
  if (req.session.displayName) {
    res.send(`
  <h1>Hello, ${req.session.displayName}</h1>
  <a href="/auth/logout">logout</a>
      `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">login</a>
      `);
  }
});

app.get('/auth/logout', function(req, res) {
  delete req.session.displayName;
  req.session.save(function() {
    res.redirect('/welcome');
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
