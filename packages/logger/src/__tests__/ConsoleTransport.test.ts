import ConsoleTransport from "../ConsoleTransport";
import Level from "../enums/Level";

describe("ConsoleTransport", () => {
  const log = jest.spyOn(console, "log").mockReturnValue();

  it("should send messages to console", () => {
    const transport = new ConsoleTransport();
    const message = {
      level: Level.Info,
      time: new Date("2020-01-01").toJSON(),
      message: "log message",
      data: {
        meta: "some additional metadata",
      },
    };
    transport.send(message);

    expect(log).toHaveBeenCalledWith(message);
  });
});