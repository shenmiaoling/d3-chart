
var express = require('express');
var http = require('http')
var app = express();
// app.use('/images', express.static('images'))
app.use('/build', express.static('build'));

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/src/index.html');
})
var server = http.createServer(app)

app.listen(4567, function(err) {
  if(err) {
    console.log(err);
    return;
  }

  console.log('running in http://localhost:4567');
});
