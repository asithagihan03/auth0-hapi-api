'use strict';

const Boom = require('boom');
const Device = require('../model/Device');
const bcrypt = require('bcryptjs');

function verifyUniqueDevice(req, res) {
  // Find an entry from the database that
  // matches either the email or username
  Device.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, device) => {
    // Check whether the username or email
    // is already taken and error out if so
    if (device) {
      if (device.username === req.payload.username) {
        res(Boom.badRequest('Username taken'));
        return;
      }
      if (device.email === req.payload.email) {
        res(Boom.badRequest('Email taken'));
        return;
      }
    }
    // If everything checks out, send the payload through
    // to the route handler
    res(req.payload);
  });
}


module.exports = {
  verifyUniqueDevice: verifyUniqueDevice
}
