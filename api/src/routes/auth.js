module.exports = function(io, client){

    var User = require('../models').User

    /*client.on('/api/token', function (filter, res) {
        console.log(args)
        if(client.sock.handshake.session.user) res({token: client.sock.handshake.session.user._id});
        else res({error: 'User not signed in'});
    });*/

    client.on('/api/signin', function (email, password, res) {
         User.findOne({email:email, password:password}, (error, user) => {
                       if(error) {
                        res({error: error.message});
                       }
                       else {
                            if(user) {
                                client.handshake.session.user = user
                                client.handshake.session.save()
                                res({user: user});
                            }
                            else {
                                res({error: 'Wrong email/password'});
                            }
                       }
         });
    });

    client.on('/api/signup', function (create, res) {
         var user = new User(create)
         user.save( (error) => {
               if(error) {
                res({error: error.message})
               }
               else {
                res({user: user})
               }
         });

    });

    client.on('/api/signout', function (empty, res) {
         client.handshake.session.user = null
         client.handshake.session.save()
         res({user: true})
    });

}