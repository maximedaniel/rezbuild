

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
        console.info('[/api/file/save] creating directory ' + uploader.dir + event.file.meta.taskId)
        fs.mkdir(uploader.dir+'/'+event.file.meta.taskId, { recursive: true }, (err) => {
            if (err)  console.error('[/api/file/save] ' + err);
          });
        var newFilename = sanitize(event.file.name);
        console.info('[/api/file/save] sanitizing and renamin file ' + uploader.dir + event.file.name + ' into ' + uploader.dir+event.file.meta.taskId + '/' + newFilename)
        fs.rename(uploader.dir+ '/' + event.file.name, uploader.dir+'/'+event.file.meta.taskId + '/' + newFilename, function(err) {
            if ( err ) console.error('[/api/file/save] ' + err);
        });
   });

   client.on('/api/files', function (taskId, res) {
        if(client.handshake.session.user) {
            var dirPath = uploader.dir + '/' + taskId
            console.error('[/api/file/get] reading files in directory '+ dirPath);
            fs.readdir(dirPath, function (error, files) {
                if (error) {
                    console.error('[/api/file/get] '+ error);
                    res({error: error});
                } 
                var ans = {}
                if(files) files.map(file => ans[file] = fs.statSync(dirPath + '/' + file))
                console.error('[/api/file/get] returning files '+ files);
                res(ans);
            });

        } else {
            console.error('[/api/file/get] User not signed in');
            res({error: 'User not signed in'})
        }
    });
}
