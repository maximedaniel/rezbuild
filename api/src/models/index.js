
var mongoose = require("mongoose");

var init = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/rezbuild", {useNewUrlParser: true, reconnectInterval: 5000, reconnectTries: Number.MAX_VALUE});
}

mongoose.connection.on('connecting', () =>{
    console.log('Connecting to db...')
})
mongoose.connection.on('connected', () =>{
    console.log('Connected to db.')
})
mongoose.connection.on('error', (error) =>{
    console.log(error)
    setTimeout(init, 5000)
})

init()


//{useMongoClient: true }
module.exports.User = require('./user');
module.exports.Project = require('./project');
module.exports.Revision = require('./revision');
module.exports.Task = require('./task');

