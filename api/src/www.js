/**
 * @module API
 */
import path from 'path'
import express from 'express'
import expressSession from 'express-session'
import cors from 'cors'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import handshake from 'socket.io-handshake'
import fs from 'fs'
import proxy from 'http-proxy-middleware'
import json2html from 'node-json2html'
import SocketIO from 'socket.io'
import expressSocketIOSession from 'express-socket.io-session'
import siofu from 'socketio-file-upload'
import http from 'http'

import logger from './tools/logger'
import {User, Project, Task, Token} from './models'
import {routeAuth, routeUser, routeProject, routeTask, routeFile, routeEmail} from './routes'

// Declare relevant paths
var fileDir = "./files"
var zipDir = "./zips"
var logDir = "./logs"

// Create an express application
var app = express();

// Configure cross-origin resource sharing policy
app.use(cors({credentials: true, origin: 'https://rezbuildapp.estia.fr/'}))

// Define template for log file
const template = {'<>':'div','html':'<span style="font:message-box; font-size:14px"><span style="color:${color}">${timestamp}</span> <span style="background-color:${color};color:white;font-weight:bold">&nbsp;${level}&nbsp;</span>&nbsp;${message}</span>'}

/**
 * @description Serve log file
 */
app.use('/log', (req, res, next) => {
  try {
    var content = fs.readFileSync(path.resolve(__dirname, logDir + '/out.log'), 'utf8').split('\r\n');
    var content = ('['+content.slice(0, -1).join(',') + content.slice(-1)+']');
    var json = JSON.parse(content);
    var html = json2html.transform(json,template);
    res.send(html);
  }
  catch(err){
    console.error(err.message)
    res.send(err)
  }
})

/**
 * @description Serve raw log file (use it if 'api/log' does not work)
 */
app.use('/rawlog', (req, res, next) => {
  try {
    var content = fs.readFileSync(path.resolve(__dirname, logDir + '/out.log'), 'utf8');
    res.send(content);
  }
  catch(err){
    console.error(err.message)
    res.send(err)
  }
})

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
    var Id = req.params.Id
    if (!Id.endsWith('.ifc')) Id = Id + '.ifc';
    var splittedId = Id.split('_')
    var taskId = splittedId[0]
    var filename = splittedId.slice(1, splittedId.length).join('_')
    console.info('[api/ifc/'+ req.params.Id + '] Sending file ' + fileDir + "/" + taskId + "/" + filename);
    res.sendFile(fileDir + "/" + taskId + "/" + filename, { root: __dirname })
  }
  catch(err){
    console.error('[api/ifc/'+ req.params.Id + ']' + err);
    res.send(err)
  }
})

/**
 * @description Serve zip files
 */
app.use('/zip/:filename', (req, res, next) => {
  try {
    var zipFilename = req.params.filename
    console.info('[api/zip/'+ req.params.filename + '] Sending zip ' + zipDir + "/" + zipFilename);
    res.sendFile(zipDir + "/" + zipFilename, { root: __dirname })
  }
  catch(err){
    console.error('[api/zip/'+ req.params.filename + '] ' + err);
    res.send(err)
  }
})

/**
 * @description Serving file given its name and its task ID
 */
app.use('/:taskId/:filename', (req, res, next) => {
    try {
      console.info('[api/' + req.params.taskId + '/'+ req.params.filename + '] Sending file ' + fileDir + "/" + req.params.taskId + "/" + req.params.filename);
      res.sendFile(fileDir + "/" + req.params.taskId + "/" + req.params.filename, { root: __dirname })
    }
    catch(err){
      console.error('[api/' + req.params.taskId + '/'+ req.params.filename + '] ' + err);
      res.send(err)
    }
})

// Create an HTTP server
var www = http.Server(app);

//  Create a websocket broker using the HTTP server
var io = SocketIO(www);

// Configure the user session 
var session = expressSession({
    secret: "estia",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
});
// Add the user session configuration to the express app
app.use(session);
// Add the user session configuration to the websocket broker
io.set('origins',  '*:*');
io.use(expressSocketIOSession(session));

// Add websocket file upload to the express app
app.use(siofu.router)

// Configuring mail communication
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
        //  user: 'rezbuildapp@gmail.com',
        //  pass: 'estia04081992'
         user: 'rezbuild.estia@gmail.com',
         pass: '?S+K&zcJ.ub4N;1~del|'
      }
 });

// Configure the routes of the websocket broker
io.on('connection', (client) => {
    console.info(client.id, ' is connected.')
    var uploader = new siofu()
    uploader.dir =  './src/files/'
    uploader.listen(client)
    routeAuth(io, client, transporter)
    routeUser(io, client)
    routeProject(io, client)
    routeTask(io, client)
    routeFile(io, client, uploader)
    routeEmail(io, client, transporter)
});

export {www};