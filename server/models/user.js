var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  firstname: String,
  lastname: String,
  roles: [String],
  date: {type: Date, default: Date.now},
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  revisions: [{ type: Schema.Types.ObjectId, ref: 'Revision' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);
module.exports = User;
