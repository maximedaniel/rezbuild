/**
 * @module TokenModel
 * @description Define a token with MongoDB schema
 */
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const TOKEN_ACTIONS = Object.freeze({
    confirm_user: 'confirm_user',
    reset_password: 'reset_password',
    join_project: 'join_project'
});

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    action: { type: String, enum: Object.values(TOKEN_ACTIONS), required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

Object.assign(TokenSchema.statics, {TOKEN_ACTIONS});

var Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
