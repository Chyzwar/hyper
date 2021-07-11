import {Server, BodyParser, Router} from "@hyper/http-server";

const server = new Server({port: 3000});

const bodyParser = new BodyParser();
const router = new Router();

router.post("/", (req, res) => {
  res.json({hyper: "Hello World"});
});

server.addLayer(bodyParser);
server.addRouter(router);

server
  .listen(3000)
  .then(() => {
    console.log("Server is listening"); 
  })
  .catch((error) => {
    console.log("Failed to start", error); 
  });



