var static = require('node-static'),
    http   = require('http');

var file = new (static.Server)('./dist');

http.createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}).listen(process.env.PORT || 8080);