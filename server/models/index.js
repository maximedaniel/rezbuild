var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/veg-crud-auth");
module.exports.Vegetable = require('./vegetable');
module.exports.User = require('./user');
