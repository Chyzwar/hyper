import HttpClient from "@hyper/http-client/lib/BrowserClient";
import Logger from "@hyper/logger/lib/Logger";

const logger = new Logger();

const client = new HttpClient(
  new URL("https://jsonplaceholder.typicode.com")
);

interface Emp{
  employee_name: string;
}
client.get<Emp>("/posts")
  .then((employees) => {
    logger.info("list of employees", employees);
  })
  .catch((error: Error) => {
    logger.error(error.message); 
  });

client
  .post<Emp>("/create", {body: {employee_name: "Marian Paźdioch"}})
  .then((employee) => {
    logger.info("new employee", employee);
  })
  .catch((error: Error) => {
    logger.error(error.message); 
  });