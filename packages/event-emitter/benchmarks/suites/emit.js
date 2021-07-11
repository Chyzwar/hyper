import benchmark from "benchmark";
import EventEmitter3 from "eventemitter3";
import EventEmitterH from "@hyper/event-emitter/lib/EventEmitter";
import EventEmitter1 from "events";

function handle() {
  if (arguments.length > 100) console.log("damn");
}

const ee1 = new EventEmitter1();
const ee3 = new EventEmitter3();
const eeh = new EventEmitterH();

ee1.on("foo", handle);
ee3.on("foo", handle);
eeh.on("foo", handle);

new benchmark.Suite()
  .add("EventEmitter1", function() {
    ee1.emit("foo");
    ee1.emit("foo", "bar");
    ee1.emit("foo", "bar", "baz");
    ee1.emit("foo", "bar", "baz", "boom");
  })
  .add("EventEmitter3", function() {
    ee3.emit("foo");
    ee3.emit("foo", "bar");
    ee3.emit("foo", "bar", "baz");
    ee3.emit("foo", "bar", "baz", "boom");
  })
  .add("EventEmitterH", function() {
    eeh.emit("foo");
    eeh.emit("foo", "bar");
    eeh.emit("foo", "bar", "baz");
    eeh.emit("foo", "bar", "baz", "boom");
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({async: true});
