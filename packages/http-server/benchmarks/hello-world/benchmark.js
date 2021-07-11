import autocannon from "autocannon";
import {spawn} from "child_process";

const runBench = (childProcess, url, resolve, reject) => {
  childProcess.on("exit", resolve);  
  childProcess.on("error", reject);  

  childProcess.stdout.on("data", (data) => {
    if (data.toString().includes("Server listening")) {
      const instance = autocannon({
        url,
        connections: 10,
        pipelining: 1,
        duration: 10,
      });
      autocannon.track(instance);
      instance.on("done", () => {
        childProcess.kill("SIGKILL");
      });
    }
  });
};

const suites = [
  {"command": "hyper", name: "Hyper", port: 3000},
  {"command": "express", name: "Express", port: 3100},
  {"command": "fastify", name: "Fastify", port: 3200},
];

for (const suite of suites) {
  await new Promise((resolve, reject) => {
    console.log(`Benchmark for ${suite.name}`);
    const hyper = spawn("yarn", [suite.command]);
    runBench(hyper, `http://localhost:${suite.port}/home`, resolve, reject);
  })
    .catch((error) => {
      console.log(error); 
    });
}
process.exit(1);
