import type Transport from "./types/Transport.js";
import type Message from "./types/Message.js";

export interface BeaconTransportOptions {
  url: URL;
}

class BeaconTransport implements Transport {
  private readonly url: string;

  public constructor({url}: BeaconTransportOptions) {
    this.url = url.toString();
  }

  public send(message: Message): void {
    navigator.sendBeacon(this.url, JSON.stringify(message));
  }
}

export default BeaconTransport;