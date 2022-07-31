import type Message from "./Message";

interface Transport {
  send: (message: Message) => void;
}

export default Transport;