module.exports = function(io, client){
   var ss = require('socket.io-stream')
   var File = require('../models').File
   var path = require('path')
   var fs = require('fs')

   ss(client).on('api/upload', function(stream, data) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
  });
}
