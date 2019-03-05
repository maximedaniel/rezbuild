var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RevisionSchema = new Schema({
 // _id: {type: Schema.Types.ObjectId, index:true, required:true, auto:true},
  date: {type: Date, default: Date.now},
  file: {type: String, required: [true, "can't be blank"]},
  project: {type: Schema.Types.ObjectId, ref: 'Project', required: [true, "can't be blank"]},
  prev: [{ type: Schema.Types.ObjectId, ref: 'Revision' }],
  next: [{ type: Schema.Types.ObjectId, ref: 'Revision' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
});

var Revision = mongoose.model('Revision', RevisionSchema);
module.exports = Revision;
