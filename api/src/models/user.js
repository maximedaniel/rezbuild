/**
 * @module UserModel
 * @description Define a user with MongoDB schema
 */
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: {type: String, required: [true, "can't be blank"]},
  lastname: {type: String, required: [true, "can't be blank"]},
  email: {type: String, required: [true, "can't be blank"], index: true, unique: true},
  isVerified: { type: Boolean, default: false },
  password: {type: String, required: [true, "can't be blank"]},
  roles: {type: [String], required: [true, "can't be blank"]},
  date: {type: Date, default: Date.now},
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  revisions: [{ type: Schema.Types.ObjectId, ref: 'Revision' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
