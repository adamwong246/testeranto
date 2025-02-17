import {
  ARIAQueryHandler,
  Accessibility,
  AsyncIterableUtil,
  Browser,
  BrowserContext,
  CDPSession,
  CallbackRegistry,
  ConsoleMessage,
  Coverage,
  Deferred,
  Dialog,
  DisposableStack,
  ElementHandle,
  EmulationManager,
  EventEmitter,
  Frame,
  HTTPRequest,
  HTTPResponse,
  JSHandle,
  Keyboard,
  LazyArg,
  Mouse,
  MouseButton,
  Page,
  ProtocolError,
  PuppeteerURL,
  Realm,
  SOURCE_URL_REGEX,
  STATUS_TEXTS,
  SecurityDetails,
  Target,
  TargetCloseError,
  TargetType,
  TimeoutError,
  TouchError,
  Touchscreen,
  Tracing,
  UnsupportedOperation,
  WEB_PERMISSION_TO_PROTOCOL_PERMISSION,
  WebWorker,
  assert,
  bindIsolatedHandle,
  bubble,
  combineLatest,
  debug,
  debugError,
  defer,
  delayWhen,
  disposeSymbol,
  environment,
  evaluationString,
  filter,
  first,
  firstValueFrom,
  from,
  fromAbortSignal,
  fromEmitterEvent,
  getSourcePuppeteerURLIfAvailable,
  getSourceUrlComment,
  handleError,
  inertIfDisposed,
  interpolateFunction,
  invokeAtMostOnceForArguments,
  isDate,
  isErrorLike,
  isPlainObject,
  isRegExp,
  isString,
  map,
  of,
  parsePDFOptions,
  raceWith,
  scriptInjector,
  stringToBase64,
  stringToTypedArray,
  stringifyFunction,
  switchMap,
  throwIfDetached,
  throwIfDisposed,
  timeout
} from "./chunk-KKQOQNY2.mjs";
import "./chunk-EXETZ625.mjs";
import {
  __commonJS,
  __esm,
  __export,
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __privateWrapper,
  __publicField,
  __require,
  __toCommonJS,
  __toESM
} from "./chunk-3KGMXYRN.mjs";

// node_modules/mitt/dist/mitt.mjs
var mitt_exports = {};
__export(mitt_exports, {
  default: () => mitt_default
});
function mitt_default(n) {
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
var init_mitt = __esm({
  "node_modules/mitt/dist/mitt.mjs"() {
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
    var mitt_1 = __importDefault((init_mitt(), __toCommonJS(mitt_exports)));
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
      /**
       * Removes all listeners. If given an event argument, it will remove only
       * listeners for that event.
       * @param event - the event to remove listeners for.
       * @returns `this` to enable you to chain method calls.
       */
      removeAllListeners(event) {
        if (event) {
          this.#emitter.all.delete(event);
        } else {
          this.#emitter.all.clear();
        }
        return this;
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
      LogType2["bidi"] = "bidi";
      LogType2["cdp"] = "cdp";
      LogType2["debug"] = "debug";
      LogType2["debugError"] = "debug:error";
      LogType2["debugInfo"] = "debug:info";
    })(LogType || (exports.LogType = LogType = {}));
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/ProcessingQueue.js
var require_ProcessingQueue = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/ProcessingQueue.js"(exports) {
    "use strict";
    var _a3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProcessingQueue = void 0;
    var log_js_1 = require_log();
    var _logger, _processor, _queue, _isProcessing, _processIfNeeded, processIfNeeded_fn;
    var ProcessingQueue = class {
      constructor(processor, logger) {
        __privateAdd(this, _processIfNeeded);
        __privateAdd(this, _logger, void 0);
        __privateAdd(this, _processor, void 0);
        __privateAdd(this, _queue, []);
        // Flag to keep only 1 active processor.
        __privateAdd(this, _isProcessing, false);
        __privateSet(this, _processor, processor);
        __privateSet(this, _logger, logger);
      }
      add(entry, name) {
        __privateGet(this, _queue).push([entry, name]);
        void __privateMethod(this, _processIfNeeded, processIfNeeded_fn).call(this);
      }
    };
    _logger = new WeakMap();
    _processor = new WeakMap();
    _queue = new WeakMap();
    _isProcessing = new WeakMap();
    _processIfNeeded = new WeakSet();
    processIfNeeded_fn = async function() {
      var _a4;
      if (__privateGet(this, _isProcessing)) {
        return;
      }
      __privateSet(this, _isProcessing, true);
      while (__privateGet(this, _queue).length > 0) {
        const arrayEntry = __privateGet(this, _queue).shift();
        if (!arrayEntry) {
          continue;
        }
        const [entryPromise, name] = arrayEntry;
        (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, _a3.LOGGER_PREFIX, "Processing event:", name);
        await entryPromise.then((entry) => {
          var _a5;
          if (entry.kind === "error") {
            (_a5 = __privateGet(this, _logger)) == null ? void 0 : _a5.call(this, log_js_1.LogType.debugError, "Event threw before sending:", entry.error.message, entry.error.stack);
            return;
          }
          return __privateGet(this, _processor).call(this, entry.value);
        }).catch((error) => {
          var _a5;
          (_a5 = __privateGet(this, _logger)) == null ? void 0 : _a5.call(this, log_js_1.LogType.debugError, "Event was not processed:", error?.message);
        });
      }
      __privateSet(this, _isProcessing, false);
    };
    __publicField(ProcessingQueue, "LOGGER_PREFIX", `${log_js_1.LogType.debug}:queue`);
    exports.ProcessingQueue = ProcessingQueue;
    _a3 = ProcessingQueue;
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/cdp.js
var require_cdp = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/cdp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/chromium-bidi.js
var require_chromium_bidi = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/chromium-bidi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EVENT_NAMES = exports.Bluetooth = exports.Network = exports.BrowsingContext = exports.Log = exports.Script = exports.BiDiModule = void 0;
    var BiDiModule;
    (function(BiDiModule2) {
      BiDiModule2["Bluetooth"] = "bluetooth";
      BiDiModule2["Browser"] = "browser";
      BiDiModule2["BrowsingContext"] = "browsingContext";
      BiDiModule2["Cdp"] = "cdp";
      BiDiModule2["Input"] = "input";
      BiDiModule2["Log"] = "log";
      BiDiModule2["Network"] = "network";
      BiDiModule2["Script"] = "script";
      BiDiModule2["Session"] = "session";
    })(BiDiModule || (exports.BiDiModule = BiDiModule = {}));
    var Script;
    (function(Script2) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["Message"] = "script.message";
        EventNames2["RealmCreated"] = "script.realmCreated";
        EventNames2["RealmDestroyed"] = "script.realmDestroyed";
      })(EventNames = Script2.EventNames || (Script2.EventNames = {}));
    })(Script || (exports.Script = Script = {}));
    var Log;
    (function(Log2) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["LogEntryAdded"] = "log.entryAdded";
      })(EventNames = Log2.EventNames || (Log2.EventNames = {}));
    })(Log || (exports.Log = Log = {}));
    var BrowsingContext2;
    (function(BrowsingContext3) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["ContextCreated"] = "browsingContext.contextCreated";
        EventNames2["ContextDestroyed"] = "browsingContext.contextDestroyed";
        EventNames2["DomContentLoaded"] = "browsingContext.domContentLoaded";
        EventNames2["DownloadWillBegin"] = "browsingContext.downloadWillBegin";
        EventNames2["FragmentNavigated"] = "browsingContext.fragmentNavigated";
        EventNames2["Load"] = "browsingContext.load";
        EventNames2["NavigationAborted"] = "browsingContext.navigationAborted";
        EventNames2["NavigationFailed"] = "browsingContext.navigationFailed";
        EventNames2["NavigationStarted"] = "browsingContext.navigationStarted";
        EventNames2["UserPromptClosed"] = "browsingContext.userPromptClosed";
        EventNames2["UserPromptOpened"] = "browsingContext.userPromptOpened";
      })(EventNames = BrowsingContext3.EventNames || (BrowsingContext3.EventNames = {}));
    })(BrowsingContext2 || (exports.BrowsingContext = BrowsingContext2 = {}));
    var Network;
    (function(Network2) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["AuthRequired"] = "network.authRequired";
        EventNames2["BeforeRequestSent"] = "network.beforeRequestSent";
        EventNames2["FetchError"] = "network.fetchError";
        EventNames2["ResponseCompleted"] = "network.responseCompleted";
        EventNames2["ResponseStarted"] = "network.responseStarted";
      })(EventNames = Network2.EventNames || (Network2.EventNames = {}));
    })(Network || (exports.Network = Network = {}));
    var Bluetooth;
    (function(Bluetooth2) {
      let EventNames;
      (function(EventNames2) {
        EventNames2["RequestDevicePromptUpdated"] = "bluetooth.requestDevicePromptUpdated";
      })(EventNames = Bluetooth2.EventNames || (Bluetooth2.EventNames = {}));
    })(Bluetooth || (exports.Bluetooth = Bluetooth = {}));
    exports.EVENT_NAMES = /* @__PURE__ */ new Set([
      // keep-sorted start
      ...Object.values(BiDiModule),
      ...Object.values(BrowsingContext2.EventNames),
      ...Object.values(Log.EventNames),
      ...Object.values(Network.EventNames),
      ...Object.values(Script.EventNames)
      // keep-sorted end
    ]);
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/generated/webdriver-bidi.js
var require_webdriver_bidi = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/generated/webdriver-bidi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/ErrorResponse.js
var require_ErrorResponse = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/ErrorResponse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnderspecifiedStoragePartitionException = exports.UnableToSetFileInputException = exports.UnableToSetCookieException = exports.NoSuchStoragePartitionException = exports.UnsupportedOperationException = exports.UnableToCloseBrowserException = exports.UnableToCaptureScreenException = exports.UnknownErrorException = exports.UnknownCommandException = exports.SessionNotCreatedException = exports.NoSuchUserContextException = exports.NoSuchScriptException = exports.NoSuchRequestException = exports.NoSuchNodeException = exports.NoSuchInterceptException = exports.NoSuchHistoryEntryException = exports.NoSuchHandleException = exports.NoSuchFrameException = exports.NoSuchElementException = exports.NoSuchAlertException = exports.MoveTargetOutOfBoundsException = exports.InvalidSessionIdException = exports.InvalidSelectorException = exports.InvalidArgumentException = exports.Exception = void 0;
    var Exception = class extends Error {
      error;
      message;
      stacktrace;
      constructor(error, message, stacktrace) {
        super();
        this.error = error;
        this.message = message;
        this.stacktrace = stacktrace;
      }
      toErrorResponse(commandId) {
        return {
          type: "error",
          id: commandId,
          error: this.error,
          message: this.message,
          stacktrace: this.stacktrace
        };
      }
    };
    exports.Exception = Exception;
    var InvalidArgumentException = class extends Exception {
      constructor(message, stacktrace) {
        super("invalid argument", message, stacktrace);
      }
    };
    exports.InvalidArgumentException = InvalidArgumentException;
    var InvalidSelectorException = class extends Exception {
      constructor(message, stacktrace) {
        super("invalid selector", message, stacktrace);
      }
    };
    exports.InvalidSelectorException = InvalidSelectorException;
    var InvalidSessionIdException = class extends Exception {
      constructor(message, stacktrace) {
        super("invalid session id", message, stacktrace);
      }
    };
    exports.InvalidSessionIdException = InvalidSessionIdException;
    var MoveTargetOutOfBoundsException = class extends Exception {
      constructor(message, stacktrace) {
        super("move target out of bounds", message, stacktrace);
      }
    };
    exports.MoveTargetOutOfBoundsException = MoveTargetOutOfBoundsException;
    var NoSuchAlertException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such alert", message, stacktrace);
      }
    };
    exports.NoSuchAlertException = NoSuchAlertException;
    var NoSuchElementException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such element", message, stacktrace);
      }
    };
    exports.NoSuchElementException = NoSuchElementException;
    var NoSuchFrameException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such frame", message, stacktrace);
      }
    };
    exports.NoSuchFrameException = NoSuchFrameException;
    var NoSuchHandleException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such handle", message, stacktrace);
      }
    };
    exports.NoSuchHandleException = NoSuchHandleException;
    var NoSuchHistoryEntryException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such history entry", message, stacktrace);
      }
    };
    exports.NoSuchHistoryEntryException = NoSuchHistoryEntryException;
    var NoSuchInterceptException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such intercept", message, stacktrace);
      }
    };
    exports.NoSuchInterceptException = NoSuchInterceptException;
    var NoSuchNodeException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such node", message, stacktrace);
      }
    };
    exports.NoSuchNodeException = NoSuchNodeException;
    var NoSuchRequestException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such request", message, stacktrace);
      }
    };
    exports.NoSuchRequestException = NoSuchRequestException;
    var NoSuchScriptException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such script", message, stacktrace);
      }
    };
    exports.NoSuchScriptException = NoSuchScriptException;
    var NoSuchUserContextException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such user context", message, stacktrace);
      }
    };
    exports.NoSuchUserContextException = NoSuchUserContextException;
    var SessionNotCreatedException = class extends Exception {
      constructor(message, stacktrace) {
        super("session not created", message, stacktrace);
      }
    };
    exports.SessionNotCreatedException = SessionNotCreatedException;
    var UnknownCommandException = class extends Exception {
      constructor(message, stacktrace) {
        super("unknown command", message, stacktrace);
      }
    };
    exports.UnknownCommandException = UnknownCommandException;
    var UnknownErrorException = class extends Exception {
      constructor(message, stacktrace = new Error().stack) {
        super("unknown error", message, stacktrace);
      }
    };
    exports.UnknownErrorException = UnknownErrorException;
    var UnableToCaptureScreenException = class extends Exception {
      constructor(message, stacktrace) {
        super("unable to capture screen", message, stacktrace);
      }
    };
    exports.UnableToCaptureScreenException = UnableToCaptureScreenException;
    var UnableToCloseBrowserException = class extends Exception {
      constructor(message, stacktrace) {
        super("unable to close browser", message, stacktrace);
      }
    };
    exports.UnableToCloseBrowserException = UnableToCloseBrowserException;
    var UnsupportedOperationException = class extends Exception {
      constructor(message, stacktrace) {
        super("unsupported operation", message, stacktrace);
      }
    };
    exports.UnsupportedOperationException = UnsupportedOperationException;
    var NoSuchStoragePartitionException = class extends Exception {
      constructor(message, stacktrace) {
        super("no such storage partition", message, stacktrace);
      }
    };
    exports.NoSuchStoragePartitionException = NoSuchStoragePartitionException;
    var UnableToSetCookieException = class extends Exception {
      constructor(message, stacktrace) {
        super("unable to set cookie", message, stacktrace);
      }
    };
    exports.UnableToSetCookieException = UnableToSetCookieException;
    var UnableToSetFileInputException = class extends Exception {
      constructor(message, stacktrace) {
        super("unable to set file input", message, stacktrace);
      }
    };
    exports.UnableToSetFileInputException = UnableToSetFileInputException;
    var UnderspecifiedStoragePartitionException = class extends Exception {
      constructor(message, stacktrace) {
        super("underspecified storage partition", message, stacktrace);
      }
    };
    exports.UnderspecifiedStoragePartitionException = UnderspecifiedStoragePartitionException;
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/generated/webdriver-bidi-permissions.js
var require_webdriver_bidi_permissions = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/generated/webdriver-bidi-permissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/generated/webdriver-bidi-bluetooth.js
var require_webdriver_bidi_bluetooth = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/generated/webdriver-bidi-bluetooth.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/chromium-bidi/lib/cjs/protocol/protocol.js
var require_protocol = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/protocol/protocol.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChromiumBidi = exports.Cdp = void 0;
    exports.Cdp = __importStar(require_cdp());
    exports.ChromiumBidi = __importStar(require_chromium_bidi());
    __exportStar(require_webdriver_bidi(), exports);
    __exportStar(require_ErrorResponse(), exports);
    __exportStar(require_webdriver_bidi_permissions(), exports);
    __exportStar(require_webdriver_bidi_bluetooth(), exports);
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiNoOpParser.js
var require_BidiNoOpParser = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiNoOpParser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BidiNoOpParser = void 0;
    var BidiNoOpParser = class {
      // Bluetooth domain
      // keep-sorted start block=yes
      parseHandleRequestDevicePromptParams(params) {
        return params;
      }
      // keep-sorted end
      // Browser domain
      // keep-sorted start block=yes
      parseRemoveUserContextParams(params) {
        return params;
      }
      // keep-sorted end
      // Browsing Context domain
      // keep-sorted start block=yes
      parseActivateParams(params) {
        return params;
      }
      parseCaptureScreenshotParams(params) {
        return params;
      }
      parseCloseParams(params) {
        return params;
      }
      parseCreateParams(params) {
        return params;
      }
      parseGetTreeParams(params) {
        return params;
      }
      parseHandleUserPromptParams(params) {
        return params;
      }
      parseLocateNodesParams(params) {
        return params;
      }
      parseNavigateParams(params) {
        return params;
      }
      parsePrintParams(params) {
        return params;
      }
      parseReloadParams(params) {
        return params;
      }
      parseSetViewportParams(params) {
        return params;
      }
      parseTraverseHistoryParams(params) {
        return params;
      }
      // keep-sorted end
      // CDP domain
      // keep-sorted start block=yes
      parseGetSessionParams(params) {
        return params;
      }
      parseResolveRealmParams(params) {
        return params;
      }
      parseSendCommandParams(params) {
        return params;
      }
      // keep-sorted end
      // Script domain
      // keep-sorted start block=yes
      parseAddPreloadScriptParams(params) {
        return params;
      }
      parseCallFunctionParams(params) {
        return params;
      }
      parseDisownParams(params) {
        return params;
      }
      parseEvaluateParams(params) {
        return params;
      }
      parseGetRealmsParams(params) {
        return params;
      }
      parseRemovePreloadScriptParams(params) {
        return params;
      }
      // keep-sorted end
      // Input domain
      // keep-sorted start block=yes
      parsePerformActionsParams(params) {
        return params;
      }
      parseReleaseActionsParams(params) {
        return params;
      }
      parseSetFilesParams(params) {
        return params;
      }
      // keep-sorted end
      // Network domain
      // keep-sorted start block=yes
      parseAddInterceptParams(params) {
        return params;
      }
      parseContinueRequestParams(params) {
        return params;
      }
      parseContinueResponseParams(params) {
        return params;
      }
      parseContinueWithAuthParams(params) {
        return params;
      }
      parseFailRequestParams(params) {
        return params;
      }
      parseProvideResponseParams(params) {
        return params;
      }
      parseRemoveInterceptParams(params) {
        return params;
      }
      parseSetCacheBehavior(params) {
        return params;
      }
      // keep-sorted end
      // Permissions domain
      // keep-sorted start block=yes
      parseSetPermissionsParams(params) {
        return params;
      }
      // keep-sorted end
      // Session domain
      // keep-sorted start block=yes
      parseSubscribeParams(params) {
        return params;
      }
      // keep-sorted end
      // Storage domain
      // keep-sorted start block=yes
      parseDeleteCookiesParams(params) {
        return params;
      }
      parseGetCookiesParams(params) {
        return params;
      }
      parseSetCookieParams(params) {
        return params;
      }
    };
    exports.BidiNoOpParser = BidiNoOpParser;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/browser/BrowserProcessor.js
var require_BrowserProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/browser/BrowserProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var BrowserProcessor = class {
      #browserCdpClient;
      constructor(browserCdpClient) {
        this.#browserCdpClient = browserCdpClient;
      }
      close() {
        setTimeout(() => this.#browserCdpClient.sendCommand("Browser.close"), 0);
        return {};
      }
      async createUserContext(params) {
        const request = {
          proxyServer: params["goog:proxyServer"] ?? void 0
        };
        const proxyBypassList = params["goog:proxyBypassList"] ?? void 0;
        if (proxyBypassList) {
          request.proxyBypassList = proxyBypassList.join(",");
        }
        const context = await this.#browserCdpClient.sendCommand("Target.createBrowserContext", request);
        return {
          userContext: context.browserContextId
        };
      }
      async removeUserContext(params) {
        const userContext = params.userContext;
        if (userContext === "default") {
          throw new protocol_js_1.InvalidArgumentException("`default` user context cannot be removed");
        }
        try {
          await this.#browserCdpClient.sendCommand("Target.disposeBrowserContext", {
            browserContextId: userContext
          });
        } catch (err) {
          if (err.message.startsWith("Failed to find context with id")) {
            throw new protocol_js_1.NoSuchUserContextException(err.message);
          }
          throw err;
        }
        return {};
      }
      async getUserContexts() {
        const result = await this.#browserCdpClient.sendCommand("Target.getBrowserContexts");
        return {
          userContexts: [
            {
              userContext: "default"
            },
            ...result.browserContextIds.map((id) => {
              return {
                userContext: id
              };
            })
          ]
        };
      }
    };
    exports.BrowserProcessor = BrowserProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/cdp/CdpProcessor.js
var require_CdpProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/cdp/CdpProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CdpProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var CdpProcessor = class {
      #browsingContextStorage;
      #realmStorage;
      #cdpConnection;
      #browserCdpClient;
      constructor(browsingContextStorage, realmStorage, cdpConnection, browserCdpClient) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#realmStorage = realmStorage;
        this.#cdpConnection = cdpConnection;
        this.#browserCdpClient = browserCdpClient;
      }
      getSession(params) {
        const context = params.context;
        const sessionId = this.#browsingContextStorage.getContext(context).cdpTarget.cdpSessionId;
        if (sessionId === void 0) {
          return {};
        }
        return { session: sessionId };
      }
      resolveRealm(params) {
        const context = params.realm;
        const realm = this.#realmStorage.getRealm({ realmId: context });
        if (realm === void 0) {
          throw new protocol_js_1.UnknownErrorException(`Could not find realm ${params.realm}`);
        }
        return { executionContextId: realm.executionContextId };
      }
      async sendCommand(params) {
        const client = params.session ? this.#cdpConnection.getCdpClient(params.session) : this.#browserCdpClient;
        const result = await client.sendCommand(params.method, params.params);
        return {
          result,
          session: params.session
        };
      }
    };
    exports.CdpProcessor = CdpProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/context/BrowsingContextProcessor.js
var require_BrowsingContextProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/context/BrowsingContextProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowsingContextProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var BrowsingContextProcessor = class {
      #browserCdpClient;
      #browsingContextStorage;
      #eventManager;
      constructor(browserCdpClient, browsingContextStorage, eventManager) {
        this.#browserCdpClient = browserCdpClient;
        this.#browsingContextStorage = browsingContextStorage;
        this.#eventManager = eventManager;
        this.#eventManager.addSubscribeHook(protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.ContextCreated, this.#onContextCreatedSubscribeHook.bind(this));
      }
      getTree(params) {
        const resultContexts = params.root === void 0 ? this.#browsingContextStorage.getTopLevelContexts() : [this.#browsingContextStorage.getContext(params.root)];
        return {
          contexts: resultContexts.map((c) => c.serializeToBidiValue(params.maxDepth ?? Number.MAX_VALUE))
        };
      }
      async create(params) {
        let referenceContext;
        let userContext = "default";
        if (params.referenceContext !== void 0) {
          referenceContext = this.#browsingContextStorage.getContext(params.referenceContext);
          if (!referenceContext.isTopLevelContext()) {
            throw new protocol_js_1.InvalidArgumentException(`referenceContext should be a top-level context`);
          }
          userContext = referenceContext.userContext;
        }
        if (params.userContext !== void 0) {
          userContext = params.userContext;
        }
        const existingContexts = this.#browsingContextStorage.getAllContexts().filter((context2) => context2.userContext === userContext);
        let newWindow = false;
        switch (params.type) {
          case "tab":
            newWindow = false;
            break;
          case "window":
            newWindow = true;
            break;
        }
        if (!existingContexts.length) {
          newWindow = true;
        }
        let result;
        try {
          result = await this.#browserCdpClient.sendCommand("Target.createTarget", {
            url: "about:blank",
            newWindow,
            browserContextId: userContext === "default" ? void 0 : userContext,
            background: params.background === true
          });
        } catch (err) {
          if (
            // See https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/protocol/target_handler.cc;l=90;drc=e80392ac11e48a691f4309964cab83a3a59e01c8
            err.message.startsWith("Failed to find browser context with id") || // See https://source.chromium.org/chromium/chromium/src/+/main:headless/lib/browser/protocol/target_handler.cc;l=49;drc=e80392ac11e48a691f4309964cab83a3a59e01c8
            err.message === "browserContextId"
          ) {
            throw new protocol_js_1.NoSuchUserContextException(`The context ${userContext} was not found`);
          }
          throw err;
        }
        const contextId = result.targetId;
        const context = this.#browsingContextStorage.getContext(contextId);
        await context.lifecycleLoaded();
        return { context: context.id };
      }
      navigate(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return context.navigate(
          params.url,
          params.wait ?? "none"
          /* BrowsingContext.ReadinessState.None */
        );
      }
      reload(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return context.reload(
          params.ignoreCache ?? false,
          params.wait ?? "none"
          /* BrowsingContext.ReadinessState.None */
        );
      }
      async activate(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        if (!context.isTopLevelContext()) {
          throw new protocol_js_1.InvalidArgumentException("Activation is only supported on the top-level context");
        }
        await context.activate();
        return {};
      }
      async captureScreenshot(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return await context.captureScreenshot(params);
      }
      async print(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return await context.print(params);
      }
      async setViewport(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        if (!context.isTopLevelContext()) {
          throw new protocol_js_1.InvalidArgumentException("Emulating viewport is only supported on the top-level context");
        }
        await context.setViewport(params.viewport, params.devicePixelRatio);
        return {};
      }
      async traverseHistory(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        if (!context) {
          throw new protocol_js_1.InvalidArgumentException(`No browsing context with id ${params.context}`);
        }
        if (!context.isTopLevelContext()) {
          throw new protocol_js_1.InvalidArgumentException("Traversing history is only supported on the top-level context");
        }
        await context.traverseHistory(params.delta);
        return {};
      }
      async handleUserPrompt(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        try {
          await context.handleUserPrompt(params.accept, params.userText);
        } catch (error) {
          if (error.message?.includes("No dialog is showing")) {
            throw new protocol_js_1.NoSuchAlertException("No dialog is showing");
          }
          throw error;
        }
        return {};
      }
      async close(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        if (!context.isTopLevelContext()) {
          throw new protocol_js_1.InvalidArgumentException(`Non top-level browsing context ${context.id} cannot be closed.`);
        }
        try {
          const detachedFromTargetPromise = new Promise((resolve) => {
            const onContextDestroyed = (event) => {
              if (event.targetId === params.context) {
                this.#browserCdpClient.off("Target.detachedFromTarget", onContextDestroyed);
                resolve();
              }
            };
            this.#browserCdpClient.on("Target.detachedFromTarget", onContextDestroyed);
          });
          if (params.promptUnload) {
            await context.close();
          } else {
            await this.#browserCdpClient.sendCommand("Target.closeTarget", {
              targetId: params.context
            });
          }
          await detachedFromTargetPromise;
        } catch (error) {
          if (!(error.code === -32e3 && error.message === "Not attached to an active page")) {
            throw error;
          }
        }
        return {};
      }
      async locateNodes(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        return await context.locateNodes(params);
      }
      #onContextCreatedSubscribeHook(contextId) {
        const context = this.#browsingContextStorage.getContext(contextId);
        const contextsToReport = [
          context,
          ...this.#browsingContextStorage.getContext(contextId).allChildren
        ];
        contextsToReport.forEach((context2) => {
          this.#eventManager.registerEvent({
            type: "event",
            method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.ContextCreated,
            params: context2.serializeToBidiValue()
          }, context2.id);
        });
        return Promise.resolve();
      }
    };
    exports.BrowsingContextProcessor = BrowsingContextProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/assert.js
var require_assert = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/assert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assert = assert2;
    function assert2(predicate, message) {
      if (!predicate) {
        throw new Error(message ?? "Internal assertion failed.");
      }
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/GraphemeTools.js
var require_GraphemeTools = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/GraphemeTools.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSingleComplexGrapheme = isSingleComplexGrapheme;
    exports.isSingleGrapheme = isSingleGrapheme;
    function isSingleComplexGrapheme(value) {
      return isSingleGrapheme(value) && value.length > 1;
    }
    function isSingleGrapheme(value) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return [...segmenter.segment(value)].length === 1;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputSource.js
var require_InputSource = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputSource.js"(exports) {
    "use strict";
    var _a3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WheelSource = exports.PointerSource = exports.KeySource = exports.NoneSource = void 0;
    var NoneSource = class {
      type = "none";
    };
    exports.NoneSource = NoneSource;
    var KeySource = class {
      type = "key";
      pressed = /* @__PURE__ */ new Set();
      // This is a bitfield that matches the modifiers parameter of
      // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchKeyEvent
      #modifiers = 0;
      get modifiers() {
        return this.#modifiers;
      }
      get alt() {
        return (this.#modifiers & 1) === 1;
      }
      set alt(value) {
        this.#setModifier(value, 1);
      }
      get ctrl() {
        return (this.#modifiers & 2) === 2;
      }
      set ctrl(value) {
        this.#setModifier(value, 2);
      }
      get meta() {
        return (this.#modifiers & 4) === 4;
      }
      set meta(value) {
        this.#setModifier(value, 4);
      }
      get shift() {
        return (this.#modifiers & 8) === 8;
      }
      set shift(value) {
        this.#setModifier(value, 8);
      }
      #setModifier(value, bit) {
        if (value) {
          this.#modifiers |= bit;
        } else {
          this.#modifiers &= ~bit;
        }
      }
    };
    exports.KeySource = KeySource;
    var _clickContexts;
    var PointerSource = class {
      constructor(id, subtype) {
        __publicField(this, "type", "pointer");
        __publicField(this, "subtype");
        __publicField(this, "pointerId");
        __publicField(this, "pressed", /* @__PURE__ */ new Set());
        __publicField(this, "x", 0);
        __publicField(this, "y", 0);
        __publicField(this, "radiusX");
        __publicField(this, "radiusY");
        __publicField(this, "force");
        __privateAdd(this, _clickContexts, /* @__PURE__ */ new Map());
        this.pointerId = id;
        this.subtype = subtype;
      }
      // This is a bitfield that matches the buttons parameter of
      // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent
      get buttons() {
        let buttons = 0;
        for (const button of this.pressed) {
          switch (button) {
            case 0:
              buttons |= 1;
              break;
            case 1:
              buttons |= 4;
              break;
            case 2:
              buttons |= 2;
              break;
            case 3:
              buttons |= 8;
              break;
            case 4:
              buttons |= 16;
              break;
          }
        }
        return buttons;
      }
      setClickCount(button, context) {
        let storedContext = __privateGet(this, _clickContexts).get(button);
        if (!storedContext || storedContext.compare(context)) {
          storedContext = context;
        }
        ++storedContext.count;
        __privateGet(this, _clickContexts).set(button, storedContext);
        return storedContext.count;
      }
      getClickCount(button) {
        return __privateGet(this, _clickContexts).get(button)?.count ?? 0;
      }
    };
    _clickContexts = new WeakMap();
    // --- Platform-specific code starts here ---
    // Input.dispatchMouseEvent doesn't know the concept of double click, so we
    // need to create the logic, similar to how it's done for OSes:
    // https://source.chromium.org/chromium/chromium/src/+/refs/heads/main:ui/events/event.cc;l=479
    __publicField(PointerSource, "ClickContext", class ClickContext {
      static #DOUBLE_CLICK_TIME_MS = 500;
      static #MAX_DOUBLE_CLICK_RADIUS = 2;
      count = 0;
      #x;
      #y;
      #time;
      constructor(x, y, time) {
        this.#x = x;
        this.#y = y;
        this.#time = time;
      }
      compare(context) {
        return (
          // The click needs to be within a certain amount of ms.
          context.#time - this.#time > ClickContext.#DOUBLE_CLICK_TIME_MS || // The click needs to be within a certain square radius.
          Math.abs(context.#x - this.#x) > ClickContext.#MAX_DOUBLE_CLICK_RADIUS || Math.abs(context.#y - this.#y) > ClickContext.#MAX_DOUBLE_CLICK_RADIUS
        );
      }
    });
    exports.PointerSource = PointerSource;
    _a3 = PointerSource;
    var WheelSource = class {
      type = "wheel";
    };
    exports.WheelSource = WheelSource;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/keyUtils.js
var require_keyUtils = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/keyUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNormalizedKey = getNormalizedKey;
    exports.getKeyCode = getKeyCode;
    exports.getKeyLocation = getKeyLocation;
    function getNormalizedKey(value) {
      switch (value) {
        case "\uE000":
          return "Unidentified";
        case "\uE001":
          return "Cancel";
        case "\uE002":
          return "Help";
        case "\uE003":
          return "Backspace";
        case "\uE004":
          return "Tab";
        case "\uE005":
          return "Clear";
        case "\uE006":
        case "\uE007":
          return "Enter";
        case "\uE008":
          return "Shift";
        case "\uE009":
          return "Control";
        case "\uE00A":
          return "Alt";
        case "\uE00B":
          return "Pause";
        case "\uE00C":
          return "Escape";
        case "\uE00D":
          return " ";
        case "\uE00E":
          return "PageUp";
        case "\uE00F":
          return "PageDown";
        case "\uE010":
          return "End";
        case "\uE011":
          return "Home";
        case "\uE012":
          return "ArrowLeft";
        case "\uE013":
          return "ArrowUp";
        case "\uE014":
          return "ArrowRight";
        case "\uE015":
          return "ArrowDown";
        case "\uE016":
          return "Insert";
        case "\uE017":
          return "Delete";
        case "\uE018":
          return ";";
        case "\uE019":
          return "=";
        case "\uE01A":
          return "0";
        case "\uE01B":
          return "1";
        case "\uE01C":
          return "2";
        case "\uE01D":
          return "3";
        case "\uE01E":
          return "4";
        case "\uE01F":
          return "5";
        case "\uE020":
          return "6";
        case "\uE021":
          return "7";
        case "\uE022":
          return "8";
        case "\uE023":
          return "9";
        case "\uE024":
          return "*";
        case "\uE025":
          return "+";
        case "\uE026":
          return ",";
        case "\uE027":
          return "-";
        case "\uE028":
          return ".";
        case "\uE029":
          return "/";
        case "\uE031":
          return "F1";
        case "\uE032":
          return "F2";
        case "\uE033":
          return "F3";
        case "\uE034":
          return "F4";
        case "\uE035":
          return "F5";
        case "\uE036":
          return "F6";
        case "\uE037":
          return "F7";
        case "\uE038":
          return "F8";
        case "\uE039":
          return "F9";
        case "\uE03A":
          return "F10";
        case "\uE03B":
          return "F11";
        case "\uE03C":
          return "F12";
        case "\uE03D":
          return "Meta";
        case "\uE040":
          return "ZenkakuHankaku";
        case "\uE050":
          return "Shift";
        case "\uE051":
          return "Control";
        case "\uE052":
          return "Alt";
        case "\uE053":
          return "Meta";
        case "\uE054":
          return "PageUp";
        case "\uE055":
          return "PageDown";
        case "\uE056":
          return "End";
        case "\uE057":
          return "Home";
        case "\uE058":
          return "ArrowLeft";
        case "\uE059":
          return "ArrowUp";
        case "\uE05A":
          return "ArrowRight";
        case "\uE05B":
          return "ArrowDown";
        case "\uE05C":
          return "Insert";
        case "\uE05D":
          return "Delete";
        default:
          return value;
      }
    }
    function getKeyCode(key) {
      switch (key) {
        case "`":
        case "~":
          return "Backquote";
        case "\\":
        case "|":
          return "Backslash";
        case "\uE003":
          return "Backspace";
        case "[":
        case "{":
          return "BracketLeft";
        case "]":
        case "}":
          return "BracketRight";
        case ",":
        case "<":
          return "Comma";
        case "0":
        case ")":
          return "Digit0";
        case "1":
        case "!":
          return "Digit1";
        case "2":
        case "@":
          return "Digit2";
        case "3":
        case "#":
          return "Digit3";
        case "4":
        case "$":
          return "Digit4";
        case "5":
        case "%":
          return "Digit5";
        case "6":
        case "^":
          return "Digit6";
        case "7":
        case "&":
          return "Digit7";
        case "8":
        case "*":
          return "Digit8";
        case "9":
        case "(":
          return "Digit9";
        case "=":
        case "+":
          return "Equal";
        case ">":
          return "IntlBackslash";
        case "a":
        case "A":
          return "KeyA";
        case "b":
        case "B":
          return "KeyB";
        case "c":
        case "C":
          return "KeyC";
        case "d":
        case "D":
          return "KeyD";
        case "e":
        case "E":
          return "KeyE";
        case "f":
        case "F":
          return "KeyF";
        case "g":
        case "G":
          return "KeyG";
        case "h":
        case "H":
          return "KeyH";
        case "i":
        case "I":
          return "KeyI";
        case "j":
        case "J":
          return "KeyJ";
        case "k":
        case "K":
          return "KeyK";
        case "l":
        case "L":
          return "KeyL";
        case "m":
        case "M":
          return "KeyM";
        case "n":
        case "N":
          return "KeyN";
        case "o":
        case "O":
          return "KeyO";
        case "p":
        case "P":
          return "KeyP";
        case "q":
        case "Q":
          return "KeyQ";
        case "r":
        case "R":
          return "KeyR";
        case "s":
        case "S":
          return "KeyS";
        case "t":
        case "T":
          return "KeyT";
        case "u":
        case "U":
          return "KeyU";
        case "v":
        case "V":
          return "KeyV";
        case "w":
        case "W":
          return "KeyW";
        case "x":
        case "X":
          return "KeyX";
        case "y":
        case "Y":
          return "KeyY";
        case "z":
        case "Z":
          return "KeyZ";
        case "-":
        case "_":
          return "Minus";
        case ".":
          return "Period";
        case "'":
        case '"':
          return "Quote";
        case ";":
        case ":":
          return "Semicolon";
        case "/":
        case "?":
          return "Slash";
        case "\uE00A":
          return "AltLeft";
        case "\uE052":
          return "AltRight";
        case "\uE009":
          return "ControlLeft";
        case "\uE051":
          return "ControlRight";
        case "\uE006":
          return "Enter";
        case "\uE00B":
          return "Pause";
        case "\uE03D":
          return "MetaLeft";
        case "\uE053":
          return "MetaRight";
        case "\uE008":
          return "ShiftLeft";
        case "\uE050":
          return "ShiftRight";
        case " ":
        case "\uE00D":
          return "Space";
        case "\uE004":
          return "Tab";
        case "\uE017":
          return "Delete";
        case "\uE010":
          return "End";
        case "\uE002":
          return "Help";
        case "\uE011":
          return "Home";
        case "\uE016":
          return "Insert";
        case "\uE00F":
          return "PageDown";
        case "\uE00E":
          return "PageUp";
        case "\uE015":
          return "ArrowDown";
        case "\uE012":
          return "ArrowLeft";
        case "\uE014":
          return "ArrowRight";
        case "\uE013":
          return "ArrowUp";
        case "\uE00C":
          return "Escape";
        case "\uE031":
          return "F1";
        case "\uE032":
          return "F2";
        case "\uE033":
          return "F3";
        case "\uE034":
          return "F4";
        case "\uE035":
          return "F5";
        case "\uE036":
          return "F6";
        case "\uE037":
          return "F7";
        case "\uE038":
          return "F8";
        case "\uE039":
          return "F9";
        case "\uE03A":
          return "F10";
        case "\uE03B":
          return "F11";
        case "\uE03C":
          return "F12";
        case "\uE019":
          return "NumpadEqual";
        case "\uE01A":
        case "\uE05C":
          return "Numpad0";
        case "\uE01B":
        case "\uE056":
          return "Numpad1";
        case "\uE01C":
        case "\uE05B":
          return "Numpad2";
        case "\uE01D":
        case "\uE055":
          return "Numpad3";
        case "\uE01E":
        case "\uE058":
          return "Numpad4";
        case "\uE01F":
          return "Numpad5";
        case "\uE020":
        case "\uE05A":
          return "Numpad6";
        case "\uE021":
        case "\uE057":
          return "Numpad7";
        case "\uE022":
        case "\uE059":
          return "Numpad8";
        case "\uE023":
        case "\uE054":
          return "Numpad9";
        case "\uE025":
          return "NumpadAdd";
        case "\uE026":
          return "NumpadComma";
        case "\uE028":
        case "\uE05D":
          return "NumpadDecimal";
        case "\uE029":
          return "NumpadDivide";
        case "\uE007":
          return "NumpadEnter";
        case "\uE024":
          return "NumpadMultiply";
        case "\uE027":
          return "NumpadSubtract";
        default:
          return;
      }
    }
    function getKeyLocation(key) {
      switch (key) {
        case "\uE007":
        case "\uE008":
        case "\uE009":
        case "\uE00A":
        case "\uE03D":
          return 1;
        case "\uE019":
        case "\uE01A":
        case "\uE01B":
        case "\uE01C":
        case "\uE01D":
        case "\uE01E":
        case "\uE01F":
        case "\uE020":
        case "\uE021":
        case "\uE022":
        case "\uE023":
        case "\uE024":
        case "\uE025":
        case "\uE026":
        case "\uE027":
        case "\uE028":
        case "\uE029":
        case "\uE054":
        case "\uE055":
        case "\uE056":
        case "\uE057":
        case "\uE058":
        case "\uE059":
        case "\uE05A":
        case "\uE05B":
        case "\uE05C":
        case "\uE05D":
          return 3;
        case "\uE050":
        case "\uE051":
        case "\uE052":
        case "\uE053":
          return 2;
        default:
          return 0;
      }
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/USKeyboardLayout.js
var require_USKeyboardLayout = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/USKeyboardLayout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyToKeyCode = void 0;
    exports.KeyToKeyCode = {
      "0": 48,
      "1": 49,
      "2": 50,
      "3": 51,
      "4": 52,
      "5": 53,
      "6": 54,
      "7": 55,
      "8": 56,
      "9": 57,
      Abort: 3,
      Help: 6,
      Backspace: 8,
      Tab: 9,
      Numpad5: 12,
      NumpadEnter: 13,
      Enter: 13,
      "\\r": 13,
      "\\n": 13,
      ShiftLeft: 16,
      ShiftRight: 16,
      ControlLeft: 17,
      ControlRight: 17,
      AltLeft: 18,
      AltRight: 18,
      Pause: 19,
      CapsLock: 20,
      Escape: 27,
      Convert: 28,
      NonConvert: 29,
      Space: 32,
      Numpad9: 33,
      PageUp: 33,
      Numpad3: 34,
      PageDown: 34,
      End: 35,
      Numpad1: 35,
      Home: 36,
      Numpad7: 36,
      ArrowLeft: 37,
      Numpad4: 37,
      Numpad8: 38,
      ArrowUp: 38,
      ArrowRight: 39,
      Numpad6: 39,
      Numpad2: 40,
      ArrowDown: 40,
      Select: 41,
      Open: 43,
      PrintScreen: 44,
      Insert: 45,
      Numpad0: 45,
      Delete: 46,
      NumpadDecimal: 46,
      Digit0: 48,
      Digit1: 49,
      Digit2: 50,
      Digit3: 51,
      Digit4: 52,
      Digit5: 53,
      Digit6: 54,
      Digit7: 55,
      Digit8: 56,
      Digit9: 57,
      KeyA: 65,
      KeyB: 66,
      KeyC: 67,
      KeyD: 68,
      KeyE: 69,
      KeyF: 70,
      KeyG: 71,
      KeyH: 72,
      KeyI: 73,
      KeyJ: 74,
      KeyK: 75,
      KeyL: 76,
      KeyM: 77,
      KeyN: 78,
      KeyO: 79,
      KeyP: 80,
      KeyQ: 81,
      KeyR: 82,
      KeyS: 83,
      KeyT: 84,
      KeyU: 85,
      KeyV: 86,
      KeyW: 87,
      KeyX: 88,
      KeyY: 89,
      KeyZ: 90,
      MetaLeft: 91,
      MetaRight: 92,
      ContextMenu: 93,
      NumpadMultiply: 106,
      NumpadAdd: 107,
      NumpadSubtract: 109,
      NumpadDivide: 111,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      F13: 124,
      F14: 125,
      F15: 126,
      F16: 127,
      F17: 128,
      F18: 129,
      F19: 130,
      F20: 131,
      F21: 132,
      F22: 133,
      F23: 134,
      F24: 135,
      NumLock: 144,
      ScrollLock: 145,
      AudioVolumeMute: 173,
      AudioVolumeDown: 174,
      AudioVolumeUp: 175,
      MediaTrackNext: 176,
      MediaTrackPrevious: 177,
      MediaStop: 178,
      MediaPlayPause: 179,
      Semicolon: 186,
      Equal: 187,
      NumpadEqual: 187,
      Comma: 188,
      Minus: 189,
      Period: 190,
      Slash: 191,
      Backquote: 192,
      BracketLeft: 219,
      Backslash: 220,
      BracketRight: 221,
      Quote: 222,
      AltGraph: 225,
      Props: 247,
      Cancel: 3,
      Clear: 12,
      Shift: 16,
      Control: 17,
      Alt: 18,
      Accept: 30,
      ModeChange: 31,
      " ": 32,
      Print: 42,
      Execute: 43,
      "\\u0000": 46,
      a: 65,
      b: 66,
      c: 67,
      d: 68,
      e: 69,
      f: 70,
      g: 71,
      h: 72,
      i: 73,
      j: 74,
      k: 75,
      l: 76,
      m: 77,
      n: 78,
      o: 79,
      p: 80,
      q: 81,
      r: 82,
      s: 83,
      t: 84,
      u: 85,
      v: 86,
      w: 87,
      x: 88,
      y: 89,
      z: 90,
      Meta: 91,
      "*": 106,
      "+": 107,
      "-": 109,
      "/": 111,
      ";": 186,
      "=": 187,
      ",": 188,
      ".": 190,
      "`": 192,
      "[": 219,
      "\\\\": 220,
      "]": 221,
      "'": 222,
      Attn: 246,
      CrSel: 247,
      ExSel: 248,
      EraseEof: 249,
      Play: 250,
      ZoomOut: 251,
      ")": 48,
      "!": 49,
      "@": 50,
      "#": 51,
      $: 52,
      "%": 53,
      "^": 54,
      "&": 55,
      "(": 57,
      A: 65,
      B: 66,
      C: 67,
      D: 68,
      E: 69,
      F: 70,
      G: 71,
      H: 72,
      I: 73,
      J: 74,
      K: 75,
      L: 76,
      M: 77,
      N: 78,
      O: 79,
      P: 80,
      Q: 81,
      R: 82,
      S: 83,
      T: 84,
      U: 85,
      V: 86,
      W: 87,
      X: 88,
      Y: 89,
      Z: 90,
      ":": 186,
      "<": 188,
      _: 189,
      ">": 190,
      "?": 191,
      "~": 192,
      "{": 219,
      "|": 220,
      "}": 221,
      '"': 222,
      Camera: 44,
      EndCall: 95,
      VolumeDown: 182,
      VolumeUp: 183
    };
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/ActionDispatcher.js
var require_ActionDispatcher = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/ActionDispatcher.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionDispatcher = void 0;
    var protocol_js_1 = require_protocol();
    var assert_js_1 = require_assert();
    var GraphemeTools_js_1 = require_GraphemeTools();
    var InputSource_js_1 = require_InputSource();
    var keyUtils_js_1 = require_keyUtils();
    var USKeyboardLayout_js_1 = require_USKeyboardLayout();
    var CALCULATE_IN_VIEW_CENTER_PT_DECL = ((i) => {
      const t = i.getClientRects()[0], e = Math.max(0, Math.min(t.x, t.x + t.width)), n = Math.min(window.innerWidth, Math.max(t.x, t.x + t.width)), h = Math.max(0, Math.min(t.y, t.y + t.height)), m = Math.min(window.innerHeight, Math.max(t.y, t.y + t.height));
      return [e + (n - e >> 1), h + (m - h >> 1)];
    }).toString();
    var IS_MAC_DECL = (() => {
      return navigator.platform.toLowerCase().includes("mac");
    }).toString();
    async function getElementCenter(context, element) {
      const sandbox = await context.getOrCreateSandbox(void 0);
      const result = await sandbox.callFunction(CALCULATE_IN_VIEW_CENTER_PT_DECL, false, { type: "undefined" }, [element]);
      if (result.type === "exception") {
        throw new protocol_js_1.NoSuchElementException(`Origin element ${element.sharedId} was not found`);
      }
      (0, assert_js_1.assert)(result.result.type === "array");
      (0, assert_js_1.assert)(result.result.value?.[0]?.type === "number");
      (0, assert_js_1.assert)(result.result.value?.[1]?.type === "number");
      const { result: { value: [{ value: x }, { value: y }] } } = result;
      return { x, y };
    }
    var _tickStart, _tickDuration, _inputState, _context, _isMacOS, _dispatchAction, dispatchAction_fn, _dispatchPointerDownAction, dispatchPointerDownAction_fn, _dispatchPointerUpAction, dispatchPointerUpAction_fn, _dispatchPointerMoveAction, dispatchPointerMoveAction_fn, _getCoordinateFromOrigin, getCoordinateFromOrigin_fn, _dispatchScrollAction, dispatchScrollAction_fn, _dispatchKeyDownAction, dispatchKeyDownAction_fn, _dispatchKeyUpAction, dispatchKeyUpAction_fn;
    var ActionDispatcher = class {
      constructor(inputState, context, isMacOS) {
        __privateAdd(this, _dispatchAction);
        __privateAdd(this, _dispatchPointerDownAction);
        __privateAdd(this, _dispatchPointerUpAction);
        __privateAdd(this, _dispatchPointerMoveAction);
        __privateAdd(this, _getCoordinateFromOrigin);
        __privateAdd(this, _dispatchScrollAction);
        __privateAdd(this, _dispatchKeyDownAction);
        __privateAdd(this, _dispatchKeyUpAction);
        __privateAdd(this, _tickStart, 0);
        __privateAdd(this, _tickDuration, 0);
        __privateAdd(this, _inputState, void 0);
        __privateAdd(this, _context, void 0);
        __privateAdd(this, _isMacOS, void 0);
        __privateSet(this, _inputState, inputState);
        __privateSet(this, _context, context);
        __privateSet(this, _isMacOS, isMacOS);
      }
      async dispatchActions(optionsByTick) {
        await __privateGet(this, _inputState).queue.run(async () => {
          for (const options of optionsByTick) {
            await this.dispatchTickActions(options);
          }
        });
      }
      async dispatchTickActions(options) {
        __privateSet(this, _tickStart, performance.now());
        __privateSet(this, _tickDuration, 0);
        for (const { action } of options) {
          if ("duration" in action && action.duration !== void 0) {
            __privateSet(this, _tickDuration, Math.max(__privateGet(this, _tickDuration), action.duration));
          }
        }
        const promises = [
          new Promise((resolve) => setTimeout(resolve, __privateGet(this, _tickDuration)))
        ];
        for (const option of options) {
          promises.push(__privateMethod(this, _dispatchAction, dispatchAction_fn).call(this, option));
        }
        await Promise.all(promises);
      }
    };
    _tickStart = new WeakMap();
    _tickDuration = new WeakMap();
    _inputState = new WeakMap();
    _context = new WeakMap();
    _isMacOS = new WeakMap();
    _dispatchAction = new WeakSet();
    dispatchAction_fn = async function({ id, action }) {
      const source = __privateGet(this, _inputState).get(id);
      const keyState = __privateGet(this, _inputState).getGlobalKeyState();
      switch (action.type) {
        case "keyDown": {
          await __privateMethod(this, _dispatchKeyDownAction, dispatchKeyDownAction_fn).call(this, source, action);
          __privateGet(this, _inputState).cancelList.push({
            id,
            action: {
              ...action,
              type: "keyUp"
            }
          });
          break;
        }
        case "keyUp": {
          await __privateMethod(this, _dispatchKeyUpAction, dispatchKeyUpAction_fn).call(this, source, action);
          break;
        }
        case "pause": {
          break;
        }
        case "pointerDown": {
          await __privateMethod(this, _dispatchPointerDownAction, dispatchPointerDownAction_fn).call(this, source, keyState, action);
          __privateGet(this, _inputState).cancelList.push({
            id,
            action: {
              ...action,
              type: "pointerUp"
            }
          });
          break;
        }
        case "pointerMove": {
          await __privateMethod(this, _dispatchPointerMoveAction, dispatchPointerMoveAction_fn).call(this, source, keyState, action);
          break;
        }
        case "pointerUp": {
          await __privateMethod(this, _dispatchPointerUpAction, dispatchPointerUpAction_fn).call(this, source, keyState, action);
          break;
        }
        case "scroll": {
          await __privateMethod(this, _dispatchScrollAction, dispatchScrollAction_fn).call(this, source, keyState, action);
          break;
        }
      }
    };
    _dispatchPointerDownAction = new WeakSet();
    dispatchPointerDownAction_fn = async function(source, keyState, action) {
      const { button } = action;
      if (source.pressed.has(button)) {
        return;
      }
      source.pressed.add(button);
      const { x, y, subtype: pointerType } = source;
      const { width, height, pressure, twist, tangentialPressure } = action;
      const { tiltX, tiltY } = getTilt(action);
      const { modifiers } = keyState;
      const { radiusX, radiusY } = getRadii(width ?? 1, height ?? 1);
      switch (pointerType) {
        case "mouse":
        case "pen":
          await __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
            type: "mousePressed",
            x,
            y,
            modifiers,
            button: getCdpButton(button),
            buttons: source.buttons,
            clickCount: source.setClickCount(button, new InputSource_js_1.PointerSource.ClickContext(x, y, performance.now())),
            pointerType,
            tangentialPressure,
            tiltX,
            tiltY,
            twist,
            force: pressure
          });
          break;
        case "touch":
          await __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [
              {
                x,
                y,
                radiusX,
                radiusY,
                tangentialPressure,
                tiltX,
                tiltY,
                twist,
                force: pressure,
                id: source.pointerId
              }
            ],
            modifiers
          });
          break;
      }
      source.radiusX = radiusX;
      source.radiusY = radiusY;
      source.force = pressure;
    };
    _dispatchPointerUpAction = new WeakSet();
    dispatchPointerUpAction_fn = function(source, keyState, action) {
      const { button } = action;
      if (!source.pressed.has(button)) {
        return;
      }
      source.pressed.delete(button);
      const { x, y, force, radiusX, radiusY, subtype: pointerType } = source;
      const { modifiers } = keyState;
      switch (pointerType) {
        case "mouse":
        case "pen":
          return __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseReleased",
            x,
            y,
            modifiers,
            button: getCdpButton(button),
            buttons: source.buttons,
            clickCount: source.getClickCount(button),
            pointerType
          });
        case "touch":
          return __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [
              {
                x,
                y,
                id: source.pointerId,
                force,
                radiusX,
                radiusY
              }
            ],
            modifiers
          });
      }
    };
    _dispatchPointerMoveAction = new WeakSet();
    dispatchPointerMoveAction_fn = async function(source, keyState, action) {
      const { x: startX, y: startY, subtype: pointerType } = source;
      const { width, height, pressure, twist, tangentialPressure, x: offsetX, y: offsetY, origin = "viewport", duration = __privateGet(this, _tickDuration) } = action;
      const { tiltX, tiltY } = getTilt(action);
      const { radiusX, radiusY } = getRadii(width ?? 1, height ?? 1);
      const { targetX, targetY } = await __privateMethod(this, _getCoordinateFromOrigin, getCoordinateFromOrigin_fn).call(this, origin, offsetX, offsetY, startX, startY);
      if (targetX < 0 || targetY < 0) {
        throw new protocol_js_1.MoveTargetOutOfBoundsException(`Cannot move beyond viewport (x: ${targetX}, y: ${targetY})`);
      }
      let last;
      do {
        const ratio = duration > 0 ? (performance.now() - __privateGet(this, _tickStart)) / duration : 1;
        last = ratio >= 1;
        let x;
        let y;
        if (last) {
          x = targetX;
          y = targetY;
        } else {
          x = Math.round(ratio * (targetX - startX) + startX);
          y = Math.round(ratio * (targetY - startY) + startY);
        }
        if (source.x !== x || source.y !== y) {
          const { modifiers } = keyState;
          switch (pointerType) {
            case "mouse":
              await __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
                type: "mouseMoved",
                x,
                y,
                modifiers,
                clickCount: 0,
                button: getCdpButton(source.pressed.values().next().value ?? 5),
                buttons: source.buttons,
                pointerType,
                tangentialPressure,
                tiltX,
                tiltY,
                twist,
                force: pressure
              });
              break;
            case "pen":
              if (source.pressed.size !== 0) {
                await __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
                  type: "mouseMoved",
                  x,
                  y,
                  modifiers,
                  clickCount: 0,
                  button: getCdpButton(source.pressed.values().next().value ?? 5),
                  buttons: source.buttons,
                  pointerType,
                  tangentialPressure,
                  tiltX,
                  tiltY,
                  twist,
                  force: pressure ?? 0.5
                });
              }
              break;
            case "touch":
              if (source.pressed.size !== 0) {
                await __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
                  type: "touchMove",
                  touchPoints: [
                    {
                      x,
                      y,
                      radiusX,
                      radiusY,
                      tangentialPressure,
                      tiltX,
                      tiltY,
                      twist,
                      force: pressure,
                      id: source.pointerId
                    }
                  ],
                  modifiers
                });
              }
              break;
          }
          source.x = x;
          source.y = y;
          source.radiusX = radiusX;
          source.radiusY = radiusY;
          source.force = pressure;
        }
      } while (!last);
    };
    _getCoordinateFromOrigin = new WeakSet();
    getCoordinateFromOrigin_fn = async function(origin, offsetX, offsetY, startX, startY) {
      let targetX;
      let targetY;
      switch (origin) {
        case "viewport":
          targetX = offsetX;
          targetY = offsetY;
          break;
        case "pointer":
          targetX = startX + offsetX;
          targetY = startY + offsetY;
          break;
        default: {
          const { x: posX, y: posY } = await getElementCenter(__privateGet(this, _context), origin.element);
          targetX = posX + offsetX;
          targetY = posY + offsetY;
          break;
        }
      }
      return { targetX, targetY };
    };
    _dispatchScrollAction = new WeakSet();
    dispatchScrollAction_fn = async function(_source, keyState, action) {
      const { deltaX: targetDeltaX, deltaY: targetDeltaY, x: offsetX, y: offsetY, origin = "viewport", duration = __privateGet(this, _tickDuration) } = action;
      if (origin === "pointer") {
        throw new protocol_js_1.InvalidArgumentException('"pointer" origin is invalid for scrolling.');
      }
      const { targetX, targetY } = await __privateMethod(this, _getCoordinateFromOrigin, getCoordinateFromOrigin_fn).call(this, origin, offsetX, offsetY, 0, 0);
      if (targetX < 0 || targetY < 0) {
        throw new protocol_js_1.MoveTargetOutOfBoundsException(`Cannot move beyond viewport (x: ${targetX}, y: ${targetY})`);
      }
      let currentDeltaX = 0;
      let currentDeltaY = 0;
      let last;
      do {
        const ratio = duration > 0 ? (performance.now() - __privateGet(this, _tickStart)) / duration : 1;
        last = ratio >= 1;
        let deltaX;
        let deltaY;
        if (last) {
          deltaX = targetDeltaX - currentDeltaX;
          deltaY = targetDeltaY - currentDeltaY;
        } else {
          deltaX = Math.round(ratio * targetDeltaX - currentDeltaX);
          deltaY = Math.round(ratio * targetDeltaY - currentDeltaY);
        }
        if (deltaX !== 0 || deltaY !== 0) {
          const { modifiers } = keyState;
          await __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseWheel",
            deltaX,
            deltaY,
            x: targetX,
            y: targetY,
            modifiers
          });
          currentDeltaX += deltaX;
          currentDeltaY += deltaY;
        }
      } while (!last);
    };
    _dispatchKeyDownAction = new WeakSet();
    dispatchKeyDownAction_fn = async function(source, action) {
      const rawKey = action.value;
      if (!(0, GraphemeTools_js_1.isSingleGrapheme)(rawKey)) {
        throw new protocol_js_1.InvalidArgumentException(`Invalid key value: ${rawKey}`);
      }
      const isGrapheme = (0, GraphemeTools_js_1.isSingleComplexGrapheme)(rawKey);
      const key = (0, keyUtils_js_1.getNormalizedKey)(rawKey);
      const repeat = source.pressed.has(key);
      const code = (0, keyUtils_js_1.getKeyCode)(rawKey);
      const location = (0, keyUtils_js_1.getKeyLocation)(rawKey);
      switch (key) {
        case "Alt":
          source.alt = true;
          break;
        case "Shift":
          source.shift = true;
          break;
        case "Control":
          source.ctrl = true;
          break;
        case "Meta":
          source.meta = true;
          break;
      }
      source.pressed.add(key);
      const { modifiers } = source;
      const unmodifiedText = getKeyEventUnmodifiedText(key, source, isGrapheme);
      const text = getKeyEventText(code ?? "", source) ?? unmodifiedText;
      let command;
      if (__privateGet(this, _isMacOS) && source.meta) {
        switch (code) {
          case "KeyA":
            command = "SelectAll";
            break;
          case "KeyC":
            command = "Copy";
            break;
          case "KeyV":
            command = source.shift ? "PasteAndMatchStyle" : "Paste";
            break;
          case "KeyX":
            command = "Cut";
            break;
          case "KeyZ":
            command = source.shift ? "Redo" : "Undo";
            break;
          default:
        }
      }
      const promises = [
        __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchKeyEvent", {
          type: text ? "keyDown" : "rawKeyDown",
          windowsVirtualKeyCode: USKeyboardLayout_js_1.KeyToKeyCode[key],
          key,
          code,
          text,
          unmodifiedText,
          autoRepeat: repeat,
          isSystemKey: source.alt || void 0,
          location: location < 3 ? location : void 0,
          isKeypad: location === 3,
          modifiers,
          commands: command ? [command] : void 0
        })
      ];
      if (key === "Escape") {
        if (!source.alt && (__privateGet(this, _isMacOS) && !source.ctrl && !source.meta || !__privateGet(this, _isMacOS))) {
          promises.push(__privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.cancelDragging"));
        }
      }
      await Promise.all(promises);
    };
    _dispatchKeyUpAction = new WeakSet();
    dispatchKeyUpAction_fn = function(source, action) {
      const rawKey = action.value;
      if (!(0, GraphemeTools_js_1.isSingleGrapheme)(rawKey)) {
        throw new protocol_js_1.InvalidArgumentException(`Invalid key value: ${rawKey}`);
      }
      const isGrapheme = (0, GraphemeTools_js_1.isSingleComplexGrapheme)(rawKey);
      const key = (0, keyUtils_js_1.getNormalizedKey)(rawKey);
      if (!source.pressed.has(key)) {
        return;
      }
      const code = (0, keyUtils_js_1.getKeyCode)(rawKey);
      const location = (0, keyUtils_js_1.getKeyLocation)(rawKey);
      switch (key) {
        case "Alt":
          source.alt = false;
          break;
        case "Shift":
          source.shift = false;
          break;
        case "Control":
          source.ctrl = false;
          break;
        case "Meta":
          source.meta = false;
          break;
      }
      source.pressed.delete(key);
      const { modifiers } = source;
      const unmodifiedText = getKeyEventUnmodifiedText(key, source, isGrapheme);
      const text = getKeyEventText(code ?? "", source) ?? unmodifiedText;
      return __privateGet(this, _context).cdpTarget.cdpClient.sendCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        windowsVirtualKeyCode: USKeyboardLayout_js_1.KeyToKeyCode[key],
        key,
        code,
        text,
        unmodifiedText,
        location: location < 3 ? location : void 0,
        isSystemKey: source.alt || void 0,
        isKeypad: location === 3,
        modifiers
      });
    };
    __publicField(ActionDispatcher, "isMacOS", async (context) => {
      const result = await (await context.getOrCreateSandbox(void 0)).callFunction(IS_MAC_DECL, false);
      (0, assert_js_1.assert)(result.type !== "exception");
      (0, assert_js_1.assert)(result.result.type === "boolean");
      return result.result.value;
    });
    exports.ActionDispatcher = ActionDispatcher;
    var getKeyEventUnmodifiedText = (key, source, isGrapheme) => {
      if (isGrapheme) {
        return key;
      }
      if (key === "Enter") {
        return "\r";
      }
      return [...key].length === 1 ? source.shift ? key.toLocaleUpperCase("en-US") : key : void 0;
    };
    var getKeyEventText = (code, source) => {
      if (source.ctrl) {
        switch (code) {
          case "Digit2":
            if (source.shift) {
              return "\0";
            }
            break;
          case "KeyA":
            return "";
          case "KeyB":
            return "";
          case "KeyC":
            return "";
          case "KeyD":
            return "";
          case "KeyE":
            return "";
          case "KeyF":
            return "";
          case "KeyG":
            return "\x07";
          case "KeyH":
            return "\b";
          case "KeyI":
            return "	";
          case "KeyJ":
            return "\n";
          case "KeyK":
            return "\v";
          case "KeyL":
            return "\f";
          case "KeyM":
            return "\r";
          case "KeyN":
            return "";
          case "KeyO":
            return "";
          case "KeyP":
            return "";
          case "KeyQ":
            return "";
          case "KeyR":
            return "";
          case "KeyS":
            return "";
          case "KeyT":
            return "";
          case "KeyU":
            return "";
          case "KeyV":
            return "";
          case "KeyW":
            return "";
          case "KeyX":
            return "";
          case "KeyY":
            return "";
          case "KeyZ":
            return "";
          case "BracketLeft":
            return "\x1B";
          case "Backslash":
            return "";
          case "BracketRight":
            return "";
          case "Digit6":
            if (source.shift) {
              return "";
            }
            break;
          case "Minus":
            return "";
        }
        return "";
      }
      if (source.alt) {
        return "";
      }
      return;
    };
    function getCdpButton(button) {
      switch (button) {
        case 0:
          return "left";
        case 1:
          return "middle";
        case 2:
          return "right";
        case 3:
          return "back";
        case 4:
          return "forward";
        default:
          return "none";
      }
    }
    function getTilt(action) {
      const altitudeAngle = action.altitudeAngle ?? Math.PI / 2;
      const azimuthAngle = action.azimuthAngle ?? 0;
      let tiltXRadians = 0;
      let tiltYRadians = 0;
      if (altitudeAngle === 0) {
        if (azimuthAngle === 0 || azimuthAngle === 2 * Math.PI) {
          tiltXRadians = Math.PI / 2;
        }
        if (azimuthAngle === Math.PI / 2) {
          tiltYRadians = Math.PI / 2;
        }
        if (azimuthAngle === Math.PI) {
          tiltXRadians = -Math.PI / 2;
        }
        if (azimuthAngle === 3 * Math.PI / 2) {
          tiltYRadians = -Math.PI / 2;
        }
        if (azimuthAngle > 0 && azimuthAngle < Math.PI / 2) {
          tiltXRadians = Math.PI / 2;
          tiltYRadians = Math.PI / 2;
        }
        if (azimuthAngle > Math.PI / 2 && azimuthAngle < Math.PI) {
          tiltXRadians = -Math.PI / 2;
          tiltYRadians = Math.PI / 2;
        }
        if (azimuthAngle > Math.PI && azimuthAngle < 3 * Math.PI / 2) {
          tiltXRadians = -Math.PI / 2;
          tiltYRadians = -Math.PI / 2;
        }
        if (azimuthAngle > 3 * Math.PI / 2 && azimuthAngle < 2 * Math.PI) {
          tiltXRadians = Math.PI / 2;
          tiltYRadians = -Math.PI / 2;
        }
      }
      if (altitudeAngle !== 0) {
        const tanAlt = Math.tan(altitudeAngle);
        tiltXRadians = Math.atan(Math.cos(azimuthAngle) / tanAlt);
        tiltYRadians = Math.atan(Math.sin(azimuthAngle) / tanAlt);
      }
      const factor = 180 / Math.PI;
      return {
        tiltX: Math.round(tiltXRadians * factor),
        tiltY: Math.round(tiltYRadians * factor)
      };
    }
    function getRadii(width, height) {
      return {
        radiusX: width ? width / 2 : 0.5,
        radiusY: height ? height / 2 : 0.5
      };
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/Mutex.js
var require_Mutex = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/Mutex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mutex = void 0;
    var Mutex = class {
      #locked = false;
      #acquirers = [];
      // This is FIFO.
      acquire() {
        const state = { resolved: false };
        if (this.#locked) {
          return new Promise((resolve) => {
            this.#acquirers.push(() => resolve(this.#release.bind(this, state)));
          });
        }
        this.#locked = true;
        return Promise.resolve(this.#release.bind(this, state));
      }
      #release(state) {
        if (state.resolved) {
          throw new Error("Cannot release more than once.");
        }
        state.resolved = true;
        const resolve = this.#acquirers.shift();
        if (!resolve) {
          this.#locked = false;
          return;
        }
        resolve();
      }
      async run(action) {
        const release = await this.acquire();
        try {
          const result = await action();
          return result;
        } finally {
          release();
        }
      }
    };
    exports.Mutex = Mutex;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputState.js
var require_InputState = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputState.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputState = void 0;
    var protocol_js_1 = require_protocol();
    var Mutex_js_1 = require_Mutex();
    var InputSource_js_1 = require_InputSource();
    var InputState = class {
      cancelList = [];
      #sources = /* @__PURE__ */ new Map();
      #mutex = new Mutex_js_1.Mutex();
      getOrCreate(id, type, subtype) {
        let source = this.#sources.get(id);
        if (!source) {
          switch (type) {
            case "none":
              source = new InputSource_js_1.NoneSource();
              break;
            case "key":
              source = new InputSource_js_1.KeySource();
              break;
            case "pointer": {
              let pointerId = subtype === "mouse" ? 0 : 2;
              const pointerIds = /* @__PURE__ */ new Set();
              for (const [, source2] of this.#sources) {
                if (source2.type === "pointer") {
                  pointerIds.add(source2.pointerId);
                }
              }
              while (pointerIds.has(pointerId)) {
                ++pointerId;
              }
              source = new InputSource_js_1.PointerSource(pointerId, subtype);
              break;
            }
            case "wheel":
              source = new InputSource_js_1.WheelSource();
              break;
            default:
              throw new protocol_js_1.InvalidArgumentException(`Expected "${"none"}", "${"key"}", "${"pointer"}", or "${"wheel"}". Found unknown source type ${type}.`);
          }
          this.#sources.set(id, source);
          return source;
        }
        if (source.type !== type) {
          throw new protocol_js_1.InvalidArgumentException(`Input source type of ${id} is ${source.type}, but received ${type}.`);
        }
        return source;
      }
      get(id) {
        const source = this.#sources.get(id);
        if (!source) {
          throw new protocol_js_1.UnknownErrorException(`Internal error.`);
        }
        return source;
      }
      getGlobalKeyState() {
        const state = new InputSource_js_1.KeySource();
        for (const [, source] of this.#sources) {
          if (source.type !== "key") {
            continue;
          }
          for (const pressed of source.pressed) {
            state.pressed.add(pressed);
          }
          state.alt ||= source.alt;
          state.ctrl ||= source.ctrl;
          state.meta ||= source.meta;
          state.shift ||= source.shift;
        }
        return state;
      }
      get queue() {
        return this.#mutex;
      }
    };
    exports.InputState = InputState;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputStateManager.js
var require_InputStateManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputStateManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputStateManager = void 0;
    var assert_js_1 = require_assert();
    var InputState_js_1 = require_InputState();
    var InputStateManager = class extends WeakMap {
      get(context) {
        (0, assert_js_1.assert)(context.isTopLevelContext());
        if (!this.has(context)) {
          this.set(context, new InputState_js_1.InputState());
        }
        return super.get(context);
      }
    };
    exports.InputStateManager = InputStateManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputProcessor.js
var require_InputProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/input/InputProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var assert_js_1 = require_assert();
    var ActionDispatcher_js_1 = require_ActionDispatcher();
    var InputStateManager_js_1 = require_InputStateManager();
    var InputProcessor = class {
      #browsingContextStorage;
      #inputStateManager = new InputStateManager_js_1.InputStateManager();
      constructor(browsingContextStorage) {
        this.#browsingContextStorage = browsingContextStorage;
      }
      async performActions(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        const inputState = this.#inputStateManager.get(context.top);
        const actionsByTick = this.#getActionsByTick(params, inputState);
        const dispatcher = new ActionDispatcher_js_1.ActionDispatcher(inputState, context, await ActionDispatcher_js_1.ActionDispatcher.isMacOS(context).catch(() => false));
        await dispatcher.dispatchActions(actionsByTick);
        return {};
      }
      async releaseActions(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        const topContext = context.top;
        const inputState = this.#inputStateManager.get(topContext);
        const dispatcher = new ActionDispatcher_js_1.ActionDispatcher(inputState, context, await ActionDispatcher_js_1.ActionDispatcher.isMacOS(context).catch(() => false));
        await dispatcher.dispatchTickActions(inputState.cancelList.reverse());
        this.#inputStateManager.delete(topContext);
        return {};
      }
      async setFiles(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        const realm = await context.getOrCreateSandbox(void 0);
        let result;
        try {
          result = await realm.callFunction(String(function getFiles(fileListLength) {
            if (!(this instanceof HTMLInputElement)) {
              if (this instanceof Element) {
                return 1;
              }
              return 0;
            }
            if (this.type !== "file") {
              return 2;
            }
            if (this.disabled) {
              return 3;
            }
            if (fileListLength > 1 && !this.multiple) {
              return 4;
            }
            return;
          }), false, params.element, [{ type: "number", value: params.files.length }]);
        } catch {
          throw new protocol_js_1.NoSuchNodeException(`Could not find element ${params.element.sharedId}`);
        }
        (0, assert_js_1.assert)(result.type === "success");
        if (result.result.type === "number") {
          switch (result.result.value) {
            case 0: {
              throw new protocol_js_1.NoSuchElementException(`Could not find element ${params.element.sharedId}`);
            }
            case 1: {
              throw new protocol_js_1.UnableToSetFileInputException(`Element ${params.element.sharedId} is not a input`);
            }
            case 2: {
              throw new protocol_js_1.UnableToSetFileInputException(`Input element ${params.element.sharedId} is not a file type`);
            }
            case 3: {
              throw new protocol_js_1.UnableToSetFileInputException(`Input element ${params.element.sharedId} is disabled`);
            }
            case 4: {
              throw new protocol_js_1.UnableToSetFileInputException(`Cannot set multiple files on a non-multiple input element`);
            }
          }
        }
        if (params.files.length === 0) {
          await realm.callFunction(String(function dispatchEvent() {
            if (this.files?.length === 0) {
              this.dispatchEvent(new Event("cancel", {
                bubbles: true
              }));
              return;
            }
            this.files = new DataTransfer().files;
            this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
            this.dispatchEvent(new Event("change", { bubbles: true }));
          }), false, params.element);
          return {};
        }
        const paths = [];
        for (let i = 0; i < params.files.length; ++i) {
          const result2 = await realm.callFunction(
            String(function getFiles(index) {
              return this.files?.item(index);
            }),
            false,
            params.element,
            [{ type: "number", value: 0 }],
            "root"
            /* Script.ResultOwnership.Root */
          );
          (0, assert_js_1.assert)(result2.type === "success");
          if (result2.result.type !== "object") {
            break;
          }
          const { handle } = result2.result;
          (0, assert_js_1.assert)(handle !== void 0);
          const { path } = await realm.cdpClient.sendCommand("DOM.getFileInfo", {
            objectId: handle
          });
          paths.push(path);
          void realm.disown(handle).catch(void 0);
        }
        paths.sort();
        const sortedFiles = [...params.files].sort();
        if (paths.length !== params.files.length || sortedFiles.some((path, index) => {
          return paths[index] !== path;
        })) {
          const { objectId } = await realm.deserializeForCdp(params.element);
          (0, assert_js_1.assert)(objectId !== void 0);
          await realm.cdpClient.sendCommand("DOM.setFileInputFiles", {
            files: params.files,
            objectId
          });
        } else {
          await realm.callFunction(String(function dispatchEvent() {
            this.dispatchEvent(new Event("cancel", {
              bubbles: true
            }));
          }), false, params.element);
        }
        return {};
      }
      #getActionsByTick(params, inputState) {
        const actionsByTick = [];
        for (const action of params.actions) {
          switch (action.type) {
            case "pointer": {
              action.parameters ??= {
                pointerType: "mouse"
                /* Input.PointerType.Mouse */
              };
              action.parameters.pointerType ??= "mouse";
              const source = inputState.getOrCreate(action.id, "pointer", action.parameters.pointerType);
              if (source.subtype !== action.parameters.pointerType) {
                throw new protocol_js_1.InvalidArgumentException(`Expected input source ${action.id} to be ${source.subtype}; got ${action.parameters.pointerType}.`);
              }
              break;
            }
            default:
              inputState.getOrCreate(action.id, action.type);
          }
          const actions = action.actions.map((item) => ({
            id: action.id,
            action: item
          }));
          for (let i = 0; i < actions.length; i++) {
            if (actionsByTick.length === i) {
              actionsByTick.push([]);
            }
            actionsByTick[i].push(actions[i]);
          }
        }
        return actionsByTick;
      }
    };
    exports.InputProcessor = InputProcessor;
  }
});

// node_modules/urlpattern-polyfill/dist/urlpattern.cjs
var require_urlpattern = __commonJS({
  "node_modules/urlpattern-polyfill/dist/urlpattern.cjs"(exports, module) {
    "use strict";
    var M = Object.defineProperty;
    var Pe = Object.getOwnPropertyDescriptor;
    var Re = Object.getOwnPropertyNames;
    var Ee = Object.prototype.hasOwnProperty;
    var Oe = (e, t) => {
      for (var r in t)
        M(e, r, { get: t[r], enumerable: true });
    };
    var ke = (e, t, r, n) => {
      if (t && typeof t == "object" || typeof t == "function")
        for (let a of Re(t))
          !Ee.call(e, a) && a !== r && M(e, a, { get: () => t[a], enumerable: !(n = Pe(t, a)) || n.enumerable });
      return e;
    };
    var Te = (e) => ke(M({}, "__esModule", { value: true }), e);
    var Ne = {};
    Oe(Ne, { URLPattern: () => Y });
    module.exports = Te(Ne);
    var R = class {
      type = 3;
      name = "";
      prefix = "";
      value = "";
      suffix = "";
      modifier = 3;
      constructor(t, r, n, a, c, l) {
        this.type = t, this.name = r, this.prefix = n, this.value = a, this.suffix = c, this.modifier = l;
      }
      hasCustomName() {
        return this.name !== "" && typeof this.name != "number";
      }
    };
    var Ae = /[$_\p{ID_Start}]/u;
    var ye = /[$_\u200C\u200D\p{ID_Continue}]/u;
    var v = ".*";
    function we(e, t) {
      return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
    }
    function D(e, t = false) {
      let r = [], n = 0;
      for (; n < e.length; ) {
        let a = e[n], c = function(l) {
          if (!t)
            throw new TypeError(l);
          r.push({ type: "INVALID_CHAR", index: n, value: e[n++] });
        };
        if (a === "*") {
          r.push({ type: "ASTERISK", index: n, value: e[n++] });
          continue;
        }
        if (a === "+" || a === "?") {
          r.push({ type: "OTHER_MODIFIER", index: n, value: e[n++] });
          continue;
        }
        if (a === "\\") {
          r.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
          continue;
        }
        if (a === "{") {
          r.push({ type: "OPEN", index: n, value: e[n++] });
          continue;
        }
        if (a === "}") {
          r.push({ type: "CLOSE", index: n, value: e[n++] });
          continue;
        }
        if (a === ":") {
          let l = "", s = n + 1;
          for (; s < e.length; ) {
            let i = e.substr(s, 1);
            if (s === n + 1 && Ae.test(i) || s !== n + 1 && ye.test(i)) {
              l += e[s++];
              continue;
            }
            break;
          }
          if (!l) {
            c(`Missing parameter name at ${n}`);
            continue;
          }
          r.push({ type: "NAME", index: n, value: l }), n = s;
          continue;
        }
        if (a === "(") {
          let l = 1, s = "", i = n + 1, o = false;
          if (e[i] === "?") {
            c(`Pattern cannot start with "?" at ${i}`);
            continue;
          }
          for (; i < e.length; ) {
            if (!we(e[i], false)) {
              c(`Invalid character '${e[i]}' at ${i}.`), o = true;
              break;
            }
            if (e[i] === "\\") {
              s += e[i++] + e[i++];
              continue;
            }
            if (e[i] === ")") {
              if (l--, l === 0) {
                i++;
                break;
              }
            } else if (e[i] === "(" && (l++, e[i + 1] !== "?")) {
              c(`Capturing groups are not allowed at ${i}`), o = true;
              break;
            }
            s += e[i++];
          }
          if (o)
            continue;
          if (l) {
            c(`Unbalanced pattern at ${n}`);
            continue;
          }
          if (!s) {
            c(`Missing pattern at ${n}`);
            continue;
          }
          r.push({ type: "REGEX", index: n, value: s }), n = i;
          continue;
        }
        r.push({ type: "CHAR", index: n, value: e[n++] });
      }
      return r.push({ type: "END", index: n, value: "" }), r;
    }
    function F(e, t = {}) {
      let r = D(e);
      t.delimiter ??= "/#?", t.prefixes ??= "./";
      let n = `[^${S(t.delimiter)}]+?`, a = [], c = 0, l = 0, s = "", i = /* @__PURE__ */ new Set(), o = (h) => {
        if (l < r.length && r[l].type === h)
          return r[l++].value;
      }, f = () => o("OTHER_MODIFIER") ?? o("ASTERISK"), d = (h) => {
        let u = o(h);
        if (u !== void 0)
          return u;
        let { type: p, index: A } = r[l];
        throw new TypeError(`Unexpected ${p} at ${A}, expected ${h}`);
      }, T = () => {
        let h = "", u;
        for (; u = o("CHAR") ?? o("ESCAPED_CHAR"); )
          h += u;
        return h;
      }, xe = (h) => h, L = t.encodePart || xe, I = "", U = (h) => {
        I += h;
      }, $ = () => {
        I.length && (a.push(new R(3, "", "", L(I), "", 3)), I = "");
      }, X = (h, u, p, A, Z) => {
        let g = 3;
        switch (Z) {
          case "?":
            g = 1;
            break;
          case "*":
            g = 0;
            break;
          case "+":
            g = 2;
            break;
        }
        if (!u && !p && g === 3) {
          U(h);
          return;
        }
        if ($(), !u && !p) {
          if (!h)
            return;
          a.push(new R(3, "", "", L(h), "", g));
          return;
        }
        let m;
        p ? p === "*" ? m = v : m = p : m = n;
        let O = 2;
        m === n ? (O = 1, m = "") : m === v && (O = 0, m = "");
        let P;
        if (u ? P = u : p && (P = c++), i.has(P))
          throw new TypeError(`Duplicate name '${P}'.`);
        i.add(P), a.push(new R(O, P, L(h), m, L(A), g));
      };
      for (; l < r.length; ) {
        let h = o("CHAR"), u = o("NAME"), p = o("REGEX");
        if (!u && !p && (p = o("ASTERISK")), u || p) {
          let g = h ?? "";
          t.prefixes.indexOf(g) === -1 && (U(g), g = ""), $();
          let m = f();
          X(g, u, p, "", m);
          continue;
        }
        let A = h ?? o("ESCAPED_CHAR");
        if (A) {
          U(A);
          continue;
        }
        if (o("OPEN")) {
          let g = T(), m = o("NAME"), O = o("REGEX");
          !m && !O && (O = o("ASTERISK"));
          let P = T();
          d("CLOSE");
          let be = f();
          X(g, m, O, P, be);
          continue;
        }
        $(), d("END");
      }
      return a;
    }
    function S(e) {
      return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
    }
    function B(e) {
      return e && e.ignoreCase ? "ui" : "u";
    }
    function q(e, t, r) {
      return W(F(e, r), t, r);
    }
    function k(e) {
      switch (e) {
        case 0:
          return "*";
        case 1:
          return "?";
        case 2:
          return "+";
        case 3:
          return "";
      }
    }
    function W(e, t, r = {}) {
      r.delimiter ??= "/#?", r.prefixes ??= "./", r.sensitive ??= false, r.strict ??= false, r.end ??= true, r.start ??= true, r.endsWith = "";
      let n = r.start ? "^" : "";
      for (let s of e) {
        if (s.type === 3) {
          s.modifier === 3 ? n += S(s.value) : n += `(?:${S(s.value)})${k(s.modifier)}`;
          continue;
        }
        t && t.push(s.name);
        let i = `[^${S(r.delimiter)}]+?`, o = s.value;
        if (s.type === 1 ? o = i : s.type === 0 && (o = v), !s.prefix.length && !s.suffix.length) {
          s.modifier === 3 || s.modifier === 1 ? n += `(${o})${k(s.modifier)}` : n += `((?:${o})${k(s.modifier)})`;
          continue;
        }
        if (s.modifier === 3 || s.modifier === 1) {
          n += `(?:${S(s.prefix)}(${o})${S(s.suffix)})`, n += k(s.modifier);
          continue;
        }
        n += `(?:${S(s.prefix)}`, n += `((?:${o})(?:`, n += S(s.suffix), n += S(s.prefix), n += `(?:${o}))*)${S(s.suffix)})`, s.modifier === 0 && (n += "?");
      }
      let a = `[${S(r.endsWith)}]|$`, c = `[${S(r.delimiter)}]`;
      if (r.end)
        return r.strict || (n += `${c}?`), r.endsWith.length ? n += `(?=${a})` : n += "$", new RegExp(n, B(r));
      r.strict || (n += `(?:${c}(?=${a}))?`);
      let l = false;
      if (e.length) {
        let s = e[e.length - 1];
        s.type === 3 && s.modifier === 3 && (l = r.delimiter.indexOf(s) > -1);
      }
      return l || (n += `(?=${c}|${a})`), new RegExp(n, B(r));
    }
    var x = { delimiter: "", prefixes: "", sensitive: true, strict: true };
    var J = { delimiter: ".", prefixes: "", sensitive: true, strict: true };
    var Q = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
    function ee(e, t) {
      return e.length ? e[0] === "/" ? true : !t || e.length < 2 ? false : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : false;
    }
    function te(e, t) {
      return e.startsWith(t) ? e.substring(t.length, e.length) : e;
    }
    function Ce(e, t) {
      return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
    }
    function _(e) {
      return !e || e.length < 2 ? false : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
    }
    var re = ["ftp", "file", "http", "https", "ws", "wss"];
    function N(e) {
      if (!e)
        return true;
      for (let t of re)
        if (e.test(t))
          return true;
      return false;
    }
    function ne(e, t) {
      if (e = te(e, "#"), t || e === "")
        return e;
      let r = new URL("https://example.com");
      return r.hash = e, r.hash ? r.hash.substring(1, r.hash.length) : "";
    }
    function se(e, t) {
      if (e = te(e, "?"), t || e === "")
        return e;
      let r = new URL("https://example.com");
      return r.search = e, r.search ? r.search.substring(1, r.search.length) : "";
    }
    function ie(e, t) {
      return t || e === "" ? e : _(e) ? K(e) : j(e);
    }
    function ae(e, t) {
      if (t || e === "")
        return e;
      let r = new URL("https://example.com");
      return r.password = e, r.password;
    }
    function oe(e, t) {
      if (t || e === "")
        return e;
      let r = new URL("https://example.com");
      return r.username = e, r.username;
    }
    function ce(e, t, r) {
      if (r || e === "")
        return e;
      if (t && !re.includes(t))
        return new URL(`${t}:${e}`).pathname;
      let n = e[0] == "/";
      return e = new URL(n ? e : "/-" + e, "https://example.com").pathname, n || (e = e.substring(2, e.length)), e;
    }
    function le(e, t, r) {
      return z(t) === e && (e = ""), r || e === "" ? e : G(e);
    }
    function fe(e, t) {
      return e = Ce(e, ":"), t || e === "" ? e : y(e);
    }
    function z(e) {
      switch (e) {
        case "ws":
        case "http":
          return "80";
        case "wws":
        case "https":
          return "443";
        case "ftp":
          return "21";
        default:
          return "";
      }
    }
    function y(e) {
      if (e === "")
        return e;
      if (/^[-+.A-Za-z0-9]*$/.test(e))
        return e.toLowerCase();
      throw new TypeError(`Invalid protocol '${e}'.`);
    }
    function he(e) {
      if (e === "")
        return e;
      let t = new URL("https://example.com");
      return t.username = e, t.username;
    }
    function ue(e) {
      if (e === "")
        return e;
      let t = new URL("https://example.com");
      return t.password = e, t.password;
    }
    function j(e) {
      if (e === "")
        return e;
      if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e))
        throw new TypeError(`Invalid hostname '${e}'`);
      let t = new URL("https://example.com");
      return t.hostname = e, t.hostname;
    }
    function K(e) {
      if (e === "")
        return e;
      if (/[^0-9a-fA-F[\]:]/g.test(e))
        throw new TypeError(`Invalid IPv6 hostname '${e}'`);
      return e.toLowerCase();
    }
    function G(e) {
      if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535)
        return e;
      throw new TypeError(`Invalid port '${e}'.`);
    }
    function de(e) {
      if (e === "")
        return e;
      let t = new URL("https://example.com");
      return t.pathname = e[0] !== "/" ? "/-" + e : e, e[0] !== "/" ? t.pathname.substring(2, t.pathname.length) : t.pathname;
    }
    function pe(e) {
      return e === "" ? e : new URL(`data:${e}`).pathname;
    }
    function ge(e) {
      if (e === "")
        return e;
      let t = new URL("https://example.com");
      return t.search = e, t.search.substring(1, t.search.length);
    }
    function me(e) {
      if (e === "")
        return e;
      let t = new URL("https://example.com");
      return t.hash = e, t.hash.substring(1, t.hash.length);
    }
    var H = class {
      #i;
      #n = [];
      #t = {};
      #e = 0;
      #s = 1;
      #l = 0;
      #o = 0;
      #d = 0;
      #p = 0;
      #g = false;
      constructor(t) {
        this.#i = t;
      }
      get result() {
        return this.#t;
      }
      parse() {
        for (this.#n = D(this.#i, true); this.#e < this.#n.length; this.#e += this.#s) {
          if (this.#s = 1, this.#n[this.#e].type === "END") {
            if (this.#o === 0) {
              this.#b(), this.#f() ? this.#r(9, 1) : this.#h() ? this.#r(8, 1) : this.#r(7, 0);
              continue;
            } else if (this.#o === 2) {
              this.#u(5);
              continue;
            }
            this.#r(10, 0);
            break;
          }
          if (this.#d > 0)
            if (this.#A())
              this.#d -= 1;
            else
              continue;
          if (this.#T()) {
            this.#d += 1;
            continue;
          }
          switch (this.#o) {
            case 0:
              this.#P() && this.#u(1);
              break;
            case 1:
              if (this.#P()) {
                this.#C();
                let t = 7, r = 1;
                this.#E() ? (t = 2, r = 3) : this.#g && (t = 2), this.#r(t, r);
              }
              break;
            case 2:
              this.#S() ? this.#u(3) : (this.#x() || this.#h() || this.#f()) && this.#u(5);
              break;
            case 3:
              this.#O() ? this.#r(4, 1) : this.#S() && this.#r(5, 1);
              break;
            case 4:
              this.#S() && this.#r(5, 1);
              break;
            case 5:
              this.#y() ? this.#p += 1 : this.#w() && (this.#p -= 1), this.#k() && !this.#p ? this.#r(6, 1) : this.#x() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
              break;
            case 6:
              this.#x() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
              break;
            case 7:
              this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
              break;
            case 8:
              this.#f() && this.#r(9, 1);
              break;
            case 9:
              break;
            case 10:
              break;
          }
        }
        this.#t.hostname !== void 0 && this.#t.port === void 0 && (this.#t.port = "");
      }
      #r(t, r) {
        switch (this.#o) {
          case 0:
            break;
          case 1:
            this.#t.protocol = this.#c();
            break;
          case 2:
            break;
          case 3:
            this.#t.username = this.#c();
            break;
          case 4:
            this.#t.password = this.#c();
            break;
          case 5:
            this.#t.hostname = this.#c();
            break;
          case 6:
            this.#t.port = this.#c();
            break;
          case 7:
            this.#t.pathname = this.#c();
            break;
          case 8:
            this.#t.search = this.#c();
            break;
          case 9:
            this.#t.hash = this.#c();
            break;
          case 10:
            break;
        }
        this.#o !== 0 && t !== 10 && ([1, 2, 3, 4].includes(this.#o) && [6, 7, 8, 9].includes(t) && (this.#t.hostname ??= ""), [1, 2, 3, 4, 5, 6].includes(this.#o) && [8, 9].includes(t) && (this.#t.pathname ??= this.#g ? "/" : ""), [1, 2, 3, 4, 5, 6, 7].includes(this.#o) && t === 9 && (this.#t.search ??= "")), this.#R(t, r);
      }
      #R(t, r) {
        this.#o = t, this.#l = this.#e + r, this.#e += r, this.#s = 0;
      }
      #b() {
        this.#e = this.#l, this.#s = 0;
      }
      #u(t) {
        this.#b(), this.#o = t;
      }
      #m(t) {
        return t < 0 && (t = this.#n.length - t), t < this.#n.length ? this.#n[t] : this.#n[this.#n.length - 1];
      }
      #a(t, r) {
        let n = this.#m(t);
        return n.value === r && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
      }
      #P() {
        return this.#a(this.#e, ":");
      }
      #E() {
        return this.#a(this.#e + 1, "/") && this.#a(this.#e + 2, "/");
      }
      #S() {
        return this.#a(this.#e, "@");
      }
      #O() {
        return this.#a(this.#e, ":");
      }
      #k() {
        return this.#a(this.#e, ":");
      }
      #x() {
        return this.#a(this.#e, "/");
      }
      #h() {
        if (this.#a(this.#e, "?"))
          return true;
        if (this.#n[this.#e].value !== "?")
          return false;
        let t = this.#m(this.#e - 1);
        return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
      }
      #f() {
        return this.#a(this.#e, "#");
      }
      #T() {
        return this.#n[this.#e].type == "OPEN";
      }
      #A() {
        return this.#n[this.#e].type == "CLOSE";
      }
      #y() {
        return this.#a(this.#e, "[");
      }
      #w() {
        return this.#a(this.#e, "]");
      }
      #c() {
        let t = this.#n[this.#e], r = this.#m(this.#l).index;
        return this.#i.substring(r, t.index);
      }
      #C() {
        let t = {};
        Object.assign(t, x), t.encodePart = y;
        let r = q(this.#c(), void 0, t);
        this.#g = N(r);
      }
    };
    var V = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"];
    var E = "*";
    function Se(e, t) {
      if (typeof e != "string")
        throw new TypeError("parameter 1 is not of type 'string'.");
      let r = new URL(e, t);
      return { protocol: r.protocol.substring(0, r.protocol.length - 1), username: r.username, password: r.password, hostname: r.hostname, port: r.port, pathname: r.pathname, search: r.search !== "" ? r.search.substring(1, r.search.length) : void 0, hash: r.hash !== "" ? r.hash.substring(1, r.hash.length) : void 0 };
    }
    function b(e, t) {
      return t ? C(e) : e;
    }
    function w(e, t, r) {
      let n;
      if (typeof t.baseURL == "string")
        try {
          n = new URL(t.baseURL), t.protocol === void 0 && (e.protocol = b(n.protocol.substring(0, n.protocol.length - 1), r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && (e.username = b(n.username, r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && t.password === void 0 && (e.password = b(n.password, r)), t.protocol === void 0 && t.hostname === void 0 && (e.hostname = b(n.hostname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && (e.port = b(n.port, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && (e.pathname = b(n.pathname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && (e.search = b(n.search.substring(1, n.search.length), r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && t.hash === void 0 && (e.hash = b(n.hash.substring(1, n.hash.length), r));
        } catch {
          throw new TypeError(`invalid baseURL '${t.baseURL}'.`);
        }
      if (typeof t.protocol == "string" && (e.protocol = fe(t.protocol, r)), typeof t.username == "string" && (e.username = oe(t.username, r)), typeof t.password == "string" && (e.password = ae(t.password, r)), typeof t.hostname == "string" && (e.hostname = ie(t.hostname, r)), typeof t.port == "string" && (e.port = le(t.port, e.protocol, r)), typeof t.pathname == "string") {
        if (e.pathname = t.pathname, n && !ee(e.pathname, r)) {
          let a = n.pathname.lastIndexOf("/");
          a >= 0 && (e.pathname = b(n.pathname.substring(0, a + 1), r) + e.pathname);
        }
        e.pathname = ce(e.pathname, e.protocol, r);
      }
      return typeof t.search == "string" && (e.search = se(t.search, r)), typeof t.hash == "string" && (e.hash = ne(t.hash, r)), e;
    }
    function C(e) {
      return e.replace(/([+*?:{}()\\])/g, "\\$1");
    }
    function Le(e) {
      return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
    }
    function Ie(e, t) {
      t.delimiter ??= "/#?", t.prefixes ??= "./", t.sensitive ??= false, t.strict ??= false, t.end ??= true, t.start ??= true, t.endsWith = "";
      let r = ".*", n = `[^${Le(t.delimiter)}]+?`, a = /[$_\u200C\u200D\p{ID_Continue}]/u, c = "";
      for (let l = 0; l < e.length; ++l) {
        let s = e[l];
        if (s.type === 3) {
          if (s.modifier === 3) {
            c += C(s.value);
            continue;
          }
          c += `{${C(s.value)}}${k(s.modifier)}`;
          continue;
        }
        let i = s.hasCustomName(), o = !!s.suffix.length || !!s.prefix.length && (s.prefix.length !== 1 || !t.prefixes.includes(s.prefix)), f = l > 0 ? e[l - 1] : null, d = l < e.length - 1 ? e[l + 1] : null;
        if (!o && i && s.type === 1 && s.modifier === 3 && d && !d.prefix.length && !d.suffix.length)
          if (d.type === 3) {
            let T = d.value.length > 0 ? d.value[0] : "";
            o = a.test(T);
          } else
            o = !d.hasCustomName();
        if (!o && !s.prefix.length && f && f.type === 3) {
          let T = f.value[f.value.length - 1];
          o = t.prefixes.includes(T);
        }
        o && (c += "{"), c += C(s.prefix), i && (c += `:${s.name}`), s.type === 2 ? c += `(${s.value})` : s.type === 1 ? i || (c += `(${n})`) : s.type === 0 && (!i && (!f || f.type === 3 || f.modifier !== 3 || o || s.prefix !== "") ? c += "*" : c += `(${r})`), s.type === 1 && i && s.suffix.length && a.test(s.suffix[0]) && (c += "\\"), c += C(s.suffix), o && (c += "}"), s.modifier !== 3 && (c += k(s.modifier));
      }
      return c;
    }
    var Y = class {
      #i;
      #n = {};
      #t = {};
      #e = {};
      #s = {};
      #l = false;
      constructor(t = {}, r, n) {
        try {
          let a;
          if (typeof r == "string" ? a = r : n = r, typeof t == "string") {
            let i = new H(t);
            if (i.parse(), t = i.result, a === void 0 && typeof t.protocol != "string")
              throw new TypeError("A base URL must be provided for a relative constructor string.");
            t.baseURL = a;
          } else {
            if (!t || typeof t != "object")
              throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
            if (a)
              throw new TypeError("parameter 1 is not of type 'string'.");
          }
          typeof n > "u" && (n = { ignoreCase: false });
          let c = { ignoreCase: n.ignoreCase === true }, l = { pathname: E, protocol: E, username: E, password: E, hostname: E, port: E, search: E, hash: E };
          this.#i = w(l, t, true), z(this.#i.protocol) === this.#i.port && (this.#i.port = "");
          let s;
          for (s of V) {
            if (!(s in this.#i))
              continue;
            let i = {}, o = this.#i[s];
            switch (this.#t[s] = [], s) {
              case "protocol":
                Object.assign(i, x), i.encodePart = y;
                break;
              case "username":
                Object.assign(i, x), i.encodePart = he;
                break;
              case "password":
                Object.assign(i, x), i.encodePart = ue;
                break;
              case "hostname":
                Object.assign(i, J), _(o) ? i.encodePart = K : i.encodePart = j;
                break;
              case "port":
                Object.assign(i, x), i.encodePart = G;
                break;
              case "pathname":
                N(this.#n.protocol) ? (Object.assign(i, Q, c), i.encodePart = de) : (Object.assign(i, x, c), i.encodePart = pe);
                break;
              case "search":
                Object.assign(i, x, c), i.encodePart = ge;
                break;
              case "hash":
                Object.assign(i, x, c), i.encodePart = me;
                break;
            }
            try {
              this.#s[s] = F(o, i), this.#n[s] = W(this.#s[s], this.#t[s], i), this.#e[s] = Ie(this.#s[s], i), this.#l = this.#l || this.#s[s].some((f) => f.type === 2);
            } catch {
              throw new TypeError(`invalid ${s} pattern '${this.#i[s]}'.`);
            }
          }
        } catch (a) {
          throw new TypeError(`Failed to construct 'URLPattern': ${a.message}`);
        }
      }
      test(t = {}, r) {
        let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
        if (typeof t != "string" && r)
          throw new TypeError("parameter 1 is not of type 'string'.");
        if (typeof t > "u")
          return false;
        try {
          typeof t == "object" ? n = w(n, t, false) : n = w(n, Se(t, r), false);
        } catch {
          return false;
        }
        let a;
        for (a of V)
          if (!this.#n[a].exec(n[a]))
            return false;
        return true;
      }
      exec(t = {}, r) {
        let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
        if (typeof t != "string" && r)
          throw new TypeError("parameter 1 is not of type 'string'.");
        if (typeof t > "u")
          return;
        try {
          typeof t == "object" ? n = w(n, t, false) : n = w(n, Se(t, r), false);
        } catch {
          return null;
        }
        let a = {};
        r ? a.inputs = [t, r] : a.inputs = [t];
        let c;
        for (c of V) {
          let l = this.#n[c].exec(n[c]);
          if (!l)
            return null;
          let s = {};
          for (let [i, o] of this.#t[c].entries())
            if (typeof o == "string" || typeof o == "number") {
              let f = l[i + 1];
              s[o] = f;
            }
          a[c] = { input: n[c] ?? "", groups: s };
        }
        return a;
      }
      static compareComponent(t, r, n) {
        let a = (i, o) => {
          for (let f of ["type", "modifier", "prefix", "value", "suffix"]) {
            if (i[f] < o[f])
              return -1;
            if (i[f] === o[f])
              continue;
            return 1;
          }
          return 0;
        }, c = new R(3, "", "", "", "", 3), l = new R(0, "", "", "", "", 3), s = (i, o) => {
          let f = 0;
          for (; f < Math.min(i.length, o.length); ++f) {
            let d = a(i[f], o[f]);
            if (d)
              return d;
          }
          return i.length === o.length ? 0 : a(i[f] ?? c, o[f] ?? c);
        };
        return !r.#e[t] && !n.#e[t] ? 0 : r.#e[t] && !n.#e[t] ? s(r.#s[t], [l]) : !r.#e[t] && n.#e[t] ? s([l], n.#s[t]) : s(r.#s[t], n.#s[t]);
      }
      get protocol() {
        return this.#e.protocol;
      }
      get username() {
        return this.#e.username;
      }
      get password() {
        return this.#e.password;
      }
      get hostname() {
        return this.#e.hostname;
      }
      get port() {
        return this.#e.port;
      }
      get pathname() {
        return this.#e.pathname;
      }
      get search() {
        return this.#e.search;
      }
      get hash() {
        return this.#e.hash;
      }
      get hasRegExpGroups() {
        return this.#l;
      }
    };
  }
});

// node_modules/urlpattern-polyfill/index.cjs
var require_urlpattern_polyfill = __commonJS({
  "node_modules/urlpattern-polyfill/index.cjs"(exports, module) {
    var { URLPattern } = require_urlpattern();
    module.exports = { URLPattern };
    if (!globalThis.URLPattern) {
      globalThis.URLPattern = URLPattern;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/UrlPattern.js
var require_UrlPattern = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/UrlPattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.URLPattern = void 0;
    var urlpattern_polyfill_1 = require_urlpattern_polyfill();
    var URLPattern = urlpattern_polyfill_1.URLPattern;
    exports.URLPattern = URLPattern;
    if ("URLPattern" in globalThis) {
      exports.URLPattern = URLPattern = globalThis.URLPattern;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkProcessor.js
var require_NetworkProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var UrlPattern_js_1 = require_UrlPattern();
    var NetworkProcessor = class {
      #browsingContextStorage;
      #networkStorage;
      constructor(browsingContextStorage, networkStorage) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#networkStorage = networkStorage;
      }
      async addIntercept(params) {
        this.#browsingContextStorage.verifyTopLevelContextsList(params.contexts);
        const urlPatterns = params.urlPatterns ?? [];
        const parsedUrlPatterns = NetworkProcessor.parseUrlPatterns(urlPatterns);
        const intercept = this.#networkStorage.addIntercept({
          urlPatterns: parsedUrlPatterns,
          phases: params.phases,
          contexts: params.contexts
        });
        await Promise.all(this.#browsingContextStorage.getAllContexts().map((context) => {
          return context.cdpTarget.toggleFetchIfNeeded();
        }));
        return {
          intercept
        };
      }
      async continueRequest(params) {
        if (params.url !== void 0) {
          NetworkProcessor.parseUrlString(params.url);
        }
        if (params.method !== void 0) {
          if (!NetworkProcessor.isMethodValid(params.method)) {
            throw new protocol_js_1.InvalidArgumentException(`Method '${params.method}' is invalid.`);
          }
        }
        if (params.headers) {
          NetworkProcessor.validateHeaders(params.headers);
        }
        const request = this.#getBlockedRequestOrFail(params.request, [
          "beforeRequestSent"
        ]);
        try {
          await request.continueRequest(params);
        } catch (error) {
          throw NetworkProcessor.wrapInterceptionError(error);
        }
        return {};
      }
      async continueResponse(params) {
        if (params.headers) {
          NetworkProcessor.validateHeaders(params.headers);
        }
        const request = this.#getBlockedRequestOrFail(params.request, [
          "authRequired",
          "responseStarted"
        ]);
        try {
          await request.continueResponse(params);
        } catch (error) {
          throw NetworkProcessor.wrapInterceptionError(error);
        }
        return {};
      }
      async continueWithAuth(params) {
        const networkId = params.request;
        const request = this.#getBlockedRequestOrFail(networkId, [
          "authRequired"
        ]);
        await request.continueWithAuth(params);
        return {};
      }
      async failRequest({ request: networkId }) {
        const request = this.#getRequestOrFail(networkId);
        if (request.interceptPhase === "authRequired") {
          throw new protocol_js_1.InvalidArgumentException(`Request '${networkId}' in 'authRequired' phase cannot be failed`);
        }
        if (!request.interceptPhase) {
          throw new protocol_js_1.NoSuchRequestException(`No blocked request found for network id '${networkId}'`);
        }
        await request.failRequest("Failed");
        return {};
      }
      async provideResponse(params) {
        if (params.headers) {
          NetworkProcessor.validateHeaders(params.headers);
        }
        const request = this.#getBlockedRequestOrFail(params.request, [
          "beforeRequestSent",
          "responseStarted",
          "authRequired"
        ]);
        try {
          await request.provideResponse(params);
        } catch (error) {
          throw NetworkProcessor.wrapInterceptionError(error);
        }
        return {};
      }
      async removeIntercept(params) {
        this.#networkStorage.removeIntercept(params.intercept);
        await Promise.all(this.#browsingContextStorage.getAllContexts().map((context) => {
          return context.cdpTarget.toggleFetchIfNeeded();
        }));
        return {};
      }
      async setCacheBehavior(params) {
        const contexts = this.#browsingContextStorage.verifyTopLevelContextsList(params.contexts);
        if (contexts.size === 0) {
          this.#networkStorage.defaultCacheBehavior = params.cacheBehavior;
          await Promise.all(this.#browsingContextStorage.getAllContexts().map((context) => {
            return context.cdpTarget.toggleSetCacheDisabled();
          }));
          return {};
        }
        const cacheDisabled = params.cacheBehavior === "bypass";
        await Promise.all([...contexts.values()].map((context) => {
          return context.cdpTarget.toggleSetCacheDisabled(cacheDisabled);
        }));
        return {};
      }
      #getRequestOrFail(id) {
        const request = this.#networkStorage.getRequestById(id);
        if (!request) {
          throw new protocol_js_1.NoSuchRequestException(`Network request with ID '${id}' doesn't exist`);
        }
        return request;
      }
      #getBlockedRequestOrFail(id, phases) {
        const request = this.#getRequestOrFail(id);
        if (!request.interceptPhase) {
          throw new protocol_js_1.NoSuchRequestException(`No blocked request found for network id '${id}'`);
        }
        if (request.interceptPhase && !phases.includes(request.interceptPhase)) {
          throw new protocol_js_1.InvalidArgumentException(`Blocked request for network id '${id}' is in '${request.interceptPhase}' phase`);
        }
        return request;
      }
      /**
       * Validate https://fetch.spec.whatwg.org/#header-value
       */
      static validateHeaders(headers) {
        for (const header of headers) {
          let headerValue;
          if (header.value.type === "string") {
            headerValue = header.value.value;
          } else {
            headerValue = atob(header.value.value);
          }
          if (headerValue !== headerValue.trim() || headerValue.includes("\n") || headerValue.includes("\0")) {
            throw new protocol_js_1.InvalidArgumentException(`Header value '${headerValue}' is not acceptable value`);
          }
        }
      }
      static isMethodValid(method) {
        return /^[!#$%&'*+\-.^_`|~a-zA-Z\d]+$/.test(method);
      }
      /**
       * Attempts to parse the given url.
       * Throws an InvalidArgumentException if the url is invalid.
       */
      static parseUrlString(url) {
        try {
          return new URL(url);
        } catch (error) {
          throw new protocol_js_1.InvalidArgumentException(`Invalid URL '${url}': ${error}`);
        }
      }
      static parseUrlPatterns(urlPatterns) {
        return urlPatterns.map((urlPattern) => {
          switch (urlPattern.type) {
            case "string": {
              NetworkProcessor.parseUrlString(urlPattern.pattern);
              return urlPattern;
            }
            case "pattern":
              if (urlPattern.protocol === void 0 && urlPattern.hostname === void 0 && urlPattern.port === void 0 && urlPattern.pathname === void 0 && urlPattern.search === void 0) {
                return urlPattern;
              }
              if (urlPattern.protocol) {
                urlPattern.protocol = unescapeURLPattern(urlPattern.protocol);
                if (!urlPattern.protocol.match(/^[a-zA-Z+-.]+$/)) {
                  throw new protocol_js_1.InvalidArgumentException("Forbidden characters");
                }
              }
              if (urlPattern.hostname) {
                urlPattern.hostname = unescapeURLPattern(urlPattern.hostname);
              }
              if (urlPattern.port) {
                urlPattern.port = unescapeURLPattern(urlPattern.port);
              }
              if (urlPattern.pathname) {
                urlPattern.pathname = unescapeURLPattern(urlPattern.pathname);
                if (urlPattern.pathname[0] !== "/") {
                  urlPattern.pathname = `/${urlPattern.pathname}`;
                }
                if (urlPattern.pathname.includes("#") || urlPattern.pathname.includes("?")) {
                  throw new protocol_js_1.InvalidArgumentException("Forbidden characters");
                }
              } else if (urlPattern.pathname === "") {
                urlPattern.pathname = "/";
              }
              if (urlPattern.search) {
                urlPattern.search = unescapeURLPattern(urlPattern.search);
                if (urlPattern.search[0] !== "?") {
                  urlPattern.search = `?${urlPattern.search}`;
                }
                if (urlPattern.search.includes("#")) {
                  throw new protocol_js_1.InvalidArgumentException("Forbidden characters");
                }
              }
              if (urlPattern.protocol === "") {
                throw new protocol_js_1.InvalidArgumentException(`URL pattern must specify a protocol`);
              }
              if (urlPattern.hostname === "") {
                throw new protocol_js_1.InvalidArgumentException(`URL pattern must specify a hostname`);
              }
              if ((urlPattern.hostname?.length ?? 0) > 0) {
                if (urlPattern.protocol?.match(/^file/i)) {
                  throw new protocol_js_1.InvalidArgumentException(`URL pattern protocol cannot be 'file'`);
                }
                if (urlPattern.hostname?.includes(":")) {
                  throw new protocol_js_1.InvalidArgumentException(`URL pattern hostname must not contain a colon`);
                }
              }
              if (urlPattern.port === "") {
                throw new protocol_js_1.InvalidArgumentException(`URL pattern must specify a port`);
              }
              try {
                new UrlPattern_js_1.URLPattern(urlPattern);
              } catch (error) {
                throw new protocol_js_1.InvalidArgumentException(`${error}`);
              }
              return urlPattern;
          }
        });
      }
      static wrapInterceptionError(error) {
        if (error?.message.includes("Invalid header")) {
          return new protocol_js_1.InvalidArgumentException("Invalid header");
        }
        return error;
      }
    };
    exports.NetworkProcessor = NetworkProcessor;
    function unescapeURLPattern(pattern) {
      const forbidden = /* @__PURE__ */ new Set(["(", ")", "*", "{", "}"]);
      let result = "";
      let isEscaped = false;
      for (const c of pattern) {
        if (!isEscaped) {
          if (forbidden.has(c)) {
            throw new protocol_js_1.InvalidArgumentException("Forbidden characters");
          }
          if (c === "\\") {
            isEscaped = true;
            continue;
          }
        }
        result += c;
        isEscaped = false;
      }
      return result;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/permissions/PermissionsProcessor.js
var require_PermissionsProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/permissions/PermissionsProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PermissionsProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var PermissionsProcessor = class {
      #browserCdpClient;
      constructor(browserCdpClient) {
        this.#browserCdpClient = browserCdpClient;
      }
      async setPermissions(params) {
        try {
          const userContextId = params["goog:userContext"] || params.userContext;
          await this.#browserCdpClient.sendCommand("Browser.setPermission", {
            origin: params.origin,
            browserContextId: userContextId && userContextId !== "default" ? userContextId : void 0,
            permission: {
              name: params.descriptor.name
            },
            setting: params.state
          });
        } catch (err) {
          if (err.message === `Permission can't be granted to opaque origins.`) {
            return {};
          }
          throw new protocol_js_1.InvalidArgumentException(err.message);
        }
        return {};
      }
    };
    exports.PermissionsProcessor = PermissionsProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/uuid.js
var require_uuid = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/uuid.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uuidv4 = uuidv4;
    function bytesToHex(bytes) {
      return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    }
    function uuidv4() {
      if ("crypto" in globalThis && "randomUUID" in globalThis.crypto) {
        return globalThis.crypto.randomUUID();
      }
      const randomValues = new Uint8Array(16);
      if ("crypto" in globalThis && "getRandomValues" in globalThis.crypto) {
        globalThis.crypto.getRandomValues(randomValues);
      } else {
        __require("crypto").webcrypto.getRandomValues(randomValues);
      }
      randomValues[6] = randomValues[6] & 15 | 64;
      randomValues[8] = randomValues[8] & 63 | 128;
      return [
        bytesToHex(randomValues.subarray(0, 4)),
        bytesToHex(randomValues.subarray(4, 6)),
        bytesToHex(randomValues.subarray(6, 8)),
        bytesToHex(randomValues.subarray(8, 10)),
        bytesToHex(randomValues.subarray(10, 16))
      ].join("-");
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/ChannelProxy.js
var require_ChannelProxy = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/ChannelProxy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelProxy = void 0;
    var protocol_js_1 = require_protocol();
    var log_js_1 = require_log();
    var uuid_js_1 = require_uuid();
    var _properties, _id, _logger, _createChannelProxyEvalStr, createChannelProxyEvalStr_fn, _createAndGetHandleInRealm, createAndGetHandleInRealm_fn, _createSendMessageHandle, createSendMessageHandle_fn, _startListener, startListener_fn, _getHandleFromWindow, getHandleFromWindow_fn;
    var _ChannelProxy = class {
      constructor(channel, logger) {
        /** Starts listening for the channel events of the provided ChannelProxy. */
        __privateAdd(this, _startListener);
        /**
         * Returns a handle of ChannelProxy from window's property which was set there
         * by `getEvalInWindowStr`. If window property is not set yet, sets a promise
         * resolver to the window property, so that `getEvalInWindowStr` can resolve
         * the promise later on with the channel.
         * This is needed because `getEvalInWindowStr` can be called before or
         * after this method.
         */
        __privateAdd(this, _getHandleFromWindow);
        __privateAdd(this, _properties, void 0);
        __privateAdd(this, _id, (0, uuid_js_1.uuidv4)());
        __privateAdd(this, _logger, void 0);
        __privateSet(this, _properties, channel);
        __privateSet(this, _logger, logger);
      }
      /**
       * Creates a channel proxy in the given realm, initialises listener and
       * returns a handle to `sendMessage` delegate.
       */
      async init(realm, eventManager) {
        var _a3, _b;
        const channelHandle = await __privateMethod(_a3 = _ChannelProxy, _createAndGetHandleInRealm, createAndGetHandleInRealm_fn).call(_a3, realm);
        const sendMessageHandle = await __privateMethod(_b = _ChannelProxy, _createSendMessageHandle, createSendMessageHandle_fn).call(_b, realm, channelHandle);
        void __privateMethod(this, _startListener, startListener_fn).call(this, realm, channelHandle, eventManager);
        return sendMessageHandle;
      }
      /** Gets a ChannelProxy from window and returns its handle. */
      async startListenerFromWindow(realm, eventManager) {
        var _a3;
        try {
          const channelHandle = await __privateMethod(this, _getHandleFromWindow, getHandleFromWindow_fn).call(this, realm);
          void __privateMethod(this, _startListener, startListener_fn).call(this, realm, channelHandle, eventManager);
        } catch (error) {
          (_a3 = __privateGet(this, _logger)) == null ? void 0 : _a3.call(this, log_js_1.LogType.debugError, error);
        }
      }
      /**
       * String to be evaluated to create a ProxyChannel and put it to window.
       * Returns the delegate `sendMessage`. Used to provide an argument for preload
       * script. Does the following:
       * 1. Creates a ChannelProxy.
       * 2. Puts the ChannelProxy to window['${this.#id}'] or resolves the promise
       *    by calling delegate stored in window['${this.#id}'].
       *    This is needed because `#getHandleFromWindow` can be called before or
       *    after this method.
       * 3. Returns the delegate `sendMessage` of the created ChannelProxy.
       */
      getEvalInWindowStr() {
        var _a3;
        const delegate = String((id, channelProxy) => {
          const w = window;
          if (w[id] === void 0) {
            w[id] = channelProxy;
          } else {
            w[id](channelProxy);
            delete w[id];
          }
          return channelProxy.sendMessage;
        });
        const channelProxyEval = __privateMethod(_a3 = _ChannelProxy, _createChannelProxyEvalStr, createChannelProxyEvalStr_fn).call(_a3);
        return `(${delegate})('${__privateGet(this, _id)}',${channelProxyEval})`;
      }
    };
    var ChannelProxy = _ChannelProxy;
    _properties = new WeakMap();
    _id = new WeakMap();
    _logger = new WeakMap();
    _createChannelProxyEvalStr = new WeakSet();
    createChannelProxyEvalStr_fn = function() {
      const functionStr = String(() => {
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
      });
      return `(${functionStr})()`;
    };
    _createAndGetHandleInRealm = new WeakSet();
    createAndGetHandleInRealm_fn = async function(realm) {
      const createChannelHandleResult = await realm.cdpClient.sendCommand("Runtime.evaluate", {
        expression: __privateMethod(this, _createChannelProxyEvalStr, createChannelProxyEvalStr_fn).call(this),
        contextId: realm.executionContextId,
        serializationOptions: {
          serialization: "idOnly"
        }
      });
      if (createChannelHandleResult.exceptionDetails || createChannelHandleResult.result.objectId === void 0) {
        throw new Error(`Cannot create channel`);
      }
      return createChannelHandleResult.result.objectId;
    };
    _createSendMessageHandle = new WeakSet();
    createSendMessageHandle_fn = async function(realm, channelHandle) {
      const sendMessageArgResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
        functionDeclaration: String((channelHandle2) => {
          return channelHandle2.sendMessage;
        }),
        arguments: [{ objectId: channelHandle }],
        executionContextId: realm.executionContextId,
        serializationOptions: {
          serialization: "idOnly"
        }
      });
      return sendMessageArgResult.result.objectId;
    };
    _startListener = new WeakSet();
    startListener_fn = async function(realm, channelHandle, eventManager) {
      var _a3;
      for (; ; ) {
        try {
          const message = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: String(async (channelHandle2) => await channelHandle2.getMessage()),
            arguments: [
              {
                objectId: channelHandle
              }
            ],
            awaitPromise: true,
            executionContextId: realm.executionContextId,
            serializationOptions: {
              serialization: "deep",
              maxDepth: __privateGet(this, _properties).serializationOptions?.maxObjectDepth ?? void 0
            }
          });
          if (message.exceptionDetails) {
            throw new Error("Runtime.callFunctionOn in ChannelProxy", {
              cause: message.exceptionDetails
            });
          }
          for (const browsingContext of realm.associatedBrowsingContexts) {
            eventManager.registerEvent({
              type: "event",
              method: protocol_js_1.ChromiumBidi.Script.EventNames.Message,
              params: {
                channel: __privateGet(this, _properties).channel,
                data: realm.cdpToBidiValue(
                  message,
                  __privateGet(this, _properties).ownership ?? "none"
                  /* Script.ResultOwnership.None */
                ),
                source: realm.source
              }
            }, browsingContext.id);
          }
        } catch (error) {
          (_a3 = __privateGet(this, _logger)) == null ? void 0 : _a3.call(this, log_js_1.LogType.debugError, error);
          break;
        }
      }
    };
    _getHandleFromWindow = new WeakSet();
    getHandleFromWindow_fn = async function(realm) {
      const channelHandleResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
        functionDeclaration: String((id) => {
          const w = window;
          if (w[id] === void 0) {
            return new Promise((resolve) => w[id] = resolve);
          }
          const channelProxy = w[id];
          delete w[id];
          return channelProxy;
        }),
        arguments: [{ value: __privateGet(this, _id) }],
        executionContextId: realm.executionContextId,
        awaitPromise: true,
        serializationOptions: {
          serialization: "idOnly"
        }
      });
      if (channelHandleResult.exceptionDetails !== void 0 || channelHandleResult.result.objectId === void 0) {
        throw new Error(`ChannelHandle not found in window["${__privateGet(this, _id)}"]`);
      }
      return channelHandleResult.result.objectId;
    };
    /**
     * Evaluation string which creates a ChannelProxy object on the client side.
     */
    __privateAdd(ChannelProxy, _createChannelProxyEvalStr);
    /** Creates a ChannelProxy in the given realm. */
    __privateAdd(ChannelProxy, _createAndGetHandleInRealm);
    /** Gets a handle to `sendMessage` delegate from the ChannelProxy handle. */
    __privateAdd(ChannelProxy, _createSendMessageHandle);
    exports.ChannelProxy = ChannelProxy;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/PreloadScript.js
var require_PreloadScript = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/PreloadScript.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PreloadScript = void 0;
    var uuid_js_1 = require_uuid();
    var ChannelProxy_js_1 = require_ChannelProxy();
    var PreloadScript = class {
      /** BiDi ID, an automatically generated UUID. */
      #id = (0, uuid_js_1.uuidv4)();
      /** CDP preload scripts. */
      #cdpPreloadScripts = [];
      /** The script itself, in a format expected by the spec i.e. a function. */
      #functionDeclaration;
      /** Targets, in which the preload script is initialized. */
      #targetIds = /* @__PURE__ */ new Set();
      /** Channels to be added as arguments to functionDeclaration. */
      #channels;
      /** The script sandbox / world name. */
      #sandbox;
      /** The browsing contexts to execute the preload scripts in, if any. */
      #contexts;
      get id() {
        return this.#id;
      }
      get targetIds() {
        return this.#targetIds;
      }
      constructor(params, logger) {
        this.#channels = params.arguments?.map((a) => new ChannelProxy_js_1.ChannelProxy(a.value, logger)) ?? [];
        this.#functionDeclaration = params.functionDeclaration;
        this.#sandbox = params.sandbox;
        this.#contexts = params.contexts;
      }
      /** Channels of the preload script. */
      get channels() {
        return this.#channels;
      }
      /** Contexts of the preload script, if any */
      get contexts() {
        return this.#contexts;
      }
      /**
       * String to be evaluated. Wraps user-provided function so that the following
       * steps are run:
       * 1. Create channels.
       * 2. Store the created channels in window.
       * 3. Call the user-provided function with channels as arguments.
       */
      #getEvaluateString() {
        const channelsArgStr = `[${this.channels.map((c) => c.getEvalInWindowStr()).join(", ")}]`;
        return `(()=>{(${this.#functionDeclaration})(...${channelsArgStr})})()`;
      }
      /**
       * Adds the script to the given CDP targets by calling the
       * `Page.addScriptToEvaluateOnNewDocument` command.
       */
      async initInTargets(cdpTargets, runImmediately) {
        await Promise.all(Array.from(cdpTargets).map((cdpTarget) => this.initInTarget(cdpTarget, runImmediately)));
      }
      /**
       * Adds the script to the given CDP target by calling the
       * `Page.addScriptToEvaluateOnNewDocument` command.
       */
      async initInTarget(cdpTarget, runImmediately) {
        const addCdpPreloadScriptResult = await cdpTarget.cdpClient.sendCommand("Page.addScriptToEvaluateOnNewDocument", {
          source: this.#getEvaluateString(),
          worldName: this.#sandbox,
          runImmediately
        });
        this.#cdpPreloadScripts.push({
          target: cdpTarget,
          preloadScriptId: addCdpPreloadScriptResult.identifier
        });
        this.#targetIds.add(cdpTarget.id);
      }
      /**
       * Removes this script from all CDP targets.
       */
      async remove() {
        await Promise.all([
          this.#cdpPreloadScripts.map(async (cdpPreloadScript) => {
            const cdpTarget = cdpPreloadScript.target;
            const cdpPreloadScriptId = cdpPreloadScript.preloadScriptId;
            return await cdpTarget.cdpClient.sendCommand("Page.removeScriptToEvaluateOnNewDocument", {
              identifier: cdpPreloadScriptId
            });
          })
        ]);
      }
      /** Removes the provided cdp target from the list of cdp preload scripts. */
      dispose(cdpTargetId) {
        this.#cdpPreloadScripts = this.#cdpPreloadScripts.filter((cdpPreloadScript) => cdpPreloadScript.target?.id !== cdpTargetId);
        this.#targetIds.delete(cdpTargetId);
      }
    };
    exports.PreloadScript = PreloadScript;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/ScriptProcessor.js
var require_ScriptProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/ScriptProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScriptProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var PreloadScript_js_1 = require_PreloadScript();
    var ScriptProcessor = class {
      #eventManager;
      #browsingContextStorage;
      #realmStorage;
      #preloadScriptStorage;
      #logger;
      constructor(eventManager, browsingContextStorage, realmStorage, preloadScriptStorage, logger) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#realmStorage = realmStorage;
        this.#preloadScriptStorage = preloadScriptStorage;
        this.#logger = logger;
        this.#eventManager = eventManager;
        this.#eventManager.addSubscribeHook(protocol_js_1.ChromiumBidi.Script.EventNames.RealmCreated, this.#onRealmCreatedSubscribeHook.bind(this));
      }
      #onRealmCreatedSubscribeHook(contextId) {
        const context = this.#browsingContextStorage.getContext(contextId);
        const contextsToReport = [
          context,
          ...this.#browsingContextStorage.getContext(contextId).allChildren
        ];
        const realms = /* @__PURE__ */ new Set();
        for (const reportContext of contextsToReport) {
          const realmsForContext = this.#realmStorage.findRealms({
            browsingContextId: reportContext.id
          });
          for (const realm of realmsForContext) {
            realms.add(realm);
          }
        }
        for (const realm of realms) {
          this.#eventManager.registerEvent({
            type: "event",
            method: protocol_js_1.ChromiumBidi.Script.EventNames.RealmCreated,
            params: realm.realmInfo
          }, context.id);
        }
        return Promise.resolve();
      }
      async addPreloadScript(params) {
        const contexts = this.#browsingContextStorage.verifyTopLevelContextsList(params.contexts);
        const preloadScript = new PreloadScript_js_1.PreloadScript(params, this.#logger);
        this.#preloadScriptStorage.add(preloadScript);
        const cdpTargets = contexts.size === 0 ? new Set(this.#browsingContextStorage.getTopLevelContexts().map((context) => context.cdpTarget)) : new Set([...contexts.values()].map((context) => context.cdpTarget));
        await preloadScript.initInTargets(cdpTargets, false);
        return {
          script: preloadScript.id
        };
      }
      async removePreloadScript(params) {
        const { script: id } = params;
        const scripts = this.#preloadScriptStorage.find({ id });
        if (scripts.length === 0) {
          throw new protocol_js_1.NoSuchScriptException(`No preload script with id '${id}'`);
        }
        await Promise.all(scripts.map((script) => script.remove()));
        this.#preloadScriptStorage.remove({ id });
        return {};
      }
      async callFunction(params) {
        const realm = await this.#getRealm(params.target);
        return await realm.callFunction(params.functionDeclaration, params.awaitPromise, params.this, params.arguments, params.resultOwnership, params.serializationOptions, params.userActivation);
      }
      async evaluate(params) {
        const realm = await this.#getRealm(params.target);
        return await realm.evaluate(params.expression, params.awaitPromise, params.resultOwnership, params.serializationOptions, params.userActivation);
      }
      async disown(params) {
        const realm = await this.#getRealm(params.target);
        await Promise.all(params.handles.map(async (handle) => await realm.disown(handle)));
        return {};
      }
      getRealms(params) {
        if (params.context !== void 0) {
          this.#browsingContextStorage.getContext(params.context);
        }
        const realms = this.#realmStorage.findRealms({
          browsingContextId: params.context,
          type: params.type
        }).map((realm) => realm.realmInfo);
        return { realms };
      }
      async #getRealm(target) {
        if ("context" in target) {
          const context = this.#browsingContextStorage.getContext(target.context);
          return await context.getOrCreateSandbox(target.sandbox);
        }
        return this.#realmStorage.getRealm({
          realmId: target.realm
        });
      }
    };
    exports.ScriptProcessor = ScriptProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/SessionProcessor.js
var require_SessionProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/SessionProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SessionProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var SessionProcessor = class {
      #eventManager;
      #browserCdpClient;
      #initConnection;
      #created = false;
      constructor(eventManager, browserCdpClient, initConnection) {
        this.#eventManager = eventManager;
        this.#browserCdpClient = browserCdpClient;
        this.#initConnection = initConnection;
      }
      status() {
        return { ready: false, message: "already connected" };
      }
      #mergeCapabilities(capabilitiesRequest) {
        const mergedCapabilities = [];
        for (const first2 of capabilitiesRequest.firstMatch ?? [{}]) {
          const result = {
            ...capabilitiesRequest.alwaysMatch
          };
          for (const key of Object.keys(first2)) {
            if (result[key] !== void 0) {
              throw new protocol_js_1.InvalidArgumentException(`Capability ${key} in firstMatch is already defined in alwaysMatch`);
            }
            result[key] = first2[key];
          }
          mergedCapabilities.push(result);
        }
        const match = mergedCapabilities.find((c) => c.browserName === "chrome") ?? mergedCapabilities[0] ?? {};
        match.unhandledPromptBehavior = this.#getUnhandledPromptBehavior(match.unhandledPromptBehavior);
        return match;
      }
      #getUnhandledPromptBehavior(capabilityValue) {
        if (capabilityValue === void 0) {
          return void 0;
        }
        if (typeof capabilityValue === "object") {
          return capabilityValue;
        }
        if (typeof capabilityValue !== "string") {
          throw new protocol_js_1.InvalidArgumentException(`Unexpected 'unhandledPromptBehavior' type: ${typeof capabilityValue}`);
        }
        switch (capabilityValue) {
          case "accept":
          case "accept and notify":
            return {
              default: "accept"
              /* Session.UserPromptHandlerType.Accept */
            };
          case "dismiss":
          case "dismiss and notify":
            return {
              default: "dismiss"
              /* Session.UserPromptHandlerType.Dismiss */
            };
          case "ignore":
            return {
              default: "ignore"
              /* Session.UserPromptHandlerType.Ignore */
            };
          default:
            throw new protocol_js_1.InvalidArgumentException(`Unexpected 'unhandledPromptBehavior' value: ${capabilityValue}`);
        }
      }
      async new(params) {
        if (this.#created) {
          throw new Error("Session has been already created.");
        }
        this.#created = true;
        const matchedCapabitlites = this.#mergeCapabilities(params.capabilities);
        await this.#initConnection(matchedCapabitlites);
        const version = await this.#browserCdpClient.sendCommand("Browser.getVersion");
        return {
          sessionId: "unknown",
          capabilities: {
            ...matchedCapabitlites,
            acceptInsecureCerts: matchedCapabitlites.acceptInsecureCerts ?? false,
            browserName: version.product,
            browserVersion: version.revision,
            platformName: "",
            setWindowRect: false,
            webSocketUrl: "",
            userAgent: version.userAgent
          }
        };
      }
      async subscribe(params, channel = null) {
        await this.#eventManager.subscribe(params.events, params.contexts ?? [null], channel);
        return {};
      }
      async unsubscribe(params, channel = null) {
        await this.#eventManager.unsubscribe(params.events, params.contexts ?? [null], channel);
        return {};
      }
    };
    exports.SessionProcessor = SessionProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/Base64.js
var require_Base64 = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/Base64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.base64ToString = base64ToString;
    function base64ToString(base64Str) {
      if ("atob" in globalThis) {
        return globalThis.atob(base64Str);
      }
      return Buffer.from(base64Str, "base64").toString("ascii");
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkUtils.js
var require_NetworkUtils = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.computeHeadersSize = computeHeadersSize;
    exports.bidiNetworkHeadersFromCdpNetworkHeaders = bidiNetworkHeadersFromCdpNetworkHeaders;
    exports.bidiNetworkHeadersFromCdpNetworkHeadersEntries = bidiNetworkHeadersFromCdpNetworkHeadersEntries;
    exports.cdpNetworkHeadersFromBidiNetworkHeaders = cdpNetworkHeadersFromBidiNetworkHeaders;
    exports.bidiNetworkHeadersFromCdpFetchHeaders = bidiNetworkHeadersFromCdpFetchHeaders;
    exports.cdpFetchHeadersFromBidiNetworkHeaders = cdpFetchHeadersFromBidiNetworkHeaders;
    exports.networkHeaderFromCookieHeaders = networkHeaderFromCookieHeaders;
    exports.cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction = cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction;
    exports.cdpToBiDiCookie = cdpToBiDiCookie;
    exports.deserializeByteValue = deserializeByteValue;
    exports.bidiToCdpCookie = bidiToCdpCookie;
    exports.sameSiteBiDiToCdp = sameSiteBiDiToCdp;
    exports.isSpecialScheme = isSpecialScheme;
    exports.matchUrlPattern = matchUrlPattern;
    exports.bidiBodySizeFromCdpPostDataEntries = bidiBodySizeFromCdpPostDataEntries;
    exports.getTiming = getTiming;
    var ErrorResponse_js_1 = require_ErrorResponse();
    var Base64_js_1 = require_Base64();
    var UrlPattern_js_1 = require_UrlPattern();
    function computeHeadersSize(headers) {
      const requestHeaders = headers.reduce((acc, header) => {
        return `${acc}${header.name}: ${header.value.value}\r
`;
      }, "");
      return new TextEncoder().encode(requestHeaders).length;
    }
    function bidiNetworkHeadersFromCdpNetworkHeaders(headers) {
      if (!headers) {
        return [];
      }
      return Object.entries(headers).map(([name, value]) => ({
        name,
        value: {
          type: "string",
          value
        }
      }));
    }
    function bidiNetworkHeadersFromCdpNetworkHeadersEntries(headers) {
      if (!headers) {
        return [];
      }
      return headers.map(({ name, value }) => ({
        name,
        value: {
          type: "string",
          value
        }
      }));
    }
    function cdpNetworkHeadersFromBidiNetworkHeaders(headers) {
      if (headers === void 0) {
        return void 0;
      }
      return headers.reduce((result, header) => {
        result[header.name] = header.value.value;
        return result;
      }, {});
    }
    function bidiNetworkHeadersFromCdpFetchHeaders(headers) {
      if (!headers) {
        return [];
      }
      return headers.map(({ name, value }) => ({
        name,
        value: {
          type: "string",
          value
        }
      }));
    }
    function cdpFetchHeadersFromBidiNetworkHeaders(headers) {
      if (headers === void 0) {
        return void 0;
      }
      return headers.map(({ name, value }) => ({
        name,
        value: value.value
      }));
    }
    function networkHeaderFromCookieHeaders(headers) {
      if (headers === void 0) {
        return void 0;
      }
      const value = headers.reduce((acc, value2, index) => {
        if (index > 0) {
          acc += ";";
        }
        const cookieValue = value2.value.type === "base64" ? btoa(value2.value.value) : value2.value.value;
        acc += `${value2.name}=${cookieValue}`;
        return acc;
      }, "");
      return {
        name: "Cookie",
        value: {
          type: "string",
          value
        }
      };
    }
    function cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction(action) {
      switch (action) {
        case "default":
          return "Default";
        case "cancel":
          return "CancelAuth";
        case "provideCredentials":
          return "ProvideCredentials";
      }
    }
    function cdpToBiDiCookie(cookie) {
      const result = {
        name: cookie.name,
        value: { type: "string", value: cookie.value },
        domain: cookie.domain,
        path: cookie.path,
        size: cookie.size,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite === void 0 ? "none" : sameSiteCdpToBiDi(cookie.sameSite),
        ...cookie.expires >= 0 ? { expiry: cookie.expires } : void 0
      };
      result[`goog:session`] = cookie.session;
      result[`goog:priority`] = cookie.priority;
      result[`goog:sameParty`] = cookie.sameParty;
      result[`goog:sourceScheme`] = cookie.sourceScheme;
      result[`goog:sourcePort`] = cookie.sourcePort;
      if (cookie.partitionKey !== void 0) {
        result[`goog:partitionKey`] = cookie.partitionKey;
      }
      if (cookie.partitionKeyOpaque !== void 0) {
        result[`goog:partitionKeyOpaque`] = cookie.partitionKeyOpaque;
      }
      return result;
    }
    function deserializeByteValue(value) {
      if (value.type === "base64") {
        return (0, Base64_js_1.base64ToString)(value.value);
      }
      return value.value;
    }
    function bidiToCdpCookie(params, partitionKey) {
      const deserializedValue = deserializeByteValue(params.cookie.value);
      const result = {
        name: params.cookie.name,
        value: deserializedValue,
        domain: params.cookie.domain,
        path: params.cookie.path ?? "/",
        secure: params.cookie.secure ?? false,
        httpOnly: params.cookie.httpOnly ?? false,
        ...partitionKey.sourceOrigin !== void 0 && {
          partitionKey: {
            hasCrossSiteAncestor: false,
            // CDP's `partitionKey.topLevelSite` is the BiDi's `partition.sourceOrigin`.
            topLevelSite: partitionKey.sourceOrigin
          }
        },
        ...params.cookie.expiry !== void 0 && {
          expires: params.cookie.expiry
        },
        ...params.cookie.sameSite !== void 0 && {
          sameSite: sameSiteBiDiToCdp(params.cookie.sameSite)
        }
      };
      if (params.cookie[`goog:url`] !== void 0) {
        result.url = params.cookie[`goog:url`];
      }
      if (params.cookie[`goog:priority`] !== void 0) {
        result.priority = params.cookie[`goog:priority`];
      }
      if (params.cookie[`goog:sameParty`] !== void 0) {
        result.sameParty = params.cookie[`goog:sameParty`];
      }
      if (params.cookie[`goog:sourceScheme`] !== void 0) {
        result.sourceScheme = params.cookie[`goog:sourceScheme`];
      }
      if (params.cookie[`goog:sourcePort`] !== void 0) {
        result.sourcePort = params.cookie[`goog:sourcePort`];
      }
      return result;
    }
    function sameSiteCdpToBiDi(sameSite) {
      switch (sameSite) {
        case "Strict":
          return "strict";
        case "None":
          return "none";
        case "Lax":
          return "lax";
        default:
          return "lax";
      }
    }
    function sameSiteBiDiToCdp(sameSite) {
      switch (sameSite) {
        case "strict":
          return "Strict";
        case "lax":
          return "Lax";
        case "none":
          return "None";
      }
      throw new ErrorResponse_js_1.InvalidArgumentException(`Unknown 'sameSite' value ${sameSite}`);
    }
    function isSpecialScheme(protocol) {
      return ["ftp", "file", "http", "https", "ws", "wss"].includes(protocol.replace(/:$/, ""));
    }
    function matchUrlPattern(urlPattern, url) {
      switch (urlPattern.type) {
        case "string": {
          const pattern = new UrlPattern_js_1.URLPattern(urlPattern.pattern);
          return new UrlPattern_js_1.URLPattern({
            protocol: pattern.protocol,
            hostname: pattern.hostname,
            port: pattern.port,
            pathname: pattern.pathname,
            search: pattern.search
          }).test(url);
        }
        case "pattern":
          return new UrlPattern_js_1.URLPattern(urlPattern).test(url);
      }
    }
    function bidiBodySizeFromCdpPostDataEntries(entries) {
      let size = 0;
      for (const entry of entries) {
        size += atob(entry.bytes ?? "").length;
      }
      return size;
    }
    function getTiming(timing) {
      if (!timing) {
        return 0;
      }
      if (timing < 0) {
        return 0;
      }
      return timing;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/storage/StorageProcessor.js
var require_StorageProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/storage/StorageProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var assert_js_1 = require_assert();
    var log_js_1 = require_log();
    var NetworkProcessor_js_1 = require_NetworkProcessor();
    var NetworkUtils_js_1 = require_NetworkUtils();
    var StorageProcessor = class {
      #browserCdpClient;
      #browsingContextStorage;
      #logger;
      constructor(browserCdpClient, browsingContextStorage, logger) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#browserCdpClient = browserCdpClient;
        this.#logger = logger;
      }
      async deleteCookies(params) {
        const partitionKey = this.#expandStoragePartitionSpec(params.partition);
        let cdpResponse;
        try {
          cdpResponse = await this.#browserCdpClient.sendCommand("Storage.getCookies", {
            browserContextId: this.#getCdpBrowserContextId(partitionKey)
          });
        } catch (err) {
          if (this.#isNoSuchUserContextError(err)) {
            throw new protocol_js_1.NoSuchUserContextException(err.message);
          }
          throw err;
        }
        const cdpCookiesToDelete = cdpResponse.cookies.filter(
          // CDP's partition key is the source origin. If the request specifies the
          // `sourceOrigin` partition key, only cookies with the requested source origin
          // are returned.
          (c) => partitionKey.sourceOrigin === void 0 || c.partitionKey?.topLevelSite === partitionKey.sourceOrigin
        ).filter((cdpCookie) => {
          const bidiCookie = (0, NetworkUtils_js_1.cdpToBiDiCookie)(cdpCookie);
          return this.#matchCookie(bidiCookie, params.filter);
        }).map((cookie) => ({
          ...cookie,
          // Set expiry to pass date to delete the cookie.
          expires: 1
        }));
        await this.#browserCdpClient.sendCommand("Storage.setCookies", {
          cookies: cdpCookiesToDelete,
          browserContextId: this.#getCdpBrowserContextId(partitionKey)
        });
        return {
          partitionKey
        };
      }
      async getCookies(params) {
        const partitionKey = this.#expandStoragePartitionSpec(params.partition);
        let cdpResponse;
        try {
          cdpResponse = await this.#browserCdpClient.sendCommand("Storage.getCookies", {
            browserContextId: this.#getCdpBrowserContextId(partitionKey)
          });
        } catch (err) {
          if (this.#isNoSuchUserContextError(err)) {
            throw new protocol_js_1.NoSuchUserContextException(err.message);
          }
          throw err;
        }
        const filteredBiDiCookies = cdpResponse.cookies.filter(
          // CDP's partition key is the source origin. If the request specifies the
          // `sourceOrigin` partition key, only cookies with the requested source origin
          // are returned.
          (c) => partitionKey.sourceOrigin === void 0 || c.partitionKey?.topLevelSite === partitionKey.sourceOrigin
        ).map((c) => (0, NetworkUtils_js_1.cdpToBiDiCookie)(c)).filter((c) => this.#matchCookie(c, params.filter));
        return {
          cookies: filteredBiDiCookies,
          partitionKey
        };
      }
      async setCookie(params) {
        const partitionKey = this.#expandStoragePartitionSpec(params.partition);
        const cdpCookie = (0, NetworkUtils_js_1.bidiToCdpCookie)(params, partitionKey);
        try {
          await this.#browserCdpClient.sendCommand("Storage.setCookies", {
            cookies: [cdpCookie],
            browserContextId: this.#getCdpBrowserContextId(partitionKey)
          });
        } catch (err) {
          if (this.#isNoSuchUserContextError(err)) {
            throw new protocol_js_1.NoSuchUserContextException(err.message);
          }
          this.#logger?.(log_js_1.LogType.debugError, err);
          throw new protocol_js_1.UnableToSetCookieException(err.toString());
        }
        return {
          partitionKey
        };
      }
      #isNoSuchUserContextError(err) {
        return err.message?.startsWith("Failed to find browser context for id");
      }
      #getCdpBrowserContextId(partitionKey) {
        return partitionKey.userContext === "default" ? void 0 : partitionKey.userContext;
      }
      #expandStoragePartitionSpecByBrowsingContext(descriptor) {
        const browsingContextId = descriptor.context;
        const browsingContext = this.#browsingContextStorage.getContext(browsingContextId);
        return {
          userContext: browsingContext.userContext
        };
      }
      #expandStoragePartitionSpecByStorageKey(descriptor) {
        const unsupportedPartitionKeys = /* @__PURE__ */ new Map();
        let sourceOrigin = descriptor.sourceOrigin;
        if (sourceOrigin !== void 0) {
          const url = NetworkProcessor_js_1.NetworkProcessor.parseUrlString(sourceOrigin);
          if (url.origin === "null") {
            sourceOrigin = url.origin;
          } else {
            sourceOrigin = `${url.protocol}//${url.hostname}`;
          }
        }
        for (const [key, value] of Object.entries(descriptor)) {
          if (key !== void 0 && value !== void 0 && !["type", "sourceOrigin", "userContext"].includes(key)) {
            unsupportedPartitionKeys.set(key, value);
          }
        }
        if (unsupportedPartitionKeys.size > 0) {
          this.#logger?.(log_js_1.LogType.debugInfo, `Unsupported partition keys: ${JSON.stringify(Object.fromEntries(unsupportedPartitionKeys))}`);
        }
        const userContext = descriptor.userContext ?? "default";
        return {
          userContext,
          ...sourceOrigin === void 0 ? {} : { sourceOrigin }
        };
      }
      #expandStoragePartitionSpec(partitionSpec) {
        if (partitionSpec === void 0) {
          return { userContext: "default" };
        }
        if (partitionSpec.type === "context") {
          return this.#expandStoragePartitionSpecByBrowsingContext(partitionSpec);
        }
        (0, assert_js_1.assert)(partitionSpec.type === "storageKey", "Unknown partition type");
        return this.#expandStoragePartitionSpecByStorageKey(partitionSpec);
      }
      #matchCookie(cookie, filter2) {
        if (filter2 === void 0) {
          return true;
        }
        return (filter2.domain === void 0 || filter2.domain === cookie.domain) && (filter2.name === void 0 || filter2.name === cookie.name) && // `value` contains fields `type` and `value`.
        (filter2.value === void 0 || (0, NetworkUtils_js_1.deserializeByteValue)(filter2.value) === (0, NetworkUtils_js_1.deserializeByteValue)(cookie.value)) && (filter2.path === void 0 || filter2.path === cookie.path) && (filter2.size === void 0 || filter2.size === cookie.size) && (filter2.httpOnly === void 0 || filter2.httpOnly === cookie.httpOnly) && (filter2.secure === void 0 || filter2.secure === cookie.secure) && (filter2.sameSite === void 0 || filter2.sameSite === cookie.sameSite) && (filter2.expiry === void 0 || filter2.expiry === cookie.expiry);
      }
    };
    exports.StorageProcessor = StorageProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/OutgoingMessage.js
var require_OutgoingMessage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/OutgoingMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OutgoingMessage = void 0;
    var OutgoingMessage = class {
      #message;
      #channel;
      constructor(message, channel = null) {
        this.#message = message;
        this.#channel = channel;
      }
      static createFromPromise(messagePromise, channel) {
        return messagePromise.then((message) => {
          if (message.kind === "success") {
            return {
              kind: "success",
              value: new OutgoingMessage(message.value, channel)
            };
          }
          return message;
        });
      }
      static createResolved(message, channel) {
        return Promise.resolve({
          kind: "success",
          value: new OutgoingMessage(message, channel)
        });
      }
      get message() {
        return this.#message;
      }
      get channel() {
        return this.#channel;
      }
    };
    exports.OutgoingMessage = OutgoingMessage;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/CommandProcessor.js
var require_CommandProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/CommandProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandProcessor = void 0;
    var protocol_js_1 = require_protocol();
    var EventEmitter_js_1 = require_EventEmitter();
    var log_js_1 = require_log();
    var BidiNoOpParser_js_1 = require_BidiNoOpParser();
    var BrowserProcessor_js_1 = require_BrowserProcessor();
    var CdpProcessor_js_1 = require_CdpProcessor();
    var BrowsingContextProcessor_js_1 = require_BrowsingContextProcessor();
    var InputProcessor_js_1 = require_InputProcessor();
    var NetworkProcessor_js_1 = require_NetworkProcessor();
    var PermissionsProcessor_js_1 = require_PermissionsProcessor();
    var ScriptProcessor_js_1 = require_ScriptProcessor();
    var SessionProcessor_js_1 = require_SessionProcessor();
    var StorageProcessor_js_1 = require_StorageProcessor();
    var OutgoingMessage_js_1 = require_OutgoingMessage();
    var CommandProcessor = class extends EventEmitter_js_1.EventEmitter {
      // keep-sorted start
      #bluetoothProcessor;
      #browserProcessor;
      #browsingContextProcessor;
      #cdpProcessor;
      #inputProcessor;
      #networkProcessor;
      #permissionsProcessor;
      #scriptProcessor;
      #sessionProcessor;
      #storageProcessor;
      // keep-sorted end
      #parser;
      #logger;
      constructor(cdpConnection, browserCdpClient, eventManager, browsingContextStorage, realmStorage, preloadScriptStorage, networkStorage, bluetoothProcessor, parser = new BidiNoOpParser_js_1.BidiNoOpParser(), initConnection, logger) {
        super();
        this.#parser = parser;
        this.#logger = logger;
        this.#bluetoothProcessor = bluetoothProcessor;
        this.#browserProcessor = new BrowserProcessor_js_1.BrowserProcessor(browserCdpClient);
        this.#browsingContextProcessor = new BrowsingContextProcessor_js_1.BrowsingContextProcessor(browserCdpClient, browsingContextStorage, eventManager);
        this.#cdpProcessor = new CdpProcessor_js_1.CdpProcessor(browsingContextStorage, realmStorage, cdpConnection, browserCdpClient);
        this.#inputProcessor = new InputProcessor_js_1.InputProcessor(browsingContextStorage);
        this.#networkProcessor = new NetworkProcessor_js_1.NetworkProcessor(browsingContextStorage, networkStorage);
        this.#permissionsProcessor = new PermissionsProcessor_js_1.PermissionsProcessor(browserCdpClient);
        this.#scriptProcessor = new ScriptProcessor_js_1.ScriptProcessor(eventManager, browsingContextStorage, realmStorage, preloadScriptStorage, logger);
        this.#sessionProcessor = new SessionProcessor_js_1.SessionProcessor(eventManager, browserCdpClient, initConnection);
        this.#storageProcessor = new StorageProcessor_js_1.StorageProcessor(browserCdpClient, browsingContextStorage, logger);
      }
      async #processCommand(command) {
        switch (command.method) {
          case "session.end":
            break;
          case "bluetooth.handleRequestDevicePrompt":
            return await this.#bluetoothProcessor.handleRequestDevicePrompt(this.#parser.parseHandleRequestDevicePromptParams(command.params));
          case "browser.close":
            return this.#browserProcessor.close();
          case "browser.createUserContext":
            return await this.#browserProcessor.createUserContext(command.params);
          case "browser.getClientWindows":
            throw new protocol_js_1.UnknownErrorException(`Method ${command.method} is not implemented.`);
          case "browser.getUserContexts":
            return await this.#browserProcessor.getUserContexts();
          case "browser.removeUserContext":
            return await this.#browserProcessor.removeUserContext(this.#parser.parseRemoveUserContextParams(command.params));
          case "browser.setClientWindowState":
            throw new protocol_js_1.UnknownErrorException(`Method ${command.method} is not implemented.`);
          case "browsingContext.activate":
            return await this.#browsingContextProcessor.activate(this.#parser.parseActivateParams(command.params));
          case "browsingContext.captureScreenshot":
            return await this.#browsingContextProcessor.captureScreenshot(this.#parser.parseCaptureScreenshotParams(command.params));
          case "browsingContext.close":
            return await this.#browsingContextProcessor.close(this.#parser.parseCloseParams(command.params));
          case "browsingContext.create":
            return await this.#browsingContextProcessor.create(this.#parser.parseCreateParams(command.params));
          case "browsingContext.getTree":
            return this.#browsingContextProcessor.getTree(this.#parser.parseGetTreeParams(command.params));
          case "browsingContext.handleUserPrompt":
            return await this.#browsingContextProcessor.handleUserPrompt(this.#parser.parseHandleUserPromptParams(command.params));
          case "browsingContext.locateNodes":
            return await this.#browsingContextProcessor.locateNodes(this.#parser.parseLocateNodesParams(command.params));
          case "browsingContext.navigate":
            return await this.#browsingContextProcessor.navigate(this.#parser.parseNavigateParams(command.params));
          case "browsingContext.print":
            return await this.#browsingContextProcessor.print(this.#parser.parsePrintParams(command.params));
          case "browsingContext.reload":
            return await this.#browsingContextProcessor.reload(this.#parser.parseReloadParams(command.params));
          case "browsingContext.setViewport":
            return await this.#browsingContextProcessor.setViewport(this.#parser.parseSetViewportParams(command.params));
          case "browsingContext.traverseHistory":
            return await this.#browsingContextProcessor.traverseHistory(this.#parser.parseTraverseHistoryParams(command.params));
          case "cdp.getSession":
            return this.#cdpProcessor.getSession(this.#parser.parseGetSessionParams(command.params));
          case "cdp.resolveRealm":
            return this.#cdpProcessor.resolveRealm(this.#parser.parseResolveRealmParams(command.params));
          case "cdp.sendCommand":
            return await this.#cdpProcessor.sendCommand(this.#parser.parseSendCommandParams(command.params));
          case "input.performActions":
            return await this.#inputProcessor.performActions(this.#parser.parsePerformActionsParams(command.params));
          case "input.releaseActions":
            return await this.#inputProcessor.releaseActions(this.#parser.parseReleaseActionsParams(command.params));
          case "input.setFiles":
            return await this.#inputProcessor.setFiles(this.#parser.parseSetFilesParams(command.params));
          case "network.addIntercept":
            return await this.#networkProcessor.addIntercept(this.#parser.parseAddInterceptParams(command.params));
          case "network.continueRequest":
            return await this.#networkProcessor.continueRequest(this.#parser.parseContinueRequestParams(command.params));
          case "network.continueResponse":
            return await this.#networkProcessor.continueResponse(this.#parser.parseContinueResponseParams(command.params));
          case "network.continueWithAuth":
            return await this.#networkProcessor.continueWithAuth(this.#parser.parseContinueWithAuthParams(command.params));
          case "network.failRequest":
            return await this.#networkProcessor.failRequest(this.#parser.parseFailRequestParams(command.params));
          case "network.provideResponse":
            return await this.#networkProcessor.provideResponse(this.#parser.parseProvideResponseParams(command.params));
          case "network.removeIntercept":
            return await this.#networkProcessor.removeIntercept(this.#parser.parseRemoveInterceptParams(command.params));
          case "network.setCacheBehavior":
            return await this.#networkProcessor.setCacheBehavior(this.#parser.parseSetCacheBehavior(command.params));
          case "permissions.setPermission":
            return await this.#permissionsProcessor.setPermissions(this.#parser.parseSetPermissionsParams(command.params));
          case "script.addPreloadScript":
            return await this.#scriptProcessor.addPreloadScript(this.#parser.parseAddPreloadScriptParams(command.params));
          case "script.callFunction":
            return await this.#scriptProcessor.callFunction(this.#parser.parseCallFunctionParams(this.#processTargetParams(command.params)));
          case "script.disown":
            return await this.#scriptProcessor.disown(this.#parser.parseDisownParams(this.#processTargetParams(command.params)));
          case "script.evaluate":
            return await this.#scriptProcessor.evaluate(this.#parser.parseEvaluateParams(this.#processTargetParams(command.params)));
          case "script.getRealms":
            return this.#scriptProcessor.getRealms(this.#parser.parseGetRealmsParams(command.params));
          case "script.removePreloadScript":
            return await this.#scriptProcessor.removePreloadScript(this.#parser.parseRemovePreloadScriptParams(command.params));
          case "session.new":
            return await this.#sessionProcessor.new(command.params);
          case "session.status":
            return this.#sessionProcessor.status();
          case "session.subscribe":
            return await this.#sessionProcessor.subscribe(this.#parser.parseSubscribeParams(command.params), command.channel);
          case "session.unsubscribe":
            return await this.#sessionProcessor.unsubscribe(this.#parser.parseSubscribeParams(command.params), command.channel);
          case "storage.deleteCookies":
            return await this.#storageProcessor.deleteCookies(this.#parser.parseDeleteCookiesParams(command.params));
          case "storage.getCookies":
            return await this.#storageProcessor.getCookies(this.#parser.parseGetCookiesParams(command.params));
          case "storage.setCookie":
            return await this.#storageProcessor.setCookie(this.#parser.parseSetCookieParams(command.params));
        }
        throw new protocol_js_1.UnknownCommandException(`Unknown command '${command.method}'.`);
      }
      // Workaround for as zod.union always take the first schema
      // https://github.com/w3c/webdriver-bidi/issues/635
      #processTargetParams(params) {
        if (typeof params === "object" && params && "target" in params && typeof params.target === "object" && params.target && "context" in params.target) {
          delete params.target["realm"];
        }
        return params;
      }
      async processCommand(command) {
        try {
          const result = await this.#processCommand(command);
          const response = {
            type: "success",
            id: command.id,
            result
          };
          this.emit("response", {
            message: OutgoingMessage_js_1.OutgoingMessage.createResolved(response, command.channel),
            event: command.method
          });
        } catch (e) {
          if (e instanceof protocol_js_1.Exception) {
            this.emit("response", {
              message: OutgoingMessage_js_1.OutgoingMessage.createResolved(e.toErrorResponse(command.id), command.channel),
              event: command.method
            });
          } else {
            const error = e;
            this.#logger?.(log_js_1.LogType.bidi, error);
            this.emit("response", {
              message: OutgoingMessage_js_1.OutgoingMessage.createResolved(new protocol_js_1.UnknownErrorException(error.message, error.stack).toErrorResponse(command.id), command.channel),
              event: command.method
            });
          }
        }
      }
    };
    exports.CommandProcessor = CommandProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/bluetooth/BluetoothProcessor.js
var require_BluetoothProcessor = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/bluetooth/BluetoothProcessor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BluetoothProcessor = void 0;
    var BluetoothProcessor = class {
      #eventManager;
      #browsingContextStorage;
      constructor(eventManager, browsingContextStorage) {
        this.#eventManager = eventManager;
        this.#browsingContextStorage = browsingContextStorage;
      }
      onCdpTargetCreated(cdpTarget) {
        cdpTarget.cdpClient.on("DeviceAccess.deviceRequestPrompted", (event) => {
          this.#eventManager.registerEvent({
            type: "event",
            method: "bluetooth.requestDevicePromptUpdated",
            params: {
              context: cdpTarget.id,
              prompt: event.id,
              devices: event.devices
            }
          }, cdpTarget.id);
        });
      }
      async handleRequestDevicePrompt(params) {
        const context = this.#browsingContextStorage.getContext(params.context);
        if (params.accept) {
          await context.cdpTarget.cdpClient.sendCommand("DeviceAccess.selectPrompt", {
            id: params.prompt,
            deviceId: params.device
          });
        } else {
          await context.cdpTarget.cdpClient.sendCommand("DeviceAccess.cancelPrompt", {
            id: params.prompt
          });
        }
        return {};
      }
    };
    exports.BluetoothProcessor = BluetoothProcessor;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/Deferred.js
var require_Deferred = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/Deferred.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deferred = void 0;
    var Deferred2 = class {
      #isFinished = false;
      #promise;
      #result;
      #resolve;
      #reject;
      get isFinished() {
        return this.#isFinished;
      }
      get result() {
        if (!this.#isFinished) {
          throw new Error("Deferred is not finished yet");
        }
        return this.#result;
      }
      constructor() {
        this.#promise = new Promise((resolve, reject) => {
          this.#resolve = resolve;
          this.#reject = reject;
        });
        this.#promise.catch((_error) => {
        });
      }
      then(onFulfilled, onRejected) {
        return this.#promise.then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this.#promise.catch(onRejected);
      }
      resolve(value) {
        this.#result = value;
        if (!this.#isFinished) {
          this.#isFinished = true;
          this.#resolve(value);
        }
      }
      reject(reason) {
        if (!this.#isFinished) {
          this.#isFinished = true;
          this.#reject(reason);
        }
      }
      finally(onFinally) {
        return this.#promise.finally(onFinally);
      }
      [Symbol.toStringTag] = "Promise";
    };
    exports.Deferred = Deferred2;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/unitConversions.js
var require_unitConversions = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/unitConversions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.inchesFromCm = inchesFromCm;
    function inchesFromCm(cm) {
      return cm / 2.54;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/Realm.js
var require_Realm = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/Realm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Realm = void 0;
    var protocol_js_1 = require_protocol();
    var log_js_1 = require_log();
    var uuid_js_1 = require_uuid();
    var ChannelProxy_js_1 = require_ChannelProxy();
    var _cdpClient, _eventManager, _executionContextId, _logger, _origin, _realmId, _realmStorage, _registerEvent, registerEvent_fn, _cdpRemoteObjectToCallArgument, cdpRemoteObjectToCallArgument_fn, _flattenKeyValuePairs, flattenKeyValuePairs_fn, _flattenValueList, flattenValueList_fn, _serializeCdpExceptionDetails, serializeCdpExceptionDetails_fn, _getExceptionResult, getExceptionResult_fn, _getSerializationOptions, getSerializationOptions_fn, _getAdditionalSerializationParameters, getAdditionalSerializationParameters_fn, _getMaxObjectDepth, getMaxObjectDepth_fn, _releaseObject, releaseObject_fn;
    var _Realm = class {
      constructor(cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage) {
        __privateAdd(this, _registerEvent);
        __privateAdd(this, _flattenKeyValuePairs);
        __privateAdd(this, _flattenValueList);
        __privateAdd(this, _serializeCdpExceptionDetails);
        __privateAdd(this, _getExceptionResult);
        __privateAdd(this, _releaseObject);
        __privateAdd(this, _cdpClient, void 0);
        __privateAdd(this, _eventManager, void 0);
        __privateAdd(this, _executionContextId, void 0);
        __privateAdd(this, _logger, void 0);
        __privateAdd(this, _origin, void 0);
        __privateAdd(this, _realmId, void 0);
        __privateAdd(this, _realmStorage, void 0);
        __privateSet(this, _cdpClient, cdpClient);
        __privateSet(this, _eventManager, eventManager);
        __privateSet(this, _executionContextId, executionContextId);
        __privateSet(this, _logger, logger);
        __privateSet(this, _origin, origin);
        __privateSet(this, _realmId, realmId);
        __privateSet(this, _realmStorage, realmStorage);
        __privateGet(this, _realmStorage).addRealm(this);
      }
      cdpToBidiValue(cdpValue, resultOwnership) {
        const bidiValue = this.serializeForBiDi(cdpValue.result.deepSerializedValue, /* @__PURE__ */ new Map());
        if (cdpValue.result.objectId) {
          const objectId = cdpValue.result.objectId;
          if (resultOwnership === "root") {
            bidiValue.handle = objectId;
            __privateGet(this, _realmStorage).knownHandlesToRealmMap.set(objectId, this.realmId);
          } else {
            void __privateMethod(this, _releaseObject, releaseObject_fn).call(this, objectId).catch((error) => {
              var _a3;
              return (_a3 = __privateGet(this, _logger)) == null ? void 0 : _a3.call(this, log_js_1.LogType.debugError, error);
            });
          }
        }
        return bidiValue;
      }
      /**
       * Relies on the CDP to implement proper BiDi serialization, except:
       * * CDP integer property `backendNodeId` is replaced with `sharedId` of
       * `{documentId}_element_{backendNodeId}`;
       * * CDP integer property `weakLocalObjectReference` is replaced with UUID `internalId`
       * using unique-per serialization `internalIdMap`.
       * * CDP type `platformobject` is replaced with `object`.
       * @param deepSerializedValue - CDP value to be converted to BiDi.
       * @param internalIdMap - Map from CDP integer `weakLocalObjectReference` to BiDi UUID
       * `internalId`.
       */
      serializeForBiDi(deepSerializedValue, internalIdMap) {
        if (Object.hasOwn(deepSerializedValue, "weakLocalObjectReference")) {
          const weakLocalObjectReference = deepSerializedValue.weakLocalObjectReference;
          if (!internalIdMap.has(weakLocalObjectReference)) {
            internalIdMap.set(weakLocalObjectReference, (0, uuid_js_1.uuidv4)());
          }
          deepSerializedValue.internalId = internalIdMap.get(weakLocalObjectReference);
          delete deepSerializedValue["weakLocalObjectReference"];
        }
        if (deepSerializedValue.type === "node" && Object.hasOwn(deepSerializedValue?.value, "frameId")) {
          delete deepSerializedValue.value["frameId"];
        }
        if (deepSerializedValue.type === "platformobject") {
          return { type: "object" };
        }
        const bidiValue = deepSerializedValue.value;
        if (bidiValue === void 0) {
          return deepSerializedValue;
        }
        if (["array", "set", "htmlcollection", "nodelist"].includes(deepSerializedValue.type)) {
          for (const i in bidiValue) {
            bidiValue[i] = this.serializeForBiDi(bidiValue[i], internalIdMap);
          }
        }
        if (["object", "map"].includes(deepSerializedValue.type)) {
          for (const i in bidiValue) {
            bidiValue[i] = [
              this.serializeForBiDi(bidiValue[i][0], internalIdMap),
              this.serializeForBiDi(bidiValue[i][1], internalIdMap)
            ];
          }
        }
        return deepSerializedValue;
      }
      get realmId() {
        return __privateGet(this, _realmId);
      }
      get executionContextId() {
        return __privateGet(this, _executionContextId);
      }
      get origin() {
        return __privateGet(this, _origin);
      }
      get source() {
        return {
          realm: this.realmId
        };
      }
      get cdpClient() {
        return __privateGet(this, _cdpClient);
      }
      get baseInfo() {
        return {
          realm: this.realmId,
          origin: this.origin
        };
      }
      async evaluate(expression, awaitPromise, resultOwnership = "none", serializationOptions = {}, userActivation = false, includeCommandLineApi = false) {
        var _a3;
        const cdpEvaluateResult = await this.cdpClient.sendCommand("Runtime.evaluate", {
          contextId: this.executionContextId,
          expression,
          awaitPromise,
          serializationOptions: __privateMethod(_a3 = _Realm, _getSerializationOptions, getSerializationOptions_fn).call(_a3, "deep", serializationOptions),
          userGesture: userActivation,
          includeCommandLineAPI: includeCommandLineApi
        });
        if (cdpEvaluateResult.exceptionDetails) {
          return await __privateMethod(this, _getExceptionResult, getExceptionResult_fn).call(this, cdpEvaluateResult.exceptionDetails, 0, resultOwnership);
        }
        return {
          realm: this.realmId,
          result: this.cdpToBidiValue(cdpEvaluateResult, resultOwnership),
          type: "success"
        };
      }
      initialize() {
        __privateMethod(this, _registerEvent, registerEvent_fn).call(this, {
          type: "event",
          method: protocol_js_1.ChromiumBidi.Script.EventNames.RealmCreated,
          params: this.realmInfo
        });
      }
      /**
       * Serializes a given CDP object into BiDi, keeping references in the
       * target's `globalThis`.
       */
      async serializeCdpObject(cdpRemoteObject, resultOwnership) {
        var _a3;
        const argument = __privateMethod(_a3 = _Realm, _cdpRemoteObjectToCallArgument, cdpRemoteObjectToCallArgument_fn).call(_a3, cdpRemoteObject);
        const cdpValue = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((remoteObject) => remoteObject),
          awaitPromise: false,
          arguments: [argument],
          serializationOptions: {
            serialization: "deep"
          },
          executionContextId: this.executionContextId
        });
        return this.cdpToBidiValue(cdpValue, resultOwnership);
      }
      /**
       * Gets the string representation of an object. This is equivalent to
       * calling `toString()` on the object value.
       */
      async stringifyObject(cdpRemoteObject) {
        const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((remoteObject) => String(remoteObject)),
          awaitPromise: false,
          arguments: [cdpRemoteObject],
          returnByValue: true,
          executionContextId: this.executionContextId
        });
        return result.value;
      }
      async callFunction(functionDeclaration, awaitPromise, thisLocalValue = {
        type: "undefined"
      }, argumentsLocalValues = [], resultOwnership = "none", serializationOptions = {}, userActivation = false) {
        var _a3;
        const callFunctionAndSerializeScript = `(...args) => {
      function callFunction(f, args) {
        const deserializedThis = args.shift();
        const deserializedArgs = args;
        return f.apply(deserializedThis, deserializedArgs);
      }
      return callFunction((
        ${functionDeclaration}
      ), args);
    }`;
        const thisAndArgumentsList = [
          await this.deserializeForCdp(thisLocalValue),
          ...await Promise.all(argumentsLocalValues.map(async (argumentLocalValue) => await this.deserializeForCdp(argumentLocalValue)))
        ];
        let cdpCallFunctionResult;
        try {
          cdpCallFunctionResult = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
            functionDeclaration: callFunctionAndSerializeScript,
            awaitPromise,
            arguments: thisAndArgumentsList,
            serializationOptions: __privateMethod(_a3 = _Realm, _getSerializationOptions, getSerializationOptions_fn).call(_a3, "deep", serializationOptions),
            executionContextId: this.executionContextId,
            userGesture: userActivation
          });
        } catch (error) {
          if (error.code === -32e3 && [
            "Could not find object with given id",
            "Argument should belong to the same JavaScript world as target object",
            "Invalid remote object id"
          ].includes(error.message)) {
            throw new protocol_js_1.NoSuchHandleException("Handle was not found.");
          }
          throw error;
        }
        if (cdpCallFunctionResult.exceptionDetails) {
          return await __privateMethod(this, _getExceptionResult, getExceptionResult_fn).call(this, cdpCallFunctionResult.exceptionDetails, 1, resultOwnership);
        }
        return {
          type: "success",
          result: this.cdpToBidiValue(cdpCallFunctionResult, resultOwnership),
          realm: this.realmId
        };
      }
      async deserializeForCdp(localValue) {
        if ("handle" in localValue && localValue.handle) {
          return { objectId: localValue.handle };
        } else if ("handle" in localValue || "sharedId" in localValue) {
          throw new protocol_js_1.NoSuchHandleException("Handle was not found.");
        }
        switch (localValue.type) {
          case "undefined":
            return { unserializableValue: "undefined" };
          case "null":
            return { unserializableValue: "null" };
          case "string":
            return { value: localValue.value };
          case "number":
            if (localValue.value === "NaN") {
              return { unserializableValue: "NaN" };
            } else if (localValue.value === "-0") {
              return { unserializableValue: "-0" };
            } else if (localValue.value === "Infinity") {
              return { unserializableValue: "Infinity" };
            } else if (localValue.value === "-Infinity") {
              return { unserializableValue: "-Infinity" };
            }
            return {
              value: localValue.value
            };
          case "boolean":
            return { value: Boolean(localValue.value) };
          case "bigint":
            return {
              unserializableValue: `BigInt(${JSON.stringify(localValue.value)})`
            };
          case "date":
            return {
              unserializableValue: `new Date(Date.parse(${JSON.stringify(localValue.value)}))`
            };
          case "regexp":
            return {
              unserializableValue: `new RegExp(${JSON.stringify(localValue.value.pattern)}, ${JSON.stringify(localValue.value.flags)})`
            };
          case "map": {
            const keyValueArray = await __privateMethod(this, _flattenKeyValuePairs, flattenKeyValuePairs_fn).call(this, localValue.value);
            const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
              functionDeclaration: String((...args) => {
                const result2 = /* @__PURE__ */ new Map();
                for (let i = 0; i < args.length; i += 2) {
                  result2.set(args[i], args[i + 1]);
                }
                return result2;
              }),
              awaitPromise: false,
              arguments: keyValueArray,
              returnByValue: false,
              executionContextId: this.executionContextId
            });
            return { objectId: result.objectId };
          }
          case "object": {
            const keyValueArray = await __privateMethod(this, _flattenKeyValuePairs, flattenKeyValuePairs_fn).call(this, localValue.value);
            const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
              functionDeclaration: String((...args) => {
                const result2 = {};
                for (let i = 0; i < args.length; i += 2) {
                  const key = args[i];
                  result2[key] = args[i + 1];
                }
                return result2;
              }),
              awaitPromise: false,
              arguments: keyValueArray,
              returnByValue: false,
              executionContextId: this.executionContextId
            });
            return { objectId: result.objectId };
          }
          case "array": {
            const args = await __privateMethod(this, _flattenValueList, flattenValueList_fn).call(this, localValue.value);
            const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
              functionDeclaration: String((...args2) => args2),
              awaitPromise: false,
              arguments: args,
              returnByValue: false,
              executionContextId: this.executionContextId
            });
            return { objectId: result.objectId };
          }
          case "set": {
            const args = await __privateMethod(this, _flattenValueList, flattenValueList_fn).call(this, localValue.value);
            const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
              functionDeclaration: String((...args2) => new Set(args2)),
              awaitPromise: false,
              arguments: args,
              returnByValue: false,
              executionContextId: this.executionContextId
            });
            return { objectId: result.objectId };
          }
          case "channel": {
            const channelProxy = new ChannelProxy_js_1.ChannelProxy(localValue.value, __privateGet(this, _logger));
            const channelProxySendMessageHandle = await channelProxy.init(this, __privateGet(this, _eventManager));
            return { objectId: channelProxySendMessageHandle };
          }
        }
        throw new Error(`Value ${JSON.stringify(localValue)} is not deserializable.`);
      }
      async disown(handle) {
        if (__privateGet(this, _realmStorage).knownHandlesToRealmMap.get(handle) !== this.realmId) {
          return;
        }
        await __privateMethod(this, _releaseObject, releaseObject_fn).call(this, handle);
        __privateGet(this, _realmStorage).knownHandlesToRealmMap.delete(handle);
      }
      dispose() {
        __privateMethod(this, _registerEvent, registerEvent_fn).call(this, {
          type: "event",
          method: protocol_js_1.ChromiumBidi.Script.EventNames.RealmDestroyed,
          params: {
            realm: this.realmId
          }
        });
      }
    };
    var Realm3 = _Realm;
    _cdpClient = new WeakMap();
    _eventManager = new WeakMap();
    _executionContextId = new WeakMap();
    _logger = new WeakMap();
    _origin = new WeakMap();
    _realmId = new WeakMap();
    _realmStorage = new WeakMap();
    _registerEvent = new WeakSet();
    registerEvent_fn = function(event) {
      if (this.associatedBrowsingContexts.length === 0) {
        __privateGet(this, _eventManager).registerEvent(event, null);
      } else {
        for (const browsingContext of this.associatedBrowsingContexts) {
          __privateGet(this, _eventManager).registerEvent(event, browsingContext.id);
        }
      }
    };
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
    _flattenKeyValuePairs = new WeakSet();
    flattenKeyValuePairs_fn = async function(mappingLocalValue) {
      const keyValueArray = await Promise.all(mappingLocalValue.map(async ([key, value]) => {
        let keyArg;
        if (typeof key === "string") {
          keyArg = { value: key };
        } else {
          keyArg = await this.deserializeForCdp(key);
        }
        const valueArg = await this.deserializeForCdp(value);
        return [keyArg, valueArg];
      }));
      return keyValueArray.flat();
    };
    _flattenValueList = new WeakSet();
    flattenValueList_fn = async function(listLocalValue) {
      return await Promise.all(listLocalValue.map((localValue) => this.deserializeForCdp(localValue)));
    };
    _serializeCdpExceptionDetails = new WeakSet();
    serializeCdpExceptionDetails_fn = async function(cdpExceptionDetails, lineOffset, resultOwnership) {
      const callFrames = cdpExceptionDetails.stackTrace?.callFrames.map((frame) => ({
        url: frame.url,
        functionName: frame.functionName,
        lineNumber: frame.lineNumber - lineOffset,
        columnNumber: frame.columnNumber
      })) ?? [];
      const exception = cdpExceptionDetails.exception;
      return {
        exception: await this.serializeCdpObject(exception, resultOwnership),
        columnNumber: cdpExceptionDetails.columnNumber,
        lineNumber: cdpExceptionDetails.lineNumber - lineOffset,
        stackTrace: {
          callFrames
        },
        text: await this.stringifyObject(exception) || cdpExceptionDetails.text
      };
    };
    _getExceptionResult = new WeakSet();
    getExceptionResult_fn = async function(exceptionDetails, lineOffset, resultOwnership) {
      return {
        exceptionDetails: await __privateMethod(this, _serializeCdpExceptionDetails, serializeCdpExceptionDetails_fn).call(this, exceptionDetails, lineOffset, resultOwnership),
        realm: this.realmId,
        type: "exception"
      };
    };
    _getSerializationOptions = new WeakSet();
    getSerializationOptions_fn = function(serialization, serializationOptions) {
      var _a3, _b;
      return {
        serialization,
        additionalParameters: __privateMethod(_a3 = _Realm, _getAdditionalSerializationParameters, getAdditionalSerializationParameters_fn).call(_a3, serializationOptions),
        ...__privateMethod(_b = _Realm, _getMaxObjectDepth, getMaxObjectDepth_fn).call(_b, serializationOptions)
      };
    };
    _getAdditionalSerializationParameters = new WeakSet();
    getAdditionalSerializationParameters_fn = function(serializationOptions) {
      const additionalParameters = {};
      if (serializationOptions.maxDomDepth !== void 0) {
        additionalParameters["maxNodeDepth"] = serializationOptions.maxDomDepth === null ? 1e3 : serializationOptions.maxDomDepth;
      }
      if (serializationOptions.includeShadowTree !== void 0) {
        additionalParameters["includeShadowTree"] = serializationOptions.includeShadowTree;
      }
      return additionalParameters;
    };
    _getMaxObjectDepth = new WeakSet();
    getMaxObjectDepth_fn = function(serializationOptions) {
      return serializationOptions.maxObjectDepth === void 0 || serializationOptions.maxObjectDepth === null ? {} : { maxDepth: serializationOptions.maxObjectDepth };
    };
    _releaseObject = new WeakSet();
    releaseObject_fn = async function(handle) {
      try {
        await this.cdpClient.sendCommand("Runtime.releaseObject", {
          objectId: handle
        });
      } catch (error) {
        if (!(error.code === -32e3 && error.message === "Invalid remote object id")) {
          throw error;
        }
      }
    };
    __privateAdd(Realm3, _cdpRemoteObjectToCallArgument);
    __privateAdd(Realm3, _getSerializationOptions);
    __privateAdd(Realm3, _getAdditionalSerializationParameters);
    __privateAdd(Realm3, _getMaxObjectDepth);
    exports.Realm = Realm3;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/SharedId.js
var require_SharedId = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/SharedId.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSharedId = getSharedId;
    exports.parseSharedId = parseSharedId;
    var SHARED_ID_DIVIDER = "_element_";
    function getSharedId(frameId, documentId, backendNodeId) {
      return `f.${frameId}.d.${documentId}.e.${backendNodeId}`;
    }
    function parseLegacySharedId(sharedId) {
      const match = sharedId.match(new RegExp(`(.*)${SHARED_ID_DIVIDER}(.*)`));
      if (!match) {
        return null;
      }
      const documentId = match[1];
      const elementId = match[2];
      if (documentId === void 0 || elementId === void 0) {
        return null;
      }
      const backendNodeId = parseInt(elementId ?? "");
      if (isNaN(backendNodeId)) {
        return null;
      }
      return {
        documentId,
        backendNodeId
      };
    }
    function parseSharedId(sharedId) {
      const legacyFormattedSharedId = parseLegacySharedId(sharedId);
      if (legacyFormattedSharedId !== null) {
        return { ...legacyFormattedSharedId, frameId: void 0 };
      }
      const match = sharedId.match(/f\.(.*)\.d\.(.*)\.e\.([0-9]*)/);
      if (!match) {
        return null;
      }
      const frameId = match[1];
      const documentId = match[2];
      const elementId = match[3];
      if (frameId === void 0 || documentId === void 0 || elementId === void 0) {
        return null;
      }
      const backendNodeId = parseInt(elementId ?? "");
      if (isNaN(backendNodeId)) {
        return null;
      }
      return {
        frameId,
        documentId,
        backendNodeId
      };
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/WindowRealm.js
var require_WindowRealm = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/WindowRealm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WindowRealm = void 0;
    var protocol_js_1 = require_protocol();
    var Realm_js_1 = require_Realm();
    var SharedId_js_1 = require_SharedId();
    var WindowRealm2 = class extends Realm_js_1.Realm {
      #browsingContextId;
      #browsingContextStorage;
      sandbox;
      constructor(browsingContextId, browsingContextStorage, cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage, sandbox) {
        super(cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage);
        this.#browsingContextId = browsingContextId;
        this.#browsingContextStorage = browsingContextStorage;
        this.sandbox = sandbox;
        this.initialize();
      }
      #getBrowsingContextId(navigableId) {
        const maybeBrowsingContext = this.#browsingContextStorage.getAllContexts().find((context) => context.navigableId === navigableId);
        return maybeBrowsingContext?.id ?? "UNKNOWN";
      }
      get browsingContext() {
        return this.#browsingContextStorage.getContext(this.#browsingContextId);
      }
      get associatedBrowsingContexts() {
        return [this.browsingContext];
      }
      get realmType() {
        return "window";
      }
      get realmInfo() {
        return {
          ...this.baseInfo,
          type: this.realmType,
          context: this.#browsingContextId,
          sandbox: this.sandbox
        };
      }
      get source() {
        return {
          realm: this.realmId,
          context: this.browsingContext.id
        };
      }
      serializeForBiDi(deepSerializedValue, internalIdMap) {
        const bidiValue = deepSerializedValue.value;
        if (deepSerializedValue.type === "node" && bidiValue !== void 0) {
          if (Object.hasOwn(bidiValue, "backendNodeId")) {
            let navigableId = this.browsingContext.navigableId ?? "UNKNOWN";
            if (Object.hasOwn(bidiValue, "loaderId")) {
              navigableId = bidiValue.loaderId;
              delete bidiValue["loaderId"];
            }
            deepSerializedValue.sharedId = (0, SharedId_js_1.getSharedId)(this.#getBrowsingContextId(navigableId), navigableId, bidiValue.backendNodeId);
            delete bidiValue["backendNodeId"];
          }
          if (Object.hasOwn(bidiValue, "children")) {
            for (const i in bidiValue.children) {
              bidiValue.children[i] = this.serializeForBiDi(bidiValue.children[i], internalIdMap);
            }
          }
          if (Object.hasOwn(bidiValue, "shadowRoot") && bidiValue.shadowRoot !== null) {
            bidiValue.shadowRoot = this.serializeForBiDi(bidiValue.shadowRoot, internalIdMap);
          }
          if (bidiValue.namespaceURI === "") {
            bidiValue.namespaceURI = null;
          }
        }
        return super.serializeForBiDi(deepSerializedValue, internalIdMap);
      }
      async deserializeForCdp(localValue) {
        if ("sharedId" in localValue && localValue.sharedId) {
          const parsedSharedId = (0, SharedId_js_1.parseSharedId)(localValue.sharedId);
          if (parsedSharedId === null) {
            throw new protocol_js_1.NoSuchNodeException(`SharedId "${localValue.sharedId}" was not found.`);
          }
          const { documentId, backendNodeId } = parsedSharedId;
          if (this.browsingContext.navigableId !== documentId) {
            throw new protocol_js_1.NoSuchNodeException(`SharedId "${localValue.sharedId}" belongs to different document. Current document is ${this.browsingContext.navigableId}.`);
          }
          try {
            const { object } = await this.cdpClient.sendCommand("DOM.resolveNode", {
              backendNodeId,
              executionContextId: this.executionContextId
            });
            return { objectId: object.objectId };
          } catch (error) {
            if (error.code === -32e3 && error.message === "No node with given id found") {
              throw new protocol_js_1.NoSuchNodeException(`SharedId "${localValue.sharedId}" was not found.`);
            }
            throw new protocol_js_1.UnknownErrorException(error.message, error.stack);
          }
        }
        return await super.deserializeForCdp(localValue);
      }
      async evaluate(expression, awaitPromise, resultOwnership, serializationOptions, userActivation, includeCommandLineApi) {
        await this.#browsingContextStorage.getContext(this.#browsingContextId).targetUnblockedOrThrow();
        return await super.evaluate(expression, awaitPromise, resultOwnership, serializationOptions, userActivation, includeCommandLineApi);
      }
      async callFunction(functionDeclaration, awaitPromise, thisLocalValue, argumentsLocalValues, resultOwnership, serializationOptions, userActivation) {
        await this.#browsingContextStorage.getContext(this.#browsingContextId).targetUnblockedOrThrow();
        return await super.callFunction(functionDeclaration, awaitPromise, thisLocalValue, argumentsLocalValues, resultOwnership, serializationOptions, userActivation);
      }
    };
    exports.WindowRealm = WindowRealm2;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/context/BrowsingContextImpl.js
var require_BrowsingContextImpl = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/context/BrowsingContextImpl.js"(exports) {
    "use strict";
    var _a3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowsingContextImpl = void 0;
    exports.serializeOrigin = serializeOrigin;
    var protocol_js_1 = require_protocol();
    var assert_js_1 = require_assert();
    var Deferred_js_1 = require_Deferred();
    var log_js_1 = require_log();
    var unitConversions_js_1 = require_unitConversions();
    var uuid_js_1 = require_uuid();
    var WindowRealm_js_1 = require_WindowRealm();
    var _id, _parentId, _children, _browsingContextStorage, _lifecycle, _navigation, _url, _eventManager, _realmStorage, _loaderId, _cdpTarget, _defaultRealmDeferred, _logger, _previousViewport, _pendingNavigationUrl, _navigationId, _pendingNavigationId, _pendingCommandNavigation, _originalOpener, _lastUserPromptType, _unhandledPromptBehavior, _deleteAllChildren, deleteAllChildren_fn, _initListeners, initListeners_fn, _getPromptType, getPromptType_fn, _getPromptHandler, getPromptHandler_fn, _documentChanged, documentChanged_fn, _resetLifecycleIfFinished, resetLifecycleIfFinished_fn, _failLifecycleIfNotFinished, failLifecycleIfNotFinished_fn, _waitNavigation, waitNavigation_fn, _parseRect, parseRect_fn, _getLocatorDelegate, getLocatorDelegate_fn, _locateNodesByLocator, locateNodesByLocator_fn;
    var BrowsingContextImpl = class {
      constructor(id, parentId, userContext, cdpTarget, eventManager, browsingContextStorage, realmStorage, url, originalOpener, unhandledPromptBehavior, logger) {
        __privateAdd(this, _deleteAllChildren);
        __privateAdd(this, _initListeners);
        __privateAdd(this, _getPromptHandler);
        __privateAdd(this, _documentChanged);
        __privateAdd(this, _resetLifecycleIfFinished);
        __privateAdd(this, _failLifecycleIfNotFinished);
        __privateAdd(this, _waitNavigation);
        /**
         * See
         * https://w3c.github.io/webdriver-bidi/#:~:text=If%20command%20parameters%20contains%20%22clip%22%3A
         */
        __privateAdd(this, _parseRect);
        __privateAdd(this, _getLocatorDelegate);
        __privateAdd(this, _locateNodesByLocator);
        /** The ID of this browsing context. */
        __privateAdd(this, _id, void 0);
        __publicField(this, "userContext");
        /**
         * The ID of the parent browsing context.
         * If null, this is a top-level context.
         */
        __privateAdd(this, _parentId, null);
        /** Direct children browsing contexts. */
        __privateAdd(this, _children, /* @__PURE__ */ new Set());
        __privateAdd(this, _browsingContextStorage, void 0);
        __privateAdd(this, _lifecycle, {
          DOMContentLoaded: new Deferred_js_1.Deferred(),
          load: new Deferred_js_1.Deferred()
        });
        __privateAdd(this, _navigation, {
          withinDocument: new Deferred_js_1.Deferred()
        });
        __privateAdd(this, _url, void 0);
        __privateAdd(this, _eventManager, void 0);
        __privateAdd(this, _realmStorage, void 0);
        __privateAdd(this, _loaderId, void 0);
        __privateAdd(this, _cdpTarget, void 0);
        // The deferred will be resolved when the default realm is created.
        __privateAdd(this, _defaultRealmDeferred, new Deferred_js_1.Deferred());
        __privateAdd(this, _logger, void 0);
        // Keeps track of the previously set viewport.
        __privateAdd(this, _previousViewport, { width: 0, height: 0 });
        // The URL of the navigation that is currently in progress. A workaround of the CDP
        // lacking URL for the pending navigation events, e.g. `Page.frameStartedLoading`.
        // Set on `Page.navigate`, `Page.reload` commands, on `Page.frameRequestedNavigation` or
        // on a deprecated `Page.frameScheduledNavigation` event. The latest is required as the
        // `Page.frameRequestedNavigation` event is not emitted for same-document navigations.
        __privateAdd(this, _pendingNavigationUrl, void 0);
        // Navigation ID is required, as CDP `loaderId` cannot be mapped 1:1 to all the
        // navigations (e.g. same document navigations). Updated after each navigation,
        // including same-document ones.
        __privateAdd(this, _navigationId, (0, uuid_js_1.uuidv4)());
        // When a new navigation is started via `BrowsingContext.navigate` with `wait` set to
        // `None`, the command result should have `navigation` value, but mapper does not have
        // it yet. This value will be set to `navigationId` after next .
        __privateAdd(this, _pendingNavigationId, void 0);
        // Set if there is a pending navigation initiated by `BrowsingContext.navigate` command.
        // The promise is resolved when the navigation is finished or rejected when canceled.
        __privateAdd(this, _pendingCommandNavigation, void 0);
        __privateAdd(this, _originalOpener, void 0);
        // Set when the user prompt is opened. Required to provide the type in closing event.
        __privateAdd(this, _lastUserPromptType, void 0);
        __privateAdd(this, _unhandledPromptBehavior, void 0);
        __privateSet(this, _cdpTarget, cdpTarget);
        __privateSet(this, _id, id);
        __privateSet(this, _parentId, parentId);
        this.userContext = userContext;
        __privateSet(this, _eventManager, eventManager);
        __privateSet(this, _browsingContextStorage, browsingContextStorage);
        __privateSet(this, _realmStorage, realmStorage);
        __privateSet(this, _unhandledPromptBehavior, unhandledPromptBehavior);
        __privateSet(this, _logger, logger);
        __privateSet(this, _url, url);
        __privateSet(this, _originalOpener, originalOpener);
      }
      static create(id, parentId, userContext, cdpTarget, eventManager, browsingContextStorage, realmStorage, url, originalOpener, unhandledPromptBehavior, logger) {
        var _a4;
        const context = new _a3(id, parentId, userContext, cdpTarget, eventManager, browsingContextStorage, realmStorage, url, originalOpener, unhandledPromptBehavior, logger);
        __privateMethod(_a4 = context, _initListeners, initListeners_fn).call(_a4);
        browsingContextStorage.addContext(context);
        if (!context.isTopLevelContext()) {
          context.parent.addChild(context.id);
        }
        eventManager.registerPromiseEvent(context.targetUnblockedOrThrow().then(() => {
          return {
            kind: "success",
            value: {
              type: "event",
              method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.ContextCreated,
              params: context.serializeToBidiValue()
            }
          };
        }, (error) => {
          return {
            kind: "error",
            error
          };
        }), context.id, protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.ContextCreated);
        return context;
      }
      static getTimestamp() {
        return (/* @__PURE__ */ new Date()).getTime();
      }
      /**
       * @see https://html.spec.whatwg.org/multipage/document-sequences.html#navigable
       */
      get navigableId() {
        return __privateGet(this, _loaderId);
      }
      get navigationId() {
        return __privateGet(this, _navigationId);
      }
      dispose(emitContextDestroyed) {
        __privateGet(this, _pendingCommandNavigation)?.reject(new protocol_js_1.UnknownErrorException("navigation canceled by context disposal"));
        __privateMethod(this, _deleteAllChildren, deleteAllChildren_fn).call(this);
        __privateGet(this, _realmStorage).deleteRealms({
          browsingContextId: this.id
        });
        if (!this.isTopLevelContext()) {
          __privateGet(this.parent, _children).delete(this.id);
        }
        __privateMethod(this, _failLifecycleIfNotFinished, failLifecycleIfNotFinished_fn).call(this);
        if (emitContextDestroyed) {
          __privateGet(this, _eventManager).registerEvent({
            type: "event",
            method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.ContextDestroyed,
            params: this.serializeToBidiValue()
          }, this.id);
        }
        __privateGet(this, _eventManager).clearBufferedEvents(this.id);
        __privateGet(this, _browsingContextStorage).deleteContextById(this.id);
      }
      /** Returns the ID of this context. */
      get id() {
        return __privateGet(this, _id);
      }
      /** Returns the parent context ID. */
      get parentId() {
        return __privateGet(this, _parentId);
      }
      /** Sets the parent context ID and updates parent's children. */
      set parentId(parentId) {
        var _a4;
        if (__privateGet(this, _parentId) !== null) {
          (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, log_js_1.LogType.debugError, "Parent context already set");
          return;
        }
        __privateSet(this, _parentId, parentId);
        if (!this.isTopLevelContext()) {
          this.parent.addChild(this.id);
        }
      }
      /** Returns the parent context. */
      get parent() {
        if (this.parentId === null) {
          return null;
        }
        return __privateGet(this, _browsingContextStorage).getContext(this.parentId);
      }
      /** Returns all direct children contexts. */
      get directChildren() {
        return [...__privateGet(this, _children)].map((id) => __privateGet(this, _browsingContextStorage).getContext(id));
      }
      /** Returns all children contexts, flattened. */
      get allChildren() {
        const children = this.directChildren;
        return children.concat(...children.map((child) => child.allChildren));
      }
      /**
       * Returns true if this is a top-level context.
       * This is the case whenever the parent context ID is null.
       */
      isTopLevelContext() {
        return __privateGet(this, _parentId) === null;
      }
      get top() {
        let topContext = this;
        let parent = topContext.parent;
        while (parent) {
          topContext = parent;
          parent = topContext.parent;
        }
        return topContext;
      }
      addChild(childId) {
        __privateGet(this, _children).add(childId);
      }
      get cdpTarget() {
        return __privateGet(this, _cdpTarget);
      }
      updateCdpTarget(cdpTarget) {
        __privateSet(this, _cdpTarget, cdpTarget);
        __privateMethod(this, _initListeners, initListeners_fn).call(this);
      }
      get url() {
        return __privateGet(this, _url);
      }
      async lifecycleLoaded() {
        await __privateGet(this, _lifecycle).load;
      }
      async targetUnblockedOrThrow() {
        const result = await __privateGet(this, _cdpTarget).unblocked;
        if (result.kind === "error") {
          throw result.error;
        }
      }
      async getOrCreateSandbox(sandbox) {
        if (sandbox === void 0 || sandbox === "") {
          return await __privateGet(this, _defaultRealmDeferred);
        }
        let maybeSandboxes = __privateGet(this, _realmStorage).findRealms({
          browsingContextId: this.id,
          sandbox
        });
        if (maybeSandboxes.length === 0) {
          await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.createIsolatedWorld", {
            frameId: this.id,
            worldName: sandbox
          });
          maybeSandboxes = __privateGet(this, _realmStorage).findRealms({
            browsingContextId: this.id,
            sandbox
          });
          (0, assert_js_1.assert)(maybeSandboxes.length !== 0);
        }
        return maybeSandboxes[0];
      }
      serializeToBidiValue(maxDepth = 0, addParentField = true) {
        return {
          context: __privateGet(this, _id),
          url: this.url,
          userContext: this.userContext,
          originalOpener: __privateGet(this, _originalOpener) ?? null,
          // TODO(#2646): Implement Client Window correctly
          clientWindow: "",
          children: maxDepth > 0 ? this.directChildren.map((c) => c.serializeToBidiValue(maxDepth - 1, false)) : null,
          ...addParentField ? { parent: __privateGet(this, _parentId) } : {}
        };
      }
      onTargetInfoChanged(params) {
        __privateSet(this, _url, params.targetInfo.url);
      }
      async navigate(url, wait) {
        try {
          new URL(url);
        } catch {
          throw new protocol_js_1.InvalidArgumentException(`Invalid URL: ${url}`);
        }
        __privateGet(this, _pendingCommandNavigation)?.reject(new protocol_js_1.UnknownErrorException("navigation canceled by concurrent navigation"));
        await this.targetUnblockedOrThrow();
        __privateSet(this, _pendingNavigationUrl, url);
        const navigationId = (0, uuid_js_1.uuidv4)();
        __privateSet(this, _pendingNavigationId, navigationId);
        __privateSet(this, _pendingCommandNavigation, new Deferred_js_1.Deferred());
        const cdpNavigatePromise = (async () => {
          const cdpNavigateResult2 = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.navigate", {
            url,
            frameId: this.id
          });
          if (cdpNavigateResult2.errorText) {
            __privateSet(this, _pendingNavigationUrl, void 0);
            __privateGet(this, _eventManager).registerEvent({
              type: "event",
              method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.NavigationFailed,
              params: {
                context: this.id,
                navigation: navigationId,
                timestamp: _a3.getTimestamp(),
                url
              }
            }, this.id);
            throw new protocol_js_1.UnknownErrorException(cdpNavigateResult2.errorText);
          }
          __privateMethod(this, _documentChanged, documentChanged_fn).call(this, cdpNavigateResult2.loaderId);
          return cdpNavigateResult2;
        })();
        if (wait === "none") {
          __privateGet(this, _pendingCommandNavigation).resolve();
          __privateSet(this, _pendingCommandNavigation, void 0);
          return {
            navigation: navigationId,
            url
          };
        }
        const cdpNavigateResult = await cdpNavigatePromise;
        await Promise.race([
          // No `loaderId` means same-document navigation.
          __privateMethod(this, _waitNavigation, waitNavigation_fn).call(this, wait, cdpNavigateResult.loaderId === void 0),
          // Throw an error if the navigation is canceled.
          __privateGet(this, _pendingCommandNavigation)
        ]);
        __privateGet(this, _pendingCommandNavigation).resolve();
        __privateSet(this, _pendingCommandNavigation, void 0);
        return {
          navigation: navigationId,
          // Url can change due to redirect get the latest one.
          url: __privateGet(this, _url)
        };
      }
      // TODO: support concurrent navigations analogous to `navigate`.
      async reload(ignoreCache, wait) {
        await this.targetUnblockedOrThrow();
        __privateMethod(this, _resetLifecycleIfFinished, resetLifecycleIfFinished_fn).call(this);
        await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.reload", {
          ignoreCache
        });
        switch (wait) {
          case "none":
            break;
          case "interactive":
            await __privateGet(this, _lifecycle).DOMContentLoaded;
            break;
          case "complete":
            await __privateGet(this, _lifecycle).load;
            break;
        }
        return {
          navigation: __privateGet(this, _navigationId),
          url: this.url
        };
      }
      async setViewport(viewport, devicePixelRatio) {
        if (viewport === null && devicePixelRatio === null) {
          await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Emulation.clearDeviceMetricsOverride");
        } else {
          try {
            let appliedViewport;
            if (viewport === void 0) {
              appliedViewport = __privateGet(this, _previousViewport);
            } else if (viewport === null) {
              appliedViewport = {
                width: 0,
                height: 0
              };
            } else {
              appliedViewport = viewport;
            }
            __privateSet(this, _previousViewport, appliedViewport);
            await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Emulation.setDeviceMetricsOverride", {
              width: __privateGet(this, _previousViewport).width,
              height: __privateGet(this, _previousViewport).height,
              deviceScaleFactor: devicePixelRatio ? devicePixelRatio : 0,
              mobile: false,
              dontSetVisibleSize: true
            });
          } catch (err) {
            if (err.message.startsWith(
              // https://crsrc.org/c/content/browser/devtools/protocol/emulation_handler.cc;l=257;drc=2f6eee84cf98d4227e7c41718dd71b82f26d90ff
              "Width and height values must be positive"
            )) {
              throw new protocol_js_1.UnsupportedOperationException("Provided viewport dimensions are not supported");
            }
            throw err;
          }
        }
      }
      async handleUserPrompt(accept, userText) {
        await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.handleJavaScriptDialog", {
          accept: accept ?? true,
          promptText: userText
        });
      }
      async activate() {
        await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.bringToFront");
      }
      async captureScreenshot(params) {
        if (!this.isTopLevelContext()) {
          throw new protocol_js_1.UnsupportedOperationException(`Non-top-level 'context' (${params.context}) is currently not supported`);
        }
        const formatParameters = getImageFormatParameters(params);
        await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.bringToFront");
        let captureBeyondViewport = false;
        let script;
        params.origin ??= "viewport";
        switch (params.origin) {
          case "document": {
            script = String(() => {
              const element = document.documentElement;
              return {
                x: 0,
                y: 0,
                width: element.scrollWidth,
                height: element.scrollHeight
              };
            });
            captureBeyondViewport = true;
            break;
          }
          case "viewport": {
            script = String(() => {
              const viewport = window.visualViewport;
              return {
                x: viewport.pageLeft,
                y: viewport.pageTop,
                width: viewport.width,
                height: viewport.height
              };
            });
            break;
          }
        }
        const realm = await this.getOrCreateSandbox(void 0);
        const originResult = await realm.callFunction(script, false);
        (0, assert_js_1.assert)(originResult.type === "success");
        const origin = deserializeDOMRect(originResult.result);
        (0, assert_js_1.assert)(origin);
        let rect = origin;
        if (params.clip) {
          const clip = params.clip;
          if (params.origin === "viewport" && clip.type === "box") {
            clip.x += origin.x;
            clip.y += origin.y;
          }
          rect = getIntersectionRect(await __privateMethod(this, _parseRect, parseRect_fn).call(this, clip), origin);
        }
        if (rect.width === 0 || rect.height === 0) {
          throw new protocol_js_1.UnableToCaptureScreenException(`Unable to capture screenshot with zero dimensions: width=${rect.width}, height=${rect.height}`);
        }
        return await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.captureScreenshot", {
          clip: { ...rect, scale: 1 },
          ...formatParameters,
          captureBeyondViewport
        });
      }
      async print(params) {
        const cdpParams = {};
        if (params.background !== void 0) {
          cdpParams.printBackground = params.background;
        }
        if (params.margin?.bottom !== void 0) {
          cdpParams.marginBottom = (0, unitConversions_js_1.inchesFromCm)(params.margin.bottom);
        }
        if (params.margin?.left !== void 0) {
          cdpParams.marginLeft = (0, unitConversions_js_1.inchesFromCm)(params.margin.left);
        }
        if (params.margin?.right !== void 0) {
          cdpParams.marginRight = (0, unitConversions_js_1.inchesFromCm)(params.margin.right);
        }
        if (params.margin?.top !== void 0) {
          cdpParams.marginTop = (0, unitConversions_js_1.inchesFromCm)(params.margin.top);
        }
        if (params.orientation !== void 0) {
          cdpParams.landscape = params.orientation === "landscape";
        }
        if (params.page?.height !== void 0) {
          cdpParams.paperHeight = (0, unitConversions_js_1.inchesFromCm)(params.page.height);
        }
        if (params.page?.width !== void 0) {
          cdpParams.paperWidth = (0, unitConversions_js_1.inchesFromCm)(params.page.width);
        }
        if (params.pageRanges !== void 0) {
          for (const range of params.pageRanges) {
            if (typeof range === "number") {
              continue;
            }
            const rangeParts = range.split("-");
            if (rangeParts.length < 1 || rangeParts.length > 2) {
              throw new protocol_js_1.InvalidArgumentException(`Invalid page range: ${range} is not a valid integer range.`);
            }
            if (rangeParts.length === 1) {
              void parseInteger(rangeParts[0] ?? "");
              continue;
            }
            let lowerBound;
            let upperBound;
            const [rangeLowerPart = "", rangeUpperPart = ""] = rangeParts;
            if (rangeLowerPart === "") {
              lowerBound = 1;
            } else {
              lowerBound = parseInteger(rangeLowerPart);
            }
            if (rangeUpperPart === "") {
              upperBound = Number.MAX_SAFE_INTEGER;
            } else {
              upperBound = parseInteger(rangeUpperPart);
            }
            if (lowerBound > upperBound) {
              throw new protocol_js_1.InvalidArgumentException(`Invalid page range: ${rangeLowerPart} > ${rangeUpperPart}`);
            }
          }
          cdpParams.pageRanges = params.pageRanges.join(",");
        }
        if (params.scale !== void 0) {
          cdpParams.scale = params.scale;
        }
        if (params.shrinkToFit !== void 0) {
          cdpParams.preferCSSPageSize = !params.shrinkToFit;
        }
        try {
          const result = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.printToPDF", cdpParams);
          return {
            data: result.data
          };
        } catch (error) {
          if (error.message === "invalid print parameters: content area is empty") {
            throw new protocol_js_1.UnsupportedOperationException(error.message);
          }
          throw error;
        }
      }
      async close() {
        await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.close");
      }
      async traverseHistory(delta) {
        if (delta === 0) {
          return;
        }
        const history = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.getNavigationHistory");
        const entry = history.entries[history.currentIndex + delta];
        if (!entry) {
          throw new protocol_js_1.NoSuchHistoryEntryException(`No history entry at delta ${delta}`);
        }
        await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.navigateToHistoryEntry", {
          entryId: entry.id
        });
      }
      async toggleModulesIfNeeded() {
        await Promise.all([
          __privateGet(this, _cdpTarget).toggleNetworkIfNeeded(),
          __privateGet(this, _cdpTarget).toggleDeviceAccessIfNeeded()
        ]);
      }
      async locateNodes(params) {
        return await __privateMethod(this, _locateNodesByLocator, locateNodesByLocator_fn).call(this, await __privateGet(this, _defaultRealmDeferred), params.locator, params.startNodes ?? [], params.maxNodeCount, params.serializationOptions);
      }
    };
    _id = new WeakMap();
    _parentId = new WeakMap();
    _children = new WeakMap();
    _browsingContextStorage = new WeakMap();
    _lifecycle = new WeakMap();
    _navigation = new WeakMap();
    _url = new WeakMap();
    _eventManager = new WeakMap();
    _realmStorage = new WeakMap();
    _loaderId = new WeakMap();
    _cdpTarget = new WeakMap();
    _defaultRealmDeferred = new WeakMap();
    _logger = new WeakMap();
    _previousViewport = new WeakMap();
    _pendingNavigationUrl = new WeakMap();
    _navigationId = new WeakMap();
    _pendingNavigationId = new WeakMap();
    _pendingCommandNavigation = new WeakMap();
    _originalOpener = new WeakMap();
    _lastUserPromptType = new WeakMap();
    _unhandledPromptBehavior = new WeakMap();
    _deleteAllChildren = new WeakSet();
    deleteAllChildren_fn = function(emitContextDestroyed = false) {
      this.directChildren.map((child) => child.dispose(emitContextDestroyed));
    };
    _initListeners = new WeakSet();
    initListeners_fn = function() {
      __privateGet(this, _cdpTarget).cdpClient.on("Page.frameNavigated", (params) => {
        if (this.id !== params.frame.id) {
          return;
        }
        __privateSet(this, _url, params.frame.url + (params.frame.urlFragment ?? ""));
        __privateSet(this, _pendingNavigationUrl, void 0);
        __privateMethod(this, _deleteAllChildren, deleteAllChildren_fn).call(this);
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.navigatedWithinDocument", (params) => {
        if (this.id !== params.frameId) {
          return;
        }
        __privateSet(this, _pendingNavigationUrl, void 0);
        const timestamp = _a3.getTimestamp();
        __privateSet(this, _url, params.url);
        __privateGet(this, _navigation).withinDocument.resolve();
        __privateGet(this, _eventManager).registerEvent({
          type: "event",
          method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.FragmentNavigated,
          params: {
            context: this.id,
            navigation: __privateGet(this, _navigationId),
            timestamp,
            url: __privateGet(this, _url)
          }
        }, this.id);
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.frameStartedLoading", (params) => {
        if (this.id !== params.frameId) {
          return;
        }
        __privateSet(this, _navigationId, __privateGet(this, _pendingNavigationId) ?? (0, uuid_js_1.uuidv4)());
        __privateSet(this, _pendingNavigationId, void 0);
        __privateGet(this, _eventManager).registerEvent({
          type: "event",
          method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.NavigationStarted,
          params: {
            context: this.id,
            navigation: __privateGet(this, _navigationId),
            timestamp: _a3.getTimestamp(),
            // The URL of the navigation that is currently in progress. Although the URL
            // is not yet known in case of user-initiated navigations, it is possible to
            // provide the URL in case of BiDi-initiated navigations.
            // TODO: provide proper URL in case of user-initiated navigations.
            url: __privateGet(this, _pendingNavigationUrl) ?? "UNKNOWN"
          }
        }, this.id);
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.frameScheduledNavigation", (params) => {
        if (this.id !== params.frameId) {
          return;
        }
        __privateSet(this, _pendingNavigationUrl, params.url);
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.frameRequestedNavigation", (params) => {
        if (this.id !== params.frameId) {
          return;
        }
        __privateGet(this, _pendingCommandNavigation)?.reject(new protocol_js_1.UnknownErrorException(`navigation canceled, as new navigation is requested by ${params.reason}`));
        __privateSet(this, _pendingNavigationUrl, params.url);
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.lifecycleEvent", (params) => {
        if (this.id !== params.frameId) {
          return;
        }
        if (params.name === "init") {
          __privateMethod(this, _documentChanged, documentChanged_fn).call(this, params.loaderId);
          return;
        }
        if (params.name === "commit") {
          __privateSet(this, _loaderId, params.loaderId);
          return;
        }
        if (!__privateGet(this, _loaderId)) {
          __privateSet(this, _loaderId, params.loaderId);
        }
        if (params.loaderId !== __privateGet(this, _loaderId)) {
          return;
        }
        const timestamp = _a3.getTimestamp();
        switch (params.name) {
          case "DOMContentLoaded":
            __privateGet(this, _eventManager).registerEvent({
              type: "event",
              method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.DomContentLoaded,
              params: {
                context: this.id,
                navigation: __privateGet(this, _navigationId),
                timestamp,
                url: __privateGet(this, _url)
              }
            }, this.id);
            __privateGet(this, _lifecycle).DOMContentLoaded.resolve();
            break;
          case "load":
            __privateGet(this, _eventManager).registerEvent({
              type: "event",
              method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.Load,
              params: {
                context: this.id,
                navigation: __privateGet(this, _navigationId),
                timestamp,
                url: __privateGet(this, _url)
              }
            }, this.id);
            __privateGet(this, _lifecycle).load.resolve();
            break;
        }
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Runtime.executionContextCreated", (params) => {
        var _a4;
        const { auxData, name, uniqueId, id } = params.context;
        if (!auxData || auxData.frameId !== this.id) {
          return;
        }
        let origin;
        let sandbox;
        switch (auxData.type) {
          case "isolated":
            sandbox = name;
            if (!__privateGet(this, _defaultRealmDeferred).isFinished) {
              (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, log_js_1.LogType.debugError, "Unexpectedly, isolated realm created before the default one");
            }
            origin = __privateGet(this, _defaultRealmDeferred).isFinished ? __privateGet(this, _defaultRealmDeferred).result.origin : (
              // This fallback is not expected to be ever reached.
              ""
            );
            break;
          case "default":
            origin = serializeOrigin(params.context.origin);
            break;
          default:
            return;
        }
        const realm = new WindowRealm_js_1.WindowRealm(this.id, __privateGet(this, _browsingContextStorage), __privateGet(this, _cdpTarget).cdpClient, __privateGet(this, _eventManager), id, __privateGet(this, _logger), origin, uniqueId, __privateGet(this, _realmStorage), sandbox);
        if (auxData.isDefault) {
          __privateGet(this, _defaultRealmDeferred).resolve(realm);
          void Promise.all(__privateGet(this, _cdpTarget).getChannels().map((channel) => channel.startListenerFromWindow(realm, __privateGet(this, _eventManager))));
        }
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Runtime.executionContextDestroyed", (params) => {
        if (__privateGet(this, _defaultRealmDeferred).isFinished && __privateGet(this, _defaultRealmDeferred).result.executionContextId === params.executionContextId) {
          __privateSet(this, _defaultRealmDeferred, new Deferred_js_1.Deferred());
        }
        __privateGet(this, _realmStorage).deleteRealms({
          cdpSessionId: __privateGet(this, _cdpTarget).cdpSessionId,
          executionContextId: params.executionContextId
        });
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Runtime.executionContextsCleared", () => {
        if (!__privateGet(this, _defaultRealmDeferred).isFinished) {
          __privateGet(this, _defaultRealmDeferred).reject(new protocol_js_1.UnknownErrorException("execution contexts cleared"));
        }
        __privateSet(this, _defaultRealmDeferred, new Deferred_js_1.Deferred());
        __privateGet(this, _realmStorage).deleteRealms({
          cdpSessionId: __privateGet(this, _cdpTarget).cdpSessionId
        });
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.javascriptDialogClosed", (params) => {
        var _a4;
        const accepted = params.result;
        if (__privateGet(this, _lastUserPromptType) === void 0) {
          (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, log_js_1.LogType.debugError, "Unexpectedly no opening prompt event before closing one");
        }
        __privateGet(this, _eventManager).registerEvent({
          type: "event",
          method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.UserPromptClosed,
          params: {
            context: this.id,
            accepted,
            // `lastUserPromptType` should never be undefined here, so fallback to
            // `UNKNOWN`. The fallback is required to prevent tests from hanging while
            // waiting for the closing event. The cast is required, as the `UNKNOWN` value
            // is not standard.
            type: __privateGet(this, _lastUserPromptType) ?? "UNKNOWN",
            userText: accepted && params.userInput ? params.userInput : void 0
          }
        }, this.id);
        __privateSet(this, _lastUserPromptType, void 0);
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Page.javascriptDialogOpening", (params) => {
        var _a4;
        const promptType = __privateMethod(_a4 = _a3, _getPromptType, getPromptType_fn).call(_a4, params.type);
        __privateSet(this, _lastUserPromptType, promptType);
        const promptHandler = __privateMethod(this, _getPromptHandler, getPromptHandler_fn).call(this, promptType);
        __privateGet(this, _eventManager).registerEvent({
          type: "event",
          method: protocol_js_1.ChromiumBidi.BrowsingContext.EventNames.UserPromptOpened,
          params: {
            context: this.id,
            handler: promptHandler,
            type: promptType,
            message: params.message,
            ...params.type === "prompt" ? { defaultValue: params.defaultPrompt } : {}
          }
        }, this.id);
        switch (promptHandler) {
          case "accept":
            void this.handleUserPrompt(true);
            break;
          case "dismiss":
            void this.handleUserPrompt(false);
            break;
          case "ignore":
            break;
        }
      });
    };
    _getPromptType = new WeakSet();
    getPromptType_fn = function(cdpType) {
      switch (cdpType) {
        case "alert":
          return "alert";
        case "beforeunload":
          return "beforeunload";
        case "confirm":
          return "confirm";
        case "prompt":
          return "prompt";
      }
    };
    _getPromptHandler = new WeakSet();
    getPromptHandler_fn = function(promptType) {
      const defaultPromptHandler = "dismiss";
      switch (promptType) {
        case "alert":
          return __privateGet(this, _unhandledPromptBehavior)?.alert ?? __privateGet(this, _unhandledPromptBehavior)?.default ?? defaultPromptHandler;
        case "beforeunload":
          return __privateGet(this, _unhandledPromptBehavior)?.beforeUnload ?? __privateGet(this, _unhandledPromptBehavior)?.default ?? "accept";
        case "confirm":
          return __privateGet(this, _unhandledPromptBehavior)?.confirm ?? __privateGet(this, _unhandledPromptBehavior)?.default ?? defaultPromptHandler;
        case "prompt":
          return __privateGet(this, _unhandledPromptBehavior)?.prompt ?? __privateGet(this, _unhandledPromptBehavior)?.default ?? defaultPromptHandler;
      }
    };
    _documentChanged = new WeakSet();
    documentChanged_fn = function(loaderId) {
      var _a4;
      if (loaderId === void 0 || __privateGet(this, _loaderId) === loaderId) {
        if (__privateGet(this, _navigation).withinDocument.isFinished) {
          __privateGet(this, _navigation).withinDocument = new Deferred_js_1.Deferred();
        } else {
          (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, _a3.LOGGER_PREFIX, "Document changed (navigatedWithinDocument)");
        }
        return;
      }
      __privateMethod(this, _resetLifecycleIfFinished, resetLifecycleIfFinished_fn).call(this);
      __privateSet(this, _loaderId, loaderId);
      __privateMethod(this, _deleteAllChildren, deleteAllChildren_fn).call(this, true);
    };
    _resetLifecycleIfFinished = new WeakSet();
    resetLifecycleIfFinished_fn = function() {
      var _a4, _b;
      if (__privateGet(this, _lifecycle).DOMContentLoaded.isFinished) {
        __privateGet(this, _lifecycle).DOMContentLoaded = new Deferred_js_1.Deferred();
      } else {
        (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, _a3.LOGGER_PREFIX, "Document changed (DOMContentLoaded)");
      }
      if (__privateGet(this, _lifecycle).load.isFinished) {
        __privateGet(this, _lifecycle).load = new Deferred_js_1.Deferred();
      } else {
        (_b = __privateGet(this, _logger)) == null ? void 0 : _b.call(this, _a3.LOGGER_PREFIX, "Document changed (load)");
      }
    };
    _failLifecycleIfNotFinished = new WeakSet();
    failLifecycleIfNotFinished_fn = function() {
      if (!__privateGet(this, _lifecycle).DOMContentLoaded.isFinished) {
        __privateGet(this, _lifecycle).DOMContentLoaded.reject(new protocol_js_1.UnknownErrorException("navigation canceled"));
      }
      if (!__privateGet(this, _lifecycle).load.isFinished) {
        __privateGet(this, _lifecycle).load.reject(new protocol_js_1.UnknownErrorException("navigation canceled"));
      }
    };
    _waitNavigation = new WeakSet();
    waitNavigation_fn = async function(wait, withinDocument) {
      if (withinDocument) {
        await __privateGet(this, _navigation).withinDocument;
        return;
      }
      switch (wait) {
        case "none":
          return;
        case "interactive":
          await __privateGet(this, _lifecycle).DOMContentLoaded;
          return;
        case "complete":
          await __privateGet(this, _lifecycle).load;
          return;
      }
    };
    _parseRect = new WeakSet();
    parseRect_fn = async function(clip) {
      switch (clip.type) {
        case "box":
          return { x: clip.x, y: clip.y, width: clip.width, height: clip.height };
        case "element": {
          const sandbox = await this.getOrCreateSandbox(void 0);
          const result = await sandbox.callFunction(String((element) => {
            return element instanceof Element;
          }), false, { type: "undefined" }, [clip.element]);
          if (result.type === "exception") {
            throw new protocol_js_1.NoSuchElementException(`Element '${clip.element.sharedId}' was not found`);
          }
          (0, assert_js_1.assert)(result.result.type === "boolean");
          if (!result.result.value) {
            throw new protocol_js_1.NoSuchElementException(`Node '${clip.element.sharedId}' is not an Element`);
          }
          {
            const result2 = await sandbox.callFunction(String((element) => {
              const rect2 = element.getBoundingClientRect();
              return {
                x: rect2.x,
                y: rect2.y,
                height: rect2.height,
                width: rect2.width
              };
            }), false, { type: "undefined" }, [clip.element]);
            (0, assert_js_1.assert)(result2.type === "success");
            const rect = deserializeDOMRect(result2.result);
            if (!rect) {
              throw new protocol_js_1.UnableToCaptureScreenException(`Could not get bounding box for Element '${clip.element.sharedId}'`);
            }
            return rect;
          }
        }
      }
    };
    _getLocatorDelegate = new WeakSet();
    getLocatorDelegate_fn = async function(realm, locator, maxNodeCount, startNodes) {
      switch (locator.type) {
        case "css":
          return {
            functionDeclaration: String((cssSelector, maxNodeCount2, ...startNodes2) => {
              const locateNodesUsingCss = (element) => {
                if (!(element instanceof HTMLElement || element instanceof Document || element instanceof DocumentFragment)) {
                  throw new Error("startNodes in css selector should be HTMLElement, Document or DocumentFragment");
                }
                return [...element.querySelectorAll(cssSelector)];
              };
              startNodes2 = startNodes2.length > 0 ? startNodes2 : [document];
              const returnedNodes = startNodes2.map((startNode) => (
                // TODO: stop search early if `maxNodeCount` is reached.
                locateNodesUsingCss(startNode)
              )).flat(1);
              return maxNodeCount2 === 0 ? returnedNodes : returnedNodes.slice(0, maxNodeCount2);
            }),
            argumentsLocalValues: [
              // `cssSelector`
              { type: "string", value: locator.value },
              // `maxNodeCount` with `0` means no limit.
              { type: "number", value: maxNodeCount ?? 0 },
              // `startNodes`
              ...startNodes
            ]
          };
        case "xpath":
          return {
            functionDeclaration: String((xPathSelector, maxNodeCount2, ...startNodes2) => {
              const evaluator = new XPathEvaluator();
              const expression = evaluator.createExpression(xPathSelector);
              const locateNodesUsingXpath = (element) => {
                const xPathResult = expression.evaluate(element, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
                const returnedNodes2 = [];
                for (let i = 0; i < xPathResult.snapshotLength; i++) {
                  returnedNodes2.push(xPathResult.snapshotItem(i));
                }
                return returnedNodes2;
              };
              startNodes2 = startNodes2.length > 0 ? startNodes2 : [document];
              const returnedNodes = startNodes2.map((startNode) => (
                // TODO: stop search early if `maxNodeCount` is reached.
                locateNodesUsingXpath(startNode)
              )).flat(1);
              return maxNodeCount2 === 0 ? returnedNodes : returnedNodes.slice(0, maxNodeCount2);
            }),
            argumentsLocalValues: [
              // `xPathSelector`
              { type: "string", value: locator.value },
              // `maxNodeCount` with `0` means no limit.
              { type: "number", value: maxNodeCount ?? 0 },
              // `startNodes`
              ...startNodes
            ]
          };
        case "innerText":
          if (locator.value === "") {
            throw new protocol_js_1.InvalidSelectorException("innerText locator cannot be empty");
          }
          return {
            functionDeclaration: String((innerTextSelector, fullMatch, ignoreCase, maxNodeCount2, maxDepth, ...startNodes2) => {
              const searchText = ignoreCase ? innerTextSelector.toUpperCase() : innerTextSelector;
              const locateNodesUsingInnerText = (node, currentMaxDepth) => {
                const returnedNodes2 = [];
                if (node instanceof DocumentFragment || node instanceof Document) {
                  const children = [...node.children];
                  children.forEach((child) => (
                    // `currentMaxDepth` is not decremented intentionally according to
                    // https://github.com/w3c/webdriver-bidi/pull/713.
                    returnedNodes2.push(...locateNodesUsingInnerText(child, currentMaxDepth))
                  ));
                  return returnedNodes2;
                }
                if (!(node instanceof HTMLElement)) {
                  return [];
                }
                const element = node;
                const nodeInnerText = ignoreCase ? element.innerText?.toUpperCase() : element.innerText;
                if (!nodeInnerText.includes(searchText)) {
                  return [];
                }
                const childNodes = [];
                for (const child of element.children) {
                  if (child instanceof HTMLElement) {
                    childNodes.push(child);
                  }
                }
                if (childNodes.length === 0) {
                  if (fullMatch && nodeInnerText === searchText) {
                    returnedNodes2.push(element);
                  } else {
                    if (!fullMatch) {
                      returnedNodes2.push(element);
                    }
                  }
                } else {
                  const childNodeMatches = (
                    // Don't search deeper if `maxDepth` is reached.
                    currentMaxDepth <= 0 ? [] : childNodes.map((child) => locateNodesUsingInnerText(child, currentMaxDepth - 1)).flat(1)
                  );
                  if (childNodeMatches.length === 0) {
                    if (!fullMatch || nodeInnerText === searchText) {
                      returnedNodes2.push(element);
                    }
                  } else {
                    returnedNodes2.push(...childNodeMatches);
                  }
                }
                return returnedNodes2;
              };
              startNodes2 = startNodes2.length > 0 ? startNodes2 : [document];
              const returnedNodes = startNodes2.map((startNode) => (
                // TODO: stop search early if `maxNodeCount` is reached.
                locateNodesUsingInnerText(startNode, maxDepth)
              )).flat(1);
              return maxNodeCount2 === 0 ? returnedNodes : returnedNodes.slice(0, maxNodeCount2);
            }),
            argumentsLocalValues: [
              // `innerTextSelector`
              { type: "string", value: locator.value },
              // `fullMatch` with default `true`.
              { type: "boolean", value: locator.matchType !== "partial" },
              // `ignoreCase` with default `false`.
              { type: "boolean", value: locator.ignoreCase === true },
              // `maxNodeCount` with `0` means no limit.
              { type: "number", value: maxNodeCount ?? 0 },
              // `maxDepth` with default `1000` (same as default full serialization depth).
              { type: "number", value: locator.maxDepth ?? 1e3 },
              // `startNodes`
              ...startNodes
            ]
          };
        case "accessibility": {
          if (!locator.value.name && !locator.value.role) {
            throw new protocol_js_1.InvalidSelectorException("Either name or role has to be specified");
          }
          await Promise.all([
            __privateGet(this, _cdpTarget).cdpClient.sendCommand("Accessibility.enable"),
            __privateGet(this, _cdpTarget).cdpClient.sendCommand("Accessibility.getRootAXNode")
          ]);
          const bindings = await realm.evaluate(
            /* expression=*/
            "({getAccessibleName, getAccessibleRole})",
            /* awaitPromise=*/
            false,
            "root",
            /* serializationOptions= */
            void 0,
            /* userActivation=*/
            false,
            /* includeCommandLineApi=*/
            true
          );
          if (bindings.type !== "success") {
            throw new Error("Could not get bindings");
          }
          if (bindings.result.type !== "object") {
            throw new Error("Could not get bindings");
          }
          return {
            functionDeclaration: String((name, role, bindings2, maxNodeCount2, ...startNodes2) => {
              const returnedNodes = [];
              let aborted = false;
              function collect(contextNodes, selector) {
                if (aborted) {
                  return;
                }
                for (const contextNode of contextNodes) {
                  let match = true;
                  if (selector.role) {
                    const role2 = bindings2.getAccessibleRole(contextNode);
                    if (selector.role !== role2) {
                      match = false;
                    }
                  }
                  if (selector.name) {
                    const name2 = bindings2.getAccessibleName(contextNode);
                    if (selector.name !== name2) {
                      match = false;
                    }
                  }
                  if (match) {
                    if (maxNodeCount2 !== 0 && returnedNodes.length === maxNodeCount2) {
                      aborted = true;
                      break;
                    }
                    returnedNodes.push(contextNode);
                  }
                  const childNodes = [];
                  for (const child of contextNode.children) {
                    if (child instanceof HTMLElement) {
                      childNodes.push(child);
                    }
                  }
                  collect(childNodes, selector);
                }
              }
              startNodes2 = startNodes2.length > 0 ? startNodes2 : Array.from(document.documentElement.children).filter((c) => c instanceof HTMLElement);
              collect(startNodes2, {
                role,
                name
              });
              return returnedNodes;
            }),
            argumentsLocalValues: [
              // `name`
              { type: "string", value: locator.value.name || "" },
              // `role`
              { type: "string", value: locator.value.role || "" },
              // `bindings`.
              { handle: bindings.result.handle },
              // `maxNodeCount` with `0` means no limit.
              { type: "number", value: maxNodeCount ?? 0 },
              // `startNodes`
              ...startNodes
            ]
          };
        }
      }
    };
    _locateNodesByLocator = new WeakSet();
    locateNodesByLocator_fn = async function(realm, locator, startNodes, maxNodeCount, serializationOptions) {
      var _a4;
      const locatorDelegate = await __privateMethod(this, _getLocatorDelegate, getLocatorDelegate_fn).call(this, realm, locator, maxNodeCount, startNodes);
      serializationOptions = {
        ...serializationOptions,
        // The returned object is an array of nodes, so no need in deeper JS serialization.
        maxObjectDepth: 1
      };
      const locatorResult = await realm.callFunction(locatorDelegate.functionDeclaration, false, { type: "undefined" }, locatorDelegate.argumentsLocalValues, "none", serializationOptions);
      if (locatorResult.type !== "success") {
        (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, _a3.LOGGER_PREFIX, "Failed locateNodesByLocator", locatorResult);
        if (
          // CSS selector.
          locatorResult.exceptionDetails.text?.endsWith("is not a valid selector.") || // XPath selector.
          locatorResult.exceptionDetails.text?.endsWith("is not a valid XPath expression.")
        ) {
          throw new protocol_js_1.InvalidSelectorException(`Not valid selector ${typeof locator.value === "string" ? locator.value : JSON.stringify(locator.value)}`);
        }
        if (locatorResult.exceptionDetails.text === "Error: startNodes in css selector should be HTMLElement, Document or DocumentFragment") {
          throw new protocol_js_1.InvalidArgumentException("startNodes in css selector should be HTMLElement, Document or DocumentFragment");
        }
        throw new protocol_js_1.UnknownErrorException(`Unexpected error in selector script: ${locatorResult.exceptionDetails.text}`);
      }
      if (locatorResult.result.type !== "array") {
        throw new protocol_js_1.UnknownErrorException(`Unexpected selector script result type: ${locatorResult.result.type}`);
      }
      const nodes = locatorResult.result.value.map((value) => {
        if (value.type !== "node") {
          throw new protocol_js_1.UnknownErrorException(`Unexpected selector script result element: ${value.type}`);
        }
        return value;
      });
      return { nodes };
    };
    __privateAdd(BrowsingContextImpl, _getPromptType);
    __publicField(BrowsingContextImpl, "LOGGER_PREFIX", `${log_js_1.LogType.debug}:browsingContext`);
    exports.BrowsingContextImpl = BrowsingContextImpl;
    _a3 = BrowsingContextImpl;
    function serializeOrigin(origin) {
      if (["://", ""].includes(origin)) {
        origin = "null";
      }
      return origin;
    }
    function getImageFormatParameters(params) {
      const { quality, type } = params.format ?? {
        type: "image/png"
      };
      switch (type) {
        case "image/png": {
          return { format: "png" };
        }
        case "image/jpeg": {
          return {
            format: "jpeg",
            ...quality === void 0 ? {} : { quality: Math.round(quality * 100) }
          };
        }
        case "image/webp": {
          return {
            format: "webp",
            ...quality === void 0 ? {} : { quality: Math.round(quality * 100) }
          };
        }
      }
      throw new protocol_js_1.InvalidArgumentException(`Image format '${type}' is not a supported format`);
    }
    function deserializeDOMRect(result) {
      if (result.type !== "object" || result.value === void 0) {
        return;
      }
      const x = result.value.find(([key]) => {
        return key === "x";
      })?.[1];
      const y = result.value.find(([key]) => {
        return key === "y";
      })?.[1];
      const height = result.value.find(([key]) => {
        return key === "height";
      })?.[1];
      const width = result.value.find(([key]) => {
        return key === "width";
      })?.[1];
      if (x?.type !== "number" || y?.type !== "number" || height?.type !== "number" || width?.type !== "number") {
        return;
      }
      return {
        x: x.value,
        y: y.value,
        width: width.value,
        height: height.value
      };
    }
    function normalizeRect(box) {
      return {
        ...box.width < 0 ? {
          x: box.x + box.width,
          width: -box.width
        } : {
          x: box.x,
          width: box.width
        },
        ...box.height < 0 ? {
          y: box.y + box.height,
          height: -box.height
        } : {
          y: box.y,
          height: box.height
        }
      };
    }
    function getIntersectionRect(first2, second) {
      first2 = normalizeRect(first2);
      second = normalizeRect(second);
      const x = Math.max(first2.x, second.x);
      const y = Math.max(first2.y, second.y);
      return {
        x,
        y,
        width: Math.max(Math.min(first2.x + first2.width, second.x + second.width) - x, 0),
        height: Math.max(Math.min(first2.y + first2.height, second.y + second.height) - y, 0)
      };
    }
    function parseInteger(value) {
      value = value.trim();
      if (!/^[0-9]+$/.test(value)) {
        throw new protocol_js_1.InvalidArgumentException(`Invalid integer: ${value}`);
      }
      return parseInt(value);
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/WorkerRealm.js
var require_WorkerRealm = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/WorkerRealm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkerRealm = void 0;
    var Realm_js_1 = require_Realm();
    var WorkerRealm = class extends Realm_js_1.Realm {
      #realmType;
      #ownerRealms;
      constructor(cdpClient, eventManager, executionContextId, logger, origin, ownerRealms, realmId, realmStorage, realmType) {
        super(cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage);
        this.#ownerRealms = ownerRealms;
        this.#realmType = realmType;
        this.initialize();
      }
      get associatedBrowsingContexts() {
        return this.#ownerRealms.flatMap((realm) => realm.associatedBrowsingContexts);
      }
      get realmType() {
        return this.#realmType;
      }
      get source() {
        return {
          realm: this.realmId,
          // This is a hack to make Puppeteer able to track workers.
          // TODO: remove after Puppeteer tracks workers by owners and use the base version.
          context: this.associatedBrowsingContexts[0]?.id
        };
      }
      get realmInfo() {
        const owners = this.#ownerRealms.map((realm) => realm.realmId);
        const { realmType } = this;
        switch (realmType) {
          case "dedicated-worker": {
            const owner = owners[0];
            if (owner === void 0 || owners.length !== 1) {
              throw new Error("Dedicated worker must have exactly one owner");
            }
            return {
              ...this.baseInfo,
              type: realmType,
              owners: [owner]
            };
          }
          case "service-worker":
          case "shared-worker": {
            return {
              ...this.baseInfo,
              type: realmType
            };
          }
        }
      }
    };
    exports.WorkerRealm = WorkerRealm;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/log/logHelper.js
var require_logHelper = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/log/logHelper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logMessageFormatter = logMessageFormatter;
    exports.getRemoteValuesText = getRemoteValuesText;
    var assert_js_1 = require_assert();
    var specifiers = ["%s", "%d", "%i", "%f", "%o", "%O", "%c"];
    function isFormatSpecifier(str) {
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
        if (isFormatSpecifier(token)) {
          const arg = argValues.shift();
          (0, assert_js_1.assert)(arg, `Less value is provided: "${getRemoteValuesText(args, false)}"`);
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
      throw Error(`Invalid value type: ${arg}`);
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
          return `Map(${arg.value?.length})`;
        case "set":
          return `Set(${arg.value?.length})`;
        default:
          return arg.type;
      }
    }
    function getRemoteValuesText(args, formatText) {
      const arg = args[0];
      if (!arg) {
        return "";
      }
      if (arg.type === "string" && isFormatSpecifier(arg.value.toString()) && formatText) {
        return logMessageFormatter(args);
      }
      return args.map((arg2) => {
        return stringFromArg(arg2);
      }).join(" ");
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/log/LogManager.js
var require_LogManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/log/LogManager.js"(exports) {
    "use strict";
    var _a3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogManager = void 0;
    var protocol_js_1 = require_protocol();
    var log_js_1 = require_log();
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
      if (["error", "assert"].includes(consoleApiType)) {
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
    function getLogMethod(consoleApiType) {
      switch (consoleApiType) {
        case "warning":
          return "warn";
        case "startGroup":
          return "group";
        case "startGroupCollapsed":
          return "groupCollapsed";
        case "endGroup":
          return "groupEnd";
      }
      return consoleApiType;
    }
    var _eventManager, _realmStorage, _cdpTarget, _logger, _heuristicSerializeArg, heuristicSerializeArg_fn, _initializeEntryAddedEventListener, initializeEntryAddedEventListener_fn, _getExceptionText, getExceptionText_fn;
    var LogManager = class {
      constructor(cdpTarget, realmStorage, eventManager, logger) {
        /**
         * Heuristic serialization of CDP remote object. If possible, return the BiDi value
         * without deep serialization.
         */
        __privateAdd(this, _heuristicSerializeArg);
        __privateAdd(this, _initializeEntryAddedEventListener);
        __privateAdd(this, _eventManager, void 0);
        __privateAdd(this, _realmStorage, void 0);
        __privateAdd(this, _cdpTarget, void 0);
        __privateAdd(this, _logger, void 0);
        __privateSet(this, _cdpTarget, cdpTarget);
        __privateSet(this, _realmStorage, realmStorage);
        __privateSet(this, _eventManager, eventManager);
        __privateSet(this, _logger, logger);
      }
      static create(cdpTarget, realmStorage, eventManager, logger) {
        var _a4;
        const logManager = new _a3(cdpTarget, realmStorage, eventManager, logger);
        __privateMethod(_a4 = logManager, _initializeEntryAddedEventListener, initializeEntryAddedEventListener_fn).call(_a4);
        return logManager;
      }
    };
    _eventManager = new WeakMap();
    _realmStorage = new WeakMap();
    _cdpTarget = new WeakMap();
    _logger = new WeakMap();
    _heuristicSerializeArg = new WeakSet();
    heuristicSerializeArg_fn = async function(arg, realm) {
      switch (arg.type) {
        case "undefined":
          return { type: "undefined" };
        case "boolean":
          return { type: "boolean", value: arg.value };
        case "string":
          return { type: "string", value: arg.value };
        case "number":
          return { type: "number", value: arg.unserializableValue ?? arg.value };
        case "bigint":
          if (arg.unserializableValue !== void 0 && arg.unserializableValue[arg.unserializableValue.length - 1] === "n") {
            return {
              type: arg.type,
              value: arg.unserializableValue.slice(0, -1)
            };
          }
          break;
        case "object":
          if (arg.subtype === "null") {
            return { type: "null" };
          }
          break;
        default:
          break;
      }
      return await realm.serializeCdpObject(
        arg,
        "none"
        /* Script.ResultOwnership.None */
      );
    };
    _initializeEntryAddedEventListener = new WeakSet();
    initializeEntryAddedEventListener_fn = function() {
      __privateGet(this, _cdpTarget).cdpClient.on("Runtime.consoleAPICalled", (params) => {
        var _a4;
        const realm = __privateGet(this, _realmStorage).findRealm({
          cdpSessionId: __privateGet(this, _cdpTarget).cdpSessionId,
          executionContextId: params.executionContextId
        });
        if (realm === void 0) {
          (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, log_js_1.LogType.cdp, params);
          return;
        }
        const argsPromise = Promise.all(params.args.map((arg) => __privateMethod(this, _heuristicSerializeArg, heuristicSerializeArg_fn).call(this, arg, realm)));
        for (const browsingContext of realm.associatedBrowsingContexts) {
          __privateGet(this, _eventManager).registerPromiseEvent(argsPromise.then((args) => ({
            kind: "success",
            value: {
              type: "event",
              method: protocol_js_1.ChromiumBidi.Log.EventNames.LogEntryAdded,
              params: {
                level: getLogLevel(params.type),
                source: realm.source,
                text: (0, logHelper_js_1.getRemoteValuesText)(args, true),
                timestamp: Math.round(params.timestamp),
                stackTrace: getBidiStackTrace(params.stackTrace),
                type: "console",
                method: getLogMethod(params.type),
                args
              }
            }
          }), (error) => ({
            kind: "error",
            error
          })), browsingContext.id, protocol_js_1.ChromiumBidi.Log.EventNames.LogEntryAdded);
        }
      });
      __privateGet(this, _cdpTarget).cdpClient.on("Runtime.exceptionThrown", (params) => {
        var _a4, _b;
        const realm = __privateGet(this, _realmStorage).findRealm({
          cdpSessionId: __privateGet(this, _cdpTarget).cdpSessionId,
          executionContextId: params.exceptionDetails.executionContextId
        });
        if (realm === void 0) {
          (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, log_js_1.LogType.cdp, params);
          return;
        }
        for (const browsingContext of realm.associatedBrowsingContexts) {
          __privateGet(this, _eventManager).registerPromiseEvent(__privateMethod(_b = _a3, _getExceptionText, getExceptionText_fn).call(_b, params, realm).then((text) => ({
            kind: "success",
            value: {
              type: "event",
              method: protocol_js_1.ChromiumBidi.Log.EventNames.LogEntryAdded,
              params: {
                level: "error",
                source: realm.source,
                text,
                timestamp: Math.round(params.timestamp),
                stackTrace: getBidiStackTrace(params.exceptionDetails.stackTrace),
                type: "javascript"
              }
            }
          }), (error) => ({
            kind: "error",
            error
          })), browsingContext.id, protocol_js_1.ChromiumBidi.Log.EventNames.LogEntryAdded);
        }
      });
    };
    _getExceptionText = new WeakSet();
    getExceptionText_fn = async function(params, realm) {
      if (!params.exceptionDetails.exception) {
        return params.exceptionDetails.text;
      }
      if (realm === void 0) {
        return JSON.stringify(params.exceptionDetails.exception);
      }
      return await realm.stringifyObject(params.exceptionDetails.exception);
    };
    /**
     * Try the best to get the exception text.
     */
    __privateAdd(LogManager, _getExceptionText);
    exports.LogManager = LogManager;
    _a3 = LogManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/cdp/CdpTarget.js
var require_CdpTarget = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/cdp/CdpTarget.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CdpTarget = void 0;
    var chromium_bidi_js_1 = require_chromium_bidi();
    var Deferred_js_1 = require_Deferred();
    var log_js_1 = require_log();
    var BrowsingContextImpl_js_1 = require_BrowsingContextImpl();
    var LogManager_js_1 = require_LogManager();
    var CdpTarget = class {
      #id;
      #cdpClient;
      #browserCdpClient;
      #realmStorage;
      #eventManager;
      #preloadScriptStorage;
      #browsingContextStorage;
      #networkStorage;
      #unblocked = new Deferred_js_1.Deferred();
      #unhandledPromptBehavior;
      #logger;
      #deviceAccessEnabled = false;
      #cacheDisableState = false;
      #networkDomainEnabled = false;
      #fetchDomainStages = {
        request: false,
        response: false,
        auth: false
      };
      static create(targetId, cdpClient, browserCdpClient, realmStorage, eventManager, preloadScriptStorage, browsingContextStorage, networkStorage, unhandledPromptBehavior, logger) {
        const cdpTarget = new CdpTarget(targetId, cdpClient, browserCdpClient, eventManager, realmStorage, preloadScriptStorage, browsingContextStorage, networkStorage, unhandledPromptBehavior, logger);
        LogManager_js_1.LogManager.create(cdpTarget, realmStorage, eventManager, logger);
        cdpTarget.#setEventListeners();
        void cdpTarget.#unblock();
        return cdpTarget;
      }
      constructor(targetId, cdpClient, browserCdpClient, eventManager, realmStorage, preloadScriptStorage, browsingContextStorage, networkStorage, unhandledPromptBehavior, logger) {
        this.#id = targetId;
        this.#cdpClient = cdpClient;
        this.#browserCdpClient = browserCdpClient;
        this.#eventManager = eventManager;
        this.#realmStorage = realmStorage;
        this.#preloadScriptStorage = preloadScriptStorage;
        this.#networkStorage = networkStorage;
        this.#browsingContextStorage = browsingContextStorage;
        this.#unhandledPromptBehavior = unhandledPromptBehavior;
        this.#logger = logger;
      }
      /** Returns a deferred that resolves when the target is unblocked. */
      get unblocked() {
        return this.#unblocked;
      }
      get id() {
        return this.#id;
      }
      get cdpClient() {
        return this.#cdpClient;
      }
      get browserCdpClient() {
        return this.#browserCdpClient;
      }
      /** Needed for CDP escape path. */
      get cdpSessionId() {
        return this.#cdpClient.sessionId;
      }
      /**
       * Enables all the required CDP domains and unblocks the target.
       */
      async #unblock() {
        try {
          await Promise.all([
            this.#cdpClient.sendCommand("Page.enable"),
            // There can be some existing frames in the target, if reconnecting to an
            // existing browser instance, e.g. via Puppeteer. Need to restore the browsing
            // contexts for the frames to correctly handle further events, like
            // `Runtime.executionContextCreated`.
            // It's important to schedule this task together with enabling domains commands to
            // prepare the tree before the events (e.g. Runtime.executionContextCreated) start
            // coming.
            // https://github.com/GoogleChromeLabs/chromium-bidi/issues/2282
            this.#cdpClient.sendCommand("Page.getFrameTree").then((frameTree) => this.#restoreFrameTreeState(frameTree.frameTree)),
            this.#cdpClient.sendCommand("Runtime.enable"),
            this.#cdpClient.sendCommand("Page.setLifecycleEventsEnabled", {
              enabled: true
            }),
            this.toggleNetworkIfNeeded(),
            this.#cdpClient.sendCommand("Target.setAutoAttach", {
              autoAttach: true,
              waitForDebuggerOnStart: true,
              flatten: true
            }),
            this.#initAndEvaluatePreloadScripts(),
            this.#cdpClient.sendCommand("Runtime.runIfWaitingForDebugger"),
            this.toggleDeviceAccessIfNeeded()
          ]);
        } catch (error) {
          this.#logger?.(log_js_1.LogType.debugError, "Failed to unblock target", error);
          if (!this.#cdpClient.isCloseError(error)) {
            this.#unblocked.resolve({
              kind: "error",
              error
            });
            return;
          }
        }
        this.#unblocked.resolve({
          kind: "success",
          value: void 0
        });
      }
      #restoreFrameTreeState(frameTree) {
        const frame = frameTree.frame;
        const maybeContext = this.#browsingContextStorage.findContext(frame.id);
        if (maybeContext !== void 0) {
          if (maybeContext.parentId === null && frame.parentId !== null && frame.parentId !== void 0) {
            maybeContext.parentId = frame.parentId;
          }
        }
        if (maybeContext === void 0 && frame.parentId !== void 0) {
          const parentBrowsingContext = this.#browsingContextStorage.getContext(frame.parentId);
          BrowsingContextImpl_js_1.BrowsingContextImpl.create(frame.id, frame.parentId, parentBrowsingContext.userContext, parentBrowsingContext.cdpTarget, this.#eventManager, this.#browsingContextStorage, this.#realmStorage, frame.url, void 0, this.#unhandledPromptBehavior, this.#logger);
        }
        frameTree.childFrames?.map((frameTree2) => this.#restoreFrameTreeState(frameTree2));
      }
      async toggleFetchIfNeeded() {
        const stages = this.#networkStorage.getInterceptionStages(this.topLevelId);
        if (
          // Only toggle interception when Network is enabled
          !this.#networkDomainEnabled || this.#fetchDomainStages.request === stages.request && this.#fetchDomainStages.response === stages.response && this.#fetchDomainStages.auth === stages.auth
        ) {
          return;
        }
        const patterns = [];
        this.#fetchDomainStages = stages;
        if (stages.request || stages.auth) {
          patterns.push({
            urlPattern: "*",
            requestStage: "Request"
          });
        }
        if (stages.response) {
          patterns.push({
            urlPattern: "*",
            requestStage: "Response"
          });
        }
        if (patterns.length) {
          await this.#cdpClient.sendCommand("Fetch.enable", {
            patterns,
            handleAuthRequests: stages.auth
          });
        } else {
          await this.#cdpClient.sendCommand("Fetch.disable");
        }
      }
      /**
       * Toggles both Network and Fetch domains.
       */
      async toggleNetworkIfNeeded() {
        const enabled = this.isSubscribedTo(chromium_bidi_js_1.BiDiModule.Network);
        if (enabled === this.#networkDomainEnabled) {
          return;
        }
        this.#networkDomainEnabled = enabled;
        try {
          await Promise.all([
            this.#cdpClient.sendCommand(enabled ? "Network.enable" : "Network.disable").then(async () => await this.toggleSetCacheDisabled()),
            this.toggleFetchIfNeeded()
          ]);
        } catch (err) {
          this.#logger?.(log_js_1.LogType.debugError, err);
          this.#networkDomainEnabled = !enabled;
          if (!this.#isExpectedError(err)) {
            throw err;
          }
        }
      }
      async toggleSetCacheDisabled(disable) {
        const defaultCacheDisabled = this.#networkStorage.defaultCacheBehavior === "bypass";
        const cacheDisabled = disable ?? defaultCacheDisabled;
        if (!this.#networkDomainEnabled || this.#cacheDisableState === cacheDisabled) {
          return;
        }
        this.#cacheDisableState = cacheDisabled;
        try {
          await this.#cdpClient.sendCommand("Network.setCacheDisabled", {
            cacheDisabled
          });
        } catch (err) {
          this.#logger?.(log_js_1.LogType.debugError, err);
          this.#cacheDisableState = !cacheDisabled;
          if (!this.#isExpectedError(err)) {
            throw err;
          }
        }
      }
      async toggleDeviceAccessIfNeeded() {
        const enabled = this.isSubscribedTo(chromium_bidi_js_1.BiDiModule.Bluetooth);
        if (this.#deviceAccessEnabled === enabled) {
          return;
        }
        this.#deviceAccessEnabled = enabled;
        try {
          await this.#cdpClient.sendCommand(enabled ? "DeviceAccess.enable" : "DeviceAccess.disable");
        } catch (err) {
          this.#logger?.(log_js_1.LogType.debugError, err);
          this.#deviceAccessEnabled = !enabled;
          if (!this.#isExpectedError(err)) {
            throw err;
          }
        }
      }
      /**
       * Heuristic checking if the error is due to the session being closed. If so, ignore the
       * error.
       */
      #isExpectedError(err) {
        const error = err;
        return error.code === -32001 && error.message === "Session with given id not found.";
      }
      #setEventListeners() {
        this.#cdpClient.on("*", (event, params) => {
          if (typeof event !== "string") {
            return;
          }
          this.#eventManager.registerEvent({
            type: "event",
            method: `cdp.${event}`,
            params: {
              event,
              params,
              session: this.cdpSessionId
            }
          }, this.id);
        });
      }
      /**
       * All the ProxyChannels from all the preload scripts of the given
       * BrowsingContext.
       */
      getChannels() {
        return this.#preloadScriptStorage.find().flatMap((script) => script.channels);
      }
      /** Loads all top-level preload scripts. */
      async #initAndEvaluatePreloadScripts() {
        await Promise.all(this.#preloadScriptStorage.find({
          // Needed for OOPIF
          targetId: this.topLevelId,
          global: true
        }).map((script) => {
          return script.initInTarget(this, true);
        }));
      }
      get topLevelId() {
        return this.#browsingContextStorage.findTopLevelContextId(this.id) ?? this.id;
      }
      isSubscribedTo(moduleOrEvent) {
        return this.#eventManager.subscriptionManager.isSubscribedTo(moduleOrEvent, this.topLevelId);
      }
    };
    exports.CdpTarget = CdpTarget;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/cdp/CdpTargetManager.js
var require_CdpTargetManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/cdp/CdpTargetManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CdpTargetManager = void 0;
    var log_js_1 = require_log();
    var BrowsingContextImpl_js_1 = require_BrowsingContextImpl();
    var WorkerRealm_js_1 = require_WorkerRealm();
    var CdpTarget_js_1 = require_CdpTarget();
    var cdpToBidiTargetTypes = {
      service_worker: "service-worker",
      shared_worker: "shared-worker",
      worker: "dedicated-worker"
    };
    var CdpTargetManager = class {
      #browserCdpClient;
      #cdpConnection;
      #targetKeysToBeIgnoredByAutoAttach = /* @__PURE__ */ new Set();
      #selfTargetId;
      #eventManager;
      #browsingContextStorage;
      #networkStorage;
      #bluetoothProcessor;
      #preloadScriptStorage;
      #realmStorage;
      #defaultUserContextId;
      #logger;
      #unhandledPromptBehavior;
      constructor(cdpConnection, browserCdpClient, selfTargetId, eventManager, browsingContextStorage, realmStorage, networkStorage, bluetoothProcessor, preloadScriptStorage, defaultUserContextId, unhandledPromptBehavior, logger) {
        this.#cdpConnection = cdpConnection;
        this.#browserCdpClient = browserCdpClient;
        this.#targetKeysToBeIgnoredByAutoAttach.add(selfTargetId);
        this.#selfTargetId = selfTargetId;
        this.#eventManager = eventManager;
        this.#browsingContextStorage = browsingContextStorage;
        this.#preloadScriptStorage = preloadScriptStorage;
        this.#networkStorage = networkStorage;
        this.#bluetoothProcessor = bluetoothProcessor;
        this.#realmStorage = realmStorage;
        this.#defaultUserContextId = defaultUserContextId;
        this.#unhandledPromptBehavior = unhandledPromptBehavior;
        this.#logger = logger;
        this.#setEventListeners(browserCdpClient);
      }
      /**
       * This method is called for each CDP session, since this class is responsible
       * for creating and destroying all targets and browsing contexts.
       */
      #setEventListeners(cdpClient) {
        cdpClient.on("Target.attachedToTarget", (params) => {
          this.#handleAttachedToTargetEvent(params, cdpClient);
        });
        cdpClient.on("Target.detachedFromTarget", this.#handleDetachedFromTargetEvent.bind(this));
        cdpClient.on("Target.targetInfoChanged", this.#handleTargetInfoChangedEvent.bind(this));
        cdpClient.on("Inspector.targetCrashed", () => {
          this.#handleTargetCrashedEvent(cdpClient);
        });
        cdpClient.on("Page.frameAttached", this.#handleFrameAttachedEvent.bind(this));
        cdpClient.on("Page.frameDetached", this.#handleFrameDetachedEvent.bind(this));
        cdpClient.on("Page.frameSubtreeWillBeDetached", this.#handleFrameSubtreeWillBeDetached.bind(this));
      }
      #handleFrameAttachedEvent(params) {
        const parentBrowsingContext = this.#browsingContextStorage.findContext(params.parentFrameId);
        if (parentBrowsingContext !== void 0) {
          BrowsingContextImpl_js_1.BrowsingContextImpl.create(
            params.frameId,
            params.parentFrameId,
            parentBrowsingContext.userContext,
            parentBrowsingContext.cdpTarget,
            this.#eventManager,
            this.#browsingContextStorage,
            this.#realmStorage,
            // At this point, we don't know the URL of the frame yet, so it will be updated
            // later.
            "about:blank",
            void 0,
            this.#unhandledPromptBehavior,
            this.#logger
          );
        }
      }
      #handleFrameDetachedEvent(params) {
        if (params.reason === "swap") {
          return;
        }
        this.#browsingContextStorage.findContext(params.frameId)?.dispose(true);
      }
      #handleFrameSubtreeWillBeDetached(params) {
        this.#browsingContextStorage.findContext(params.frameId)?.dispose(true);
      }
      #handleAttachedToTargetEvent(params, parentSessionCdpClient) {
        const { sessionId, targetInfo } = params;
        const targetCdpClient = this.#cdpConnection.getCdpClient(sessionId);
        const detach = async () => {
          await targetCdpClient.sendCommand("Runtime.runIfWaitingForDebugger").then(() => parentSessionCdpClient.sendCommand("Target.detachFromTarget", params)).catch((error) => this.#logger?.(log_js_1.LogType.debugError, error));
        };
        if (this.#selfTargetId !== targetInfo.targetId) {
          const targetKey = targetInfo.type === "service_worker" ? `${parentSessionCdpClient.sessionId}_${targetInfo.targetId}` : targetInfo.targetId;
          if (this.#targetKeysToBeIgnoredByAutoAttach.has(targetKey)) {
            return;
          }
          this.#targetKeysToBeIgnoredByAutoAttach.add(targetKey);
        }
        switch (targetInfo.type) {
          case "page":
          case "iframe": {
            if (this.#selfTargetId === targetInfo.targetId) {
              void detach();
              return;
            }
            const cdpTarget = this.#createCdpTarget(targetCdpClient, targetInfo);
            const maybeContext = this.#browsingContextStorage.findContext(targetInfo.targetId);
            if (maybeContext && targetInfo.type === "iframe") {
              maybeContext.updateCdpTarget(cdpTarget);
            } else {
              const userContext = targetInfo.browserContextId && targetInfo.browserContextId !== this.#defaultUserContextId ? targetInfo.browserContextId : "default";
              BrowsingContextImpl_js_1.BrowsingContextImpl.create(
                targetInfo.targetId,
                null,
                userContext,
                cdpTarget,
                this.#eventManager,
                this.#browsingContextStorage,
                this.#realmStorage,
                // Hack: when a new target created, CDP emits targetInfoChanged with an empty
                // url, and navigates it to about:blank later. When the event is emitted for
                // an existing target (reconnect), the url is already known, and navigation
                // events will not be emitted anymore. Replacing empty url with `about:blank`
                // allows to handle both cases in the same way.
                // "7.3.2.1 Creating browsing contexts".
                // https://html.spec.whatwg.org/multipage/document-sequences.html#creating-browsing-contexts
                // TODO: check who to deal with non-null creator and its `creatorOrigin`.
                targetInfo.url === "" ? "about:blank" : targetInfo.url,
                targetInfo.openerFrameId ?? targetInfo.openerId,
                this.#unhandledPromptBehavior,
                this.#logger
              );
            }
            return;
          }
          case "service_worker":
          case "worker": {
            const realm = this.#realmStorage.findRealm({
              cdpSessionId: parentSessionCdpClient.sessionId
            });
            if (!realm) {
              void detach();
              return;
            }
            const cdpTarget = this.#createCdpTarget(targetCdpClient, targetInfo);
            this.#handleWorkerTarget(cdpToBidiTargetTypes[targetInfo.type], cdpTarget, realm);
            return;
          }
          case "shared_worker": {
            const cdpTarget = this.#createCdpTarget(targetCdpClient, targetInfo);
            this.#handleWorkerTarget(cdpToBidiTargetTypes[targetInfo.type], cdpTarget);
            return;
          }
        }
        void detach();
      }
      #createCdpTarget(targetCdpClient, targetInfo) {
        this.#setEventListeners(targetCdpClient);
        const target = CdpTarget_js_1.CdpTarget.create(targetInfo.targetId, targetCdpClient, this.#browserCdpClient, this.#realmStorage, this.#eventManager, this.#preloadScriptStorage, this.#browsingContextStorage, this.#networkStorage, this.#unhandledPromptBehavior, this.#logger);
        this.#networkStorage.onCdpTargetCreated(target);
        this.#bluetoothProcessor.onCdpTargetCreated(target);
        return target;
      }
      #workers = /* @__PURE__ */ new Map();
      #handleWorkerTarget(realmType, cdpTarget, ownerRealm) {
        cdpTarget.cdpClient.on("Runtime.executionContextCreated", (params) => {
          const { uniqueId, id, origin } = params.context;
          const workerRealm = new WorkerRealm_js_1.WorkerRealm(cdpTarget.cdpClient, this.#eventManager, id, this.#logger, (0, BrowsingContextImpl_js_1.serializeOrigin)(origin), ownerRealm ? [ownerRealm] : [], uniqueId, this.#realmStorage, realmType);
          this.#workers.set(cdpTarget.cdpSessionId, workerRealm);
        });
      }
      #handleDetachedFromTargetEvent({ sessionId, targetId }) {
        if (targetId) {
          this.#preloadScriptStorage.find({ targetId }).map((preloadScript) => {
            preloadScript.dispose(targetId);
          });
        }
        const context = this.#browsingContextStorage.findContextBySession(sessionId);
        if (context) {
          context.dispose(true);
          return;
        }
        const worker = this.#workers.get(sessionId);
        if (worker) {
          this.#realmStorage.deleteRealms({
            cdpSessionId: worker.cdpClient.sessionId
          });
        }
      }
      #handleTargetInfoChangedEvent(params) {
        const context = this.#browsingContextStorage.findContext(params.targetInfo.targetId);
        if (context) {
          context.onTargetInfoChanged(params);
        }
      }
      #handleTargetCrashedEvent(cdpClient) {
        const realms = this.#realmStorage.findRealms({
          cdpSessionId: cdpClient.sessionId
        });
        for (const realm of realms) {
          realm.dispose();
        }
      }
    };
    exports.CdpTargetManager = CdpTargetManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/context/BrowsingContextStorage.js
var require_BrowsingContextStorage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/context/BrowsingContextStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowsingContextStorage = void 0;
    var protocol_js_1 = require_protocol();
    var BrowsingContextStorage = class {
      /** Map from context ID to context implementation. */
      #contexts = /* @__PURE__ */ new Map();
      /** Gets all top-level contexts, i.e. those with no parent. */
      getTopLevelContexts() {
        return this.getAllContexts().filter((context) => context.isTopLevelContext());
      }
      /** Gets all contexts. */
      getAllContexts() {
        return Array.from(this.#contexts.values());
      }
      /** Deletes the context with the given ID. */
      deleteContextById(id) {
        this.#contexts.delete(id);
      }
      /** Deletes the given context. */
      deleteContext(context) {
        this.#contexts.delete(context.id);
      }
      /** Tracks the given context. */
      addContext(context) {
        this.#contexts.set(context.id, context);
      }
      /** Returns true whether there is an existing context with the given ID. */
      hasContext(id) {
        return this.#contexts.has(id);
      }
      /** Gets the context with the given ID, if any. */
      findContext(id) {
        return this.#contexts.get(id);
      }
      /** Returns the top-level context ID of the given context, if any. */
      findTopLevelContextId(id) {
        if (id === null) {
          return null;
        }
        const maybeContext = this.findContext(id);
        const parentId = maybeContext?.parentId ?? null;
        if (parentId === null) {
          return id;
        }
        return this.findTopLevelContextId(parentId);
      }
      findContextBySession(sessionId) {
        for (const context of this.#contexts.values()) {
          if (context.cdpTarget.cdpSessionId === sessionId) {
            return context;
          }
        }
        return;
      }
      /** Gets the context with the given ID, if any, otherwise throws. */
      getContext(id) {
        const result = this.findContext(id);
        if (result === void 0) {
          throw new protocol_js_1.NoSuchFrameException(`Context ${id} not found`);
        }
        return result;
      }
      verifyTopLevelContextsList(contexts) {
        const foundContexts = /* @__PURE__ */ new Set();
        if (!contexts) {
          return foundContexts;
        }
        for (const contextId of contexts) {
          const context = this.getContext(contextId);
          if (context.isTopLevelContext()) {
            foundContexts.add(context);
          } else {
            throw new protocol_js_1.InvalidArgumentException(`Non top-level context '${contextId}' given.`);
          }
        }
        return foundContexts;
      }
    };
    exports.BrowsingContextStorage = BrowsingContextStorage;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkRequest.js
var require_NetworkRequest = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkRequest.js"(exports) {
    "use strict";
    var _a3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkRequest = void 0;
    var protocol_js_1 = require_protocol();
    var assert_js_1 = require_assert();
    var Deferred_js_1 = require_Deferred();
    var log_js_1 = require_log();
    var NetworkUtils_js_1 = require_NetworkUtils();
    var REALM_REGEX = /(?<=realm=").*(?=")/;
    var _id, _fetchId, _interceptPhase, _servedFromCache, _redirectCount, _request, _requestOverrides, _responseOverrides, _response, _eventManager, _networkStorage, _cdpTarget, _logger, _emittedEvents, _isDataUrl, isDataUrl_fn, _method, method_get, _navigationId, navigationId_get, _cookies, cookies_get, _bodySize, bodySize_get, _context, context_get, _statusCode, statusCode_get, _requestHeaders, requestHeaders_get, _authChallenges, authChallenges_get, _timings, timings_get, _phaseChanged, phaseChanged_fn, _interceptsInPhase, interceptsInPhase_fn, _isBlockedInPhase, isBlockedInPhase_fn, _emitEventsIfReady, emitEventsIfReady_fn, _continueRequest, continueRequest_fn, _continueResponse, continueResponse_fn, _continueWithAuth, continueWithAuth_fn, _emitEvent, emitEvent_fn, _getBaseEventParams, getBaseEventParams_fn, _getResponseEventParams, getResponseEventParams_fn, _getRequestData, getRequestData_fn, _getBeforeRequestEvent, getBeforeRequestEvent_fn, _getResponseStartedEvent, getResponseStartedEvent_fn, _getResponseReceivedEvent, getResponseReceivedEvent_fn, _isIgnoredEvent, isIgnoredEvent_fn, _getOverrideHeader, getOverrideHeader_fn, _getInitiatorType, getInitiatorType_fn;
    var NetworkRequest = class {
      constructor(id, eventManager, networkStorage, cdpTarget, redirectCount = 0, logger) {
        __privateAdd(this, _isDataUrl);
        __privateAdd(this, _method);
        __privateAdd(this, _navigationId);
        __privateAdd(this, _cookies);
        __privateAdd(this, _bodySize);
        __privateAdd(this, _context);
        /** Returns the HTTP status code associated with this request if any. */
        __privateAdd(this, _statusCode);
        __privateAdd(this, _requestHeaders);
        __privateAdd(this, _authChallenges);
        __privateAdd(this, _timings);
        __privateAdd(this, _phaseChanged);
        __privateAdd(this, _interceptsInPhase);
        __privateAdd(this, _isBlockedInPhase);
        __privateAdd(this, _emitEventsIfReady);
        __privateAdd(this, _continueRequest);
        __privateAdd(this, _continueResponse);
        __privateAdd(this, _continueWithAuth);
        __privateAdd(this, _emitEvent);
        __privateAdd(this, _getBaseEventParams);
        __privateAdd(this, _getResponseEventParams);
        __privateAdd(this, _getRequestData);
        __privateAdd(this, _getBeforeRequestEvent);
        __privateAdd(this, _getResponseStartedEvent);
        __privateAdd(this, _getResponseReceivedEvent);
        __privateAdd(this, _isIgnoredEvent);
        __privateAdd(this, _getOverrideHeader);
        /**
         * Each network request has an associated request id, which is a string
         * uniquely identifying that request.
         *
         * The identifier for a request resulting from a redirect matches that of the
         * request that initiated it.
         */
        __privateAdd(this, _id, void 0);
        __privateAdd(this, _fetchId, void 0);
        /**
         * Indicates the network intercept phase, if the request is currently blocked.
         * Undefined necessarily implies that the request is not blocked.
         */
        __privateAdd(this, _interceptPhase, void 0);
        __privateAdd(this, _servedFromCache, false);
        __privateAdd(this, _redirectCount, void 0);
        __privateAdd(this, _request, {});
        __privateAdd(this, _requestOverrides, void 0);
        __privateAdd(this, _responseOverrides, void 0);
        __privateAdd(this, _response, {});
        __privateAdd(this, _eventManager, void 0);
        __privateAdd(this, _networkStorage, void 0);
        __privateAdd(this, _cdpTarget, void 0);
        __privateAdd(this, _logger, void 0);
        __privateAdd(this, _emittedEvents, {
          [protocol_js_1.ChromiumBidi.Network.EventNames.AuthRequired]: false,
          [protocol_js_1.ChromiumBidi.Network.EventNames.BeforeRequestSent]: false,
          [protocol_js_1.ChromiumBidi.Network.EventNames.FetchError]: false,
          [protocol_js_1.ChromiumBidi.Network.EventNames.ResponseCompleted]: false,
          [protocol_js_1.ChromiumBidi.Network.EventNames.ResponseStarted]: false
        });
        __publicField(this, "waitNextPhase", new Deferred_js_1.Deferred());
        __privateSet(this, _id, id);
        __privateSet(this, _eventManager, eventManager);
        __privateSet(this, _networkStorage, networkStorage);
        __privateSet(this, _cdpTarget, cdpTarget);
        __privateSet(this, _redirectCount, redirectCount);
        __privateSet(this, _logger, logger);
      }
      get id() {
        return __privateGet(this, _id);
      }
      get fetchId() {
        return __privateGet(this, _fetchId);
      }
      /**
       * When blocked returns the phase for it
       */
      get interceptPhase() {
        return __privateGet(this, _interceptPhase);
      }
      get url() {
        const fragment = __privateGet(this, _request).info?.request.urlFragment ?? __privateGet(this, _request).paused?.request.urlFragment ?? "";
        const url = __privateGet(this, _response).info?.url ?? __privateGet(this, _response).paused?.request.url ?? __privateGet(this, _requestOverrides)?.url ?? __privateGet(this, _request).auth?.request.url ?? __privateGet(this, _request).info?.request.url ?? __privateGet(this, _request).paused?.request.url ?? _a3.unknownParameter;
        return `${url}${fragment}`;
      }
      get redirectCount() {
        return __privateGet(this, _redirectCount);
      }
      get cdpTarget() {
        return __privateGet(this, _cdpTarget);
      }
      get cdpClient() {
        return __privateGet(this, _cdpTarget).cdpClient;
      }
      isRedirecting() {
        return Boolean(__privateGet(this, _request).info);
      }
      handleRedirect(event) {
        __privateGet(this, _response).hasExtraInfo = false;
        __privateGet(this, _response).info = event.redirectResponse;
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this, {
          wasRedirected: true
        });
      }
      onRequestWillBeSentEvent(event) {
        __privateGet(this, _request).info = event;
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this);
      }
      onRequestWillBeSentExtraInfoEvent(event) {
        __privateGet(this, _request).extraInfo = event;
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this);
      }
      onResponseReceivedExtraInfoEvent(event) {
        if (event.statusCode >= 300 && event.statusCode <= 399 && __privateGet(this, _request).info && event.headers["location"] === __privateGet(this, _request).info.request.url) {
          return;
        }
        __privateGet(this, _response).extraInfo = event;
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this);
      }
      onResponseReceivedEvent(event) {
        __privateGet(this, _response).hasExtraInfo = event.hasExtraInfo;
        __privateGet(this, _response).info = event.response;
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this);
      }
      onServedFromCache() {
        __privateSet(this, _servedFromCache, true);
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this);
      }
      onLoadingFailedEvent(event) {
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this, {
          hasFailed: true
        });
        __privateMethod(this, _emitEvent, emitEvent_fn).call(this, () => {
          return {
            method: protocol_js_1.ChromiumBidi.Network.EventNames.FetchError,
            params: {
              ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this),
              errorText: event.errorText
            }
          };
        });
      }
      /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-failRequest */
      async failRequest(errorReason) {
        (0, assert_js_1.assert)(__privateGet(this, _fetchId), "Network Interception not set-up.");
        await this.cdpClient.sendCommand("Fetch.failRequest", {
          requestId: __privateGet(this, _fetchId),
          errorReason
        });
        __privateSet(this, _interceptPhase, void 0);
      }
      onRequestPaused(event) {
        __privateSet(this, _fetchId, event.requestId);
        if (event.responseStatusCode || event.responseErrorReason) {
          __privateGet(this, _response).paused = event;
          if (__privateMethod(this, _isBlockedInPhase, isBlockedInPhase_fn).call(this, "responseStarted") && // CDP may emit multiple events for a single request
          !__privateGet(this, _emittedEvents)[protocol_js_1.ChromiumBidi.Network.EventNames.ResponseStarted] && // Continue all response that have not enabled Network domain
          __privateGet(this, _fetchId) !== this.id) {
            __privateSet(this, _interceptPhase, "responseStarted");
          } else {
            void __privateMethod(this, _continueResponse, continueResponse_fn).call(this);
          }
        } else {
          __privateGet(this, _request).paused = event;
          if (__privateMethod(this, _isBlockedInPhase, isBlockedInPhase_fn).call(this, "beforeRequestSent") && // CDP may emit multiple events for a single request
          !__privateGet(this, _emittedEvents)[protocol_js_1.ChromiumBidi.Network.EventNames.BeforeRequestSent] && // Continue all requests that have not enabled Network domain
          __privateGet(this, _fetchId) !== this.id) {
            __privateSet(this, _interceptPhase, "beforeRequestSent");
          } else {
            void __privateMethod(this, _continueRequest, continueRequest_fn).call(this);
          }
        }
        __privateMethod(this, _emitEventsIfReady, emitEventsIfReady_fn).call(this);
      }
      onAuthRequired(event) {
        __privateSet(this, _fetchId, event.requestId);
        __privateGet(this, _request).auth = event;
        if (__privateMethod(this, _isBlockedInPhase, isBlockedInPhase_fn).call(this, "authRequired") && // Continue all auth requests that have not enabled Network domain
        __privateGet(this, _fetchId) !== this.id) {
          __privateSet(this, _interceptPhase, "authRequired");
        } else {
          void __privateMethod(this, _continueWithAuth, continueWithAuth_fn).call(this, {
            response: "Default"
          });
        }
        __privateMethod(this, _emitEvent, emitEvent_fn).call(this, () => {
          return {
            method: protocol_js_1.ChromiumBidi.Network.EventNames.AuthRequired,
            params: {
              ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this, "authRequired"),
              response: __privateMethod(this, _getResponseEventParams, getResponseEventParams_fn).call(this)
            }
          };
        });
      }
      /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueRequest */
      async continueRequest(overrides = {}) {
        const overrideHeaders = __privateMethod(this, _getOverrideHeader, getOverrideHeader_fn).call(this, overrides.headers, overrides.cookies);
        const headers = (0, NetworkUtils_js_1.cdpFetchHeadersFromBidiNetworkHeaders)(overrideHeaders);
        const postData = getCdpBodyFromBiDiBytesValue(overrides.body);
        await __privateMethod(this, _continueRequest, continueRequest_fn).call(this, {
          url: overrides.url,
          method: overrides.method,
          headers,
          postData
        });
        __privateSet(this, _requestOverrides, {
          url: overrides.url,
          method: overrides.method,
          headers: overrides.headers,
          cookies: overrides.cookies,
          bodySize: getSizeFromBiDiBytesValue(overrides.body)
        });
      }
      /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueResponse */
      async continueResponse(overrides = {}) {
        if (this.interceptPhase === "authRequired") {
          if (overrides.credentials) {
            await Promise.all([
              this.waitNextPhase,
              await __privateMethod(this, _continueWithAuth, continueWithAuth_fn).call(this, {
                response: "ProvideCredentials",
                username: overrides.credentials.username,
                password: overrides.credentials.password
              })
            ]);
          } else {
            return await __privateMethod(this, _continueWithAuth, continueWithAuth_fn).call(this, {
              response: "ProvideCredentials"
            });
          }
        }
        if (__privateGet(this, _interceptPhase) === "responseStarted") {
          const overrideHeaders = __privateMethod(this, _getOverrideHeader, getOverrideHeader_fn).call(this, overrides.headers, overrides.cookies);
          const responseHeaders = (0, NetworkUtils_js_1.cdpFetchHeadersFromBidiNetworkHeaders)(overrideHeaders);
          await __privateMethod(this, _continueResponse, continueResponse_fn).call(this, {
            responseCode: overrides.statusCode ?? __privateGet(this, _response).paused?.responseStatusCode,
            responsePhrase: overrides.reasonPhrase ?? __privateGet(this, _response).paused?.responseStatusText,
            responseHeaders: responseHeaders ?? __privateGet(this, _response).paused?.responseHeaders
          });
          __privateSet(this, _responseOverrides, {
            statusCode: overrides.statusCode,
            headers: overrideHeaders
          });
        }
      }
      /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueWithAuth */
      async continueWithAuth(authChallenge) {
        let username;
        let password;
        if (authChallenge.action === "provideCredentials") {
          const { credentials } = authChallenge;
          username = credentials.username;
          password = credentials.password;
        }
        const response = (0, NetworkUtils_js_1.cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction)(authChallenge.action);
        await __privateMethod(this, _continueWithAuth, continueWithAuth_fn).call(this, {
          response,
          username,
          password
        });
      }
      /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-provideResponse */
      async provideResponse(overrides) {
        (0, assert_js_1.assert)(__privateGet(this, _fetchId), "Network Interception not set-up.");
        if (this.interceptPhase === "authRequired") {
          return await __privateMethod(this, _continueWithAuth, continueWithAuth_fn).call(this, {
            response: "ProvideCredentials"
          });
        }
        if (!overrides.body && !overrides.headers) {
          return await __privateMethod(this, _continueRequest, continueRequest_fn).call(this);
        }
        const overrideHeaders = __privateMethod(this, _getOverrideHeader, getOverrideHeader_fn).call(this, overrides.headers, overrides.cookies);
        const responseHeaders = (0, NetworkUtils_js_1.cdpFetchHeadersFromBidiNetworkHeaders)(overrideHeaders);
        const responseCode = overrides.statusCode ?? __privateGet(this, _statusCode, statusCode_get) ?? 200;
        await this.cdpClient.sendCommand("Fetch.fulfillRequest", {
          requestId: __privateGet(this, _fetchId),
          responseCode,
          responsePhrase: overrides.reasonPhrase,
          responseHeaders,
          body: getCdpBodyFromBiDiBytesValue(overrides.body)
        });
        __privateSet(this, _interceptPhase, void 0);
      }
    };
    _id = new WeakMap();
    _fetchId = new WeakMap();
    _interceptPhase = new WeakMap();
    _servedFromCache = new WeakMap();
    _redirectCount = new WeakMap();
    _request = new WeakMap();
    _requestOverrides = new WeakMap();
    _responseOverrides = new WeakMap();
    _response = new WeakMap();
    _eventManager = new WeakMap();
    _networkStorage = new WeakMap();
    _cdpTarget = new WeakMap();
    _logger = new WeakMap();
    _emittedEvents = new WeakMap();
    _isDataUrl = new WeakSet();
    isDataUrl_fn = function() {
      return this.url.startsWith("data:");
    };
    _method = new WeakSet();
    method_get = function() {
      return __privateGet(this, _requestOverrides)?.method ?? __privateGet(this, _request).info?.request.method ?? __privateGet(this, _request).paused?.request.method ?? __privateGet(this, _request).auth?.request.method ?? __privateGet(this, _response).paused?.request.method;
    };
    _navigationId = new WeakSet();
    navigationId_get = function() {
      if (!__privateGet(this, _request).info || !__privateGet(this, _request).info.loaderId || // When we navigate all CDP network events have `loaderId`
      // CDP's `loaderId` and `requestId` match when
      // that request triggered the loading
      __privateGet(this, _request).info.loaderId !== __privateGet(this, _request).info.requestId) {
        return null;
      }
      return __privateGet(this, _networkStorage).getNavigationId(__privateGet(this, _context, context_get) ?? void 0);
    };
    _cookies = new WeakSet();
    cookies_get = function() {
      let cookies = [];
      if (__privateGet(this, _request).extraInfo) {
        cookies = __privateGet(this, _request).extraInfo.associatedCookies.filter(({ blockedReasons }) => {
          return !Array.isArray(blockedReasons) || blockedReasons.length === 0;
        }).map(({ cookie }) => (0, NetworkUtils_js_1.cdpToBiDiCookie)(cookie));
      }
      return cookies;
    };
    _bodySize = new WeakSet();
    bodySize_get = function() {
      let bodySize = 0;
      if (typeof __privateGet(this, _requestOverrides)?.bodySize === "number") {
        bodySize = __privateGet(this, _requestOverrides).bodySize;
      } else {
        bodySize = (0, NetworkUtils_js_1.bidiBodySizeFromCdpPostDataEntries)(__privateGet(this, _request).info?.request.postDataEntries ?? []);
      }
      return bodySize;
    };
    _context = new WeakSet();
    context_get = function() {
      return __privateGet(this, _response).paused?.frameId ?? __privateGet(this, _request).info?.frameId ?? __privateGet(this, _request).paused?.frameId ?? __privateGet(this, _request).auth?.frameId ?? null;
    };
    _statusCode = new WeakSet();
    statusCode_get = function() {
      return __privateGet(this, _responseOverrides)?.statusCode ?? __privateGet(this, _response).paused?.responseStatusCode ?? __privateGet(this, _response).extraInfo?.statusCode ?? __privateGet(this, _response).info?.status;
    };
    _requestHeaders = new WeakSet();
    requestHeaders_get = function() {
      let headers = [];
      if (__privateGet(this, _requestOverrides)?.headers) {
        headers = __privateGet(this, _requestOverrides).headers;
      } else {
        headers = [
          ...(0, NetworkUtils_js_1.bidiNetworkHeadersFromCdpNetworkHeaders)(__privateGet(this, _request).info?.request.headers),
          ...(0, NetworkUtils_js_1.bidiNetworkHeadersFromCdpNetworkHeaders)(__privateGet(this, _request).extraInfo?.headers)
        ];
      }
      return headers;
    };
    _authChallenges = new WeakSet();
    authChallenges_get = function() {
      if (!__privateGet(this, _response).info) {
        return;
      }
      if (!(__privateGet(this, _statusCode, statusCode_get) === 401 || __privateGet(this, _statusCode, statusCode_get) === 407)) {
        return void 0;
      }
      const headerName = __privateGet(this, _statusCode, statusCode_get) === 401 ? "WWW-Authenticate" : "Proxy-Authenticate";
      const authChallenges = [];
      for (const [header, value] of Object.entries(__privateGet(this, _response).info.headers)) {
        if (header.localeCompare(headerName, void 0, { sensitivity: "base" }) === 0) {
          authChallenges.push({
            scheme: value.split(" ").at(0) ?? "",
            realm: value.match(REALM_REGEX)?.at(0) ?? ""
          });
        }
      }
      return authChallenges;
    };
    _timings = new WeakSet();
    timings_get = function() {
      return {
        // TODO: Verify this is correct
        timeOrigin: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.requestTime),
        requestTime: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.requestTime),
        redirectStart: 0,
        redirectEnd: 0,
        // TODO: Verify this is correct
        // https://source.chromium.org/chromium/chromium/src/+/main:net/base/load_timing_info.h;l=145
        fetchStart: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.requestTime),
        dnsStart: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.dnsStart),
        dnsEnd: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.dnsEnd),
        connectStart: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.connectStart),
        connectEnd: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.connectEnd),
        tlsStart: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.sslStart),
        requestStart: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.sendStart),
        // https://source.chromium.org/chromium/chromium/src/+/main:net/base/load_timing_info.h;l=196
        responseStart: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.receiveHeadersStart),
        responseEnd: (0, NetworkUtils_js_1.getTiming)(__privateGet(this, _response).info?.timing?.receiveHeadersEnd)
      };
    };
    _phaseChanged = new WeakSet();
    phaseChanged_fn = function() {
      this.waitNextPhase.resolve();
      this.waitNextPhase = new Deferred_js_1.Deferred();
    };
    _interceptsInPhase = new WeakSet();
    interceptsInPhase_fn = function(phase) {
      if (!__privateGet(this, _cdpTarget).isSubscribedTo(`network.${phase}`)) {
        return /* @__PURE__ */ new Set();
      }
      return __privateGet(this, _networkStorage).getInterceptsForPhase(this, phase);
    };
    _isBlockedInPhase = new WeakSet();
    isBlockedInPhase_fn = function(phase) {
      return __privateMethod(this, _interceptsInPhase, interceptsInPhase_fn).call(this, phase).size > 0;
    };
    _emitEventsIfReady = new WeakSet();
    emitEventsIfReady_fn = function(options = {}) {
      const requestExtraInfoCompleted = (
        // Flush redirects
        options.wasRedirected || options.hasFailed || __privateMethod(this, _isDataUrl, isDataUrl_fn).call(this) || Boolean(__privateGet(this, _request).extraInfo) || // Requests from cache don't have extra info
        __privateGet(this, _servedFromCache) || // Sometimes there is no extra info and the response
        // is the only place we can find out
        Boolean(__privateGet(this, _response).info && !__privateGet(this, _response).hasExtraInfo)
      );
      const noInterceptionExpected = (
        // We can't intercept data urls from CDP
        __privateMethod(this, _isDataUrl, isDataUrl_fn).call(this) || // Cached requests never hit the network
        __privateGet(this, _servedFromCache)
      );
      const requestInterceptionExpected = !noInterceptionExpected && __privateMethod(this, _isBlockedInPhase, isBlockedInPhase_fn).call(this, "beforeRequestSent");
      const requestInterceptionCompleted = !requestInterceptionExpected || requestInterceptionExpected && Boolean(__privateGet(this, _request).paused);
      if (Boolean(__privateGet(this, _request).info) && (requestInterceptionExpected ? requestInterceptionCompleted : requestExtraInfoCompleted)) {
        __privateMethod(this, _emitEvent, emitEvent_fn).call(this, __privateMethod(this, _getBeforeRequestEvent, getBeforeRequestEvent_fn).bind(this));
      }
      const responseExtraInfoCompleted = Boolean(__privateGet(this, _response).extraInfo) || // Response from cache don't have extra info
      __privateGet(this, _servedFromCache) || // Don't expect extra info if the flag is false
      Boolean(__privateGet(this, _response).info && !__privateGet(this, _response).hasExtraInfo);
      const responseInterceptionExpected = !noInterceptionExpected && __privateMethod(this, _isBlockedInPhase, isBlockedInPhase_fn).call(this, "responseStarted");
      if (__privateGet(this, _response).info || responseInterceptionExpected && Boolean(__privateGet(this, _response).paused)) {
        __privateMethod(this, _emitEvent, emitEvent_fn).call(this, __privateMethod(this, _getResponseStartedEvent, getResponseStartedEvent_fn).bind(this));
      }
      const responseInterceptionCompleted = !responseInterceptionExpected || responseInterceptionExpected && Boolean(__privateGet(this, _response).paused);
      if (Boolean(__privateGet(this, _response).info) && responseExtraInfoCompleted && responseInterceptionCompleted) {
        __privateMethod(this, _emitEvent, emitEvent_fn).call(this, __privateMethod(this, _getResponseReceivedEvent, getResponseReceivedEvent_fn).bind(this));
        __privateGet(this, _networkStorage).deleteRequest(this.id);
      }
    };
    _continueRequest = new WeakSet();
    continueRequest_fn = async function(overrides = {}) {
      (0, assert_js_1.assert)(__privateGet(this, _fetchId), "Network Interception not set-up.");
      await this.cdpClient.sendCommand("Fetch.continueRequest", {
        requestId: __privateGet(this, _fetchId),
        url: overrides.url,
        method: overrides.method,
        headers: overrides.headers,
        postData: overrides.postData
      });
      __privateSet(this, _interceptPhase, void 0);
    };
    _continueResponse = new WeakSet();
    continueResponse_fn = async function({ responseCode, responsePhrase, responseHeaders } = {}) {
      (0, assert_js_1.assert)(__privateGet(this, _fetchId), "Network Interception not set-up.");
      await this.cdpClient.sendCommand("Fetch.continueResponse", {
        requestId: __privateGet(this, _fetchId),
        responseCode,
        responsePhrase,
        responseHeaders
      });
      __privateSet(this, _interceptPhase, void 0);
    };
    _continueWithAuth = new WeakSet();
    continueWithAuth_fn = async function(authChallengeResponse) {
      (0, assert_js_1.assert)(__privateGet(this, _fetchId), "Network Interception not set-up.");
      await this.cdpClient.sendCommand("Fetch.continueWithAuth", {
        requestId: __privateGet(this, _fetchId),
        authChallengeResponse
      });
      __privateSet(this, _interceptPhase, void 0);
    };
    _emitEvent = new WeakSet();
    emitEvent_fn = function(getEvent) {
      var _a4;
      let event;
      try {
        event = getEvent();
      } catch (error) {
        (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, log_js_1.LogType.debugError, error);
        return;
      }
      if (__privateMethod(this, _isIgnoredEvent, isIgnoredEvent_fn).call(this) || __privateGet(this, _emittedEvents)[event.method] && // Special case this event can be emitted multiple times
      event.method !== protocol_js_1.ChromiumBidi.Network.EventNames.AuthRequired) {
        return;
      }
      __privateMethod(this, _phaseChanged, phaseChanged_fn).call(this);
      __privateGet(this, _emittedEvents)[event.method] = true;
      __privateGet(this, _eventManager).registerEvent(Object.assign(event, {
        type: "event"
      }), __privateGet(this, _context, context_get));
    };
    _getBaseEventParams = new WeakSet();
    getBaseEventParams_fn = function(phase) {
      const interceptProps = {
        isBlocked: false
      };
      if (phase) {
        const blockedBy = __privateMethod(this, _interceptsInPhase, interceptsInPhase_fn).call(this, phase);
        interceptProps.isBlocked = blockedBy.size > 0;
        if (interceptProps.isBlocked) {
          interceptProps.intercepts = [...blockedBy];
        }
      }
      return {
        context: __privateGet(this, _context, context_get),
        navigation: __privateGet(this, _navigationId, navigationId_get),
        redirectCount: __privateGet(this, _redirectCount),
        request: __privateMethod(this, _getRequestData, getRequestData_fn).call(this),
        // Timestamp should be in milliseconds, while CDP provides it in seconds.
        timestamp: Math.round((0, NetworkUtils_js_1.getTiming)(__privateGet(this, _request).info?.wallTime) * 1e3),
        // Contains isBlocked and intercepts
        ...interceptProps
      };
    };
    _getResponseEventParams = new WeakSet();
    getResponseEventParams_fn = function() {
      if (__privateGet(this, _response).info?.fromDiskCache) {
        __privateGet(this, _response).extraInfo = void 0;
      }
      const headers = [
        ...(0, NetworkUtils_js_1.bidiNetworkHeadersFromCdpNetworkHeaders)(__privateGet(this, _response).info?.headers),
        ...(0, NetworkUtils_js_1.bidiNetworkHeadersFromCdpNetworkHeaders)(__privateGet(this, _response).extraInfo?.headers)
        // TODO: Verify how to dedupe these
        // ...bidiNetworkHeadersFromCdpNetworkHeadersEntries(
        //   this.#response.paused?.responseHeaders
        // ),
      ];
      const authChallenges = __privateGet(this, _authChallenges, authChallenges_get);
      return {
        url: this.url,
        protocol: __privateGet(this, _response).info?.protocol ?? "",
        status: __privateGet(this, _statusCode, statusCode_get) ?? -1,
        // TODO: Throw an exception or use some other status code?
        statusText: __privateGet(this, _response).info?.statusText || __privateGet(this, _response).paused?.responseStatusText || "",
        fromCache: __privateGet(this, _response).info?.fromDiskCache || __privateGet(this, _response).info?.fromPrefetchCache || __privateGet(this, _servedFromCache),
        headers: __privateGet(this, _responseOverrides)?.headers ?? headers,
        mimeType: __privateGet(this, _response).info?.mimeType || "",
        bytesReceived: __privateGet(this, _response).info?.encodedDataLength || 0,
        headersSize: (0, NetworkUtils_js_1.computeHeadersSize)(headers),
        // TODO: consider removing from spec.
        bodySize: 0,
        content: {
          // TODO: consider removing from spec.
          size: 0
        },
        ...authChallenges ? { authChallenges } : {},
        // @ts-expect-error this is a CDP-specific extension.
        "goog:securityDetails": __privateGet(this, _response).info?.securityDetails
      };
    };
    _getRequestData = new WeakSet();
    getRequestData_fn = function() {
      const headers = __privateGet(this, _requestHeaders, requestHeaders_get);
      return {
        request: __privateGet(this, _id),
        url: this.url,
        method: __privateGet(this, _method, method_get) ?? _a3.unknownParameter,
        headers,
        cookies: __privateGet(this, _cookies, cookies_get),
        headersSize: (0, NetworkUtils_js_1.computeHeadersSize)(headers),
        bodySize: __privateGet(this, _bodySize, bodySize_get),
        timings: __privateGet(this, _timings, timings_get),
        // @ts-expect-error CDP-specific attribute.
        "goog:postData": __privateGet(this, _request).info?.request?.postData,
        "goog:hasPostData": __privateGet(this, _request).info?.request?.hasPostData,
        "goog:resourceType": __privateGet(this, _request).info?.type
      };
    };
    _getBeforeRequestEvent = new WeakSet();
    getBeforeRequestEvent_fn = function() {
      var _a4;
      (0, assert_js_1.assert)(__privateGet(this, _request).info, "RequestWillBeSentEvent is not set");
      return {
        method: protocol_js_1.ChromiumBidi.Network.EventNames.BeforeRequestSent,
        params: {
          ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this, "beforeRequestSent"),
          initiator: {
            type: __privateMethod(_a4 = _a3, _getInitiatorType, getInitiatorType_fn).call(_a4, __privateGet(this, _request).info.initiator.type),
            columnNumber: __privateGet(this, _request).info.initiator.columnNumber,
            lineNumber: __privateGet(this, _request).info.initiator.lineNumber,
            stackTrace: __privateGet(this, _request).info.initiator.stack,
            request: __privateGet(this, _request).info.initiator.requestId
          }
        }
      };
    };
    _getResponseStartedEvent = new WeakSet();
    getResponseStartedEvent_fn = function() {
      return {
        method: protocol_js_1.ChromiumBidi.Network.EventNames.ResponseStarted,
        params: {
          ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this, "responseStarted"),
          response: __privateMethod(this, _getResponseEventParams, getResponseEventParams_fn).call(this)
        }
      };
    };
    _getResponseReceivedEvent = new WeakSet();
    getResponseReceivedEvent_fn = function() {
      return {
        method: protocol_js_1.ChromiumBidi.Network.EventNames.ResponseCompleted,
        params: {
          ...__privateMethod(this, _getBaseEventParams, getBaseEventParams_fn).call(this),
          response: __privateMethod(this, _getResponseEventParams, getResponseEventParams_fn).call(this)
        }
      };
    };
    _isIgnoredEvent = new WeakSet();
    isIgnoredEvent_fn = function() {
      const faviconUrl = "/favicon.ico";
      return __privateGet(this, _request).paused?.request.url.endsWith(faviconUrl) ?? __privateGet(this, _request).info?.request.url.endsWith(faviconUrl) ?? false;
    };
    _getOverrideHeader = new WeakSet();
    getOverrideHeader_fn = function(headers, cookies) {
      if (!headers && !cookies) {
        return void 0;
      }
      let overrideHeaders = headers;
      const cookieHeader = (0, NetworkUtils_js_1.networkHeaderFromCookieHeaders)(cookies);
      if (cookieHeader && !overrideHeaders) {
        overrideHeaders = __privateGet(this, _requestHeaders, requestHeaders_get);
      }
      if (cookieHeader && overrideHeaders) {
        overrideHeaders.filter((header) => header.name.localeCompare("cookie", void 0, {
          sensitivity: "base"
        }) !== 0);
        overrideHeaders.push(cookieHeader);
      }
      return overrideHeaders;
    };
    _getInitiatorType = new WeakSet();
    getInitiatorType_fn = function(initiatorType) {
      switch (initiatorType) {
        case "parser":
        case "script":
        case "preflight":
          return initiatorType;
        default:
          return "other";
      }
    };
    __privateAdd(NetworkRequest, _getInitiatorType);
    __publicField(NetworkRequest, "unknownParameter", "UNKNOWN");
    exports.NetworkRequest = NetworkRequest;
    _a3 = NetworkRequest;
    function getCdpBodyFromBiDiBytesValue(body) {
      let parsedBody;
      if (body?.type === "string") {
        parsedBody = btoa(body.value);
      } else if (body?.type === "base64") {
        parsedBody = body.value;
      }
      return parsedBody;
    }
    function getSizeFromBiDiBytesValue(body) {
      if (body?.type === "string") {
        return body.value.length;
      } else if (body?.type === "base64") {
        return atob(body.value).length;
      }
      return 0;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkStorage.js
var require_NetworkStorage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/network/NetworkStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkStorage = void 0;
    var protocol_js_1 = require_protocol();
    var uuid_js_1 = require_uuid();
    var NetworkRequest_js_1 = require_NetworkRequest();
    var NetworkUtils_js_1 = require_NetworkUtils();
    var NetworkStorage = class {
      #browsingContextStorage;
      #eventManager;
      #logger;
      /**
       * A map from network request ID to Network Request objects.
       * Needed as long as information about requests comes from different events.
       */
      #requests = /* @__PURE__ */ new Map();
      /** A map from intercept ID to track active network intercepts. */
      #intercepts = /* @__PURE__ */ new Map();
      #defaultCacheBehavior = "default";
      constructor(eventManager, browsingContextStorage, browserClient, logger) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#eventManager = eventManager;
        browserClient.on("Target.detachedFromTarget", ({ sessionId }) => {
          this.disposeRequestMap(sessionId);
        });
        this.#logger = logger;
      }
      /**
       * Gets the network request with the given ID, if any.
       * Otherwise, creates a new network request with the given ID and cdp target.
       */
      #getOrCreateNetworkRequest(id, cdpTarget, redirectCount) {
        let request = this.getRequestById(id);
        if (request) {
          return request;
        }
        request = new NetworkRequest_js_1.NetworkRequest(id, this.#eventManager, this, cdpTarget, redirectCount, this.#logger);
        this.addRequest(request);
        return request;
      }
      onCdpTargetCreated(cdpTarget) {
        const cdpClient = cdpTarget.cdpClient;
        const listeners = [
          [
            "Network.requestWillBeSent",
            (params) => {
              const request = this.getRequestById(params.requestId);
              if (request && request.isRedirecting()) {
                request.handleRedirect(params);
                this.deleteRequest(params.requestId);
                this.#getOrCreateNetworkRequest(params.requestId, cdpTarget, request.redirectCount + 1).onRequestWillBeSentEvent(params);
              } else {
                this.#getOrCreateNetworkRequest(params.requestId, cdpTarget).onRequestWillBeSentEvent(params);
              }
            }
          ],
          [
            "Network.requestWillBeSentExtraInfo",
            (params) => {
              this.#getOrCreateNetworkRequest(params.requestId, cdpTarget).onRequestWillBeSentExtraInfoEvent(params);
            }
          ],
          [
            "Network.responseReceived",
            (params) => {
              this.#getOrCreateNetworkRequest(params.requestId, cdpTarget).onResponseReceivedEvent(params);
            }
          ],
          [
            "Network.responseReceivedExtraInfo",
            (params) => {
              this.#getOrCreateNetworkRequest(params.requestId, cdpTarget).onResponseReceivedExtraInfoEvent(params);
            }
          ],
          [
            "Network.requestServedFromCache",
            (params) => {
              this.#getOrCreateNetworkRequest(params.requestId, cdpTarget).onServedFromCache();
            }
          ],
          [
            "Network.loadingFailed",
            (params) => {
              this.#getOrCreateNetworkRequest(params.requestId, cdpTarget).onLoadingFailedEvent(params);
            }
          ],
          [
            "Fetch.requestPaused",
            (event) => {
              this.#getOrCreateNetworkRequest(
                // CDP quirk if the Network domain is not present this is undefined
                event.networkId ?? event.requestId,
                cdpTarget
              ).onRequestPaused(event);
            }
          ],
          [
            "Fetch.authRequired",
            (event) => {
              let request = this.getRequestByFetchId(event.requestId);
              if (!request) {
                request = this.#getOrCreateNetworkRequest(event.requestId, cdpTarget);
              }
              request.onAuthRequired(event);
            }
          ]
        ];
        for (const [event, listener] of listeners) {
          cdpClient.on(event, listener);
        }
      }
      getInterceptionStages(browsingContextId) {
        const stages = {
          request: false,
          response: false,
          auth: false
        };
        for (const intercept of this.#intercepts.values()) {
          if (intercept.contexts && !intercept.contexts.includes(browsingContextId)) {
            continue;
          }
          stages.request ||= intercept.phases.includes(
            "beforeRequestSent"
            /* Network.InterceptPhase.BeforeRequestSent */
          );
          stages.response ||= intercept.phases.includes(
            "responseStarted"
            /* Network.InterceptPhase.ResponseStarted */
          );
          stages.auth ||= intercept.phases.includes(
            "authRequired"
            /* Network.InterceptPhase.AuthRequired */
          );
        }
        return stages;
      }
      getInterceptsForPhase(request, phase) {
        if (request.url === NetworkRequest_js_1.NetworkRequest.unknownParameter) {
          return /* @__PURE__ */ new Set();
        }
        const intercepts = /* @__PURE__ */ new Set();
        for (const [interceptId, intercept] of this.#intercepts.entries()) {
          if (!intercept.phases.includes(phase) || intercept.contexts && !intercept.contexts.includes(request.cdpTarget.topLevelId)) {
            continue;
          }
          if (intercept.urlPatterns.length === 0) {
            intercepts.add(interceptId);
            continue;
          }
          for (const pattern of intercept.urlPatterns) {
            if ((0, NetworkUtils_js_1.matchUrlPattern)(pattern, request.url)) {
              intercepts.add(interceptId);
              break;
            }
          }
        }
        return intercepts;
      }
      disposeRequestMap(sessionId) {
        for (const request of this.#requests.values()) {
          if (request.cdpClient.sessionId === sessionId) {
            this.#requests.delete(request.id);
          }
        }
      }
      /**
       * Adds the given entry to the intercept map.
       * URL patterns are assumed to be parsed.
       *
       * @return The intercept ID.
       */
      addIntercept(value) {
        const interceptId = (0, uuid_js_1.uuidv4)();
        this.#intercepts.set(interceptId, value);
        return interceptId;
      }
      /**
       * Removes the given intercept from the intercept map.
       * Throws NoSuchInterceptException if the intercept does not exist.
       */
      removeIntercept(intercept) {
        if (!this.#intercepts.has(intercept)) {
          throw new protocol_js_1.NoSuchInterceptException(`Intercept '${intercept}' does not exist.`);
        }
        this.#intercepts.delete(intercept);
      }
      getRequestById(id) {
        return this.#requests.get(id);
      }
      getRequestByFetchId(fetchId) {
        for (const request of this.#requests.values()) {
          if (request.fetchId === fetchId) {
            return request;
          }
        }
        return;
      }
      addRequest(request) {
        this.#requests.set(request.id, request);
      }
      deleteRequest(id) {
        this.#requests.delete(id);
      }
      /**
       * Gets the virtual navigation ID for the given navigable ID.
       */
      getNavigationId(contextId) {
        if (contextId === void 0) {
          return null;
        }
        return this.#browsingContextStorage.findContext(contextId)?.navigationId ?? null;
      }
      set defaultCacheBehavior(behavior) {
        this.#defaultCacheBehavior = behavior;
      }
      get defaultCacheBehavior() {
        return this.#defaultCacheBehavior;
      }
    };
    exports.NetworkStorage = NetworkStorage;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/PreloadScriptStorage.js
var require_PreloadScriptStorage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/PreloadScriptStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PreloadScriptStorage = void 0;
    var PreloadScriptStorage = class {
      /** Tracks all BiDi preload scripts.  */
      #scripts = /* @__PURE__ */ new Set();
      /**
       * Finds all entries that match the given filter (OR logic).
       */
      find(filter2) {
        if (!filter2) {
          return [...this.#scripts];
        }
        return [...this.#scripts].filter((script) => {
          if (filter2.id !== void 0 && filter2.id === script.id) {
            return true;
          }
          if (filter2.targetId !== void 0 && script.targetIds.has(filter2.targetId)) {
            return true;
          }
          if (filter2.global !== void 0 && // Global scripts have no contexts
          (filter2.global && script.contexts === void 0 || // Non global scripts always have contexts
          !filter2.global && script.contexts !== void 0)) {
            return true;
          }
          return false;
        });
      }
      add(preloadScript) {
        this.#scripts.add(preloadScript);
      }
      /** Deletes all BiDi preload script entries that match the given filter. */
      remove(filter2) {
        for (const preloadScript of this.find(filter2)) {
          this.#scripts.delete(preloadScript);
        }
      }
    };
    exports.PreloadScriptStorage = PreloadScriptStorage;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/RealmStorage.js
var require_RealmStorage = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/script/RealmStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RealmStorage = void 0;
    var protocol_js_1 = require_protocol();
    var WindowRealm_js_1 = require_WindowRealm();
    var RealmStorage = class {
      /** Tracks handles and their realms sent to the client. */
      #knownHandlesToRealmMap = /* @__PURE__ */ new Map();
      /** Map from realm ID to Realm. */
      #realmMap = /* @__PURE__ */ new Map();
      get knownHandlesToRealmMap() {
        return this.#knownHandlesToRealmMap;
      }
      addRealm(realm) {
        this.#realmMap.set(realm.realmId, realm);
      }
      /** Finds all realms that match the given filter. */
      findRealms(filter2) {
        return Array.from(this.#realmMap.values()).filter((realm) => {
          if (filter2.realmId !== void 0 && filter2.realmId !== realm.realmId) {
            return false;
          }
          if (filter2.browsingContextId !== void 0 && !realm.associatedBrowsingContexts.map((browsingContext) => browsingContext.id).includes(filter2.browsingContextId)) {
            return false;
          }
          if (filter2.sandbox !== void 0 && (!(realm instanceof WindowRealm_js_1.WindowRealm) || filter2.sandbox !== realm.sandbox)) {
            return false;
          }
          if (filter2.executionContextId !== void 0 && filter2.executionContextId !== realm.executionContextId) {
            return false;
          }
          if (filter2.origin !== void 0 && filter2.origin !== realm.origin) {
            return false;
          }
          if (filter2.type !== void 0 && filter2.type !== realm.realmType) {
            return false;
          }
          if (filter2.cdpSessionId !== void 0 && filter2.cdpSessionId !== realm.cdpClient.sessionId) {
            return false;
          }
          return true;
        });
      }
      findRealm(filter2) {
        const maybeRealms = this.findRealms(filter2);
        if (maybeRealms.length !== 1) {
          return void 0;
        }
        return maybeRealms[0];
      }
      /** Gets the only realm that matches the given filter, if any, otherwise throws. */
      getRealm(filter2) {
        const maybeRealm = this.findRealm(filter2);
        if (maybeRealm === void 0) {
          throw new protocol_js_1.NoSuchFrameException(`Realm ${JSON.stringify(filter2)} not found`);
        }
        return maybeRealm;
      }
      /** Deletes all realms that match the given filter. */
      deleteRealms(filter2) {
        this.findRealms(filter2).map((realm) => {
          realm.dispose();
          this.#realmMap.delete(realm.realmId);
          Array.from(this.knownHandlesToRealmMap.entries()).filter(([, r]) => r === realm.realmId).map(([handle]) => this.knownHandlesToRealmMap.delete(handle));
        });
      }
    };
    exports.RealmStorage = RealmStorage;
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/Buffer.js
var require_Buffer = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/Buffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Buffer = void 0;
    var Buffer2 = class {
      #capacity;
      #entries = [];
      #onItemRemoved;
      /**
       * @param capacity The buffer capacity.
       * @param onItemRemoved Delegate called for each removed element.
       */
      constructor(capacity, onItemRemoved) {
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
            this.#onItemRemoved?.(item);
          }
        }
      }
    };
    exports.Buffer = Buffer2;
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

// node_modules/chromium-bidi/lib/cjs/utils/DistinctValues.js
var require_DistinctValues = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/DistinctValues.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.distinctValues = distinctValues;
    exports.deterministicJSONStringify = deterministicJSONStringify;
    function distinctValues(values) {
      const map2 = /* @__PURE__ */ new Map();
      for (const value of values) {
        map2.set(deterministicJSONStringify(value), value);
      }
      return Array.from(map2.values());
    }
    function deterministicJSONStringify(obj) {
      return JSON.stringify(normalizeObject(obj));
    }
    function normalizeObject(obj) {
      if (obj === void 0 || obj === null || Array.isArray(obj) || typeof obj !== "object") {
        return obj;
      }
      const newObj = {};
      for (const key of Object.keys(obj).sort()) {
        const value = obj[key];
        newObj[key] = normalizeObject(value);
      }
      return newObj;
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/utils/IdWrapper.js
var require_IdWrapper = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/utils/IdWrapper.js"(exports) {
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

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/events.js
var require_events = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/events.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isCdpEvent = isCdpEvent2;
    exports.assertSupportedEvent = assertSupportedEvent;
    var protocol_js_1 = require_protocol();
    function isCdpEvent2(name) {
      return name.split(".").at(0)?.startsWith(protocol_js_1.ChromiumBidi.BiDiModule.Cdp) ?? false;
    }
    function assertSupportedEvent(name) {
      if (!protocol_js_1.ChromiumBidi.EVENT_NAMES.has(name) && !isCdpEvent2(name)) {
        throw new protocol_js_1.InvalidArgumentException(`Unknown event: ${name}`);
      }
    }
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/SubscriptionManager.js
var require_SubscriptionManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/SubscriptionManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscriptionManager = void 0;
    exports.cartesianProduct = cartesianProduct;
    exports.unrollEvents = unrollEvents;
    var protocol_js_1 = require_protocol();
    var events_js_1 = require_events();
    function cartesianProduct(...a) {
      return a.reduce((a2, b) => a2.flatMap((d) => b.map((e) => [d, e].flat())));
    }
    function unrollEvents(events) {
      const allEvents = /* @__PURE__ */ new Set();
      function addEvents(events2) {
        for (const event of events2) {
          allEvents.add(event);
        }
      }
      for (const event of events) {
        switch (event) {
          case protocol_js_1.ChromiumBidi.BiDiModule.Bluetooth:
            addEvents(Object.values(protocol_js_1.ChromiumBidi.Bluetooth.EventNames));
            break;
          case protocol_js_1.ChromiumBidi.BiDiModule.BrowsingContext:
            addEvents(Object.values(protocol_js_1.ChromiumBidi.BrowsingContext.EventNames));
            break;
          case protocol_js_1.ChromiumBidi.BiDiModule.Log:
            addEvents(Object.values(protocol_js_1.ChromiumBidi.Log.EventNames));
            break;
          case protocol_js_1.ChromiumBidi.BiDiModule.Network:
            addEvents(Object.values(protocol_js_1.ChromiumBidi.Network.EventNames));
            break;
          case protocol_js_1.ChromiumBidi.BiDiModule.Script:
            addEvents(Object.values(protocol_js_1.ChromiumBidi.Script.EventNames));
            break;
          default:
            allEvents.add(event);
        }
      }
      return [...allEvents.values()];
    }
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
        const priorities = relevantContexts.map((context) => {
          const priority = contextToEventMap.get(context)?.get(eventMethod);
          if ((0, events_js_1.isCdpEvent)(eventMethod)) {
            const cdpPriority = contextToEventMap.get(context)?.get(protocol_js_1.ChromiumBidi.BiDiModule.Cdp);
            return priority && cdpPriority ? Math.min(priority, cdpPriority) : (
              // At this point we know that we have subscribed
              // to only one of the two
              priority ?? cdpPriority
            );
          }
          return priority;
        }).filter((p) => p !== void 0);
        if (priorities.length === 0) {
          return null;
        }
        return Math.min(...priorities);
      }
      /**
       * @param module BiDi+ module
       * @param contextId `null` == globally subscribed
       *
       * @returns
       */
      isSubscribedTo(moduleOrEvent, contextId = null) {
        const topLevelContext = this.#browsingContextStorage.findTopLevelContextId(contextId);
        for (const browserContextToEventMap of this.#channelToContextToEventMap.values()) {
          for (const [id, eventMap] of browserContextToEventMap.entries()) {
            if (topLevelContext !== id && id !== null) {
              continue;
            }
            for (const event of eventMap.keys()) {
              if (
                // Event explicitly subscribed
                event === moduleOrEvent || // Event subscribed via module
                event === moduleOrEvent.split(".").at(0) || // Event explicitly subscribed compared to module
                event.split(".").at(0) === moduleOrEvent
              ) {
                return true;
              }
            }
          }
        }
        return false;
      }
      /**
       * Subscribes to event in the given context and channel.
       * @param {EventNames} event
       * @param {BrowsingContext.BrowsingContext | null} contextId
       * @param {BidiPlusChannel} channel
       * @return {SubscriptionItem[]} List of
       * subscriptions. If the event is a whole module, it will return all the specific
       * events. If the contextId is null, it will return all the top-level contexts which were
       * not subscribed before the command.
       */
      subscribe(event, contextId, channel) {
        contextId = this.#browsingContextStorage.findTopLevelContextId(contextId);
        switch (event) {
          case protocol_js_1.ChromiumBidi.BiDiModule.BrowsingContext:
            return Object.values(protocol_js_1.ChromiumBidi.BrowsingContext.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel)).flat();
          case protocol_js_1.ChromiumBidi.BiDiModule.Log:
            return Object.values(protocol_js_1.ChromiumBidi.Log.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel)).flat();
          case protocol_js_1.ChromiumBidi.BiDiModule.Network:
            return Object.values(protocol_js_1.ChromiumBidi.Network.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel)).flat();
          case protocol_js_1.ChromiumBidi.BiDiModule.Script:
            return Object.values(protocol_js_1.ChromiumBidi.Script.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel)).flat();
          case protocol_js_1.ChromiumBidi.BiDiModule.Bluetooth:
            return Object.values(protocol_js_1.ChromiumBidi.Bluetooth.EventNames).map((specificEvent) => this.subscribe(specificEvent, contextId, channel)).flat();
          default:
        }
        if (!this.#channelToContextToEventMap.has(channel)) {
          this.#channelToContextToEventMap.set(channel, /* @__PURE__ */ new Map());
        }
        const contextToEventMap = this.#channelToContextToEventMap.get(channel);
        if (!contextToEventMap.has(contextId)) {
          contextToEventMap.set(contextId, /* @__PURE__ */ new Map());
        }
        const eventMap = contextToEventMap.get(contextId);
        const affectedContextIds = (contextId === null ? this.#browsingContextStorage.getTopLevelContexts().map((c) => c.id) : [contextId]).filter((contextId2) => !this.isSubscribedTo(event, contextId2));
        if (!eventMap.has(event)) {
          eventMap.set(event, this.#subscriptionPriority++);
        }
        return affectedContextIds.map((contextId2) => ({
          event,
          contextId: contextId2
        }));
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
          throw new protocol_js_1.InvalidArgumentException(`Cannot unsubscribe from ${event}, ${contextId === null ? "null" : contextId}. No subscription found.`);
        }
        const contextToEventMap = this.#channelToContextToEventMap.get(channel);
        if (!contextToEventMap.has(contextId)) {
          throw new protocol_js_1.InvalidArgumentException(`Cannot unsubscribe from ${event}, ${contextId === null ? "null" : contextId}. No subscription found.`);
        }
        const eventMap = contextToEventMap.get(contextId);
        if (!eventMap.has(event)) {
          throw new protocol_js_1.InvalidArgumentException(`Cannot unsubscribe from ${event}, ${contextId === null ? "null" : contextId}. No subscription found.`);
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

// node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/EventManager.js
var require_EventManager = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/modules/session/EventManager.js"(exports) {
    "use strict";
    var _a3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventManager = void 0;
    var protocol_js_1 = require_protocol();
    var Buffer_js_1 = require_Buffer();
    var DefaultMap_js_1 = require_DefaultMap();
    var DistinctValues_js_1 = require_DistinctValues();
    var EventEmitter_js_1 = require_EventEmitter();
    var IdWrapper_js_1 = require_IdWrapper();
    var OutgoingMessage_js_1 = require_OutgoingMessage();
    var events_js_1 = require_events();
    var SubscriptionManager_js_1 = require_SubscriptionManager();
    var EventWrapper = class {
      #idWrapper = new IdWrapper_js_1.IdWrapper();
      #contextId;
      #event;
      constructor(event, contextId) {
        this.#event = event;
        this.#contextId = contextId;
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
    var eventBufferLength = /* @__PURE__ */ new Map([[protocol_js_1.ChromiumBidi.Log.EventNames.LogEntryAdded, 100]]);
    var _eventToContextsMap, _eventBuffers, _lastMessageSent, _subscriptionManager, _browsingContextStorage, _subscribeHooks, _getMapKey, getMapKey_fn, _bufferEvent, bufferEvent_fn, _markEventSent, markEventSent_fn, _getBufferedEvents, getBufferedEvents_fn;
    var EventManager = class extends EventEmitter_js_1.EventEmitter {
      constructor(browsingContextStorage) {
        super();
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
         * Maps `eventName` + `browsingContext` to  Map of channel to last id
         * Used to avoid sending duplicated events when user
         * subscribes -> unsubscribes -> subscribes.
         */
        __privateAdd(this, _lastMessageSent, /* @__PURE__ */ new Map());
        __privateAdd(this, _subscriptionManager, void 0);
        __privateAdd(this, _browsingContextStorage, void 0);
        /**
         * Map of event name to hooks to be called when client is subscribed to the event.
         */
        __privateAdd(this, _subscribeHooks, void 0);
        __privateSet(this, _browsingContextStorage, browsingContextStorage);
        __privateSet(this, _subscriptionManager, new SubscriptionManager_js_1.SubscriptionManager(browsingContextStorage));
        __privateSet(this, _subscribeHooks, new DefaultMap_js_1.DefaultMap(() => []));
      }
      get subscriptionManager() {
        return __privateGet(this, _subscriptionManager);
      }
      addSubscribeHook(event, hook) {
        __privateGet(this, _subscribeHooks).get(event).push(hook);
      }
      registerEvent(event, contextId) {
        this.registerPromiseEvent(Promise.resolve({
          kind: "success",
          value: event
        }), contextId, event.method);
      }
      registerPromiseEvent(event, contextId, eventName) {
        const eventWrapper = new EventWrapper(event, contextId);
        const sortedChannels = __privateGet(this, _subscriptionManager).getChannelsSubscribedToEvent(eventName, contextId);
        __privateMethod(this, _bufferEvent, bufferEvent_fn).call(this, eventWrapper, eventName);
        for (const channel of sortedChannels) {
          this.emit("event", {
            message: OutgoingMessage_js_1.OutgoingMessage.createFromPromise(event, channel),
            event: eventName
          });
          __privateMethod(this, _markEventSent, markEventSent_fn).call(this, eventWrapper, channel, eventName);
        }
      }
      async subscribe(eventNames, contextIds, channel) {
        for (const name of eventNames) {
          (0, events_js_1.assertSupportedEvent)(name);
        }
        for (const contextId of contextIds) {
          if (contextId !== null) {
            __privateGet(this, _browsingContextStorage).getContext(contextId);
          }
        }
        const addedSubscriptionItems = [];
        for (const eventName of eventNames) {
          for (const contextId of contextIds) {
            addedSubscriptionItems.push(...__privateGet(this, _subscriptionManager).subscribe(eventName, contextId, channel));
            for (const eventWrapper of __privateMethod(this, _getBufferedEvents, getBufferedEvents_fn).call(this, eventName, contextId, channel)) {
              this.emit("event", {
                message: OutgoingMessage_js_1.OutgoingMessage.createFromPromise(eventWrapper.event, channel),
                event: eventName
              });
              __privateMethod(this, _markEventSent, markEventSent_fn).call(this, eventWrapper, channel, eventName);
            }
          }
        }
        (0, DistinctValues_js_1.distinctValues)(addedSubscriptionItems).forEach(({ contextId, event }) => {
          __privateGet(this, _subscribeHooks).get(event).forEach((hook) => hook(contextId));
        });
        await this.toggleModulesIfNeeded();
      }
      async unsubscribe(eventNames, contextIds, channel) {
        for (const name of eventNames) {
          (0, events_js_1.assertSupportedEvent)(name);
        }
        __privateGet(this, _subscriptionManager).unsubscribeAll(eventNames, contextIds, channel);
        await this.toggleModulesIfNeeded();
      }
      async toggleModulesIfNeeded() {
        await Promise.all(__privateGet(this, _browsingContextStorage).getAllContexts().map(async (context) => {
          return await context.toggleModulesIfNeeded();
        }));
      }
      clearBufferedEvents(contextId) {
        var _a4;
        for (const eventName of eventBufferLength.keys()) {
          const bufferMapKey = __privateMethod(_a4 = _a3, _getMapKey, getMapKey_fn).call(_a4, eventName, contextId);
          __privateGet(this, _eventBuffers).delete(bufferMapKey);
        }
      }
    };
    _eventToContextsMap = new WeakMap();
    _eventBuffers = new WeakMap();
    _lastMessageSent = new WeakMap();
    _subscriptionManager = new WeakMap();
    _browsingContextStorage = new WeakMap();
    _subscribeHooks = new WeakMap();
    _getMapKey = new WeakSet();
    getMapKey_fn = function(eventName, browsingContext) {
      return JSON.stringify({ eventName, browsingContext });
    };
    _bufferEvent = new WeakSet();
    bufferEvent_fn = function(eventWrapper, eventName) {
      var _a4;
      if (!eventBufferLength.has(eventName)) {
        return;
      }
      const bufferMapKey = __privateMethod(_a4 = _a3, _getMapKey, getMapKey_fn).call(_a4, eventName, eventWrapper.contextId);
      if (!__privateGet(this, _eventBuffers).has(bufferMapKey)) {
        __privateGet(this, _eventBuffers).set(bufferMapKey, new Buffer_js_1.Buffer(eventBufferLength.get(eventName)));
      }
      __privateGet(this, _eventBuffers).get(bufferMapKey).add(eventWrapper);
      __privateGet(this, _eventToContextsMap).get(eventName).add(eventWrapper.contextId);
    };
    _markEventSent = new WeakSet();
    markEventSent_fn = function(eventWrapper, channel, eventName) {
      var _a4;
      if (!eventBufferLength.has(eventName)) {
        return;
      }
      const lastSentMapKey = __privateMethod(_a4 = _a3, _getMapKey, getMapKey_fn).call(_a4, eventName, eventWrapper.contextId);
      const lastId = Math.max(__privateGet(this, _lastMessageSent).get(lastSentMapKey)?.get(channel) ?? 0, eventWrapper.id);
      const channelMap = __privateGet(this, _lastMessageSent).get(lastSentMapKey);
      if (channelMap) {
        channelMap.set(channel, lastId);
      } else {
        __privateGet(this, _lastMessageSent).set(lastSentMapKey, /* @__PURE__ */ new Map([[channel, lastId]]));
      }
    };
    _getBufferedEvents = new WeakSet();
    getBufferedEvents_fn = function(eventName, contextId, channel) {
      var _a4;
      const bufferMapKey = __privateMethod(_a4 = _a3, _getMapKey, getMapKey_fn).call(_a4, eventName, contextId);
      const lastSentMessageId = __privateGet(this, _lastMessageSent).get(bufferMapKey)?.get(channel) ?? -Infinity;
      const result = __privateGet(this, _eventBuffers).get(bufferMapKey)?.get().filter((wrapper) => wrapper.id > lastSentMessageId) ?? [];
      if (contextId === null) {
        Array.from(__privateGet(this, _eventToContextsMap).get(eventName).keys()).filter((_contextId) => (
          // Events without context are already in the result.
          _contextId !== null && // Events from deleted contexts should not be sent.
          __privateGet(this, _browsingContextStorage).hasContext(_contextId)
        )).map((_contextId) => __privateMethod(this, _getBufferedEvents, getBufferedEvents_fn).call(this, eventName, _contextId, channel)).forEach((events) => result.push(...events));
      }
      return result.sort((e1, e2) => e1.id - e2.id);
    };
    /**
     * Returns consistent key to be used to access value maps.
     */
    __privateAdd(EventManager, _getMapKey);
    exports.EventManager = EventManager;
    _a3 = EventManager;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiServer.js
var require_BidiServer = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiServer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BidiServer = void 0;
    var EventEmitter_js_1 = require_EventEmitter();
    var log_js_1 = require_log();
    var ProcessingQueue_js_1 = require_ProcessingQueue();
    var CommandProcessor_js_1 = require_CommandProcessor();
    var BluetoothProcessor_js_1 = require_BluetoothProcessor();
    var CdpTargetManager_js_1 = require_CdpTargetManager();
    var BrowsingContextStorage_js_1 = require_BrowsingContextStorage();
    var NetworkStorage_js_1 = require_NetworkStorage();
    var PreloadScriptStorage_js_1 = require_PreloadScriptStorage();
    var RealmStorage_js_1 = require_RealmStorage();
    var EventManager_js_1 = require_EventManager();
    var BidiServer2 = class extends EventEmitter_js_1.EventEmitter {
      #messageQueue;
      #transport;
      #commandProcessor;
      #eventManager;
      #browsingContextStorage = new BrowsingContextStorage_js_1.BrowsingContextStorage();
      #realmStorage = new RealmStorage_js_1.RealmStorage();
      #preloadScriptStorage = new PreloadScriptStorage_js_1.PreloadScriptStorage();
      #bluetoothProcessor;
      #logger;
      #handleIncomingMessage = (message) => {
        void this.#commandProcessor.processCommand(message).catch((error) => {
          this.#logger?.(log_js_1.LogType.debugError, error);
        });
      };
      #processOutgoingMessage = async (messageEntry) => {
        const message = messageEntry.message;
        if (messageEntry.channel !== null) {
          message["channel"] = messageEntry.channel;
        }
        await this.#transport.sendMessage(message);
      };
      constructor(bidiTransport, cdpConnection, browserCdpClient, selfTargetId, defaultUserContextId, parser, logger) {
        super();
        this.#logger = logger;
        this.#messageQueue = new ProcessingQueue_js_1.ProcessingQueue(this.#processOutgoingMessage, this.#logger);
        this.#transport = bidiTransport;
        this.#transport.setOnMessage(this.#handleIncomingMessage);
        this.#eventManager = new EventManager_js_1.EventManager(this.#browsingContextStorage);
        const networkStorage = new NetworkStorage_js_1.NetworkStorage(this.#eventManager, this.#browsingContextStorage, browserCdpClient, logger);
        this.#bluetoothProcessor = new BluetoothProcessor_js_1.BluetoothProcessor(this.#eventManager, this.#browsingContextStorage);
        this.#commandProcessor = new CommandProcessor_js_1.CommandProcessor(cdpConnection, browserCdpClient, this.#eventManager, this.#browsingContextStorage, this.#realmStorage, this.#preloadScriptStorage, networkStorage, this.#bluetoothProcessor, parser, async (options) => {
          await browserCdpClient.sendCommand("Security.setIgnoreCertificateErrors", {
            ignore: options.acceptInsecureCerts ?? false
          });
          new CdpTargetManager_js_1.CdpTargetManager(cdpConnection, browserCdpClient, selfTargetId, this.#eventManager, this.#browsingContextStorage, this.#realmStorage, networkStorage, this.#bluetoothProcessor, this.#preloadScriptStorage, defaultUserContextId, options?.unhandledPromptBehavior, logger);
          await browserCdpClient.sendCommand("Target.setDiscoverTargets", {
            discover: true
          });
          await browserCdpClient.sendCommand("Target.setAutoAttach", {
            autoAttach: true,
            waitForDebuggerOnStart: true,
            flatten: true
          });
          await this.#topLevelContextsLoaded();
        }, this.#logger);
        this.#eventManager.on("event", ({ message, event }) => {
          this.emitOutgoingMessage(message, event);
        });
        this.#commandProcessor.on("response", ({ message, event }) => {
          this.emitOutgoingMessage(message, event);
        });
      }
      /**
       * Creates and starts BiDi Mapper instance.
       */
      static async createAndStart(bidiTransport, cdpConnection, browserCdpClient, selfTargetId, parser, logger) {
        const [{ browserContextIds }, { targetInfos }] = await Promise.all([
          browserCdpClient.sendCommand("Target.getBrowserContexts"),
          browserCdpClient.sendCommand("Target.getTargets")
        ]);
        let defaultUserContextId = "default";
        for (const info of targetInfos) {
          if (info.browserContextId && !browserContextIds.includes(info.browserContextId)) {
            defaultUserContextId = info.browserContextId;
            break;
          }
        }
        const server = new BidiServer2(bidiTransport, cdpConnection, browserCdpClient, selfTargetId, defaultUserContextId, parser, logger);
        return server;
      }
      /**
       * Sends BiDi message.
       */
      emitOutgoingMessage(messageEntry, event) {
        this.#messageQueue.add(messageEntry, event);
      }
      close() {
        this.#transport.close();
      }
      async #topLevelContextsLoaded() {
        await Promise.all(this.#browsingContextStorage.getTopLevelContexts().map((c) => c.lifecycleLoaded()));
      }
    };
    exports.BidiServer = BidiServer2;
  }
});

// node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js
var require_BidiMapper = __commonJS({
  "node_modules/chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OutgoingMessage = exports.EventEmitter = exports.BidiServer = void 0;
    var BidiServer_js_1 = require_BidiServer();
    Object.defineProperty(exports, "BidiServer", { enumerable: true, get: function() {
      return BidiServer_js_1.BidiServer;
    } });
    var EventEmitter_js_1 = require_EventEmitter();
    Object.defineProperty(exports, "EventEmitter", { enumerable: true, get: function() {
      return EventEmitter_js_1.EventEmitter;
    } });
    var OutgoingMessage_js_1 = require_OutgoingMessage();
    Object.defineProperty(exports, "OutgoingMessage", { enumerable: true, get: function() {
      return OutgoingMessage_js_1.OutgoingMessage;
    } });
  }
});

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/BidiOverCdp.js
var BidiMapper = __toESM(require_BidiMapper(), 1);

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/CDPSession.js
var _detached, _connection, _sessionId;
var _BidiCdpSession = class extends CDPSession {
  constructor(frame, sessionId) {
    super();
    __privateAdd(this, _detached, false);
    __privateAdd(this, _connection, void 0);
    __privateAdd(this, _sessionId, Deferred.create());
    __publicField(this, "frame");
    /**
     * @internal
     */
    __publicField(this, "onClose", () => {
      _BidiCdpSession.sessions.delete(this.id());
      __privateSet(this, _detached, true);
    });
    this.frame = frame;
    if (!this.frame.page().browser().cdpSupported) {
      return;
    }
    const connection = this.frame.page().browser().connection;
    __privateSet(this, _connection, connection);
    if (sessionId) {
      __privateGet(this, _sessionId).resolve(sessionId);
      _BidiCdpSession.sessions.set(sessionId, this);
    } else {
      (async () => {
        try {
          const { result } = await connection.send("cdp.getSession", {
            context: frame._id
          });
          __privateGet(this, _sessionId).resolve(result.session);
          _BidiCdpSession.sessions.set(result.session, this);
        } catch (error) {
          __privateGet(this, _sessionId).reject(error);
        }
      })();
    }
    _BidiCdpSession.sessions.set(__privateGet(this, _sessionId).value(), this);
  }
  connection() {
    return void 0;
  }
  async send(method, params, options) {
    if (__privateGet(this, _connection) === void 0) {
      throw new UnsupportedOperation("CDP support is required for this feature. The current browser does not support CDP.");
    }
    if (__privateGet(this, _detached)) {
      throw new TargetCloseError(`Protocol error (${method}): Session closed. Most likely the page has been closed.`);
    }
    const session = await __privateGet(this, _sessionId).valueOrThrow();
    const { result } = await __privateGet(this, _connection).send("cdp.sendCommand", {
      method,
      params,
      session
    }, options?.timeout);
    return result.result;
  }
  async detach() {
    if (__privateGet(this, _connection) === void 0 || __privateGet(this, _connection).closed || __privateGet(this, _detached)) {
      return;
    }
    try {
      await this.frame.client.send("Target.detachFromTarget", {
        sessionId: this.id()
      });
    } finally {
      this.onClose();
    }
  }
  id() {
    const value = __privateGet(this, _sessionId).value();
    return typeof value === "string" ? value : "";
  }
};
var BidiCdpSession = _BidiCdpSession;
_detached = new WeakMap();
_connection = new WeakMap();
_sessionId = new WeakMap();
__publicField(BidiCdpSession, "sessions", /* @__PURE__ */ new Map());

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Connection.js
var debugProtocolSend = debug("puppeteer:webDriverBiDi:SEND \u25BA");
var debugProtocolReceive = debug("puppeteer:webDriverBiDi:RECV \u25C0");
var BidiConnection = class extends EventEmitter {
  #url;
  #transport;
  #delay;
  #timeout = 0;
  #closed = false;
  #callbacks = new CallbackRegistry();
  #emitters = [];
  constructor(url, transport, delay = 0, timeout2) {
    super();
    this.#url = url;
    this.#delay = delay;
    this.#timeout = timeout2 ?? 18e4;
    this.#transport = transport;
    this.#transport.onmessage = this.onMessage.bind(this);
    this.#transport.onclose = this.unbind.bind(this);
  }
  get closed() {
    return this.#closed;
  }
  get url() {
    return this.#url;
  }
  pipeTo(emitter) {
    this.#emitters.push(emitter);
  }
  emit(type, event) {
    for (const emitter of this.#emitters) {
      emitter.emit(type, event);
    }
    return super.emit(type, event);
  }
  send(method, params, timeout2) {
    assert(!this.#closed, "Protocol error: Connection closed.");
    return this.#callbacks.create(method, timeout2 ?? this.#timeout, (id) => {
      const stringifiedMessage = JSON.stringify({
        id,
        method,
        params
      });
      debugProtocolSend(stringifiedMessage);
      this.#transport.send(stringifiedMessage);
    });
  }
  /**
   * @internal
   */
  async onMessage(message) {
    if (this.#delay) {
      await new Promise((f) => {
        return setTimeout(f, this.#delay);
      });
    }
    debugProtocolReceive(message);
    const object = JSON.parse(message);
    if ("type" in object) {
      switch (object.type) {
        case "success":
          this.#callbacks.resolve(object.id, object);
          return;
        case "error":
          if (object.id === null) {
            break;
          }
          this.#callbacks.reject(object.id, createProtocolError(object), `${object.error}: ${object.message}`);
          return;
        case "event":
          if (isCdpEvent(object)) {
            BidiCdpSession.sessions.get(object.params.session)?.emit(object.params.event, object.params.params);
            return;
          }
          this.emit(object.method, object.params);
          return;
      }
    }
    if ("id" in object) {
      this.#callbacks.reject(object.id, `Protocol Error. Message is not in BiDi protocol format: '${message}'`, object.message);
    }
    debugError(object);
  }
  /**
   * Unbinds the connection, but keeps the transport open. Useful when the transport will
   * be reused by other connection e.g. with different protocol.
   * @internal
   */
  unbind() {
    if (this.#closed) {
      return;
    }
    this.#closed = true;
    this.#transport.onmessage = () => {
    };
    this.#transport.onclose = () => {
    };
    this.#callbacks.clear();
  }
  /**
   * Unbinds the connection and closes the transport.
   */
  dispose() {
    this.unbind();
    this.#transport.close();
  }
  getPendingProtocolErrors() {
    return this.#callbacks.getPendingProtocolErrors();
  }
};
function createProtocolError(object) {
  let message = `${object.error} ${object.message}`;
  if (object.stacktrace) {
    message += ` ${object.stacktrace}`;
  }
  return message;
}
function isCdpEvent(event) {
  return event.method.startsWith("cdp.");
}

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/BidiOverCdp.js
var bidiServerLogger = (prefix, ...args) => {
  debug(`bidi:${prefix}`)(args);
};
async function connectBidiOverCdp(cdp) {
  const transportBiDi = new NoOpTransport();
  const cdpConnectionAdapter = new CdpConnectionAdapter(cdp);
  const pptrTransport = {
    send(message) {
      transportBiDi.emitMessage(JSON.parse(message));
    },
    close() {
      bidiServer.close();
      cdpConnectionAdapter.close();
      cdp.dispose();
    },
    onmessage(_message) {
    }
  };
  transportBiDi.on("bidiResponse", (message) => {
    pptrTransport.onmessage(JSON.stringify(message));
  });
  const pptrBiDiConnection = new BidiConnection(cdp.url(), pptrTransport, cdp.delay, cdp.timeout);
  const bidiServer = await BidiMapper.BidiServer.createAndStart(
    transportBiDi,
    cdpConnectionAdapter,
    cdpConnectionAdapter.browserClient(),
    /* selfTargetId= */
    "",
    void 0,
    bidiServerLogger
  );
  return pptrBiDiConnection;
}
var CdpConnectionAdapter = class {
  #cdp;
  #adapters = /* @__PURE__ */ new Map();
  #browserCdpConnection;
  constructor(cdp) {
    this.#cdp = cdp;
    this.#browserCdpConnection = new CDPClientAdapter(cdp);
  }
  browserClient() {
    return this.#browserCdpConnection;
  }
  getCdpClient(id) {
    const session = this.#cdp.session(id);
    if (!session) {
      throw new Error(`Unknown CDP session with id ${id}`);
    }
    if (!this.#adapters.has(session)) {
      const adapter = new CDPClientAdapter(session, id, this.#browserCdpConnection);
      this.#adapters.set(session, adapter);
      return adapter;
    }
    return this.#adapters.get(session);
  }
  close() {
    this.#browserCdpConnection.close();
    for (const adapter of this.#adapters.values()) {
      adapter.close();
    }
  }
};
var CDPClientAdapter = class extends BidiMapper.EventEmitter {
  #closed = false;
  #client;
  sessionId = void 0;
  #browserClient;
  constructor(client, sessionId, browserClient) {
    super();
    this.#client = client;
    this.sessionId = sessionId;
    this.#browserClient = browserClient;
    this.#client.on("*", this.#forwardMessage);
  }
  browserClient() {
    return this.#browserClient;
  }
  #forwardMessage = (method, event) => {
    this.emit(method, event);
  };
  async sendCommand(method, ...params) {
    if (this.#closed) {
      return;
    }
    try {
      return await this.#client.send(method, ...params);
    } catch (err) {
      if (this.#closed) {
        return;
      }
      throw err;
    }
  }
  close() {
    this.#client.off("*", this.#forwardMessage);
    this.#closed = true;
  }
  isCloseError(error) {
    return error instanceof TargetCloseError;
  }
};
var NoOpTransport = class extends BidiMapper.EventEmitter {
  #onMessage = async (_m) => {
    return;
  };
  emitMessage(message) {
    void this.#onMessage(message);
  }
  setOnMessage(onMessage) {
    this.#onMessage = onMessage;
  }
  async sendMessage(message) {
    this.emit("bidiResponse", message);
  }
  close() {
    this.#onMessage = async (_m) => {
      return;
    };
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/Navigation.js
var __runInitializers = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var Navigation = (() => {
  var _a3;
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  return class Navigation2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(context) {
      const navigation = new Navigation2(context);
      navigation.#initialize();
      return navigation;
    }
    #request = __runInitializers(this, _instanceExtraInitializers);
    #navigation;
    #browsingContext;
    #disposables = new DisposableStack();
    #id;
    constructor(context) {
      super();
      this.#browsingContext = context;
    }
    #initialize() {
      const browsingContextEmitter = this.#disposables.use(new EventEmitter(this.#browsingContext));
      browsingContextEmitter.once("closed", () => {
        this.emit("failed", {
          url: this.#browsingContext.url,
          timestamp: /* @__PURE__ */ new Date()
        });
        this.dispose();
      });
      browsingContextEmitter.on("request", ({ request }) => {
        if (request.navigation === void 0 || // If a request with a navigation ID comes in, then the navigation ID is
        // for this navigation.
        !this.#matches(request.navigation)) {
          return;
        }
        this.#request = request;
        this.emit("request", request);
        const requestEmitter = this.#disposables.use(new EventEmitter(this.#request));
        requestEmitter.on("redirect", (request2) => {
          this.#request = request2;
        });
      });
      const sessionEmitter = this.#disposables.use(new EventEmitter(this.#session));
      sessionEmitter.on("browsingContext.navigationStarted", (info) => {
        if (info.context !== this.#browsingContext.id || this.#navigation !== void 0) {
          return;
        }
        this.#navigation = Navigation2.from(this.#browsingContext);
      });
      for (const eventName of [
        "browsingContext.domContentLoaded",
        "browsingContext.load"
      ]) {
        sessionEmitter.on(eventName, (info) => {
          if (info.context !== this.#browsingContext.id || info.navigation === null || !this.#matches(info.navigation)) {
            return;
          }
          this.dispose();
        });
      }
      for (const [eventName, event] of [
        ["browsingContext.fragmentNavigated", "fragment"],
        ["browsingContext.navigationFailed", "failed"],
        ["browsingContext.navigationAborted", "aborted"]
      ]) {
        sessionEmitter.on(eventName, (info) => {
          if (info.context !== this.#browsingContext.id || // Note we don't check if `navigation` is null since `null` means the
          // fragment navigated.
          !this.#matches(info.navigation)) {
            return;
          }
          this.emit(event, {
            url: info.url,
            timestamp: new Date(info.timestamp)
          });
          this.dispose();
        });
      }
    }
    #matches(navigation) {
      if (this.#navigation !== void 0 && !this.#navigation.disposed) {
        return false;
      }
      if (this.#id === void 0) {
        this.#id = navigation;
        return true;
      }
      return this.#id === navigation;
    }
    get #session() {
      return this.#browsingContext.userContext.browser.session;
    }
    get disposed() {
      return this.#disposables.disposed;
    }
    get request() {
      return this.#request;
    }
    get navigation() {
      return this.#navigation;
    }
    dispose() {
      this[disposeSymbol]();
    }
    [(_dispose_decorators = [inertIfDisposed], disposeSymbol)]() {
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/Realm.js
var __runInitializers2 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate2 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var _a;
var Realm2 = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _disown_decorators;
  let _callFunction_decorators;
  let _evaluate_decorators;
  let _resolveExecutionContextId_decorators;
  return class Realm extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate2(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _disown_decorators, { kind: "method", name: "disown", static: false, private: false, access: { has: (obj) => "disown" in obj, get: (obj) => obj.disown }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _callFunction_decorators, { kind: "method", name: "callFunction", static: false, private: false, access: { has: (obj) => "callFunction" in obj, get: (obj) => obj.callFunction }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _evaluate_decorators, { kind: "method", name: "evaluate", static: false, private: false, access: { has: (obj) => "evaluate" in obj, get: (obj) => obj.evaluate }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _resolveExecutionContextId_decorators, { kind: "method", name: "resolveExecutionContextId", static: false, private: false, access: { has: (obj) => "resolveExecutionContextId" in obj, get: (obj) => obj.resolveExecutionContextId }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    #reason = __runInitializers2(this, _instanceExtraInitializers);
    disposables = new DisposableStack();
    id;
    origin;
    executionContextId;
    constructor(id, origin) {
      super();
      this.id = id;
      this.origin = origin;
    }
    get disposed() {
      return this.#reason !== void 0;
    }
    get target() {
      return { realm: this.id };
    }
    dispose(reason) {
      this.#reason = reason;
      this[disposeSymbol]();
    }
    async disown(handles) {
      await this.session.send("script.disown", {
        target: this.target,
        handles
      });
    }
    async callFunction(functionDeclaration, awaitPromise, options = {}) {
      const { result } = await this.session.send("script.callFunction", {
        functionDeclaration,
        awaitPromise,
        target: this.target,
        ...options
      });
      return result;
    }
    async evaluate(expression, awaitPromise, options = {}) {
      const { result } = await this.session.send("script.evaluate", {
        expression,
        awaitPromise,
        target: this.target,
        ...options
      });
      return result;
    }
    async resolveExecutionContextId() {
      if (!this.executionContextId) {
        const { result } = await this.session.connection.send("cdp.resolveRealm", { realm: this.id });
        this.executionContextId = result.executionContextId;
      }
      return this.executionContextId;
    }
    [(_dispose_decorators = [inertIfDisposed], _disown_decorators = [throwIfDisposed((realm) => {
      return realm.#reason;
    })], _callFunction_decorators = [throwIfDisposed((realm) => {
      return realm.#reason;
    })], _evaluate_decorators = [throwIfDisposed((realm) => {
      return realm.#reason;
    })], _resolveExecutionContextId_decorators = [throwIfDisposed((realm) => {
      return realm.#reason;
    })], disposeSymbol)]() {
      this.#reason ??= "Realm already destroyed, probably because all associated browsing contexts closed.";
      this.emit("destroyed", { reason: this.#reason });
      this.disposables.dispose();
      super[disposeSymbol]();
    }
  };
})();
var WindowRealm = class extends Realm2 {
  static from(context, sandbox) {
    const realm = new WindowRealm(context, sandbox);
    realm.#initialize();
    return realm;
  }
  browsingContext;
  sandbox;
  #workers = /* @__PURE__ */ new Map();
  constructor(context, sandbox) {
    super("", "");
    this.browsingContext = context;
    this.sandbox = sandbox;
  }
  #initialize() {
    const browsingContextEmitter = this.disposables.use(new EventEmitter(this.browsingContext));
    browsingContextEmitter.on("closed", ({ reason }) => {
      this.dispose(reason);
    });
    const sessionEmitter = this.disposables.use(new EventEmitter(this.session));
    sessionEmitter.on("script.realmCreated", (info) => {
      if (info.type !== "window" || info.context !== this.browsingContext.id || info.sandbox !== this.sandbox) {
        return;
      }
      this.id = info.realm;
      this.origin = info.origin;
      this.executionContextId = void 0;
      this.emit("updated", this);
    });
    sessionEmitter.on("script.realmCreated", (info) => {
      if (info.type !== "dedicated-worker") {
        return;
      }
      if (!info.owners.includes(this.id)) {
        return;
      }
      const realm = DedicatedWorkerRealm.from(this, info.realm, info.origin);
      this.#workers.set(realm.id, realm);
      const realmEmitter = this.disposables.use(new EventEmitter(realm));
      realmEmitter.once("destroyed", () => {
        realmEmitter.removeAllListeners();
        this.#workers.delete(realm.id);
      });
      this.emit("worker", realm);
    });
  }
  get session() {
    return this.browsingContext.userContext.browser.session;
  }
  get target() {
    return { context: this.browsingContext.id, sandbox: this.sandbox };
  }
};
var DedicatedWorkerRealm = class extends Realm2 {
  static from(owner, id, origin) {
    const realm = new _a(owner, id, origin);
    realm.#initialize();
    return realm;
  }
  #workers = /* @__PURE__ */ new Map();
  owners;
  constructor(owner, id, origin) {
    super(id, origin);
    this.owners = /* @__PURE__ */ new Set([owner]);
  }
  #initialize() {
    const sessionEmitter = this.disposables.use(new EventEmitter(this.session));
    sessionEmitter.on("script.realmDestroyed", (info) => {
      if (info.realm !== this.id) {
        return;
      }
      this.dispose("Realm already destroyed.");
    });
    sessionEmitter.on("script.realmCreated", (info) => {
      if (info.type !== "dedicated-worker") {
        return;
      }
      if (!info.owners.includes(this.id)) {
        return;
      }
      const realm = _a.from(this, info.realm, info.origin);
      this.#workers.set(realm.id, realm);
      const realmEmitter = this.disposables.use(new EventEmitter(realm));
      realmEmitter.once("destroyed", () => {
        this.#workers.delete(realm.id);
      });
      this.emit("worker", realm);
    });
  }
  get session() {
    return this.owners.values().next().value.session;
  }
};
_a = DedicatedWorkerRealm;
var SharedWorkerRealm = class extends Realm2 {
  static from(browser, id, origin) {
    const realm = new SharedWorkerRealm(browser, id, origin);
    realm.#initialize();
    return realm;
  }
  #workers = /* @__PURE__ */ new Map();
  browser;
  constructor(browser, id, origin) {
    super(id, origin);
    this.browser = browser;
  }
  #initialize() {
    const sessionEmitter = this.disposables.use(new EventEmitter(this.session));
    sessionEmitter.on("script.realmDestroyed", (info) => {
      if (info.realm !== this.id) {
        return;
      }
      this.dispose("Realm already destroyed.");
    });
    sessionEmitter.on("script.realmCreated", (info) => {
      if (info.type !== "dedicated-worker") {
        return;
      }
      if (!info.owners.includes(this.id)) {
        return;
      }
      const realm = DedicatedWorkerRealm.from(this, info.realm, info.origin);
      this.#workers.set(realm.id, realm);
      const realmEmitter = this.disposables.use(new EventEmitter(realm));
      realmEmitter.once("destroyed", () => {
        this.#workers.delete(realm.id);
      });
      this.emit("worker", realm);
    });
  }
  get session() {
    return this.browser.session;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/Request.js
var __runInitializers3 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate3 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var Request = (() => {
  var _a3;
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  return class Request2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate3(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(browsingContext, event) {
      const request = new Request2(browsingContext, event);
      request.#initialize();
      return request;
    }
    #error = __runInitializers3(this, _instanceExtraInitializers);
    #redirect;
    #response;
    #browsingContext;
    #disposables = new DisposableStack();
    #event;
    constructor(browsingContext, event) {
      super();
      this.#browsingContext = browsingContext;
      this.#event = event;
    }
    #initialize() {
      const browsingContextEmitter = this.#disposables.use(new EventEmitter(this.#browsingContext));
      browsingContextEmitter.once("closed", ({ reason }) => {
        this.#error = reason;
        this.emit("error", this.#error);
        this.dispose();
      });
      const sessionEmitter = this.#disposables.use(new EventEmitter(this.#session));
      sessionEmitter.on("network.beforeRequestSent", (event) => {
        if (event.context !== this.#browsingContext.id || event.request.request !== this.id || event.redirectCount !== this.#event.redirectCount + 1) {
          return;
        }
        this.#redirect = Request2.from(this.#browsingContext, event);
        this.emit("redirect", this.#redirect);
        this.dispose();
      });
      sessionEmitter.on("network.authRequired", (event) => {
        if (event.context !== this.#browsingContext.id || event.request.request !== this.id || // Don't try to authenticate for events that are not blocked
        !event.isBlocked) {
          return;
        }
        this.emit("authenticate", void 0);
      });
      sessionEmitter.on("network.fetchError", (event) => {
        if (event.context !== this.#browsingContext.id || event.request.request !== this.id || this.#event.redirectCount !== event.redirectCount) {
          return;
        }
        this.#error = event.errorText;
        this.emit("error", this.#error);
        this.dispose();
      });
      sessionEmitter.on("network.responseCompleted", (event) => {
        if (event.context !== this.#browsingContext.id || event.request.request !== this.id || this.#event.redirectCount !== event.redirectCount) {
          return;
        }
        this.#response = event.response;
        this.#event.request.timings = event.request.timings;
        this.emit("success", this.#response);
        if (this.#response.status >= 300 && this.#response.status < 400) {
          return;
        }
        this.dispose();
      });
    }
    get #session() {
      return this.#browsingContext.userContext.browser.session;
    }
    get disposed() {
      return this.#disposables.disposed;
    }
    get error() {
      return this.#error;
    }
    get headers() {
      return this.#event.request.headers;
    }
    get id() {
      return this.#event.request.request;
    }
    get initiator() {
      return this.#event.initiator;
    }
    get method() {
      return this.#event.request.method;
    }
    get navigation() {
      return this.#event.navigation ?? void 0;
    }
    get redirect() {
      return this.#redirect;
    }
    get lastRedirect() {
      let redirect = this.#redirect;
      while (redirect) {
        if (redirect && !redirect.#redirect) {
          return redirect;
        }
        redirect = redirect.#redirect;
      }
      return redirect;
    }
    get response() {
      return this.#response;
    }
    get url() {
      return this.#event.request.url;
    }
    get isBlocked() {
      return this.#event.isBlocked;
    }
    get resourceType() {
      return this.#event.request["goog:resourceType"] ?? void 0;
    }
    get postData() {
      return this.#event.request["goog:postData"] ?? void 0;
    }
    get hasPostData() {
      return this.#event.request["goog:hasPostData"] ?? false;
    }
    async continueRequest({ url, method, headers, cookies, body }) {
      await this.#session.send("network.continueRequest", {
        request: this.id,
        url,
        method,
        headers,
        body,
        cookies
      });
    }
    async failRequest() {
      await this.#session.send("network.failRequest", {
        request: this.id
      });
    }
    async provideResponse({ statusCode, reasonPhrase, headers, body }) {
      await this.#session.send("network.provideResponse", {
        request: this.id,
        statusCode,
        reasonPhrase,
        headers,
        body
      });
    }
    async continueWithAuth(parameters) {
      if (parameters.action === "provideCredentials") {
        await this.#session.send("network.continueWithAuth", {
          request: this.id,
          action: parameters.action,
          credentials: parameters.credentials
        });
      } else {
        await this.#session.send("network.continueWithAuth", {
          request: this.id,
          action: parameters.action
        });
      }
    }
    dispose() {
      this[disposeSymbol]();
    }
    [(_dispose_decorators = [inertIfDisposed], disposeSymbol)]() {
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
    timing() {
      return this.#event.request.timings;
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/UserPrompt.js
var __runInitializers4 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate4 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var UserPrompt = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _handle_decorators;
  return class UserPrompt2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate4(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate4(this, null, _handle_decorators, { kind: "method", name: "handle", static: false, private: false, access: { has: (obj) => "handle" in obj, get: (obj) => obj.handle }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(browsingContext, info) {
      const userPrompt = new UserPrompt2(browsingContext, info);
      userPrompt.#initialize();
      return userPrompt;
    }
    #reason = __runInitializers4(this, _instanceExtraInitializers);
    #result;
    #disposables = new DisposableStack();
    browsingContext;
    info;
    constructor(context, info) {
      super();
      this.browsingContext = context;
      this.info = info;
    }
    #initialize() {
      const browserContextEmitter = this.#disposables.use(new EventEmitter(this.browsingContext));
      browserContextEmitter.once("closed", ({ reason }) => {
        this.dispose(`User prompt already closed: ${reason}`);
      });
      const sessionEmitter = this.#disposables.use(new EventEmitter(this.#session));
      sessionEmitter.on("browsingContext.userPromptClosed", (parameters) => {
        if (parameters.context !== this.browsingContext.id) {
          return;
        }
        this.#result = parameters;
        this.emit("handled", parameters);
        this.dispose("User prompt already handled.");
      });
    }
    get #session() {
      return this.browsingContext.userContext.browser.session;
    }
    get closed() {
      return this.#reason !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get handled() {
      if (this.info.handler === "accept" || this.info.handler === "dismiss") {
        return true;
      }
      return this.#result !== void 0;
    }
    get result() {
      return this.#result;
    }
    dispose(reason) {
      this.#reason = reason;
      this[disposeSymbol]();
    }
    async handle(options = {}) {
      await this.#session.send("browsingContext.handleUserPrompt", {
        ...options,
        context: this.info.context
      });
      return this.#result;
    }
    [(_dispose_decorators = [inertIfDisposed], _handle_decorators = [throwIfDisposed((prompt) => {
      return prompt.#reason;
    })], disposeSymbol)]() {
      this.#reason ??= "User prompt already closed, probably because the associated browsing context was destroyed.";
      this.emit("closed", { reason: this.#reason });
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/BrowsingContext.js
var __runInitializers5 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate5 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var BrowsingContext = (() => {
  var _a3;
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _activate_decorators;
  let _captureScreenshot_decorators;
  let _close_decorators;
  let _traverseHistory_decorators;
  let _navigate_decorators;
  let _reload_decorators;
  let _setCacheBehavior_decorators;
  let _print_decorators;
  let _handleUserPrompt_decorators;
  let _setViewport_decorators;
  let _performActions_decorators;
  let _releaseActions_decorators;
  let _createWindowRealm_decorators;
  let _addPreloadScript_decorators;
  let _addIntercept_decorators;
  let _removePreloadScript_decorators;
  let _getCookies_decorators;
  let _setCookie_decorators;
  let _setFiles_decorators;
  let _subscribe_decorators;
  let _addInterception_decorators;
  let _deleteCookie_decorators;
  let _locateNodes_decorators;
  return class BrowsingContext2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _deleteCookie_decorators = [throwIfDisposed((context) => {
        return context.#reason;
      })];
      _locateNodes_decorators = [throwIfDisposed((context) => {
        return context.#reason;
      })];
      __esDecorate5(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _activate_decorators, { kind: "method", name: "activate", static: false, private: false, access: { has: (obj) => "activate" in obj, get: (obj) => obj.activate }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _captureScreenshot_decorators, { kind: "method", name: "captureScreenshot", static: false, private: false, access: { has: (obj) => "captureScreenshot" in obj, get: (obj) => obj.captureScreenshot }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: (obj) => "close" in obj, get: (obj) => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _traverseHistory_decorators, { kind: "method", name: "traverseHistory", static: false, private: false, access: { has: (obj) => "traverseHistory" in obj, get: (obj) => obj.traverseHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _navigate_decorators, { kind: "method", name: "navigate", static: false, private: false, access: { has: (obj) => "navigate" in obj, get: (obj) => obj.navigate }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _reload_decorators, { kind: "method", name: "reload", static: false, private: false, access: { has: (obj) => "reload" in obj, get: (obj) => obj.reload }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _setCacheBehavior_decorators, { kind: "method", name: "setCacheBehavior", static: false, private: false, access: { has: (obj) => "setCacheBehavior" in obj, get: (obj) => obj.setCacheBehavior }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _print_decorators, { kind: "method", name: "print", static: false, private: false, access: { has: (obj) => "print" in obj, get: (obj) => obj.print }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _handleUserPrompt_decorators, { kind: "method", name: "handleUserPrompt", static: false, private: false, access: { has: (obj) => "handleUserPrompt" in obj, get: (obj) => obj.handleUserPrompt }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _setViewport_decorators, { kind: "method", name: "setViewport", static: false, private: false, access: { has: (obj) => "setViewport" in obj, get: (obj) => obj.setViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _performActions_decorators, { kind: "method", name: "performActions", static: false, private: false, access: { has: (obj) => "performActions" in obj, get: (obj) => obj.performActions }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _releaseActions_decorators, { kind: "method", name: "releaseActions", static: false, private: false, access: { has: (obj) => "releaseActions" in obj, get: (obj) => obj.releaseActions }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _createWindowRealm_decorators, { kind: "method", name: "createWindowRealm", static: false, private: false, access: { has: (obj) => "createWindowRealm" in obj, get: (obj) => obj.createWindowRealm }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _addPreloadScript_decorators, { kind: "method", name: "addPreloadScript", static: false, private: false, access: { has: (obj) => "addPreloadScript" in obj, get: (obj) => obj.addPreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _addIntercept_decorators, { kind: "method", name: "addIntercept", static: false, private: false, access: { has: (obj) => "addIntercept" in obj, get: (obj) => obj.addIntercept }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _removePreloadScript_decorators, { kind: "method", name: "removePreloadScript", static: false, private: false, access: { has: (obj) => "removePreloadScript" in obj, get: (obj) => obj.removePreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _getCookies_decorators, { kind: "method", name: "getCookies", static: false, private: false, access: { has: (obj) => "getCookies" in obj, get: (obj) => obj.getCookies }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _setCookie_decorators, { kind: "method", name: "setCookie", static: false, private: false, access: { has: (obj) => "setCookie" in obj, get: (obj) => obj.setCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _setFiles_decorators, { kind: "method", name: "setFiles", static: false, private: false, access: { has: (obj) => "setFiles" in obj, get: (obj) => obj.setFiles }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _subscribe_decorators, { kind: "method", name: "subscribe", static: false, private: false, access: { has: (obj) => "subscribe" in obj, get: (obj) => obj.subscribe }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _addInterception_decorators, { kind: "method", name: "addInterception", static: false, private: false, access: { has: (obj) => "addInterception" in obj, get: (obj) => obj.addInterception }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _deleteCookie_decorators, { kind: "method", name: "deleteCookie", static: false, private: false, access: { has: (obj) => "deleteCookie" in obj, get: (obj) => obj.deleteCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, null, _locateNodes_decorators, { kind: "method", name: "locateNodes", static: false, private: false, access: { has: (obj) => "locateNodes" in obj, get: (obj) => obj.locateNodes }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(userContext, parent, id, url, originalOpener) {
      const browsingContext = new BrowsingContext2(userContext, parent, id, url, originalOpener);
      browsingContext.#initialize();
      return browsingContext;
    }
    #navigation = __runInitializers5(this, _instanceExtraInitializers);
    #reason;
    #url;
    #children = /* @__PURE__ */ new Map();
    #disposables = new DisposableStack();
    #realms = /* @__PURE__ */ new Map();
    #requests = /* @__PURE__ */ new Map();
    defaultRealm;
    id;
    parent;
    userContext;
    originalOpener;
    constructor(context, parent, id, url, originalOpener) {
      super();
      this.#url = url;
      this.id = id;
      this.parent = parent;
      this.userContext = context;
      this.originalOpener = originalOpener;
      this.defaultRealm = this.#createWindowRealm();
    }
    #initialize() {
      const userContextEmitter = this.#disposables.use(new EventEmitter(this.userContext));
      userContextEmitter.once("closed", ({ reason }) => {
        this.dispose(`Browsing context already closed: ${reason}`);
      });
      const sessionEmitter = this.#disposables.use(new EventEmitter(this.#session));
      sessionEmitter.on("browsingContext.contextCreated", (info) => {
        if (info.parent !== this.id) {
          return;
        }
        const browsingContext = BrowsingContext2.from(this.userContext, this, info.context, info.url, info.originalOpener);
        this.#children.set(info.context, browsingContext);
        const browsingContextEmitter = this.#disposables.use(new EventEmitter(browsingContext));
        browsingContextEmitter.once("closed", () => {
          browsingContextEmitter.removeAllListeners();
          this.#children.delete(browsingContext.id);
        });
        this.emit("browsingcontext", { browsingContext });
      });
      sessionEmitter.on("browsingContext.contextDestroyed", (info) => {
        if (info.context !== this.id) {
          return;
        }
        this.dispose("Browsing context already closed.");
      });
      sessionEmitter.on("browsingContext.domContentLoaded", (info) => {
        if (info.context !== this.id) {
          return;
        }
        this.#url = info.url;
        this.emit("DOMContentLoaded", void 0);
      });
      sessionEmitter.on("browsingContext.load", (info) => {
        if (info.context !== this.id) {
          return;
        }
        this.#url = info.url;
        this.emit("load", void 0);
      });
      sessionEmitter.on("browsingContext.navigationStarted", (info) => {
        if (info.context !== this.id) {
          return;
        }
        for (const [id, request] of this.#requests) {
          if (request.disposed) {
            this.#requests.delete(id);
          }
        }
        if (this.#navigation !== void 0 && !this.#navigation.disposed) {
          return;
        }
        this.#navigation = Navigation.from(this);
        const navigationEmitter = this.#disposables.use(new EventEmitter(this.#navigation));
        for (const eventName of ["fragment", "failed", "aborted"]) {
          navigationEmitter.once(eventName, ({ url }) => {
            navigationEmitter[disposeSymbol]();
            this.#url = url;
          });
        }
        this.emit("navigation", { navigation: this.#navigation });
      });
      sessionEmitter.on("network.beforeRequestSent", (event) => {
        if (event.context !== this.id) {
          return;
        }
        if (this.#requests.has(event.request.request)) {
          return;
        }
        const request = Request.from(this, event);
        this.#requests.set(request.id, request);
        this.emit("request", { request });
      });
      sessionEmitter.on("log.entryAdded", (entry) => {
        if (entry.source.context !== this.id) {
          return;
        }
        this.emit("log", { entry });
      });
      sessionEmitter.on("browsingContext.userPromptOpened", (info) => {
        if (info.context !== this.id) {
          return;
        }
        const userPrompt = UserPrompt.from(this, info);
        this.emit("userprompt", { userPrompt });
      });
    }
    get #session() {
      return this.userContext.browser.session;
    }
    get children() {
      return this.#children.values();
    }
    get closed() {
      return this.#reason !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get realms() {
      const self = this;
      return function* () {
        yield self.defaultRealm;
        yield* self.#realms.values();
      }();
    }
    get top() {
      let context = this;
      for (let { parent } = context; parent; { parent } = context) {
        context = parent;
      }
      return context;
    }
    get url() {
      return this.#url;
    }
    #createWindowRealm(sandbox) {
      const realm = WindowRealm.from(this, sandbox);
      realm.on("worker", (realm2) => {
        this.emit("worker", { realm: realm2 });
      });
      return realm;
    }
    dispose(reason) {
      this.#reason = reason;
      for (const context of this.#children.values()) {
        context.dispose("Parent browsing context was disposed");
      }
      this[disposeSymbol]();
    }
    async activate() {
      await this.#session.send("browsingContext.activate", {
        context: this.id
      });
    }
    async captureScreenshot(options = {}) {
      const { result: { data } } = await this.#session.send("browsingContext.captureScreenshot", {
        context: this.id,
        ...options
      });
      return data;
    }
    async close(promptUnload) {
      await Promise.all([...this.#children.values()].map(async (child) => {
        await child.close(promptUnload);
      }));
      await this.#session.send("browsingContext.close", {
        context: this.id,
        promptUnload
      });
    }
    async traverseHistory(delta) {
      await this.#session.send("browsingContext.traverseHistory", {
        context: this.id,
        delta
      });
    }
    async navigate(url, wait) {
      await this.#session.send("browsingContext.navigate", {
        context: this.id,
        url,
        wait
      });
    }
    async reload(options = {}) {
      await this.#session.send("browsingContext.reload", {
        context: this.id,
        ...options
      });
    }
    async setCacheBehavior(cacheBehavior) {
      await this.#session.send("network.setCacheBehavior", {
        contexts: [this.id],
        cacheBehavior
      });
    }
    async print(options = {}) {
      const { result: { data } } = await this.#session.send("browsingContext.print", {
        context: this.id,
        ...options
      });
      return data;
    }
    async handleUserPrompt(options = {}) {
      await this.#session.send("browsingContext.handleUserPrompt", {
        context: this.id,
        ...options
      });
    }
    async setViewport(options = {}) {
      await this.#session.send("browsingContext.setViewport", {
        context: this.id,
        ...options
      });
    }
    async performActions(actions) {
      await this.#session.send("input.performActions", {
        context: this.id,
        actions
      });
    }
    async releaseActions() {
      await this.#session.send("input.releaseActions", {
        context: this.id
      });
    }
    createWindowRealm(sandbox) {
      return this.#createWindowRealm(sandbox);
    }
    async addPreloadScript(functionDeclaration, options = {}) {
      return await this.userContext.browser.addPreloadScript(functionDeclaration, {
        ...options,
        contexts: [this]
      });
    }
    async addIntercept(options) {
      const { result: { intercept } } = await this.userContext.browser.session.send("network.addIntercept", {
        ...options,
        contexts: [this.id]
      });
      return intercept;
    }
    async removePreloadScript(script) {
      await this.userContext.browser.removePreloadScript(script);
    }
    async getCookies(options = {}) {
      const { result: { cookies } } = await this.#session.send("storage.getCookies", {
        ...options,
        partition: {
          type: "context",
          context: this.id
        }
      });
      return cookies;
    }
    async setCookie(cookie) {
      await this.#session.send("storage.setCookie", {
        cookie,
        partition: {
          type: "context",
          context: this.id
        }
      });
    }
    async setFiles(element, files) {
      await this.#session.send("input.setFiles", {
        context: this.id,
        element,
        files
      });
    }
    async subscribe(events) {
      await this.#session.subscribe(events, [this.id]);
    }
    async addInterception(events) {
      await this.#session.subscribe(events, [this.id]);
    }
    [(_dispose_decorators = [inertIfDisposed], _activate_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _captureScreenshot_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _close_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _traverseHistory_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _navigate_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _reload_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _setCacheBehavior_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _print_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _handleUserPrompt_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _setViewport_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _performActions_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _releaseActions_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _createWindowRealm_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _addPreloadScript_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _addIntercept_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _removePreloadScript_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _getCookies_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _setCookie_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _setFiles_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _subscribe_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _addInterception_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], disposeSymbol)]() {
      this.#reason ??= "Browsing context already closed, probably because the user context closed.";
      this.emit("closed", { reason: this.#reason });
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
    async deleteCookie(...cookieFilters) {
      await Promise.all(cookieFilters.map(async (filter2) => {
        await this.#session.send("storage.deleteCookies", {
          filter: filter2,
          partition: {
            type: "context",
            context: this.id
          }
        });
      }));
    }
    async locateNodes(locator, startNodes) {
      const result = await this.#session.send("browsingContext.locateNodes", {
        context: this.id,
        locator,
        startNodes: startNodes.length ? startNodes : void 0
      });
      return result.result.nodes;
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/UserContext.js
var __runInitializers6 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate6 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var UserContext = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _createBrowsingContext_decorators;
  let _remove_decorators;
  let _getCookies_decorators;
  let _setCookie_decorators;
  let _setPermissions_decorators;
  return class UserContext2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate6(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate6(this, null, _createBrowsingContext_decorators, { kind: "method", name: "createBrowsingContext", static: false, private: false, access: { has: (obj) => "createBrowsingContext" in obj, get: (obj) => obj.createBrowsingContext }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate6(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: (obj) => "remove" in obj, get: (obj) => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate6(this, null, _getCookies_decorators, { kind: "method", name: "getCookies", static: false, private: false, access: { has: (obj) => "getCookies" in obj, get: (obj) => obj.getCookies }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate6(this, null, _setCookie_decorators, { kind: "method", name: "setCookie", static: false, private: false, access: { has: (obj) => "setCookie" in obj, get: (obj) => obj.setCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate6(this, null, _setPermissions_decorators, { kind: "method", name: "setPermissions", static: false, private: false, access: { has: (obj) => "setPermissions" in obj, get: (obj) => obj.setPermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static DEFAULT = "default";
    static create(browser, id) {
      const context = new UserContext2(browser, id);
      context.#initialize();
      return context;
    }
    #reason = __runInitializers6(this, _instanceExtraInitializers);
    // Note these are only top-level contexts.
    #browsingContexts = /* @__PURE__ */ new Map();
    #disposables = new DisposableStack();
    #id;
    browser;
    constructor(browser, id) {
      super();
      this.#id = id;
      this.browser = browser;
    }
    #initialize() {
      const browserEmitter = this.#disposables.use(new EventEmitter(this.browser));
      browserEmitter.once("closed", ({ reason }) => {
        this.dispose(`User context was closed: ${reason}`);
      });
      browserEmitter.once("disconnected", ({ reason }) => {
        this.dispose(`User context was closed: ${reason}`);
      });
      const sessionEmitter = this.#disposables.use(new EventEmitter(this.#session));
      sessionEmitter.on("browsingContext.contextCreated", (info) => {
        if (info.parent) {
          return;
        }
        if (info.userContext !== this.#id) {
          return;
        }
        const browsingContext = BrowsingContext.from(this, void 0, info.context, info.url, info.originalOpener);
        this.#browsingContexts.set(browsingContext.id, browsingContext);
        const browsingContextEmitter = this.#disposables.use(new EventEmitter(browsingContext));
        browsingContextEmitter.on("closed", () => {
          browsingContextEmitter.removeAllListeners();
          this.#browsingContexts.delete(browsingContext.id);
        });
        this.emit("browsingcontext", { browsingContext });
      });
    }
    get #session() {
      return this.browser.session;
    }
    get browsingContexts() {
      return this.#browsingContexts.values();
    }
    get closed() {
      return this.#reason !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get id() {
      return this.#id;
    }
    dispose(reason) {
      this.#reason = reason;
      this[disposeSymbol]();
    }
    async createBrowsingContext(type, options = {}) {
      const { result: { context: contextId } } = await this.#session.send("browsingContext.create", {
        type,
        ...options,
        referenceContext: options.referenceContext?.id,
        userContext: this.#id
      });
      const browsingContext = this.#browsingContexts.get(contextId);
      assert(browsingContext, "The WebDriver BiDi implementation is failing to create a browsing context correctly.");
      return browsingContext;
    }
    async remove() {
      try {
        await this.#session.send("browser.removeUserContext", {
          userContext: this.#id
        });
      } finally {
        this.dispose("User context already closed.");
      }
    }
    async getCookies(options = {}, sourceOrigin = void 0) {
      const { result: { cookies } } = await this.#session.send("storage.getCookies", {
        ...options,
        partition: {
          type: "storageKey",
          userContext: this.#id,
          sourceOrigin
        }
      });
      return cookies;
    }
    async setCookie(cookie, sourceOrigin) {
      await this.#session.send("storage.setCookie", {
        cookie,
        partition: {
          type: "storageKey",
          sourceOrigin,
          userContext: this.id
        }
      });
    }
    async setPermissions(origin, descriptor, state) {
      await this.#session.send("permissions.setPermission", {
        origin,
        descriptor,
        state,
        userContext: this.#id
      });
    }
    [(_dispose_decorators = [inertIfDisposed], _createBrowsingContext_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _remove_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _getCookies_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _setCookie_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], _setPermissions_decorators = [throwIfDisposed((context) => {
      return context.#reason;
    })], disposeSymbol)]() {
      this.#reason ??= "User context already closed, probably because the browser disconnected/closed.";
      this.emit("closed", { reason: this.#reason });
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Deserializer.js
var _deserializeNumber, deserializeNumber_fn, _deserializeTuple, deserializeTuple_fn;
var BidiDeserializer = class {
  static deserialize(result) {
    if (!result) {
      debugError("Service did not produce a result.");
      return void 0;
    }
    switch (result.type) {
      case "array":
        return result.value?.map((value) => {
          return this.deserialize(value);
        });
      case "set":
        return result.value?.reduce((acc, value) => {
          return acc.add(this.deserialize(value));
        }, /* @__PURE__ */ new Set());
      case "object":
        return result.value?.reduce((acc, tuple) => {
          const { key, value } = __privateMethod(this, _deserializeTuple, deserializeTuple_fn).call(this, tuple);
          acc[key] = value;
          return acc;
        }, {});
      case "map":
        return result.value?.reduce((acc, tuple) => {
          const { key, value } = __privateMethod(this, _deserializeTuple, deserializeTuple_fn).call(this, tuple);
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
        return __privateMethod(this, _deserializeNumber, deserializeNumber_fn).call(this, result.value);
      case "bigint":
        return BigInt(result.value);
      case "boolean":
        return Boolean(result.value);
      case "string":
        return result.value;
    }
    debugError(`Deserialization of type ${result.type} not supported.`);
    return void 0;
  }
};
_deserializeNumber = new WeakSet();
deserializeNumber_fn = function(value) {
  switch (value) {
    case "-0":
      return -0;
    case "NaN":
      return NaN;
    case "Infinity":
      return Infinity;
    case "-Infinity":
      return -Infinity;
    default:
      return value;
  }
};
_deserializeTuple = new WeakSet();
deserializeTuple_fn = function([serializedKey, serializedValue]) {
  const key = typeof serializedKey === "string" ? serializedKey : this.deserialize(serializedKey);
  const value = this.deserialize(serializedValue);
  return { key, value };
};
__privateAdd(BidiDeserializer, _deserializeNumber);
__privateAdd(BidiDeserializer, _deserializeTuple);

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Dialog.js
var BidiDialog = class extends Dialog {
  static from(prompt) {
    return new BidiDialog(prompt);
  }
  #prompt;
  constructor(prompt) {
    super(prompt.info.type, prompt.info.message, prompt.info.defaultValue);
    this.#prompt = prompt;
    this.handled = prompt.handled;
  }
  async handle(options) {
    await this.#prompt.handle({
      accept: options.accept,
      userText: options.text
    });
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/ExposedFunction.js
var Bidi = __toESM(require_protocol(), 1);

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/JSHandle.js
var BidiJSHandle = class extends JSHandle {
  static from(value, realm) {
    return new BidiJSHandle(value, realm);
  }
  #remoteValue;
  realm;
  #disposed = false;
  constructor(value, realm) {
    super();
    this.#remoteValue = value;
    this.realm = realm;
  }
  get disposed() {
    return this.#disposed;
  }
  async jsonValue() {
    return await this.evaluate((value) => {
      return value;
    });
  }
  asElement() {
    return null;
  }
  async dispose() {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    await this.realm.destroyHandles([this]);
  }
  get isPrimitiveValue() {
    switch (this.#remoteValue.type) {
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
      return "JSHandle:" + BidiDeserializer.deserialize(this.#remoteValue);
    }
    return "JSHandle@" + this.#remoteValue.type;
  }
  get id() {
    return "handle" in this.#remoteValue ? this.#remoteValue.handle : void 0;
  }
  remoteValue() {
    return this.#remoteValue;
  }
  remoteObject() {
    throw new UnsupportedOperation("Not available in WebDriver BiDi");
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/ElementHandle.js
var __runInitializers7 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate7 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __addDisposableResource = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async)
        inner = dispose;
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    if (inner)
      dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources = function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1)
            return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async)
              return s |= 2, Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } else
            s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1)
        return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError)
        throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var BidiElementHandle = (() => {
  let _classSuper = ElementHandle;
  let _instanceExtraInitializers = [];
  let _autofill_decorators;
  let _contentFrame_decorators;
  return class BidiElementHandle2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _autofill_decorators = [throwIfDisposed()];
      _contentFrame_decorators = [throwIfDisposed(), bindIsolatedHandle];
      __esDecorate7(this, null, _autofill_decorators, { kind: "method", name: "autofill", static: false, private: false, access: { has: (obj) => "autofill" in obj, get: (obj) => obj.autofill }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate7(this, null, _contentFrame_decorators, { kind: "method", name: "contentFrame", static: false, private: false, access: { has: (obj) => "contentFrame" in obj, get: (obj) => obj.contentFrame }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(value, realm) {
      return new BidiElementHandle2(value, realm);
    }
    constructor(value, realm) {
      super(BidiJSHandle.from(value, realm));
      __runInitializers7(this, _instanceExtraInitializers);
    }
    get realm() {
      return this.handle.realm;
    }
    get frame() {
      return this.realm.environment;
    }
    remoteValue() {
      return this.handle.remoteValue();
    }
    async autofill(data) {
      const client = this.frame.client;
      const nodeInfo = await client.send("DOM.describeNode", {
        objectId: this.handle.id
      });
      const fieldId = nodeInfo.node.backendNodeId;
      const frameId = this.frame._id;
      await client.send("Autofill.trigger", {
        fieldId,
        frameId,
        card: data.creditCard
      });
    }
    async contentFrame() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource(env_1, await this.evaluateHandle((element) => {
          if (element instanceof HTMLIFrameElement || element instanceof HTMLFrameElement) {
            return element.contentWindow;
          }
          return;
        }), false);
        const value = handle.remoteValue();
        if (value.type === "window") {
          return this.frame.page().frames().find((frame) => {
            return frame._id === value.value.context;
          }) ?? null;
        }
        return null;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    }
    async uploadFile(...files) {
      const path = environment.value.path;
      if (path) {
        files = files.map((file) => {
          if (path.win32.isAbsolute(file) || path.posix.isAbsolute(file)) {
            return file;
          } else {
            return path.resolve(file);
          }
        });
      }
      await this.frame.setFiles(this, files);
    }
    async *queryAXTree(name, role) {
      const results = await this.frame.locateNodes(this, {
        type: "accessibility",
        value: {
          role,
          name
        }
      });
      return yield* AsyncIterableUtil.map(results, (node) => {
        return Promise.resolve(BidiElementHandle2.from(node, this.realm));
      });
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/ExposedFunction.js
var __addDisposableResource2 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async)
        inner = dispose;
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    if (inner)
      dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources2 = function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1)
            return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async)
              return s |= 2, Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } else
            s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1)
        return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError)
        throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var ExposeableFunction = class {
  static async from(frame, name, apply, isolate = false) {
    const func = new ExposeableFunction(frame, name, apply, isolate);
    await func.#initialize();
    return func;
  }
  #frame;
  name;
  #apply;
  #isolate;
  #channel;
  #scripts = [];
  #disposables = new DisposableStack();
  constructor(frame, name, apply, isolate = false) {
    this.#frame = frame;
    this.name = name;
    this.#apply = apply;
    this.#isolate = isolate;
    this.#channel = `__puppeteer__${this.#frame._id}_page_exposeFunction_${this.name}`;
  }
  async #initialize() {
    const connection = this.#connection;
    const channel = {
      type: "channel",
      value: {
        channel: this.#channel,
        ownership: "root"
      }
    };
    const connectionEmitter = this.#disposables.use(new EventEmitter(connection));
    connectionEmitter.on(Bidi.ChromiumBidi.Script.EventNames.Message, this.#handleMessage);
    const functionDeclaration = stringifyFunction(interpolateFunction((callback) => {
      Object.assign(globalThis, {
        [PLACEHOLDER("name")]: function(...args) {
          return new Promise((resolve, reject) => {
            callback([resolve, reject, args]);
          });
        }
      });
    }, { name: JSON.stringify(this.name) }));
    const frames = [this.#frame];
    for (const frame of frames) {
      frames.push(...frame.childFrames());
    }
    await Promise.all(frames.map(async (frame) => {
      const realm = this.#isolate ? frame.isolatedRealm() : frame.mainRealm();
      try {
        const [script] = await Promise.all([
          frame.browsingContext.addPreloadScript(functionDeclaration, {
            arguments: [channel],
            sandbox: realm.sandbox
          }),
          realm.realm.callFunction(functionDeclaration, false, {
            arguments: [channel]
          })
        ]);
        this.#scripts.push([frame, script]);
      } catch (error) {
        debugError(error);
      }
    }));
  }
  get #connection() {
    return this.#frame.page().browser().connection;
  }
  #handleMessage = async (params) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      if (params.channel !== this.#channel) {
        return;
      }
      const realm = this.#getRealm(params.source);
      if (!realm) {
        return;
      }
      const dataHandle = __addDisposableResource2(env_1, BidiJSHandle.from(params.data, realm), false);
      const argsHandle = __addDisposableResource2(env_1, await dataHandle.evaluateHandle(([, , args2]) => {
        return args2;
      }), false);
      const stack = __addDisposableResource2(env_1, new DisposableStack(), false);
      const args = [];
      for (const [index, handle] of await argsHandle.getProperties()) {
        stack.use(handle);
        if (handle instanceof BidiElementHandle) {
          args[+index] = handle;
          stack.use(handle);
          continue;
        }
        args[+index] = handle.jsonValue();
      }
      let result;
      try {
        result = await this.#apply(...await Promise.all(args));
      } catch (error) {
        try {
          if (error instanceof Error) {
            await dataHandle.evaluate(([, reject], name, message, stack2) => {
              const error2 = new Error(message);
              error2.name = name;
              if (stack2) {
                error2.stack = stack2;
              }
              reject(error2);
            }, error.name, error.message, error.stack);
          } else {
            await dataHandle.evaluate(([, reject], error2) => {
              reject(error2);
            }, error);
          }
        } catch (error2) {
          debugError(error2);
        }
        return;
      }
      try {
        await dataHandle.evaluate(([resolve], result2) => {
          resolve(result2);
        }, result);
      } catch (error) {
        debugError(error);
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources2(env_1);
    }
  };
  #getRealm(source) {
    const frame = this.#findFrame(source.context);
    if (!frame) {
      return;
    }
    return frame.realm(source.realm);
  }
  #findFrame(id) {
    const frames = [this.#frame];
    for (const frame of frames) {
      if (frame._id === id) {
        return frame;
      }
      frames.push(...frame.childFrames());
    }
    return;
  }
  [Symbol.dispose]() {
    void this[Symbol.asyncDispose]().catch(debugError);
  }
  async [Symbol.asyncDispose]() {
    this.#disposables.dispose();
    await Promise.all(this.#scripts.map(async ([frame, script]) => {
      const realm = this.#isolate ? frame.isolatedRealm() : frame.mainRealm();
      try {
        await Promise.all([
          realm.evaluate((name) => {
            delete globalThis[name];
          }, this.name),
          ...frame.childFrames().map((childFrame) => {
            return childFrame.evaluate((name) => {
              delete globalThis[name];
            }, this.name);
          }),
          frame.browsingContext.removePreloadScript(script)
        ]);
      } catch (error) {
        debugError(error);
      }
    }));
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/HTTPResponse.js
var __runInitializers8 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate8 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var BidiHTTPResponse = (() => {
  let _classSuper = HTTPResponse;
  let _instanceExtraInitializers = [];
  let _remoteAddress_decorators;
  return class BidiHTTPResponse2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _remoteAddress_decorators = [invokeAtMostOnceForArguments];
      __esDecorate8(this, null, _remoteAddress_decorators, { kind: "method", name: "remoteAddress", static: false, private: false, access: { has: (obj) => "remoteAddress" in obj, get: (obj) => obj.remoteAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(data, request, cdpSupported) {
      const response = new BidiHTTPResponse2(data, request, cdpSupported);
      response.#initialize();
      return response;
    }
    #data = __runInitializers8(this, _instanceExtraInitializers);
    #request;
    #securityDetails;
    #cdpSupported = false;
    constructor(data, request, cdpSupported) {
      super();
      this.#data = data;
      this.#request = request;
      this.#cdpSupported = cdpSupported;
      const securityDetails = data["goog:securityDetails"];
      if (cdpSupported && securityDetails) {
        this.#securityDetails = new SecurityDetails(securityDetails);
      }
    }
    #initialize() {
      if (this.#data.fromCache) {
        this.#request._fromMemoryCache = true;
        this.#request.frame()?.page().trustedEmitter.emit("requestservedfromcache", this.#request);
      }
      this.#request.frame()?.page().trustedEmitter.emit("response", this);
    }
    remoteAddress() {
      return {
        ip: "",
        port: -1
      };
    }
    url() {
      return this.#data.url;
    }
    status() {
      return this.#data.status;
    }
    statusText() {
      return this.#data.statusText;
    }
    headers() {
      const headers = {};
      for (const header of this.#data.headers) {
        if (header.value.type === "string") {
          headers[header.name.toLowerCase()] = header.value.value;
        }
      }
      return headers;
    }
    request() {
      return this.#request;
    }
    fromCache() {
      return this.#data.fromCache;
    }
    timing() {
      const bidiTiming = this.#request.timing();
      return {
        requestTime: bidiTiming.requestTime,
        proxyStart: -1,
        proxyEnd: -1,
        dnsStart: bidiTiming.dnsStart,
        dnsEnd: bidiTiming.dnsEnd,
        connectStart: bidiTiming.connectStart,
        connectEnd: bidiTiming.connectEnd,
        sslStart: bidiTiming.tlsStart,
        sslEnd: -1,
        workerStart: -1,
        workerReady: -1,
        workerFetchStart: -1,
        workerRespondWithSettled: -1,
        workerRouterEvaluationStart: -1,
        workerCacheLookupStart: -1,
        sendStart: bidiTiming.requestStart,
        sendEnd: -1,
        pushStart: -1,
        pushEnd: -1,
        receiveHeadersStart: bidiTiming.responseStart,
        receiveHeadersEnd: bidiTiming.responseEnd
      };
    }
    frame() {
      return this.#request.frame();
    }
    fromServiceWorker() {
      return false;
    }
    securityDetails() {
      if (!this.#cdpSupported) {
        throw new UnsupportedOperation();
      }
      return this.#securityDetails ?? null;
    }
    content() {
      throw new UnsupportedOperation();
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/HTTPRequest.js
var _a2;
var requests = /* @__PURE__ */ new WeakMap();
var BidiHTTPRequest = class extends HTTPRequest {
  static from(bidiRequest, frame, redirect) {
    const request = new _a2(bidiRequest, frame, redirect);
    request.#initialize();
    return request;
  }
  #redirectChain;
  #response = null;
  id;
  #frame;
  #request;
  constructor(request, frame, redirect) {
    super();
    requests.set(request, this);
    this.interception.enabled = request.isBlocked;
    this.#request = request;
    this.#frame = frame;
    this.#redirectChain = redirect ? redirect.#redirectChain : [];
    this.id = request.id;
  }
  get client() {
    return this.#frame.client;
  }
  #initialize() {
    this.#request.on("redirect", (request) => {
      const httpRequest = _a2.from(request, this.#frame, this);
      this.#redirectChain.push(this);
      request.once("success", () => {
        this.#frame.page().trustedEmitter.emit("requestfinished", httpRequest);
      });
      request.once("error", () => {
        this.#frame.page().trustedEmitter.emit("requestfailed", httpRequest);
      });
      void httpRequest.finalizeInterceptions();
    });
    this.#request.once("success", (data) => {
      this.#response = BidiHTTPResponse.from(data, this, this.#frame.page().browser().cdpSupported);
    });
    this.#request.on("authenticate", this.#handleAuthentication);
    this.#frame.page().trustedEmitter.emit("request", this);
    if (this.#hasInternalHeaderOverwrite) {
      this.interception.handlers.push(async () => {
        await this.continue({
          headers: this.headers()
        }, 0);
      });
    }
  }
  url() {
    return this.#request.url;
  }
  resourceType() {
    if (!this.#frame.page().browser().cdpSupported) {
      throw new UnsupportedOperation();
    }
    return (this.#request.resourceType || "other").toLowerCase();
  }
  method() {
    return this.#request.method;
  }
  postData() {
    if (!this.#frame.page().browser().cdpSupported) {
      throw new UnsupportedOperation();
    }
    return this.#request.postData;
  }
  hasPostData() {
    if (!this.#frame.page().browser().cdpSupported) {
      throw new UnsupportedOperation();
    }
    return this.#request.hasPostData;
  }
  async fetchPostData() {
    throw new UnsupportedOperation();
  }
  get #hasInternalHeaderOverwrite() {
    return Boolean(Object.keys(this.#extraHTTPHeaders).length || Object.keys(this.#userAgentHeaders).length);
  }
  get #extraHTTPHeaders() {
    return this.#frame?.page()._extraHTTPHeaders ?? {};
  }
  get #userAgentHeaders() {
    return this.#frame?.page()._userAgentHeaders ?? {};
  }
  headers() {
    const headers = {};
    for (const header of this.#request.headers) {
      headers[header.name.toLowerCase()] = header.value.value;
    }
    return {
      ...headers,
      ...this.#extraHTTPHeaders,
      ...this.#userAgentHeaders
    };
  }
  response() {
    return this.#response;
  }
  failure() {
    if (this.#request.error === void 0) {
      return null;
    }
    return { errorText: this.#request.error };
  }
  isNavigationRequest() {
    return this.#request.navigation !== void 0;
  }
  initiator() {
    return this.#request.initiator;
  }
  redirectChain() {
    return this.#redirectChain.slice();
  }
  frame() {
    return this.#frame;
  }
  async continue(overrides, priority) {
    return await super.continue({
      headers: this.#hasInternalHeaderOverwrite ? this.headers() : void 0,
      ...overrides
    }, priority);
  }
  async _continue(overrides = {}) {
    const headers = getBidiHeaders(overrides.headers);
    this.interception.handled = true;
    return await this.#request.continueRequest({
      url: overrides.url,
      method: overrides.method,
      body: overrides.postData ? {
        type: "base64",
        value: stringToBase64(overrides.postData)
      } : void 0,
      headers: headers.length > 0 ? headers : void 0
    }).catch((error) => {
      this.interception.handled = false;
      return handleError(error);
    });
  }
  async _abort() {
    this.interception.handled = true;
    return await this.#request.failRequest().catch((error) => {
      this.interception.handled = false;
      throw error;
    });
  }
  async _respond(response, _priority) {
    this.interception.handled = true;
    let parsedBody;
    if (response.body) {
      parsedBody = HTTPRequest.getResponse(response.body);
    }
    const headers = getBidiHeaders(response.headers);
    const hasContentLength = headers.some((header) => {
      return header.name === "content-length";
    });
    if (response.contentType) {
      headers.push({
        name: "content-type",
        value: {
          type: "string",
          value: response.contentType
        }
      });
    }
    if (parsedBody?.contentLength && !hasContentLength) {
      headers.push({
        name: "content-length",
        value: {
          type: "string",
          value: String(parsedBody.contentLength)
        }
      });
    }
    const status = response.status || 200;
    return await this.#request.provideResponse({
      statusCode: status,
      headers: headers.length > 0 ? headers : void 0,
      reasonPhrase: STATUS_TEXTS[status],
      body: parsedBody?.base64 ? {
        type: "base64",
        value: parsedBody?.base64
      } : void 0
    }).catch((error) => {
      this.interception.handled = false;
      throw error;
    });
  }
  #authenticationHandled = false;
  #handleAuthentication = async () => {
    if (!this.#frame) {
      return;
    }
    const credentials = this.#frame.page()._credentials;
    if (credentials && !this.#authenticationHandled) {
      this.#authenticationHandled = true;
      void this.#request.continueWithAuth({
        action: "provideCredentials",
        credentials: {
          type: "password",
          username: credentials.username,
          password: credentials.password
        }
      });
    } else {
      void this.#request.continueWithAuth({
        action: "cancel"
      });
    }
  };
  timing() {
    return this.#request.timing();
  }
};
_a2 = BidiHTTPRequest;
function getBidiHeaders(rawHeaders) {
  const headers = [];
  for (const [name, value] of Object.entries(rawHeaders ?? [])) {
    if (!Object.is(value, void 0)) {
      const values = Array.isArray(value) ? value : [value];
      for (const value2 of values) {
        headers.push({
          name: name.toLowerCase(),
          value: {
            type: "string",
            value: String(value2)
          }
        });
      }
    }
  }
  return headers;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Serializer.js
var UnserializableError = class extends Error {
};
var _serializeNumber, serializeNumber_fn, _serializeObject, serializeObject_fn;
var BidiSerializer = class {
  static serialize(arg) {
    switch (typeof arg) {
      case "symbol":
      case "function":
        throw new UnserializableError(`Unable to serializable ${typeof arg}`);
      case "object":
        return __privateMethod(this, _serializeObject, serializeObject_fn).call(this, arg);
      case "undefined":
        return {
          type: "undefined"
        };
      case "number":
        return __privateMethod(this, _serializeNumber, serializeNumber_fn).call(this, arg);
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
};
_serializeNumber = new WeakSet();
serializeNumber_fn = function(arg) {
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
};
_serializeObject = new WeakSet();
serializeObject_fn = function(arg) {
  if (arg === null) {
    return {
      type: "null"
    };
  } else if (Array.isArray(arg)) {
    const parsedArray = arg.map((subArg) => {
      return this.serialize(subArg);
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
      parsedObject.push([this.serialize(key), this.serialize(arg[key])]);
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
  throw new UnserializableError("Custom object serialization not possible. Use plain objects instead.");
};
__privateAdd(BidiSerializer, _serializeNumber);
__privateAdd(BidiSerializer, _serializeObject);

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/util.js
function createEvaluationError(details) {
  if (details.exception.type !== "error") {
    return BidiDeserializer.deserialize(details.exception);
  }
  const [name = "", ...parts] = details.text.split(": ");
  const message = parts.join(": ");
  const error = new Error(message);
  error.name = name;
  const stackLines = [];
  if (details.stackTrace && stackLines.length < Error.stackTraceLimit) {
    for (const frame of details.stackTrace.callFrames.reverse()) {
      if (PuppeteerURL.isPuppeteerURL(frame.url) && frame.url !== PuppeteerURL.INTERNAL_URL) {
        const url = PuppeteerURL.parse(frame.url);
        stackLines.unshift(`    at ${frame.functionName || url.functionName} (${url.functionName} at ${url.siteString}, <anonymous>:${frame.lineNumber}:${frame.columnNumber})`);
      } else {
        stackLines.push(`    at ${frame.functionName || "<anonymous>"} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})`);
      }
      if (stackLines.length >= Error.stackTraceLimit) {
        break;
      }
    }
  }
  error.stack = [details.text, ...stackLines].join("\n");
  return error;
}
function rewriteNavigationError(message, ms) {
  return (error) => {
    if (error instanceof ProtocolError) {
      error.message += ` at ${message}`;
    } else if (error instanceof TimeoutError) {
      error.message = `Navigation timeout of ${ms} ms exceeded`;
    }
    throw error;
  };
}

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Realm.js
var __addDisposableResource3 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async)
        inner = dispose;
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    if (inner)
      dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources3 = function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1)
            return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async)
              return s |= 2, Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } else
            s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1)
        return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError)
        throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var BidiRealm = class extends Realm {
  realm;
  constructor(realm, timeoutSettings) {
    super(timeoutSettings);
    this.realm = realm;
  }
  initialize() {
    this.realm.on("destroyed", ({ reason }) => {
      this.taskManager.terminateAll(new Error(reason));
      this.dispose();
    });
    this.realm.on("updated", () => {
      this.internalPuppeteerUtil = void 0;
      void this.taskManager.rerunAll();
    });
  }
  internalPuppeteerUtil;
  get puppeteerUtil() {
    const promise = Promise.resolve();
    scriptInjector.inject((script) => {
      if (this.internalPuppeteerUtil) {
        void this.internalPuppeteerUtil.then((handle) => {
          void handle.dispose();
        });
      }
      this.internalPuppeteerUtil = promise.then(() => {
        return this.evaluateHandle(script);
      });
    }, !this.internalPuppeteerUtil);
    return this.internalPuppeteerUtil;
  }
  async evaluateHandle(pageFunction, ...args) {
    return await this.#evaluate(false, pageFunction, ...args);
  }
  async evaluate(pageFunction, ...args) {
    return await this.#evaluate(true, pageFunction, ...args);
  }
  async #evaluate(returnByValue, pageFunction, ...args) {
    const sourceUrlComment = getSourceUrlComment(getSourcePuppeteerURLIfAvailable(pageFunction)?.toString() ?? PuppeteerURL.INTERNAL_URL);
    let responsePromise;
    const resultOwnership = returnByValue ? "none" : "root";
    const serializationOptions = returnByValue ? {} : {
      maxObjectDepth: 0,
      maxDomDepth: 0
    };
    if (isString(pageFunction)) {
      const expression = SOURCE_URL_REGEX.test(pageFunction) ? pageFunction : `${pageFunction}
${sourceUrlComment}
`;
      responsePromise = this.realm.evaluate(expression, true, {
        resultOwnership,
        userActivation: true,
        serializationOptions
      });
    } else {
      let functionDeclaration = stringifyFunction(pageFunction);
      functionDeclaration = SOURCE_URL_REGEX.test(functionDeclaration) ? functionDeclaration : `${functionDeclaration}
${sourceUrlComment}
`;
      responsePromise = this.realm.callFunction(
        functionDeclaration,
        /* awaitPromise= */
        true,
        {
          // LazyArgs are used only internally and should not affect the order
          // evaluate calls for the public APIs.
          arguments: args.some((arg) => {
            return arg instanceof LazyArg;
          }) ? await Promise.all(args.map((arg) => {
            return this.serializeAsync(arg);
          })) : args.map((arg) => {
            return this.serialize(arg);
          }),
          resultOwnership,
          userActivation: true,
          serializationOptions
        }
      );
    }
    const result = await responsePromise;
    if ("type" in result && result.type === "exception") {
      throw createEvaluationError(result.exceptionDetails);
    }
    return returnByValue ? BidiDeserializer.deserialize(result.result) : this.createHandle(result.result);
  }
  createHandle(result) {
    if ((result.type === "node" || result.type === "window") && this instanceof BidiFrameRealm) {
      return BidiElementHandle.from(result, this);
    }
    return BidiJSHandle.from(result, this);
  }
  async serializeAsync(arg) {
    if (arg instanceof LazyArg) {
      arg = await arg.get(this);
    }
    return this.serialize(arg);
  }
  serialize(arg) {
    if (arg instanceof BidiJSHandle || arg instanceof BidiElementHandle) {
      if (arg.realm !== this) {
        if (!(arg.realm instanceof BidiFrameRealm) || !(this instanceof BidiFrameRealm)) {
          throw new Error("Trying to evaluate JSHandle from different global types. Usually this means you're using a handle from a worker in a page or vice versa.");
        }
        if (arg.realm.environment !== this.environment) {
          throw new Error("Trying to evaluate JSHandle from different frames. Usually this means you're using a handle from a page on a different page.");
        }
      }
      if (arg.disposed) {
        throw new Error("JSHandle is disposed!");
      }
      return arg.remoteValue();
    }
    return BidiSerializer.serialize(arg);
  }
  async destroyHandles(handles) {
    if (this.disposed) {
      return;
    }
    const handleIds = handles.map(({ id }) => {
      return id;
    }).filter((id) => {
      return id !== void 0;
    });
    if (handleIds.length === 0) {
      return;
    }
    await this.realm.disown(handleIds).catch((error) => {
      debugError(error);
    });
  }
  async adoptHandle(handle) {
    return await this.evaluateHandle((node) => {
      return node;
    }, handle);
  }
  async transferHandle(handle) {
    if (handle.realm === this) {
      return handle;
    }
    const transferredHandle = this.adoptHandle(handle);
    await handle.dispose();
    return await transferredHandle;
  }
};
var BidiFrameRealm = class extends BidiRealm {
  static from(realm, frame) {
    const frameRealm = new BidiFrameRealm(realm, frame);
    frameRealm.#initialize();
    return frameRealm;
  }
  #frame;
  constructor(realm, frame) {
    super(realm, frame.timeoutSettings);
    this.#frame = frame;
  }
  #initialize() {
    super.initialize();
    this.realm.on("updated", () => {
      this.environment.clearDocumentHandle();
      this.#bindingsInstalled = false;
    });
  }
  #bindingsInstalled = false;
  get puppeteerUtil() {
    let promise = Promise.resolve();
    if (!this.#bindingsInstalled) {
      promise = Promise.all([
        ExposeableFunction.from(this.environment, "__ariaQuerySelector", ARIAQueryHandler.queryOne, !!this.sandbox),
        ExposeableFunction.from(this.environment, "__ariaQuerySelectorAll", async (element, selector) => {
          const results = ARIAQueryHandler.queryAll(element, selector);
          return await element.realm.evaluateHandle((...elements) => {
            return elements;
          }, ...await AsyncIterableUtil.collect(results));
        }, !!this.sandbox)
      ]);
      this.#bindingsInstalled = true;
    }
    return promise.then(() => {
      return super.puppeteerUtil;
    });
  }
  get sandbox() {
    return this.realm.sandbox;
  }
  get environment() {
    return this.#frame;
  }
  async adoptBackendNode(backendNodeId) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const { object } = await this.#frame.client.send("DOM.resolveNode", {
        backendNodeId,
        executionContextId: await this.realm.resolveExecutionContextId()
      });
      const handle = __addDisposableResource3(env_1, BidiElementHandle.from({
        handle: object.objectId,
        type: "node"
      }, this), false);
      return await handle.evaluateHandle((element) => {
        return element;
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources3(env_1);
    }
  }
};
var BidiWorkerRealm = class extends BidiRealm {
  static from(realm, worker) {
    const workerRealm = new BidiWorkerRealm(realm, worker);
    workerRealm.initialize();
    return workerRealm;
  }
  #worker;
  constructor(realm, frame) {
    super(realm, frame.timeoutSettings);
    this.#worker = frame;
  }
  get environment() {
    return this.#worker;
  }
  async adoptBackendNode() {
    throw new Error("Cannot adopt DOM nodes into a worker.");
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/WebWorker.js
var BidiWebWorker = class extends WebWorker {
  static from(frame, realm) {
    const worker = new BidiWebWorker(frame, realm);
    return worker;
  }
  #frame;
  #realm;
  constructor(frame, realm) {
    super(realm.origin);
    this.#frame = frame;
    this.#realm = BidiWorkerRealm.from(realm, this);
  }
  get frame() {
    return this.#frame;
  }
  mainRealm() {
    return this.#realm;
  }
  get client() {
    throw new UnsupportedOperation();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Frame.js
var __runInitializers9 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate9 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __setFunctionName = function(f, name, prefix) {
  if (typeof name === "symbol")
    name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
function convertConsoleMessageLevel(method) {
  switch (method) {
    case "group":
      return "startGroup";
    case "groupCollapsed":
      return "startGroupCollapsed";
    case "groupEnd":
      return "endGroup";
    default:
      return method;
  }
}
var BidiFrame = (() => {
  var _a3;
  let _classSuper = Frame;
  let _instanceExtraInitializers = [];
  let _goto_decorators;
  let _setContent_decorators;
  let _waitForNavigation_decorators;
  let _private_waitForLoad$_decorators;
  let _private_waitForLoad$_descriptor;
  let _private_waitForNetworkIdle$_decorators;
  let _private_waitForNetworkIdle$_descriptor;
  let _setFiles_decorators;
  let _locateNodes_decorators;
  return class BidiFrame2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _goto_decorators = [throwIfDetached];
      _setContent_decorators = [throwIfDetached];
      _waitForNavigation_decorators = [throwIfDetached];
      _private_waitForLoad$_decorators = [throwIfDetached];
      _private_waitForNetworkIdle$_decorators = [throwIfDetached];
      _setFiles_decorators = [throwIfDetached];
      _locateNodes_decorators = [throwIfDetached];
      __esDecorate9(this, null, _goto_decorators, { kind: "method", name: "goto", static: false, private: false, access: { has: (obj) => "goto" in obj, get: (obj) => obj.goto }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate9(this, null, _setContent_decorators, { kind: "method", name: "setContent", static: false, private: false, access: { has: (obj) => "setContent" in obj, get: (obj) => obj.setContent }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate9(this, null, _waitForNavigation_decorators, { kind: "method", name: "waitForNavigation", static: false, private: false, access: { has: (obj) => "waitForNavigation" in obj, get: (obj) => obj.waitForNavigation }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate9(this, _private_waitForLoad$_descriptor = { value: __setFunctionName(function(options = {}) {
        let { waitUntil = "load" } = options;
        const { timeout: ms = this.timeoutSettings.navigationTimeout() } = options;
        if (!Array.isArray(waitUntil)) {
          waitUntil = [waitUntil];
        }
        const events = /* @__PURE__ */ new Set();
        for (const lifecycleEvent of waitUntil) {
          switch (lifecycleEvent) {
            case "load": {
              events.add("load");
              break;
            }
            case "domcontentloaded": {
              events.add("DOMContentLoaded");
              break;
            }
          }
        }
        if (events.size === 0) {
          return of(void 0);
        }
        return combineLatest([...events].map((event) => {
          return fromEmitterEvent(this.browsingContext, event);
        })).pipe(map(() => {
        }), first(), raceWith(timeout(ms), this.#detached$().pipe(map(() => {
          throw new Error("Frame detached.");
        }))));
      }, "#waitForLoad$") }, _private_waitForLoad$_decorators, { kind: "method", name: "#waitForLoad$", static: false, private: true, access: { has: (obj) => #waitForLoad$ in obj, get: (obj) => obj.#waitForLoad$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate9(this, _private_waitForNetworkIdle$_descriptor = { value: __setFunctionName(function(options = {}) {
        let { waitUntil = "load" } = options;
        if (!Array.isArray(waitUntil)) {
          waitUntil = [waitUntil];
        }
        let concurrency = Infinity;
        for (const event of waitUntil) {
          switch (event) {
            case "networkidle0": {
              concurrency = Math.min(0, concurrency);
              break;
            }
            case "networkidle2": {
              concurrency = Math.min(2, concurrency);
              break;
            }
          }
        }
        if (concurrency === Infinity) {
          return of(void 0);
        }
        return this.page().waitForNetworkIdle$({
          idleTime: 500,
          timeout: options.timeout ?? this.timeoutSettings.timeout(),
          concurrency
        });
      }, "#waitForNetworkIdle$") }, _private_waitForNetworkIdle$_decorators, { kind: "method", name: "#waitForNetworkIdle$", static: false, private: true, access: { has: (obj) => #waitForNetworkIdle$ in obj, get: (obj) => obj.#waitForNetworkIdle$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate9(this, null, _setFiles_decorators, { kind: "method", name: "setFiles", static: false, private: false, access: { has: (obj) => "setFiles" in obj, get: (obj) => obj.setFiles }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate9(this, null, _locateNodes_decorators, { kind: "method", name: "locateNodes", static: false, private: false, access: { has: (obj) => "locateNodes" in obj, get: (obj) => obj.locateNodes }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(parent, browsingContext) {
      const frame = new BidiFrame2(parent, browsingContext);
      frame.#initialize();
      return frame;
    }
    #parent = __runInitializers9(this, _instanceExtraInitializers);
    browsingContext;
    #frames = /* @__PURE__ */ new WeakMap();
    realms;
    _id;
    client;
    accessibility;
    constructor(parent, browsingContext) {
      super();
      this.#parent = parent;
      this.browsingContext = browsingContext;
      this._id = browsingContext.id;
      this.client = new BidiCdpSession(this);
      this.realms = {
        default: BidiFrameRealm.from(this.browsingContext.defaultRealm, this),
        internal: BidiFrameRealm.from(this.browsingContext.createWindowRealm(`__puppeteer_internal_${Math.ceil(Math.random() * 1e4)}`), this)
      };
      this.accessibility = new Accessibility(this.realms.default);
    }
    #initialize() {
      for (const browsingContext of this.browsingContext.children) {
        this.#createFrameTarget(browsingContext);
      }
      this.browsingContext.on("browsingcontext", ({ browsingContext }) => {
        this.#createFrameTarget(browsingContext);
      });
      this.browsingContext.on("closed", () => {
        for (const session of BidiCdpSession.sessions.values()) {
          if (session.frame === this) {
            session.onClose();
          }
        }
        this.page().trustedEmitter.emit("framedetached", this);
      });
      this.browsingContext.on("request", ({ request }) => {
        const httpRequest = BidiHTTPRequest.from(request, this);
        request.once("success", () => {
          this.page().trustedEmitter.emit("requestfinished", httpRequest);
        });
        request.once("error", () => {
          this.page().trustedEmitter.emit("requestfailed", httpRequest);
        });
        void httpRequest.finalizeInterceptions();
      });
      this.browsingContext.on("navigation", ({ navigation }) => {
        navigation.once("fragment", () => {
          this.page().trustedEmitter.emit("framenavigated", this);
        });
      });
      this.browsingContext.on("load", () => {
        this.page().trustedEmitter.emit("load", void 0);
      });
      this.browsingContext.on("DOMContentLoaded", () => {
        this._hasStartedLoading = true;
        this.page().trustedEmitter.emit("domcontentloaded", void 0);
        this.page().trustedEmitter.emit("framenavigated", this);
      });
      this.browsingContext.on("userprompt", ({ userPrompt }) => {
        this.page().trustedEmitter.emit("dialog", BidiDialog.from(userPrompt));
      });
      this.browsingContext.on("log", ({ entry }) => {
        if (this._id !== entry.source.context) {
          return;
        }
        if (isConsoleLogEntry(entry)) {
          const args = entry.args.map((arg) => {
            return this.mainRealm().createHandle(arg);
          });
          const text = args.reduce((value, arg) => {
            const parsedValue = arg instanceof BidiJSHandle && arg.isPrimitiveValue ? BidiDeserializer.deserialize(arg.remoteValue()) : arg.toString();
            return `${value} ${parsedValue}`;
          }, "").slice(1);
          this.page().trustedEmitter.emit("console", new ConsoleMessage(convertConsoleMessageLevel(entry.method), text, args, getStackTraceLocations(entry.stackTrace), this));
        } else if (isJavaScriptLogEntry(entry)) {
          const error = new Error(entry.text ?? "");
          const messageHeight = error.message.split("\n").length;
          const messageLines = error.stack.split("\n").splice(0, messageHeight);
          const stackLines = [];
          if (entry.stackTrace) {
            for (const frame of entry.stackTrace.callFrames) {
              stackLines.push(`    at ${frame.functionName || "<anonymous>"} (${frame.url}:${frame.lineNumber + 1}:${frame.columnNumber + 1})`);
              if (stackLines.length >= Error.stackTraceLimit) {
                break;
              }
            }
          }
          error.stack = [...messageLines, ...stackLines].join("\n");
          this.page().trustedEmitter.emit("pageerror", error);
        } else {
          debugError(`Unhandled LogEntry with type "${entry.type}", text "${entry.text}" and level "${entry.level}"`);
        }
      });
      this.browsingContext.on("worker", ({ realm }) => {
        const worker = BidiWebWorker.from(this, realm);
        realm.on("destroyed", () => {
          this.page().trustedEmitter.emit("workerdestroyed", worker);
        });
        this.page().trustedEmitter.emit("workercreated", worker);
      });
    }
    #createFrameTarget(browsingContext) {
      const frame = BidiFrame2.from(this, browsingContext);
      this.#frames.set(browsingContext, frame);
      this.page().trustedEmitter.emit("frameattached", frame);
      browsingContext.on("closed", () => {
        this.#frames.delete(browsingContext);
      });
      return frame;
    }
    get timeoutSettings() {
      return this.page()._timeoutSettings;
    }
    mainRealm() {
      return this.realms.default;
    }
    isolatedRealm() {
      return this.realms.internal;
    }
    realm(id) {
      for (const realm of Object.values(this.realms)) {
        if (realm.realm.id === id) {
          return realm;
        }
      }
      return;
    }
    page() {
      let parent = this.#parent;
      while (parent instanceof BidiFrame2) {
        parent = parent.#parent;
      }
      return parent;
    }
    url() {
      return this.browsingContext.url;
    }
    parentFrame() {
      if (this.#parent instanceof BidiFrame2) {
        return this.#parent;
      }
      return null;
    }
    childFrames() {
      return [...this.browsingContext.children].map((child) => {
        return this.#frames.get(child);
      });
    }
    #detached$() {
      return defer(() => {
        if (this.detached) {
          return of(this);
        }
        return fromEmitterEvent(
          this.page().trustedEmitter,
          "framedetached"
          /* PageEvent.FrameDetached */
        ).pipe(filter((detachedFrame) => {
          return detachedFrame === this;
        }));
      });
    }
    async goto(url, options = {}) {
      const [response] = await Promise.all([
        this.waitForNavigation(options),
        // Some implementations currently only report errors when the
        // readiness=interactive.
        //
        // Related: https://bugzilla.mozilla.org/show_bug.cgi?id=1846601
        this.browsingContext.navigate(
          url,
          "interactive"
          /* Bidi.BrowsingContext.ReadinessState.Interactive */
        ).catch((error) => {
          if (isErrorLike(error) && error.message.includes("net::ERR_HTTP_RESPONSE_CODE_FAILURE")) {
            return;
          }
          if (error.message.includes("navigation canceled")) {
            return;
          }
          throw error;
        })
      ]).catch(rewriteNavigationError(url, options.timeout ?? this.timeoutSettings.navigationTimeout()));
      return response;
    }
    async setContent(html, options = {}) {
      await Promise.all([
        this.setFrameContent(html),
        firstValueFrom(combineLatest([
          this.#waitForLoad$(options),
          this.#waitForNetworkIdle$(options)
        ]))
      ]);
    }
    async waitForNavigation(options = {}) {
      const { timeout: ms = this.timeoutSettings.navigationTimeout(), signal } = options;
      const frames = this.childFrames().map((frame) => {
        return frame.#detached$();
      });
      return await firstValueFrom(combineLatest([
        fromEmitterEvent(this.browsingContext, "navigation").pipe(first()).pipe(switchMap(({ navigation }) => {
          return this.#waitForLoad$(options).pipe(delayWhen(() => {
            if (frames.length === 0) {
              return of(void 0);
            }
            return combineLatest(frames);
          }), raceWith(fromEmitterEvent(navigation, "fragment"), fromEmitterEvent(navigation, "failed"), fromEmitterEvent(navigation, "aborted").pipe(map(({ url }) => {
            throw new Error(`Navigation aborted: ${url}`);
          }))), switchMap(() => {
            if (navigation.request) {
              let requestFinished$ = function(request) {
                if (request.response || request.error) {
                  return of(navigation);
                }
                if (request.redirect) {
                  return requestFinished$(request.redirect);
                }
                return fromEmitterEvent(request, "success").pipe(raceWith(fromEmitterEvent(request, "error")), raceWith(fromEmitterEvent(request, "redirect"))).pipe(switchMap(() => {
                  return requestFinished$(request);
                }));
              };
              return requestFinished$(navigation.request);
            }
            return of(navigation);
          }));
        })),
        this.#waitForNetworkIdle$(options)
      ]).pipe(map(([navigation]) => {
        const request = navigation.request;
        if (!request) {
          return null;
        }
        const lastRequest = request.lastRedirect ?? request;
        const httpRequest = requests.get(lastRequest);
        return httpRequest.response();
      }), raceWith(timeout(ms), fromAbortSignal(signal), this.#detached$().pipe(map(() => {
        throw new TargetCloseError("Frame detached.");
      })))));
    }
    waitForDevicePrompt() {
      throw new UnsupportedOperation();
    }
    get detached() {
      return this.browsingContext.closed;
    }
    #exposedFunctions = /* @__PURE__ */ new Map();
    async exposeFunction(name, apply) {
      if (this.#exposedFunctions.has(name)) {
        throw new Error(`Failed to add page binding with name ${name}: globalThis['${name}'] already exists!`);
      }
      const exposeable = await ExposeableFunction.from(this, name, apply);
      this.#exposedFunctions.set(name, exposeable);
    }
    async removeExposedFunction(name) {
      const exposedFunction = this.#exposedFunctions.get(name);
      if (!exposedFunction) {
        throw new Error(`Failed to remove page binding with name ${name}: window['${name}'] does not exists!`);
      }
      this.#exposedFunctions.delete(name);
      await exposedFunction[Symbol.asyncDispose]();
    }
    async createCDPSession() {
      if (!this.page().browser().cdpSupported) {
        throw new UnsupportedOperation();
      }
      const cdpConnection = this.page().browser().cdpConnection;
      return await cdpConnection._createSession({ targetId: this._id });
    }
    get #waitForLoad$() {
      return _private_waitForLoad$_descriptor.value;
    }
    get #waitForNetworkIdle$() {
      return _private_waitForNetworkIdle$_descriptor.value;
    }
    async setFiles(element, files) {
      await this.browsingContext.setFiles(
        // SAFETY: ElementHandles are always remote references.
        element.remoteValue(),
        files
      );
    }
    async locateNodes(element, locator) {
      return await this.browsingContext.locateNodes(
        locator,
        // SAFETY: ElementHandles are always remote references.
        [element.remoteValue()]
      );
    }
  };
})();
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

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Input.js
var SourceActionsType;
(function(SourceActionsType2) {
  SourceActionsType2["None"] = "none";
  SourceActionsType2["Key"] = "key";
  SourceActionsType2["Pointer"] = "pointer";
  SourceActionsType2["Wheel"] = "wheel";
})(SourceActionsType || (SourceActionsType = {}));
var ActionType;
(function(ActionType2) {
  ActionType2["Pause"] = "pause";
  ActionType2["KeyDown"] = "keyDown";
  ActionType2["KeyUp"] = "keyUp";
  ActionType2["PointerUp"] = "pointerUp";
  ActionType2["PointerDown"] = "pointerDown";
  ActionType2["PointerMove"] = "pointerMove";
  ActionType2["Scroll"] = "scroll";
})(ActionType || (ActionType = {}));
var getBidiKeyValue = (key) => {
  switch (key) {
    case "\r":
    case "\n":
      key = "Enter";
      break;
  }
  if ([...key].length === 1) {
    return key;
  }
  switch (key) {
    case "Cancel":
      return "\uE001";
    case "Help":
      return "\uE002";
    case "Backspace":
      return "\uE003";
    case "Tab":
      return "\uE004";
    case "Clear":
      return "\uE005";
    case "Enter":
      return "\uE007";
    case "Shift":
    case "ShiftLeft":
      return "\uE008";
    case "Control":
    case "ControlLeft":
      return "\uE009";
    case "Alt":
    case "AltLeft":
      return "\uE00A";
    case "Pause":
      return "\uE00B";
    case "Escape":
      return "\uE00C";
    case "PageUp":
      return "\uE00E";
    case "PageDown":
      return "\uE00F";
    case "End":
      return "\uE010";
    case "Home":
      return "\uE011";
    case "ArrowLeft":
      return "\uE012";
    case "ArrowUp":
      return "\uE013";
    case "ArrowRight":
      return "\uE014";
    case "ArrowDown":
      return "\uE015";
    case "Insert":
      return "\uE016";
    case "Delete":
      return "\uE017";
    case "NumpadEqual":
      return "\uE019";
    case "Numpad0":
      return "\uE01A";
    case "Numpad1":
      return "\uE01B";
    case "Numpad2":
      return "\uE01C";
    case "Numpad3":
      return "\uE01D";
    case "Numpad4":
      return "\uE01E";
    case "Numpad5":
      return "\uE01F";
    case "Numpad6":
      return "\uE020";
    case "Numpad7":
      return "\uE021";
    case "Numpad8":
      return "\uE022";
    case "Numpad9":
      return "\uE023";
    case "NumpadMultiply":
      return "\uE024";
    case "NumpadAdd":
      return "\uE025";
    case "NumpadSubtract":
      return "\uE027";
    case "NumpadDecimal":
      return "\uE028";
    case "NumpadDivide":
      return "\uE029";
    case "F1":
      return "\uE031";
    case "F2":
      return "\uE032";
    case "F3":
      return "\uE033";
    case "F4":
      return "\uE034";
    case "F5":
      return "\uE035";
    case "F6":
      return "\uE036";
    case "F7":
      return "\uE037";
    case "F8":
      return "\uE038";
    case "F9":
      return "\uE039";
    case "F10":
      return "\uE03A";
    case "F11":
      return "\uE03B";
    case "F12":
      return "\uE03C";
    case "Meta":
    case "MetaLeft":
      return "\uE03D";
    case "ShiftRight":
      return "\uE050";
    case "ControlRight":
      return "\uE051";
    case "AltRight":
      return "\uE052";
    case "MetaRight":
      return "\uE053";
    case "Digit0":
      return "0";
    case "Digit1":
      return "1";
    case "Digit2":
      return "2";
    case "Digit3":
      return "3";
    case "Digit4":
      return "4";
    case "Digit5":
      return "5";
    case "Digit6":
      return "6";
    case "Digit7":
      return "7";
    case "Digit8":
      return "8";
    case "Digit9":
      return "9";
    case "KeyA":
      return "a";
    case "KeyB":
      return "b";
    case "KeyC":
      return "c";
    case "KeyD":
      return "d";
    case "KeyE":
      return "e";
    case "KeyF":
      return "f";
    case "KeyG":
      return "g";
    case "KeyH":
      return "h";
    case "KeyI":
      return "i";
    case "KeyJ":
      return "j";
    case "KeyK":
      return "k";
    case "KeyL":
      return "l";
    case "KeyM":
      return "m";
    case "KeyN":
      return "n";
    case "KeyO":
      return "o";
    case "KeyP":
      return "p";
    case "KeyQ":
      return "q";
    case "KeyR":
      return "r";
    case "KeyS":
      return "s";
    case "KeyT":
      return "t";
    case "KeyU":
      return "u";
    case "KeyV":
      return "v";
    case "KeyW":
      return "w";
    case "KeyX":
      return "x";
    case "KeyY":
      return "y";
    case "KeyZ":
      return "z";
    case "Semicolon":
      return ";";
    case "Equal":
      return "=";
    case "Comma":
      return ",";
    case "Minus":
      return "-";
    case "Period":
      return ".";
    case "Slash":
      return "/";
    case "Backquote":
      return "`";
    case "BracketLeft":
      return "[";
    case "Backslash":
      return "\\";
    case "BracketRight":
      return "]";
    case "Quote":
      return '"';
    default:
      throw new Error(`Unknown key: "${key}"`);
  }
};
var BidiKeyboard = class extends Keyboard {
  #page;
  constructor(page) {
    super();
    this.#page = page;
  }
  async down(key, _options) {
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions: [
          {
            type: ActionType.KeyDown,
            value: getBidiKeyValue(key)
          }
        ]
      }
    ]);
  }
  async up(key) {
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions: [
          {
            type: ActionType.KeyUp,
            value: getBidiKeyValue(key)
          }
        ]
      }
    ]);
  }
  async press(key, options = {}) {
    const { delay = 0 } = options;
    const actions = [
      {
        type: ActionType.KeyDown,
        value: getBidiKeyValue(key)
      }
    ];
    if (delay > 0) {
      actions.push({
        type: ActionType.Pause,
        duration: delay
      });
    }
    actions.push({
      type: ActionType.KeyUp,
      value: getBidiKeyValue(key)
    });
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions
      }
    ]);
  }
  async type(text, options = {}) {
    const { delay = 0 } = options;
    const values = [...text].map(getBidiKeyValue);
    const actions = [];
    if (delay <= 0) {
      for (const value of values) {
        actions.push({
          type: ActionType.KeyDown,
          value
        }, {
          type: ActionType.KeyUp,
          value
        });
      }
    } else {
      for (const value of values) {
        actions.push({
          type: ActionType.KeyDown,
          value
        }, {
          type: ActionType.Pause,
          duration: delay
        }, {
          type: ActionType.KeyUp,
          value
        });
      }
    }
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions
      }
    ]);
  }
  async sendCharacter(char) {
    if ([...char].length > 1) {
      throw new Error("Cannot send more than 1 character.");
    }
    const frame = await this.#page.focusedFrame();
    await frame.isolatedRealm().evaluate(async (char2) => {
      document.execCommand("insertText", false, char2);
    }, char);
  }
};
var getBidiButton = (button) => {
  switch (button) {
    case MouseButton.Left:
      return 0;
    case MouseButton.Middle:
      return 1;
    case MouseButton.Right:
      return 2;
    case MouseButton.Back:
      return 3;
    case MouseButton.Forward:
      return 4;
  }
};
var BidiMouse = class extends Mouse {
  #page;
  #lastMovePoint = { x: 0, y: 0 };
  constructor(page) {
    super();
    this.#page = page;
  }
  async reset() {
    this.#lastMovePoint = { x: 0, y: 0 };
    await this.#page.mainFrame().browsingContext.releaseActions();
  }
  async move(x, y, options = {}) {
    const from2 = this.#lastMovePoint;
    const to = {
      x: Math.round(x),
      y: Math.round(y)
    };
    const actions = [];
    const steps = options.steps ?? 0;
    for (let i = 0; i < steps; ++i) {
      actions.push({
        type: ActionType.PointerMove,
        x: from2.x + (to.x - from2.x) * (i / steps),
        y: from2.y + (to.y - from2.y) * (i / steps),
        origin: options.origin
      });
    }
    actions.push({
      type: ActionType.PointerMove,
      ...to,
      origin: options.origin
    });
    this.#lastMovePoint = to;
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions
      }
    ]);
  }
  async down(options = {}) {
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions: [
          {
            type: ActionType.PointerDown,
            button: getBidiButton(options.button ?? MouseButton.Left)
          }
        ]
      }
    ]);
  }
  async up(options = {}) {
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions: [
          {
            type: ActionType.PointerUp,
            button: getBidiButton(options.button ?? MouseButton.Left)
          }
        ]
      }
    ]);
  }
  async click(x, y, options = {}) {
    const actions = [
      {
        type: ActionType.PointerMove,
        x: Math.round(x),
        y: Math.round(y),
        origin: options.origin
      }
    ];
    const pointerDownAction = {
      type: ActionType.PointerDown,
      button: getBidiButton(options.button ?? MouseButton.Left)
    };
    const pointerUpAction = {
      type: ActionType.PointerUp,
      button: pointerDownAction.button
    };
    for (let i = 1; i < (options.count ?? 1); ++i) {
      actions.push(pointerDownAction, pointerUpAction);
    }
    actions.push(pointerDownAction);
    if (options.delay) {
      actions.push({
        type: ActionType.Pause,
        duration: options.delay
      });
    }
    actions.push(pointerUpAction);
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions
      }
    ]);
  }
  async wheel(options = {}) {
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Wheel,
        id: "__puppeteer_wheel",
        actions: [
          {
            type: ActionType.Scroll,
            ...this.#lastMovePoint ?? {
              x: 0,
              y: 0
            },
            deltaX: options.deltaX ?? 0,
            deltaY: options.deltaY ?? 0
          }
        ]
      }
    ]);
  }
  drag() {
    throw new UnsupportedOperation();
  }
  dragOver() {
    throw new UnsupportedOperation();
  }
  dragEnter() {
    throw new UnsupportedOperation();
  }
  drop() {
    throw new UnsupportedOperation();
  }
  dragAndDrop() {
    throw new UnsupportedOperation();
  }
};
var BidiTouchHandle = class {
  #started = false;
  #x;
  #y;
  #bidiId;
  #page;
  #touchScreen;
  #properties;
  constructor(page, touchScreen, id, x, y, properties) {
    this.#page = page;
    this.#touchScreen = touchScreen;
    this.#x = Math.round(x);
    this.#y = Math.round(y);
    this.#properties = properties;
    this.#bidiId = `${"__puppeteer_finger"}_${id}`;
  }
  async start(options = {}) {
    if (this.#started) {
      throw new TouchError("Touch has already started");
    }
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: this.#bidiId,
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            type: ActionType.PointerMove,
            x: this.#x,
            y: this.#y,
            origin: options.origin
          },
          {
            ...this.#properties,
            type: ActionType.PointerDown,
            button: 0
          }
        ]
      }
    ]);
    this.#started = true;
  }
  move(x, y) {
    const newX = Math.round(x);
    const newY = Math.round(y);
    return this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: this.#bidiId,
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            ...this.#properties,
            type: ActionType.PointerMove,
            x: newX,
            y: newY
          }
        ]
      }
    ]);
  }
  async end() {
    await this.#page.mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: this.#bidiId,
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            type: ActionType.PointerUp,
            button: 0
          }
        ]
      }
    ]);
    this.#touchScreen.removeHandle(this);
  }
};
var BidiTouchscreen = class extends Touchscreen {
  #page;
  constructor(page) {
    super();
    this.#page = page;
  }
  async touchStart(x, y, options = {}) {
    const id = this.idGenerator();
    const properties = {
      width: 0.5 * 2,
      // 2 times default touch radius.
      height: 0.5 * 2,
      // 2 times default touch radius.
      pressure: 0.5,
      altitudeAngle: Math.PI / 2
    };
    const touch = new BidiTouchHandle(this.#page, this, id, x, y, properties);
    await touch.start(options);
    this.touches.push(touch);
    return touch;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Page.js
var __esDecorate10 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers10 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __addDisposableResource4 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async)
        inner = dispose;
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    if (inner)
      dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources4 = function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1)
            return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async)
              return s |= 2, Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } else
            s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1)
        return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError)
        throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var BidiPage = (() => {
  let _classSuper = Page;
  let _trustedEmitter_decorators;
  let _trustedEmitter_initializers = [];
  let _trustedEmitter_extraInitializers = [];
  return class BidiPage2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _trustedEmitter_decorators = [bubble()];
      __esDecorate10(this, null, _trustedEmitter_decorators, { kind: "accessor", name: "trustedEmitter", static: false, private: false, access: { has: (obj) => "trustedEmitter" in obj, get: (obj) => obj.trustedEmitter, set: (obj, value) => {
        obj.trustedEmitter = value;
      } }, metadata: _metadata }, _trustedEmitter_initializers, _trustedEmitter_extraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(browserContext, browsingContext) {
      const page = new BidiPage2(browserContext, browsingContext);
      page.#initialize();
      return page;
    }
    #trustedEmitter_accessor_storage = __runInitializers10(this, _trustedEmitter_initializers, new EventEmitter());
    get trustedEmitter() {
      return this.#trustedEmitter_accessor_storage;
    }
    set trustedEmitter(value) {
      this.#trustedEmitter_accessor_storage = value;
    }
    #browserContext = __runInitializers10(this, _trustedEmitter_extraInitializers);
    #frame;
    #viewport = null;
    #workers = /* @__PURE__ */ new Set();
    keyboard;
    mouse;
    touchscreen;
    tracing;
    coverage;
    #cdpEmulationManager;
    #emulatedNetworkConditions;
    _client() {
      return this.#frame.client;
    }
    constructor(browserContext, browsingContext) {
      super();
      this.#browserContext = browserContext;
      this.#frame = BidiFrame.from(this, browsingContext);
      this.#cdpEmulationManager = new EmulationManager(this.#frame.client);
      this.tracing = new Tracing(this.#frame.client);
      this.coverage = new Coverage(this.#frame.client);
      this.keyboard = new BidiKeyboard(this);
      this.mouse = new BidiMouse(this);
      this.touchscreen = new BidiTouchscreen(this);
    }
    #initialize() {
      this.#frame.browsingContext.on("closed", () => {
        this.trustedEmitter.emit("close", void 0);
        this.trustedEmitter.removeAllListeners();
      });
      this.trustedEmitter.on("workercreated", (worker) => {
        this.#workers.add(worker);
      });
      this.trustedEmitter.on("workerdestroyed", (worker) => {
        this.#workers.delete(worker);
      });
    }
    /**
     * @internal
     */
    _userAgentHeaders = {};
    #userAgentInterception;
    #userAgentPreloadScript;
    async setUserAgent(userAgent, userAgentMetadata) {
      if (!this.#browserContext.browser().cdpSupported && userAgentMetadata) {
        throw new UnsupportedOperation("Current Browser does not support `userAgentMetadata`");
      } else if (this.#browserContext.browser().cdpSupported && userAgentMetadata) {
        return await this._client().send("Network.setUserAgentOverride", {
          userAgent,
          userAgentMetadata
        });
      }
      const enable = userAgent !== "";
      userAgent = userAgent ?? await this.#browserContext.browser().userAgent();
      this._userAgentHeaders = enable ? {
        "User-Agent": userAgent
      } : {};
      this.#userAgentInterception = await this.#toggleInterception([
        "beforeRequestSent"
        /* Bidi.Network.InterceptPhase.BeforeRequestSent */
      ], this.#userAgentInterception, enable);
      const changeUserAgent = (userAgent2) => {
        Object.defineProperty(navigator, "userAgent", {
          value: userAgent2
        });
      };
      const frames = [this.#frame];
      for (const frame of frames) {
        frames.push(...frame.childFrames());
      }
      if (this.#userAgentPreloadScript) {
        await this.removeScriptToEvaluateOnNewDocument(this.#userAgentPreloadScript);
      }
      const [evaluateToken] = await Promise.all([
        enable ? this.evaluateOnNewDocument(changeUserAgent, userAgent) : void 0,
        // When we disable the UserAgent we want to
        // evaluate the original value in all Browsing Contexts
        frames.map((frame) => {
          return frame.evaluate(changeUserAgent, userAgent);
        })
      ]);
      this.#userAgentPreloadScript = evaluateToken?.identifier;
    }
    async setBypassCSP(enabled) {
      await this._client().send("Page.setBypassCSP", { enabled });
    }
    async queryObjects(prototypeHandle) {
      assert(!prototypeHandle.disposed, "Prototype JSHandle is disposed!");
      assert(prototypeHandle.id, "Prototype JSHandle must not be referencing primitive value");
      const response = await this.#frame.client.send("Runtime.queryObjects", {
        prototypeObjectId: prototypeHandle.id
      });
      return this.#frame.mainRealm().createHandle({
        type: "array",
        handle: response.objects.objectId
      });
    }
    browser() {
      return this.browserContext().browser();
    }
    browserContext() {
      return this.#browserContext;
    }
    mainFrame() {
      return this.#frame;
    }
    async focusedFrame() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource4(env_1, await this.mainFrame().isolatedRealm().evaluateHandle(() => {
          let win = window;
          while (win.document.activeElement instanceof win.HTMLIFrameElement || win.document.activeElement instanceof win.HTMLFrameElement) {
            if (win.document.activeElement.contentWindow === null) {
              break;
            }
            win = win.document.activeElement.contentWindow;
          }
          return win;
        }), false);
        const value = handle.remoteValue();
        assert(value.type === "window");
        const frame = this.frames().find((frame2) => {
          return frame2._id === value.value.context;
        });
        assert(frame);
        return frame;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources4(env_1);
      }
    }
    frames() {
      const frames = [this.#frame];
      for (const frame of frames) {
        frames.push(...frame.childFrames());
      }
      return frames;
    }
    isClosed() {
      return this.#frame.detached;
    }
    async close(options) {
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const _guard = __addDisposableResource4(env_2, await this.#browserContext.waitForScreenshotOperations(), false);
        try {
          await this.#frame.browsingContext.close(options?.runBeforeUnload);
        } catch {
          return;
        }
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources4(env_2);
      }
    }
    async reload(options = {}) {
      const [response] = await Promise.all([
        this.#frame.waitForNavigation(options),
        this.#frame.browsingContext.reload()
      ]).catch(rewriteNavigationError(this.url(), options.timeout ?? this._timeoutSettings.navigationTimeout()));
      return response;
    }
    setDefaultNavigationTimeout(timeout2) {
      this._timeoutSettings.setDefaultNavigationTimeout(timeout2);
    }
    setDefaultTimeout(timeout2) {
      this._timeoutSettings.setDefaultTimeout(timeout2);
    }
    getDefaultTimeout() {
      return this._timeoutSettings.timeout();
    }
    getDefaultNavigationTimeout() {
      return this._timeoutSettings.navigationTimeout();
    }
    isJavaScriptEnabled() {
      return this.#cdpEmulationManager.javascriptEnabled;
    }
    async setGeolocation(options) {
      return await this.#cdpEmulationManager.setGeolocation(options);
    }
    async setJavaScriptEnabled(enabled) {
      return await this.#cdpEmulationManager.setJavaScriptEnabled(enabled);
    }
    async emulateMediaType(type) {
      return await this.#cdpEmulationManager.emulateMediaType(type);
    }
    async emulateCPUThrottling(factor) {
      return await this.#cdpEmulationManager.emulateCPUThrottling(factor);
    }
    async emulateMediaFeatures(features) {
      return await this.#cdpEmulationManager.emulateMediaFeatures(features);
    }
    async emulateTimezone(timezoneId) {
      return await this.#cdpEmulationManager.emulateTimezone(timezoneId);
    }
    async emulateIdleState(overrides) {
      return await this.#cdpEmulationManager.emulateIdleState(overrides);
    }
    async emulateVisionDeficiency(type) {
      return await this.#cdpEmulationManager.emulateVisionDeficiency(type);
    }
    async setViewport(viewport) {
      if (!this.browser().cdpSupported) {
        await this.#frame.browsingContext.setViewport({
          viewport: viewport?.width && viewport?.height ? {
            width: viewport.width,
            height: viewport.height
          } : null,
          devicePixelRatio: viewport?.deviceScaleFactor ? viewport.deviceScaleFactor : null
        });
        this.#viewport = viewport;
        return;
      }
      const needsReload = await this.#cdpEmulationManager.emulateViewport(viewport);
      this.#viewport = viewport;
      if (needsReload) {
        await this.reload();
      }
    }
    viewport() {
      return this.#viewport;
    }
    async pdf(options = {}) {
      const { timeout: ms = this._timeoutSettings.timeout(), path = void 0 } = options;
      const { printBackground: background, margin, landscape, width, height, pageRanges: ranges, scale, preferCSSPageSize } = parsePDFOptions(options, "cm");
      const pageRanges = ranges ? ranges.split(", ") : [];
      await firstValueFrom(from(this.mainFrame().isolatedRealm().evaluate(() => {
        return document.fonts.ready;
      })).pipe(raceWith(timeout(ms))));
      const data = await firstValueFrom(from(this.#frame.browsingContext.print({
        background,
        margin,
        orientation: landscape ? "landscape" : "portrait",
        page: {
          width,
          height
        },
        pageRanges,
        scale,
        shrinkToFit: !preferCSSPageSize
      })).pipe(raceWith(timeout(ms))));
      const typedArray = stringToTypedArray(data, true);
      await this._maybeWriteTypedArrayToFile(path, typedArray);
      return typedArray;
    }
    async createPDFStream(options) {
      const typedArray = await this.pdf(options);
      return new ReadableStream({
        start(controller) {
          controller.enqueue(typedArray);
          controller.close();
        }
      });
    }
    async _screenshot(options) {
      const { clip, type, captureBeyondViewport, quality } = options;
      if (options.omitBackground !== void 0 && options.omitBackground) {
        throw new UnsupportedOperation(`BiDi does not support 'omitBackground'.`);
      }
      if (options.optimizeForSpeed !== void 0 && options.optimizeForSpeed) {
        throw new UnsupportedOperation(`BiDi does not support 'optimizeForSpeed'.`);
      }
      if (options.fromSurface !== void 0 && !options.fromSurface) {
        throw new UnsupportedOperation(`BiDi does not support 'fromSurface'.`);
      }
      if (clip !== void 0 && clip.scale !== void 0 && clip.scale !== 1) {
        throw new UnsupportedOperation(`BiDi does not support 'scale' in 'clip'.`);
      }
      let box;
      if (clip) {
        if (captureBeyondViewport) {
          box = clip;
        } else {
          const [pageLeft, pageTop] = await this.evaluate(() => {
            if (!window.visualViewport) {
              throw new Error("window.visualViewport is not supported.");
            }
            return [
              window.visualViewport.pageLeft,
              window.visualViewport.pageTop
            ];
          });
          box = {
            ...clip,
            x: clip.x - pageLeft,
            y: clip.y - pageTop
          };
        }
      }
      const data = await this.#frame.browsingContext.captureScreenshot({
        origin: captureBeyondViewport ? "document" : "viewport",
        format: {
          type: `image/${type}`,
          ...quality !== void 0 ? { quality: quality / 100 } : {}
        },
        ...box ? { clip: { type: "box", ...box } } : {}
      });
      return data;
    }
    async createCDPSession() {
      return await this.#frame.createCDPSession();
    }
    async bringToFront() {
      await this.#frame.browsingContext.activate();
    }
    async evaluateOnNewDocument(pageFunction, ...args) {
      const expression = evaluationExpression(pageFunction, ...args);
      const script = await this.#frame.browsingContext.addPreloadScript(expression);
      return { identifier: script };
    }
    async removeScriptToEvaluateOnNewDocument(id) {
      await this.#frame.browsingContext.removePreloadScript(id);
    }
    async exposeFunction(name, pptrFunction) {
      return await this.mainFrame().exposeFunction(name, "default" in pptrFunction ? pptrFunction.default : pptrFunction);
    }
    isDragInterceptionEnabled() {
      return false;
    }
    async setCacheEnabled(enabled) {
      if (!this.#browserContext.browser().cdpSupported) {
        await this.#frame.browsingContext.setCacheBehavior(enabled ? "default" : "bypass");
        return;
      }
      await this._client().send("Network.setCacheDisabled", {
        cacheDisabled: !enabled
      });
    }
    async cookies(...urls) {
      const normalizedUrls = (urls.length ? urls : [this.url()]).map((url) => {
        return new URL(url);
      });
      const cookies = await this.#frame.browsingContext.getCookies();
      return cookies.map((cookie) => {
        return bidiToPuppeteerCookie(cookie);
      }).filter((cookie) => {
        return normalizedUrls.some((url) => {
          return testUrlMatchCookie(cookie, url);
        });
      });
    }
    isServiceWorkerBypassed() {
      throw new UnsupportedOperation();
    }
    target() {
      throw new UnsupportedOperation();
    }
    waitForFileChooser() {
      throw new UnsupportedOperation();
    }
    workers() {
      return [...this.#workers];
    }
    #userInterception;
    async setRequestInterception(enable) {
      this.#userInterception = await this.#toggleInterception([
        "beforeRequestSent"
        /* Bidi.Network.InterceptPhase.BeforeRequestSent */
      ], this.#userInterception, enable);
    }
    /**
     * @internal
     */
    _extraHTTPHeaders = {};
    #extraHeadersInterception;
    async setExtraHTTPHeaders(headers) {
      const extraHTTPHeaders = {};
      for (const [key, value] of Object.entries(headers)) {
        assert(isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
        extraHTTPHeaders[key.toLowerCase()] = value;
      }
      this._extraHTTPHeaders = extraHTTPHeaders;
      this.#extraHeadersInterception = await this.#toggleInterception([
        "beforeRequestSent"
        /* Bidi.Network.InterceptPhase.BeforeRequestSent */
      ], this.#extraHeadersInterception, Boolean(Object.keys(this._extraHTTPHeaders).length));
    }
    /**
     * @internal
     */
    _credentials = null;
    #authInterception;
    async authenticate(credentials) {
      this.#authInterception = await this.#toggleInterception([
        "authRequired"
        /* Bidi.Network.InterceptPhase.AuthRequired */
      ], this.#authInterception, Boolean(credentials));
      this._credentials = credentials;
    }
    async #toggleInterception(phases, interception, expected) {
      if (expected && !interception) {
        return await this.#frame.browsingContext.addIntercept({
          phases
        });
      } else if (!expected && interception) {
        await this.#frame.browsingContext.userContext.browser.removeIntercept(interception);
        return;
      }
      return interception;
    }
    setDragInterception() {
      throw new UnsupportedOperation();
    }
    setBypassServiceWorker() {
      throw new UnsupportedOperation();
    }
    async setOfflineMode(enabled) {
      if (!this.#browserContext.browser().cdpSupported) {
        throw new UnsupportedOperation();
      }
      if (!this.#emulatedNetworkConditions) {
        this.#emulatedNetworkConditions = {
          offline: false,
          upload: -1,
          download: -1,
          latency: 0
        };
      }
      this.#emulatedNetworkConditions.offline = enabled;
      return await this.#applyNetworkConditions();
    }
    async emulateNetworkConditions(networkConditions) {
      if (!this.#browserContext.browser().cdpSupported) {
        throw new UnsupportedOperation();
      }
      if (!this.#emulatedNetworkConditions) {
        this.#emulatedNetworkConditions = {
          offline: false,
          upload: -1,
          download: -1,
          latency: 0
        };
      }
      this.#emulatedNetworkConditions.upload = networkConditions ? networkConditions.upload : -1;
      this.#emulatedNetworkConditions.download = networkConditions ? networkConditions.download : -1;
      this.#emulatedNetworkConditions.latency = networkConditions ? networkConditions.latency : 0;
      return await this.#applyNetworkConditions();
    }
    async #applyNetworkConditions() {
      if (!this.#emulatedNetworkConditions) {
        return;
      }
      await this._client().send("Network.emulateNetworkConditions", {
        offline: this.#emulatedNetworkConditions.offline,
        latency: this.#emulatedNetworkConditions.latency,
        uploadThroughput: this.#emulatedNetworkConditions.upload,
        downloadThroughput: this.#emulatedNetworkConditions.download
      });
    }
    async setCookie(...cookies) {
      const pageURL = this.url();
      const pageUrlStartsWithHTTP = pageURL.startsWith("http");
      for (const cookie of cookies) {
        let cookieUrl = cookie.url || "";
        if (!cookieUrl && pageUrlStartsWithHTTP) {
          cookieUrl = pageURL;
        }
        assert(cookieUrl !== "about:blank", `Blank page can not have cookie "${cookie.name}"`);
        assert(!String.prototype.startsWith.call(cookieUrl || "", "data:"), `Data URL page can not have cookie "${cookie.name}"`);
        const normalizedUrl = URL.canParse(cookieUrl) ? new URL(cookieUrl) : void 0;
        const domain = cookie.domain ?? normalizedUrl?.hostname;
        assert(domain !== void 0, `At least one of the url and domain needs to be specified`);
        const bidiCookie = {
          domain,
          name: cookie.name,
          value: {
            type: "string",
            value: cookie.value
          },
          ...cookie.path !== void 0 ? { path: cookie.path } : {},
          ...cookie.httpOnly !== void 0 ? { httpOnly: cookie.httpOnly } : {},
          ...cookie.secure !== void 0 ? { secure: cookie.secure } : {},
          ...cookie.sameSite !== void 0 ? { sameSite: convertCookiesSameSiteCdpToBiDi(cookie.sameSite) } : {},
          ...cookie.expires !== void 0 ? { expiry: cookie.expires } : {},
          // Chrome-specific properties.
          ...cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookie, "sameParty", "sourceScheme", "priority", "url")
        };
        if (cookie.partitionKey !== void 0) {
          await this.browserContext().userContext.setCookie(bidiCookie, cookie.partitionKey);
        } else {
          await this.#frame.browsingContext.setCookie(bidiCookie);
        }
      }
    }
    async deleteCookie(...cookies) {
      await Promise.all(cookies.map(async (deleteCookieRequest) => {
        const cookieUrl = deleteCookieRequest.url ?? this.url();
        const normalizedUrl = URL.canParse(cookieUrl) ? new URL(cookieUrl) : void 0;
        const domain = deleteCookieRequest.domain ?? normalizedUrl?.hostname;
        assert(domain !== void 0, `At least one of the url and domain needs to be specified`);
        const filter2 = {
          domain,
          name: deleteCookieRequest.name,
          ...deleteCookieRequest.path !== void 0 ? { path: deleteCookieRequest.path } : {}
        };
        await this.#frame.browsingContext.deleteCookie(filter2);
      }));
    }
    async removeExposedFunction(name) {
      await this.#frame.removeExposedFunction(name);
    }
    metrics() {
      throw new UnsupportedOperation();
    }
    async goBack(options = {}) {
      return await this.#go(-1, options);
    }
    async goForward(options = {}) {
      return await this.#go(1, options);
    }
    async #go(delta, options) {
      const controller = new AbortController();
      try {
        const [response] = await Promise.all([
          this.waitForNavigation({
            ...options,
            signal: controller.signal
          }),
          this.#frame.browsingContext.traverseHistory(delta)
        ]);
        return response;
      } catch (error) {
        controller.abort();
        if (isErrorLike(error)) {
          if (error.message.includes("no such history entry")) {
            return null;
          }
        }
        throw error;
      }
    }
    waitForDevicePrompt() {
      throw new UnsupportedOperation();
    }
  };
})();
function evaluationExpression(fun, ...args) {
  return `() => {${evaluationString(fun, ...args)}}`;
}
function testUrlMatchCookieHostname(cookie, normalizedUrl) {
  const cookieDomain = cookie.domain.toLowerCase();
  const urlHostname = normalizedUrl.hostname.toLowerCase();
  if (cookieDomain === urlHostname) {
    return true;
  }
  return cookieDomain.startsWith(".") && urlHostname.endsWith(cookieDomain);
}
function testUrlMatchCookiePath(cookie, normalizedUrl) {
  const uriPath = normalizedUrl.pathname;
  const cookiePath = cookie.path;
  if (uriPath === cookiePath) {
    return true;
  }
  if (uriPath.startsWith(cookiePath)) {
    if (cookiePath.endsWith("/")) {
      return true;
    }
    if (uriPath[cookiePath.length] === "/") {
      return true;
    }
  }
  return false;
}
function testUrlMatchCookie(cookie, url) {
  const normalizedUrl = new URL(url);
  assert(cookie !== void 0);
  if (!testUrlMatchCookieHostname(cookie, normalizedUrl)) {
    return false;
  }
  return testUrlMatchCookiePath(cookie, normalizedUrl);
}
function bidiToPuppeteerCookie(bidiCookie) {
  const partitionKey = bidiCookie[CDP_SPECIFIC_PREFIX + "partitionKey"];
  function getParitionKey() {
    if (typeof partitionKey === "string") {
      return { partitionKey };
    }
    if (typeof partitionKey === "object" && partitionKey !== null) {
      return {
        // TODO: a breaking change in Puppeteer is required to change
        // partitionKey type and report the composite partition key.
        partitionKey: partitionKey.topLevelSite
      };
    }
    return {};
  }
  return {
    name: bidiCookie.name,
    // Presents binary value as base64 string.
    value: bidiCookie.value.value,
    domain: bidiCookie.domain,
    path: bidiCookie.path,
    size: bidiCookie.size,
    httpOnly: bidiCookie.httpOnly,
    secure: bidiCookie.secure,
    sameSite: convertCookiesSameSiteBiDiToCdp(bidiCookie.sameSite),
    expires: bidiCookie.expiry ?? -1,
    session: bidiCookie.expiry === void 0 || bidiCookie.expiry <= 0,
    // Extending with CDP-specific properties with `goog:` prefix.
    ...cdpSpecificCookiePropertiesFromBidiToPuppeteer(bidiCookie, "sameParty", "sourceScheme", "partitionKeyOpaque", "priority"),
    ...getParitionKey()
  };
}
var CDP_SPECIFIC_PREFIX = "goog:";
function cdpSpecificCookiePropertiesFromBidiToPuppeteer(bidiCookie, ...propertyNames) {
  const result = {};
  for (const property of propertyNames) {
    if (bidiCookie[CDP_SPECIFIC_PREFIX + property] !== void 0) {
      result[property] = bidiCookie[CDP_SPECIFIC_PREFIX + property];
    }
  }
  return result;
}
function cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookieParam, ...propertyNames) {
  const result = {};
  for (const property of propertyNames) {
    if (cookieParam[property] !== void 0) {
      result[CDP_SPECIFIC_PREFIX + property] = cookieParam[property];
    }
  }
  return result;
}
function convertCookiesSameSiteBiDiToCdp(sameSite) {
  return sameSite === "strict" ? "Strict" : sameSite === "lax" ? "Lax" : "None";
}
function convertCookiesSameSiteCdpToBiDi(sameSite) {
  return sameSite === "Strict" ? "strict" : sameSite === "Lax" ? "lax" : "none";
}

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Target.js
var BidiBrowserTarget = class extends Target {
  #browser;
  constructor(browser) {
    super();
    this.#browser = browser;
  }
  asPage() {
    throw new UnsupportedOperation();
  }
  url() {
    return "";
  }
  createCDPSession() {
    throw new UnsupportedOperation();
  }
  type() {
    return TargetType.BROWSER;
  }
  browser() {
    return this.#browser;
  }
  browserContext() {
    return this.#browser.defaultBrowserContext();
  }
  opener() {
    throw new UnsupportedOperation();
  }
};
var BidiPageTarget = class extends Target {
  #page;
  constructor(page) {
    super();
    this.#page = page;
  }
  async page() {
    return this.#page;
  }
  async asPage() {
    return BidiPage.from(this.browserContext(), this.#page.mainFrame().browsingContext);
  }
  url() {
    return this.#page.url();
  }
  createCDPSession() {
    return this.#page.createCDPSession();
  }
  type() {
    return TargetType.PAGE;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return this.#page.browserContext();
  }
  opener() {
    throw new UnsupportedOperation();
  }
};
var BidiFrameTarget = class extends Target {
  #frame;
  #page;
  constructor(frame) {
    super();
    this.#frame = frame;
  }
  async page() {
    if (this.#page === void 0) {
      this.#page = BidiPage.from(this.browserContext(), this.#frame.browsingContext);
    }
    return this.#page;
  }
  async asPage() {
    return BidiPage.from(this.browserContext(), this.#frame.browsingContext);
  }
  url() {
    return this.#frame.url();
  }
  createCDPSession() {
    return this.#frame.createCDPSession();
  }
  type() {
    return TargetType.PAGE;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return this.#frame.page().browserContext();
  }
  opener() {
    throw new UnsupportedOperation();
  }
};
var BidiWorkerTarget = class extends Target {
  #worker;
  constructor(worker) {
    super();
    this.#worker = worker;
  }
  async page() {
    throw new UnsupportedOperation();
  }
  async asPage() {
    throw new UnsupportedOperation();
  }
  url() {
    return this.#worker.url();
  }
  createCDPSession() {
    throw new UnsupportedOperation();
  }
  type() {
    return TargetType.OTHER;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return this.#worker.frame.page().browserContext();
  }
  opener() {
    throw new UnsupportedOperation();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/BrowserContext.js
var __esDecorate11 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers11 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __addDisposableResource5 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async)
        inner = dispose;
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    if (inner)
      dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources5 = function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1)
            return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async)
              return s |= 2, Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } else
            s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1)
        return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError)
        throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var BidiBrowserContext = (() => {
  let _classSuper = BrowserContext;
  let _trustedEmitter_decorators;
  let _trustedEmitter_initializers = [];
  let _trustedEmitter_extraInitializers = [];
  return class BidiBrowserContext2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _trustedEmitter_decorators = [bubble()];
      __esDecorate11(this, null, _trustedEmitter_decorators, { kind: "accessor", name: "trustedEmitter", static: false, private: false, access: { has: (obj) => "trustedEmitter" in obj, get: (obj) => obj.trustedEmitter, set: (obj, value) => {
        obj.trustedEmitter = value;
      } }, metadata: _metadata }, _trustedEmitter_initializers, _trustedEmitter_extraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static from(browser, userContext, options) {
      const context = new BidiBrowserContext2(browser, userContext, options);
      context.#initialize();
      return context;
    }
    #trustedEmitter_accessor_storage = __runInitializers11(this, _trustedEmitter_initializers, new EventEmitter());
    get trustedEmitter() {
      return this.#trustedEmitter_accessor_storage;
    }
    set trustedEmitter(value) {
      this.#trustedEmitter_accessor_storage = value;
    }
    #browser = __runInitializers11(this, _trustedEmitter_extraInitializers);
    #defaultViewport;
    // This is public because of cookies.
    userContext;
    #pages = /* @__PURE__ */ new WeakMap();
    #targets = /* @__PURE__ */ new Map();
    #overrides = [];
    constructor(browser, userContext, options) {
      super();
      this.#browser = browser;
      this.userContext = userContext;
      this.#defaultViewport = options.defaultViewport;
    }
    #initialize() {
      for (const browsingContext of this.userContext.browsingContexts) {
        this.#createPage(browsingContext);
      }
      this.userContext.on("browsingcontext", ({ browsingContext }) => {
        const page = this.#createPage(browsingContext);
        browsingContext.once("DOMContentLoaded", () => {
          if (browsingContext.originalOpener) {
            for (const context of this.userContext.browsingContexts) {
              if (context.id === browsingContext.originalOpener) {
                this.#pages.get(context).trustedEmitter.emit("popup", page);
              }
            }
          }
        });
      });
      this.userContext.on("closed", () => {
        this.trustedEmitter.removeAllListeners();
      });
    }
    #createPage(browsingContext) {
      const page = BidiPage.from(this, browsingContext);
      this.#pages.set(browsingContext, page);
      page.trustedEmitter.on("close", () => {
        this.#pages.delete(browsingContext);
      });
      const pageTarget = new BidiPageTarget(page);
      const pageTargets = /* @__PURE__ */ new Map();
      this.#targets.set(page, [pageTarget, pageTargets]);
      page.trustedEmitter.on("frameattached", (frame) => {
        const bidiFrame = frame;
        const target = new BidiFrameTarget(bidiFrame);
        pageTargets.set(bidiFrame, target);
        this.trustedEmitter.emit("targetcreated", target);
      });
      page.trustedEmitter.on("framenavigated", (frame) => {
        const bidiFrame = frame;
        const target = pageTargets.get(bidiFrame);
        if (target === void 0) {
          this.trustedEmitter.emit("targetchanged", pageTarget);
        } else {
          this.trustedEmitter.emit("targetchanged", target);
        }
      });
      page.trustedEmitter.on("framedetached", (frame) => {
        const bidiFrame = frame;
        const target = pageTargets.get(bidiFrame);
        if (target === void 0) {
          return;
        }
        pageTargets.delete(bidiFrame);
        this.trustedEmitter.emit("targetdestroyed", target);
      });
      page.trustedEmitter.on("workercreated", (worker) => {
        const bidiWorker = worker;
        const target = new BidiWorkerTarget(bidiWorker);
        pageTargets.set(bidiWorker, target);
        this.trustedEmitter.emit("targetcreated", target);
      });
      page.trustedEmitter.on("workerdestroyed", (worker) => {
        const bidiWorker = worker;
        const target = pageTargets.get(bidiWorker);
        if (target === void 0) {
          return;
        }
        pageTargets.delete(worker);
        this.trustedEmitter.emit("targetdestroyed", target);
      });
      page.trustedEmitter.on("close", () => {
        this.#targets.delete(page);
        this.trustedEmitter.emit("targetdestroyed", pageTarget);
      });
      this.trustedEmitter.emit("targetcreated", pageTarget);
      return page;
    }
    targets() {
      return [...this.#targets.values()].flatMap(([target, frames]) => {
        return [target, ...frames.values()];
      });
    }
    async newPage() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const _guard = __addDisposableResource5(env_1, await this.waitForScreenshotOperations(), false);
        const context = await this.userContext.createBrowsingContext(
          "tab"
          /* Bidi.BrowsingContext.CreateType.Tab */
        );
        const page = this.#pages.get(context);
        if (!page) {
          throw new Error("Page is not found");
        }
        if (this.#defaultViewport) {
          try {
            await page.setViewport(this.#defaultViewport);
          } catch {
          }
        }
        return page;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources5(env_1);
      }
    }
    async close() {
      assert(this.userContext.id !== UserContext.DEFAULT, "Default BrowserContext cannot be closed!");
      try {
        await this.userContext.remove();
      } catch (error) {
        debugError(error);
      }
      this.#targets.clear();
    }
    browser() {
      return this.#browser;
    }
    async pages() {
      return [...this.userContext.browsingContexts].map((context) => {
        return this.#pages.get(context);
      });
    }
    async overridePermissions(origin, permissions) {
      const permissionsSet = new Set(permissions.map((permission) => {
        const protocolPermission = WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
        if (!protocolPermission) {
          throw new Error("Unknown permission: " + permission);
        }
        return permission;
      }));
      await Promise.all(Array.from(WEB_PERMISSION_TO_PROTOCOL_PERMISSION.keys()).map((permission) => {
        const result = this.userContext.setPermissions(
          origin,
          {
            name: permission
          },
          permissionsSet.has(permission) ? "granted" : "denied"
          /* Bidi.Permissions.PermissionState.Denied */
        );
        this.#overrides.push({ origin, permission });
        if (!permissionsSet.has(permission)) {
          return result.catch(debugError);
        }
        return result;
      }));
    }
    async clearPermissionOverrides() {
      const promises = this.#overrides.map(({ permission, origin }) => {
        return this.userContext.setPermissions(
          origin,
          {
            name: permission
          },
          "prompt"
          /* Bidi.Permissions.PermissionState.Prompt */
        ).catch(debugError);
      });
      this.#overrides = [];
      await Promise.all(promises);
    }
    get id() {
      if (this.userContext.id === UserContext.DEFAULT) {
        return void 0;
      }
      return this.userContext.id;
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/Browser.js
var __runInitializers12 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate12 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __addDisposableResource6 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async)
        inner = dispose;
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    if (inner)
      dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources6 = function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1)
            return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async)
              return s |= 2, Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } else
            s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1)
        return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError)
        throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var Browser2 = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _close_decorators;
  let _addPreloadScript_decorators;
  let _removeIntercept_decorators;
  let _removePreloadScript_decorators;
  let _createUserContext_decorators;
  return class Browser3 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate12(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate12(this, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: (obj) => "close" in obj, get: (obj) => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate12(this, null, _addPreloadScript_decorators, { kind: "method", name: "addPreloadScript", static: false, private: false, access: { has: (obj) => "addPreloadScript" in obj, get: (obj) => obj.addPreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate12(this, null, _removeIntercept_decorators, { kind: "method", name: "removeIntercept", static: false, private: false, access: { has: (obj) => "removeIntercept" in obj, get: (obj) => obj.removeIntercept }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate12(this, null, _removePreloadScript_decorators, { kind: "method", name: "removePreloadScript", static: false, private: false, access: { has: (obj) => "removePreloadScript" in obj, get: (obj) => obj.removePreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate12(this, null, _createUserContext_decorators, { kind: "method", name: "createUserContext", static: false, private: false, access: { has: (obj) => "createUserContext" in obj, get: (obj) => obj.createUserContext }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static async from(session) {
      const browser = new Browser3(session);
      await browser.#initialize();
      return browser;
    }
    #closed = (__runInitializers12(this, _instanceExtraInitializers), false);
    #reason;
    #disposables = new DisposableStack();
    #userContexts = /* @__PURE__ */ new Map();
    session;
    #sharedWorkers = /* @__PURE__ */ new Map();
    constructor(session) {
      super();
      this.session = session;
    }
    async #initialize() {
      const sessionEmitter = this.#disposables.use(new EventEmitter(this.session));
      sessionEmitter.once("ended", ({ reason }) => {
        this.dispose(reason);
      });
      sessionEmitter.on("script.realmCreated", (info) => {
        if (info.type !== "shared-worker") {
          return;
        }
        this.#sharedWorkers.set(info.realm, SharedWorkerRealm.from(this, info.realm, info.origin));
      });
      await this.#syncUserContexts();
      await this.#syncBrowsingContexts();
    }
    async #syncUserContexts() {
      const { result: { userContexts } } = await this.session.send("browser.getUserContexts", {});
      for (const context of userContexts) {
        this.#createUserContext(context.userContext);
      }
    }
    async #syncBrowsingContexts() {
      const contextIds = /* @__PURE__ */ new Set();
      let contexts;
      {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const sessionEmitter = __addDisposableResource6(env_1, new EventEmitter(this.session), false);
          sessionEmitter.on("browsingContext.contextCreated", (info) => {
            contextIds.add(info.context);
          });
          const { result } = await this.session.send("browsingContext.getTree", {});
          contexts = result.contexts;
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources6(env_1);
        }
      }
      for (const info of contexts) {
        if (!contextIds.has(info.context)) {
          this.session.emit("browsingContext.contextCreated", info);
        }
        if (info.children) {
          contexts.push(...info.children);
        }
      }
    }
    #createUserContext(id) {
      const userContext = UserContext.create(this, id);
      this.#userContexts.set(userContext.id, userContext);
      const userContextEmitter = this.#disposables.use(new EventEmitter(userContext));
      userContextEmitter.once("closed", () => {
        userContextEmitter.removeAllListeners();
        this.#userContexts.delete(userContext.id);
      });
      return userContext;
    }
    get closed() {
      return this.#closed;
    }
    get defaultUserContext() {
      return this.#userContexts.get(UserContext.DEFAULT);
    }
    get disconnected() {
      return this.#reason !== void 0;
    }
    get disposed() {
      return this.disconnected;
    }
    get userContexts() {
      return this.#userContexts.values();
    }
    dispose(reason, closed = false) {
      this.#closed = closed;
      this.#reason = reason;
      this[disposeSymbol]();
    }
    async close() {
      try {
        await this.session.send("browser.close", {});
      } finally {
        this.dispose("Browser already closed.", true);
      }
    }
    async addPreloadScript(functionDeclaration, options = {}) {
      const { result: { script } } = await this.session.send("script.addPreloadScript", {
        functionDeclaration,
        ...options,
        contexts: options.contexts?.map((context) => {
          return context.id;
        })
      });
      return script;
    }
    async removeIntercept(intercept) {
      await this.session.send("network.removeIntercept", {
        intercept
      });
    }
    async removePreloadScript(script) {
      await this.session.send("script.removePreloadScript", {
        script
      });
    }
    async createUserContext() {
      const { result: { userContext: context } } = await this.session.send("browser.createUserContext", {});
      return this.#createUserContext(context);
    }
    [(_dispose_decorators = [inertIfDisposed], _close_decorators = [throwIfDisposed((browser) => {
      return browser.#reason;
    })], _addPreloadScript_decorators = [throwIfDisposed((browser) => {
      return browser.#reason;
    })], _removeIntercept_decorators = [throwIfDisposed((browser) => {
      return browser.#reason;
    })], _removePreloadScript_decorators = [throwIfDisposed((browser) => {
      return browser.#reason;
    })], _createUserContext_decorators = [throwIfDisposed((browser) => {
      return browser.#reason;
    })], disposeSymbol)]() {
      this.#reason ??= "Browser was disconnected, probably because the session ended.";
      if (this.closed) {
        this.emit("closed", { reason: this.#reason });
      }
      this.emit("disconnected", { reason: this.#reason });
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/core/Session.js
var __runInitializers13 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate13 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var Session = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _connection_decorators;
  let _connection_initializers = [];
  let _connection_extraInitializers = [];
  let _dispose_decorators;
  let _send_decorators;
  let _subscribe_decorators;
  let _addIntercepts_decorators;
  let _end_decorators;
  return class Session2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate13(this, null, _connection_decorators, { kind: "accessor", name: "connection", static: false, private: false, access: { has: (obj) => "connection" in obj, get: (obj) => obj.connection, set: (obj, value) => {
        obj.connection = value;
      } }, metadata: _metadata }, _connection_initializers, _connection_extraInitializers);
      __esDecorate13(this, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate13(this, null, _send_decorators, { kind: "method", name: "send", static: false, private: false, access: { has: (obj) => "send" in obj, get: (obj) => obj.send }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate13(this, null, _subscribe_decorators, { kind: "method", name: "subscribe", static: false, private: false, access: { has: (obj) => "subscribe" in obj, get: (obj) => obj.subscribe }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate13(this, null, _addIntercepts_decorators, { kind: "method", name: "addIntercepts", static: false, private: false, access: { has: (obj) => "addIntercepts" in obj, get: (obj) => obj.addIntercepts }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate13(this, null, _end_decorators, { kind: "method", name: "end", static: false, private: false, access: { has: (obj) => "end" in obj, get: (obj) => obj.end }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    static async from(connection, capabilities) {
      const { result } = await connection.send("session.new", {
        capabilities
      });
      const session = new Session2(connection, result);
      await session.#initialize();
      return session;
    }
    #reason = __runInitializers13(this, _instanceExtraInitializers);
    #disposables = new DisposableStack();
    #info;
    browser;
    #connection_accessor_storage = __runInitializers13(this, _connection_initializers, void 0);
    get connection() {
      return this.#connection_accessor_storage;
    }
    set connection(value) {
      this.#connection_accessor_storage = value;
    }
    constructor(connection, info) {
      super();
      __runInitializers13(this, _connection_extraInitializers);
      this.#info = info;
      this.connection = connection;
    }
    async #initialize() {
      this.browser = await Browser2.from(this);
      const browserEmitter = this.#disposables.use(this.browser);
      browserEmitter.once("closed", ({ reason }) => {
        this.dispose(reason);
      });
      const seen = /* @__PURE__ */ new WeakSet();
      this.on("browsingContext.fragmentNavigated", (info) => {
        if (seen.has(info)) {
          return;
        }
        seen.add(info);
        this.emit("browsingContext.navigationStarted", info);
        this.emit("browsingContext.fragmentNavigated", info);
      });
    }
    get capabilities() {
      return this.#info.capabilities;
    }
    get disposed() {
      return this.ended;
    }
    get ended() {
      return this.#reason !== void 0;
    }
    get id() {
      return this.#info.sessionId;
    }
    dispose(reason) {
      this.#reason = reason;
      this[disposeSymbol]();
    }
    /**
     * Currently, there is a 1:1 relationship between the session and the
     * session. In the future, we might support multiple sessions and in that
     * case we always needs to make sure that the session for the right session
     * object is used, so we implement this method here, although it's not defined
     * in the spec.
     */
    async send(method, params) {
      return await this.connection.send(method, params);
    }
    async subscribe(events, contexts) {
      await this.send("session.subscribe", {
        events,
        contexts
      });
    }
    async addIntercepts(events, contexts) {
      await this.send("session.subscribe", {
        events,
        contexts
      });
    }
    async end() {
      try {
        await this.send("session.end", {});
      } finally {
        this.dispose(`Session already ended.`);
      }
    }
    [(_connection_decorators = [bubble()], _dispose_decorators = [inertIfDisposed], _send_decorators = [throwIfDisposed((session) => {
      return session.#reason;
    })], _subscribe_decorators = [throwIfDisposed((session) => {
      return session.#reason;
    })], _addIntercepts_decorators = [throwIfDisposed((session) => {
      return session.#reason;
    })], _end_decorators = [throwIfDisposed((session) => {
      return session.#reason;
    })], disposeSymbol)]() {
      this.#reason ??= "Session already destroyed, probably because the connection broke.";
      this.emit("ended", { reason: this.#reason });
      this.#disposables.dispose();
      super[disposeSymbol]();
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/bidi/Browser.js
var __esDecorate14 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers14 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __setFunctionName2 = function(f, name, prefix) {
  if (typeof name === "symbol")
    name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var BidiBrowser = (() => {
  let _classSuper = Browser;
  let _private_trustedEmitter_decorators;
  let _private_trustedEmitter_initializers = [];
  let _private_trustedEmitter_extraInitializers = [];
  let _private_trustedEmitter_descriptor;
  return class BidiBrowser2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _private_trustedEmitter_decorators = [bubble()];
      __esDecorate14(this, _private_trustedEmitter_descriptor = { get: __setFunctionName2(function() {
        return this.#trustedEmitter_accessor_storage;
      }, "#trustedEmitter", "get"), set: __setFunctionName2(function(value) {
        this.#trustedEmitter_accessor_storage = value;
      }, "#trustedEmitter", "set") }, _private_trustedEmitter_decorators, { kind: "accessor", name: "#trustedEmitter", static: false, private: true, access: { has: (obj) => #trustedEmitter in obj, get: (obj) => obj.#trustedEmitter, set: (obj, value) => {
        obj.#trustedEmitter = value;
      } }, metadata: _metadata }, _private_trustedEmitter_initializers, _private_trustedEmitter_extraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    protocol = "webDriverBiDi";
    static subscribeModules = [
      "browsingContext",
      "network",
      "log",
      "script"
    ];
    static subscribeCdpEvents = [
      // Coverage
      "cdp.Debugger.scriptParsed",
      "cdp.CSS.styleSheetAdded",
      "cdp.Runtime.executionContextsCleared",
      // Tracing
      "cdp.Tracing.tracingComplete",
      // TODO: subscribe to all CDP events in the future.
      "cdp.Network.requestWillBeSent",
      "cdp.Debugger.scriptParsed",
      "cdp.Page.screencastFrame"
    ];
    static async create(opts) {
      const session = await Session.from(opts.connection, {
        firstMatch: opts.capabilities?.firstMatch,
        alwaysMatch: {
          ...opts.capabilities?.alwaysMatch,
          // Capabilities that come from Puppeteer's API take precedence.
          acceptInsecureCerts: opts.acceptInsecureCerts,
          unhandledPromptBehavior: {
            default: "ignore"
          },
          webSocketUrl: true,
          // Puppeteer with WebDriver BiDi does not support prerendering
          // yet because WebDriver BiDi behavior is not specified. See
          // https://github.com/w3c/webdriver-bidi/issues/321.
          "goog:prerenderingDisabled": true
        }
      });
      await session.subscribe(session.capabilities.browserName.toLocaleLowerCase().includes("firefox") ? BidiBrowser2.subscribeModules : [...BidiBrowser2.subscribeModules, ...BidiBrowser2.subscribeCdpEvents]);
      const browser = new BidiBrowser2(session.browser, opts);
      browser.#initialize();
      return browser;
    }
    #trustedEmitter_accessor_storage = __runInitializers14(this, _private_trustedEmitter_initializers, new EventEmitter());
    get #trustedEmitter() {
      return _private_trustedEmitter_descriptor.get.call(this);
    }
    set #trustedEmitter(value) {
      return _private_trustedEmitter_descriptor.set.call(this, value);
    }
    #process = __runInitializers14(this, _private_trustedEmitter_extraInitializers);
    #closeCallback;
    #browserCore;
    #defaultViewport;
    #browserContexts = /* @__PURE__ */ new WeakMap();
    #target = new BidiBrowserTarget(this);
    #cdpConnection;
    constructor(browserCore, opts) {
      super();
      this.#process = opts.process;
      this.#closeCallback = opts.closeCallback;
      this.#browserCore = browserCore;
      this.#defaultViewport = opts.defaultViewport;
      this.#cdpConnection = opts.cdpConnection;
    }
    #initialize() {
      for (const userContext of this.#browserCore.userContexts) {
        this.#createBrowserContext(userContext);
      }
      this.#browserCore.once("disconnected", () => {
        this.#trustedEmitter.emit("disconnected", void 0);
        this.#trustedEmitter.removeAllListeners();
      });
      this.#process?.once("close", () => {
        this.#browserCore.dispose("Browser process exited.", true);
        this.connection.dispose();
      });
    }
    get #browserName() {
      return this.#browserCore.session.capabilities.browserName;
    }
    get #browserVersion() {
      return this.#browserCore.session.capabilities.browserVersion;
    }
    get cdpSupported() {
      return this.#cdpConnection !== void 0;
    }
    get cdpConnection() {
      return this.#cdpConnection;
    }
    async userAgent() {
      return this.#browserCore.session.capabilities.userAgent;
    }
    #createBrowserContext(userContext) {
      const browserContext = BidiBrowserContext.from(this, userContext, {
        defaultViewport: this.#defaultViewport
      });
      this.#browserContexts.set(userContext, browserContext);
      browserContext.trustedEmitter.on("targetcreated", (target) => {
        this.#trustedEmitter.emit("targetcreated", target);
      });
      browserContext.trustedEmitter.on("targetchanged", (target) => {
        this.#trustedEmitter.emit("targetchanged", target);
      });
      browserContext.trustedEmitter.on("targetdestroyed", (target) => {
        this.#trustedEmitter.emit("targetdestroyed", target);
      });
      return browserContext;
    }
    get connection() {
      return this.#browserCore.session.connection;
    }
    wsEndpoint() {
      return this.connection.url;
    }
    async close() {
      if (this.connection.closed) {
        return;
      }
      try {
        await this.#browserCore.close();
        await this.#closeCallback?.call(null);
      } catch (error) {
        debugError(error);
      } finally {
        this.connection.dispose();
      }
    }
    get connected() {
      return !this.#browserCore.disconnected;
    }
    process() {
      return this.#process ?? null;
    }
    async createBrowserContext(_options) {
      const userContext = await this.#browserCore.createUserContext();
      return this.#createBrowserContext(userContext);
    }
    async version() {
      return `${this.#browserName}/${this.#browserVersion}`;
    }
    browserContexts() {
      return [...this.#browserCore.userContexts].map((context) => {
        return this.#browserContexts.get(context);
      });
    }
    defaultBrowserContext() {
      return this.#browserContexts.get(this.#browserCore.defaultUserContext);
    }
    newPage() {
      return this.defaultBrowserContext().newPage();
    }
    targets() {
      return [
        this.#target,
        ...this.browserContexts().flatMap((context) => {
          return context.targets();
        })
      ];
    }
    target() {
      return this.#target;
    }
    async disconnect() {
      try {
        await this.#browserCore.session.end();
      } catch (error) {
        debugError(error);
      } finally {
        this.connection.dispose();
      }
    }
    get debugInfo() {
      return {
        pendingProtocolErrors: this.connection.getPendingProtocolErrors()
      };
    }
  };
})();
export {
  BidiBrowser,
  BidiBrowserContext,
  BidiConnection,
  BidiElementHandle,
  BidiFrame,
  BidiFrameRealm,
  BidiHTTPRequest,
  BidiHTTPResponse,
  BidiJSHandle,
  BidiKeyboard,
  BidiMouse,
  BidiPage,
  BidiRealm,
  BidiTouchscreen,
  BidiWorkerRealm,
  connectBidiOverCdp,
  requests
};
/*! Bundled license information:

puppeteer-core/lib/esm/puppeteer/bidi/Connection.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/BidiOverCdp.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/Navigation.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/Realm.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/Request.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/UserPrompt.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/BrowsingContext.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/UserContext.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Deserializer.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Dialog.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/JSHandle.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/ElementHandle.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/ExposedFunction.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Serializer.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/util.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/WebWorker.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Frame.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Input.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Page.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Target.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/BrowserContext.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/Browser.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/core/Session.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/Browser.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/bidi/bidi.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
