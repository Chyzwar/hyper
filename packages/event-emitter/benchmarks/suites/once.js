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


new benchmark.Suite()
  .add("EventEmitter1", function() {
    ee1.once("foo", handle).emit("foo");
  })
  .add("EventEmitter3", function() {
    ee3.once("foo", handle).emit("foo");
  })
  .add("EventEmitterH", function() {
    eeh.once("foo", handle).emit("foo");
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  }).run({async: true});
