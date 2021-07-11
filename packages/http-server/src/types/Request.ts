import type Http1Request from "../request/Http1Request.js";
import type Http2Request from "../request/Http2Request.js";

type Request<B = unknown> = Http1Request<B> | Http2Request<B>;

export default Request;