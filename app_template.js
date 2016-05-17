var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
