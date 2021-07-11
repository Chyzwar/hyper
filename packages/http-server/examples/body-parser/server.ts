import {readFileSync} from "fs";
import {Server, Router, BodyParser} from "@hyper/http-server";
import {Logger} from "@hyper/logger";
import type {Request, Response} from "@hyper/http-server";

const logger = new Logger();

const server = new Server({
  port: 3000,
  cert: readFileSync("./cert.pem"),
  key: readFileSync("./key.pem"),
});

const router = new Router();

router.setBefore([
  new BodyParser(),
]);

router
  .post<Request<object>, Response<object>>("/", (req, res) => {
  logger.info("request body", req.body);
  res.json(
    req.body
  );
});

server.addRouter(router);

server
  .listen()
  .then((address) => {
    logger.info(`Server started on ${address.address}:${address.port}`);
  })
  .catch((error: Error) => {
    logger.error("Error", error); 
  });