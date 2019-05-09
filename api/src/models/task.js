var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  date: {type: Date, default: Date.now},
  revision: { type: Schema.Types.ObjectId, ref: 'Revision'},
  project: { type: Schema.Types.ObjectId, ref: 'Project'},
  lane:   {type: String, default: 'lane_backlog'},
  name: {type: String, default: 'Task0'},
  content:  {type: String, default: '##### Description\n\nA simple task for testing\n\n##### Input\n\nN/A\n\n##### Output\n\nN/A\n'},
  startDate: {type: Date, default: Date.now},
  endDate: {type: Date, default: Date.now},
  doneDate: {type: Date, default: Date.now},
  doneUser: { type: Schema.Types.ObjectId, ref: 'User'},
  assignedUser: { type: Schema.Types.ObjectId, ref: 'User'},
  roles: [String],
  actions: [String]
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
