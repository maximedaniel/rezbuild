var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
 // _id: {type: Schema.Types.ObjectId, index:true, required:true, auto:true},
  name: String,
  data: Buffer
});

var File = mongoose.model('File', FileSchema);
module.exports = File;
