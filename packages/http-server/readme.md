@hyper - minimalistic web framework
===============================

Manifest
--------

- Written Typescript
- Minimal number of external dependencies
- Better middleware system
- Best possible performance
- Clean and safe API


TODO:
1. ALP negations
2. Freshness
3. 

```js
import Server from '@hyper/http/Server';
import Router from '@hyper/http/Router';

const server = new Server();
const router = new Router();

router.setPath("/");

router.get("/",
  (req, res) => res.text("Hello World")
);

server.addRouter(router);
server.listen(
  () =>  console.log("Server listen on http://localhost:3000")
);

```
