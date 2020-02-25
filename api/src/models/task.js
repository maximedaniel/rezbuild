/**
 * @module TaskModel
 * @description Define a task with MongoDB schema
 */

 var common = require('common')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var TaskSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project'},
  lane:   {type: String, default: 'lane_backlog'},
  name: {type: String, default: 'Task0'},
  content:  {type: String, default: '##### Description\n\nA simple task for testing\n\n##### Input\n\nN/A\n\n##### Output\n\nN/A\n'},
  startDate: {type: Date, default: Date.now},
  endDate: {type: Date, default: Date.now},
  date: {type: Date, default: Date.now},
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  roles: [String],
  action: String,
  names: [String],
  values: [String],
  formats: [String],
  files: [String],
  prev: [{type: Schema.Types.ObjectId, ref: 'Task'}],
  next: [{type: Schema.Types.ObjectId, ref: 'Task'}]
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
