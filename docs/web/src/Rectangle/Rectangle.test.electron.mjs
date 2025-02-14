import {
  assert,
  puppeteer_core_browser_default
} from "../../chunk-T3XNPSCC.mjs";
import "../../chunk-43DSNPFJ.mjs";
import "../../chunk-WZWH5UFM.mjs";
import "../../chunk-2CNFTRH6.mjs";
import {
  __commonJS,
  __toESM
} from "../../chunk-3KGMXYRN.mjs";

// ../testeranto/node_modules/graphology/dist/graphology.umd.js
var require_graphology_umd = __commonJS({
  "../testeranto/node_modules/graphology/dist/graphology.umd.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.graphology = factory());
    })(exports, function() {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2))
            return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2))
              return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, {
            constructor: {
              value: Wrapper,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function assignPolyfill() {
        var target = arguments[0];
        for (var i = 1, l = arguments.length; i < l; i++) {
          if (!arguments[i])
            continue;
          for (var k in arguments[i]) {
            target[k] = arguments[i][k];
          }
        }
        return target;
      }
      var assign = assignPolyfill;
      if (typeof Object.assign === "function")
        assign = Object.assign;
      function getMatchingEdge(graph, source, target, type) {
        var sourceData = graph._nodes.get(source);
        var edge = null;
        if (!sourceData)
          return edge;
        if (type === "mixed") {
          edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
        } else if (type === "directed") {
          edge = sourceData.out && sourceData.out[target];
        } else {
          edge = sourceData.undirected && sourceData.undirected[target];
        }
        return edge;
      }
      function isPlainObject(value) {
        return _typeof(value) === "object" && value !== null;
      }
      function isEmpty(o) {
        var k;
        for (k in o) {
          return false;
        }
        return true;
      }
      function privateProperty(target, name, value) {
        Object.defineProperty(target, name, {
          enumerable: false,
          configurable: false,
          writable: true,
          value
        });
      }
      function readOnlyProperty(target, name, value) {
        var descriptor = {
          enumerable: true,
          configurable: true
        };
        if (typeof value === "function") {
          descriptor.get = value;
        } else {
          descriptor.value = value;
          descriptor.writable = false;
        }
        Object.defineProperty(target, name, descriptor);
      }
      function validateHints(hints) {
        if (!isPlainObject(hints))
          return false;
        if (hints.attributes && !Array.isArray(hints.attributes))
          return false;
        return true;
      }
      function incrementalIdStartingFromRandomByte() {
        var i = Math.floor(Math.random() * 256) & 255;
        return function() {
          return i++;
        };
      }
      var events = { exports: {} };
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter() {
        EventEmitter.init.call(this);
      }
      events.exports = EventEmitter;
      events.exports.once = once;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.prototype._events = void 0;
      EventEmitter.prototype._eventsCount = 0;
      EventEmitter.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events2 = this._events;
        if (events2 !== void 0)
          doError = doError && events2.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events2[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events2;
        var existing;
        checkListener(listener);
        events2 = target._events;
        if (events2 === void 0) {
          events2 = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events2.newListener !== void 0) {
            target.emit("newListener", type, listener.listener ? listener.listener : listener);
            events2 = target._events;
          }
          existing = events2[type];
        }
        if (existing === void 0) {
          existing = events2[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener;
      EventEmitter.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = {
          fired: false,
          wrapFn: void 0,
          target,
          type,
          listener
        };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.removeListener = function removeListener(type, listener) {
        var list, events2, position, i, originalListener;
        checkListener(listener);
        events2 = this._events;
        if (events2 === void 0)
          return this;
        list = events2[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events2[type];
            if (events2.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events2[type] = list[0];
          if (events2.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events2, i;
        events2 = this._events;
        if (events2 === void 0)
          return this;
        if (events2.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events2[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events2[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events2);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events2[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events2 = target._events;
        if (events2 === void 0)
          return [];
        var evlistener = events2[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events2 = this._events;
        if (events2 !== void 0) {
          var evlistener = events2[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          eventTargetAgnosticAddListener(emitter, name, resolver, {
            once: true
          });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, {
              once: true
            });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
      function Iterator$2(next) {
        if (typeof next !== "function")
          throw new Error("obliterator/iterator: expecting a function!");
        this.next = next;
      }
      if (typeof Symbol !== "undefined")
        Iterator$2.prototype[Symbol.iterator] = function() {
          return this;
        };
      Iterator$2.of = function() {
        var args = arguments, l = args.length, i = 0;
        return new Iterator$2(function() {
          if (i >= l)
            return {
              done: true
            };
          return {
            done: false,
            value: args[i++]
          };
        });
      };
      Iterator$2.empty = function() {
        var iterator2 = new Iterator$2(function() {
          return {
            done: true
          };
        });
        return iterator2;
      };
      Iterator$2.fromSequence = function(sequence) {
        var i = 0, l = sequence.length;
        return new Iterator$2(function() {
          if (i >= l)
            return {
              done: true
            };
          return {
            done: false,
            value: sequence[i++]
          };
        });
      };
      Iterator$2.is = function(value) {
        if (value instanceof Iterator$2)
          return true;
        return typeof value === "object" && value !== null && typeof value.next === "function";
      };
      var iterator = Iterator$2;
      var support$1 = {};
      support$1.ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer !== "undefined";
      support$1.SYMBOL_SUPPORT = typeof Symbol !== "undefined";
      var Iterator$1 = iterator;
      var support = support$1;
      var ARRAY_BUFFER_SUPPORT = support.ARRAY_BUFFER_SUPPORT;
      var SYMBOL_SUPPORT = support.SYMBOL_SUPPORT;
      function iterOrNull(target) {
        if (typeof target === "string" || Array.isArray(target) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(target))
          return Iterator$1.fromSequence(target);
        if (typeof target !== "object" || target === null)
          return null;
        if (SYMBOL_SUPPORT && typeof target[Symbol.iterator] === "function")
          return target[Symbol.iterator]();
        if (typeof target.next === "function")
          return target;
        return null;
      }
      var iter$2 = function iter2(target) {
        var iterator2 = iterOrNull(target);
        if (!iterator2)
          throw new Error("obliterator: target is not iterable nor a valid iterator.");
        return iterator2;
      };
      var iter$1 = iter$2;
      var take = function take2(iterable, n) {
        var l = arguments.length > 1 ? n : Infinity, array = l !== Infinity ? new Array(l) : [], step, i = 0;
        var iterator2 = iter$1(iterable);
        while (true) {
          if (i === l)
            return array;
          step = iterator2.next();
          if (step.done) {
            if (i !== n)
              array.length = i;
            return array;
          }
          array[i++] = step.value;
        }
      };
      var GraphError = /* @__PURE__ */ function(_Error) {
        _inheritsLoose(GraphError2, _Error);
        function GraphError2(message) {
          var _this;
          _this = _Error.call(this) || this;
          _this.name = "GraphError";
          _this.message = message;
          return _this;
        }
        return GraphError2;
      }(/* @__PURE__ */ _wrapNativeSuper(Error));
      var InvalidArgumentsGraphError = /* @__PURE__ */ function(_GraphError) {
        _inheritsLoose(InvalidArgumentsGraphError2, _GraphError);
        function InvalidArgumentsGraphError2(message) {
          var _this2;
          _this2 = _GraphError.call(this, message) || this;
          _this2.name = "InvalidArgumentsGraphError";
          if (typeof Error.captureStackTrace === "function")
            Error.captureStackTrace(_assertThisInitialized(_this2), InvalidArgumentsGraphError2.prototype.constructor);
          return _this2;
        }
        return InvalidArgumentsGraphError2;
      }(GraphError);
      var NotFoundGraphError = /* @__PURE__ */ function(_GraphError2) {
        _inheritsLoose(NotFoundGraphError2, _GraphError2);
        function NotFoundGraphError2(message) {
          var _this3;
          _this3 = _GraphError2.call(this, message) || this;
          _this3.name = "NotFoundGraphError";
          if (typeof Error.captureStackTrace === "function")
            Error.captureStackTrace(_assertThisInitialized(_this3), NotFoundGraphError2.prototype.constructor);
          return _this3;
        }
        return NotFoundGraphError2;
      }(GraphError);
      var UsageGraphError = /* @__PURE__ */ function(_GraphError3) {
        _inheritsLoose(UsageGraphError2, _GraphError3);
        function UsageGraphError2(message) {
          var _this4;
          _this4 = _GraphError3.call(this, message) || this;
          _this4.name = "UsageGraphError";
          if (typeof Error.captureStackTrace === "function")
            Error.captureStackTrace(_assertThisInitialized(_this4), UsageGraphError2.prototype.constructor);
          return _this4;
        }
        return UsageGraphError2;
      }(GraphError);
      function MixedNodeData(key, attributes) {
        this.key = key;
        this.attributes = attributes;
        this.clear();
      }
      MixedNodeData.prototype.clear = function() {
        this.inDegree = 0;
        this.outDegree = 0;
        this.undirectedDegree = 0;
        this.undirectedLoops = 0;
        this.directedLoops = 0;
        this["in"] = {};
        this.out = {};
        this.undirected = {};
      };
      function DirectedNodeData(key, attributes) {
        this.key = key;
        this.attributes = attributes;
        this.clear();
      }
      DirectedNodeData.prototype.clear = function() {
        this.inDegree = 0;
        this.outDegree = 0;
        this.directedLoops = 0;
        this["in"] = {};
        this.out = {};
      };
      function UndirectedNodeData(key, attributes) {
        this.key = key;
        this.attributes = attributes;
        this.clear();
      }
      UndirectedNodeData.prototype.clear = function() {
        this.undirectedDegree = 0;
        this.undirectedLoops = 0;
        this.undirected = {};
      };
      function EdgeData(undirected2, key, source, target, attributes) {
        this.key = key;
        this.attributes = attributes;
        this.undirected = undirected2;
        this.source = source;
        this.target = target;
      }
      EdgeData.prototype.attach = function() {
        var outKey = "out";
        var inKey = "in";
        if (this.undirected)
          outKey = inKey = "undirected";
        var source = this.source.key;
        var target = this.target.key;
        this.source[outKey][target] = this;
        if (this.undirected && source === target)
          return;
        this.target[inKey][source] = this;
      };
      EdgeData.prototype.attachMulti = function() {
        var outKey = "out";
        var inKey = "in";
        var source = this.source.key;
        var target = this.target.key;
        if (this.undirected)
          outKey = inKey = "undirected";
        var adj = this.source[outKey];
        var head = adj[target];
        if (typeof head === "undefined") {
          adj[target] = this;
          if (!(this.undirected && source === target)) {
            this.target[inKey][source] = this;
          }
          return;
        }
        head.previous = this;
        this.next = head;
        adj[target] = this;
        this.target[inKey][source] = this;
      };
      EdgeData.prototype.detach = function() {
        var source = this.source.key;
        var target = this.target.key;
        var outKey = "out";
        var inKey = "in";
        if (this.undirected)
          outKey = inKey = "undirected";
        delete this.source[outKey][target];
        delete this.target[inKey][source];
      };
      EdgeData.prototype.detachMulti = function() {
        var source = this.source.key;
        var target = this.target.key;
        var outKey = "out";
        var inKey = "in";
        if (this.undirected)
          outKey = inKey = "undirected";
        if (this.previous === void 0) {
          if (this.next === void 0) {
            delete this.source[outKey][target];
            delete this.target[inKey][source];
          } else {
            this.next.previous = void 0;
            this.source[outKey][target] = this.next;
            this.target[inKey][source] = this.next;
          }
        } else {
          this.previous.next = this.next;
          if (this.next !== void 0) {
            this.next.previous = this.previous;
          }
        }
      };
      var NODE = 0;
      var SOURCE = 1;
      var TARGET = 2;
      var OPPOSITE = 3;
      function findRelevantNodeData(graph, method, mode, nodeOrEdge, nameOrEdge, add1, add2) {
        var nodeData, edgeData, arg1, arg2;
        nodeOrEdge = "" + nodeOrEdge;
        if (mode === NODE) {
          nodeData = graph._nodes.get(nodeOrEdge);
          if (!nodeData)
            throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(nodeOrEdge, '" node in the graph.'));
          arg1 = nameOrEdge;
          arg2 = add1;
        } else if (mode === OPPOSITE) {
          nameOrEdge = "" + nameOrEdge;
          edgeData = graph._edges.get(nameOrEdge);
          if (!edgeData)
            throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(nameOrEdge, '" edge in the graph.'));
          var source = edgeData.source.key;
          var target = edgeData.target.key;
          if (nodeOrEdge === source) {
            nodeData = edgeData.target;
          } else if (nodeOrEdge === target) {
            nodeData = edgeData.source;
          } else {
            throw new NotFoundGraphError("Graph.".concat(method, ': the "').concat(nodeOrEdge, '" node is not attached to the "').concat(nameOrEdge, '" edge (').concat(source, ", ").concat(target, ")."));
          }
          arg1 = add1;
          arg2 = add2;
        } else {
          edgeData = graph._edges.get(nodeOrEdge);
          if (!edgeData)
            throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(nodeOrEdge, '" edge in the graph.'));
          if (mode === SOURCE) {
            nodeData = edgeData.source;
          } else {
            nodeData = edgeData.target;
          }
          arg1 = nameOrEdge;
          arg2 = add1;
        }
        return [nodeData, arg1, arg2];
      }
      function attachNodeAttributeGetter(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
          var _findRelevantNodeData = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1), data = _findRelevantNodeData[0], name = _findRelevantNodeData[1];
          return data.attributes[name];
        };
      }
      function attachNodeAttributesGetter(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge) {
          var _findRelevantNodeData2 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge), data = _findRelevantNodeData2[0];
          return data.attributes;
        };
      }
      function attachNodeAttributeChecker(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
          var _findRelevantNodeData3 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1), data = _findRelevantNodeData3[0], name = _findRelevantNodeData3[1];
          return data.attributes.hasOwnProperty(name);
        };
      }
      function attachNodeAttributeSetter(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1, add2) {
          var _findRelevantNodeData4 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1, add2), data = _findRelevantNodeData4[0], name = _findRelevantNodeData4[1], value = _findRelevantNodeData4[2];
          data.attributes[name] = value;
          this.emit("nodeAttributesUpdated", {
            key: data.key,
            type: "set",
            attributes: data.attributes,
            name
          });
          return this;
        };
      }
      function attachNodeAttributeUpdater(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1, add2) {
          var _findRelevantNodeData5 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1, add2), data = _findRelevantNodeData5[0], name = _findRelevantNodeData5[1], updater = _findRelevantNodeData5[2];
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": updater should be a function."));
          var attributes = data.attributes;
          var value = updater(attributes[name]);
          attributes[name] = value;
          this.emit("nodeAttributesUpdated", {
            key: data.key,
            type: "set",
            attributes: data.attributes,
            name
          });
          return this;
        };
      }
      function attachNodeAttributeRemover(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
          var _findRelevantNodeData6 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1), data = _findRelevantNodeData6[0], name = _findRelevantNodeData6[1];
          delete data.attributes[name];
          this.emit("nodeAttributesUpdated", {
            key: data.key,
            type: "remove",
            attributes: data.attributes,
            name
          });
          return this;
        };
      }
      function attachNodeAttributesReplacer(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
          var _findRelevantNodeData7 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1), data = _findRelevantNodeData7[0], attributes = _findRelevantNodeData7[1];
          if (!isPlainObject(attributes))
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
          data.attributes = attributes;
          this.emit("nodeAttributesUpdated", {
            key: data.key,
            type: "replace",
            attributes: data.attributes
          });
          return this;
        };
      }
      function attachNodeAttributesMerger(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
          var _findRelevantNodeData8 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1), data = _findRelevantNodeData8[0], attributes = _findRelevantNodeData8[1];
          if (!isPlainObject(attributes))
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
          assign(data.attributes, attributes);
          this.emit("nodeAttributesUpdated", {
            key: data.key,
            type: "merge",
            attributes: data.attributes,
            data: attributes
          });
          return this;
        };
      }
      function attachNodeAttributesUpdater(Class, method, mode) {
        Class.prototype[method] = function(nodeOrEdge, nameOrEdge, add1) {
          var _findRelevantNodeData9 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1), data = _findRelevantNodeData9[0], updater = _findRelevantNodeData9[1];
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided updater is not a function."));
          data.attributes = updater(data.attributes);
          this.emit("nodeAttributesUpdated", {
            key: data.key,
            type: "update",
            attributes: data.attributes
          });
          return this;
        };
      }
      var NODE_ATTRIBUTES_METHODS = [{
        name: function name(element) {
          return "get".concat(element, "Attribute");
        },
        attacher: attachNodeAttributeGetter
      }, {
        name: function name(element) {
          return "get".concat(element, "Attributes");
        },
        attacher: attachNodeAttributesGetter
      }, {
        name: function name(element) {
          return "has".concat(element, "Attribute");
        },
        attacher: attachNodeAttributeChecker
      }, {
        name: function name(element) {
          return "set".concat(element, "Attribute");
        },
        attacher: attachNodeAttributeSetter
      }, {
        name: function name(element) {
          return "update".concat(element, "Attribute");
        },
        attacher: attachNodeAttributeUpdater
      }, {
        name: function name(element) {
          return "remove".concat(element, "Attribute");
        },
        attacher: attachNodeAttributeRemover
      }, {
        name: function name(element) {
          return "replace".concat(element, "Attributes");
        },
        attacher: attachNodeAttributesReplacer
      }, {
        name: function name(element) {
          return "merge".concat(element, "Attributes");
        },
        attacher: attachNodeAttributesMerger
      }, {
        name: function name(element) {
          return "update".concat(element, "Attributes");
        },
        attacher: attachNodeAttributesUpdater
      }];
      function attachNodeAttributesMethods(Graph3) {
        NODE_ATTRIBUTES_METHODS.forEach(function(_ref) {
          var name = _ref.name, attacher = _ref.attacher;
          attacher(Graph3, name("Node"), NODE);
          attacher(Graph3, name("Source"), SOURCE);
          attacher(Graph3, name("Target"), TARGET);
          attacher(Graph3, name("Opposite"), OPPOSITE);
        });
      }
      function attachEdgeAttributeGetter(Class, method, type) {
        Class.prototype[method] = function(element, name) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element;
            var target = "" + name;
            name = arguments[2];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          return data.attributes[name];
        };
      }
      function attachEdgeAttributesGetter(Class, method, type) {
        Class.prototype[method] = function(element) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 1) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element, target = "" + arguments[1];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          return data.attributes;
        };
      }
      function attachEdgeAttributeChecker(Class, method, type) {
        Class.prototype[method] = function(element, name) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element;
            var target = "" + name;
            name = arguments[2];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          return data.attributes.hasOwnProperty(name);
        };
      }
      function attachEdgeAttributeSetter(Class, method, type) {
        Class.prototype[method] = function(element, name, value) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 3) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element;
            var target = "" + name;
            name = arguments[2];
            value = arguments[3];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          data.attributes[name] = value;
          this.emit("edgeAttributesUpdated", {
            key: data.key,
            type: "set",
            attributes: data.attributes,
            name
          });
          return this;
        };
      }
      function attachEdgeAttributeUpdater(Class, method, type) {
        Class.prototype[method] = function(element, name, updater) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 3) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element;
            var target = "" + name;
            name = arguments[2];
            updater = arguments[3];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": updater should be a function."));
          data.attributes[name] = updater(data.attributes[name]);
          this.emit("edgeAttributesUpdated", {
            key: data.key,
            type: "set",
            attributes: data.attributes,
            name
          });
          return this;
        };
      }
      function attachEdgeAttributeRemover(Class, method, type) {
        Class.prototype[method] = function(element, name) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element;
            var target = "" + name;
            name = arguments[2];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          delete data.attributes[name];
          this.emit("edgeAttributesUpdated", {
            key: data.key,
            type: "remove",
            attributes: data.attributes,
            name
          });
          return this;
        };
      }
      function attachEdgeAttributesReplacer(Class, method, type) {
        Class.prototype[method] = function(element, attributes) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element, target = "" + attributes;
            attributes = arguments[2];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          if (!isPlainObject(attributes))
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
          data.attributes = attributes;
          this.emit("edgeAttributesUpdated", {
            key: data.key,
            type: "replace",
            attributes: data.attributes
          });
          return this;
        };
      }
      function attachEdgeAttributesMerger(Class, method, type) {
        Class.prototype[method] = function(element, attributes) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element, target = "" + attributes;
            attributes = arguments[2];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          if (!isPlainObject(attributes))
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
          assign(data.attributes, attributes);
          this.emit("edgeAttributesUpdated", {
            key: data.key,
            type: "merge",
            attributes: data.attributes,
            data: attributes
          });
          return this;
        };
      }
      function attachEdgeAttributesUpdater(Class, method, type) {
        Class.prototype[method] = function(element, updater) {
          var data;
          if (this.type !== "mixed" && type !== "mixed" && type !== this.type)
            throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var source = "" + element, target = "" + updater;
            updater = arguments[2];
            data = getMatchingEdge(this, source, target, type);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find an edge for the given path ("').concat(source, '" - "').concat(target, '").'));
          } else {
            if (type !== "mixed")
              throw new UsageGraphError("Graph.".concat(method, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            element = "" + element;
            data = this._edges.get(element);
            if (!data)
              throw new NotFoundGraphError("Graph.".concat(method, ': could not find the "').concat(element, '" edge in the graph.'));
          }
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided updater is not a function."));
          data.attributes = updater(data.attributes);
          this.emit("edgeAttributesUpdated", {
            key: data.key,
            type: "update",
            attributes: data.attributes
          });
          return this;
        };
      }
      var EDGE_ATTRIBUTES_METHODS = [{
        name: function name(element) {
          return "get".concat(element, "Attribute");
        },
        attacher: attachEdgeAttributeGetter
      }, {
        name: function name(element) {
          return "get".concat(element, "Attributes");
        },
        attacher: attachEdgeAttributesGetter
      }, {
        name: function name(element) {
          return "has".concat(element, "Attribute");
        },
        attacher: attachEdgeAttributeChecker
      }, {
        name: function name(element) {
          return "set".concat(element, "Attribute");
        },
        attacher: attachEdgeAttributeSetter
      }, {
        name: function name(element) {
          return "update".concat(element, "Attribute");
        },
        attacher: attachEdgeAttributeUpdater
      }, {
        name: function name(element) {
          return "remove".concat(element, "Attribute");
        },
        attacher: attachEdgeAttributeRemover
      }, {
        name: function name(element) {
          return "replace".concat(element, "Attributes");
        },
        attacher: attachEdgeAttributesReplacer
      }, {
        name: function name(element) {
          return "merge".concat(element, "Attributes");
        },
        attacher: attachEdgeAttributesMerger
      }, {
        name: function name(element) {
          return "update".concat(element, "Attributes");
        },
        attacher: attachEdgeAttributesUpdater
      }];
      function attachEdgeAttributesMethods(Graph3) {
        EDGE_ATTRIBUTES_METHODS.forEach(function(_ref) {
          var name = _ref.name, attacher = _ref.attacher;
          attacher(Graph3, name("Edge"), "mixed");
          attacher(Graph3, name("DirectedEdge"), "directed");
          attacher(Graph3, name("UndirectedEdge"), "undirected");
        });
      }
      var Iterator = iterator;
      var iter = iter$2;
      var chain = function chain2() {
        var iterables = arguments;
        var current = null;
        var i = -1;
        return new Iterator(function next() {
          var step = null;
          do {
            if (current === null) {
              i++;
              if (i >= iterables.length)
                return {
                  done: true
                };
              current = iter(iterables[i]);
            }
            step = current.next();
            if (step.done === true) {
              current = null;
              continue;
            }
            break;
          } while (true);
          return step;
        });
      };
      var EDGES_ITERATION = [{
        name: "edges",
        type: "mixed"
      }, {
        name: "inEdges",
        type: "directed",
        direction: "in"
      }, {
        name: "outEdges",
        type: "directed",
        direction: "out"
      }, {
        name: "inboundEdges",
        type: "mixed",
        direction: "in"
      }, {
        name: "outboundEdges",
        type: "mixed",
        direction: "out"
      }, {
        name: "directedEdges",
        type: "directed"
      }, {
        name: "undirectedEdges",
        type: "undirected"
      }];
      function forEachSimple(breakable, object, callback, avoid) {
        var shouldBreak = false;
        for (var k in object) {
          if (k === avoid)
            continue;
          var edgeData = object[k];
          shouldBreak = callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
          if (breakable && shouldBreak)
            return edgeData.key;
        }
        return;
      }
      function forEachMulti(breakable, object, callback, avoid) {
        var edgeData, source, target;
        var shouldBreak = false;
        for (var k in object) {
          if (k === avoid)
            continue;
          edgeData = object[k];
          do {
            source = edgeData.source;
            target = edgeData.target;
            shouldBreak = callback(edgeData.key, edgeData.attributes, source.key, target.key, source.attributes, target.attributes, edgeData.undirected);
            if (breakable && shouldBreak)
              return edgeData.key;
            edgeData = edgeData.next;
          } while (edgeData !== void 0);
        }
        return;
      }
      function createIterator(object, avoid) {
        var keys = Object.keys(object);
        var l = keys.length;
        var edgeData;
        var i = 0;
        return new iterator(function next() {
          do {
            if (!edgeData) {
              if (i >= l)
                return {
                  done: true
                };
              var k = keys[i++];
              if (k === avoid) {
                edgeData = void 0;
                continue;
              }
              edgeData = object[k];
            } else {
              edgeData = edgeData.next;
            }
          } while (!edgeData);
          return {
            done: false,
            value: {
              edge: edgeData.key,
              attributes: edgeData.attributes,
              source: edgeData.source.key,
              target: edgeData.target.key,
              sourceAttributes: edgeData.source.attributes,
              targetAttributes: edgeData.target.attributes,
              undirected: edgeData.undirected
            }
          };
        });
      }
      function forEachForKeySimple(breakable, object, k, callback) {
        var edgeData = object[k];
        if (!edgeData)
          return;
        var sourceData = edgeData.source;
        var targetData = edgeData.target;
        if (callback(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected) && breakable)
          return edgeData.key;
      }
      function forEachForKeyMulti(breakable, object, k, callback) {
        var edgeData = object[k];
        if (!edgeData)
          return;
        var shouldBreak = false;
        do {
          shouldBreak = callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
          if (breakable && shouldBreak)
            return edgeData.key;
          edgeData = edgeData.next;
        } while (edgeData !== void 0);
        return;
      }
      function createIteratorForKey(object, k) {
        var edgeData = object[k];
        if (edgeData.next !== void 0) {
          return new iterator(function() {
            if (!edgeData)
              return {
                done: true
              };
            var value = {
              edge: edgeData.key,
              attributes: edgeData.attributes,
              source: edgeData.source.key,
              target: edgeData.target.key,
              sourceAttributes: edgeData.source.attributes,
              targetAttributes: edgeData.target.attributes,
              undirected: edgeData.undirected
            };
            edgeData = edgeData.next;
            return {
              done: false,
              value
            };
          });
        }
        return iterator.of({
          edge: edgeData.key,
          attributes: edgeData.attributes,
          source: edgeData.source.key,
          target: edgeData.target.key,
          sourceAttributes: edgeData.source.attributes,
          targetAttributes: edgeData.target.attributes,
          undirected: edgeData.undirected
        });
      }
      function createEdgeArray(graph, type) {
        if (graph.size === 0)
          return [];
        if (type === "mixed" || type === graph.type) {
          if (typeof Array.from === "function")
            return Array.from(graph._edges.keys());
          return take(graph._edges.keys(), graph._edges.size);
        }
        var size = type === "undirected" ? graph.undirectedSize : graph.directedSize;
        var list = new Array(size), mask = type === "undirected";
        var iterator2 = graph._edges.values();
        var i = 0;
        var step, data;
        while (step = iterator2.next(), step.done !== true) {
          data = step.value;
          if (data.undirected === mask)
            list[i++] = data.key;
        }
        return list;
      }
      function forEachEdge(breakable, graph, type, callback) {
        if (graph.size === 0)
          return;
        var shouldFilter = type !== "mixed" && type !== graph.type;
        var mask = type === "undirected";
        var step, data;
        var shouldBreak = false;
        var iterator2 = graph._edges.values();
        while (step = iterator2.next(), step.done !== true) {
          data = step.value;
          if (shouldFilter && data.undirected !== mask)
            continue;
          var _data = data, key = _data.key, attributes = _data.attributes, source = _data.source, target = _data.target;
          shouldBreak = callback(key, attributes, source.key, target.key, source.attributes, target.attributes, data.undirected);
          if (breakable && shouldBreak)
            return key;
        }
        return;
      }
      function createEdgeIterator(graph, type) {
        if (graph.size === 0)
          return iterator.empty();
        var shouldFilter = type !== "mixed" && type !== graph.type;
        var mask = type === "undirected";
        var iterator$1 = graph._edges.values();
        return new iterator(function next() {
          var step, data;
          while (true) {
            step = iterator$1.next();
            if (step.done)
              return step;
            data = step.value;
            if (shouldFilter && data.undirected !== mask)
              continue;
            break;
          }
          var value = {
            edge: data.key,
            attributes: data.attributes,
            source: data.source.key,
            target: data.target.key,
            sourceAttributes: data.source.attributes,
            targetAttributes: data.target.attributes,
            undirected: data.undirected
          };
          return {
            value,
            done: false
          };
        });
      }
      function forEachEdgeForNode(breakable, multi, type, direction, nodeData, callback) {
        var fn = multi ? forEachMulti : forEachSimple;
        var found;
        if (type !== "undirected") {
          if (direction !== "out") {
            found = fn(breakable, nodeData["in"], callback);
            if (breakable && found)
              return found;
          }
          if (direction !== "in") {
            found = fn(breakable, nodeData.out, callback, !direction ? nodeData.key : void 0);
            if (breakable && found)
              return found;
          }
        }
        if (type !== "directed") {
          found = fn(breakable, nodeData.undirected, callback);
          if (breakable && found)
            return found;
        }
        return;
      }
      function createEdgeArrayForNode(multi, type, direction, nodeData) {
        var edges = [];
        forEachEdgeForNode(false, multi, type, direction, nodeData, function(key) {
          edges.push(key);
        });
        return edges;
      }
      function createEdgeIteratorForNode(type, direction, nodeData) {
        var iterator$1 = iterator.empty();
        if (type !== "undirected") {
          if (direction !== "out" && typeof nodeData["in"] !== "undefined")
            iterator$1 = chain(iterator$1, createIterator(nodeData["in"]));
          if (direction !== "in" && typeof nodeData.out !== "undefined")
            iterator$1 = chain(iterator$1, createIterator(nodeData.out, !direction ? nodeData.key : void 0));
        }
        if (type !== "directed" && typeof nodeData.undirected !== "undefined") {
          iterator$1 = chain(iterator$1, createIterator(nodeData.undirected));
        }
        return iterator$1;
      }
      function forEachEdgeForPath(breakable, type, multi, direction, sourceData, target, callback) {
        var fn = multi ? forEachForKeyMulti : forEachForKeySimple;
        var found;
        if (type !== "undirected") {
          if (typeof sourceData["in"] !== "undefined" && direction !== "out") {
            found = fn(breakable, sourceData["in"], target, callback);
            if (breakable && found)
              return found;
          }
          if (typeof sourceData.out !== "undefined" && direction !== "in" && (direction || sourceData.key !== target)) {
            found = fn(breakable, sourceData.out, target, callback);
            if (breakable && found)
              return found;
          }
        }
        if (type !== "directed") {
          if (typeof sourceData.undirected !== "undefined") {
            found = fn(breakable, sourceData.undirected, target, callback);
            if (breakable && found)
              return found;
          }
        }
        return;
      }
      function createEdgeArrayForPath(type, multi, direction, sourceData, target) {
        var edges = [];
        forEachEdgeForPath(false, type, multi, direction, sourceData, target, function(key) {
          edges.push(key);
        });
        return edges;
      }
      function createEdgeIteratorForPath(type, direction, sourceData, target) {
        var iterator$1 = iterator.empty();
        if (type !== "undirected") {
          if (typeof sourceData["in"] !== "undefined" && direction !== "out" && target in sourceData["in"])
            iterator$1 = chain(iterator$1, createIteratorForKey(sourceData["in"], target));
          if (typeof sourceData.out !== "undefined" && direction !== "in" && target in sourceData.out && (direction || sourceData.key !== target))
            iterator$1 = chain(iterator$1, createIteratorForKey(sourceData.out, target));
        }
        if (type !== "directed") {
          if (typeof sourceData.undirected !== "undefined" && target in sourceData.undirected)
            iterator$1 = chain(iterator$1, createIteratorForKey(sourceData.undirected, target));
        }
        return iterator$1;
      }
      function attachEdgeArrayCreator(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        Class.prototype[name] = function(source, target) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return [];
          if (!arguments.length)
            return createEdgeArray(this, type);
          if (arguments.length === 1) {
            source = "" + source;
            var nodeData = this._nodes.get(source);
            if (typeof nodeData === "undefined")
              throw new NotFoundGraphError("Graph.".concat(name, ': could not find the "').concat(source, '" node in the graph.'));
            return createEdgeArrayForNode(this.multi, type === "mixed" ? this.type : type, direction, nodeData);
          }
          if (arguments.length === 2) {
            source = "" + source;
            target = "" + target;
            var sourceData = this._nodes.get(source);
            if (!sourceData)
              throw new NotFoundGraphError("Graph.".concat(name, ':  could not find the "').concat(source, '" source node in the graph.'));
            if (!this._nodes.has(target))
              throw new NotFoundGraphError("Graph.".concat(name, ':  could not find the "').concat(target, '" target node in the graph.'));
            return createEdgeArrayForPath(type, this.multi, direction, sourceData, target);
          }
          throw new InvalidArgumentsGraphError("Graph.".concat(name, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
        };
      }
      function attachForEachEdge(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        var forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
        Class.prototype[forEachName] = function(source, target, callback) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return;
          if (arguments.length === 1) {
            callback = source;
            return forEachEdge(false, this, type, callback);
          }
          if (arguments.length === 2) {
            source = "" + source;
            callback = target;
            var nodeData = this._nodes.get(source);
            if (typeof nodeData === "undefined")
              throw new NotFoundGraphError("Graph.".concat(forEachName, ': could not find the "').concat(source, '" node in the graph.'));
            return forEachEdgeForNode(false, this.multi, type === "mixed" ? this.type : type, direction, nodeData, callback);
          }
          if (arguments.length === 3) {
            source = "" + source;
            target = "" + target;
            var sourceData = this._nodes.get(source);
            if (!sourceData)
              throw new NotFoundGraphError("Graph.".concat(forEachName, ':  could not find the "').concat(source, '" source node in the graph.'));
            if (!this._nodes.has(target))
              throw new NotFoundGraphError("Graph.".concat(forEachName, ':  could not find the "').concat(target, '" target node in the graph.'));
            return forEachEdgeForPath(false, type, this.multi, direction, sourceData, target, callback);
          }
          throw new InvalidArgumentsGraphError("Graph.".concat(forEachName, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
        };
        var mapName = "map" + name[0].toUpperCase() + name.slice(1);
        Class.prototype[mapName] = function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          var result;
          if (args.length === 0) {
            var length = 0;
            if (type !== "directed")
              length += this.undirectedSize;
            if (type !== "undirected")
              length += this.directedSize;
            result = new Array(length);
            var i = 0;
            args.push(function(e, ea, s, t, sa, ta, u) {
              result[i++] = callback(e, ea, s, t, sa, ta, u);
            });
          } else {
            result = [];
            args.push(function(e, ea, s, t, sa, ta, u) {
              result.push(callback(e, ea, s, t, sa, ta, u));
            });
          }
          this[forEachName].apply(this, args);
          return result;
        };
        var filterName = "filter" + name[0].toUpperCase() + name.slice(1);
        Class.prototype[filterName] = function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          var result = [];
          args.push(function(e, ea, s, t, sa, ta, u) {
            if (callback(e, ea, s, t, sa, ta, u))
              result.push(e);
          });
          this[forEachName].apply(this, args);
          return result;
        };
        var reduceName = "reduce" + name[0].toUpperCase() + name.slice(1);
        Class.prototype[reduceName] = function() {
          var args = Array.prototype.slice.call(arguments);
          if (args.length < 2 || args.length > 4) {
            throw new InvalidArgumentsGraphError("Graph.".concat(reduceName, ": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(args.length, ")."));
          }
          if (typeof args[args.length - 1] === "function" && typeof args[args.length - 2] !== "function") {
            throw new InvalidArgumentsGraphError("Graph.".concat(reduceName, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
          }
          var callback;
          var initialValue;
          if (args.length === 2) {
            callback = args[0];
            initialValue = args[1];
            args = [];
          } else if (args.length === 3) {
            callback = args[1];
            initialValue = args[2];
            args = [args[0]];
          } else if (args.length === 4) {
            callback = args[2];
            initialValue = args[3];
            args = [args[0], args[1]];
          }
          var accumulator = initialValue;
          args.push(function(e, ea, s, t, sa, ta, u) {
            accumulator = callback(accumulator, e, ea, s, t, sa, ta, u);
          });
          this[forEachName].apply(this, args);
          return accumulator;
        };
      }
      function attachFindEdge(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        var findEdgeName = "find" + name[0].toUpperCase() + name.slice(1, -1);
        Class.prototype[findEdgeName] = function(source, target, callback) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return false;
          if (arguments.length === 1) {
            callback = source;
            return forEachEdge(true, this, type, callback);
          }
          if (arguments.length === 2) {
            source = "" + source;
            callback = target;
            var nodeData = this._nodes.get(source);
            if (typeof nodeData === "undefined")
              throw new NotFoundGraphError("Graph.".concat(findEdgeName, ': could not find the "').concat(source, '" node in the graph.'));
            return forEachEdgeForNode(true, this.multi, type === "mixed" ? this.type : type, direction, nodeData, callback);
          }
          if (arguments.length === 3) {
            source = "" + source;
            target = "" + target;
            var sourceData = this._nodes.get(source);
            if (!sourceData)
              throw new NotFoundGraphError("Graph.".concat(findEdgeName, ':  could not find the "').concat(source, '" source node in the graph.'));
            if (!this._nodes.has(target))
              throw new NotFoundGraphError("Graph.".concat(findEdgeName, ':  could not find the "').concat(target, '" target node in the graph.'));
            return forEachEdgeForPath(true, type, this.multi, direction, sourceData, target, callback);
          }
          throw new InvalidArgumentsGraphError("Graph.".concat(findEdgeName, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
        };
        var someName = "some" + name[0].toUpperCase() + name.slice(1, -1);
        Class.prototype[someName] = function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          args.push(function(e, ea, s, t, sa, ta, u) {
            return callback(e, ea, s, t, sa, ta, u);
          });
          var found = this[findEdgeName].apply(this, args);
          if (found)
            return true;
          return false;
        };
        var everyName = "every" + name[0].toUpperCase() + name.slice(1, -1);
        Class.prototype[everyName] = function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          args.push(function(e, ea, s, t, sa, ta, u) {
            return !callback(e, ea, s, t, sa, ta, u);
          });
          var found = this[findEdgeName].apply(this, args);
          if (found)
            return false;
          return true;
        };
      }
      function attachEdgeIteratorCreator(Class, description) {
        var originalName = description.name, type = description.type, direction = description.direction;
        var name = originalName.slice(0, -1) + "Entries";
        Class.prototype[name] = function(source, target) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return iterator.empty();
          if (!arguments.length)
            return createEdgeIterator(this, type);
          if (arguments.length === 1) {
            source = "" + source;
            var sourceData = this._nodes.get(source);
            if (!sourceData)
              throw new NotFoundGraphError("Graph.".concat(name, ': could not find the "').concat(source, '" node in the graph.'));
            return createEdgeIteratorForNode(type, direction, sourceData);
          }
          if (arguments.length === 2) {
            source = "" + source;
            target = "" + target;
            var _sourceData = this._nodes.get(source);
            if (!_sourceData)
              throw new NotFoundGraphError("Graph.".concat(name, ':  could not find the "').concat(source, '" source node in the graph.'));
            if (!this._nodes.has(target))
              throw new NotFoundGraphError("Graph.".concat(name, ':  could not find the "').concat(target, '" target node in the graph.'));
            return createEdgeIteratorForPath(type, direction, _sourceData, target);
          }
          throw new InvalidArgumentsGraphError("Graph.".concat(name, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
        };
      }
      function attachEdgeIterationMethods(Graph3) {
        EDGES_ITERATION.forEach(function(description) {
          attachEdgeArrayCreator(Graph3, description);
          attachForEachEdge(Graph3, description);
          attachFindEdge(Graph3, description);
          attachEdgeIteratorCreator(Graph3, description);
        });
      }
      var NEIGHBORS_ITERATION = [{
        name: "neighbors",
        type: "mixed"
      }, {
        name: "inNeighbors",
        type: "directed",
        direction: "in"
      }, {
        name: "outNeighbors",
        type: "directed",
        direction: "out"
      }, {
        name: "inboundNeighbors",
        type: "mixed",
        direction: "in"
      }, {
        name: "outboundNeighbors",
        type: "mixed",
        direction: "out"
      }, {
        name: "directedNeighbors",
        type: "directed"
      }, {
        name: "undirectedNeighbors",
        type: "undirected"
      }];
      function CompositeSetWrapper() {
        this.A = null;
        this.B = null;
      }
      CompositeSetWrapper.prototype.wrap = function(set) {
        if (this.A === null)
          this.A = set;
        else if (this.B === null)
          this.B = set;
      };
      CompositeSetWrapper.prototype.has = function(key) {
        if (this.A !== null && key in this.A)
          return true;
        if (this.B !== null && key in this.B)
          return true;
        return false;
      };
      function forEachInObjectOnce(breakable, visited, nodeData, object, callback) {
        for (var k in object) {
          var edgeData = object[k];
          var sourceData = edgeData.source;
          var targetData = edgeData.target;
          var neighborData = sourceData === nodeData ? targetData : sourceData;
          if (visited && visited.has(neighborData.key))
            continue;
          var shouldBreak = callback(neighborData.key, neighborData.attributes);
          if (breakable && shouldBreak)
            return neighborData.key;
        }
        return;
      }
      function forEachNeighbor(breakable, type, direction, nodeData, callback) {
        if (type !== "mixed") {
          if (type === "undirected")
            return forEachInObjectOnce(breakable, null, nodeData, nodeData.undirected, callback);
          if (typeof direction === "string")
            return forEachInObjectOnce(breakable, null, nodeData, nodeData[direction], callback);
        }
        var visited = new CompositeSetWrapper();
        var found;
        if (type !== "undirected") {
          if (direction !== "out") {
            found = forEachInObjectOnce(breakable, null, nodeData, nodeData["in"], callback);
            if (breakable && found)
              return found;
            visited.wrap(nodeData["in"]);
          }
          if (direction !== "in") {
            found = forEachInObjectOnce(breakable, visited, nodeData, nodeData.out, callback);
            if (breakable && found)
              return found;
            visited.wrap(nodeData.out);
          }
        }
        if (type !== "directed") {
          found = forEachInObjectOnce(breakable, visited, nodeData, nodeData.undirected, callback);
          if (breakable && found)
            return found;
        }
        return;
      }
      function createNeighborArrayForNode(type, direction, nodeData) {
        if (type !== "mixed") {
          if (type === "undirected")
            return Object.keys(nodeData.undirected);
          if (typeof direction === "string")
            return Object.keys(nodeData[direction]);
        }
        var neighbors = [];
        forEachNeighbor(false, type, direction, nodeData, function(key) {
          neighbors.push(key);
        });
        return neighbors;
      }
      function createDedupedObjectIterator(visited, nodeData, object) {
        var keys = Object.keys(object);
        var l = keys.length;
        var i = 0;
        return new iterator(function next() {
          var neighborData = null;
          do {
            if (i >= l) {
              if (visited)
                visited.wrap(object);
              return {
                done: true
              };
            }
            var edgeData = object[keys[i++]];
            var sourceData = edgeData.source;
            var targetData = edgeData.target;
            neighborData = sourceData === nodeData ? targetData : sourceData;
            if (visited && visited.has(neighborData.key)) {
              neighborData = null;
              continue;
            }
          } while (neighborData === null);
          return {
            done: false,
            value: {
              neighbor: neighborData.key,
              attributes: neighborData.attributes
            }
          };
        });
      }
      function createNeighborIterator(type, direction, nodeData) {
        if (type !== "mixed") {
          if (type === "undirected")
            return createDedupedObjectIterator(null, nodeData, nodeData.undirected);
          if (typeof direction === "string")
            return createDedupedObjectIterator(null, nodeData, nodeData[direction]);
        }
        var iterator$1 = iterator.empty();
        var visited = new CompositeSetWrapper();
        if (type !== "undirected") {
          if (direction !== "out") {
            iterator$1 = chain(iterator$1, createDedupedObjectIterator(visited, nodeData, nodeData["in"]));
          }
          if (direction !== "in") {
            iterator$1 = chain(iterator$1, createDedupedObjectIterator(visited, nodeData, nodeData.out));
          }
        }
        if (type !== "directed") {
          iterator$1 = chain(iterator$1, createDedupedObjectIterator(visited, nodeData, nodeData.undirected));
        }
        return iterator$1;
      }
      function attachNeighborArrayCreator(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        Class.prototype[name] = function(node) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return [];
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (typeof nodeData === "undefined")
            throw new NotFoundGraphError("Graph.".concat(name, ': could not find the "').concat(node, '" node in the graph.'));
          return createNeighborArrayForNode(type === "mixed" ? this.type : type, direction, nodeData);
        };
      }
      function attachForEachNeighbor(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        var forEachName = "forEach" + name[0].toUpperCase() + name.slice(1, -1);
        Class.prototype[forEachName] = function(node, callback) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return;
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (typeof nodeData === "undefined")
            throw new NotFoundGraphError("Graph.".concat(forEachName, ': could not find the "').concat(node, '" node in the graph.'));
          forEachNeighbor(false, type === "mixed" ? this.type : type, direction, nodeData, callback);
        };
        var mapName = "map" + name[0].toUpperCase() + name.slice(1);
        Class.prototype[mapName] = function(node, callback) {
          var result = [];
          this[forEachName](node, function(n, a) {
            result.push(callback(n, a));
          });
          return result;
        };
        var filterName = "filter" + name[0].toUpperCase() + name.slice(1);
        Class.prototype[filterName] = function(node, callback) {
          var result = [];
          this[forEachName](node, function(n, a) {
            if (callback(n, a))
              result.push(n);
          });
          return result;
        };
        var reduceName = "reduce" + name[0].toUpperCase() + name.slice(1);
        Class.prototype[reduceName] = function(node, callback, initialValue) {
          if (arguments.length < 3)
            throw new InvalidArgumentsGraphError("Graph.".concat(reduceName, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
          var accumulator = initialValue;
          this[forEachName](node, function(n, a) {
            accumulator = callback(accumulator, n, a);
          });
          return accumulator;
        };
      }
      function attachFindNeighbor(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        var capitalizedSingular = name[0].toUpperCase() + name.slice(1, -1);
        var findName = "find" + capitalizedSingular;
        Class.prototype[findName] = function(node, callback) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return;
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (typeof nodeData === "undefined")
            throw new NotFoundGraphError("Graph.".concat(findName, ': could not find the "').concat(node, '" node in the graph.'));
          return forEachNeighbor(true, type === "mixed" ? this.type : type, direction, nodeData, callback);
        };
        var someName = "some" + capitalizedSingular;
        Class.prototype[someName] = function(node, callback) {
          var found = this[findName](node, callback);
          if (found)
            return true;
          return false;
        };
        var everyName = "every" + capitalizedSingular;
        Class.prototype[everyName] = function(node, callback) {
          var found = this[findName](node, function(n, a) {
            return !callback(n, a);
          });
          if (found)
            return false;
          return true;
        };
      }
      function attachNeighborIteratorCreator(Class, description) {
        var name = description.name, type = description.type, direction = description.direction;
        var iteratorName = name.slice(0, -1) + "Entries";
        Class.prototype[iteratorName] = function(node) {
          if (type !== "mixed" && this.type !== "mixed" && type !== this.type)
            return iterator.empty();
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (typeof nodeData === "undefined")
            throw new NotFoundGraphError("Graph.".concat(iteratorName, ': could not find the "').concat(node, '" node in the graph.'));
          return createNeighborIterator(type === "mixed" ? this.type : type, direction, nodeData);
        };
      }
      function attachNeighborIterationMethods(Graph3) {
        NEIGHBORS_ITERATION.forEach(function(description) {
          attachNeighborArrayCreator(Graph3, description);
          attachForEachNeighbor(Graph3, description);
          attachFindNeighbor(Graph3, description);
          attachNeighborIteratorCreator(Graph3, description);
        });
      }
      function forEachAdjacency(breakable, assymetric, disconnectedNodes, graph, callback) {
        var iterator2 = graph._nodes.values();
        var type = graph.type;
        var step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;
        while (step = iterator2.next(), step.done !== true) {
          var hasEdges = false;
          sourceData = step.value;
          if (type !== "undirected") {
            adj = sourceData.out;
            for (neighbor in adj) {
              edgeData = adj[neighbor];
              do {
                targetData = edgeData.target;
                hasEdges = true;
                shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
                if (breakable && shouldBreak)
                  return edgeData;
                edgeData = edgeData.next;
              } while (edgeData);
            }
          }
          if (type !== "directed") {
            adj = sourceData.undirected;
            for (neighbor in adj) {
              if (assymetric && sourceData.key > neighbor)
                continue;
              edgeData = adj[neighbor];
              do {
                targetData = edgeData.target;
                if (targetData.key !== neighbor)
                  targetData = edgeData.source;
                hasEdges = true;
                shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
                if (breakable && shouldBreak)
                  return edgeData;
                edgeData = edgeData.next;
              } while (edgeData);
            }
          }
          if (disconnectedNodes && !hasEdges) {
            shouldBreak = callback(sourceData.key, null, sourceData.attributes, null, null, null, null);
            if (breakable && shouldBreak)
              return null;
          }
        }
        return;
      }
      function serializeNode(key, data) {
        var serialized = {
          key
        };
        if (!isEmpty(data.attributes))
          serialized.attributes = assign({}, data.attributes);
        return serialized;
      }
      function serializeEdge(type, key, data) {
        var serialized = {
          key,
          source: data.source.key,
          target: data.target.key
        };
        if (!isEmpty(data.attributes))
          serialized.attributes = assign({}, data.attributes);
        if (type === "mixed" && data.undirected)
          serialized.undirected = true;
        return serialized;
      }
      function validateSerializedNode(value) {
        if (!isPlainObject(value))
          throw new InvalidArgumentsGraphError('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
        if (!("key" in value))
          throw new InvalidArgumentsGraphError("Graph.import: serialized node is missing its key.");
        if ("attributes" in value && (!isPlainObject(value.attributes) || value.attributes === null))
          throw new InvalidArgumentsGraphError("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
      }
      function validateSerializedEdge(value) {
        if (!isPlainObject(value))
          throw new InvalidArgumentsGraphError('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
        if (!("source" in value))
          throw new InvalidArgumentsGraphError("Graph.import: serialized edge is missing its source.");
        if (!("target" in value))
          throw new InvalidArgumentsGraphError("Graph.import: serialized edge is missing its target.");
        if ("attributes" in value && (!isPlainObject(value.attributes) || value.attributes === null))
          throw new InvalidArgumentsGraphError("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
        if ("undirected" in value && typeof value.undirected !== "boolean")
          throw new InvalidArgumentsGraphError("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.");
      }
      var INSTANCE_ID = incrementalIdStartingFromRandomByte();
      var TYPES = /* @__PURE__ */ new Set(["directed", "undirected", "mixed"]);
      var EMITTER_PROPS = /* @__PURE__ */ new Set(["domain", "_events", "_eventsCount", "_maxListeners"]);
      var EDGE_ADD_METHODS = [{
        name: function name(verb) {
          return "".concat(verb, "Edge");
        },
        generateKey: true
      }, {
        name: function name(verb) {
          return "".concat(verb, "DirectedEdge");
        },
        generateKey: true,
        type: "directed"
      }, {
        name: function name(verb) {
          return "".concat(verb, "UndirectedEdge");
        },
        generateKey: true,
        type: "undirected"
      }, {
        name: function name(verb) {
          return "".concat(verb, "EdgeWithKey");
        }
      }, {
        name: function name(verb) {
          return "".concat(verb, "DirectedEdgeWithKey");
        },
        type: "directed"
      }, {
        name: function name(verb) {
          return "".concat(verb, "UndirectedEdgeWithKey");
        },
        type: "undirected"
      }];
      var DEFAULTS = {
        allowSelfLoops: true,
        multi: false,
        type: "mixed"
      };
      function _addNode(graph, node, attributes) {
        if (attributes && !isPlainObject(attributes))
          throw new InvalidArgumentsGraphError('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(attributes, '"'));
        node = "" + node;
        attributes = attributes || {};
        if (graph._nodes.has(node))
          throw new UsageGraphError('Graph.addNode: the "'.concat(node, '" node already exist in the graph.'));
        var data = new graph.NodeDataClass(node, attributes);
        graph._nodes.set(node, data);
        graph.emit("nodeAdded", {
          key: node,
          attributes
        });
        return data;
      }
      function unsafeAddNode(graph, node, attributes) {
        var data = new graph.NodeDataClass(node, attributes);
        graph._nodes.set(node, data);
        graph.emit("nodeAdded", {
          key: node,
          attributes
        });
        return data;
      }
      function addEdge(graph, name, mustGenerateKey, undirected2, edge, source, target, attributes) {
        if (!undirected2 && graph.type === "undirected")
          throw new UsageGraphError("Graph.".concat(name, ": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));
        if (undirected2 && graph.type === "directed")
          throw new UsageGraphError("Graph.".concat(name, ": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));
        if (attributes && !isPlainObject(attributes))
          throw new InvalidArgumentsGraphError("Graph.".concat(name, ': invalid attributes. Expecting an object but got "').concat(attributes, '"'));
        source = "" + source;
        target = "" + target;
        attributes = attributes || {};
        if (!graph.allowSelfLoops && source === target)
          throw new UsageGraphError("Graph.".concat(name, ': source & target are the same ("').concat(source, `"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`));
        var sourceData = graph._nodes.get(source), targetData = graph._nodes.get(target);
        if (!sourceData)
          throw new NotFoundGraphError("Graph.".concat(name, ': source node "').concat(source, '" not found.'));
        if (!targetData)
          throw new NotFoundGraphError("Graph.".concat(name, ': target node "').concat(target, '" not found.'));
        var eventData = {
          key: null,
          undirected: undirected2,
          source,
          target,
          attributes
        };
        if (mustGenerateKey) {
          edge = graph._edgeKeyGenerator();
        } else {
          edge = "" + edge;
          if (graph._edges.has(edge))
            throw new UsageGraphError("Graph.".concat(name, ': the "').concat(edge, '" edge already exists in the graph.'));
        }
        if (!graph.multi && (undirected2 ? typeof sourceData.undirected[target] !== "undefined" : typeof sourceData.out[target] !== "undefined")) {
          throw new UsageGraphError("Graph.".concat(name, ': an edge linking "').concat(source, '" to "').concat(target, `" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`));
        }
        var edgeData = new EdgeData(undirected2, edge, sourceData, targetData, attributes);
        graph._edges.set(edge, edgeData);
        var isSelfLoop = source === target;
        if (undirected2) {
          sourceData.undirectedDegree++;
          targetData.undirectedDegree++;
          if (isSelfLoop) {
            sourceData.undirectedLoops++;
            graph._undirectedSelfLoopCount++;
          }
        } else {
          sourceData.outDegree++;
          targetData.inDegree++;
          if (isSelfLoop) {
            sourceData.directedLoops++;
            graph._directedSelfLoopCount++;
          }
        }
        if (graph.multi)
          edgeData.attachMulti();
        else
          edgeData.attach();
        if (undirected2)
          graph._undirectedSize++;
        else
          graph._directedSize++;
        eventData.key = edge;
        graph.emit("edgeAdded", eventData);
        return edge;
      }
      function mergeEdge(graph, name, mustGenerateKey, undirected2, edge, source, target, attributes, asUpdater) {
        if (!undirected2 && graph.type === "undirected")
          throw new UsageGraphError("Graph.".concat(name, ": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));
        if (undirected2 && graph.type === "directed")
          throw new UsageGraphError("Graph.".concat(name, ": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));
        if (attributes) {
          if (asUpdater) {
            if (typeof attributes !== "function")
              throw new InvalidArgumentsGraphError("Graph.".concat(name, ': invalid updater function. Expecting a function but got "').concat(attributes, '"'));
          } else {
            if (!isPlainObject(attributes))
              throw new InvalidArgumentsGraphError("Graph.".concat(name, ': invalid attributes. Expecting an object but got "').concat(attributes, '"'));
          }
        }
        source = "" + source;
        target = "" + target;
        var updater;
        if (asUpdater) {
          updater = attributes;
          attributes = void 0;
        }
        if (!graph.allowSelfLoops && source === target)
          throw new UsageGraphError("Graph.".concat(name, ': source & target are the same ("').concat(source, `"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`));
        var sourceData = graph._nodes.get(source);
        var targetData = graph._nodes.get(target);
        var edgeData;
        var alreadyExistingEdgeData;
        if (!mustGenerateKey) {
          edgeData = graph._edges.get(edge);
          if (edgeData) {
            if (edgeData.source.key !== source || edgeData.target.key !== target) {
              if (!undirected2 || edgeData.source.key !== target || edgeData.target.key !== source) {
                throw new UsageGraphError("Graph.".concat(name, ': inconsistency detected when attempting to merge the "').concat(edge, '" edge with "').concat(source, '" source & "').concat(target, '" target vs. ("').concat(edgeData.source.key, '", "').concat(edgeData.target.key, '").'));
              }
            }
            alreadyExistingEdgeData = edgeData;
          }
        }
        if (!alreadyExistingEdgeData && !graph.multi && sourceData) {
          alreadyExistingEdgeData = undirected2 ? sourceData.undirected[target] : sourceData.out[target];
        }
        if (alreadyExistingEdgeData) {
          var info = [alreadyExistingEdgeData.key, false, false, false];
          if (asUpdater ? !updater : !attributes)
            return info;
          if (asUpdater) {
            var oldAttributes = alreadyExistingEdgeData.attributes;
            alreadyExistingEdgeData.attributes = updater(oldAttributes);
            graph.emit("edgeAttributesUpdated", {
              type: "replace",
              key: alreadyExistingEdgeData.key,
              attributes: alreadyExistingEdgeData.attributes
            });
          } else {
            assign(alreadyExistingEdgeData.attributes, attributes);
            graph.emit("edgeAttributesUpdated", {
              type: "merge",
              key: alreadyExistingEdgeData.key,
              attributes: alreadyExistingEdgeData.attributes,
              data: attributes
            });
          }
          return info;
        }
        attributes = attributes || {};
        if (asUpdater && updater)
          attributes = updater(attributes);
        var eventData = {
          key: null,
          undirected: undirected2,
          source,
          target,
          attributes
        };
        if (mustGenerateKey) {
          edge = graph._edgeKeyGenerator();
        } else {
          edge = "" + edge;
          if (graph._edges.has(edge))
            throw new UsageGraphError("Graph.".concat(name, ': the "').concat(edge, '" edge already exists in the graph.'));
        }
        var sourceWasAdded = false;
        var targetWasAdded = false;
        if (!sourceData) {
          sourceData = unsafeAddNode(graph, source, {});
          sourceWasAdded = true;
          if (source === target) {
            targetData = sourceData;
            targetWasAdded = true;
          }
        }
        if (!targetData) {
          targetData = unsafeAddNode(graph, target, {});
          targetWasAdded = true;
        }
        edgeData = new EdgeData(undirected2, edge, sourceData, targetData, attributes);
        graph._edges.set(edge, edgeData);
        var isSelfLoop = source === target;
        if (undirected2) {
          sourceData.undirectedDegree++;
          targetData.undirectedDegree++;
          if (isSelfLoop) {
            sourceData.undirectedLoops++;
            graph._undirectedSelfLoopCount++;
          }
        } else {
          sourceData.outDegree++;
          targetData.inDegree++;
          if (isSelfLoop) {
            sourceData.directedLoops++;
            graph._directedSelfLoopCount++;
          }
        }
        if (graph.multi)
          edgeData.attachMulti();
        else
          edgeData.attach();
        if (undirected2)
          graph._undirectedSize++;
        else
          graph._directedSize++;
        eventData.key = edge;
        graph.emit("edgeAdded", eventData);
        return [edge, true, sourceWasAdded, targetWasAdded];
      }
      function dropEdgeFromData(graph, edgeData) {
        graph._edges["delete"](edgeData.key);
        var sourceData = edgeData.source, targetData = edgeData.target, attributes = edgeData.attributes;
        var undirected2 = edgeData.undirected;
        var isSelfLoop = sourceData === targetData;
        if (undirected2) {
          sourceData.undirectedDegree--;
          targetData.undirectedDegree--;
          if (isSelfLoop) {
            sourceData.undirectedLoops--;
            graph._undirectedSelfLoopCount--;
          }
        } else {
          sourceData.outDegree--;
          targetData.inDegree--;
          if (isSelfLoop) {
            sourceData.directedLoops--;
            graph._directedSelfLoopCount--;
          }
        }
        if (graph.multi)
          edgeData.detachMulti();
        else
          edgeData.detach();
        if (undirected2)
          graph._undirectedSize--;
        else
          graph._directedSize--;
        graph.emit("edgeDropped", {
          key: edgeData.key,
          attributes,
          source: sourceData.key,
          target: targetData.key,
          undirected: undirected2
        });
      }
      var Graph2 = /* @__PURE__ */ function(_EventEmitter) {
        _inheritsLoose(Graph3, _EventEmitter);
        function Graph3(options) {
          var _this;
          _this = _EventEmitter.call(this) || this;
          options = assign({}, DEFAULTS, options);
          if (typeof options.multi !== "boolean")
            throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "`.concat(options.multi, '".'));
          if (!TYPES.has(options.type))
            throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "`.concat(options.type, '".'));
          if (typeof options.allowSelfLoops !== "boolean")
            throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "`.concat(options.allowSelfLoops, '".'));
          var NodeDataClass = options.type === "mixed" ? MixedNodeData : options.type === "directed" ? DirectedNodeData : UndirectedNodeData;
          privateProperty(_assertThisInitialized(_this), "NodeDataClass", NodeDataClass);
          var instancePrefix = "geid_" + INSTANCE_ID() + "_";
          var edgeId = 0;
          var edgeKeyGenerator = function edgeKeyGenerator2() {
            var availableEdgeKey;
            do {
              availableEdgeKey = instancePrefix + edgeId++;
            } while (_this._edges.has(availableEdgeKey));
            return availableEdgeKey;
          };
          privateProperty(_assertThisInitialized(_this), "_attributes", {});
          privateProperty(_assertThisInitialized(_this), "_nodes", /* @__PURE__ */ new Map());
          privateProperty(_assertThisInitialized(_this), "_edges", /* @__PURE__ */ new Map());
          privateProperty(_assertThisInitialized(_this), "_directedSize", 0);
          privateProperty(_assertThisInitialized(_this), "_undirectedSize", 0);
          privateProperty(_assertThisInitialized(_this), "_directedSelfLoopCount", 0);
          privateProperty(_assertThisInitialized(_this), "_undirectedSelfLoopCount", 0);
          privateProperty(_assertThisInitialized(_this), "_edgeKeyGenerator", edgeKeyGenerator);
          privateProperty(_assertThisInitialized(_this), "_options", options);
          EMITTER_PROPS.forEach(function(prop) {
            return privateProperty(_assertThisInitialized(_this), prop, _this[prop]);
          });
          readOnlyProperty(_assertThisInitialized(_this), "order", function() {
            return _this._nodes.size;
          });
          readOnlyProperty(_assertThisInitialized(_this), "size", function() {
            return _this._edges.size;
          });
          readOnlyProperty(_assertThisInitialized(_this), "directedSize", function() {
            return _this._directedSize;
          });
          readOnlyProperty(_assertThisInitialized(_this), "undirectedSize", function() {
            return _this._undirectedSize;
          });
          readOnlyProperty(_assertThisInitialized(_this), "selfLoopCount", function() {
            return _this._directedSelfLoopCount + _this._undirectedSelfLoopCount;
          });
          readOnlyProperty(_assertThisInitialized(_this), "directedSelfLoopCount", function() {
            return _this._directedSelfLoopCount;
          });
          readOnlyProperty(_assertThisInitialized(_this), "undirectedSelfLoopCount", function() {
            return _this._undirectedSelfLoopCount;
          });
          readOnlyProperty(_assertThisInitialized(_this), "multi", _this._options.multi);
          readOnlyProperty(_assertThisInitialized(_this), "type", _this._options.type);
          readOnlyProperty(_assertThisInitialized(_this), "allowSelfLoops", _this._options.allowSelfLoops);
          readOnlyProperty(_assertThisInitialized(_this), "implementation", function() {
            return "graphology";
          });
          return _this;
        }
        var _proto = Graph3.prototype;
        _proto._resetInstanceCounters = function _resetInstanceCounters() {
          this._directedSize = 0;
          this._undirectedSize = 0;
          this._directedSelfLoopCount = 0;
          this._undirectedSelfLoopCount = 0;
        };
        _proto.hasNode = function hasNode(node) {
          return this._nodes.has("" + node);
        };
        _proto.hasDirectedEdge = function hasDirectedEdge(source, target) {
          if (this.type === "undirected")
            return false;
          if (arguments.length === 1) {
            var edge = "" + source;
            var edgeData = this._edges.get(edge);
            return !!edgeData && !edgeData.undirected;
          } else if (arguments.length === 2) {
            source = "" + source;
            target = "" + target;
            var nodeData = this._nodes.get(source);
            if (!nodeData)
              return false;
            return nodeData.out.hasOwnProperty(target);
          }
          throw new InvalidArgumentsGraphError("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        };
        _proto.hasUndirectedEdge = function hasUndirectedEdge(source, target) {
          if (this.type === "directed")
            return false;
          if (arguments.length === 1) {
            var edge = "" + source;
            var edgeData = this._edges.get(edge);
            return !!edgeData && edgeData.undirected;
          } else if (arguments.length === 2) {
            source = "" + source;
            target = "" + target;
            var nodeData = this._nodes.get(source);
            if (!nodeData)
              return false;
            return nodeData.undirected.hasOwnProperty(target);
          }
          throw new InvalidArgumentsGraphError("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        };
        _proto.hasEdge = function hasEdge(source, target) {
          if (arguments.length === 1) {
            var edge = "" + source;
            return this._edges.has(edge);
          } else if (arguments.length === 2) {
            source = "" + source;
            target = "" + target;
            var nodeData = this._nodes.get(source);
            if (!nodeData)
              return false;
            return typeof nodeData.out !== "undefined" && nodeData.out.hasOwnProperty(target) || typeof nodeData.undirected !== "undefined" && nodeData.undirected.hasOwnProperty(target);
          }
          throw new InvalidArgumentsGraphError("Graph.hasEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        };
        _proto.directedEdge = function directedEdge(source, target) {
          if (this.type === "undirected")
            return;
          source = "" + source;
          target = "" + target;
          if (this.multi)
            throw new UsageGraphError("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");
          var sourceData = this._nodes.get(source);
          if (!sourceData)
            throw new NotFoundGraphError('Graph.directedEdge: could not find the "'.concat(source, '" source node in the graph.'));
          if (!this._nodes.has(target))
            throw new NotFoundGraphError('Graph.directedEdge: could not find the "'.concat(target, '" target node in the graph.'));
          var edgeData = sourceData.out && sourceData.out[target] || void 0;
          if (edgeData)
            return edgeData.key;
        };
        _proto.undirectedEdge = function undirectedEdge(source, target) {
          if (this.type === "directed")
            return;
          source = "" + source;
          target = "" + target;
          if (this.multi)
            throw new UsageGraphError("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");
          var sourceData = this._nodes.get(source);
          if (!sourceData)
            throw new NotFoundGraphError('Graph.undirectedEdge: could not find the "'.concat(source, '" source node in the graph.'));
          if (!this._nodes.has(target))
            throw new NotFoundGraphError('Graph.undirectedEdge: could not find the "'.concat(target, '" target node in the graph.'));
          var edgeData = sourceData.undirected && sourceData.undirected[target] || void 0;
          if (edgeData)
            return edgeData.key;
        };
        _proto.edge = function edge(source, target) {
          if (this.multi)
            throw new UsageGraphError("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");
          source = "" + source;
          target = "" + target;
          var sourceData = this._nodes.get(source);
          if (!sourceData)
            throw new NotFoundGraphError('Graph.edge: could not find the "'.concat(source, '" source node in the graph.'));
          if (!this._nodes.has(target))
            throw new NotFoundGraphError('Graph.edge: could not find the "'.concat(target, '" target node in the graph.'));
          var edgeData = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target] || void 0;
          if (edgeData)
            return edgeData.key;
        };
        _proto.areDirectedNeighbors = function areDirectedNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areDirectedNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return false;
          return neighbor in nodeData["in"] || neighbor in nodeData.out;
        };
        _proto.areOutNeighbors = function areOutNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areOutNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return false;
          return neighbor in nodeData.out;
        };
        _proto.areInNeighbors = function areInNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areInNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return false;
          return neighbor in nodeData["in"];
        };
        _proto.areUndirectedNeighbors = function areUndirectedNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areUndirectedNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "directed")
            return false;
          return neighbor in nodeData.undirected;
        };
        _proto.areNeighbors = function areNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type !== "undirected") {
            if (neighbor in nodeData["in"] || neighbor in nodeData.out)
              return true;
          }
          if (this.type !== "directed") {
            if (neighbor in nodeData.undirected)
              return true;
          }
          return false;
        };
        _proto.areInboundNeighbors = function areInboundNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areInboundNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type !== "undirected") {
            if (neighbor in nodeData["in"])
              return true;
          }
          if (this.type !== "directed") {
            if (neighbor in nodeData.undirected)
              return true;
          }
          return false;
        };
        _proto.areOutboundNeighbors = function areOutboundNeighbors(node, neighbor) {
          node = "" + node;
          neighbor = "" + neighbor;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.areOutboundNeighbors: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type !== "undirected") {
            if (neighbor in nodeData.out)
              return true;
          }
          if (this.type !== "directed") {
            if (neighbor in nodeData.undirected)
              return true;
          }
          return false;
        };
        _proto.inDegree = function inDegree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.inDegree: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return 0;
          return nodeData.inDegree;
        };
        _proto.outDegree = function outDegree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.outDegree: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return 0;
          return nodeData.outDegree;
        };
        _proto.directedDegree = function directedDegree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.directedDegree: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return 0;
          return nodeData.inDegree + nodeData.outDegree;
        };
        _proto.undirectedDegree = function undirectedDegree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.undirectedDegree: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "directed")
            return 0;
          return nodeData.undirectedDegree;
        };
        _proto.inboundDegree = function inboundDegree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.inboundDegree: could not find the "'.concat(node, '" node in the graph.'));
          var degree = 0;
          if (this.type !== "directed") {
            degree += nodeData.undirectedDegree;
          }
          if (this.type !== "undirected") {
            degree += nodeData.inDegree;
          }
          return degree;
        };
        _proto.outboundDegree = function outboundDegree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.outboundDegree: could not find the "'.concat(node, '" node in the graph.'));
          var degree = 0;
          if (this.type !== "directed") {
            degree += nodeData.undirectedDegree;
          }
          if (this.type !== "undirected") {
            degree += nodeData.outDegree;
          }
          return degree;
        };
        _proto.degree = function degree(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.degree: could not find the "'.concat(node, '" node in the graph.'));
          var degree2 = 0;
          if (this.type !== "directed") {
            degree2 += nodeData.undirectedDegree;
          }
          if (this.type !== "undirected") {
            degree2 += nodeData.inDegree + nodeData.outDegree;
          }
          return degree2;
        };
        _proto.inDegreeWithoutSelfLoops = function inDegreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return 0;
          return nodeData.inDegree - nodeData.directedLoops;
        };
        _proto.outDegreeWithoutSelfLoops = function outDegreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return 0;
          return nodeData.outDegree - nodeData.directedLoops;
        };
        _proto.directedDegreeWithoutSelfLoops = function directedDegreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "undirected")
            return 0;
          return nodeData.inDegree + nodeData.outDegree - nodeData.directedLoops * 2;
        };
        _proto.undirectedDegreeWithoutSelfLoops = function undirectedDegreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          if (this.type === "directed")
            return 0;
          return nodeData.undirectedDegree - nodeData.undirectedLoops * 2;
        };
        _proto.inboundDegreeWithoutSelfLoops = function inboundDegreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          var degree = 0;
          var loops = 0;
          if (this.type !== "directed") {
            degree += nodeData.undirectedDegree;
            loops += nodeData.undirectedLoops * 2;
          }
          if (this.type !== "undirected") {
            degree += nodeData.inDegree;
            loops += nodeData.directedLoops;
          }
          return degree - loops;
        };
        _proto.outboundDegreeWithoutSelfLoops = function outboundDegreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          var degree = 0;
          var loops = 0;
          if (this.type !== "directed") {
            degree += nodeData.undirectedDegree;
            loops += nodeData.undirectedLoops * 2;
          }
          if (this.type !== "undirected") {
            degree += nodeData.outDegree;
            loops += nodeData.directedLoops;
          }
          return degree - loops;
        };
        _proto.degreeWithoutSelfLoops = function degreeWithoutSelfLoops(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.degreeWithoutSelfLoops: could not find the "'.concat(node, '" node in the graph.'));
          var degree = 0;
          var loops = 0;
          if (this.type !== "directed") {
            degree += nodeData.undirectedDegree;
            loops += nodeData.undirectedLoops * 2;
          }
          if (this.type !== "undirected") {
            degree += nodeData.inDegree + nodeData.outDegree;
            loops += nodeData.directedLoops * 2;
          }
          return degree - loops;
        };
        _proto.source = function source(edge) {
          edge = "" + edge;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.source: could not find the "'.concat(edge, '" edge in the graph.'));
          return data.source.key;
        };
        _proto.target = function target(edge) {
          edge = "" + edge;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.target: could not find the "'.concat(edge, '" edge in the graph.'));
          return data.target.key;
        };
        _proto.extremities = function extremities(edge) {
          edge = "" + edge;
          var edgeData = this._edges.get(edge);
          if (!edgeData)
            throw new NotFoundGraphError('Graph.extremities: could not find the "'.concat(edge, '" edge in the graph.'));
          return [edgeData.source.key, edgeData.target.key];
        };
        _proto.opposite = function opposite(node, edge) {
          node = "" + node;
          edge = "" + edge;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.opposite: could not find the "'.concat(edge, '" edge in the graph.'));
          var source = data.source.key;
          var target = data.target.key;
          if (node === source)
            return target;
          if (node === target)
            return source;
          throw new NotFoundGraphError('Graph.opposite: the "'.concat(node, '" node is not attached to the "').concat(edge, '" edge (').concat(source, ", ").concat(target, ")."));
        };
        _proto.hasExtremity = function hasExtremity(edge, node) {
          edge = "" + edge;
          node = "" + node;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.hasExtremity: could not find the "'.concat(edge, '" edge in the graph.'));
          return data.source.key === node || data.target.key === node;
        };
        _proto.isUndirected = function isUndirected(edge) {
          edge = "" + edge;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.isUndirected: could not find the "'.concat(edge, '" edge in the graph.'));
          return data.undirected;
        };
        _proto.isDirected = function isDirected(edge) {
          edge = "" + edge;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.isDirected: could not find the "'.concat(edge, '" edge in the graph.'));
          return !data.undirected;
        };
        _proto.isSelfLoop = function isSelfLoop(edge) {
          edge = "" + edge;
          var data = this._edges.get(edge);
          if (!data)
            throw new NotFoundGraphError('Graph.isSelfLoop: could not find the "'.concat(edge, '" edge in the graph.'));
          return data.source === data.target;
        };
        _proto.addNode = function addNode(node, attributes) {
          var nodeData = _addNode(this, node, attributes);
          return nodeData.key;
        };
        _proto.mergeNode = function mergeNode(node, attributes) {
          if (attributes && !isPlainObject(attributes))
            throw new InvalidArgumentsGraphError('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(attributes, '"'));
          node = "" + node;
          attributes = attributes || {};
          var data = this._nodes.get(node);
          if (data) {
            if (attributes) {
              assign(data.attributes, attributes);
              this.emit("nodeAttributesUpdated", {
                type: "merge",
                key: node,
                attributes: data.attributes,
                data: attributes
              });
            }
            return [node, false];
          }
          data = new this.NodeDataClass(node, attributes);
          this._nodes.set(node, data);
          this.emit("nodeAdded", {
            key: node,
            attributes
          });
          return [node, true];
        };
        _proto.updateNode = function updateNode(node, updater) {
          if (updater && typeof updater !== "function")
            throw new InvalidArgumentsGraphError('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(updater, '"'));
          node = "" + node;
          var data = this._nodes.get(node);
          if (data) {
            if (updater) {
              var oldAttributes = data.attributes;
              data.attributes = updater(oldAttributes);
              this.emit("nodeAttributesUpdated", {
                type: "replace",
                key: node,
                attributes: data.attributes
              });
            }
            return [node, false];
          }
          var attributes = updater ? updater({}) : {};
          data = new this.NodeDataClass(node, attributes);
          this._nodes.set(node, data);
          this.emit("nodeAdded", {
            key: node,
            attributes
          });
          return [node, true];
        };
        _proto.dropNode = function dropNode(node) {
          node = "" + node;
          var nodeData = this._nodes.get(node);
          if (!nodeData)
            throw new NotFoundGraphError('Graph.dropNode: could not find the "'.concat(node, '" node in the graph.'));
          var edgeData;
          if (this.type !== "undirected") {
            for (var neighbor in nodeData.out) {
              edgeData = nodeData.out[neighbor];
              do {
                dropEdgeFromData(this, edgeData);
                edgeData = edgeData.next;
              } while (edgeData);
            }
            for (var _neighbor in nodeData["in"]) {
              edgeData = nodeData["in"][_neighbor];
              do {
                dropEdgeFromData(this, edgeData);
                edgeData = edgeData.next;
              } while (edgeData);
            }
          }
          if (this.type !== "directed") {
            for (var _neighbor2 in nodeData.undirected) {
              edgeData = nodeData.undirected[_neighbor2];
              do {
                dropEdgeFromData(this, edgeData);
                edgeData = edgeData.next;
              } while (edgeData);
            }
          }
          this._nodes["delete"](node);
          this.emit("nodeDropped", {
            key: node,
            attributes: nodeData.attributes
          });
        };
        _proto.dropEdge = function dropEdge(edge) {
          var edgeData;
          if (arguments.length > 1) {
            var source = "" + arguments[0];
            var target = "" + arguments[1];
            edgeData = getMatchingEdge(this, source, target, this.type);
            if (!edgeData)
              throw new NotFoundGraphError('Graph.dropEdge: could not find the "'.concat(source, '" -> "').concat(target, '" edge in the graph.'));
          } else {
            edge = "" + edge;
            edgeData = this._edges.get(edge);
            if (!edgeData)
              throw new NotFoundGraphError('Graph.dropEdge: could not find the "'.concat(edge, '" edge in the graph.'));
          }
          dropEdgeFromData(this, edgeData);
          return this;
        };
        _proto.dropDirectedEdge = function dropDirectedEdge(source, target) {
          if (arguments.length < 2)
            throw new UsageGraphError("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
          if (this.multi)
            throw new UsageGraphError("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
          source = "" + source;
          target = "" + target;
          var edgeData = getMatchingEdge(this, source, target, "directed");
          if (!edgeData)
            throw new NotFoundGraphError('Graph.dropDirectedEdge: could not find a "'.concat(source, '" -> "').concat(target, '" edge in the graph.'));
          dropEdgeFromData(this, edgeData);
          return this;
        };
        _proto.dropUndirectedEdge = function dropUndirectedEdge(source, target) {
          if (arguments.length < 2)
            throw new UsageGraphError("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
          if (this.multi)
            throw new UsageGraphError("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
          var edgeData = getMatchingEdge(this, source, target, "undirected");
          if (!edgeData)
            throw new NotFoundGraphError('Graph.dropUndirectedEdge: could not find a "'.concat(source, '" -> "').concat(target, '" edge in the graph.'));
          dropEdgeFromData(this, edgeData);
          return this;
        };
        _proto.clear = function clear() {
          this._edges.clear();
          this._nodes.clear();
          this._resetInstanceCounters();
          this.emit("cleared");
        };
        _proto.clearEdges = function clearEdges() {
          var iterator2 = this._nodes.values();
          var step;
          while (step = iterator2.next(), step.done !== true) {
            step.value.clear();
          }
          this._edges.clear();
          this._resetInstanceCounters();
          this.emit("edgesCleared");
        };
        _proto.getAttribute = function getAttribute(name) {
          return this._attributes[name];
        };
        _proto.getAttributes = function getAttributes() {
          return this._attributes;
        };
        _proto.hasAttribute = function hasAttribute(name) {
          return this._attributes.hasOwnProperty(name);
        };
        _proto.setAttribute = function setAttribute(name, value) {
          this._attributes[name] = value;
          this.emit("attributesUpdated", {
            type: "set",
            attributes: this._attributes,
            name
          });
          return this;
        };
        _proto.updateAttribute = function updateAttribute(name, updater) {
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.updateAttribute: updater should be a function.");
          var value = this._attributes[name];
          this._attributes[name] = updater(value);
          this.emit("attributesUpdated", {
            type: "set",
            attributes: this._attributes,
            name
          });
          return this;
        };
        _proto.removeAttribute = function removeAttribute(name) {
          delete this._attributes[name];
          this.emit("attributesUpdated", {
            type: "remove",
            attributes: this._attributes,
            name
          });
          return this;
        };
        _proto.replaceAttributes = function replaceAttributes(attributes) {
          if (!isPlainObject(attributes))
            throw new InvalidArgumentsGraphError("Graph.replaceAttributes: provided attributes are not a plain object.");
          this._attributes = attributes;
          this.emit("attributesUpdated", {
            type: "replace",
            attributes: this._attributes
          });
          return this;
        };
        _proto.mergeAttributes = function mergeAttributes(attributes) {
          if (!isPlainObject(attributes))
            throw new InvalidArgumentsGraphError("Graph.mergeAttributes: provided attributes are not a plain object.");
          assign(this._attributes, attributes);
          this.emit("attributesUpdated", {
            type: "merge",
            attributes: this._attributes,
            data: attributes
          });
          return this;
        };
        _proto.updateAttributes = function updateAttributes(updater) {
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.updateAttributes: provided updater is not a function.");
          this._attributes = updater(this._attributes);
          this.emit("attributesUpdated", {
            type: "update",
            attributes: this._attributes
          });
          return this;
        };
        _proto.updateEachNodeAttributes = function updateEachNodeAttributes(updater, hints) {
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.updateEachNodeAttributes: expecting an updater function.");
          if (hints && !validateHints(hints))
            throw new InvalidArgumentsGraphError("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            nodeData.attributes = updater(nodeData.key, nodeData.attributes);
          }
          this.emit("eachNodeAttributesUpdated", {
            hints: hints ? hints : null
          });
        };
        _proto.updateEachEdgeAttributes = function updateEachEdgeAttributes(updater, hints) {
          if (typeof updater !== "function")
            throw new InvalidArgumentsGraphError("Graph.updateEachEdgeAttributes: expecting an updater function.");
          if (hints && !validateHints(hints))
            throw new InvalidArgumentsGraphError("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
          var iterator2 = this._edges.values();
          var step, edgeData, sourceData, targetData;
          while (step = iterator2.next(), step.done !== true) {
            edgeData = step.value;
            sourceData = edgeData.source;
            targetData = edgeData.target;
            edgeData.attributes = updater(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected);
          }
          this.emit("eachEdgeAttributesUpdated", {
            hints: hints ? hints : null
          });
        };
        _proto.forEachAdjacencyEntry = function forEachAdjacencyEntry(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.forEachAdjacencyEntry: expecting a callback.");
          forEachAdjacency(false, false, false, this, callback);
        };
        _proto.forEachAdjacencyEntryWithOrphans = function forEachAdjacencyEntryWithOrphans(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");
          forEachAdjacency(false, false, true, this, callback);
        };
        _proto.forEachAssymetricAdjacencyEntry = function forEachAssymetricAdjacencyEntry(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");
          forEachAdjacency(false, true, false, this, callback);
        };
        _proto.forEachAssymetricAdjacencyEntryWithOrphans = function forEachAssymetricAdjacencyEntryWithOrphans(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");
          forEachAdjacency(false, true, true, this, callback);
        };
        _proto.nodes = function nodes() {
          if (typeof Array.from === "function")
            return Array.from(this._nodes.keys());
          return take(this._nodes.keys(), this._nodes.size);
        };
        _proto.forEachNode = function forEachNode(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.forEachNode: expecting a callback.");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            callback(nodeData.key, nodeData.attributes);
          }
        };
        _proto.findNode = function findNode(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.findNode: expecting a callback.");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            if (callback(nodeData.key, nodeData.attributes))
              return nodeData.key;
          }
          return;
        };
        _proto.mapNodes = function mapNodes(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.mapNode: expecting a callback.");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          var result = new Array(this.order);
          var i = 0;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            result[i++] = callback(nodeData.key, nodeData.attributes);
          }
          return result;
        };
        _proto.someNode = function someNode(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.someNode: expecting a callback.");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            if (callback(nodeData.key, nodeData.attributes))
              return true;
          }
          return false;
        };
        _proto.everyNode = function everyNode(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.everyNode: expecting a callback.");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            if (!callback(nodeData.key, nodeData.attributes))
              return false;
          }
          return true;
        };
        _proto.filterNodes = function filterNodes(callback) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.filterNodes: expecting a callback.");
          var iterator2 = this._nodes.values();
          var step, nodeData;
          var result = [];
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            if (callback(nodeData.key, nodeData.attributes))
              result.push(nodeData.key);
          }
          return result;
        };
        _proto.reduceNodes = function reduceNodes(callback, initialValue) {
          if (typeof callback !== "function")
            throw new InvalidArgumentsGraphError("Graph.reduceNodes: expecting a callback.");
          if (arguments.length < 2)
            throw new InvalidArgumentsGraphError("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");
          var accumulator = initialValue;
          var iterator2 = this._nodes.values();
          var step, nodeData;
          while (step = iterator2.next(), step.done !== true) {
            nodeData = step.value;
            accumulator = callback(accumulator, nodeData.key, nodeData.attributes);
          }
          return accumulator;
        };
        _proto.nodeEntries = function nodeEntries() {
          var iterator$1 = this._nodes.values();
          return new iterator(function() {
            var step = iterator$1.next();
            if (step.done)
              return step;
            var data = step.value;
            return {
              value: {
                node: data.key,
                attributes: data.attributes
              },
              done: false
            };
          });
        };
        _proto["export"] = function _export() {
          var _this2 = this;
          var nodes = new Array(this._nodes.size);
          var i = 0;
          this._nodes.forEach(function(data, key) {
            nodes[i++] = serializeNode(key, data);
          });
          var edges = new Array(this._edges.size);
          i = 0;
          this._edges.forEach(function(data, key) {
            edges[i++] = serializeEdge(_this2.type, key, data);
          });
          return {
            options: {
              type: this.type,
              multi: this.multi,
              allowSelfLoops: this.allowSelfLoops
            },
            attributes: this.getAttributes(),
            nodes,
            edges
          };
        };
        _proto["import"] = function _import(data) {
          var _this3 = this;
          var merge = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          if (data instanceof Graph3) {
            data.forEachNode(function(n, a) {
              if (merge)
                _this3.mergeNode(n, a);
              else
                _this3.addNode(n, a);
            });
            data.forEachEdge(function(e, a, s, t, _sa, _ta, u) {
              if (merge) {
                if (u)
                  _this3.mergeUndirectedEdgeWithKey(e, s, t, a);
                else
                  _this3.mergeDirectedEdgeWithKey(e, s, t, a);
              } else {
                if (u)
                  _this3.addUndirectedEdgeWithKey(e, s, t, a);
                else
                  _this3.addDirectedEdgeWithKey(e, s, t, a);
              }
            });
            return this;
          }
          if (!isPlainObject(data))
            throw new InvalidArgumentsGraphError("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");
          if (data.attributes) {
            if (!isPlainObject(data.attributes))
              throw new InvalidArgumentsGraphError("Graph.import: invalid attributes. Expecting a plain object.");
            if (merge)
              this.mergeAttributes(data.attributes);
            else
              this.replaceAttributes(data.attributes);
          }
          var i, l, list, node, edge;
          if (data.nodes) {
            list = data.nodes;
            if (!Array.isArray(list))
              throw new InvalidArgumentsGraphError("Graph.import: invalid nodes. Expecting an array.");
            for (i = 0, l = list.length; i < l; i++) {
              node = list[i];
              validateSerializedNode(node);
              var _node = node, key = _node.key, attributes = _node.attributes;
              if (merge)
                this.mergeNode(key, attributes);
              else
                this.addNode(key, attributes);
            }
          }
          if (data.edges) {
            var undirectedByDefault = false;
            if (this.type === "undirected") {
              undirectedByDefault = true;
            }
            list = data.edges;
            if (!Array.isArray(list))
              throw new InvalidArgumentsGraphError("Graph.import: invalid edges. Expecting an array.");
            for (i = 0, l = list.length; i < l; i++) {
              edge = list[i];
              validateSerializedEdge(edge);
              var _edge = edge, source = _edge.source, target = _edge.target, _attributes = _edge.attributes, _edge$undirected = _edge.undirected, undirected2 = _edge$undirected === void 0 ? undirectedByDefault : _edge$undirected;
              var method = void 0;
              if ("key" in edge) {
                method = merge ? undirected2 ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : undirected2 ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey;
                method.call(this, edge.key, source, target, _attributes);
              } else {
                method = merge ? undirected2 ? this.mergeUndirectedEdge : this.mergeDirectedEdge : undirected2 ? this.addUndirectedEdge : this.addDirectedEdge;
                method.call(this, source, target, _attributes);
              }
            }
          }
          return this;
        };
        _proto.nullCopy = function nullCopy(options) {
          var graph = new Graph3(assign({}, this._options, options));
          graph.replaceAttributes(assign({}, this.getAttributes()));
          return graph;
        };
        _proto.emptyCopy = function emptyCopy(options) {
          var graph = this.nullCopy(options);
          this._nodes.forEach(function(nodeData, key) {
            var attributes = assign({}, nodeData.attributes);
            nodeData = new graph.NodeDataClass(key, attributes);
            graph._nodes.set(key, nodeData);
          });
          return graph;
        };
        _proto.copy = function copy(options) {
          options = options || {};
          if (typeof options.type === "string" && options.type !== this.type && options.type !== "mixed")
            throw new UsageGraphError('Graph.copy: cannot create an incompatible copy from "'.concat(this.type, '" type to "').concat(options.type, '" because this would mean losing information about the current graph.'));
          if (typeof options.multi === "boolean" && options.multi !== this.multi && options.multi !== true)
            throw new UsageGraphError("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");
          if (typeof options.allowSelfLoops === "boolean" && options.allowSelfLoops !== this.allowSelfLoops && options.allowSelfLoops !== true)
            throw new UsageGraphError("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");
          var graph = this.emptyCopy(options);
          var iterator2 = this._edges.values();
          var step, edgeData;
          while (step = iterator2.next(), step.done !== true) {
            edgeData = step.value;
            addEdge(graph, "copy", false, edgeData.undirected, edgeData.key, edgeData.source.key, edgeData.target.key, assign({}, edgeData.attributes));
          }
          return graph;
        };
        _proto.toJSON = function toJSON() {
          return this["export"]();
        };
        _proto.toString = function toString() {
          return "[object Graph]";
        };
        _proto.inspect = function inspect() {
          var _this4 = this;
          var nodes = {};
          this._nodes.forEach(function(data, key) {
            nodes[key] = data.attributes;
          });
          var edges = {}, multiIndex = {};
          this._edges.forEach(function(data, key) {
            var direction = data.undirected ? "--" : "->";
            var label = "";
            var source = data.source.key;
            var target = data.target.key;
            var tmp;
            if (data.undirected && source > target) {
              tmp = source;
              source = target;
              target = tmp;
            }
            var desc = "(".concat(source, ")").concat(direction, "(").concat(target, ")");
            if (!key.startsWith("geid_")) {
              label += "[".concat(key, "]: ");
            } else if (_this4.multi) {
              if (typeof multiIndex[desc] === "undefined") {
                multiIndex[desc] = 0;
              } else {
                multiIndex[desc]++;
              }
              label += "".concat(multiIndex[desc], ". ");
            }
            label += desc;
            edges[label] = data.attributes;
          });
          var dummy = {};
          for (var k in this) {
            if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k) && typeof this[k] !== "function" && _typeof(k) !== "symbol")
              dummy[k] = this[k];
          }
          dummy.attributes = this._attributes;
          dummy.nodes = nodes;
          dummy.edges = edges;
          privateProperty(dummy, "constructor", this.constructor);
          return dummy;
        };
        return Graph3;
      }(events.exports.EventEmitter);
      if (typeof Symbol !== "undefined")
        Graph2.prototype[Symbol["for"]("nodejs.util.inspect.custom")] = Graph2.prototype.inspect;
      EDGE_ADD_METHODS.forEach(function(method) {
        ["add", "merge", "update"].forEach(function(verb) {
          var name = method.name(verb);
          var fn = verb === "add" ? addEdge : mergeEdge;
          if (method.generateKey) {
            Graph2.prototype[name] = function(source, target, attributes) {
              return fn(this, name, true, (method.type || this.type) === "undirected", null, source, target, attributes, verb === "update");
            };
          } else {
            Graph2.prototype[name] = function(edge, source, target, attributes) {
              return fn(this, name, false, (method.type || this.type) === "undirected", edge, source, target, attributes, verb === "update");
            };
          }
        });
      });
      attachNodeAttributesMethods(Graph2);
      attachEdgeAttributesMethods(Graph2);
      attachEdgeIterationMethods(Graph2);
      attachNeighborIterationMethods(Graph2);
      var DirectedGraph2 = /* @__PURE__ */ function(_Graph) {
        _inheritsLoose(DirectedGraph3, _Graph);
        function DirectedGraph3(options) {
          var finalOptions = assign({
            type: "directed"
          }, options);
          if ("multi" in finalOptions && finalOptions.multi !== false)
            throw new InvalidArgumentsGraphError("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
          if (finalOptions.type !== "directed")
            throw new InvalidArgumentsGraphError('DirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
          return _Graph.call(this, finalOptions) || this;
        }
        return DirectedGraph3;
      }(Graph2);
      var UndirectedGraph2 = /* @__PURE__ */ function(_Graph2) {
        _inheritsLoose(UndirectedGraph3, _Graph2);
        function UndirectedGraph3(options) {
          var finalOptions = assign({
            type: "undirected"
          }, options);
          if ("multi" in finalOptions && finalOptions.multi !== false)
            throw new InvalidArgumentsGraphError("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
          if (finalOptions.type !== "undirected")
            throw new InvalidArgumentsGraphError('UndirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
          return _Graph2.call(this, finalOptions) || this;
        }
        return UndirectedGraph3;
      }(Graph2);
      var MultiGraph = /* @__PURE__ */ function(_Graph3) {
        _inheritsLoose(MultiGraph2, _Graph3);
        function MultiGraph2(options) {
          var finalOptions = assign({
            multi: true
          }, options);
          if ("multi" in finalOptions && finalOptions.multi !== true)
            throw new InvalidArgumentsGraphError("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");
          return _Graph3.call(this, finalOptions) || this;
        }
        return MultiGraph2;
      }(Graph2);
      var MultiDirectedGraph = /* @__PURE__ */ function(_Graph4) {
        _inheritsLoose(MultiDirectedGraph2, _Graph4);
        function MultiDirectedGraph2(options) {
          var finalOptions = assign({
            type: "directed",
            multi: true
          }, options);
          if ("multi" in finalOptions && finalOptions.multi !== true)
            throw new InvalidArgumentsGraphError("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
          if (finalOptions.type !== "directed")
            throw new InvalidArgumentsGraphError('MultiDirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
          return _Graph4.call(this, finalOptions) || this;
        }
        return MultiDirectedGraph2;
      }(Graph2);
      var MultiUndirectedGraph = /* @__PURE__ */ function(_Graph5) {
        _inheritsLoose(MultiUndirectedGraph2, _Graph5);
        function MultiUndirectedGraph2(options) {
          var finalOptions = assign({
            type: "undirected",
            multi: true
          }, options);
          if ("multi" in finalOptions && finalOptions.multi !== true)
            throw new InvalidArgumentsGraphError("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
          if (finalOptions.type !== "undirected")
            throw new InvalidArgumentsGraphError('MultiUndirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
          return _Graph5.call(this, finalOptions) || this;
        }
        return MultiUndirectedGraph2;
      }(Graph2);
      function attachStaticFromMethod(Class) {
        Class.from = function(data, options) {
          var finalOptions = assign({}, data.options, options);
          var instance = new Class(finalOptions);
          instance["import"](data);
          return instance;
        };
      }
      attachStaticFromMethod(Graph2);
      attachStaticFromMethod(DirectedGraph2);
      attachStaticFromMethod(UndirectedGraph2);
      attachStaticFromMethod(MultiGraph);
      attachStaticFromMethod(MultiDirectedGraph);
      attachStaticFromMethod(MultiUndirectedGraph);
      Graph2.Graph = Graph2;
      Graph2.DirectedGraph = DirectedGraph2;
      Graph2.UndirectedGraph = UndirectedGraph2;
      Graph2.MultiGraph = MultiGraph;
      Graph2.MultiDirectedGraph = MultiDirectedGraph;
      Graph2.MultiUndirectedGraph = MultiUndirectedGraph;
      Graph2.InvalidArgumentsGraphError = InvalidArgumentsGraphError;
      Graph2.NotFoundGraphError = NotFoundGraphError;
      Graph2.UsageGraphError = UsageGraphError;
      return Graph2;
    });
  }
});

// ../testeranto/src/PM/index.ts
var PM = class {
};

// ../testeranto/src/PM/web.ts
var PM_Web = class extends PM {
  constructor(t) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }
  customScreenShot(opts) {
    window["customScreenShot"](opts);
  }
  existsSync(destFolder) {
    return window["existsSync"](destFolder);
  }
  mkdirSync() {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }
  write(writeObject, contents) {
    return window["write"](writeObject.uid, contents);
  }
  writeFileSync(filepath, contents) {
    return window["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  createWriteStream(filepath) {
    return window["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  end(writeObject) {
    return window["end"](writeObject.uid);
  }
  customclose() {
    window["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
        })
      );
    };
  }
  startPuppeteer(options, destFolder) {
    const name = this.testResourceConfiguration.name;
    return fetch(`http://localhost:3234/json/version`).then((v) => {
      return v.json();
    }).then((json) => {
      return puppeteer_core_browser_default.connect({
        browserWSEndpoint: json.webSocketDebuggerUrl
      }).then((b) => {
        this.browser = b;
        const handler2 = {
          get(target, prop, receiver) {
            if (prop === "screenshot") {
              return async (x) => {
                return await window["custom-screenshot"](
                  {
                    ...x,
                    // path: destFolder + "/" + x.path,
                    path: x.path
                  },
                  name
                );
              };
            } else if (prop === "mainFrame") {
              return () => target[prop](...arguments);
            } else {
              return Reflect.get(...arguments);
            }
          }
        };
        const handler1 = {
          get(target, prop, receiver) {
            if (prop === "pages") {
              return async () => {
                return target.pages().then((pages) => {
                  return pages.map((p) => {
                    return new Proxy(p, handler2);
                  });
                });
              };
            }
            return Reflect.get(...arguments);
          }
        };
        const proxy3 = new Proxy(this.browser, handler1);
        this.browser = proxy3;
      });
    });
  }
};

// ../testeranto/src/lib/index.ts
var BaseTestInterface = {
  beforeAll: async (s) => s,
  beforeEach: async function(subject, initialValues, x, testResource, pm) {
    return subject;
  },
  afterEach: async (s) => s,
  afterAll: (store) => void 0,
  butThen: async (store, thenCb) => thenCb(store),
  andWhen: (a) => a,
  assertThis: () => null
};
var DefaultTestInterface = (p) => {
  return {
    ...BaseTestInterface,
    ...p
  };
};
var defaultTestResourceRequirement = {
  ports: 0
};

// ../testeranto/src/lib/abstractBase.ts
var BaseSuite = class {
  constructor(name, index, givens = {}, checks = []) {
    this.name = name;
    this.index = index;
    this.givens = givens;
    this.checks = checks;
    this.fails = [];
  }
  toObj() {
    return {
      name: this.name,
      givens: Object.keys(this.givens).map((k) => this.givens[k].toObj()),
      fails: this.fails
    };
  }
  setup(s, artifactory, tr, pm) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return t;
  }
  afterAll(store, artifactory, pm) {
    return store;
  }
  async run(input, testResourceConfiguration, artifactory, tLog, pm) {
    this.testResourceConfiguration = testResourceConfiguration;
    tLog("test resources: ", JSON.stringify(testResourceConfiguration));
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    console.log("\nSuite:", this.index, this.name);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    const sName = this.name;
    for (const [gNdx, g] of Object.entries(this.givens)) {
      const beforeAllProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "writeFileSync") {
            return (fp, contents) => target[prop](`suite-${sNdx}/beforeAll/${fp}`, contents);
          }
          if (prop === "browser") {
            return new Proxy(target[prop], {
              get(bTarget, bProp, bReceiver) {
                if (bProp === "pages") {
                  return async () => {
                    return bTarget.pages().then((pages) => {
                      return pages.map((page) => {
                        return new Proxy(page, {
                          get(pTarget, pProp, pReciever) {
                            if (pProp === "screenshot") {
                              return async (x) => {
                                return pm.customScreenShot(
                                  {
                                    ...x,
                                    path: `${testResourceConfiguration.fs}/suite-${sNdx}/beforeAll/` + x.path
                                  },
                                  page
                                );
                              };
                            } else if (pProp === "mainFrame") {
                              return () => pTarget[pProp]();
                            } else if (pProp === "close") {
                              return () => pTarget[pProp]();
                            } else {
                              return Reflect.get(...arguments);
                            }
                          }
                        });
                      });
                    });
                  };
                }
              }
            });
          }
          return Reflect.get(...arguments);
        }
      });
      const subject = await this.setup(
        input,
        suiteArtifactory,
        testResourceConfiguration,
        beforeAllProxy
      );
      const giver = this.givens[gNdx];
      try {
        this.store = await giver.give(
          subject,
          gNdx,
          testResourceConfiguration,
          this.assertThat,
          suiteArtifactory,
          tLog,
          pm,
          sNdx
        );
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
      }
    }
    const afterAllProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "writeFileSync") {
          return (fp, contents) => target[prop](`suite-${sNdx}/afterAll/${fp}`, contents);
        }
        if (prop === "browser") {
          return new Proxy(target[prop], {
            get(bTarget, bProp, bReceiver) {
              if (bProp === "pages") {
                return async () => {
                  return bTarget.pages().then((pages) => {
                    return pages.map((page) => {
                      return new Proxy(page, {
                        get(pTarget, pProp, pReciever) {
                          if (pProp === "screenshot") {
                            return async (x) => {
                              return pm.customScreenShot({
                                ...x,
                                path: `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll/` + x.path
                              });
                            };
                          } else if (pProp === "mainFrame") {
                            return () => pTarget[pProp]();
                          } else if (pProp === "close") {
                            return () => pTarget[pProp]();
                          } else {
                            return Reflect.get(...arguments);
                          }
                        }
                      });
                    });
                  });
                };
              }
            }
          });
        }
        return Reflect.get(...arguments);
      }
    });
    try {
      this.afterAll(this.store, artifactory, afterAllProxy);
    } catch (e) {
      console.error(e);
    }
    return this;
  }
};
var BaseGiven = class {
  constructor(name, features2, whens, thens, givenCB, initialValues) {
    this.name = name;
    this.features = features2;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }
  beforeAll(store, artifactory) {
    return store;
  }
  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      // fail: this.fail ? [this.fail] : false,
      features: this.features
    };
  }
  async afterEach(store, key, artifactory, pm) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    try {
      const beforeEachProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "writeFileSync") {
            return (fp, contents) => target[prop](
              `suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`,
              contents
            );
          }
          return Reflect.get(...arguments);
        }
      });
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        beforeEachProxy
      );
      for (const [whenNdx, whenStep] of this.whens.entries()) {
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }
      for (const [thenNdx, thenStep] of this.thens.entries()) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
        );
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog(e);
      tLog("\x07");
    } finally {
      try {
        const afterEachProxy = new Proxy(pm, {
          get(target, prop, receiver) {
            if (prop === "writeFileSync") {
              return (fp, contents) => target[prop](
                `suite-${suiteNdx}/given-${key}/afterAll/${fp}`,
                contents
              );
            }
            if (prop === "browser") {
              return new Proxy(target[prop], {
                get(bTarget, bProp, bReceiver) {
                  if (bProp === "pages") {
                    return async () => {
                      return bTarget.pages().then((pages) => {
                        return pages.map((page) => {
                          return new Proxy(page, {
                            get(pTarget, pProp, pReciever) {
                              if (pProp === "screenshot") {
                                return async (x) => {
                                  return pm.customScreenShot(
                                    {
                                      ...x,
                                      path: `${testResourceConfiguration.fs}/suite-${suiteNdx}/given-${key}/afterEach/` + x.path
                                    },
                                    page
                                  );
                                };
                              } else if (pProp === "mainFrame") {
                                return () => pTarget[pProp]();
                              } else if (pProp === "exposeFunction") {
                                return (...a) => pTarget[pProp](...a);
                              } else if (pProp === "removeExposedFunction") {
                                return pTarget[pProp].bind(pTarget);
                              } else {
                                return Reflect.get(...arguments);
                              }
                            }
                          });
                        });
                      });
                    };
                  }
                }
              });
            }
            return Reflect.get(...arguments);
          }
        });
        await this.afterEach(this.store, key, givenArtifactory, afterEachProxy);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, whenCB) {
    this.name = name;
    this.whenCB = whenCB;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, key) {
    tLog(" When:", this.name);
    const name = this.name;
    const andWhenProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "writeFileSync") {
          return (fp, contents) => (
            // target[prop](`${key}/andWhen/${fp}`, contents);
            target[prop](`${key}/andWhen/${fp}`, contents)
          );
        }
        if (prop === "browser") {
          return new Proxy(target[prop], {
            get(bTarget, bProp, bReceiver) {
              if (bProp === "pages") {
                return async () => {
                  return bTarget.pages().then((pages) => {
                    return pages.map((page) => {
                      return new Proxy(page, {
                        get(pTarget, pProp, pReciever) {
                          if (pProp === "screenshot") {
                            return async (x) => {
                              return pm.customScreenShot(
                                {
                                  ...x,
                                  path: `${testResourceConfiguration.fs}/${key}/afterEach/` + x.path
                                },
                                page
                              );
                            };
                          } else if (pProp === "mainFrame") {
                            return () => pTarget[pProp]();
                          } else if (pProp === "exposeFunction") {
                            return pTarget[pProp].bind(pTarget);
                          } else if (pProp === "removeExposedFunction") {
                            return pTarget[pProp].bind(pTarget);
                          } else {
                            return Reflect.get(...arguments);
                          }
                        }
                      });
                    });
                  });
                };
              }
            }
          });
        }
        return Reflect.get(...arguments);
      }
    });
    try {
      return await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        andWhenProxy
      );
    } catch (e) {
      this.error = true;
      throw e;
    }
  }
};
var BaseThen = class {
  constructor(name, thenCB) {
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    tLog(" Then:", this.name);
    try {
      const butThenProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "writeFileSync") {
            return (fp, contents) => target[prop](`${filepath}/${fp}`, contents);
          }
          if (prop === "browser") {
            return new Proxy(target[prop], {
              get(bTarget, bProp, bReceiver) {
                if (bProp === "pages") {
                  return async () => {
                    return bTarget.pages().then((pages) => {
                      return pages.map((page) => {
                        return new Proxy(page, {
                          get(pTarget, pProp, pReciever) {
                            if (pProp === "screenshot") {
                              return async (x2) => {
                                return pm.customScreenShot(
                                  {
                                    ...x2,
                                    path: `${testResourceConfiguration.fs}/${filepath}/butThen/` + x2.path
                                  },
                                  page
                                );
                              };
                            } else if (pProp === "close") {
                              return () => pTarget[pProp]();
                            } else if (pProp === "mainFrame") {
                              return () => pTarget[pProp]();
                            } else if (pProp === "exposeFunction") {
                              return (...a) => pTarget[pProp](...a);
                            } else if (pProp === "removeExposedFunction") {
                              return pTarget[pProp].bind(pTarget);
                            } else {
                              return Reflect.get(...arguments);
                            }
                          }
                        });
                      });
                    });
                  };
                }
              }
            });
          }
          return Reflect.get(...arguments);
        }
      });
      const x = await this.butThen(
        store,
        this.thenCB,
        testResourceConfiguration,
        butThenProxy
        // pm
      );
      return x;
    } catch (e) {
      console.log("test failed", e);
      this.error = e.message;
      throw e;
    }
  }
};
var BaseCheck = class {
  constructor(name, features2, checkCB, whens, thens) {
    this.name = name;
    this.features = features2;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;
  }
  async afterEach(store, key, cb, pm) {
    return;
  }
  async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
    tLog(`
 Check: ${this.name}`);
    const store = await this.checkThat(
      subject,
      testResourceConfiguration,
      artifactory
    );
    await this.checkCB(
      Object.entries(this.whens).reduce((a, [key2, when]) => {
        a[key2] = async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog,
            pm,
            "x"
          );
        };
        return a;
      }, {}),
      Object.entries(this.thens).reduce((a, [key2, then]) => {
        a[key2] = async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog,
            pm
          );
          tester(t);
        };
        return a;
      }, {})
    );
    await this.afterEach(store, key, () => {
    }, pm);
    return;
  }
};

// ../testeranto/src/lib/basebuilder.ts
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, testResourceRequirement, testSpecification) {
    this.input = input;
    this.artifacts = [];
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then(),
      this.Check()
    );
    this.testJobs = this.specs.map((suite) => {
      const suiteRunner = (suite2) => async (puppetMaster, tLog) => {
        await puppetMaster.startPuppeteer(
          {
            browserWSEndpoint: puppetMaster.testResourceConfiguration.browserWSEndpoint
          },
          puppetMaster.testResourceConfiguration.fs
        );
        return await suite2.run(
          input,
          puppetMaster.testResourceConfiguration,
          (fPath, value) => puppetMaster.testArtiFactoryfileWriter(
            tLog,
            (p) => {
              this.artifacts.push(p);
            }
          )(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value),
          tLog,
          puppetMaster
        );
      };
      const runner = suiteRunner(suite);
      return {
        test: suite,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async function(puppetMaster) {
          await puppetMaster.mkdirSync();
          const logFilePath = "log.txt";
          const access = await puppetMaster.createWriteStream(logFilePath);
          const tLog = (...l) => {
            puppetMaster.write(access, `${l.toString()}
`);
          };
          const suiteDone = await runner(
            puppetMaster,
            tLog
          );
          const logPromise = new Promise((res, rej) => {
            puppetMaster.end(access);
            res(true);
          });
          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          puppetMaster.writeFileSync(`exitcode`, numberOfFailures.toString());
          puppetMaster.writeFileSync(
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          );
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts: this.artifacts || [],
            logPromise
          };
        }
      };
    });
  }
  Specs() {
    return this.specs;
  }
  Suites() {
    return this.suitesOverrides;
  }
  Given() {
    return this.givenOverides;
  }
  When() {
    return this.whenOverides;
  }
  Then() {
    return this.thenOverides;
  }
  Check() {
    return this.checkOverides;
  }
};

// ../testeranto/src/lib/classBuilder.ts
var ClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens,
            checks
          );
        };
        return a;
      },
      {}
    );
    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, givEn]) => {
        a[key] = (features2, whens, thens, givEn2) => {
          return new givenKlasser.prototype.constructor(
            key,
            features2,
            whens,
            thens,
            testImplementation.givens[key],
            givEn2
          );
        };
        return a;
      },
      {}
    );
    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]) => {
        a[key] = (payload) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          );
        };
        return a;
      },
      {}
    );
    const classyThens = Object.entries(testImplementation.thens).reduce(
      (a, [key, thEn]) => {
        a[key] = (expected, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
        return a;
      },
      {}
    );
    const classyChecks = Object.entries(testImplementation.checks).reduce(
      (a, [key, z]) => {
        a[key] = (somestring, features2, callback) => {
          return new checkKlasser.prototype.constructor(
            somestring,
            features2,
            callback,
            classyWhens,
            classyThens
          );
        };
        return a;
      },
      {}
    );
    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks,
      testResourceRequirement,
      testSpecification
      // puppetMaster
    );
  }
};

// ../testeranto/src/lib/core.ts
var Testeranto = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testInterface) {
    const fullTestInterface = DefaultTestInterface(testInterface);
    super(
      testImplementation,
      testSpecification,
      input,
      class extends BaseSuite {
        afterAll(store, artifactory, pm) {
          return fullTestInterface.afterAll(
            store,
            (fPath, value) => {
              artifactory(`afterAll4-${this.name}/${fPath}`, value);
            },
            pm
          );
        }
        assertThat(t) {
          fullTestInterface.assertThis(t);
        }
        async setup(s, artifactory, tr, pm) {
          return (fullTestInterface.beforeAll || (async (input2, artifactory2, tr2, pm2) => input2))(s, this.testResourceConfiguration, artifactory, pm);
        }
      },
      class Given extends BaseGiven {
        async givenThat(subject, testResource, artifactory, initializer, pm) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            (fPath, value) => (
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value)
            ),
            testResource,
            this.initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath, value) => artifactory(`after/${fPath}`, value),
                pm
              )
            )
          );
        }
      },
      class When extends BaseWhen {
        async andWhen(store, whenCB, testResource, pm) {
          return await fullTestInterface.andWhen(
            store,
            whenCB,
            testResource,
            pm
          );
        }
      },
      class Then extends BaseThen {
        async butThen(store, thenCB, testResourceConfiguration, pm) {
          return await fullTestInterface.butThen(
            store,
            thenCB,
            testResourceConfiguration,
            pm
          );
        }
      },
      class Check extends BaseCheck {
        constructor(name, features2, checkCallback, whens, thens, initialValues) {
          super(name, features2, checkCallback, whens, thens);
          this.initialValues = initialValues;
        }
        async checkThat(subject, testResourceConfiguration, artifactory, pm) {
          return fullTestInterface.beforeEach(
            subject,
            this.initialValues,
            (fPath, value) => artifactory(`before/${fPath}`, value),
            testResourceConfiguration,
            this.initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath, value) => (
                  // TODO does not work?
                  artifactory(`afterEach2-${this.name}/${fPath}`, value)
                ),
                pm
              )
            )
          );
        }
      },
      testResourceRequirement
      // puppetMaster
    );
  }
};

// ../testeranto/src/Web.ts
var WebTesteranto = class extends Testeranto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    const t = partialTestResource;
    const pm = new PM_Web(t);
    const { failed, artifacts, logPromise } = await this.testJobs[0].receiveTestResourceConfig(pm);
    pm.customclose();
  }
};
var Web_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  return new WebTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};

// ../testeranto/dist/module/Features.js
var import_graphology_umd = __toESM(require_graphology_umd(), 1);
var { DirectedGraph, UndirectedGraph } = import_graphology_umd.default;
var BaseFeature = class {
  constructor(name) {
    this.name = name;
  }
};
var TesterantoGraphUndirected = class {
  constructor(name) {
    this.name = name;
    this.graph = new UndirectedGraph();
  }
  connect(a, b, relation) {
    this.graph.mergeEdge(a, b, { type: relation });
  }
};
var TesterantoGraphDirected = class {
  constructor(name) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
};
var TesterantoGraphDirectedAcyclic = class {
  constructor(name) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
};
var TesterantoFeatures = class {
  constructor(features2, graphs) {
    this.features = features2;
    this.graphs = graphs;
  }
  networks() {
    return [
      ...this.graphs.undirected.values(),
      ...this.graphs.directed.values(),
      ...this.graphs.dags.values()
    ];
  }
  toObj() {
    return {
      features: Object.entries(this.features).map(([name, feature]) => {
        return Object.assign(Object.assign({}, feature), { inNetworks: this.networks().filter((network) => {
          return network.graph.hasNode(feature.name);
        }).map((network) => {
          return {
            network: network.name,
            neighbors: network.graph.neighbors(feature.name)
          };
        }) });
      }),
      networks: this.networks().map((network) => {
        return Object.assign({}, network);
      })
    };
  }
};

// features.test.mts
var MyFeature = class extends BaseFeature {
  due;
  constructor(name, due) {
    super(name);
    this.due = due;
  }
};
var features = {
  root: new MyFeature("kokomo bay!"),
  mint: new MyFeature("An ERC721 which is redeemable?!!!"),
  redemption: new MyFeature(
    "Redeems an ERC-721, marking its state as redeemed"
  ),
  // federatedSplitContract: new MyFeature(
  //   "A website which can acts as a storefront"
  // ),
  // markRedeemed: new MyFeature(
  //   "Registers contract status as redeemed, and changes image"
  // ),
  // encryptShipping: new MyFeature(
  //   "Buyer encrypts plaintext message and stores value on contract"
  // ),
  // decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),
  // buildSilo: new MyFeature(
  //   "build the rocket silo",
  //   new Date("2023-05-02T02:36:34+0000")
  // ),
  // buildRocket: new MyFeature(
  //   "build the rocket",
  //   new Date("2023-06-06T02:36:34+0000")
  // ),
  // buildSatellite: new MyFeature(
  //   "build the rocket payload",
  //   new Date("2023-06-06T02:36:34+0000")
  // ),
  hello: new MyFeature("an english greeting"),
  aloha: new MyFeature("hello in hawaiian")
  // gutentag: new MyFeature("gutentag"),
  // buenosDias: new MyFeature("buenos dias"),
  // hola: new MyFeature("hola"),
  // bienVenidos: new MyFeature("bien venidos"),
  // walkingTheDog: new MyFeature("my favorite chore"),
};
var priorityGraph = new TesterantoGraphDirectedAcyclic("Priority");
priorityGraph.connect(`root`, `redemption`);
priorityGraph.connect(`root`, `federatedSplitContract`);
priorityGraph.connect(`root`, `mint`);
priorityGraph.connect(`redemption`, `markRedeemed`);
priorityGraph.connect(`redemption`, `encryptShipping`);
priorityGraph.connect(`redemption`, `decryptShipping`);
var semantic = new TesterantoGraphDirected("some semantic directed graph");
semantic.connect(`hello`, `aloha`, "superceedes");
semantic.connect(`gutentag`, `hola`, "negates");
var undirected = new TesterantoGraphUndirected(
  "an undirected semantic graph"
);
undirected.connect(`gutenta`, `aloha`, "related");
undirected.connect(`buildRocket`, `buildSatellite`, "overlap");
undirected.connect(`buildRocket`, `buildSilo`, "overlap");
var features_test_default = new TesterantoFeatures(features, {
  undirected: [undirected],
  directed: [semantic],
  dags: [priorityGraph]
});

// src/Rectangle.test.specification.ts
var RectangleTesterantoBaseTestSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Rectangle class",
      {
        test0: Given.Default(
          ["hello"],
          [When.setWidth(4), When.setHeight(9)],
          [Then.getWidth(4), Then.getHeight(9)]
        ),
        test1: Given.Default(
          [`67ae06bac3c5fa5a98a08e32`],
          [When.setWidth(4), When.setHeight(5)],
          [
            Then.getWidth(4),
            Then.getHeight(5),
            Then.area(20),
            Then.AreaPlusCircumference(38)
          ]
        ),
        test2: Given.Default(
          [`67ae06bac3c5fa5a98a08e32`],
          [When.setHeight(4), When.setWidth(33)],
          [
            // Then.area(12)
          ]
        ),
        test3: Given.Default(
          [`67ae06bac3c5fa5a98a08e32`],
          [When.setHeight(5), When.setWidth(5)],
          [
            // Then.area(5)
          ]
        ),
        test4: Given.Default(
          [`67ae06bac3c5fa5a98a08e32`],
          [When.setHeight(6), When.setWidth(6)],
          [
            // Then.area(37)
          ]
        )
      },
      []
      // Check.Default(
      //   "imperative style",
      //   async ({ PostToAdd }, { TheNumberIs }) => {
      //     const a = await PostToAdd(2);
      //     const b = parseInt(await PostToAdd(3));
      //     await TheNumberIs(b);
      //     await PostToAdd(2);
      //     await TheNumberIs(7);
      //     await PostToAdd(3);
      //     await TheNumberIs(10);
      //     assert.equal(await PostToAdd(-15), -5);
      //     await TheNumberIs(-5);
      //   }
      // ),
      // ]
    )
  ];
};

// src/Rectangle.ts
var Rectangle = class {
  height;
  width;
  constructor(height = 2, width = 2) {
    this.height = height;
    this.width = width;
  }
  getHeight() {
    return this.height;
  }
  getWidth() {
    return this.width;
  }
  setHeight(height) {
    this.height = height;
  }
  setWidth(width) {
    this.width = width;
  }
  area() {
    return this.width * this.height;
  }
  circumference() {
    return this.width * 2 + this.height * 2;
  }
};
var Rectangle_default = Rectangle;

// src/Rectangle.test.implementation.ts
var RectangleTesterantoBaseTestImplementation = {
  suites: {
    Default: "a default suite"
  },
  givens: {
    Default: () => new Rectangle_default(),
    WidthOfOneAndHeightOfOne: () => new Rectangle_default(1, 1),
    WidthAndHeightOf: (width, height) => new Rectangle_default(width, height)
  },
  whens: {
    HeightIsPubliclySetTo: (height) => (rectangle) => rectangle.height = height,
    WidthIsPubliclySetTo: (width) => (rectangle) => rectangle.width = width,
    setWidth: (width) => (rectangle) => rectangle.setWidth(width),
    setHeight: (height) => (rectangle) => rectangle.setHeight(height)
  },
  thens: {
    AreaPlusCircumference: (combined) => (rectangle) => {
      assert.equal(rectangle.area() + rectangle.circumference(), combined);
    },
    getWidth: (width) => (rectangle) => assert.equal(rectangle.width, width),
    getHeight: (height) => (rectangle) => assert.equal(rectangle.height, height),
    area: (area) => (rectangle) => assert.equal(rectangle.area(), area),
    prototype: (name) => (rectangle) => assert.equal(1, 1),
    circumference: (circumference) => (rectangle) => assert.equal(rectangle.circumference(), circumference)
  },
  checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  }
};

// src/Rectangle.test.ts
var RectangleTesterantoBasePrototype = Rectangle_default.prototype;

// src/Rectangle/Rectangle.test.electron.ts
var Rectangle_test_electron_default = Web_default(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  {
    beforeEach: async (rectangleProto, init, artificer, tr, x, pm) => {
      pm.writeFileSync("beforeEachLog", "bar");
      return rectangleProto;
    },
    afterAll: async (store, artificer, utils) => {
      return new Promise(async (res, rej) => {
        console.log("afterAll", utils);
        utils.writeFileSync("afterAllLog", "bar");
        const page = (await utils.browser.pages()).filter((x) => {
          const parsedUrl = new URL(x.url());
          parsedUrl.search = "";
          const strippedUrl = parsedUrl.toString();
          return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/Rectangle/Rectangle.test.electron.html";
        })[0];
        page.screenshot({
          path: "afterAllLog.jpg"
        });
        res(store);
      });
    },
    andWhen: async function(s, whenCB, tr, utils) {
      utils.writeFileSync("andWhenLog", "icecream");
      return whenCB(s);
    }
  },
  {
    ports: 0
  },
  features
);
export {
  Rectangle_test_electron_default as default
};
