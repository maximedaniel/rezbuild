module.exports = function(io, client, bim){

   var Revision = require('../models').Revision

   client.on('/api/revision/done',  () => io.emit('/api/revision/done', {}))

   client.on('/api/revision/create', function (create, res) {
        console.log('/api/revision/create', create)
        if(client.handshake.session.user) {
            create = JSON.parse(JSON.stringify(create).split('token').join(client.handshake.session.user._id))
            var createdRevision = new Revision(create).save((error, revisions) => {
                   if(error) {
                    res({error: error.message})
                   }
                   else {
                    res({revisions: revisions})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/revision/get', function (filter, res) {
        console.log('/api/revision/get', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Revision.find(filter, (error, revisions) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({revisions: revisions})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });

   client.on('/api/revision/update', function (filter, update, res) {
        console.log('/api/revision/update', filter, update)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            update = JSON.parse(JSON.stringify(update).split('token').join(client.handshake.session.user._id))
            Revision.updateMany(filter, update, {}, (error, revisions) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({revisions: revisions})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });


   client.on('/api/revision/delete', function (filter, res) {
        console.log('/api/revision/delete', filter)
        if(client.handshake.session.user) {
            filter = JSON.parse(JSON.stringify(filter).split('token').join(client.handshake.session.user._id))
            Revision.deleteMany(filter, (error, revisions) => {
                   if(error) {
                       res({error: error.message})
                   }
                   else {
                       res({revisions: revisions})
                   }
            });
        } else {
            res({error: 'User not signed in'})
        }
    });
}
