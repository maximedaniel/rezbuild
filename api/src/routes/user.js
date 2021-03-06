/**
 * @module UserRouting
 * @description Handle the routes (create, get, update, delete, done) for users
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 */
module.exports = (io, client) => {
    // import User model
    var User = require('../models').User
    /**
     * @description Route done request
     */
    client.on('/api/user/done',  () => io.emit('/api/user/done', {}))
    /**
     * @description Route create request
     */
    client.on('/api/user/create', (create, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/user/create] Creating a user for user<' + client.handshake.session.user._id + '>')
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdUser = new User(create).save((error, users) => {
                   if(error) {
                    console.error('[/api/user/create] ', error.message);
                    res({error: error.message})
                   }
                   else {
                    for(var i=0; i <users.length; i++){
                        delete users[i]['password'];
                    }
                    res({users: users})
                   }
            });
        } else {
            
            console.error('[/api/user/create] User not signed in')
            res({error: 'User not signed in'})
        }
    });

    /**
     * @description Route get request
     */
   client.on('/api/user/get', (filter, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/user/get] Getting user(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            User.find(filter, (error, users) => {
                   if(error) {
                    console.error('[/api/user/get] ' +error.message)
                       res({error: error.message})
                   }
                   else {
                        for(var i=0; i <users.length; i++){
                            delete users[i]['password'];
                        }
                       res({users: users})
                   }
            });
        } else {
            console.error('[/api/user/get] User not signed in')
            res({error: 'User not signed in'})
        }
    });

    /**
     * @description Route update request
     */
   client.on('/api/user/update', (filter, update, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/user/update] Updating user(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            User.updateMany(filter, update, {}, (error, users) => {
                   if(error) {
                    console.error('[/api/user/update] ' +error.message)
                       res({error: error.message})
                   }
                   else {
                        for(var i=0; i <users.length; i++){
                            delete users[i]['password'];
                        }
                       res({users: users})
                   }
            });
        } else {
            console.error('[/api/user/update] User not signed in')
            res({error: 'User not signed in'})
        }
    });
    /**
     * @description Route delete request
     */
   client.on('/api/user/delete', (filter, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/user/delete] Deleting user(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            User.deleteMany(filter, (error, users) => {
                   if(error) {
                        console.error('[/api/user/delete] ' +error.message)
                       res({error: error.message})
                   }
                   else {
                        for(var i=0; i <users.length; i++){
                            delete users[i]['password'];
                        }
                       res({users: users})
                   }
            });
        } else {
            console.error('[/api/user/delete] User not signed in')
            res({error: 'User not signed in'})
        }
    });
}

