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
         User.findOne({email:email, password:password}, (error, user) => {
                       if(error) {
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
                delete user['password']
                res({user: user})
               }
         });

    });

    client.on('/api/signout', function (empty, res) {
         client.handshake.session.user = null
         client.handshake.session.save()
         res({user: true})
    });

    client.on('/api/token', function (empty, res) {
        res({user: client.handshake.session.user})
    });
}