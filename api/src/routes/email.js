
import dateFormat from 'dateformat'

module.exports = function(io, client, transporter){
    client.on('/api/email/send', function (request, res) {
        // request => user, task, project
        console.log('/api/email/send', request)
        if(request.user && request.task && request.project){
            const mailOptions = {
                from: 'rezbuildapp@gmail.com', // sender address
                to: request.user.email, //'to@email.com', // list of receivers
                subject: '[REZBUILD APP] A task was assigned to you', // Subject line
                html: '<p>Hello '+ request.user.firstname + ', <br><br>A <b>' + request.task.name +' task </b> for the <b>'+  dateFormat(request.task.endDate, "yyyy-mm-dd h:MM:ss") +'</b> was assigned to you in the project <b>' + request.project.name + '</b>.<br><br> Best regards,<br>REZBUILD App</p>'// plain text body
              };
            
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) {
                    res({ok: false}) 
                }
                else {
                    res({ok: true}) 
                }
             });
        }
     });
 }
 