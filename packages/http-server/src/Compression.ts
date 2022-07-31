import type {LayerOptions} from "./Layer";
import Layer from "./Layer";

export interface CompressionOptions extends LayerOptions {
  filter: Function;
}

class Compression extends Layer {

}

export default Compression;