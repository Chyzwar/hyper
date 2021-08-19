import {HttpClient} from "@hyper/http-client";
import type Transport from "./types/Transport.js";
import type Message from "./types/Message.js";


export interface HttpTransportOptions {
  url: URL;
  path: string;
}

class HttpTransport implements Transport {
  private readonly path: string;

  private readonly client: HttpClient;

  public constructor({url, path = "/"}: HttpTransportOptions) {
    this.path = path;
    this.client = new HttpClient(url);
  }

  public send(body: Message): void {
    void this.client.post(this.path, {body});
  }
}

export default HttpTransport;