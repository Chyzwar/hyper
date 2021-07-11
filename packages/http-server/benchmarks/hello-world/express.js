import express from "express";

const router = express.Router();
const app = express();

router.get("/home", (req, res) => {
  res.json({express:"Hello World"});
});

app.use(router);
app.listen(3100, () => {
  console.log("Server listening on http://localhost:3100/home");
});
