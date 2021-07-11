import benchmark from "benchmark";
import bytes from "bytes";
import stringToBytes from "@hyper/utils/lib/stringToBytes";


new benchmark.Suite()
  .add("bytes", function() {
    bytes("1mb");
  })
  .add("getBytesForString", function() {
    stringToBytes("1mb");
  })
  .on("cycle", function cycle(event) {
    console.log(event.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({async: true});
