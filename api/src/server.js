/**
 * @module API
 */

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
var zipDir = "./zips/"

var serveIndex = require('serve-index')

var app = express();

var proxy = require('http-proxy-middleware');

app.use(cors({credentials: true, origin: 'http://localhost:3000/'}))




/**
 * @description Serve RIMOND module
 */
app.use(
  '/Rezbuild/Visualize/',
  proxy({ target: 'http://35.189.193.44/', changeOrigin: true })
);
app.use(
  '/RezBuild/',
  proxy({ target: 'http://35.189.193.44/', changeOrigin: true })
);


/**
 * @description Serve IFC files
 */
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

/**
 * @description Serve zip files
 */
app.use('/zip/:filename', (req, res, next) => {
  try {
    var zipFilename = req.params.filename
    res.sendFile(zipDir + "/" + zipFilename, { root: __dirname })
  }
  catch(err){
    res.send(err)
  }
})

/**
 * @description Serving file given its name and its associated task
 * @param {string} taskId - The id of the task
 * @return {string} filename - The name of the file
 */
app.use('/:taskId/:filename', (req, res, next) => {
    try {
      res.sendFile(fileDir + "/" + req.params.taskId + "/" + req.params.filename, { root: __dirname })
    }
    catch(err){
      res.send(err)
    }
})

var http = require('http').Server(app);
var io = require('socket.io')(http);

// Configure user session 
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



// Configure file upload 
var siofu = require("socketio-file-upload");
app.use(siofu.router)

// Configuring mail communication
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'rezbuildapp@gmail.com',
         pass: 'estia04081992'
     }
 });


// Configure and route websocket clients
io.on('connection', function(client){
    console.log(client.id, ' is connected.')
    var uploader = new siofu()
    uploader.dir =  './src/files/'
    uploader.listen(client)
    require('./routes/auth')(io, client)
    require('./routes/user')(io, client)
    require('./routes/project')(io, client)
    require('./routes/task')(io, client)
    require('./routes/file')(io, client, uploader)
    require('./routes/email')(io, client, transporter)
});

/**
 * HTTP server
 */
module.exports = {http};