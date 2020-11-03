

/**
 * @module FileRouting
 * @description Handle the routes (save, get) for file upload
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 * @param {object} uploader FileUploader
 */
import sanitize from 'sanitize-filename'
import fs from 'fs'

module.exports = (io, client, uploader) => {
   // import File model
   var File = require('../models').File
   /**
    * @description Route file save request
    */
   uploader.on("saved", (event) => {
        if (event.error) console.info('[/api/file/save] Receiving file with error ' + event.error);
        else console.info('[/api/file/save] Receiving file ' + event.file.name  + ' with state ' + event.file.success);
        console.info('[/api/file/save] Creating directory ' + uploader.dir + event.file.meta.taskId)
        fs.mkdir(uploader.dir+'/'+event.file.meta.taskId, { recursive: true }, (err) => {
            if (err) console.error('[/api/file/save] ' + err);
        });
        var newFilename = sanitize(event.file.name);
        console.info('[/api/file/save] Sanitizing and renaming file ' + uploader.dir + event.file.name + ' into ' + uploader.dir+event.file.meta.taskId + '/' + newFilename)
        fs.rename(uploader.dir+ '/' + event.file.name, uploader.dir+'/'+event.file.meta.taskId + '/' + newFilename, function(err) {
            if (err) console.error('[/api/file/save] ' + err);
        });
   });
   /**
    * @description Route file get request
    */
   client.on('/api/files', (taskId, res) => {
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
