module.exports = function(io, client, bim){

   var Task = require('../models').Task

   client.on('/api/task/create', function (create, res) {
        console.log('/api/task/revision', create)
        if(client.handshake.session.user) {
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdTask = new Task(create).save((error, tasks) => {
                   if(error) {
                    res({error: error.message})
                   }
                   else {
                    res({tasks: tasks})
                    io.emit('/api/task/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/task/get', function (filter, res) {
        console.log('/api/task/get', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Task.find(filter, (error, tasks) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({tasks: tasks})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/task/update', function (filter, update, res) {
        console.log('/api/task/update', filter, update)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            Task.updateMany(filter, update, {}, (error, tasks) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({tasks: tasks})
                       io.emit('/api/task/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });


   client.on('/api/task/delete', function (filter, res) {
        console.log('/api/task/delete', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Task.deleteMany(filter, (error, tasks) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({tasks: tasks})
                       io.emit('/api/task/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });
}
