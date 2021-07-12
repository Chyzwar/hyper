import {jest} from "@jest/globals";
import {URL} from "url";
Object.defineProperty(global.window.navigator, "sendBeacon", {
  value: jest.fn(),
  writable: true,
});

global.window.URL = URL;