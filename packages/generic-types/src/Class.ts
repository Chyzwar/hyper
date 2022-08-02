import type Abstract from "./Abstract.js";
import type Constructor from "./Constructor.js";

type Class<T> = Abstract<T> | Constructor<T>;

export default Class;
