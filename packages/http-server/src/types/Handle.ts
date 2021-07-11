import type Request from "./Request.js";
import type Response from "./Response.js";

type Handle<Req extends Request = Request, Res extends Response = Response> = (req: Req, res: Res) => Promise<void> | void;

export default Handle;