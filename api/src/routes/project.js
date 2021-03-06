/**
 * @module ProjectRouting
 * @description Handle the routes (create, get, update, delete, done) for projects
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 */

module.exports = (io, client) => {
   // import models
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
    * @description Route get populated object request
    */
    client.on('/api/project/getfull', (filter, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/project/getfull] Getting project(s) for user<' + client.handshake.session.user._id + '>')
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Project.find(filter)
                .populate(['owner', 'users', 'usersToVerify'])
                .exec((error, projects) => {
                    if(error) {
                        console.error('[/api/project/getfull] ' + error.message);
                        res({error: error.message});
                    }
                    else {
                        res({projects: projects, user: client.handshake.session.user})
                    }
                });
        } else {
            console.error('[/api/project/v] User not signed in')
            res({error: 'User not signed in'})
        }
    });


   /**
    * @description Route update request
    */
   client.on('/api/project/update', (req, res) => {
        if(client.handshake.session.user) {
            console.info('[/api/project/update] Updating project(s) for user<' + client.handshake.session.user._id + '>')
            var filter = JSON.parse(JSON.stringify(req.filter).split('token').join(client.handshake.session.user._id))
            var update = JSON.parse(JSON.stringify(req.update).split('token').join(client.handshake.session.user._id))
            Project.updateOne(filter, update, (error, project) => {
                if (error) {
                    console.error('[/api/project/update] ' + error.message)
                    res({error: error.message})
                } 
                else {
                    res({project: project})
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

    /**
    * @description Route member approve request
    */
    client.on('/api/project/approveMember', (req, res) => {
        try {
            if (client.handshake.session.user) {
                if (req.project.owner._id != client.handshake.session.user._id) {
                    res({error: 'You should be project\'s owner to manage members join requests.'});
                } else {
                    if (req.project.users.includes(req.user._id)) {
                        res({error: 'The user is already in the project\'s team.'});
                    } else {
                        let filter = {_id: req.project._id};
                        let update = {
                            "$pull" : {usersToVerify : req.user._id},
                            "$addToSet" : {users : req.user._id}
                        };
                        Project.updateOne(filter, update, (error, project) => {
                            if (error) {
                                console.error('[/api/project/approveMember] ' + error.message);
                                res({error: error.message});
                            } 
                            else {
                                io.emit('/api/project/done', {});
                                res({success: true});
                            }
                        });
                    }                        
                }
            } else {
                console.error('[/api/project/approveMember] User not signed in')
                res({error: 'User not signed in'})
            }
        }
        catch(err) {
            console.error('[/api/project/approveMember] ' + err);
            res({error: err.message});
        }
    });

        /**
    * @description Route member approve request
    */
    client.on('/api/project/desapproveMember', (req, res) => {
        try {
            if (client.handshake.session.user) {
                if (req.project.owner._id != client.handshake.session.user._id) {
                    res({error: 'You should be project\'s owner to manage members join requests.'});
                } else {
                    let filter = {_id: req.project._id};
                    let update = {
                        "$pull" : {usersToVerify : req.user._id}
                    };
                    Project.updateOne(filter, update, (error, project) => {
                        if (error) {
                            console.error('[/api/project/desapproveMember] ' + error.message);
                            res({error: error.message});
                        } 
                        else {
                            io.emit('/api/project/done', {});
                            res({success: true});
                        }
                    });
                }
            } else {
                console.error('[/api/project/desapproveMember] User not signed in')
                res({error: 'User not signed in'})
            }
        }
        catch(err) {
            console.error('[/api/project/desapproveMember] ' + err);
            res({error: err.message});
        }
    });
    
}
