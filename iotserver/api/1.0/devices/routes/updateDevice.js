'use strict';

const Boom = require('boom');
const Device = require('../model/Device');
const updateDeviceSchema = require('../schemas/updateDevice');


module.exports = {
  method: 'PATCH',
  path: '/api/1.0/devices/{id}',
	config: { auth: 'token' }, 
  handler: (req, res) => {
      const id = req.params.id;
      Device
        .findOneAndUpdate({ _id: id }, req.pre.device, (err, device) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          if (!device) {
            throw Boom.notFound('Device not found!');
          }
          res({message: 'Device updated!'});
        });      
  }
}