//importing dependencies
import express from 'express'
import db from './models'
import cors from 'cors'
import nodemailer from 'nodemailer'

var mongoose = require("mongoose");
var User = db.User;
var Project = db.Project;
var Task = db.Task;

var handshake = require('socket.io-handshake');
var fs = require('fs');

var fileDir = "./files/"

var serveIndex = require('serve-index')

var app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000/'}))

app.use('/ifc/:Id', (req, res, next) => {
  try {
    var splittedId = req.params.Id.split('_', 2)
    var taskId = splittedId[0]
    var filename = splittedId[1] + '.ifc'
    res.sendFile(fileDir + "/" + taskId + "/" + filename, { root: __dirname })
  }
  catch(err){
    res.send(err)
  }
})
app.use('/:taskId/:filename', (req, res, next) => {
    try {
      res.sendFile(fileDir + "/" + req.params.taskId + "/" + req.params.filename, { root: __dirname })
    }
    catch(err){
      res.send(err)
    }
})
/*app.use('/:taskId/', (req, res, next) => {
  var dirPath = fileDir+'/'+ req.params.taskId
  fs.readdir(dirPath, function (err, files) {
    //handling error
    if (err) {
      res.send(err);
    } 
    //listing all files using forEach
    var ans = {}
    if(files)files.map(file => ans[file] = fs.statSync(dirPath + '/' + file))
    res.send(ans)
  });
});*/

/*app.use('/file/:name', (req, res, next) => {
    var options = {
        root: fileDir,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };
    var fileName = req.params.name;
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent:', fileName);
        }
      });
});*/

var http = require('http').Server(app);
var io = require('socket.io')(http);

var session = require('express-session')({
    secret: "estia",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
});
var sharedsession = require("express-socket.io-session");
app.use(session);
io.set('origins',  '*:*');
io.use(sharedsession(session));


var siofu = require("socketio-file-upload");
app.use(siofu.router)

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'rezbuildapp@gmail.com',
         pass: 'estia04081992'
     }
 });


io.on('connection', function(client){
    console.log(client.id, ' is connected.')
    var uploader = new siofu()
    uploader.dir =  './src/files/'
    uploader.listen(client)
    require('./routes/auth')(io, client)
    require('./routes/user')(io, client)
    require('./routes/project')(io, client)
    require('./routes/task')(io, client) // test
    require('./routes/file')(io, client, uploader)
    require('./routes/email')(io, client, transporter)
});

module.exports = {http};