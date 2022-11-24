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
    arg0: Klass,
    /* @ts-ignore:next-line */
    ...arg1: IThens[IThen]
  ) => any;
};

export type ISimpleThens<T, Klass> = {
  [K in keyof T]: (k: Klass, ...any) => void;
};
