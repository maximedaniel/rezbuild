var common = require('common')

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LinkSchema = new Schema({
revision: { type: Schema.Types.ObjectId, ref: 'Revision' },
task:     { type: Schema.Types.ObjectId, ref: 'Task' },
}, { noId: true });

var KeySchema = new Schema({
value: {type: Number, default: 0},
unit:  {type: String, default: "ø"}
}, { noId: true });


var body = {
  // _id: {type: Schema.Types.ObjectId, index:true, required:true, auto:true},
   project: {type: Schema.Types.ObjectId, ref: 'Project', required: [true, "can't be blank"]},
   date: {type: Date, default: Date.now},
   name: {type: String, default: 'Revision'},
   status: [String],
  /* asisModel: { type: Schema.Types.ObjectId, ref: 'File'},
   asisKeys: [KeySchema],
   tobeModel: { type: Schema.Types.ObjectId, ref: 'File'},
   tobeKeys: [KeySchema],
   attachedFiles: [{ type: Schema.Types.ObjectId, ref: 'File'}],*/
   prevLinks: [LinkSchema],
   nextLinks: [LinkSchema]
}

Object.entries(common.ACTIONS).map( ([key, value]) => {
  body[key] = new Schema(value, {noId: true})
})

var RevisionSchema = new Schema( body );

var Revision = mongoose.model('Revision', RevisionSchema);
module.exports = Revision;
