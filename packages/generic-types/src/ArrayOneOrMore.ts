
type ArrayOneOrMore<T> = T[] & {
  0: T;
};

export default ArrayOneOrMore;
