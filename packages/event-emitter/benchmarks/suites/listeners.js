import benchmark from "benchmark";
import EventEmitter3 from "eventemitter3";
import EventEmitterH from "@hyper/event-emitter/lib/EventEmitter";
import EventEmitter1 from "events";

const MAX_LISTENERS = Math.pow(2, 32) - 1;

function handle() {
  if (arguments.length > 100) console.log("damn");
}

const ee1 = new EventEmitter1();
const ee3 = new EventEmitter3();
const eeh = new EventEmitterH();

ee1.setMaxListeners(MAX_LISTENERS);

for (let i = 0; i < 25; i++) {
  ee1.on("event", handle);
  ee3.on("event", handle);
  eeh.on("event", handle);
}

new benchmark.Suite()
  .add("EventEmitter1", function() {
    ee1.listeners("event");
  })
  .add("EventEmitter3", function() {
    ee3.listeners("event");
  })
  .add("EventEmitterH", function() {
    eeh.listeners("event");
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({async: true});
