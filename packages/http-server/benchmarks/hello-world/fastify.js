/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import fastify from "fastify";

const server = fastify({logger: false});

server.get("/home", (request, reply) => {
  reply.send({hello: "world"});
});

server.listen(3200, 
  /**
   * @param {Error} [err]
   * @param {String} [address]
   */
  (err, address) => {
    if (err) {
      console.error(`Server error on ${err.message}`);
    }
    else {
      console.info(`Server listening on ${address}`);
    }
  });