var static = require('node-static'),
    http   = require('http');

var file = new (static.Server)('./dist/');
var port = process.env.PORT || 8080;

http.createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}).listen(port);
console.log('App server running on port: ' + port);
console.log(file);