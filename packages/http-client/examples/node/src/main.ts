import {HttpClient} from "@hyper/http-client";
import {Logger} from "@hyper/logger";


const logger = new Logger();

const client = new HttpClient(
  new URL("http://dummy.restapiexample.com/api/v1/")
);

client.get("/employees")
  .then((employees) => {
    logger.info("list of employees", {employees});
  })
  .catch((error: Error) => {
    logger.error("Failed", {error}); 
  });

client
  .post("/create", {body: {employee_name: "Marian Paźdioch"}})
  .then((employee) => {
    logger.info("new employee", {employee});
  })
  .catch((error: Error) => {
    logger.error("Failed", {error}); 
  });