//SERVER

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 8080);

app.use(express.static('public'));

module.exports = {
  'io': io,
  'app': app,
  'server': server
};
