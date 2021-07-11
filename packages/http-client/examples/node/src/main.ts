import HttpClient from "@hyper/http-client/lib/NodeClient";
import Logger from "@hyper/logger/lib/Logger";
import type JSONValue from "@hyper/utility-types/lib/JSONValue";

const logger = new Logger();

const client = new HttpClient(
  new URL("http://dummy.restapiexample.com/api/v1/")
);

client.get("/employees")
  .then((employees: JSONValue) => {
    logger.info("list of employees", {employees});
  })
  .catch((error: Error) => {
    logger.error("Failed", {error}); 
  });

client
  .post("/create", {body: {employee_name: "Marian Paźdioch"}})
  .then((employee: JSONValue) => {
    logger.info("new employee", {employee});
  })
  .catch((error: Error) => {
    logger.error("Failed", {error}); 
  });