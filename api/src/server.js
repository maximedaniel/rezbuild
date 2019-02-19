//importing dependencies
import express from 'express'
import db from './models'
import BimController from './controllers/BimController'
var mongoose = require("mongoose");
var User = db.User;
var Project = db.Project;
var Revision = db.Revision;
var Task = db.Task;

var handshake = require('socket.io-handshake');
var fs = require('fs');


var app = express();
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


var router = require('socket.io-events')();


// handles events matching 'some*'
//router.on(function (client, next) {
//    sessionMiddleware(client.request, client.request.res, next);
//});

// handles events matching 'some*'
router.on('/api/user', function (client, args, next) {
    console.log(args)
    if(client.sock.handshake.session.user) return next();
    else client.emit(args[0], {error: 'User not signed in'});
});

router.on('/api/signin', function (client, args, next) {
    var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     User.findOne({email: params.email, password: params.password}, (error, user) => {
                   if(error) {
                    client.emit(topic, {error: error.message});
                   }
                   else {
                    if(user) {
                        client.sock.handshake.session.user = user
                        client.sock.handshake.session.save()
                        client.emit(topic, {user: user});
                    }
                    else {
                        console.log('Wrong email/password')
                        client.emit(topic, {error: 'Wrong email/password'});
                    }
                   }
     });

});

router.on('/api/signup', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     var user = new User({
     _id: new mongoose.Types.ObjectId(),
     firstname : params.firstname,
     lastname : params.lastname,
     email : params.email,
     password : params.password,
     roles : params.roles,
     });
     user.save( (error) => {
           if(error) {
            client.emit(topic, {error: error.message})
           }
           else {
           client.emit(topic, {user: user})
           }
     });

});

router.on('/api/signout', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     client.sock.handshake.session.user = null
     client.sock.handshake.session.save()
     client.emit(topic, {signedOutUser: true})
});

router.on('/api/user/createproject', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     var createdProject = new Project({
          _id: new mongoose.Types.ObjectId(),
          name: params.name,
          owner: client.sock.handshake.session.user._id,
          users: [client.sock.handshake.session.user._id],
          revisions: []
     }).save((error, createdProject) => {
           if(error) {
            client.emit(topic, {error: error.message})
           }
           else {
           client.emit(topic, {user:client.sock.handshake.session.user, createdProject: createdProject})

           }
      });
});

router.on('/api/user/joinproject', function (client, args, next) {
    var topic = args.shift(), params = args.shift();
    console.log(topic, params)

    Project.findOneAndUpdate({ _id:params._id}, {"$push": { "users": client.sock.handshake.session.user._id }}, {}, (error, updatedUser) => {
           if(error) {
               client.emit(topic, {error: error.message})
           }
           else {
               client.emit(topic, {user:client.sock.handshake.session.user, updatedUser: true})
           }
    });
});


router.on('/api/user/authorizedprojects', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     Project.find({ users: { "$in" : [client.sock.handshake.session.user._id]}}, (error, authorizedProjects) => {
       if(error) {
        client.emit(topic, {error: error.message})
       }
       else {
       client.emit(topic, {user:client.sock.handshake.session.user, authorizedProjects: authorizedProjects})
       }
    });
});

router.on('/api/user/unauthorizedprojects', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     Project.find({ users: { "$nin" : [client.sock.handshake.session.user._id]}}, (error, unauthorizedProjects) => {
       if(error) {
        client.emit(topic, {error: error.message})
       }
       else {
       client.emit(topic, {user:client.sock.handshake.session.user, unauthorizedProjects: unauthorizedProjects})
       }
    });
});

router.on('/api/user/project', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     Project.findOne({ _id:params._id, users: { "$in" : [client.sock.handshake.session.user._id]}}, (error, project) => {
       if(error) {
        client.emit(topic, {error: error.message})
       }
       else {
       client.emit(topic, {user:client.sock.handshake.session.user, project: project})
       }
    })
});

router.on('/api/user/project/users', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
     Project.findOne({ _id:params._id, users: { "$in" : [client.sock.handshake.session.user._id]}}, (error, project) => {
       if(error) {
        client.emit(topic, {error: error.message})
       }
       else {
           User.find( {_id: { "$in" : [project.users]}}, (error, users) => {
               if(error) {
                client.emit(topic, {error: error.message})
               }
               if (users) {
                client.emit(topic, {user:client.sock.handshake.session.user, users: users})
               }
           })
       }
    })
});

router.on('/api/user/removeproject', function (client, args, next) {
     var topic = args.shift(), params = args.shift();
     console.log(topic, params)
    var query = { _id:params._id};
    var update = {'$pull': {users: {'$in': [client.sock.handshake.session.user._id]}}};
    var options = {};
    Project.findOneAndUpdate(query, update, options, (error, removedProject) => {
       if(error) {
        client.emit(topic, {error: error.message})
       }
       else {
       client.emit(topic, {user:client.sock.handshake.session.user, removedProject: true})
       }
    });
});

io.use(router);


io.on('connection', function(client){
    console.log(client.id, ' is connected.')

});

/*
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


module.exports = {http};