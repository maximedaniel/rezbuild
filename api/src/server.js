//importing dependencies
import express from 'express'
import db from './models'
import cors from 'cors'
import BimController from './BimController'

var mongoose = require("mongoose");
var User = db.User;
var Project = db.Project;
var Revision = db.Revision;
var Task = db.Task;

var handshake = require('socket.io-handshake');
var fs = require('fs');


var app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000/'}))
app.use('/', (req,res, next) => {
    fs.readFile('api.log', 'utf8', function(err, data) {
    if (err) res.send(err);
    else res.send(data);
    });
})

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
io.set('origins', '*:*');
io.use(sharedsession(session));


var siofu = require("socketio-file-upload");
app.use(siofu.router)

var filesDir = "./files/"

io.on('connection', function(client){
    console.log(client.id, ' is connected.')
    var uploader = new siofu()
    uploader.dir = filesDir
    uploader.listen(client)

    uploader.on("saved", (event) => {
        console.log(event.file.meta.revision);
    });

    require('./routes/auth')(io, client)
    require('./routes/user')(io, client)
    require('./routes/project')(io, client)
    require('./routes/revision')(io, client)
    require('./routes/task')(io, client)
});

import './test/test.js'


module.exports = {http};