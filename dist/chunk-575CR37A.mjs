import { createRequire } from 'module';const require = createRequire(import.meta.url);

// node_modules/puppeteer-core/lib/esm/third_party/mitt/index.js
function mitt(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i ? i.push(e) : n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
  }, emit: function(t, e) {
    var i = n.get(t);
    i && i.slice().map(function(n2) {
      n2(e);
    }), (i = n.get("*")) && i.slice().map(function(n2) {
      n2(t, e);
    });
  } };
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/EventEmitter.js
var EventEmitter = class {
  /**
   * @internal
   */
  constructor() {
    this.eventsMap = /* @__PURE__ */ new Map();
    this.emitter = mitt(this.eventsMap);
  }
  /**
   * Bind an event listener to fire when an event occurs.
   * @param event - the event type you'd like to listen to. Can be a string or symbol.
   * @param handler - the function to be called when the event occurs.
   * @returns `this` to enable you to chain method calls.
   */
  on(event, handler) {
    this.emitter.on(event, handler);
    return this;
  }
  /**
   * Remove an event listener from firing.
   * @param event - the event type you'd like to stop listening to.
   * @param handler - the function that should be removed.
   * @returns `this` to enable you to chain method calls.
   */
  off(event, handler) {
    this.emitter.off(event, handler);
    return this;
  }
  /**
   * Remove an event listener.
   * @deprecated please use {@link EventEmitter.off} instead.
   */
  removeListener(event, handler) {
    this.off(event, handler);
    return this;
  }
  /**
   * Add an event listener.
   * @deprecated please use {@link EventEmitter.on} instead.
   */
  addListener(event, handler) {
    this.on(event, handler);
    return this;
  }
  /**
   * Emit an event and call any associated listeners.
   *
   * @param event - the event you'd like to emit
   * @param eventData - any data you'd like to emit with the event
   * @returns `true` if there are any listeners, `false` if there are not.
   */
  emit(event, eventData) {
    this.emitter.emit(event, eventData);
    return this.eventListenersCount(event) > 0;
  }
  /**
   * Like `on` but the listener will only be fired once and then it will be removed.
   * @param event - the event you'd like to listen to
   * @param handler - the handler function to run when the event occurs
   * @returns `this` to enable you to chain method calls.
   */
  once(event, handler) {
    const onceHandler = (eventData) => {
      handler(eventData);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }
  /**
   * Gets the number of listeners for a given event.
   *
   * @param event - the event to get the listener count for
   * @returns the number of listeners bound to the given event
   */
  listenerCount(event) {
    return this.eventListenersCount(event);
  }
  /**
   * Removes all listeners. If given an event argument, it will remove only
   * listeners for that event.
   * @param event - the event to remove listeners for.
   * @returns `this` to enable you to chain method calls.
   */
  removeAllListeners(event) {
    if (event) {
      this.eventsMap.delete(event);
    } else {
      this.eventsMap.clear();
    }
    return this;
  }
  eventListenersCount(event) {
    var _a2;
    return ((_a2 = this.eventsMap.get(event)) === null || _a2 === void 0 ? void 0 : _a2.length) || 0;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Browser.js
var WEB_PERMISSION_TO_PROTOCOL_PERMISSION = /* @__PURE__ */ new Map([
  ["geolocation", "geolocation"],
  ["midi", "midi"],
  ["notifications", "notifications"],
  // TODO: push isn't a valid type?
  // ['push', 'push'],
  ["camera", "videoCapture"],
  ["microphone", "audioCapture"],
  ["background-sync", "backgroundSync"],
  ["ambient-light-sensor", "sensors"],
  ["accelerometer", "sensors"],
  ["gyroscope", "sensors"],
  ["magnetometer", "sensors"],
  ["accessibility-events", "accessibilityEvents"],
  ["clipboard-read", "clipboardReadWrite"],
  ["clipboard-write", "clipboardReadWrite"],
  ["payment-handler", "paymentHandler"],
  ["persistent-storage", "durableStorage"],
  ["idle-detection", "idleDetection"],
  // chrome-specific permissions we have.
  ["midi-sysex", "midiSysex"]
]);
var Browser = class extends EventEmitter {
  /**
   * @internal
   */
  constructor() {
    super();
  }
  /**
   * @internal
   */
  _attach() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  _detach() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  get _targets() {
    throw new Error("Not implemented");
  }
  /**
   * The spawned browser process. Returns `null` if the browser instance was created with
   * {@link Puppeteer.connect}.
   */
  process() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  _getIsPageTargetCallback() {
    throw new Error("Not implemented");
  }
  createIncognitoBrowserContext() {
    throw new Error("Not implemented");
  }
  /**
   * Returns an array of all open browser contexts. In a newly created browser, this will
   * return a single instance of {@link BrowserContext}.
   */
  browserContexts() {
    throw new Error("Not implemented");
  }
  /**
   * Returns the default browser context. The default browser context cannot be closed.
   */
  defaultBrowserContext() {
    throw new Error("Not implemented");
  }
  _disposeContext() {
    throw new Error("Not implemented");
  }
  /**
   * The browser websocket endpoint which can be used as an argument to
   * {@link Puppeteer.connect}.
   *
   * @returns The Browser websocket url.
   *
   * @remarks
   *
   * The format is `ws://${host}:${port}/devtools/browser/<id>`.
   *
   * You can find the `webSocketDebuggerUrl` from `http://${host}:${port}/json/version`.
   * Learn more about the
   * {@link https://chromedevtools.github.io/devtools-protocol | devtools protocol} and
   * the {@link
   * https://chromedevtools.github.io/devtools-protocol/#how-do-i-access-the-browser-target
   * | browser endpoint}.
   */
  wsEndpoint() {
    throw new Error("Not implemented");
  }
  /**
   * Promise which resolves to a new {@link Page} object. The Page is created in
   * a default browser context.
   */
  newPage() {
    throw new Error("Not implemented");
  }
  _createPageInContext() {
    throw new Error("Not implemented");
  }
  /**
   * All active targets inside the Browser. In case of multiple browser contexts, returns
   * an array with all the targets in all browser contexts.
   */
  targets() {
    throw new Error("Not implemented");
  }
  /**
   * The target associated with the browser.
   */
  target() {
    throw new Error("Not implemented");
  }
  waitForTarget() {
    throw new Error("Not implemented");
  }
  /**
   * An array of all open pages inside the Browser.
   *
   * @remarks
   *
   * In case of multiple browser contexts, returns an array with all the pages in all
   * browser contexts. Non-visible pages, such as `"background_page"`, will not be listed
   * here. You can find them using {@link Target.page}.
   */
  pages() {
    throw new Error("Not implemented");
  }
  /**
   * A string representing the browser name and version.
   *
   * @remarks
   *
   * For headless Chromium, this is similar to `HeadlessChrome/61.0.3153.0`. For
   * non-headless, this is similar to `Chrome/61.0.3153.0`.
   *
   * The format of browser.version() might change with future releases of Chromium.
   */
  version() {
    throw new Error("Not implemented");
  }
  /**
   * The browser's original user agent. Pages can override the browser user agent with
   * {@link Page.setUserAgent}.
   */
  userAgent() {
    throw new Error("Not implemented");
  }
  /**
   * Closes Chromium and all of its pages (if any were opened). The {@link Browser} object
   * itself is considered to be disposed and cannot be used anymore.
   */
  close() {
    throw new Error("Not implemented");
  }
  /**
   * Disconnects Puppeteer from the browser, but leaves the Chromium process running.
   * After calling `disconnect`, the {@link Browser} object is considered disposed and
   * cannot be used anymore.
   */
  disconnect() {
    throw new Error("Not implemented");
  }
  /**
   * Indicates that the browser is connected.
   */
  isConnected() {
    throw new Error("Not implemented");
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/BrowserContext.js
var BrowserContext = class extends EventEmitter {
  /**
   * @internal
   */
  constructor() {
    super();
  }
  /**
   * An array of all active targets inside the browser context.
   */
  targets() {
    throw new Error("Not implemented");
  }
  waitForTarget() {
    throw new Error("Not implemented");
  }
  /**
   * An array of all pages inside the browser context.
   *
   * @returns Promise which resolves to an array of all open pages.
   * Non visible pages, such as `"background_page"`, will not be listed here.
   * You can find them using {@link Target.page | the target page}.
   */
  pages() {
    throw new Error("Not implemented");
  }
  /**
   * Returns whether BrowserContext is incognito.
   * The default browser context is the only non-incognito browser context.
   *
   * @remarks
   * The default browser context cannot be closed.
   */
  isIncognito() {
    throw new Error("Not implemented");
  }
  overridePermissions() {
    throw new Error("Not implemented");
  }
  /**
   * Clears all permission overrides for the browser context.
   *
   * @example
   *
   * ```ts
   * const context = browser.defaultBrowserContext();
   * context.overridePermissions('https://example.com', ['clipboard-read']);
   * // do stuff ..
   * context.clearPermissionOverrides();
   * ```
   */
  clearPermissionOverrides() {
    throw new Error("Not implemented");
  }
  /**
   * Creates a new page in the browser context.
   */
  newPage() {
    throw new Error("Not implemented");
  }
  /**
   * The browser this browser context belongs to.
   */
  browser() {
    throw new Error("Not implemented");
  }
  /**
   * Closes the browser context. All the targets that belong to the browser context
   * will be closed.
   *
   * @remarks
   * Only incognito browser contexts can be closed.
   */
  close() {
    throw new Error("Not implemented");
  }
  get id() {
    return void 0;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/ErrorLike.js
function isErrorLike(obj) {
  return typeof obj === "object" && obj !== null && "name" in obj && "message" in obj;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/environment.js
var isNode = !!(typeof process !== "undefined" && process.version);
var DEFERRED_PROMISE_DEBUG_TIMEOUT = typeof process !== "undefined" && typeof process.env["PUPPETEER_DEFERRED_PROMISE_DEBUG_TIMEOUT"] !== "undefined" ? Number(process.env["PUPPETEER_DEFERRED_PROMISE_DEBUG_TIMEOUT"]) : -1;

// node_modules/puppeteer-core/lib/esm/puppeteer/common/Debug.js
var debugModule = null;
async function importDebug() {
  if (!debugModule) {
    debugModule = (await import("./src-TPQSFGKX.mjs")).default;
  }
  return debugModule;
}
var debug = (prefix) => {
  if (isNode) {
    return async (...logArgs) => {
      if (captureLogs) {
        capturedLogs.push(prefix + logArgs);
      }
      (await importDebug())(prefix)(logArgs);
    };
  }
  return (...logArgs) => {
    const debugLevel = globalThis.__PUPPETEER_DEBUG;
    if (!debugLevel) {
      return;
    }
    const everythingShouldBeLogged = debugLevel === "*";
    const prefixMatchesDebugLevel = everythingShouldBeLogged || /**
     * If the debug level is `foo*`, that means we match any prefix that
     * starts with `foo`. If the level is `foo`, we match only the prefix
     * `foo`.
     */
    (debugLevel.endsWith("*") ? prefix.startsWith(debugLevel) : prefix === debugLevel);
    if (!prefixMatchesDebugLevel) {
      return;
    }
    console.log(`${prefix}:`, ...logArgs);
  };
};
var capturedLogs = [];
var captureLogs = false;

// node_modules/puppeteer-core/lib/esm/puppeteer/util/assert.js
var assert = (value, message) => {
  if (!value) {
    throw new Error(message);
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/JSHandle.js
var JSHandle = class {
  /**
   * @internal
   */
  constructor() {
  }
  /**
   * @internal
   */
  get disposed() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  executionContext() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  get client() {
    throw new Error("Not implemented");
  }
  async evaluate() {
    throw new Error("Not implemented");
  }
  async evaluateHandle() {
    throw new Error("Not implemented");
  }
  async getProperty() {
    throw new Error("Not implemented");
  }
  /**
   * Gets a map of handles representing the properties of the current handle.
   *
   * @example
   *
   * ```ts
   * const listHandle = await page.evaluateHandle(() => document.body.children);
   * const properties = await listHandle.getProperties();
   * const children = [];
   * for (const property of properties.values()) {
   *   const element = property.asElement();
   *   if (element) {
   *     children.push(element);
   *   }
   * }
   * children; // holds elementHandles to all children of document.body
   * ```
   */
  async getProperties() {
    throw new Error("Not implemented");
  }
  /**
   * A vanilla object representing the serializable portions of the
   * referenced object.
   * @throws Throws if the object cannot be serialized due to circularity.
   *
   * @remarks
   * If the object has a `toJSON` function, it **will not** be called.
   */
  async jsonValue() {
    throw new Error("Not implemented");
  }
  /**
   * Either `null` or the handle itself if the handle is an
   * instance of {@link ElementHandle}.
   */
  asElement() {
    throw new Error("Not implemented");
  }
  /**
   * Releases the object referenced by the handle for garbage collection.
   */
  async dispose() {
    throw new Error("Not implemented");
  }
  /**
   * Returns a string representation of the JSHandle.
   *
   * @remarks
   * Useful during debugging.
   */
  toString() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  get id() {
    throw new Error("Not implemented");
  }
  /**
   * Provides access to the
   * [Protocol.Runtime.RemoteObject](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObject)
   * backing this handle.
   */
  remoteObject() {
    throw new Error("Not implemented");
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/ElementHandle.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ElementHandle_instances;
var _ElementHandle_asSVGElementHandle;
var _ElementHandle_getOwnerSVGElement;
var ElementHandle = class extends JSHandle {
  /**
   * @internal
   */
  constructor(handle) {
    super();
    _ElementHandle_instances.add(this);
    this.handle = handle;
  }
  /**
   * @internal
   */
  get id() {
    return this.handle.id;
  }
  /**
   * @internal
   */
  get disposed() {
    return this.handle.disposed;
  }
  async getProperty(propertyName) {
    return this.handle.getProperty(propertyName);
  }
  /**
   * @internal
   */
  async getProperties() {
    return this.handle.getProperties();
  }
  /**
   * @internal
   */
  async evaluate(pageFunction, ...args) {
    return this.handle.evaluate(pageFunction, ...args);
  }
  /**
   * @internal
   */
  evaluateHandle(pageFunction, ...args) {
    return this.handle.evaluateHandle(pageFunction, ...args);
  }
  /**
   * @internal
   */
  async jsonValue() {
    return this.handle.jsonValue();
  }
  /**
   * @internal
   */
  toString() {
    return this.handle.toString();
  }
  /**
   * @internal
   */
  async dispose() {
    return await this.handle.dispose();
  }
  asElement() {
    return this;
  }
  /**
   * @internal
   */
  executionContext() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  get client() {
    throw new Error("Not implemented");
  }
  get frame() {
    throw new Error("Not implemented");
  }
  async $() {
    throw new Error("Not implemented");
  }
  async $$() {
    throw new Error("Not implemented");
  }
  async $eval() {
    throw new Error("Not implemented");
  }
  async $$eval() {
    throw new Error("Not implemented");
  }
  async $x() {
    throw new Error("Not implemented");
  }
  async waitForSelector() {
    throw new Error("Not implemented");
  }
  /**
   * Checks if an element is visible using the same mechanism as
   * {@link ElementHandle.waitForSelector}.
   */
  async isVisible() {
    throw new Error("Not implemented.");
  }
  /**
   * Checks if an element is hidden using the same mechanism as
   * {@link ElementHandle.waitForSelector}.
   */
  async isHidden() {
    throw new Error("Not implemented.");
  }
  async waitForXPath() {
    throw new Error("Not implemented");
  }
  async toElement() {
    throw new Error("Not implemented");
  }
  /**
   * Resolves to the content frame for element handles referencing
   * iframe nodes, or null otherwise
   */
  async contentFrame() {
    throw new Error("Not implemented");
  }
  async clickablePoint() {
    throw new Error("Not implemented");
  }
  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page} to hover over the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async hover() {
    throw new Error("Not implemented");
  }
  async click() {
    throw new Error("Not implemented");
  }
  async drag() {
    throw new Error("Not implemented");
  }
  async dragEnter() {
    throw new Error("Not implemented");
  }
  async dragOver() {
    throw new Error("Not implemented");
  }
  async drop() {
    throw new Error("Not implemented");
  }
  async dragAndDrop() {
    throw new Error("Not implemented");
  }
  async select() {
    throw new Error("Not implemented");
  }
  async uploadFile() {
    throw new Error("Not implemented");
  }
  /**
   * This method scrolls element into view if needed, and then uses
   * {@link Touchscreen.tap} to tap in the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async tap() {
    throw new Error("Not implemented");
  }
  async touchStart() {
    throw new Error("Not implemented");
  }
  async touchMove() {
    throw new Error("Not implemented");
  }
  async touchEnd() {
    throw new Error("Not implemented");
  }
  /**
   * Calls {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus | focus} on the element.
   */
  async focus() {
    throw new Error("Not implemented");
  }
  async type() {
    throw new Error("Not implemented");
  }
  async press() {
    throw new Error("Not implemented");
  }
  /**
   * This method returns the bounding box of the element (relative to the main frame),
   * or `null` if the element is not visible.
   */
  async boundingBox() {
    throw new Error("Not implemented");
  }
  /**
   * This method returns boxes of the element, or `null` if the element is not visible.
   *
   * @remarks
   *
   * Boxes are represented as an array of points;
   * Each Point is an object `{x, y}`. Box points are sorted clock-wise.
   */
  async boxModel() {
    throw new Error("Not implemented");
  }
  async screenshot() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  async assertConnectedElement() {
    const error = await this.evaluate(async (element) => {
      if (!element.isConnected) {
        return "Node is detached from document";
      }
      if (element.nodeType !== Node.ELEMENT_NODE) {
        return "Node is not of type HTMLElement";
      }
      return;
    });
    if (error) {
      throw new Error(error);
    }
  }
  /**
   * Resolves to true if the element is visible in the current viewport. If an
   * element is an SVG, we check if the svg owner element is in the viewport
   * instead. See https://crbug.com/963246.
   *
   * @param options - Threshold for the intersection between 0 (no intersection) and 1
   * (full intersection). Defaults to 1.
   */
  async isIntersectingViewport(options) {
    await this.assertConnectedElement();
    const { threshold = 0 } = options !== null && options !== void 0 ? options : {};
    const svgHandle = await __classPrivateFieldGet(this, _ElementHandle_instances, "m", _ElementHandle_asSVGElementHandle).call(this, this);
    const intersectionTarget = svgHandle ? await __classPrivateFieldGet(this, _ElementHandle_instances, "m", _ElementHandle_getOwnerSVGElement).call(this, svgHandle) : this;
    try {
      return await intersectionTarget.evaluate(async (element, threshold2) => {
        const visibleRatio = await new Promise((resolve) => {
          const observer = new IntersectionObserver((entries) => {
            resolve(entries[0].intersectionRatio);
            observer.disconnect();
          });
          observer.observe(element);
        });
        return threshold2 === 1 ? visibleRatio === 1 : visibleRatio > threshold2;
      }, threshold);
    } finally {
      if (intersectionTarget !== this) {
        await intersectionTarget.dispose();
      }
    }
  }
  /**
   * Scrolls the element into view using either the automation protocol client
   * or by calling element.scrollIntoView.
   */
  async scrollIntoView() {
    throw new Error("Not implemented");
  }
};
_ElementHandle_instances = /* @__PURE__ */ new WeakSet(), _ElementHandle_asSVGElementHandle = /**
 * Returns true if an element is an SVGElement (included svg, path, rect
 * etc.).
 */
async function _ElementHandle_asSVGElementHandle2(handle) {
  if (await handle.evaluate((element) => {
    return element instanceof SVGElement;
  })) {
    return handle;
  } else {
    return null;
  }
}, _ElementHandle_getOwnerSVGElement = async function _ElementHandle_getOwnerSVGElement2(handle) {
  return await handle.evaluateHandle((element) => {
    if (element instanceof SVGSVGElement) {
      return element;
    }
    return element.ownerSVGElement;
  });
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/AsyncIterableUtil.js
var AsyncIterableUtil = class {
  static async *map(iterable, map) {
    for await (const value of iterable) {
      yield await map(value);
    }
  }
  static async *flatMap(iterable, map) {
    for await (const value of iterable) {
      yield* map(value);
    }
  }
  static async collect(iterable) {
    const result = [];
    for await (const value of iterable) {
      result.push(value);
    }
    return result;
  }
  static async first(iterable) {
    for await (const value of iterable) {
      return value;
    }
    return;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/Function.js
var createdFunctions = /* @__PURE__ */ new Map();
var createFunction = (functionValue) => {
  let fn = createdFunctions.get(functionValue);
  if (fn) {
    return fn;
  }
  fn = new Function(`return ${functionValue}`)();
  createdFunctions.set(functionValue, fn);
  return fn;
};
function stringifyFunction(fn) {
  let value = fn.toString();
  try {
    new Function(`(${value})`);
  } catch {
    let prefix = "function ";
    if (value.startsWith("async ")) {
      prefix = `async ${prefix}`;
      value = value.substring("async ".length);
    }
    value = `${prefix}${value}`;
    try {
      new Function(`(${value})`);
    } catch {
      throw new Error("Passed function cannot be serialized!");
    }
  }
  return value;
}
var interpolateFunction = (fn, replacements) => {
  let value = stringifyFunction(fn);
  for (const [name, jsValue] of Object.entries(replacements)) {
    value = value.replace(new RegExp(`PLACEHOLDER\\(\\s*(?:'${name}'|"${name}")\\s*\\)`, "g"), jsValue);
  }
  return createFunction(value);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/Errors.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet2 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ProtocolError_code;
var _ProtocolError_originalMessage;
var CustomError = class extends Error {
  /**
   * @internal
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};
var TimeoutError = class extends CustomError {
};
var AbortError = class extends CustomError {
};
var ProtocolError = class extends CustomError {
  constructor() {
    super(...arguments);
    _ProtocolError_code.set(this, void 0);
    _ProtocolError_originalMessage.set(this, "");
  }
  set code(code) {
    __classPrivateFieldSet(this, _ProtocolError_code, code, "f");
  }
  /**
   * @readonly
   * @public
   */
  get code() {
    return __classPrivateFieldGet2(this, _ProtocolError_code, "f");
  }
  set originalMessage(originalMessage) {
    __classPrivateFieldSet(this, _ProtocolError_originalMessage, originalMessage, "f");
  }
  /**
   * @readonly
   * @public
   */
  get originalMessage() {
    return __classPrivateFieldGet2(this, _ProtocolError_originalMessage, "f");
  }
};
_ProtocolError_code = /* @__PURE__ */ new WeakMap(), _ProtocolError_originalMessage = /* @__PURE__ */ new WeakMap();
var errors = Object.freeze({
  TimeoutError,
  ProtocolError
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/HandleIterator.js
var DEFAULT_BATCH_SIZE = 20;
async function* fastTransposeIteratorHandle(iterator, size) {
  const array = await iterator.evaluateHandle(async (iterator2, size2) => {
    const results = [];
    while (results.length < size2) {
      const result = await iterator2.next();
      if (result.done) {
        break;
      }
      results.push(result.value);
    }
    return results;
  }, size);
  const properties = await array.getProperties();
  await array.dispose();
  yield* properties.values();
  return properties.size === 0;
}
async function* transposeIteratorHandle(iterator) {
  let size = DEFAULT_BATCH_SIZE;
  try {
    while (!(yield* fastTransposeIteratorHandle(iterator, size))) {
      size <<= 1;
    }
  } finally {
    await iterator.dispose();
  }
}
async function* transposeIterableHandle(handle) {
  yield* transposeIteratorHandle(await handle.evaluateHandle((iterable) => {
    return async function* () {
      yield* iterable;
    }();
  }));
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/IsolatedWorlds.js
var MAIN_WORLD = Symbol("mainWorld");
var PUPPETEER_WORLD = Symbol("puppeteerWorld");

// node_modules/puppeteer-core/lib/esm/puppeteer/common/LazyArg.js
var __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet3 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LazyArg_get;
var LazyArg = class {
  constructor(get) {
    _LazyArg_get.set(this, void 0);
    __classPrivateFieldSet2(this, _LazyArg_get, get, "f");
  }
  async get(context) {
    return __classPrivateFieldGet3(this, _LazyArg_get, "f").call(this, context);
  }
};
_LazyArg_get = /* @__PURE__ */ new WeakMap();
LazyArg.create = (get) => {
  return new LazyArg(get);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/QueryHandler.js
var QueryHandler = class {
  static get _querySelector() {
    if (this.querySelector) {
      return this.querySelector;
    }
    if (!this.querySelectorAll) {
      throw new Error("Cannot create default `querySelector`.");
    }
    return this.querySelector = interpolateFunction(async (node, selector, PuppeteerUtil) => {
      const querySelectorAll = PLACEHOLDER("querySelectorAll");
      const results = querySelectorAll(node, selector, PuppeteerUtil);
      for await (const result of results) {
        return result;
      }
      return null;
    }, {
      querySelectorAll: stringifyFunction(this.querySelectorAll)
    });
  }
  static get _querySelectorAll() {
    if (this.querySelectorAll) {
      return this.querySelectorAll;
    }
    if (!this.querySelector) {
      throw new Error("Cannot create default `querySelectorAll`.");
    }
    return this.querySelectorAll = interpolateFunction(async function* (node, selector, PuppeteerUtil) {
      const querySelector = PLACEHOLDER("querySelector");
      const result = await querySelector(node, selector, PuppeteerUtil);
      if (result) {
        yield result;
      }
    }, {
      querySelector: stringifyFunction(this.querySelector)
    });
  }
  /**
   * Queries for multiple nodes given a selector and {@link ElementHandle}.
   *
   * Akin to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll()}.
   */
  static async *queryAll(element, selector) {
    const world = element.executionContext()._world;
    assert(world);
    const handle = await element.evaluateHandle(this._querySelectorAll, selector, LazyArg.create((context) => {
      return context.puppeteerUtil;
    }));
    yield* transposeIterableHandle(handle);
  }
  /**
   * Queries for a single node given a selector and {@link ElementHandle}.
   *
   * Akin to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector}.
   */
  static async queryOne(element, selector) {
    const world = element.executionContext()._world;
    assert(world);
    const result = await element.evaluateHandle(this._querySelector, selector, LazyArg.create((context) => {
      return context.puppeteerUtil;
    }));
    if (!(result instanceof ElementHandle)) {
      await result.dispose();
      return null;
    }
    return result;
  }
  /**
   * Waits until a single node appears for a given selector and
   * {@link ElementHandle}.
   *
   * This will always query the handle in the Puppeteer world and migrate the
   * result to the main world.
   */
  static async waitFor(elementOrFrame, selector, options) {
    let frame;
    let element;
    if (!(elementOrFrame instanceof ElementHandle)) {
      frame = elementOrFrame;
    } else {
      frame = elementOrFrame.frame;
      element = await frame.worlds[PUPPETEER_WORLD].adoptHandle(elementOrFrame);
    }
    const { visible = false, hidden = false, timeout, signal } = options;
    try {
      if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        throw new AbortError("QueryHander.waitFor has been aborted.");
      }
      const handle = await frame.worlds[PUPPETEER_WORLD].waitForFunction(async (PuppeteerUtil, query, selector2, root, visible2) => {
        const querySelector = PuppeteerUtil.createFunction(query);
        const node = await querySelector(root !== null && root !== void 0 ? root : document, selector2, PuppeteerUtil);
        return PuppeteerUtil.checkVisibility(node, visible2);
      }, {
        polling: visible || hidden ? "raf" : "mutation",
        root: element,
        timeout,
        signal
      }, LazyArg.create((context) => {
        return context.puppeteerUtil;
      }), stringifyFunction(this._querySelector), selector, element, visible ? true : hidden ? false : void 0);
      if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        await handle.dispose();
        throw new AbortError("QueryHander.waitFor has been aborted.");
      }
      if (!(handle instanceof ElementHandle)) {
        await handle.dispose();
        return null;
      }
      return frame.worlds[MAIN_WORLD].transferHandle(handle);
    } catch (error) {
      if (!isErrorLike(error)) {
        throw error;
      }
      error.message = `Waiting for selector \`${selector}\` failed: ${error.message}`;
      throw error;
    } finally {
      if (element) {
        await element.dispose();
      }
    }
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/AriaQueryHandler.js
var _a;
var queryAXTree = async (client, element, accessibleName, role) => {
  const { nodes } = await client.send("Accessibility.queryAXTree", {
    objectId: element.id,
    accessibleName,
    role
  });
  return nodes.filter((node) => {
    return !node.role || node.role.value !== "StaticText";
  });
};
var KNOWN_ATTRIBUTES = Object.freeze(["name", "role"]);
var isKnownAttribute = (attribute) => {
  return KNOWN_ATTRIBUTES.includes(attribute);
};
var normalizeValue = (value) => {
  return value.replace(/ +/g, " ").trim();
};
var ATTRIBUTE_REGEXP = /\[\s*(?<attribute>\w+)\s*=\s*(?<quote>"|')(?<value>\\.|.*?(?=\k<quote>))\k<quote>\s*\]/g;
var parseARIASelector = (selector) => {
  const queryOptions = {};
  const defaultName = selector.replace(ATTRIBUTE_REGEXP, (_, attribute, __, value) => {
    attribute = attribute.trim();
    assert(isKnownAttribute(attribute), `Unknown aria attribute "${attribute}" in selector`);
    queryOptions[attribute] = normalizeValue(value);
    return "";
  });
  if (defaultName && !queryOptions.name) {
    queryOptions.name = normalizeValue(defaultName);
  }
  return queryOptions;
};
var ARIAQueryHandler = class extends QueryHandler {
  static async *queryAll(element, selector) {
    const context = element.executionContext();
    const { name, role } = parseARIASelector(selector);
    const results = await queryAXTree(context._client, element, name, role);
    const world = context._world;
    yield* AsyncIterableUtil.map(results, (node) => {
      return world.adoptBackendNode(node.backendDOMNodeId);
    });
  }
};
_a = ARIAQueryHandler;
ARIAQueryHandler.querySelector = async (node, selector, { ariaQuerySelector }) => {
  return ariaQuerySelector(node, selector);
};
ARIAQueryHandler.queryOne = async (element, selector) => {
  var _b;
  return (_b = await AsyncIterableUtil.first(_a.queryAll(element, selector))) !== null && _b !== void 0 ? _b : null;
};

// node_modules/puppeteer-core/lib/esm/puppeteer/generated/injected.js
var source = '"use strict";var C=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var u=(e,t)=>{for(var n in t)C(e,n,{get:t[n],enumerable:!0})},ie=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of oe(t))!se.call(e,o)&&o!==n&&C(e,o,{get:()=>t[o],enumerable:!(r=ne(t,o))||r.enumerable});return e};var le=e=>ie(C({},"__esModule",{value:!0}),e);var Oe={};u(Oe,{default:()=>Re});module.exports=le(Oe);var P=class extends Error{constructor(t){super(t),this.name=this.constructor.name,Error.captureStackTrace(this,this.constructor)}},S=class extends P{};var I=class extends P{#e;#r="";set code(t){this.#e=t}get code(){return this.#e}set originalMessage(t){this.#r=t}get originalMessage(){return this.#r}},De=Object.freeze({TimeoutError:S,ProtocolError:I});function p(e){let t=!1,n=!1,r,o,i=new Promise((l,a)=>{r=l,o=a}),s=e&&e.timeout>0?setTimeout(()=>{n=!0,o(new S(e.message))},e.timeout):void 0;return Object.assign(i,{resolved:()=>t,finished:()=>t||n,resolve:l=>{s&&clearTimeout(s),t=!0,r(l)},reject:l=>{clearTimeout(s),n=!0,o(l)}})}var G=new Map,X=e=>{let t=G.get(e);return t||(t=new Function(`return ${e}`)(),G.set(e,t),t)};var R={};u(R,{ariaQuerySelector:()=>ae,ariaQuerySelectorAll:()=>k});var ae=(e,t)=>window.__ariaQuerySelector(e,t),k=async function*(e,t){yield*await window.__ariaQuerySelectorAll(e,t)};var D={};u(D,{customQuerySelectors:()=>_});var O=class{#e=new Map;register(t,n){if(!n.queryOne&&n.queryAll){let r=n.queryAll;n.queryOne=(o,i)=>{for(let s of r(o,i))return s;return null}}else if(n.queryOne&&!n.queryAll){let r=n.queryOne;n.queryAll=(o,i)=>{let s=r(o,i);return s?[s]:[]}}else if(!n.queryOne||!n.queryAll)throw new Error("At least one query method must be defined.");this.#e.set(t,{querySelector:n.queryOne,querySelectorAll:n.queryAll})}unregister(t){this.#e.delete(t)}get(t){return this.#e.get(t)}clear(){this.#e.clear()}},_=new O;var M={};u(M,{pierceQuerySelector:()=>ce,pierceQuerySelectorAll:()=>ue});var ce=(e,t)=>{let n=null,r=o=>{let i=document.createTreeWalker(o,NodeFilter.SHOW_ELEMENT);do{let s=i.currentNode;s.shadowRoot&&r(s.shadowRoot),!(s instanceof ShadowRoot)&&s!==o&&!n&&s.matches(t)&&(n=s)}while(!n&&i.nextNode())};return e instanceof Document&&(e=e.documentElement),r(e),n},ue=(e,t)=>{let n=[],r=o=>{let i=document.createTreeWalker(o,NodeFilter.SHOW_ELEMENT);do{let s=i.currentNode;s.shadowRoot&&r(s.shadowRoot),!(s instanceof ShadowRoot)&&s!==o&&s.matches(t)&&n.push(s)}while(i.nextNode())};return e instanceof Document&&(e=e.documentElement),r(e),n};var m=(e,t)=>{if(!e)throw new Error(t)};var T=class{#e;#r;#n;#t;constructor(t,n){this.#e=t,this.#r=n}async start(){let t=this.#t=p(),n=await this.#e();if(n){t.resolve(n);return}this.#n=new MutationObserver(async()=>{let r=await this.#e();r&&(t.resolve(r),await this.stop())}),this.#n.observe(this.#r,{childList:!0,subtree:!0,attributes:!0})}async stop(){m(this.#t,"Polling never started."),this.#t.finished()||this.#t.reject(new Error("Polling stopped")),this.#n&&(this.#n.disconnect(),this.#n=void 0)}result(){return m(this.#t,"Polling never started."),this.#t}},x=class{#e;#r;constructor(t){this.#e=t}async start(){let t=this.#r=p(),n=await this.#e();if(n){t.resolve(n);return}let r=async()=>{if(t.finished())return;let o=await this.#e();if(!o){window.requestAnimationFrame(r);return}t.resolve(o),await this.stop()};window.requestAnimationFrame(r)}async stop(){m(this.#r,"Polling never started."),this.#r.finished()||this.#r.reject(new Error("Polling stopped"))}result(){return m(this.#r,"Polling never started."),this.#r}},E=class{#e;#r;#n;#t;constructor(t,n){this.#e=t,this.#r=n}async start(){let t=this.#t=p(),n=await this.#e();if(n){t.resolve(n);return}this.#n=setInterval(async()=>{let r=await this.#e();r&&(t.resolve(r),await this.stop())},this.#r)}async stop(){m(this.#t,"Polling never started."),this.#t.finished()||this.#t.reject(new Error("Polling stopped")),this.#n&&(clearInterval(this.#n),this.#n=void 0)}result(){return m(this.#t,"Polling never started."),this.#t}};var H={};u(H,{pQuerySelector:()=>Ie,pQuerySelectorAll:()=>re});var c=class{static async*map(t,n){for await(let r of t)yield await n(r)}static async*flatMap(t,n){for await(let r of t)yield*n(r)}static async collect(t){let n=[];for await(let r of t)n.push(r);return n}static async first(t){for await(let n of t)return n}};var h={attribute:/\\[\\s*(?:(?<namespace>\\*|[-\\w\\P{ASCII}]*)\\|)?(?<name>[-\\w\\P{ASCII}]+)\\s*(?:(?<operator>\\W?=)\\s*(?<value>.+?)\\s*(\\s(?<caseSensitive>[iIsS]))?\\s*)?\\]/gu,id:/#(?<name>[-\\w\\P{ASCII}]+)/gu,class:/\\.(?<name>[-\\w\\P{ASCII}]+)/gu,comma:/\\s*,\\s*/g,combinator:/\\s*[\\s>+~]\\s*/g,"pseudo-element":/::(?<name>[-\\w\\P{ASCII}]+)(?:\\((?<argument>\xB6+)\\))?/gu,"pseudo-class":/:(?<name>[-\\w\\P{ASCII}]+)(?:\\((?<argument>\xB6+)\\))?/gu,universal:/(?:(?<namespace>\\*|[-\\w\\P{ASCII}]*)\\|)?\\*/gu,type:/(?:(?<namespace>\\*|[-\\w\\P{ASCII}]*)\\|)?(?<name>[-\\w\\P{ASCII}]+)/gu},fe=new Set(["combinator","comma"]);var me=e=>{switch(e){case"pseudo-element":case"pseudo-class":return new RegExp(h[e].source.replace("(?<argument>\\xB6+)","(?<argument>.+)"),"gu");default:return h[e]}};function de(e,t){let n=0,r="";for(;t<e.length;t++){let o=e[t];switch(o){case"(":++n;break;case")":--n;break}if(r+=o,n===0)return r}return r}function pe(e,t=h){if(!e)return[];let n=[e];for(let[o,i]of Object.entries(t))for(let s=0;s<n.length;s++){let l=n[s];if(typeof l!="string")continue;i.lastIndex=0;let a=i.exec(l);if(!a)continue;let d=a.index-1,f=[],V=a[0],B=l.slice(0,d+1);B&&f.push(B),f.push({...a.groups,type:o,content:V});let z=l.slice(d+V.length+1);z&&f.push(z),n.splice(s,1,...f)}let r=0;for(let o of n)switch(typeof o){case"string":throw new Error(`Unexpected sequence ${o} found at index ${r}`);case"object":r+=o.content.length,o.pos=[r-o.content.length,r],fe.has(o.type)&&(o.content=o.content.trim()||" ");break}return n}var he=/([\'"])([^\\\\\\n]+?)\\1/g,ge=/\\\\./g;function K(e,t=h){if(e=e.trim(),e==="")return[];let n=[];e=e.replace(ge,(i,s)=>(n.push({value:i,offset:s}),"\\uE000".repeat(i.length))),e=e.replace(he,(i,s,l,a)=>(n.push({value:i,offset:a}),`${s}${"\\uE001".repeat(l.length)}${s}`));{let i=0,s;for(;(s=e.indexOf("(",i))>-1;){let l=de(e,s);n.push({value:l,offset:s}),e=`${e.substring(0,s)}(${"\\xB6".repeat(l.length-2)})${e.substring(s+l.length)}`,i=s+l.length}}let r=pe(e,t),o=new Set;for(let i of n.reverse())for(let s of r){let{offset:l,value:a}=i;if(!(s.pos[0]<=l&&l+a.length<=s.pos[1]))continue;let{content:d}=s,f=l-s.pos[0];s.content=d.slice(0,f)+a+d.slice(f+a.length),s.content!==d&&o.add(s)}for(let i of o){let s=me(i.type);if(!s)throw new Error(`Unknown token type: ${i.type}`);s.lastIndex=0;let l=s.exec(i.content);if(!l)throw new Error(`Unable to parse content for ${i.type}: ${i.content}`);Object.assign(i,l.groups)}return r}function*N(e,t){switch(e.type){case"list":for(let n of e.list)yield*N(n,e);break;case"complex":yield*N(e.left,e),yield*N(e.right,e);break;case"compound":yield*e.list.map(n=>[n,e]);break;default:yield[e,t]}}function g(e){let t;return Array.isArray(e)?t=e:t=[...N(e)].map(([n])=>n),t.map(n=>n.content).join("")}h.combinator=/\\s*(>>>>?|[\\s>+~])\\s*/g;var ye=/\\\\[\\s\\S]/g,we=e=>{if(e.length>1){for(let t of[\'"\',"\'"])if(!(!e.startsWith(t)||!e.endsWith(t)))return e.slice(t.length,-t.length).replace(ye,n=>n.slice(1))}return e};function Y(e){let t=!0,n=K(e);if(n.length===0)return[[],t];let r=[],o=[r],i=[o],s=[];for(let l of n){switch(l.type){case"combinator":switch(l.content){case">>>":t=!1,s.length&&(r.push(g(s)),s.splice(0)),r=[],o.push(">>>"),o.push(r);continue;case">>>>":t=!1,s.length&&(r.push(g(s)),s.splice(0)),r=[],o.push(">>>>"),o.push(r);continue}break;case"pseudo-element":if(!l.name.startsWith("-p-"))break;t=!1,s.length&&(r.push(g(s)),s.splice(0)),r.push({name:l.name.slice(3),value:we(l.argument??"")});continue;case"comma":s.length&&(r.push(g(s)),s.splice(0)),r=[],o=[r],i.push(o);continue}s.push(l)}return s.length&&r.push(g(s)),[i,t]}var Q={};u(Q,{textQuerySelectorAll:()=>b});var Se=new Set(["checkbox","image","radio"]),be=e=>e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement&&!Se.has(e.type),Pe=new Set(["SCRIPT","STYLE"]),w=e=>!Pe.has(e.nodeName)&&!document.head?.contains(e),q=new WeakMap,Z=e=>{for(;e;)q.delete(e),e instanceof ShadowRoot?e=e.host:e=e.parentNode},J=new WeakSet,Te=new MutationObserver(e=>{for(let t of e)Z(t.target)}),y=e=>{let t=q.get(e);if(t||(t={full:"",immediate:[]},!w(e)))return t;let n="";if(be(e))t.full=e.value,t.immediate.push(e.value),e.addEventListener("input",r=>{Z(r.target)},{once:!0,capture:!0});else{for(let r=e.firstChild;r;r=r.nextSibling){if(r.nodeType===Node.TEXT_NODE){t.full+=r.nodeValue??"",n+=r.nodeValue??"";continue}n&&t.immediate.push(n),n="",r.nodeType===Node.ELEMENT_NODE&&(t.full+=y(r).full)}n&&t.immediate.push(n),e instanceof Element&&e.shadowRoot&&(t.full+=y(e.shadowRoot).full),J.has(e)||(Te.observe(e,{childList:!0,characterData:!0}),J.add(e))}return q.set(e,t),t};var b=function*(e,t){let n=!1;for(let r of e.childNodes)if(r instanceof Element&&w(r)){let o;r.shadowRoot?o=b(r.shadowRoot,t):o=b(r,t);for(let i of o)yield i,n=!0}n||e instanceof Element&&w(e)&&y(e).full.includes(t)&&(yield e)};var $={};u($,{checkVisibility:()=>Ee,pierce:()=>A,pierceAll:()=>L});var xe=["hidden","collapse"],Ee=(e,t)=>{if(!e)return t===!1;if(t===void 0)return e;let n=e.nodeType===Node.TEXT_NODE?e.parentElement:e,r=window.getComputedStyle(n),o=r&&!xe.includes(r.visibility)&&!Ne(n);return t===o?e:!1};function Ne(e){let t=e.getBoundingClientRect();return t.width===0||t.height===0}var Ae=e=>"shadowRoot"in e&&e.shadowRoot instanceof ShadowRoot;function*A(e){Ae(e)?yield e.shadowRoot:yield e}function*L(e){e=A(e).next().value,yield e;let t=[document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT)];for(let n of t){let r;for(;r=n.nextNode();)r.shadowRoot&&(yield r.shadowRoot,t.push(document.createTreeWalker(r.shadowRoot,NodeFilter.SHOW_ELEMENT)))}}var U={};u(U,{xpathQuerySelectorAll:()=>j});var j=function*(e,t){let r=(e.ownerDocument||document).evaluate(t,e,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE),o;for(;o=r.iterateNext();)yield o};var ve=/[-\\w\\P{ASCII}*]/,ee=e=>"querySelectorAll"in e,v=class extends Error{constructor(t,n){super(`${t} is not a valid selector: ${n}`)}},F=class{#e;#r;#n=[];#t=void 0;elements;constructor(t,n,r){this.elements=[t],this.#e=n,this.#r=r,this.#o()}async run(){if(typeof this.#t=="string")switch(this.#t.trimStart()){case":scope":this.#o();break}for(;this.#t!==void 0;this.#o()){let t=this.#t,n=this.#e;typeof t=="string"?t[0]&&ve.test(t[0])?this.elements=c.flatMap(this.elements,async function*(r){ee(r)&&(yield*r.querySelectorAll(t))}):this.elements=c.flatMap(this.elements,async function*(r){if(!r.parentElement){if(!ee(r))return;yield*r.querySelectorAll(t);return}let o=0;for(let i of r.parentElement.children)if(++o,i===r)break;yield*r.parentElement.querySelectorAll(`:scope>:nth-child(${o})${t}`)}):this.elements=c.flatMap(this.elements,async function*(r){switch(t.name){case"text":yield*b(r,t.value);break;case"xpath":yield*j(r,t.value);break;case"aria":yield*k(r,t.value);break;default:let o=_.get(t.name);if(!o)throw new v(n,`Unknown selector type: ${t.name}`);yield*o.querySelectorAll(r,t.value)}})}}#o(){if(this.#n.length!==0){this.#t=this.#n.shift();return}if(this.#r.length===0){this.#t=void 0;return}let t=this.#r.shift();switch(t){case">>>>":{this.elements=c.flatMap(this.elements,A),this.#o();break}case">>>":{this.elements=c.flatMap(this.elements,L),this.#o();break}default:this.#n=t,this.#o();break}}},W=class{#e=new WeakMap;calculate(t,n=[]){if(t===null)return n;t instanceof ShadowRoot&&(t=t.host);let r=this.#e.get(t);if(r)return[...r,...n];let o=0;for(let s=t.previousSibling;s;s=s.previousSibling)++o;let i=this.calculate(t.parentNode,[o]);return this.#e.set(t,i),[...i,...n]}},te=(e,t)=>{if(e.length+t.length===0)return 0;let[n=-1,...r]=e,[o=-1,...i]=t;return n===o?te(r,i):n<o?-1:1},Ce=async function*(e){let t=new Set;for await(let r of e)t.add(r);let n=new W;yield*[...t.values()].map(r=>[r,n.calculate(r)]).sort(([,r],[,o])=>te(r,o)).map(([r])=>r)},re=function(e,t){let n,r;try{[n,r]=Y(t)}catch{return e.querySelectorAll(t)}if(r)return e.querySelectorAll(t);if(n.some(o=>{let i=0;return o.some(s=>(typeof s=="string"?++i:i=0,i>1))}))throw new v(t,"Multiple deep combinators found in sequence.");return Ce(c.flatMap(n,o=>{let i=new F(e,t,o);return i.run(),i.elements}))},Ie=async function(e,t){for await(let n of re(e,t))return n;return null};var ke=Object.freeze({...R,...D,...M,...H,...Q,...$,...U,createDeferredPromise:p,createFunction:X,createTextContent:y,IntervalPoller:E,isSuitableNodeForTextMatching:w,MutationPoller:T,RAFPoller:x}),Re=ke;\n';

// node_modules/puppeteer-core/lib/esm/puppeteer/common/ScriptInjector.js
var __classPrivateFieldGet4 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet3 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _ScriptInjector_instances;
var _ScriptInjector_updated;
var _ScriptInjector_amendments;
var _ScriptInjector_update;
var _ScriptInjector_get;
var ScriptInjector = class {
  constructor() {
    _ScriptInjector_instances.add(this);
    _ScriptInjector_updated.set(this, false);
    _ScriptInjector_amendments.set(this, /* @__PURE__ */ new Set());
  }
  // Appends a statement of the form `(PuppeteerUtil) => {...}`.
  append(statement) {
    __classPrivateFieldGet4(this, _ScriptInjector_instances, "m", _ScriptInjector_update).call(this, () => {
      __classPrivateFieldGet4(this, _ScriptInjector_amendments, "f").add(statement);
    });
  }
  pop(statement) {
    __classPrivateFieldGet4(this, _ScriptInjector_instances, "m", _ScriptInjector_update).call(this, () => {
      __classPrivateFieldGet4(this, _ScriptInjector_amendments, "f").delete(statement);
    });
  }
  inject(inject, force = false) {
    if (__classPrivateFieldGet4(this, _ScriptInjector_updated, "f") || force) {
      inject(__classPrivateFieldGet4(this, _ScriptInjector_instances, "m", _ScriptInjector_get).call(this));
    }
    __classPrivateFieldSet3(this, _ScriptInjector_updated, false, "f");
  }
};
_ScriptInjector_updated = /* @__PURE__ */ new WeakMap(), _ScriptInjector_amendments = /* @__PURE__ */ new WeakMap(), _ScriptInjector_instances = /* @__PURE__ */ new WeakSet(), _ScriptInjector_update = function _ScriptInjector_update2(callback) {
  callback();
  __classPrivateFieldSet3(this, _ScriptInjector_updated, true, "f");
}, _ScriptInjector_get = function _ScriptInjector_get2() {
  return `(() => {
      const module = {};
      ${source}
      ${[...__classPrivateFieldGet4(this, _ScriptInjector_amendments, "f")].map((statement) => {
    return `(${statement})(module.exports.default);`;
  }).join("")}
      return module.exports.default;
    })()`;
};
var scriptInjector = new ScriptInjector();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/CustomQueryHandler.js
var __classPrivateFieldGet5 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CustomQueryHandlerRegistry_handlers;
var CustomQueryHandlerRegistry = class {
  constructor() {
    _CustomQueryHandlerRegistry_handlers.set(this, /* @__PURE__ */ new Map());
  }
  /**
   * @internal
   */
  get(name) {
    const handler = __classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").get(name);
    return handler ? handler[1] : void 0;
  }
  /**
   * Registers a {@link CustomQueryHandler | custom query handler}.
   *
   * @remarks
   * After registration, the handler can be used everywhere where a selector is
   * expected by prepending the selection string with `<name>/`. The name is
   * only allowed to consist of lower- and upper case latin letters.
   *
   * @example
   *
   * ```ts
   * Puppeteer.customQueryHandlers.register('lit', { … });
   * const aHandle = await page.$('lit/…');
   * ```
   *
   * @param name - Name to register under.
   * @param queryHandler - {@link CustomQueryHandler | Custom query handler} to
   * register.
   *
   * @internal
   */
  register(name, handler) {
    var _a2;
    if (__classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").has(name)) {
      throw new Error(`Cannot register over existing handler: ${name}`);
    }
    assert(!__classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").has(name), `Cannot register over existing handler: ${name}`);
    assert(/^[a-zA-Z]+$/.test(name), `Custom query handler names may only contain [a-zA-Z]`);
    assert(handler.queryAll || handler.queryOne, `At least one query method must be implemented.`);
    const Handler = (_a2 = class extends QueryHandler {
    }, _a2.querySelectorAll = interpolateFunction((node, selector, PuppeteerUtil) => {
      return PuppeteerUtil.customQuerySelectors.get(PLACEHOLDER("name")).querySelectorAll(node, selector);
    }, { name: JSON.stringify(name) }), _a2.querySelector = interpolateFunction((node, selector, PuppeteerUtil) => {
      return PuppeteerUtil.customQuerySelectors.get(PLACEHOLDER("name")).querySelector(node, selector);
    }, { name: JSON.stringify(name) }), _a2);
    const registerScript = interpolateFunction((PuppeteerUtil) => {
      PuppeteerUtil.customQuerySelectors.register(PLACEHOLDER("name"), {
        queryAll: PLACEHOLDER("queryAll"),
        queryOne: PLACEHOLDER("queryOne")
      });
    }, {
      name: JSON.stringify(name),
      queryAll: handler.queryAll ? stringifyFunction(handler.queryAll) : String(void 0),
      queryOne: handler.queryOne ? stringifyFunction(handler.queryOne) : String(void 0)
    }).toString();
    __classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").set(name, [registerScript, Handler]);
    scriptInjector.append(registerScript);
  }
  /**
   * Unregisters the {@link CustomQueryHandler | custom query handler} for the
   * given name.
   *
   * @throws `Error` if there is no handler under the given name.
   *
   * @internal
   */
  unregister(name) {
    const handler = __classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").get(name);
    if (!handler) {
      throw new Error(`Cannot unregister unknown handler: ${name}`);
    }
    scriptInjector.pop(handler[0]);
    __classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").delete(name);
  }
  /**
   * Gets the names of all {@link CustomQueryHandler | custom query handlers}.
   *
   * @internal
   */
  names() {
    return [...__classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").keys()];
  }
  /**
   * Unregisters all custom query handlers.
   *
   * @internal
   */
  clear() {
    for (const [registerScript] of __classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f")) {
      scriptInjector.pop(registerScript);
    }
    __classPrivateFieldGet5(this, _CustomQueryHandlerRegistry_handlers, "f").clear();
  }
};
_CustomQueryHandlerRegistry_handlers = /* @__PURE__ */ new WeakMap();
var customQueryHandlers = new CustomQueryHandlerRegistry();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PierceQueryHandler.js
var PierceQueryHandler = class extends QueryHandler {
};
PierceQueryHandler.querySelector = (element, selector, { pierceQuerySelector }) => {
  return pierceQuerySelector(element, selector);
};
PierceQueryHandler.querySelectorAll = (element, selector, { pierceQuerySelectorAll }) => {
  return pierceQuerySelectorAll(element, selector);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PQueryHandler.js
var PQueryHandler = class extends QueryHandler {
};
PQueryHandler.querySelectorAll = (element, selector, { pQuerySelectorAll }) => {
  return pQuerySelectorAll(element, selector);
};
PQueryHandler.querySelector = (element, selector, { pQuerySelector }) => {
  return pQuerySelector(element, selector);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/TextQueryHandler.js
var TextQueryHandler = class extends QueryHandler {
};
TextQueryHandler.querySelectorAll = (element, selector, { textQuerySelectorAll }) => {
  return textQuerySelectorAll(element, selector);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/XPathQueryHandler.js
var XPathQueryHandler = class extends QueryHandler {
};
XPathQueryHandler.querySelectorAll = (element, selector, { xpathQuerySelectorAll }) => {
  return xpathQuerySelectorAll(element, selector);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/GetQueryHandler.js
var BUILTIN_QUERY_HANDLERS = Object.freeze({
  aria: ARIAQueryHandler,
  pierce: PierceQueryHandler,
  xpath: XPathQueryHandler,
  text: TextQueryHandler
});
var QUERY_SEPARATORS = ["=", "/"];
function getQueryHandlerAndSelector(selector) {
  for (const handlerMap of [
    customQueryHandlers.names().map((name) => {
      return [name, customQueryHandlers.get(name)];
    }),
    Object.entries(BUILTIN_QUERY_HANDLERS)
  ]) {
    for (const [name, QueryHandler2] of handlerMap) {
      for (const separator of QUERY_SEPARATORS) {
        const prefix = `${name}${separator}`;
        if (selector.startsWith(prefix)) {
          selector = selector.slice(prefix.length);
          return { updatedSelector: selector, QueryHandler: QueryHandler2 };
        }
      }
    }
  }
  return { updatedSelector: selector, QueryHandler: PQueryHandler };
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/JSHandle.js
var __classPrivateFieldGet6 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet4 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _CDPJSHandle_disposed;
var _CDPJSHandle_context;
var _CDPJSHandle_remoteObject;
var CDPJSHandle = class extends JSHandle {
  get disposed() {
    return __classPrivateFieldGet6(this, _CDPJSHandle_disposed, "f");
  }
  constructor(context, remoteObject) {
    super();
    _CDPJSHandle_disposed.set(this, false);
    _CDPJSHandle_context.set(this, void 0);
    _CDPJSHandle_remoteObject.set(this, void 0);
    __classPrivateFieldSet4(this, _CDPJSHandle_context, context, "f");
    __classPrivateFieldSet4(this, _CDPJSHandle_remoteObject, remoteObject, "f");
  }
  executionContext() {
    return __classPrivateFieldGet6(this, _CDPJSHandle_context, "f");
  }
  get client() {
    return __classPrivateFieldGet6(this, _CDPJSHandle_context, "f")._client;
  }
  /**
   * @see {@link ExecutionContext.evaluate} for more details.
   */
  async evaluate(pageFunction, ...args) {
    return await this.executionContext().evaluate(pageFunction, this, ...args);
  }
  /**
   * @see {@link ExecutionContext.evaluateHandle} for more details.
   */
  async evaluateHandle(pageFunction, ...args) {
    return await this.executionContext().evaluateHandle(pageFunction, this, ...args);
  }
  async getProperty(propertyName) {
    return this.evaluateHandle((object, propertyName2) => {
      return object[propertyName2];
    }, propertyName);
  }
  async getProperties() {
    assert(__classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").objectId);
    const response = await this.client.send("Runtime.getProperties", {
      objectId: __classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").objectId,
      ownProperties: true
    });
    const result = /* @__PURE__ */ new Map();
    for (const property of response.result) {
      if (!property.enumerable || !property.value) {
        continue;
      }
      result.set(property.name, createJSHandle(__classPrivateFieldGet6(this, _CDPJSHandle_context, "f"), property.value));
    }
    return result;
  }
  async jsonValue() {
    if (!__classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").objectId) {
      return valueFromRemoteObject(__classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f"));
    }
    const value = await this.evaluate((object) => {
      return object;
    });
    if (value === void 0) {
      throw new Error("Could not serialize referenced object");
    }
    return value;
  }
  /**
   * Either `null` or the handle itself if the handle is an
   * instance of {@link ElementHandle}.
   */
  asElement() {
    return null;
  }
  async dispose() {
    if (__classPrivateFieldGet6(this, _CDPJSHandle_disposed, "f")) {
      return;
    }
    __classPrivateFieldSet4(this, _CDPJSHandle_disposed, true, "f");
    await releaseObject(this.client, __classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f"));
  }
  toString() {
    if (!__classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").objectId) {
      return "JSHandle:" + valueFromRemoteObject(__classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f"));
    }
    const type = __classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").subtype || __classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").type;
    return "JSHandle@" + type;
  }
  get id() {
    return __classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f").objectId;
  }
  remoteObject() {
    return __classPrivateFieldGet6(this, _CDPJSHandle_remoteObject, "f");
  }
};
_CDPJSHandle_disposed = /* @__PURE__ */ new WeakMap(), _CDPJSHandle_context = /* @__PURE__ */ new WeakMap(), _CDPJSHandle_remoteObject = /* @__PURE__ */ new WeakMap();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/ElementHandle.js
var __classPrivateFieldSet5 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet7 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CDPElementHandle_instances;
var _CDPElementHandle_frame;
var _CDPElementHandle_frameManager_get;
var _CDPElementHandle_page_get;
var _CDPElementHandle_checkVisibility;
var _CDPElementHandle_scrollIntoViewIfNeeded;
var _CDPElementHandle_getOOPIFOffsets;
var _CDPElementHandle_getBoxModel;
var _CDPElementHandle_fromProtocolQuad;
var _CDPElementHandle_intersectQuadWithViewport;
var applyOffsetsToQuad = (quad, offsetX, offsetY) => {
  return quad.map((part) => {
    return { x: part.x + offsetX, y: part.y + offsetY };
  });
};
var CDPElementHandle = class extends ElementHandle {
  constructor(context, remoteObject, frame) {
    super(new CDPJSHandle(context, remoteObject));
    _CDPElementHandle_instances.add(this);
    _CDPElementHandle_frame.set(this, void 0);
    __classPrivateFieldSet5(this, _CDPElementHandle_frame, frame, "f");
  }
  /**
   * @internal
   */
  executionContext() {
    return this.handle.executionContext();
  }
  /**
   * @internal
   */
  get client() {
    return this.handle.client;
  }
  remoteObject() {
    return this.handle.remoteObject();
  }
  get frame() {
    return __classPrivateFieldGet7(this, _CDPElementHandle_frame, "f");
  }
  async $(selector) {
    const { updatedSelector, QueryHandler: QueryHandler2 } = getQueryHandlerAndSelector(selector);
    return await QueryHandler2.queryOne(this, updatedSelector);
  }
  async $$(selector) {
    const { updatedSelector, QueryHandler: QueryHandler2 } = getQueryHandlerAndSelector(selector);
    return AsyncIterableUtil.collect(QueryHandler2.queryAll(this, updatedSelector));
  }
  async $eval(selector, pageFunction, ...args) {
    const elementHandle = await this.$(selector);
    if (!elementHandle) {
      throw new Error(`Error: failed to find element matching selector "${selector}"`);
    }
    const result = await elementHandle.evaluate(pageFunction, ...args);
    await elementHandle.dispose();
    return result;
  }
  async $$eval(selector, pageFunction, ...args) {
    const results = await this.$$(selector);
    const elements = await this.evaluateHandle((_, ...elements2) => {
      return elements2;
    }, ...results);
    const [result] = await Promise.all([
      elements.evaluate(pageFunction, ...args),
      ...results.map((results2) => {
        return results2.dispose();
      })
    ]);
    await elements.dispose();
    return result;
  }
  async $x(expression) {
    if (expression.startsWith("//")) {
      expression = `.${expression}`;
    }
    return this.$$(`xpath/${expression}`);
  }
  async waitForSelector(selector, options = {}) {
    const { updatedSelector, QueryHandler: QueryHandler2 } = getQueryHandlerAndSelector(selector);
    return await QueryHandler2.waitFor(this, updatedSelector, options);
  }
  async waitForXPath(xpath, options = {}) {
    if (xpath.startsWith("//")) {
      xpath = `.${xpath}`;
    }
    return this.waitForSelector(`xpath/${xpath}`, options);
  }
  async isVisible() {
    return __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_checkVisibility).call(this, true);
  }
  async isHidden() {
    return __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_checkVisibility).call(this, false);
  }
  async toElement(tagName) {
    const isMatchingTagName = await this.evaluate((node, tagName2) => {
      return node.nodeName === tagName2.toUpperCase();
    }, tagName);
    if (!isMatchingTagName) {
      throw new Error(`Element is not a(n) \`${tagName}\` element`);
    }
    return this;
  }
  async contentFrame() {
    const nodeInfo = await this.client.send("DOM.describeNode", {
      objectId: this.remoteObject().objectId
    });
    if (typeof nodeInfo.node.frameId !== "string") {
      return null;
    }
    return __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_frameManager_get).frame(nodeInfo.node.frameId);
  }
  async scrollIntoView() {
    await this.assertConnectedElement();
    try {
      await this.client.send("DOM.scrollIntoViewIfNeeded", {
        objectId: this.remoteObject().objectId
      });
    } catch (error) {
      debugError(error);
      await this.evaluate(async (element) => {
        element.scrollIntoView({
          block: "center",
          inline: "center",
          // @ts-expect-error Chrome still supports behavior: instant but
          // it's not in the spec so TS shouts We don't want to make this
          // breaking change in Puppeteer yet so we'll ignore the line.
          behavior: "instant"
        });
      });
    }
  }
  async clickablePoint(offset) {
    const [result, layoutMetrics] = await Promise.all([
      this.client.send("DOM.getContentQuads", {
        objectId: this.remoteObject().objectId
      }).catch(debugError),
      __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get)._client().send("Page.getLayoutMetrics")
    ]);
    if (!result || !result.quads.length) {
      throw new Error("Node is either not clickable or not an HTMLElement");
    }
    const { clientWidth, clientHeight } = layoutMetrics.cssLayoutViewport || layoutMetrics.layoutViewport;
    const { offsetX, offsetY } = await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet7(this, _CDPElementHandle_frame, "f"));
    const quads = result.quads.map((quad2) => {
      return __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_fromProtocolQuad).call(this, quad2);
    }).map((quad2) => {
      return applyOffsetsToQuad(quad2, offsetX, offsetY);
    }).map((quad2) => {
      return __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_intersectQuadWithViewport).call(this, quad2, clientWidth, clientHeight);
    }).filter((quad2) => {
      return computeQuadArea(quad2) > 1;
    });
    if (!quads.length) {
      throw new Error("Node is either not clickable or not an HTMLElement");
    }
    const quad = quads[0];
    if (offset) {
      let minX = Number.MAX_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      for (const point of quad) {
        if (point.x < minX) {
          minX = point.x;
        }
        if (point.y < minY) {
          minY = point.y;
        }
      }
      if (minX !== Number.MAX_SAFE_INTEGER && minY !== Number.MAX_SAFE_INTEGER) {
        return {
          x: minX + offset.x,
          y: minY + offset.y
        };
      }
    }
    let x = 0;
    let y = 0;
    for (const point of quad) {
      x += point.x;
      y += point.y;
    }
    return {
      x: x / 4,
      y: y / 4
    };
  }
  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page.mouse} to hover over the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async hover() {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const { x, y } = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.move(x, y);
  }
  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page.mouse} to click in the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async click(options = {}) {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const { x, y } = await this.clickablePoint(options.offset);
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.click(x, y, options);
  }
  /**
   * This method creates and captures a dragevent from the element.
   */
  async drag(target) {
    assert(__classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).isDragInterceptionEnabled(), "Drag Interception is not enabled!");
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const start = await this.clickablePoint();
    return await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.drag(start, target);
  }
  async dragEnter(data = { items: [], dragOperationsMask: 1 }) {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const target = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.dragEnter(target, data);
  }
  async dragOver(data = { items: [], dragOperationsMask: 1 }) {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const target = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.dragOver(target, data);
  }
  async drop(data = { items: [], dragOperationsMask: 1 }) {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const destination = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.drop(destination, data);
  }
  async dragAndDrop(target, options) {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const startPoint = await this.clickablePoint();
    const targetPoint = await target.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).mouse.dragAndDrop(startPoint, targetPoint, options);
  }
  async select(...values) {
    for (const value of values) {
      assert(isString(value), 'Values must be strings. Found value "' + value + '" of type "' + typeof value + '"');
    }
    return this.evaluate((element, vals) => {
      const values2 = new Set(vals);
      if (!(element instanceof HTMLSelectElement)) {
        throw new Error("Element is not a <select> element.");
      }
      const selectedValues = /* @__PURE__ */ new Set();
      if (!element.multiple) {
        for (const option of element.options) {
          option.selected = false;
        }
        for (const option of element.options) {
          if (values2.has(option.value)) {
            option.selected = true;
            selectedValues.add(option.value);
            break;
          }
        }
      } else {
        for (const option of element.options) {
          option.selected = values2.has(option.value);
          if (option.selected) {
            selectedValues.add(option.value);
          }
        }
      }
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return [...selectedValues.values()];
    }, values);
  }
  async uploadFile(...filePaths) {
    const isMultiple = await this.evaluate((element) => {
      return element.multiple;
    });
    assert(filePaths.length <= 1 || isMultiple, "Multiple file uploads only work with <input type=file multiple>");
    let path;
    try {
      path = await import("path");
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`JSHandle#uploadFile can only be used in Node-like environments.`);
      }
      throw error;
    }
    const files = filePaths.map((filePath) => {
      if (path.win32.isAbsolute(filePath) || path.posix.isAbsolute(filePath)) {
        return filePath;
      } else {
        return path.resolve(filePath);
      }
    });
    const { objectId } = this.remoteObject();
    const { node } = await this.client.send("DOM.describeNode", {
      objectId
    });
    const { backendNodeId } = node;
    if (files.length === 0) {
      await this.evaluate((element) => {
        element.files = new DataTransfer().files;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      });
    } else {
      await this.client.send("DOM.setFileInputFiles", {
        objectId,
        files,
        backendNodeId
      });
    }
  }
  async tap() {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const { x, y } = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).touchscreen.touchStart(x, y);
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).touchscreen.touchEnd();
  }
  async touchStart() {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const { x, y } = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).touchscreen.touchStart(x, y);
  }
  async touchMove() {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    const { x, y } = await this.clickablePoint();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).touchscreen.touchMove(x, y);
  }
  async touchEnd() {
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).touchscreen.touchEnd();
  }
  async focus() {
    await this.evaluate((element) => {
      if (!(element instanceof HTMLElement)) {
        throw new Error("Cannot focus non-HTMLElement");
      }
      return element.focus();
    });
  }
  async type(text, options) {
    await this.focus();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).keyboard.type(text, options);
  }
  async press(key, options) {
    await this.focus();
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).keyboard.press(key, options);
  }
  async boundingBox() {
    const result = await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_getBoxModel).call(this);
    if (!result) {
      return null;
    }
    const { offsetX, offsetY } = await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet7(this, _CDPElementHandle_frame, "f"));
    const quad = result.model.border;
    const x = Math.min(quad[0], quad[2], quad[4], quad[6]);
    const y = Math.min(quad[1], quad[3], quad[5], quad[7]);
    const width = Math.max(quad[0], quad[2], quad[4], quad[6]) - x;
    const height = Math.max(quad[1], quad[3], quad[5], quad[7]) - y;
    return { x: x + offsetX, y: y + offsetY, width, height };
  }
  async boxModel() {
    const result = await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_getBoxModel).call(this);
    if (!result) {
      return null;
    }
    const { offsetX, offsetY } = await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet7(this, _CDPElementHandle_frame, "f"));
    const { content, padding, border, margin, width, height } = result.model;
    return {
      content: applyOffsetsToQuad(__classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_fromProtocolQuad).call(this, content), offsetX, offsetY),
      padding: applyOffsetsToQuad(__classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_fromProtocolQuad).call(this, padding), offsetX, offsetY),
      border: applyOffsetsToQuad(__classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_fromProtocolQuad).call(this, border), offsetX, offsetY),
      margin: applyOffsetsToQuad(__classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_fromProtocolQuad).call(this, margin), offsetX, offsetY),
      width,
      height
    };
  }
  async screenshot(options = {}) {
    let needsViewportReset = false;
    let boundingBox = await this.boundingBox();
    assert(boundingBox, "Node is either not visible or not an HTMLElement");
    const viewport = __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).viewport();
    if (viewport && (boundingBox.width > viewport.width || boundingBox.height > viewport.height)) {
      const newViewport = {
        width: Math.max(viewport.width, Math.ceil(boundingBox.width)),
        height: Math.max(viewport.height, Math.ceil(boundingBox.height))
      };
      await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).setViewport(Object.assign({}, viewport, newViewport));
      needsViewportReset = true;
    }
    await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_scrollIntoViewIfNeeded).call(this);
    boundingBox = await this.boundingBox();
    assert(boundingBox, "Node is either not visible or not an HTMLElement");
    assert(boundingBox.width !== 0, "Node has 0 width.");
    assert(boundingBox.height !== 0, "Node has 0 height.");
    const layoutMetrics = await this.client.send("Page.getLayoutMetrics");
    const { pageX, pageY } = layoutMetrics.cssVisualViewport || layoutMetrics.layoutViewport;
    const clip = Object.assign({}, boundingBox);
    clip.x += pageX;
    clip.y += pageY;
    const imageData = await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).screenshot(Object.assign({}, {
      clip
    }, options));
    if (needsViewportReset && viewport) {
      await __classPrivateFieldGet7(this, _CDPElementHandle_instances, "a", _CDPElementHandle_page_get).setViewport(viewport);
    }
    return imageData;
  }
};
_CDPElementHandle_frame = /* @__PURE__ */ new WeakMap(), _CDPElementHandle_instances = /* @__PURE__ */ new WeakSet(), _CDPElementHandle_frameManager_get = function _CDPElementHandle_frameManager_get2() {
  return __classPrivateFieldGet7(this, _CDPElementHandle_frame, "f")._frameManager;
}, _CDPElementHandle_page_get = function _CDPElementHandle_page_get2() {
  return __classPrivateFieldGet7(this, _CDPElementHandle_frame, "f").page();
}, _CDPElementHandle_checkVisibility = async function _CDPElementHandle_checkVisibility2(visibility) {
  const element = await this.frame.worlds[PUPPETEER_WORLD].adoptHandle(this);
  try {
    return await this.frame.worlds[PUPPETEER_WORLD].evaluate(async (PuppeteerUtil, element2, visibility2) => {
      return Boolean(PuppeteerUtil.checkVisibility(element2, visibility2));
    }, LazyArg.create((context) => {
      return context.puppeteerUtil;
    }), element, visibility);
  } finally {
    await element.dispose();
  }
}, _CDPElementHandle_scrollIntoViewIfNeeded = async function _CDPElementHandle_scrollIntoViewIfNeeded2() {
  if (await this.isIntersectingViewport({
    threshold: 1
  })) {
    return;
  }
  await this.scrollIntoView();
}, _CDPElementHandle_getOOPIFOffsets = async function _CDPElementHandle_getOOPIFOffsets2(frame) {
  let offsetX = 0;
  let offsetY = 0;
  let currentFrame = frame;
  while (currentFrame && currentFrame.parentFrame()) {
    const parent = currentFrame.parentFrame();
    if (!currentFrame.isOOPFrame() || !parent) {
      currentFrame = parent;
      continue;
    }
    const { backendNodeId } = await parent._client().send("DOM.getFrameOwner", {
      frameId: currentFrame._id
    });
    const result = await parent._client().send("DOM.getBoxModel", {
      backendNodeId
    });
    if (!result) {
      break;
    }
    const contentBoxQuad = result.model.content;
    const topLeftCorner = __classPrivateFieldGet7(this, _CDPElementHandle_instances, "m", _CDPElementHandle_fromProtocolQuad).call(this, contentBoxQuad)[0];
    offsetX += topLeftCorner.x;
    offsetY += topLeftCorner.y;
    currentFrame = parent;
  }
  return { offsetX, offsetY };
}, _CDPElementHandle_getBoxModel = function _CDPElementHandle_getBoxModel2() {
  const params = {
    objectId: this.id
  };
  return this.client.send("DOM.getBoxModel", params).catch((error) => {
    return debugError(error);
  });
}, _CDPElementHandle_fromProtocolQuad = function _CDPElementHandle_fromProtocolQuad2(quad) {
  return [
    { x: quad[0], y: quad[1] },
    { x: quad[2], y: quad[3] },
    { x: quad[4], y: quad[5] },
    { x: quad[6], y: quad[7] }
  ];
}, _CDPElementHandle_intersectQuadWithViewport = function _CDPElementHandle_intersectQuadWithViewport2(quad, width, height) {
  return quad.map((point) => {
    return {
      x: Math.min(Math.max(point.x, 0), width),
      y: Math.min(Math.max(point.y, 0), height)
    };
  });
};
function computeQuadArea(quad) {
  let area = 0;
  for (let i = 0; i < quad.length; ++i) {
    const p1 = quad[i];
    const p2 = quad[(i + 1) % quad.length];
    area += (p1.x * p2.y - p2.x * p1.y) / 2;
  }
  return Math.abs(area);
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/util.js
var debugError = debug("puppeteer:error");
function getExceptionMessage(exceptionDetails) {
  if (exceptionDetails.exception) {
    return exceptionDetails.exception.description || exceptionDetails.exception.value;
  }
  let message = exceptionDetails.text;
  if (exceptionDetails.stackTrace) {
    for (const callframe of exceptionDetails.stackTrace.callFrames) {
      const location = callframe.url + ":" + callframe.lineNumber + ":" + callframe.columnNumber;
      const functionName = callframe.functionName || "<anonymous>";
      message += `
    at ${functionName} (${location})`;
    }
  }
  return message;
}
function valueFromRemoteObject(remoteObject) {
  assert(!remoteObject.objectId, "Cannot extract value when objectId is given");
  if (remoteObject.unserializableValue) {
    if (remoteObject.type === "bigint") {
      return BigInt(remoteObject.unserializableValue.replace("n", ""));
    }
    switch (remoteObject.unserializableValue) {
      case "-0":
        return -0;
      case "NaN":
        return NaN;
      case "Infinity":
        return Infinity;
      case "-Infinity":
        return -Infinity;
      default:
        throw new Error("Unsupported unserializable value: " + remoteObject.unserializableValue);
    }
  }
  return remoteObject.value;
}
async function releaseObject(client, remoteObject) {
  if (!remoteObject.objectId) {
    return;
  }
  await client.send("Runtime.releaseObject", { objectId: remoteObject.objectId }).catch((error) => {
    debugError(error);
  });
}
function addEventListener(emitter, eventName, handler) {
  emitter.on(eventName, handler);
  return { emitter, eventName, handler };
}
function removeEventListeners(listeners) {
  for (const listener of listeners) {
    listener.emitter.removeListener(listener.eventName, listener.handler);
  }
  listeners.length = 0;
}
var isString = (obj) => {
  return typeof obj === "string" || obj instanceof String;
};
var isNumber = (obj) => {
  return typeof obj === "number" || obj instanceof Number;
};
var isPlainObject = (obj) => {
  return typeof obj === "object" && (obj === null || obj === void 0 ? void 0 : obj.constructor) === Object;
};
var isRegExp = (obj) => {
  return typeof obj === "object" && (obj === null || obj === void 0 ? void 0 : obj.constructor) === RegExp;
};
var isDate = (obj) => {
  return typeof obj === "object" && (obj === null || obj === void 0 ? void 0 : obj.constructor) === Date;
};
async function waitForEvent(emitter, eventName, predicate, timeout, abortPromise) {
  let eventTimeout;
  let resolveCallback;
  let rejectCallback;
  const promise = new Promise((resolve, reject) => {
    resolveCallback = resolve;
    rejectCallback = reject;
  });
  const listener = addEventListener(emitter, eventName, async (event) => {
    if (!await predicate(event)) {
      return;
    }
    resolveCallback(event);
  });
  if (timeout) {
    eventTimeout = setTimeout(() => {
      rejectCallback(new TimeoutError("Timeout exceeded while waiting for event"));
    }, timeout);
  }
  function cleanup() {
    removeEventListeners([listener]);
    clearTimeout(eventTimeout);
  }
  const result = await Promise.race([promise, abortPromise]).then((r) => {
    cleanup();
    return r;
  }, (error) => {
    cleanup();
    throw error;
  });
  if (isErrorLike(result)) {
    throw result;
  }
  return result;
}
function createJSHandle(context, remoteObject) {
  if (remoteObject.subtype === "node" && context._world) {
    return new CDPElementHandle(context, remoteObject, context._world.frame());
  }
  return new CDPJSHandle(context, remoteObject);
}
function evaluationString(fun, ...args) {
  if (isString(fun)) {
    assert(args.length === 0, "Cannot evaluate a string with arguments");
    return fun;
  }
  function serializeArgument(arg) {
    if (Object.is(arg, void 0)) {
      return "undefined";
    }
    return JSON.stringify(arg);
  }
  return `(${fun})(${args.map(serializeArgument).join(",")})`;
}
function addPageBinding(type, name) {
  const callCDP = globalThis[name];
  Object.assign(globalThis, {
    [name](...args) {
      var _a2, _b, _c;
      const callPuppeteer = globalThis[name];
      (_a2 = callPuppeteer.args) !== null && _a2 !== void 0 ? _a2 : callPuppeteer.args = /* @__PURE__ */ new Map();
      (_b = callPuppeteer.callbacks) !== null && _b !== void 0 ? _b : callPuppeteer.callbacks = /* @__PURE__ */ new Map();
      const seq = ((_c = callPuppeteer.lastSeq) !== null && _c !== void 0 ? _c : 0) + 1;
      callPuppeteer.lastSeq = seq;
      callPuppeteer.args.set(seq, args);
      callCDP(JSON.stringify({
        type,
        name,
        seq,
        args,
        isTrivial: !args.some((value) => {
          return value instanceof Node;
        })
      }));
      return new Promise((resolve, reject) => {
        callPuppeteer.callbacks.set(seq, {
          resolve(value) {
            callPuppeteer.args.delete(seq);
            resolve(value);
          },
          reject(value) {
            callPuppeteer.args.delete(seq);
            reject(value);
          }
        });
      });
    }
  });
}
function pageBindingInitString(type, name) {
  return evaluationString(addPageBinding, type, name);
}
async function waitWithTimeout(promise, taskName, timeout) {
  let reject;
  const timeoutError = new TimeoutError(`waiting for ${taskName} failed: timeout ${timeout}ms exceeded`);
  const timeoutPromise = new Promise((_, rej) => {
    return reject = rej;
  });
  let timeoutTimer = null;
  if (timeout) {
    timeoutTimer = setTimeout(() => {
      return reject(timeoutError);
    }, timeout);
  }
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }
  }
}
var fs = null;
async function importFSPromises() {
  if (!fs) {
    try {
      fs = await import("fs/promises");
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Cannot write to a path outside of a Node-like environment.");
      }
      throw error;
    }
  }
  return fs;
}
async function getReadableAsBuffer(readable, path) {
  const buffers = [];
  if (path) {
    const fs2 = await importFSPromises();
    const fileHandle = await fs2.open(path, "w+");
    for await (const chunk of readable) {
      buffers.push(chunk);
      await fileHandle.writeFile(chunk);
    }
    await fileHandle.close();
  } else {
    for await (const chunk of readable) {
      buffers.push(chunk);
    }
  }
  try {
    return Buffer.concat(buffers);
  } catch (error) {
    return null;
  }
}
async function getReadableFromProtocolStream(client, handle) {
  if (!isNode) {
    throw new Error("Cannot create a stream outside of Node.js environment.");
  }
  const { Readable } = await import("stream");
  let eof = false;
  return new Readable({
    async read(size) {
      if (eof) {
        return;
      }
      const response = await client.send("IO.read", { handle, size });
      this.push(response.data, response.base64Encoded ? "base64" : void 0);
      if (response.eof) {
        eof = true;
        await client.send("IO.close", { handle });
        this.push(null);
      }
    }
  });
}
async function setPageContent(page, content) {
  return page.evaluate((html) => {
    document.open();
    document.write(html);
    document.close();
  }, content);
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PDFOptions.js
var paperFormats = {
  letter: { width: 8.5, height: 11 },
  legal: { width: 8.5, height: 14 },
  tabloid: { width: 11, height: 17 },
  ledger: { width: 17, height: 11 },
  a0: { width: 33.1, height: 46.8 },
  a1: { width: 23.4, height: 33.1 },
  a2: { width: 16.54, height: 23.4 },
  a3: { width: 11.7, height: 16.54 },
  a4: { width: 8.27, height: 11.7 },
  a5: { width: 5.83, height: 8.27 },
  a6: { width: 4.13, height: 5.83 }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Page.js
var __classPrivateFieldGet8 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Page_handlerMap;
var Page = class extends EventEmitter {
  /**
   * @internal
   */
  constructor() {
    super();
    _Page_handlerMap.set(this, /* @__PURE__ */ new WeakMap());
  }
  /**
   * `true` if drag events are being intercepted, `false` otherwise.
   */
  isDragInterceptionEnabled() {
    throw new Error("Not implemented");
  }
  /**
   * `true` if the page has JavaScript enabled, `false` otherwise.
   */
  isJavaScriptEnabled() {
    throw new Error("Not implemented");
  }
  /**
   * Listen to page events.
   *
   * :::note
   *
   * This method exists to define event typings and handle proper wireup of
   * cooperative request interception. Actual event listening and dispatching is
   * delegated to {@link EventEmitter}.
   *
   * :::
   */
  on(eventName, handler) {
    if (eventName === "request") {
      const wrap = __classPrivateFieldGet8(this, _Page_handlerMap, "f").get(handler) || ((event) => {
        event.enqueueInterceptAction(() => {
          return handler(event);
        });
      });
      __classPrivateFieldGet8(this, _Page_handlerMap, "f").set(handler, wrap);
      return super.on(eventName, wrap);
    }
    return super.on(eventName, handler);
  }
  once(eventName, handler) {
    return super.once(eventName, handler);
  }
  off(eventName, handler) {
    if (eventName === "request") {
      handler = __classPrivateFieldGet8(this, _Page_handlerMap, "f").get(handler) || handler;
    }
    return super.off(eventName, handler);
  }
  waitForFileChooser() {
    throw new Error("Not implemented");
  }
  async setGeolocation() {
    throw new Error("Not implemented");
  }
  /**
   * A target this page was created from.
   */
  target() {
    throw new Error("Not implemented");
  }
  /**
   * Get the browser the page belongs to.
   */
  browser() {
    throw new Error("Not implemented");
  }
  /**
   * Get the browser context that the page belongs to.
   */
  browserContext() {
    throw new Error("Not implemented");
  }
  /**
   * The page's main frame.
   *
   * @remarks
   * Page is guaranteed to have a main frame which persists during navigations.
   */
  mainFrame() {
    throw new Error("Not implemented");
  }
  /**
   * {@inheritDoc Keyboard}
   */
  get keyboard() {
    throw new Error("Not implemented");
  }
  /**
   * {@inheritDoc Touchscreen}
   */
  get touchscreen() {
    throw new Error("Not implemented");
  }
  /**
   * {@inheritDoc Coverage}
   */
  get coverage() {
    throw new Error("Not implemented");
  }
  /**
   * {@inheritDoc Tracing}
   */
  get tracing() {
    throw new Error("Not implemented");
  }
  /**
   * {@inheritDoc Accessibility}
   */
  get accessibility() {
    throw new Error("Not implemented");
  }
  /**
   * An array of all frames attached to the page.
   */
  frames() {
    throw new Error("Not implemented");
  }
  /**
   * All of the dedicated {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API |
   * WebWorkers} associated with the page.
   *
   * @remarks
   * This does not contain ServiceWorkers
   */
  workers() {
    throw new Error("Not implemented");
  }
  async setRequestInterception() {
    throw new Error("Not implemented");
  }
  async setDragInterception() {
    throw new Error("Not implemented");
  }
  setOfflineMode() {
    throw new Error("Not implemented");
  }
  emulateNetworkConditions() {
    throw new Error("Not implemented");
  }
  setDefaultNavigationTimeout() {
    throw new Error("Not implemented");
  }
  setDefaultTimeout() {
    throw new Error("Not implemented");
  }
  /**
   * Maximum time in milliseconds.
   */
  getDefaultTimeout() {
    throw new Error("Not implemented");
  }
  async $() {
    throw new Error("Not implemented");
  }
  async $$() {
    throw new Error("Not implemented");
  }
  async evaluateHandle() {
    throw new Error("Not implemented");
  }
  async queryObjects() {
    throw new Error("Not implemented");
  }
  async $eval() {
    throw new Error("Not implemented");
  }
  async $$eval() {
    throw new Error("Not implemented");
  }
  async $x() {
    throw new Error("Not implemented");
  }
  async cookies() {
    throw new Error("Not implemented");
  }
  async deleteCookie() {
    throw new Error("Not implemented");
  }
  async setCookie() {
    throw new Error("Not implemented");
  }
  async addScriptTag() {
    throw new Error("Not implemented");
  }
  async addStyleTag() {
    throw new Error("Not implemented");
  }
  async exposeFunction() {
    throw new Error("Not implemented");
  }
  async authenticate() {
    throw new Error("Not implemented");
  }
  async setExtraHTTPHeaders() {
    throw new Error("Not implemented");
  }
  async setUserAgent() {
    throw new Error("Not implemented");
  }
  /**
   * Object containing metrics as key/value pairs.
   *
   * @returns
   *
   * - `Timestamp` : The timestamp when the metrics sample was taken.
   *
   * - `Documents` : Number of documents in the page.
   *
   * - `Frames` : Number of frames in the page.
   *
   * - `JSEventListeners` : Number of events in the page.
   *
   * - `Nodes` : Number of DOM nodes in the page.
   *
   * - `LayoutCount` : Total number of full or partial page layout.
   *
   * - `RecalcStyleCount` : Total number of page style recalculations.
   *
   * - `LayoutDuration` : Combined durations of all page layouts.
   *
   * - `RecalcStyleDuration` : Combined duration of all page style
   *   recalculations.
   *
   * - `ScriptDuration` : Combined duration of JavaScript execution.
   *
   * - `TaskDuration` : Combined duration of all tasks performed by the browser.
   *
   * - `JSHeapUsedSize` : Used JavaScript heap size.
   *
   * - `JSHeapTotalSize` : Total JavaScript heap size.
   *
   * @remarks
   * All timestamps are in monotonic time: monotonically increasing time
   * in seconds since an arbitrary point in the past.
   */
  async metrics() {
    throw new Error("Not implemented");
  }
  /**
   * The page's URL.
   * @remarks Shortcut for
   * {@link Frame.url | page.mainFrame().url()}.
   */
  url() {
    throw new Error("Not implemented");
  }
  /**
   * The full HTML contents of the page, including the DOCTYPE.
   */
  async content() {
    throw new Error("Not implemented");
  }
  async setContent() {
    throw new Error("Not implemented");
  }
  async goto() {
    throw new Error("Not implemented");
  }
  async reload() {
    throw new Error("Not implemented");
  }
  async waitForNavigation() {
    throw new Error("Not implemented");
  }
  async waitForRequest() {
    throw new Error("Not implemented");
  }
  async waitForResponse() {
    throw new Error("Not implemented");
  }
  async waitForNetworkIdle() {
    throw new Error("Not implemented");
  }
  async waitForFrame() {
    throw new Error("Not implemented");
  }
  async goBack() {
    throw new Error("Not implemented");
  }
  async goForward() {
    throw new Error("Not implemented");
  }
  /**
   * Brings page to front (activates tab).
   */
  async bringToFront() {
    throw new Error("Not implemented");
  }
  /**
   * Emulates a given device's metrics and user agent.
   *
   * To aid emulation, Puppeteer provides a list of known devices that can be
   * via {@link KnownDevices}.
   *
   * @remarks
   * This method is a shortcut for calling two methods:
   * {@link Page.setUserAgent} and {@link Page.setViewport}.
   *
   * @remarks
   * This method will resize the page. A lot of websites don't expect phones to
   * change size, so you should emulate before navigating to the page.
   *
   * @example
   *
   * ```ts
   * import {KnownDevices} from 'puppeteer';
   * const iPhone = KnownDevices['iPhone 6'];
   *
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   await page.emulate(iPhone);
   *   await page.goto('https://www.google.com');
   *   // other actions...
   *   await browser.close();
   * })();
   * ```
   */
  async emulate(device) {
    await Promise.all([
      this.setUserAgent(device.userAgent),
      this.setViewport(device.viewport)
    ]);
  }
  async setJavaScriptEnabled() {
    throw new Error("Not implemented");
  }
  async setBypassCSP() {
    throw new Error("Not implemented");
  }
  async emulateMediaType() {
    throw new Error("Not implemented");
  }
  async emulateCPUThrottling() {
    throw new Error("Not implemented");
  }
  async emulateMediaFeatures() {
    throw new Error("Not implemented");
  }
  async emulateTimezone() {
    throw new Error("Not implemented");
  }
  async emulateIdleState() {
    throw new Error("Not implemented");
  }
  async emulateVisionDeficiency() {
    throw new Error("Not implemented");
  }
  async setViewport() {
    throw new Error("Not implemented");
  }
  /**
   * Current page viewport settings.
   *
   * @returns
   *
   * - `width`: page's width in pixels
   *
   * - `height`: page's height in pixels
   *
   * - `deviceScaleFactor`: Specify device scale factor (can be though of as
   *   dpr). Defaults to `1`.
   *
   * - `isMobile`: Whether the meta viewport tag is taken into account. Defaults
   *   to `false`.
   *
   * - `hasTouch`: Specifies if viewport supports touch events. Defaults to
   *   `false`.
   *
   * - `isLandScape`: Specifies if viewport is in landscape mode. Defaults to
   *   `false`.
   */
  viewport() {
    throw new Error("Not implemented");
  }
  async evaluate() {
    throw new Error("Not implemented");
  }
  async evaluateOnNewDocument() {
    throw new Error("Not implemented");
  }
  async setCacheEnabled() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  async _maybeWriteBufferToFile(path, buffer) {
    if (!path) {
      return;
    }
    const fs2 = await importFSPromises();
    await fs2.writeFile(path, buffer);
  }
  async screenshot() {
    throw new Error("Not implemented");
  }
  /**
   * @internal
   */
  _getPDFOptions(options = {}, lengthUnit = "in") {
    var _a2, _b, _c, _d, _e, _f;
    const defaults = {
      scale: 1,
      displayHeaderFooter: false,
      headerTemplate: "",
      footerTemplate: "",
      printBackground: false,
      landscape: false,
      pageRanges: "",
      preferCSSPageSize: false,
      omitBackground: false,
      timeout: 3e4
    };
    let width = 8.5;
    let height = 11;
    if (options.format) {
      const format = paperFormats[options.format.toLowerCase()];
      assert(format, "Unknown paper format: " + options.format);
      width = format.width;
      height = format.height;
    } else {
      width = (_a2 = convertPrintParameterToInches(options.width, lengthUnit)) !== null && _a2 !== void 0 ? _a2 : width;
      height = (_b = convertPrintParameterToInches(options.height, lengthUnit)) !== null && _b !== void 0 ? _b : height;
    }
    const margin = {
      top: convertPrintParameterToInches((_c = options.margin) === null || _c === void 0 ? void 0 : _c.top, lengthUnit) || 0,
      left: convertPrintParameterToInches((_d = options.margin) === null || _d === void 0 ? void 0 : _d.left, lengthUnit) || 0,
      bottom: convertPrintParameterToInches((_e = options.margin) === null || _e === void 0 ? void 0 : _e.bottom, lengthUnit) || 0,
      right: convertPrintParameterToInches((_f = options.margin) === null || _f === void 0 ? void 0 : _f.right, lengthUnit) || 0
    };
    const output = {
      ...defaults,
      ...options,
      width,
      height,
      margin
    };
    return output;
  }
  async createPDFStream() {
    throw new Error("Not implemented");
  }
  async pdf() {
    throw new Error("Not implemented");
  }
  /**
   * The page's title
   *
   * @remarks
   * Shortcut for {@link Frame.title | page.mainFrame().title()}.
   */
  async title() {
    throw new Error("Not implemented");
  }
  async close() {
    throw new Error("Not implemented");
  }
  /**
   * Indicates that the page has been closed.
   * @returns
   */
  isClosed() {
    throw new Error("Not implemented");
  }
  /**
   * {@inheritDoc Mouse}
   */
  get mouse() {
    throw new Error("Not implemented");
  }
  click() {
    throw new Error("Not implemented");
  }
  focus() {
    throw new Error("Not implemented");
  }
  hover() {
    throw new Error("Not implemented");
  }
  select() {
    throw new Error("Not implemented");
  }
  tap() {
    throw new Error("Not implemented");
  }
  type() {
    throw new Error("Not implemented");
  }
  waitForTimeout() {
    throw new Error("Not implemented");
  }
  async waitForSelector() {
    throw new Error("Not implemented");
  }
  waitForXPath() {
    throw new Error("Not implemented");
  }
  waitForFunction() {
    throw new Error("Not implemented");
  }
  waitForDevicePrompt() {
    throw new Error("Not implemented");
  }
};
_Page_handlerMap = /* @__PURE__ */ new WeakMap();
var unitToPixels = {
  px: 1,
  in: 96,
  cm: 37.8,
  mm: 3.78
};
function convertPrintParameterToInches(parameter, lengthUnit = "in") {
  if (typeof parameter === "undefined") {
    return void 0;
  }
  let pixels;
  if (isNumber(parameter)) {
    pixels = parameter;
  } else if (isString(parameter)) {
    const text = parameter;
    let unit = text.substring(text.length - 2).toLowerCase();
    let valueText = "";
    if (unit in unitToPixels) {
      valueText = text.substring(0, text.length - 2);
    } else {
      unit = "px";
      valueText = text;
    }
    const value = Number(valueText);
    assert(!isNaN(value), "Failed to parse parameter value: " + text);
    pixels = value * unitToPixels[unit];
  } else {
    throw new Error("page.pdf() Cannot handle parameter type: " + typeof parameter);
  }
  return pixels / unitToPixels[lengthUnit];
}

// node_modules/puppeteer-core/lib/esm/puppeteer/util/DeferredPromise.js
function createDeferredPromise(opts) {
  let isResolved = false;
  let isRejected = false;
  let resolver;
  let rejector;
  const taskPromise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejector = reject;
  });
  const timeoutId = opts && opts.timeout > 0 ? setTimeout(() => {
    isRejected = true;
    rejector(new TimeoutError(opts.message));
  }, opts.timeout) : void 0;
  return Object.assign(taskPromise, {
    resolved: () => {
      return isResolved;
    },
    finished: () => {
      return isResolved || isRejected;
    },
    resolve: (value) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      isResolved = true;
      resolver(value);
    },
    reject: (err) => {
      clearTimeout(timeoutId);
      isRejected = true;
      rejector(err);
    }
  });
}

// node_modules/puppeteer-core/lib/esm/puppeteer/util/DebuggableDeferredPromise.js
function createDebuggableDeferredPromise(message) {
  if (DEFERRED_PROMISE_DEBUG_TIMEOUT > 0) {
    return createDeferredPromise({
      message,
      timeout: DEFERRED_PROMISE_DEBUG_TIMEOUT
    });
  }
  return createDeferredPromise();
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/Connection.js
var __classPrivateFieldSet6 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet9 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Callback_id;
var _Callback_error;
var _Callback_promise;
var _Callback_timer;
var _Callback_label;
var _CallbackRegistry_callbacks;
var _CallbackRegistry_idGenerator;
var _Connection_instances;
var _Connection_url;
var _Connection_transport;
var _Connection_delay;
var _Connection_timeout;
var _Connection_sessions;
var _Connection_closed;
var _Connection_manuallyAttached;
var _Connection_callbacks;
var _Connection_onClose;
var _CDPSessionImpl_sessionId;
var _CDPSessionImpl_targetType;
var _CDPSessionImpl_callbacks;
var _CDPSessionImpl_connection;
var debugProtocolSend = debug("puppeteer:protocol:SEND \u25BA");
var debugProtocolReceive = debug("puppeteer:protocol:RECV \u25C0");
var ConnectionEmittedEvents = {
  Disconnected: Symbol("Connection.Disconnected")
};
function createIncrementalIdGenerator() {
  let id = 0;
  return () => {
    return ++id;
  };
}
var Callback = class {
  constructor(id, label, timeout) {
    _Callback_id.set(this, void 0);
    _Callback_error.set(this, new ProtocolError());
    _Callback_promise.set(this, createDeferredPromise());
    _Callback_timer.set(this, void 0);
    _Callback_label.set(this, void 0);
    __classPrivateFieldSet6(this, _Callback_id, id, "f");
    __classPrivateFieldSet6(this, _Callback_label, label, "f");
    if (timeout) {
      __classPrivateFieldSet6(this, _Callback_timer, setTimeout(() => {
        __classPrivateFieldGet9(this, _Callback_promise, "f").reject(rewriteError(__classPrivateFieldGet9(this, _Callback_error, "f"), `${label} timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.`));
      }, timeout), "f");
    }
  }
  resolve(value) {
    clearTimeout(__classPrivateFieldGet9(this, _Callback_timer, "f"));
    __classPrivateFieldGet9(this, _Callback_promise, "f").resolve(value);
  }
  reject(error) {
    clearTimeout(__classPrivateFieldGet9(this, _Callback_timer, "f"));
    __classPrivateFieldGet9(this, _Callback_promise, "f").reject(error);
  }
  get id() {
    return __classPrivateFieldGet9(this, _Callback_id, "f");
  }
  get promise() {
    return __classPrivateFieldGet9(this, _Callback_promise, "f");
  }
  get error() {
    return __classPrivateFieldGet9(this, _Callback_error, "f");
  }
  get label() {
    return __classPrivateFieldGet9(this, _Callback_label, "f");
  }
};
_Callback_id = /* @__PURE__ */ new WeakMap(), _Callback_error = /* @__PURE__ */ new WeakMap(), _Callback_promise = /* @__PURE__ */ new WeakMap(), _Callback_timer = /* @__PURE__ */ new WeakMap(), _Callback_label = /* @__PURE__ */ new WeakMap();
var CallbackRegistry = class {
  constructor() {
    _CallbackRegistry_callbacks.set(this, /* @__PURE__ */ new Map());
    _CallbackRegistry_idGenerator.set(this, createIncrementalIdGenerator());
  }
  create(label, timeout, request) {
    const callback = new Callback(__classPrivateFieldGet9(this, _CallbackRegistry_idGenerator, "f").call(this), label, timeout);
    __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").set(callback.id, callback);
    try {
      request(callback.id);
    } catch (error) {
      callback.promise.catch(() => {
        __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").delete(callback.id);
      });
      callback.reject(error);
      throw error;
    }
    return callback.promise.finally(() => {
      __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").delete(callback.id);
    });
  }
  reject(id, message, originalMessage) {
    const callback = __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").get(id);
    if (!callback) {
      return;
    }
    this._reject(callback, message, originalMessage);
  }
  _reject(callback, message, originalMessage) {
    callback.reject(rewriteError(callback.error, `Protocol error (${callback.label}): ${message}`, originalMessage));
  }
  resolve(id, value) {
    const callback = __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").get(id);
    if (!callback) {
      return;
    }
    callback.resolve(value);
  }
  clear() {
    for (const callback of __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").values()) {
      this._reject(callback, "Target closed");
    }
    __classPrivateFieldGet9(this, _CallbackRegistry_callbacks, "f").clear();
  }
};
_CallbackRegistry_callbacks = /* @__PURE__ */ new WeakMap(), _CallbackRegistry_idGenerator = /* @__PURE__ */ new WeakMap();
var Connection = class extends EventEmitter {
  constructor(url, transport, delay = 0, timeout) {
    super();
    _Connection_instances.add(this);
    _Connection_url.set(this, void 0);
    _Connection_transport.set(this, void 0);
    _Connection_delay.set(this, void 0);
    _Connection_timeout.set(this, void 0);
    _Connection_sessions.set(this, /* @__PURE__ */ new Map());
    _Connection_closed.set(this, false);
    _Connection_manuallyAttached.set(this, /* @__PURE__ */ new Set());
    _Connection_callbacks.set(this, new CallbackRegistry());
    __classPrivateFieldSet6(this, _Connection_url, url, "f");
    __classPrivateFieldSet6(this, _Connection_delay, delay, "f");
    __classPrivateFieldSet6(this, _Connection_timeout, timeout !== null && timeout !== void 0 ? timeout : 18e4, "f");
    __classPrivateFieldSet6(this, _Connection_transport, transport, "f");
    __classPrivateFieldGet9(this, _Connection_transport, "f").onmessage = this.onMessage.bind(this);
    __classPrivateFieldGet9(this, _Connection_transport, "f").onclose = __classPrivateFieldGet9(this, _Connection_instances, "m", _Connection_onClose).bind(this);
  }
  static fromSession(session) {
    return session.connection();
  }
  get timeout() {
    return __classPrivateFieldGet9(this, _Connection_timeout, "f");
  }
  /**
   * @internal
   */
  get _closed() {
    return __classPrivateFieldGet9(this, _Connection_closed, "f");
  }
  /**
   * @internal
   */
  get _sessions() {
    return __classPrivateFieldGet9(this, _Connection_sessions, "f");
  }
  /**
   * @param sessionId - The session id
   * @returns The current CDP session if it exists
   */
  session(sessionId) {
    return __classPrivateFieldGet9(this, _Connection_sessions, "f").get(sessionId) || null;
  }
  url() {
    return __classPrivateFieldGet9(this, _Connection_url, "f");
  }
  send(method, ...paramArgs) {
    const params = paramArgs.length ? paramArgs[0] : void 0;
    return this._rawSend(__classPrivateFieldGet9(this, _Connection_callbacks, "f"), method, params);
  }
  /**
   * @internal
   */
  _rawSend(callbacks, method, params, sessionId) {
    return callbacks.create(method, __classPrivateFieldGet9(this, _Connection_timeout, "f"), (id) => {
      const stringifiedMessage = JSON.stringify({
        method,
        params,
        id,
        sessionId
      });
      debugProtocolSend(stringifiedMessage);
      __classPrivateFieldGet9(this, _Connection_transport, "f").send(stringifiedMessage);
    });
  }
  /**
   * @internal
   */
  async closeBrowser() {
    await this.send("Browser.close");
  }
  /**
   * @internal
   */
  async onMessage(message) {
    if (__classPrivateFieldGet9(this, _Connection_delay, "f")) {
      await new Promise((f) => {
        return setTimeout(f, __classPrivateFieldGet9(this, _Connection_delay, "f"));
      });
    }
    debugProtocolReceive(message);
    const object = JSON.parse(message);
    if (object.method === "Target.attachedToTarget") {
      const sessionId = object.params.sessionId;
      const session = new CDPSessionImpl(this, object.params.targetInfo.type, sessionId);
      __classPrivateFieldGet9(this, _Connection_sessions, "f").set(sessionId, session);
      this.emit("sessionattached", session);
      const parentSession = __classPrivateFieldGet9(this, _Connection_sessions, "f").get(object.sessionId);
      if (parentSession) {
        parentSession.emit("sessionattached", session);
      }
    } else if (object.method === "Target.detachedFromTarget") {
      const session = __classPrivateFieldGet9(this, _Connection_sessions, "f").get(object.params.sessionId);
      if (session) {
        session._onClosed();
        __classPrivateFieldGet9(this, _Connection_sessions, "f").delete(object.params.sessionId);
        this.emit("sessiondetached", session);
        const parentSession = __classPrivateFieldGet9(this, _Connection_sessions, "f").get(object.sessionId);
        if (parentSession) {
          parentSession.emit("sessiondetached", session);
        }
      }
    }
    if (object.sessionId) {
      const session = __classPrivateFieldGet9(this, _Connection_sessions, "f").get(object.sessionId);
      if (session) {
        session._onMessage(object);
      }
    } else if (object.id) {
      if (object.error) {
        __classPrivateFieldGet9(this, _Connection_callbacks, "f").reject(object.id, createProtocolErrorMessage(object), object.error.message);
      } else {
        __classPrivateFieldGet9(this, _Connection_callbacks, "f").resolve(object.id, object.result);
      }
    } else {
      this.emit(object.method, object.params);
    }
  }
  dispose() {
    __classPrivateFieldGet9(this, _Connection_instances, "m", _Connection_onClose).call(this);
    __classPrivateFieldGet9(this, _Connection_transport, "f").close();
  }
  /**
   * @internal
   */
  isAutoAttached(targetId) {
    return !__classPrivateFieldGet9(this, _Connection_manuallyAttached, "f").has(targetId);
  }
  /**
   * @internal
   */
  async _createSession(targetInfo, isAutoAttachEmulated = true) {
    if (!isAutoAttachEmulated) {
      __classPrivateFieldGet9(this, _Connection_manuallyAttached, "f").add(targetInfo.targetId);
    }
    const { sessionId } = await this.send("Target.attachToTarget", {
      targetId: targetInfo.targetId,
      flatten: true
    });
    __classPrivateFieldGet9(this, _Connection_manuallyAttached, "f").delete(targetInfo.targetId);
    const session = __classPrivateFieldGet9(this, _Connection_sessions, "f").get(sessionId);
    if (!session) {
      throw new Error("CDPSession creation failed.");
    }
    return session;
  }
  /**
   * @param targetInfo - The target info
   * @returns The CDP session that is created
   */
  async createSession(targetInfo) {
    return await this._createSession(targetInfo, false);
  }
};
_Connection_url = /* @__PURE__ */ new WeakMap(), _Connection_transport = /* @__PURE__ */ new WeakMap(), _Connection_delay = /* @__PURE__ */ new WeakMap(), _Connection_timeout = /* @__PURE__ */ new WeakMap(), _Connection_sessions = /* @__PURE__ */ new WeakMap(), _Connection_closed = /* @__PURE__ */ new WeakMap(), _Connection_manuallyAttached = /* @__PURE__ */ new WeakMap(), _Connection_callbacks = /* @__PURE__ */ new WeakMap(), _Connection_instances = /* @__PURE__ */ new WeakSet(), _Connection_onClose = function _Connection_onClose2() {
  if (__classPrivateFieldGet9(this, _Connection_closed, "f")) {
    return;
  }
  __classPrivateFieldSet6(this, _Connection_closed, true, "f");
  __classPrivateFieldGet9(this, _Connection_transport, "f").onmessage = void 0;
  __classPrivateFieldGet9(this, _Connection_transport, "f").onclose = void 0;
  __classPrivateFieldGet9(this, _Connection_callbacks, "f").clear();
  for (const session of __classPrivateFieldGet9(this, _Connection_sessions, "f").values()) {
    session._onClosed();
  }
  __classPrivateFieldGet9(this, _Connection_sessions, "f").clear();
  this.emit(ConnectionEmittedEvents.Disconnected);
};
var CDPSessionEmittedEvents = {
  Disconnected: Symbol("CDPSession.Disconnected")
};
var CDPSession = class extends EventEmitter {
  /**
   * @internal
   */
  constructor() {
    super();
  }
  connection() {
    throw new Error("Not implemented");
  }
  send() {
    throw new Error("Not implemented");
  }
  /**
   * Detaches the cdpSession from the target. Once detached, the cdpSession object
   * won't emit any events and can't be used to send messages.
   */
  async detach() {
    throw new Error("Not implemented");
  }
  /**
   * Returns the session's id.
   */
  id() {
    throw new Error("Not implemented");
  }
};
var CDPSessionImpl = class extends CDPSession {
  /**
   * @internal
   */
  constructor(connection, targetType, sessionId) {
    super();
    _CDPSessionImpl_sessionId.set(this, void 0);
    _CDPSessionImpl_targetType.set(this, void 0);
    _CDPSessionImpl_callbacks.set(this, new CallbackRegistry());
    _CDPSessionImpl_connection.set(this, void 0);
    __classPrivateFieldSet6(this, _CDPSessionImpl_connection, connection, "f");
    __classPrivateFieldSet6(this, _CDPSessionImpl_targetType, targetType, "f");
    __classPrivateFieldSet6(this, _CDPSessionImpl_sessionId, sessionId, "f");
  }
  connection() {
    return __classPrivateFieldGet9(this, _CDPSessionImpl_connection, "f");
  }
  send(method, ...paramArgs) {
    if (!__classPrivateFieldGet9(this, _CDPSessionImpl_connection, "f")) {
      return Promise.reject(new Error(`Protocol error (${method}): Session closed. Most likely the ${__classPrivateFieldGet9(this, _CDPSessionImpl_targetType, "f")} has been closed.`));
    }
    const params = paramArgs.length ? paramArgs[0] : void 0;
    return __classPrivateFieldGet9(this, _CDPSessionImpl_connection, "f")._rawSend(__classPrivateFieldGet9(this, _CDPSessionImpl_callbacks, "f"), method, params, __classPrivateFieldGet9(this, _CDPSessionImpl_sessionId, "f"));
  }
  /**
   * @internal
   */
  _onMessage(object) {
    if (object.id) {
      if (object.error) {
        __classPrivateFieldGet9(this, _CDPSessionImpl_callbacks, "f").reject(object.id, createProtocolErrorMessage(object), object.error.message);
      } else {
        __classPrivateFieldGet9(this, _CDPSessionImpl_callbacks, "f").resolve(object.id, object.result);
      }
    } else {
      assert(!object.id);
      this.emit(object.method, object.params);
    }
  }
  /**
   * Detaches the cdpSession from the target. Once detached, the cdpSession object
   * won't emit any events and can't be used to send messages.
   */
  async detach() {
    if (!__classPrivateFieldGet9(this, _CDPSessionImpl_connection, "f")) {
      throw new Error(`Session already detached. Most likely the ${__classPrivateFieldGet9(this, _CDPSessionImpl_targetType, "f")} has been closed.`);
    }
    await __classPrivateFieldGet9(this, _CDPSessionImpl_connection, "f").send("Target.detachFromTarget", {
      sessionId: __classPrivateFieldGet9(this, _CDPSessionImpl_sessionId, "f")
    });
  }
  /**
   * @internal
   */
  _onClosed() {
    __classPrivateFieldGet9(this, _CDPSessionImpl_callbacks, "f").clear();
    __classPrivateFieldSet6(this, _CDPSessionImpl_connection, void 0, "f");
    this.emit(CDPSessionEmittedEvents.Disconnected);
  }
  /**
   * Returns the session's id.
   */
  id() {
    return __classPrivateFieldGet9(this, _CDPSessionImpl_sessionId, "f");
  }
};
_CDPSessionImpl_sessionId = /* @__PURE__ */ new WeakMap(), _CDPSessionImpl_targetType = /* @__PURE__ */ new WeakMap(), _CDPSessionImpl_callbacks = /* @__PURE__ */ new WeakMap(), _CDPSessionImpl_connection = /* @__PURE__ */ new WeakMap();
function createProtocolErrorMessage(object) {
  let message = `${object.error.message}`;
  if ("data" in object.error) {
    message += ` ${object.error.data}`;
  }
  return message;
}
function rewriteError(error, message, originalMessage) {
  error.message = message;
  error.originalMessage = originalMessage !== null && originalMessage !== void 0 ? originalMessage : error.originalMessage;
  return error;
}
function isTargetClosedError(err) {
  return err.message.includes("Target closed") || err.message.includes("Session closed");
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/ConsoleMessage.js
var __classPrivateFieldSet7 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet10 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ConsoleMessage_type;
var _ConsoleMessage_text;
var _ConsoleMessage_args;
var _ConsoleMessage_stackTraceLocations;
var ConsoleMessage = class {
  /**
   * @public
   */
  constructor(type, text, args, stackTraceLocations) {
    _ConsoleMessage_type.set(this, void 0);
    _ConsoleMessage_text.set(this, void 0);
    _ConsoleMessage_args.set(this, void 0);
    _ConsoleMessage_stackTraceLocations.set(this, void 0);
    __classPrivateFieldSet7(this, _ConsoleMessage_type, type, "f");
    __classPrivateFieldSet7(this, _ConsoleMessage_text, text, "f");
    __classPrivateFieldSet7(this, _ConsoleMessage_args, args, "f");
    __classPrivateFieldSet7(this, _ConsoleMessage_stackTraceLocations, stackTraceLocations, "f");
  }
  /**
   * The type of the console message.
   */
  type() {
    return __classPrivateFieldGet10(this, _ConsoleMessage_type, "f");
  }
  /**
   * The text of the console message.
   */
  text() {
    return __classPrivateFieldGet10(this, _ConsoleMessage_text, "f");
  }
  /**
   * An array of arguments passed to the console.
   */
  args() {
    return __classPrivateFieldGet10(this, _ConsoleMessage_args, "f");
  }
  /**
   * The location of the console message.
   */
  location() {
    var _a2;
    return (_a2 = __classPrivateFieldGet10(this, _ConsoleMessage_stackTraceLocations, "f")[0]) !== null && _a2 !== void 0 ? _a2 : {};
  }
  /**
   * The array of locations on the stack of the console message.
   */
  stackTrace() {
    return __classPrivateFieldGet10(this, _ConsoleMessage_stackTraceLocations, "f");
  }
};
_ConsoleMessage_type = /* @__PURE__ */ new WeakMap(), _ConsoleMessage_text = /* @__PURE__ */ new WeakMap(), _ConsoleMessage_args = /* @__PURE__ */ new WeakMap(), _ConsoleMessage_stackTraceLocations = /* @__PURE__ */ new WeakMap();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/TimeoutSettings.js
var __classPrivateFieldSet8 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet11 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TimeoutSettings_defaultTimeout;
var _TimeoutSettings_defaultNavigationTimeout;
var DEFAULT_TIMEOUT = 3e4;
var TimeoutSettings = class {
  constructor() {
    _TimeoutSettings_defaultTimeout.set(this, void 0);
    _TimeoutSettings_defaultNavigationTimeout.set(this, void 0);
    __classPrivateFieldSet8(this, _TimeoutSettings_defaultTimeout, null, "f");
    __classPrivateFieldSet8(this, _TimeoutSettings_defaultNavigationTimeout, null, "f");
  }
  setDefaultTimeout(timeout) {
    __classPrivateFieldSet8(this, _TimeoutSettings_defaultTimeout, timeout, "f");
  }
  setDefaultNavigationTimeout(timeout) {
    __classPrivateFieldSet8(this, _TimeoutSettings_defaultNavigationTimeout, timeout, "f");
  }
  navigationTimeout() {
    if (__classPrivateFieldGet11(this, _TimeoutSettings_defaultNavigationTimeout, "f") !== null) {
      return __classPrivateFieldGet11(this, _TimeoutSettings_defaultNavigationTimeout, "f");
    }
    if (__classPrivateFieldGet11(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
      return __classPrivateFieldGet11(this, _TimeoutSettings_defaultTimeout, "f");
    }
    return DEFAULT_TIMEOUT;
  }
  timeout() {
    if (__classPrivateFieldGet11(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
      return __classPrivateFieldGet11(this, _TimeoutSettings_defaultTimeout, "f");
    }
    return DEFAULT_TIMEOUT;
  }
};
_TimeoutSettings_defaultTimeout = /* @__PURE__ */ new WeakMap(), _TimeoutSettings_defaultNavigationTimeout = /* @__PURE__ */ new WeakMap();

export {
  EventEmitter,
  WEB_PERMISSION_TO_PROTOCOL_PERMISSION,
  Browser,
  BrowserContext,
  isNode,
  assert,
  isErrorLike,
  debug,
  JSHandle,
  ElementHandle,
  AsyncIterableUtil,
  stringifyFunction,
  TimeoutError,
  AbortError,
  ProtocolError,
  MAIN_WORLD,
  PUPPETEER_WORLD,
  LazyArg,
  ARIAQueryHandler,
  scriptInjector,
  customQueryHandlers,
  getQueryHandlerAndSelector,
  CDPJSHandle,
  CDPElementHandle,
  debugError,
  getExceptionMessage,
  valueFromRemoteObject,
  releaseObject,
  addEventListener,
  removeEventListeners,
  isString,
  isPlainObject,
  isRegExp,
  isDate,
  waitForEvent,
  createJSHandle,
  evaluationString,
  addPageBinding,
  pageBindingInitString,
  waitWithTimeout,
  importFSPromises,
  getReadableAsBuffer,
  getReadableFromProtocolStream,
  setPageContent,
  Page,
  createDeferredPromise,
  createDebuggableDeferredPromise,
  ConnectionEmittedEvents,
  CallbackRegistry,
  Connection,
  CDPSessionEmittedEvents,
  isTargetClosedError,
  ConsoleMessage,
  TimeoutSettings
};
