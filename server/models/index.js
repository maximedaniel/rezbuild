var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/veg-crud-auth");
module.exports.User = require('./user');
module.exports.Project = require('./project');
module.exports.Revision = require('./revision');
module.exports.Task = require('./task');

