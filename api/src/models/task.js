var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  //_id: {type: Schema.Types.ObjectId, index:true, required:true, auto:true},
  date: {type: Date, default: Date.now},
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
