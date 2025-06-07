"use strict";

var mongoose = require('mongoose');

var connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    "enum": {
      values: ['ignored', 'interested', 'accepted', 'rejected'],
      message: '{VALUE} is not a valid status'
    },
    "default": 'pending'
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);