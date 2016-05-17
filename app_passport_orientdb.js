var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var OrientoStore = require('connect-oriento')(session);
var passport = require('passport');
var bkfd2Password = require("pbkdf2-password");
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var app = express();
var hasher = bkfd2Password();
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '!234qwer'
});
var db = server.use('o2');

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
  secret:'!234qwer',
  resave:false,
  saveUninitialized:true,
  store:new OrientoStore(
    {
      server:'host=localhost&port=2424&username=root&password=!234qwer&db=o2'
    }
  )
}));
app.use(passport.initialize());
app.use(passport.session());

var users = [
  {
    authId:'local:tazz009',
    username:'tazz009',
    password:'wsGZ2iPyMM5BW/6hpGdicHDv/rvVoNkatusoWJjKRwIcWlkCxQEBiNXejaEjtXZXVxhs2lcXUoQm2kANLrgo5EyRSXZIr/VVZeiJ+u5u47C5Ep2WU62j9OdPFsCn5S0ZqF1Pl55DKWlocoahkTaAlpm6rnKz1Zk0qydWaVK/P/I=',
    salt:'mzyyARY0FooE+VNRiC5g/9x1teWsAxzedQEt5u5yzOPdnqrGPrIw1YTEGbReq4mjKdwStLCIP/VyEsbnktXSLA==',
    displayName:'TAZZ009'
  }
];

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
<a href="/auth/facebook">facebook</a>
  `;
  res.send(output);
});
// done 메소드를 실행할때마다
passport.serializeUser(function(user, done) {
  console.log('serializeUser : ', user);
  done(null, user.authId);
});
// 접속할때마다
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser : ', id);
  var sql = "SELECT FROM user WHERE authId = :authId";
  db.query(sql, {params:{authId:id}}).then(function(results) {
    if (results.length === 0) {
      done('There is no user.');
    } else {
      done(null, results[0]);
    }
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM user WHERE authId = :authId';
    db.query(sql, {params:{authId:'local:'+uname}}).then(function(results) {
      console.log(results);
      if (results.length === 0) {
        return done(null, false);
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

passport.use(new FacebookStrategy({
    clientID: '1579881515674330',
    clientSecret: '048b2593c6a02cbcab95640693640a32',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    var sql = 'SELECT * FROM user WHERE authId = :authId';
    db.query(sql, {params:{authId:authId}}).then(function(results) {
      if (results.length === 0) {
        var newuser = {
          'authId':authId,
          'displayName':profile.displayName,
          'email':profile.emails[0].value
        };
        var sql = 'INSERT INTO user (authId, displayName, email) VALUES (:authId, :displayName, :email)'
        db.query(sql, {params:newuser}).then(function(resulst) {
          done(null, newuser);
        }, function(err) {
          console.log(err);
          done('Error');
        });
      } else {
        return done(null, results[0]);
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

// app.post('/auth/login', function(req, res) {
//   var user = {
//     username:'tazz009',
//     password:'!234qwer',
//     displayName:'최승환'
//   };
//   var uname = req.body.username;
//   var pwd = req.body.password;
//   if (uname === user.username && pwd === user.password) {
//     req.session.displayName = user.displayName;
//     res.redirect('/welcome');
//   } else {
//     res.send('Who are you? <a href="/auth/login">login</a>');
//   }
// });

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
      `);
  }
});

app.get('/auth/logout', function(req, res) {
  req.logout();
  req.session.save(function() {
    res.redirect('/welcome');
  });
});

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

app.post('/auth/register', function(req, res) {
  hasher({password:req.body.password}, function(err, pass, salt, hash) {
    var user = {
      authId:'local:'+req.body.username,
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    };
    var sql = 'INSERT INTO user (authId, username, password, salt, displayName) VALUES (:authId, :username, :password, :salt, :displayName)';
    db.query(sql, {
      params:user
    }).then(function(results) {
      // res.redirect('/welcome');
      req.login(user, function(err) {
         req.session.save(function() {
           return res.redirect('/welcome');
         });
      });
    }, function(err) {
      console.log(err);
      res.status(500);
    });
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
