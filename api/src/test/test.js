/*var mongoose = require('mongoose')
var Project = require('../models').Project
var Revision = require('../models').Revision
var Task = require('../models').Task

const project0_id = new mongoose.Types.ObjectId()
const revision0_id = new mongoose.Types.ObjectId()
const revision1_id = new mongoose.Types.ObjectId()
const revision2_id = new mongoose.Types.ObjectId()
const revision3_id = new mongoose.Types.ObjectId()
const task0_id = new mongoose.Types.ObjectId()
const task1_id = new mongoose.Types.ObjectId()
const task2_id = new mongoose.Types.ObjectId()

var currDate = new Date();
var nextDate = new Date();

nextDate.setDate(currDate.getDate());

var project0 = new Project({
  _id: project0_id,
  date: new Date(nextDate),
  name: 'Project0',
  owner: null,
  users: [],
  revisions: [revision0_id, revision1_id, revision2_id, revision3_id]
});

nextDate.setDate(currDate.getDate() + 1);

var revision0 = new Revision({
  _id: revision0_id,
  date: new Date(nextDate),
  name: 'Revision0',
  files: ['revision0.ifc'],
  project: project0_id,
  prevLinks: [],
  nextLinks: [{revision:revision1_id, task:task0_id}],
  tasks: [task0_id, task1_id, task2_id]
});

nextDate.setDate(currDate.getDate() + 2);

var revision1 = new Revision({
  _id: revision1_id,
  date: new Date(nextDate),
  name: 'Revision1',
  files: ['revision1.ifc'],
  project: project0_id,
  prevLinks: [{revision:revision1_id, task:task0_id}],
  nextLinks: [{revision:revision2_id, task:task1_id}, {revision:revision3_id, task:task2_id}],
  tasks: [task0_id, task1_id, task2_id]
});

nextDate.setDate(currDate.getDate() + 3);

var revision2 = new Revision({
  _id: revision2_id,
  date: new Date(nextDate),
  name: 'Revision2',
  files: ['revision2.ifc'],
  project: project0_id,
  prevLinks: [{revision:revision2_id, task:task1_id}],
  nextLinks: [],
  tasks: [task0_id, task1_id, task2_id]
});


nextDate.setDate(currDate.getDate() + 4);

var revision3 = new Revision({
  _id: revision3_id,
  date: new Date(nextDate),
  name: 'Revision3',
  files: ['revision3.ifc'],
  project: project0_id,
  prevLinks: [{revision:revision3_id, task:task2_id}],
  nextLinks: [],
  tasks: [task0_id, task1_id, task2_id]
});

// TASKS
var task0 = new Task({
  _id: task0_id,
  date: new Date(),
  name: 'Task0',
  lane:  'TODO',
  content:  'This is the task0',
});

var task1 = new Task({
  _id: task1_id,
  date: new Date(),
  name: 'Task1',
  lane:  'TODO',
  content:  'This is the task1',
});

var task2 = new Task({
  _id: task2_id,
  date: new Date(),
  name: 'Task2',
  lane:  'TODO',
  content:  'This is the task2',
});

project0.save();

revision0.save();
revision1.save();
revision2.save();
revision3.save();

task0.save();
task1.save();
task2.save();
*/


