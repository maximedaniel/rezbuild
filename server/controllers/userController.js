var db = require('../models');

app.post('/signup', (req, res) => {
    db.User.register(new db.User({ username : req.body.username, firstname : req.body.firstname, lastname : req.body.lastname, roles : req.body.roles}), req.body.password, (err, user) => {
        if (err) {
            console.log(err.message)
            req.session.destroy();
            return  res.status(460).send(err.message);
        }

        passport.authenticate('local')(req, res, function () {
           console.log(req.user)
           req.session.user = req.user; res.status(200).send({user : req.user});
        });
    });
});

app.post('/signin', passport.authenticate('local'), (req, res) => {
           console.log(req.user)
           req.session.user = req.user; res.status(200).send({user : req.user});
        }
);

app.get('/signout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send({user : null});
});