import {jest} from "@jest/globals";
import Logger, {defaults} from "../Logger.js";
import Level from "../enums/Level.js";

describe("Logger", () => {
  describe("constructor", () => {
    const [transport] = defaults;
    const send = jest.spyOn(transport, "send").mockReturnValue();

    afterEach(() => {
      send.mockReset();
    });

    it("should initialize with default transport", () => {
      const logger = new Logger();

      logger.info("Info");
      expect(send).toHaveBeenCalled();
    });

    it("should initialize with level=info", () => {
      const logger = new Logger();

      logger.debug("Debug");
      expect(send).not.toHaveBeenCalled();
      logger.info("Debug");
      expect(send).toHaveBeenCalled();
    });

    it("should log warn if level=warn", () => {
      const logger = new Logger({level: Level.Warn});

      logger.warn("Warn");
      expect(send).toHaveBeenCalled();
    });

    it("should log info if level=info", () => {
      const logger = new Logger({level: Level.Info});

      logger.info("Info");
      expect(send).toHaveBeenCalled();
    });
  });
});