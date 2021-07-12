import {jest} from "@jest/globals";
import BeaconTransport from "../BeaconTransport.js";
import Level from "../enums/Level.js";

describe("BeaconTransport", () => {
  const url = new URL("http://test.invalid/");
  const sendBeacon = jest.spyOn(window.navigator, "sendBeacon");
  it("should send messages to sendBeacon", () => {

    const transport = new BeaconTransport({url});
    const message = {
      level: Level.Info,
      time: new Date("2020-01-01").toJSON(),
      message: "log message",
      data: {
        meta: "some additional metadata",
      },
    };
    transport.send(message);

    expect(sendBeacon).toHaveBeenCalledWith(url.toString(), JSON.stringify(message));
  });
});