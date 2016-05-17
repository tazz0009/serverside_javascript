var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/scroll', (req, res) => {
  var str = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" >
  <head>
      <title>Untitled Page</title>
      <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
      <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>


      <script type="text/javascript">
  function lastPostFunc()
  {
      $("div#lastPostsLoader").html("로딩중...");
      $.get("/data",

      function(data){
          if (data != "") {
          $(".wrdLatest:last").after(data);
          }
          $("div#lastPostsLoader").empty();
      });
  };

  $(window).scroll(function(){
          if  ($(window).scrollTop() == $(document).height() - $(window).height()){
              console.log('aa');
             lastPostFunc();
          }
  });
      </script>
  </head>
  <body>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest">content</div>
      <div class="wrdLatest" id=9>content</div>
      <div class="wrdLatest" id=8>content</div>
      <div id="lastPostsLoader"></div>
  </body>
  </html>
  `;
  res.send(str);
});

app.get('/data', (req, res) => {
  var str = `
  <div>Data1</div>
  <div>Data2</div>
  <div>Data3</div>
  <div>Data4</div>
  <div>Data5</div>
  <div>Data6</div>
  <div>Data7</div>
  <div>Data8</div>
  <div>Data1</div>
  <div>Data2</div>
  <div>Data3</div>
  <div>Data4</div>
  <div>Data5</div>
  <div>Data6</div>
  <div>Data7</div>
  <div>Data8</div>
  <div>Data1</div>
  <div>Data2</div>
  <div>Data3</div>
  <div>Data4</div>
  <div>Data5</div>
  <div>Data6</div>
  <div>Data7</div>
  <div>Data8</div>
  <div>Data1</div>
  <div>Data2</div>
  <div>Data3</div>
  <div>Data4</div>
  <div>Data5</div>
  <div>Data6</div>
  <div>Data7</div>
  <div>Data8</div>
  <div>Data1</div>
  <div>Data2</div>
  <div>Data3</div>
  <div>Data4</div>
  <div>Data5</div>
  <div>Data6</div>
  <div>Data7</div>
  <div>Data8</div>
  <div>Data1</div>
  <div>Data2</div>
  <div>Data3</div>
  <div>Data4</div>
  <div>Data5</div>
  <div>Data6</div>
  <div>Data7</div>
  <div>Data8</div>
  `;
  res.send(str);
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
