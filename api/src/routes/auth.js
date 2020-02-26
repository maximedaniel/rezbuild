/**
 * @module AuthentificationRouting
 * @description Handle the routes (signin, signup, signout, token, done) for user authentification
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 */

module.exports = function(io, client){

    var User = require('../models').User

    client.on('/api/user/done',  () => io.emit('/api/user/done', {}))

    client.on('/api/signin', function (email, password, res) {
        console.info('[/api/signin] Signing in ' + email);
         User.findOne({email:email, password:password}, (error, user) => {
                       if(error) {
                        console.error('[/api/signin] ' + error.message);
                        res({error: error.message});
                       }
                       else {
                            if(user) {
                                delete user['password']
                                client.handshake.session.user = user
                                client.handshake.session.save()
                                res({user: user});
                            }
                            else {
                                console.error('[/api/signin] '+ email + ' wrong email/password');
                                res({error: 'Wrong email/password'});
                            }
                       }
         });
    });

    client.on('/api/signup', function (create, res) {
         var user = new User(create)
         console.info('[/api/signup] Signin up ' + user.email);
         user.save( (error) => {
               if(error) {
                console.error('[/api/signup] ' + error.message);
                res({error: error.message})
               }
               else {
                delete user['password'];
                res({user: user});
               }
         });

    });

    client.on('/api/signout', function (empty, res) {
        console.info('[/api/signout] Signed out ' + client.handshake.session.user.email);
         client.handshake.session.user = null
         client.handshake.session.save()
         res({user: true})
    });

    client.on('/api/token', function (empty, res) {
        console.info('[/api/token] Sending token to ' + client.handshake.session.user.email);
        res({user: client.handshake.session.user})
    });
}