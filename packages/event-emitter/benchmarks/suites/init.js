/* eslint-disable @typescript-eslint/no-unused-vars */

import benchmark from "benchmark";
import EventEmitter3 from "eventemitter3";
import EventEmitterH from "@hyper/event-emitter/lib/EventEmitter";
import EventEmitter1 from "events";

let emitter = null;

new benchmark.Suite()
  .add("EventEmitter1", function() {
    emitter = new EventEmitter1();
  })
  .add("EventEmitter3", function() {
    emitter = new EventEmitter3();
  })
  .add("EventEmitterH", function() {
    emitter = new EventEmitterH();
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({async: true});
