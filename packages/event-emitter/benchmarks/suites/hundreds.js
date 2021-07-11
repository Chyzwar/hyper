import benchmark from "benchmark";
import EventEmitter3 from "eventemitter3";
import EventEmitterH from "@hyper/event-emitter/lib/EventEmitter";
import EventEmitter1 from "events";

function foo() {
  if (arguments.length > 100) console.log("damn");
  return 1;
}

const ee1 = new EventEmitter1();
const ee3 = new EventEmitter3();
const eeh = new EventEmitterH();

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    ee1.on(`event: ${i}`, foo);
    ee3.on(`event: ${i}`, foo);
    eeh.on(`event: ${i}`, foo);
  }
}

new benchmark.Suite()
  .add("EventEmitter1", function() {
    for (let i = 0; i < 10; i++) {
      eeh.emit(`event: ${i}`);
    }
  })
  .add("EventEmitter3", function() {
    for (let i = 0; i < 10; i++) {
      eeh.emit(`event: ${i}`);
    }
  })
  .add("EventEmitterH", function() {
    for (let i = 0; i < 10; i++) {
      eeh.emit(`event: ${i}`);
    }
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({async: true});
