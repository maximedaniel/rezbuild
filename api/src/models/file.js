
/**
 * @module FileModel
 * @description Define a file with MongoDB schema
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
  name: String,
  data: Buffer
});

var File = mongoose.model('File', FileSchema);

module.exports = File;
