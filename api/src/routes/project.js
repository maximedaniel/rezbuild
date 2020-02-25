/**
 * @module ProjectRouting
 * @description Handle the routes (create, get, update, delete, done) for projects
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 */
module.exports = function(io, client, bim){

   var Project = require('../models').Project

   client.on('/api/project/done',  () => io.emit('/api/project/done', {}))

   client.on('/api/project/create', function (create, res) {
        console.log('/api/project/create', create)
        if(client.handshake.session.user) {
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdProject = new Project(create).save((error, projects) => {
                   if(error) {
                    res({error: error.message})
                   }
                   else {
                   // bim.addProject(projects._id, 'ifc2x3tc1').then(bim_project => {
                        res({projects: projects})
                        io.emit('/api/project/done', {})
                    //})
                    //.catch(error => {
                     //   res({error: error.message})
                    //})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/project/get', function (filter, res) {
        console.log('/api/project/get', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Project.find(filter, (error, projects) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({projects: projects})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/project/update', function (filter, update, res) {
        console.log('/api/project/update', filter, update)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            Project.updateMany(filter, update, {}, (error, projects) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({projects: projects})
                       io.emit('/api/project/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });


   client.on('/api/project/delete', function (filter, res) {
        console.log('/api/project/delete', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Project.deleteMany(filter, (error, projects) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({projects: projects})
                       io.emit('/api/project/done', {})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });
}
