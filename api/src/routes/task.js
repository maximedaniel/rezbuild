/**
 * @module TaskRouting
 * @description Handle the routes (create, get, update, delete, done) for tasks
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 */
module.exports = function(io, client, bim){
   // import Task model
   var Task = require('../models').Task
   /**
    * @description Route done request
    */
   client.on('/api/task/done',  () => io.emit('/api/task/done', {}))
   /**
    * @description Route create request
    */
   client.on('/api/task/create', function (create, res) {
        if(client.handshake.session.user) {
            console.info('[/api/task/create] Creating a task for user<' + client.handshake.session.user._id + '>')
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdTask = new Task(create).save((error, tasks) => {
                   if(error) {
                    console.error('[/api/task/create] ' + error.message)
                    res({error: error.message})
                   }
                   else {
                    res({tasks: tasks})
                   }
            });
        } else {
            console.error('[/api/task/create] User not signed in')
            res({error: 'User not signed in'})
        }
    });

   /**
    * @description Route get request
    */
   client.on('/api/task/get', function (filter, res) {
        if(client.handshake.session.user) {
            console.info('[/api/task/get] Getting task(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Task.find(filter, (error, tasks) => {
                   if(error) {
                        console.error('[/api/task/get] ' + error.message)
                       res({error: error.message})
                   }
                   else {
                       res({tasks: tasks})
                   }
            });
        } else {
            console.error('[/api/task/get] User not signed in')
            res({error: 'User not signed in'})
        }
    });

   /**
    * @description Route update request
    */
   client.on('/api/task/update', function (filter, update, res) {
        if(client.handshake.session.user) {
            console.info('[/api/task/update] Updating task(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            Task.updateMany(filter, update, {}, (error, tasks) => {
                   if(error) {
                       console.error('[/api/task/update] ' + error.message)
                       res({error: error.message})
                   }
                   else {
                       res({tasks: tasks})
                   }
            });
        } else {
            console.error('[/api/task/update] User not signed in')
            res({error: 'User not signed in'})
        }
    });
   /**
    * @description Route delete request
    */
   client.on('/api/task/delete', function (filter, res) {
        console.info('/api/task/delete')
        if(client.handshake.session.user) {
            console.info('[/api/task/delete] Deleting task(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Task.deleteMany(filter, (error, tasks) => {
                   if(error) {
                        console.error('[/api/task/delete] ' + error.message)
                       res({error: error.message})
                   }
                   else {
                       res({tasks: tasks})
                   }
            });
        } else {
            console.error('[/api/task/delete] User not signed in')
            res({error: 'User not signed in'})
        }
    });
}
