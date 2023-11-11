import {readFileSync} from "fs";
import {Server, Router, RequestLogger} from "@hyper/http-server";
import {Logger} from "@hyper/logger";

const logger = new Logger();

const server = new Server({
  port: 3000,
  cert: readFileSync("./cert.pem"),
  key: readFileSync("./key.pem"),
});

server.addLayer(new RequestLogger());

const router = new Router();

router
  .get("/", (_, res) => {
    res.json({hello: "Hello World"});
  });

server.addRouter(router);

server
  .listen()
  .then(() => {
    logger.info("Server started on https://localhost:3000");
  })
  .catch((error: Error) => {
    logger.error("Server Error", {error}); 
  });