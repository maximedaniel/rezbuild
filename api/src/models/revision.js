var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RevisionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  prev: Schema.Types.ObjectId,
  date: {type: Date, default: Date.now},
  project: {type: Schema.Types.ObjectId, ref: 'Project'},
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

var Revision = mongoose.model('Revision', RevisionSchema);
module.exports = Revision;
