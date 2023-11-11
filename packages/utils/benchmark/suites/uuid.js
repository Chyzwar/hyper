import benchmark from "benchmark";
import {uuid} from "@hyper/utils";
import {huid} from "@hyper/utils";

const hundredK = 100000;

new benchmark.Suite()
  .add("uuid ", function() {
    for (let index = 0; index < hundredK; index++) {
      uuid.default();
    }
  })
  .add("huid", function() {
    for (let index = 0; index < hundredK; index++) {
      huid.default();
    }
  })
  .on("cycle", function cycle(event) {
    console.log(event.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({async: true});
