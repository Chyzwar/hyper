

Object.defineProperty(global.window.navigator, "sendBeacon", {
  value: jest.fn(),
  writable: true,
});
