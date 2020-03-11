
/**
 * @module FileModel
 * @description Define a file with MongoDB schema
 */
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

var FileSchema = new Schema({
  name: String,
  data: Buffer
});

var File = mongoose.model('File', FileSchema);

module.exports = File;
