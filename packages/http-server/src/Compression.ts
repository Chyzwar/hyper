import type {LayerOptions} from "./Layer.js";
import Layer from "./Layer.js";

export interface CompressionOptions extends LayerOptions {
  filter: Function;
}

class Compression extends Layer {

}

export default Compression;