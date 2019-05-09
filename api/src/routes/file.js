module.exports = function(io, client, uploader){
   var File = require('../models').File
   var fs = require('fs');
   uploader.on("saved", (event) => {
        console.log(event.file.meta.revision, client.handshake.session.user._id, event.file.name);
        var oldFileName = event.file.name
        var newFileName = event.file.meta.revision+'_'+event.file.name
        fs.rename(uploader.dir+'/'+oldFileName, uploader.dir+'/'+newFileName, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
   });
}
