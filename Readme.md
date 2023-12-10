# Hyper Project
![Github Actions](https://github.com/chyzwar/hyper/workflows/Build/badge.svg)

Experimental web framework for node.js

## Project status

I work on this as hobby project. This is not production ready. If you are looking for web framework I recommend fastify.js or hapi.js

## Why

- no external dependacies
- native ESM support
- support for async/await
- support for http2
- clean code and testable
- great performance
- first class typescript support

```ts
import {
  Server, 
  BodyParser, 
  Router, 
  RequestLogger
} from "@hyper/http-server";

const server = new Server({port: 3000});

const bodyParser = new BodyParser();
const requestLogger = new RequestLogger();
const router = new Router();
server.addLayer(bodyParser);

router.get("/", (req, res) => {
  res.json({
    message: "Hello World", 
    body: req.body,
  });
});
router.post("/echo", (req, res) => {
  res.json({
    body: req.body,
  });
});
server.addLayer(requestLogger);
server.addRouter(router);

server
  .listen()
  .then((address) => {
    logger.info(`Server started on ${address.address}:${address.port}`);
  })
  .catch((error) => {
    console.log("Failed to start", error); 
  });
```

## What is implemented

- middleware system simmilar to express
- simple router
- body parser 
- isomorthic json logger
- isomorthinc http client
- request logging middleware
- mock request and response

## What is missing

- compresssion
- cookie parser
- documentation
- request schema validation
- etag/freshness and caching support