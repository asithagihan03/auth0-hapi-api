'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceModel = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true }
});

module.exports = mongoose.model('Device', deviceModel);