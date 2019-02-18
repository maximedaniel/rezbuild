var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  _id: Schema.Types.ObjectId,
  date: {type: Date, default: Date.now},
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
