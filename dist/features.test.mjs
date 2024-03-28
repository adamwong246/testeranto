import {
  __commonJS,
  __toESM
} from "./chunk-YWLLX3TT.mjs";

// ../testeranto/node_modules/graphology/dist/graphology.umd.min.js
var require_graphology_umd_min = __commonJS({
  "../testeranto/node_modules/graphology/dist/graphology.umd.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).graphology = e();
    }(exports, function() {
      "use strict";
      function t(e2) {
        return t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t2) {
          return typeof t2;
        } : function(t2) {
          return t2 && "function" == typeof Symbol && t2.constructor === Symbol && t2 !== Symbol.prototype ? "symbol" : typeof t2;
        }, t(e2);
      }
      function e(t2, e2) {
        t2.prototype = Object.create(e2.prototype), t2.prototype.constructor = t2, r(t2, e2);
      }
      function n(t2) {
        return n = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
          return t3.__proto__ || Object.getPrototypeOf(t3);
        }, n(t2);
      }
      function r(t2, e2) {
        return r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
          return t3.__proto__ = e3, t3;
        }, r(t2, e2);
      }
      function i() {
        if ("undefined" == typeof Reflect || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if ("function" == typeof Proxy)
          return true;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          })), true;
        } catch (t2) {
          return false;
        }
      }
      function o(t2, e2, n2) {
        return o = i() ? Reflect.construct.bind() : function(t3, e3, n3) {
          var i2 = [null];
          i2.push.apply(i2, e3);
          var o2 = new (Function.bind.apply(t3, i2))();
          return n3 && r(o2, n3.prototype), o2;
        }, o.apply(null, arguments);
      }
      function a(t2) {
        var e2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
        return a = function(t3) {
          if (null === t3 || (i2 = t3, -1 === Function.toString.call(i2).indexOf("[native code]")))
            return t3;
          var i2;
          if ("function" != typeof t3)
            throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== e2) {
            if (e2.has(t3))
              return e2.get(t3);
            e2.set(t3, a2);
          }
          function a2() {
            return o(t3, arguments, n(this).constructor);
          }
          return a2.prototype = Object.create(t3.prototype, { constructor: { value: a2, enumerable: false, writable: true, configurable: true } }), r(a2, t3);
        }, a(t2);
      }
      function c(t2) {
        if (void 0 === t2)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t2;
      }
      var u = function() {
        for (var t2 = arguments[0], e2 = 1, n2 = arguments.length; e2 < n2; e2++)
          if (arguments[e2])
            for (var r2 in arguments[e2])
              t2[r2] = arguments[e2][r2];
        return t2;
      };
      function d(t2, e2, n2, r2) {
        var i2 = t2._nodes.get(e2), o2 = null;
        return i2 ? o2 = "mixed" === r2 ? i2.out && i2.out[n2] || i2.undirected && i2.undirected[n2] : "directed" === r2 ? i2.out && i2.out[n2] : i2.undirected && i2.undirected[n2] : o2;
      }
      function s(e2) {
        return "object" === t(e2) && null !== e2 && e2.constructor === Object;
      }
      function h(t2) {
        var e2;
        for (e2 in t2)
          return false;
        return true;
      }
      function p(t2, e2, n2) {
        Object.defineProperty(t2, e2, { enumerable: false, configurable: false, writable: true, value: n2 });
      }
      function f(t2, e2, n2) {
        var r2 = { enumerable: true, configurable: true };
        "function" == typeof n2 ? r2.get = n2 : (r2.value = n2, r2.writable = false), Object.defineProperty(t2, e2, r2);
      }
      function l(t2) {
        return !!s(t2) && !(t2.attributes && !Array.isArray(t2.attributes));
      }
      "function" == typeof Object.assign && (u = Object.assign);
      var g, y = { exports: {} }, w = "object" == typeof Reflect ? Reflect : null, v = w && "function" == typeof w.apply ? w.apply : function(t2, e2, n2) {
        return Function.prototype.apply.call(t2, e2, n2);
      };
      g = w && "function" == typeof w.ownKeys ? w.ownKeys : Object.getOwnPropertySymbols ? function(t2) {
        return Object.getOwnPropertyNames(t2).concat(Object.getOwnPropertySymbols(t2));
      } : function(t2) {
        return Object.getOwnPropertyNames(t2);
      };
      var b = Number.isNaN || function(t2) {
        return t2 != t2;
      };
      function m() {
        m.init.call(this);
      }
      y.exports = m, y.exports.once = function(t2, e2) {
        return new Promise(function(n2, r2) {
          function i2(n3) {
            t2.removeListener(e2, o2), r2(n3);
          }
          function o2() {
            "function" == typeof t2.removeListener && t2.removeListener("error", i2), n2([].slice.call(arguments));
          }
          U(t2, e2, o2, { once: true }), "error" !== e2 && function(t3, e3, n3) {
            "function" == typeof t3.on && U(t3, "error", e3, n3);
          }(t2, i2, { once: true });
        });
      }, m.EventEmitter = m, m.prototype._events = void 0, m.prototype._eventsCount = 0, m.prototype._maxListeners = void 0;
      var k = 10;
      function _(t2) {
        if ("function" != typeof t2)
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t2);
      }
      function G(t2) {
        return void 0 === t2._maxListeners ? m.defaultMaxListeners : t2._maxListeners;
      }
      function x(t2, e2, n2, r2) {
        var i2, o2, a2, c2;
        if (_(n2), void 0 === (o2 = t2._events) ? (o2 = t2._events = /* @__PURE__ */ Object.create(null), t2._eventsCount = 0) : (void 0 !== o2.newListener && (t2.emit("newListener", e2, n2.listener ? n2.listener : n2), o2 = t2._events), a2 = o2[e2]), void 0 === a2)
          a2 = o2[e2] = n2, ++t2._eventsCount;
        else if ("function" == typeof a2 ? a2 = o2[e2] = r2 ? [n2, a2] : [a2, n2] : r2 ? a2.unshift(n2) : a2.push(n2), (i2 = G(t2)) > 0 && a2.length > i2 && !a2.warned) {
          a2.warned = true;
          var u2 = new Error("Possible EventEmitter memory leak detected. " + a2.length + " " + String(e2) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          u2.name = "MaxListenersExceededWarning", u2.emitter = t2, u2.type = e2, u2.count = a2.length, c2 = u2, console && console.warn && console.warn(c2);
        }
        return t2;
      }
      function E() {
        if (!this.fired)
          return this.target.removeListener(this.type, this.wrapFn), this.fired = true, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
      }
      function A(t2, e2, n2) {
        var r2 = { fired: false, wrapFn: void 0, target: t2, type: e2, listener: n2 }, i2 = E.bind(r2);
        return i2.listener = n2, r2.wrapFn = i2, i2;
      }
      function L(t2, e2, n2) {
        var r2 = t2._events;
        if (void 0 === r2)
          return [];
        var i2 = r2[e2];
        return void 0 === i2 ? [] : "function" == typeof i2 ? n2 ? [i2.listener || i2] : [i2] : n2 ? function(t3) {
          for (var e3 = new Array(t3.length), n3 = 0; n3 < e3.length; ++n3)
            e3[n3] = t3[n3].listener || t3[n3];
          return e3;
        }(i2) : D(i2, i2.length);
      }
      function S(t2) {
        var e2 = this._events;
        if (void 0 !== e2) {
          var n2 = e2[t2];
          if ("function" == typeof n2)
            return 1;
          if (void 0 !== n2)
            return n2.length;
        }
        return 0;
      }
      function D(t2, e2) {
        for (var n2 = new Array(e2), r2 = 0; r2 < e2; ++r2)
          n2[r2] = t2[r2];
        return n2;
      }
      function U(t2, e2, n2, r2) {
        if ("function" == typeof t2.on)
          r2.once ? t2.once(e2, n2) : t2.on(e2, n2);
        else {
          if ("function" != typeof t2.addEventListener)
            throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t2);
          t2.addEventListener(e2, function i2(o2) {
            r2.once && t2.removeEventListener(e2, i2), n2(o2);
          });
        }
      }
      function N(t2) {
        if ("function" != typeof t2)
          throw new Error("obliterator/iterator: expecting a function!");
        this.next = t2;
      }
      Object.defineProperty(m, "defaultMaxListeners", { enumerable: true, get: function() {
        return k;
      }, set: function(t2) {
        if ("number" != typeof t2 || t2 < 0 || b(t2))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t2 + ".");
        k = t2;
      } }), m.init = function() {
        void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      }, m.prototype.setMaxListeners = function(t2) {
        if ("number" != typeof t2 || t2 < 0 || b(t2))
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t2 + ".");
        return this._maxListeners = t2, this;
      }, m.prototype.getMaxListeners = function() {
        return G(this);
      }, m.prototype.emit = function(t2) {
        for (var e2 = [], n2 = 1; n2 < arguments.length; n2++)
          e2.push(arguments[n2]);
        var r2 = "error" === t2, i2 = this._events;
        if (void 0 !== i2)
          r2 = r2 && void 0 === i2.error;
        else if (!r2)
          return false;
        if (r2) {
          var o2;
          if (e2.length > 0 && (o2 = e2[0]), o2 instanceof Error)
            throw o2;
          var a2 = new Error("Unhandled error." + (o2 ? " (" + o2.message + ")" : ""));
          throw a2.context = o2, a2;
        }
        var c2 = i2[t2];
        if (void 0 === c2)
          return false;
        if ("function" == typeof c2)
          v(c2, this, e2);
        else {
          var u2 = c2.length, d2 = D(c2, u2);
          for (n2 = 0; n2 < u2; ++n2)
            v(d2[n2], this, e2);
        }
        return true;
      }, m.prototype.addListener = function(t2, e2) {
        return x(this, t2, e2, false);
      }, m.prototype.on = m.prototype.addListener, m.prototype.prependListener = function(t2, e2) {
        return x(this, t2, e2, true);
      }, m.prototype.once = function(t2, e2) {
        return _(e2), this.on(t2, A(this, t2, e2)), this;
      }, m.prototype.prependOnceListener = function(t2, e2) {
        return _(e2), this.prependListener(t2, A(this, t2, e2)), this;
      }, m.prototype.removeListener = function(t2, e2) {
        var n2, r2, i2, o2, a2;
        if (_(e2), void 0 === (r2 = this._events))
          return this;
        if (void 0 === (n2 = r2[t2]))
          return this;
        if (n2 === e2 || n2.listener === e2)
          0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : (delete r2[t2], r2.removeListener && this.emit("removeListener", t2, n2.listener || e2));
        else if ("function" != typeof n2) {
          for (i2 = -1, o2 = n2.length - 1; o2 >= 0; o2--)
            if (n2[o2] === e2 || n2[o2].listener === e2) {
              a2 = n2[o2].listener, i2 = o2;
              break;
            }
          if (i2 < 0)
            return this;
          0 === i2 ? n2.shift() : function(t3, e3) {
            for (; e3 + 1 < t3.length; e3++)
              t3[e3] = t3[e3 + 1];
            t3.pop();
          }(n2, i2), 1 === n2.length && (r2[t2] = n2[0]), void 0 !== r2.removeListener && this.emit("removeListener", t2, a2 || e2);
        }
        return this;
      }, m.prototype.off = m.prototype.removeListener, m.prototype.removeAllListeners = function(t2) {
        var e2, n2, r2;
        if (void 0 === (n2 = this._events))
          return this;
        if (void 0 === n2.removeListener)
          return 0 === arguments.length ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : void 0 !== n2[t2] && (0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : delete n2[t2]), this;
        if (0 === arguments.length) {
          var i2, o2 = Object.keys(n2);
          for (r2 = 0; r2 < o2.length; ++r2)
            "removeListener" !== (i2 = o2[r2]) && this.removeAllListeners(i2);
          return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
        }
        if ("function" == typeof (e2 = n2[t2]))
          this.removeListener(t2, e2);
        else if (void 0 !== e2)
          for (r2 = e2.length - 1; r2 >= 0; r2--)
            this.removeListener(t2, e2[r2]);
        return this;
      }, m.prototype.listeners = function(t2) {
        return L(this, t2, true);
      }, m.prototype.rawListeners = function(t2) {
        return L(this, t2, false);
      }, m.listenerCount = function(t2, e2) {
        return "function" == typeof t2.listenerCount ? t2.listenerCount(e2) : S.call(t2, e2);
      }, m.prototype.listenerCount = S, m.prototype.eventNames = function() {
        return this._eventsCount > 0 ? g(this._events) : [];
      }, "undefined" != typeof Symbol && (N.prototype[Symbol.iterator] = function() {
        return this;
      }), N.of = function() {
        var t2 = arguments, e2 = t2.length, n2 = 0;
        return new N(function() {
          return n2 >= e2 ? { done: true } : { done: false, value: t2[n2++] };
        });
      }, N.empty = function() {
        return new N(function() {
          return { done: true };
        });
      }, N.fromSequence = function(t2) {
        var e2 = 0, n2 = t2.length;
        return new N(function() {
          return e2 >= n2 ? { done: true } : { done: false, value: t2[e2++] };
        });
      }, N.is = function(t2) {
        return t2 instanceof N || "object" == typeof t2 && null !== t2 && "function" == typeof t2.next;
      };
      var O = N, j = {};
      j.ARRAY_BUFFER_SUPPORT = "undefined" != typeof ArrayBuffer, j.SYMBOL_SUPPORT = "undefined" != typeof Symbol;
      var C = O, M = j, z = M.ARRAY_BUFFER_SUPPORT, W = M.SYMBOL_SUPPORT;
      var P = function(t2) {
        var e2 = function(t3) {
          return "string" == typeof t3 || Array.isArray(t3) || z && ArrayBuffer.isView(t3) ? C.fromSequence(t3) : "object" != typeof t3 || null === t3 ? null : W && "function" == typeof t3[Symbol.iterator] ? t3[Symbol.iterator]() : "function" == typeof t3.next ? t3 : null;
        }(t2);
        if (!e2)
          throw new Error("obliterator: target is not iterable nor a valid iterator.");
        return e2;
      }, R = P, K = function(t2, e2) {
        for (var n2, r2 = arguments.length > 1 ? e2 : 1 / 0, i2 = r2 !== 1 / 0 ? new Array(r2) : [], o2 = 0, a2 = R(t2); ; ) {
          if (o2 === r2)
            return i2;
          if ((n2 = a2.next()).done)
            return o2 !== e2 && (i2.length = o2), i2;
          i2[o2++] = n2.value;
        }
      }, T = function(t2) {
        function n2(e2) {
          var n3;
          return (n3 = t2.call(this) || this).name = "GraphError", n3.message = e2, n3;
        }
        return e(n2, t2), n2;
      }(a(Error)), B = function(t2) {
        function n2(e2) {
          var r2;
          return (r2 = t2.call(this, e2) || this).name = "InvalidArgumentsGraphError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(c(r2), n2.prototype.constructor), r2;
        }
        return e(n2, t2), n2;
      }(T), F = function(t2) {
        function n2(e2) {
          var r2;
          return (r2 = t2.call(this, e2) || this).name = "NotFoundGraphError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(c(r2), n2.prototype.constructor), r2;
        }
        return e(n2, t2), n2;
      }(T), I = function(t2) {
        function n2(e2) {
          var r2;
          return (r2 = t2.call(this, e2) || this).name = "UsageGraphError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(c(r2), n2.prototype.constructor), r2;
        }
        return e(n2, t2), n2;
      }(T);
      function Y(t2, e2) {
        this.key = t2, this.attributes = e2, this.clear();
      }
      function q(t2, e2) {
        this.key = t2, this.attributes = e2, this.clear();
      }
      function J(t2, e2) {
        this.key = t2, this.attributes = e2, this.clear();
      }
      function V(t2, e2, n2, r2, i2) {
        this.key = e2, this.attributes = i2, this.undirected = t2, this.source = n2, this.target = r2;
      }
      Y.prototype.clear = function() {
        this.inDegree = 0, this.outDegree = 0, this.undirectedDegree = 0, this.undirectedLoops = 0, this.directedLoops = 0, this.in = {}, this.out = {}, this.undirected = {};
      }, q.prototype.clear = function() {
        this.inDegree = 0, this.outDegree = 0, this.directedLoops = 0, this.in = {}, this.out = {};
      }, J.prototype.clear = function() {
        this.undirectedDegree = 0, this.undirectedLoops = 0, this.undirected = {};
      }, V.prototype.attach = function() {
        var t2 = "out", e2 = "in";
        this.undirected && (t2 = e2 = "undirected");
        var n2 = this.source.key, r2 = this.target.key;
        this.source[t2][r2] = this, this.undirected && n2 === r2 || (this.target[e2][n2] = this);
      }, V.prototype.attachMulti = function() {
        var t2 = "out", e2 = "in", n2 = this.source.key, r2 = this.target.key;
        this.undirected && (t2 = e2 = "undirected");
        var i2 = this.source[t2], o2 = i2[r2];
        if (void 0 === o2)
          return i2[r2] = this, void (this.undirected && n2 === r2 || (this.target[e2][n2] = this));
        o2.previous = this, this.next = o2, i2[r2] = this, this.target[e2][n2] = this;
      }, V.prototype.detach = function() {
        var t2 = this.source.key, e2 = this.target.key, n2 = "out", r2 = "in";
        this.undirected && (n2 = r2 = "undirected"), delete this.source[n2][e2], delete this.target[r2][t2];
      }, V.prototype.detachMulti = function() {
        var t2 = this.source.key, e2 = this.target.key, n2 = "out", r2 = "in";
        this.undirected && (n2 = r2 = "undirected"), void 0 === this.previous ? void 0 === this.next ? (delete this.source[n2][e2], delete this.target[r2][t2]) : (this.next.previous = void 0, this.source[n2][e2] = this.next, this.target[r2][t2] = this.next) : (this.previous.next = this.next, void 0 !== this.next && (this.next.previous = this.previous));
      };
      function H(t2, e2, n2, r2, i2, o2, a2) {
        var c2, u2, d2, s2;
        if (r2 = "" + r2, 0 === n2) {
          if (!(c2 = t2._nodes.get(r2)))
            throw new F("Graph.".concat(e2, ': could not find the "').concat(r2, '" node in the graph.'));
          d2 = i2, s2 = o2;
        } else if (3 === n2) {
          if (i2 = "" + i2, !(u2 = t2._edges.get(i2)))
            throw new F("Graph.".concat(e2, ': could not find the "').concat(i2, '" edge in the graph.'));
          var h2 = u2.source.key, p2 = u2.target.key;
          if (r2 === h2)
            c2 = u2.target;
          else {
            if (r2 !== p2)
              throw new F("Graph.".concat(e2, ': the "').concat(r2, '" node is not attached to the "').concat(i2, '" edge (').concat(h2, ", ").concat(p2, ")."));
            c2 = u2.source;
          }
          d2 = o2, s2 = a2;
        } else {
          if (!(u2 = t2._edges.get(r2)))
            throw new F("Graph.".concat(e2, ': could not find the "').concat(r2, '" edge in the graph.'));
          c2 = 1 === n2 ? u2.source : u2.target, d2 = i2, s2 = o2;
        }
        return [c2, d2, s2];
      }
      var Q = [{ name: function(t2) {
        return "get".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          return a2.attributes[c2];
        };
      } }, { name: function(t2) {
        return "get".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          return H(this, e2, n2, t3, r2)[0].attributes;
        };
      } }, { name: function(t2) {
        return "has".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          return a2.attributes.hasOwnProperty(c2);
        };
      } }, { name: function(t2) {
        return "set".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2, o2) {
          var a2 = H(this, e2, n2, t3, r2, i2, o2), c2 = a2[0], u2 = a2[1], d2 = a2[2];
          return c2.attributes[u2] = d2, this.emit("nodeAttributesUpdated", { key: c2.key, type: "set", attributes: c2.attributes, name: u2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2, o2) {
          var a2 = H(this, e2, n2, t3, r2, i2, o2), c2 = a2[0], u2 = a2[1], d2 = a2[2];
          if ("function" != typeof d2)
            throw new B("Graph.".concat(e2, ": updater should be a function."));
          var s2 = c2.attributes, h2 = d2(s2[u2]);
          return s2[u2] = h2, this.emit("nodeAttributesUpdated", { key: c2.key, type: "set", attributes: c2.attributes, name: u2 }), this;
        };
      } }, { name: function(t2) {
        return "remove".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          return delete a2.attributes[c2], this.emit("nodeAttributesUpdated", { key: a2.key, type: "remove", attributes: a2.attributes, name: c2 }), this;
        };
      } }, { name: function(t2) {
        return "replace".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          if (!s(c2))
            throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return a2.attributes = c2, this.emit("nodeAttributesUpdated", { key: a2.key, type: "replace", attributes: a2.attributes }), this;
        };
      } }, { name: function(t2) {
        return "merge".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          if (!s(c2))
            throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return u(a2.attributes, c2), this.emit("nodeAttributesUpdated", { key: a2.key, type: "merge", attributes: a2.attributes, data: c2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          if ("function" != typeof c2)
            throw new B("Graph.".concat(e2, ": provided updater is not a function."));
          return a2.attributes = c2(a2.attributes), this.emit("nodeAttributesUpdated", { key: a2.key, type: "update", attributes: a2.attributes }), this;
        };
      } }];
      var X = [{ name: function(t2) {
        return "get".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return i2.attributes[r2];
        };
      } }, { name: function(t2) {
        return "get".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3) {
          var r2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 1) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var i2 = "" + t3, o2 = "" + arguments[1];
            if (!(r2 = d(this, i2, o2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(i2, '" - "').concat(o2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(r2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return r2.attributes;
        };
      } }, { name: function(t2) {
        return "has".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return i2.attributes.hasOwnProperty(r2);
        };
      } }, { name: function(t2) {
        return "set".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 3) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var a2 = "" + t3, c2 = "" + r2;
            if (r2 = arguments[2], i2 = arguments[3], !(o2 = d(this, a2, c2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(a2, '" - "').concat(c2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(o2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return o2.attributes[r2] = i2, this.emit("edgeAttributesUpdated", { key: o2.key, type: "set", attributes: o2.attributes, name: r2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 3) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var a2 = "" + t3, c2 = "" + r2;
            if (r2 = arguments[2], i2 = arguments[3], !(o2 = d(this, a2, c2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(a2, '" - "').concat(c2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(o2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if ("function" != typeof i2)
            throw new B("Graph.".concat(e2, ": updater should be a function."));
          return o2.attributes[r2] = i2(o2.attributes[r2]), this.emit("edgeAttributesUpdated", { key: o2.key, type: "set", attributes: o2.attributes, name: r2 }), this;
        };
      } }, { name: function(t2) {
        return "remove".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return delete i2.attributes[r2], this.emit("edgeAttributesUpdated", { key: i2.key, type: "remove", attributes: i2.attributes, name: r2 }), this;
        };
      } }, { name: function(t2) {
        return "replace".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if (!s(r2))
            throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return i2.attributes = r2, this.emit("edgeAttributesUpdated", { key: i2.key, type: "replace", attributes: i2.attributes }), this;
        };
      } }, { name: function(t2) {
        return "merge".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if (!s(r2))
            throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return u(i2.attributes, r2), this.emit("edgeAttributesUpdated", { key: i2.key, type: "merge", attributes: i2.attributes, data: r2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type)
            throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi)
              throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2)))
              throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2)
              throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3)))
              throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if ("function" != typeof r2)
            throw new B("Graph.".concat(e2, ": provided updater is not a function."));
          return i2.attributes = r2(i2.attributes), this.emit("edgeAttributesUpdated", { key: i2.key, type: "update", attributes: i2.attributes }), this;
        };
      } }];
      var Z = O, $ = P, tt = function() {
        var t2 = arguments, e2 = null, n2 = -1;
        return new Z(function() {
          for (var r2 = null; ; ) {
            if (null === e2) {
              if (++n2 >= t2.length)
                return { done: true };
              e2 = $(t2[n2]);
            }
            if (true !== (r2 = e2.next()).done)
              break;
            e2 = null;
          }
          return r2;
        });
      }, et = [{ name: "edges", type: "mixed" }, { name: "inEdges", type: "directed", direction: "in" }, { name: "outEdges", type: "directed", direction: "out" }, { name: "inboundEdges", type: "mixed", direction: "in" }, { name: "outboundEdges", type: "mixed", direction: "out" }, { name: "directedEdges", type: "directed" }, { name: "undirectedEdges", type: "undirected" }];
      function nt(t2, e2, n2, r2) {
        var i2 = false;
        for (var o2 in e2)
          if (o2 !== r2) {
            var a2 = e2[o2];
            if (i2 = n2(a2.key, a2.attributes, a2.source.key, a2.target.key, a2.source.attributes, a2.target.attributes, a2.undirected), t2 && i2)
              return a2.key;
          }
      }
      function rt(t2, e2, n2, r2) {
        var i2, o2, a2, c2 = false;
        for (var u2 in e2)
          if (u2 !== r2) {
            i2 = e2[u2];
            do {
              if (o2 = i2.source, a2 = i2.target, c2 = n2(i2.key, i2.attributes, o2.key, a2.key, o2.attributes, a2.attributes, i2.undirected), t2 && c2)
                return i2.key;
              i2 = i2.next;
            } while (void 0 !== i2);
          }
      }
      function it(t2, e2) {
        var n2, r2 = Object.keys(t2), i2 = r2.length, o2 = 0;
        return new O(function() {
          do {
            if (n2)
              n2 = n2.next;
            else {
              if (o2 >= i2)
                return { done: true };
              var a2 = r2[o2++];
              if (a2 === e2) {
                n2 = void 0;
                continue;
              }
              n2 = t2[a2];
            }
          } while (!n2);
          return { done: false, value: { edge: n2.key, attributes: n2.attributes, source: n2.source.key, target: n2.target.key, sourceAttributes: n2.source.attributes, targetAttributes: n2.target.attributes, undirected: n2.undirected } };
        });
      }
      function ot(t2, e2, n2, r2) {
        var i2 = e2[n2];
        if (i2) {
          var o2 = i2.source, a2 = i2.target;
          return r2(i2.key, i2.attributes, o2.key, a2.key, o2.attributes, a2.attributes, i2.undirected) && t2 ? i2.key : void 0;
        }
      }
      function at(t2, e2, n2, r2) {
        var i2 = e2[n2];
        if (i2) {
          var o2 = false;
          do {
            if (o2 = r2(i2.key, i2.attributes, i2.source.key, i2.target.key, i2.source.attributes, i2.target.attributes, i2.undirected), t2 && o2)
              return i2.key;
            i2 = i2.next;
          } while (void 0 !== i2);
        }
      }
      function ct(t2, e2) {
        var n2 = t2[e2];
        return void 0 !== n2.next ? new O(function() {
          if (!n2)
            return { done: true };
          var t3 = { edge: n2.key, attributes: n2.attributes, source: n2.source.key, target: n2.target.key, sourceAttributes: n2.source.attributes, targetAttributes: n2.target.attributes, undirected: n2.undirected };
          return n2 = n2.next, { done: false, value: t3 };
        }) : O.of({ edge: n2.key, attributes: n2.attributes, source: n2.source.key, target: n2.target.key, sourceAttributes: n2.source.attributes, targetAttributes: n2.target.attributes, undirected: n2.undirected });
      }
      function ut(t2, e2) {
        if (0 === t2.size)
          return [];
        if ("mixed" === e2 || e2 === t2.type)
          return "function" == typeof Array.from ? Array.from(t2._edges.keys()) : K(t2._edges.keys(), t2._edges.size);
        for (var n2, r2, i2 = "undirected" === e2 ? t2.undirectedSize : t2.directedSize, o2 = new Array(i2), a2 = "undirected" === e2, c2 = t2._edges.values(), u2 = 0; true !== (n2 = c2.next()).done; )
          (r2 = n2.value).undirected === a2 && (o2[u2++] = r2.key);
        return o2;
      }
      function dt(t2, e2, n2, r2) {
        if (0 !== e2.size) {
          for (var i2, o2, a2 = "mixed" !== n2 && n2 !== e2.type, c2 = "undirected" === n2, u2 = false, d2 = e2._edges.values(); true !== (i2 = d2.next()).done; )
            if (o2 = i2.value, !a2 || o2.undirected === c2) {
              var s2 = o2, h2 = s2.key, p2 = s2.attributes, f2 = s2.source, l2 = s2.target;
              if (u2 = r2(h2, p2, f2.key, l2.key, f2.attributes, l2.attributes, o2.undirected), t2 && u2)
                return h2;
            }
        }
      }
      function st(t2, e2) {
        if (0 === t2.size)
          return O.empty();
        var n2 = "mixed" !== e2 && e2 !== t2.type, r2 = "undirected" === e2, i2 = t2._edges.values();
        return new O(function() {
          for (var t3, e3; ; ) {
            if ((t3 = i2.next()).done)
              return t3;
            if (e3 = t3.value, !n2 || e3.undirected === r2)
              break;
          }
          return { value: { edge: e3.key, attributes: e3.attributes, source: e3.source.key, target: e3.target.key, sourceAttributes: e3.source.attributes, targetAttributes: e3.target.attributes, undirected: e3.undirected }, done: false };
        });
      }
      function ht(t2, e2, n2, r2, i2, o2) {
        var a2, c2 = e2 ? rt : nt;
        if ("undirected" !== n2) {
          if ("out" !== r2 && (a2 = c2(t2, i2.in, o2), t2 && a2))
            return a2;
          if ("in" !== r2 && (a2 = c2(t2, i2.out, o2, r2 ? void 0 : i2.key), t2 && a2))
            return a2;
        }
        if ("directed" !== n2 && (a2 = c2(t2, i2.undirected, o2), t2 && a2))
          return a2;
      }
      function pt(t2, e2, n2, r2) {
        var i2 = [];
        return ht(false, t2, e2, n2, r2, function(t3) {
          i2.push(t3);
        }), i2;
      }
      function ft(t2, e2, n2) {
        var r2 = O.empty();
        return "undirected" !== t2 && ("out" !== e2 && void 0 !== n2.in && (r2 = tt(r2, it(n2.in))), "in" !== e2 && void 0 !== n2.out && (r2 = tt(r2, it(n2.out, e2 ? void 0 : n2.key)))), "directed" !== t2 && void 0 !== n2.undirected && (r2 = tt(r2, it(n2.undirected))), r2;
      }
      function lt(t2, e2, n2, r2, i2, o2, a2) {
        var c2, u2 = n2 ? at : ot;
        if ("undirected" !== e2) {
          if (void 0 !== i2.in && "out" !== r2 && (c2 = u2(t2, i2.in, o2, a2), t2 && c2))
            return c2;
          if (void 0 !== i2.out && "in" !== r2 && (r2 || i2.key !== o2) && (c2 = u2(t2, i2.out, o2, a2), t2 && c2))
            return c2;
        }
        if ("directed" !== e2 && void 0 !== i2.undirected && (c2 = u2(t2, i2.undirected, o2, a2), t2 && c2))
          return c2;
      }
      function gt(t2, e2, n2, r2, i2) {
        var o2 = [];
        return lt(false, t2, e2, n2, r2, i2, function(t3) {
          o2.push(t3);
        }), o2;
      }
      function yt(t2, e2, n2, r2) {
        var i2 = O.empty();
        return "undirected" !== t2 && (void 0 !== n2.in && "out" !== e2 && r2 in n2.in && (i2 = tt(i2, ct(n2.in, r2))), void 0 !== n2.out && "in" !== e2 && r2 in n2.out && (e2 || n2.key !== r2) && (i2 = tt(i2, ct(n2.out, r2)))), "directed" !== t2 && void 0 !== n2.undirected && r2 in n2.undirected && (i2 = tt(i2, ct(n2.undirected, r2))), i2;
      }
      var wt = [{ name: "neighbors", type: "mixed" }, { name: "inNeighbors", type: "directed", direction: "in" }, { name: "outNeighbors", type: "directed", direction: "out" }, { name: "inboundNeighbors", type: "mixed", direction: "in" }, { name: "outboundNeighbors", type: "mixed", direction: "out" }, { name: "directedNeighbors", type: "directed" }, { name: "undirectedNeighbors", type: "undirected" }];
      function vt() {
        this.A = null, this.B = null;
      }
      function bt(t2, e2, n2, r2, i2) {
        for (var o2 in r2) {
          var a2 = r2[o2], c2 = a2.source, u2 = a2.target, d2 = c2 === n2 ? u2 : c2;
          if (!e2 || !e2.has(d2.key)) {
            var s2 = i2(d2.key, d2.attributes);
            if (t2 && s2)
              return d2.key;
          }
        }
      }
      function mt(t2, e2, n2, r2, i2) {
        if ("mixed" !== e2) {
          if ("undirected" === e2)
            return bt(t2, null, r2, r2.undirected, i2);
          if ("string" == typeof n2)
            return bt(t2, null, r2, r2[n2], i2);
        }
        var o2, a2 = new vt();
        if ("undirected" !== e2) {
          if ("out" !== n2) {
            if (o2 = bt(t2, null, r2, r2.in, i2), t2 && o2)
              return o2;
            a2.wrap(r2.in);
          }
          if ("in" !== n2) {
            if (o2 = bt(t2, a2, r2, r2.out, i2), t2 && o2)
              return o2;
            a2.wrap(r2.out);
          }
        }
        if ("directed" !== e2 && (o2 = bt(t2, a2, r2, r2.undirected, i2), t2 && o2))
          return o2;
      }
      function kt(t2, e2, n2) {
        var r2 = Object.keys(n2), i2 = r2.length, o2 = 0;
        return new O(function() {
          var a2 = null;
          do {
            if (o2 >= i2)
              return t2 && t2.wrap(n2), { done: true };
            var c2 = n2[r2[o2++]], u2 = c2.source, d2 = c2.target;
            a2 = u2 === e2 ? d2 : u2, t2 && t2.has(a2.key) && (a2 = null);
          } while (null === a2);
          return { done: false, value: { neighbor: a2.key, attributes: a2.attributes } };
        });
      }
      function _t(t2, e2) {
        var n2 = e2.name, r2 = e2.type, i2 = e2.direction;
        t2.prototype[n2] = function(t3) {
          if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type)
            return [];
          t3 = "" + t3;
          var e3 = this._nodes.get(t3);
          if (void 0 === e3)
            throw new F("Graph.".concat(n2, ': could not find the "').concat(t3, '" node in the graph.'));
          return function(t4, e4, n3) {
            if ("mixed" !== t4) {
              if ("undirected" === t4)
                return Object.keys(n3.undirected);
              if ("string" == typeof e4)
                return Object.keys(n3[e4]);
            }
            var r3 = [];
            return mt(false, t4, e4, n3, function(t5) {
              r3.push(t5);
            }), r3;
          }("mixed" === r2 ? this.type : r2, i2, e3);
        };
      }
      function Gt(t2, e2) {
        var n2 = e2.name, r2 = e2.type, i2 = e2.direction, o2 = n2.slice(0, -1) + "Entries";
        t2.prototype[o2] = function(t3) {
          if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type)
            return O.empty();
          t3 = "" + t3;
          var e3 = this._nodes.get(t3);
          if (void 0 === e3)
            throw new F("Graph.".concat(o2, ': could not find the "').concat(t3, '" node in the graph.'));
          return function(t4, e4, n3) {
            if ("mixed" !== t4) {
              if ("undirected" === t4)
                return kt(null, n3, n3.undirected);
              if ("string" == typeof e4)
                return kt(null, n3, n3[e4]);
            }
            var r3 = O.empty(), i3 = new vt();
            return "undirected" !== t4 && ("out" !== e4 && (r3 = tt(r3, kt(i3, n3, n3.in))), "in" !== e4 && (r3 = tt(r3, kt(i3, n3, n3.out)))), "directed" !== t4 && (r3 = tt(r3, kt(i3, n3, n3.undirected))), r3;
          }("mixed" === r2 ? this.type : r2, i2, e3);
        };
      }
      function xt(t2, e2, n2, r2, i2) {
        for (var o2, a2, c2, u2, d2, s2, h2, p2 = r2._nodes.values(), f2 = r2.type; true !== (o2 = p2.next()).done; ) {
          var l2 = false;
          if (a2 = o2.value, "undirected" !== f2)
            for (c2 in u2 = a2.out) {
              d2 = u2[c2];
              do {
                if (s2 = d2.target, l2 = true, h2 = i2(a2.key, s2.key, a2.attributes, s2.attributes, d2.key, d2.attributes, d2.undirected), t2 && h2)
                  return d2;
                d2 = d2.next;
              } while (d2);
            }
          if ("directed" !== f2) {
            for (c2 in u2 = a2.undirected)
              if (!(e2 && a2.key > c2)) {
                d2 = u2[c2];
                do {
                  if ((s2 = d2.target).key !== c2 && (s2 = d2.source), l2 = true, h2 = i2(a2.key, s2.key, a2.attributes, s2.attributes, d2.key, d2.attributes, d2.undirected), t2 && h2)
                    return d2;
                  d2 = d2.next;
                } while (d2);
              }
          }
          if (n2 && !l2 && (h2 = i2(a2.key, null, a2.attributes, null, null, null, null), t2 && h2))
            return null;
        }
      }
      function Et(t2) {
        if (!s(t2))
          throw new B('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
        if (!("key" in t2))
          throw new B("Graph.import: serialized node is missing its key.");
        if ("attributes" in t2 && (!s(t2.attributes) || null === t2.attributes))
          throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
      }
      function At(t2) {
        if (!s(t2))
          throw new B('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
        if (!("source" in t2))
          throw new B("Graph.import: serialized edge is missing its source.");
        if (!("target" in t2))
          throw new B("Graph.import: serialized edge is missing its target.");
        if ("attributes" in t2 && (!s(t2.attributes) || null === t2.attributes))
          throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
        if ("undirected" in t2 && "boolean" != typeof t2.undirected)
          throw new B("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.");
      }
      vt.prototype.wrap = function(t2) {
        null === this.A ? this.A = t2 : null === this.B && (this.B = t2);
      }, vt.prototype.has = function(t2) {
        return null !== this.A && t2 in this.A || null !== this.B && t2 in this.B;
      };
      var Lt, St = (Lt = 255 & Math.floor(256 * Math.random()), function() {
        return Lt++;
      }), Dt = /* @__PURE__ */ new Set(["directed", "undirected", "mixed"]), Ut = /* @__PURE__ */ new Set(["domain", "_events", "_eventsCount", "_maxListeners"]), Nt = { allowSelfLoops: true, multi: false, type: "mixed" };
      function Ot(t2, e2, n2) {
        var r2 = new t2.NodeDataClass(e2, n2);
        return t2._nodes.set(e2, r2), t2.emit("nodeAdded", { key: e2, attributes: n2 }), r2;
      }
      function jt(t2, e2, n2, r2, i2, o2, a2, c2) {
        if (!r2 && "undirected" === t2.type)
          throw new I("Graph.".concat(e2, ": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));
        if (r2 && "directed" === t2.type)
          throw new I("Graph.".concat(e2, ": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));
        if (c2 && !s(c2))
          throw new B("Graph.".concat(e2, ': invalid attributes. Expecting an object but got "').concat(c2, '"'));
        if (o2 = "" + o2, a2 = "" + a2, c2 = c2 || {}, !t2.allowSelfLoops && o2 === a2)
          throw new I("Graph.".concat(e2, ': source & target are the same ("').concat(o2, `"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`));
        var u2 = t2._nodes.get(o2), d2 = t2._nodes.get(a2);
        if (!u2)
          throw new F("Graph.".concat(e2, ': source node "').concat(o2, '" not found.'));
        if (!d2)
          throw new F("Graph.".concat(e2, ': target node "').concat(a2, '" not found.'));
        var h2 = { key: null, undirected: r2, source: o2, target: a2, attributes: c2 };
        if (n2)
          i2 = t2._edgeKeyGenerator();
        else if (i2 = "" + i2, t2._edges.has(i2))
          throw new I("Graph.".concat(e2, ': the "').concat(i2, '" edge already exists in the graph.'));
        if (!t2.multi && (r2 ? void 0 !== u2.undirected[a2] : void 0 !== u2.out[a2]))
          throw new I("Graph.".concat(e2, ': an edge linking "').concat(o2, '" to "').concat(a2, `" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`));
        var p2 = new V(r2, i2, u2, d2, c2);
        t2._edges.set(i2, p2);
        var f2 = o2 === a2;
        return r2 ? (u2.undirectedDegree++, d2.undirectedDegree++, f2 && (u2.undirectedLoops++, t2._undirectedSelfLoopCount++)) : (u2.outDegree++, d2.inDegree++, f2 && (u2.directedLoops++, t2._directedSelfLoopCount++)), t2.multi ? p2.attachMulti() : p2.attach(), r2 ? t2._undirectedSize++ : t2._directedSize++, h2.key = i2, t2.emit("edgeAdded", h2), i2;
      }
      function Ct(t2, e2, n2, r2, i2, o2, a2, c2, d2) {
        if (!r2 && "undirected" === t2.type)
          throw new I("Graph.".concat(e2, ": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));
        if (r2 && "directed" === t2.type)
          throw new I("Graph.".concat(e2, ": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));
        if (c2) {
          if (d2) {
            if ("function" != typeof c2)
              throw new B("Graph.".concat(e2, ': invalid updater function. Expecting a function but got "').concat(c2, '"'));
          } else if (!s(c2))
            throw new B("Graph.".concat(e2, ': invalid attributes. Expecting an object but got "').concat(c2, '"'));
        }
        var h2;
        if (o2 = "" + o2, a2 = "" + a2, d2 && (h2 = c2, c2 = void 0), !t2.allowSelfLoops && o2 === a2)
          throw new I("Graph.".concat(e2, ': source & target are the same ("').concat(o2, `"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`));
        var p2, f2, l2 = t2._nodes.get(o2), g2 = t2._nodes.get(a2);
        if (!n2 && (p2 = t2._edges.get(i2))) {
          if (!(p2.source.key === o2 && p2.target.key === a2 || r2 && p2.source.key === a2 && p2.target.key === o2))
            throw new I("Graph.".concat(e2, ': inconsistency detected when attempting to merge the "').concat(i2, '" edge with "').concat(o2, '" source & "').concat(a2, '" target vs. ("').concat(p2.source.key, '", "').concat(p2.target.key, '").'));
          f2 = p2;
        }
        if (f2 || t2.multi || !l2 || (f2 = r2 ? l2.undirected[a2] : l2.out[a2]), f2) {
          var y2 = [f2.key, false, false, false];
          if (d2 ? !h2 : !c2)
            return y2;
          if (d2) {
            var w2 = f2.attributes;
            f2.attributes = h2(w2), t2.emit("edgeAttributesUpdated", { type: "replace", key: f2.key, attributes: f2.attributes });
          } else
            u(f2.attributes, c2), t2.emit("edgeAttributesUpdated", { type: "merge", key: f2.key, attributes: f2.attributes, data: c2 });
          return y2;
        }
        c2 = c2 || {}, d2 && h2 && (c2 = h2(c2));
        var v2 = { key: null, undirected: r2, source: o2, target: a2, attributes: c2 };
        if (n2)
          i2 = t2._edgeKeyGenerator();
        else if (i2 = "" + i2, t2._edges.has(i2))
          throw new I("Graph.".concat(e2, ': the "').concat(i2, '" edge already exists in the graph.'));
        var b2 = false, m2 = false;
        l2 || (l2 = Ot(t2, o2, {}), b2 = true, o2 === a2 && (g2 = l2, m2 = true)), g2 || (g2 = Ot(t2, a2, {}), m2 = true), p2 = new V(r2, i2, l2, g2, c2), t2._edges.set(i2, p2);
        var k2 = o2 === a2;
        return r2 ? (l2.undirectedDegree++, g2.undirectedDegree++, k2 && (l2.undirectedLoops++, t2._undirectedSelfLoopCount++)) : (l2.outDegree++, g2.inDegree++, k2 && (l2.directedLoops++, t2._directedSelfLoopCount++)), t2.multi ? p2.attachMulti() : p2.attach(), r2 ? t2._undirectedSize++ : t2._directedSize++, v2.key = i2, t2.emit("edgeAdded", v2), [i2, true, b2, m2];
      }
      function Mt(t2, e2) {
        t2._edges.delete(e2.key);
        var n2 = e2.source, r2 = e2.target, i2 = e2.attributes, o2 = e2.undirected, a2 = n2 === r2;
        o2 ? (n2.undirectedDegree--, r2.undirectedDegree--, a2 && (n2.undirectedLoops--, t2._undirectedSelfLoopCount--)) : (n2.outDegree--, r2.inDegree--, a2 && (n2.directedLoops--, t2._directedSelfLoopCount--)), t2.multi ? e2.detachMulti() : e2.detach(), o2 ? t2._undirectedSize-- : t2._directedSize--, t2.emit("edgeDropped", { key: e2.key, attributes: i2, source: n2.key, target: r2.key, undirected: o2 });
      }
      var zt = function(n2) {
        function r2(t2) {
          var e2;
          if (e2 = n2.call(this) || this, "boolean" != typeof (t2 = u({}, Nt, t2)).multi)
            throw new B(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "`.concat(t2.multi, '".'));
          if (!Dt.has(t2.type))
            throw new B(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "`.concat(t2.type, '".'));
          if ("boolean" != typeof t2.allowSelfLoops)
            throw new B(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "`.concat(t2.allowSelfLoops, '".'));
          var r3 = "mixed" === t2.type ? Y : "directed" === t2.type ? q : J;
          p(c(e2), "NodeDataClass", r3);
          var i3 = "geid_" + St() + "_", o2 = 0;
          return p(c(e2), "_attributes", {}), p(c(e2), "_nodes", /* @__PURE__ */ new Map()), p(c(e2), "_edges", /* @__PURE__ */ new Map()), p(c(e2), "_directedSize", 0), p(c(e2), "_undirectedSize", 0), p(c(e2), "_directedSelfLoopCount", 0), p(c(e2), "_undirectedSelfLoopCount", 0), p(c(e2), "_edgeKeyGenerator", function() {
            var t3;
            do {
              t3 = i3 + o2++;
            } while (e2._edges.has(t3));
            return t3;
          }), p(c(e2), "_options", t2), Ut.forEach(function(t3) {
            return p(c(e2), t3, e2[t3]);
          }), f(c(e2), "order", function() {
            return e2._nodes.size;
          }), f(c(e2), "size", function() {
            return e2._edges.size;
          }), f(c(e2), "directedSize", function() {
            return e2._directedSize;
          }), f(c(e2), "undirectedSize", function() {
            return e2._undirectedSize;
          }), f(c(e2), "selfLoopCount", function() {
            return e2._directedSelfLoopCount + e2._undirectedSelfLoopCount;
          }), f(c(e2), "directedSelfLoopCount", function() {
            return e2._directedSelfLoopCount;
          }), f(c(e2), "undirectedSelfLoopCount", function() {
            return e2._undirectedSelfLoopCount;
          }), f(c(e2), "multi", e2._options.multi), f(c(e2), "type", e2._options.type), f(c(e2), "allowSelfLoops", e2._options.allowSelfLoops), f(c(e2), "implementation", function() {
            return "graphology";
          }), e2;
        }
        e(r2, n2);
        var i2 = r2.prototype;
        return i2._resetInstanceCounters = function() {
          this._directedSize = 0, this._undirectedSize = 0, this._directedSelfLoopCount = 0, this._undirectedSelfLoopCount = 0;
        }, i2.hasNode = function(t2) {
          return this._nodes.has("" + t2);
        }, i2.hasDirectedEdge = function(t2, e2) {
          if ("undirected" === this.type)
            return false;
          if (1 === arguments.length) {
            var n3 = "" + t2, r3 = this._edges.get(n3);
            return !!r3 && !r3.undirected;
          }
          if (2 === arguments.length) {
            t2 = "" + t2, e2 = "" + e2;
            var i3 = this._nodes.get(t2);
            return !!i3 && i3.out.hasOwnProperty(e2);
          }
          throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        }, i2.hasUndirectedEdge = function(t2, e2) {
          if ("directed" === this.type)
            return false;
          if (1 === arguments.length) {
            var n3 = "" + t2, r3 = this._edges.get(n3);
            return !!r3 && r3.undirected;
          }
          if (2 === arguments.length) {
            t2 = "" + t2, e2 = "" + e2;
            var i3 = this._nodes.get(t2);
            return !!i3 && i3.undirected.hasOwnProperty(e2);
          }
          throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        }, i2.hasEdge = function(t2, e2) {
          if (1 === arguments.length) {
            var n3 = "" + t2;
            return this._edges.has(n3);
          }
          if (2 === arguments.length) {
            t2 = "" + t2, e2 = "" + e2;
            var r3 = this._nodes.get(t2);
            return !!r3 && (void 0 !== r3.out && r3.out.hasOwnProperty(e2) || void 0 !== r3.undirected && r3.undirected.hasOwnProperty(e2));
          }
          throw new B("Graph.hasEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        }, i2.directedEdge = function(t2, e2) {
          if ("undirected" !== this.type) {
            if (t2 = "" + t2, e2 = "" + e2, this.multi)
              throw new I("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");
            var n3 = this._nodes.get(t2);
            if (!n3)
              throw new F('Graph.directedEdge: could not find the "'.concat(t2, '" source node in the graph.'));
            if (!this._nodes.has(e2))
              throw new F('Graph.directedEdge: could not find the "'.concat(e2, '" target node in the graph.'));
            var r3 = n3.out && n3.out[e2] || void 0;
            return r3 ? r3.key : void 0;
          }
        }, i2.undirectedEdge = function(t2, e2) {
          if ("directed" !== this.type) {
            if (t2 = "" + t2, e2 = "" + e2, this.multi)
              throw new I("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");
            var n3 = this._nodes.get(t2);
            if (!n3)
              throw new F('Graph.undirectedEdge: could not find the "'.concat(t2, '" source node in the graph.'));
            if (!this._nodes.has(e2))
              throw new F('Graph.undirectedEdge: could not find the "'.concat(e2, '" target node in the graph.'));
            var r3 = n3.undirected && n3.undirected[e2] || void 0;
            return r3 ? r3.key : void 0;
          }
        }, i2.edge = function(t2, e2) {
          if (this.multi)
            throw new I("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.edge: could not find the "'.concat(t2, '" source node in the graph.'));
          if (!this._nodes.has(e2))
            throw new F('Graph.edge: could not find the "'.concat(e2, '" target node in the graph.'));
          var r3 = n3.out && n3.out[e2] || n3.undirected && n3.undirected[e2] || void 0;
          if (r3)
            return r3.key;
        }, i2.areDirectedNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areDirectedNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && (e2 in n3.in || e2 in n3.out);
        }, i2.areOutNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areOutNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.out;
        }, i2.areInNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areInNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.in;
        }, i2.areUndirectedNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areUndirectedNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "directed" !== this.type && e2 in n3.undirected;
        }, i2.areNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && (e2 in n3.in || e2 in n3.out) || "directed" !== this.type && e2 in n3.undirected;
        }, i2.areInboundNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areInboundNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.in || "directed" !== this.type && e2 in n3.undirected;
        }, i2.areOutboundNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.areOutboundNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.out || "directed" !== this.type && e2 in n3.undirected;
        }, i2.inDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.inDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree;
        }, i2.outDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.outDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.outDegree;
        }, i2.directedDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.directedDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree + e2.outDegree;
        }, i2.undirectedDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.undirectedDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "directed" === this.type ? 0 : e2.undirectedDegree;
        }, i2.inboundDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.inboundDegree: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree), "undirected" !== this.type && (n3 += e2.inDegree), n3;
        }, i2.outboundDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.outboundDegree: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree), "undirected" !== this.type && (n3 += e2.outDegree), n3;
        }, i2.degree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.degree: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree), "undirected" !== this.type && (n3 += e2.inDegree + e2.outDegree), n3;
        }, i2.inDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree - e2.directedLoops;
        }, i2.outDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.outDegree - e2.directedLoops;
        }, i2.directedDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree + e2.outDegree - 2 * e2.directedLoops;
        }, i2.undirectedDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "directed" === this.type ? 0 : e2.undirectedDegree - 2 * e2.undirectedLoops;
        }, i2.inboundDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0, r3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree, r3 += 2 * e2.undirectedLoops), "undirected" !== this.type && (n3 += e2.inDegree, r3 += e2.directedLoops), n3 - r3;
        }, i2.outboundDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0, r3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree, r3 += 2 * e2.undirectedLoops), "undirected" !== this.type && (n3 += e2.outDegree, r3 += e2.directedLoops), n3 - r3;
        }, i2.degreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2)
            throw new F('Graph.degreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0, r3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree, r3 += 2 * e2.undirectedLoops), "undirected" !== this.type && (n3 += e2.inDegree + e2.outDegree, r3 += 2 * e2.directedLoops), n3 - r3;
        }, i2.source = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2)
            throw new F('Graph.source: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.source.key;
        }, i2.target = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2)
            throw new F('Graph.target: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.target.key;
        }, i2.extremities = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2)
            throw new F('Graph.extremities: could not find the "'.concat(t2, '" edge in the graph.'));
          return [e2.source.key, e2.target.key];
        }, i2.opposite = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._edges.get(e2);
          if (!n3)
            throw new F('Graph.opposite: could not find the "'.concat(e2, '" edge in the graph.'));
          var r3 = n3.source.key, i3 = n3.target.key;
          if (t2 === r3)
            return i3;
          if (t2 === i3)
            return r3;
          throw new F('Graph.opposite: the "'.concat(t2, '" node is not attached to the "').concat(e2, '" edge (').concat(r3, ", ").concat(i3, ")."));
        }, i2.hasExtremity = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._edges.get(t2);
          if (!n3)
            throw new F('Graph.hasExtremity: could not find the "'.concat(t2, '" edge in the graph.'));
          return n3.source.key === e2 || n3.target.key === e2;
        }, i2.isUndirected = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2)
            throw new F('Graph.isUndirected: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.undirected;
        }, i2.isDirected = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2)
            throw new F('Graph.isDirected: could not find the "'.concat(t2, '" edge in the graph.'));
          return !e2.undirected;
        }, i2.isSelfLoop = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2)
            throw new F('Graph.isSelfLoop: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.source === e2.target;
        }, i2.addNode = function(t2, e2) {
          var n3 = function(t3, e3, n4) {
            if (n4 && !s(n4))
              throw new B('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n4, '"'));
            if (e3 = "" + e3, n4 = n4 || {}, t3._nodes.has(e3))
              throw new I('Graph.addNode: the "'.concat(e3, '" node already exist in the graph.'));
            var r3 = new t3.NodeDataClass(e3, n4);
            return t3._nodes.set(e3, r3), t3.emit("nodeAdded", { key: e3, attributes: n4 }), r3;
          }(this, t2, e2);
          return n3.key;
        }, i2.mergeNode = function(t2, e2) {
          if (e2 && !s(e2))
            throw new B('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(e2, '"'));
          t2 = "" + t2, e2 = e2 || {};
          var n3 = this._nodes.get(t2);
          return n3 ? (e2 && (u(n3.attributes, e2), this.emit("nodeAttributesUpdated", { type: "merge", key: t2, attributes: n3.attributes, data: e2 })), [t2, false]) : (n3 = new this.NodeDataClass(t2, e2), this._nodes.set(t2, n3), this.emit("nodeAdded", { key: t2, attributes: e2 }), [t2, true]);
        }, i2.updateNode = function(t2, e2) {
          if (e2 && "function" != typeof e2)
            throw new B('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(e2, '"'));
          t2 = "" + t2;
          var n3 = this._nodes.get(t2);
          if (n3) {
            if (e2) {
              var r3 = n3.attributes;
              n3.attributes = e2(r3), this.emit("nodeAttributesUpdated", { type: "replace", key: t2, attributes: n3.attributes });
            }
            return [t2, false];
          }
          var i3 = e2 ? e2({}) : {};
          return n3 = new this.NodeDataClass(t2, i3), this._nodes.set(t2, n3), this.emit("nodeAdded", { key: t2, attributes: i3 }), [t2, true];
        }, i2.dropNode = function(t2) {
          t2 = "" + t2;
          var e2, n3 = this._nodes.get(t2);
          if (!n3)
            throw new F('Graph.dropNode: could not find the "'.concat(t2, '" node in the graph.'));
          if ("undirected" !== this.type) {
            for (var r3 in n3.out) {
              e2 = n3.out[r3];
              do {
                Mt(this, e2), e2 = e2.next;
              } while (e2);
            }
            for (var i3 in n3.in) {
              e2 = n3.in[i3];
              do {
                Mt(this, e2), e2 = e2.next;
              } while (e2);
            }
          }
          if ("directed" !== this.type)
            for (var o2 in n3.undirected) {
              e2 = n3.undirected[o2];
              do {
                Mt(this, e2), e2 = e2.next;
              } while (e2);
            }
          this._nodes.delete(t2), this.emit("nodeDropped", { key: t2, attributes: n3.attributes });
        }, i2.dropEdge = function(t2) {
          var e2;
          if (arguments.length > 1) {
            var n3 = "" + arguments[0], r3 = "" + arguments[1];
            if (!(e2 = d(this, n3, r3, this.type)))
              throw new F('Graph.dropEdge: could not find the "'.concat(n3, '" -> "').concat(r3, '" edge in the graph.'));
          } else if (t2 = "" + t2, !(e2 = this._edges.get(t2)))
            throw new F('Graph.dropEdge: could not find the "'.concat(t2, '" edge in the graph.'));
          return Mt(this, e2), this;
        }, i2.dropDirectedEdge = function(t2, e2) {
          if (arguments.length < 2)
            throw new I("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
          if (this.multi)
            throw new I("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
          var n3 = d(this, t2 = "" + t2, e2 = "" + e2, "directed");
          if (!n3)
            throw new F('Graph.dropDirectedEdge: could not find a "'.concat(t2, '" -> "').concat(e2, '" edge in the graph.'));
          return Mt(this, n3), this;
        }, i2.dropUndirectedEdge = function(t2, e2) {
          if (arguments.length < 2)
            throw new I("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
          if (this.multi)
            throw new I("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
          var n3 = d(this, t2, e2, "undirected");
          if (!n3)
            throw new F('Graph.dropUndirectedEdge: could not find a "'.concat(t2, '" -> "').concat(e2, '" edge in the graph.'));
          return Mt(this, n3), this;
        }, i2.clear = function() {
          this._edges.clear(), this._nodes.clear(), this._resetInstanceCounters(), this.emit("cleared");
        }, i2.clearEdges = function() {
          for (var t2, e2 = this._nodes.values(); true !== (t2 = e2.next()).done; )
            t2.value.clear();
          this._edges.clear(), this._resetInstanceCounters(), this.emit("edgesCleared");
        }, i2.getAttribute = function(t2) {
          return this._attributes[t2];
        }, i2.getAttributes = function() {
          return this._attributes;
        }, i2.hasAttribute = function(t2) {
          return this._attributes.hasOwnProperty(t2);
        }, i2.setAttribute = function(t2, e2) {
          return this._attributes[t2] = e2, this.emit("attributesUpdated", { type: "set", attributes: this._attributes, name: t2 }), this;
        }, i2.updateAttribute = function(t2, e2) {
          if ("function" != typeof e2)
            throw new B("Graph.updateAttribute: updater should be a function.");
          var n3 = this._attributes[t2];
          return this._attributes[t2] = e2(n3), this.emit("attributesUpdated", { type: "set", attributes: this._attributes, name: t2 }), this;
        }, i2.removeAttribute = function(t2) {
          return delete this._attributes[t2], this.emit("attributesUpdated", { type: "remove", attributes: this._attributes, name: t2 }), this;
        }, i2.replaceAttributes = function(t2) {
          if (!s(t2))
            throw new B("Graph.replaceAttributes: provided attributes are not a plain object.");
          return this._attributes = t2, this.emit("attributesUpdated", { type: "replace", attributes: this._attributes }), this;
        }, i2.mergeAttributes = function(t2) {
          if (!s(t2))
            throw new B("Graph.mergeAttributes: provided attributes are not a plain object.");
          return u(this._attributes, t2), this.emit("attributesUpdated", { type: "merge", attributes: this._attributes, data: t2 }), this;
        }, i2.updateAttributes = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.updateAttributes: provided updater is not a function.");
          return this._attributes = t2(this._attributes), this.emit("attributesUpdated", { type: "update", attributes: this._attributes }), this;
        }, i2.updateEachNodeAttributes = function(t2, e2) {
          if ("function" != typeof t2)
            throw new B("Graph.updateEachNodeAttributes: expecting an updater function.");
          if (e2 && !l(e2))
            throw new B("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
          for (var n3, r3, i3 = this._nodes.values(); true !== (n3 = i3.next()).done; )
            (r3 = n3.value).attributes = t2(r3.key, r3.attributes);
          this.emit("eachNodeAttributesUpdated", { hints: e2 || null });
        }, i2.updateEachEdgeAttributes = function(t2, e2) {
          if ("function" != typeof t2)
            throw new B("Graph.updateEachEdgeAttributes: expecting an updater function.");
          if (e2 && !l(e2))
            throw new B("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
          for (var n3, r3, i3, o2, a2 = this._edges.values(); true !== (n3 = a2.next()).done; )
            i3 = (r3 = n3.value).source, o2 = r3.target, r3.attributes = t2(r3.key, r3.attributes, i3.key, o2.key, i3.attributes, o2.attributes, r3.undirected);
          this.emit("eachEdgeAttributesUpdated", { hints: e2 || null });
        }, i2.forEachAdjacencyEntry = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.forEachAdjacencyEntry: expecting a callback.");
          xt(false, false, false, this, t2);
        }, i2.forEachAdjacencyEntryWithOrphans = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");
          xt(false, false, true, this, t2);
        }, i2.forEachAssymetricAdjacencyEntry = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");
          xt(false, true, false, this, t2);
        }, i2.forEachAssymetricAdjacencyEntryWithOrphans = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");
          xt(false, true, true, this, t2);
        }, i2.nodes = function() {
          return "function" == typeof Array.from ? Array.from(this._nodes.keys()) : K(this._nodes.keys(), this._nodes.size);
        }, i2.forEachNode = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.forEachNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; )
            t2((n3 = e2.value).key, n3.attributes);
        }, i2.findNode = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.findNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; )
            if (t2((n3 = e2.value).key, n3.attributes))
              return n3.key;
        }, i2.mapNodes = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.mapNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(), i3 = new Array(this.order), o2 = 0; true !== (e2 = r3.next()).done; )
            n3 = e2.value, i3[o2++] = t2(n3.key, n3.attributes);
          return i3;
        }, i2.someNode = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.someNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; )
            if (t2((n3 = e2.value).key, n3.attributes))
              return true;
          return false;
        }, i2.everyNode = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.everyNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; )
            if (!t2((n3 = e2.value).key, n3.attributes))
              return false;
          return true;
        }, i2.filterNodes = function(t2) {
          if ("function" != typeof t2)
            throw new B("Graph.filterNodes: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(), i3 = []; true !== (e2 = r3.next()).done; )
            t2((n3 = e2.value).key, n3.attributes) && i3.push(n3.key);
          return i3;
        }, i2.reduceNodes = function(t2, e2) {
          if ("function" != typeof t2)
            throw new B("Graph.reduceNodes: expecting a callback.");
          if (arguments.length < 2)
            throw new B("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");
          for (var n3, r3, i3 = e2, o2 = this._nodes.values(); true !== (n3 = o2.next()).done; )
            i3 = t2(i3, (r3 = n3.value).key, r3.attributes);
          return i3;
        }, i2.nodeEntries = function() {
          var t2 = this._nodes.values();
          return new O(function() {
            var e2 = t2.next();
            if (e2.done)
              return e2;
            var n3 = e2.value;
            return { value: { node: n3.key, attributes: n3.attributes }, done: false };
          });
        }, i2.export = function() {
          var t2 = this, e2 = new Array(this._nodes.size), n3 = 0;
          this._nodes.forEach(function(t3, r4) {
            e2[n3++] = function(t4, e3) {
              var n4 = { key: t4 };
              return h(e3.attributes) || (n4.attributes = u({}, e3.attributes)), n4;
            }(r4, t3);
          });
          var r3 = new Array(this._edges.size);
          return n3 = 0, this._edges.forEach(function(e3, i3) {
            r3[n3++] = function(t3, e4, n4) {
              var r4 = { key: e4, source: n4.source.key, target: n4.target.key };
              return h(n4.attributes) || (r4.attributes = u({}, n4.attributes)), "mixed" === t3 && n4.undirected && (r4.undirected = true), r4;
            }(t2.type, i3, e3);
          }), { options: { type: this.type, multi: this.multi, allowSelfLoops: this.allowSelfLoops }, attributes: this.getAttributes(), nodes: e2, edges: r3 };
        }, i2.import = function(t2) {
          var e2, n3, i3, o2, a2, c2 = this, u2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (t2 instanceof r2)
            return t2.forEachNode(function(t3, e3) {
              u2 ? c2.mergeNode(t3, e3) : c2.addNode(t3, e3);
            }), t2.forEachEdge(function(t3, e3, n4, r3, i4, o3, a3) {
              u2 ? a3 ? c2.mergeUndirectedEdgeWithKey(t3, n4, r3, e3) : c2.mergeDirectedEdgeWithKey(t3, n4, r3, e3) : a3 ? c2.addUndirectedEdgeWithKey(t3, n4, r3, e3) : c2.addDirectedEdgeWithKey(t3, n4, r3, e3);
            }), this;
          if (!s(t2))
            throw new B("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");
          if (t2.attributes) {
            if (!s(t2.attributes))
              throw new B("Graph.import: invalid attributes. Expecting a plain object.");
            u2 ? this.mergeAttributes(t2.attributes) : this.replaceAttributes(t2.attributes);
          }
          if (t2.nodes) {
            if (i3 = t2.nodes, !Array.isArray(i3))
              throw new B("Graph.import: invalid nodes. Expecting an array.");
            for (e2 = 0, n3 = i3.length; e2 < n3; e2++) {
              Et(o2 = i3[e2]);
              var d2 = o2, h2 = d2.key, p2 = d2.attributes;
              u2 ? this.mergeNode(h2, p2) : this.addNode(h2, p2);
            }
          }
          if (t2.edges) {
            var f2 = false;
            if ("undirected" === this.type && (f2 = true), i3 = t2.edges, !Array.isArray(i3))
              throw new B("Graph.import: invalid edges. Expecting an array.");
            for (e2 = 0, n3 = i3.length; e2 < n3; e2++) {
              At(a2 = i3[e2]);
              var l2 = a2, g2 = l2.source, y2 = l2.target, w2 = l2.attributes, v2 = l2.undirected, b2 = void 0 === v2 ? f2 : v2;
              "key" in a2 ? (u2 ? b2 ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : b2 ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey).call(this, a2.key, g2, y2, w2) : (u2 ? b2 ? this.mergeUndirectedEdge : this.mergeDirectedEdge : b2 ? this.addUndirectedEdge : this.addDirectedEdge).call(this, g2, y2, w2);
            }
          }
          return this;
        }, i2.nullCopy = function(t2) {
          var e2 = new r2(u({}, this._options, t2));
          return e2.replaceAttributes(u({}, this.getAttributes())), e2;
        }, i2.emptyCopy = function(t2) {
          var e2 = this.nullCopy(t2);
          return this._nodes.forEach(function(t3, n3) {
            var r3 = u({}, t3.attributes);
            t3 = new e2.NodeDataClass(n3, r3), e2._nodes.set(n3, t3);
          }), e2;
        }, i2.copy = function(t2) {
          if ("string" == typeof (t2 = t2 || {}).type && t2.type !== this.type && "mixed" !== t2.type)
            throw new I('Graph.copy: cannot create an incompatible copy from "'.concat(this.type, '" type to "').concat(t2.type, '" because this would mean losing information about the current graph.'));
          if ("boolean" == typeof t2.multi && t2.multi !== this.multi && true !== t2.multi)
            throw new I("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");
          if ("boolean" == typeof t2.allowSelfLoops && t2.allowSelfLoops !== this.allowSelfLoops && true !== t2.allowSelfLoops)
            throw new I("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");
          for (var e2, n3, r3 = this.emptyCopy(t2), i3 = this._edges.values(); true !== (e2 = i3.next()).done; )
            jt(r3, "copy", false, (n3 = e2.value).undirected, n3.key, n3.source.key, n3.target.key, u({}, n3.attributes));
          return r3;
        }, i2.toJSON = function() {
          return this.export();
        }, i2.toString = function() {
          return "[object Graph]";
        }, i2.inspect = function() {
          var e2 = this, n3 = {};
          this._nodes.forEach(function(t2, e3) {
            n3[e3] = t2.attributes;
          });
          var r3 = {}, i3 = {};
          this._edges.forEach(function(t2, n4) {
            var o3, a3 = t2.undirected ? "--" : "->", c2 = "", u2 = t2.source.key, d2 = t2.target.key;
            t2.undirected && u2 > d2 && (o3 = u2, u2 = d2, d2 = o3);
            var s2 = "(".concat(u2, ")").concat(a3, "(").concat(d2, ")");
            n4.startsWith("geid_") ? e2.multi && (void 0 === i3[s2] ? i3[s2] = 0 : i3[s2]++, c2 += "".concat(i3[s2], ". ")) : c2 += "[".concat(n4, "]: "), r3[c2 += s2] = t2.attributes;
          });
          var o2 = {};
          for (var a2 in this)
            this.hasOwnProperty(a2) && !Ut.has(a2) && "function" != typeof this[a2] && "symbol" !== t(a2) && (o2[a2] = this[a2]);
          return o2.attributes = this._attributes, o2.nodes = n3, o2.edges = r3, p(o2, "constructor", this.constructor), o2;
        }, r2;
      }(y.exports.EventEmitter);
      "undefined" != typeof Symbol && (zt.prototype[Symbol.for("nodejs.util.inspect.custom")] = zt.prototype.inspect), [{ name: function(t2) {
        return "".concat(t2, "Edge");
      }, generateKey: true }, { name: function(t2) {
        return "".concat(t2, "DirectedEdge");
      }, generateKey: true, type: "directed" }, { name: function(t2) {
        return "".concat(t2, "UndirectedEdge");
      }, generateKey: true, type: "undirected" }, { name: function(t2) {
        return "".concat(t2, "EdgeWithKey");
      } }, { name: function(t2) {
        return "".concat(t2, "DirectedEdgeWithKey");
      }, type: "directed" }, { name: function(t2) {
        return "".concat(t2, "UndirectedEdgeWithKey");
      }, type: "undirected" }].forEach(function(t2) {
        ["add", "merge", "update"].forEach(function(e2) {
          var n2 = t2.name(e2), r2 = "add" === e2 ? jt : Ct;
          t2.generateKey ? zt.prototype[n2] = function(i2, o2, a2) {
            return r2(this, n2, true, "undirected" === (t2.type || this.type), null, i2, o2, a2, "update" === e2);
          } : zt.prototype[n2] = function(i2, o2, a2, c2) {
            return r2(this, n2, false, "undirected" === (t2.type || this.type), i2, o2, a2, c2, "update" === e2);
          };
        });
      }), function(t2) {
        Q.forEach(function(e2) {
          var n2 = e2.name, r2 = e2.attacher;
          r2(t2, n2("Node"), 0), r2(t2, n2("Source"), 1), r2(t2, n2("Target"), 2), r2(t2, n2("Opposite"), 3);
        });
      }(zt), function(t2) {
        X.forEach(function(e2) {
          var n2 = e2.name, r2 = e2.attacher;
          r2(t2, n2("Edge"), "mixed"), r2(t2, n2("DirectedEdge"), "directed"), r2(t2, n2("UndirectedEdge"), "undirected");
        });
      }(zt), function(t2) {
        et.forEach(function(e2) {
          !function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction;
            t3.prototype[n2] = function(t4, e4) {
              if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type)
                return [];
              if (!arguments.length)
                return ut(this, r2);
              if (1 === arguments.length) {
                t4 = "" + t4;
                var o2 = this._nodes.get(t4);
                if (void 0 === o2)
                  throw new F("Graph.".concat(n2, ': could not find the "').concat(t4, '" node in the graph.'));
                return pt(this.multi, "mixed" === r2 ? this.type : r2, i2, o2);
              }
              if (2 === arguments.length) {
                t4 = "" + t4, e4 = "" + e4;
                var a2 = this._nodes.get(t4);
                if (!a2)
                  throw new F("Graph.".concat(n2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                if (!this._nodes.has(e4))
                  throw new F("Graph.".concat(n2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                return gt(r2, this.multi, i2, a2, e4);
              }
              throw new B("Graph.".concat(n2, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
            };
          }(t2, e2), function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = "forEach" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[o2] = function(t4, e4, n3) {
              if ("mixed" === r2 || "mixed" === this.type || r2 === this.type) {
                if (1 === arguments.length)
                  return dt(false, this, r2, n3 = t4);
                if (2 === arguments.length) {
                  t4 = "" + t4, n3 = e4;
                  var a3 = this._nodes.get(t4);
                  if (void 0 === a3)
                    throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                  return ht(false, this.multi, "mixed" === r2 ? this.type : r2, i2, a3, n3);
                }
                if (3 === arguments.length) {
                  t4 = "" + t4, e4 = "" + e4;
                  var c3 = this._nodes.get(t4);
                  if (!c3)
                    throw new F("Graph.".concat(o2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                  if (!this._nodes.has(e4))
                    throw new F("Graph.".concat(o2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                  return lt(false, r2, this.multi, i2, c3, e4, n3);
                }
                throw new B("Graph.".concat(o2, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
              }
            };
            var a2 = "map" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[a2] = function() {
              var t4, e4 = Array.prototype.slice.call(arguments), n3 = e4.pop();
              if (0 === e4.length) {
                var i3 = 0;
                "directed" !== r2 && (i3 += this.undirectedSize), "undirected" !== r2 && (i3 += this.directedSize), t4 = new Array(i3);
                var a3 = 0;
                e4.push(function(e5, r3, i4, o3, c3, u3, d2) {
                  t4[a3++] = n3(e5, r3, i4, o3, c3, u3, d2);
                });
              } else
                t4 = [], e4.push(function(e5, r3, i4, o3, a4, c3, u3) {
                  t4.push(n3(e5, r3, i4, o3, a4, c3, u3));
                });
              return this[o2].apply(this, e4), t4;
            };
            var c2 = "filter" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[c2] = function() {
              var t4 = Array.prototype.slice.call(arguments), e4 = t4.pop(), n3 = [];
              return t4.push(function(t5, r3, i3, o3, a3, c3, u3) {
                e4(t5, r3, i3, o3, a3, c3, u3) && n3.push(t5);
              }), this[o2].apply(this, t4), n3;
            };
            var u2 = "reduce" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[u2] = function() {
              var t4, e4, n3 = Array.prototype.slice.call(arguments);
              if (n3.length < 2 || n3.length > 4)
                throw new B("Graph.".concat(u2, ": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(n3.length, ")."));
              if ("function" == typeof n3[n3.length - 1] && "function" != typeof n3[n3.length - 2])
                throw new B("Graph.".concat(u2, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
              2 === n3.length ? (t4 = n3[0], e4 = n3[1], n3 = []) : 3 === n3.length ? (t4 = n3[1], e4 = n3[2], n3 = [n3[0]]) : 4 === n3.length && (t4 = n3[2], e4 = n3[3], n3 = [n3[0], n3[1]]);
              var r3 = e4;
              return n3.push(function(e5, n4, i3, o3, a3, c3, u3) {
                r3 = t4(r3, e5, n4, i3, o3, a3, c3, u3);
              }), this[o2].apply(this, n3), r3;
            };
          }(t2, e2), function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = "find" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[o2] = function(t4, e4, n3) {
              if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type)
                return false;
              if (1 === arguments.length)
                return dt(true, this, r2, n3 = t4);
              if (2 === arguments.length) {
                t4 = "" + t4, n3 = e4;
                var a3 = this._nodes.get(t4);
                if (void 0 === a3)
                  throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                return ht(true, this.multi, "mixed" === r2 ? this.type : r2, i2, a3, n3);
              }
              if (3 === arguments.length) {
                t4 = "" + t4, e4 = "" + e4;
                var c3 = this._nodes.get(t4);
                if (!c3)
                  throw new F("Graph.".concat(o2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                if (!this._nodes.has(e4))
                  throw new F("Graph.".concat(o2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                return lt(true, r2, this.multi, i2, c3, e4, n3);
              }
              throw new B("Graph.".concat(o2, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
            };
            var a2 = "some" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[a2] = function() {
              var t4 = Array.prototype.slice.call(arguments), e4 = t4.pop();
              return t4.push(function(t5, n3, r3, i3, o3, a3, c3) {
                return e4(t5, n3, r3, i3, o3, a3, c3);
              }), !!this[o2].apply(this, t4);
            };
            var c2 = "every" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[c2] = function() {
              var t4 = Array.prototype.slice.call(arguments), e4 = t4.pop();
              return t4.push(function(t5, n3, r3, i3, o3, a3, c3) {
                return !e4(t5, n3, r3, i3, o3, a3, c3);
              }), !this[o2].apply(this, t4);
            };
          }(t2, e2), function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = n2.slice(0, -1) + "Entries";
            t3.prototype[o2] = function(t4, e4) {
              if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type)
                return O.empty();
              if (!arguments.length)
                return st(this, r2);
              if (1 === arguments.length) {
                t4 = "" + t4;
                var n3 = this._nodes.get(t4);
                if (!n3)
                  throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                return ft(r2, i2, n3);
              }
              if (2 === arguments.length) {
                t4 = "" + t4, e4 = "" + e4;
                var a2 = this._nodes.get(t4);
                if (!a2)
                  throw new F("Graph.".concat(o2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                if (!this._nodes.has(e4))
                  throw new F("Graph.".concat(o2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                return yt(r2, i2, a2, e4);
              }
              throw new B("Graph.".concat(o2, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
            };
          }(t2, e2);
        });
      }(zt), function(t2) {
        wt.forEach(function(e2) {
          _t(t2, e2), function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = "forEach" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[o2] = function(t4, e4) {
              if ("mixed" === r2 || "mixed" === this.type || r2 === this.type) {
                t4 = "" + t4;
                var n3 = this._nodes.get(t4);
                if (void 0 === n3)
                  throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                mt(false, "mixed" === r2 ? this.type : r2, i2, n3, e4);
              }
            };
            var a2 = "map" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[a2] = function(t4, e4) {
              var n3 = [];
              return this[o2](t4, function(t5, r3) {
                n3.push(e4(t5, r3));
              }), n3;
            };
            var c2 = "filter" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[c2] = function(t4, e4) {
              var n3 = [];
              return this[o2](t4, function(t5, r3) {
                e4(t5, r3) && n3.push(t5);
              }), n3;
            };
            var u2 = "reduce" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[u2] = function(t4, e4, n3) {
              if (arguments.length < 3)
                throw new B("Graph.".concat(u2, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
              var r3 = n3;
              return this[o2](t4, function(t5, n4) {
                r3 = e4(r3, t5, n4);
              }), r3;
            };
          }(t2, e2), function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = n2[0].toUpperCase() + n2.slice(1, -1), a2 = "find" + o2;
            t3.prototype[a2] = function(t4, e4) {
              if ("mixed" === r2 || "mixed" === this.type || r2 === this.type) {
                t4 = "" + t4;
                var n3 = this._nodes.get(t4);
                if (void 0 === n3)
                  throw new F("Graph.".concat(a2, ': could not find the "').concat(t4, '" node in the graph.'));
                return mt(true, "mixed" === r2 ? this.type : r2, i2, n3, e4);
              }
            };
            var c2 = "some" + o2;
            t3.prototype[c2] = function(t4, e4) {
              return !!this[a2](t4, e4);
            };
            var u2 = "every" + o2;
            t3.prototype[u2] = function(t4, e4) {
              return !this[a2](t4, function(t5, n3) {
                return !e4(t5, n3);
              });
            };
          }(t2, e2), Gt(t2, e2);
        });
      }(zt);
      var Wt = function(t2) {
        function n2(e2) {
          var n3 = u({ type: "directed" }, e2);
          if ("multi" in n3 && false !== n3.multi)
            throw new B("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
          if ("directed" !== n3.type)
            throw new B('DirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      }(zt), Pt = function(t2) {
        function n2(e2) {
          var n3 = u({ type: "undirected" }, e2);
          if ("multi" in n3 && false !== n3.multi)
            throw new B("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
          if ("undirected" !== n3.type)
            throw new B('UndirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      }(zt), Rt = function(t2) {
        function n2(e2) {
          var n3 = u({ multi: true }, e2);
          if ("multi" in n3 && true !== n3.multi)
            throw new B("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      }(zt), Kt = function(t2) {
        function n2(e2) {
          var n3 = u({ type: "directed", multi: true }, e2);
          if ("multi" in n3 && true !== n3.multi)
            throw new B("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
          if ("directed" !== n3.type)
            throw new B('MultiDirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      }(zt), Tt = function(t2) {
        function n2(e2) {
          var n3 = u({ type: "undirected", multi: true }, e2);
          if ("multi" in n3 && true !== n3.multi)
            throw new B("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
          if ("undirected" !== n3.type)
            throw new B('MultiUndirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      }(zt);
      function Bt(t2) {
        t2.from = function(e2, n2) {
          var r2 = u({}, e2.options, n2), i2 = new t2(r2);
          return i2.import(e2), i2;
        };
      }
      return Bt(zt), Bt(Wt), Bt(Pt), Bt(Rt), Bt(Kt), Bt(Tt), zt.Graph = zt, zt.DirectedGraph = Wt, zt.UndirectedGraph = Pt, zt.MultiGraph = Rt, zt.MultiDirectedGraph = Kt, zt.MultiUndirectedGraph = Tt, zt.InvalidArgumentsGraphError = B, zt.NotFoundGraphError = F, zt.UsageGraphError = I, zt;
    });
  }
});

// ../testeranto/dist/module/Features.js
var import_graphology = __toESM(require_graphology_umd_min(), 1);
var { DirectedGraph, UndirectedGraph } = import_graphology.default;
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
  federatedSplitContract: new MyFeature(
    "A website which can acts as a storefront"
  ),
  markRedeemed: new MyFeature(
    "Registers contract status as redeemed, and changes image"
  ),
  encryptShipping: new MyFeature(
    "Buyer encrypts plaintext message and stores value on contract"
  ),
  decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),
  buildSilo: new MyFeature(
    "build the rocket silo",
    /* @__PURE__ */ new Date("2023-05-02T02:36:34+0000")
  ),
  buildRocket: new MyFeature(
    "build the rocket",
    /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")
  ),
  buildSatellite: new MyFeature(
    "build the rocket payload",
    /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")
  ),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos"),
  walkingTheDog: new MyFeature("my favorite chore")
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
undirected.connect(`gutentag`, `aloha`, "related");
undirected.connect(`buildRocket`, `buildSatellite`, "overlap");
undirected.connect(`buildRocket`, `buildSilo`, "overlap");
var features_test_default = new TesterantoFeatures(features, {
  undirected: [undirected],
  directed: [semantic],
  dags: [priorityGraph]
});
export {
  MyFeature,
  features_test_default as default,
  features
};
