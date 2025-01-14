var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback');

app = express();
app.use(history());
app.use(serveStatic(__dirname + "/dist"));

var port = process.env.PORT || 5005
app.listen(port)
console.log('server started ' + port)