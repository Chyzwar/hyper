import type Abstract from "./Abstract";
import type Constructor from "./Constructor";

type Class<T> = Abstract<T> | Constructor<T>;

export default Class;
