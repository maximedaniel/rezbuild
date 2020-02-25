

/**
 * @module FileRouting
 * @description Handle the routes (save) for file upload
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 * @param {object} uploader FileUploader
 */
import sanitize from 'sanitize-filename'
module.exports = function(io, client, uploader){
   var File = require('../models').File
   var fs = require('fs');
   uploader.on("saved", (event) => {
        console.log(event.file.meta.taskId, client.handshake.session.user._id, event.file.name);
        fs.mkdir(uploader.dir+'/'+event.file.meta.taskId, { recursive: true }, (err) => {
            if (err)  console.log('ERROR: ' + err);
          });
        var newFilename = sanitize(event.file.name);
        fs.rename(uploader.dir+ '/' + event.file.name, uploader.dir+'/'+event.file.meta.taskId + '/' + newFilename, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
   });

   client.on('/api/files', function (taskId, res) {
        console.log('/api/files', taskId)
        if(client.handshake.session.user) {
            var dirPath = uploader.dir + '/' + taskId
            fs.readdir(dirPath, function (error, files) {
                console.log(error, files)
                if (error) {
                res({error: error});
                } 
                var ans = {}
                if(files) files.map(file => ans[file] = fs.statSync(dirPath + '/' + file))
                res(ans);
            });

        } else {
            res({error: 'User not signed in'})
        }
    });
}
