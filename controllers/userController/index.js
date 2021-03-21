// The User controller

module.exports = (fastify, options, done) => {
  fastify.get('/', async (request, reply) => {
    return {
      users: true
    }
  });

  done();
}