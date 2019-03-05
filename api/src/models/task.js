var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  title: String,
  date: {type: Date, default: Date.now},
  lane:  String,
  revision:  { type: Schema.Types.ObjectId, ref: 'Revision' },
  assignements: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  assessments: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  inputs:[String],
  outputs: [String]
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
