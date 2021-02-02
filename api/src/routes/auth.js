/**
 * @module AuthentificationRouting
 * @description Handle the routes (signin, signup, signout, token, done) for user authentification
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 * @param {object} transporter  NodeMailerClient
*/

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

module.exports = (io, client, transporter) => {
    // import models
    var User = require('../models').User
    var Token = require('../models').Token
    const {TOKEN_ACTIONS} = require('../models').Token;

    /**
     * @description Route done request and broadcast it
     */
    client.on('/api/user/done',  () => io.emit('/api/user/done', {}))

    /**
     * @description Route signin request
     */
    client.on('/api/signin', (host, email, password, res)  => {
        console.info('[/api/signin] Signing in ' + email);
        User.findOne({email:email, password:password}, (error, user) => {
            if(error) {
                console.error('[/api/signin] ' + error.message);
                res({error: error.message});
            }
            else {
                if(user) {
                    if (!user.isVerified) {
                        // Create a verification token for this user
                        var token = new Token({ user: user, action: TOKEN_ACTIONS.confirm_user, token: crypto.randomBytes(16).toString('hex') });
                        // Save the verification token
                        token.save( (error) => {
                            if (error) { 
                                console.error('[/api/signin] ' + error.message);
                                res({error: error.message})
                            } else {
                                console.info('[/api/signin] Resend token to not verified user')
                                const mailOptions = {
                                    from: 'rezbuild.estia@gmail.com',
                                    to: user.email,
                                    subject: '[REZBUILD APP] Account verification',
                                    text: 'Hello '+ user.firstname + ',\n\nPlease verify your account by clicking the link: \nhttp:\/\/' + host + '\/signin?action=confirmation&token=' + token.token + '.\n\nREZBUILD App'
                                };
                                
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.error('[/api/signin] '+ error)
                                        res({error: error.message})
                                    }
                                    else {
                                        res({error: 'This email address is associated with an existing account and it still needs to be verified. You should receive an email with a new verification link.'});
                                    }
                                });
                            }
                        });
                    } else {
                        delete user['password']
                        client.handshake.session.user = user
                        client.handshake.session.save()
                        res({user: user});
                    }
                }
                else {
                    console.error('[/api/signin] '+ email + ' wrong email/password');
                    res({error: 'Wrong email/password'});
                }
            }
        });
    });

    /**
     * @description Route signup request
     */
    client.on('/api/signup', (host, create, res) => {
        User.findOne({email:create.email}, (error, user) => {
            if (user) {
                res({error: 'This email address is already associated with another account.'});
            } else {
                var user = new User(create);
                console.info('[/api/signup] Signing up ' + user.email);
                user.save( (error) => {
                    if (error) {
                        res({error: error.message})
                    } else {
                        // delete user['password'];
                        // Create a verification token for this user
                        var token = new Token({ user: user, action: TOKEN_ACTIONS.confirm_user, token: crypto.randomBytes(16).toString('hex') });
                        // Save the verification token
                        token.save( (error) => {
                            if (error) { 
                                res({error: error.message})
                            } else {
                                const mailOptions = {
                                    from: 'rezbuild.estia@gmail.com',
                                    to: user.email,
                                    subject: '[REZBUILD APP] Account verification',
                                    text: 'Hello '+ user.firstname + ',\n\nPlease verify your account by clicking the link: \nhttp:\/\/' + host + '\/signin?action=confirmation&token=' + token.token + '.\n\nREZBUILD App'
                                };
                                
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        res({error: error.message})
                                    }
                                    else {
                                        res({user: user, error: 'Your email address needs to be verified. You should receive an email with verification link.'});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * @description Route signout request
     */
    client.on('/api/signout', (empty, res) => {
        console.info('[/api/signout] Signed out ' + client.handshake.session.user.email);
         client.handshake.session.user = null
         client.handshake.session.save()
         res({user: true})
    });

    /**
     * @description Route user token request
     */
    // client.on('/api/token',  (empty, res) => {
    //     console.info('[/api/token] Sending token to ' + client.handshake.session.user.email);
    //     res({user: client.handshake.session.user})
    // });

    client.on('/api/auth/confirmation', (host, email, token, res) => {
        try {
            console.info('[/api/auth/confirmation] Confirming new user');
            Token.findOne({ token: token, action: TOKEN_ACTIONS.confirm_user }, function (err, token) {
                if (!token) {
                    res({error: 'We were unable to find a valid token. Your token may have expired.'});
                    return;
                } 
                // If we found a token, find a matching user
                User.findOne({ _id: token.user }, function (err, user) {
                    if (!user) {
                        res({error: 'We were unable to find a user for this token.'});
                        return;
                    }
                    if (user.email !== email) {
                        res({error: 'This email do not correspond to the verification link.'});
                        return;
                    }
                    if (user.isVerified) {
                        res({msg: 'This user has already been verified. Please sign in.'});
                        return;
                    }
    
                    user.isVerified = true;
                    user.save(function (err) {
                        if (err) { 
                            res({error: err.message});
                            return;
                        }
                        res({msg: 'The account has been verified. Please sign in.'});
                    });
                });
            });
        }
        catch(err) {
            console.error('[/api/auth/confirmation] ' + err);
            res({error: err.message});
        }
    });

    client.on('/api/auth/resetpassword',  (host, email, res) => {
        User.findOne({email:email}, (error, user) => {
            if (!user) {
                res({error: 'The email address you have entered is not associated with any account.'});
            } else {
                var token = new Token({ user: user, action: TOKEN_ACTIONS.reset_password, token: crypto.randomBytes(16).toString('hex') });
                token.save( (error) => {
                    if (error) { 
                        res({error: error.message})
                    } else {
                        const mailOptions = {
                            from: 'rezbuild.estia@gmail.com',
                            to: user.email,
                            subject: '[REZBUILD APP] Password reset',
                            // text: 'Hello '+ user.firstname + ',\n\nYou requested to reset your password. In order to complete it, please click the link: \nhttp:\/\/' + client.handshake.headers.host + '\/user/passwordreset/' + token.token + '.\n\nREZBUILD App'
                            text: 'Hello '+ user.firstname + ',\n\nYou requested to reset your password. In order to complete it, please click the link: \nhttp:\/\/' + host + '\/signin?action=newpassword&token=' + token.token + '.\n\nREZBUILD App'
                        };
                        
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                res({error: error.message})
                            }
                            else {
                                res({user: user, msg: 'You should receive an email with password reset link.'});
                            }
                        });
                    }
                });
            }
        });        
    });

    client.on('/api/auth/newpassword',  (token, newpassword1, newpassword2, res) => {
        try {
            if (newpassword1 != newpassword2) {
                res({error: 'Passwords do not match.'});
                return;
            }
            Token.findOne({ token: token, action: TOKEN_ACTIONS.reset_password }, function (err, token) {
                if (!token) {
                    res({error: 'We were unable to find a valid token. Your token may have expired.'});
                    return;
                }
                // If we found a token, find a matching user
                User.findOne({ _id: token.user }, function (err, user) {
                    if (!user) {
                        res({error: 'We were unable to find a user for this token.'});
                        return;
                    }

                    // var filter = JSON.parse(JSON.stringify({ _id: user._id }).split('token').join(user._id))
                    // var update = JSON.parse(JSON.stringify({ password : newpassword1 }).split('token').join(user._id))
                    // User.updateOne(filter, update, {}, (err, user) => {
                    //     if (err) {
                    //         console.error('[/api/auth/newpassword] ' + err.message)
                    //         res({error: error.message})
                    //         return;
                    //     }
                    //     res({msg: 'Your password has been successfully updated.'});
                    // });

                    user.password = newpassword1;
                    user.save(function (err) {
                        if (err) { 
                            res({error: err.message});
                            return;
                        }
                        res({msg: 'Your password has been successfully updated. Please sign in.'});
                    });
                });
            });
        }
        catch(err){
            res({error: err});
        }
    });

}