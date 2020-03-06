
import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import path  from 'path'
import process from 'process'

// Declare log file directory
const logDir =  path.join(__dirname, '../logs');

// Create the directory if it does not exist
if (!fs.existsSync( logDir )) fs.mkdirSync( logDir );

// Customize log format
const customFormat = format.printf(log => `${log.timestamp} | ${log.level}: ${log.message}`);

// Define a string sanitizing function
var sanitize = (unsanitized) =>  unsanitized.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/"/g,"\\\"").replace(/'/g,"\\\'").replace(/\&/g, "\\&");

// Create logger
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

// Override console channels
console.log = (message) => logger.log({level: 'verbose', message:JSON.stringify(message), color:'purple'});
console.debug = (message) => logger.log({level: 'debug', message:JSON.stringify(message), color:'blue'});
console.info = (message) => logger.log({level: 'info', message:JSON.stringify(message), color:'green'});
console.warn = (message) => logger.log({level: 'warn', message:JSON.stringify(message), color:'orange'});
console.error = (message) => logger.log({level: 'error', message:JSON.stringify(message), color:'red'});

// Override process uncaughtException
process.on('uncaughtException', function (error) {
    console.error(error);
 });

export default logger;