var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')

app = express();
// Use a fallback for non-root routes (required for Vue router)
//   NOTE: History fallback must be "used" before the static serving middleware!
app.use(history({
    // OPTIONAL: Includes more verbose logging
    verbose: true
}))

// Serve static assets from the build files (images, etc)
app.use(serveStatic(path.join(__dirname, '/dist')))

var port = process.env.PORT || 5005
app.listen(port)
console.log('server started ' + port)