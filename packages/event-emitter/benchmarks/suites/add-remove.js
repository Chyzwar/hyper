import benchmark from "benchmark";
import EventEmitter3 from "eventemitter3";
import EventEmitterH from "@hyper/event-emitter/lib/EventEmitter";
import EventEmitter1 from "events";

function handle() { }

const ee1 = new EventEmitter1();
const ee3 = new EventEmitter3();
const eeh = new EventEmitterH();

new benchmark.Suite()
  .add("EventEmitter1", function() {
    ee1.on("foo", handle);
    ee1.removeListener("foo", handle);
  })
  .add("EventEmitter3", function() {
    ee3.on("foo", handle);
    ee3.removeListener("foo", handle);
  })
  .add("EventEmitterH", function() {
    eeh.on("foo", handle);
    eeh.removeListener("foo", handle);
  })
  .on("cycle", function cycle(event) {
    console.log(event.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  }).run({async: true});
