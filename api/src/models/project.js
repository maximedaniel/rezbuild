var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  //_id: {type: Schema.Types.ObjectId, index:true, required:true, auto:true},
  date: {type: Date, default: Date.now},
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  revisions: [{ type: Schema.Types.ObjectId, ref: 'Revision' }]
});

var Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
