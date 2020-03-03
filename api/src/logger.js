
import { createLogger, format, transports } from 'winston';
var fs = require( 'fs' );
var path = require('path');
var process = require('process')
var logDir =  path.join(__dirname, '/logs');
if ( !fs.existsSync( logDir ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( logDir );
}
var sanitize = (unsanitized) =>  unsanitized.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/"/g,"\\\"").replace(/'/g,"\\\'").replace(/\&/g, "\\&");
const customFormat = format.printf(log => `${log.timestamp} | ${log.level}: ${log.message}`);
const levels = { 
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };
var logger = createLogger({
    level: 'silly',
    format: format.combine(
      format.timestamp(),
      customFormat
    ),
    transports: [
       new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.colorize(),
            customFormat,
        )
        }),
        new transports.File({
            filename: path.join(logDir, '/out.log'),
            options: { flags: 'w' },
            format: format.combine(
                format.timestamp(),
                format.json(),
            )
         })
    ],
    exitOnError: false
  })

console.log = (message) => logger.log({level: 'verbose', message:message, color:'purple'});
console.debug = (message) => logger.log({level: 'debug', message:message, color:'blue'});
console.info = (message) => logger.log({level: 'info', message:message, color:'green'});
console.warn = (message) => logger.log({level: 'warn', message:message, color:'orange'});
console.error = (message) => logger.log({level: 'error', message:message, color:'red'});

process.on('uncaughtException', function (error) {
    console.error(error);
 });

export default logger;