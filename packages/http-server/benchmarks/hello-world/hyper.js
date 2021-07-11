import {Server, Router} from "@hyper/http-server";

const server = new Server({port: 3000, http2: false});
const router = new Router();

router.get("/home", (req, res) => {
  res.json({hyper: "Hello World"});
});

server.addRouter(router);

server
  .listen(3000)
  .then(() => {
    console.log("Server listening on http://localhost:3000"); 
  })
  .catch((error) => {
    console.log("Failed to start", error); 
  });



