/* eslint-disable @typescript-eslint/class-methods-use-this */
import type Transport from "./types/Transport.js";
import type Message from "./types/Message.js";

class ConsoleTransport implements Transport {
  public send(message: Message): void {
    console.log(message);
  }
}

export default ConsoleTransport;