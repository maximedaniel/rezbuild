module.exports = function(io, client){

    var User = require('../models').User

    client.on('/api/user/create', function (create, res) {
        console.log('/api/user/create', create)
        if(client.handshake.session.user) {
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdUser = new User(create).save((error, users) => {
                   if(error) {
                    res({error: error.message})
                   }
                   else {
                    res({users: users})
                    io.emit('/api/user/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/user/get', function (filter, res) {
        console.log('/api/user/get', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            User.find(filter, (error, users) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({users: users})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/user/update', function (filter, update, res) {
        console.log('/api/user/update', filter, update)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            User.updateMany(filter, update, {}, (error, users) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({users: users})
                       io.emit('/api/user/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });


   client.on('/api/user/delete', function (filter, res) {
        console.log('/api/user/delete', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            User.deleteMany(filter, (error, users) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({users: users})
                       io.emit('/api/user/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });
}

