/**
 * @module ProjectRouting
 * @description Handle the routes (create, get, update, delete, done) for projects
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 */
module.exports = (io, client) => {
   // import Project model
   var Project = require('../models').Project
   var User = require('../models').User

   /**
    * @description Route done request and broadcast it
    */
   client.on('/api/project/done',  () => io.emit('/api/project/done', {}))
   /**
    * @description Route create request
    */
   client.on('/api/project/create', (create, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/project/create] Creating a project for user<' + client.handshake.session.user._id + '>')
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdProject = new Project(create).save((error, projects) => {
                   if(error) {
                    console.error('[/api/project/create] ' + error.message)
                    res({error: error.message})
                   }
                   else {
                        res({projects: projects})
                        io.emit('/api/project/done', {})
                   }
            });
        } else {
            console.error('[/api/project/create] User not signed in')
            res({error: 'User not signed in'})
        }
    });

   /**
    * @description Route get request
    */
    client.on('/api/project/get', (filter, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/project/get] Getting project(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Project.find(filter)
                .populate('owner')
                .exec((error, projects) => {
                    if(error) {
                        console.error('[/api/project/get] ' + error.message);
                        res({error: error.message});
                    }
                    else {
                        res({projects: projects, user: client.handshake.session.user})
                    }
                });
        } else {
            console.error('[/api/project/get] User not signed in')
            res({error: 'User not signed in'})
        }
    });
   /**
    * @description Route update request
    */
   client.on('/api/project/update', (filter, update, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/project/update] Updating project(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            Project.updateMany(filter, update, {}, (error, projects) => {
                   if(error) {
                        console.error('[/api/project/update] ' + error.message)
                       res({error: error.message})
                   }
                   else {
                       res({projects: projects})
                       io.emit('/api/project/done', {})
                   }
            });
        } else {
            console.error('[/api/project/update] User not signed in')
            res({error: 'User not signed in'})
        }
    });
   /**
    * @description Route delete request
    */
   client.on('/api/project/delete', (filter, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/project/delete] Deleting project(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Project.deleteMany(filter, (error, projects) => {
                   if(error) {
                        console.error('[/api/project/delete] ' + error.message)
                       res({error: error.message})
                   }
                   else {
                       res({projects: projects})
                       io.emit('/api/project/done', {})
                   }
            });
        } else {
            console.error('[/api/project/delete] User not signed in')
            res({error: 'User not signed in'})
        }
    });
}
