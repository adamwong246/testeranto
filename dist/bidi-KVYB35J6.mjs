import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Browser,
  BrowserContext,
  CallbackRegistry,
  ConsoleMessage,
  ElementHandle,
  EventEmitter,
  JSHandle,
  Page,
  ProtocolError,
  TimeoutError,
  TimeoutSettings,
  assert,
  debug,
  debugError,
  isDate,
  isErrorLike,
  isPlainObject,
  isRegExp,
  isString,
  setPageContent,
  stringifyFunction,
  waitWithTimeout
} from "./chunk-575CR37A.mjs";
import {
  __commonJS,
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __privateWrapper,
  __publicField,
  __toESM
} from "./chunk-UDP42ARI.mjs";

// node_modules/mitt/dist/mitt.js
var require_mitt = __commonJS({
  "node_modules/mitt/dist/mitt.js"(exports, module) {
    module.exports = function(n) {
      return { all: n = n || /* @__PURE__ */ new Map(), on: function(e, t) {
        var i = n.get(e);
        i ? i.push(t) : n.set(e, [t]);
      }, off: function(e, t) {
        var i = n.get(e);
        i && (t ? i.splice(i.indexOf(t) >>> 0, 1) : n.set(e, []));
      }, emit: function(e, t) {
        var i = n.get(e);
        i && i.slice().map(function(n2) {
          n2(t);
        }), (i = n.get("*")) && i.slice().map(function(n2) {
          n2(e, t);
        });
      } };
    };
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/EventEmitter.js
var require_EventEmitter = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/EventEmitter.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventEmitter = void 0;
    var mitt_1 = __importDefault(require_mitt());
    var EventEmitter3 = class {
      #emitter = (0, mitt_1.default)();
      on(type, handler) {
        this.#emitter.on(type, handler);
        return this;
      }
      /**
       * Like `on` but the listener will only be fired once and then it will be removed.
       * @param event The event you'd like to listen to
       * @param handler The handler function to run when the event occurs
       * @return `this` to enable chaining method calls.
       */
      once(event, handler) {
        const onceHandler = (eventData) => {
          handler(eventData);
          this.off(event, onceHandler);
        };
        return this.on(event, onceHandler);
      }
      off(type, handler) {
        this.#emitter.off(type, handler);
        return this;
      }
      /**
       * Emits an event and call any associated listeners.
       *
       * @param event The event to emit.
       * @param eventData Any data to emit with the event.
       * @return `true` if there are any listeners, `false` otherwise.
       */
      emit(event, eventData) {
        this.#emitter.emit(event, eventData);
      }
    };
    exports.EventEmitter = EventEmitter3;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/log.js
var require_log = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogType = void 0;
    var LogType;
    (function(LogType2) {
      LogType2["bidi"] = "BiDi Messages";
      LogType2["browsingContexts"] = "Browsing Contexts";
      LogType2["cdp"] = "CDP";
      LogType2["system"] = "System";
    })(LogType = exports.LogType || (exports.LogType = {}));
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/processingQueue.js
var require_processingQueue = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/processingQueue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProcessingQueue = void 0;
    var log_js_1 = require_log();
    var ProcessingQueue = class {
      #catch;
      #logger;
      #processor;
      #queue = [];
      // Flag to keep only 1 active processor.
      #isProcessing = false;
      constructor(processor, _catch = () => Promise.resolve(), logger) {
        this.#catch = _catch;
        this.#processor = processor;
        this.#logger = logger;
      }
      add(entry) {
        this.#queue.push(entry);
        void this.#processIfNeeded();
      }
      async #processIfNeeded() {
        if (this.#isProcessing) {
          return;
        }
        this.#isProcessing = true;
        while (this.#queue.length > 0) {
          const entryPromise = this.#queue.shift();
          if (entryPromise !== void 0) {
            await entryPromise.then((entry) => this.#processor(entry)).catch((e) => {
              this.#logger?.(log_js_1.LogType.system, "Event was not processed:", e);
              this.#catch(e);
            });
          }
        }
        this.#isProcessing = false;
      }
    };
    exports.ProcessingQueue = ProcessingQueue;
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/protocol.js
var require_protocol = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/protocol.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CDP = exports.Network = exports.Log = exports.BrowsingContext = exports.Script = exports.Message = void 0;
    var Message;
    (function(Message2) {
      let ErrorCode;
      (function(ErrorCode2) {
        ErrorCode2["InvalidArgument"] = "invalid argument";
        ErrorCode2["InvalidSessionId"] = "invalid session id";
        ErrorCode2["NoSuchAlert"] = "no such alert";
        ErrorCode2["NoSuchFrame"] = "no such frame";
        ErrorCode2["NoSuchHandle"] = "no such handle";
        ErrorCode2["NoSuchNode"] = "no such node";
        ErrorCode2["NoSuchScript"] = "no such script";
        ErrorCode2["SessionNotCreated"] = "session not created";
        ErrorCode2["UnknownCommand"] = "unknown command";
        ErrorCode2["UnknownError"] = "unknown error";
        ErrorCode2["UnsupportedOperation"] = "unsupported operation";
      })(ErrorCode = Message2.ErrorCode || (Message2.ErrorCode = {}));
      class ErrorResponse {
        error;
        message;
        stacktrace;
        constructor(error, message, stacktrace) {
          this.error = error;
          this.message = message;
          this.stacktrace = stacktrace;
        }
        toErrorResponse(commandId) {
          return {
            id: commandId,
            error: this.error,
            message: this.message,
            stacktrace: this.stacktrace
          };
        }
      }
      Message2.ErrorResponse = ErrorResponse;
      class InvalidArgumentException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.InvalidArgument, message, stacktrace);
        }
      }
      Message2.InvalidArgumentException = InvalidArgumentException;
      class NoSuchHandleException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.NoSuchHandle, message, stacktrace);
        }
      }
      Message2.NoSuchHandleException = NoSuchHandleException;
      class InvalidSessionIdException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.InvalidSessionId, message, stacktrace);
        }
      }
      Message2.InvalidSessionIdException = InvalidSessionIdException;
      class NoSuchAlertException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.NoSuchAlert, message, stacktrace);
        }
      }
      Message2.NoSuchAlertException = NoSuchAlertException;
      class NoSuchFrameException extends ErrorResponse {
        constructor(message) {
          super(ErrorCode.NoSuchFrame, message);
        }
      }
      Message2.NoSuchFrameException = NoSuchFrameException;
      class NoSuchNodeException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.NoSuchNode, message, stacktrace);
        }
      }
      Message2.NoSuchNodeException = NoSuchNodeException;
      class NoSuchScriptException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.NoSuchScript, message, stacktrace);
        }
      }
      Message2.NoSuchScriptException = NoSuchScriptException;
      class SessionNotCreatedException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.SessionNotCreated, message, stacktrace);
        }
      }
      Message2.SessionNotCreatedException = SessionNotCreatedException;
      class UnknownCommandException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.UnknownCommand, message, stacktrace);
        }
      }
      Message2.UnknownCommandException = UnknownCommandException;
      class UnknownErrorException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.UnknownError, message, stacktrace);
        }
      }
      Message2.UnknownErrorException = UnknownErrorException;
      class UnsupportedOperationException extends ErrorResponse {
        constructor(message, stacktrace) {
          super(ErrorCode.UnsupportedOperation, message, stacktrace);
        }
      }
      Message2.UnsupportedOperationException = UnsupportedOperationException;
    })(Message = exports.Message || (exports.Message = {}));
    var Script;
    (function(Script2) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["MessageEvent"] = "script.message";
      })(EventNames = Script2.EventNames || (Script2.EventNames = {}));
      Script2.AllEvents = "script";
    })(Script = exports.Script || (exports.Script = {}));
    var BrowsingContext;
    (function(BrowsingContext2) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["LoadEvent"] = "browsingContext.load";
        EventNames2["DomContentLoadedEvent"] = "browsingContext.domContentLoaded";
        EventNames2["ContextCreatedEvent"] = "browsingContext.contextCreated";
        EventNames2["ContextDestroyedEvent"] = "browsingContext.contextDestroyed";
      })(EventNames = BrowsingContext2.EventNames || (BrowsingContext2.EventNames = {}));
      BrowsingContext2.AllEvents = "browsingContext";
    })(BrowsingContext = exports.BrowsingContext || (exports.BrowsingContext = {}));
    var Log;
    (function(Log2) {
      Log2.AllEvents = "log";
      let EventNames;
      (function(EventNames2) {
        EventNames2["LogEntryAddedEvent"] = "log.entryAdded";
      })(EventNames = Log2.EventNames || (Log2.EventNames = {}));
    })(Log = exports.Log || (exports.Log = {}));
    var Network;
    (function(Network2) {
      Network2.AllEvents = "network";
      let EventNames;
      (function(EventNames2) {
        EventNames2["BeforeRequestSentEvent"] = "network.beforeRequestSent";
        EventNames2["ResponseCompletedEvent"] = "network.responseCompleted";
        EventNames2["FetchErrorEvent"] = "network.fetchError";
      })(EventNames = Network2.EventNames || (Network2.EventNames = {}));
    })(Network = exports.Network || (exports.Network = {}));
    var CDP;
    (function(CDP2) {
      CDP2.AllEvents = "cdp";
      let EventNames;
      (function(EventNames2) {
        EventNames2["EventReceivedEvent"] = "cdp.eventReceived";
      })(EventNames = CDP2.EventNames || (CDP2.EventNames = {}));
    })(CDP = exports.CDP || (exports.CDP = {}));
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/unitConversions.js
var require_unitConversions = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/unitConversions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.inchesFromCm = void 0;
    function inchesFromCm(cm) {
      return cm / 2.54;
    }
    exports.inchesFromCm = inchesFromCm;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/deferred.js
var require_deferred = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/deferred.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deferred = void 0;
    var Deferred = class {
      #isFinished = false;
      #promise;
      #resolve = () => {
      };
      #reject = () => {
      };
      get isFinished() {
        return this.#isFinished;
      }
      constructor() {
        this.#promise = new Promise((resolve, reject) => {
          this.#resolve = resolve;
          this.#reject = reject;
        });
        this.#promise.catch(() => {
        });
      }
      then(onFulfilled, onRejected) {
        return this.#promise.then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this.#promise.catch(onRejected);
      }
      resolve(value) {
        this.#isFinished = true;
        this.#resolve(value);
      }
      reject(reason) {
        this.#isFinished = true;
        this.#reject(reason);
      }
      finally(onFinally) {
        return this.#promise.finally(onFinally);
      }
      [Symbol.toStringTag] = "Promise";
    };
    exports.Deferred = Deferred;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/script/scriptEvaluator.js
var require_scriptEvaluator = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/script/scriptEvaluator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScriptEvaluator = exports.SHARED_ID_DIVIDER = void 0;
    var protocol_js_1 = require_protocol();
    var CALL_FUNCTION_STACKTRACE_LINE_OFFSET = 1;
    var EVALUATE_STACKTRACE_LINE_OFFSET = 0;
    exports.SHARED_ID_DIVIDER = "_element_";
    var _eventManager, _cdpRemoteObjectToCallArgument, cdpRemoteObjectToCallArgument_fn, _deserializeToCdpArg, deserializeToCdpArg_fn, _flattenKeyValuePairs, flattenKeyValuePairs_fn, _flattenValueList, flattenValueList_fn, _initChannelListener, initChannelListener_fn, _serializeCdpExceptionDetails, serializeCdpExceptionDetails_fn;
    var _ScriptEvaluator = class {
      constructor(eventManager) {
        __privateAdd(this, _deserializeToCdpArg);
        __privateAdd(this, _flattenKeyValuePairs);
        __privateAdd(this, _flattenValueList);
        __privateAdd(this, _initChannelListener);
        __privateAdd(this, _serializeCdpExceptionDetails);
        __privateAdd(this, _eventManager, void 0);
        __privateSet(this, _eventManager, eventManager);
      }
      /**
       * Gets the string representation of an object. This is equivalent to
       * calling toString() on the object value.
       * @param cdpObject CDP remote object representing an object.
       * @param realm
       * @return string The stringified object.
       */
      static async stringifyObject(cdpObject, realm) {
        const stringifyResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((obj) => {
            return String(obj);
          }),
          awaitPromise: false,
          arguments: [cdpObject],
          returnByValue: true,
          executionContextId: realm.executionContextId
        });
        return stringifyResult.result.value;
      }
      /**
       * Serializes a given CDP object into BiDi, keeping references in the
       * target's `globalThis`.
       * @param cdpRemoteObject CDP remote object to be serialized.
       * @param resultOwnership Indicates desired ResultOwnership.
       * @param realm
       */
      async serializeCdpObject(cdpRemoteObject, resultOwnership, realm) {
        var _a;
        const arg = __privateMethod(_a = _ScriptEvaluator, _cdpRemoteObjectToCallArgument, cdpRemoteObjectToCallArgument_fn).call(_a, cdpRemoteObject);
        const cdpWebDriverValue = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((obj) => obj),
          awaitPromise: false,
          arguments: [arg],
          generateWebDriverValue: true,
          executionContextId: realm.executionContextId
        });
        return realm.cdpToBidiValue(cdpWebDriverValue, resultOwnership);
      }
      async scriptEvaluate(realm, expression, awaitPromise, resultOwnership) {
        const cdpEvaluateResult = await realm.cdpClient.sendCommand("Runtime.evaluate", {
          contextId: realm.executionContextId,
          expression,
          awaitPromise,
          generateWebDriverValue: true
        });
        if (cdpEvaluateResult.exceptionDetails) {
          return {
            exceptionDetails: await __privateMethod(this, _serializeCdpExceptionDetails, serializeCdpExceptionDetails_fn).call(this, cdpEvaluateResult.exceptionDetails, EVALUATE_STACKTRACE_LINE_OFFSET, resultOwnership, realm),
            type: "exception",
            realm: realm.realmId
          };
        }
        return {
          type: "success",
          result: realm.cdpToBidiValue(cdpEvaluateResult, resultOwnership),
          realm: realm.realmId
        };
      }
      async callFunction(realm, functionDeclaration, _this, _arguments, awaitPromise, resultOwnership) {
        const callFunctionAndSerializeScript = `(...args)=>{ return _callFunction((
${functionDeclaration}
), args);
      function _callFunction(f, args) {
        const deserializedThis = args.shift();
        const deserializedArgs = args;
        return f.apply(deserializedThis, deserializedArgs);
      }}`;
        const thisAndArgumentsList = [
          await __privateMethod(this, _deserializeToCdpArg, deserializeToCdpArg_fn).call(this, _this, realm)
        ];
        thisAndArgumentsList.push(...await Promise.all(_arguments.map(async (a) => {
          return __privateMethod(this, _deserializeToCdpArg, deserializeToCdpArg_fn).call(this, a, realm);
        })));
        let cdpCallFunctionResult;
        try {
          cdpCallFunctionResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: callFunctionAndSerializeScript,
            awaitPromise,
            arguments: thisAndArgumentsList,
            generateWebDriverValue: true,
            executionContextId: realm.executionContextId
          });
        } catch (e) {
          if (e.code === -32e3 && [
            "Could not find object with given id",
            "Argument should belong to the same JavaScript world as target object",
            "Invalid remote object id"
          ].includes(e.message)) {
            throw new protocol_js_1.Message.NoSuchHandleException("Handle was not found.");
          }
          throw e;
        }
        if (cdpCallFunctionResult.exceptionDetails) {
          return {
            exceptionDetails: await __privateMethod(this, _serializeCdpExceptionDetails, serializeCdpExceptionDetails_fn).call(this, cdpCallFunctionResult.exceptionDetails, CALL_FUNCTION_STACKTRACE_LINE_OFFSET, resultOwnership, realm),
            type: "exception",
            realm: realm.realmId
          };
        }
        return {
          type: "success",
          result: realm.cdpToBidiValue(cdpCallFunctionResult, resultOwnership),
          realm: realm.realmId
        };
      }
    };
    var ScriptEvaluator = _ScriptEvaluator;
    _eventManager = new WeakMap();
    _cdpRemoteObjectToCallArgument = new WeakSet();
    cdpRemoteObjectToCallArgument_fn = function(cdpRemoteObject) {
      if (cdpRemoteObject.objectId !== void 0) {
        return { objectId: cdpRemoteObject.objectId };
      }
      if (cdpRemoteObject.unserializableValue !== void 0) {
        return { unserializableValue: cdpRemoteObject.unserializableValue };
      }
      return { value: cdpRemoteObject.value };
    };
    _deserializeToCdpArg = new WeakSet();
    deserializeToCdpArg_fn = async function(argumentValue, realm) {
      if ("sharedId" in argumentValue) {
        const [navigableId, rawBackendNodeId] = argumentValue.sharedId.split(exports.SHARED_ID_DIVIDER);
        const backendNodeId = parseInt(rawBackendNodeId ?? "");
        if (isNaN(backendNodeId) || backendNodeId === void 0 || navigableId === void 0) {
          throw new protocol_js_1.Message.InvalidArgumentException(`SharedId "${argumentValue.sharedId}" should have format "{navigableId}${exports.SHARED_ID_DIVIDER}{backendNodeId}".`);
        }
        if (realm.navigableId !== navigableId) {
          throw new protocol_js_1.Message.NoSuchNodeException(`SharedId "${argumentValue.sharedId}" belongs to different document. Current document is ${realm.navigableId}.`);
        }
        try {
          const obj = await realm.cdpClient.sendCommand("DOM.resolveNode", {
            backendNodeId,
            executionContextId: realm.executionContextId
          });
          return { objectId: obj.object.objectId };
        } catch (e) {
          if (e.code === -32e3 && e.message === "No node with given id found") {
            throw new protocol_js_1.Message.NoSuchNodeException(`SharedId "${argumentValue.sharedId}" was not found.`);
          }
          throw e;
        }
      }
      if ("handle" in argumentValue) {
        return { objectId: argumentValue.handle };
      }
      switch (argumentValue.type) {
        case "undefined":
          return { unserializableValue: "undefined" };
        case "null":
          return { unserializableValue: "null" };
        case "string":
          return { value: argumentValue.value };
        case "number":
          if (argumentValue.value === "NaN") {
            return { unserializableValue: "NaN" };
          } else if (argumentValue.value === "-0") {
            return { unserializableValue: "-0" };
          } else if (argumentValue.value === "Infinity") {
            return { unserializableValue: "Infinity" };
          } else if (argumentValue.value === "-Infinity") {
            return { unserializableValue: "-Infinity" };
          }
          return {
            value: argumentValue.value
          };
        case "boolean":
          return { value: Boolean(argumentValue.value) };
        case "bigint":
          return {
            unserializableValue: `BigInt(${JSON.stringify(argumentValue.value)})`
          };
        case "date":
          return {
            unserializableValue: `new Date(Date.parse(${JSON.stringify(argumentValue.value)}))`
          };
        case "regexp":
          return {
            unserializableValue: `new RegExp(${JSON.stringify(argumentValue.value.pattern)}, ${JSON.stringify(argumentValue.value.flags)})`
          };
        case "map": {
          const keyValueArray = await __privateMethod(this, _flattenKeyValuePairs, flattenKeyValuePairs_fn).call(this, argumentValue.value, realm);
          const argEvalResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String((...args) => {
              const result = /* @__PURE__ */ new Map();
              for (let i = 0; i < args.length; i += 2) {
                result.set(args[i], args[i + 1]);
              }
              return result;
            }),
            awaitPromise: false,
            arguments: keyValueArray,
            returnByValue: false,
            executionContextId: realm.executionContextId
          });
          return { objectId: argEvalResult.result.objectId };
        }
        case "object": {
          const keyValueArray = await __privateMethod(this, _flattenKeyValuePairs, flattenKeyValuePairs_fn).call(this, argumentValue.value, realm);
          const argEvalResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String((...args) => {
              const result = {};
              for (let i = 0; i < args.length; i += 2) {
                const key = args[i];
                result[key] = args[i + 1];
              }
              return result;
            }),
            awaitPromise: false,
            arguments: keyValueArray,
            returnByValue: false,
            executionContextId: realm.executionContextId
          });
          return { objectId: argEvalResult.result.objectId };
        }
        case "array": {
          const args = await __privateMethod(this, _flattenValueList, flattenValueList_fn).call(this, argumentValue.value, realm);
          const argEvalResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String((...args2) => {
              return args2;
            }),
            awaitPromise: false,
            arguments: args,
            returnByValue: false,
            executionContextId: realm.executionContextId
          });
          return { objectId: argEvalResult.result.objectId };
        }
        case "set": {
          const args = await __privateMethod(this, _flattenValueList, flattenValueList_fn).call(this, argumentValue.value, realm);
          const argEvalResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String((...args2) => {
              return new Set(args2);
            }),
            awaitPromise: false,
            arguments: args,
            returnByValue: false,
            executionContextId: realm.executionContextId
          });
          return { objectId: argEvalResult.result.objectId };
        }
        case "channel": {
          const createChannelHandleResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String(() => {
              const queue = [];
              let queueNonEmptyResolver = null;
              return {
                /**
                 * Gets a promise, which is resolved as soon as a message occurs
                 * in the queue.
                 */
                async getMessage() {
                  const onMessage = queue.length > 0 ? Promise.resolve() : new Promise((resolve) => {
                    queueNonEmptyResolver = resolve;
                  });
                  await onMessage;
                  return queue.shift();
                },
                /**
                 * Adds a message to the queue.
                 * Resolves the pending promise if needed.
                 */
                sendMessage(message) {
                  queue.push(message);
                  if (queueNonEmptyResolver !== null) {
                    queueNonEmptyResolver();
                    queueNonEmptyResolver = null;
                  }
                }
              };
            }),
            returnByValue: false,
            executionContextId: realm.executionContextId,
            generateWebDriverValue: false
          });
          const channelHandle = createChannelHandleResult.result.objectId;
          void __privateMethod(this, _initChannelListener, initChannelListener_fn).call(this, argumentValue, channelHandle, realm);
          const sendMessageArgResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String((channelHandle2) => {
              return channelHandle2.sendMessage;
            }),
            arguments: [
              {
                objectId: channelHandle
              }
            ],
            returnByValue: false,
            executionContextId: realm.executionContextId,
            generateWebDriverValue: false
          });
          return { objectId: sendMessageArgResult.result.objectId };
        }
        default:
          throw new Error(`Value ${JSON.stringify(argumentValue)} is not deserializable.`);
      }
    };
    _flattenKeyValuePairs = new WeakSet();
    flattenKeyValuePairs_fn = async function(mapping, realm) {
      const keyValueArray = [];
      for (const [key, value] of mapping) {
        let keyArg;
        if (typeof key === "string") {
          keyArg = { value: key };
        } else {
          keyArg = await __privateMethod(this, _deserializeToCdpArg, deserializeToCdpArg_fn).call(this, key, realm);
        }
        const valueArg = await __privateMethod(this, _deserializeToCdpArg, deserializeToCdpArg_fn).call(this, value, realm);
        keyValueArray.push(keyArg);
        keyValueArray.push(valueArg);
      }
      return keyValueArray;
    };
    _flattenValueList = new WeakSet();
    flattenValueList_fn = async function(list, realm) {
      return Promise.all(list.map((value) => __privateMethod(this, _deserializeToCdpArg, deserializeToCdpArg_fn).call(this, value, realm)));
    };
    _initChannelListener = new WeakSet();
    initChannelListener_fn = async function(channel, channelHandle, realm) {
      const channelId = channel.value.channel;
      for (; ; ) {
        const message = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String(async (channelHandle2) => channelHandle2.getMessage()),
          arguments: [
            {
              objectId: channelHandle
            }
          ],
          awaitPromise: true,
          executionContextId: realm.executionContextId,
          generateWebDriverValue: true
        });
        __privateGet(this, _eventManager).registerEvent({
          method: protocol_js_1.Script.EventNames.MessageEvent,
          params: {
            channel: channelId,
            data: realm.cdpToBidiValue(message, channel.value.ownership ?? "none"),
            source: {
              realm: realm.realmId,
              context: realm.browsingContextId
            }
          }
        }, realm.browsingContextId);
      }
    };
    _serializeCdpExceptionDetails = new WeakSet();
    serializeCdpExceptionDetails_fn = async function(cdpExceptionDetails, lineOffset, resultOwnership, realm) {
      const callFrames = cdpExceptionDetails.stackTrace?.callFrames.map((frame) => ({
        url: frame.url,
        functionName: frame.functionName,
        // As `script.evaluate` wraps call into serialization script, so
        // `lineNumber` should be adjusted.
        lineNumber: frame.lineNumber - lineOffset,
        columnNumber: frame.columnNumber
      }));
      const exception = await this.serializeCdpObject(
        // Exception should always be there.
        cdpExceptionDetails.exception,
        resultOwnership,
        realm
      );
      const text = await _ScriptEvaluator.stringifyObject(cdpExceptionDetails.exception, realm);
      return {
        exception,
        columnNumber: cdpExceptionDetails.columnNumber,
        // As `script.evaluate` wraps call into serialization script, so
        // `lineNumber` should be adjusted.
        lineNumber: cdpExceptionDetails.lineNumber - lineOffset,
        stackTrace: {
          callFrames: callFrames || []
        },
        text: text || cdpExceptionDetails.text
      };
    };
    __privateAdd(ScriptEvaluator, _cdpRemoteObjectToCallArgument);
    exports.ScriptEvaluator = ScriptEvaluator;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/script/realm.js
var require_realm = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/script/realm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Realm = void 0;
    var scriptEvaluator_js_1 = require_scriptEvaluator();
    var Realm = class {
      #realmStorage;
      #browsingContextStorage;
      #realmId;
      #browsingContextId;
      #executionContextId;
      #origin;
      #type;
      #cdpClient;
      #eventManager;
      #scriptEvaluator;
      sandbox;
      cdpSessionId;
      constructor(realmStorage, browsingContextStorage, realmId, browsingContextId, executionContextId, origin, type, sandbox, cdpSessionId, cdpClient, eventManager) {
        this.#realmId = realmId;
        this.#browsingContextId = browsingContextId;
        this.#executionContextId = executionContextId;
        this.sandbox = sandbox;
        this.#origin = origin;
        this.#type = type;
        this.cdpSessionId = cdpSessionId;
        this.#cdpClient = cdpClient;
        this.#realmStorage = realmStorage;
        this.#browsingContextStorage = browsingContextStorage;
        this.#eventManager = eventManager;
        this.#scriptEvaluator = new scriptEvaluator_js_1.ScriptEvaluator(this.#eventManager);
        this.#realmStorage.realmMap.set(this.#realmId, this);
      }
      async disown(handle) {
        if (this.#realmStorage.knownHandlesToRealm.get(handle) !== this.realmId) {
          return;
        }
        try {
          await this.cdpClient.sendCommand("Runtime.releaseObject", {
            objectId: handle
          });
        } catch (e) {
          if (!(e.code === -32e3 && e.message === "Invalid remote object id")) {
            throw e;
          }
        }
        this.#realmStorage.knownHandlesToRealm.delete(handle);
      }
      cdpToBidiValue(cdpValue, resultOwnership) {
        const cdpWebDriverValue = cdpValue.result.webDriverValue;
        const bidiValue = this.webDriverValueToBiDi(cdpWebDriverValue);
        if (cdpValue.result.objectId) {
          const objectId = cdpValue.result.objectId;
          if (resultOwnership === "root") {
            bidiValue.handle = objectId;
            this.#realmStorage.knownHandlesToRealm.set(objectId, this.realmId);
          } else {
            void this.cdpClient.sendCommand("Runtime.releaseObject", { objectId });
          }
        }
        return bidiValue;
      }
      webDriverValueToBiDi(webDriverValue) {
        const result = webDriverValue;
        if (result.type === "platformobject") {
          return { type: "object" };
        }
        const bidiValue = result.value;
        if (bidiValue === void 0) {
          return result;
        }
        if (result.type === "node") {
          if (Object.hasOwn(bidiValue, "backendNodeId")) {
            bidiValue.sharedId = `${this.navigableId}${scriptEvaluator_js_1.SHARED_ID_DIVIDER}${bidiValue.backendNodeId}`;
            delete bidiValue["backendNodeId"];
          }
          if (Object.hasOwn(bidiValue, "children")) {
            for (const i in bidiValue.children) {
              bidiValue.children[i] = this.webDriverValueToBiDi(bidiValue.children[i]);
            }
          }
        }
        if (["array", "set"].includes(webDriverValue.type)) {
          for (const i in bidiValue) {
            bidiValue[i] = this.webDriverValueToBiDi(bidiValue[i]);
          }
        }
        if (["object", "map"].includes(webDriverValue.type)) {
          for (const i in bidiValue) {
            bidiValue[i] = [
              this.webDriverValueToBiDi(bidiValue[i][0]),
              this.webDriverValueToBiDi(bidiValue[i][1])
            ];
          }
        }
        return result;
      }
      toBiDi() {
        return {
          realm: this.realmId,
          origin: this.origin,
          type: this.type,
          context: this.browsingContextId,
          ...this.sandbox === void 0 ? {} : { sandbox: this.sandbox }
        };
      }
      get realmId() {
        return this.#realmId;
      }
      get navigableId() {
        return this.#browsingContextStorage.findContext(this.#browsingContextId)?.navigableId ?? "UNKNOWN";
      }
      get browsingContextId() {
        return this.#browsingContextId;
      }
      get executionContextId() {
        return this.#executionContextId;
      }
      get origin() {
        return this.#origin;
      }
      get type() {
        return this.#type;
      }
      get cdpClient() {
        return this.#cdpClient;
      }
      async callFunction(functionDeclaration, _this, _arguments, awaitPromise, resultOwnership) {
        const context = this.#browsingContextStorage.getContext(this.browsingContextId);
        await context.awaitUnblocked();
        return {
          result: await this.#scriptEvaluator.callFunction(this, functionDeclaration, _this, _arguments, awaitPromise, resultOwnership)
        };
      }
      async scriptEvaluate(expression, awaitPromise, resultOwnership) {
        const context = this.#browsingContextStorage.getContext(this.browsingContextId);
        await context.awaitUnblocked();
        return {
          result: await this.#scriptEvaluator.scriptEvaluate(this, expression, awaitPromise, resultOwnership)
        };
      }
      /**
       * Serializes a given CDP object into BiDi, keeping references in the
       * target's `globalThis`.
       * @param cdpObject CDP remote object to be serialized.
       * @param resultOwnership Indicates desired ResultOwnership.
       */
      async serializeCdpObject(cdpObject, resultOwnership) {
        return this.#scriptEvaluator.serializeCdpObject(cdpObject, resultOwnership, this);
      }
      /**
       * Gets the string representation of an object. This is equivalent to
       * calling toString() on the object value.
       * @param cdpObject CDP remote object representing an object.
       * @return string The stringified object.
       */
      async stringifyObject(cdpObject) {
        return scriptEvaluator_js_1.ScriptEvaluator.stringifyObject(cdpObject, this);
      }
    };
    exports.Realm = Realm;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/browsingContextImpl.js
var require_browsingContextImpl = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/browsingContextImpl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowsingContextImpl = void 0;
    var unitConversions_js_1 = require_unitConversions();
    var protocol_js_1 = require_protocol();
    var log_js_1 = require_log();
    var deferred_js_1 = require_deferred();
    var realm_js_1 = require_realm();
    var BrowsingContextImpl = class {
      /** The ID of the current context. */
      #contextId;
      /**
       * The ID of the parent context.
       * If null, this is a top-level context.
       */
      #parentId;
      /**
       * Children contexts.
       * Map from children context ID to context implementation.
       */
      #children = /* @__PURE__ */ new Map();
      #browsingContextStorage;
      #defers = {
        documentInitialized: new deferred_js_1.Deferred(),
        Page: {
          navigatedWithinDocument: new deferred_js_1.Deferred(),
          lifecycleEvent: {
            DOMContentLoaded: new deferred_js_1.Deferred(),
            load: new deferred_js_1.Deferred()
          }
        }
      };
      #url = "about:blank";
      #eventManager;
      #realmStorage;
      #loaderId = null;
      #cdpTarget;
      #maybeDefaultRealm;
      #logger;
      constructor(cdpTarget, realmStorage, contextId, parentId, eventManager, browsingContextStorage, logger) {
        this.#cdpTarget = cdpTarget;
        this.#realmStorage = realmStorage;
        this.#contextId = contextId;
        this.#parentId = parentId;
        this.#eventManager = eventManager;
        this.#browsingContextStorage = browsingContextStorage;
        this.#logger = logger;
        this.#initListeners();
      }
      static create(cdpTarget, realmStorage, contextId, parentId, eventManager, browsingContextStorage, logger) {
        const context = new BrowsingContextImpl(cdpTarget, realmStorage, contextId, parentId, eventManager, browsingContextStorage, logger);
        browsingContextStorage.addContext(context);
        eventManager.registerEvent({
          method: protocol_js_1.BrowsingContext.EventNames.ContextCreatedEvent,
          params: context.serializeToBidiValue()
        }, context.contextId);
        return context;
      }
      /**
       * @see https://html.spec.whatwg.org/multipage/document-sequences.html#navigable
       */
      get navigableId() {
        return this.#loaderId;
      }
      delete() {
        this.#deleteChildren();
        this.#realmStorage.deleteRealms({
          browsingContextId: this.contextId
        });
        if (this.parentId !== null) {
          const parent = this.#browsingContextStorage.getContext(this.parentId);
          parent.#children.delete(this.contextId);
        }
        this.#eventManager.registerEvent({
          method: protocol_js_1.BrowsingContext.EventNames.ContextDestroyedEvent,
          params: this.serializeToBidiValue()
        }, this.contextId);
        this.#browsingContextStorage.deleteContext(this.contextId);
      }
      /** Returns the ID of this context. */
      get contextId() {
        return this.#contextId;
      }
      /** Returns the parent context ID. */
      get parentId() {
        return this.#parentId;
      }
      /** Returns all children contexts. */
      get children() {
        return Array.from(this.#children.values());
      }
      /**
       * Returns true if this is a top-level context.
       * This is the case whenever the parent context ID is null.
       */
      isTopLevelContext() {
        return this.#parentId === null;
      }
      addChild(child) {
        this.#children.set(child.contextId, child);
      }
      #deleteChildren() {
        this.children.map((child) => child.delete());
      }
      get #defaultRealm() {
        if (this.#maybeDefaultRealm === void 0) {
          throw new Error(`No default realm for browsing context ${this.#contextId}`);
        }
        return this.#maybeDefaultRealm;
      }
      get cdpTarget() {
        return this.#cdpTarget;
      }
      updateCdpTarget(cdpTarget) {
        this.#cdpTarget = cdpTarget;
        this.#initListeners();
      }
      get url() {
        return this.#url;
      }
      async awaitLoaded() {
        await this.#defers.Page.lifecycleEvent.load;
      }
      awaitUnblocked() {
        return this.#cdpTarget.targetUnblocked;
      }
      async getOrCreateSandbox(sandbox) {
        if (sandbox === void 0 || sandbox === "") {
          return this.#defaultRealm;
        }
        let maybeSandboxes = this.#realmStorage.findRealms({
          browsingContextId: this.contextId,
          sandbox
        });
        if (maybeSandboxes.length === 0) {
          await this.#cdpTarget.cdpClient.sendCommand("Page.createIsolatedWorld", {
            frameId: this.contextId,
            worldName: sandbox
          });
          maybeSandboxes = this.#realmStorage.findRealms({
            browsingContextId: this.contextId,
            sandbox
          });
        }
        if (maybeSandboxes.length !== 1) {
          throw Error(`Sandbox ${sandbox} wasn't created.`);
        }
        return maybeSandboxes[0];
      }
      serializeToBidiValue(maxDepth = 0, addParentFiled = true) {
        return {
          context: this.#contextId,
          url: this.url,
          children: maxDepth > 0 ? this.children.map((c) => c.serializeToBidiValue(maxDepth - 1, false)) : null,
          ...addParentFiled ? { parent: this.#parentId } : {}
        };
      }
      #initListeners() {
        this.#cdpTarget.cdpClient.on("Target.targetInfoChanged", (params) => {
          if (this.contextId !== params.targetInfo.targetId) {
            return;
          }
          this.#url = params.targetInfo.url;
        });
        this.#cdpTarget.cdpClient.on("Page.frameNavigated", (params) => {
          if (this.contextId !== params.frame.id) {
            return;
          }
          this.#url = params.frame.url + (params.frame.urlFragment ?? "");
          this.#deleteChildren();
        });
        this.#cdpTarget.cdpClient.on("Page.navigatedWithinDocument", (params) => {
          if (this.contextId !== params.frameId) {
            return;
          }
          this.#url = params.url;
          this.#defers.Page.navigatedWithinDocument.resolve(params);
        });
        this.#cdpTarget.cdpClient.on("Page.lifecycleEvent", (params) => {
          if (this.contextId !== params.frameId) {
            return;
          }
          const timestamp = (/* @__PURE__ */ new Date()).getTime();
          if (params.name === "init") {
            this.#documentChanged(params.loaderId);
            this.#defers.documentInitialized.resolve();
          }
          if (params.name === "commit") {
            this.#loaderId = params.loaderId;
            return;
          }
          if (params.loaderId !== this.#loaderId) {
            return;
          }
          switch (params.name) {
            case "DOMContentLoaded":
              this.#defers.Page.lifecycleEvent.DOMContentLoaded.resolve(params);
              this.#eventManager.registerEvent({
                method: protocol_js_1.BrowsingContext.EventNames.DomContentLoadedEvent,
                params: {
                  context: this.contextId,
                  navigation: this.#loaderId,
                  timestamp,
                  url: this.#url
                }
              }, this.contextId);
              break;
            case "load":
              this.#defers.Page.lifecycleEvent.load.resolve(params);
              this.#eventManager.registerEvent({
                method: protocol_js_1.BrowsingContext.EventNames.LoadEvent,
                params: {
                  context: this.contextId,
                  navigation: this.#loaderId,
                  timestamp,
                  url: this.#url
                }
              }, this.contextId);
              break;
          }
        });
        this.#cdpTarget.cdpClient.on("Runtime.executionContextCreated", (params) => {
          if (params.context.auxData.frameId !== this.contextId) {
            return;
          }
          if (!["default", "isolated"].includes(params.context.auxData.type)) {
            return;
          }
          const realm = new realm_js_1.Realm(
            this.#realmStorage,
            this.#browsingContextStorage,
            params.context.uniqueId,
            this.contextId,
            params.context.id,
            this.#getOrigin(params),
            // TODO: differentiate types.
            "window",
            // Sandbox name for isolated world.
            params.context.auxData.type === "isolated" ? params.context.name : void 0,
            this.#cdpTarget.cdpSessionId,
            this.#cdpTarget.cdpClient,
            this.#eventManager
          );
          if (params.context.auxData.isDefault) {
            this.#maybeDefaultRealm = realm;
          }
        });
        this.#cdpTarget.cdpClient.on("Runtime.executionContextDestroyed", (params) => {
          this.#realmStorage.deleteRealms({
            cdpSessionId: this.#cdpTarget.cdpSessionId,
            executionContextId: params.executionContextId
          });
        });
        this.#cdpTarget.cdpClient.on("Runtime.executionContextsCleared", () => {
          this.#realmStorage.deleteRealms({
            cdpSessionId: this.#cdpTarget.cdpSessionId
          });
        });
      }
      #getOrigin(params) {
        if (params.context.auxData.type === "isolated") {
          return this.#defaultRealm.origin;
        }
        return ["://", ""].includes(params.context.origin) ? "null" : params.context.origin;
      }
      #documentChanged(loaderId) {
        if (loaderId === void 0 || this.#loaderId === loaderId) {
          if (this.#defers.Page.navigatedWithinDocument.isFinished) {
            this.#defers.Page.navigatedWithinDocument = new deferred_js_1.Deferred();
          }
          return;
        }
        if (this.#defers.documentInitialized.isFinished) {
          this.#defers.documentInitialized = new deferred_js_1.Deferred();
        } else {
          this.#logger?.(log_js_1.LogType.browsingContexts, "Document changed");
        }
        if (this.#defers.Page.lifecycleEvent.DOMContentLoaded.isFinished) {
          this.#defers.Page.lifecycleEvent.DOMContentLoaded = new deferred_js_1.Deferred();
        } else {
          this.#logger?.(log_js_1.LogType.browsingContexts, "Document changed");
        }
        if (this.#defers.Page.lifecycleEvent.load.isFinished) {
          this.#defers.Page.lifecycleEvent.load = new deferred_js_1.Deferred();
        } else {
          this.#logger?.(log_js_1.LogType.browsingContexts, "Document changed");
        }
        this.#loaderId = loaderId;
      }
      async navigate(url, wait) {
        await this.awaitUnblocked();
        const cdpNavigateResult = await this.#cdpTarget.cdpClient.sendCommand("Page.navigate", {
          url,
          frameId: this.contextId
        });
        if (cdpNavigateResult.errorText) {
          throw new protocol_js_1.Message.UnknownErrorException(cdpNavigateResult.errorText);
        }
        this.#documentChanged(cdpNavigateResult.loaderId);
        switch (wait) {
          case "none":
            break;
          case "interactive":
            if (cdpNavigateResult.loaderId === void 0) {
              await this.#defers.Page.navigatedWithinDocument;
            } else {
              await this.#defers.Page.lifecycleEvent.DOMContentLoaded;
            }
            break;
          case "complete":
            if (cdpNavigateResult.loaderId === void 0) {
              await this.#defers.Page.navigatedWithinDocument;
            } else {
              await this.#defers.Page.lifecycleEvent.load;
            }
            break;
        }
        return {
          result: {
            navigation: cdpNavigateResult.loaderId || null,
            url
          }
        };
      }
      async captureScreenshot() {
        const [, result] = await Promise.all([
          // TODO: Either make this a proposal in the BiDi spec, or focus the
          // original tab right after the screenshot is taken.
          // The screenshot command gets blocked until we focus the active tab.
          this.#cdpTarget.cdpClient.sendCommand("Page.bringToFront"),
          this.#cdpTarget.cdpClient.sendCommand("Page.captureScreenshot", {})
        ]);
        return {
          result: {
            data: result.data
          }
        };
      }
      async print(params) {
        const printToPdfCdpParams = {
          printBackground: params.background,
          landscape: params.orientation === "landscape",
          pageRanges: params.pageRanges?.join(",") ?? "",
          scale: params.scale,
          preferCSSPageSize: !params.shrinkToFit
        };
        if (params.margin?.bottom) {
          printToPdfCdpParams.marginBottom = (0, unitConversions_js_1.inchesFromCm)(params.margin.bottom);
        }
        if (params.margin?.left) {
          printToPdfCdpParams.marginLeft = (0, unitConversions_js_1.inchesFromCm)(params.margin.left);
        }
        if (params.margin?.right) {
          printToPdfCdpParams.marginRight = (0, unitConversions_js_1.inchesFromCm)(params.margin.right);
        }
        if (params.margin?.top) {
          printToPdfCdpParams.marginTop = (0, unitConversions_js_1.inchesFromCm)(params.margin.top);
        }
        if (params.page?.height) {
          printToPdfCdpParams.paperHeight = (0, unitConversions_js_1.inchesFromCm)(params.page.height);
        }
        if (params.page?.width) {
          printToPdfCdpParams.paperWidth = (0, unitConversions_js_1.inchesFromCm)(params.page.width);
        }
        const result = await this.#cdpTarget.cdpClient.sendCommand("Page.printToPDF", printToPdfCdpParams);
        return {
          result: {
            data: result.data
          }
        };
      }
      async addPreloadScript(params) {
        const result = await this.#cdpTarget.cdpClient.sendCommand("Page.addScriptToEvaluateOnNewDocument", {
          // The spec provides a function, and CDP expects an evaluation.
          source: `(${params.expression})();`,
          worldName: params.sandbox
        });
        return {
          result: {
            script: result.identifier
          }
        };
      }
    };
    exports.BrowsingContextImpl = BrowsingContextImpl;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/log/logHelper.js
var require_logHelper = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/log/logHelper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRemoteValuesText = exports.logMessageFormatter = void 0;
    var specifiers = ["%s", "%d", "%i", "%f", "%o", "%O", "%c"];
    function isFormmatSpecifier(str) {
      return specifiers.some((spec) => str.includes(spec));
    }
    function logMessageFormatter(args) {
      let output = "";
      const argFormat = args[0].value.toString();
      const argValues = args.slice(1, void 0);
      const tokens = argFormat.split(new RegExp(specifiers.map((spec) => `(${spec})`).join("|"), "g"));
      for (const token of tokens) {
        if (token === void 0 || token === "") {
          continue;
        }
        if (isFormmatSpecifier(token)) {
          const arg = argValues.shift();
          if (arg === void 0) {
            throw new Error(`Less value is provided: "${getRemoteValuesText(args, false)}"`);
          }
          if (token === "%s") {
            output += stringFromArg(arg);
          } else if (token === "%d" || token === "%i") {
            if (arg.type === "bigint" || arg.type === "number" || arg.type === "string") {
              output += parseInt(arg.value.toString(), 10);
            } else {
              output += "NaN";
            }
          } else if (token === "%f") {
            if (arg.type === "bigint" || arg.type === "number" || arg.type === "string") {
              output += parseFloat(arg.value.toString());
            } else {
              output += "NaN";
            }
          } else {
            output += toJson(arg);
          }
        } else {
          output += token;
        }
      }
      if (argValues.length > 0) {
        throw new Error(`More value is provided: "${getRemoteValuesText(args, false)}"`);
      }
      return output;
    }
    exports.logMessageFormatter = logMessageFormatter;
    function toJson(arg) {
      if (arg.type !== "array" && arg.type !== "bigint" && arg.type !== "date" && arg.type !== "number" && arg.type !== "object" && arg.type !== "string") {
        return stringFromArg(arg);
      }
      if (arg.type === "bigint") {
        return `${arg.value.toString()}n`;
      }
      if (arg.type === "number") {
        return arg.value.toString();
      }
      if (["date", "string"].includes(arg.type)) {
        return JSON.stringify(arg.value);
      }
      if (arg.type === "object") {
        return `{${arg.value.map((pair) => {
          return `${JSON.stringify(pair[0])}:${toJson(pair[1])}`;
        }).join(",")}}`;
      }
      if (arg.type === "array") {
        return `[${arg.value?.map((val) => toJson(val)).join(",") ?? ""}]`;
      }
      throw Error(`Invalid value type: ${arg.toString()}`);
    }
    function stringFromArg(arg) {
      if (!Object.hasOwn(arg, "value")) {
        return arg.type;
      }
      switch (arg.type) {
        case "string":
        case "number":
        case "boolean":
        case "bigint":
          return String(arg.value);
        case "regexp":
          return `/${arg.value.pattern}/${arg.value.flags ?? ""}`;
        case "date":
          return new Date(arg.value).toString();
        case "object":
          return `Object(${arg.value?.length ?? ""})`;
        case "array":
          return `Array(${arg.value?.length ?? ""})`;
        case "map":
          return `Map(${arg.value.length})`;
        case "set":
          return `Set(${arg.value.length})`;
        case "node":
          return "node";
        default:
          return arg.type;
      }
    }
    function getRemoteValuesText(args, formatText) {
      const arg = args[0];
      if (!arg) {
        return "";
      }
      if (arg.type === "string" && isFormmatSpecifier(arg.value.toString()) && formatText) {
        return logMessageFormatter(args);
      }
      return args.map((arg2) => {
        return stringFromArg(arg2);
      }).join(" ");
    }
    exports.getRemoteValuesText = getRemoteValuesText;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/log/logManager.js
var require_logManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/log/logManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogManager = void 0;
    var protocol_js_1 = require_protocol();
    var logHelper_js_1 = require_logHelper();
    function getBidiStackTrace(cdpStackTrace) {
      const stackFrames = cdpStackTrace?.callFrames.map((callFrame) => {
        return {
          columnNumber: callFrame.columnNumber,
          functionName: callFrame.functionName,
          lineNumber: callFrame.lineNumber,
          url: callFrame.url
        };
      });
      return stackFrames ? { callFrames: stackFrames } : void 0;
    }
    function getLogLevel(consoleApiType) {
      if (["assert", "error"].includes(consoleApiType)) {
        return "error";
      }
      if (["debug", "trace"].includes(consoleApiType)) {
        return "debug";
      }
      if (["warn", "warning"].includes(consoleApiType)) {
        return "warn";
      }
      return "info";
    }
    var LogManager = class {
      #eventManager;
      #realmStorage;
      #cdpTarget;
      constructor(cdpTarget, realmStorage, eventManager) {
        this.#cdpTarget = cdpTarget;
        this.#realmStorage = realmStorage;
        this.#eventManager = eventManager;
      }
      static create(cdpTarget, realmStorage, eventManager) {
        const logManager = new LogManager(cdpTarget, realmStorage, eventManager);
        logManager.#initialize();
        return logManager;
      }
      #initialize() {
        this.#initializeLogEntryAddedEventListener();
      }
      #initializeLogEntryAddedEventListener() {
        this.#cdpTarget.cdpClient.on("Runtime.consoleAPICalled", (params) => {
          const realm = this.#realmStorage.findRealm({
            cdpSessionId: this.#cdpTarget.cdpSessionId,
            executionContextId: params.executionContextId
          });
          const argsPromise = realm === void 0 ? Promise.resolve(params.args) : (
            // Properly serialize arguments if possible.
            Promise.all(params.args.map((arg) => {
              return realm.serializeCdpObject(arg, "none");
            }))
          );
          this.#eventManager.registerPromiseEvent(argsPromise.then((args) => ({
            method: protocol_js_1.Log.EventNames.LogEntryAddedEvent,
            params: {
              level: getLogLevel(params.type),
              source: {
                realm: realm?.realmId ?? "UNKNOWN",
                context: realm?.browsingContextId ?? "UNKNOWN"
              },
              text: (0, logHelper_js_1.getRemoteValuesText)(args, true),
              timestamp: Math.round(params.timestamp),
              stackTrace: getBidiStackTrace(params.stackTrace),
              type: "console",
              // Console method is `warn`, not `warning`.
              method: params.type === "warning" ? "warn" : params.type,
              args
            }
          })), realm?.browsingContextId ?? "UNKNOWN", protocol_js_1.Log.EventNames.LogEntryAddedEvent);
        });
        this.#cdpTarget.cdpClient.on("Runtime.exceptionThrown", (params) => {
          const realm = this.#realmStorage.findRealm({
            cdpSessionId: this.#cdpTarget.cdpSessionId,
            executionContextId: params.exceptionDetails.executionContextId
          });
          const textPromise = (async () => {
            if (!params.exceptionDetails.exception) {
              return params.exceptionDetails.text;
            }
            if (realm === void 0) {
              return JSON.stringify(params.exceptionDetails.exception);
            }
            return realm.stringifyObject(params.exceptionDetails.exception);
          })();
          this.#eventManager.registerPromiseEvent(textPromise.then((text) => ({
            method: protocol_js_1.Log.EventNames.LogEntryAddedEvent,
            params: {
              level: "error",
              source: {
                realm: realm?.realmId ?? "UNKNOWN",
                context: realm?.browsingContextId ?? "UNKNOWN"
              },
              text,
              timestamp: Math.round(params.timestamp),
              stackTrace: getBidiStackTrace(params.exceptionDetails.stackTrace),
              type: "javascript"
            }
          })), realm?.browsingContextId ?? "UNKNOWN", protocol_js_1.Log.EventNames.LogEntryAddedEvent);
        });
      }
    };
    exports.LogManager = LogManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/DefaultMap.js
var require_DefaultMap = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/DefaultMap.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultMap = void 0;
    var DefaultMap = class extends Map {
      /** The default value to return whenever a key is not present in the map. */
      #getDefaultValue;
      constructor(getDefaultValue, entries) {
        super(entries);
        this.#getDefaultValue = getDefaultValue;
      }
      get(key) {
        if (!this.has(key)) {
          this.set(key, this.#getDefaultValue(key));
        }
        return super.get(key);
      }
    };
    exports.DefaultMap = DefaultMap;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/network/networkRequest.js
var require_networkRequest = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/network/networkRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkRequest = void 0;
    var deferred_1 = require_deferred();
    var protocol_1 = require_protocol();
    var _unknown, _eventManager, _requestWillBeSentEvent, _requestWillBeSentExtraInfoEvent, _responseReceivedEvent, _responseReceivedExtraInfoEvent, _beforeRequestSentDeferred, _responseReceivedDeferred, _sendBeforeRequestEvent, sendBeforeRequestEvent_fn, _getBeforeRequestEvent, getBeforeRequestEvent_fn, _getBaseEventParams, getBaseEventParams_fn, _getRequestData, getRequestData_fn, _getInitiatorType, getInitiatorType_fn, _getCookiesSameSite, getCookiesSameSite_fn, _getCookies, getCookies_fn, _sendResponseReceivedEvent, sendResponseReceivedEvent_fn, _getResponseReceivedEvent, getResponseReceivedEvent_fn, _getHeaders, getHeaders_fn, _isIgnoredEvent, isIgnoredEvent_fn;
    var _NetworkRequest = class {
      constructor(requestId, eventManager) {
        __privateAdd(this, _sendBeforeRequestEvent);
        __privateAdd(this, _getBeforeRequestEvent);
        __privateAdd(this, _getBaseEventParams);
        __privateAdd(this, _getRequestData);
        __privateAdd(this, _getInitiatorType);
        __privateAdd(this, _sendResponseReceivedEvent);
        __privateAdd(this, _getResponseReceivedEvent);
        __privateAdd(this, _getHeaders);
        __privateAdd(this, _isIgnoredEvent);
        __publicField(this, "requestId");
        __privateAdd(this, _eventManager, void 0);
        __privateAdd(this, _requestWillBeSentEvent, void 0);
        __privateAdd(this, _requestWillBeSentExtraInfoEvent, void 0);
        __privateAdd(this, _responseReceivedEvent, void 0);
        __privateAdd(this, _responseReceivedExtraInfoEvent, void 0);
        __privateAdd(this, _beforeRequestSentDeferred, void 0);
        __privateAdd(this, _responseReceivedDeferred, void 0);
        this.requestId = requestId;
        __privateSet(this, _eventManager, eventManager);
        __privateSet(this, _beforeRequestSentDeferred, new deferred_1.Deferred());
        __privateSet(this, _responseReceivedDeferred, new deferred_1.Deferred());
      }
      onRequestWillBeSentEvent(requestWillBeSentEvent) {
        if (__privateGet(this, _requestWillBeSentEvent) !== void 0) {
          throw new Error("RequestWillBeSentEvent is already set");
        }
        __privateSet(this, _requestWillBeSentEvent, requestWillBeSentEvent);
        if (__privateGet(this, _requestWillBeSentExtraInfoEvent) !== void 0) {
          __privateGet(this, _beforeRequestSentDeferred).resolve();
        }
        __privateMethod(this, _sendBeforeRequestEvent, sendBeforeRequestEvent_fn).call(this);
      }
      onRequestWillBeSentExtraInfoEvent(requestWillBeSentExtraInfoEvent) {
        if (__privateGet(this, _requestWillBeSentExtraInfoEvent) !== void 0) {
          throw new Error("RequestWillBeSentExtraInfoEvent is already set");
        }
        __privateSet(this, _requestWillBeSentExtraInfoEvent, requestWillBeSentExtraInfoEvent);
        if (__privateGet(this, _requestWillBeSentEvent) !== void 0) {
          __privateGet(this, _beforeRequestSentDeferred).resolve();
        }
      }
      onResponseReceivedEvent(responseReceivedEvent) {
        if (__privateGet(this, _responseReceivedEvent) !== void 0) {
          throw new Error("ResponseReceivedEvent is already set");
        }
        __privateSet(this, _responseReceivedEvent, responseReceivedEvent);
        if (__privateGet(this, _responseReceivedExtraInfoEvent) !== void 0) {
          __privateGet(this, _responseReceivedDeferred).resolve();
        }
        __privateMethod(this, _sendResponseReceivedEvent, sendResponseReceivedEvent_fn).call(this);
      }
      onResponseReceivedEventExtraInfo(responseReceivedExtraInfoEvent) {
        if (__privateGet(this, _responseReceivedExtraInfoEvent) !== void 0) {
          throw new Error("ResponseReceivedExtraInfoEvent is already set");
        }
        __privateSet(this, _responseReceivedExtraInfoEvent, responseReceivedExtraInfoEvent);
        if (__privateGet(this, _responseReceivedEvent) !== void 0) {
          __privateGet(this, _responseReceivedDeferred).resolve();
        }
      }
      onLoadingFailedEvent(loadingFailedEvent) {
        __privateGet(this, _beforeRequestSentDeferred).resolve();
        __privateGet(this, _responseReceivedDeferred).reject(loadingFailedEvent);
        const params = {
          ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this),
          errorText: loadingFailedEvent.errorText
        };
        __privateGet(this, _eventManager).registerEvent({
          method: protocol_1.Network.EventNames.FetchErrorEvent,
          params
        }, __privateGet(this, _requestWillBeSentEvent)?.frameId ?? null);
      }
    };
    var NetworkRequest = _NetworkRequest;
    _unknown = new WeakMap();
    _eventManager = new WeakMap();
    _requestWillBeSentEvent = new WeakMap();
    _requestWillBeSentExtraInfoEvent = new WeakMap();
    _responseReceivedEvent = new WeakMap();
    _responseReceivedExtraInfoEvent = new WeakMap();
    _beforeRequestSentDeferred = new WeakMap();
    _responseReceivedDeferred = new WeakMap();
    _sendBeforeRequestEvent = new WeakSet();
    sendBeforeRequestEvent_fn = function() {
      if (!__privateMethod(this, _isIgnoredEvent, isIgnoredEvent_fn).call(this)) {
        __privateGet(this, _eventManager).registerPromiseEvent(__privateGet(this, _beforeRequestSentDeferred).then(() => __privateMethod(this, _getBeforeRequestEvent, getBeforeRequestEvent_fn).call(this)), __privateGet(this, _requestWillBeSentEvent)?.frameId ?? null, protocol_1.Network.EventNames.BeforeRequestSentEvent);
      }
    };
    _getBeforeRequestEvent = new WeakSet();
    getBeforeRequestEvent_fn = function() {
      if (__privateGet(this, _requestWillBeSentEvent) === void 0) {
        throw new Error("RequestWillBeSentEvent is not set");
      }
      const params = {
        ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this),
        initiator: { type: __privateMethod(this, _getInitiatorType, getInitiatorType_fn).call(this) }
      };
      return {
        method: protocol_1.Network.EventNames.BeforeRequestSentEvent,
        params
      };
    };
    _getBaseEventParams = new WeakSet();
    getBaseEventParams_fn = function() {
      return {
        context: __privateGet(this, _requestWillBeSentEvent)?.frameId ?? null,
        navigation: __privateGet(this, _requestWillBeSentEvent)?.loaderId ?? null,
        // TODO: implement.
        redirectCount: 0,
        request: __privateMethod(this, _getRequestData, getRequestData_fn).call(this),
        // Timestamp should be in milliseconds, while CDP provides it in seconds.
        timestamp: Math.round((__privateGet(this, _requestWillBeSentEvent)?.wallTime ?? 0) * 1e3)
      };
    };
    _getRequestData = new WeakSet();
    getRequestData_fn = function() {
      var _a;
      const cookies = __privateGet(this, _requestWillBeSentExtraInfoEvent) === void 0 ? [] : __privateMethod(_a = _NetworkRequest, _getCookies, getCookies_fn).call(_a, __privateGet(this, _requestWillBeSentExtraInfoEvent).associatedCookies);
      return {
        request: __privateGet(this, _requestWillBeSentEvent)?.requestId ?? __privateGet(_NetworkRequest, _unknown),
        url: __privateGet(this, _requestWillBeSentEvent)?.request.url ?? __privateGet(_NetworkRequest, _unknown),
        method: __privateGet(this, _requestWillBeSentEvent)?.request.method ?? __privateGet(_NetworkRequest, _unknown),
        headers: Object.keys(__privateGet(this, _requestWillBeSentEvent)?.request.headers ?? []).map((key) => ({
          name: key,
          value: __privateGet(this, _requestWillBeSentEvent)?.request.headers[key]
        })),
        cookies,
        // TODO: implement.
        headersSize: -1,
        // TODO: implement.
        bodySize: 0,
        timings: {
          // TODO: implement.
          timeOrigin: 0,
          // TODO: implement.
          requestTime: 0,
          // TODO: implement.
          redirectStart: 0,
          // TODO: implement.
          redirectEnd: 0,
          // TODO: implement.
          fetchStart: 0,
          // TODO: implement.
          dnsStart: 0,
          // TODO: implement.
          dnsEnd: 0,
          // TODO: implement.
          connectStart: 0,
          // TODO: implement.
          connectEnd: 0,
          // TODO: implement.
          tlsStart: 0,
          // TODO: implement.
          tlsEnd: 0,
          // TODO: implement.
          requestStart: 0,
          // TODO: implement.
          responseStart: 0,
          // TODO: implement.
          responseEnd: 0
        }
      };
    };
    _getInitiatorType = new WeakSet();
    getInitiatorType_fn = function() {
      switch (__privateGet(this, _requestWillBeSentEvent)?.initiator.type) {
        case "parser":
        case "script":
        case "preflight":
          return __privateGet(this, _requestWillBeSentEvent).initiator.type;
        default:
          return "other";
      }
    };
    _getCookiesSameSite = new WeakSet();
    getCookiesSameSite_fn = function(cdpSameSiteValue) {
      switch (cdpSameSiteValue) {
        case "Strict":
          return "strict";
        case "Lax":
          return "lax";
        default:
          return "none";
      }
    };
    _getCookies = new WeakSet();
    getCookies_fn = function(associatedCookies) {
      return associatedCookies.map((cookieInfo) => {
        var _a;
        return {
          name: cookieInfo.cookie.name,
          value: cookieInfo.cookie.value,
          domain: cookieInfo.cookie.domain,
          path: cookieInfo.cookie.path,
          expires: cookieInfo.cookie.expires,
          size: cookieInfo.cookie.size,
          httpOnly: cookieInfo.cookie.httpOnly,
          secure: cookieInfo.cookie.secure,
          sameSite: __privateMethod(_a = _NetworkRequest, _getCookiesSameSite, getCookiesSameSite_fn).call(_a, cookieInfo.cookie.sameSite)
        };
      });
    };
    _sendResponseReceivedEvent = new WeakSet();
    sendResponseReceivedEvent_fn = function() {
      if (!__privateMethod(this, _isIgnoredEvent, isIgnoredEvent_fn).call(this)) {
        __privateGet(this, _eventManager).registerPromiseEvent(__privateGet(this, _responseReceivedDeferred).then(() => __privateMethod(this, _getResponseReceivedEvent, getResponseReceivedEvent_fn).call(this)), __privateGet(this, _responseReceivedEvent)?.frameId ?? null, protocol_1.Network.EventNames.ResponseCompletedEvent);
      }
    };
    _getResponseReceivedEvent = new WeakSet();
    getResponseReceivedEvent_fn = function() {
      if (__privateGet(this, _responseReceivedEvent) === void 0) {
        throw new Error("ResponseReceivedEvent is not set");
      }
      if (__privateGet(this, _requestWillBeSentEvent) === void 0) {
        throw new Error("RequestWillBeSentEvent is not set");
      }
      return {
        method: protocol_1.Network.EventNames.ResponseCompletedEvent,
        params: {
          ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this),
          response: {
            url: __privateGet(this, _responseReceivedEvent).response.url,
            protocol: __privateGet(this, _responseReceivedEvent).response.protocol,
            status: __privateGet(this, _responseReceivedEvent).response.status,
            statusText: __privateGet(this, _responseReceivedEvent).response.statusText,
            // Check if this is correct.
            fromCache: __privateGet(this, _responseReceivedEvent).response.fromDiskCache || __privateGet(this, _responseReceivedEvent).response.fromPrefetchCache,
            // TODO: implement.
            headers: __privateMethod(this, _getHeaders, getHeaders_fn).call(this, __privateGet(this, _responseReceivedEvent).response.headers),
            mimeType: __privateGet(this, _responseReceivedEvent).response.mimeType,
            bytesReceived: __privateGet(this, _responseReceivedEvent).response.encodedDataLength,
            headersSize: __privateGet(this, _responseReceivedExtraInfoEvent)?.headersText?.length ?? -1,
            // TODO: consider removing from spec.
            bodySize: -1,
            content: {
              // TODO: consider removing from spec.
              size: -1
            }
          }
        }
      };
    };
    _getHeaders = new WeakSet();
    getHeaders_fn = function(headers) {
      return Object.keys(headers).map((key) => ({
        name: key,
        value: headers[key]
      }));
    };
    _isIgnoredEvent = new WeakSet();
    isIgnoredEvent_fn = function() {
      return __privateGet(this, _requestWillBeSentEvent)?.request.url.endsWith("/favicon.ico") ?? false;
    };
    __privateAdd(NetworkRequest, _getCookiesSameSite);
    __privateAdd(NetworkRequest, _getCookies);
    __privateAdd(NetworkRequest, _unknown, "UNKNOWN");
    exports.NetworkRequest = NetworkRequest;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/network/networkProcessor.js
var require_networkProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/network/networkProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkProcessor = void 0;
    var DefaultMap_1 = require_DefaultMap();
    var networkRequest_1 = require_networkRequest();
    var NetworkProcessor = class {
      #eventManager;
      /**
       * Map of request ID to NetworkRequest objects. Needed as long as information
       * about requests comes from different events.
       */
      #requestMap;
      constructor(eventManager) {
        this.#eventManager = eventManager;
        this.#requestMap = new DefaultMap_1.DefaultMap((requestId) => new networkRequest_1.NetworkRequest(requestId, this.#eventManager));
      }
      static async create(cdpClient, eventManager) {
        const networkProcessor = new NetworkProcessor(eventManager);
        cdpClient.on("Network.requestWillBeSent", (params) => {
          networkProcessor.#getOrCreateNetworkRequest(params.requestId).onRequestWillBeSentEvent(params);
        });
        cdpClient.on("Network.requestWillBeSentExtraInfo", (params) => {
          networkProcessor.#getOrCreateNetworkRequest(params.requestId).onRequestWillBeSentExtraInfoEvent(params);
        });
        cdpClient.on("Network.responseReceived", (params) => {
          networkProcessor.#getOrCreateNetworkRequest(params.requestId).onResponseReceivedEvent(params);
        });
        cdpClient.on("Network.responseReceivedExtraInfo", (params) => {
          networkProcessor.#getOrCreateNetworkRequest(params.requestId).onResponseReceivedEventExtraInfo(params);
        });
        cdpClient.on("Network.loadingFailed", (params) => {
          networkProcessor.#getOrCreateNetworkRequest(params.requestId).onLoadingFailedEvent(params);
        });
        await cdpClient.sendCommand("Network.enable");
        return networkProcessor;
      }
      #getOrCreateNetworkRequest(requestId) {
        return this.#requestMap.get(requestId);
      }
    };
    exports.NetworkProcessor = NetworkProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/cdpTarget.js
var require_cdpTarget = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/cdpTarget.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CdpTarget = void 0;
    var logManager_1 = require_logManager();
    var protocol_1 = require_protocol();
    var deferred_1 = require_deferred();
    var networkProcessor_1 = require_networkProcessor();
    var CdpTarget = class {
      #targetUnblocked;
      #targetId;
      #cdpClient;
      #eventManager;
      #cdpSessionId;
      #networkDomainActivated;
      static create(targetId, cdpClient, cdpSessionId, realmStorage, eventManager) {
        const cdpTarget = new CdpTarget(targetId, cdpClient, cdpSessionId, eventManager);
        logManager_1.LogManager.create(cdpTarget, realmStorage, eventManager);
        cdpTarget.#setEventListeners();
        void cdpTarget.#unblock();
        return cdpTarget;
      }
      constructor(targetId, cdpClient, cdpSessionId, eventManager) {
        this.#targetId = targetId;
        this.#cdpClient = cdpClient;
        this.#cdpSessionId = cdpSessionId;
        this.#eventManager = eventManager;
        this.#networkDomainActivated = false;
        this.#targetUnblocked = new deferred_1.Deferred();
      }
      /**
       * Returns a promise that resolves when the target is unblocked.
       */
      get targetUnblocked() {
        return this.#targetUnblocked;
      }
      get targetId() {
        return this.#targetId;
      }
      get cdpClient() {
        return this.#cdpClient;
      }
      /**
       * Needed for CDP escape path.
       */
      get cdpSessionId() {
        return this.#cdpSessionId;
      }
      /**
       * Enables all the required CDP domains and unblocks the target.
       */
      async #unblock() {
        if (this.#eventManager.isNetworkDomainEnabled) {
          await this.enableNetworkDomain();
        }
        await this.#cdpClient.sendCommand("Runtime.enable");
        await this.#cdpClient.sendCommand("Page.enable");
        await this.#cdpClient.sendCommand("Page.setLifecycleEventsEnabled", {
          enabled: true
        });
        await this.#cdpClient.sendCommand("Target.setAutoAttach", {
          autoAttach: true,
          waitForDebuggerOnStart: true,
          flatten: true
        });
        await this.#cdpClient.sendCommand("Runtime.runIfWaitingForDebugger");
        this.#targetUnblocked.resolve();
      }
      /**
       * Enables the Network domain (creates NetworkProcessor on the target's cdp
       * client) if it is not enabled yet.
       */
      async enableNetworkDomain() {
        if (!this.#networkDomainActivated) {
          this.#networkDomainActivated = true;
          await networkProcessor_1.NetworkProcessor.create(this.cdpClient, this.#eventManager);
        }
      }
      #setEventListeners() {
        this.#cdpClient.on("*", (method, params) => {
          this.#eventManager.registerEvent({
            method: protocol_1.CDP.EventNames.EventReceivedEvent,
            params: {
              cdpMethod: method,
              cdpParams: params || {},
              cdpSession: this.#cdpSessionId
            }
          }, null);
        });
      }
    };
    exports.CdpTarget = CdpTarget;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/browsingContextProcessor.js
var require_browsingContextProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/browsingContextProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowsingContextProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var log_js_1 = require_log();
    var browsingContextImpl_js_1 = require_browsingContextImpl();
    var cdpTarget_js_1 = require_cdpTarget();
    var BrowsingContextProcessor = class {
      #browsingContextStorage;
      #cdpConnection;
      #eventManager;
      #logger;
      #realmStorage;
      #selfTargetId;
      constructor(realmStorage, cdpConnection, selfTargetId, eventManager, browsingContextStorage, logger) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#cdpConnection = cdpConnection;
        this.#eventManager = eventManager;
        this.#logger = logger;
        this.#realmStorage = realmStorage;
        this.#selfTargetId = selfTargetId;
        this.#setEventListeners(this.#cdpConnection.browserClient());
      }
      /**
       * This method is called for each CDP session, since this class is responsible
       * for creating and destroying all targets and browsing contexts.
       */
      #setEventListeners(cdpClient) {
        cdpClient.on("Target.attachedToTarget", (params) => {
          this.#handleAttachedToTargetEvent(params, cdpClient);
        });
        cdpClient.on("Target.detachedFromTarget", (params) => {
          this.#handleDetachedFromTargetEvent(params);
        });
        cdpClient.on("Page.frameAttached", (params) => {
          this.#handleFrameAttachedEvent(params);
        });
        cdpClient.on("Page.frameDetached", (params) => {
          this.#handleFrameDetachedEvent(params);
        });
      }
      // { "method": "Page.frameAttached",
      //   "params": {
      //     "frameId": "0A639AB1D9A392DF2CE02C53CC4ED3A6",
      //     "parentFrameId": "722BB0526C73B067A479BED6D0DB1156" } }
      #handleFrameAttachedEvent(params) {
        const parentBrowsingContext = this.#browsingContextStorage.findContext(params.parentFrameId);
        if (parentBrowsingContext !== void 0) {
          browsingContextImpl_js_1.BrowsingContextImpl.create(parentBrowsingContext.cdpTarget, this.#realmStorage, params.frameId, params.parentFrameId, this.#eventManager, this.#browsingContextStorage, this.#logger);
        }
      }
      // { "method": "Page.frameDetached",
      //   "params": {
      //     "frameId": "0A639AB1D9A392DF2CE02C53CC4ED3A6",
      //     "reason": "swap" } }
      #handleFrameDetachedEvent(params) {
        if (params.reason === "swap") {
          return;
        }
        this.#browsingContextStorage.findContext(params.frameId)?.delete();
      }
      // { "method": "Target.attachedToTarget",
      //   "params": {
      //     "sessionId": "EA999F39BDCABD7D45C9FEB787413BBA",
      //     "targetInfo": {
      //       "targetId": "722BB0526C73B067A479BED6D0DB1156",
      //       "type": "page",
      //       "title": "about:blank",
      //       "url": "about:blank",
      //       "attached": true,
      //       "canAccessOpener": false,
      //       "browserContextId": "1B5244080EC3FF28D03BBDA73138C0E2" },
      //     "waitingForDebugger": false } }
      #handleAttachedToTargetEvent(params, parentSessionCdpClient) {
        const { sessionId, targetInfo } = params;
        const targetCdpClient = this.#cdpConnection.getCdpClient(sessionId);
        if (!this.#isValidTarget(targetInfo)) {
          void targetCdpClient.sendCommand("Runtime.runIfWaitingForDebugger").then(() => parentSessionCdpClient.sendCommand("Target.detachFromTarget", params));
          return;
        }
        this.#logger?.(log_js_1.LogType.browsingContexts, "AttachedToTarget event received:", JSON.stringify(params, null, 2));
        this.#setEventListeners(targetCdpClient);
        const cdpTarget = cdpTarget_js_1.CdpTarget.create(targetInfo.targetId, targetCdpClient, sessionId, this.#realmStorage, this.#eventManager);
        if (this.#browsingContextStorage.hasContext(targetInfo.targetId)) {
          this.#browsingContextStorage.getContext(targetInfo.targetId).updateCdpTarget(cdpTarget);
        } else {
          browsingContextImpl_js_1.BrowsingContextImpl.create(cdpTarget, this.#realmStorage, targetInfo.targetId, null, this.#eventManager, this.#browsingContextStorage, this.#logger);
        }
      }
      // { "method": "Target.detachedFromTarget",
      //   "params": {
      //     "sessionId": "7EFBFB2A4942A8989B3EADC561BC46E9",
      //     "targetId": "19416886405CBA4E03DBB59FA67FF4E8" } }
      #handleDetachedFromTargetEvent(params) {
        const contextId = params.targetId;
        this.#browsingContextStorage.findContext(contextId)?.delete();
      }
      async #getRealm(target) {
        if ("realm" in target) {
          return this.#realmStorage.getRealm({
            realmId: target.realm
          });
        }
        const context = this.#browsingContextStorage.getContext(target.context);
        return context.getOrCreateSandbox(target.sandbox);
      }
      process_browsingContext_getTree(params) {
        const resultContexts = params.root === void 0 ? this.#browsingContextStorage.getTopLevelContexts() : [this.#browsingContextStorage.getContext(params.root)];
        return {
          result: {
            contexts: resultContexts.map((c) => c.serializeToBidiValue(params.maxDepth ?? Number.MAX_VALUE))
          }
        };
      }
      async process_browsingContext_create(params) {
        const browserCdpClient = this.#cdpConnection.browserClient();
        let referenceContext = void 0;
        if (params.referenceContext !== void 0) {
          referenceContext = this.#browsingContextStorage.getContext(params.referenceContext);
          if (!referenceContext.isTopLevelContext()) {
            throw new protocol_js_1.Message.InvalidArgumentException(`referenceContext should be a top-level context`);
          }
        }
        const result = await browserCdpClient.sendCommand("Target.createTarget", {
          url: "about:blank",
          newWindow: params.type === "window"
        });
        const contextId = result.targetId;
        const context = this.#browsingContextStorage.getContext(contextId);
        await context.awaitLoaded();
        return {
          result: context.serializeToBidiValue(1)
        };
      }
      process_browsingContext_navigate(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return context.navigate(params.url, params.wait === void 0 ? "none" : params.wait);
      }
      async process_browsingContext_captureScreenshot(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return context.captureScreenshot();
      }
      async process_browsingContext_print(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return context.print(params);
      }
      async process_script_addPreloadScript(params) {
        const contexts = [];
        const scripts = [];
        if (params.context) {
          contexts.push(this.#browsingContextStorage.getContext(params.context));
        } else {
          contexts.push(...this.#browsingContextStorage.getAllContexts());
        }
        scripts.push(...await Promise.all(contexts.map((context) => context.addPreloadScript(params))));
        return scripts[0];
      }
      // eslint-disable-next-line @typescript-eslint/require-await
      async process_script_removePreloadScript(_params) {
        throw new protocol_js_1.Message.UnknownErrorException("Not implemented.");
        return {};
      }
      async process_script_evaluate(params) {
        const realm = await this.#getRealm(params.target);
        return realm.scriptEvaluate(params.expression, params.awaitPromise, params.resultOwnership ?? "none");
      }
      process_script_getRealms(params) {
        if (params.context !== void 0) {
          this.#browsingContextStorage.getContext(params.context);
        }
        const realms = this.#realmStorage.findRealms({
          browsingContextId: params.context,
          type: params.type
        }).map((realm) => realm.toBiDi());
        return { result: { realms } };
      }
      async process_script_callFunction(params) {
        const realm = await this.#getRealm(params.target);
        return realm.callFunction(
          params.functionDeclaration,
          params.this || {
            type: "undefined"
          },
          // `this` is `undefined` by default.
          params.arguments || [],
          // `arguments` is `[]` by default.
          params.awaitPromise,
          params.resultOwnership ?? "none"
        );
      }
      async process_script_disown(params) {
        const realm = await this.#getRealm(params.target);
        await Promise.all(params.handles.map(async (h) => realm.disown(h)));
        return { result: {} };
      }
      async process_browsingContext_close(commandParams) {
        const browserCdpClient = this.#cdpConnection.browserClient();
        const context = this.#browsingContextStorage.getContext(commandParams.context);
        if (!context.isTopLevelContext()) {
          throw new protocol_js_1.Message.InvalidArgumentException("A top-level browsing context cannot be closed.");
        }
        const detachedFromTargetPromise = new Promise((resolve) => {
          const onContextDestroyed = (eventParams) => {
            if (eventParams.targetId === commandParams.context) {
              browserCdpClient.off("Target.detachedFromTarget", onContextDestroyed);
              resolve();
            }
          };
          browserCdpClient.on("Target.detachedFromTarget", onContextDestroyed);
        });
        await browserCdpClient.sendCommand("Target.closeTarget", {
          targetId: commandParams.context
        });
        await detachedFromTargetPromise;
        return { result: {} };
      }
      #isValidTarget(target) {
        if (target.targetId === this.#selfTargetId) {
          return false;
        }
        return ["page", "iframe"].includes(target.type);
      }
      async process_cdp_sendCommand(params) {
        const client = params.cdpSession ? this.#cdpConnection.getCdpClient(params.cdpSession) : this.#cdpConnection.browserClient();
        const sendCdpCommandResult = await client.sendCommand(params.cdpMethod, params.cdpParams);
        return {
          result: sendCdpCommandResult,
          cdpSession: params.cdpSession
        };
      }
      process_cdp_getSession(params) {
        const context = params.context;
        const sessionId = this.#browsingContextStorage.getContext(context).cdpTarget.cdpSessionId;
        if (sessionId === void 0) {
          return { result: { cdpSession: null } };
        }
        return { result: { cdpSession: sessionId } };
      }
    };
    exports.BrowsingContextProcessor = BrowsingContextProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/OutgoingBidiMessage.js
var require_OutgoingBidiMessage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/OutgoingBidiMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OutgoingBidiMessage = void 0;
    var OutgoingBidiMessage = class {
      #message;
      #channel;
      constructor(message, channel) {
        this.#message = message;
        this.#channel = channel;
      }
      static async createFromPromise(messagePromise, channel) {
        return messagePromise.then((message) => new OutgoingBidiMessage(message, channel));
      }
      static createResolved(message, channel) {
        return Promise.resolve(new OutgoingBidiMessage(message, channel));
      }
      get message() {
        return this.#message;
      }
      get channel() {
        return this.#channel;
      }
    };
    exports.OutgoingBidiMessage = OutgoingBidiMessage;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/CommandProcessor.js
var require_CommandProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/CommandProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var log_js_1 = require_log();
    var EventEmitter_js_1 = require_EventEmitter();
    var browsingContextProcessor_js_1 = require_browsingContextProcessor();
    var OutgoingBidiMessage_js_1 = require_OutgoingBidiMessage();
    var BidiNoOpParser = class {
      parseAddPreloadScriptParams(params) {
        return params;
      }
      parseRemovePreloadScriptParams(params) {
        return params;
      }
      parseGetRealmsParams(params) {
        return params;
      }
      parseCallFunctionParams(params) {
        return params;
      }
      parseEvaluateParams(params) {
        return params;
      }
      parseDisownParams(params) {
        return params;
      }
      parseSendCommandParams(params) {
        return params;
      }
      parseGetSessionParams(params) {
        return params;
      }
      parseSubscribeParams(params) {
        return params;
      }
      parseNavigateParams(params) {
        return params;
      }
      parseGetTreeParams(params) {
        return params;
      }
      parseCreateParams(params) {
        return params;
      }
      parseCloseParams(params) {
        return params;
      }
      parseCaptureScreenshotParams(params) {
        return params;
      }
      parsePrintParams(params) {
        return params;
      }
    };
    var _contextProcessor, _eventManager, _parser, _logger, _process_session_status, process_session_status_fn, _process_session_subscribe, process_session_subscribe_fn, _process_session_unsubscribe, process_session_unsubscribe_fn, _processCommand, processCommand_fn;
    var _CommandProcessor = class extends EventEmitter_js_1.EventEmitter {
      constructor(realmStorage, cdpConnection, eventManager, selfTargetId, parser = new BidiNoOpParser(), browsingContextStorage, logger) {
        super();
        __privateAdd(this, _process_session_subscribe);
        __privateAdd(this, _process_session_unsubscribe);
        __privateAdd(this, _processCommand);
        __privateAdd(this, _contextProcessor, void 0);
        __privateAdd(this, _eventManager, void 0);
        __privateAdd(this, _parser, void 0);
        __privateAdd(this, _logger, void 0);
        __privateSet(this, _eventManager, eventManager);
        __privateSet(this, _logger, logger);
        __privateSet(this, _contextProcessor, new browsingContextProcessor_js_1.BrowsingContextProcessor(realmStorage, cdpConnection, selfTargetId, eventManager, browsingContextStorage, logger));
        __privateSet(this, _parser, parser);
      }
      async processCommand(command) {
        var _a;
        try {
          const result = await __privateMethod(this, _processCommand, processCommand_fn).call(this, command);
          const response = {
            id: command.id,
            ...result
          };
          this.emit("response", OutgoingBidiMessage_js_1.OutgoingBidiMessage.createResolved(response, command.channel ?? null));
        } catch (e) {
          if (e instanceof protocol_js_1.Message.ErrorResponse) {
            const errorResponse = e;
            this.emit("response", OutgoingBidiMessage_js_1.OutgoingBidiMessage.createResolved(errorResponse.toErrorResponse(command.id), command.channel ?? null));
          } else {
            const error = e;
            (_a = __privateGet(this, _logger)) == null ? void 0 : _a.call(this, log_js_1.LogType.bidi, error);
            this.emit("response", OutgoingBidiMessage_js_1.OutgoingBidiMessage.createResolved(new protocol_js_1.Message.ErrorResponse(protocol_js_1.Message.ErrorCode.UnknownError, error.message).toErrorResponse(command.id), command.channel ?? null));
          }
        }
      }
    };
    var CommandProcessor = _CommandProcessor;
    _contextProcessor = new WeakMap();
    _eventManager = new WeakMap();
    _parser = new WeakMap();
    _logger = new WeakMap();
    _process_session_status = new WeakSet();
    process_session_status_fn = function() {
      return { result: { ready: false, message: "already connected" } };
    };
    _process_session_subscribe = new WeakSet();
    process_session_subscribe_fn = async function(params, channel) {
      await __privateGet(this, _eventManager).subscribe(params.events, params.contexts ?? [null], channel);
      return { result: {} };
    };
    _process_session_unsubscribe = new WeakSet();
    process_session_unsubscribe_fn = async function(params, channel) {
      await __privateGet(this, _eventManager).unsubscribe(params.events, params.contexts ?? [null], channel);
      return { result: {} };
    };
    _processCommand = new WeakSet();
    processCommand_fn = async function(commandData) {
      var _a;
      switch (commandData.method) {
        case "session.status":
          return __privateMethod(_a = _CommandProcessor, _process_session_status, process_session_status_fn).call(_a);
        case "session.subscribe":
          return __privateMethod(this, _process_session_subscribe, process_session_subscribe_fn).call(this, __privateGet(this, _parser).parseSubscribeParams(commandData.params), commandData.channel ?? null);
        case "session.unsubscribe":
          return __privateMethod(this, _process_session_unsubscribe, process_session_unsubscribe_fn).call(this, __privateGet(this, _parser).parseSubscribeParams(commandData.params), commandData.channel ?? null);
        case "browsingContext.create":
          return __privateGet(this, _contextProcessor).process_browsingContext_create(__privateGet(this, _parser).parseCreateParams(commandData.params));
        case "browsingContext.close":
          return __privateGet(this, _contextProcessor).process_browsingContext_close(__privateGet(this, _parser).parseCloseParams(commandData.params));
        case "browsingContext.getTree":
          return __privateGet(this, _contextProcessor).process_browsingContext_getTree(__privateGet(this, _parser).parseGetTreeParams(commandData.params));
        case "browsingContext.navigate":
          return __privateGet(this, _contextProcessor).process_browsingContext_navigate(__privateGet(this, _parser).parseNavigateParams(commandData.params));
        case "browsingContext.captureScreenshot":
          return __privateGet(this, _contextProcessor).process_browsingContext_captureScreenshot(__privateGet(this, _parser).parseCaptureScreenshotParams(commandData.params));
        case "browsingContext.print":
          return __privateGet(this, _contextProcessor).process_browsingContext_print(__privateGet(this, _parser).parsePrintParams(commandData.params));
        case "script.addPreloadScript":
          return __privateGet(this, _contextProcessor).process_script_addPreloadScript(__privateGet(this, _parser).parseAddPreloadScriptParams(commandData.params));
        case "script.removePreloadScript":
          return __privateGet(this, _contextProcessor).process_script_removePreloadScript(__privateGet(this, _parser).parseRemovePreloadScriptParams(commandData.params));
        case "script.getRealms":
          return __privateGet(this, _contextProcessor).process_script_getRealms(__privateGet(this, _parser).parseGetRealmsParams(commandData.params));
        case "script.callFunction":
          return __privateGet(this, _contextProcessor).process_script_callFunction(__privateGet(this, _parser).parseCallFunctionParams(commandData.params));
        case "script.evaluate":
          return __privateGet(this, _contextProcessor).process_script_evaluate(__privateGet(this, _parser).parseEvaluateParams(commandData.params));
        case "script.disown":
          return __privateGet(this, _contextProcessor).process_script_disown(__privateGet(this, _parser).parseDisownParams(commandData.params));
        case "cdp.sendCommand":
          return __privateGet(this, _contextProcessor).process_cdp_sendCommand(__privateGet(this, _parser).parseSendCommandParams(commandData.params));
        case "cdp.getSession":
          return __privateGet(this, _contextProcessor).process_cdp_getSession(__privateGet(this, _parser).parseGetSessionParams(commandData.params));
        default:
          throw new protocol_js_1.Message.UnknownCommandException(`Unknown command '${commandData.method}'.`);
      }
    };
    __privateAdd(CommandProcessor, _process_session_status);
    exports.CommandProcessor = CommandProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/browsingContextStorage.js
var require_browsingContextStorage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/context/browsingContextStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowsingContextStorage = void 0;
    var protocol_js_1 = require_protocol();
    var BrowsingContextStorage = class {
      /** Map from context ID to context implementation. */
      #contexts = /* @__PURE__ */ new Map();
      /** Gets all top-level contexts, i.e. those with no parent. */
      getTopLevelContexts() {
        return this.getAllContexts().filter((c) => c.isTopLevelContext());
      }
      /** Gets all contexts. */
      getAllContexts() {
        return Array.from(this.#contexts.values());
      }
      /** Deletes the context with the given ID. */
      deleteContext(contextId) {
        this.#contexts.delete(contextId);
      }
      /** Adds the given context. */
      addContext(context) {
        this.#contexts.set(context.contextId, context);
        if (!context.isTopLevelContext()) {
          this.getContext(context.parentId).addChild(context);
        }
      }
      /** Returns true whether there is an existing context with the given ID. */
      hasContext(contextId) {
        return this.#contexts.has(contextId);
      }
      /** Gets the context with the given ID, if any. */
      findContext(contextId) {
        return this.#contexts.get(contextId);
      }
      /** Returns the top-level context ID of the given context, if any. */
      findTopLevelContextId(contextId) {
        if (contextId === null) {
          return null;
        }
        const maybeContext = this.findContext(contextId);
        const parentId = maybeContext?.parentId ?? null;
        if (parentId === null) {
          return contextId;
        }
        return this.findTopLevelContextId(parentId);
      }
      /** Gets the context with the given ID, if any, otherwise throws. */
      getContext(contextId) {
        const result = this.findContext(contextId);
        if (result === void 0) {
          throw new protocol_js_1.Message.NoSuchFrameException(`Context ${contextId} not found`);
        }
        return result;
      }
    };
    exports.BrowsingContextStorage = BrowsingContextStorage;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/buffer.js
var require_buffer = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/buffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Buffer = void 0;
    var Buffer2 = class {
      #capacity;
      #entries = [];
      #onItemRemoved;
      /**
       * @param capacity
       * @param onItemRemoved optional delegate called for each removed element.
       */
      constructor(capacity, onItemRemoved = () => {
      }) {
        this.#capacity = capacity;
        this.#onItemRemoved = onItemRemoved;
      }
      get() {
        return this.#entries;
      }
      add(value) {
        this.#entries.push(value);
        while (this.#entries.length > this.#capacity) {
          const item = this.#entries.shift();
          if (item !== void 0) {
            this.#onItemRemoved(item);
          }
        }
      }
    };
    exports.Buffer = Buffer2;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/idWrapper.js
var require_idWrapper = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/idWrapper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IdWrapper = void 0;
    var _counter, _id;
    var _IdWrapper = class {
      constructor() {
        __privateAdd(this, _id, void 0);
        __privateSet(this, _id, ++__privateWrapper(_IdWrapper, _counter)._);
      }
      get id() {
        return __privateGet(this, _id);
      }
    };
    var IdWrapper = _IdWrapper;
    _counter = new WeakMap();
    _id = new WeakMap();
    __privateAdd(IdWrapper, _counter, 0);
    exports.IdWrapper = IdWrapper;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/events/SubscriptionManager.js
var require_SubscriptionManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/events/SubscriptionManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscriptionManager = exports.unrollEvents = exports.cartesianProduct = void 0;
    var protocol_js_1 = require_protocol();
    function cartesianProduct(...a) {
      return a.reduce((a2, b) => a2.flatMap((d) => b.map((e) => [d, e].flat())));
    }
    exports.cartesianProduct = cartesianProduct;
    function unrollEvents(events) {
      const allEvents = [];
      for (const event of events) {
        switch (event) {
          case protocol_js_1.BrowsingContext.AllEvents:
            allEvents.push(...Object.values(protocol_js_1.BrowsingContext.EventNames));
            break;
          case protocol_js_1.CDP.AllEvents:
            allEvents.push(...Object.values(protocol_js_1.CDP.EventNames));
            break;
          case protocol_js_1.Log.AllEvents:
            allEvents.push(...Object.values(protocol_js_1.Log.EventNames));
            break;
          case protocol_js_1.Network.AllEvents:
            allEvents.push(...Object.values(protocol_js_1.Network.EventNames));
            break;
          case protocol_js_1.Script.AllEvents:
            allEvents.push(...Object.values(protocol_js_1.Script.EventNames));
            break;
          default:
            allEvents.push(event);
        }
      }
      return allEvents;
    }
    exports.unrollEvents = unrollEvents;
    var SubscriptionManager = class {
      #subscriptionPriority = 0;
      // BrowsingContext `null` means the event has subscription across all the
      // browsing contexts.
      // Channel `null` means no `channel` should be added.
      #channelToContextToEventMap = /* @__PURE__ */ new Map();
      #browsingContextStorage;
      constructor(browsingContextStorage) {
        this.#browsingContextStorage = browsingContextStorage;
      }
      getChannelsSubscribedToEvent(eventMethod, contextId) {
        const prioritiesAndChannels = Array.from(this.#channelToContextToEventMap.keys()).map((channel) => ({
          priority: this.#getEventSubscriptionPriorityForChannel(eventMethod, contextId, channel),
          channel
        })).filter(({ priority }) => priority !== null);
        return prioritiesAndChannels.sort((a, b) => a.priority - b.priority).map(({ channel }) => channel);
      }
      #getEventSubscriptionPriorityForChannel(eventMethod, contextId, channel) {
        const contextToEventMap = this.#channelToContextToEventMap.get(channel);
        if (contextToEventMap === void 0) {
          return null;
        }
        const maybeTopLevelContextId = this.#browsingContextStorage.findTopLevelContextId(contextId);
        const relevantContexts = [.../* @__PURE__ */ new Set([null, maybeTopLevelContextId])];
        const priorities = relevantContexts.map((c) => contextToEventMap.get(c)?.get(eventMethod)).filter((p) => p !== void 0);
        if (priorities.length === 0) {
          return null;
        }
        return Math.min(...priorities);
      }
      subscribe(event, contextId, channel) {
        contextId = this.#browsingContextStorage.findTopLevelContextId(contextId);
        if (event === protocol_js_1.BrowsingContext.AllEvents) {
          Object.values(protocol_js_1.BrowsingContext.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel));
          return;
        }
        if (event === protocol_js_1.CDP.AllEvents) {
          Object.values(protocol_js_1.CDP.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel));
          return;
        }
        if (event === protocol_js_1.Log.AllEvents) {
          Object.values(protocol_js_1.Log.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel));
          return;
        }
        if (event === protocol_js_1.Network.AllEvents) {
          Object.values(protocol_js_1.Network.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel));
          return;
        }
        if (event === protocol_js_1.Script.AllEvents) {
          Object.values(protocol_js_1.Script.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel));
          return;
        }
        if (!this.#channelToContextToEventMap.has(channel)) {
          this.#channelToContextToEventMap.set(channel, /* @__PURE__ */ new Map());
        }
        const contextToEventMap = this.#channelToContextToEventMap.get(channel);
        if (!contextToEventMap.has(contextId)) {
          contextToEventMap.set(contextId, /* @__PURE__ */ new Map());
        }
        const eventMap = contextToEventMap.get(contextId);
        if (eventMap.has(event)) {
          return;
        }
        eventMap.set(event, this.#subscriptionPriority++);
      }
      /**
       * Unsubscribes atomically from all events in the given contexts and channel.
       */
      unsubscribeAll(events, contextIds, channel) {
        for (const contextId of contextIds) {
          if (contextId !== null) {
            this.#browsingContextStorage.getContext(contextId);
          }
        }
        const eventContextPairs = cartesianProduct(unrollEvents(events), contextIds);
        eventContextPairs.map(([event, contextId]) => this.#checkUnsubscribe(event, contextId, channel)).forEach((unsubscribe) => unsubscribe());
      }
      /**
       * Unsubscribes from the event in the given context and channel.
       * Syntactic sugar for "unsubscribeAll".
       */
      unsubscribe(eventName, contextId, channel) {
        this.unsubscribeAll([eventName], [contextId], channel);
      }
      #checkUnsubscribe(event, contextId, channel) {
        contextId = this.#browsingContextStorage.findTopLevelContextId(contextId);
        if (!this.#channelToContextToEventMap.has(channel)) {
          throw new protocol_js_1.Message.InvalidArgumentException(`Cannot unsubscribe from ${event}, ${contextId === null ? "null" : contextId}. No subscription found.`);
        }
        const contextToEventMap = this.#channelToContextToEventMap.get(channel);
        if (!contextToEventMap.has(contextId)) {
          throw new protocol_js_1.Message.InvalidArgumentException(`Cannot unsubscribe from ${event}, ${contextId === null ? "null" : contextId}. No subscription found.`);
        }
        const eventMap = contextToEventMap.get(contextId);
        if (!eventMap.has(event)) {
          throw new protocol_js_1.Message.InvalidArgumentException(`Cannot unsubscribe from ${event}, ${contextId === null ? "null" : contextId}. No subscription found.`);
        }
        return () => {
          eventMap.delete(event);
          if (eventMap.size === 0) {
            contextToEventMap.delete(event);
          }
          if (contextToEventMap.size === 0) {
            this.#channelToContextToEventMap.delete(channel);
          }
        };
      }
    };
    exports.SubscriptionManager = SubscriptionManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/events/EventManager.js
var require_EventManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/events/EventManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventManager = void 0;
    var protocol_js_1 = require_protocol();
    var buffer_js_1 = require_buffer();
    var idWrapper_js_1 = require_idWrapper();
    var OutgoingBidiMessage_js_1 = require_OutgoingBidiMessage();
    var DefaultMap_js_1 = require_DefaultMap();
    var SubscriptionManager_js_1 = require_SubscriptionManager();
    var EventWrapper = class {
      #idWrapper;
      #contextId;
      #event;
      constructor(event, contextId) {
        this.#idWrapper = new idWrapper_js_1.IdWrapper();
        this.#contextId = contextId;
        this.#event = event;
      }
      get id() {
        return this.#idWrapper.id;
      }
      get contextId() {
        return this.#contextId;
      }
      get event() {
        return this.#event;
      }
    };
    var eventBufferLength = /* @__PURE__ */ new Map([
      [protocol_js_1.Log.EventNames.LogEntryAddedEvent, 100]
    ]);
    var _NETWORK_DOMAIN_PREFIX, _eventToContextsMap, _eventBuffers, _lastMessageSent, _subscriptionManager, _bidiServer, _isNetworkDomainEnabled, _getMapKey, getMapKey_fn, _handleDomains, handleDomains_fn, _bufferEvent, bufferEvent_fn, _markEventSent, markEventSent_fn, _getBufferedEvents, getBufferedEvents_fn;
    var _EventManager = class {
      constructor(bidiServer) {
        /**
         * Enables domains for the subscribed event in the required contexts or
         * globally.
         */
        __privateAdd(this, _handleDomains);
        /**
         * If the event is buffer-able, put it in the buffer.
         */
        __privateAdd(this, _bufferEvent);
        /**
         * If the event is buffer-able, mark it as sent to the given contextId and channel.
         */
        __privateAdd(this, _markEventSent);
        /**
         * Returns events which are buffered and not yet sent to the given channel events.
         */
        __privateAdd(this, _getBufferedEvents);
        /**
         * Maps event name to a set of contexts where this event already happened.
         * Needed for getting buffered events from all the contexts in case of
         * subscripting to all contexts.
         */
        __privateAdd(this, _eventToContextsMap, new DefaultMap_js_1.DefaultMap(() => /* @__PURE__ */ new Set()));
        /**
         * Maps `eventName` + `browsingContext` to buffer. Used to get buffered events
         * during subscription. Channel-agnostic.
         */
        __privateAdd(this, _eventBuffers, /* @__PURE__ */ new Map());
        /**
         * Maps `eventName` + `browsingContext` + `channel` to last sent event id.
         * Used to avoid sending duplicated events when user
         * subscribes -> unsubscribes -> subscribes.
         */
        __privateAdd(this, _lastMessageSent, /* @__PURE__ */ new Map());
        __privateAdd(this, _subscriptionManager, void 0);
        __privateAdd(this, _bidiServer, void 0);
        __privateAdd(this, _isNetworkDomainEnabled, void 0);
        __privateSet(this, _bidiServer, bidiServer);
        __privateSet(this, _subscriptionManager, new SubscriptionManager_js_1.SubscriptionManager(bidiServer.getBrowsingContextStorage()));
        __privateSet(this, _isNetworkDomainEnabled, false);
      }
      get isNetworkDomainEnabled() {
        return __privateGet(this, _isNetworkDomainEnabled);
      }
      registerEvent(event, contextId) {
        this.registerPromiseEvent(Promise.resolve(event), contextId, event.method);
      }
      registerPromiseEvent(event, contextId, eventName) {
        const eventWrapper = new EventWrapper(event, contextId);
        const sortedChannels = __privateGet(this, _subscriptionManager).getChannelsSubscribedToEvent(eventName, contextId);
        __privateMethod(this, _bufferEvent, bufferEvent_fn).call(this, eventWrapper, eventName);
        for (const channel of sortedChannels) {
          __privateGet(this, _bidiServer).emitOutgoingMessage(OutgoingBidiMessage_js_1.OutgoingBidiMessage.createFromPromise(event, channel));
          __privateMethod(this, _markEventSent, markEventSent_fn).call(this, eventWrapper, channel, eventName);
        }
      }
      async subscribe(eventNames, contextIds, channel) {
        for (const contextId of contextIds) {
          if (contextId !== null) {
            __privateGet(this, _bidiServer).getBrowsingContextStorage().getContext(contextId);
          }
        }
        for (const eventName of eventNames) {
          for (const contextId of contextIds) {
            await __privateMethod(this, _handleDomains, handleDomains_fn).call(this, eventName, contextId);
            __privateGet(this, _subscriptionManager).subscribe(eventName, contextId, channel);
            for (const eventWrapper of __privateMethod(this, _getBufferedEvents, getBufferedEvents_fn).call(this, eventName, contextId, channel)) {
              __privateGet(this, _bidiServer).emitOutgoingMessage(OutgoingBidiMessage_js_1.OutgoingBidiMessage.createFromPromise(eventWrapper.event, channel));
              __privateMethod(this, _markEventSent, markEventSent_fn).call(this, eventWrapper, channel, eventName);
            }
          }
        }
      }
      unsubscribe(eventNames, contextIds, channel) {
        __privateGet(this, _subscriptionManager).unsubscribeAll(eventNames, contextIds, channel);
      }
    };
    var EventManager = _EventManager;
    _NETWORK_DOMAIN_PREFIX = new WeakMap();
    _eventToContextsMap = new WeakMap();
    _eventBuffers = new WeakMap();
    _lastMessageSent = new WeakMap();
    _subscriptionManager = new WeakMap();
    _bidiServer = new WeakMap();
    _isNetworkDomainEnabled = new WeakMap();
    _getMapKey = new WeakSet();
    getMapKey_fn = function(eventName, browsingContext, channel) {
      return JSON.stringify({ eventName, browsingContext, channel });
    };
    _handleDomains = new WeakSet();
    handleDomains_fn = async function(eventName, contextId) {
      if (eventName.startsWith(__privateGet(_EventManager, _NETWORK_DOMAIN_PREFIX))) {
        if (contextId === null) {
          __privateSet(this, _isNetworkDomainEnabled, true);
          await Promise.all(__privateGet(this, _bidiServer).getBrowsingContextStorage().getAllContexts().map((context) => context.cdpTarget.enableNetworkDomain()));
        } else {
          await __privateGet(this, _bidiServer).getBrowsingContextStorage().getContext(contextId).cdpTarget.enableNetworkDomain();
        }
      }
    };
    _bufferEvent = new WeakSet();
    bufferEvent_fn = function(eventWrapper, eventName) {
      var _a;
      if (!eventBufferLength.has(eventName)) {
        return;
      }
      const bufferMapKey = __privateMethod(_a = _EventManager, _getMapKey, getMapKey_fn).call(_a, eventName, eventWrapper.contextId);
      if (!__privateGet(this, _eventBuffers).has(bufferMapKey)) {
        __privateGet(this, _eventBuffers).set(bufferMapKey, new buffer_js_1.Buffer(eventBufferLength.get(eventName)));
      }
      __privateGet(this, _eventBuffers).get(bufferMapKey).add(eventWrapper);
      __privateGet(this, _eventToContextsMap).get(eventName).add(eventWrapper.contextId);
    };
    _markEventSent = new WeakSet();
    markEventSent_fn = function(eventWrapper, channel, eventName) {
      var _a;
      if (!eventBufferLength.has(eventName)) {
        return;
      }
      const lastSentMapKey = __privateMethod(_a = _EventManager, _getMapKey, getMapKey_fn).call(_a, eventName, eventWrapper.contextId, channel);
      __privateGet(this, _lastMessageSent).set(lastSentMapKey, Math.max(__privateGet(this, _lastMessageSent).get(lastSentMapKey) ?? 0, eventWrapper.id));
    };
    _getBufferedEvents = new WeakSet();
    getBufferedEvents_fn = function(eventName, contextId, channel) {
      var _a, _b;
      const bufferMapKey = __privateMethod(_a = _EventManager, _getMapKey, getMapKey_fn).call(_a, eventName, contextId);
      const lastSentMapKey = __privateMethod(_b = _EventManager, _getMapKey, getMapKey_fn).call(_b, eventName, contextId, channel);
      const lastSentMessageId = __privateGet(this, _lastMessageSent).get(lastSentMapKey) ?? -Infinity;
      const result = __privateGet(this, _eventBuffers).get(bufferMapKey)?.get().filter((wrapper) => wrapper.id > lastSentMessageId) ?? [];
      if (contextId === null) {
        Array.from(__privateGet(this, _eventToContextsMap).get(eventName).keys()).filter((_contextId) => (
          // Events without context are already in the result.
          _contextId !== null && // Events from deleted contexts should not be sent.
          __privateGet(this, _bidiServer).getBrowsingContextStorage().hasContext(_contextId)
        )).map((_contextId) => __privateMethod(this, _getBufferedEvents, getBufferedEvents_fn).call(this, eventName, _contextId, channel)).forEach((events) => result.push(...events));
      }
      return result.sort((e1, e2) => e1.id - e2.id);
    };
    /**
     * Returns consistent key to be used to access value maps.
     */
    __privateAdd(EventManager, _getMapKey);
    __privateAdd(EventManager, _NETWORK_DOMAIN_PREFIX, "network");
    exports.EventManager = EventManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/script/realmStorage.js
var require_realmStorage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/domains/script/realmStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RealmStorage = void 0;
    var protocol_js_1 = require_protocol();
    var RealmStorage = class {
      /** Tracks handles and their realms sent to the client. */
      #knownHandlesToRealm = /* @__PURE__ */ new Map();
      /** Map from realm ID to Realm. */
      #realmMap = /* @__PURE__ */ new Map();
      get knownHandlesToRealm() {
        return this.#knownHandlesToRealm;
      }
      get realmMap() {
        return this.#realmMap;
      }
      findRealms(filter) {
        return Array.from(this.#realmMap.values()).filter((realm) => {
          if (filter.realmId !== void 0 && filter.realmId !== realm.realmId) {
            return false;
          }
          if (filter.browsingContextId !== void 0 && filter.browsingContextId !== realm.browsingContextId) {
            return false;
          }
          if (filter.navigableId !== void 0 && filter.navigableId !== realm.navigableId) {
            return false;
          }
          if (filter.executionContextId !== void 0 && filter.executionContextId !== realm.executionContextId) {
            return false;
          }
          if (filter.origin !== void 0 && filter.origin !== realm.origin) {
            return false;
          }
          if (filter.type !== void 0 && filter.type !== realm.type) {
            return false;
          }
          if (filter.sandbox !== void 0 && filter.sandbox !== realm.sandbox) {
            return false;
          }
          if (filter.cdpSessionId !== void 0 && filter.cdpSessionId !== realm.cdpSessionId) {
            return false;
          }
          return true;
        });
      }
      findRealm(filter) {
        const maybeRealms = this.findRealms(filter);
        if (maybeRealms.length !== 1) {
          return void 0;
        }
        return maybeRealms[0];
      }
      getRealm(filter) {
        const maybeRealm = this.findRealm(filter);
        if (maybeRealm === void 0) {
          throw new protocol_js_1.Message.NoSuchFrameException(`Realm ${JSON.stringify(filter)} not found`);
        }
        return maybeRealm;
      }
      deleteRealms(filter) {
        this.findRealms(filter).map((realm) => {
          this.#realmMap.delete(realm.realmId);
          Array.from(this.#knownHandlesToRealm.entries()).filter(([, r]) => r === realm.realmId).map(([h]) => this.#knownHandlesToRealm.delete(h));
        });
      }
    };
    exports.RealmStorage = RealmStorage;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiServer.js
var require_BidiServer = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiServer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BidiServer = void 0;
    var EventEmitter_js_1 = require_EventEmitter();
    var processingQueue_js_1 = require_processingQueue();
    var CommandProcessor_js_1 = require_CommandProcessor();
    var browsingContextStorage_js_1 = require_browsingContextStorage();
    var EventManager_js_1 = require_EventManager();
    var realmStorage_js_1 = require_realmStorage();
    var BidiServer2 = class extends EventEmitter_js_1.EventEmitter {
      #messageQueue;
      #transport;
      #commandProcessor;
      #browsingContextStorage;
      #realmStorage;
      #logger;
      #handleIncomingMessage = (message) => {
        this.#commandProcessor.processCommand(message);
      };
      #processOutgoingMessage = async (messageEntry) => {
        const message = messageEntry.message;
        if (messageEntry.channel !== null) {
          message["channel"] = messageEntry.channel;
        }
        await this.#transport.sendMessage(message);
      };
      constructor(bidiTransport, cdpConnection, selfTargetId, parser, logger) {
        super();
        this.#logger = logger;
        this.#browsingContextStorage = new browsingContextStorage_js_1.BrowsingContextStorage();
        this.#realmStorage = new realmStorage_js_1.RealmStorage();
        this.#messageQueue = new processingQueue_js_1.ProcessingQueue(this.#processOutgoingMessage, () => Promise.resolve(), this.#logger);
        this.#transport = bidiTransport;
        this.#transport.setOnMessage(this.#handleIncomingMessage);
        this.#commandProcessor = new CommandProcessor_js_1.CommandProcessor(this.#realmStorage, cdpConnection, new EventManager_js_1.EventManager(this), selfTargetId, parser, this.#browsingContextStorage, this.#logger);
        this.#commandProcessor.on("response", (response) => {
          this.emitOutgoingMessage(response);
        });
      }
      static async createAndStart(bidiTransport, cdpConnection, selfTargetId, parser, logger) {
        const server = new BidiServer2(bidiTransport, cdpConnection, selfTargetId, parser, logger);
        const cdpClient = cdpConnection.browserClient();
        await cdpClient.sendCommand("Target.setDiscoverTargets", { discover: true });
        await cdpClient.sendCommand("Target.setAutoAttach", {
          autoAttach: true,
          waitForDebuggerOnStart: true,
          flatten: true
        });
        await server.topLevelContextsLoaded();
        return server;
      }
      async topLevelContextsLoaded() {
        await Promise.all(this.#browsingContextStorage.getTopLevelContexts().map((c) => c.awaitLoaded()));
      }
      /**
       * Sends BiDi message.
       */
      emitOutgoingMessage(messageEntry) {
        this.#messageQueue.add(messageEntry);
      }
      close() {
        this.#transport.close();
      }
      getBrowsingContextStorage() {
        return this.#browsingContextStorage;
      }
    };
    exports.BidiServer = BidiServer2;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/bidiMapper.js
var require_bidiMapper = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/bidiMapper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventEmitter = exports.BidiServer = void 0;
    var BidiServer_js_1 = require_BidiServer();
    Object.defineProperty(exports, "BidiServer", { enumerable: true, get: function() {
      return BidiServer_js_1.BidiServer;
    } });
    var EventEmitter_js_1 = require_EventEmitter();
    Object.defineProperty(exports, "EventEmitter", { enumerable: true, get: function() {
      return EventEmitter_js_1.EventEmitter;
    } });
  }
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/Serializer.js
var UnserializableError = class extends Error {
};
var BidiSerializer = class {
  static serializeNumber(arg) {
    let value;
    if (Object.is(arg, -0)) {
      value = "-0";
    } else if (Object.is(arg, Infinity)) {
      value = "Infinity";
    } else if (Object.is(arg, -Infinity)) {
      value = "-Infinity";
    } else if (Object.is(arg, NaN)) {
      value = "NaN";
    } else {
      value = arg;
    }
    return {
      type: "number",
      value
    };
  }
  static serializeObject(arg) {
    if (arg === null) {
      return {
        type: "null"
      };
    } else if (Array.isArray(arg)) {
      const parsedArray = arg.map((subArg) => {
        return BidiSerializer.serializeRemoveValue(subArg);
      });
      return {
        type: "array",
        value: parsedArray
      };
    } else if (isPlainObject(arg)) {
      try {
        JSON.stringify(arg);
      } catch (error) {
        if (error instanceof TypeError && error.message.startsWith("Converting circular structure to JSON")) {
          error.message += " Recursive objects are not allowed.";
        }
        throw error;
      }
      const parsedObject = [];
      for (const key in arg) {
        parsedObject.push([
          BidiSerializer.serializeRemoveValue(key),
          BidiSerializer.serializeRemoveValue(arg[key])
        ]);
      }
      return {
        type: "object",
        value: parsedObject
      };
    } else if (isRegExp(arg)) {
      return {
        type: "regexp",
        value: {
          pattern: arg.source,
          flags: arg.flags
        }
      };
    } else if (isDate(arg)) {
      return {
        type: "date",
        value: arg.toISOString()
      };
    }
    throw new UnserializableError("Custom object sterilization not possible. Use plain objects instead.");
  }
  static serializeRemoveValue(arg) {
    switch (typeof arg) {
      case "symbol":
      case "function":
        throw new UnserializableError(`Unable to serializable ${typeof arg}`);
      case "object":
        return BidiSerializer.serializeObject(arg);
      case "undefined":
        return {
          type: "undefined"
        };
      case "number":
        return BidiSerializer.serializeNumber(arg);
      case "bigint":
        return {
          type: "bigint",
          value: arg.toString()
        };
      case "string":
        return {
          type: "string",
          value: arg
        };
      case "boolean":
        return {
          type: "boolean",
          value: arg
        };
    }
  }
  static serialize(arg, context) {
    const objectHandle = arg && (arg instanceof JSHandle2 || arg instanceof ElementHandle2) ? arg : null;
    if (objectHandle) {
      if (objectHandle.context() !== context) {
        throw new Error("JSHandles can be evaluated only in the context they were created!");
      }
      if (objectHandle.disposed) {
        throw new Error("JSHandle is disposed!");
      }
      return objectHandle.remoteValue();
    }
    return BidiSerializer.serializeRemoveValue(arg);
  }
  static deserializeNumber(value) {
    switch (value) {
      case "-0":
        return -0;
      case "NaN":
        return NaN;
      case "Infinity":
      case "+Infinity":
        return Infinity;
      case "-Infinity":
        return -Infinity;
      default:
        return value;
    }
  }
  static deserializeLocalValue(result) {
    var _a;
    switch (result.type) {
      case "array":
        return (_a = result.value) === null || _a === void 0 ? void 0 : _a.map((value) => {
          return BidiSerializer.deserializeLocalValue(value);
        });
      case "set":
        return result.value.reduce((acc, value) => {
          return acc.add(BidiSerializer.deserializeLocalValue(value));
        }, /* @__PURE__ */ new Set());
      case "object":
        if (result.value) {
          return result.value.reduce((acc, tuple) => {
            const { key, value } = BidiSerializer.deserializeTuple(tuple);
            acc[key] = value;
            return acc;
          }, {});
        }
        break;
      case "map":
        return result.value.reduce((acc, tuple) => {
          const { key, value } = BidiSerializer.deserializeTuple(tuple);
          return acc.set(key, value);
        }, /* @__PURE__ */ new Map());
      case "promise":
        return {};
      case "regexp":
        return new RegExp(result.value.pattern, result.value.flags);
      case "date":
        return new Date(result.value);
      case "undefined":
        return void 0;
      case "null":
        return null;
      case "number":
        return BidiSerializer.deserializeNumber(result.value);
      case "bigint":
        return BigInt(result.value);
      case "boolean":
        return Boolean(result.value);
      case "string":
        return result.value;
    }
    throw new UnserializableError(`Deserialization of type ${result.type} not supported.`);
  }
  static deserializeTuple([serializedKey, serializedValue]) {
    const key = typeof serializedKey === "string" ? serializedKey : BidiSerializer.deserializeLocalValue(serializedKey);
    const value = BidiSerializer.deserializeLocalValue(serializedValue);
    return { key, value };
  }
  static deserialize(result) {
    if (!result) {
      debugError("Service did not produce a result.");
      return void 0;
    }
    try {
      return BidiSerializer.deserializeLocalValue(result);
    } catch (error) {
      if (error instanceof UnserializableError) {
        debugError(error.message);
        return void 0;
      }
      throw error;
    }
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/utils.js
var debugError2 = debug("puppeteer:error");
async function releaseReference(client, remoteReference) {
  if (!remoteReference.handle) {
    return;
  }
  await client.connection.send("script.disown", {
    target: { context: client._contextId },
    handles: [remoteReference.handle]
  }).catch((error) => {
    debugError2(error);
  });
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/JSHandle.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JSHandle_disposed;
var _JSHandle_context;
var _JSHandle_remoteValue;
var JSHandle2 = class extends JSHandle {
  constructor(context, remoteValue) {
    super();
    _JSHandle_disposed.set(this, false);
    _JSHandle_context.set(this, void 0);
    _JSHandle_remoteValue.set(this, void 0);
    __classPrivateFieldSet(this, _JSHandle_context, context, "f");
    __classPrivateFieldSet(this, _JSHandle_remoteValue, remoteValue, "f");
  }
  context() {
    return __classPrivateFieldGet(this, _JSHandle_context, "f");
  }
  get connection() {
    return __classPrivateFieldGet(this, _JSHandle_context, "f").connection;
  }
  get disposed() {
    return __classPrivateFieldGet(this, _JSHandle_disposed, "f");
  }
  async evaluate(pageFunction, ...args) {
    return await this.context().evaluate(pageFunction, this, ...args);
  }
  async evaluateHandle(pageFunction, ...args) {
    return await this.context().evaluateHandle(pageFunction, this, ...args);
  }
  async getProperty(propertyName) {
    return await this.evaluateHandle((object, propertyName2) => {
      return object[propertyName2];
    }, propertyName);
  }
  async getProperties() {
    const keys = await this.evaluate((object) => {
      return Object.getOwnPropertyNames(object);
    });
    const map = /* @__PURE__ */ new Map();
    const results = await Promise.all(keys.map((key) => {
      return this.getProperty(key);
    }));
    for (const [key, value] of Object.entries(keys)) {
      const handle = results[key];
      if (handle) {
        map.set(value, handle);
      }
    }
    return map;
  }
  async jsonValue() {
    const value = BidiSerializer.deserialize(__classPrivateFieldGet(this, _JSHandle_remoteValue, "f"));
    if (__classPrivateFieldGet(this, _JSHandle_remoteValue, "f").type !== "undefined" && value === void 0) {
      throw new Error("Could not serialize referenced object");
    }
    return value;
  }
  asElement() {
    return null;
  }
  async dispose() {
    if (__classPrivateFieldGet(this, _JSHandle_disposed, "f")) {
      return;
    }
    __classPrivateFieldSet(this, _JSHandle_disposed, true, "f");
    if ("handle" in __classPrivateFieldGet(this, _JSHandle_remoteValue, "f")) {
      await releaseReference(__classPrivateFieldGet(this, _JSHandle_context, "f"), __classPrivateFieldGet(this, _JSHandle_remoteValue, "f"));
    }
  }
  get isPrimitiveValue() {
    switch (__classPrivateFieldGet(this, _JSHandle_remoteValue, "f").type) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
      case "undefined":
      case "null":
        return true;
      default:
        return false;
    }
  }
  toString() {
    if (this.isPrimitiveValue) {
      return "JSHandle:" + BidiSerializer.deserialize(__classPrivateFieldGet(this, _JSHandle_remoteValue, "f"));
    }
    return "JSHandle@" + __classPrivateFieldGet(this, _JSHandle_remoteValue, "f").type;
  }
  get id() {
    return "handle" in __classPrivateFieldGet(this, _JSHandle_remoteValue, "f") ? __classPrivateFieldGet(this, _JSHandle_remoteValue, "f").handle : void 0;
  }
  remoteValue() {
    return __classPrivateFieldGet(this, _JSHandle_remoteValue, "f");
  }
};
_JSHandle_disposed = /* @__PURE__ */ new WeakMap(), _JSHandle_context = /* @__PURE__ */ new WeakMap(), _JSHandle_remoteValue = /* @__PURE__ */ new WeakMap();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/ElementHandle.js
var ElementHandle2 = class extends ElementHandle {
  constructor(context, remoteValue) {
    super(new JSHandle2(context, remoteValue));
  }
  context() {
    return this.handle.context();
  }
  get connection() {
    return this.handle.connection;
  }
  get isPrimitiveValue() {
    return this.handle.isPrimitiveValue;
  }
  remoteValue() {
    return this.handle.remoteValue();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/Context.js
var __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
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
var _Context_instances;
var _Context_connection;
var _Context_url;
var _Context_evaluate;
var lifeCycleToReadinessState = /* @__PURE__ */ new Map([
  ["load", "complete"],
  ["domcontentloaded", "interactive"]
]);
var lifeCycleToSubscribedEvent = /* @__PURE__ */ new Map([
  ["load", "browsingContext.load"],
  ["domcontentloaded", "browsingContext.domContentLoaded"]
]);
var Context = class extends EventEmitter {
  constructor(connection, result) {
    super();
    _Context_instances.add(this);
    _Context_connection.set(this, void 0);
    _Context_url.set(this, void 0);
    this._timeoutSettings = new TimeoutSettings();
    __classPrivateFieldSet2(this, _Context_connection, connection, "f");
    this._contextId = result.context;
    __classPrivateFieldSet2(this, _Context_url, result.url, "f");
  }
  get connection() {
    return __classPrivateFieldGet2(this, _Context_connection, "f");
  }
  get id() {
    return this._contextId;
  }
  async evaluateHandle(pageFunction, ...args) {
    return __classPrivateFieldGet2(this, _Context_instances, "m", _Context_evaluate).call(this, false, pageFunction, ...args);
  }
  async evaluate(pageFunction, ...args) {
    return __classPrivateFieldGet2(this, _Context_instances, "m", _Context_evaluate).call(this, true, pageFunction, ...args);
  }
  async goto(url, options = {}) {
    const { waitUntil = "load", timeout = this._timeoutSettings.navigationTimeout() } = options;
    const readinessState = lifeCycleToReadinessState.get(getWaitUntilSingle(waitUntil));
    try {
      const response = await waitWithTimeout(this.connection.send("browsingContext.navigate", {
        url,
        context: this.id,
        wait: readinessState
      }), "Navigation", timeout);
      __classPrivateFieldSet2(this, _Context_url, response.result.url, "f");
      return null;
    } catch (error) {
      if (error instanceof ProtocolError) {
        error.message += ` at ${url}`;
      } else if (error instanceof TimeoutError) {
        error.message = "Navigation timeout of " + timeout + " ms exceeded";
      }
      throw error;
    }
  }
  url() {
    return __classPrivateFieldGet2(this, _Context_url, "f");
  }
  async setContent(html, options = {}) {
    const { waitUntil = "load", timeout = this._timeoutSettings.navigationTimeout() } = options;
    const waitUntilCommand = lifeCycleToSubscribedEvent.get(getWaitUntilSingle(waitUntil));
    await Promise.all([
      setPageContent(this, html),
      waitWithTimeout(new Promise((resolve) => {
        this.once(waitUntilCommand, () => {
          resolve();
        });
      }), waitUntilCommand, timeout)
    ]);
  }
};
_Context_connection = /* @__PURE__ */ new WeakMap(), _Context_url = /* @__PURE__ */ new WeakMap(), _Context_instances = /* @__PURE__ */ new WeakSet(), _Context_evaluate = async function _Context_evaluate2(returnByValue, pageFunction, ...args) {
  let responsePromise;
  const resultOwnership = returnByValue ? "none" : "root";
  if (isString(pageFunction)) {
    responsePromise = __classPrivateFieldGet2(this, _Context_connection, "f").send("script.evaluate", {
      expression: pageFunction,
      target: { context: this._contextId },
      resultOwnership,
      awaitPromise: true
    });
  } else {
    responsePromise = __classPrivateFieldGet2(this, _Context_connection, "f").send("script.callFunction", {
      functionDeclaration: stringifyFunction(pageFunction),
      arguments: await Promise.all(args.map((arg) => {
        return BidiSerializer.serialize(arg, this);
      })),
      target: { context: this._contextId },
      resultOwnership,
      awaitPromise: true
    });
  }
  const { result } = await responsePromise;
  if ("type" in result && result.type === "exception") {
    throw new Error(result.exceptionDetails.text);
  }
  return returnByValue ? BidiSerializer.deserialize(result.result) : getBidiHandle(this, result.result);
};
function getWaitUntilSingle(event) {
  if (Array.isArray(event) && event.length > 1) {
    throw new Error("BiDi support only single `waitUntil` argument");
  }
  const waitUntilSingle = Array.isArray(event) ? event.find((lifecycle) => {
    return lifecycle === "domcontentloaded" || lifecycle === "load";
  }) : event;
  if (waitUntilSingle === "networkidle0" || waitUntilSingle === "networkidle2") {
    throw new Error(`BiDi does not support 'waitUntil' ${waitUntilSingle}`);
  }
  assert(waitUntilSingle, `Invalid waitUntil option ${waitUntilSingle}`);
  return waitUntilSingle;
}
function getBidiHandle(context, result) {
  if (result.type === "node" || result.type === "window") {
    return new ElementHandle2(context, result);
  }
  return new JSHandle2(context, result);
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/Page.js
var __classPrivateFieldSet3 = function(receiver, state, value, kind, f) {
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
var _Page_instances;
var _Page_context;
var _Page_subscribedEvents;
var _Page_onLogEntryAdded;
var _Page_onLoad;
var _Page_onDOMLoad;
var Page2 = class extends Page {
  constructor(context) {
    super();
    _Page_instances.add(this);
    _Page_context.set(this, void 0);
    _Page_subscribedEvents.set(this, /* @__PURE__ */ new Map([
      ["log.entryAdded", __classPrivateFieldGet3(this, _Page_instances, "m", _Page_onLogEntryAdded).bind(this)],
      ["browsingContext.load", __classPrivateFieldGet3(this, _Page_instances, "m", _Page_onLoad).bind(this)],
      ["browsingContext.domContentLoaded", __classPrivateFieldGet3(this, _Page_instances, "m", _Page_onDOMLoad).bind(this)]
    ]));
    __classPrivateFieldSet3(this, _Page_context, context, "f");
    __classPrivateFieldGet3(this, _Page_context, "f").connection.send("session.subscribe", {
      events: [
        ...__classPrivateFieldGet3(this, _Page_subscribedEvents, "f").keys()
      ],
      contexts: [__classPrivateFieldGet3(this, _Page_context, "f").id]
    }).catch((error) => {
      if (isErrorLike(error) && !error.message.includes("Target closed")) {
        throw error;
      }
    });
    for (const [event, subscriber] of __classPrivateFieldGet3(this, _Page_subscribedEvents, "f")) {
      __classPrivateFieldGet3(this, _Page_context, "f").on(event, subscriber);
    }
  }
  async close() {
    await __classPrivateFieldGet3(this, _Page_context, "f").connection.send("session.unsubscribe", {
      events: [...__classPrivateFieldGet3(this, _Page_subscribedEvents, "f").keys()],
      contexts: [__classPrivateFieldGet3(this, _Page_context, "f").id]
    });
    await __classPrivateFieldGet3(this, _Page_context, "f").connection.send("browsingContext.close", {
      context: __classPrivateFieldGet3(this, _Page_context, "f").id
    });
    for (const [event, subscriber] of __classPrivateFieldGet3(this, _Page_subscribedEvents, "f")) {
      __classPrivateFieldGet3(this, _Page_context, "f").off(event, subscriber);
    }
  }
  async evaluateHandle(pageFunction, ...args) {
    return __classPrivateFieldGet3(this, _Page_context, "f").evaluateHandle(pageFunction, ...args);
  }
  async evaluate(pageFunction, ...args) {
    return __classPrivateFieldGet3(this, _Page_context, "f").evaluate(pageFunction, ...args);
  }
  async goto(url, options) {
    return __classPrivateFieldGet3(this, _Page_context, "f").goto(url, options);
  }
  url() {
    return __classPrivateFieldGet3(this, _Page_context, "f").url();
  }
  setDefaultNavigationTimeout(timeout) {
    __classPrivateFieldGet3(this, _Page_context, "f")._timeoutSettings.setDefaultNavigationTimeout(timeout);
  }
  setDefaultTimeout(timeout) {
    __classPrivateFieldGet3(this, _Page_context, "f")._timeoutSettings.setDefaultTimeout(timeout);
  }
  async setContent(html, options = {}) {
    await __classPrivateFieldGet3(this, _Page_context, "f").setContent(html, options);
  }
  async content() {
    return await this.evaluate(() => {
      let retVal = "";
      if (document.doctype) {
        retVal = new XMLSerializer().serializeToString(document.doctype);
      }
      if (document.documentElement) {
        retVal += document.documentElement.outerHTML;
      }
      return retVal;
    });
  }
  async pdf(options = {}) {
    const { path = void 0 } = options;
    const { printBackground: background, margin, landscape, width, height, pageRanges, scale, preferCSSPageSize, timeout } = this._getPDFOptions(options, "cm");
    const { result } = await waitWithTimeout(__classPrivateFieldGet3(this, _Page_context, "f").connection.send("browsingContext.print", {
      context: __classPrivateFieldGet3(this, _Page_context, "f")._contextId,
      background,
      margin,
      orientation: landscape ? "landscape" : "portrait",
      page: {
        width,
        height
      },
      pageRanges: pageRanges.split(", "),
      scale,
      shrinkToFit: !preferCSSPageSize
    }), "browsingContext.print", timeout);
    const buffer = Buffer.from(result.data, "base64");
    await this._maybeWriteBufferToFile(path, buffer);
    return buffer;
  }
  async createPDFStream(options) {
    const buffer = await this.pdf(options);
    try {
      const { Readable } = await import("stream");
      return Readable.from(buffer);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Can only pass a file path in a Node-like environment.");
      }
      throw error;
    }
  }
  async screenshot(options = {}) {
    const { path = void 0, encoding, ...args } = options;
    if (Object.keys(args).length >= 1) {
      throw new Error('BiDi only supports "encoding" and "path" options');
    }
    const { result } = await __classPrivateFieldGet3(this, _Page_context, "f").connection.send("browsingContext.captureScreenshot", {
      context: __classPrivateFieldGet3(this, _Page_context, "f")._contextId
    });
    if (encoding === "base64") {
      return result.data;
    }
    const buffer = Buffer.from(result.data, "base64");
    await this._maybeWriteBufferToFile(path, buffer);
    return buffer;
  }
};
_Page_context = /* @__PURE__ */ new WeakMap(), _Page_subscribedEvents = /* @__PURE__ */ new WeakMap(), _Page_instances = /* @__PURE__ */ new WeakSet(), _Page_onLogEntryAdded = function _Page_onLogEntryAdded2(event) {
  var _a;
  if (isConsoleLogEntry(event)) {
    const args = event.args.map((arg) => {
      return getBidiHandle(__classPrivateFieldGet3(this, _Page_context, "f"), arg);
    });
    const text = args.reduce((value, arg) => {
      const parsedValue = arg.isPrimitiveValue ? BidiSerializer.deserialize(arg.remoteValue()) : arg.toString();
      return `${value} ${parsedValue}`;
    }, "").slice(1);
    this.emit("console", new ConsoleMessage(event.method, text, args, getStackTraceLocations(event.stackTrace)));
  } else if (isJavaScriptLogEntry(event)) {
    let message = (_a = event.text) !== null && _a !== void 0 ? _a : "";
    if (event.stackTrace) {
      for (const callFrame of event.stackTrace.callFrames) {
        const location = callFrame.url + ":" + callFrame.lineNumber + ":" + callFrame.columnNumber;
        const functionName = callFrame.functionName || "<anonymous>";
        message += `
    at ${functionName} (${location})`;
      }
    }
    const error = new Error(message);
    error.stack = "";
    this.emit("pageerror", error);
  } else {
    debugError(`Unhandled LogEntry with type "${event.type}", text "${event.text}" and level "${event.level}"`);
  }
}, _Page_onLoad = function _Page_onLoad2(_event) {
  this.emit(
    "load"
    /* PageEmittedEvents.Load */
  );
}, _Page_onDOMLoad = function _Page_onDOMLoad2(_event) {
  this.emit(
    "domcontentloaded"
    /* PageEmittedEvents.DOMContentLoaded */
  );
};
function isConsoleLogEntry(event) {
  return event.type === "console";
}
function isJavaScriptLogEntry(event) {
  return event.type === "javascript";
}
function getStackTraceLocations(stackTrace) {
  const stackTraceLocations = [];
  if (stackTrace) {
    for (const callFrame of stackTrace.callFrames) {
      stackTraceLocations.push({
        url: callFrame.url,
        lineNumber: callFrame.lineNumber,
        columnNumber: callFrame.columnNumber
      });
    }
  }
  return stackTraceLocations;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/BrowserContext.js
var __classPrivateFieldSet4 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet4 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserContext_connection;
var BrowserContext2 = class extends BrowserContext {
  constructor(connection) {
    super();
    _BrowserContext_connection.set(this, void 0);
    __classPrivateFieldSet4(this, _BrowserContext_connection, connection, "f");
  }
  async newPage() {
    const { result } = await __classPrivateFieldGet4(this, _BrowserContext_connection, "f").send("browsingContext.create", {
      type: "tab"
    });
    const context = __classPrivateFieldGet4(this, _BrowserContext_connection, "f").context(result.context);
    return new Page2(context);
  }
  async close() {
  }
};
_BrowserContext_connection = /* @__PURE__ */ new WeakMap();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/Browser.js
var __classPrivateFieldSet5 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet5 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Browser_process;
var _Browser_closeCallback;
var _Browser_connection;
var Browser2 = class extends Browser {
  static async create(opts) {
    try {
      await opts.connection.send("session.new", {});
    } catch {
    }
    await opts.connection.send("session.subscribe", {
      events: [
        "browsingContext.contextCreated"
      ]
    });
    return new Browser2(opts);
  }
  constructor(opts) {
    super();
    _Browser_process.set(this, void 0);
    _Browser_closeCallback.set(this, void 0);
    _Browser_connection.set(this, void 0);
    __classPrivateFieldSet5(this, _Browser_process, opts.process, "f");
    __classPrivateFieldSet5(this, _Browser_closeCallback, opts.closeCallback, "f");
    __classPrivateFieldSet5(this, _Browser_connection, opts.connection, "f");
  }
  async close() {
    var _a;
    __classPrivateFieldGet5(this, _Browser_connection, "f").dispose();
    await ((_a = __classPrivateFieldGet5(this, _Browser_closeCallback, "f")) === null || _a === void 0 ? void 0 : _a.call(null));
  }
  isConnected() {
    return !__classPrivateFieldGet5(this, _Browser_connection, "f").closed;
  }
  process() {
    var _a;
    return (_a = __classPrivateFieldGet5(this, _Browser_process, "f")) !== null && _a !== void 0 ? _a : null;
  }
  async createIncognitoBrowserContext(_options) {
    return new BrowserContext2(__classPrivateFieldGet5(this, _Browser_connection, "f"));
  }
};
_Browser_process = /* @__PURE__ */ new WeakMap(), _Browser_closeCallback = /* @__PURE__ */ new WeakMap(), _Browser_connection = /* @__PURE__ */ new WeakMap();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/Connection.js
var __classPrivateFieldSet6 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet6 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Connection_instances;
var _Connection_transport;
var _Connection_delay;
var _Connection_timeout;
var _Connection_closed;
var _Connection_callbacks;
var _Connection_contexts;
var _Connection_maybeEmitOnContext;
var _Connection_handleSpecialEvents;
var _Connection_onClose;
var debugProtocolSend = debug("puppeteer:webDriverBiDi:SEND \u25BA");
var debugProtocolReceive = debug("puppeteer:webDriverBiDi:RECV \u25C0");
var Connection = class extends EventEmitter {
  constructor(transport, delay = 0, timeout) {
    super();
    _Connection_instances.add(this);
    _Connection_transport.set(this, void 0);
    _Connection_delay.set(this, void 0);
    _Connection_timeout.set(this, 0);
    _Connection_closed.set(this, false);
    _Connection_callbacks.set(this, new CallbackRegistry());
    _Connection_contexts.set(this, /* @__PURE__ */ new Map());
    __classPrivateFieldSet6(this, _Connection_delay, delay, "f");
    __classPrivateFieldSet6(this, _Connection_timeout, timeout !== null && timeout !== void 0 ? timeout : 18e4, "f");
    __classPrivateFieldSet6(this, _Connection_transport, transport, "f");
    __classPrivateFieldGet6(this, _Connection_transport, "f").onmessage = this.onMessage.bind(this);
    __classPrivateFieldGet6(this, _Connection_transport, "f").onclose = __classPrivateFieldGet6(this, _Connection_instances, "m", _Connection_onClose).bind(this);
  }
  get closed() {
    return __classPrivateFieldGet6(this, _Connection_closed, "f");
  }
  context(contextId) {
    return __classPrivateFieldGet6(this, _Connection_contexts, "f").get(contextId) || null;
  }
  send(method, params) {
    return __classPrivateFieldGet6(this, _Connection_callbacks, "f").create(method, __classPrivateFieldGet6(this, _Connection_timeout, "f"), (id) => {
      const stringifiedMessage = JSON.stringify({
        id,
        method,
        params
      });
      debugProtocolSend(stringifiedMessage);
      __classPrivateFieldGet6(this, _Connection_transport, "f").send(stringifiedMessage);
    });
  }
  /**
   * @internal
   */
  async onMessage(message) {
    if (__classPrivateFieldGet6(this, _Connection_delay, "f")) {
      await new Promise((f) => {
        return setTimeout(f, __classPrivateFieldGet6(this, _Connection_delay, "f"));
      });
    }
    debugProtocolReceive(message);
    const object = JSON.parse(message);
    if ("id" in object) {
      if ("error" in object) {
        __classPrivateFieldGet6(this, _Connection_callbacks, "f").reject(object.id, createProtocolError(object), object.message);
      } else {
        __classPrivateFieldGet6(this, _Connection_callbacks, "f").resolve(object.id, object);
      }
    } else {
      __classPrivateFieldGet6(this, _Connection_instances, "m", _Connection_handleSpecialEvents).call(this, object);
      __classPrivateFieldGet6(this, _Connection_instances, "m", _Connection_maybeEmitOnContext).call(this, object);
      this.emit(object.method, object.params);
    }
  }
  dispose() {
    __classPrivateFieldGet6(this, _Connection_instances, "m", _Connection_onClose).call(this);
    __classPrivateFieldGet6(this, _Connection_transport, "f").close();
  }
};
_Connection_transport = /* @__PURE__ */ new WeakMap(), _Connection_delay = /* @__PURE__ */ new WeakMap(), _Connection_timeout = /* @__PURE__ */ new WeakMap(), _Connection_closed = /* @__PURE__ */ new WeakMap(), _Connection_callbacks = /* @__PURE__ */ new WeakMap(), _Connection_contexts = /* @__PURE__ */ new WeakMap(), _Connection_instances = /* @__PURE__ */ new WeakSet(), _Connection_maybeEmitOnContext = function _Connection_maybeEmitOnContext2(event) {
  let context;
  if ("context" in event.params && event.params.context) {
    context = __classPrivateFieldGet6(this, _Connection_contexts, "f").get(event.params.context);
  } else if ("source" in event.params && event.params.source.context) {
    context = __classPrivateFieldGet6(this, _Connection_contexts, "f").get(event.params.source.context);
  }
  context === null || context === void 0 ? void 0 : context.emit(event.method, event.params);
}, _Connection_handleSpecialEvents = function _Connection_handleSpecialEvents2(event) {
  switch (event.method) {
    case "browsingContext.contextCreated":
      __classPrivateFieldGet6(this, _Connection_contexts, "f").set(event.params.context, new Context(this, event.params));
  }
}, _Connection_onClose = function _Connection_onClose2() {
  if (__classPrivateFieldGet6(this, _Connection_closed, "f")) {
    return;
  }
  __classPrivateFieldSet6(this, _Connection_closed, true, "f");
  __classPrivateFieldGet6(this, _Connection_transport, "f").onmessage = void 0;
  __classPrivateFieldGet6(this, _Connection_transport, "f").onclose = void 0;
  __classPrivateFieldGet6(this, _Connection_callbacks, "f").clear();
};
function createProtocolError(object) {
  let message = `${object.error} ${object.message}`;
  if (object.stacktrace) {
    message += ` ${object.stacktrace}`;
  }
  return message;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/bidi/BidiOverCDP.js
var BidiMapper = __toESM(require_bidiMapper(), 1);
var __classPrivateFieldSet7 = function(receiver, state, value, kind, f) {
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
var _CDPConnectionAdapter_cdp;
var _CDPConnectionAdapter_adapters;
var _CDPConnectionAdapter_browser;
var _CDPClientAdapter_closed;
var _CDPClientAdapter_client;
var _CDPClientAdapter_forwardMessage;
var _NoOpTransport_onMessage;
async function connectBidiOverCDP(cdp) {
  const transportBiDi = new NoOpTransport();
  const cdpConnectionAdapter = new CDPConnectionAdapter(cdp);
  const pptrTransport = {
    send(message) {
      transportBiDi.emitMessage(JSON.parse(message));
    },
    close() {
      bidiServer.close();
      cdpConnectionAdapter.close();
    },
    onmessage(_message) {
    }
  };
  transportBiDi.on("bidiResponse", (message) => {
    pptrTransport.onmessage(JSON.stringify(message));
  });
  const pptrBiDiConnection = new Connection(pptrTransport);
  const bidiServer = await BidiMapper.BidiServer.createAndStart(transportBiDi, cdpConnectionAdapter, "");
  return pptrBiDiConnection;
}
var CDPConnectionAdapter = class {
  constructor(cdp) {
    _CDPConnectionAdapter_cdp.set(this, void 0);
    _CDPConnectionAdapter_adapters.set(this, /* @__PURE__ */ new Map());
    _CDPConnectionAdapter_browser.set(this, void 0);
    __classPrivateFieldSet7(this, _CDPConnectionAdapter_cdp, cdp, "f");
    __classPrivateFieldSet7(this, _CDPConnectionAdapter_browser, new CDPClientAdapter(cdp), "f");
  }
  browserClient() {
    return __classPrivateFieldGet7(this, _CDPConnectionAdapter_browser, "f");
  }
  getCdpClient(id) {
    const session = __classPrivateFieldGet7(this, _CDPConnectionAdapter_cdp, "f").session(id);
    if (!session) {
      throw new Error("Unknown CDP session with id" + id);
    }
    if (!__classPrivateFieldGet7(this, _CDPConnectionAdapter_adapters, "f").has(session)) {
      const adapter = new CDPClientAdapter(session);
      __classPrivateFieldGet7(this, _CDPConnectionAdapter_adapters, "f").set(session, adapter);
      return adapter;
    }
    return __classPrivateFieldGet7(this, _CDPConnectionAdapter_adapters, "f").get(session);
  }
  close() {
    __classPrivateFieldGet7(this, _CDPConnectionAdapter_browser, "f").close();
    for (const adapter of __classPrivateFieldGet7(this, _CDPConnectionAdapter_adapters, "f").values()) {
      adapter.close();
    }
  }
};
_CDPConnectionAdapter_cdp = /* @__PURE__ */ new WeakMap(), _CDPConnectionAdapter_adapters = /* @__PURE__ */ new WeakMap(), _CDPConnectionAdapter_browser = /* @__PURE__ */ new WeakMap();
var CDPClientAdapter = class extends BidiMapper.EventEmitter {
  constructor(client) {
    super();
    _CDPClientAdapter_closed.set(this, false);
    _CDPClientAdapter_client.set(this, void 0);
    _CDPClientAdapter_forwardMessage.set(this, (method, event) => {
      this.emit(method, event);
    });
    __classPrivateFieldSet7(this, _CDPClientAdapter_client, client, "f");
    __classPrivateFieldGet7(this, _CDPClientAdapter_client, "f").on("*", __classPrivateFieldGet7(this, _CDPClientAdapter_forwardMessage, "f"));
  }
  async sendCommand(method, ...params) {
    if (__classPrivateFieldGet7(this, _CDPClientAdapter_closed, "f")) {
      return;
    }
    try {
      return await __classPrivateFieldGet7(this, _CDPClientAdapter_client, "f").send(method, ...params);
    } catch (err) {
      if (__classPrivateFieldGet7(this, _CDPClientAdapter_closed, "f")) {
        return;
      }
      throw err;
    }
  }
  close() {
    __classPrivateFieldGet7(this, _CDPClientAdapter_client, "f").off("*", __classPrivateFieldGet7(this, _CDPClientAdapter_forwardMessage, "f"));
    __classPrivateFieldSet7(this, _CDPClientAdapter_closed, true, "f");
  }
};
_CDPClientAdapter_closed = /* @__PURE__ */ new WeakMap(), _CDPClientAdapter_client = /* @__PURE__ */ new WeakMap(), _CDPClientAdapter_forwardMessage = /* @__PURE__ */ new WeakMap();
var NoOpTransport = class extends BidiMapper.EventEmitter {
  constructor() {
    super(...arguments);
    _NoOpTransport_onMessage.set(this, async (_m) => {
      return;
    });
  }
  emitMessage(message) {
    __classPrivateFieldGet7(this, _NoOpTransport_onMessage, "f").call(this, message);
  }
  setOnMessage(onMessage) {
    __classPrivateFieldSet7(this, _NoOpTransport_onMessage, onMessage, "f");
  }
  async sendMessage(message) {
    this.emit("bidiResponse", message);
  }
  close() {
    __classPrivateFieldSet7(this, _NoOpTransport_onMessage, async (_m) => {
      return;
    }, "f");
  }
};
_NoOpTransport_onMessage = /* @__PURE__ */ new WeakMap();
export {
  Browser2 as Browser,
  BrowserContext2 as BrowserContext,
  Connection,
  Page2 as Page,
  connectBidiOverCDP
};
