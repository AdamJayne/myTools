require('dotenv').config();
const fastify = require('fastify')({
  logger: {
    prettyPrint: true,
    level: 'info'
  }
});
const helmet = require('fastify-helmet');
const mongodb = require('fastify-mongodb');

const controllers = require('./controllers');

// Middlewares
fastify.register(helmet);
fastify.register(mongodb, {
  forceClose: true,
  url: process.env.MONGODB_URL
});

// TODO: Create a TODO manager
fastify.register(controllers.ToDoController, { prefix: "/todo" });
fastify.register(controllers.UserController, { prefix: "/user" });

fastify.get('/', (request, reply) => {
  reply.send({
    root: true
  })
});

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});