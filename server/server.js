//importing dependencies
import express from 'express'
//import db from './models'
import BimController from './controllers/BimController'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
//import passport from 'passport'
//import passportLocal from 'passport-local'
import cors from 'cors'

//var LocalStrategy = passportLocal.Strategy;
// bim routes

var app = express(),
  router = express.Router();

//var User = db.User;

//to config API to use body body-parser and look for JSON in req.body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser('estia'));
app.use(session({secret : 'estia', resave:false, saveUninitialized:false, cookie: { secure: false }}));

//app.use(passport.initialize());
//app.use(passport.session());

//passport config
//passport.use(new LocalStrategy(db.User.authenticate()));
//passport.serializeUser(db.User.serializeUser());
//passport.deserializeUser(db.User.deserializeUser());

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))


var bimController = new BimController()

app.use((req, res, next) => {
    if(!bimController.client){
        bimController.login('m.daniel@estia.fr', 'm.daniel@estia.fr')
        .then(admin => next())
        .catch(err => {console.log(err); res.status(500).send(err.message);})
    } else next();
})

app.post('/signup', (req, res, next) => {
    console.log(` ${req.body.username} ${req.body.password} ${req.body.name}`);
    bimController.addUserWithPassword(
            req.body.username,
            req.body.password,
            req.body.name,
            'USER',
            false,
            'none'
    )
    .then(user => {req.session.user = user; res.status(200).send({user : user});})
    .catch(err => {req.session.destroy(); res.status(460).send(err.message);})
});


app.post('/signin', (req, res, next) => {
    bimController.signin(
            req.body.username,
            req.body.password,
    )
    .then(user => {req.session.user = user; console.log(req.session); res.status(200).send({user : user});})
    .catch(err => {req.session.destroy(); res.status(460).send(err.message);})
});

app.post('/settings', (req, res, next) => {
    console.log(` ${req.body.username} ${req.body.password} ${req.body.info}`);
    console.log(req.session)
    bimController.signin(
            req.body.username,
            req.body.password,
    )
    .then(user => {console.log(user); req.session.user = user; res.status(200).send({user : user});})
    .catch(err => {console.log(err);  req.session.destroy(); res.status(460).send(err.message);})
});

app.get('/signout', (req, res, next) => {
    req.session.destroy();
    res.status(200).send({});
});

app.use('/api', (req, res, next) => {
    if(req.session.user) next();
    else res.status(401).send('User is not signed in');
});
app.get('/api/user', (req, res, next) => {
     res.status(200).send({user : req.session.user});
});

app.get('/api/projectlist', (req, res, next) => {
    console.log(req.session.user)
    bimController.getUsersProjects(req.session.user.oid)
    .then(projectList => {console.log(projectList); res.status(200).send({user : req.session.user, projectList : projectList});})
    .catch(err => {console.log(err);  res.status(460).send(err.message);})
});

app.post('/api/createproject', (req, res, next) => {
    console.log(`${req.body.name} ${req.body.timestamp}`);
    bimController.addProject(req.body.name+'|'+req.body.timestamp, 'ifc2x3tc1')
    .then(createdProject => {
        bimController.addUserToProject(req.session.user.oid, createdProject.oid)
        .then(user => {
            res.status(200).send({user : req.session.user, createdProject : createdProject});

        })
        .catch(err => {
            res.status(460).send(err.message);
        })
    })
    .catch(err => {
        res.status(460).send(err.message);
    })
});


module.exports = app;