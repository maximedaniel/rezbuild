
import mongoose from 'mongoose'

var init = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/rezbuild", {
    useNewUrlParser: true,
    reconnectInterval: 5000,
    reconnectTries: Number.MAX_VALUE
    });
}

mongoose.connection.on('connecting', () =>{
    console.log('Connecting to db...')
})
mongoose.connection.on('connected', () =>{
    console.log('Connected to db.')
})
mongoose.connection.on('error', (error) =>{
    console.error(error)
    setTimeout(init, 5000)
})

init()

module.exports.User = require('./user');
module.exports.Project = require('./project');
module.exports.File = require('./file');
module.exports.Task = require('./task');

