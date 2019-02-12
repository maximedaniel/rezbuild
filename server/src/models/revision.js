var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RevisionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  date: {type: Date, default: Date.now},
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

var Revision = mongoose.model('Revision', RevisionSchema);
module.exports = Revision;
