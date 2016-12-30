'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Device = require('../model/Device');
const createDeviceSchema = require('../schemas/createDevice');

module.exports = {
  method: 'POST',
  path: '/api/1.0/devices',
	config: { auth: 'token' },    
  handler: (req, res) => {

    let device = new Device();
    device.email = req.payload.email;
    device.username = req.payload.username;
    device.admin = false;
    device.save((err, device) => {
      if (err) {
        throw Boom.badRequest(err);
      }
          // If the user is saved successfully, issue a JWT
      res({message: 'Device updated!'});
    });
  }
}
