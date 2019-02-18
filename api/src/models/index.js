var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/rezbuild", { useMongoClient: true });
module.exports.User = require('./user');
module.exports.Project = require('./project');
module.exports.Revision = require('./revision');
module.exports.Task = require('./task');

