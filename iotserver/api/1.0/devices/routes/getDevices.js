'use strict';

const Device = require('../model/Device');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/api/1.0/devices',
  config: { auth: 'token' },
  handler: (req, res) => {
      Device
        .find()
        .exec((err, devices) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          if (!devices.length) {
            throw Boom.notFound('No devices found!');
          }
          res(devices);
        })
  }
}