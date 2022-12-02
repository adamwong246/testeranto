export type ISimpleSuites<ISuites> = {
  [ISuite in keyof ISuites]: string;
};

export type ISimpleGivens<IGivens, Klass> = {
  [IGiven in keyof IGivens]: (
    /* @ts-ignore:next-line */
    ...arg0: IGivens[IGiven]
  ) => Klass;
};

export type ISimpleWhens<IThens, Klass> = {
  [IThen in keyof IThens]: (
    argz: Klass,
    /* @ts-ignore:next-line */
    ...argzz: IThens[IThen]
  ) => any;
};

export type ITypeDeTuple<T, Klass> = {
  /* @ts-ignore:next-line */
  [K in keyof T]: (k: Klass, ...any: T[K]) => void;
};
