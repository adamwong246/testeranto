import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  packageVersion
} from "./chunk-S5L4ZC6L.mjs";
import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField,
  init_cjs_shim
} from "./chunk-4IESOCHA.mjs";

// node_modules/puppeteer-core/lib/esm/third_party/rxjs/rxjs.js
init_cjs_shim();
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from2.length, ar; i < l; i++) {
      if (ar || !(i in from2)) {
        if (!ar)
          ar = Array.prototype.slice.call(from2, 0, i);
        ar[i] = from2[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function isFunction(value) {
  return typeof value === "function";
}
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                _a.call(_parentage_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
              _b.call(_finalizers_1);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2();
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};
var timeoutProvider = {
  setTimeout: function(handler, timeout2) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout2], __read(args)));
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout2], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}
function noop() {
}
var COMPLETE_NOTIFICATION = function() {
  return createNotification("C", void 0, void 0);
}();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
function identity(x) {
  return x;
}
function pipe() {
  var fns = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }
  return pipeFromArray(fns);
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source2 = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source2) : source2 ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}
function hasLift(source2) {
  return isFunction(source2 === null || source2 === void 0 ? void 0 : source2.lift);
}
function operate(init) {
  return function(source2) {
    if (hasLift(source2)) {
      return source2.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source2) {
    return new AnonymousSubject(destination, source2);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source2) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source2;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};
var ReplaySubject = function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now = _timestampProvider.now();
      var last2 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last2 = i;
      }
      last2 && _buffer.splice(0, last2 + 1);
    }
  };
  return ReplaySubject2;
}(Subject);
var Action = function(_super) {
  __extends(Action2, _super);
  function Action2(scheduler, work) {
    return _super.call(this) || this;
  }
  Action2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return this;
  };
  return Action2;
}(Subscription);
var intervalProvider = {
  setInterval: function(handler, timeout2) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = intervalProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
      return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout2], __read(args)));
    }
    return setInterval.apply(void 0, __spreadArray([handler, timeout2], __read(args)));
  },
  clearInterval: function(handle) {
    var delegate = intervalProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
  },
  delegate: void 0
};
var AsyncAction = function(_super) {
  __extends(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay2);
    }
    this.pending = true;
    this.delay = delay2;
    this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay2);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && this.delay === delay2 && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state, delay2) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state, delay2);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = e ? e : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a = this, id = _a.id, scheduler = _a.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
}(Action);
var Scheduler = function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay2, state) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state, delay2);
  };
  Scheduler2.now = dateTimestampProvider.now;
  return Scheduler2;
}();
var AsyncScheduler = function(_super) {
  __extends(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
}(Scheduler);
var asyncScheduler = new AsyncScheduler(AsyncAction);
var async = asyncScheduler;
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});
function isScheduler(value) {
  return value && isFunction(value.schedule);
}
function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}
function isInteropObservable(input) {
  return isFunction(input[observable]);
}
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false)
            return [3, 8];
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done)
            return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return))
          _a.call(iterable_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process2(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process2(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done))
            return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)))
            return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2)
            throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}
function executeSchedule(parentSubscription, scheduler, work, delay2, repeat) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  if (repeat === void 0) {
    repeat = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay2));
    } else {
      this.unsubscribe();
    }
  }, delay2);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}
function observeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source2, subscriber) {
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay2);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay2);
    }, function(err) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err);
      }, delay2);
    }));
  });
}
function subscribeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source2, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source2.subscribe(subscriber);
    }, delay2));
  });
}
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator2;
    executeSchedule(subscriber, scheduler, function() {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a;
        var value;
        var done;
        try {
          _a = iterator2.next(), value = _a.value, done = _a.done;
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
    };
  });
}
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}
function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  return from(args, scheduler);
}
var EmptyError = createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});
function lastValueFrom(source2, config2) {
  var hasConfig = typeof config2 === "object";
  return new Promise(function(resolve, reject) {
    var _hasValue = false;
    var _value;
    source2.subscribe({
      next: function(value) {
        _value = value;
        _hasValue = true;
      },
      error: reject,
      complete: function() {
        if (_hasValue) {
          resolve(_value);
        } else if (hasConfig) {
          resolve(config2.defaultValue);
        } else {
          reject(new EmptyError());
        }
      }
    });
  });
}
function firstValueFrom(source2, config2) {
  var hasConfig = typeof config2 === "object";
  return new Promise(function(resolve, reject) {
    var subscriber = new SafeSubscriber({
      next: function(value) {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: function() {
        if (hasConfig) {
          resolve(config2.defaultValue);
        } else {
          reject(new EmptyError());
        }
      }
    });
    source2.subscribe(subscriber);
  });
}
function isValidDate(value) {
  return value instanceof Date && !isNaN(value);
}
function map(project, thisArg) {
  return operate(function(source2, subscriber) {
    var index = 0;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}
var isArray = Array.isArray;
function callOrApply(fn, args) {
  return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map(function(args) {
    return callOrApply(fn, args);
  });
}
var isArray2 = Array.isArray;
var getPrototypeOf = Object.getPrototypeOf;
var objectProto = Object.prototype;
var getKeys = Object.keys;
function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    var first_1 = args[0];
    if (isArray2(first_1)) {
      return { args: first_1, keys: null };
    }
    if (isPOJO(first_1)) {
      var keys = getKeys(first_1);
      return {
        args: keys.map(function(key) {
          return first_1[key];
        }),
        keys
      };
    }
  }
  return { args, keys: null };
}
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}
function createObject(keys, values) {
  return keys.reduce(function(result, key, i) {
    return result[key] = values[i], result;
  }, {});
}
function combineLatest() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var resultSelector = popResultSelector(args);
  var _a = argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
  if (observables.length === 0) {
    return from([], scheduler);
  }
  var result = new Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
    return createObject(keys, values);
  } : identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform) {
  if (valueTransform === void 0) {
    valueTransform = identity;
  }
  return function(subscriber) {
    maybeSchedule(scheduler, function() {
      var length = observables.length;
      var values = new Array(length);
      var active = length;
      var remainingFirstValues = length;
      var _loop_1 = function(i2) {
        maybeSchedule(scheduler, function() {
          var source2 = from(observables[i2], scheduler);
          var hasFirstValue = false;
          source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
            values[i2] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, function() {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      };
      for (var i = 0; i < length; i++) {
        _loop_1(i);
      }
    }, subscriber);
  };
}
function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    executeSchedule(subscription, scheduler, execute);
  } else {
    execute();
  }
}
function mergeInternals(source2, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  var buffer = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer.push(value);
  };
  var doInnerSub = function(value) {
    expand && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, function() {
                return doInnerSub(bufferedValue);
              });
            } else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source2.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function(a, i) {
      return map(function(b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source2, subscriber) {
    return mergeInternals(source2, subscriber, project, concurrent);
  });
}
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}
function concatAll() {
  return mergeAll(1);
}
function concat() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return concatAll()(from(args, popScheduler(args)));
}
function defer(observableFactory) {
  return new Observable(function(subscriber) {
    innerFrom(observableFactory()).subscribe(subscriber);
  });
}
var nodeEventEmitterMethods = ["addListener", "removeListener"];
var eventTargetMethods = ["addEventListener", "removeEventListener"];
var jqueryMethods = ["on", "off"];
function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = void 0;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
  }
  var _a = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler, options);
    };
  }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
  if (!add) {
    if (isArrayLike(target)) {
      return mergeMap(function(subTarget) {
        return fromEvent(subTarget, eventName, options);
      })(innerFrom(target));
    }
  }
  if (!add) {
    throw new TypeError("Invalid event target");
  }
  return new Observable(function(subscriber) {
    var handler = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return subscriber.next(1 < args.length ? args : args[0]);
    };
    add(handler);
    return function() {
      return remove(handler);
    };
  });
}
function toCommonHandlerRegistry(target, eventName) {
  return function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler);
    };
  };
}
function isNodeStyleEventEmitter(target) {
  return isFunction(target.addListener) && isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
  return isFunction(target.on) && isFunction(target.off);
}
function isEventTarget(target) {
  return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
}
function timer(dueTime, intervalOrScheduler, scheduler) {
  if (dueTime === void 0) {
    dueTime = 0;
  }
  if (scheduler === void 0) {
    scheduler = async;
  }
  var intervalDuration = -1;
  if (intervalOrScheduler != null) {
    if (isScheduler(intervalOrScheduler)) {
      scheduler = intervalOrScheduler;
    } else {
      intervalDuration = intervalOrScheduler;
    }
  }
  return new Observable(function(subscriber) {
    var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
    if (due < 0) {
      due = 0;
    }
    var n = 0;
    return scheduler.schedule(function() {
      if (!subscriber.closed) {
        subscriber.next(n++);
        if (0 <= intervalDuration) {
          this.schedule(void 0, intervalDuration);
        } else {
          subscriber.complete();
        }
      }
    }, due);
  });
}
function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}
var NEVER = new Observable(noop);
var isArray3 = Array.isArray;
function argsOrArgArray(args) {
  return args.length === 1 && isArray3(args[0]) ? args[0] : args;
}
function filter(predicate, thisArg) {
  return operate(function(source2, subscriber) {
    var index = 0;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}
function race() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  sources = argsOrArgArray(sources);
  return sources.length === 1 ? innerFrom(sources[0]) : new Observable(raceInit(sources));
}
function raceInit(sources) {
  return function(subscriber) {
    var subscriptions = [];
    var _loop_1 = function(i2) {
      subscriptions.push(innerFrom(sources[i2]).subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (subscriptions) {
          for (var s = 0; s < subscriptions.length; s++) {
            s !== i2 && subscriptions[s].unsubscribe();
          }
          subscriptions = null;
        }
        subscriber.next(value);
      })));
    };
    for (var i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
      _loop_1(i);
    }
  };
}
function bufferCount(bufferSize, startBufferEvery) {
  if (startBufferEvery === void 0) {
    startBufferEvery = null;
  }
  startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
  return operate(function(source2, subscriber) {
    var buffers = [];
    var count = 0;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a, e_2, _b;
      var toEmit = null;
      if (count++ % startBufferEvery === 0) {
        buffers.push([]);
      }
      try {
        for (var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
          var buffer = buffers_1_1.value;
          buffer.push(value);
          if (bufferSize <= buffer.length) {
            toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
            toEmit.push(buffer);
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return))
            _a.call(buffers_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      if (toEmit) {
        try {
          for (var toEmit_1 = __values(toEmit), toEmit_1_1 = toEmit_1.next(); !toEmit_1_1.done; toEmit_1_1 = toEmit_1.next()) {
            var buffer = toEmit_1_1.value;
            arrRemove(buffers, buffer);
            subscriber.next(buffer);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return))
              _b.call(toEmit_1);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
      }
    }, function() {
      var e_3, _a;
      try {
        for (var buffers_2 = __values(buffers), buffers_2_1 = buffers_2.next(); !buffers_2_1.done; buffers_2_1 = buffers_2.next()) {
          var buffer = buffers_2_1.value;
          subscriber.next(buffer);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (buffers_2_1 && !buffers_2_1.done && (_a = buffers_2.return))
            _a.call(buffers_2);
        } finally {
          if (e_3)
            throw e_3.error;
        }
      }
      subscriber.complete();
    }, void 0, function() {
      buffers = null;
    }));
  });
}
function catchError(selector) {
  return operate(function(source2, subscriber) {
    var innerSub = null;
    var syncUnsub = false;
    var handledResult;
    innerSub = source2.subscribe(createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
      handledResult = innerFrom(selector(err, catchError(selector)(source2)));
      if (innerSub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      } else {
        syncUnsub = true;
      }
    }));
    if (syncUnsub) {
      innerSub.unsubscribe();
      innerSub = null;
      handledResult.subscribe(subscriber);
    }
  });
}
function concatMap(project, resultSelector) {
  return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
}
function defaultIfEmpty(defaultValue) {
  return operate(function(source2, subscriber) {
    var hasValue = false;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      if (!hasValue) {
        subscriber.next(defaultValue);
      }
      subscriber.complete();
    }));
  });
}
function take(count) {
  return count <= 0 ? function() {
    return EMPTY;
  } : operate(function(source2, subscriber) {
    var seen = 0;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      if (++seen <= count) {
        subscriber.next(value);
        if (count <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}
function ignoreElements() {
  return operate(function(source2, subscriber) {
    source2.subscribe(createOperatorSubscriber(subscriber, noop));
  });
}
function mapTo(value) {
  return map(function() {
    return value;
  });
}
function delayWhen(delayDurationSelector, subscriptionDelay) {
  if (subscriptionDelay) {
    return function(source2) {
      return concat(subscriptionDelay.pipe(take(1), ignoreElements()), source2.pipe(delayWhen(delayDurationSelector)));
    };
  }
  return mergeMap(function(value, index) {
    return innerFrom(delayDurationSelector(value, index)).pipe(take(1), mapTo(value));
  });
}
function throwIfEmpty(errorFactory) {
  if (errorFactory === void 0) {
    errorFactory = defaultErrorFactory;
  }
  return operate(function(source2, subscriber) {
    var hasValue = false;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
    }));
  });
}
function defaultErrorFactory() {
  return new EmptyError();
}
function first(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source2) {
    return source2.pipe(predicate ? filter(function(v, i) {
      return predicate(v, i, source2);
    }) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
      return new EmptyError();
    }));
  };
}
function mergeScan(accumulator, seed, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return operate(function(source2, subscriber) {
    var state = seed;
    return mergeInternals(source2, subscriber, function(value, index) {
      return accumulator(state, value, index);
    }, concurrent, function(value) {
      state = value;
    }, false, void 0, function() {
      return state = null;
    });
  });
}
function raceWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return !otherSources.length ? identity : operate(function(source2, subscriber) {
    raceInit(__spreadArray([source2], __read(otherSources)))(subscriber);
  });
}
function retry(configOrCount) {
  if (configOrCount === void 0) {
    configOrCount = Infinity;
  }
  var config2;
  if (configOrCount && typeof configOrCount === "object") {
    config2 = configOrCount;
  } else {
    config2 = {
      count: configOrCount
    };
  }
  var _a = config2.count, count = _a === void 0 ? Infinity : _a, delay2 = config2.delay, _b = config2.resetOnSuccess, resetOnSuccess = _b === void 0 ? false : _b;
  return count <= 0 ? identity : operate(function(source2, subscriber) {
    var soFar = 0;
    var innerSub;
    var subscribeForRetry = function() {
      var syncUnsub = false;
      innerSub = source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (resetOnSuccess) {
          soFar = 0;
        }
        subscriber.next(value);
      }, void 0, function(err) {
        if (soFar++ < count) {
          var resub_1 = function() {
            if (innerSub) {
              innerSub.unsubscribe();
              innerSub = null;
              subscribeForRetry();
            } else {
              syncUnsub = true;
            }
          };
          if (delay2 != null) {
            var notifier = typeof delay2 === "number" ? timer(delay2) : innerFrom(delay2(err, soFar));
            var notifierSubscriber_1 = createOperatorSubscriber(subscriber, function() {
              notifierSubscriber_1.unsubscribe();
              resub_1();
            }, function() {
              subscriber.complete();
            });
            notifier.subscribe(notifierSubscriber_1);
          } else {
            resub_1();
          }
        } else {
          subscriber.error(err);
        }
      }));
      if (syncUnsub) {
        innerSub.unsubscribe();
        innerSub = null;
        subscribeForRetry();
      }
    };
    subscribeForRetry();
  });
}
function startWith() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  var scheduler = popScheduler(values);
  return operate(function(source2, subscriber) {
    (scheduler ? concat(values, source2, scheduler) : concat(values, source2)).subscribe(subscriber);
  });
}
function switchMap(project, resultSelector) {
  return operate(function(source2, subscriber) {
    var innerSubscriber = null;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      return isComplete && !innerSubscriber && subscriber.complete();
    };
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      var innerIndex = 0;
      var outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
      }, function() {
        innerSubscriber = null;
        checkComplete();
      }));
    }, function() {
      isComplete = true;
      checkComplete();
    }));
  });
}
function takeUntil(notifier) {
  return operate(function(source2, subscriber) {
    innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function() {
      return subscriber.complete();
    }, noop));
    !subscriber.closed && source2.subscribe(subscriber);
  });
}
function tap(observerOrNext, error, complete) {
  var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
  return tapObserver ? operate(function(source2, subscriber) {
    var _a;
    (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
    var isUnsub = true;
    source2.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var _a2;
      (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
      subscriber.next(value);
    }, function() {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      subscriber.complete();
    }, function(err) {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
      subscriber.error(err);
    }, function() {
      var _a2, _b;
      if (isUnsub) {
        (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      }
      (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
    }));
  }) : identity;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/EventEmitter.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/third_party/mitt/mitt.js
init_cjs_shim();
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

// node_modules/puppeteer-core/lib/esm/puppeteer/util/disposable.js
init_cjs_shim();
Symbol.dispose ??= Symbol("dispose");
Symbol.asyncDispose ??= Symbol("asyncDispose");
var disposeSymbol = Symbol.dispose;
var asyncDisposeSymbol = Symbol.asyncDispose;
var DisposableStack = class {
  #disposed = false;
  #stack = [];
  /**
   * Returns a value indicating whether this stack has been disposed.
   */
  get disposed() {
    return this.#disposed;
  }
  /**
   * Disposes each resource in the stack in the reverse order that they were added.
   */
  dispose() {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    for (const resource of this.#stack.reverse()) {
      resource[disposeSymbol]();
    }
  }
  /**
   * Adds a disposable resource to the stack, returning the resource.
   *
   * @param value - The resource to add. `null` and `undefined` will not be added,
   * but will be returned.
   * @returns The provided `value`.
   */
  use(value) {
    if (value) {
      this.#stack.push(value);
    }
    return value;
  }
  /**
   * Adds a value and associated disposal callback as a resource to the stack.
   *
   * @param value - The value to add.
   * @param onDispose - The callback to use in place of a `[disposeSymbol]()`
   * method. Will be invoked with `value` as the first parameter.
   * @returns The provided `value`.
   */
  adopt(value, onDispose) {
    this.#stack.push({
      [disposeSymbol]() {
        onDispose(value);
      }
    });
    return value;
  }
  /**
   * Adds a callback to be invoked when the stack is disposed.
   */
  defer(onDispose) {
    this.#stack.push({
      [disposeSymbol]() {
        onDispose();
      }
    });
  }
  /**
   * Move all resources out of this stack and into a new `DisposableStack`, and
   * marks this stack as disposed.
   *
   * @example
   *
   * ```ts
   * class C {
   *   #res1: Disposable;
   *   #res2: Disposable;
   *   #disposables: DisposableStack;
   *   constructor() {
   *     // stack will be disposed when exiting constructor for any reason
   *     using stack = new DisposableStack();
   *
   *     // get first resource
   *     this.#res1 = stack.use(getResource1());
   *
   *     // get second resource. If this fails, both `stack` and `#res1` will be disposed.
   *     this.#res2 = stack.use(getResource2());
   *
   *     // all operations succeeded, move resources out of `stack` so that
   *     // they aren't disposed when constructor exits
   *     this.#disposables = stack.move();
   *   }
   *
   *   [disposeSymbol]() {
   *     this.#disposables.dispose();
   *   }
   * }
   * ```
   */
  move() {
    if (this.#disposed) {
      throw new ReferenceError("a disposed stack can not use anything new");
    }
    const stack = new DisposableStack();
    stack.#stack = this.#stack;
    this.#disposed = true;
    return stack;
  }
  [disposeSymbol] = this.dispose;
  [Symbol.toStringTag] = "DisposableStack";
};
var AsyncDisposableStack = class {
  #disposed = false;
  #stack = [];
  /**
   * Returns a value indicating whether this stack has been disposed.
   */
  get disposed() {
    return this.#disposed;
  }
  /**
   * Disposes each resource in the stack in the reverse order that they were added.
   */
  async dispose() {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    for (const resource of this.#stack.reverse()) {
      await resource[asyncDisposeSymbol]();
    }
  }
  /**
   * Adds a disposable resource to the stack, returning the resource.
   *
   * @param value - The resource to add. `null` and `undefined` will not be added,
   * but will be returned.
   * @returns The provided `value`.
   */
  use(value) {
    if (value) {
      this.#stack.push(value);
    }
    return value;
  }
  /**
   * Adds a value and associated disposal callback as a resource to the stack.
   *
   * @param value - The value to add.
   * @param onDispose - The callback to use in place of a `[disposeSymbol]()`
   * method. Will be invoked with `value` as the first parameter.
   * @returns The provided `value`.
   */
  adopt(value, onDispose) {
    this.#stack.push({
      [asyncDisposeSymbol]() {
        return onDispose(value);
      }
    });
    return value;
  }
  /**
   * Adds a callback to be invoked when the stack is disposed.
   */
  defer(onDispose) {
    this.#stack.push({
      [asyncDisposeSymbol]() {
        return onDispose();
      }
    });
  }
  /**
   * Move all resources out of this stack and into a new `DisposableStack`, and
   * marks this stack as disposed.
   *
   * @example
   *
   * ```ts
   * class C {
   *   #res1: Disposable;
   *   #res2: Disposable;
   *   #disposables: DisposableStack;
   *   constructor() {
   *     // stack will be disposed when exiting constructor for any reason
   *     using stack = new DisposableStack();
   *
   *     // get first resource
   *     this.#res1 = stack.use(getResource1());
   *
   *     // get second resource. If this fails, both `stack` and `#res1` will be disposed.
   *     this.#res2 = stack.use(getResource2());
   *
   *     // all operations succeeded, move resources out of `stack` so that
   *     // they aren't disposed when constructor exits
   *     this.#disposables = stack.move();
   *   }
   *
   *   [disposeSymbol]() {
   *     this.#disposables.dispose();
   *   }
   * }
   * ```
   */
  move() {
    if (this.#disposed) {
      throw new ReferenceError("a disposed stack can not use anything new");
    }
    const stack = new AsyncDisposableStack();
    stack.#stack = this.#stack;
    this.#disposed = true;
    return stack;
  }
  [asyncDisposeSymbol] = this.dispose;
  [Symbol.toStringTag] = "AsyncDisposableStack";
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/EventEmitter.js
var EventEmitter = class {
  #emitter;
  #handlers = /* @__PURE__ */ new Map();
  /**
   * If you pass an emitter, the returned emitter will wrap the passed emitter.
   *
   * @internal
   */
  constructor(emitter = mitt_default(/* @__PURE__ */ new Map())) {
    this.#emitter = emitter;
  }
  /**
   * Bind an event listener to fire when an event occurs.
   * @param type - the event type you'd like to listen to. Can be a string or symbol.
   * @param handler - the function to be called when the event occurs.
   * @returns `this` to enable you to chain method calls.
   */
  on(type, handler) {
    const handlers = this.#handlers.get(type);
    if (handlers === void 0) {
      this.#handlers.set(type, [handler]);
    } else {
      handlers.push(handler);
    }
    this.#emitter.on(type, handler);
    return this;
  }
  /**
   * Remove an event listener from firing.
   * @param type - the event type you'd like to stop listening to.
   * @param handler - the function that should be removed.
   * @returns `this` to enable you to chain method calls.
   */
  off(type, handler) {
    const handlers = this.#handlers.get(type) ?? [];
    if (handler === void 0) {
      for (const handler2 of handlers) {
        this.#emitter.off(type, handler2);
      }
      this.#handlers.delete(type);
      return this;
    }
    const index = handlers.lastIndexOf(handler);
    if (index > -1) {
      this.#emitter.off(type, ...handlers.splice(index, 1));
    }
    return this;
  }
  /**
   * Emit an event and call any associated listeners.
   *
   * @param type - the event you'd like to emit
   * @param eventData - any data you'd like to emit with the event
   * @returns `true` if there are any listeners, `false` if there are not.
   */
  emit(type, event) {
    this.#emitter.emit(type, event);
    return this.listenerCount(type) > 0;
  }
  /**
   * Like `on` but the listener will only be fired once and then it will be removed.
   * @param type - the event you'd like to listen to
   * @param handler - the handler function to run when the event occurs
   * @returns `this` to enable you to chain method calls.
   */
  once(type, handler) {
    const onceHandler = (eventData) => {
      handler(eventData);
      this.off(type, onceHandler);
    };
    return this.on(type, onceHandler);
  }
  /**
   * Gets the number of listeners for a given event.
   *
   * @param type - the event to get the listener count for
   * @returns the number of listeners bound to the given event
   */
  listenerCount(type) {
    return this.#handlers.get(type)?.length || 0;
  }
  /**
   * Removes all listeners. If given an event argument, it will remove only
   * listeners for that event.
   *
   * @param type - the event to remove listeners for.
   * @returns `this` to enable you to chain method calls.
   */
  removeAllListeners(type) {
    if (type !== void 0) {
      return this.off(type);
    }
    this[disposeSymbol]();
    return this;
  }
  /**
   * @internal
   */
  [disposeSymbol]() {
    for (const [type, handlers] of this.#handlers) {
      for (const handler of handlers) {
        this.#emitter.off(type, handler);
      }
    }
    this.#handlers.clear();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/environment.js
init_cjs_shim();
var isNode = !!(typeof process !== "undefined" && process.version);
var environment = {
  value: {
    get fs() {
      throw new Error("fs is not available in this environment");
    },
    get ScreenRecorder() {
      throw new Error("ScreenRecorder is not available in this environment");
    }
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/assert.js
init_cjs_shim();
var assert = (value, message) => {
  if (!value) {
    throw new Error(message);
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/encoding.js
init_cjs_shim();
function stringToTypedArray(string, base64Encoded = false) {
  if (base64Encoded) {
    const binaryString = atob(string);
    return Uint8Array.from(binaryString, (m) => {
      return m.codePointAt(0);
    });
  }
  return new TextEncoder().encode(string);
}
function stringToBase64(str) {
  return typedArrayToBase64(new TextEncoder().encode(str));
}
function typedArrayToBase64(typedArray) {
  const chunkSize = 65534;
  const chunks = [];
  for (let i = 0; i < typedArray.length; i += chunkSize) {
    const chunk = typedArray.subarray(i, i + chunkSize);
    chunks.push(String.fromCodePoint.apply(null, chunk));
  }
  const binaryString = chunks.join("");
  return btoa(binaryString);
}
function mergeUint8Arrays(items) {
  let length = 0;
  for (const item of items) {
    length += item.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const item of items) {
    result.set(item, offset);
    offset += item.length;
  }
  return result;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/Debug.js
init_cjs_shim();
var debugModule = null;
async function importDebug() {
  if (!debugModule) {
    debugModule = (await import("./src-N7R57C4Y.mjs")).default;
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

// node_modules/puppeteer-core/lib/esm/puppeteer/common/Errors.js
init_cjs_shim();
var PuppeteerError = class extends Error {
  /**
   * @internal
   */
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
  }
  /**
   * @internal
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var TimeoutError = class extends PuppeteerError {
};
var TouchError = class extends PuppeteerError {
};
var ProtocolError = class extends PuppeteerError {
  #code;
  #originalMessage = "";
  set code(code) {
    this.#code = code;
  }
  /**
   * @readonly
   * @public
   */
  get code() {
    return this.#code;
  }
  set originalMessage(originalMessage) {
    this.#originalMessage = originalMessage;
  }
  /**
   * @readonly
   * @public
   */
  get originalMessage() {
    return this.#originalMessage;
  }
};
var UnsupportedOperation = class extends PuppeteerError {
};
var TargetCloseError = class extends ProtocolError {
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/util.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PDFOptions.js
init_cjs_shim();
var paperFormats = {
  letter: { width: 8.5, height: 11 },
  legal: { width: 8.5, height: 14 },
  tabloid: { width: 11, height: 17 },
  ledger: { width: 17, height: 11 },
  a0: { width: 33.1102, height: 46.811 },
  a1: { width: 23.3858, height: 33.1102 },
  a2: { width: 16.5354, height: 23.3858 },
  a3: { width: 11.6929, height: 16.5354 },
  a4: { width: 8.2677, height: 11.6929 },
  a5: { width: 5.8268, height: 8.2677 },
  a6: { width: 4.1339, height: 5.8268 }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/util.js
var debugError = debug("puppeteer:error");
var DEFAULT_VIEWPORT = Object.freeze({ width: 800, height: 600 });
var SOURCE_URL = Symbol("Source URL for Puppeteer evaluation scripts");
var _functionName, _siteString;
var _PuppeteerURL = class {
  constructor() {
    __privateAdd(this, _functionName, void 0);
    __privateAdd(this, _siteString, void 0);
  }
  static fromCallSite(functionName, site) {
    const url = new _PuppeteerURL();
    __privateSet(url, _functionName, functionName);
    __privateSet(url, _siteString, site.toString());
    return url;
  }
  get functionName() {
    return __privateGet(this, _functionName);
  }
  get siteString() {
    return __privateGet(this, _siteString);
  }
  toString() {
    return `pptr:${[
      __privateGet(this, _functionName),
      encodeURIComponent(__privateGet(this, _siteString))
    ].join(";")}`;
  }
};
var PuppeteerURL = _PuppeteerURL;
_functionName = new WeakMap();
_siteString = new WeakMap();
__publicField(PuppeteerURL, "INTERNAL_URL", "pptr:internal");
__publicField(PuppeteerURL, "parse", (url) => {
  url = url.slice("pptr:".length);
  const [functionName = "", siteString = ""] = url.split(";");
  const puppeteerUrl = new _PuppeteerURL();
  __privateSet(puppeteerUrl, _functionName, functionName);
  __privateSet(puppeteerUrl, _siteString, decodeURIComponent(siteString));
  return puppeteerUrl;
});
__publicField(PuppeteerURL, "isPuppeteerURL", (url) => {
  return url.startsWith("pptr:");
});
var withSourcePuppeteerURLIfNone = (functionName, object) => {
  if (Object.prototype.hasOwnProperty.call(object, SOURCE_URL)) {
    return object;
  }
  const original = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => {
    return stack[2];
  };
  const site = new Error().stack;
  Error.prepareStackTrace = original;
  return Object.assign(object, {
    [SOURCE_URL]: PuppeteerURL.fromCallSite(functionName, site)
  });
};
var getSourcePuppeteerURLIfAvailable = (object) => {
  if (Object.prototype.hasOwnProperty.call(object, SOURCE_URL)) {
    return object[SOURCE_URL];
  }
  return void 0;
};
var isString = (obj) => {
  return typeof obj === "string" || obj instanceof String;
};
var isNumber = (obj) => {
  return typeof obj === "number" || obj instanceof Number;
};
var isPlainObject = (obj) => {
  return typeof obj === "object" && obj?.constructor === Object;
};
var isRegExp = (obj) => {
  return typeof obj === "object" && obj?.constructor === RegExp;
};
var isDate = (obj) => {
  return typeof obj === "object" && obj?.constructor === Date;
};
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
async function getReadableAsTypedArray(readable, path) {
  const buffers = [];
  const reader = readable.getReader();
  if (path) {
    const fileHandle = await environment.value.fs.promises.open(path, "w+");
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffers.push(value);
        await fileHandle.writeFile(value);
      }
    } finally {
      await fileHandle.close();
    }
  } else {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffers.push(value);
    }
  }
  try {
    const concat2 = mergeUint8Arrays(buffers);
    if (concat2.length === 0) {
      return null;
    }
    return concat2;
  } catch (error) {
    debugError(error);
    return null;
  }
}
async function getReadableFromProtocolStream(client, handle) {
  return new ReadableStream({
    async pull(controller) {
      function getUnit8Array(data2, isBase64) {
        if (isBase64) {
          return Uint8Array.from(atob(data2), (m) => {
            return m.codePointAt(0);
          });
        }
        const encoder = new TextEncoder();
        return encoder.encode(data2);
      }
      const { data, base64Encoded, eof } = await client.send("IO.read", {
        handle
      });
      controller.enqueue(getUnit8Array(data, base64Encoded ?? false));
      if (eof) {
        await client.send("IO.close", { handle });
        controller.close();
      }
    }
  });
}
function validateDialogType(type) {
  let dialogType = null;
  const validDialogTypes = /* @__PURE__ */ new Set([
    "alert",
    "confirm",
    "prompt",
    "beforeunload"
  ]);
  if (validDialogTypes.has(type)) {
    dialogType = type;
  }
  assert(dialogType, `Unknown javascript dialog type: ${type}`);
  return dialogType;
}
function timeout(ms, cause) {
  return ms === 0 ? NEVER : timer(ms).pipe(map(() => {
    throw new TimeoutError(`Timed out after waiting ${ms}ms`, { cause });
  }));
}
var UTILITY_WORLD_NAME = "__puppeteer_utility_world__" + packageVersion;
var SOURCE_URL_REGEX = /^[\x20\t]*\/\/[@#] sourceURL=\s{0,10}(\S*?)\s{0,10}$/m;
function getSourceUrlComment(url) {
  return `//# sourceURL=${url}`;
}
var NETWORK_IDLE_TIME = 500;
function parsePDFOptions(options = {}, lengthUnit = "in") {
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
    outline: false,
    tagged: true,
    waitForFonts: true
  };
  let width = 8.5;
  let height = 11;
  if (options.format) {
    const format = paperFormats[options.format.toLowerCase()];
    assert(format, "Unknown paper format: " + options.format);
    width = format.width;
    height = format.height;
  } else {
    width = convertPrintParameterToInches(options.width, lengthUnit) ?? width;
    height = convertPrintParameterToInches(options.height, lengthUnit) ?? height;
  }
  const margin = {
    top: convertPrintParameterToInches(options.margin?.top, lengthUnit) || 0,
    left: convertPrintParameterToInches(options.margin?.left, lengthUnit) || 0,
    bottom: convertPrintParameterToInches(options.margin?.bottom, lengthUnit) || 0,
    right: convertPrintParameterToInches(options.margin?.right, lengthUnit) || 0
  };
  if (options.outline) {
    options.tagged = true;
  }
  return {
    ...defaults,
    ...options,
    width,
    height,
    margin
  };
}
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
function fromEmitterEvent(emitter, eventName) {
  return new Observable((subscriber) => {
    const listener = (event) => {
      subscriber.next(event);
    };
    emitter.on(eventName, listener);
    return () => {
      emitter.off(eventName, listener);
    };
  });
}
function fromAbortSignal(signal, cause) {
  return signal ? fromEvent(signal, "abort").pipe(map(() => {
    if (signal.reason instanceof Error) {
      signal.reason.cause = cause;
      throw signal.reason;
    }
    throw new Error(signal.reason, { cause });
  })) : NEVER;
}
function filterAsync(predicate) {
  return mergeMap((value) => {
    return from(Promise.resolve(predicate(value))).pipe(filter((isMatch) => {
      return isMatch;
    }), map(() => {
      return value;
    }));
  });
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Browser.js
init_cjs_shim();
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
  ["clipboard-sanitized-write", "clipboardSanitizedWrite"],
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
   * Waits until a {@link Target | target} matching the given `predicate`
   * appears and returns it.
   *
   * This will look all open {@link BrowserContext | browser contexts}.
   *
   * @example Finding a target for a page opened via `window.open`:
   *
   * ```ts
   * await page.evaluate(() => window.open('https://www.example.com/'));
   * const newWindowTarget = await browser.waitForTarget(
   *   target => target.url() === 'https://www.example.com/',
   * );
   * ```
   */
  async waitForTarget(predicate, options = {}) {
    const { timeout: ms = 3e4, signal } = options;
    return await firstValueFrom(merge(fromEmitterEvent(
      this,
      "targetcreated"
      /* BrowserEvent.TargetCreated */
    ), fromEmitterEvent(
      this,
      "targetchanged"
      /* BrowserEvent.TargetChanged */
    ), from(this.targets())).pipe(filterAsync(predicate), raceWith(fromAbortSignal(signal), timeout(ms))));
  }
  /**
   * Gets a list of all open {@link Page | pages} inside this {@link Browser}.
   *
   * If there are multiple {@link BrowserContext | browser contexts}, this
   * returns all {@link Page | pages} in all
   * {@link BrowserContext | browser contexts}.
   *
   * @remarks Non-visible {@link Page | pages}, such as `"background_page"`,
   * will not be listed here. You can find them using {@link Target.page}.
   */
  async pages() {
    const contextPages = await Promise.all(this.browserContexts().map((context2) => {
      return context2.pages();
    }));
    return contextPages.reduce((acc, x) => {
      return acc.concat(x);
    }, []);
  }
  /**
   * Whether Puppeteer is connected to this {@link Browser | browser}.
   *
   * @deprecated Use {@link Browser | Browser.connected}.
   */
  isConnected() {
    return this.connected;
  }
  /** @internal */
  [disposeSymbol]() {
    if (this.process()) {
      return void this.close().catch(debugError);
    }
    return void this.disconnect().catch(debugError);
  }
  /** @internal */
  [asyncDisposeSymbol]() {
    if (this.process()) {
      return this.close();
    }
    return this.disconnect();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/BrowserContext.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/util/Mutex.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/util/Deferred.js
init_cjs_shim();
var Deferred = class {
  static create(opts) {
    return new Deferred(opts);
  }
  static async race(awaitables) {
    const deferredWithTimeout = /* @__PURE__ */ new Set();
    try {
      const promises = awaitables.map((value) => {
        if (value instanceof Deferred) {
          if (value.#timeoutId) {
            deferredWithTimeout.add(value);
          }
          return value.valueOrThrow();
        }
        return value;
      });
      return await Promise.race(promises);
    } finally {
      for (const deferred of deferredWithTimeout) {
        deferred.reject(new Error("Timeout cleared"));
      }
    }
  }
  #isResolved = false;
  #isRejected = false;
  #value;
  // SAFETY: This is ensured by #taskPromise.
  #resolve;
  // TODO: Switch to Promise.withResolvers with Node 22
  #taskPromise = new Promise((resolve) => {
    this.#resolve = resolve;
  });
  #timeoutId;
  #timeoutError;
  constructor(opts) {
    if (opts && opts.timeout > 0) {
      this.#timeoutError = new TimeoutError(opts.message);
      this.#timeoutId = setTimeout(() => {
        this.reject(this.#timeoutError);
      }, opts.timeout);
    }
  }
  #finish(value) {
    clearTimeout(this.#timeoutId);
    this.#value = value;
    this.#resolve();
  }
  resolve(value) {
    if (this.#isRejected || this.#isResolved) {
      return;
    }
    this.#isResolved = true;
    this.#finish(value);
  }
  reject(error) {
    if (this.#isRejected || this.#isResolved) {
      return;
    }
    this.#isRejected = true;
    this.#finish(error);
  }
  resolved() {
    return this.#isResolved;
  }
  finished() {
    return this.#isResolved || this.#isRejected;
  }
  value() {
    return this.#value;
  }
  #promise;
  valueOrThrow() {
    if (!this.#promise) {
      this.#promise = (async () => {
        await this.#taskPromise;
        if (this.#isRejected) {
          throw this.#value;
        }
        return this.#value;
      })();
    }
    return this.#promise;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/Mutex.js
var _locked, _acquirers;
var _Mutex = class {
  constructor() {
    __privateAdd(this, _locked, false);
    __privateAdd(this, _acquirers, []);
  }
  // This is FIFO.
  async acquire(onRelease) {
    if (!__privateGet(this, _locked)) {
      __privateSet(this, _locked, true);
      return new _Mutex.Guard(this);
    }
    const deferred = Deferred.create();
    __privateGet(this, _acquirers).push(deferred.resolve.bind(deferred));
    await deferred.valueOrThrow();
    return new _Mutex.Guard(this, onRelease);
  }
  release() {
    const resolve = __privateGet(this, _acquirers).shift();
    if (!resolve) {
      __privateSet(this, _locked, false);
      return;
    }
    resolve();
  }
};
var Mutex = _Mutex;
_locked = new WeakMap();
_acquirers = new WeakMap();
__publicField(Mutex, "Guard", class Guard {
  #mutex;
  #onRelease;
  constructor(mutex, onRelease) {
    this.#mutex = mutex;
    this.#onRelease = onRelease;
  }
  [disposeSymbol]() {
    this.#onRelease?.();
    return this.#mutex.release();
  }
});

// node_modules/puppeteer-core/lib/esm/puppeteer/api/BrowserContext.js
var BrowserContext = class extends EventEmitter {
  /**
   * @internal
   */
  constructor() {
    super();
  }
  /**
   * If defined, indicates an ongoing screenshot opereation.
   */
  #pageScreenshotMutex;
  #screenshotOperationsCount = 0;
  /**
   * @internal
   */
  startScreenshot() {
    const mutex = this.#pageScreenshotMutex || new Mutex();
    this.#pageScreenshotMutex = mutex;
    this.#screenshotOperationsCount++;
    return mutex.acquire(() => {
      this.#screenshotOperationsCount--;
      if (this.#screenshotOperationsCount === 0) {
        this.#pageScreenshotMutex = void 0;
      }
    });
  }
  /**
   * @internal
   */
  waitForScreenshotOperations() {
    return this.#pageScreenshotMutex?.acquire();
  }
  /**
   * Waits until a {@link Target | target} matching the given `predicate`
   * appears and returns it.
   *
   * This will look all open {@link BrowserContext | browser contexts}.
   *
   * @example Finding a target for a page opened via `window.open`:
   *
   * ```ts
   * await page.evaluate(() => window.open('https://www.example.com/'));
   * const newWindowTarget = await browserContext.waitForTarget(
   *   target => target.url() === 'https://www.example.com/',
   * );
   * ```
   */
  async waitForTarget(predicate, options = {}) {
    const { timeout: ms = 3e4 } = options;
    return await firstValueFrom(merge(fromEmitterEvent(
      this,
      "targetcreated"
      /* BrowserContextEvent.TargetCreated */
    ), fromEmitterEvent(
      this,
      "targetchanged"
      /* BrowserContextEvent.TargetChanged */
    ), from(this.targets())).pipe(filterAsync(predicate), raceWith(timeout(ms))));
  }
  /**
   * Whether this {@link BrowserContext | browser context} is closed.
   */
  get closed() {
    return !this.browser().browserContexts().includes(this);
  }
  /**
   * Identifier for this {@link BrowserContext | browser context}.
   */
  get id() {
    return void 0;
  }
  /** @internal */
  [disposeSymbol]() {
    return void this.close().catch(debugError);
  }
  /** @internal */
  [asyncDisposeSymbol]() {
    return this.close();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/util/ErrorLike.js
init_cjs_shim();
function isErrorLike(obj) {
  return typeof obj === "object" && obj !== null && "name" in obj && "message" in obj;
}
function rewriteError(error, message, originalMessage) {
  error.message = message;
  error.originalMessage = originalMessage ?? error.originalMessage;
  return error;
}
function createProtocolErrorMessage(object) {
  let message = object.error.message;
  if (object.error && typeof object.error === "object" && "data" in object.error) {
    message += ` ${object.error.data}`;
  }
  return message;
}

// node_modules/puppeteer-core/lib/esm/puppeteer/util/Function.js
init_cjs_shim();
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
  } catch (err) {
    if (err.message.includes(`Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive`)) {
      return value;
    }
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
    value = value.replace(
      new RegExp(`PLACEHOLDER\\(\\s*(?:'${name}'|"${name}")\\s*\\)`, "g"),
      // Wrapping this ensures tersers that accidentally inline PLACEHOLDER calls
      // are still valid. Without, we may get calls like ()=>{...}() which is
      // not valid.
      `(${jsValue})`
    );
  }
  return createFunction(value);
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/LazyArg.js
init_cjs_shim();
var _get;
var _LazyArg = class {
  constructor(get) {
    __privateAdd(this, _get, void 0);
    __privateSet(this, _get, get);
  }
  async get(context2) {
    return await __privateGet(this, _get).call(this, context2);
  }
};
var LazyArg = _LazyArg;
_get = new WeakMap();
__publicField(LazyArg, "create", (get) => {
  return new _LazyArg(get);
});

// node_modules/puppeteer-core/lib/esm/puppeteer/util/AsyncIterableUtil.js
init_cjs_shim();
var AsyncIterableUtil = class {
  static async *map(iterable, map2) {
    for await (const value of iterable) {
      yield await map2(value);
    }
  }
  static async *flatMap(iterable, map2) {
    for await (const value of iterable) {
      yield* map2(value);
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

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/AriaQueryHandler.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/QueryHandler.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/api/ElementHandleSymbol.js
init_cjs_shim();
var _isElementHandle = Symbol("_isElementHandle");

// node_modules/puppeteer-core/lib/esm/puppeteer/common/HandleIterator.js
init_cjs_shim();
var __addDisposableResource = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
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
var DEFAULT_BATCH_SIZE = 20;
async function* fastTransposeIteratorHandle(iterator2, size) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const array = __addDisposableResource(env_1, await iterator2.evaluateHandle(async (iterator3, size2) => {
      const results = [];
      while (results.length < size2) {
        const result = await iterator3.next();
        if (result.done) {
          break;
        }
        results.push(result.value);
      }
      return results;
    }, size), false);
    const properties = await array.getProperties();
    const handles = properties.values();
    const stack = __addDisposableResource(env_1, new DisposableStack(), false);
    stack.defer(() => {
      for (const handle_1 of handles) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
          const handle = __addDisposableResource(env_2, handle_1, false);
          handle[disposeSymbol]();
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          __disposeResources(env_2);
        }
      }
    });
    yield* handles;
    return properties.size === 0;
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources(env_1);
  }
}
async function* transposeIteratorHandle(iterator2) {
  let size = DEFAULT_BATCH_SIZE;
  while (!(yield* fastTransposeIteratorHandle(iterator2, size))) {
    size <<= 1;
  }
}
async function* transposeIterableHandle(handle) {
  const env_3 = { stack: [], error: void 0, hasError: false };
  try {
    const generatorHandle = __addDisposableResource(env_3, await handle.evaluateHandle((iterable) => {
      return async function* () {
        yield* iterable;
      }();
    }), false);
    yield* transposeIteratorHandle(generatorHandle);
  } catch (e_3) {
    env_3.error = e_3;
    env_3.hasError = true;
  } finally {
    __disposeResources(env_3);
  }
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/QueryHandler.js
var __addDisposableResource2 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
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
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const handle = __addDisposableResource2(env_1, await element.evaluateHandle(this._querySelectorAll, selector, LazyArg.create((context2) => {
        return context2.puppeteerUtil;
      })), false);
      yield* transposeIterableHandle(handle);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources2(env_1);
    }
  }
  /**
   * Queries for a single node given a selector and {@link ElementHandle}.
   *
   * Akin to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector}.
   */
  static async queryOne(element, selector) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const result = __addDisposableResource2(env_2, await element.evaluateHandle(this._querySelector, selector, LazyArg.create((context2) => {
        return context2.puppeteerUtil;
      })), false);
      if (!(_isElementHandle in result)) {
        return null;
      }
      return result.move();
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources2(env_2);
    }
  }
  /**
   * Waits until a single node appears for a given selector and
   * {@link ElementHandle}.
   *
   * This will always query the handle in the Puppeteer world and migrate the
   * result to the main world.
   */
  static async waitFor(elementOrFrame, selector, options) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      let frame;
      const element = __addDisposableResource2(env_3, await (async () => {
        if (!(_isElementHandle in elementOrFrame)) {
          frame = elementOrFrame;
          return;
        }
        frame = elementOrFrame.frame;
        return await frame.isolatedRealm().adoptHandle(elementOrFrame);
      })(), false);
      const { visible = false, hidden = false, timeout: timeout2, signal } = options;
      const polling = visible || hidden ? "raf" : options.polling;
      try {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
          signal?.throwIfAborted();
          const handle = __addDisposableResource2(env_4, await frame.isolatedRealm().waitForFunction(async (PuppeteerUtil, query, selector2, root, visible2) => {
            const querySelector = PuppeteerUtil.createFunction(query);
            const node = await querySelector(root ?? document, selector2, PuppeteerUtil);
            return PuppeteerUtil.checkVisibility(node, visible2);
          }, {
            polling,
            root: element,
            timeout: timeout2,
            signal
          }, LazyArg.create((context2) => {
            return context2.puppeteerUtil;
          }), stringifyFunction(this._querySelector), selector, element, visible ? true : hidden ? false : void 0), false);
          if (signal?.aborted) {
            throw signal.reason;
          }
          if (!(_isElementHandle in handle)) {
            return null;
          }
          return await frame.mainRealm().transferHandle(handle);
        } catch (e_3) {
          env_4.error = e_3;
          env_4.hasError = true;
        } finally {
          __disposeResources2(env_4);
        }
      } catch (error) {
        if (!isErrorLike(error)) {
          throw error;
        }
        if (error.name === "AbortError") {
          throw error;
        }
        error.message = `Waiting for selector \`${selector}\` failed: ${error.message}`;
        throw error;
      }
    } catch (e_4) {
      env_3.error = e_4;
      env_3.hasError = true;
    } finally {
      __disposeResources2(env_3);
    }
  }
};
// Either one of these may be implemented, but at least one must be.
__publicField(QueryHandler, "querySelectorAll");
__publicField(QueryHandler, "querySelector");

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/AriaQueryHandler.js
var isKnownAttribute = (attribute) => {
  return ["name", "role"].includes(attribute);
};
var ATTRIBUTE_REGEXP = /\[\s*(?<attribute>\w+)\s*=\s*(?<quote>"|')(?<value>\\.|.*?(?=\k<quote>))\k<quote>\s*\]/g;
var parseARIASelector = (selector) => {
  if (selector.length > 1e4) {
    throw new Error(`Selector ${selector} is too long`);
  }
  const queryOptions = {};
  const defaultName = selector.replace(ATTRIBUTE_REGEXP, (_, attribute, __, value) => {
    assert(isKnownAttribute(attribute), `Unknown aria attribute "${attribute}" in selector`);
    queryOptions[attribute] = value;
    return "";
  });
  if (defaultName && !queryOptions.name) {
    queryOptions.name = defaultName;
  }
  return queryOptions;
};
var _ARIAQueryHandler = class extends QueryHandler {
  static async *queryAll(element, selector) {
    const { name, role } = parseARIASelector(selector);
    yield* element.queryAXTree(name, role);
  }
};
var ARIAQueryHandler = _ARIAQueryHandler;
__publicField(ARIAQueryHandler, "querySelector", async (node, selector, { ariaQuerySelector }) => {
  return await ariaQuerySelector(node, selector);
});
__publicField(ARIAQueryHandler, "queryOne", async (element, selector) => {
  return await AsyncIterableUtil.first(_ARIAQueryHandler.queryAll(element, selector)) ?? null;
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/ScriptInjector.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/generated/injected.js
init_cjs_shim();
var source = '"use strict";var g=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var Y=Object.prototype.hasOwnProperty;var l=(t,e)=>{for(var r in e)g(t,r,{get:e[r],enumerable:!0})},J=(t,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of B(e))!Y.call(t,n)&&n!==r&&g(t,n,{get:()=>e[n],enumerable:!(o=X(e,n))||o.enumerable});return t};var z=t=>J(g({},"__esModule",{value:!0}),t);var pe={};l(pe,{default:()=>he});module.exports=z(pe);var N=class extends Error{constructor(e,r){super(e,r),this.name=this.constructor.name}get[Symbol.toStringTag](){return this.constructor.name}},p=class extends N{};var c=class t{static create(e){return new t(e)}static async race(e){let r=new Set;try{let o=e.map(n=>n instanceof t?(n.#n&&r.add(n),n.valueOrThrow()):n);return await Promise.race(o)}finally{for(let o of r)o.reject(new Error("Timeout cleared"))}}#e=!1;#r=!1;#o;#t;#a=new Promise(e=>{this.#t=e});#n;#i;constructor(e){e&&e.timeout>0&&(this.#i=new p(e.message),this.#n=setTimeout(()=>{this.reject(this.#i)},e.timeout))}#l(e){clearTimeout(this.#n),this.#o=e,this.#t()}resolve(e){this.#r||this.#e||(this.#e=!0,this.#l(e))}reject(e){this.#r||this.#e||(this.#r=!0,this.#l(e))}resolved(){return this.#e}finished(){return this.#e||this.#r}value(){return this.#o}#s;valueOrThrow(){return this.#s||(this.#s=(async()=>{if(await this.#a,this.#r)throw this.#o;return this.#o})()),this.#s}};var L=new Map,F=t=>{let e=L.get(t);return e||(e=new Function(`return ${t}`)(),L.set(t,e),e)};var x={};l(x,{ariaQuerySelector:()=>G,ariaQuerySelectorAll:()=>b});var G=(t,e)=>globalThis.__ariaQuerySelector(t,e),b=async function*(t,e){yield*await globalThis.__ariaQuerySelectorAll(t,e)};var E={};l(E,{cssQuerySelector:()=>K,cssQuerySelectorAll:()=>Z});var K=(t,e)=>t.querySelector(e),Z=function(t,e){return t.querySelectorAll(e)};var A={};l(A,{customQuerySelectors:()=>P});var v=class{#e=new Map;register(e,r){if(!r.queryOne&&r.queryAll){let o=r.queryAll;r.queryOne=(n,i)=>{for(let s of o(n,i))return s;return null}}else if(r.queryOne&&!r.queryAll){let o=r.queryOne;r.queryAll=(n,i)=>{let s=o(n,i);return s?[s]:[]}}else if(!r.queryOne||!r.queryAll)throw new Error("At least one query method must be defined.");this.#e.set(e,{querySelector:r.queryOne,querySelectorAll:r.queryAll})}unregister(e){this.#e.delete(e)}get(e){return this.#e.get(e)}clear(){this.#e.clear()}},P=new v;var R={};l(R,{pierceQuerySelector:()=>ee,pierceQuerySelectorAll:()=>te});var ee=(t,e)=>{let r=null,o=n=>{let i=document.createTreeWalker(n,NodeFilter.SHOW_ELEMENT);do{let s=i.currentNode;s.shadowRoot&&o(s.shadowRoot),!(s instanceof ShadowRoot)&&s!==n&&!r&&s.matches(e)&&(r=s)}while(!r&&i.nextNode())};return t instanceof Document&&(t=t.documentElement),o(t),r},te=(t,e)=>{let r=[],o=n=>{let i=document.createTreeWalker(n,NodeFilter.SHOW_ELEMENT);do{let s=i.currentNode;s.shadowRoot&&o(s.shadowRoot),!(s instanceof ShadowRoot)&&s!==n&&s.matches(e)&&r.push(s)}while(i.nextNode())};return t instanceof Document&&(t=t.documentElement),o(t),r};var u=(t,e)=>{if(!t)throw new Error(e)};var y=class{#e;#r;#o;#t;constructor(e,r){this.#e=e,this.#r=r}async start(){let e=this.#t=c.create(),r=await this.#e();if(r){e.resolve(r);return}this.#o=new MutationObserver(async()=>{let o=await this.#e();o&&(e.resolve(o),await this.stop())}),this.#o.observe(this.#r,{childList:!0,subtree:!0,attributes:!0})}async stop(){u(this.#t,"Polling never started."),this.#t.finished()||this.#t.reject(new Error("Polling stopped")),this.#o&&(this.#o.disconnect(),this.#o=void 0)}result(){return u(this.#t,"Polling never started."),this.#t.valueOrThrow()}},w=class{#e;#r;constructor(e){this.#e=e}async start(){let e=this.#r=c.create(),r=await this.#e();if(r){e.resolve(r);return}let o=async()=>{if(e.finished())return;let n=await this.#e();if(!n){window.requestAnimationFrame(o);return}e.resolve(n),await this.stop()};window.requestAnimationFrame(o)}async stop(){u(this.#r,"Polling never started."),this.#r.finished()||this.#r.reject(new Error("Polling stopped"))}result(){return u(this.#r,"Polling never started."),this.#r.valueOrThrow()}},S=class{#e;#r;#o;#t;constructor(e,r){this.#e=e,this.#r=r}async start(){let e=this.#t=c.create(),r=await this.#e();if(r){e.resolve(r);return}this.#o=setInterval(async()=>{let o=await this.#e();o&&(e.resolve(o),await this.stop())},this.#r)}async stop(){u(this.#t,"Polling never started."),this.#t.finished()||this.#t.reject(new Error("Polling stopped")),this.#o&&(clearInterval(this.#o),this.#o=void 0)}result(){return u(this.#t,"Polling never started."),this.#t.valueOrThrow()}};var _={};l(_,{PCombinator:()=>H,pQuerySelector:()=>fe,pQuerySelectorAll:()=>$});var a=class{static async*map(e,r){for await(let o of e)yield await r(o)}static async*flatMap(e,r){for await(let o of e)yield*r(o)}static async collect(e){let r=[];for await(let o of e)r.push(o);return r}static async first(e){for await(let r of e)return r}};var C={};l(C,{textQuerySelectorAll:()=>m});var re=new Set(["checkbox","image","radio"]),oe=t=>t instanceof HTMLSelectElement||t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement&&!re.has(t.type),ne=new Set(["SCRIPT","STYLE"]),f=t=>!ne.has(t.nodeName)&&!document.head?.contains(t),I=new WeakMap,j=t=>{for(;t;)I.delete(t),t instanceof ShadowRoot?t=t.host:t=t.parentNode},W=new WeakSet,se=new MutationObserver(t=>{for(let e of t)j(e.target)}),d=t=>{let e=I.get(t);if(e||(e={full:"",immediate:[]},!f(t)))return e;let r="";if(oe(t))e.full=t.value,e.immediate.push(t.value),t.addEventListener("input",o=>{j(o.target)},{once:!0,capture:!0});else{for(let o=t.firstChild;o;o=o.nextSibling){if(o.nodeType===Node.TEXT_NODE){e.full+=o.nodeValue??"",r+=o.nodeValue??"";continue}r&&e.immediate.push(r),r="",o.nodeType===Node.ELEMENT_NODE&&(e.full+=d(o).full)}r&&e.immediate.push(r),t instanceof Element&&t.shadowRoot&&(e.full+=d(t.shadowRoot).full),W.has(t)||(se.observe(t,{childList:!0,characterData:!0,subtree:!0}),W.add(t))}return I.set(t,e),e};var m=function*(t,e){let r=!1;for(let o of t.childNodes)if(o instanceof Element&&f(o)){let n;o.shadowRoot?n=m(o.shadowRoot,e):n=m(o,e);for(let i of n)yield i,r=!0}r||t instanceof Element&&f(t)&&d(t).full.includes(e)&&(yield t)};var k={};l(k,{checkVisibility:()=>le,pierce:()=>T,pierceAll:()=>O});var ie=["hidden","collapse"],le=(t,e)=>{if(!t)return e===!1;if(e===void 0)return t;let r=t.nodeType===Node.TEXT_NODE?t.parentElement:t,o=window.getComputedStyle(r),n=o&&!ie.includes(o.visibility)&&!ae(r);return e===n?t:!1};function ae(t){let e=t.getBoundingClientRect();return e.width===0||e.height===0}var ce=t=>"shadowRoot"in t&&t.shadowRoot instanceof ShadowRoot;function*T(t){ce(t)?yield t.shadowRoot:yield t}function*O(t){t=T(t).next().value,yield t;let e=[document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT)];for(let r of e){let o;for(;o=r.nextNode();)o.shadowRoot&&(yield o.shadowRoot,e.push(document.createTreeWalker(o.shadowRoot,NodeFilter.SHOW_ELEMENT)))}}var Q={};l(Q,{xpathQuerySelectorAll:()=>q});var q=function*(t,e,r=-1){let n=(t.ownerDocument||document).evaluate(e,t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE),i=[],s;for(;(s=n.iterateNext())&&(i.push(s),!(r&&i.length===r)););for(let h=0;h<i.length;h++)s=i[h],yield s,delete i[h]};var ue=/[-\\w\\P{ASCII}*]/u,H=(r=>(r.Descendent=">>>",r.Child=">>>>",r))(H||{}),V=t=>"querySelectorAll"in t,M=class{#e;#r=[];#o=void 0;elements;constructor(e,r){this.elements=[e],this.#e=r,this.#t()}async run(){if(typeof this.#o=="string")switch(this.#o.trimStart()){case":scope":this.#t();break}for(;this.#o!==void 0;this.#t()){let e=this.#o;typeof e=="string"?e[0]&&ue.test(e[0])?this.elements=a.flatMap(this.elements,async function*(r){V(r)&&(yield*r.querySelectorAll(e))}):this.elements=a.flatMap(this.elements,async function*(r){if(!r.parentElement){if(!V(r))return;yield*r.querySelectorAll(e);return}let o=0;for(let n of r.parentElement.children)if(++o,n===r)break;yield*r.parentElement.querySelectorAll(`:scope>:nth-child(${o})${e}`)}):this.elements=a.flatMap(this.elements,async function*(r){switch(e.name){case"text":yield*m(r,e.value);break;case"xpath":yield*q(r,e.value);break;case"aria":yield*b(r,e.value);break;default:let o=P.get(e.name);if(!o)throw new Error(`Unknown selector type: ${e.name}`);yield*o.querySelectorAll(r,e.value)}})}}#t(){if(this.#r.length!==0){this.#o=this.#r.shift();return}if(this.#e.length===0){this.#o=void 0;return}let e=this.#e.shift();switch(e){case">>>>":{this.elements=a.flatMap(this.elements,T),this.#t();break}case">>>":{this.elements=a.flatMap(this.elements,O),this.#t();break}default:this.#r=e,this.#t();break}}},D=class{#e=new WeakMap;calculate(e,r=[]){if(e===null)return r;e instanceof ShadowRoot&&(e=e.host);let o=this.#e.get(e);if(o)return[...o,...r];let n=0;for(let s=e.previousSibling;s;s=s.previousSibling)++n;let i=this.calculate(e.parentNode,[n]);return this.#e.set(e,i),[...i,...r]}},U=(t,e)=>{if(t.length+e.length===0)return 0;let[r=-1,...o]=t,[n=-1,...i]=e;return r===n?U(o,i):r<n?-1:1},de=async function*(t){let e=new Set;for await(let o of t)e.add(o);let r=new D;yield*[...e.values()].map(o=>[o,r.calculate(o)]).sort(([,o],[,n])=>U(o,n)).map(([o])=>o)},$=function(t,e){let r=JSON.parse(e);if(r.some(o=>{let n=0;return o.some(i=>(typeof i=="string"?++n:n=0,n>1))}))throw new Error("Multiple deep combinators found in sequence.");return de(a.flatMap(r,o=>{let n=new M(t,o);return n.run(),n.elements}))},fe=async function(t,e){for await(let r of $(t,e))return r;return null};var me=Object.freeze({...x,...A,...R,..._,...C,...k,...Q,...E,Deferred:c,createFunction:F,createTextContent:d,IntervalPoller:S,isSuitableNodeForTextMatching:f,MutationPoller:y,RAFPoller:w}),he=me;\n';

// node_modules/puppeteer-core/lib/esm/puppeteer/common/ScriptInjector.js
var ScriptInjector = class {
  #updated = false;
  #amendments = /* @__PURE__ */ new Set();
  // Appends a statement of the form `(PuppeteerUtil) => {...}`.
  append(statement) {
    this.#update(() => {
      this.#amendments.add(statement);
    });
  }
  pop(statement) {
    this.#update(() => {
      this.#amendments.delete(statement);
    });
  }
  inject(inject, force = false) {
    if (this.#updated || force) {
      inject(this.#get());
    }
    this.#updated = false;
  }
  #update(callback) {
    callback();
    this.#updated = true;
  }
  #get() {
    return `(() => {
      const module = {};
      ${source}
      ${[...this.#amendments].map((statement) => {
      return `(${statement})(module.exports.default);`;
    }).join("")}
      return module.exports.default;
    })()`;
  }
};
var scriptInjector = new ScriptInjector();

// node_modules/puppeteer-core/lib/esm/puppeteer/util/decorators.js
init_cjs_shim();
var __addDisposableResource3 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
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
var instances = /* @__PURE__ */ new WeakSet();
function moveable(Class, _) {
  let hasDispose = false;
  if (Class.prototype[disposeSymbol]) {
    const dispose = Class.prototype[disposeSymbol];
    Class.prototype[disposeSymbol] = function() {
      if (instances.has(this)) {
        instances.delete(this);
        return;
      }
      return dispose.call(this);
    };
    hasDispose = true;
  }
  if (Class.prototype[asyncDisposeSymbol]) {
    const asyncDispose = Class.prototype[asyncDisposeSymbol];
    Class.prototype[asyncDisposeSymbol] = function() {
      if (instances.has(this)) {
        instances.delete(this);
        return;
      }
      return asyncDispose.call(this);
    };
    hasDispose = true;
  }
  if (hasDispose) {
    Class.prototype.move = function() {
      instances.add(this);
      return this;
    };
  }
  return Class;
}
function throwIfDisposed(message = (value) => {
  return `Attempted to use disposed ${value.constructor.name}.`;
}) {
  return (target, _) => {
    return function(...args) {
      if (this.disposed) {
        throw new Error(message(this));
      }
      return target.call(this, ...args);
    };
  };
}
function inertIfDisposed(target, _) {
  return function(...args) {
    if (this.disposed) {
      return;
    }
    return target.call(this, ...args);
  };
}
function invokeAtMostOnceForArguments(target, _) {
  const cache = /* @__PURE__ */ new WeakMap();
  let cacheDepth = -1;
  return function(...args) {
    if (cacheDepth === -1) {
      cacheDepth = args.length;
    }
    if (cacheDepth !== args.length) {
      throw new Error("Memoized method was called with the wrong number of arguments");
    }
    let freshArguments = false;
    let cacheIterator = cache;
    for (const arg of args) {
      if (cacheIterator.has(arg)) {
        cacheIterator = cacheIterator.get(arg);
      } else {
        freshArguments = true;
        cacheIterator.set(arg, /* @__PURE__ */ new WeakMap());
        cacheIterator = cacheIterator.get(arg);
      }
    }
    if (!freshArguments) {
      return;
    }
    return target.call(this, ...args);
  };
}
function guarded(getKey = function() {
  return this;
}) {
  return (target, _) => {
    const mutexes = /* @__PURE__ */ new WeakMap();
    return async function(...args) {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const key = getKey.call(this);
        let mutex = mutexes.get(key);
        if (!mutex) {
          mutex = new Mutex();
          mutexes.set(key, mutex);
        }
        const _2 = __addDisposableResource3(env_1, await mutex.acquire(), true);
        return await target.call(this, ...args);
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        const result_1 = __disposeResources3(env_1);
        if (result_1)
          await result_1;
      }
    };
  };
}
var bubbleHandlers = /* @__PURE__ */ new WeakMap();
var bubbleInitializer = function(events) {
  const handlers = bubbleHandlers.get(this) ?? /* @__PURE__ */ new Map();
  if (handlers.has(events)) {
    return;
  }
  const handler = events !== void 0 ? (type, event) => {
    if (events.includes(type)) {
      this.emit(type, event);
    }
  } : (type, event) => {
    this.emit(type, event);
  };
  handlers.set(events, handler);
  bubbleHandlers.set(this, handlers);
};
function bubble(events) {
  return ({ set, get }, context2) => {
    context2.addInitializer(function() {
      return bubbleInitializer.apply(this, [events]);
    });
    return {
      set(emitter) {
        const handler = bubbleHandlers.get(this).get(events);
        const oldEmitter = get.call(this);
        if (oldEmitter !== void 0) {
          oldEmitter.off("*", handler);
        }
        if (emitter === void 0) {
          return;
        }
        emitter.on("*", handler);
        set.call(this, emitter);
      },
      init(emitter) {
        if (emitter === void 0) {
          return emitter;
        }
        bubbleInitializer.apply(this, [events]);
        const handler = bubbleHandlers.get(this).get(events);
        emitter.on("*", handler);
        return emitter;
      }
    };
  };
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/JSHandle.js
init_cjs_shim();
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
    var context2 = {};
    for (var p in contextIn)
      context2[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context2.access[p] = contextIn.access[p];
    context2.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context2);
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
var __addDisposableResource4 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
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
var JSHandle = (() => {
  let _classDecorators = [moveable];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _instanceExtraInitializers = [];
  let _getProperty_decorators;
  let _getProperties_decorators;
  var JSHandle2 = class {
    static {
      _classThis = this;
    }
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      __esDecorate(this, null, _getProperty_decorators, { kind: "method", name: "getProperty", static: false, private: false, access: { has: (obj) => "getProperty" in obj, get: (obj) => obj.getProperty }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate(this, null, _getProperties_decorators, { kind: "method", name: "getProperties", static: false, private: false, access: { has: (obj) => "getProperties" in obj, get: (obj) => obj.getProperties }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
      JSHandle2 = _classThis = _classDescriptor.value;
      if (_metadata)
        Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
      __runInitializers(_classThis, _classExtraInitializers);
    }
    /**
     * @internal
     */
    constructor() {
      __runInitializers(this, _instanceExtraInitializers);
    }
    /**
     * Evaluates the given function with the current handle as its first argument.
     */
    async evaluate(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluate.name, pageFunction);
      return await this.realm.evaluate(pageFunction, this, ...args);
    }
    /**
     * Evaluates the given function with the current handle as its first argument.
     *
     */
    async evaluateHandle(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluateHandle.name, pageFunction);
      return await this.realm.evaluateHandle(pageFunction, this, ...args);
    }
    /**
     * @internal
     */
    async getProperty(propertyName) {
      return await this.evaluateHandle((object, propertyName2) => {
        return object[propertyName2];
      }, propertyName);
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
      const propertyNames = await this.evaluate((object) => {
        const enumerableProperties = [];
        const descriptors = Object.getOwnPropertyDescriptors(object);
        for (const propertyName in descriptors) {
          if (descriptors[propertyName]?.enumerable) {
            enumerableProperties.push(propertyName);
          }
        }
        return enumerableProperties;
      });
      const map2 = /* @__PURE__ */ new Map();
      const results = await Promise.all(propertyNames.map((key) => {
        return this.getProperty(key);
      }));
      for (const [key, value] of Object.entries(propertyNames)) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const handle = __addDisposableResource4(env_1, results[key], false);
          if (handle) {
            map2.set(value, handle.move());
          }
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources4(env_1);
        }
      }
      return map2;
    }
    /** @internal */
    [(_getProperty_decorators = [throwIfDisposed()], _getProperties_decorators = [throwIfDisposed()], disposeSymbol)]() {
      return void this.dispose().catch(debugError);
    }
    /** @internal */
    [asyncDisposeSymbol]() {
      return this.dispose();
    }
  };
  return JSHandle2 = _classThis;
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/api/ElementHandle.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/GetQueryHandler.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/CSSQueryHandler.js
init_cjs_shim();
var CSSQueryHandler = class extends QueryHandler {
};
__publicField(CSSQueryHandler, "querySelector", (element, selector, { cssQuerySelector }) => {
  return cssQuerySelector(element, selector);
});
__publicField(CSSQueryHandler, "querySelectorAll", (element, selector, { cssQuerySelectorAll }) => {
  return cssQuerySelectorAll(element, selector);
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/CustomQueryHandler.js
init_cjs_shim();
var CustomQueryHandlerRegistry = class {
  #handlers = /* @__PURE__ */ new Map();
  get(name) {
    const handler = this.#handlers.get(name);
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
   */
  register(name, handler) {
    assert(!this.#handlers.has(name), `Cannot register over existing handler: ${name}`);
    assert(/^[a-zA-Z]+$/.test(name), `Custom query handler names may only contain [a-zA-Z]`);
    assert(handler.queryAll || handler.queryOne, `At least one query method must be implemented.`);
    const Handler = class extends QueryHandler {
      static querySelectorAll = interpolateFunction((node, selector, PuppeteerUtil) => {
        return PuppeteerUtil.customQuerySelectors.get(PLACEHOLDER("name")).querySelectorAll(node, selector);
      }, { name: JSON.stringify(name) });
      static querySelector = interpolateFunction((node, selector, PuppeteerUtil) => {
        return PuppeteerUtil.customQuerySelectors.get(PLACEHOLDER("name")).querySelector(node, selector);
      }, { name: JSON.stringify(name) });
    };
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
    this.#handlers.set(name, [registerScript, Handler]);
    scriptInjector.append(registerScript);
  }
  /**
   * Unregisters the {@link CustomQueryHandler | custom query handler} for the
   * given name.
   *
   * @throws `Error` if there is no handler under the given name.
   */
  unregister(name) {
    const handler = this.#handlers.get(name);
    if (!handler) {
      throw new Error(`Cannot unregister unknown handler: ${name}`);
    }
    scriptInjector.pop(handler[0]);
    this.#handlers.delete(name);
  }
  /**
   * Gets the names of all {@link CustomQueryHandler | custom query handlers}.
   */
  names() {
    return [...this.#handlers.keys()];
  }
  /**
   * Unregisters all custom query handlers.
   */
  clear() {
    for (const [registerScript] of this.#handlers) {
      scriptInjector.pop(registerScript);
    }
    this.#handlers.clear();
  }
};
var customQueryHandlers = new CustomQueryHandlerRegistry();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PierceQueryHandler.js
init_cjs_shim();
var PierceQueryHandler = class extends QueryHandler {
};
__publicField(PierceQueryHandler, "querySelector", (element, selector, { pierceQuerySelector }) => {
  return pierceQuerySelector(element, selector);
});
__publicField(PierceQueryHandler, "querySelectorAll", (element, selector, { pierceQuerySelectorAll }) => {
  return pierceQuerySelectorAll(element, selector);
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PQueryHandler.js
init_cjs_shim();
var PQueryHandler = class extends QueryHandler {
};
__publicField(PQueryHandler, "querySelectorAll", (element, selector, { pQuerySelectorAll }) => {
  return pQuerySelectorAll(element, selector);
});
__publicField(PQueryHandler, "querySelector", (element, selector, { pQuerySelector }) => {
  return pQuerySelector(element, selector);
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PSelectorParser.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/third_party/parsel-js/parsel-js.js
init_cjs_shim();
var TOKENS = {
  attribute: /\[\s*(?:(?<namespace>\*|[-\w\P{ASCII}]*)\|)?(?<name>[-\w\P{ASCII}]+)\s*(?:(?<operator>\W?=)\s*(?<value>.+?)\s*(\s(?<caseSensitive>[iIsS]))?\s*)?\]/gu,
  id: /#(?<name>[-\w\P{ASCII}]+)/gu,
  class: /\.(?<name>[-\w\P{ASCII}]+)/gu,
  comma: /\s*,\s*/g,
  combinator: /\s*[\s>+~]\s*/g,
  "pseudo-element": /::(?<name>[-\w\P{ASCII}]+)(?:\((?<argument>¶*)\))?/gu,
  "pseudo-class": /:(?<name>[-\w\P{ASCII}]+)(?:\((?<argument>¶*)\))?/gu,
  universal: /(?:(?<namespace>\*|[-\w\P{ASCII}]*)\|)?\*/gu,
  type: /(?:(?<namespace>\*|[-\w\P{ASCII}]*)\|)?(?<name>[-\w\P{ASCII}]+)/gu
  // this must be last
};
var TRIM_TOKENS = /* @__PURE__ */ new Set(["combinator", "comma"]);
var getArgumentPatternByType = (type) => {
  switch (type) {
    case "pseudo-element":
    case "pseudo-class":
      return new RegExp(TOKENS[type].source.replace("(?<argument>\xB6*)", "(?<argument>.*)"), "gu");
    default:
      return TOKENS[type];
  }
};
function gobbleParens(text, offset) {
  let nesting = 0;
  let result = "";
  for (; offset < text.length; offset++) {
    const char = text[offset];
    switch (char) {
      case "(":
        ++nesting;
        break;
      case ")":
        --nesting;
        break;
    }
    result += char;
    if (nesting === 0) {
      return result;
    }
  }
  return result;
}
function tokenizeBy(text, grammar = TOKENS) {
  if (!text) {
    return [];
  }
  const tokens = [text];
  for (const [type, pattern] of Object.entries(grammar)) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token !== "string") {
        continue;
      }
      pattern.lastIndex = 0;
      const match = pattern.exec(token);
      if (!match) {
        continue;
      }
      const from2 = match.index - 1;
      const args = [];
      const content = match[0];
      const before = token.slice(0, from2 + 1);
      if (before) {
        args.push(before);
      }
      args.push({
        ...match.groups,
        type,
        content
      });
      const after = token.slice(from2 + content.length + 1);
      if (after) {
        args.push(after);
      }
      tokens.splice(i, 1, ...args);
    }
  }
  let offset = 0;
  for (const token of tokens) {
    switch (typeof token) {
      case "string":
        throw new Error(`Unexpected sequence ${token} found at index ${offset}`);
      case "object":
        offset += token.content.length;
        token.pos = [offset - token.content.length, offset];
        if (TRIM_TOKENS.has(token.type)) {
          token.content = token.content.trim() || " ";
        }
        break;
    }
  }
  return tokens;
}
var STRING_PATTERN = /(['"])([^\\\n]+?)\1/g;
var ESCAPE_PATTERN = /\\./g;
function tokenize(selector, grammar = TOKENS) {
  selector = selector.trim();
  if (selector === "") {
    return [];
  }
  const replacements = [];
  selector = selector.replace(ESCAPE_PATTERN, (value, offset) => {
    replacements.push({ value, offset });
    return "\uE000".repeat(value.length);
  });
  selector = selector.replace(STRING_PATTERN, (value, quote, content, offset) => {
    replacements.push({ value, offset });
    return `${quote}${"\uE001".repeat(content.length)}${quote}`;
  });
  {
    let pos = 0;
    let offset;
    while ((offset = selector.indexOf("(", pos)) > -1) {
      const value = gobbleParens(selector, offset);
      replacements.push({ value, offset });
      selector = `${selector.substring(0, offset)}(${"\xB6".repeat(value.length - 2)})${selector.substring(offset + value.length)}`;
      pos = offset + value.length;
    }
  }
  const tokens = tokenizeBy(selector, grammar);
  const changedTokens = /* @__PURE__ */ new Set();
  for (const replacement of replacements.reverse()) {
    for (const token of tokens) {
      const { offset, value } = replacement;
      if (!(token.pos[0] <= offset && offset + value.length <= token.pos[1])) {
        continue;
      }
      const { content } = token;
      const tokenOffset = offset - token.pos[0];
      token.content = content.slice(0, tokenOffset) + value + content.slice(tokenOffset + value.length);
      if (token.content !== content) {
        changedTokens.add(token);
      }
    }
  }
  for (const token of changedTokens) {
    const pattern = getArgumentPatternByType(token.type);
    if (!pattern) {
      throw new Error(`Unknown token type: ${token.type}`);
    }
    pattern.lastIndex = 0;
    const match = pattern.exec(token.content);
    if (!match) {
      throw new Error(`Unable to parse content for ${token.type}: ${token.content}`);
    }
    Object.assign(token, match.groups);
  }
  return tokens;
}
function* flatten(node, parent) {
  switch (node.type) {
    case "list":
      for (let child of node.list) {
        yield* flatten(child, node);
      }
      break;
    case "complex":
      yield* flatten(node.left, node);
      yield* flatten(node.right, node);
      break;
    case "compound":
      yield* node.list.map((token) => [token, node]);
      break;
    default:
      yield [node, parent];
  }
}
function stringify(listOrNode) {
  let tokens;
  if (Array.isArray(listOrNode)) {
    tokens = listOrNode;
  } else {
    tokens = [...flatten(listOrNode)].map(([token]) => token);
  }
  return tokens.map((token) => token.content).join("");
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/PSelectorParser.js
TOKENS["nesting"] = /&/g;
TOKENS["combinator"] = /\s*(>>>>?|[\s>+~])\s*/g;
var ESCAPE_REGEXP = /\\[\s\S]/g;
var unquote = (text) => {
  if (text.length <= 1) {
    return text;
  }
  if ((text[0] === '"' || text[0] === "'") && text.endsWith(text[0])) {
    text = text.slice(1, -1);
  }
  return text.replace(ESCAPE_REGEXP, (match) => {
    return match[1];
  });
};
function parsePSelectors(selector) {
  let isPureCSS = true;
  let hasAria = false;
  let hasPseudoClasses = false;
  const tokens = tokenize(selector);
  if (tokens.length === 0) {
    return [[], isPureCSS, hasPseudoClasses, false];
  }
  let compoundSelector = [];
  let complexSelector = [compoundSelector];
  const selectors = [complexSelector];
  const storage = [];
  for (const token of tokens) {
    switch (token.type) {
      case "combinator":
        switch (token.content) {
          case ">>>":
            isPureCSS = false;
            if (storage.length) {
              compoundSelector.push(stringify(storage));
              storage.splice(0);
            }
            compoundSelector = [];
            complexSelector.push(
              ">>>"
              /* PCombinator.Descendent */
            );
            complexSelector.push(compoundSelector);
            continue;
          case ">>>>":
            isPureCSS = false;
            if (storage.length) {
              compoundSelector.push(stringify(storage));
              storage.splice(0);
            }
            compoundSelector = [];
            complexSelector.push(
              ">>>>"
              /* PCombinator.Child */
            );
            complexSelector.push(compoundSelector);
            continue;
        }
        break;
      case "pseudo-element":
        if (!token.name.startsWith("-p-")) {
          break;
        }
        isPureCSS = false;
        if (storage.length) {
          compoundSelector.push(stringify(storage));
          storage.splice(0);
        }
        const name = token.name.slice(3);
        if (name === "aria") {
          hasAria = true;
        }
        compoundSelector.push({
          name,
          value: unquote(token.argument ?? "")
        });
        continue;
      case "pseudo-class":
        hasPseudoClasses = true;
        break;
      case "comma":
        if (storage.length) {
          compoundSelector.push(stringify(storage));
          storage.splice(0);
        }
        compoundSelector = [];
        complexSelector = [compoundSelector];
        selectors.push(complexSelector);
        continue;
    }
    storage.push(token);
  }
  if (storage.length) {
    compoundSelector.push(stringify(storage));
  }
  return [selectors, isPureCSS, hasPseudoClasses, hasAria];
}

// node_modules/puppeteer-core/lib/esm/puppeteer/common/TextQueryHandler.js
init_cjs_shim();
var TextQueryHandler = class extends QueryHandler {
};
__publicField(TextQueryHandler, "querySelectorAll", (element, selector, { textQuerySelectorAll }) => {
  return textQuerySelectorAll(element, selector);
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/XPathQueryHandler.js
init_cjs_shim();
var XPathQueryHandler = class extends QueryHandler {
};
__publicField(XPathQueryHandler, "querySelectorAll", (element, selector, { xpathQuerySelectorAll }) => {
  return xpathQuerySelectorAll(element, selector);
});
__publicField(XPathQueryHandler, "querySelector", (element, selector, { xpathQuerySelectorAll }) => {
  for (const result of xpathQuerySelectorAll(element, selector, 1)) {
    return result;
  }
  return null;
});

// node_modules/puppeteer-core/lib/esm/puppeteer/common/GetQueryHandler.js
var BUILTIN_QUERY_HANDLERS = {
  aria: ARIAQueryHandler,
  pierce: PierceQueryHandler,
  xpath: XPathQueryHandler,
  text: TextQueryHandler
};
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
          return {
            updatedSelector: selector,
            polling: name === "aria" ? "raf" : "mutation",
            QueryHandler: QueryHandler2
          };
        }
      }
    }
  }
  try {
    const [pSelector, isPureCSS, hasPseudoClasses, hasAria] = parsePSelectors(selector);
    if (isPureCSS) {
      return {
        updatedSelector: selector,
        polling: hasPseudoClasses ? "raf" : "mutation",
        QueryHandler: CSSQueryHandler
      };
    }
    return {
      updatedSelector: JSON.stringify(pSelector),
      polling: hasAria ? "raf" : "mutation",
      QueryHandler: PQueryHandler
    };
  } catch {
    return {
      updatedSelector: selector,
      polling: "mutation",
      QueryHandler: CSSQueryHandler
    };
  }
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/ElementHandle.js
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
    var context2 = {};
    for (var p in contextIn)
      context2[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context2.access[p] = contextIn.access[p];
    context2.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context2);
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
var __addDisposableResource5 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
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
var __setFunctionName = function(f, name, prefix) {
  if (typeof name === "symbol")
    name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
function bindIsolatedHandle(target, _) {
  return async function(...args) {
    if (this.realm === this.frame.isolatedRealm()) {
      return await target.call(this, ...args);
    }
    let adoptedThis;
    if (this["isolatedHandle"]) {
      adoptedThis = this["isolatedHandle"];
    } else {
      this["isolatedHandle"] = adoptedThis = await this.frame.isolatedRealm().adoptHandle(this);
    }
    const result = await target.call(adoptedThis, ...args);
    if (result === adoptedThis) {
      return this;
    }
    if (result instanceof JSHandle) {
      return await this.realm.transferHandle(result);
    }
    if (Array.isArray(result)) {
      await Promise.all(result.map(async (item, index, result2) => {
        if (item instanceof JSHandle) {
          result2[index] = await this.realm.transferHandle(item);
        }
      }));
    }
    if (result instanceof Map) {
      await Promise.all([...result.entries()].map(async ([key, value]) => {
        if (value instanceof JSHandle) {
          result.set(key, await this.realm.transferHandle(value));
        }
      }));
    }
    return result;
  };
}
var ElementHandle = (() => {
  let _classSuper = JSHandle;
  let _instanceExtraInitializers = [];
  let _getProperty_decorators;
  let _getProperties_decorators;
  let _jsonValue_decorators;
  let _$_decorators;
  let _$$_decorators;
  let _private_$$_decorators;
  let _private_$$_descriptor;
  let _waitForSelector_decorators;
  let _isVisible_decorators;
  let _isHidden_decorators;
  let _toElement_decorators;
  let _clickablePoint_decorators;
  let _hover_decorators;
  let _click_decorators;
  let _drag_decorators;
  let _dragEnter_decorators;
  let _dragOver_decorators;
  let _drop_decorators;
  let _dragAndDrop_decorators;
  let _select_decorators;
  let _tap_decorators;
  let _touchStart_decorators;
  let _touchMove_decorators;
  let _touchEnd_decorators;
  let _focus_decorators;
  let _type_decorators;
  let _press_decorators;
  let _boundingBox_decorators;
  let _boxModel_decorators;
  let _screenshot_decorators;
  let _isIntersectingViewport_decorators;
  let _scrollIntoView_decorators;
  return class ElementHandle2 extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _getProperty_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _getProperties_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _jsonValue_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _$_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _$$_decorators = [throwIfDisposed()];
      _private_$$_decorators = [bindIsolatedHandle];
      _waitForSelector_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _isVisible_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _isHidden_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _toElement_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _clickablePoint_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _hover_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _click_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _drag_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _dragEnter_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _dragOver_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _drop_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _dragAndDrop_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _select_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _tap_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _touchStart_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _touchMove_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _touchEnd_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _focus_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _type_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _press_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _boundingBox_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _boxModel_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _screenshot_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _isIntersectingViewport_decorators = [throwIfDisposed(), bindIsolatedHandle];
      _scrollIntoView_decorators = [throwIfDisposed(), bindIsolatedHandle];
      __esDecorate2(this, null, _getProperty_decorators, { kind: "method", name: "getProperty", static: false, private: false, access: { has: (obj) => "getProperty" in obj, get: (obj) => obj.getProperty }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _getProperties_decorators, { kind: "method", name: "getProperties", static: false, private: false, access: { has: (obj) => "getProperties" in obj, get: (obj) => obj.getProperties }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _jsonValue_decorators, { kind: "method", name: "jsonValue", static: false, private: false, access: { has: (obj) => "jsonValue" in obj, get: (obj) => obj.jsonValue }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _$_decorators, { kind: "method", name: "$", static: false, private: false, access: { has: (obj) => "$" in obj, get: (obj) => obj.$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _$$_decorators, { kind: "method", name: "$$", static: false, private: false, access: { has: (obj) => "$$" in obj, get: (obj) => obj.$$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, _private_$$_descriptor = { value: __setFunctionName(async function(selector) {
        return await this.#$$impl(selector);
      }, "#$$") }, _private_$$_decorators, { kind: "method", name: "#$$", static: false, private: true, access: { has: (obj) => #$$ in obj, get: (obj) => obj.#$$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _waitForSelector_decorators, { kind: "method", name: "waitForSelector", static: false, private: false, access: { has: (obj) => "waitForSelector" in obj, get: (obj) => obj.waitForSelector }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _isVisible_decorators, { kind: "method", name: "isVisible", static: false, private: false, access: { has: (obj) => "isVisible" in obj, get: (obj) => obj.isVisible }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _isHidden_decorators, { kind: "method", name: "isHidden", static: false, private: false, access: { has: (obj) => "isHidden" in obj, get: (obj) => obj.isHidden }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _toElement_decorators, { kind: "method", name: "toElement", static: false, private: false, access: { has: (obj) => "toElement" in obj, get: (obj) => obj.toElement }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _clickablePoint_decorators, { kind: "method", name: "clickablePoint", static: false, private: false, access: { has: (obj) => "clickablePoint" in obj, get: (obj) => obj.clickablePoint }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _hover_decorators, { kind: "method", name: "hover", static: false, private: false, access: { has: (obj) => "hover" in obj, get: (obj) => obj.hover }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _click_decorators, { kind: "method", name: "click", static: false, private: false, access: { has: (obj) => "click" in obj, get: (obj) => obj.click }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _drag_decorators, { kind: "method", name: "drag", static: false, private: false, access: { has: (obj) => "drag" in obj, get: (obj) => obj.drag }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _dragEnter_decorators, { kind: "method", name: "dragEnter", static: false, private: false, access: { has: (obj) => "dragEnter" in obj, get: (obj) => obj.dragEnter }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _dragOver_decorators, { kind: "method", name: "dragOver", static: false, private: false, access: { has: (obj) => "dragOver" in obj, get: (obj) => obj.dragOver }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _drop_decorators, { kind: "method", name: "drop", static: false, private: false, access: { has: (obj) => "drop" in obj, get: (obj) => obj.drop }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _dragAndDrop_decorators, { kind: "method", name: "dragAndDrop", static: false, private: false, access: { has: (obj) => "dragAndDrop" in obj, get: (obj) => obj.dragAndDrop }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _select_decorators, { kind: "method", name: "select", static: false, private: false, access: { has: (obj) => "select" in obj, get: (obj) => obj.select }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _tap_decorators, { kind: "method", name: "tap", static: false, private: false, access: { has: (obj) => "tap" in obj, get: (obj) => obj.tap }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _touchStart_decorators, { kind: "method", name: "touchStart", static: false, private: false, access: { has: (obj) => "touchStart" in obj, get: (obj) => obj.touchStart }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _touchMove_decorators, { kind: "method", name: "touchMove", static: false, private: false, access: { has: (obj) => "touchMove" in obj, get: (obj) => obj.touchMove }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _touchEnd_decorators, { kind: "method", name: "touchEnd", static: false, private: false, access: { has: (obj) => "touchEnd" in obj, get: (obj) => obj.touchEnd }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _focus_decorators, { kind: "method", name: "focus", static: false, private: false, access: { has: (obj) => "focus" in obj, get: (obj) => obj.focus }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _type_decorators, { kind: "method", name: "type", static: false, private: false, access: { has: (obj) => "type" in obj, get: (obj) => obj.type }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _press_decorators, { kind: "method", name: "press", static: false, private: false, access: { has: (obj) => "press" in obj, get: (obj) => obj.press }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _boundingBox_decorators, { kind: "method", name: "boundingBox", static: false, private: false, access: { has: (obj) => "boundingBox" in obj, get: (obj) => obj.boundingBox }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _boxModel_decorators, { kind: "method", name: "boxModel", static: false, private: false, access: { has: (obj) => "boxModel" in obj, get: (obj) => obj.boxModel }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _screenshot_decorators, { kind: "method", name: "screenshot", static: false, private: false, access: { has: (obj) => "screenshot" in obj, get: (obj) => obj.screenshot }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _isIntersectingViewport_decorators, { kind: "method", name: "isIntersectingViewport", static: false, private: false, access: { has: (obj) => "isIntersectingViewport" in obj, get: (obj) => obj.isIntersectingViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate2(this, null, _scrollIntoView_decorators, { kind: "method", name: "scrollIntoView", static: false, private: false, access: { has: (obj) => "scrollIntoView" in obj, get: (obj) => obj.scrollIntoView }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    /**
     * @internal
     * Cached isolatedHandle to prevent
     * trying to adopt it multiple times
     */
    isolatedHandle = __runInitializers2(this, _instanceExtraInitializers);
    /**
     * @internal
     */
    handle;
    /**
     * @internal
     */
    constructor(handle) {
      super();
      this.handle = handle;
      this[_isElementHandle] = true;
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
    /**
     * @internal
     */
    async getProperty(propertyName) {
      return await this.handle.getProperty(propertyName);
    }
    /**
     * @internal
     */
    async getProperties() {
      return await this.handle.getProperties();
    }
    /**
     * @internal
     */
    async evaluate(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluate.name, pageFunction);
      return await this.handle.evaluate(pageFunction, ...args);
    }
    /**
     * @internal
     */
    async evaluateHandle(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluateHandle.name, pageFunction);
      return await this.handle.evaluateHandle(pageFunction, ...args);
    }
    /**
     * @internal
     */
    async jsonValue() {
      return await this.handle.jsonValue();
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
    remoteObject() {
      return this.handle.remoteObject();
    }
    /**
     * @internal
     */
    dispose() {
      return this.handle.dispose();
    }
    /**
     * @internal
     */
    asElement() {
      return this;
    }
    /**
     * Queries the current element for an element matching the given selector.
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @returns A {@link ElementHandle | element handle} to the first element
     * matching the given selector. Otherwise, `null`.
     */
    async $(selector) {
      const { updatedSelector, QueryHandler: QueryHandler2 } = getQueryHandlerAndSelector(selector);
      return await QueryHandler2.queryOne(this, updatedSelector);
    }
    /**
     * Queries the current element for all elements matching the given selector.
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @returns An array of {@link ElementHandle | element handles} that point to
     * elements matching the given selector.
     */
    async $$(selector, options) {
      if (options?.isolate === false) {
        return await this.#$$impl(selector);
      }
      return await this.#$$(selector);
    }
    /**
     * Isolates {@link ElementHandle.$$} if needed.
     *
     * @internal
     */
    get #$$() {
      return _private_$$_descriptor.value;
    }
    /**
     * Implementation for {@link ElementHandle.$$}.
     *
     * @internal
     */
    async #$$impl(selector) {
      const { updatedSelector, QueryHandler: QueryHandler2 } = getQueryHandlerAndSelector(selector);
      return await AsyncIterableUtil.collect(QueryHandler2.queryAll(this, updatedSelector));
    }
    /**
     * Runs the given function on the first element matching the given selector in
     * the current element.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const tweetHandle = await page.$('.tweet');
     * expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe(
     *   '100',
     * );
     * expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe(
     *   '10',
     * );
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param pageFunction - The function to be evaluated in this element's page's
     * context. The first element matching the selector will be passed in as the
     * first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $eval(selector, pageFunction, ...args) {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        pageFunction = withSourcePuppeteerURLIfNone(this.$eval.name, pageFunction);
        const elementHandle = __addDisposableResource5(env_1, await this.$(selector), false);
        if (!elementHandle) {
          throw new Error(`Error: failed to find element matching selector "${selector}"`);
        }
        return await elementHandle.evaluate(pageFunction, ...args);
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources5(env_1);
      }
    }
    /**
     * Runs the given function on an array of elements matching the given selector
     * in the current element.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     * HTML:
     *
     * ```html
     * <div class="feed">
     *   <div class="tweet">Hello!</div>
     *   <div class="tweet">Hi!</div>
     * </div>
     * ```
     *
     * JavaScript:
     *
     * ```ts
     * const feedHandle = await page.$('.feed');
     * expect(
     *   await feedHandle.$$eval('.tweet', nodes => nodes.map(n => n.innerText)),
     * ).toEqual(['Hello!', 'Hi!']);
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param pageFunction - The function to be evaluated in the element's page's
     * context. An array of elements matching the given selector will be passed to
     * the function as its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $$eval(selector, pageFunction, ...args) {
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        pageFunction = withSourcePuppeteerURLIfNone(this.$$eval.name, pageFunction);
        const results = await this.$$(selector);
        const elements = __addDisposableResource5(env_2, await this.evaluateHandle((_, ...elements2) => {
          return elements2;
        }, ...results), false);
        const [result] = await Promise.all([
          elements.evaluate(pageFunction, ...args),
          ...results.map((results2) => {
            return results2.dispose();
          })
        ]);
        return result;
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources5(env_2);
      }
    }
    /**
     * Wait for an element matching the given selector to appear in the current
     * element.
     *
     * Unlike {@link Frame.waitForSelector}, this method does not work across
     * navigations or if the element is detached from DOM.
     *
     * @example
     *
     * ```ts
     * import puppeteer from 'puppeteer';
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .mainFrame()
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - The selector to query and wait for.
     * @param options - Options for customizing waiting behavior.
     * @returns An element matching the given selector.
     * @throws Throws if an element matching the given selector doesn't appear.
     */
    async waitForSelector(selector, options = {}) {
      const { updatedSelector, QueryHandler: QueryHandler2, polling } = getQueryHandlerAndSelector(selector);
      return await QueryHandler2.waitFor(this, updatedSelector, {
        polling,
        ...options
      });
    }
    async #checkVisibility(visibility) {
      return await this.evaluate(async (element, PuppeteerUtil, visibility2) => {
        return Boolean(PuppeteerUtil.checkVisibility(element, visibility2));
      }, LazyArg.create((context2) => {
        return context2.puppeteerUtil;
      }), visibility);
    }
    /**
     * An element is considered to be visible if all of the following is
     * true:
     *
     * - the element has
     *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle | computed styles}.
     *
     * - the element has a non-empty
     *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | bounding client rect}.
     *
     * - the element's {@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility | visibility}
     *   is not `hidden` or `collapse`.
     */
    async isVisible() {
      return await this.#checkVisibility(true);
    }
    /**
     * An element is considered to be hidden if at least one of the following is true:
     *
     * - the element has no
     *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle | computed styles}.
     *
     * - the element has an empty
     *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | bounding client rect}.
     *
     * - the element's {@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility | visibility}
     *   is `hidden` or `collapse`.
     */
    async isHidden() {
      return await this.#checkVisibility(false);
    }
    /**
     * Converts the current handle to the given element type.
     *
     * @example
     *
     * ```ts
     * const element: ElementHandle<Element> = await page.$(
     *   '.class-name-of-anchor',
     * );
     * // DO NOT DISPOSE `element`, this will be always be the same handle.
     * const anchor: ElementHandle<HTMLAnchorElement> =
     *   await element.toElement('a');
     * ```
     *
     * @param tagName - The tag name of the desired element type.
     * @throws An error if the handle does not match. **The handle will not be
     * automatically disposed.**
     */
    async toElement(tagName) {
      const isMatchingTagName = await this.evaluate((node, tagName2) => {
        return node.nodeName === tagName2.toUpperCase();
      }, tagName);
      if (!isMatchingTagName) {
        throw new Error(`Element is not a(n) \`${tagName}\` element`);
      }
      return this;
    }
    /**
     * Returns the middle point within an element unless a specific offset is provided.
     */
    async clickablePoint(offset) {
      const box = await this.#clickableBox();
      if (!box) {
        throw new Error("Node is either not clickable or not an Element");
      }
      if (offset !== void 0) {
        return {
          x: box.x + offset.x,
          y: box.y + offset.y
        };
      }
      return {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2
      };
    }
    /**
     * This method scrolls element into view if needed, and then
     * uses {@link Page.mouse} to hover over the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async hover() {
      await this.scrollIntoViewIfNeeded();
      const { x, y } = await this.clickablePoint();
      await this.frame.page().mouse.move(x, y);
    }
    /**
     * This method scrolls element into view if needed, and then
     * uses {@link Page.mouse} to click in the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async click(options = {}) {
      await this.scrollIntoViewIfNeeded();
      const { x, y } = await this.clickablePoint(options.offset);
      await this.frame.page().mouse.click(x, y, options);
    }
    /**
     * Drags an element over the given element or point.
     *
     * @returns DEPRECATED. When drag interception is enabled, the drag payload is
     * returned.
     */
    async drag(target) {
      await this.scrollIntoViewIfNeeded();
      const page = this.frame.page();
      if (page.isDragInterceptionEnabled()) {
        const source2 = await this.clickablePoint();
        if (target instanceof ElementHandle2) {
          target = await target.clickablePoint();
        }
        return await page.mouse.drag(source2, target);
      }
      try {
        if (!page._isDragging) {
          page._isDragging = true;
          await this.hover();
          await page.mouse.down();
        }
        if (target instanceof ElementHandle2) {
          await target.hover();
        } else {
          await page.mouse.move(target.x, target.y);
        }
      } catch (error) {
        page._isDragging = false;
        throw error;
      }
    }
    /**
     * @deprecated Do not use. `dragenter` will automatically be performed during dragging.
     */
    async dragEnter(data = { items: [], dragOperationsMask: 1 }) {
      const page = this.frame.page();
      await this.scrollIntoViewIfNeeded();
      const target = await this.clickablePoint();
      await page.mouse.dragEnter(target, data);
    }
    /**
     * @deprecated Do not use. `dragover` will automatically be performed during dragging.
     */
    async dragOver(data = { items: [], dragOperationsMask: 1 }) {
      const page = this.frame.page();
      await this.scrollIntoViewIfNeeded();
      const target = await this.clickablePoint();
      await page.mouse.dragOver(target, data);
    }
    /**
     * @internal
     */
    async drop(dataOrElement = {
      items: [],
      dragOperationsMask: 1
    }) {
      const page = this.frame.page();
      if ("items" in dataOrElement) {
        await this.scrollIntoViewIfNeeded();
        const destination = await this.clickablePoint();
        await page.mouse.drop(destination, dataOrElement);
      } else {
        await dataOrElement.drag(this);
        page._isDragging = false;
        await page.mouse.up();
      }
    }
    /**
     * @deprecated Use `ElementHandle.drop` instead.
     */
    async dragAndDrop(target, options) {
      const page = this.frame.page();
      assert(page.isDragInterceptionEnabled(), "Drag Interception is not enabled!");
      await this.scrollIntoViewIfNeeded();
      const startPoint = await this.clickablePoint();
      const targetPoint = await target.clickablePoint();
      await page.mouse.dragAndDrop(startPoint, targetPoint, options);
    }
    /**
     * Triggers a `change` and `input` event once all the provided options have been
     * selected. If there's no `<select>` element matching `selector`, the method
     * throws an error.
     *
     * @example
     *
     * ```ts
     * handle.select('blue'); // single selection
     * handle.select('red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param values - Values of options to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first
     * one is taken into account.
     */
    async select(...values) {
      for (const value of values) {
        assert(isString(value), 'Values must be strings. Found value "' + value + '" of type "' + typeof value + '"');
      }
      return await this.evaluate((element, vals) => {
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
    /**
     * This method scrolls element into view if needed, and then uses
     * {@link Touchscreen.tap} to tap in the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async tap() {
      await this.scrollIntoViewIfNeeded();
      const { x, y } = await this.clickablePoint();
      await this.frame.page().touchscreen.tap(x, y);
    }
    /**
     * This method scrolls the element into view if needed, and then
     * starts a touch in the center of the element.
     * @returns A {@link TouchHandle} representing the touch that was started
     */
    async touchStart() {
      await this.scrollIntoViewIfNeeded();
      const { x, y } = await this.clickablePoint();
      return await this.frame.page().touchscreen.touchStart(x, y);
    }
    /**
     * This method scrolls the element into view if needed, and then
     * moves the touch to the center of the element.
     * @param touch - An optional {@link TouchHandle}. If provided, this touch
     * will be moved. If not provided, the first active touch will be moved.
     */
    async touchMove(touch) {
      await this.scrollIntoViewIfNeeded();
      const { x, y } = await this.clickablePoint();
      if (touch) {
        return await touch.move(x, y);
      }
      await this.frame.page().touchscreen.touchMove(x, y);
    }
    async touchEnd() {
      await this.scrollIntoViewIfNeeded();
      await this.frame.page().touchscreen.touchEnd();
    }
    /**
     * Calls {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus | focus} on the element.
     */
    async focus() {
      await this.evaluate((element) => {
        if (!(element instanceof HTMLElement)) {
          throw new Error("Cannot focus non-HTMLElement");
        }
        return element.focus();
      });
    }
    /**
     * Focuses the element, and then sends a `keydown`, `keypress`/`input`, and
     * `keyup` event for each character in the text.
     *
     * To press a special key, like `Control` or `ArrowDown`,
     * use {@link ElementHandle.press}.
     *
     * @example
     *
     * ```ts
     * await elementHandle.type('Hello'); // Types instantly
     * await elementHandle.type('World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @example
     * An example of typing into a text field and then submitting the form:
     *
     * ```ts
     * const elementHandle = await page.$('input');
     * await elementHandle.type('some text');
     * await elementHandle.press('Enter');
     * ```
     *
     * @param options - Delay in milliseconds. Defaults to 0.
     */
    async type(text, options) {
      await this.focus();
      await this.frame.page().keyboard.type(text, options);
    }
    /**
     * Focuses the element, and then uses {@link Keyboard.down} and {@link Keyboard.up}.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also be generated.
     * The `text` option can be specified to force an input event to be generated.
     *
     * **NOTE** Modifier keys DO affect `elementHandle.press`. Holding down `Shift`
     * will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     */
    async press(key, options) {
      await this.focus();
      await this.frame.page().keyboard.press(key, options);
    }
    async #clickableBox() {
      const boxes = await this.evaluate((element) => {
        if (!(element instanceof Element)) {
          return null;
        }
        return [...element.getClientRects()].map((rect) => {
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        });
      });
      if (!boxes?.length) {
        return null;
      }
      await this.#intersectBoundingBoxesWithFrame(boxes);
      let frame = this.frame;
      let parentFrame;
      while (parentFrame = frame?.parentFrame()) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
          const handle = __addDisposableResource5(env_3, await frame.frameElement(), false);
          if (!handle) {
            throw new Error("Unsupported frame type");
          }
          const parentBox = await handle.evaluate((element) => {
            if (element.getClientRects().length === 0) {
              return null;
            }
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            return {
              left: rect.left + parseInt(style.paddingLeft, 10) + parseInt(style.borderLeftWidth, 10),
              top: rect.top + parseInt(style.paddingTop, 10) + parseInt(style.borderTopWidth, 10)
            };
          });
          if (!parentBox) {
            return null;
          }
          for (const box2 of boxes) {
            box2.x += parentBox.left;
            box2.y += parentBox.top;
          }
          await handle.#intersectBoundingBoxesWithFrame(boxes);
          frame = parentFrame;
        } catch (e_3) {
          env_3.error = e_3;
          env_3.hasError = true;
        } finally {
          __disposeResources5(env_3);
        }
      }
      const box = boxes.find((box2) => {
        return box2.width >= 1 && box2.height >= 1;
      });
      if (!box) {
        return null;
      }
      return {
        x: box.x,
        y: box.y,
        height: box.height,
        width: box.width
      };
    }
    async #intersectBoundingBoxesWithFrame(boxes) {
      const { documentWidth, documentHeight } = await this.frame.isolatedRealm().evaluate(() => {
        return {
          documentWidth: document.documentElement.clientWidth,
          documentHeight: document.documentElement.clientHeight
        };
      });
      for (const box of boxes) {
        intersectBoundingBox(box, documentWidth, documentHeight);
      }
    }
    /**
     * This method returns the bounding box of the element (relative to the main frame),
     * or `null` if the element is {@link https://drafts.csswg.org/css-display-4/#box-generation | not part of the layout}
     * (example: `display: none`).
     */
    async boundingBox() {
      const box = await this.evaluate((element) => {
        if (!(element instanceof Element)) {
          return null;
        }
        if (element.getClientRects().length === 0) {
          return null;
        }
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      });
      if (!box) {
        return null;
      }
      const offset = await this.#getTopLeftCornerOfFrame();
      if (!offset) {
        return null;
      }
      return {
        x: box.x + offset.x,
        y: box.y + offset.y,
        height: box.height,
        width: box.width
      };
    }
    /**
     * This method returns boxes of the element,
     * or `null` if the element is {@link https://drafts.csswg.org/css-display-4/#box-generation | not part of the layout}
     * (example: `display: none`).
     *
     * @remarks
     *
     * Boxes are represented as an array of points;
     * Each Point is an object `{x, y}`. Box points are sorted clock-wise.
     */
    async boxModel() {
      const model = await this.evaluate((element) => {
        if (!(element instanceof Element)) {
          return null;
        }
        if (element.getClientRects().length === 0) {
          return null;
        }
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const offsets = {
          padding: {
            left: parseInt(style.paddingLeft, 10),
            top: parseInt(style.paddingTop, 10),
            right: parseInt(style.paddingRight, 10),
            bottom: parseInt(style.paddingBottom, 10)
          },
          margin: {
            left: -parseInt(style.marginLeft, 10),
            top: -parseInt(style.marginTop, 10),
            right: -parseInt(style.marginRight, 10),
            bottom: -parseInt(style.marginBottom, 10)
          },
          border: {
            left: parseInt(style.borderLeft, 10),
            top: parseInt(style.borderTop, 10),
            right: parseInt(style.borderRight, 10),
            bottom: parseInt(style.borderBottom, 10)
          }
        };
        const border = [
          { x: rect.left, y: rect.top },
          { x: rect.left + rect.width, y: rect.top },
          { x: rect.left + rect.width, y: rect.top + rect.height },
          { x: rect.left, y: rect.top + rect.height }
        ];
        const padding = transformQuadWithOffsets(border, offsets.border);
        const content = transformQuadWithOffsets(padding, offsets.padding);
        const margin = transformQuadWithOffsets(border, offsets.margin);
        return {
          content,
          padding,
          border,
          margin,
          width: rect.width,
          height: rect.height
        };
        function transformQuadWithOffsets(quad, offsets2) {
          return [
            {
              x: quad[0].x + offsets2.left,
              y: quad[0].y + offsets2.top
            },
            {
              x: quad[1].x - offsets2.right,
              y: quad[1].y + offsets2.top
            },
            {
              x: quad[2].x - offsets2.right,
              y: quad[2].y - offsets2.bottom
            },
            {
              x: quad[3].x + offsets2.left,
              y: quad[3].y - offsets2.bottom
            }
          ];
        }
      });
      if (!model) {
        return null;
      }
      const offset = await this.#getTopLeftCornerOfFrame();
      if (!offset) {
        return null;
      }
      for (const attribute of [
        "content",
        "padding",
        "border",
        "margin"
      ]) {
        for (const point of model[attribute]) {
          point.x += offset.x;
          point.y += offset.y;
        }
      }
      return model;
    }
    async #getTopLeftCornerOfFrame() {
      const point = { x: 0, y: 0 };
      let frame = this.frame;
      let parentFrame;
      while (parentFrame = frame?.parentFrame()) {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
          const handle = __addDisposableResource5(env_4, await frame.frameElement(), false);
          if (!handle) {
            throw new Error("Unsupported frame type");
          }
          const parentBox = await handle.evaluate((element) => {
            if (element.getClientRects().length === 0) {
              return null;
            }
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            return {
              left: rect.left + parseInt(style.paddingLeft, 10) + parseInt(style.borderLeftWidth, 10),
              top: rect.top + parseInt(style.paddingTop, 10) + parseInt(style.borderTopWidth, 10)
            };
          });
          if (!parentBox) {
            return null;
          }
          point.x += parentBox.left;
          point.y += parentBox.top;
          frame = parentFrame;
        } catch (e_4) {
          env_4.error = e_4;
          env_4.hasError = true;
        } finally {
          __disposeResources5(env_4);
        }
      }
      return point;
    }
    async screenshot(options = {}) {
      const { scrollIntoView = true, clip } = options;
      const page = this.frame.page();
      if (scrollIntoView) {
        await this.scrollIntoViewIfNeeded();
      }
      const elementClip = await this.#nonEmptyVisibleBoundingBox();
      const [pageLeft, pageTop] = await this.evaluate(() => {
        if (!window.visualViewport) {
          throw new Error("window.visualViewport is not supported.");
        }
        return [
          window.visualViewport.pageLeft,
          window.visualViewport.pageTop
        ];
      });
      elementClip.x += pageLeft;
      elementClip.y += pageTop;
      if (clip) {
        elementClip.x += clip.x;
        elementClip.y += clip.y;
        elementClip.height = clip.height;
        elementClip.width = clip.width;
      }
      return await page.screenshot({ ...options, clip: elementClip });
    }
    async #nonEmptyVisibleBoundingBox() {
      const box = await this.boundingBox();
      assert(box, "Node is either not visible or not an HTMLElement");
      assert(box.width !== 0, "Node has 0 width.");
      assert(box.height !== 0, "Node has 0 height.");
      return box;
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
     * @internal
     */
    async scrollIntoViewIfNeeded() {
      if (await this.isIntersectingViewport({
        threshold: 1
      })) {
        return;
      }
      await this.scrollIntoView();
    }
    /**
     * Resolves to true if the element is visible in the current viewport. If an
     * element is an SVG, we check if the svg owner element is in the viewport
     * instead. See https://crbug.com/963246.
     *
     * @param options - Threshold for the intersection between 0 (no intersection) and 1
     * (full intersection). Defaults to 1.
     */
    async isIntersectingViewport(options = {}) {
      const env_5 = { stack: [], error: void 0, hasError: false };
      try {
        await this.assertConnectedElement();
        const handle = await this.#asSVGElementHandle();
        const target = __addDisposableResource5(env_5, handle && await handle.#getOwnerSVGElement(), false);
        return await (target ?? this).evaluate(async (element, threshold) => {
          const visibleRatio = await new Promise((resolve) => {
            const observer = new IntersectionObserver((entries) => {
              resolve(entries[0].intersectionRatio);
              observer.disconnect();
            });
            observer.observe(element);
          });
          return threshold === 1 ? visibleRatio === 1 : visibleRatio > threshold;
        }, options.threshold ?? 0);
      } catch (e_5) {
        env_5.error = e_5;
        env_5.hasError = true;
      } finally {
        __disposeResources5(env_5);
      }
    }
    /**
     * Scrolls the element into view using either the automation protocol client
     * or by calling element.scrollIntoView.
     */
    async scrollIntoView() {
      await this.assertConnectedElement();
      await this.evaluate(async (element) => {
        element.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "instant"
        });
      });
    }
    /**
     * Returns true if an element is an SVGElement (included svg, path, rect
     * etc.).
     */
    async #asSVGElementHandle() {
      if (await this.evaluate((element) => {
        return element instanceof SVGElement;
      })) {
        return this;
      } else {
        return null;
      }
    }
    async #getOwnerSVGElement() {
      return await this.evaluateHandle((element) => {
        if (element instanceof SVGSVGElement) {
          return element;
        }
        return element.ownerSVGElement;
      });
    }
  };
})();
function intersectBoundingBox(box, width, height) {
  box.width = Math.max(box.x >= 0 ? Math.min(width - box.x, box.width) : Math.min(width, box.width + box.x), 0);
  box.height = Math.max(box.y >= 0 ? Math.min(height - box.y, box.height) : Math.min(height, box.height + box.y), 0);
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Frame.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/api/locators/locators.js
init_cjs_shim();
var __addDisposableResource6 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
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
var LocatorEvent;
(function(LocatorEvent2) {
  LocatorEvent2["Action"] = "action";
})(LocatorEvent || (LocatorEvent = {}));
var Locator = class extends EventEmitter {
  /**
   * Creates a race between multiple locators trying to locate elements in
   * parallel but ensures that only a single element receives the action.
   *
   * @public
   */
  static race(locators) {
    return RaceLocator.create(locators);
  }
  /**
   * @internal
   */
  visibility = null;
  /**
   * @internal
   */
  _timeout = 3e4;
  #ensureElementIsInTheViewport = true;
  #waitForEnabled = true;
  #waitForStableBoundingBox = true;
  /**
   * @internal
   */
  operators = {
    conditions: (conditions, signal) => {
      return mergeMap((handle) => {
        return merge(...conditions.map((condition) => {
          return condition(handle, signal);
        })).pipe(defaultIfEmpty(handle));
      });
    },
    retryAndRaceWithSignalAndTimer: (signal, cause) => {
      const candidates = [];
      if (signal) {
        candidates.push(fromAbortSignal(signal, cause));
      }
      candidates.push(timeout(this._timeout, cause));
      return pipe(retry({ delay: RETRY_DELAY }), raceWith(...candidates));
    }
  };
  // Determines when the locator will timeout for actions.
  get timeout() {
    return this._timeout;
  }
  /**
   * Creates a new locator instance by cloning the current locator and setting
   * the total timeout for the locator actions.
   *
   * Pass `0` to disable timeout.
   *
   * @defaultValue `Page.getDefaultTimeout()`
   */
  setTimeout(timeout2) {
    const locator = this._clone();
    locator._timeout = timeout2;
    return locator;
  }
  /**
   * Creates a new locator instance by cloning the current locator with the
   * visibility property changed to the specified value.
   */
  setVisibility(visibility) {
    const locator = this._clone();
    locator.visibility = visibility;
    return locator;
  }
  /**
   * Creates a new locator instance by cloning the current locator and
   * specifying whether to wait for input elements to become enabled before the
   * action. Applicable to `click` and `fill` actions.
   *
   * @defaultValue `true`
   */
  setWaitForEnabled(value) {
    const locator = this._clone();
    locator.#waitForEnabled = value;
    return locator;
  }
  /**
   * Creates a new locator instance by cloning the current locator and
   * specifying whether the locator should scroll the element into viewport if
   * it is not in the viewport already.
   *
   * @defaultValue `true`
   */
  setEnsureElementIsInTheViewport(value) {
    const locator = this._clone();
    locator.#ensureElementIsInTheViewport = value;
    return locator;
  }
  /**
   * Creates a new locator instance by cloning the current locator and
   * specifying whether the locator has to wait for the element's bounding box
   * to be same between two consecutive animation frames.
   *
   * @defaultValue `true`
   */
  setWaitForStableBoundingBox(value) {
    const locator = this._clone();
    locator.#waitForStableBoundingBox = value;
    return locator;
  }
  /**
   * @internal
   */
  copyOptions(locator) {
    this._timeout = locator._timeout;
    this.visibility = locator.visibility;
    this.#waitForEnabled = locator.#waitForEnabled;
    this.#ensureElementIsInTheViewport = locator.#ensureElementIsInTheViewport;
    this.#waitForStableBoundingBox = locator.#waitForStableBoundingBox;
    return this;
  }
  /**
   * If the element has a "disabled" property, wait for the element to be
   * enabled.
   */
  #waitForEnabledIfNeeded = (handle, signal) => {
    if (!this.#waitForEnabled) {
      return EMPTY;
    }
    return from(handle.frame.waitForFunction((element) => {
      if (!(element instanceof HTMLElement)) {
        return true;
      }
      const isNativeFormControl = [
        "BUTTON",
        "INPUT",
        "SELECT",
        "TEXTAREA",
        "OPTION",
        "OPTGROUP"
      ].includes(element.nodeName);
      return !isNativeFormControl || !element.hasAttribute("disabled");
    }, {
      timeout: this._timeout,
      signal
    }, handle)).pipe(ignoreElements());
  };
  /**
   * Compares the bounding box of the element for two consecutive animation
   * frames and waits till they are the same.
   */
  #waitForStableBoundingBoxIfNeeded = (handle) => {
    if (!this.#waitForStableBoundingBox) {
      return EMPTY;
    }
    return defer(() => {
      return from(handle.evaluate((element) => {
        return new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            const rect1 = element.getBoundingClientRect();
            window.requestAnimationFrame(() => {
              const rect2 = element.getBoundingClientRect();
              resolve([
                {
                  x: rect1.x,
                  y: rect1.y,
                  width: rect1.width,
                  height: rect1.height
                },
                {
                  x: rect2.x,
                  y: rect2.y,
                  width: rect2.width,
                  height: rect2.height
                }
              ]);
            });
          });
        });
      }));
    }).pipe(first(([rect1, rect2]) => {
      return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    }), retry({ delay: RETRY_DELAY }), ignoreElements());
  };
  /**
   * Checks if the element is in the viewport and auto-scrolls it if it is not.
   */
  #ensureElementIsInTheViewportIfNeeded = (handle) => {
    if (!this.#ensureElementIsInTheViewport) {
      return EMPTY;
    }
    return from(handle.isIntersectingViewport({ threshold: 0 })).pipe(filter((isIntersectingViewport) => {
      return !isIntersectingViewport;
    }), mergeMap(() => {
      return from(handle.scrollIntoView());
    }), mergeMap(() => {
      return defer(() => {
        return from(handle.isIntersectingViewport({ threshold: 0 }));
      }).pipe(first(identity), retry({ delay: RETRY_DELAY }), ignoreElements());
    }));
  };
  #click(options) {
    const signal = options?.signal;
    const cause = new Error("Locator.click");
    return this._wait(options).pipe(this.operators.conditions([
      this.#ensureElementIsInTheViewportIfNeeded,
      this.#waitForStableBoundingBoxIfNeeded,
      this.#waitForEnabledIfNeeded
    ], signal), tap(() => {
      return this.emit(LocatorEvent.Action, void 0);
    }), mergeMap((handle) => {
      return from(handle.click(options)).pipe(catchError((err) => {
        void handle.dispose().catch(debugError);
        throw err;
      }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
  }
  #fill(value, options) {
    const signal = options?.signal;
    const cause = new Error("Locator.fill");
    return this._wait(options).pipe(this.operators.conditions([
      this.#ensureElementIsInTheViewportIfNeeded,
      this.#waitForStableBoundingBoxIfNeeded,
      this.#waitForEnabledIfNeeded
    ], signal), tap(() => {
      return this.emit(LocatorEvent.Action, void 0);
    }), mergeMap((handle) => {
      return from(handle.evaluate((el) => {
        if (el instanceof HTMLSelectElement) {
          return "select";
        }
        if (el instanceof HTMLTextAreaElement) {
          return "typeable-input";
        }
        if (el instanceof HTMLInputElement) {
          if ((/* @__PURE__ */ new Set([
            "textarea",
            "text",
            "url",
            "tel",
            "search",
            "password",
            "number",
            "email"
          ])).has(el.type)) {
            return "typeable-input";
          } else {
            return "other-input";
          }
        }
        if (el.isContentEditable) {
          return "contenteditable";
        }
        return "unknown";
      })).pipe(mergeMap((inputType) => {
        switch (inputType) {
          case "select":
            return from(handle.select(value).then(noop));
          case "contenteditable":
          case "typeable-input":
            return from(handle.evaluate((input, newValue) => {
              const currentValue = input.isContentEditable ? input.innerText : input.value;
              if (newValue.length <= currentValue.length || !newValue.startsWith(input.value)) {
                if (input.isContentEditable) {
                  input.innerText = "";
                } else {
                  input.value = "";
                }
                return newValue;
              }
              const originalValue = input.isContentEditable ? input.innerText : input.value;
              if (input.isContentEditable) {
                input.innerText = "";
                input.innerText = originalValue;
              } else {
                input.value = "";
                input.value = originalValue;
              }
              return newValue.substring(originalValue.length);
            }, value)).pipe(mergeMap((textToType) => {
              return from(handle.type(textToType));
            }));
          case "other-input":
            return from(handle.focus()).pipe(mergeMap(() => {
              return from(handle.evaluate((input, value2) => {
                input.value = value2;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
              }, value));
            }));
          case "unknown":
            throw new Error(`Element cannot be filled out.`);
        }
      })).pipe(catchError((err) => {
        void handle.dispose().catch(debugError);
        throw err;
      }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
  }
  #hover(options) {
    const signal = options?.signal;
    const cause = new Error("Locator.hover");
    return this._wait(options).pipe(this.operators.conditions([
      this.#ensureElementIsInTheViewportIfNeeded,
      this.#waitForStableBoundingBoxIfNeeded
    ], signal), tap(() => {
      return this.emit(LocatorEvent.Action, void 0);
    }), mergeMap((handle) => {
      return from(handle.hover()).pipe(catchError((err) => {
        void handle.dispose().catch(debugError);
        throw err;
      }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
  }
  #scroll(options) {
    const signal = options?.signal;
    const cause = new Error("Locator.scroll");
    return this._wait(options).pipe(this.operators.conditions([
      this.#ensureElementIsInTheViewportIfNeeded,
      this.#waitForStableBoundingBoxIfNeeded
    ], signal), tap(() => {
      return this.emit(LocatorEvent.Action, void 0);
    }), mergeMap((handle) => {
      return from(handle.evaluate((el, scrollTop, scrollLeft) => {
        if (scrollTop !== void 0) {
          el.scrollTop = scrollTop;
        }
        if (scrollLeft !== void 0) {
          el.scrollLeft = scrollLeft;
        }
      }, options?.scrollTop, options?.scrollLeft)).pipe(catchError((err) => {
        void handle.dispose().catch(debugError);
        throw err;
      }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
  }
  /**
   * Clones the locator.
   */
  clone() {
    return this._clone();
  }
  /**
   * Waits for the locator to get a handle from the page.
   *
   * @public
   */
  async waitHandle(options) {
    const cause = new Error("Locator.waitHandle");
    return await firstValueFrom(this._wait(options).pipe(this.operators.retryAndRaceWithSignalAndTimer(options?.signal, cause)));
  }
  /**
   * Waits for the locator to get the serialized value from the page.
   *
   * Note this requires the value to be JSON-serializable.
   *
   * @public
   */
  async wait(options) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const handle = __addDisposableResource6(env_1, await this.waitHandle(options), false);
      return await handle.jsonValue();
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources6(env_1);
    }
  }
  /**
   * Maps the locator using the provided mapper.
   *
   * @public
   */
  map(mapper) {
    return new MappedLocator(this._clone(), (handle) => {
      return handle.evaluateHandle(mapper);
    });
  }
  /**
   * Creates an expectation that is evaluated against located values.
   *
   * If the expectations do not match, then the locator will retry.
   *
   * @public
   */
  filter(predicate) {
    return new FilteredLocator(this._clone(), async (handle, signal) => {
      await handle.frame.waitForFunction(predicate, { signal, timeout: this._timeout }, handle);
      return true;
    });
  }
  /**
   * Creates an expectation that is evaluated against located handles.
   *
   * If the expectations do not match, then the locator will retry.
   *
   * @internal
   */
  filterHandle(predicate) {
    return new FilteredLocator(this._clone(), predicate);
  }
  /**
   * Maps the locator using the provided mapper.
   *
   * @internal
   */
  mapHandle(mapper) {
    return new MappedLocator(this._clone(), mapper);
  }
  /**
   * Clicks the located element.
   */
  click(options) {
    return firstValueFrom(this.#click(options));
  }
  /**
   * Fills out the input identified by the locator using the provided value. The
   * type of the input is determined at runtime and the appropriate fill-out
   * method is chosen based on the type. `contenteditable`, select, textarea and
   * input elements are supported.
   */
  fill(value, options) {
    return firstValueFrom(this.#fill(value, options));
  }
  /**
   * Hovers over the located element.
   */
  hover(options) {
    return firstValueFrom(this.#hover(options));
  }
  /**
   * Scrolls the located element.
   */
  scroll(options) {
    return firstValueFrom(this.#scroll(options));
  }
};
var FunctionLocator = class extends Locator {
  static create(pageOrFrame, func) {
    return new FunctionLocator(pageOrFrame, func).setTimeout("getDefaultTimeout" in pageOrFrame ? pageOrFrame.getDefaultTimeout() : pageOrFrame.page().getDefaultTimeout());
  }
  #pageOrFrame;
  #func;
  constructor(pageOrFrame, func) {
    super();
    this.#pageOrFrame = pageOrFrame;
    this.#func = func;
  }
  _clone() {
    return new FunctionLocator(this.#pageOrFrame, this.#func);
  }
  _wait(options) {
    const signal = options?.signal;
    return defer(() => {
      return from(this.#pageOrFrame.waitForFunction(this.#func, {
        timeout: this.timeout,
        signal
      }));
    }).pipe(throwIfEmpty());
  }
};
var DelegatedLocator = class extends Locator {
  #delegate;
  constructor(delegate) {
    super();
    this.#delegate = delegate;
    this.copyOptions(this.#delegate);
  }
  get delegate() {
    return this.#delegate;
  }
  setTimeout(timeout2) {
    const locator = super.setTimeout(timeout2);
    locator.#delegate = this.#delegate.setTimeout(timeout2);
    return locator;
  }
  setVisibility(visibility) {
    const locator = super.setVisibility(visibility);
    locator.#delegate = locator.#delegate.setVisibility(visibility);
    return locator;
  }
  setWaitForEnabled(value) {
    const locator = super.setWaitForEnabled(value);
    locator.#delegate = this.#delegate.setWaitForEnabled(value);
    return locator;
  }
  setEnsureElementIsInTheViewport(value) {
    const locator = super.setEnsureElementIsInTheViewport(value);
    locator.#delegate = this.#delegate.setEnsureElementIsInTheViewport(value);
    return locator;
  }
  setWaitForStableBoundingBox(value) {
    const locator = super.setWaitForStableBoundingBox(value);
    locator.#delegate = this.#delegate.setWaitForStableBoundingBox(value);
    return locator;
  }
};
var FilteredLocator = class extends DelegatedLocator {
  #predicate;
  constructor(base, predicate) {
    super(base);
    this.#predicate = predicate;
  }
  _clone() {
    return new FilteredLocator(this.delegate.clone(), this.#predicate).copyOptions(this);
  }
  _wait(options) {
    return this.delegate._wait(options).pipe(mergeMap((handle) => {
      return from(Promise.resolve(this.#predicate(handle, options?.signal))).pipe(filter((value) => {
        return value;
      }), map(() => {
        return handle;
      }));
    }), throwIfEmpty());
  }
};
var MappedLocator = class extends DelegatedLocator {
  #mapper;
  constructor(base, mapper) {
    super(base);
    this.#mapper = mapper;
  }
  _clone() {
    return new MappedLocator(this.delegate.clone(), this.#mapper).copyOptions(this);
  }
  _wait(options) {
    return this.delegate._wait(options).pipe(mergeMap((handle) => {
      return from(Promise.resolve(this.#mapper(handle, options?.signal)));
    }));
  }
};
var NodeLocator = class extends Locator {
  static create(pageOrFrame, selector) {
    return new NodeLocator(pageOrFrame, selector).setTimeout("getDefaultTimeout" in pageOrFrame ? pageOrFrame.getDefaultTimeout() : pageOrFrame.page().getDefaultTimeout());
  }
  #pageOrFrame;
  #selector;
  constructor(pageOrFrame, selector) {
    super();
    this.#pageOrFrame = pageOrFrame;
    this.#selector = selector;
  }
  /**
   * Waits for the element to become visible or hidden. visibility === 'visible'
   * means that the element has a computed style, the visibility property other
   * than 'hidden' or 'collapse' and non-empty bounding box. visibility ===
   * 'hidden' means the opposite of that.
   */
  #waitForVisibilityIfNeeded = (handle) => {
    if (!this.visibility) {
      return EMPTY;
    }
    return (() => {
      switch (this.visibility) {
        case "hidden":
          return defer(() => {
            return from(handle.isHidden());
          });
        case "visible":
          return defer(() => {
            return from(handle.isVisible());
          });
      }
    })().pipe(first(identity), retry({ delay: RETRY_DELAY }), ignoreElements());
  };
  _clone() {
    return new NodeLocator(this.#pageOrFrame, this.#selector).copyOptions(this);
  }
  _wait(options) {
    const signal = options?.signal;
    return defer(() => {
      return from(this.#pageOrFrame.waitForSelector(this.#selector, {
        visible: false,
        timeout: this._timeout,
        signal
      }));
    }).pipe(filter((value) => {
      return value !== null;
    }), throwIfEmpty(), this.operators.conditions([this.#waitForVisibilityIfNeeded], signal));
  }
};
function checkLocatorArray(locators) {
  for (const locator of locators) {
    if (!(locator instanceof Locator)) {
      throw new Error("Unknown locator for race candidate");
    }
  }
  return locators;
}
var RaceLocator = class extends Locator {
  static create(locators) {
    const array = checkLocatorArray(locators);
    return new RaceLocator(array);
  }
  #locators;
  constructor(locators) {
    super();
    this.#locators = locators;
  }
  _clone() {
    return new RaceLocator(this.#locators.map((locator) => {
      return locator.clone();
    })).copyOptions(this);
  }
  _wait(options) {
    return race(...this.#locators.map((locator) => {
      return locator._wait(options);
    }));
  }
};
var RETRY_DELAY = 100;

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Frame.js
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
    var context2 = {};
    for (var p in contextIn)
      context2[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context2.access[p] = contextIn.access[p];
    context2.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context2);
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
var __addDisposableResource7 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources7 = function(SuppressedError2) {
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
var FrameEvent;
(function(FrameEvent2) {
  FrameEvent2.FrameNavigated = Symbol("Frame.FrameNavigated");
  FrameEvent2.FrameSwapped = Symbol("Frame.FrameSwapped");
  FrameEvent2.LifecycleEvent = Symbol("Frame.LifecycleEvent");
  FrameEvent2.FrameNavigatedWithinDocument = Symbol("Frame.FrameNavigatedWithinDocument");
  FrameEvent2.FrameDetached = Symbol("Frame.FrameDetached");
  FrameEvent2.FrameSwappedByActivation = Symbol("Frame.FrameSwappedByActivation");
})(FrameEvent || (FrameEvent = {}));
var throwIfDetached = throwIfDisposed((frame) => {
  return `Attempted to use detached Frame '${frame._id}'.`;
});
var Frame = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _frameElement_decorators;
  let _evaluateHandle_decorators;
  let _evaluate_decorators;
  let _locator_decorators;
  let _$_decorators;
  let _$$_decorators;
  let _$eval_decorators;
  let _$$eval_decorators;
  let _waitForSelector_decorators;
  let _waitForFunction_decorators;
  let _content_decorators;
  let _addScriptTag_decorators;
  let _addStyleTag_decorators;
  let _click_decorators;
  let _focus_decorators;
  let _hover_decorators;
  let _select_decorators;
  let _tap_decorators;
  let _type_decorators;
  let _title_decorators;
  return class Frame extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      _frameElement_decorators = [throwIfDetached];
      _evaluateHandle_decorators = [throwIfDetached];
      _evaluate_decorators = [throwIfDetached];
      _locator_decorators = [throwIfDetached];
      _$_decorators = [throwIfDetached];
      _$$_decorators = [throwIfDetached];
      _$eval_decorators = [throwIfDetached];
      _$$eval_decorators = [throwIfDetached];
      _waitForSelector_decorators = [throwIfDetached];
      _waitForFunction_decorators = [throwIfDetached];
      _content_decorators = [throwIfDetached];
      _addScriptTag_decorators = [throwIfDetached];
      _addStyleTag_decorators = [throwIfDetached];
      _click_decorators = [throwIfDetached];
      _focus_decorators = [throwIfDetached];
      _hover_decorators = [throwIfDetached];
      _select_decorators = [throwIfDetached];
      _tap_decorators = [throwIfDetached];
      _type_decorators = [throwIfDetached];
      _title_decorators = [throwIfDetached];
      __esDecorate3(this, null, _frameElement_decorators, { kind: "method", name: "frameElement", static: false, private: false, access: { has: (obj) => "frameElement" in obj, get: (obj) => obj.frameElement }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _evaluateHandle_decorators, { kind: "method", name: "evaluateHandle", static: false, private: false, access: { has: (obj) => "evaluateHandle" in obj, get: (obj) => obj.evaluateHandle }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _evaluate_decorators, { kind: "method", name: "evaluate", static: false, private: false, access: { has: (obj) => "evaluate" in obj, get: (obj) => obj.evaluate }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _locator_decorators, { kind: "method", name: "locator", static: false, private: false, access: { has: (obj) => "locator" in obj, get: (obj) => obj.locator }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _$_decorators, { kind: "method", name: "$", static: false, private: false, access: { has: (obj) => "$" in obj, get: (obj) => obj.$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _$$_decorators, { kind: "method", name: "$$", static: false, private: false, access: { has: (obj) => "$$" in obj, get: (obj) => obj.$$ }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _$eval_decorators, { kind: "method", name: "$eval", static: false, private: false, access: { has: (obj) => "$eval" in obj, get: (obj) => obj.$eval }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _$$eval_decorators, { kind: "method", name: "$$eval", static: false, private: false, access: { has: (obj) => "$$eval" in obj, get: (obj) => obj.$$eval }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _waitForSelector_decorators, { kind: "method", name: "waitForSelector", static: false, private: false, access: { has: (obj) => "waitForSelector" in obj, get: (obj) => obj.waitForSelector }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _waitForFunction_decorators, { kind: "method", name: "waitForFunction", static: false, private: false, access: { has: (obj) => "waitForFunction" in obj, get: (obj) => obj.waitForFunction }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _content_decorators, { kind: "method", name: "content", static: false, private: false, access: { has: (obj) => "content" in obj, get: (obj) => obj.content }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _addScriptTag_decorators, { kind: "method", name: "addScriptTag", static: false, private: false, access: { has: (obj) => "addScriptTag" in obj, get: (obj) => obj.addScriptTag }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _addStyleTag_decorators, { kind: "method", name: "addStyleTag", static: false, private: false, access: { has: (obj) => "addStyleTag" in obj, get: (obj) => obj.addStyleTag }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _click_decorators, { kind: "method", name: "click", static: false, private: false, access: { has: (obj) => "click" in obj, get: (obj) => obj.click }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _focus_decorators, { kind: "method", name: "focus", static: false, private: false, access: { has: (obj) => "focus" in obj, get: (obj) => obj.focus }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _hover_decorators, { kind: "method", name: "hover", static: false, private: false, access: { has: (obj) => "hover" in obj, get: (obj) => obj.hover }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _select_decorators, { kind: "method", name: "select", static: false, private: false, access: { has: (obj) => "select" in obj, get: (obj) => obj.select }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _tap_decorators, { kind: "method", name: "tap", static: false, private: false, access: { has: (obj) => "tap" in obj, get: (obj) => obj.tap }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _type_decorators, { kind: "method", name: "type", static: false, private: false, access: { has: (obj) => "type" in obj, get: (obj) => obj.type }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate3(this, null, _title_decorators, { kind: "method", name: "title", static: false, private: false, access: { has: (obj) => "title" in obj, get: (obj) => obj.title }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    /**
     * @internal
     */
    _id = __runInitializers3(this, _instanceExtraInitializers);
    /**
     * @internal
     */
    _parentId;
    /**
     * @internal
     */
    _name;
    /**
     * @internal
     */
    _hasStartedLoading = false;
    /**
     * @internal
     */
    constructor() {
      super();
    }
    #_document;
    /**
     * @internal
     */
    #document() {
      if (!this.#_document) {
        this.#_document = this.mainRealm().evaluateHandle(() => {
          return document;
        });
      }
      return this.#_document;
    }
    /**
     * Used to clear the document handle that has been destroyed.
     *
     * @internal
     */
    clearDocumentHandle() {
      this.#_document = void 0;
    }
    /**
     * @returns The frame element associated with this frame (if any).
     */
    async frameElement() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const parentFrame = this.parentFrame();
        if (!parentFrame) {
          return null;
        }
        const list = __addDisposableResource7(env_1, await parentFrame.isolatedRealm().evaluateHandle(() => {
          return document.querySelectorAll("iframe,frame");
        }), false);
        for await (const iframe_1 of transposeIterableHandle(list)) {
          const env_2 = { stack: [], error: void 0, hasError: false };
          try {
            const iframe = __addDisposableResource7(env_2, iframe_1, false);
            const frame = await iframe.contentFrame();
            if (frame?._id === this._id) {
              return await parentFrame.mainRealm().adoptHandle(iframe);
            }
          } catch (e_1) {
            env_2.error = e_1;
            env_2.hasError = true;
          } finally {
            __disposeResources7(env_2);
          }
        }
        return null;
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        __disposeResources7(env_1);
      }
    }
    /**
     * Behaves identically to {@link Page.evaluateHandle} except it's run within
     * the context of this frame.
     *
     * See {@link Page.evaluateHandle} for details.
     */
    async evaluateHandle(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluateHandle.name, pageFunction);
      return await this.mainRealm().evaluateHandle(pageFunction, ...args);
    }
    /**
     * Behaves identically to {@link Page.evaluate} except it's run within
     * the context of this frame.
     *
     * See {@link Page.evaluate} for details.
     */
    async evaluate(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluate.name, pageFunction);
      return await this.mainRealm().evaluate(pageFunction, ...args);
    }
    /**
     * @internal
     */
    locator(selectorOrFunc) {
      if (typeof selectorOrFunc === "string") {
        return NodeLocator.create(this, selectorOrFunc);
      } else {
        return FunctionLocator.create(this, selectorOrFunc);
      }
    }
    /**
     * Queries the frame for an element matching the given selector.
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     *
     * @returns A {@link ElementHandle | element handle} to the first element
     * matching the given selector. Otherwise, `null`.
     */
    async $(selector) {
      const document2 = await this.#document();
      return await document2.$(selector);
    }
    /**
     * Queries the frame for all elements matching the given selector.
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     *
     * @returns An array of {@link ElementHandle | element handles} that point to
     * elements matching the given selector.
     */
    async $$(selector, options) {
      const document2 = await this.#document();
      return await document2.$$(selector, options);
    }
    /**
     * Runs the given function on the first element matching the given selector in
     * the frame.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const searchValue = await frame.$eval('#search', el => el.value);
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param pageFunction - The function to be evaluated in the frame's context.
     * The first element matching the selector will be passed to the function as
     * its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $eval(selector, pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.$eval.name, pageFunction);
      const document2 = await this.#document();
      return await document2.$eval(selector, pageFunction, ...args);
    }
    /**
     * Runs the given function on an array of elements matching the given selector
     * in the frame.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const divsCounts = await frame.$$eval('div', divs => divs.length);
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param pageFunction - The function to be evaluated in the frame's context.
     * An array of elements matching the given selector will be passed to the
     * function as its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $$eval(selector, pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.$$eval.name, pageFunction);
      const document2 = await this.#document();
      return await document2.$$eval(selector, pageFunction, ...args);
    }
    /**
     * Waits for an element matching the given selector to appear in the frame.
     *
     * This method works across navigations.
     *
     * @example
     *
     * ```ts
     * import puppeteer from 'puppeteer';
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .mainFrame()
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - The selector to query and wait for.
     * @param options - Options for customizing waiting behavior.
     * @returns An element matching the given selector.
     * @throws Throws if an element matching the given selector doesn't appear.
     */
    async waitForSelector(selector, options = {}) {
      const { updatedSelector, QueryHandler: QueryHandler2, polling } = getQueryHandlerAndSelector(selector);
      return await QueryHandler2.waitFor(this, updatedSelector, {
        polling,
        ...options
      });
    }
    /**
     * @example
     * The `waitForFunction` can be used to observe viewport size change:
     *
     * ```ts
     * import puppeteer from 'puppeteer';
     *
     * (async () => {
     * .  const browser = await puppeteer.launch();
     * .  const page = await browser.newPage();
     * .  const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
     * .  page.setViewport({width: 50, height: 50});
     * .  await watchDog;
     * .  await browser.close();
     * })();
     * ```
     *
     * To pass arguments from Node.js to the predicate of `page.waitForFunction` function:
     *
     * ```ts
     * const selector = '.foo';
     * await frame.waitForFunction(
     *   selector => !!document.querySelector(selector),
     *   {}, // empty options object
     *   selector,
     * );
     * ```
     *
     * @param pageFunction - the function to evaluate in the frame context.
     * @param options - options to configure the polling method and timeout.
     * @param args - arguments to pass to the `pageFunction`.
     * @returns the promise which resolve when the `pageFunction` returns a truthy value.
     */
    async waitForFunction(pageFunction, options = {}, ...args) {
      return await this.mainRealm().waitForFunction(pageFunction, options, ...args);
    }
    /**
     * The full HTML contents of the frame, including the DOCTYPE.
     */
    async content() {
      return await this.evaluate(() => {
        let content = "";
        for (const node of document.childNodes) {
          switch (node) {
            case document.documentElement:
              content += document.documentElement.outerHTML;
              break;
            default:
              content += new XMLSerializer().serializeToString(node);
              break;
          }
        }
        return content;
      });
    }
    /**
     * @internal
     */
    async setFrameContent(content) {
      return await this.evaluate((html) => {
        document.open();
        document.write(html);
        document.close();
      }, content);
    }
    /**
     * The frame's `name` attribute as specified in the tag.
     *
     * @remarks
     * If the name is empty, it returns the `id` attribute instead.
     *
     * @remarks
     * This value is calculated once when the frame is created, and will not
     * update if the attribute is changed later.
     *
     * @deprecated Use
     *
     * ```ts
     * const element = await frame.frameElement();
     * const nameOrId = await element.evaluate(frame => frame.name ?? frame.id);
     * ```
     */
    name() {
      return this._name || "";
    }
    /**
     * Is`true` if the frame has been detached. Otherwise, `false`.
     *
     * @deprecated Use the `detached` getter.
     */
    isDetached() {
      return this.detached;
    }
    /**
     * @internal
     */
    get disposed() {
      return this.detached;
    }
    /**
     * Adds a `<script>` tag into the page with the desired url or content.
     *
     * @param options - Options for the script.
     * @returns An {@link ElementHandle | element handle} to the injected
     * `<script>` element.
     */
    async addScriptTag(options) {
      let { content = "", type } = options;
      const { path } = options;
      if (+!!options.url + +!!path + +!!content !== 1) {
        throw new Error("Exactly one of `url`, `path`, or `content` must be specified.");
      }
      if (path) {
        content = await environment.value.fs.promises.readFile(path, "utf8");
        content += `//# sourceURL=${path.replace(/\n/g, "")}`;
      }
      type = type ?? "text/javascript";
      return await this.mainRealm().transferHandle(await this.isolatedRealm().evaluateHandle(async ({ url, id, type: type2, content: content2 }) => {
        return await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.type = type2;
          script.text = content2;
          script.addEventListener("error", (event) => {
            reject(new Error(event.message ?? "Could not load script"));
          }, { once: true });
          if (id) {
            script.id = id;
          }
          if (url) {
            script.src = url;
            script.addEventListener("load", () => {
              resolve(script);
            }, { once: true });
            document.head.appendChild(script);
          } else {
            document.head.appendChild(script);
            resolve(script);
          }
        });
      }, { ...options, type, content }));
    }
    /**
     * @internal
     */
    async addStyleTag(options) {
      let { content = "" } = options;
      const { path } = options;
      if (+!!options.url + +!!path + +!!content !== 1) {
        throw new Error("Exactly one of `url`, `path`, or `content` must be specified.");
      }
      if (path) {
        content = await environment.value.fs.promises.readFile(path, "utf8");
        content += "/*# sourceURL=" + path.replace(/\n/g, "") + "*/";
        options.content = content;
      }
      return await this.mainRealm().transferHandle(await this.isolatedRealm().evaluateHandle(async ({ url, content: content2 }) => {
        return await new Promise((resolve, reject) => {
          let element;
          if (!url) {
            element = document.createElement("style");
            element.appendChild(document.createTextNode(content2));
          } else {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            element = link;
          }
          element.addEventListener("load", () => {
            resolve(element);
          }, { once: true });
          element.addEventListener("error", (event) => {
            reject(new Error(event.message ?? "Could not load style"));
          }, { once: true });
          document.head.appendChild(element);
          return element;
        });
      }, options));
    }
    /**
     * Clicks the first element found that matches `selector`.
     *
     * @remarks
     * If `click()` triggers a navigation event and there's a separate
     * `page.waitForNavigation()` promise to be resolved, you may end up with a
     * race condition that yields unexpected results. The correct pattern for
     * click and wait for navigation is the following:
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(waitOptions),
     *   frame.click(selector, clickOptions),
     * ]);
     * ```
     *
     * @param selector - The selector to query for.
     */
    async click(selector, options = {}) {
      const env_3 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource7(env_3, await this.$(selector), false);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.click(options);
        await handle.dispose();
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        __disposeResources7(env_3);
      }
    }
    /**
     * Focuses the first element that matches the `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async focus(selector) {
      const env_4 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource7(env_4, await this.$(selector), false);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.focus();
      } catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
      } finally {
        __disposeResources7(env_4);
      }
    }
    /**
     * Hovers the pointer over the center of the first element that matches the
     * `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async hover(selector) {
      const env_5 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource7(env_5, await this.$(selector), false);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.hover();
      } catch (e_5) {
        env_5.error = e_5;
        env_5.hasError = true;
      } finally {
        __disposeResources7(env_5);
      }
    }
    /**
     * Selects a set of value on the first `<select>` element that matches the
     * `selector`.
     *
     * @example
     *
     * ```ts
     * frame.select('select#colors', 'blue'); // single selection
     * frame.select('select#colors', 'red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param selector - The selector to query for.
     * @param values - The array of values to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first
     * one is taken into account.
     * @returns the list of values that were successfully selected.
     * @throws Throws if there's no `<select>` matching `selector`.
     */
    async select(selector, ...values) {
      const env_6 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource7(env_6, await this.$(selector), false);
        assert(handle, `No element found for selector: ${selector}`);
        return await handle.select(...values);
      } catch (e_6) {
        env_6.error = e_6;
        env_6.hasError = true;
      } finally {
        __disposeResources7(env_6);
      }
    }
    /**
     * Taps the first element that matches the `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async tap(selector) {
      const env_7 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource7(env_7, await this.$(selector), false);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.tap();
      } catch (e_7) {
        env_7.error = e_7;
        env_7.hasError = true;
      } finally {
        __disposeResources7(env_7);
      }
    }
    /**
     * Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character
     * in the text.
     *
     * @remarks
     * To press a special key, like `Control` or `ArrowDown`, use
     * {@link Keyboard.press}.
     *
     * @example
     *
     * ```ts
     * await frame.type('#mytextarea', 'Hello'); // Types instantly
     * await frame.type('#mytextarea', 'World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @param selector - the selector for the element to type into. If there are
     * multiple the first will be used.
     * @param text - text to type into the element
     * @param options - takes one option, `delay`, which sets the time to wait
     * between key presses in milliseconds. Defaults to `0`.
     */
    async type(selector, text, options) {
      const env_8 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource7(env_8, await this.$(selector), false);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.type(text, options);
      } catch (e_8) {
        env_8.error = e_8;
        env_8.hasError = true;
      } finally {
        __disposeResources7(env_8);
      }
    }
    /**
     * The frame's title.
     */
    async title() {
      return await this.isolatedRealm().evaluate(() => {
        return document.title;
      });
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/api/HTTPRequest.js
init_cjs_shim();
var HTTPRequest = class {
  /**
   * @internal
   */
  _interceptionId;
  /**
   * @internal
   */
  _failureText = null;
  /**
   * @internal
   */
  _response = null;
  /**
   * @internal
   */
  _fromMemoryCache = false;
  /**
   * @internal
   */
  _redirectChain = [];
  /**
   * @internal
   */
  interception = {
    enabled: false,
    handled: false,
    handlers: [],
    resolutionState: {
      action: InterceptResolutionAction.None
    },
    requestOverrides: {},
    response: null,
    abortReason: null
  };
  /**
   * @internal
   */
  constructor() {
  }
  /**
   * The `ContinueRequestOverrides` that will be used
   * if the interception is allowed to continue (ie, `abort()` and
   * `respond()` aren't called).
   */
  continueRequestOverrides() {
    assert(this.interception.enabled, "Request Interception is not enabled!");
    return this.interception.requestOverrides;
  }
  /**
   * The `ResponseForRequest` that gets used if the
   * interception is allowed to respond (ie, `abort()` is not called).
   */
  responseForRequest() {
    assert(this.interception.enabled, "Request Interception is not enabled!");
    return this.interception.response;
  }
  /**
   * The most recent reason for aborting the request
   */
  abortErrorReason() {
    assert(this.interception.enabled, "Request Interception is not enabled!");
    return this.interception.abortReason;
  }
  /**
   * An InterceptResolutionState object describing the current resolution
   * action and priority.
   *
   * InterceptResolutionState contains:
   * action: InterceptResolutionAction
   * priority?: number
   *
   * InterceptResolutionAction is one of: `abort`, `respond`, `continue`,
   * `disabled`, `none`, or `already-handled`.
   */
  interceptResolutionState() {
    if (!this.interception.enabled) {
      return { action: InterceptResolutionAction.Disabled };
    }
    if (this.interception.handled) {
      return { action: InterceptResolutionAction.AlreadyHandled };
    }
    return { ...this.interception.resolutionState };
  }
  /**
   * Is `true` if the intercept resolution has already been handled,
   * `false` otherwise.
   */
  isInterceptResolutionHandled() {
    return this.interception.handled;
  }
  /**
   * Adds an async request handler to the processing queue.
   * Deferred handlers are not guaranteed to execute in any particular order,
   * but they are guaranteed to resolve before the request interception
   * is finalized.
   */
  enqueueInterceptAction(pendingHandler) {
    this.interception.handlers.push(pendingHandler);
  }
  /**
   * Awaits pending interception handlers and then decides how to fulfill
   * the request interception.
   */
  async finalizeInterceptions() {
    await this.interception.handlers.reduce((promiseChain, interceptAction) => {
      return promiseChain.then(interceptAction);
    }, Promise.resolve());
    this.interception.handlers = [];
    const { action } = this.interceptResolutionState();
    switch (action) {
      case "abort":
        return await this._abort(this.interception.abortReason);
      case "respond":
        if (this.interception.response === null) {
          throw new Error("Response is missing for the interception");
        }
        return await this._respond(this.interception.response);
      case "continue":
        return await this._continue(this.interception.requestOverrides);
    }
  }
  #canBeIntercepted() {
    return !this.url().startsWith("data:") && !this._fromMemoryCache;
  }
  /**
   * Continues request with optional request overrides.
   *
   * @example
   *
   * ```ts
   * await page.setRequestInterception(true);
   * page.on('request', request => {
   *   // Override headers
   *   const headers = Object.assign({}, request.headers(), {
   *     foo: 'bar', // set "foo" header
   *     origin: undefined, // remove "origin" header
   *   });
   *   request.continue({headers});
   * });
   * ```
   *
   * @param overrides - optional overrides to apply to the request.
   * @param priority - If provided, intercept is resolved using cooperative
   * handling rules. Otherwise, intercept is resolved immediately.
   *
   * @remarks
   *
   * To use this, request interception should be enabled with
   * {@link Page.setRequestInterception}.
   *
   * Exception is immediately thrown if the request interception is not enabled.
   */
  async continue(overrides = {}, priority) {
    if (!this.#canBeIntercepted()) {
      return;
    }
    assert(this.interception.enabled, "Request Interception is not enabled!");
    assert(!this.interception.handled, "Request is already handled!");
    if (priority === void 0) {
      return await this._continue(overrides);
    }
    this.interception.requestOverrides = overrides;
    if (this.interception.resolutionState.priority === void 0 || priority > this.interception.resolutionState.priority) {
      this.interception.resolutionState = {
        action: InterceptResolutionAction.Continue,
        priority
      };
      return;
    }
    if (priority === this.interception.resolutionState.priority) {
      if (this.interception.resolutionState.action === "abort" || this.interception.resolutionState.action === "respond") {
        return;
      }
      this.interception.resolutionState.action = InterceptResolutionAction.Continue;
    }
    return;
  }
  /**
   * Fulfills a request with the given response.
   *
   * @example
   * An example of fulfilling all requests with 404 responses:
   *
   * ```ts
   * await page.setRequestInterception(true);
   * page.on('request', request => {
   *   request.respond({
   *     status: 404,
   *     contentType: 'text/plain',
   *     body: 'Not Found!',
   *   });
   * });
   * ```
   *
   * NOTE: Mocking responses for dataURL requests is not supported.
   * Calling `request.respond` for a dataURL request is a noop.
   *
   * @param response - the response to fulfill the request with.
   * @param priority - If provided, intercept is resolved using
   * cooperative handling rules. Otherwise, intercept is resolved
   * immediately.
   *
   * @remarks
   *
   * To use this, request
   * interception should be enabled with {@link Page.setRequestInterception}.
   *
   * Exception is immediately thrown if the request interception is not enabled.
   */
  async respond(response, priority) {
    if (!this.#canBeIntercepted()) {
      return;
    }
    assert(this.interception.enabled, "Request Interception is not enabled!");
    assert(!this.interception.handled, "Request is already handled!");
    if (priority === void 0) {
      return await this._respond(response);
    }
    this.interception.response = response;
    if (this.interception.resolutionState.priority === void 0 || priority > this.interception.resolutionState.priority) {
      this.interception.resolutionState = {
        action: InterceptResolutionAction.Respond,
        priority
      };
      return;
    }
    if (priority === this.interception.resolutionState.priority) {
      if (this.interception.resolutionState.action === "abort") {
        return;
      }
      this.interception.resolutionState.action = InterceptResolutionAction.Respond;
    }
  }
  /**
   * Aborts a request.
   *
   * @param errorCode - optional error code to provide.
   * @param priority - If provided, intercept is resolved using
   * cooperative handling rules. Otherwise, intercept is resolved
   * immediately.
   *
   * @remarks
   *
   * To use this, request interception should be enabled with
   * {@link Page.setRequestInterception}. If it is not enabled, this method will
   * throw an exception immediately.
   */
  async abort(errorCode = "failed", priority) {
    if (!this.#canBeIntercepted()) {
      return;
    }
    const errorReason = errorReasons[errorCode];
    assert(errorReason, "Unknown error code: " + errorCode);
    assert(this.interception.enabled, "Request Interception is not enabled!");
    assert(!this.interception.handled, "Request is already handled!");
    if (priority === void 0) {
      return await this._abort(errorReason);
    }
    this.interception.abortReason = errorReason;
    if (this.interception.resolutionState.priority === void 0 || priority >= this.interception.resolutionState.priority) {
      this.interception.resolutionState = {
        action: InterceptResolutionAction.Abort,
        priority
      };
      return;
    }
  }
  /**
   * @internal
   */
  static getResponse(body) {
    const byteBody = isString(body) ? new TextEncoder().encode(body) : body;
    return {
      contentLength: byteBody.byteLength,
      base64: typedArrayToBase64(byteBody)
    };
  }
};
var InterceptResolutionAction;
(function(InterceptResolutionAction2) {
  InterceptResolutionAction2["Abort"] = "abort";
  InterceptResolutionAction2["Respond"] = "respond";
  InterceptResolutionAction2["Continue"] = "continue";
  InterceptResolutionAction2["Disabled"] = "disabled";
  InterceptResolutionAction2["None"] = "none";
  InterceptResolutionAction2["AlreadyHandled"] = "already-handled";
})(InterceptResolutionAction || (InterceptResolutionAction = {}));
function headersArray(headers) {
  const result = [];
  for (const name in headers) {
    const value = headers[name];
    if (!Object.is(value, void 0)) {
      const values = Array.isArray(value) ? value : [value];
      result.push(...values.map((value2) => {
        return { name, value: value2 + "" };
      }));
    }
  }
  return result;
}
var STATUS_TEXTS = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "306": "Switch Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Too Early",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "510": "Not Extended",
  "511": "Network Authentication Required"
};
var errorReasons = {
  aborted: "Aborted",
  accessdenied: "AccessDenied",
  addressunreachable: "AddressUnreachable",
  blockedbyclient: "BlockedByClient",
  blockedbyresponse: "BlockedByResponse",
  connectionaborted: "ConnectionAborted",
  connectionclosed: "ConnectionClosed",
  connectionfailed: "ConnectionFailed",
  connectionrefused: "ConnectionRefused",
  connectionreset: "ConnectionReset",
  internetdisconnected: "InternetDisconnected",
  namenotresolved: "NameNotResolved",
  timedout: "TimedOut",
  failed: "Failed"
};
function handleError(error) {
  if (error.originalMessage.includes("Invalid header") || error.originalMessage.includes('Expected "header"') || // WebDriver BiDi error for invalid values, for example, headers.
  error.originalMessage.includes("invalid argument")) {
    throw error;
  }
  debugError(error);
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/HTTPResponse.js
init_cjs_shim();
var HTTPResponse = class {
  /**
   * @internal
   */
  constructor() {
  }
  /**
   * True if the response was successful (status in the range 200-299).
   */
  ok() {
    const status = this.status();
    return status === 0 || status >= 200 && status <= 299;
  }
  /**
   * {@inheritDoc HTTPResponse.content}
   */
  async buffer() {
    const content = await this.content();
    return Buffer.from(content);
  }
  /**
   * Promise which resolves to a text (utf8) representation of response body.
   */
  async text() {
    const content = await this.content();
    return new TextDecoder().decode(content);
  }
  /**
   * Promise which resolves to a JSON representation of response body.
   *
   * @remarks
   *
   * This method will throw if the response body is not parsable via
   * `JSON.parse`.
   */
  async json() {
    const content = await this.text();
    return JSON.parse(content);
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Input.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/util/incremental-id-generator.js
init_cjs_shim();
function createIncrementalIdGenerator() {
  let id = 0;
  return () => {
    return ++id;
  };
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Input.js
var Keyboard = class {
  /**
   * @internal
   */
  constructor() {
  }
};
var MouseButton = Object.freeze({
  Left: "left",
  Right: "right",
  Middle: "middle",
  Back: "back",
  Forward: "forward"
});
var Mouse = class {
  /**
   * @internal
   */
  constructor() {
  }
};
var Touchscreen = class {
  /**
   * @internal
   */
  idGenerator = createIncrementalIdGenerator();
  /**
   * @internal
   */
  touches = [];
  /**
   * @internal
   */
  constructor() {
  }
  /**
   * @internal
   */
  removeHandle(handle) {
    const index = this.touches.indexOf(handle);
    if (index === -1) {
      return;
    }
    this.touches.splice(index, 1);
  }
  /**
   * Dispatches a `touchstart` and `touchend` event.
   * @param x - Horizontal position of the tap.
   * @param y - Vertical position of the tap.
   */
  async tap(x, y) {
    const touch = await this.touchStart(x, y);
    await touch.end();
  }
  /**
   * Dispatches a `touchMove` event on the first touch that is active.
   * @param x - Horizontal position of the move.
   * @param y - Vertical position of the move.
   *
   * @remarks
   *
   * Not every `touchMove` call results in a `touchmove` event being emitted,
   * depending on the browser's optimizations. For example, Chrome
   * {@link https://developer.chrome.com/blog/a-more-compatible-smoother-touch/#chromes-new-model-the-throttled-async-touchmove-model | throttles}
   * touch move events.
   */
  async touchMove(x, y) {
    const touch = this.touches[0];
    if (!touch) {
      throw new TouchError("Must start a new Touch first");
    }
    return await touch.move(x, y);
  }
  /**
   * Dispatches a `touchend` event on the first touch that is active.
   */
  async touchEnd() {
    const touch = this.touches.shift();
    if (!touch) {
      throw new TouchError("Must start a new Touch first");
    }
    await touch.end();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Page.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/TimeoutSettings.js
init_cjs_shim();
var DEFAULT_TIMEOUT = 3e4;
var TimeoutSettings = class {
  #defaultTimeout;
  #defaultNavigationTimeout;
  constructor() {
    this.#defaultTimeout = null;
    this.#defaultNavigationTimeout = null;
  }
  setDefaultTimeout(timeout2) {
    this.#defaultTimeout = timeout2;
  }
  setDefaultNavigationTimeout(timeout2) {
    this.#defaultNavigationTimeout = timeout2;
  }
  navigationTimeout() {
    if (this.#defaultNavigationTimeout !== null) {
      return this.#defaultNavigationTimeout;
    }
    if (this.#defaultTimeout !== null) {
      return this.#defaultTimeout;
    }
    return DEFAULT_TIMEOUT;
  }
  timeout() {
    if (this.#defaultTimeout !== null) {
      return this.#defaultTimeout;
    }
    return DEFAULT_TIMEOUT;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Page.js
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
    var context2 = {};
    for (var p in contextIn)
      context2[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context2.access[p] = contextIn.access[p];
    context2.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context2);
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
var __addDisposableResource8 = function(env, value, async2) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose, inner;
    if (async2) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async2)
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
    env.stack.push({ value, dispose, async: async2 });
  } else if (async2) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources8 = function(SuppressedError2) {
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
function setDefaultScreenshotOptions(options) {
  options.optimizeForSpeed ??= false;
  options.type ??= "png";
  options.fromSurface ??= true;
  options.fullPage ??= false;
  options.omitBackground ??= false;
  options.encoding ??= "binary";
  options.captureBeyondViewport ??= true;
}
var Page = (() => {
  let _classSuper = EventEmitter;
  let _instanceExtraInitializers = [];
  let _screenshot_decorators;
  return class Page extends _classSuper {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
      __esDecorate4(this, null, _screenshot_decorators, { kind: "method", name: "screenshot", static: false, private: false, access: { has: (obj) => "screenshot" in obj, get: (obj) => obj.screenshot }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    /**
     * @internal
     */
    _isDragging = (__runInitializers4(this, _instanceExtraInitializers), false);
    /**
     * @internal
     */
    _timeoutSettings = new TimeoutSettings();
    #requestHandlers = /* @__PURE__ */ new WeakMap();
    #inflight$ = new ReplaySubject(1);
    /**
     * @internal
     */
    constructor() {
      super();
      fromEmitterEvent(
        this,
        "request"
        /* PageEvent.Request */
      ).pipe(mergeMap((originalRequest) => {
        return concat(of(1), merge(fromEmitterEvent(
          this,
          "requestfailed"
          /* PageEvent.RequestFailed */
        ), fromEmitterEvent(
          this,
          "requestfinished"
          /* PageEvent.RequestFinished */
        ), fromEmitterEvent(
          this,
          "response"
          /* PageEvent.Response */
        ).pipe(map((response) => {
          return response.request();
        }))).pipe(filter((request) => {
          return request.id === originalRequest.id;
        }), take(1), map(() => {
          return -1;
        })));
      }), mergeScan((acc, addend) => {
        return of(acc + addend);
      }, 0), takeUntil(fromEmitterEvent(
        this,
        "close"
        /* PageEvent.Close */
      )), startWith(0)).subscribe(this.#inflight$);
    }
    /**
     * Listen to page events.
     *
     * @remarks
     * This method exists to define event typings and handle proper wireup of
     * cooperative request interception. Actual event listening and dispatching is
     * delegated to {@link EventEmitter}.
     *
     * @internal
     */
    on(type, handler) {
      if (type !== "request") {
        return super.on(type, handler);
      }
      let wrapper = this.#requestHandlers.get(handler);
      if (wrapper === void 0) {
        wrapper = (event) => {
          event.enqueueInterceptAction(() => {
            return handler(event);
          });
        };
        this.#requestHandlers.set(handler, wrapper);
      }
      return super.on(type, wrapper);
    }
    /**
     * @internal
     */
    off(type, handler) {
      if (type === "request") {
        handler = this.#requestHandlers.get(handler) || handler;
      }
      return super.off(type, handler);
    }
    /**
     * {@inheritDoc Accessibility}
     */
    get accessibility() {
      return this.mainFrame().accessibility;
    }
    locator(selectorOrFunc) {
      if (typeof selectorOrFunc === "string") {
        return NodeLocator.create(this, selectorOrFunc);
      } else {
        return FunctionLocator.create(this, selectorOrFunc);
      }
    }
    /**
     * A shortcut for {@link Locator.race} that does not require static imports.
     *
     * @internal
     */
    locatorRace(locators) {
      return Locator.race(locators);
    }
    /**
     * Finds the first element that matches the selector. If no element matches
     * the selector, the return value resolves to `null`.
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     *
     * @remarks
     *
     * Shortcut for {@link Frame.$ | Page.mainFrame().$(selector) }.
     */
    async $(selector) {
      return await this.mainFrame().$(selector);
    }
    /**
     * Finds elements on the page that match the selector. If no elements
     * match the selector, the return value resolves to `[]`.
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     *
     * @remarks
     *
     * Shortcut for {@link Frame.$$ | Page.mainFrame().$$(selector) }.
     */
    async $$(selector, options) {
      return await this.mainFrame().$$(selector, options);
    }
    /**
     * @remarks
     *
     * The only difference between {@link Page.evaluate | page.evaluate} and
     * `page.evaluateHandle` is that `evaluateHandle` will return the value
     * wrapped in an in-page object.
     *
     * If the function passed to `page.evaluateHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     *
     * ```ts
     * const aHandle = await page.evaluateHandle('document');
     * ```
     *
     * @example
     * {@link JSHandle} instances can be passed as arguments to the `pageFunction`:
     *
     * ```ts
     * const aHandle = await page.evaluateHandle(() => document.body);
     * const resultHandle = await page.evaluateHandle(
     *   body => body.innerHTML,
     *   aHandle,
     * );
     * console.log(await resultHandle.jsonValue());
     * await resultHandle.dispose();
     * ```
     *
     * Most of the time this function returns a {@link JSHandle},
     * but if `pageFunction` returns a reference to an element,
     * you instead get an {@link ElementHandle} back:
     *
     * @example
     *
     * ```ts
     * const button = await page.evaluateHandle(() =>
     *   document.querySelector('button'),
     * );
     * // can call `click` because `button` is an `ElementHandle`
     * await button.click();
     * ```
     *
     * The TypeScript definitions assume that `evaluateHandle` returns
     * a `JSHandle`, but if you know it's going to return an
     * `ElementHandle`, pass it as the generic argument:
     *
     * ```ts
     * const button = await page.evaluateHandle<ElementHandle>(...);
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     */
    async evaluateHandle(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluateHandle.name, pageFunction);
      return await this.mainFrame().evaluateHandle(pageFunction, ...args);
    }
    /**
     * This method finds the first element within the page that matches the selector
     * and passes the result as the first argument to the `pageFunction`.
     *
     * @remarks
     *
     * If no element is found matching `selector`, the method will throw an error.
     *
     * If `pageFunction` returns a promise `$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```ts
     * const searchValue = await page.$eval('#search', el => el.value);
     * const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
     * const html = await page.$eval('.main-container', el => el.outerHTML);
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```ts
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * const searchValue = await page.$eval(
     *   '#search',
     *   (el: HTMLInputElement) => el.value,
     * );
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$eval`:
     *
     * @example
     *
     * ```ts
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const searchValue = await page.$eval<string>(
     *   '#search',
     *   (el: HTMLInputElement) => el.value,
     * );
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed the result of the element matching the selector as its
     * first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    async $eval(selector, pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.$eval.name, pageFunction);
      return await this.mainFrame().$eval(selector, pageFunction, ...args);
    }
    /**
     * This method returns all elements matching the selector and passes the
     * resulting array as the first argument to the `pageFunction`.
     *
     * @remarks
     * If `pageFunction` returns a promise `$$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```ts
     * // get the amount of divs on the page
     * const divCount = await page.$$eval('div', divs => divs.length);
     *
     * // get the text content of all the `.options` elements:
     * const options = await page.$$eval('div > span.options', options => {
     *   return options.map(option => option.textContent);
     * });
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element[]`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```ts
     * await page.$$eval('input', elements => {
     *   return elements.map(e => e.value);
     * });
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$$eval`:
     *
     * @example
     *
     * ```ts
     * const allInputValues = await page.$$eval('input', elements =>
     *   elements.map(e => e.textContent),
     * );
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed an array of matching elements as its first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    async $$eval(selector, pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.$$eval.name, pageFunction);
      return await this.mainFrame().$$eval(selector, pageFunction, ...args);
    }
    /**
     * Adds a `<script>` tag into the page with the desired URL or content.
     *
     * @remarks
     * Shortcut for
     * {@link Frame.addScriptTag | page.mainFrame().addScriptTag(options)}.
     *
     * @param options - Options for the script.
     * @returns An {@link ElementHandle | element handle} to the injected
     * `<script>` element.
     */
    async addScriptTag(options) {
      return await this.mainFrame().addScriptTag(options);
    }
    async addStyleTag(options) {
      return await this.mainFrame().addStyleTag(options);
    }
    /**
     * The page's URL.
     *
     * @remarks
     *
     * Shortcut for {@link Frame.url | page.mainFrame().url()}.
     */
    url() {
      return this.mainFrame().url();
    }
    /**
     * The full HTML contents of the page, including the DOCTYPE.
     */
    async content() {
      return await this.mainFrame().content();
    }
    /**
     * Set the content of the page.
     *
     * @param html - HTML markup to assign to the page.
     * @param options - Parameters that has some properties.
     */
    async setContent(html, options) {
      await this.mainFrame().setContent(html, options);
    }
    /**
     * {@inheritDoc Frame.goto}
     */
    async goto(url, options) {
      return await this.mainFrame().goto(url, options);
    }
    /**
     * Waits for the page to navigate to a new URL or to reload. It is useful when
     * you run code that will indirectly cause the page to navigate.
     *
     * @example
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(), // The promise resolves after navigation has finished
     *   page.click('a.my-link'), // Clicking the link will indirectly cause a navigation
     * ]);
     * ```
     *
     * @remarks
     *
     * Usage of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
     * to change the URL is considered a navigation.
     *
     * @param options - Navigation parameters which might have the following
     * properties:
     * @returns A `Promise` which resolves to the main resource response.
     *
     * - In case of multiple redirects, the navigation will resolve with the
     *   response of the last redirect.
     * - In case of navigation to a different anchor or navigation due to History
     *   API usage, the navigation will resolve with `null`.
     */
    async waitForNavigation(options = {}) {
      return await this.mainFrame().waitForNavigation(options);
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched request
     * @example
     *
     * ```ts
     * const firstRequest = await page.waitForRequest(
     *   'https://example.com/resource',
     * );
     * const finalRequest = await page.waitForRequest(
     *   request => request.url() === 'https://example.com',
     * );
     * return finalRequest.response()?.ok();
     * ```
     *
     * @remarks
     * Optional Waiting Parameters have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds, pass
     *   `0` to disable the timeout. The default value can be changed by using the
     *   {@link Page.setDefaultTimeout} method.
     */
    waitForRequest(urlOrPredicate, options = {}) {
      const { timeout: ms = this._timeoutSettings.timeout(), signal } = options;
      if (typeof urlOrPredicate === "string") {
        const url = urlOrPredicate;
        urlOrPredicate = (request) => {
          return request.url() === url;
        };
      }
      const observable$ = fromEmitterEvent(
        this,
        "request"
        /* PageEvent.Request */
      ).pipe(filterAsync(urlOrPredicate), raceWith(timeout(ms), fromAbortSignal(signal), fromEmitterEvent(
        this,
        "close"
        /* PageEvent.Close */
      ).pipe(map(() => {
        throw new TargetCloseError("Page closed!");
      }))));
      return firstValueFrom(observable$);
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for.
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched response.
     * @example
     *
     * ```ts
     * const firstResponse = await page.waitForResponse(
     *   'https://example.com/resource',
     * );
     * const finalResponse = await page.waitForResponse(
     *   response =>
     *     response.url() === 'https://example.com' && response.status() === 200,
     * );
     * const finalResponse = await page.waitForResponse(async response => {
     *   return (await response.text()).includes('<html>');
     * });
     * return finalResponse.ok();
     * ```
     *
     * @remarks
     * Optional Parameter have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds,
     *   pass `0` to disable the timeout. The default value can be changed by using
     *   the {@link Page.setDefaultTimeout} method.
     */
    waitForResponse(urlOrPredicate, options = {}) {
      const { timeout: ms = this._timeoutSettings.timeout(), signal } = options;
      if (typeof urlOrPredicate === "string") {
        const url = urlOrPredicate;
        urlOrPredicate = (response) => {
          return response.url() === url;
        };
      }
      const observable$ = fromEmitterEvent(
        this,
        "response"
        /* PageEvent.Response */
      ).pipe(filterAsync(urlOrPredicate), raceWith(timeout(ms), fromAbortSignal(signal), fromEmitterEvent(
        this,
        "close"
        /* PageEvent.Close */
      ).pipe(map(() => {
        throw new TargetCloseError("Page closed!");
      }))));
      return firstValueFrom(observable$);
    }
    /**
     * Waits for the network to be idle.
     *
     * @param options - Options to configure waiting behavior.
     * @returns A promise which resolves once the network is idle.
     */
    waitForNetworkIdle(options = {}) {
      return firstValueFrom(this.waitForNetworkIdle$(options));
    }
    /**
     * @internal
     */
    waitForNetworkIdle$(options = {}) {
      const { timeout: ms = this._timeoutSettings.timeout(), idleTime = NETWORK_IDLE_TIME, concurrency = 0, signal } = options;
      return this.#inflight$.pipe(switchMap((inflight) => {
        if (inflight > concurrency) {
          return EMPTY;
        }
        return timer(idleTime);
      }), map(() => {
      }), raceWith(timeout(ms), fromAbortSignal(signal), fromEmitterEvent(
        this,
        "close"
        /* PageEvent.Close */
      ).pipe(map(() => {
        throw new TargetCloseError("Page closed!");
      }))));
    }
    /**
     * Waits for a frame matching the given conditions to appear.
     *
     * @example
     *
     * ```ts
     * const frame = await page.waitForFrame(async frame => {
     *   return frame.name() === 'Test';
     * });
     * ```
     */
    async waitForFrame(urlOrPredicate, options = {}) {
      const { timeout: ms = this.getDefaultTimeout(), signal } = options;
      const predicate = isString(urlOrPredicate) ? (frame) => {
        return urlOrPredicate === frame.url();
      } : urlOrPredicate;
      return await firstValueFrom(merge(fromEmitterEvent(
        this,
        "frameattached"
        /* PageEvent.FrameAttached */
      ), fromEmitterEvent(
        this,
        "framenavigated"
        /* PageEvent.FrameNavigated */
      ), from(this.frames())).pipe(filterAsync(predicate), first(), raceWith(timeout(ms), fromAbortSignal(signal), fromEmitterEvent(
        this,
        "close"
        /* PageEvent.Close */
      ).pipe(map(() => {
        throw new TargetCloseError("Page closed.");
      })))));
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
     * This method will resize the page. A lot of websites don't expect phones to
     * change size, so you should emulate before navigating to the page.
     *
     * @example
     *
     * ```ts
     * import {KnownDevices} from 'puppeteer';
     * const iPhone = KnownDevices['iPhone 15 Pro'];
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
    /**
     * Evaluates a function in the page's context and returns the result.
     *
     * If the function passed to `page.evaluate` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * @example
     *
     * ```ts
     * const result = await frame.evaluate(() => {
     *   return Promise.resolve(8 * 7);
     * });
     * console.log(result); // prints "56"
     * ```
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     *
     * ```ts
     * const aHandle = await page.evaluate('1 + 2');
     * ```
     *
     * To get the best TypeScript experience, you should pass in as the
     * generic the type of `pageFunction`:
     *
     * ```ts
     * const aHandle = await page.evaluate(() => 2);
     * ```
     *
     * @example
     *
     * {@link ElementHandle} instances (including {@link JSHandle}s) can be passed
     * as arguments to the `pageFunction`:
     *
     * ```ts
     * const bodyHandle = await page.$('body');
     * const html = await page.evaluate(body => body.innerHTML, bodyHandle);
     * await bodyHandle.dispose();
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     *
     * @returns the return value of `pageFunction`.
     */
    async evaluate(pageFunction, ...args) {
      pageFunction = withSourcePuppeteerURLIfNone(this.evaluate.name, pageFunction);
      return await this.mainFrame().evaluate(pageFunction, ...args);
    }
    /**
     * @internal
     */
    async _maybeWriteTypedArrayToFile(path, typedArray) {
      if (!path) {
        return;
      }
      await environment.value.fs.promises.writeFile(path, typedArray);
    }
    /**
     * Captures a screencast of this {@link Page | page}.
     *
     * @example
     * Recording a {@link Page | page}:
     *
     * ```
     * import puppeteer from 'puppeteer';
     *
     * // Launch a browser
     * const browser = await puppeteer.launch();
     *
     * // Create a new page
     * const page = await browser.newPage();
     *
     * // Go to your site.
     * await page.goto("https://www.example.com");
     *
     * // Start recording.
     * const recorder = await page.screencast({path: 'recording.webm'});
     *
     * // Do something.
     *
     * // Stop recording.
     * await recorder.stop();
     *
     * browser.close();
     * ```
     *
     * @param options - Configures screencast behavior.
     *
     * @experimental
     *
     * @remarks
     *
     * All recordings will be {@link https://www.webmproject.org/ | WebM} format using
     * the {@link https://www.webmproject.org/vp9/ | VP9} video codec. The FPS is 30.
     *
     * You must have {@link https://ffmpeg.org/ | ffmpeg} installed on your system.
     */
    async screencast(options = {}) {
      const ScreenRecorder = environment.value.ScreenRecorder;
      const [width, height, devicePixelRatio] = await this.#getNativePixelDimensions();
      let crop;
      if (options.crop) {
        const { x, y, width: cropWidth, height: cropHeight } = roundRectangle(normalizeRectangle(options.crop));
        if (x < 0 || y < 0) {
          throw new Error(`\`crop.x\` and \`crop.y\` must be greater than or equal to 0.`);
        }
        if (cropWidth <= 0 || cropHeight <= 0) {
          throw new Error(`\`crop.height\` and \`crop.width\` must be greater than or equal to 0.`);
        }
        const viewportWidth = width / devicePixelRatio;
        const viewportHeight = height / devicePixelRatio;
        if (x + cropWidth > viewportWidth) {
          throw new Error(`\`crop.width\` cannot be larger than the viewport width (${viewportWidth}).`);
        }
        if (y + cropHeight > viewportHeight) {
          throw new Error(`\`crop.height\` cannot be larger than the viewport height (${viewportHeight}).`);
        }
        crop = {
          x: x * devicePixelRatio,
          y: y * devicePixelRatio,
          width: cropWidth * devicePixelRatio,
          height: cropHeight * devicePixelRatio
        };
      }
      if (options.speed !== void 0 && options.speed <= 0) {
        throw new Error(`\`speed\` must be greater than 0.`);
      }
      if (options.scale !== void 0 && options.scale <= 0) {
        throw new Error(`\`scale\` must be greater than 0.`);
      }
      const recorder = new ScreenRecorder(this, width, height, {
        ...options,
        path: options.ffmpegPath,
        crop
      });
      try {
        await this._startScreencast();
      } catch (error) {
        void recorder.stop();
        throw error;
      }
      if (options.path) {
        const { createWriteStream } = environment.value.fs;
        const stream = createWriteStream(options.path, "binary");
        recorder.pipe(stream);
      }
      return recorder;
    }
    #screencastSessionCount = 0;
    #startScreencastPromise;
    /**
     * @internal
     */
    async _startScreencast() {
      ++this.#screencastSessionCount;
      if (!this.#startScreencastPromise) {
        this.#startScreencastPromise = this.mainFrame().client.send("Page.startScreencast", { format: "png" }).then(() => {
          return new Promise((resolve) => {
            return this.mainFrame().client.once("Page.screencastFrame", () => {
              return resolve();
            });
          });
        });
      }
      await this.#startScreencastPromise;
    }
    /**
     * @internal
     */
    async _stopScreencast() {
      --this.#screencastSessionCount;
      if (!this.#startScreencastPromise) {
        return;
      }
      this.#startScreencastPromise = void 0;
      if (this.#screencastSessionCount === 0) {
        await this.mainFrame().client.send("Page.stopScreencast");
      }
    }
    /**
     * Gets the native, non-emulated dimensions of the viewport.
     */
    async #getNativePixelDimensions() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const viewport = this.viewport();
        const stack = __addDisposableResource8(env_1, new DisposableStack(), false);
        if (viewport && viewport.deviceScaleFactor !== 0) {
          await this.setViewport({ ...viewport, deviceScaleFactor: 0 });
          stack.defer(() => {
            void this.setViewport(viewport).catch(debugError);
          });
        }
        return await this.mainFrame().isolatedRealm().evaluate(() => {
          return [
            window.visualViewport.width * window.devicePixelRatio,
            window.visualViewport.height * window.devicePixelRatio,
            window.devicePixelRatio
          ];
        });
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources8(env_1);
      }
    }
    async screenshot(userOptions = {}) {
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const _guard = __addDisposableResource8(env_2, await this.browserContext().startScreenshot(), false);
        await this.bringToFront();
        const options = {
          ...userOptions,
          clip: userOptions.clip ? {
            ...userOptions.clip
          } : void 0
        };
        if (options.type === void 0 && options.path !== void 0) {
          const filePath = options.path;
          const extension = filePath.slice(filePath.lastIndexOf(".") + 1).toLowerCase();
          switch (extension) {
            case "png":
              options.type = "png";
              break;
            case "jpeg":
            case "jpg":
              options.type = "jpeg";
              break;
            case "webp":
              options.type = "webp";
              break;
          }
        }
        if (options.quality !== void 0) {
          if (options.quality < 0 || options.quality > 100) {
            throw new Error(`Expected 'quality' (${options.quality}) to be between 0 and 100, inclusive.`);
          }
          if (options.type === void 0 || !["jpeg", "webp"].includes(options.type)) {
            throw new Error(`${options.type ?? "png"} screenshots do not support 'quality'.`);
          }
        }
        if (options.clip) {
          if (options.clip.width <= 0) {
            throw new Error("'width' in 'clip' must be positive.");
          }
          if (options.clip.height <= 0) {
            throw new Error("'height' in 'clip' must be positive.");
          }
        }
        setDefaultScreenshotOptions(options);
        const stack = __addDisposableResource8(env_2, new AsyncDisposableStack(), true);
        if (options.clip) {
          if (options.fullPage) {
            throw new Error("'clip' and 'fullPage' are mutually exclusive");
          }
          options.clip = roundRectangle(normalizeRectangle(options.clip));
        } else {
          if (options.fullPage) {
            if (!options.captureBeyondViewport) {
              const scrollDimensions = await this.mainFrame().isolatedRealm().evaluate(() => {
                const element = document.documentElement;
                return {
                  width: element.scrollWidth,
                  height: element.scrollHeight
                };
              });
              const viewport = this.viewport();
              await this.setViewport({
                ...viewport,
                ...scrollDimensions
              });
              stack.defer(async () => {
                await this.setViewport(viewport).catch(debugError);
              });
            }
          } else {
            options.captureBeyondViewport = false;
          }
        }
        const data = await this._screenshot(options);
        if (options.encoding === "base64") {
          return data;
        }
        const typedArray = stringToTypedArray(data, true);
        await this._maybeWriteTypedArrayToFile(options.path, typedArray);
        return typedArray;
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        const result_1 = __disposeResources8(env_2);
        if (result_1)
          await result_1;
      }
    }
    /**
     * The page's title
     *
     * @remarks
     *
     * Shortcut for {@link Frame.title | page.mainFrame().title()}.
     */
    async title() {
      return await this.mainFrame().title();
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.mouse} to click in the center of the
     * element. If there's no element matching `selector`, the method throws an
     * error.
     *
     * @remarks
     *
     * Bear in mind that if `click()` triggers a navigation event and
     * there's a separate `page.waitForNavigation()` promise to be resolved, you
     * may end up with a race condition that yields unexpected results. The
     * correct pattern for click and wait for navigation is the following:
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(waitOptions),
     *   page.click(selector, clickOptions),
     * ]);
     * ```
     *
     * Shortcut for {@link Frame.click | page.mainFrame().click(selector[, options]) }.
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}. If there are
     * multiple elements satisfying the `selector`, the first will be clicked
     * @param options - `Object`
     * @returns Promise which resolves when the element matching `selector` is
     * successfully clicked. The Promise will be rejected if there is no element
     * matching `selector`.
     */
    click(selector, options) {
      return this.mainFrame().click(selector, options);
    }
    /**
     * This method fetches an element with `selector` and focuses it. If
     * there's no element matching `selector`, the method throws an error.
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * If there are multiple elements satisfying the selector, the first
     * will be focused.
     * @returns Promise which resolves when the element matching selector
     * is successfully focused. The promise will be rejected if there is
     * no element matching selector.
     *
     * @remarks
     *
     * Shortcut for
     * {@link Frame.focus | page.mainFrame().focus(selector)}.
     */
    focus(selector) {
      return this.mainFrame().focus(selector);
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.mouse}
     * to hover over the center of the element.
     * If there's no element matching `selector`, the method throws an error.
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}. If there are
     * multiple elements satisfying the `selector`, the first will be hovered.
     * @returns Promise which resolves when the element matching `selector` is
     * successfully hovered. Promise gets rejected if there's no element matching
     * `selector`.
     *
     * @remarks
     *
     * Shortcut for {@link Page.hover | page.mainFrame().hover(selector)}.
     */
    hover(selector) {
      return this.mainFrame().hover(selector);
    }
    /**
     * Triggers a `change` and `input` event once all the provided options have been
     * selected. If there's no `<select>` element matching `selector`, the method
     * throws an error.
     *
     * @example
     *
     * ```ts
     * page.select('select#colors', 'blue'); // single selection
     * page.select('select#colors', 'red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param values - Values of options to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first one
     * is taken into account.
     * @returns
     *
     * @remarks
     *
     * Shortcut for {@link Frame.select | page.mainFrame().select()}
     */
    select(selector, ...values) {
      return this.mainFrame().select(selector, ...values);
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.touchscreen}
     * to tap in the center of the element.
     * If there's no element matching `selector`, the method throws an error.
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}. If there are multiple elements satisfying the
     * selector, the first will be tapped.
     *
     * @remarks
     *
     * Shortcut for {@link Frame.tap | page.mainFrame().tap(selector)}.
     */
    tap(selector) {
      return this.mainFrame().tap(selector);
    }
    /**
     * Sends a `keydown`, `keypress/input`, and `keyup` event for each character
     * in the text.
     *
     * To press a special key, like `Control` or `ArrowDown`, use {@link Keyboard.press}.
     * @example
     *
     * ```ts
     * await page.type('#mytextarea', 'Hello');
     * // Types instantly
     * await page.type('#mytextarea', 'World', {delay: 100});
     * // Types slower, like a user
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param text - A text to type into a focused element.
     * @param options - have property `delay` which is the Time to wait between
     * key presses in milliseconds. Defaults to `0`.
     * @returns
     */
    type(selector, text, options) {
      return this.mainFrame().type(selector, text, options);
    }
    /**
     * Wait for the `selector` to appear in page. If at the moment of calling the
     * method the `selector` already exists, the method will return immediately. If
     * the `selector` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * @example
     * This method works across navigations:
     *
     * ```ts
     * import puppeteer from 'puppeteer';
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector -
     * {@link https://pptr.dev/guides/page-interactions#selectors | selector}
     * to query the page for.
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | CSS selectors}
     * can be passed as-is and a
     * {@link https://pptr.dev/guides/page-interactions#non-css-selectors | Puppeteer-specific selector syntax}
     * allows quering by
     * {@link https://pptr.dev/guides/page-interactions#text-selectors--p-text | text},
     * {@link https://pptr.dev/guides/page-interactions#aria-selectors--p-aria | a11y role and name},
     * and
     * {@link https://pptr.dev/guides/page-interactions#xpath-selectors--p-xpath | xpath}
     * and
     * {@link https://pptr.dev/guides/page-interactions#querying-elements-in-shadow-dom | combining these queries across shadow roots}.
     * Alternatively, you can specify the selector type using a
     * {@link https://pptr.dev/guides/page-interactions#prefixed-selector-syntax | prefix}.
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by selector string
     * is added to DOM. Resolves to `null` if waiting for hidden: `true` and
     * selector is not found in DOM.
     *
     * @remarks
     * The optional Parameter in Arguments `options` are:
     *
     * - `visible`: A boolean wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: Wait for element to not be found in the DOM or to be hidden,
     *   i.e. have `display: none` or `visibility: hidden` CSS properties. Defaults to
     *   `false`.
     *
     * - `timeout`: maximum time to wait for in milliseconds. Defaults to `30000`
     *   (30 seconds). Pass `0` to disable timeout. The default value can be changed
     *   by using the {@link Page.setDefaultTimeout} method.
     */
    async waitForSelector(selector, options = {}) {
      return await this.mainFrame().waitForSelector(selector, options);
    }
    /**
     * Waits for the provided function, `pageFunction`, to return a truthy value when
     * evaluated in the page's context.
     *
     * @example
     * {@link Page.waitForFunction} can be used to observe a viewport size change:
     *
     * ```ts
     * import puppeteer from 'puppeteer';
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   const watchDog = page.waitForFunction('window.innerWidth < 100');
     *   await page.setViewport({width: 50, height: 50});
     *   await watchDog;
     *   await browser.close();
     * })();
     * ```
     *
     * @example
     * Arguments can be passed from Node.js to `pageFunction`:
     *
     * ```ts
     * const selector = '.foo';
     * await page.waitForFunction(
     *   selector => !!document.querySelector(selector),
     *   {},
     *   selector,
     * );
     * ```
     *
     * @example
     * The provided `pageFunction` can be asynchronous:
     *
     * ```ts
     * const username = 'github-username';
     * await page.waitForFunction(
     *   async username => {
     *     const githubResponse = await fetch(
     *       `https://api.github.com/users/${username}`,
     *     );
     *     const githubUser = await githubResponse.json();
     *     // show the avatar
     *     const img = document.createElement('img');
     *     img.src = githubUser.avatar_url;
     *     // wait 3 seconds
     *     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
     *     img.remove();
     *   },
     *   {},
     *   username,
     * );
     * ```
     *
     * @param pageFunction - Function to be evaluated in browser context until it returns a
     * truthy value.
     * @param options - Options for configuring waiting behavior.
     */
    waitForFunction(pageFunction, options, ...args) {
      return this.mainFrame().waitForFunction(pageFunction, options, ...args);
    }
    /** @internal */
    [(_screenshot_decorators = [guarded(function() {
      return this.browser();
    })], disposeSymbol)]() {
      return void this.close().catch(debugError);
    }
    /** @internal */
    [asyncDisposeSymbol]() {
      return this.close();
    }
  };
})();
function normalizeRectangle(clip) {
  return {
    ...clip,
    ...clip.width < 0 ? {
      x: clip.x + clip.width,
      width: -clip.width
    } : {
      x: clip.x,
      width: clip.width
    },
    ...clip.height < 0 ? {
      y: clip.y + clip.height,
      height: -clip.height
    } : {
      y: clip.y,
      height: clip.height
    }
  };
}
function roundRectangle(clip) {
  const x = Math.round(clip.x);
  const y = Math.round(clip.y);
  const width = Math.round(clip.width + clip.x - x);
  const height = Math.round(clip.height + clip.y - y);
  return { ...clip, x, y, width, height };
}

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Realm.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/WaitTask.js
init_cjs_shim();
var WaitTask = class {
  #world;
  #polling;
  #root;
  #fn;
  #args;
  #timeout;
  #timeoutError;
  #result = Deferred.create();
  #poller;
  #signal;
  #reruns = [];
  constructor(world, options, fn, ...args) {
    this.#world = world;
    this.#polling = options.polling;
    this.#root = options.root;
    this.#signal = options.signal;
    this.#signal?.addEventListener("abort", this.#onAbortSignal, {
      once: true
    });
    switch (typeof fn) {
      case "string":
        this.#fn = `() => {return (${fn});}`;
        break;
      default:
        this.#fn = stringifyFunction(fn);
        break;
    }
    this.#args = args;
    this.#world.taskManager.add(this);
    if (options.timeout) {
      this.#timeoutError = new TimeoutError(`Waiting failed: ${options.timeout}ms exceeded`);
      this.#timeout = setTimeout(() => {
        void this.terminate(this.#timeoutError);
      }, options.timeout);
    }
    void this.rerun();
  }
  get result() {
    return this.#result.valueOrThrow();
  }
  async rerun() {
    for (const prev of this.#reruns) {
      prev.abort();
    }
    this.#reruns.length = 0;
    const controller = new AbortController();
    this.#reruns.push(controller);
    try {
      switch (this.#polling) {
        case "raf":
          this.#poller = await this.#world.evaluateHandle(({ RAFPoller, createFunction: createFunction2 }, fn, ...args) => {
            const fun = createFunction2(fn);
            return new RAFPoller(() => {
              return fun(...args);
            });
          }, LazyArg.create((context2) => {
            return context2.puppeteerUtil;
          }), this.#fn, ...this.#args);
          break;
        case "mutation":
          this.#poller = await this.#world.evaluateHandle(({ MutationPoller, createFunction: createFunction2 }, root, fn, ...args) => {
            const fun = createFunction2(fn);
            return new MutationPoller(() => {
              return fun(...args);
            }, root || document);
          }, LazyArg.create((context2) => {
            return context2.puppeteerUtil;
          }), this.#root, this.#fn, ...this.#args);
          break;
        default:
          this.#poller = await this.#world.evaluateHandle(({ IntervalPoller, createFunction: createFunction2 }, ms, fn, ...args) => {
            const fun = createFunction2(fn);
            return new IntervalPoller(() => {
              return fun(...args);
            }, ms);
          }, LazyArg.create((context2) => {
            return context2.puppeteerUtil;
          }), this.#polling, this.#fn, ...this.#args);
          break;
      }
      await this.#poller.evaluate((poller) => {
        void poller.start();
      });
      const result = await this.#poller.evaluateHandle((poller) => {
        return poller.result();
      });
      this.#result.resolve(result);
      await this.terminate();
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }
      const badError = this.getBadError(error);
      if (badError) {
        await this.terminate(badError);
      }
    }
  }
  async terminate(error) {
    this.#world.taskManager.delete(this);
    this.#signal?.removeEventListener("abort", this.#onAbortSignal);
    clearTimeout(this.#timeout);
    if (error && !this.#result.finished()) {
      this.#result.reject(error);
    }
    if (this.#poller) {
      try {
        await this.#poller.evaluateHandle(async (poller) => {
          await poller.stop();
        });
        if (this.#poller) {
          await this.#poller.dispose();
          this.#poller = void 0;
        }
      } catch {
      }
    }
  }
  /**
   * Not all errors lead to termination. They usually imply we need to rerun the task.
   */
  getBadError(error) {
    if (isErrorLike(error)) {
      if (error.message.includes("Execution context is not available in detached frame")) {
        return new Error("Waiting failed: Frame detached");
      }
      if (error.message.includes("Execution context was destroyed")) {
        return;
      }
      if (error.message.includes("Cannot find context with specified id")) {
        return;
      }
      if (error.message.includes("AbortError: Actor 'MessageHandlerFrame' destroyed")) {
        return;
      }
      return error;
    }
    return new Error("WaitTask failed with an error", {
      cause: error
    });
  }
  #onAbortSignal = () => {
    void this.terminate(this.#signal?.reason);
  };
};
var TaskManager = class {
  #tasks = /* @__PURE__ */ new Set();
  add(task) {
    this.#tasks.add(task);
  }
  delete(task) {
    this.#tasks.delete(task);
  }
  terminateAll(error) {
    for (const task of this.#tasks) {
      void task.terminate(error);
    }
    this.#tasks.clear();
  }
  async rerunAll() {
    await Promise.all([...this.#tasks].map((task) => {
      return task.rerun();
    }));
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Realm.js
var Realm = class {
  timeoutSettings;
  taskManager = new TaskManager();
  constructor(timeoutSettings) {
    this.timeoutSettings = timeoutSettings;
  }
  async waitForFunction(pageFunction, options = {}, ...args) {
    const { polling = "raf", timeout: timeout2 = this.timeoutSettings.timeout(), root, signal } = options;
    if (typeof polling === "number" && polling < 0) {
      throw new Error("Cannot poll with non-positive interval");
    }
    const waitTask = new WaitTask(this, {
      polling,
      root,
      timeout: timeout2,
      signal
    }, pageFunction, ...args);
    return await waitTask.result;
  }
  get disposed() {
    return this.#disposed;
  }
  #disposed = false;
  /** @internal */
  dispose() {
    this.#disposed = true;
    this.taskManager.terminateAll(new Error("waitForFunction failed: frame got detached."));
  }
  /** @internal */
  [disposeSymbol]() {
    this.dispose();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/Accessibility.js
init_cjs_shim();
var Accessibility = class {
  #realm;
  /**
   * @internal
   */
  constructor(realm) {
    this.#realm = realm;
  }
  /**
   * Captures the current state of the accessibility tree.
   * The returned object represents the root accessible node of the page.
   *
   * @remarks
   *
   * **NOTE** The Chrome accessibility tree contains nodes that go unused on
   * most platforms and by most screen readers. Puppeteer will discard them as
   * well for an easier to process tree, unless `interestingOnly` is set to
   * `false`.
   *
   * @example
   * An example of dumping the entire accessibility tree:
   *
   * ```ts
   * const snapshot = await page.accessibility.snapshot();
   * console.log(snapshot);
   * ```
   *
   * @example
   * An example of logging the focused node's name:
   *
   * ```ts
   * const snapshot = await page.accessibility.snapshot();
   * const node = findFocusedNode(snapshot);
   * console.log(node && node.name);
   *
   * function findFocusedNode(node) {
   *   if (node.focused) return node;
   *   for (const child of node.children || []) {
   *     const foundNode = findFocusedNode(child);
   *     return foundNode;
   *   }
   *   return null;
   * }
   * ```
   *
   * @returns An AXNode object representing the snapshot.
   */
  async snapshot(options = {}) {
    const { interestingOnly = true, root = null } = options;
    const { nodes } = await this.#realm.environment.client.send("Accessibility.getFullAXTree");
    let backendNodeId;
    if (root) {
      const { node } = await this.#realm.environment.client.send("DOM.describeNode", {
        objectId: root.id
      });
      backendNodeId = node.backendNodeId;
    }
    const defaultRoot = AXNode.createTree(this.#realm, nodes);
    let needle = defaultRoot;
    if (!defaultRoot) {
      return null;
    }
    if (backendNodeId) {
      needle = defaultRoot.find((node) => {
        return node.payload.backendDOMNodeId === backendNodeId;
      });
    }
    if (!needle) {
      return null;
    }
    if (!interestingOnly) {
      return this.serializeTree(needle)[0] ?? null;
    }
    const interestingNodes = /* @__PURE__ */ new Set();
    this.collectInterestingNodes(interestingNodes, defaultRoot, false);
    if (!interestingNodes.has(needle)) {
      return null;
    }
    return this.serializeTree(needle, interestingNodes)[0] ?? null;
  }
  serializeTree(node, interestingNodes) {
    const children = [];
    for (const child of node.children) {
      children.push(...this.serializeTree(child, interestingNodes));
    }
    if (interestingNodes && !interestingNodes.has(node)) {
      return children;
    }
    const serializedNode = node.serialize();
    if (children.length) {
      serializedNode.children = children;
    }
    return [serializedNode];
  }
  collectInterestingNodes(collection, node, insideControl) {
    if (node.isInteresting(insideControl)) {
      collection.add(node);
    }
    if (node.isLeafNode()) {
      return;
    }
    insideControl = insideControl || node.isControl();
    for (const child of node.children) {
      this.collectInterestingNodes(collection, child, insideControl);
    }
  }
};
var AXNode = class {
  payload;
  children = [];
  #richlyEditable = false;
  #editable = false;
  #focusable = false;
  #hidden = false;
  #name;
  #role;
  #ignored;
  #cachedHasFocusableChild;
  #realm;
  constructor(realm, payload) {
    this.payload = payload;
    this.#name = this.payload.name ? this.payload.name.value : "";
    this.#role = this.payload.role ? this.payload.role.value : "Unknown";
    this.#ignored = this.payload.ignored;
    this.#realm = realm;
    for (const property of this.payload.properties || []) {
      if (property.name === "editable") {
        this.#richlyEditable = property.value.value === "richtext";
        this.#editable = true;
      }
      if (property.name === "focusable") {
        this.#focusable = property.value.value;
      }
      if (property.name === "hidden") {
        this.#hidden = property.value.value;
      }
    }
  }
  #isPlainTextField() {
    if (this.#richlyEditable) {
      return false;
    }
    if (this.#editable) {
      return true;
    }
    return this.#role === "textbox" || this.#role === "searchbox";
  }
  #isTextOnlyObject() {
    const role = this.#role;
    return role === "LineBreak" || role === "text" || role === "InlineTextBox" || role === "StaticText";
  }
  #hasFocusableChild() {
    if (this.#cachedHasFocusableChild === void 0) {
      this.#cachedHasFocusableChild = false;
      for (const child of this.children) {
        if (child.#focusable || child.#hasFocusableChild()) {
          this.#cachedHasFocusableChild = true;
          break;
        }
      }
    }
    return this.#cachedHasFocusableChild;
  }
  find(predicate) {
    if (predicate(this)) {
      return this;
    }
    for (const child of this.children) {
      const result = child.find(predicate);
      if (result) {
        return result;
      }
    }
    return null;
  }
  isLeafNode() {
    if (!this.children.length) {
      return true;
    }
    if (this.#isPlainTextField() || this.#isTextOnlyObject()) {
      return true;
    }
    switch (this.#role) {
      case "doc-cover":
      case "graphics-symbol":
      case "img":
      case "image":
      case "Meter":
      case "scrollbar":
      case "slider":
      case "separator":
      case "progressbar":
        return true;
      default:
        break;
    }
    if (this.#hasFocusableChild()) {
      return false;
    }
    if (this.#focusable && this.#name) {
      return true;
    }
    if (this.#role === "heading" && this.#name) {
      return true;
    }
    return false;
  }
  isControl() {
    switch (this.#role) {
      case "button":
      case "checkbox":
      case "ColorWell":
      case "combobox":
      case "DisclosureTriangle":
      case "listbox":
      case "menu":
      case "menubar":
      case "menuitem":
      case "menuitemcheckbox":
      case "menuitemradio":
      case "radio":
      case "scrollbar":
      case "searchbox":
      case "slider":
      case "spinbutton":
      case "switch":
      case "tab":
      case "textbox":
      case "tree":
      case "treeitem":
        return true;
      default:
        return false;
    }
  }
  isInteresting(insideControl) {
    const role = this.#role;
    if (role === "Ignored" || this.#hidden || this.#ignored) {
      return false;
    }
    if (this.#focusable || this.#richlyEditable) {
      return true;
    }
    if (this.isControl()) {
      return true;
    }
    if (insideControl) {
      return false;
    }
    return this.isLeafNode() && !!this.#name;
  }
  serialize() {
    const properties = /* @__PURE__ */ new Map();
    for (const property of this.payload.properties || []) {
      properties.set(property.name.toLowerCase(), property.value.value);
    }
    if (this.payload.name) {
      properties.set("name", this.payload.name.value);
    }
    if (this.payload.value) {
      properties.set("value", this.payload.value.value);
    }
    if (this.payload.description) {
      properties.set("description", this.payload.description.value);
    }
    const node = {
      role: this.#role,
      elementHandle: async () => {
        if (!this.payload.backendDOMNodeId) {
          return null;
        }
        return await this.#realm.adoptBackendNode(this.payload.backendDOMNodeId);
      }
    };
    const userStringProperties = [
      "name",
      "value",
      "description",
      "keyshortcuts",
      "roledescription",
      "valuetext"
    ];
    const getUserStringPropertyValue = (key) => {
      return properties.get(key);
    };
    for (const userStringProperty of userStringProperties) {
      if (!properties.has(userStringProperty)) {
        continue;
      }
      node[userStringProperty] = getUserStringPropertyValue(userStringProperty);
    }
    const booleanProperties = [
      "disabled",
      "expanded",
      "focused",
      "modal",
      "multiline",
      "multiselectable",
      "readonly",
      "required",
      "selected"
    ];
    const getBooleanPropertyValue = (key) => {
      return properties.get(key);
    };
    for (const booleanProperty of booleanProperties) {
      if (booleanProperty === "focused" && this.#role === "RootWebArea") {
        continue;
      }
      const value = getBooleanPropertyValue(booleanProperty);
      if (!value) {
        continue;
      }
      node[booleanProperty] = getBooleanPropertyValue(booleanProperty);
    }
    const tristateProperties = ["checked", "pressed"];
    for (const tristateProperty of tristateProperties) {
      if (!properties.has(tristateProperty)) {
        continue;
      }
      const value = properties.get(tristateProperty);
      node[tristateProperty] = value === "mixed" ? "mixed" : value === "true" ? true : false;
    }
    const numericalProperties = [
      "level",
      "valuemax",
      "valuemin"
    ];
    const getNumericalPropertyValue = (key) => {
      return properties.get(key);
    };
    for (const numericalProperty of numericalProperties) {
      if (!properties.has(numericalProperty)) {
        continue;
      }
      node[numericalProperty] = getNumericalPropertyValue(numericalProperty);
    }
    const tokenProperties = [
      "autocomplete",
      "haspopup",
      "invalid",
      "orientation"
    ];
    const getTokenPropertyValue = (key) => {
      return properties.get(key);
    };
    for (const tokenProperty of tokenProperties) {
      const value = getTokenPropertyValue(tokenProperty);
      if (!value || value === "false") {
        continue;
      }
      node[tokenProperty] = getTokenPropertyValue(tokenProperty);
    }
    return node;
  }
  static createTree(realm, payloads) {
    const nodeById = /* @__PURE__ */ new Map();
    for (const payload of payloads) {
      nodeById.set(payload.nodeId, new AXNode(realm, payload));
    }
    for (const node of nodeById.values()) {
      for (const childId of node.payload.childIds || []) {
        const child = nodeById.get(childId);
        if (child) {
          node.children.push(child);
        }
      }
    }
    return nodeById.values().next().value ?? null;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/CallbackRegistry.js
init_cjs_shim();
var CallbackRegistry = class {
  #callbacks = /* @__PURE__ */ new Map();
  #idGenerator = createIncrementalIdGenerator();
  create(label, timeout2, request) {
    const callback = new Callback(this.#idGenerator(), label, timeout2);
    this.#callbacks.set(callback.id, callback);
    try {
      request(callback.id);
    } catch (error) {
      callback.promise.catch(debugError).finally(() => {
        this.#callbacks.delete(callback.id);
      });
      callback.reject(error);
      throw error;
    }
    return callback.promise.finally(() => {
      this.#callbacks.delete(callback.id);
    });
  }
  reject(id, message, originalMessage) {
    const callback = this.#callbacks.get(id);
    if (!callback) {
      return;
    }
    this._reject(callback, message, originalMessage);
  }
  _reject(callback, errorMessage, originalMessage) {
    let error;
    let message;
    if (errorMessage instanceof ProtocolError) {
      error = errorMessage;
      error.cause = callback.error;
      message = errorMessage.message;
    } else {
      error = callback.error;
      message = errorMessage;
    }
    callback.reject(rewriteError(error, `Protocol error (${callback.label}): ${message}`, originalMessage));
  }
  resolve(id, value) {
    const callback = this.#callbacks.get(id);
    if (!callback) {
      return;
    }
    callback.resolve(value);
  }
  clear() {
    for (const callback of this.#callbacks.values()) {
      this._reject(callback, new TargetCloseError("Target closed"));
    }
    this.#callbacks.clear();
  }
  /**
   * @internal
   */
  getPendingProtocolErrors() {
    const result = [];
    for (const callback of this.#callbacks.values()) {
      result.push(new Error(`${callback.label} timed out. Trace: ${callback.error.stack}`));
    }
    return result;
  }
};
var Callback = class {
  #id;
  #error = new ProtocolError();
  #deferred = Deferred.create();
  #timer;
  #label;
  constructor(id, label, timeout2) {
    this.#id = id;
    this.#label = label;
    if (timeout2) {
      this.#timer = setTimeout(() => {
        this.#deferred.reject(rewriteError(this.#error, `${label} timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.`));
      }, timeout2);
    }
  }
  resolve(value) {
    clearTimeout(this.#timer);
    this.#deferred.resolve(value);
  }
  reject(error) {
    clearTimeout(this.#timer);
    this.#deferred.reject(error);
  }
  get id() {
    return this.#id;
  }
  get promise() {
    return this.#deferred.valueOrThrow();
  }
  get error() {
    return this.#error;
  }
  get label() {
    return this.#label;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/common/ConsoleMessage.js
init_cjs_shim();
var ConsoleMessage = class {
  #type;
  #text;
  #args;
  #stackTraceLocations;
  #frame;
  /**
   * @internal
   */
  constructor(type, text, args, stackTraceLocations, frame) {
    this.#type = type;
    this.#text = text;
    this.#args = args;
    this.#stackTraceLocations = stackTraceLocations;
    this.#frame = frame;
  }
  /**
   * The type of the console message.
   */
  type() {
    return this.#type;
  }
  /**
   * The text of the console message.
   */
  text() {
    return this.#text;
  }
  /**
   * An array of arguments passed to the console.
   */
  args() {
    return this.#args;
  }
  /**
   * The location of the console message.
   */
  location() {
    return this.#stackTraceLocations[0] ?? (this.#frame ? { url: this.#frame.url() } : {});
  }
  /**
   * The array of locations on the stack of the console message.
   */
  stackTrace() {
    return this.#stackTraceLocations;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/Coverage.js
init_cjs_shim();
var Coverage = class {
  #jsCoverage;
  #cssCoverage;
  /**
   * @internal
   */
  constructor(client) {
    this.#jsCoverage = new JSCoverage(client);
    this.#cssCoverage = new CSSCoverage(client);
  }
  /**
   * @internal
   */
  updateClient(client) {
    this.#jsCoverage.updateClient(client);
    this.#cssCoverage.updateClient(client);
  }
  /**
   * @param options - Set of configurable options for coverage defaults to
   * `resetOnNavigation : true, reportAnonymousScripts : false,`
   * `includeRawScriptCoverage : false, useBlockCoverage : true`
   * @returns Promise that resolves when coverage is started.
   *
   * @remarks
   * Anonymous scripts are ones that don't have an associated url. These are
   * scripts that are dynamically created on the page using `eval` or
   * `new Function`. If `reportAnonymousScripts` is set to `true`, anonymous
   * scripts URL will start with `debugger://VM` (unless a magic //# sourceURL
   * comment is present, in which case that will the be URL).
   */
  async startJSCoverage(options = {}) {
    return await this.#jsCoverage.start(options);
  }
  /**
   * Promise that resolves to the array of coverage reports for
   * all scripts.
   *
   * @remarks
   * JavaScript Coverage doesn't include anonymous scripts by default.
   * However, scripts with sourceURLs are reported.
   */
  async stopJSCoverage() {
    return await this.#jsCoverage.stop();
  }
  /**
   * @param options - Set of configurable options for coverage, defaults to
   * `resetOnNavigation : true`
   * @returns Promise that resolves when coverage is started.
   */
  async startCSSCoverage(options = {}) {
    return await this.#cssCoverage.start(options);
  }
  /**
   * Promise that resolves to the array of coverage reports
   * for all stylesheets.
   *
   * @remarks
   * CSS Coverage doesn't include dynamically injected style tags
   * without sourceURLs.
   */
  async stopCSSCoverage() {
    return await this.#cssCoverage.stop();
  }
};
var JSCoverage = class {
  #client;
  #enabled = false;
  #scriptURLs = /* @__PURE__ */ new Map();
  #scriptSources = /* @__PURE__ */ new Map();
  #subscriptions;
  #resetOnNavigation = false;
  #reportAnonymousScripts = false;
  #includeRawScriptCoverage = false;
  /**
   * @internal
   */
  constructor(client) {
    this.#client = client;
  }
  /**
   * @internal
   */
  updateClient(client) {
    this.#client = client;
  }
  async start(options = {}) {
    assert(!this.#enabled, "JSCoverage is already enabled");
    const { resetOnNavigation = true, reportAnonymousScripts = false, includeRawScriptCoverage = false, useBlockCoverage = true } = options;
    this.#resetOnNavigation = resetOnNavigation;
    this.#reportAnonymousScripts = reportAnonymousScripts;
    this.#includeRawScriptCoverage = includeRawScriptCoverage;
    this.#enabled = true;
    this.#scriptURLs.clear();
    this.#scriptSources.clear();
    this.#subscriptions = new DisposableStack();
    const clientEmitter = this.#subscriptions.use(new EventEmitter(this.#client));
    clientEmitter.on("Debugger.scriptParsed", this.#onScriptParsed.bind(this));
    clientEmitter.on("Runtime.executionContextsCleared", this.#onExecutionContextsCleared.bind(this));
    await Promise.all([
      this.#client.send("Profiler.enable"),
      this.#client.send("Profiler.startPreciseCoverage", {
        callCount: this.#includeRawScriptCoverage,
        detailed: useBlockCoverage
      }),
      this.#client.send("Debugger.enable"),
      this.#client.send("Debugger.setSkipAllPauses", { skip: true })
    ]);
  }
  #onExecutionContextsCleared() {
    if (!this.#resetOnNavigation) {
      return;
    }
    this.#scriptURLs.clear();
    this.#scriptSources.clear();
  }
  async #onScriptParsed(event) {
    if (PuppeteerURL.isPuppeteerURL(event.url)) {
      return;
    }
    if (!event.url && !this.#reportAnonymousScripts) {
      return;
    }
    try {
      const response = await this.#client.send("Debugger.getScriptSource", {
        scriptId: event.scriptId
      });
      this.#scriptURLs.set(event.scriptId, event.url);
      this.#scriptSources.set(event.scriptId, response.scriptSource);
    } catch (error) {
      debugError(error);
    }
  }
  async stop() {
    assert(this.#enabled, "JSCoverage is not enabled");
    this.#enabled = false;
    const result = await Promise.all([
      this.#client.send("Profiler.takePreciseCoverage"),
      this.#client.send("Profiler.stopPreciseCoverage"),
      this.#client.send("Profiler.disable"),
      this.#client.send("Debugger.disable")
    ]);
    this.#subscriptions?.dispose();
    const coverage = [];
    const profileResponse = result[0];
    for (const entry of profileResponse.result) {
      let url = this.#scriptURLs.get(entry.scriptId);
      if (!url && this.#reportAnonymousScripts) {
        url = "debugger://VM" + entry.scriptId;
      }
      const text = this.#scriptSources.get(entry.scriptId);
      if (text === void 0 || url === void 0) {
        continue;
      }
      const flattenRanges = [];
      for (const func of entry.functions) {
        flattenRanges.push(...func.ranges);
      }
      const ranges = convertToDisjointRanges(flattenRanges);
      if (!this.#includeRawScriptCoverage) {
        coverage.push({ url, ranges, text });
      } else {
        coverage.push({ url, ranges, text, rawScriptCoverage: entry });
      }
    }
    return coverage;
  }
};
var CSSCoverage = class {
  #client;
  #enabled = false;
  #stylesheetURLs = /* @__PURE__ */ new Map();
  #stylesheetSources = /* @__PURE__ */ new Map();
  #eventListeners;
  #resetOnNavigation = false;
  constructor(client) {
    this.#client = client;
  }
  /**
   * @internal
   */
  updateClient(client) {
    this.#client = client;
  }
  async start(options = {}) {
    assert(!this.#enabled, "CSSCoverage is already enabled");
    const { resetOnNavigation = true } = options;
    this.#resetOnNavigation = resetOnNavigation;
    this.#enabled = true;
    this.#stylesheetURLs.clear();
    this.#stylesheetSources.clear();
    this.#eventListeners = new DisposableStack();
    const clientEmitter = this.#eventListeners.use(new EventEmitter(this.#client));
    clientEmitter.on("CSS.styleSheetAdded", this.#onStyleSheet.bind(this));
    clientEmitter.on("Runtime.executionContextsCleared", this.#onExecutionContextsCleared.bind(this));
    await Promise.all([
      this.#client.send("DOM.enable"),
      this.#client.send("CSS.enable"),
      this.#client.send("CSS.startRuleUsageTracking")
    ]);
  }
  #onExecutionContextsCleared() {
    if (!this.#resetOnNavigation) {
      return;
    }
    this.#stylesheetURLs.clear();
    this.#stylesheetSources.clear();
  }
  async #onStyleSheet(event) {
    const header = event.header;
    if (!header.sourceURL) {
      return;
    }
    try {
      const response = await this.#client.send("CSS.getStyleSheetText", {
        styleSheetId: header.styleSheetId
      });
      this.#stylesheetURLs.set(header.styleSheetId, header.sourceURL);
      this.#stylesheetSources.set(header.styleSheetId, response.text);
    } catch (error) {
      debugError(error);
    }
  }
  async stop() {
    assert(this.#enabled, "CSSCoverage is not enabled");
    this.#enabled = false;
    const ruleTrackingResponse = await this.#client.send("CSS.stopRuleUsageTracking");
    await Promise.all([
      this.#client.send("CSS.disable"),
      this.#client.send("DOM.disable")
    ]);
    this.#eventListeners?.dispose();
    const styleSheetIdToCoverage = /* @__PURE__ */ new Map();
    for (const entry of ruleTrackingResponse.ruleUsage) {
      let ranges = styleSheetIdToCoverage.get(entry.styleSheetId);
      if (!ranges) {
        ranges = [];
        styleSheetIdToCoverage.set(entry.styleSheetId, ranges);
      }
      ranges.push({
        startOffset: entry.startOffset,
        endOffset: entry.endOffset,
        count: entry.used ? 1 : 0
      });
    }
    const coverage = [];
    for (const styleSheetId of this.#stylesheetURLs.keys()) {
      const url = this.#stylesheetURLs.get(styleSheetId);
      assert(typeof url !== "undefined", `Stylesheet URL is undefined (styleSheetId=${styleSheetId})`);
      const text = this.#stylesheetSources.get(styleSheetId);
      assert(typeof text !== "undefined", `Stylesheet text is undefined (styleSheetId=${styleSheetId})`);
      const ranges = convertToDisjointRanges(styleSheetIdToCoverage.get(styleSheetId) || []);
      coverage.push({ url, ranges, text });
    }
    return coverage;
  }
};
function convertToDisjointRanges(nestedRanges) {
  const points = [];
  for (const range of nestedRanges) {
    points.push({ offset: range.startOffset, type: 0, range });
    points.push({ offset: range.endOffset, type: 1, range });
  }
  points.sort((a, b) => {
    if (a.offset !== b.offset) {
      return a.offset - b.offset;
    }
    if (a.type !== b.type) {
      return b.type - a.type;
    }
    const aLength = a.range.endOffset - a.range.startOffset;
    const bLength = b.range.endOffset - b.range.startOffset;
    if (a.type === 0) {
      return bLength - aLength;
    }
    return aLength - bLength;
  });
  const hitCountStack = [];
  const results = [];
  let lastOffset = 0;
  for (const point of points) {
    if (hitCountStack.length && lastOffset < point.offset && hitCountStack[hitCountStack.length - 1] > 0) {
      const lastResult = results[results.length - 1];
      if (lastResult && lastResult.end === lastOffset) {
        lastResult.end = point.offset;
      } else {
        results.push({ start: lastOffset, end: point.offset });
      }
    }
    lastOffset = point.offset;
    if (point.type === 0) {
      hitCountStack.push(point.range.count);
    } else {
      hitCountStack.pop();
    }
  }
  return results.filter((range) => {
    return range.end - range.start > 0;
  });
}

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/EmulationManager.js
init_cjs_shim();

// node_modules/puppeteer-core/lib/esm/puppeteer/api/CDPSession.js
init_cjs_shim();
var CDPSessionEvent;
(function(CDPSessionEvent2) {
  CDPSessionEvent2.Disconnected = Symbol("CDPSession.Disconnected");
  CDPSessionEvent2.Swapped = Symbol("CDPSession.Swapped");
  CDPSessionEvent2.Ready = Symbol("CDPSession.Ready");
  CDPSessionEvent2.SessionAttached = "sessionattached";
  CDPSessionEvent2.SessionDetached = "sessiondetached";
})(CDPSessionEvent || (CDPSessionEvent = {}));
var CDPSession = class extends EventEmitter {
  /**
   * @internal
   */
  constructor() {
    super();
  }
  /**
   * Parent session in terms of CDP's auto-attach mechanism.
   *
   * @internal
   */
  parentSession() {
    return void 0;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/EmulationManager.js
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
    var context2 = {};
    for (var p in contextIn)
      context2[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context2.access[p] = contextIn.access[p];
    context2.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context2);
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
var __setFunctionName2 = function(f, name, prefix) {
  if (typeof name === "symbol")
    name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var EmulatedState = class {
  #state;
  #clientProvider;
  #updater;
  constructor(initialState, clientProvider, updater) {
    this.#state = initialState;
    this.#clientProvider = clientProvider;
    this.#updater = updater;
    this.#clientProvider.registerState(this);
  }
  async setState(state) {
    this.#state = state;
    await this.sync();
  }
  get state() {
    return this.#state;
  }
  async sync() {
    await Promise.all(this.#clientProvider.clients().map((client) => {
      return this.#updater(client, this.#state);
    }));
  }
};
var EmulationManager = (() => {
  let _instanceExtraInitializers = [];
  let _private_applyViewport_decorators;
  let _private_applyViewport_descriptor;
  let _private_emulateIdleState_decorators;
  let _private_emulateIdleState_descriptor;
  let _private_emulateTimezone_decorators;
  let _private_emulateTimezone_descriptor;
  let _private_emulateVisionDeficiency_decorators;
  let _private_emulateVisionDeficiency_descriptor;
  let _private_emulateCpuThrottling_decorators;
  let _private_emulateCpuThrottling_descriptor;
  let _private_emulateMediaFeatures_decorators;
  let _private_emulateMediaFeatures_descriptor;
  let _private_emulateMediaType_decorators;
  let _private_emulateMediaType_descriptor;
  let _private_setGeolocation_decorators;
  let _private_setGeolocation_descriptor;
  let _private_setDefaultBackgroundColor_decorators;
  let _private_setDefaultBackgroundColor_descriptor;
  let _private_setJavaScriptEnabled_decorators;
  let _private_setJavaScriptEnabled_descriptor;
  return class EmulationManager {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      _private_applyViewport_decorators = [invokeAtMostOnceForArguments];
      _private_emulateIdleState_decorators = [invokeAtMostOnceForArguments];
      _private_emulateTimezone_decorators = [invokeAtMostOnceForArguments];
      _private_emulateVisionDeficiency_decorators = [invokeAtMostOnceForArguments];
      _private_emulateCpuThrottling_decorators = [invokeAtMostOnceForArguments];
      _private_emulateMediaFeatures_decorators = [invokeAtMostOnceForArguments];
      _private_emulateMediaType_decorators = [invokeAtMostOnceForArguments];
      _private_setGeolocation_decorators = [invokeAtMostOnceForArguments];
      _private_setDefaultBackgroundColor_decorators = [invokeAtMostOnceForArguments];
      _private_setJavaScriptEnabled_decorators = [invokeAtMostOnceForArguments];
      __esDecorate5(this, _private_applyViewport_descriptor = { value: __setFunctionName2(async function(client, viewportState) {
        if (!viewportState.viewport) {
          await Promise.all([
            client.send("Emulation.clearDeviceMetricsOverride"),
            client.send("Emulation.setTouchEmulationEnabled", {
              enabled: false
            })
          ]).catch(debugError);
          return;
        }
        const { viewport } = viewportState;
        const mobile = viewport.isMobile || false;
        const width = viewport.width;
        const height = viewport.height;
        const deviceScaleFactor = viewport.deviceScaleFactor ?? 1;
        const screenOrientation = viewport.isLandscape ? { angle: 90, type: "landscapePrimary" } : { angle: 0, type: "portraitPrimary" };
        const hasTouch = viewport.hasTouch || false;
        await Promise.all([
          client.send("Emulation.setDeviceMetricsOverride", {
            mobile,
            width,
            height,
            deviceScaleFactor,
            screenOrientation
          }).catch((err) => {
            if (err.message.includes("Target does not support metrics override")) {
              debugError(err);
              return;
            }
            throw err;
          }),
          client.send("Emulation.setTouchEmulationEnabled", {
            enabled: hasTouch
          })
        ]);
      }, "#applyViewport") }, _private_applyViewport_decorators, { kind: "method", name: "#applyViewport", static: false, private: true, access: { has: (obj) => #applyViewport in obj, get: (obj) => obj.#applyViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_emulateIdleState_descriptor = { value: __setFunctionName2(async function(client, idleStateState) {
        if (!idleStateState.active) {
          return;
        }
        if (idleStateState.overrides) {
          await client.send("Emulation.setIdleOverride", {
            isUserActive: idleStateState.overrides.isUserActive,
            isScreenUnlocked: idleStateState.overrides.isScreenUnlocked
          });
        } else {
          await client.send("Emulation.clearIdleOverride");
        }
      }, "#emulateIdleState") }, _private_emulateIdleState_decorators, { kind: "method", name: "#emulateIdleState", static: false, private: true, access: { has: (obj) => #emulateIdleState in obj, get: (obj) => obj.#emulateIdleState }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_emulateTimezone_descriptor = { value: __setFunctionName2(async function(client, timezoneState) {
        if (!timezoneState.active) {
          return;
        }
        try {
          await client.send("Emulation.setTimezoneOverride", {
            timezoneId: timezoneState.timezoneId || ""
          });
        } catch (error) {
          if (isErrorLike(error) && error.message.includes("Invalid timezone")) {
            throw new Error(`Invalid timezone ID: ${timezoneState.timezoneId}`);
          }
          throw error;
        }
      }, "#emulateTimezone") }, _private_emulateTimezone_decorators, { kind: "method", name: "#emulateTimezone", static: false, private: true, access: { has: (obj) => #emulateTimezone in obj, get: (obj) => obj.#emulateTimezone }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_emulateVisionDeficiency_descriptor = { value: __setFunctionName2(async function(client, visionDeficiency) {
        if (!visionDeficiency.active) {
          return;
        }
        await client.send("Emulation.setEmulatedVisionDeficiency", {
          type: visionDeficiency.visionDeficiency || "none"
        });
      }, "#emulateVisionDeficiency") }, _private_emulateVisionDeficiency_decorators, { kind: "method", name: "#emulateVisionDeficiency", static: false, private: true, access: { has: (obj) => #emulateVisionDeficiency in obj, get: (obj) => obj.#emulateVisionDeficiency }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_emulateCpuThrottling_descriptor = { value: __setFunctionName2(async function(client, state) {
        if (!state.active) {
          return;
        }
        await client.send("Emulation.setCPUThrottlingRate", {
          rate: state.factor ?? 1
        });
      }, "#emulateCpuThrottling") }, _private_emulateCpuThrottling_decorators, { kind: "method", name: "#emulateCpuThrottling", static: false, private: true, access: { has: (obj) => #emulateCpuThrottling in obj, get: (obj) => obj.#emulateCpuThrottling }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_emulateMediaFeatures_descriptor = { value: __setFunctionName2(async function(client, state) {
        if (!state.active) {
          return;
        }
        await client.send("Emulation.setEmulatedMedia", {
          features: state.mediaFeatures
        });
      }, "#emulateMediaFeatures") }, _private_emulateMediaFeatures_decorators, { kind: "method", name: "#emulateMediaFeatures", static: false, private: true, access: { has: (obj) => #emulateMediaFeatures in obj, get: (obj) => obj.#emulateMediaFeatures }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_emulateMediaType_descriptor = { value: __setFunctionName2(async function(client, state) {
        if (!state.active) {
          return;
        }
        await client.send("Emulation.setEmulatedMedia", {
          media: state.type || ""
        });
      }, "#emulateMediaType") }, _private_emulateMediaType_decorators, { kind: "method", name: "#emulateMediaType", static: false, private: true, access: { has: (obj) => #emulateMediaType in obj, get: (obj) => obj.#emulateMediaType }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_setGeolocation_descriptor = { value: __setFunctionName2(async function(client, state) {
        if (!state.active) {
          return;
        }
        await client.send("Emulation.setGeolocationOverride", state.geoLocation ? {
          longitude: state.geoLocation.longitude,
          latitude: state.geoLocation.latitude,
          accuracy: state.geoLocation.accuracy
        } : void 0);
      }, "#setGeolocation") }, _private_setGeolocation_decorators, { kind: "method", name: "#setGeolocation", static: false, private: true, access: { has: (obj) => #setGeolocation in obj, get: (obj) => obj.#setGeolocation }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_setDefaultBackgroundColor_descriptor = { value: __setFunctionName2(async function(client, state) {
        if (!state.active) {
          return;
        }
        await client.send("Emulation.setDefaultBackgroundColorOverride", {
          color: state.color
        });
      }, "#setDefaultBackgroundColor") }, _private_setDefaultBackgroundColor_decorators, { kind: "method", name: "#setDefaultBackgroundColor", static: false, private: true, access: { has: (obj) => #setDefaultBackgroundColor in obj, get: (obj) => obj.#setDefaultBackgroundColor }, metadata: _metadata }, null, _instanceExtraInitializers);
      __esDecorate5(this, _private_setJavaScriptEnabled_descriptor = { value: __setFunctionName2(async function(client, state) {
        if (!state.active) {
          return;
        }
        await client.send("Emulation.setScriptExecutionDisabled", {
          value: !state.javaScriptEnabled
        });
      }, "#setJavaScriptEnabled") }, _private_setJavaScriptEnabled_decorators, { kind: "method", name: "#setJavaScriptEnabled", static: false, private: true, access: { has: (obj) => #setJavaScriptEnabled in obj, get: (obj) => obj.#setJavaScriptEnabled }, metadata: _metadata }, null, _instanceExtraInitializers);
      if (_metadata)
        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    }
    #client = __runInitializers5(this, _instanceExtraInitializers);
    #emulatingMobile = false;
    #hasTouch = false;
    #states = [];
    #viewportState = new EmulatedState({
      active: false
    }, this, this.#applyViewport);
    #idleOverridesState = new EmulatedState({
      active: false
    }, this, this.#emulateIdleState);
    #timezoneState = new EmulatedState({
      active: false
    }, this, this.#emulateTimezone);
    #visionDeficiencyState = new EmulatedState({
      active: false
    }, this, this.#emulateVisionDeficiency);
    #cpuThrottlingState = new EmulatedState({
      active: false
    }, this, this.#emulateCpuThrottling);
    #mediaFeaturesState = new EmulatedState({
      active: false
    }, this, this.#emulateMediaFeatures);
    #mediaTypeState = new EmulatedState({
      active: false
    }, this, this.#emulateMediaType);
    #geoLocationState = new EmulatedState({
      active: false
    }, this, this.#setGeolocation);
    #defaultBackgroundColorState = new EmulatedState({
      active: false
    }, this, this.#setDefaultBackgroundColor);
    #javascriptEnabledState = new EmulatedState({
      javaScriptEnabled: true,
      active: false
    }, this, this.#setJavaScriptEnabled);
    #secondaryClients = /* @__PURE__ */ new Set();
    constructor(client) {
      this.#client = client;
    }
    updateClient(client) {
      this.#client = client;
      this.#secondaryClients.delete(client);
    }
    registerState(state) {
      this.#states.push(state);
    }
    clients() {
      return [this.#client, ...Array.from(this.#secondaryClients)];
    }
    async registerSpeculativeSession(client) {
      this.#secondaryClients.add(client);
      client.once(CDPSessionEvent.Disconnected, () => {
        this.#secondaryClients.delete(client);
      });
      void Promise.all(this.#states.map((s) => {
        return s.sync().catch(debugError);
      }));
    }
    get javascriptEnabled() {
      return this.#javascriptEnabledState.state.javaScriptEnabled;
    }
    async emulateViewport(viewport) {
      const currentState = this.#viewportState.state;
      if (!viewport && !currentState.active) {
        return false;
      }
      await this.#viewportState.setState(viewport ? {
        viewport,
        active: true
      } : {
        active: false
      });
      const mobile = viewport?.isMobile || false;
      const hasTouch = viewport?.hasTouch || false;
      const reloadNeeded = this.#emulatingMobile !== mobile || this.#hasTouch !== hasTouch;
      this.#emulatingMobile = mobile;
      this.#hasTouch = hasTouch;
      return reloadNeeded;
    }
    get #applyViewport() {
      return _private_applyViewport_descriptor.value;
    }
    async emulateIdleState(overrides) {
      await this.#idleOverridesState.setState({
        active: true,
        overrides
      });
    }
    get #emulateIdleState() {
      return _private_emulateIdleState_descriptor.value;
    }
    get #emulateTimezone() {
      return _private_emulateTimezone_descriptor.value;
    }
    async emulateTimezone(timezoneId) {
      await this.#timezoneState.setState({
        timezoneId,
        active: true
      });
    }
    get #emulateVisionDeficiency() {
      return _private_emulateVisionDeficiency_descriptor.value;
    }
    async emulateVisionDeficiency(type) {
      const visionDeficiencies = /* @__PURE__ */ new Set([
        "none",
        "achromatopsia",
        "blurredVision",
        "deuteranopia",
        "protanopia",
        "tritanopia"
      ]);
      assert(!type || visionDeficiencies.has(type), `Unsupported vision deficiency: ${type}`);
      await this.#visionDeficiencyState.setState({
        active: true,
        visionDeficiency: type
      });
    }
    get #emulateCpuThrottling() {
      return _private_emulateCpuThrottling_descriptor.value;
    }
    async emulateCPUThrottling(factor) {
      assert(factor === null || factor >= 1, "Throttling rate should be greater or equal to 1");
      await this.#cpuThrottlingState.setState({
        active: true,
        factor: factor ?? void 0
      });
    }
    get #emulateMediaFeatures() {
      return _private_emulateMediaFeatures_descriptor.value;
    }
    async emulateMediaFeatures(features) {
      if (Array.isArray(features)) {
        for (const mediaFeature of features) {
          const name = mediaFeature.name;
          assert(/^(?:prefers-(?:color-scheme|reduced-motion)|color-gamut)$/.test(name), "Unsupported media feature: " + name);
        }
      }
      await this.#mediaFeaturesState.setState({
        active: true,
        mediaFeatures: features
      });
    }
    get #emulateMediaType() {
      return _private_emulateMediaType_descriptor.value;
    }
    async emulateMediaType(type) {
      assert(type === "screen" || type === "print" || (type ?? void 0) === void 0, "Unsupported media type: " + type);
      await this.#mediaTypeState.setState({
        type,
        active: true
      });
    }
    get #setGeolocation() {
      return _private_setGeolocation_descriptor.value;
    }
    async setGeolocation(options) {
      const { longitude, latitude, accuracy = 0 } = options;
      if (longitude < -180 || longitude > 180) {
        throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
      }
      if (latitude < -90 || latitude > 90) {
        throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
      }
      if (accuracy < 0) {
        throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
      }
      await this.#geoLocationState.setState({
        active: true,
        geoLocation: {
          longitude,
          latitude,
          accuracy
        }
      });
    }
    get #setDefaultBackgroundColor() {
      return _private_setDefaultBackgroundColor_descriptor.value;
    }
    /**
     * Resets default white background
     */
    async resetDefaultBackgroundColor() {
      await this.#defaultBackgroundColorState.setState({
        active: true,
        color: void 0
      });
    }
    /**
     * Hides default white background
     */
    async setTransparentBackgroundColor() {
      await this.#defaultBackgroundColorState.setState({
        active: true,
        color: { r: 0, g: 0, b: 0, a: 0 }
      });
    }
    get #setJavaScriptEnabled() {
      return _private_setJavaScriptEnabled_descriptor.value;
    }
    async setJavaScriptEnabled(enabled) {
      await this.#javascriptEnabledState.setState({
        active: true,
        javaScriptEnabled: enabled
      });
    }
  };
})();

// node_modules/puppeteer-core/lib/esm/puppeteer/common/SecurityDetails.js
init_cjs_shim();
var SecurityDetails = class {
  #subjectName;
  #issuer;
  #validFrom;
  #validTo;
  #protocol;
  #sanList;
  /**
   * @internal
   */
  constructor(securityPayload) {
    this.#subjectName = securityPayload.subjectName;
    this.#issuer = securityPayload.issuer;
    this.#validFrom = securityPayload.validFrom;
    this.#validTo = securityPayload.validTo;
    this.#protocol = securityPayload.protocol;
    this.#sanList = securityPayload.sanList;
  }
  /**
   * The name of the issuer of the certificate.
   */
  issuer() {
    return this.#issuer;
  }
  /**
   * {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
   * marking the start of the certificate's validity.
   */
  validFrom() {
    return this.#validFrom;
  }
  /**
   * {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
   * marking the end of the certificate's validity.
   */
  validTo() {
    return this.#validTo;
  }
  /**
   * The security protocol being used, e.g. "TLS 1.2".
   */
  protocol() {
    return this.#protocol;
  }
  /**
   * The name of the subject to which the certificate was issued.
   */
  subjectName() {
    return this.#subjectName;
  }
  /**
   * The list of {@link https://en.wikipedia.org/wiki/Subject_Alternative_Name | subject alternative names (SANs)} of the certificate.
   */
  subjectAlternativeNames() {
    return this.#sanList;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/cdp/Tracing.js
init_cjs_shim();
var Tracing = class {
  #client;
  #recording = false;
  #path;
  /**
   * @internal
   */
  constructor(client) {
    this.#client = client;
  }
  /**
   * @internal
   */
  updateClient(client) {
    this.#client = client;
  }
  /**
   * Starts a trace for the current page.
   * @remarks
   * Only one trace can be active at a time per browser.
   *
   * @param options - Optional `TracingOptions`.
   */
  async start(options = {}) {
    assert(!this.#recording, "Cannot start recording trace while already recording trace.");
    const defaultCategories = [
      "-*",
      "devtools.timeline",
      "v8.execute",
      "disabled-by-default-devtools.timeline",
      "disabled-by-default-devtools.timeline.frame",
      "toplevel",
      "blink.console",
      "blink.user_timing",
      "latencyInfo",
      "disabled-by-default-devtools.timeline.stack",
      "disabled-by-default-v8.cpu_profiler"
    ];
    const { path, screenshots = false, categories = defaultCategories } = options;
    if (screenshots) {
      categories.push("disabled-by-default-devtools.screenshot");
    }
    const excludedCategories = categories.filter((cat) => {
      return cat.startsWith("-");
    }).map((cat) => {
      return cat.slice(1);
    });
    const includedCategories = categories.filter((cat) => {
      return !cat.startsWith("-");
    });
    this.#path = path;
    this.#recording = true;
    await this.#client.send("Tracing.start", {
      transferMode: "ReturnAsStream",
      traceConfig: {
        excludedCategories,
        includedCategories
      }
    });
  }
  /**
   * Stops a trace started with the `start` method.
   * @returns Promise which resolves to buffer with trace data.
   */
  async stop() {
    const contentDeferred = Deferred.create();
    this.#client.once("Tracing.tracingComplete", async (event) => {
      try {
        assert(event.stream, 'Missing "stream"');
        const readable = await getReadableFromProtocolStream(this.#client, event.stream);
        const typedArray = await getReadableAsTypedArray(readable, this.#path);
        contentDeferred.resolve(typedArray ?? void 0);
      } catch (error) {
        if (isErrorLike(error)) {
          contentDeferred.reject(error);
        } else {
          contentDeferred.reject(new Error(`Unknown error: ${error}`));
        }
      }
    });
    await this.#client.send("Tracing.end");
    this.#recording = false;
    return await contentDeferred.valueOrThrow();
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Dialog.js
init_cjs_shim();
var Dialog = class {
  #type;
  #message;
  #defaultValue;
  /**
   * @internal
   */
  handled = false;
  /**
   * @internal
   */
  constructor(type, message, defaultValue = "") {
    this.#type = type;
    this.#message = message;
    this.#defaultValue = defaultValue;
  }
  /**
   * The type of the dialog.
   */
  type() {
    return this.#type;
  }
  /**
   * The message displayed in the dialog.
   */
  message() {
    return this.#message;
  }
  /**
   * The default value of the prompt, or an empty string if the dialog
   * is not a `prompt`.
   */
  defaultValue() {
    return this.#defaultValue;
  }
  /**
   * A promise that resolves when the dialog has been accepted.
   *
   * @param promptText - optional text that will be entered in the dialog
   * prompt. Has no effect if the dialog's type is not `prompt`.
   *
   */
  async accept(promptText) {
    assert(!this.handled, "Cannot accept dialog which is already handled!");
    this.handled = true;
    await this.handle({
      accept: true,
      text: promptText
    });
  }
  /**
   * A promise which will resolve once the dialog has been dismissed
   */
  async dismiss() {
    assert(!this.handled, "Cannot dismiss dialog which is already handled!");
    this.handled = true;
    await this.handle({
      accept: false
    });
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/Target.js
init_cjs_shim();
var TargetType;
(function(TargetType2) {
  TargetType2["PAGE"] = "page";
  TargetType2["BACKGROUND_PAGE"] = "background_page";
  TargetType2["SERVICE_WORKER"] = "service_worker";
  TargetType2["SHARED_WORKER"] = "shared_worker";
  TargetType2["BROWSER"] = "browser";
  TargetType2["WEBVIEW"] = "webview";
  TargetType2["OTHER"] = "other";
  TargetType2["TAB"] = "tab";
})(TargetType || (TargetType = {}));
var Target = class {
  /**
   * @internal
   */
  constructor() {
  }
  /**
   * If the target is not of type `"service_worker"` or `"shared_worker"`, returns `null`.
   */
  async worker() {
    return null;
  }
  /**
   * If the target is not of type `"page"`, `"webview"` or `"background_page"`,
   * returns `null`.
   */
  async page() {
    return null;
  }
};

// node_modules/puppeteer-core/lib/esm/puppeteer/api/WebWorker.js
init_cjs_shim();
var WebWorker = class extends EventEmitter {
  /**
   * @internal
   */
  timeoutSettings = new TimeoutSettings();
  #url;
  /**
   * @internal
   */
  constructor(url) {
    super();
    this.#url = url;
  }
  /**
   * The URL of this web worker.
   */
  url() {
    return this.#url;
  }
  /**
   * Evaluates a given function in the {@link WebWorker | worker}.
   *
   * @remarks If the given function returns a promise,
   * {@link WebWorker.evaluate | evaluate} will wait for the promise to resolve.
   *
   * As a rule of thumb, if the return value of the given function is more
   * complicated than a JSON object (e.g. most classes), then
   * {@link WebWorker.evaluate | evaluate} will _likely_ return some truncated
   * value (or `{}`). This is because we are not returning the actual return
   * value, but a deserialized version as a result of transferring the return
   * value through a protocol to Puppeteer.
   *
   * In general, you should use
   * {@link WebWorker.evaluateHandle | evaluateHandle} if
   * {@link WebWorker.evaluate | evaluate} cannot serialize the return value
   * properly or you need a mutable {@link JSHandle | handle} to the return
   * object.
   *
   * @param func - Function to be evaluated.
   * @param args - Arguments to pass into `func`.
   * @returns The result of `func`.
   */
  async evaluate(func, ...args) {
    func = withSourcePuppeteerURLIfNone(this.evaluate.name, func);
    return await this.mainRealm().evaluate(func, ...args);
  }
  /**
   * Evaluates a given function in the {@link WebWorker | worker}.
   *
   * @remarks If the given function returns a promise,
   * {@link WebWorker.evaluate | evaluate} will wait for the promise to resolve.
   *
   * In general, you should use
   * {@link WebWorker.evaluateHandle | evaluateHandle} if
   * {@link WebWorker.evaluate | evaluate} cannot serialize the return value
   * properly or you need a mutable {@link JSHandle | handle} to the return
   * object.
   *
   * @param func - Function to be evaluated.
   * @param args - Arguments to pass into `func`.
   * @returns A {@link JSHandle | handle} to the return value of `func`.
   */
  async evaluateHandle(func, ...args) {
    func = withSourcePuppeteerURLIfNone(this.evaluateHandle.name, func);
    return await this.mainRealm().evaluateHandle(func, ...args);
  }
  async close() {
    throw new UnsupportedOperation("WebWorker.close() is not supported");
  }
};

export {
  from,
  of,
  lastValueFrom,
  firstValueFrom,
  map,
  combineLatest,
  defer,
  fromEvent,
  timer,
  filter,
  race,
  bufferCount,
  concatMap,
  delayWhen,
  first,
  raceWith,
  switchMap,
  takeUntil,
  tap,
  disposeSymbol,
  asyncDisposeSymbol,
  DisposableStack,
  AsyncDisposableStack,
  EventEmitter,
  isNode,
  environment,
  assert,
  stringToTypedArray,
  stringToBase64,
  debug,
  TimeoutError,
  TouchError,
  ProtocolError,
  UnsupportedOperation,
  TargetCloseError,
  debugError,
  DEFAULT_VIEWPORT,
  PuppeteerURL,
  withSourcePuppeteerURLIfNone,
  getSourcePuppeteerURLIfAvailable,
  isString,
  isPlainObject,
  isRegExp,
  isDate,
  evaluationString,
  getReadableAsTypedArray,
  getReadableFromProtocolStream,
  validateDialogType,
  timeout,
  UTILITY_WORLD_NAME,
  SOURCE_URL_REGEX,
  getSourceUrlComment,
  parsePDFOptions,
  fromEmitterEvent,
  fromAbortSignal,
  WEB_PERMISSION_TO_PROTOCOL_PERMISSION,
  Browser,
  Deferred,
  Mutex,
  BrowserContext,
  CDPSessionEvent,
  CDPSession,
  Dialog,
  isErrorLike,
  createProtocolErrorMessage,
  stringifyFunction,
  interpolateFunction,
  LazyArg,
  AsyncIterableUtil,
  ARIAQueryHandler,
  scriptInjector,
  customQueryHandlers,
  throwIfDisposed,
  inertIfDisposed,
  invokeAtMostOnceForArguments,
  guarded,
  bubble,
  JSHandle,
  bindIsolatedHandle,
  ElementHandle,
  FrameEvent,
  throwIfDetached,
  Frame,
  HTTPRequest,
  headersArray,
  STATUS_TEXTS,
  handleError,
  HTTPResponse,
  Keyboard,
  MouseButton,
  Mouse,
  Touchscreen,
  TimeoutSettings,
  Page,
  Realm,
  TargetType,
  Target,
  WebWorker,
  Accessibility,
  CallbackRegistry,
  ConsoleMessage,
  Coverage,
  EmulationManager,
  SecurityDetails,
  Tracing
};
/*! Bundled license information:

puppeteer-core/lib/esm/puppeteer/util/disposable.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/EventEmitter.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/environment.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/assert.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/encoding.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/Debug.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/Errors.js:
  (**
   * @license
   * Copyright 2018 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/PDFOptions.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/util.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/Deferred.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/Mutex.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/BrowserContext.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/ErrorLike.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/Function.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/LazyArg.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/ElementHandleSymbol.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/HandleIterator.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/QueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/cdp/AriaQueryHandler.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/ScriptInjector.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/decorators.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/JSHandle.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/CSSQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/CustomQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/PierceQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/PQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/PSelectorParser.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/TextQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/XPathQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/GetQueryHandler.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/ElementHandle.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/Frame.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/HTTPResponse.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/util/incremental-id-generator.js:
  (**
   * @license
   * Copyright 2024 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/Input.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/TimeoutSettings.js:
  (**
   * @license
   * Copyright 2019 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/Page.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/WaitTask.js:
  (**
   * @license
   * Copyright 2022 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/Realm.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/cdp/Accessibility.js:
  (**
   * @license
   * Copyright 2018 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/CallbackRegistry.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/ConsoleMessage.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/cdp/Coverage.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/common/SecurityDetails.js:
  (**
   * @license
   * Copyright 2020 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/Dialog.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/Target.js:
  (**
   * @license
   * Copyright 2023 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)

puppeteer-core/lib/esm/puppeteer/api/WebWorker.js:
  (**
   * @license
   * Copyright 2018 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
