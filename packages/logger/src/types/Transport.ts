import type Message from "./Message.js";

interface Transport {
  send: (message: Message) => void;
}

export default Transport;