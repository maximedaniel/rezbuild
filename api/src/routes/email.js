
/**
 * @module EmailRouting
 * @description Handle the routes (send) for email communication
 * @param {object} io WebsocketServer
 * @param {object} client WebsocketClient
 * @param {object} transporter  NodeMailerClient
 */

import dateFormat from 'dateformat'
module.exports = (io, client, transporter) => {
    
    /**
     * @description Route email notification about task assignment
     */
    client.on('/api/email/todotask', (request, res) => {
        console.info('[/api/email/todotask] Sending mail')
        if(request.user && request.task && request.project){
            const mailOptions = {
                // from: 'rezbuildapp@gmail.com',
                from: 'rezbuild.estia@gmail.com',
                to: request.user.email,
                subject: '[REZBUILD APP] A task was assigned to you',
                html: '<p>Hello '+ request.user.firstname + ', <br/><br/>A <b>' + request.task.name +' </b> task was assigned to you in the project <b>' + request.project.name + '</b>.<br/>Due date: <b>'+  dateFormat(request.task.endDate, "mmmm dS, yyyy") +'</b>.<br/><br/> Best regards,<br/>REZBUILD App</p>'
            };
            
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) {
                    console.error('[/api/email/todotask] '+err)
                    res({ok: false}) 
                }
                else {
                    res({ok: true}) 
                }
            });
        }
    });

    /**
     * @description Route email for user's email verification when signed up
     */
    client.on('/api/email/verifyuser', (request, res) => {
        console.info('[/api/email/verifyuser] Sending email to newly signed up user')
        if (request.user && request.token && request.host) {
            const mailOptions = {
                from: 'rezbuild.estia@gmail.com',
                to: request.user.email,
                subject: '[REZBUILD APP] Account verification',
                text: 'Hello '+ request.user.firstname + ',\n\nPlease verify your account by clicking the link: \nhttp:\/\/' + host + '\/signin?action=confirmation&token=' + request.token + '.\n\nREZBUILD App'

            };
            
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) {
                    console.error('[/api/email/verifyuser] '+err)
                    res({ok: false}) 
                }
                else {
                    res({ok: true}) 
                }
            });
        }
    });

    /**
     * @description Route email for user's project join verification by owner
     */
    client.on('/api/email/joinProject', (req, host, res) => {
        console.info('[/api/email/joinProject] Sending email to project\'s owner for new member join request')
        if (client.handshake.session.user) {
            const mailOptions = {
                from: 'rezbuild.estia@gmail.com',
                to: req.project.owner.email,
                subject: '[REZBUILD APP] Approve new project member',
                text: 'Hello '+ req.project.owner.firstname + ',\n\nUser ' + client.handshake.session.user.firstname + ' ' + client.handshake.session.user.lastname + '<'+ client.handshake.session.user.email +'> requested to join your project ['+ req.project.name +'].\n\n'+
                'You can approve or desapprove this request on the team tab of the project.\n\nREZBUILD App'
            };
                
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) {
                    console.error('[/api/email/joinProject] '+err)
                    res({ok: false}) 
                }
                else {
                    res({ok: true}) 
                }
            });
        } else {
            console.error('[/api/email/todotask] User not signed in')
            res({error: 'User not signed in'})
        }
    });
}
 