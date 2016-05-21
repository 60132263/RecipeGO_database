var express = require('express');
var http = require('http');
var app = express();

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('hi, server');
  res.end();
}).listen(3000);
console.log('Listening on port 3000...');
