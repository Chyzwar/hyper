/* eslint-disable @typescript-eslint/no-empty-function */
import {URL} from "url";

Object.defineProperty(global.window.navigator, "sendBeacon", {
  value: () => {},
  writable: true,
});

global.window.URL = URL;