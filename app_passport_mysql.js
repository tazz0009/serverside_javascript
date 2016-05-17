var express = require('express');
// post 방식의 피라미터를 처리하기 위함.
var bodyParser = require('body-parser');
// session 사용
var session = require('express-session');
// session을 mysql에 저장
var MySQLStore = require('express-mysql-session')(session);
// password 암호화 방식 - pdkdf2 사용
var bkfd2Password = require("pbkdf2-password");
// 범용 인증 모듈
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var app = express();
var hasher = bkfd2Password();
var options = {
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '!234qwer',
  database : 'o2'
};
var sessionStore = new MySQLStore(options);
// mysqlDB와 통신하기 위함.
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '!234qwer',
  database : 'o2'
});
conn.connect();
// html code 정돈하기 위함.
app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// express-session 세팅
app.use(session({
  secret:'!234qwer',
  resave:false,
  saveUninitialized:true,
  store:sessionStore
}));
// passport 세팅
app.use(passport.initialize());
app.use(passport.session());

//----------------------> route 시작
// 진입점
app.get('/welcome', function(req, res) {
  if (req.user && req.user.displayName) {
    res.send(`
  <h1>Hello, ${req.user.displayName}</h1>
  <a href="/auth/logout">logout</a>
      `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <p>
        <a href="/auth/login">login</a>
      </p>
      <p>
        <a href="/auth/register">register</a>
      </p>
      `
    );
  }
});
// 로그인을 하기위한 페이지로 이동
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
<a href="/auth/facebook">facebook</a>
  `;
  res.send(output);
});
// 로그인이 성공하면 function(user, done)을 이용해서 session에 저장할 정보를
// done(null, user)과 같이 두번째 인자로 넘기면 된다.
// 이때 user로 넘어오는 정보는 앞의 LocalStrategy 객체의 인증함수에서
// done(null, user)에 의해 리턴된 값이 넘어온다.
passport.serializeUser(function(user, done) {
  console.log('serializeUser : ', user);
  done(null, user.authId);
});
// node.js의 모든 페이지에 접근할때, 로그인 되어 있을 경우 모든 사용자 페이지를
// 접근할 경우 실행된다.
// deserializeUser에서는 session에 저장된 값을 이용해서, 사용자 profile을 찾은 후,
// HTTP Request를 리턴한다.
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser : ', id);
  var sql = 'SELECT * FROM users WHERE authId = ?';
  conn.query(sql, [id], function(err, results) {
    if (err) {
      console.log(err);
      done('There is no user.');
    } else {
      done(null, results[0]);
    }
  });
});
// 입력폼으로 username과 password를 입력받아 인증하는 방법 구현
passport.use(new LocalStrategy(
  // 인증시에 호출되는 인증메서드 정의
  function(username, password, done) {
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE authId = ?';
    conn.query(sql, ['local:' + uname], function(err, results) {
      console.log(results);
      if (err) {
        console.log(err);
        return done('There is no user.');
      }
      var user = results[0];
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
        if (hash === user.password) {
          console.log('LocalStrategy : ', user);
          done(null, user);
        } else {
          done(null, false);
        }
      });
    });
  }
));
// facebook을 통해서 인증하는 방법 구현
passport.use(new FacebookStrategy({
    clientID: '1579881515674330',
    clientSecret: '048b2593c6a02cbcab95640693640a32',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:profile.id';
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [authId], function(err, results) {
      if (results.length > 0) {
        done(null, results[0]);
      } else {
        var newuser = {
          'authId':authId,
          'displayName':profile.displayName,
          'email':profile.emails[0].value
        };
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, newuser, function(err, results) {
          if (err) {
            console.log(err);
            done('Error');
          } else {
              done(null, newuser);
          }
        });
      }
    });
  }
));

app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {successRedirect:'/welcome', failureRedirect:'/auth/login', failureFlash:false}
  )
);

app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook',
    {scope:'email'}
  )
);

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {successRedirect: '/welcome', failureRedirect: '/auth/login'}
  )
);
// 로그아웃
app.get('/auth/logout', function(req, res) {
  req.logout();
  req.session.save(function() {
    res.redirect('/welcome');
  });
});
// 사용자등록을 하기위한 페이지로 이동
app.get('/auth/register', function(req, res) {
  var output = `
<h1>Register</h1>
<form action="/auth/register" method="post">
  <p>
    <input type="text" name="username" placeholder="username" />
  </p>
  <p>
    <input type="password" name="password" placeholder="password" />
  </p>
  <p>
    <input type="text" name="displayName" placeholder="displayName" />
  </p>
  <p>
    <input type="submit" value="전송" />
  </p>
</form>
  `;
  res.send(output);
});
// 사용자등록
app.post('/auth/register', function(req, res) {
  hasher({password:req.body.password}, function(err, pass, salt, hash) {
    var user = {
      authId:'local:' + req.body.username,
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    };
    var sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, function(err, results) {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        req.login(user, function(err) {
          req.session.save(function() {
            return res.redirect('/welcome');
          });
        });
      }
    });
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
