//importing dependencies
import express from 'express'
import db from './models'
import BimController from './controllers/BimController'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import passportLocal from 'passport-local'
import cors from 'cors'

var mongoose = require("mongoose");

var LocalStrategy = passportLocal.Strategy;
// bim routes

var app = express(),
  router = express.Router();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var User = db.User;
var Project = db.Project;
var Revision = db.Revision;
var Task = db.Task;
//to config API to use body body-parser and look for JSON in req.body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser('estia'));
app.use(session({secret : 'estia', resave:false, saveUninitialized:false, cookie: { secure: false }}));

app.use(cors({credentials: true, origin: 'http://localhost:3000/'}))

app.get('/test', (req, res) => res.send('Hello Node on Divio!'))

/*
app.post('/api/signup', (req, res) => {
    console.log('signup')
    User.register(new User({ username : req.body.username, firstname : req.body.firstname, lastname : req.body.lastname, roles : req.body.roles}), req.body.password, (err, user) => {
        if (err) {
            req.session.destroy();
            return  res.status(460).send(err.message);
        }

        passport.authenticate('local')(req, res, function () {
               User.findOne({_id: req.user._id}, function (err, user) {
                        if(err) res.status(460).send(err.message);
                        else {
                            req.session.user = user;
                            req.session.save( () => res.status(200).send({user : user}))
                        }
                });
        });
    });
});
app.post('/api/signin', passport.authenticate('local'), (req, res) => {
               console.log('signin')
               User.findOne({_id: req.user._id}, function (err, user) {
                        if(err) res.status(460).send(err.message);
                        else {
                            req.session.user = user;
                            req.session.save( () => res.status(200).send({user : user}))
                        }
                });
        }
);

app.post('/api/settings', passport.authenticate('local'), (req, res) => {
               console.log('settings')
                var query = { _id:req.user._id};
                var update = {
                    roles: req.body.roles
                };
                var options = {};
                User.findOneAndUpdate(query, update, options, (err, updatedUser) => {
                    if(err) {
                    console.log(err.message);
                    return res.status(460).send(err.message);
                    } else {
                    console.log(updatedUser);
                    req.session.user = updatedUser;
                    res.status(200).send({user : req.session.user});
                    }
                });

});

app.get('/api/signout', (req, res) => {
  console.log('signout')
  req.logout();
  req.session.destroy();
  res.status(200).send({user : null});
});


app.use('/api/user', (req, res, next) => {
    if(req.session.user) next();
    else res.status(401).send('User is not signed in');
});

app.post('/api/user/createproject', (req, res, next) => {

     var createdProject = new Project({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          owner: req.session.user._id,
          users: [req.session.user._id],
          revisions: []
     }).save((err) => {
        if(err) {
            res.status(460).send(err.message);
        }
        else {
            return res.status(200).send({user : req.session.user, createdProject : createdProject});
        }
      });
});

app.get('/api/user/listauthorizedproject', (req, res, next) => {
     Project.find({ users: { "$in" : [req.session.user._id]}}, (err, projectList) => {
        if(err) {
        //console.log(err.message);
        return res.status(460).send(err.message);
        } else {
        //console.log(projectList);
        res.status(200).send({user : req.session.user, projectList : projectList});
        }
    })
});

app.get('/api/user/listunauthorizedproject', (req, res, next) => {
     Project.find({ users: { "$nin" : [req.session.user._id]}}, (err, unauthorizedprojectlist) => {
        if(err) {
        //console.log(err.message);
        return res.status(460).send(err.message);
        } else {
        //console.log(unauthorizedprojectlist);
        res.status(200).send({user : req.session.user, unauthorizedprojectlist : unauthorizedprojectlist});
        }
    })
});

app.get('/api/user/project/:_id', (req, res, next) => {
     Project.findOne({ _id:req.params._id, users: { "$in" : [req.session.user._id]}}, (err, project) => {
        if(err) {
        //console.log(err.message);
        return res.status(460).send(err.message);
        } else {
        //console.log(project);
        res.status(200).send({user : req.session.user, project : project});
        }
    })
});
app.get('/api/user/project/:_id/users', (req, res, next) => {
     User.find({ projects: { "$in" : [req.params._id]}}, (err, users) => {
        if(err) {
        console.log(err.message);
        return res.status(460).send(err.message);
        } else {
        console.log(users);
        res.status(200).send({user : req.session.user, users : users});
        }
    })
});
app.post('/api/user/removeproject', (req, res, next) => {
    var query = { _id:req.body._id};
    var update = {'$pull': {users: {'$in': [req.session.user._id]}}};
    var options = {};
    Project.findOneAndUpdate(query, update, options, (err, removedProject) => {
        if(err) {
        console.log(err.message);
        return res.status(460).send(err.message);
        } else {
        console.log(removedProject);
        res.status(200).send({user : req.session.user, removedProject : removedProject});
        }
    });
});
*/


module.exports = {app, io, http, User, Project, Revision, Task};