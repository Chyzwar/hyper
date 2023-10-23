const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

app.use(bodyParser.json());

router.post("/", (req, res) => {
  res.json({express:"Hello World"});
});

app.use(router);
app.listen(3100, () => {
  console.log("Listen on port");
});
