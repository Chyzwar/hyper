import {describe, it, expect, beforeEach, jest} from "@jest/globals";
import EventEmitter from "../EventEmitter.js";

type EventMap = {
  test: (test: string) => void;
};

describe("EventEmitter", () => {
  const handler1 = jest.fn();
  const handler2 = jest.fn();

  beforeEach(() => {
    handler1.mockReset();
    handler2.mockReset();
  });

  it("should add handler and emit event", () => {
    const emitter = new EventEmitter<EventMap>();
    emitter.on("test", handler1);
    emitter.on("test", handler2);
    emitter.emit("test", "test");

    expect(handler1).toHaveBeenCalledWith("test");
    expect(handler2).toHaveBeenCalledWith("test");
  });

  it("should remove event handler", () => {
    const emitter = new EventEmitter<EventMap>();
    emitter.on("test", handler1);
    emitter.on("test", handler2);
    emitter.removeListener("test", handler1);
    emitter.emit("test", "test");

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledWith("test");
  });

  it("should remove all event handler", () => {
    const emitter = new EventEmitter<EventMap>();
    emitter.on("test", handler1);
    emitter.on("test", handler2);
    emitter.removeAllListeners("test");
    emitter.emit("test", "test");

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
});