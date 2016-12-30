var Hapi = require('hapi');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
var dotenv = require('dotenv');
var server = new Hapi.Server();

dotenv.load();

// Useful Hapi plugins
// To generate documentation, use the hapi-swagger plugin
var plugins = [
  require('h2o2'),
  require('inert'),
  require('vision'),
  require('blipp'),
  require('hapi-auth-jwt')
];

  var contacts = [
  {
    id: 1,
    name: 'Chris Sevilleja',
    email: 'chris@scotch.io',
    image: 'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60'
  },
  {
    id: 2,
    name: 'Nick Cerminara',
    email: 'nick@scotch.io',
    image: 'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60'
  },
  {
    id: 3,
    name: 'Ado Kukic',
    email: 'ado@scotch.io',
    image: 'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60'
  },
  {
    id: 4,
    name: 'Holly Lloyd',
    email: 'holly@scotch.io',
    image: 'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60'
  },
  {
    id: 5,
    name: 'Ryan Chenkie',
    email: 'ryan@scotch.io',
    image: 'http://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60'
  }
];

server.connection({ port: 3000 , routes: { cors: true }});

server.register(plugins, function (err) {

  if (err) {
    throw err;
  }

  server.auth.strategy('token', 'jwt', {
    key: process.env.AUTH0_CLIENT_SECRET,
    verifyOptions: {
      algorithms: [ 'HS256' ],
      audience: process.env.AUTH0_CLIENT_ID
    }
  });



  server.route({
    method: 'GET',
    path: '/private',
    config: { auth: 'token' },
    handler: function(request, reply) {
      reply({
        message: 'This is a private endpoint - a token is required.',
        credentials: request.auth.credentials
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/contacts',
    handler: function(request, reply) {
      const allContacts = contacts.map(contact => { 
        return { id: contact.id, name: contact.name}
      });
      reply(allContacts);
    }
  });

  server.route({
    method: 'GET',
    path: '/api/contacts/{id*}',
    config: { auth: 'token' },
    handler: function(request, reply) {
      const allContacts = contacts.map(contact => { 
        return { id: contact.id, name: contact.name}
      });
      reply(contacts.find(function(contact){ return contact.id === parseInt(request.params.id); }));
    }
  });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('api/**/**/routes/*.js', { 
    root: __dirname 
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    console.log(file);
    server.route(route);
  });




  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server started at:', server.info.uri);
  });

    // Once started, connect to Mongo through Mongoose
  mongoose.connect( process.env.DB_URL, {}, (err) => {
    if (err) {
      throw err;
    }
  });
});
