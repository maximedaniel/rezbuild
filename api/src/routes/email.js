
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
 }
 