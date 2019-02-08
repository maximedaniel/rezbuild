var fs = require('fs')
var nomnoml = require('nomnoml');
var src = 'data.js'
var http = require('http');

var port = process.env.API_PORT || 8080;

fs.readFile(src, "utf8", function(err, data) {
    console.log(`api running on ${port}`);
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(nomnoml.renderSvg(data));
    }).listen(port);
});

