import { ITestAdapter } from "../src/CoreTypes";
import { I } from "./Calculator.test.types";

export const adapter: ITestAdapter<I> = {
  beforeAll: async (input, testResource) => {
    return input;
  },
  beforeEach: async (subject, initializer, testResource, initialValues) => {
    const result = await initializer();
    return result;
  },
  andWhen: async (store, whenCB, testResource) => {
    const transform = whenCB;
    const result = transform(store);
    return result;
  },
  butThen: async (store, thenCB, testResource) => {
    thenCB(store);

    const display = store.getDisplay();

    return display;
  },
  afterEach: async (store, key) => {
    return store;
  },
  afterAll: async (store) => {
    const root = await navigator.storage.getDirectory();

    // 1. Create (or get) a file handle
    const fileHandle = await root.getFileHandle("data.txt", { create: true });

    // 2. Create a writable stream
    const writable = await fileHandle.createWritable();

    // 3. Write data (strings, Blobs, or ArrayBuffers)
    await writable.write("Hello from OPFS 2026!");

    // 4. Close the stream to save changes
    await writable.close();

    return store;
  },
  assertThis: (actual: string) => {
    return actual;
  },
};
