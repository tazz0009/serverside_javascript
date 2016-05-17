var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser('1234qwerqwrq312rewa'));

var products = {
  1:{title:'Apple'},
  2:{title:'Pear'}
};

app.get('/products', function(req, res) {
  var output = '';
  for (var key in products) {
    console.log(products[key].title);
    output += `
      <li>
        <a href="/cart/${key}">${products[key].title}</a>
      </li>
      `;
  }
  res.send(`
    <h1>products</h1>
    <ul>${output}</ul>
    <a href="/cart">Cart</a>
    `);
});

app.get('/cart/:id', function(req, res) {
  var id = req.params.id;
  if (req.signedCookies.cart) {
    var cart = req.signedCookies.cart;
  } else {
    var cart = {};
  }
  if (!cart[id]) {
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id]) + 1;
  res.cookie('cart', cart, {signed:true});
  res.redirect('/cart');
});

app.get('/cart', function(req, res) {
  var cart = req.signedCookies.cart;
  console.log('cart : ' + cart);
  if (!cart) {
    res.send('Empty!!!');
  } else {
    var output = '';
    for(var key in cart) {
      output += `
        <li>${products[key].title} (${cart[key]})</li>
      `;
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href='/products'>products List</a>
    `);
});

app.get('/count', function(req, res) {
  if (req.signedCookies.count) {
    var count = parseInt(req.signedCookies.count);
  } else {
    var count = 0;
  }
  count = count + 1;
  res.cookie('count', count, {signed:true});
  res.send('count : ' + count);
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
