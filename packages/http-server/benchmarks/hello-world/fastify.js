/* eslint-disable @typescript-eslint/no-floating-promises */

import fastify from "fastify";

const server = fastify({logger: false});

server.get("/home", (request, reply) => {
  reply.send({hello: "world"});
});

server.listen({port: 3200}, 
  (err, address) => {
    if (err) {
      console.error(`Server error on ${err.message}`);
    }
    else {
      console.info(`Server listening on ${address}`);
    }
  });