import type Http1Response from "../response/Http1Response.js";
import type Http2Response from "../response/Http2Response.js";

type Response<B = unknown> = Http1Response<B> | Http2Response<B>;

export default Response;