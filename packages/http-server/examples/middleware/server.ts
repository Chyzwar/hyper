/* eslint-disable @typescript-eslint/class-methods-use-this */
import {Server, Router, Layer} from "@hyper/http-server";
import type {Request, Response} from "@hyper/http-server";
import {Logger} from "@hyper/logger";
import {readFileSync} from "fs";

const logger = new Logger();

const server = new Server({
  port: 3000,
  cert: readFileSync("./cert.pem"),
  key: readFileSync("./key.pem"),
});

const router = new Router();

type RequestCustom = Request & {
  test1: number;
  test2: number;
};
type ResponseCustom = Response & {
  test1: number;
  test2: number;
};

class AsyncMiddleware1 extends Layer<RequestCustom, ResponseCustom> {
  public async handler(req: RequestCustom, res: ResponseCustom): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    req.test1 = 1;
    res.test1 = 1;
  }
}

class RouterMiddleware2 extends Layer<RequestCustom, ResponseCustom> {
  public handler(req: RequestCustom, res: ResponseCustom): void {
    req.test2 = 2;
    res.test2 = 2;
  }
}

router.setBefore([
  new AsyncMiddleware1(),
  new RouterMiddleware2(),
]);
router
  .get<RequestCustom, ResponseCustom>("/", (req, res) => {
  res.json({
    hello: "Hello World",
    test1: {
      reqTest1: req.test1,
      resTest1: res.test1,
    },
    test2: {
      reqTest2: req.test2,
      resTest2: res.test2,
    },
  });
});

server.addRouter(router);

server
  .listen()
  .then(() => {
    logger.info("Server started on https://localhost:3000");
  })
  .catch((error: Error) => {
    logger.error("Error", error); 
  });