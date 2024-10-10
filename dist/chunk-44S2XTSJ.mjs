import {
  __commonJS,
  __toESM,
  init_cjs_shim
} from "./chunk-37RU6URC.mjs";

// node_modules/immer/dist/immer.cjs.production.min.js
var require_immer_cjs_production_min = __commonJS({
  "node_modules/immer/dist/immer.cjs.production.min.js"(exports) {
    init_cjs_shim();
    function n(n2) {
      for (var r2 = arguments.length, t2 = Array(r2 > 1 ? r2 - 1 : 0), e2 = 1; e2 < r2; e2++)
        t2[e2 - 1] = arguments[e2];
      throw Error("[Immer] minified error nr: " + n2 + (t2.length ? " " + t2.map(function(n3) {
        return "'" + n3 + "'";
      }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
    }
    function r(n2) {
      return !!n2 && !!n2[H];
    }
    function t(n2) {
      var r2;
      return !!n2 && (function(n3) {
        if (!n3 || "object" != typeof n3)
          return false;
        var r3 = Object.getPrototypeOf(n3);
        if (null === r3)
          return true;
        var t2 = Object.hasOwnProperty.call(r3, "constructor") && r3.constructor;
        return t2 === Object || "function" == typeof t2 && Function.toString.call(t2) === Q;
      }(n2) || Array.isArray(n2) || !!n2[G] || !!(null === (r2 = n2.constructor) || void 0 === r2 ? void 0 : r2[G]) || c(n2) || v(n2));
    }
    function e(n2, r2, t2) {
      void 0 === t2 && (t2 = false), 0 === i(n2) ? (t2 ? Object.keys : T)(n2).forEach(function(e2) {
        t2 && "symbol" == typeof e2 || r2(e2, n2[e2], n2);
      }) : n2.forEach(function(t3, e2) {
        return r2(e2, t3, n2);
      });
    }
    function i(n2) {
      var r2 = n2[H];
      return r2 ? r2.t > 3 ? r2.t - 4 : r2.t : Array.isArray(n2) ? 1 : c(n2) ? 2 : v(n2) ? 3 : 0;
    }
    function u(n2, r2) {
      return 2 === i(n2) ? n2.has(r2) : Object.prototype.hasOwnProperty.call(n2, r2);
    }
    function o(n2, r2) {
      return 2 === i(n2) ? n2.get(r2) : n2[r2];
    }
    function f(n2, r2, t2) {
      var e2 = i(n2);
      2 === e2 ? n2.set(r2, t2) : 3 === e2 ? n2.add(t2) : n2[r2] = t2;
    }
    function a(n2, r2) {
      return n2 === r2 ? 0 !== n2 || 1 / n2 == 1 / r2 : n2 != n2 && r2 != r2;
    }
    function c(n2) {
      return W && n2 instanceof Map;
    }
    function v(n2) {
      return X && n2 instanceof Set;
    }
    function s(n2) {
      return n2.i || n2.u;
    }
    function p(n2) {
      if (Array.isArray(n2))
        return Array.prototype.slice.call(n2);
      var r2 = U(n2);
      delete r2[H];
      for (var t2 = T(r2), e2 = 0; e2 < t2.length; e2++) {
        var i2 = t2[e2], u2 = r2[i2];
        false === u2.writable && (u2.writable = true, u2.configurable = true), (u2.get || u2.set) && (r2[i2] = { configurable: true, writable: true, enumerable: u2.enumerable, value: n2[i2] });
      }
      return Object.create(Object.getPrototypeOf(n2), r2);
    }
    function l(n2, u2) {
      return void 0 === u2 && (u2 = false), h(n2) || r(n2) || !t(n2) || (i(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = d), Object.freeze(n2), u2 && e(n2, function(n3, r2) {
        return l(r2, true);
      }, true)), n2;
    }
    function d() {
      n(2);
    }
    function h(n2) {
      return null == n2 || "object" != typeof n2 || Object.isFrozen(n2);
    }
    function y(r2) {
      var t2 = V[r2];
      return t2 || n(18, r2), t2;
    }
    function _(n2, r2) {
      V[n2] || (V[n2] = r2);
    }
    function b() {
      return I;
    }
    function m(n2, r2) {
      r2 && (y("Patches"), n2.o = [], n2.v = [], n2.s = r2);
    }
    function j(n2) {
      O(n2), n2.p.forEach(w), n2.p = null;
    }
    function O(n2) {
      n2 === I && (I = n2.l);
    }
    function x(n2) {
      return I = { p: [], l: I, h: n2, _: true, m: 0 };
    }
    function w(n2) {
      var r2 = n2[H];
      0 === r2.t || 1 === r2.t ? r2.j() : r2.O = true;
    }
    function S(r2, e2) {
      e2.m = e2.p.length;
      var i2 = e2.p[0], u2 = void 0 !== r2 && r2 !== i2;
      return e2.h.S || y("ES5").P(e2, r2, u2), u2 ? (i2[H].g && (j(e2), n(4)), t(r2) && (r2 = P(e2, r2), e2.l || M(e2, r2)), e2.o && y("Patches").M(i2[H].u, r2, e2.o, e2.v)) : r2 = P(e2, i2, []), j(e2), e2.o && e2.s(e2.o, e2.v), r2 !== B ? r2 : void 0;
    }
    function P(n2, r2, t2) {
      if (h(r2))
        return r2;
      var i2 = r2[H];
      if (!i2)
        return e(r2, function(e2, u3) {
          return g(n2, i2, r2, e2, u3, t2);
        }, true), r2;
      if (i2.A !== n2)
        return r2;
      if (!i2.g)
        return M(n2, i2.u, true), i2.u;
      if (!i2.R) {
        i2.R = true, i2.A.m--;
        var u2 = 4 === i2.t || 5 === i2.t ? i2.i = p(i2.k) : i2.i, o2 = u2, f2 = false;
        3 === i2.t && (o2 = new Set(u2), u2.clear(), f2 = true), e(o2, function(r3, e2) {
          return g(n2, i2, u2, r3, e2, t2, f2);
        }), M(n2, u2, false), t2 && n2.o && y("Patches").F(i2, t2, n2.o, n2.v);
      }
      return i2.i;
    }
    function g(n2, e2, i2, o2, a2, c2, v2) {
      if (r(a2)) {
        var s2 = P(n2, a2, c2 && e2 && 3 !== e2.t && !u(e2.N, o2) ? c2.concat(o2) : void 0);
        if (f(i2, o2, s2), !r(s2))
          return;
        n2._ = false;
      } else
        v2 && i2.add(a2);
      if (t(a2) && !h(a2)) {
        if (!n2.h.D && n2.m < 1)
          return;
        P(n2, a2), e2 && e2.A.l || M(n2, a2);
      }
    }
    function M(n2, r2, t2) {
      void 0 === t2 && (t2 = false), !n2.l && n2.h.D && n2._ && l(r2, t2);
    }
    function A(n2, r2) {
      var t2 = n2[H];
      return (t2 ? s(t2) : n2)[r2];
    }
    function z(n2, r2) {
      if (r2 in n2)
        for (var t2 = Object.getPrototypeOf(n2); t2; ) {
          var e2 = Object.getOwnPropertyDescriptor(t2, r2);
          if (e2)
            return e2;
          t2 = Object.getPrototypeOf(t2);
        }
    }
    function E(n2) {
      n2.g || (n2.g = true, n2.l && E(n2.l));
    }
    function R(n2) {
      n2.i || (n2.i = p(n2.u));
    }
    function k(n2, r2, t2) {
      var e2 = c(r2) ? y("MapSet").K(r2, t2) : v(r2) ? y("MapSet").$(r2, t2) : n2.S ? function(n3, r3) {
        var t3 = Array.isArray(n3), e3 = { t: t3 ? 1 : 0, A: r3 ? r3.A : b(), g: false, R: false, N: {}, l: r3, u: n3, k: null, i: null, j: null, C: false }, i2 = e3, u2 = Y;
        t3 && (i2 = [e3], u2 = Z);
        var o2 = Proxy.revocable(i2, u2), f2 = o2.revoke, a2 = o2.proxy;
        return e3.k = a2, e3.j = f2, a2;
      }(r2, t2) : y("ES5").I(r2, t2);
      return (t2 ? t2.A : b()).p.push(e2), e2;
    }
    function F(u2) {
      return r(u2) || n(22, u2), function n2(r2) {
        if (!t(r2))
          return r2;
        var u3, a2 = r2[H], c2 = i(r2);
        if (a2) {
          if (!a2.g && (a2.t < 4 || !y("ES5").J(a2)))
            return a2.u;
          a2.R = true, u3 = N(r2, c2), a2.R = false;
        } else
          u3 = N(r2, c2);
        return e(u3, function(r3, t2) {
          a2 && o(a2.u, r3) === t2 || f(u3, r3, n2(t2));
        }), 3 === c2 ? new Set(u3) : u3;
      }(u2);
    }
    function N(n2, r2) {
      switch (r2) {
        case 2:
          return new Map(n2);
        case 3:
          return Array.from(n2);
      }
      return p(n2);
    }
    function D() {
      function n2(n3, r2) {
        var t3 = f2[n3];
        return t3 ? t3.enumerable = r2 : f2[n3] = t3 = { configurable: true, enumerable: r2, get: function() {
          return Y.get(this[H], n3);
        }, set: function(r3) {
          Y.set(this[H], n3, r3);
        } }, t3;
      }
      function t2(n3) {
        for (var r2 = n3.length - 1; r2 >= 0; r2--) {
          var t3 = n3[r2][H];
          if (!t3.g)
            switch (t3.t) {
              case 5:
                o2(t3) && E(t3);
                break;
              case 4:
                i2(t3) && E(t3);
            }
        }
      }
      function i2(n3) {
        for (var r2 = n3.u, t3 = n3.k, e2 = T(t3), i3 = e2.length - 1; i3 >= 0; i3--) {
          var o3 = e2[i3];
          if (o3 !== H) {
            var f3 = r2[o3];
            if (void 0 === f3 && !u(r2, o3))
              return true;
            var c2 = t3[o3], v2 = c2 && c2[H];
            if (v2 ? v2.u !== f3 : !a(c2, f3))
              return true;
          }
        }
        var s2 = !!r2[H];
        return e2.length !== T(r2).length + (s2 ? 0 : 1);
      }
      function o2(n3) {
        var r2 = n3.k;
        if (r2.length !== n3.u.length)
          return true;
        var t3 = Object.getOwnPropertyDescriptor(r2, r2.length - 1);
        if (t3 && !t3.get)
          return true;
        for (var e2 = 0; e2 < r2.length; e2++)
          if (!r2.hasOwnProperty(e2))
            return true;
        return false;
      }
      var f2 = {};
      _("ES5", { I: function(r2, t3) {
        var e2 = Array.isArray(r2), i3 = function(r3, t4) {
          if (r3) {
            for (var e3 = Array(t4.length), i4 = 0; i4 < t4.length; i4++)
              Object.defineProperty(e3, "" + i4, n2(i4, true));
            return e3;
          }
          var u3 = U(t4);
          delete u3[H];
          for (var o3 = T(u3), f3 = 0; f3 < o3.length; f3++) {
            var a2 = o3[f3];
            u3[a2] = n2(a2, r3 || !!u3[a2].enumerable);
          }
          return Object.create(Object.getPrototypeOf(t4), u3);
        }(e2, r2), u2 = { t: e2 ? 5 : 4, A: t3 ? t3.A : b(), g: false, R: false, N: {}, l: t3, u: r2, k: i3, i: null, O: false, C: false };
        return Object.defineProperty(i3, H, { value: u2, writable: true }), i3;
      }, P: function(n3, i3, f3) {
        f3 ? r(i3) && i3[H].A === n3 && t2(n3.p) : (n3.o && function n4(r2) {
          if (r2 && "object" == typeof r2) {
            var t3 = r2[H];
            if (t3) {
              var i4 = t3.u, f4 = t3.k, a2 = t3.N, c2 = t3.t;
              if (4 === c2)
                e(f4, function(r3) {
                  r3 !== H && (void 0 !== i4[r3] || u(i4, r3) ? a2[r3] || n4(f4[r3]) : (a2[r3] = true, E(t3)));
                }), e(i4, function(n5) {
                  void 0 !== f4[n5] || u(f4, n5) || (a2[n5] = false, E(t3));
                });
              else if (5 === c2) {
                if (o2(t3) && (E(t3), a2.length = true), f4.length < i4.length)
                  for (var v2 = f4.length; v2 < i4.length; v2++)
                    a2[v2] = false;
                else
                  for (var s2 = i4.length; s2 < f4.length; s2++)
                    a2[s2] = true;
                for (var p2 = Math.min(f4.length, i4.length), l2 = 0; l2 < p2; l2++)
                  f4.hasOwnProperty(l2) || (a2[l2] = true), void 0 === a2[l2] && n4(f4[l2]);
              }
            }
          }
        }(n3.p[0]), t2(n3.p));
      }, J: function(n3) {
        return 4 === n3.t ? i2(n3) : o2(n3);
      } });
    }
    function K() {
      function f2(n2) {
        if (!t(n2))
          return n2;
        if (Array.isArray(n2))
          return n2.map(f2);
        if (c(n2))
          return new Map(Array.from(n2.entries()).map(function(n3) {
            return [n3[0], f2(n3[1])];
          }));
        if (v(n2))
          return new Set(Array.from(n2).map(f2));
        var r2 = Object.create(Object.getPrototypeOf(n2));
        for (var e2 in n2)
          r2[e2] = f2(n2[e2]);
        return u(n2, G) && (r2[G] = n2[G]), r2;
      }
      function a2(n2) {
        return r(n2) ? f2(n2) : n2;
      }
      var s2 = "add";
      _("Patches", { W: function(r2, t2) {
        return t2.forEach(function(t3) {
          for (var e2 = t3.path, u2 = t3.op, a3 = r2, c2 = 0; c2 < e2.length - 1; c2++) {
            var v2 = i(a3), p2 = e2[c2];
            "string" != typeof p2 && "number" != typeof p2 && (p2 = "" + p2), 0 !== v2 && 1 !== v2 || "__proto__" !== p2 && "constructor" !== p2 || n(24), "function" == typeof a3 && "prototype" === p2 && n(24), "object" != typeof (a3 = o(a3, p2)) && n(15, e2.join("/"));
          }
          var l2 = i(a3), d2 = f2(t3.value), h2 = e2[e2.length - 1];
          switch (u2) {
            case "replace":
              switch (l2) {
                case 2:
                  return a3.set(h2, d2);
                case 3:
                  n(16);
                default:
                  return a3[h2] = d2;
              }
            case s2:
              switch (l2) {
                case 1:
                  return "-" === h2 ? a3.push(d2) : a3.splice(h2, 0, d2);
                case 2:
                  return a3.set(h2, d2);
                case 3:
                  return a3.add(d2);
                default:
                  return a3[h2] = d2;
              }
            case "remove":
              switch (l2) {
                case 1:
                  return a3.splice(h2, 1);
                case 2:
                  return a3.delete(h2);
                case 3:
                  return a3.delete(t3.value);
                default:
                  return delete a3[h2];
              }
            default:
              n(17, u2);
          }
        }), r2;
      }, F: function(n2, r2, t2, i2) {
        switch (n2.t) {
          case 0:
          case 4:
          case 2:
            return function(n3, r3, t3, i3) {
              var f3 = n3.u, c2 = n3.i;
              e(n3.N, function(n4, e2) {
                var v2 = o(f3, n4), p2 = o(c2, n4), l2 = e2 ? u(f3, n4) ? "replace" : s2 : "remove";
                if (v2 !== p2 || "replace" !== l2) {
                  var d2 = r3.concat(n4);
                  t3.push("remove" === l2 ? { op: l2, path: d2 } : { op: l2, path: d2, value: p2 }), i3.push(l2 === s2 ? { op: "remove", path: d2 } : "remove" === l2 ? { op: s2, path: d2, value: a2(v2) } : { op: "replace", path: d2, value: a2(v2) });
                }
              });
            }(n2, r2, t2, i2);
          case 5:
          case 1:
            return function(n3, r3, t3, e2) {
              var i3 = n3.u, u2 = n3.N, o2 = n3.i;
              if (o2.length < i3.length) {
                var f3 = [o2, i3];
                i3 = f3[0], o2 = f3[1];
                var c2 = [e2, t3];
                t3 = c2[0], e2 = c2[1];
              }
              for (var v2 = 0; v2 < i3.length; v2++)
                if (u2[v2] && o2[v2] !== i3[v2]) {
                  var p2 = r3.concat([v2]);
                  t3.push({ op: "replace", path: p2, value: a2(o2[v2]) }), e2.push({ op: "replace", path: p2, value: a2(i3[v2]) });
                }
              for (var l2 = i3.length; l2 < o2.length; l2++) {
                var d2 = r3.concat([l2]);
                t3.push({ op: s2, path: d2, value: a2(o2[l2]) });
              }
              i3.length < o2.length && e2.push({ op: "replace", path: r3.concat(["length"]), value: i3.length });
            }(n2, r2, t2, i2);
          case 3:
            return function(n3, r3, t3, e2) {
              var i3 = n3.u, u2 = n3.i, o2 = 0;
              i3.forEach(function(n4) {
                if (!u2.has(n4)) {
                  var i4 = r3.concat([o2]);
                  t3.push({ op: "remove", path: i4, value: n4 }), e2.unshift({ op: s2, path: i4, value: n4 });
                }
                o2++;
              }), o2 = 0, u2.forEach(function(n4) {
                if (!i3.has(n4)) {
                  var u3 = r3.concat([o2]);
                  t3.push({ op: s2, path: u3, value: n4 }), e2.unshift({ op: "remove", path: u3, value: n4 });
                }
                o2++;
              });
            }(n2, r2, t2, i2);
        }
      }, M: function(n2, r2, t2, e2) {
        t2.push({ op: "replace", path: [], value: r2 === B ? void 0 : r2 }), e2.push({ op: "replace", path: [], value: n2 });
      } });
    }
    function $() {
      function r2(n2, r3) {
        function t2() {
          this.constructor = n2;
        }
        f2(n2, r3), n2.prototype = (t2.prototype = r3.prototype, new t2());
      }
      function i2(n2) {
        n2.i || (n2.N = /* @__PURE__ */ new Map(), n2.i = new Map(n2.u));
      }
      function u2(n2) {
        n2.i || (n2.i = /* @__PURE__ */ new Set(), n2.u.forEach(function(r3) {
          if (t(r3)) {
            var e2 = k(n2.A.h, r3, n2);
            n2.p.set(r3, e2), n2.i.add(e2);
          } else
            n2.i.add(r3);
        }));
      }
      function o2(r3) {
        r3.O && n(3, JSON.stringify(s(r3)));
      }
      var f2 = function(n2, r3) {
        return (f2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n3, r4) {
          n3.__proto__ = r4;
        } || function(n3, r4) {
          for (var t2 in r4)
            r4.hasOwnProperty(t2) && (n3[t2] = r4[t2]);
        })(n2, r3);
      }, a2 = function() {
        function n2(n3, r3) {
          return this[H] = { t: 2, l: r3, A: r3 ? r3.A : b(), g: false, R: false, i: void 0, N: void 0, u: n3, k: this, C: false, O: false }, this;
        }
        r2(n2, Map);
        var u3 = n2.prototype;
        return Object.defineProperty(u3, "size", { get: function() {
          return s(this[H]).size;
        } }), u3.has = function(n3) {
          return s(this[H]).has(n3);
        }, u3.set = function(n3, r3) {
          var t2 = this[H];
          return o2(t2), s(t2).has(n3) && s(t2).get(n3) === r3 || (i2(t2), E(t2), t2.N.set(n3, true), t2.i.set(n3, r3), t2.N.set(n3, true)), this;
        }, u3.delete = function(n3) {
          if (!this.has(n3))
            return false;
          var r3 = this[H];
          return o2(r3), i2(r3), E(r3), r3.u.has(n3) ? r3.N.set(n3, false) : r3.N.delete(n3), r3.i.delete(n3), true;
        }, u3.clear = function() {
          var n3 = this[H];
          o2(n3), s(n3).size && (i2(n3), E(n3), n3.N = /* @__PURE__ */ new Map(), e(n3.u, function(r3) {
            n3.N.set(r3, false);
          }), n3.i.clear());
        }, u3.forEach = function(n3, r3) {
          var t2 = this;
          s(this[H]).forEach(function(e2, i3) {
            n3.call(r3, t2.get(i3), i3, t2);
          });
        }, u3.get = function(n3) {
          var r3 = this[H];
          o2(r3);
          var e2 = s(r3).get(n3);
          if (r3.R || !t(e2))
            return e2;
          if (e2 !== r3.u.get(n3))
            return e2;
          var u4 = k(r3.A.h, e2, r3);
          return i2(r3), r3.i.set(n3, u4), u4;
        }, u3.keys = function() {
          return s(this[H]).keys();
        }, u3.values = function() {
          var n3, r3 = this, t2 = this.keys();
          return (n3 = {})[L] = function() {
            return r3.values();
          }, n3.next = function() {
            var n4 = t2.next();
            return n4.done ? n4 : { done: false, value: r3.get(n4.value) };
          }, n3;
        }, u3.entries = function() {
          var n3, r3 = this, t2 = this.keys();
          return (n3 = {})[L] = function() {
            return r3.entries();
          }, n3.next = function() {
            var n4 = t2.next();
            if (n4.done)
              return n4;
            var e2 = r3.get(n4.value);
            return { done: false, value: [n4.value, e2] };
          }, n3;
        }, u3[L] = function() {
          return this.entries();
        }, n2;
      }(), c2 = function() {
        function n2(n3, r3) {
          return this[H] = { t: 3, l: r3, A: r3 ? r3.A : b(), g: false, R: false, i: void 0, u: n3, k: this, p: /* @__PURE__ */ new Map(), O: false, C: false }, this;
        }
        r2(n2, Set);
        var t2 = n2.prototype;
        return Object.defineProperty(t2, "size", { get: function() {
          return s(this[H]).size;
        } }), t2.has = function(n3) {
          var r3 = this[H];
          return o2(r3), r3.i ? !!r3.i.has(n3) || !(!r3.p.has(n3) || !r3.i.has(r3.p.get(n3))) : r3.u.has(n3);
        }, t2.add = function(n3) {
          var r3 = this[H];
          return o2(r3), this.has(n3) || (u2(r3), E(r3), r3.i.add(n3)), this;
        }, t2.delete = function(n3) {
          if (!this.has(n3))
            return false;
          var r3 = this[H];
          return o2(r3), u2(r3), E(r3), r3.i.delete(n3) || !!r3.p.has(n3) && r3.i.delete(r3.p.get(n3));
        }, t2.clear = function() {
          var n3 = this[H];
          o2(n3), s(n3).size && (u2(n3), E(n3), n3.i.clear());
        }, t2.values = function() {
          var n3 = this[H];
          return o2(n3), u2(n3), n3.i.values();
        }, t2.entries = function() {
          var n3 = this[H];
          return o2(n3), u2(n3), n3.i.entries();
        }, t2.keys = function() {
          return this.values();
        }, t2[L] = function() {
          return this.values();
        }, t2.forEach = function(n3, r3) {
          for (var t3 = this.values(), e2 = t3.next(); !e2.done; )
            n3.call(r3, e2.value, e2.value, this), e2 = t3.next();
        }, n2;
      }();
      _("MapSet", { K: function(n2, r3) {
        return new a2(n2, r3);
      }, $: function(n2, r3) {
        return new c2(n2, r3);
      } });
    }
    var C;
    Object.defineProperty(exports, "__esModule", { value: true });
    var I;
    var J = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x");
    var W = "undefined" != typeof Map;
    var X = "undefined" != typeof Set;
    var q = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect;
    var B = J ? Symbol.for("immer-nothing") : ((C = {})["immer-nothing"] = true, C);
    var G = J ? Symbol.for("immer-draftable") : "__$immer_draftable";
    var H = J ? Symbol.for("immer-state") : "__$immer_state";
    var L = "undefined" != typeof Symbol && Symbol.iterator || "@@iterator";
    var Q = "" + Object.prototype.constructor;
    var T = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n2) {
      return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
    } : Object.getOwnPropertyNames;
    var U = Object.getOwnPropertyDescriptors || function(n2) {
      var r2 = {};
      return T(n2).forEach(function(t2) {
        r2[t2] = Object.getOwnPropertyDescriptor(n2, t2);
      }), r2;
    };
    var V = {};
    var Y = { get: function(n2, r2) {
      if (r2 === H)
        return n2;
      var e2 = s(n2);
      if (!u(e2, r2))
        return function(n3, r3, t2) {
          var e3, i3 = z(r3, t2);
          return i3 ? "value" in i3 ? i3.value : null === (e3 = i3.get) || void 0 === e3 ? void 0 : e3.call(n3.k) : void 0;
        }(n2, e2, r2);
      var i2 = e2[r2];
      return n2.R || !t(i2) ? i2 : i2 === A(n2.u, r2) ? (R(n2), n2.i[r2] = k(n2.A.h, i2, n2)) : i2;
    }, has: function(n2, r2) {
      return r2 in s(n2);
    }, ownKeys: function(n2) {
      return Reflect.ownKeys(s(n2));
    }, set: function(n2, r2, t2) {
      var e2 = z(s(n2), r2);
      if (null == e2 ? void 0 : e2.set)
        return e2.set.call(n2.k, t2), true;
      if (!n2.g) {
        var i2 = A(s(n2), r2), o2 = null == i2 ? void 0 : i2[H];
        if (o2 && o2.u === t2)
          return n2.i[r2] = t2, n2.N[r2] = false, true;
        if (a(t2, i2) && (void 0 !== t2 || u(n2.u, r2)))
          return true;
        R(n2), E(n2);
      }
      return n2.i[r2] === t2 && (void 0 !== t2 || r2 in n2.i) || Number.isNaN(t2) && Number.isNaN(n2.i[r2]) || (n2.i[r2] = t2, n2.N[r2] = true), true;
    }, deleteProperty: function(n2, r2) {
      return void 0 !== A(n2.u, r2) || r2 in n2.u ? (n2.N[r2] = false, R(n2), E(n2)) : delete n2.N[r2], n2.i && delete n2.i[r2], true;
    }, getOwnPropertyDescriptor: function(n2, r2) {
      var t2 = s(n2), e2 = Reflect.getOwnPropertyDescriptor(t2, r2);
      return e2 ? { writable: true, configurable: 1 !== n2.t || "length" !== r2, enumerable: e2.enumerable, value: t2[r2] } : e2;
    }, defineProperty: function() {
      n(11);
    }, getPrototypeOf: function(n2) {
      return Object.getPrototypeOf(n2.u);
    }, setPrototypeOf: function() {
      n(12);
    } };
    var Z = {};
    e(Y, function(n2, r2) {
      Z[n2] = function() {
        return arguments[0] = arguments[0][0], r2.apply(this, arguments);
      };
    }), Z.deleteProperty = function(n2, r2) {
      return Z.set.call(this, n2, r2, void 0);
    }, Z.set = function(n2, r2, t2) {
      return Y.set.call(this, n2[0], r2, t2, n2[0]);
    };
    var nn = function() {
      function e2(r2) {
        var e3 = this;
        this.S = q, this.D = true, this.produce = function(r3, i3, u2) {
          if ("function" == typeof r3 && "function" != typeof i3) {
            var o2 = i3;
            i3 = r3;
            var f2 = e3;
            return function(n2) {
              var r4 = this;
              void 0 === n2 && (n2 = o2);
              for (var t2 = arguments.length, e4 = Array(t2 > 1 ? t2 - 1 : 0), u3 = 1; u3 < t2; u3++)
                e4[u3 - 1] = arguments[u3];
              return f2.produce(n2, function(n3) {
                var t3;
                return (t3 = i3).call.apply(t3, [r4, n3].concat(e4));
              });
            };
          }
          var a2;
          if ("function" != typeof i3 && n(6), void 0 !== u2 && "function" != typeof u2 && n(7), t(r3)) {
            var c2 = x(e3), v2 = k(e3, r3, void 0), s2 = true;
            try {
              a2 = i3(v2), s2 = false;
            } finally {
              s2 ? j(c2) : O(c2);
            }
            return "undefined" != typeof Promise && a2 instanceof Promise ? a2.then(function(n2) {
              return m(c2, u2), S(n2, c2);
            }, function(n2) {
              throw j(c2), n2;
            }) : (m(c2, u2), S(a2, c2));
          }
          if (!r3 || "object" != typeof r3) {
            if (void 0 === (a2 = i3(r3)) && (a2 = r3), a2 === B && (a2 = void 0), e3.D && l(a2, true), u2) {
              var p2 = [], d2 = [];
              y("Patches").M(r3, a2, p2, d2), u2(p2, d2);
            }
            return a2;
          }
          n(21, r3);
        }, this.produceWithPatches = function(n2, r3) {
          if ("function" == typeof n2)
            return function(r4) {
              for (var t3 = arguments.length, i4 = Array(t3 > 1 ? t3 - 1 : 0), u3 = 1; u3 < t3; u3++)
                i4[u3 - 1] = arguments[u3];
              return e3.produceWithPatches(r4, function(r5) {
                return n2.apply(void 0, [r5].concat(i4));
              });
            };
          var t2, i3, u2 = e3.produce(n2, r3, function(n3, r4) {
            t2 = n3, i3 = r4;
          });
          return "undefined" != typeof Promise && u2 instanceof Promise ? u2.then(function(n3) {
            return [n3, t2, i3];
          }) : [u2, t2, i3];
        }, "boolean" == typeof (null == r2 ? void 0 : r2.useProxies) && this.setUseProxies(r2.useProxies), "boolean" == typeof (null == r2 ? void 0 : r2.autoFreeze) && this.setAutoFreeze(r2.autoFreeze);
      }
      var i2 = e2.prototype;
      return i2.createDraft = function(e3) {
        t(e3) || n(8), r(e3) && (e3 = F(e3));
        var i3 = x(this), u2 = k(this, e3, void 0);
        return u2[H].C = true, O(i3), u2;
      }, i2.finishDraft = function(n2, r2) {
        var t2 = (n2 && n2[H]).A;
        return m(t2, r2), S(void 0, t2);
      }, i2.setAutoFreeze = function(n2) {
        this.D = n2;
      }, i2.setUseProxies = function(r2) {
        r2 && !q && n(20), this.S = r2;
      }, i2.applyPatches = function(n2, t2) {
        var e3;
        for (e3 = t2.length - 1; e3 >= 0; e3--) {
          var i3 = t2[e3];
          if (0 === i3.path.length && "replace" === i3.op) {
            n2 = i3.value;
            break;
          }
        }
        e3 > -1 && (t2 = t2.slice(e3 + 1));
        var u2 = y("Patches").W;
        return r(n2) ? u2(n2, t2) : this.produce(n2, function(n3) {
          return u2(n3, t2);
        });
      }, e2;
    }();
    var rn = new nn();
    var tn = rn.produce;
    var en = rn.produceWithPatches.bind(rn);
    var un = rn.setAutoFreeze.bind(rn);
    var on = rn.setUseProxies.bind(rn);
    var fn = rn.applyPatches.bind(rn);
    var an = rn.createDraft.bind(rn);
    var cn = rn.finishDraft.bind(rn);
    exports.Immer = nn, exports.applyPatches = fn, exports.castDraft = function(n2) {
      return n2;
    }, exports.castImmutable = function(n2) {
      return n2;
    }, exports.createDraft = an, exports.current = F, exports.default = tn, exports.enableAllPlugins = function() {
      D(), $(), K();
    }, exports.enableES5 = D, exports.enableMapSet = $, exports.enablePatches = K, exports.finishDraft = cn, exports.freeze = l, exports.immerable = G, exports.isDraft = r, exports.isDraftable = t, exports.nothing = B, exports.original = function(t2) {
      return r(t2) || n(23, t2), t2[H].u;
    }, exports.produce = tn, exports.produceWithPatches = en, exports.setAutoFreeze = un, exports.setUseProxies = on;
  }
});

// node_modules/immer/dist/immer.cjs.development.js
var require_immer_cjs_development = __commonJS({
  "node_modules/immer/dist/immer.cjs.development.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var _ref;
    var hasSymbol = typeof Symbol !== "undefined" && typeof /* @__PURE__ */ Symbol("x") === "symbol";
    var hasMap = typeof Map !== "undefined";
    var hasSet = typeof Set !== "undefined";
    var hasProxies = typeof Proxy !== "undefined" && typeof Proxy.revocable !== "undefined" && typeof Reflect !== "undefined";
    var NOTHING = hasSymbol ? /* @__PURE__ */ Symbol.for("immer-nothing") : (_ref = {}, _ref["immer-nothing"] = true, _ref);
    var DRAFTABLE = hasSymbol ? /* @__PURE__ */ Symbol.for("immer-draftable") : "__$immer_draftable";
    var DRAFT_STATE = hasSymbol ? /* @__PURE__ */ Symbol.for("immer-state") : "__$immer_state";
    var iteratorSymbol = typeof Symbol != "undefined" && Symbol.iterator || "@@iterator";
    var errors = {
      0: "Illegal state",
      1: "Immer drafts cannot have computed properties",
      2: "This object has been frozen and should not be mutated",
      3: function _(data) {
        return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
      },
      4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
      5: "Immer forbids circular references",
      6: "The first or second argument to `produce` must be a function",
      7: "The third argument to `produce` must be a function or undefined",
      8: "First argument to `createDraft` must be a plain object, an array, or an immerable object",
      9: "First argument to `finishDraft` must be a draft returned by `createDraft`",
      10: "The given draft is already finalized",
      11: "Object.defineProperty() cannot be used on an Immer draft",
      12: "Object.setPrototypeOf() cannot be used on an Immer draft",
      13: "Immer only supports deleting array indices",
      14: "Immer only supports setting array indices and the 'length' property",
      15: function _(path) {
        return "Cannot apply patch, path doesn't resolve: " + path;
      },
      16: 'Sets cannot have "replace" patches.',
      17: function _(op) {
        return "Unsupported patch operation: " + op;
      },
      18: function _(plugin) {
        return "The plugin for '" + plugin + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + plugin + "()` when initializing your application.";
      },
      20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",
      21: function _(thing) {
        return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + thing + "'";
      },
      22: function _(thing) {
        return "'current' expects a draft, got: " + thing;
      },
      23: function _(thing) {
        return "'original' expects a draft, got: " + thing;
      },
      24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
    };
    function die(error) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      {
        var e = errors[error];
        var msg = !e ? "unknown error nr: " + error : typeof e === "function" ? e.apply(null, args) : e;
        throw new Error("[Immer] " + msg);
      }
    }
    function isDraft(value) {
      return !!value && !!value[DRAFT_STATE];
    }
    function isDraftable(value) {
      var _value$constructor;
      if (!value)
        return false;
      return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor[DRAFTABLE]) || isMap(value) || isSet(value);
    }
    var objectCtorString = /* @__PURE__ */ Object.prototype.constructor.toString();
    function isPlainObject(value) {
      if (!value || typeof value !== "object")
        return false;
      var proto = Object.getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      var Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      if (Ctor === Object)
        return true;
      return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
    }
    function original(value) {
      if (!isDraft(value))
        die(23, value);
      return value[DRAFT_STATE].base_;
    }
    var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function(obj) {
      return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
    } : (
      /* istanbul ignore next */
      Object.getOwnPropertyNames
    );
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(target) {
      var res = {};
      ownKeys(target).forEach(function(key) {
        res[key] = Object.getOwnPropertyDescriptor(target, key);
      });
      return res;
    };
    function each(obj, iter, enumerableOnly) {
      if (enumerableOnly === void 0) {
        enumerableOnly = false;
      }
      if (getArchtype(obj) === 0) {
        (enumerableOnly ? Object.keys : ownKeys)(obj).forEach(function(key) {
          if (!enumerableOnly || typeof key !== "symbol")
            iter(key, obj[key], obj);
        });
      } else {
        obj.forEach(function(entry, index) {
          return iter(index, entry, obj);
        });
      }
    }
    function getArchtype(thing) {
      var state = thing[DRAFT_STATE];
      return state ? state.type_ > 3 ? state.type_ - 4 : state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
    }
    function has(thing, prop) {
      return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
    }
    function get(thing, prop) {
      return getArchtype(thing) === 2 ? thing.get(prop) : thing[prop];
    }
    function set(thing, propOrOldValue, value) {
      var t = getArchtype(thing);
      if (t === 2)
        thing.set(propOrOldValue, value);
      else if (t === 3) {
        thing.add(value);
      } else
        thing[propOrOldValue] = value;
    }
    function is(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }
    function isMap(target) {
      return hasMap && target instanceof Map;
    }
    function isSet(target) {
      return hasSet && target instanceof Set;
    }
    function latest(state) {
      return state.copy_ || state.base_;
    }
    function shallowCopy(base) {
      if (Array.isArray(base))
        return Array.prototype.slice.call(base);
      var descriptors = getOwnPropertyDescriptors(base);
      delete descriptors[DRAFT_STATE];
      var keys = ownKeys(descriptors);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var desc = descriptors[key];
        if (desc.writable === false) {
          desc.writable = true;
          desc.configurable = true;
        }
        if (desc.get || desc.set)
          descriptors[key] = {
            configurable: true,
            writable: true,
            enumerable: desc.enumerable,
            value: base[key]
          };
      }
      return Object.create(Object.getPrototypeOf(base), descriptors);
    }
    function freeze(obj, deep) {
      if (deep === void 0) {
        deep = false;
      }
      if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
        return obj;
      if (getArchtype(obj) > 1) {
        obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
      }
      Object.freeze(obj);
      if (deep)
        each(obj, function(key, value) {
          return freeze(value, true);
        }, true);
      return obj;
    }
    function dontMutateFrozenCollections() {
      die(2);
    }
    function isFrozen(obj) {
      if (obj == null || typeof obj !== "object")
        return true;
      return Object.isFrozen(obj);
    }
    var plugins = {};
    function getPlugin(pluginKey) {
      var plugin = plugins[pluginKey];
      if (!plugin) {
        die(18, pluginKey);
      }
      return plugin;
    }
    function loadPlugin(pluginKey, implementation) {
      if (!plugins[pluginKey])
        plugins[pluginKey] = implementation;
    }
    var currentScope;
    function getCurrentScope() {
      if (!currentScope)
        die(0);
      return currentScope;
    }
    function createScope(parent_, immer_) {
      return {
        drafts_: [],
        parent_,
        immer_,
        // Whenever the modified draft contains a draft from another scope, we
        // need to prevent auto-freezing so the unowned draft can be finalized.
        canAutoFreeze_: true,
        unfinalizedDrafts_: 0
      };
    }
    function usePatchesInScope(scope, patchListener) {
      if (patchListener) {
        getPlugin("Patches");
        scope.patches_ = [];
        scope.inversePatches_ = [];
        scope.patchListener_ = patchListener;
      }
    }
    function revokeScope(scope) {
      leaveScope(scope);
      scope.drafts_.forEach(revokeDraft);
      scope.drafts_ = null;
    }
    function leaveScope(scope) {
      if (scope === currentScope) {
        currentScope = scope.parent_;
      }
    }
    function enterScope(immer2) {
      return currentScope = createScope(currentScope, immer2);
    }
    function revokeDraft(draft) {
      var state = draft[DRAFT_STATE];
      if (state.type_ === 0 || state.type_ === 1)
        state.revoke_();
      else
        state.revoked_ = true;
    }
    function processResult(result, scope) {
      scope.unfinalizedDrafts_ = scope.drafts_.length;
      var baseDraft = scope.drafts_[0];
      var isReplaced = result !== void 0 && result !== baseDraft;
      if (!scope.immer_.useProxies_)
        getPlugin("ES5").willFinalizeES5_(scope, result, isReplaced);
      if (isReplaced) {
        if (baseDraft[DRAFT_STATE].modified_) {
          revokeScope(scope);
          die(4);
        }
        if (isDraftable(result)) {
          result = finalize(scope, result);
          if (!scope.parent_)
            maybeFreeze(scope, result);
        }
        if (scope.patches_) {
          getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope.patches_, scope.inversePatches_);
        }
      } else {
        result = finalize(scope, baseDraft, []);
      }
      revokeScope(scope);
      if (scope.patches_) {
        scope.patchListener_(scope.patches_, scope.inversePatches_);
      }
      return result !== NOTHING ? result : void 0;
    }
    function finalize(rootScope, value, path) {
      if (isFrozen(value))
        return value;
      var state = value[DRAFT_STATE];
      if (!state) {
        each(
          value,
          function(key, childValue) {
            return finalizeProperty(rootScope, state, value, key, childValue, path);
          },
          true
          // See #590, don't recurse into non-enumerable of non drafted objects
        );
        return value;
      }
      if (state.scope_ !== rootScope)
        return value;
      if (!state.modified_) {
        maybeFreeze(rootScope, state.base_, true);
        return state.base_;
      }
      if (!state.finalized_) {
        state.finalized_ = true;
        state.scope_.unfinalizedDrafts_--;
        var result = (
          // For ES5, create a good copy from the draft first, with added keys and without deleted keys.
          state.type_ === 4 || state.type_ === 5 ? state.copy_ = shallowCopy(state.draft_) : state.copy_
        );
        var resultEach = result;
        var isSet2 = false;
        if (state.type_ === 3) {
          resultEach = new Set(result);
          result.clear();
          isSet2 = true;
        }
        each(resultEach, function(key, childValue) {
          return finalizeProperty(rootScope, state, result, key, childValue, path, isSet2);
        });
        maybeFreeze(rootScope, result, false);
        if (path && rootScope.patches_) {
          getPlugin("Patches").generatePatches_(state, path, rootScope.patches_, rootScope.inversePatches_);
        }
      }
      return state.copy_;
    }
    function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
      if (childValue === targetObject)
        die(5);
      if (isDraft(childValue)) {
        var path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
        !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
        var res = finalize(rootScope, childValue, path);
        set(targetObject, prop, res);
        if (isDraft(res)) {
          rootScope.canAutoFreeze_ = false;
        } else
          return;
      } else if (targetIsSet) {
        targetObject.add(childValue);
      }
      if (isDraftable(childValue) && !isFrozen(childValue)) {
        if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
          return;
        }
        finalize(rootScope, childValue);
        if (!parentState || !parentState.scope_.parent_)
          maybeFreeze(rootScope, childValue);
      }
    }
    function maybeFreeze(scope, value, deep) {
      if (deep === void 0) {
        deep = false;
      }
      if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
        freeze(value, deep);
      }
    }
    function createProxyProxy(base, parent) {
      var isArray = Array.isArray(base);
      var state = {
        type_: isArray ? 1 : 0,
        // Track which produce call this is associated with.
        scope_: parent ? parent.scope_ : getCurrentScope(),
        // True for both shallow and deep changes.
        modified_: false,
        // Used during finalization.
        finalized_: false,
        // Track which properties have been assigned (true) or deleted (false).
        assigned_: {},
        // The parent draft state.
        parent_: parent,
        // The base state.
        base_: base,
        // The base proxy.
        draft_: null,
        // The base copy with any updated values.
        copy_: null,
        // Called by the `produce` function.
        revoke_: null,
        isManual_: false
      };
      var target = state;
      var traps = objectTraps;
      if (isArray) {
        target = [state];
        traps = arrayTraps;
      }
      var _Proxy$revocable = Proxy.revocable(target, traps), revoke = _Proxy$revocable.revoke, proxy = _Proxy$revocable.proxy;
      state.draft_ = proxy;
      state.revoke_ = revoke;
      return proxy;
    }
    var objectTraps = {
      get: function get2(state, prop) {
        if (prop === DRAFT_STATE)
          return state;
        var source = latest(state);
        if (!has(source, prop)) {
          return readPropFromProto(state, source, prop);
        }
        var value = source[prop];
        if (state.finalized_ || !isDraftable(value)) {
          return value;
        }
        if (value === peek(state.base_, prop)) {
          prepareCopy(state);
          return state.copy_[prop] = createProxy(state.scope_.immer_, value, state);
        }
        return value;
      },
      has: function has2(state, prop) {
        return prop in latest(state);
      },
      ownKeys: function ownKeys2(state) {
        return Reflect.ownKeys(latest(state));
      },
      set: function set2(state, prop, value) {
        var desc = getDescriptorFromProto(latest(state), prop);
        if (desc === null || desc === void 0 ? void 0 : desc.set) {
          desc.set.call(state.draft_, value);
          return true;
        }
        if (!state.modified_) {
          var current2 = peek(latest(state), prop);
          var currentState = current2 === null || current2 === void 0 ? void 0 : current2[DRAFT_STATE];
          if (currentState && currentState.base_ === value) {
            state.copy_[prop] = value;
            state.assigned_[prop] = false;
            return true;
          }
          if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
            return true;
          prepareCopy(state);
          markChanged(state);
        }
        if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
        (value !== void 0 || prop in state.copy_) || // special case: NaN
        Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
          return true;
        state.copy_[prop] = value;
        state.assigned_[prop] = true;
        return true;
      },
      deleteProperty: function deleteProperty(state, prop) {
        if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
          state.assigned_[prop] = false;
          prepareCopy(state);
          markChanged(state);
        } else {
          delete state.assigned_[prop];
        }
        if (state.copy_)
          delete state.copy_[prop];
        return true;
      },
      // Note: We never coerce `desc.value` into an Immer draft, because we can't make
      // the same guarantee in ES5 mode.
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(state, prop) {
        var owner = latest(state);
        var desc = Reflect.getOwnPropertyDescriptor(owner, prop);
        if (!desc)
          return desc;
        return {
          writable: true,
          configurable: state.type_ !== 1 || prop !== "length",
          enumerable: desc.enumerable,
          value: owner[prop]
        };
      },
      defineProperty: function defineProperty() {
        die(11);
      },
      getPrototypeOf: function getPrototypeOf(state) {
        return Object.getPrototypeOf(state.base_);
      },
      setPrototypeOf: function setPrototypeOf() {
        die(12);
      }
    };
    var arrayTraps = {};
    each(objectTraps, function(key, fn) {
      arrayTraps[key] = function() {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
      };
    });
    arrayTraps.deleteProperty = function(state, prop) {
      if (isNaN(parseInt(prop)))
        die(13);
      return arrayTraps.set.call(this, state, prop, void 0);
    };
    arrayTraps.set = function(state, prop, value) {
      if (prop !== "length" && isNaN(parseInt(prop)))
        die(14);
      return objectTraps.set.call(this, state[0], prop, value, state[0]);
    };
    function peek(draft, prop) {
      var state = draft[DRAFT_STATE];
      var source = state ? latest(state) : draft;
      return source[prop];
    }
    function readPropFromProto(state, source, prop) {
      var _desc$get;
      var desc = getDescriptorFromProto(source, prop);
      return desc ? "value" in desc ? desc.value : (
        // This is a very special case, if the prop is a getter defined by the
        // prototype, we should invoke it with the draft as context!
        (_desc$get = desc.get) === null || _desc$get === void 0 ? void 0 : _desc$get.call(state.draft_)
      ) : void 0;
    }
    function getDescriptorFromProto(source, prop) {
      if (!(prop in source))
        return void 0;
      var proto = Object.getPrototypeOf(source);
      while (proto) {
        var desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc)
          return desc;
        proto = Object.getPrototypeOf(proto);
      }
      return void 0;
    }
    function markChanged(state) {
      if (!state.modified_) {
        state.modified_ = true;
        if (state.parent_) {
          markChanged(state.parent_);
        }
      }
    }
    function prepareCopy(state) {
      if (!state.copy_) {
        state.copy_ = shallowCopy(state.base_);
      }
    }
    var Immer = /* @__PURE__ */ function() {
      function Immer2(config) {
        var _this = this;
        this.useProxies_ = hasProxies;
        this.autoFreeze_ = true;
        this.produce = function(base, recipe, patchListener) {
          if (typeof base === "function" && typeof recipe !== "function") {
            var defaultBase = recipe;
            recipe = base;
            var self = _this;
            return function curriedProduce(base2) {
              var _this2 = this;
              if (base2 === void 0) {
                base2 = defaultBase;
              }
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              return self.produce(base2, function(draft) {
                var _recipe;
                return (_recipe = recipe).call.apply(_recipe, [_this2, draft].concat(args));
              });
            };
          }
          if (typeof recipe !== "function")
            die(6);
          if (patchListener !== void 0 && typeof patchListener !== "function")
            die(7);
          var result;
          if (isDraftable(base)) {
            var scope = enterScope(_this);
            var proxy = createProxy(_this, base, void 0);
            var hasError = true;
            try {
              result = recipe(proxy);
              hasError = false;
            } finally {
              if (hasError)
                revokeScope(scope);
              else
                leaveScope(scope);
            }
            if (typeof Promise !== "undefined" && result instanceof Promise) {
              return result.then(function(result2) {
                usePatchesInScope(scope, patchListener);
                return processResult(result2, scope);
              }, function(error) {
                revokeScope(scope);
                throw error;
              });
            }
            usePatchesInScope(scope, patchListener);
            return processResult(result, scope);
          } else if (!base || typeof base !== "object") {
            result = recipe(base);
            if (result === void 0)
              result = base;
            if (result === NOTHING)
              result = void 0;
            if (_this.autoFreeze_)
              freeze(result, true);
            if (patchListener) {
              var p = [];
              var ip = [];
              getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
              patchListener(p, ip);
            }
            return result;
          } else
            die(21, base);
        };
        this.produceWithPatches = function(base, recipe) {
          if (typeof base === "function") {
            return function(state) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              return _this.produceWithPatches(state, function(draft) {
                return base.apply(void 0, [draft].concat(args));
              });
            };
          }
          var patches, inversePatches;
          var result = _this.produce(base, recipe, function(p, ip) {
            patches = p;
            inversePatches = ip;
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then(function(nextState) {
              return [nextState, patches, inversePatches];
            });
          }
          return [result, patches, inversePatches];
        };
        if (typeof (config === null || config === void 0 ? void 0 : config.useProxies) === "boolean")
          this.setUseProxies(config.useProxies);
        if (typeof (config === null || config === void 0 ? void 0 : config.autoFreeze) === "boolean")
          this.setAutoFreeze(config.autoFreeze);
      }
      var _proto = Immer2.prototype;
      _proto.createDraft = function createDraft2(base) {
        if (!isDraftable(base))
          die(8);
        if (isDraft(base))
          base = current(base);
        var scope = enterScope(this);
        var proxy = createProxy(this, base, void 0);
        proxy[DRAFT_STATE].isManual_ = true;
        leaveScope(scope);
        return proxy;
      };
      _proto.finishDraft = function finishDraft2(draft, patchListener) {
        var state = draft && draft[DRAFT_STATE];
        {
          if (!state || !state.isManual_)
            die(9);
          if (state.finalized_)
            die(10);
        }
        var scope = state.scope_;
        usePatchesInScope(scope, patchListener);
        return processResult(void 0, scope);
      };
      _proto.setAutoFreeze = function setAutoFreeze2(value) {
        this.autoFreeze_ = value;
      };
      _proto.setUseProxies = function setUseProxies2(value) {
        if (value && !hasProxies) {
          die(20);
        }
        this.useProxies_ = value;
      };
      _proto.applyPatches = function applyPatches2(base, patches) {
        var i;
        for (i = patches.length - 1; i >= 0; i--) {
          var patch = patches[i];
          if (patch.path.length === 0 && patch.op === "replace") {
            base = patch.value;
            break;
          }
        }
        if (i > -1) {
          patches = patches.slice(i + 1);
        }
        var applyPatchesImpl = getPlugin("Patches").applyPatches_;
        if (isDraft(base)) {
          return applyPatchesImpl(base, patches);
        }
        return this.produce(base, function(draft) {
          return applyPatchesImpl(draft, patches);
        });
      };
      return Immer2;
    }();
    function createProxy(immer2, value, parent) {
      var draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : immer2.useProxies_ ? createProxyProxy(value, parent) : getPlugin("ES5").createES5Proxy_(value, parent);
      var scope = parent ? parent.scope_ : getCurrentScope();
      scope.drafts_.push(draft);
      return draft;
    }
    function current(value) {
      if (!isDraft(value))
        die(22, value);
      return currentImpl(value);
    }
    function currentImpl(value) {
      if (!isDraftable(value))
        return value;
      var state = value[DRAFT_STATE];
      var copy;
      var archType = getArchtype(value);
      if (state) {
        if (!state.modified_ && (state.type_ < 4 || !getPlugin("ES5").hasChanges_(state)))
          return state.base_;
        state.finalized_ = true;
        copy = copyHelper(value, archType);
        state.finalized_ = false;
      } else {
        copy = copyHelper(value, archType);
      }
      each(copy, function(key, childValue) {
        if (state && get(state.base_, key) === childValue)
          return;
        set(copy, key, currentImpl(childValue));
      });
      return archType === 3 ? new Set(copy) : copy;
    }
    function copyHelper(value, archType) {
      switch (archType) {
        case 2:
          return new Map(value);
        case 3:
          return Array.from(value);
      }
      return shallowCopy(value);
    }
    function enableES5() {
      function willFinalizeES5_(scope, result, isReplaced) {
        if (!isReplaced) {
          if (scope.patches_) {
            markChangesRecursively(scope.drafts_[0]);
          }
          markChangesSweep(scope.drafts_);
        } else if (isDraft(result) && result[DRAFT_STATE].scope_ === scope) {
          markChangesSweep(scope.drafts_);
        }
      }
      function createES5Draft(isArray, base) {
        if (isArray) {
          var draft = new Array(base.length);
          for (var i = 0; i < base.length; i++) {
            Object.defineProperty(draft, "" + i, proxyProperty(i, true));
          }
          return draft;
        } else {
          var _descriptors = getOwnPropertyDescriptors(base);
          delete _descriptors[DRAFT_STATE];
          var keys = ownKeys(_descriptors);
          for (var _i = 0; _i < keys.length; _i++) {
            var key = keys[_i];
            _descriptors[key] = proxyProperty(key, isArray || !!_descriptors[key].enumerable);
          }
          return Object.create(Object.getPrototypeOf(base), _descriptors);
        }
      }
      function createES5Proxy_(base, parent) {
        var isArray = Array.isArray(base);
        var draft = createES5Draft(isArray, base);
        var state = {
          type_: isArray ? 5 : 4,
          scope_: parent ? parent.scope_ : getCurrentScope(),
          modified_: false,
          finalized_: false,
          assigned_: {},
          parent_: parent,
          // base is the object we are drafting
          base_: base,
          // draft is the draft object itself, that traps all reads and reads from either the base (if unmodified) or copy (if modified)
          draft_: draft,
          copy_: null,
          revoked_: false,
          isManual_: false
        };
        Object.defineProperty(draft, DRAFT_STATE, {
          value: state,
          // enumerable: false <- the default
          writable: true
        });
        return draft;
      }
      var descriptors = {};
      function proxyProperty(prop, enumerable) {
        var desc = descriptors[prop];
        if (desc) {
          desc.enumerable = enumerable;
        } else {
          descriptors[prop] = desc = {
            configurable: true,
            enumerable,
            get: function get2() {
              var state = this[DRAFT_STATE];
              assertUnrevoked(state);
              return objectTraps.get(state, prop);
            },
            set: function set2(value) {
              var state = this[DRAFT_STATE];
              assertUnrevoked(state);
              objectTraps.set(state, prop, value);
            }
          };
        }
        return desc;
      }
      function markChangesSweep(drafts) {
        for (var i = drafts.length - 1; i >= 0; i--) {
          var state = drafts[i][DRAFT_STATE];
          if (!state.modified_) {
            switch (state.type_) {
              case 5:
                if (hasArrayChanges(state))
                  markChanged(state);
                break;
              case 4:
                if (hasObjectChanges(state))
                  markChanged(state);
                break;
            }
          }
        }
      }
      function markChangesRecursively(object) {
        if (!object || typeof object !== "object")
          return;
        var state = object[DRAFT_STATE];
        if (!state)
          return;
        var base_ = state.base_, draft_ = state.draft_, assigned_ = state.assigned_, type_ = state.type_;
        if (type_ === 4) {
          each(draft_, function(key) {
            if (key === DRAFT_STATE)
              return;
            if (base_[key] === void 0 && !has(base_, key)) {
              assigned_[key] = true;
              markChanged(state);
            } else if (!assigned_[key]) {
              markChangesRecursively(draft_[key]);
            }
          });
          each(base_, function(key) {
            if (draft_[key] === void 0 && !has(draft_, key)) {
              assigned_[key] = false;
              markChanged(state);
            }
          });
        } else if (type_ === 5) {
          if (hasArrayChanges(state)) {
            markChanged(state);
            assigned_.length = true;
          }
          if (draft_.length < base_.length) {
            for (var i = draft_.length; i < base_.length; i++) {
              assigned_[i] = false;
            }
          } else {
            for (var _i2 = base_.length; _i2 < draft_.length; _i2++) {
              assigned_[_i2] = true;
            }
          }
          var min = Math.min(draft_.length, base_.length);
          for (var _i3 = 0; _i3 < min; _i3++) {
            if (!draft_.hasOwnProperty(_i3)) {
              assigned_[_i3] = true;
            }
            if (assigned_[_i3] === void 0)
              markChangesRecursively(draft_[_i3]);
          }
        }
      }
      function hasObjectChanges(state) {
        var base_ = state.base_, draft_ = state.draft_;
        var keys = ownKeys(draft_);
        for (var i = keys.length - 1; i >= 0; i--) {
          var key = keys[i];
          if (key === DRAFT_STATE)
            continue;
          var baseValue = base_[key];
          if (baseValue === void 0 && !has(base_, key)) {
            return true;
          } else {
            var value = draft_[key];
            var _state = value && value[DRAFT_STATE];
            if (_state ? _state.base_ !== baseValue : !is(value, baseValue)) {
              return true;
            }
          }
        }
        var baseIsDraft = !!base_[DRAFT_STATE];
        return keys.length !== ownKeys(base_).length + (baseIsDraft ? 0 : 1);
      }
      function hasArrayChanges(state) {
        var draft_ = state.draft_;
        if (draft_.length !== state.base_.length)
          return true;
        var descriptor = Object.getOwnPropertyDescriptor(draft_, draft_.length - 1);
        if (descriptor && !descriptor.get)
          return true;
        for (var i = 0; i < draft_.length; i++) {
          if (!draft_.hasOwnProperty(i))
            return true;
        }
        return false;
      }
      function hasChanges_(state) {
        return state.type_ === 4 ? hasObjectChanges(state) : hasArrayChanges(state);
      }
      function assertUnrevoked(state) {
        if (state.revoked_)
          die(3, JSON.stringify(latest(state)));
      }
      loadPlugin("ES5", {
        createES5Proxy_,
        willFinalizeES5_,
        hasChanges_
      });
    }
    function enablePatches() {
      var REPLACE = "replace";
      var ADD = "add";
      var REMOVE = "remove";
      function generatePatches_(state, basePath, patches, inversePatches) {
        switch (state.type_) {
          case 0:
          case 4:
          case 2:
            return generatePatchesFromAssigned(state, basePath, patches, inversePatches);
          case 5:
          case 1:
            return generateArrayPatches(state, basePath, patches, inversePatches);
          case 3:
            return generateSetPatches(state, basePath, patches, inversePatches);
        }
      }
      function generateArrayPatches(state, basePath, patches, inversePatches) {
        var base_ = state.base_, assigned_ = state.assigned_;
        var copy_ = state.copy_;
        if (copy_.length < base_.length) {
          var _ref2 = [copy_, base_];
          base_ = _ref2[0];
          copy_ = _ref2[1];
          var _ref22 = [inversePatches, patches];
          patches = _ref22[0];
          inversePatches = _ref22[1];
        }
        for (var i = 0; i < base_.length; i++) {
          if (assigned_[i] && copy_[i] !== base_[i]) {
            var path = basePath.concat([i]);
            patches.push({
              op: REPLACE,
              path,
              // Need to maybe clone it, as it can in fact be the original value
              // due to the base/copy inversion at the start of this function
              value: clonePatchValueIfNeeded(copy_[i])
            });
            inversePatches.push({
              op: REPLACE,
              path,
              value: clonePatchValueIfNeeded(base_[i])
            });
          }
        }
        for (var _i = base_.length; _i < copy_.length; _i++) {
          var _path = basePath.concat([_i]);
          patches.push({
            op: ADD,
            path: _path,
            // Need to maybe clone it, as it can in fact be the original value
            // due to the base/copy inversion at the start of this function
            value: clonePatchValueIfNeeded(copy_[_i])
          });
        }
        if (base_.length < copy_.length) {
          inversePatches.push({
            op: REPLACE,
            path: basePath.concat(["length"]),
            value: base_.length
          });
        }
      }
      function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
        var base_ = state.base_, copy_ = state.copy_;
        each(state.assigned_, function(key, assignedValue) {
          var origValue = get(base_, key);
          var value = get(copy_, key);
          var op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD;
          if (origValue === value && op === REPLACE)
            return;
          var path = basePath.concat(key);
          patches.push(op === REMOVE ? {
            op,
            path
          } : {
            op,
            path,
            value
          });
          inversePatches.push(op === ADD ? {
            op: REMOVE,
            path
          } : op === REMOVE ? {
            op: ADD,
            path,
            value: clonePatchValueIfNeeded(origValue)
          } : {
            op: REPLACE,
            path,
            value: clonePatchValueIfNeeded(origValue)
          });
        });
      }
      function generateSetPatches(state, basePath, patches, inversePatches) {
        var base_ = state.base_, copy_ = state.copy_;
        var i = 0;
        base_.forEach(function(value) {
          if (!copy_.has(value)) {
            var path = basePath.concat([i]);
            patches.push({
              op: REMOVE,
              path,
              value
            });
            inversePatches.unshift({
              op: ADD,
              path,
              value
            });
          }
          i++;
        });
        i = 0;
        copy_.forEach(function(value) {
          if (!base_.has(value)) {
            var path = basePath.concat([i]);
            patches.push({
              op: ADD,
              path,
              value
            });
            inversePatches.unshift({
              op: REMOVE,
              path,
              value
            });
          }
          i++;
        });
      }
      function generateReplacementPatches_(baseValue, replacement, patches, inversePatches) {
        patches.push({
          op: REPLACE,
          path: [],
          value: replacement === NOTHING ? void 0 : replacement
        });
        inversePatches.push({
          op: REPLACE,
          path: [],
          value: baseValue
        });
      }
      function applyPatches_(draft, patches) {
        patches.forEach(function(patch) {
          var path = patch.path, op = patch.op;
          var base = draft;
          for (var i = 0; i < path.length - 1; i++) {
            var parentType = getArchtype(base);
            var p = path[i];
            if (typeof p !== "string" && typeof p !== "number") {
              p = "" + p;
            }
            if ((parentType === 0 || parentType === 1) && (p === "__proto__" || p === "constructor"))
              die(24);
            if (typeof base === "function" && p === "prototype")
              die(24);
            base = get(base, p);
            if (typeof base !== "object")
              die(15, path.join("/"));
          }
          var type = getArchtype(base);
          var value = deepClonePatchValue(patch.value);
          var key = path[path.length - 1];
          switch (op) {
            case REPLACE:
              switch (type) {
                case 2:
                  return base.set(key, value);
                case 3:
                  die(16);
                default:
                  return base[key] = value;
              }
            case ADD:
              switch (type) {
                case 1:
                  return key === "-" ? base.push(value) : base.splice(key, 0, value);
                case 2:
                  return base.set(key, value);
                case 3:
                  return base.add(value);
                default:
                  return base[key] = value;
              }
            case REMOVE:
              switch (type) {
                case 1:
                  return base.splice(key, 1);
                case 2:
                  return base.delete(key);
                case 3:
                  return base.delete(patch.value);
                default:
                  return delete base[key];
              }
            default:
              die(17, op);
          }
        });
        return draft;
      }
      function deepClonePatchValue(obj) {
        if (!isDraftable(obj))
          return obj;
        if (Array.isArray(obj))
          return obj.map(deepClonePatchValue);
        if (isMap(obj))
          return new Map(Array.from(obj.entries()).map(function(_ref3) {
            var k = _ref3[0], v = _ref3[1];
            return [k, deepClonePatchValue(v)];
          }));
        if (isSet(obj))
          return new Set(Array.from(obj).map(deepClonePatchValue));
        var cloned = Object.create(Object.getPrototypeOf(obj));
        for (var key in obj) {
          cloned[key] = deepClonePatchValue(obj[key]);
        }
        if (has(obj, DRAFTABLE))
          cloned[DRAFTABLE] = obj[DRAFTABLE];
        return cloned;
      }
      function clonePatchValueIfNeeded(obj) {
        if (isDraft(obj)) {
          return deepClonePatchValue(obj);
        } else
          return obj;
      }
      loadPlugin("Patches", {
        applyPatches_,
        generatePatches_,
        generateReplacementPatches_
      });
    }
    function enableMapSet() {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) {
            if (b2.hasOwnProperty(p))
              d2[p] = b2[p];
          }
        };
        return _extendStatics(d, b);
      };
      function __extends(d, b) {
        _extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = // @ts-ignore
        (__.prototype = b.prototype, new __());
      }
      var DraftMap = function(_super) {
        __extends(DraftMap2, _super);
        function DraftMap2(target, parent) {
          this[DRAFT_STATE] = {
            type_: 2,
            parent_: parent,
            scope_: parent ? parent.scope_ : getCurrentScope(),
            modified_: false,
            finalized_: false,
            copy_: void 0,
            assigned_: void 0,
            base_: target,
            draft_: this,
            isManual_: false,
            revoked_: false
          };
          return this;
        }
        var p = DraftMap2.prototype;
        Object.defineProperty(p, "size", {
          get: function get2() {
            return latest(this[DRAFT_STATE]).size;
          }
          // enumerable: false,
          // configurable: true
        });
        p.has = function(key) {
          return latest(this[DRAFT_STATE]).has(key);
        };
        p.set = function(key, value) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (!latest(state).has(key) || latest(state).get(key) !== value) {
            prepareMapCopy(state);
            markChanged(state);
            state.assigned_.set(key, true);
            state.copy_.set(key, value);
            state.assigned_.set(key, true);
          }
          return this;
        };
        p.delete = function(key) {
          if (!this.has(key)) {
            return false;
          }
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareMapCopy(state);
          markChanged(state);
          if (state.base_.has(key)) {
            state.assigned_.set(key, false);
          } else {
            state.assigned_.delete(key);
          }
          state.copy_.delete(key);
          return true;
        };
        p.clear = function() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (latest(state).size) {
            prepareMapCopy(state);
            markChanged(state);
            state.assigned_ = /* @__PURE__ */ new Map();
            each(state.base_, function(key) {
              state.assigned_.set(key, false);
            });
            state.copy_.clear();
          }
        };
        p.forEach = function(cb, thisArg) {
          var _this = this;
          var state = this[DRAFT_STATE];
          latest(state).forEach(function(_value, key, _map) {
            cb.call(thisArg, _this.get(key), key, _this);
          });
        };
        p.get = function(key) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          var value = latest(state).get(key);
          if (state.finalized_ || !isDraftable(value)) {
            return value;
          }
          if (value !== state.base_.get(key)) {
            return value;
          }
          var draft = createProxy(state.scope_.immer_, value, state);
          prepareMapCopy(state);
          state.copy_.set(key, draft);
          return draft;
        };
        p.keys = function() {
          return latest(this[DRAFT_STATE]).keys();
        };
        p.values = function() {
          var _this2 = this, _ref2;
          var iterator = this.keys();
          return _ref2 = {}, _ref2[iteratorSymbol] = function() {
            return _this2.values();
          }, _ref2.next = function next() {
            var r = iterator.next();
            if (r.done)
              return r;
            var value = _this2.get(r.value);
            return {
              done: false,
              value
            };
          }, _ref2;
        };
        p.entries = function() {
          var _this3 = this, _ref2;
          var iterator = this.keys();
          return _ref2 = {}, _ref2[iteratorSymbol] = function() {
            return _this3.entries();
          }, _ref2.next = function next() {
            var r = iterator.next();
            if (r.done)
              return r;
            var value = _this3.get(r.value);
            return {
              done: false,
              value: [r.value, value]
            };
          }, _ref2;
        };
        p[iteratorSymbol] = function() {
          return this.entries();
        };
        return DraftMap2;
      }(Map);
      function proxyMap_(target, parent) {
        return new DraftMap(target, parent);
      }
      function prepareMapCopy(state) {
        if (!state.copy_) {
          state.assigned_ = /* @__PURE__ */ new Map();
          state.copy_ = new Map(state.base_);
        }
      }
      var DraftSet = function(_super) {
        __extends(DraftSet2, _super);
        function DraftSet2(target, parent) {
          this[DRAFT_STATE] = {
            type_: 3,
            parent_: parent,
            scope_: parent ? parent.scope_ : getCurrentScope(),
            modified_: false,
            finalized_: false,
            copy_: void 0,
            base_: target,
            draft_: this,
            drafts_: /* @__PURE__ */ new Map(),
            revoked_: false,
            isManual_: false
          };
          return this;
        }
        var p = DraftSet2.prototype;
        Object.defineProperty(p, "size", {
          get: function get2() {
            return latest(this[DRAFT_STATE]).size;
          }
          // enumerable: true,
        });
        p.has = function(value) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (!state.copy_) {
            return state.base_.has(value);
          }
          if (state.copy_.has(value))
            return true;
          if (state.drafts_.has(value) && state.copy_.has(state.drafts_.get(value)))
            return true;
          return false;
        };
        p.add = function(value) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (!this.has(value)) {
            prepareSetCopy(state);
            markChanged(state);
            state.copy_.add(value);
          }
          return this;
        };
        p.delete = function(value) {
          if (!this.has(value)) {
            return false;
          }
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareSetCopy(state);
          markChanged(state);
          return state.copy_.delete(value) || (state.drafts_.has(value) ? state.copy_.delete(state.drafts_.get(value)) : (
            /* istanbul ignore next */
            false
          ));
        };
        p.clear = function() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (latest(state).size) {
            prepareSetCopy(state);
            markChanged(state);
            state.copy_.clear();
          }
        };
        p.values = function() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareSetCopy(state);
          return state.copy_.values();
        };
        p.entries = function entries() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareSetCopy(state);
          return state.copy_.entries();
        };
        p.keys = function() {
          return this.values();
        };
        p[iteratorSymbol] = function() {
          return this.values();
        };
        p.forEach = function forEach(cb, thisArg) {
          var iterator = this.values();
          var result = iterator.next();
          while (!result.done) {
            cb.call(thisArg, result.value, result.value, this);
            result = iterator.next();
          }
        };
        return DraftSet2;
      }(Set);
      function proxySet_(target, parent) {
        return new DraftSet(target, parent);
      }
      function prepareSetCopy(state) {
        if (!state.copy_) {
          state.copy_ = /* @__PURE__ */ new Set();
          state.base_.forEach(function(value) {
            if (isDraftable(value)) {
              var draft = createProxy(state.scope_.immer_, value, state);
              state.drafts_.set(value, draft);
              state.copy_.add(draft);
            } else {
              state.copy_.add(value);
            }
          });
        }
      }
      function assertUnrevoked(state) {
        if (state.revoked_)
          die(3, JSON.stringify(latest(state)));
      }
      loadPlugin("MapSet", {
        proxyMap_,
        proxySet_
      });
    }
    function enableAllPlugins() {
      enableES5();
      enableMapSet();
      enablePatches();
    }
    var immer = /* @__PURE__ */ new Immer();
    var produce = immer.produce;
    var produceWithPatches = /* @__PURE__ */ immer.produceWithPatches.bind(immer);
    var setAutoFreeze = /* @__PURE__ */ immer.setAutoFreeze.bind(immer);
    var setUseProxies = /* @__PURE__ */ immer.setUseProxies.bind(immer);
    var applyPatches = /* @__PURE__ */ immer.applyPatches.bind(immer);
    var createDraft = /* @__PURE__ */ immer.createDraft.bind(immer);
    var finishDraft = /* @__PURE__ */ immer.finishDraft.bind(immer);
    function castDraft(value) {
      return value;
    }
    function castImmutable(value) {
      return value;
    }
    exports.Immer = Immer;
    exports.applyPatches = applyPatches;
    exports.castDraft = castDraft;
    exports.castImmutable = castImmutable;
    exports.createDraft = createDraft;
    exports.current = current;
    exports.default = produce;
    exports.enableAllPlugins = enableAllPlugins;
    exports.enableES5 = enableES5;
    exports.enableMapSet = enableMapSet;
    exports.enablePatches = enablePatches;
    exports.finishDraft = finishDraft;
    exports.freeze = freeze;
    exports.immerable = DRAFTABLE;
    exports.isDraft = isDraft;
    exports.isDraftable = isDraftable;
    exports.nothing = NOTHING;
    exports.original = original;
    exports.produce = produce;
    exports.produceWithPatches = produceWithPatches;
    exports.setAutoFreeze = setAutoFreeze;
    exports.setUseProxies = setUseProxies;
  }
});

// node_modules/immer/dist/index.js
var require_dist = __commonJS({
  "node_modules/immer/dist/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    if (process.env.NODE_ENV === "production") {
      module.exports = require_immer_cjs_production_min();
    } else {
      module.exports = require_immer_cjs_development();
    }
  }
});

// node_modules/@babel/runtime/helpers/typeof.js
var require_typeof = __commonJS({
  "node_modules/@babel/runtime/helpers/typeof.js"(exports, module) {
    init_cjs_shim();
    function _typeof(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
    }
    module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/toPrimitive.js
var require_toPrimitive = __commonJS({
  "node_modules/@babel/runtime/helpers/toPrimitive.js"(exports, module) {
    init_cjs_shim();
    var _typeof = require_typeof()["default"];
    function toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t)
        return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i))
          return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/toPropertyKey.js
var require_toPropertyKey = __commonJS({
  "node_modules/@babel/runtime/helpers/toPropertyKey.js"(exports, module) {
    init_cjs_shim();
    var _typeof = require_typeof()["default"];
    var toPrimitive = require_toPrimitive();
    function toPropertyKey(t) {
      var i = toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/defineProperty.js
var require_defineProperty = __commonJS({
  "node_modules/@babel/runtime/helpers/defineProperty.js"(exports, module) {
    init_cjs_shim();
    var toPropertyKey = require_toPropertyKey();
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/objectSpread2.js
var require_objectSpread2 = __commonJS({
  "node_modules/@babel/runtime/helpers/objectSpread2.js"(exports, module) {
    init_cjs_shim();
    var defineProperty = require_defineProperty();
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/redux/lib/redux.js
var require_redux = __commonJS({
  "node_modules/redux/lib/redux.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var _objectSpread = require_objectSpread2();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var _objectSpread__default = /* @__PURE__ */ _interopDefaultLegacy(_objectSpread);
    function formatProdErrorMessage(code) {
      return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or use the non-minified dev environment for full errors. ";
    }
    var $$observable = function() {
      return typeof Symbol === "function" && Symbol.observable || "@@observable";
    }();
    var randomString = function randomString2() {
      return Math.random().toString(36).substring(7).split("").join(".");
    };
    var ActionTypes = {
      INIT: "@@redux/INIT" + randomString(),
      REPLACE: "@@redux/REPLACE" + randomString(),
      PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
        return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
      }
    };
    function isPlainObject(obj) {
      if (typeof obj !== "object" || obj === null)
        return false;
      var proto = obj;
      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }
      return Object.getPrototypeOf(obj) === proto;
    }
    function miniKindOf(val) {
      if (val === void 0)
        return "undefined";
      if (val === null)
        return "null";
      var type = typeof val;
      switch (type) {
        case "boolean":
        case "string":
        case "number":
        case "symbol":
        case "function": {
          return type;
        }
      }
      if (Array.isArray(val))
        return "array";
      if (isDate(val))
        return "date";
      if (isError(val))
        return "error";
      var constructorName = ctorName(val);
      switch (constructorName) {
        case "Symbol":
        case "Promise":
        case "WeakMap":
        case "WeakSet":
        case "Map":
        case "Set":
          return constructorName;
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    }
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
      if (val instanceof Date)
        return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function kindOf(val) {
      var typeOfVal = typeof val;
      if (process.env.NODE_ENV !== "production") {
        typeOfVal = miniKindOf(val);
      }
      return typeOfVal;
    }
    function createStore2(reducer, preloadedState, enhancer) {
      var _ref2;
      if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
      }
      if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
        enhancer = preloadedState;
        preloadedState = void 0;
      }
      if (typeof enhancer !== "undefined") {
        if (typeof enhancer !== "function") {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
        }
        return enhancer(createStore2)(reducer, preloadedState);
      }
      if (typeof reducer !== "function") {
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
      }
      var currentReducer = reducer;
      var currentState = preloadedState;
      var currentListeners = [];
      var nextListeners = currentListeners;
      var isDispatching = false;
      function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }
      }
      function getState() {
        if (isDispatching) {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
        }
        return currentState;
      }
      function subscribe(listener) {
        if (typeof listener !== "function") {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
        }
        if (isDispatching) {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
        }
        var isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
          if (!isSubscribed) {
            return;
          }
          if (isDispatching) {
            throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
          }
          isSubscribed = false;
          ensureCanMutateNextListeners();
          var index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
          currentListeners = null;
        };
      }
      function dispatch(action) {
        if (!isPlainObject(action)) {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
        }
        if (typeof action.type === "undefined") {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
        }
        if (isDispatching) {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
        }
        try {
          isDispatching = true;
          currentState = currentReducer(currentState, action);
        } finally {
          isDispatching = false;
        }
        var listeners = currentListeners = nextListeners;
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener();
        }
        return action;
      }
      function replaceReducer(nextReducer) {
        if (typeof nextReducer !== "function") {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
        }
        currentReducer = nextReducer;
        dispatch({
          type: ActionTypes.REPLACE
        });
      }
      function observable() {
        var _ref;
        var outerSubscribe = subscribe;
        return _ref = {
          /**
           * The minimal observable subscription method.
           * @param {Object} observer Any object that can be used as an observer.
           * The observer object should have a `next` method.
           * @returns {subscription} An object with an `unsubscribe` method that can
           * be used to unsubscribe the observable from the store, and prevent further
           * emission of values from the observable.
           */
          subscribe: function subscribe2(observer) {
            if (typeof observer !== "object" || observer === null) {
              throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
            }
            function observeState() {
              if (observer.next) {
                observer.next(getState());
              }
            }
            observeState();
            var unsubscribe = outerSubscribe(observeState);
            return {
              unsubscribe
            };
          }
        }, _ref[$$observable] = function() {
          return this;
        }, _ref;
      }
      dispatch({
        type: ActionTypes.INIT
      });
      return _ref2 = {
        dispatch,
        subscribe,
        getState,
        replaceReducer
      }, _ref2[$$observable] = observable, _ref2;
    }
    var legacy_createStore = createStore2;
    function warning(message) {
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error(message);
      }
      try {
        throw new Error(message);
      } catch (e) {
      }
    }
    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
      var reducerKeys = Object.keys(reducers);
      var argumentName = action && action.type === ActionTypes.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
      if (reducerKeys.length === 0) {
        return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
      }
      if (!isPlainObject(inputState)) {
        return "The " + argumentName + ' has unexpected type of "' + kindOf(inputState) + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
      }
      var unexpectedKeys = Object.keys(inputState).filter(function(key) {
        return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
      });
      unexpectedKeys.forEach(function(key) {
        unexpectedKeyCache[key] = true;
      });
      if (action && action.type === ActionTypes.REPLACE)
        return;
      if (unexpectedKeys.length > 0) {
        return "Unexpected " + (unexpectedKeys.length > 1 ? "keys" : "key") + " " + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
      }
    }
    function assertReducerShape(reducers) {
      Object.keys(reducers).forEach(function(key) {
        var reducer = reducers[key];
        var initialState2 = reducer(void 0, {
          type: ActionTypes.INIT
        });
        if (typeof initialState2 === "undefined") {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(12) : 'The slice reducer for key "' + key + `" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
        }
        if (typeof reducer(void 0, {
          type: ActionTypes.PROBE_UNKNOWN_ACTION()
        }) === "undefined") {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(13) : 'The slice reducer for key "' + key + '" returned undefined when probed with a random type. ' + ("Don't try to handle '" + ActionTypes.INIT + `' or other actions in "redux/*" `) + "namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.");
        }
      });
    }
    function combineReducers(reducers) {
      var reducerKeys = Object.keys(reducers);
      var finalReducers = {};
      for (var i = 0; i < reducerKeys.length; i++) {
        var key = reducerKeys[i];
        if (process.env.NODE_ENV !== "production") {
          if (typeof reducers[key] === "undefined") {
            warning('No reducer provided for key "' + key + '"');
          }
        }
        if (typeof reducers[key] === "function") {
          finalReducers[key] = reducers[key];
        }
      }
      var finalReducerKeys = Object.keys(finalReducers);
      var unexpectedKeyCache;
      if (process.env.NODE_ENV !== "production") {
        unexpectedKeyCache = {};
      }
      var shapeAssertionError;
      try {
        assertReducerShape(finalReducers);
      } catch (e) {
        shapeAssertionError = e;
      }
      return function combination(state, action) {
        if (state === void 0) {
          state = {};
        }
        if (shapeAssertionError) {
          throw shapeAssertionError;
        }
        if (process.env.NODE_ENV !== "production") {
          var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
          if (warningMessage) {
            warning(warningMessage);
          }
        }
        var hasChanged = false;
        var nextState = {};
        for (var _i = 0; _i < finalReducerKeys.length; _i++) {
          var _key = finalReducerKeys[_i];
          var reducer = finalReducers[_key];
          var previousStateForKey = state[_key];
          var nextStateForKey = reducer(previousStateForKey, action);
          if (typeof nextStateForKey === "undefined") {
            var actionType = action && action.type;
            throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(14) : "When called with an action of type " + (actionType ? '"' + String(actionType) + '"' : "(unknown type)") + ', the slice reducer for key "' + _key + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.');
          }
          nextState[_key] = nextStateForKey;
          hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
        return hasChanged ? nextState : state;
      };
    }
    function bindActionCreator(actionCreator, dispatch) {
      return function() {
        return dispatch(actionCreator.apply(this, arguments));
      };
    }
    function bindActionCreators(actionCreators, dispatch) {
      if (typeof actionCreators === "function") {
        return bindActionCreator(actionCreators, dispatch);
      }
      if (typeof actionCreators !== "object" || actionCreators === null) {
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(16) : "bindActionCreators expected an object or a function, but instead received: '" + kindOf(actionCreators) + `'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`);
      }
      var boundActionCreators = {};
      for (var key in actionCreators) {
        var actionCreator = actionCreators[key];
        if (typeof actionCreator === "function") {
          boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
      }
      return boundActionCreators;
    }
    function compose() {
      for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
      }
      if (funcs.length === 0) {
        return function(arg) {
          return arg;
        };
      }
      if (funcs.length === 1) {
        return funcs[0];
      }
      return funcs.reduce(function(a, b) {
        return function() {
          return a(b.apply(void 0, arguments));
        };
      });
    }
    function applyMiddleware() {
      for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
      }
      return function(createStore3) {
        return function() {
          var store = createStore3.apply(void 0, arguments);
          var _dispatch = function dispatch() {
            throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(15) : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
          };
          var middlewareAPI = {
            getState: store.getState,
            dispatch: function dispatch() {
              return _dispatch.apply(void 0, arguments);
            }
          };
          var chain = middlewares.map(function(middleware) {
            return middleware(middlewareAPI);
          });
          _dispatch = compose.apply(void 0, chain)(store.dispatch);
          return _objectSpread__default["default"](_objectSpread__default["default"]({}, store), {}, {
            dispatch: _dispatch
          });
        };
      };
    }
    exports.__DO_NOT_USE__ActionTypes = ActionTypes;
    exports.applyMiddleware = applyMiddleware;
    exports.bindActionCreators = bindActionCreators;
    exports.combineReducers = combineReducers;
    exports.compose = compose;
    exports.createStore = createStore2;
    exports.legacy_createStore = legacy_createStore;
  }
});

// node_modules/reselect/lib/defaultMemoize.js
var require_defaultMemoize = __commonJS({
  "node_modules/reselect/lib/defaultMemoize.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.createCacheKeyComparator = createCacheKeyComparator;
    exports.defaultEqualityCheck = void 0;
    exports.defaultMemoize = defaultMemoize;
    var NOT_FOUND = "NOT_FOUND";
    function createSingletonCache(equals) {
      var entry;
      return {
        get: function get(key) {
          if (entry && equals(entry.key, key)) {
            return entry.value;
          }
          return NOT_FOUND;
        },
        put: function put(key, value) {
          entry = {
            key,
            value
          };
        },
        getEntries: function getEntries() {
          return entry ? [entry] : [];
        },
        clear: function clear() {
          entry = void 0;
        }
      };
    }
    function createLruCache(maxSize, equals) {
      var entries = [];
      function get(key) {
        var cacheIndex = entries.findIndex(function(entry2) {
          return equals(key, entry2.key);
        });
        if (cacheIndex > -1) {
          var entry = entries[cacheIndex];
          if (cacheIndex > 0) {
            entries.splice(cacheIndex, 1);
            entries.unshift(entry);
          }
          return entry.value;
        }
        return NOT_FOUND;
      }
      function put(key, value) {
        if (get(key) === NOT_FOUND) {
          entries.unshift({
            key,
            value
          });
          if (entries.length > maxSize) {
            entries.pop();
          }
        }
      }
      function getEntries() {
        return entries;
      }
      function clear() {
        entries = [];
      }
      return {
        get,
        put,
        getEntries,
        clear
      };
    }
    var defaultEqualityCheck = function defaultEqualityCheck2(a, b) {
      return a === b;
    };
    exports.defaultEqualityCheck = defaultEqualityCheck;
    function createCacheKeyComparator(equalityCheck) {
      return function areArgumentsShallowlyEqual(prev, next) {
        if (prev === null || next === null || prev.length !== next.length) {
          return false;
        }
        var length = prev.length;
        for (var i = 0; i < length; i++) {
          if (!equalityCheck(prev[i], next[i])) {
            return false;
          }
        }
        return true;
      };
    }
    function defaultMemoize(func, equalityCheckOrOptions) {
      var providedOptions = typeof equalityCheckOrOptions === "object" ? equalityCheckOrOptions : {
        equalityCheck: equalityCheckOrOptions
      };
      var _providedOptions$equa = providedOptions.equalityCheck, equalityCheck = _providedOptions$equa === void 0 ? defaultEqualityCheck : _providedOptions$equa, _providedOptions$maxS = providedOptions.maxSize, maxSize = _providedOptions$maxS === void 0 ? 1 : _providedOptions$maxS, resultEqualityCheck = providedOptions.resultEqualityCheck;
      var comparator = createCacheKeyComparator(equalityCheck);
      var cache = maxSize === 1 ? createSingletonCache(comparator) : createLruCache(maxSize, comparator);
      function memoized() {
        var value = cache.get(arguments);
        if (value === NOT_FOUND) {
          value = func.apply(null, arguments);
          if (resultEqualityCheck) {
            var entries = cache.getEntries();
            var matchingEntry = entries.find(function(entry) {
              return resultEqualityCheck(entry.value, value);
            });
            if (matchingEntry) {
              value = matchingEntry.value;
            }
          }
          cache.put(arguments, value);
        }
        return value;
      }
      memoized.clearCache = function() {
        return cache.clear();
      };
      return memoized;
    }
  }
});

// node_modules/reselect/lib/index.js
var require_lib = __commonJS({
  "node_modules/reselect/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.createSelector = void 0;
    exports.createSelectorCreator = createSelectorCreator;
    exports.createStructuredSelector = void 0;
    Object.defineProperty(exports, "defaultEqualityCheck", {
      enumerable: true,
      get: function get() {
        return _defaultMemoize.defaultEqualityCheck;
      }
    });
    Object.defineProperty(exports, "defaultMemoize", {
      enumerable: true,
      get: function get() {
        return _defaultMemoize.defaultMemoize;
      }
    });
    var _defaultMemoize = require_defaultMemoize();
    function getDependencies(funcs) {
      var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
      if (!dependencies.every(function(dep) {
        return typeof dep === "function";
      })) {
        var dependencyTypes = dependencies.map(function(dep) {
          return typeof dep === "function" ? "function " + (dep.name || "unnamed") + "()" : typeof dep;
        }).join(", ");
        throw new Error("createSelector expects all input-selectors to be functions, but received the following types: [" + dependencyTypes + "]");
      }
      return dependencies;
    }
    function createSelectorCreator(memoize) {
      for (var _len = arguments.length, memoizeOptionsFromArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        memoizeOptionsFromArgs[_key - 1] = arguments[_key];
      }
      var createSelector3 = function createSelector4() {
        for (var _len2 = arguments.length, funcs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          funcs[_key2] = arguments[_key2];
        }
        var _recomputations = 0;
        var _lastResult;
        var directlyPassedOptions = {
          memoizeOptions: void 0
        };
        var resultFunc = funcs.pop();
        if (typeof resultFunc === "object") {
          directlyPassedOptions = resultFunc;
          resultFunc = funcs.pop();
        }
        if (typeof resultFunc !== "function") {
          throw new Error("createSelector expects an output function after the inputs, but received: [" + typeof resultFunc + "]");
        }
        var _directlyPassedOption = directlyPassedOptions, _directlyPassedOption2 = _directlyPassedOption.memoizeOptions, memoizeOptions = _directlyPassedOption2 === void 0 ? memoizeOptionsFromArgs : _directlyPassedOption2;
        var finalMemoizeOptions = Array.isArray(memoizeOptions) ? memoizeOptions : [memoizeOptions];
        var dependencies = getDependencies(funcs);
        var memoizedResultFunc = memoize.apply(void 0, [function recomputationWrapper() {
          _recomputations++;
          return resultFunc.apply(null, arguments);
        }].concat(finalMemoizeOptions));
        var selector = memoize(function dependenciesChecker() {
          var params = [];
          var length = dependencies.length;
          for (var i = 0; i < length; i++) {
            params.push(dependencies[i].apply(null, arguments));
          }
          _lastResult = memoizedResultFunc.apply(null, params);
          return _lastResult;
        });
        Object.assign(selector, {
          resultFunc,
          memoizedResultFunc,
          dependencies,
          lastResult: function lastResult() {
            return _lastResult;
          },
          recomputations: function recomputations() {
            return _recomputations;
          },
          resetRecomputations: function resetRecomputations() {
            return _recomputations = 0;
          }
        });
        return selector;
      };
      return createSelector3;
    }
    var createSelector2 = /* @__PURE__ */ createSelectorCreator(_defaultMemoize.defaultMemoize);
    exports.createSelector = createSelector2;
    var createStructuredSelector = function createStructuredSelector2(selectors, selectorCreator) {
      if (selectorCreator === void 0) {
        selectorCreator = createSelector2;
      }
      if (typeof selectors !== "object") {
        throw new Error("createStructuredSelector expects first argument to be an object " + ("where each property is a selector, instead received a " + typeof selectors));
      }
      var objectKeys = Object.keys(selectors);
      var resultSelector = selectorCreator(
        // @ts-ignore
        objectKeys.map(function(key) {
          return selectors[key];
        }),
        function() {
          for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            values[_key3] = arguments[_key3];
          }
          return values.reduce(function(composition, value, index) {
            composition[objectKeys[index]] = value;
            return composition;
          }, {});
        }
      );
      return resultSelector;
    };
    exports.createStructuredSelector = createStructuredSelector;
  }
});

// node_modules/redux-thunk/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/redux-thunk/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    function createThunkMiddleware(extraArgument) {
      var middleware = function middleware2(_ref) {
        var dispatch = _ref.dispatch, getState = _ref.getState;
        return function(next) {
          return function(action) {
            if (typeof action === "function") {
              return action(dispatch, getState, extraArgument);
            }
            return next(action);
          };
        };
      };
      return middleware;
    }
    var thunk = createThunkMiddleware();
    thunk.withExtraArgument = createThunkMiddleware;
    var _default = thunk;
    exports.default = _default;
  }
});

// node_modules/@reduxjs/toolkit/dist/redux-toolkit.cjs.production.min.js
var require_redux_toolkit_cjs_production_min = __commonJS({
  "node_modules/@reduxjs/toolkit/dist/redux-toolkit.cjs.production.min.js"(exports) {
    init_cjs_shim();
    var e;
    var n = exports && exports.__extends || (e = function(n2, t2) {
      return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e2, n3) {
        e2.__proto__ = n3;
      } || function(e2, n3) {
        for (var t3 in n3)
          Object.prototype.hasOwnProperty.call(n3, t3) && (e2[t3] = n3[t3]);
      }, e(n2, t2);
    }, function(n2, t2) {
      if ("function" != typeof t2 && null !== t2)
        throw new TypeError("Class extends value " + String(t2) + " is not a constructor or null");
      function r2() {
        this.constructor = n2;
      }
      e(n2, t2), n2.prototype = null === t2 ? Object.create(t2) : (r2.prototype = t2.prototype, new r2());
    });
    var t = exports && exports.__generator || function(e2, n2) {
      var t2, r2, i2, o2, u2 = { label: 0, sent: function() {
        if (1 & i2[0])
          throw i2[1];
        return i2[1];
      }, trys: [], ops: [] };
      return o2 = { next: a2(0), throw: a2(1), return: a2(2) }, "function" == typeof Symbol && (o2[Symbol.iterator] = function() {
        return this;
      }), o2;
      function a2(o3) {
        return function(a3) {
          return function(o4) {
            if (t2)
              throw new TypeError("Generator is already executing.");
            for (; u2; )
              try {
                if (t2 = 1, r2 && (i2 = 2 & o4[0] ? r2.return : o4[0] ? r2.throw || ((i2 = r2.return) && i2.call(r2), 0) : r2.next) && !(i2 = i2.call(r2, o4[1])).done)
                  return i2;
                switch (r2 = 0, i2 && (o4 = [2 & o4[0], i2.value]), o4[0]) {
                  case 0:
                  case 1:
                    i2 = o4;
                    break;
                  case 4:
                    return u2.label++, { value: o4[1], done: false };
                  case 5:
                    u2.label++, r2 = o4[1], o4 = [0];
                    continue;
                  case 7:
                    o4 = u2.ops.pop(), u2.trys.pop();
                    continue;
                  default:
                    if (!((i2 = (i2 = u2.trys).length > 0 && i2[i2.length - 1]) || 6 !== o4[0] && 2 !== o4[0])) {
                      u2 = 0;
                      continue;
                    }
                    if (3 === o4[0] && (!i2 || o4[1] > i2[0] && o4[1] < i2[3])) {
                      u2.label = o4[1];
                      break;
                    }
                    if (6 === o4[0] && u2.label < i2[1]) {
                      u2.label = i2[1], i2 = o4;
                      break;
                    }
                    if (i2 && u2.label < i2[2]) {
                      u2.label = i2[2], u2.ops.push(o4);
                      break;
                    }
                    i2[2] && u2.ops.pop(), u2.trys.pop();
                    continue;
                }
                o4 = n2.call(e2, u2);
              } catch (e3) {
                o4 = [6, e3], r2 = 0;
              } finally {
                t2 = i2 = 0;
              }
            if (5 & o4[0])
              throw o4[1];
            return { value: o4[0] ? o4[1] : void 0, done: true };
          }([o3, a3]);
        };
      }
    };
    var r = exports && exports.__spreadArray || function(e2, n2) {
      for (var t2 = 0, r2 = n2.length, i2 = e2.length; t2 < r2; t2++, i2++)
        e2[i2] = n2[t2];
      return e2;
    };
    var i = Object.create;
    var o = Object.defineProperty;
    var u = Object.defineProperties;
    var a = Object.getOwnPropertyDescriptor;
    var c = Object.getOwnPropertyDescriptors;
    var f = Object.getOwnPropertyNames;
    var l = Object.getOwnPropertySymbols;
    var s = Object.getPrototypeOf;
    var d = Object.prototype.hasOwnProperty;
    var p = Object.prototype.propertyIsEnumerable;
    var v = function(e2, n2, t2) {
      return n2 in e2 ? o(e2, n2, { enumerable: true, configurable: true, writable: true, value: t2 }) : e2[n2] = t2;
    };
    var y = function(e2, n2) {
      for (var t2 in n2 || (n2 = {}))
        d.call(n2, t2) && v(e2, t2, n2[t2]);
      if (l)
        for (var r2 = 0, i2 = l(n2); r2 < i2.length; r2++)
          p.call(n2, t2 = i2[r2]) && v(e2, t2, n2[t2]);
      return e2;
    };
    var h = function(e2, n2) {
      return u(e2, c(n2));
    };
    var g = function(e2) {
      return o(e2, "__esModule", { value: true });
    };
    var b = function(e2, n2, t2) {
      if (n2 && "object" == typeof n2 || "function" == typeof n2)
        for (var r2 = function(r3) {
          d.call(e2, r3) || "default" === r3 || o(e2, r3, { get: function() {
            return n2[r3];
          }, enumerable: !(t2 = a(n2, r3)) || t2.enumerable });
        }, i2 = 0, u2 = f(n2); i2 < u2.length; i2++)
          r2(u2[i2]);
      return e2;
    };
    var m = function(e2) {
      return b(g(o(null != e2 ? i(s(e2)) : {}, "default", e2 && e2.__esModule && "default" in e2 ? { get: function() {
        return e2.default;
      }, enumerable: true } : { value: e2, enumerable: true })), e2);
    };
    var w = function(e2, n2, t2) {
      return new Promise(function(r2, i2) {
        var o2 = function(e3) {
          try {
            a2(t2.next(e3));
          } catch (e4) {
            i2(e4);
          }
        }, u2 = function(e3) {
          try {
            a2(t2.throw(e3));
          } catch (e4) {
            i2(e4);
          }
        }, a2 = function(e3) {
          return e3.done ? r2(e3.value) : Promise.resolve(e3.value).then(o2, u2);
        };
        a2((t2 = t2.apply(e2, n2)).next());
      });
    };
    g(exports), function(e2, n2) {
      for (var t2 in n2)
        o(e2, t2, { get: n2[t2], enumerable: true });
    }(exports, { EnhancerArray: function() {
      return F;
    }, MiddlewareArray: function() {
      return B;
    }, SHOULD_AUTOBATCH: function() {
      return Je;
    }, TaskAbortError: function() {
      return ke;
    }, addListener: function() {
      return Fe;
    }, autoBatchEnhancer: function() {
      return $e;
    }, clearAllListeners: function() {
      return Ue;
    }, configureStore: function() {
      return Y;
    }, createAction: function() {
      return T;
    }, createActionCreatorInvariantMiddleware: function() {
      return N;
    }, createAsyncThunk: function() {
      return ve;
    }, createDraftSafeSelector: function() {
      return P;
    }, createEntityAdapter: function() {
      return ce;
    }, createImmutableStateInvariantMiddleware: function() {
      return X;
    }, createListenerMiddleware: function() {
      return Ge;
    }, createNextState: function() {
      return j.default;
    }, createReducer: function() {
      return ee;
    }, createSelector: function() {
      return A.createSelector;
    }, createSerializableStateInvariantMiddleware: function() {
      return K;
    }, createSlice: function() {
      return ne;
    }, current: function() {
      return j.current;
    }, findNonSerializableValue: function() {
      return H;
    }, freeze: function() {
      return j.freeze;
    }, getDefaultMiddleware: function() {
      return Q;
    }, getType: function() {
      return z;
    }, isAction: function() {
      return C;
    }, isActionCreator: function() {
      return D;
    }, isAllOf: function() {
      return be;
    }, isAnyOf: function() {
      return ge;
    }, isAsyncThunkAction: function() {
      return Se;
    }, isDraft: function() {
      return j.isDraft;
    }, isFluxStandardAction: function() {
      return L;
    }, isFulfilled: function() {
      return Ee;
    }, isImmutableDefault: function() {
      return W;
    }, isPending: function() {
      return Oe;
    }, isPlain: function() {
      return G;
    }, isPlainObject: function() {
      return M;
    }, isRejected: function() {
      return je;
    }, isRejectedWithValue: function() {
      return Ae;
    }, miniSerializeError: function() {
      return pe;
    }, nanoid: function() {
      return fe;
    }, original: function() {
      return j.original;
    }, prepareAutoBatched: function() {
      return Ke;
    }, removeListener: function() {
      return We;
    }, unwrapResult: function() {
      return ye;
    } });
    var O = m(require_dist());
    b(exports, m(require_redux()));
    var j = m(require_dist());
    var A = m(require_lib());
    var E = m(require_dist());
    var S = m(require_lib());
    var P = function() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      var t2 = S.createSelector.apply(void 0, e2), i2 = function(e3) {
        for (var n3 = [], i3 = 1; i3 < arguments.length; i3++)
          n3[i3 - 1] = arguments[i3];
        return t2.apply(void 0, r([(0, E.isDraft)(e3) ? (0, E.current)(e3) : e3], n3));
      };
      return i2;
    };
    var _ = m(require_redux());
    var q = m(require_redux());
    var x = "undefined" != typeof window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
      if (0 !== arguments.length)
        return "object" == typeof arguments[0] ? q.compose : q.compose.apply(null, arguments);
    };
    function M(e2) {
      if ("object" != typeof e2 || null === e2)
        return false;
      var n2 = Object.getPrototypeOf(e2);
      if (null === n2)
        return true;
      for (var t2 = n2; null !== Object.getPrototypeOf(t2); )
        t2 = Object.getPrototypeOf(t2);
      return n2 === t2;
    }
    "undefined" != typeof window && window.__REDUX_DEVTOOLS_EXTENSION__ && window;
    var k = m(require_lib2());
    var I = function(e2) {
      return e2 && "function" == typeof e2.match;
    };
    function T(e2, n2) {
      function t2() {
        for (var t3 = [], r2 = 0; r2 < arguments.length; r2++)
          t3[r2] = arguments[r2];
        if (n2) {
          var i2 = n2.apply(void 0, t3);
          if (!i2)
            throw new Error("prepareAction did not return an object");
          return y(y({ type: e2, payload: i2.payload }, "meta" in i2 && { meta: i2.meta }), "error" in i2 && { error: i2.error });
        }
        return { type: e2, payload: t3[0] };
      }
      return t2.toString = function() {
        return "" + e2;
      }, t2.type = e2, t2.match = function(n3) {
        return n3.type === e2;
      }, t2;
    }
    function C(e2) {
      return M(e2) && "type" in e2;
    }
    function D(e2) {
      return "function" == typeof e2 && "type" in e2 && I(e2);
    }
    function L(e2) {
      return C(e2) && "string" == typeof e2.type && Object.keys(e2).every(R);
    }
    function R(e2) {
      return ["type", "payload", "error", "meta"].indexOf(e2) > -1;
    }
    function z(e2) {
      return "" + e2;
    }
    function N(e2) {
      return void 0 === e2 && (e2 = {}), function() {
        return function(e3) {
          return function(n2) {
            return e3(n2);
          };
        };
      };
    }
    var V = m(require_dist());
    var B = function(e2) {
      function t2() {
        for (var n2 = [], r2 = 0; r2 < arguments.length; r2++)
          n2[r2] = arguments[r2];
        var i2 = e2.apply(this, n2) || this;
        return Object.setPrototypeOf(i2, t2.prototype), i2;
      }
      return n(t2, e2), Object.defineProperty(t2, Symbol.species, { get: function() {
        return t2;
      }, enumerable: false, configurable: true }), t2.prototype.concat = function() {
        for (var n2 = [], t3 = 0; t3 < arguments.length; t3++)
          n2[t3] = arguments[t3];
        return e2.prototype.concat.apply(this, n2);
      }, t2.prototype.prepend = function() {
        for (var e3 = [], n2 = 0; n2 < arguments.length; n2++)
          e3[n2] = arguments[n2];
        return 1 === e3.length && Array.isArray(e3[0]) ? new (t2.bind.apply(t2, r([void 0], e3[0].concat(this))))() : new (t2.bind.apply(t2, r([void 0], e3.concat(this))))();
      }, t2;
    }(Array);
    var F = function(e2) {
      function t2() {
        for (var n2 = [], r2 = 0; r2 < arguments.length; r2++)
          n2[r2] = arguments[r2];
        var i2 = e2.apply(this, n2) || this;
        return Object.setPrototypeOf(i2, t2.prototype), i2;
      }
      return n(t2, e2), Object.defineProperty(t2, Symbol.species, { get: function() {
        return t2;
      }, enumerable: false, configurable: true }), t2.prototype.concat = function() {
        for (var n2 = [], t3 = 0; t3 < arguments.length; t3++)
          n2[t3] = arguments[t3];
        return e2.prototype.concat.apply(this, n2);
      }, t2.prototype.prepend = function() {
        for (var e3 = [], n2 = 0; n2 < arguments.length; n2++)
          e3[n2] = arguments[n2];
        return 1 === e3.length && Array.isArray(e3[0]) ? new (t2.bind.apply(t2, r([void 0], e3[0].concat(this))))() : new (t2.bind.apply(t2, r([void 0], e3.concat(this))))();
      }, t2;
    }(Array);
    function U(e2) {
      return (0, V.isDraftable)(e2) ? (0, V.default)(e2, function() {
      }) : e2;
    }
    function W(e2) {
      return "object" != typeof e2 || null == e2 || Object.isFrozen(e2);
    }
    function X(e2) {
      return void 0 === e2 && (e2 = {}), function() {
        return function(e3) {
          return function(n2) {
            return e3(n2);
          };
        };
      };
    }
    function G(e2) {
      var n2 = typeof e2;
      return null == e2 || "string" === n2 || "boolean" === n2 || "number" === n2 || Array.isArray(e2) || M(e2);
    }
    function H(e2, n2, t2, r2, i2, o2) {
      var u2;
      if (void 0 === n2 && (n2 = ""), void 0 === t2 && (t2 = G), void 0 === i2 && (i2 = []), !t2(e2))
        return { keyPath: n2 || "<root>", value: e2 };
      if ("object" != typeof e2 || null === e2)
        return false;
      if (null == o2 ? void 0 : o2.has(e2))
        return false;
      for (var a2 = null != r2 ? r2(e2) : Object.entries(e2), c2 = i2.length > 0, f2 = function(e3, a3) {
        var f3 = n2 ? n2 + "." + e3 : e3;
        return c2 && i2.some(function(e4) {
          return e4 instanceof RegExp ? e4.test(f3) : f3 === e4;
        }) ? "continue" : t2(a3) ? "object" == typeof a3 && (u2 = H(a3, f3, t2, r2, i2, o2)) ? { value: u2 } : void 0 : { value: { keyPath: f3, value: a3 } };
      }, l2 = 0, s2 = a2; l2 < s2.length; l2++) {
        var d2 = s2[l2], p2 = f2(d2[0], d2[1]);
        if ("object" == typeof p2)
          return p2.value;
      }
      return o2 && J(e2) && o2.add(e2), false;
    }
    function J(e2) {
      if (!Object.isFrozen(e2))
        return false;
      for (var n2 = 0, t2 = Object.values(e2); n2 < t2.length; n2++) {
        var r2 = t2[n2];
        if ("object" == typeof r2 && null !== r2 && !J(r2))
          return false;
      }
      return true;
    }
    function K(e2) {
      return void 0 === e2 && (e2 = {}), function() {
        return function(e3) {
          return function(n2) {
            return e3(n2);
          };
        };
      };
    }
    function Q(e2) {
      void 0 === e2 && (e2 = {});
      var n2 = e2.thunk, t2 = void 0 === n2 || n2, r2 = new B();
      return t2 && r2.push("boolean" == typeof t2 ? k.default : k.default.withExtraArgument(t2.extraArgument)), r2;
    }
    function Y(e2) {
      var n2, t2 = function(e3) {
        return Q(e3);
      }, i2 = e2 || {}, o2 = i2.reducer, u2 = void 0 === o2 ? void 0 : o2, a2 = i2.middleware, c2 = void 0 === a2 ? t2() : a2, f2 = i2.devTools, l2 = void 0 === f2 || f2, s2 = i2.preloadedState, d2 = void 0 === s2 ? void 0 : s2, p2 = i2.enhancers, v2 = void 0 === p2 ? void 0 : p2;
      if ("function" == typeof u2)
        n2 = u2;
      else {
        if (!M(u2))
          throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');
        n2 = (0, _.combineReducers)(u2);
      }
      var h2 = c2;
      "function" == typeof h2 && (h2 = h2(t2));
      var g2 = _.applyMiddleware.apply(void 0, h2), b2 = _.compose;
      l2 && (b2 = x(y({ trace: false }, "object" == typeof l2 && l2)));
      var m2 = new F(g2), w2 = m2;
      Array.isArray(v2) ? w2 = r([g2], v2) : "function" == typeof v2 && (w2 = v2(m2));
      var O2 = b2.apply(void 0, w2);
      return (0, _.createStore)(n2, d2, O2);
    }
    var Z = m(require_dist());
    function $(e2) {
      var n2, t2 = {}, r2 = [], i2 = { addCase: function(e3, n3) {
        var r3 = "string" == typeof e3 ? e3 : e3.type;
        if (!r3)
          throw new Error("`builder.addCase` cannot be called with an empty action type");
        if (r3 in t2)
          throw new Error("`builder.addCase` cannot be called with two reducers for the same action type");
        return t2[r3] = n3, i2;
      }, addMatcher: function(e3, n3) {
        return r2.push({ matcher: e3, reducer: n3 }), i2;
      }, addDefaultCase: function(e3) {
        return n2 = e3, i2;
      } };
      return e2(i2), [t2, r2, n2];
    }
    function ee(e2, n2, t2, i2) {
      void 0 === t2 && (t2 = []);
      var o2, u2 = "function" == typeof n2 ? $(n2) : [n2, t2, i2], a2 = u2[0], c2 = u2[1], f2 = u2[2];
      if ("function" == typeof e2)
        o2 = function() {
          return U(e2());
        };
      else {
        var l2 = U(e2);
        o2 = function() {
          return l2;
        };
      }
      function s2(e3, n3) {
        void 0 === e3 && (e3 = o2());
        var t3 = r([a2[n3.type]], c2.filter(function(e4) {
          return (0, e4.matcher)(n3);
        }).map(function(e4) {
          return e4.reducer;
        }));
        return 0 === t3.filter(function(e4) {
          return !!e4;
        }).length && (t3 = [f2]), t3.reduce(function(e4, t4) {
          if (t4) {
            var r2;
            if ((0, Z.isDraft)(e4))
              return void 0 === (r2 = t4(e4, n3)) ? e4 : r2;
            if ((0, Z.isDraftable)(e4))
              return (0, Z.default)(e4, function(e5) {
                return t4(e5, n3);
              });
            if (void 0 === (r2 = t4(e4, n3))) {
              if (null === e4)
                return e4;
              throw Error("A case reducer on a non-draftable value must not return undefined");
            }
            return r2;
          }
          return e4;
        }, e3);
      }
      return s2.getInitialState = o2, s2;
    }
    function ne(e2) {
      var n2 = e2.name;
      if (!n2)
        throw new Error("`name` is a required option for createSlice");
      var t2, r2 = "function" == typeof e2.initialState ? e2.initialState : U(e2.initialState), i2 = e2.reducers || {}, o2 = Object.keys(i2), u2 = {}, a2 = {}, c2 = {};
      function f2() {
        var n3 = "function" == typeof e2.extraReducers ? $(e2.extraReducers) : [e2.extraReducers], t3 = n3[0], i3 = n3[1], o3 = void 0 === i3 ? [] : i3, u3 = n3[2], c3 = void 0 === u3 ? void 0 : u3, f3 = y(y({}, void 0 === t3 ? {} : t3), a2);
        return ee(r2, function(e3) {
          for (var n4 in f3)
            e3.addCase(n4, f3[n4]);
          for (var t4 = 0, r3 = o3; t4 < r3.length; t4++) {
            var i4 = r3[t4];
            e3.addMatcher(i4.matcher, i4.reducer);
          }
          c3 && e3.addDefaultCase(c3);
        });
      }
      return o2.forEach(function(e3) {
        var t3, r3, o3 = i2[e3], f3 = n2 + "/" + e3;
        "reducer" in o3 ? (t3 = o3.reducer, r3 = o3.prepare) : t3 = o3, u2[e3] = t3, a2[f3] = t3, c2[e3] = r3 ? T(f3, r3) : T(f3);
      }), { name: n2, reducer: function(e3, n3) {
        return t2 || (t2 = f2()), t2(e3, n3);
      }, actions: c2, caseReducers: u2, getInitialState: function() {
        return t2 || (t2 = f2()), t2.getInitialState();
      } };
    }
    var te = m(require_dist());
    function re(e2) {
      return function(n2, t2) {
        var r2 = function(n3) {
          L(t2) ? e2(t2.payload, n3) : e2(t2, n3);
        };
        return (0, te.isDraft)(n2) ? (r2(n2), n2) : (0, te.default)(n2, r2);
      };
    }
    function ie(e2, n2) {
      return n2(e2);
    }
    function oe(e2) {
      return Array.isArray(e2) || (e2 = Object.values(e2)), e2;
    }
    function ue(e2, n2, t2) {
      for (var r2 = [], i2 = [], o2 = 0, u2 = e2 = oe(e2); o2 < u2.length; o2++) {
        var a2 = u2[o2], c2 = ie(a2, n2);
        c2 in t2.entities ? i2.push({ id: c2, changes: a2 }) : r2.push(a2);
      }
      return [r2, i2];
    }
    function ae(e2) {
      function n2(n3, t3) {
        var r3 = ie(n3, e2);
        r3 in t3.entities || (t3.ids.push(r3), t3.entities[r3] = n3);
      }
      function t2(e3, t3) {
        for (var r3 = 0, i3 = e3 = oe(e3); r3 < i3.length; r3++)
          n2(i3[r3], t3);
      }
      function r2(n3, t3) {
        var r3 = ie(n3, e2);
        r3 in t3.entities || t3.ids.push(r3), t3.entities[r3] = n3;
      }
      function i2(e3, n3) {
        var t3 = false;
        e3.forEach(function(e4) {
          e4 in n3.entities && (delete n3.entities[e4], t3 = true);
        }), t3 && (n3.ids = n3.ids.filter(function(e4) {
          return e4 in n3.entities;
        }));
      }
      function o2(n3, t3) {
        var r3 = {}, i3 = {};
        if (n3.forEach(function(e3) {
          e3.id in t3.entities && (i3[e3.id] = { id: e3.id, changes: y(y({}, i3[e3.id] ? i3[e3.id].changes : null), e3.changes) });
        }), (n3 = Object.values(i3)).length > 0) {
          var o3 = n3.filter(function(n4) {
            return function(n5, t4, r4) {
              var i4 = Object.assign({}, r4.entities[t4.id], t4.changes), o4 = ie(i4, e2), u3 = o4 !== t4.id;
              return u3 && (n5[t4.id] = o4, delete r4.entities[t4.id]), r4.entities[o4] = i4, u3;
            }(r3, n4, t3);
          }).length > 0;
          o3 && (t3.ids = Object.keys(t3.entities));
        }
      }
      function u2(n3, r3) {
        var i3 = ue(n3, e2, r3), u3 = i3[0];
        o2(i3[1], r3), t2(u3, r3);
      }
      return { removeAll: (a2 = function(e3) {
        Object.assign(e3, { ids: [], entities: {} });
      }, c2 = re(function(e3, n3) {
        return a2(n3);
      }), function(e3) {
        return c2(e3, void 0);
      }), addOne: re(n2), addMany: re(t2), setOne: re(r2), setMany: re(function(e3, n3) {
        for (var t3 = 0, i3 = e3 = oe(e3); t3 < i3.length; t3++)
          r2(i3[t3], n3);
      }), setAll: re(function(e3, n3) {
        e3 = oe(e3), n3.ids = [], n3.entities = {}, t2(e3, n3);
      }), updateOne: re(function(e3, n3) {
        return o2([e3], n3);
      }), updateMany: re(o2), upsertOne: re(function(e3, n3) {
        return u2([e3], n3);
      }), upsertMany: re(u2), removeOne: re(function(e3, n3) {
        return i2([e3], n3);
      }), removeMany: re(i2) };
      var a2, c2;
    }
    function ce(e2) {
      void 0 === e2 && (e2 = {});
      var n2 = y({ sortComparer: false, selectId: function(e3) {
        return e3.id;
      } }, e2), t2 = n2.selectId, r2 = n2.sortComparer, i2 = { getInitialState: function(e3) {
        return void 0 === e3 && (e3 = {}), Object.assign({ ids: [], entities: {} }, e3);
      } }, o2 = { getSelectors: function(e3) {
        var n3 = function(e4) {
          return e4.ids;
        }, t3 = function(e4) {
          return e4.entities;
        }, r3 = P(n3, t3, function(e4, n4) {
          return e4.map(function(e5) {
            return n4[e5];
          });
        }), i3 = function(e4, n4) {
          return n4;
        }, o3 = function(e4, n4) {
          return e4[n4];
        }, u3 = P(n3, function(e4) {
          return e4.length;
        });
        if (!e3)
          return { selectIds: n3, selectEntities: t3, selectAll: r3, selectTotal: u3, selectById: P(t3, i3, o3) };
        var a2 = P(e3, t3);
        return { selectIds: P(e3, n3), selectEntities: a2, selectAll: P(e3, r3), selectTotal: P(e3, u3), selectById: P(a2, i3, o3) };
      } }, u2 = r2 ? function(e3, n3) {
        var t3 = ae(e3);
        function r3(n4, t4) {
          var r4 = (n4 = oe(n4)).filter(function(n5) {
            return !(ie(n5, e3) in t4.entities);
          });
          0 !== r4.length && a2(r4, t4);
        }
        function i3(e4, n4) {
          0 !== (e4 = oe(e4)).length && a2(e4, n4);
        }
        function o3(n4, t4) {
          for (var r4 = false, i4 = 0, o4 = n4; i4 < o4.length; i4++) {
            var u4 = o4[i4], a3 = t4.entities[u4.id];
            if (a3) {
              r4 = true, Object.assign(a3, u4.changes);
              var f2 = e3(a3);
              u4.id !== f2 && (delete t4.entities[u4.id], t4.entities[f2] = a3);
            }
          }
          r4 && c2(t4);
        }
        function u3(n4, t4) {
          var i4 = ue(n4, e3, t4), u4 = i4[0];
          o3(i4[1], t4), r3(u4, t4);
        }
        function a2(n4, t4) {
          n4.forEach(function(n5) {
            t4.entities[e3(n5)] = n5;
          }), c2(t4);
        }
        function c2(t4) {
          var r4 = Object.values(t4.entities);
          r4.sort(n3);
          var i4 = r4.map(e3);
          (function(e4, n4) {
            if (e4.length !== n4.length)
              return false;
            for (var t5 = 0; t5 < e4.length && t5 < n4.length; t5++)
              if (e4[t5] !== n4[t5])
                return false;
            return true;
          })(t4.ids, i4) || (t4.ids = i4);
        }
        return { removeOne: t3.removeOne, removeMany: t3.removeMany, removeAll: t3.removeAll, addOne: re(function(e4, n4) {
          return r3([e4], n4);
        }), updateOne: re(function(e4, n4) {
          return o3([e4], n4);
        }), upsertOne: re(function(e4, n4) {
          return u3([e4], n4);
        }), setOne: re(function(e4, n4) {
          return i3([e4], n4);
        }), setMany: re(i3), setAll: re(function(e4, n4) {
          e4 = oe(e4), n4.entities = {}, n4.ids = [], r3(e4, n4);
        }), addMany: re(r3), updateMany: re(o3), upsertMany: re(u3) };
      }(t2, r2) : ae(t2);
      return y(y(y({ selectId: t2, sortComparer: r2 }, i2), o2), u2);
    }
    var fe = function(e2) {
      void 0 === e2 && (e2 = 21);
      for (var n2 = "", t2 = e2; t2--; )
        n2 += "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW"[64 * Math.random() | 0];
      return n2;
    };
    var le = ["name", "message", "stack", "code"];
    var se = function(e2, n2) {
      this.payload = e2, this.meta = n2;
    };
    var de = function(e2, n2) {
      this.payload = e2, this.meta = n2;
    };
    var pe = function(e2) {
      if ("object" == typeof e2 && null !== e2) {
        for (var n2 = {}, t2 = 0, r2 = le; t2 < r2.length; t2++) {
          var i2 = r2[t2];
          "string" == typeof e2[i2] && (n2[i2] = e2[i2]);
        }
        return n2;
      }
      return { message: String(e2) };
    };
    var ve = function() {
      function e2(e3, n2, r2) {
        var i2 = T(e3 + "/fulfilled", function(e4, n3, t2, r3) {
          return { payload: e4, meta: h(y({}, r3 || {}), { arg: t2, requestId: n3, requestStatus: "fulfilled" }) };
        }), o2 = T(e3 + "/pending", function(e4, n3, t2) {
          return { payload: void 0, meta: h(y({}, t2 || {}), { arg: n3, requestId: e4, requestStatus: "pending" }) };
        }), u2 = T(e3 + "/rejected", function(e4, n3, t2, i3, o3) {
          return { payload: i3, error: (r2 && r2.serializeError || pe)(e4 || "Rejected"), meta: h(y({}, o3 || {}), { arg: t2, requestId: n3, rejectedWithValue: !!i3, requestStatus: "rejected", aborted: "AbortError" === (null == e4 ? void 0 : e4.name), condition: "ConditionError" === (null == e4 ? void 0 : e4.name) }) };
        }), a2 = "undefined" != typeof AbortController ? AbortController : function() {
          function e4() {
            this.signal = { aborted: false, addEventListener: function() {
            }, dispatchEvent: function() {
              return false;
            }, onabort: function() {
            }, removeEventListener: function() {
            }, reason: void 0, throwIfAborted: function() {
            } };
          }
          return e4.prototype.abort = function() {
          }, e4;
        }();
        return Object.assign(function(e4) {
          return function(c2, f2, l2) {
            var s2, d2 = (null == r2 ? void 0 : r2.idGenerator) ? r2.idGenerator(e4) : fe(), p2 = new a2();
            function v2(e5) {
              s2 = e5, p2.abort();
            }
            var y2 = function() {
              return w(this, null, function() {
                var a3, y3, h2, g2, b2, m2;
                return t(this, function(t2) {
                  switch (t2.label) {
                    case 0:
                      return t2.trys.push([0, 4, , 5]), null === (w2 = g2 = null == (a3 = null == r2 ? void 0 : r2.condition) ? void 0 : a3.call(r2, e4, { getState: f2, extra: l2 })) || "object" != typeof w2 || "function" != typeof w2.then ? [3, 2] : [4, g2];
                    case 1:
                      g2 = t2.sent(), t2.label = 2;
                    case 2:
                      if (false === g2 || p2.signal.aborted)
                        throw { name: "ConditionError", message: "Aborted due to condition callback returning false." };
                      return b2 = new Promise(function(e5, n3) {
                        return p2.signal.addEventListener("abort", function() {
                          return n3({ name: "AbortError", message: s2 || "Aborted" });
                        });
                      }), c2(o2(d2, e4, null == (y3 = null == r2 ? void 0 : r2.getPendingMeta) ? void 0 : y3.call(r2, { requestId: d2, arg: e4 }, { getState: f2, extra: l2 }))), [4, Promise.race([b2, Promise.resolve(n2(e4, { dispatch: c2, getState: f2, extra: l2, requestId: d2, signal: p2.signal, abort: v2, rejectWithValue: function(e5, n3) {
                        return new se(e5, n3);
                      }, fulfillWithValue: function(e5, n3) {
                        return new de(e5, n3);
                      } })).then(function(n3) {
                        if (n3 instanceof se)
                          throw n3;
                        return n3 instanceof de ? i2(n3.payload, d2, e4, n3.meta) : i2(n3, d2, e4);
                      })])];
                    case 3:
                      return h2 = t2.sent(), [3, 5];
                    case 4:
                      return m2 = t2.sent(), h2 = m2 instanceof se ? u2(null, d2, e4, m2.payload, m2.meta) : u2(m2, d2, e4), [3, 5];
                    case 5:
                      return r2 && !r2.dispatchConditionRejection && u2.match(h2) && h2.meta.condition || c2(h2), [2, h2];
                  }
                  var w2;
                });
              });
            }();
            return Object.assign(y2, { abort: v2, requestId: d2, arg: e4, unwrap: function() {
              return y2.then(ye);
            } });
          };
        }, { pending: o2, rejected: u2, fulfilled: i2, typePrefix: e3 });
      }
      return e2.withTypes = function() {
        return e2;
      }, e2;
    }();
    function ye(e2) {
      if (e2.meta && e2.meta.rejectedWithValue)
        throw e2.payload;
      if (e2.error)
        throw e2.error;
      return e2.payload;
    }
    var he = function(e2, n2) {
      return I(e2) ? e2.match(n2) : e2(n2);
    };
    function ge() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      return function(n3) {
        return e2.some(function(e3) {
          return he(e3, n3);
        });
      };
    }
    function be() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      return function(n3) {
        return e2.every(function(e3) {
          return he(e3, n3);
        });
      };
    }
    function me(e2, n2) {
      if (!e2 || !e2.meta)
        return false;
      var t2 = "string" == typeof e2.meta.requestId, r2 = n2.indexOf(e2.meta.requestStatus) > -1;
      return t2 && r2;
    }
    function we(e2) {
      return "function" == typeof e2[0] && "pending" in e2[0] && "fulfilled" in e2[0] && "rejected" in e2[0];
    }
    function Oe() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      return 0 === e2.length ? function(e3) {
        return me(e3, ["pending"]);
      } : we(e2) ? function(n3) {
        var t2 = e2.map(function(e3) {
          return e3.pending;
        });
        return ge.apply(void 0, t2)(n3);
      } : Oe()(e2[0]);
    }
    function je() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      return 0 === e2.length ? function(e3) {
        return me(e3, ["rejected"]);
      } : we(e2) ? function(n3) {
        var t2 = e2.map(function(e3) {
          return e3.rejected;
        });
        return ge.apply(void 0, t2)(n3);
      } : je()(e2[0]);
    }
    function Ae() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      var t2 = function(e3) {
        return e3 && e3.meta && e3.meta.rejectedWithValue;
      };
      return 0 === e2.length || we(e2) ? function(n3) {
        return be(je.apply(void 0, e2), t2)(n3);
      } : Ae()(e2[0]);
    }
    function Ee() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      return 0 === e2.length ? function(e3) {
        return me(e3, ["fulfilled"]);
      } : we(e2) ? function(n3) {
        var t2 = e2.map(function(e3) {
          return e3.fulfilled;
        });
        return ge.apply(void 0, t2)(n3);
      } : Ee()(e2[0]);
    }
    function Se() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      return 0 === e2.length ? function(e3) {
        return me(e3, ["pending", "fulfilled", "rejected"]);
      } : we(e2) ? function(n3) {
        for (var t2 = [], r2 = 0, i2 = e2; r2 < i2.length; r2++) {
          var o2 = i2[r2];
          t2.push(o2.pending, o2.rejected, o2.fulfilled);
        }
        return ge.apply(void 0, t2)(n3);
      } : Se()(e2[0]);
    }
    var Pe = function(e2, n2) {
      if ("function" != typeof e2)
        throw new TypeError(n2 + " is not a function");
    };
    var _e = function() {
    };
    var qe = function(e2, n2) {
      return void 0 === n2 && (n2 = _e), e2.catch(n2), e2;
    };
    var xe = function(e2, n2) {
      return e2.addEventListener("abort", n2, { once: true }), function() {
        return e2.removeEventListener("abort", n2);
      };
    };
    var Me = function(e2, n2) {
      var t2 = e2.signal;
      t2.aborted || ("reason" in t2 || Object.defineProperty(t2, "reason", { enumerable: true, value: n2, configurable: true, writable: true }), e2.abort(n2));
    };
    var ke = function(e2) {
      this.code = e2, this.name = "TaskAbortError", this.message = "task cancelled (reason: " + e2 + ")";
    };
    var Ie = function(e2) {
      if (e2.aborted)
        throw new ke(e2.reason);
    };
    function Te(e2, n2) {
      var t2 = _e;
      return new Promise(function(r2, i2) {
        var o2 = function() {
          return i2(new ke(e2.reason));
        };
        e2.aborted ? o2() : (t2 = xe(e2, o2), n2.finally(function() {
          return t2();
        }).then(r2, i2));
      }).finally(function() {
        t2 = _e;
      });
    }
    var Ce = function(e2) {
      return function(n2) {
        return qe(Te(e2, n2).then(function(n3) {
          return Ie(e2), n3;
        }));
      };
    };
    var De = function(e2) {
      var n2 = Ce(e2);
      return function(e3) {
        return n2(new Promise(function(n3) {
          return setTimeout(n3, e3);
        }));
      };
    };
    var Le = Object.assign;
    var Re = {};
    var ze = "listenerMiddleware";
    var Ne = function(e2) {
      var n2 = e2.type, t2 = e2.actionCreator, r2 = e2.matcher, i2 = e2.predicate, o2 = e2.effect;
      if (n2)
        i2 = T(n2).match;
      else if (t2)
        n2 = t2.type, i2 = t2.match;
      else if (r2)
        i2 = r2;
      else if (!i2)
        throw new Error("Creating or removing a listener requires one of the known fields for matching an action");
      return Pe(o2, "options.listener"), { predicate: i2, type: n2, effect: o2 };
    };
    var Ve = function(e2) {
      e2.pending.forEach(function(e3) {
        Me(e3, "listener-cancelled");
      });
    };
    var Be = function(e2, n2, t2) {
      try {
        e2(n2, t2);
      } catch (e3) {
        setTimeout(function() {
          throw e3;
        }, 0);
      }
    };
    var Fe = T(ze + "/add");
    var Ue = T(ze + "/removeAll");
    var We = T(ze + "/remove");
    var Xe = function() {
      for (var e2 = [], n2 = 0; n2 < arguments.length; n2++)
        e2[n2] = arguments[n2];
      console.error.apply(console, r([ze + "/error"], e2));
    };
    function Ge(e2) {
      var n2 = this;
      void 0 === e2 && (e2 = {});
      var r2 = /* @__PURE__ */ new Map(), i2 = e2.extra, o2 = e2.onError, u2 = void 0 === o2 ? Xe : o2;
      Pe(u2, "onError");
      var a2 = function(e3) {
        for (var n3 = 0, t2 = Array.from(r2.values()); n3 < t2.length; n3++) {
          var i3 = t2[n3];
          if (e3(i3))
            return i3;
        }
      }, c2 = function(e3) {
        var n3 = a2(function(n4) {
          return n4.effect === e3.effect;
        });
        return n3 || (n3 = function(e4) {
          var n4 = Ne(e4), t2 = n4.type, r3 = n4.predicate, i3 = n4.effect;
          return { id: fe(), effect: i3, type: t2, predicate: r3, pending: /* @__PURE__ */ new Set(), unsubscribe: function() {
            throw new Error("Unsubscribe not initialized");
          } };
        }(e3)), function(e4) {
          return e4.unsubscribe = function() {
            return r2.delete(e4.id);
          }, r2.set(e4.id, e4), function(n4) {
            e4.unsubscribe(), (null == n4 ? void 0 : n4.cancelActive) && Ve(e4);
          };
        }(n3);
      }, f2 = function(e3) {
        var n3 = Ne(e3), t2 = n3.type, r3 = n3.effect, i3 = n3.predicate, o3 = a2(function(e4) {
          return ("string" == typeof t2 ? e4.type === t2 : e4.predicate === i3) && e4.effect === r3;
        });
        return o3 && (o3.unsubscribe(), e3.cancelActive && Ve(o3)), !!o3;
      }, l2 = function(e3, o3, a3, f3) {
        return w(n2, null, function() {
          var n3, l3, s3, d2;
          return t(this, function(p2) {
            switch (p2.label) {
              case 0:
                n3 = new AbortController(), l3 = function(e4, n4) {
                  return function(r3, i3) {
                    return qe(function(r4, i4) {
                      return w(void 0, null, function() {
                        var o4, u3, a4, c3;
                        return t(this, function(t2) {
                          switch (t2.label) {
                            case 0:
                              Ie(n4), o4 = function() {
                              }, u3 = new Promise(function(n5, t3) {
                                var i5 = e4({ predicate: r4, effect: function(e5, t4) {
                                  t4.unsubscribe(), n5([e5, t4.getState(), t4.getOriginalState()]);
                                } });
                                o4 = function() {
                                  i5(), t3();
                                };
                              }), a4 = [u3], null != i4 && a4.push(new Promise(function(e5) {
                                return setTimeout(e5, i4, null);
                              })), t2.label = 1;
                            case 1:
                              return t2.trys.push([1, , 3, 4]), [4, Te(n4, Promise.race(a4))];
                            case 2:
                              return c3 = t2.sent(), Ie(n4), [2, c3];
                            case 3:
                              return o4(), [7];
                            case 4:
                              return [2];
                          }
                        });
                      });
                    }(r3, i3));
                  };
                }(c2, n3.signal), s3 = [], p2.label = 1;
              case 1:
                return p2.trys.push([1, 3, 4, 6]), e3.pending.add(n3), [4, Promise.resolve(e3.effect(o3, Le({}, a3, { getOriginalState: f3, condition: function(e4, n4) {
                  return l3(e4, n4).then(Boolean);
                }, take: l3, delay: De(n3.signal), pause: Ce(n3.signal), extra: i2, signal: n3.signal, fork: (v2 = n3.signal, y2 = s3, function(e4, n4) {
                  Pe(e4, "taskExecutor");
                  var r3, i3 = new AbortController();
                  r3 = i3, xe(v2, function() {
                    return Me(r3, v2.reason);
                  });
                  var o4, u3, a4 = (o4 = function() {
                    return w(void 0, null, function() {
                      var n5;
                      return t(this, function(t2) {
                        switch (t2.label) {
                          case 0:
                            return Ie(v2), Ie(i3.signal), [4, e4({ pause: Ce(i3.signal), delay: De(i3.signal), signal: i3.signal })];
                          case 1:
                            return n5 = t2.sent(), Ie(i3.signal), [2, n5];
                        }
                      });
                    });
                  }, u3 = function() {
                    return Me(i3, "task-completed");
                  }, w(void 0, null, function() {
                    var e5;
                    return t(this, function(n5) {
                      switch (n5.label) {
                        case 0:
                          return n5.trys.push([0, 3, 4, 5]), [4, Promise.resolve()];
                        case 1:
                          return n5.sent(), [4, o4()];
                        case 2:
                          return [2, { status: "ok", value: n5.sent() }];
                        case 3:
                          return [2, { status: (e5 = n5.sent()) instanceof ke ? "cancelled" : "rejected", error: e5 }];
                        case 4:
                          return null == u3 || u3(), [7];
                        case 5:
                          return [2];
                      }
                    });
                  }));
                  return (null == n4 ? void 0 : n4.autoJoin) && y2.push(a4), { result: Ce(v2)(a4), cancel: function() {
                    Me(i3, "task-cancelled");
                  } };
                }), unsubscribe: e3.unsubscribe, subscribe: function() {
                  r2.set(e3.id, e3);
                }, cancelActiveListeners: function() {
                  e3.pending.forEach(function(e4, t2, r3) {
                    e4 !== n3 && (Me(e4, "listener-cancelled"), r3.delete(e4));
                  });
                } })))];
              case 2:
                return p2.sent(), [3, 6];
              case 3:
                return (d2 = p2.sent()) instanceof ke || Be(u2, d2, { raisedBy: "effect" }), [3, 6];
              case 4:
                return [4, Promise.allSettled(s3)];
              case 5:
                return p2.sent(), Me(n3, "listener-completed"), e3.pending.delete(n3), [7];
              case 6:
                return [2];
            }
            var v2, y2;
          });
        });
      }, s2 = function(e3) {
        return function() {
          e3.forEach(Ve), e3.clear();
        };
      }(r2);
      return { middleware: function(e3) {
        return function(n3) {
          return function(t2) {
            if (!C(t2))
              return n3(t2);
            if (Fe.match(t2))
              return c2(t2.payload);
            if (!Ue.match(t2)) {
              if (We.match(t2))
                return f2(t2.payload);
              var i3, o3 = e3.getState(), a3 = function() {
                if (o3 === Re)
                  throw new Error(ze + ": getOriginalState can only be called synchronously");
                return o3;
              };
              try {
                if (i3 = n3(t2), r2.size > 0)
                  for (var d2 = e3.getState(), p2 = Array.from(r2.values()), v2 = 0, y2 = p2; v2 < y2.length; v2++) {
                    var h2 = y2[v2], g2 = false;
                    try {
                      g2 = h2.predicate(t2, d2, o3);
                    } catch (e4) {
                      g2 = false, Be(u2, e4, { raisedBy: "predicate" });
                    }
                    g2 && l2(h2, t2, e3, a3);
                  }
              } finally {
                o3 = Re;
              }
              return i3;
            }
            s2();
          };
        };
      }, startListening: c2, stopListening: f2, clearListeners: s2 };
    }
    var He;
    var Je = "RTK_autoBatch";
    var Ke = function() {
      return function(e2) {
        var n2;
        return { payload: e2, meta: (n2 = {}, n2[Je] = true, n2) };
      };
    };
    var Qe = "function" == typeof queueMicrotask ? queueMicrotask.bind("undefined" != typeof window ? window : "undefined" != typeof global ? global : globalThis) : function(e2) {
      return (He || (He = Promise.resolve())).then(e2).catch(function(e3) {
        return setTimeout(function() {
          throw e3;
        }, 0);
      });
    };
    var Ye = function(e2) {
      return function(n2) {
        setTimeout(n2, e2);
      };
    };
    var Ze = "undefined" != typeof window && window.requestAnimationFrame ? window.requestAnimationFrame : Ye(10);
    var $e = function(e2) {
      return void 0 === e2 && (e2 = { type: "raf" }), function(n2) {
        return function() {
          for (var t2 = [], r2 = 0; r2 < arguments.length; r2++)
            t2[r2] = arguments[r2];
          var i2 = n2.apply(void 0, t2), o2 = true, u2 = false, a2 = false, c2 = /* @__PURE__ */ new Set(), f2 = "tick" === e2.type ? Qe : "raf" === e2.type ? Ze : "callback" === e2.type ? e2.queueNotification : Ye(e2.timeout), l2 = function() {
            a2 = false, u2 && (u2 = false, c2.forEach(function(e3) {
              return e3();
            }));
          };
          return Object.assign({}, i2, { subscribe: function(e3) {
            var n3 = i2.subscribe(function() {
              return o2 && e3();
            });
            return c2.add(e3), function() {
              n3(), c2.delete(e3);
            };
          }, dispatch: function(e3) {
            var n3;
            try {
              return o2 = !(null == (n3 = null == e3 ? void 0 : e3.meta) ? void 0 : n3[Je]), (u2 = !o2) && (a2 || (a2 = true, f2(l2))), i2.dispatch(e3);
            } finally {
              o2 = true;
            }
          } });
        };
      };
    };
    (0, O.enableES5)();
  }
});

// node_modules/@reduxjs/toolkit/dist/redux-toolkit.cjs.development.js
var require_redux_toolkit_cjs_development = __commonJS({
  "node_modules/@reduxjs/toolkit/dist/redux-toolkit.cjs.development.js"(exports) {
    init_cjs_shim();
    var __extends = exports && exports.__extends || function() {
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
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __generator = exports && exports.__generator || function(thisArg, body) {
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
        while (_)
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
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = function(obj, key, value) {
      return key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    };
    var __spreadValues = function(a, b) {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var _i = 0, _c = __getOwnPropSymbols(b); _i < _c.length; _i++) {
          var prop = _c[_i];
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps = function(a, b) {
      return __defProps(a, __getOwnPropDescs(b));
    };
    var __markAsModule = function(target) {
      return __defProp(target, "__esModule", { value: true });
    };
    var __export = function(target, all) {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = function(target, module2, desc) {
      if (module2 && typeof module2 === "object" || typeof module2 === "function") {
        var _loop_1 = function(key2) {
          if (!__hasOwnProp.call(target, key2) && key2 !== "default")
            __defProp(target, key2, { get: function() {
              return module2[key2];
            }, enumerable: !(desc = __getOwnPropDesc(module2, key2)) || desc.enumerable });
        };
        for (var _i = 0, _c = __getOwnPropNames(module2); _i < _c.length; _i++) {
          var key = _c[_i];
          _loop_1(key);
        }
      }
      return target;
    };
    var __toModule = function(module2) {
      return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: function() {
        return module2.default;
      }, enumerable: true } : { value: module2, enumerable: true })), module2);
    };
    var __async = function(__this, __arguments, generator) {
      return new Promise(function(resolve, reject) {
        var fulfilled = function(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = function(value) {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = function(x) {
          return x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        };
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    __markAsModule(exports);
    __export(exports, {
      EnhancerArray: function() {
        return EnhancerArray;
      },
      MiddlewareArray: function() {
        return MiddlewareArray;
      },
      SHOULD_AUTOBATCH: function() {
        return SHOULD_AUTOBATCH;
      },
      TaskAbortError: function() {
        return TaskAbortError;
      },
      addListener: function() {
        return addListener;
      },
      autoBatchEnhancer: function() {
        return autoBatchEnhancer;
      },
      clearAllListeners: function() {
        return clearAllListeners;
      },
      configureStore: function() {
        return configureStore;
      },
      createAction: function() {
        return createAction;
      },
      createActionCreatorInvariantMiddleware: function() {
        return createActionCreatorInvariantMiddleware;
      },
      createAsyncThunk: function() {
        return createAsyncThunk;
      },
      createDraftSafeSelector: function() {
        return createDraftSafeSelector;
      },
      createEntityAdapter: function() {
        return createEntityAdapter;
      },
      createImmutableStateInvariantMiddleware: function() {
        return createImmutableStateInvariantMiddleware;
      },
      createListenerMiddleware: function() {
        return createListenerMiddleware;
      },
      createNextState: function() {
        return import_immer6.default;
      },
      createReducer: function() {
        return createReducer;
      },
      createSelector: function() {
        return import_reselect2.createSelector;
      },
      createSerializableStateInvariantMiddleware: function() {
        return createSerializableStateInvariantMiddleware;
      },
      createSlice: function() {
        return createSlice2;
      },
      current: function() {
        return import_immer6.current;
      },
      findNonSerializableValue: function() {
        return findNonSerializableValue;
      },
      freeze: function() {
        return import_immer6.freeze;
      },
      getDefaultMiddleware: function() {
        return getDefaultMiddleware;
      },
      getType: function() {
        return getType;
      },
      isAction: function() {
        return isAction;
      },
      isActionCreator: function() {
        return isActionCreator;
      },
      isAllOf: function() {
        return isAllOf;
      },
      isAnyOf: function() {
        return isAnyOf;
      },
      isAsyncThunkAction: function() {
        return isAsyncThunkAction;
      },
      isDraft: function() {
        return import_immer6.isDraft;
      },
      isFluxStandardAction: function() {
        return isFSA;
      },
      isFulfilled: function() {
        return isFulfilled;
      },
      isImmutableDefault: function() {
        return isImmutableDefault;
      },
      isPending: function() {
        return isPending;
      },
      isPlain: function() {
        return isPlain;
      },
      isPlainObject: function() {
        return isPlainObject;
      },
      isRejected: function() {
        return isRejected;
      },
      isRejectedWithValue: function() {
        return isRejectedWithValue;
      },
      miniSerializeError: function() {
        return miniSerializeError;
      },
      nanoid: function() {
        return nanoid;
      },
      original: function() {
        return import_immer6.original;
      },
      prepareAutoBatched: function() {
        return prepareAutoBatched;
      },
      removeListener: function() {
        return removeListener;
      },
      unwrapResult: function() {
        return unwrapResult;
      }
    });
    var import_immer5 = __toModule(require_dist());
    __reExport(exports, __toModule(require_redux()));
    var import_immer6 = __toModule(require_dist());
    var import_reselect2 = __toModule(require_lib());
    var import_immer = __toModule(require_dist());
    var import_reselect = __toModule(require_lib());
    var createDraftSafeSelector = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var selector = (0, import_reselect.createSelector).apply(void 0, args);
      var wrappedSelector = function(value) {
        var rest = [];
        for (var _i2 = 1; _i2 < arguments.length; _i2++) {
          rest[_i2 - 1] = arguments[_i2];
        }
        return selector.apply(void 0, __spreadArray([(0, import_immer.isDraft)(value) ? (0, import_immer.current)(value) : value], rest));
      };
      return wrappedSelector;
    };
    var import_redux2 = __toModule(require_redux());
    var import_redux = __toModule(require_redux());
    var composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
      if (arguments.length === 0)
        return void 0;
      if (typeof arguments[0] === "object")
        return import_redux.compose;
      return import_redux.compose.apply(null, arguments);
    };
    var devToolsEnhancer = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ : function() {
      return function(noop2) {
        return noop2;
      };
    };
    function isPlainObject(value) {
      if (typeof value !== "object" || value === null)
        return false;
      var proto = Object.getPrototypeOf(value);
      if (proto === null)
        return true;
      var baseProto = proto;
      while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
      }
      return proto === baseProto;
    }
    var import_redux_thunk = __toModule(require_lib2());
    var hasMatchFunction = function(v) {
      return v && typeof v.match === "function";
    };
    function createAction(type, prepareAction) {
      function actionCreator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (prepareAction) {
          var prepared = prepareAction.apply(void 0, args);
          if (!prepared) {
            throw new Error("prepareAction did not return an object");
          }
          return __spreadValues(__spreadValues({
            type,
            payload: prepared.payload
          }, "meta" in prepared && { meta: prepared.meta }), "error" in prepared && { error: prepared.error });
        }
        return { type, payload: args[0] };
      }
      actionCreator.toString = function() {
        return "" + type;
      };
      actionCreator.type = type;
      actionCreator.match = function(action) {
        return action.type === type;
      };
      return actionCreator;
    }
    function isAction(action) {
      return isPlainObject(action) && "type" in action;
    }
    function isActionCreator(action) {
      return typeof action === "function" && "type" in action && hasMatchFunction(action);
    }
    function isFSA(action) {
      return isAction(action) && typeof action.type === "string" && Object.keys(action).every(isValidKey);
    }
    function isValidKey(key) {
      return ["type", "payload", "error", "meta"].indexOf(key) > -1;
    }
    function getType(actionCreator) {
      return "" + actionCreator;
    }
    function getMessage(type) {
      var splitType = type ? ("" + type).split("/") : [];
      var actionName = splitType[splitType.length - 1] || "actionCreator";
      return 'Detected an action creator with type "' + (type || "unknown") + "\" being dispatched. \nMake sure you're calling the action creator before dispatching, i.e. `dispatch(" + actionName + "())` instead of `dispatch(" + actionName + ")`. This is necessary even if the action has no payload.";
    }
    function createActionCreatorInvariantMiddleware(options) {
      if (options === void 0) {
        options = {};
      }
      if (false) {
        return function() {
          return function(next) {
            return function(action) {
              return next(action);
            };
          };
        };
      }
      var _c = options.isActionCreator, isActionCreator2 = _c === void 0 ? isActionCreator : _c;
      return function() {
        return function(next) {
          return function(action) {
            if (isActionCreator2(action)) {
              console.warn(getMessage(action.type));
            }
            return next(action);
          };
        };
      };
    }
    var import_immer2 = __toModule(require_dist());
    function getTimeMeasureUtils(maxDelay, fnName) {
      var elapsed = 0;
      return {
        measureTime: function(fn) {
          var started = Date.now();
          try {
            return fn();
          } finally {
            var finished = Date.now();
            elapsed += finished - started;
          }
        },
        warnIfExceeded: function() {
          if (elapsed > maxDelay) {
            console.warn(fnName + " took " + elapsed + "ms, which is more than the warning threshold of " + maxDelay + "ms. \nIf your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.\nIt is disabled in production builds, so you don't need to worry about that.");
          }
        }
      };
    }
    var MiddlewareArray = (
      /** @class */
      function(_super) {
        __extends(MiddlewareArray2, _super);
        function MiddlewareArray2() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _this = _super.apply(this, args) || this;
          Object.setPrototypeOf(_this, MiddlewareArray2.prototype);
          return _this;
        }
        Object.defineProperty(MiddlewareArray2, Symbol.species, {
          get: function() {
            return MiddlewareArray2;
          },
          enumerable: false,
          configurable: true
        });
        MiddlewareArray2.prototype.concat = function() {
          var arr = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
          }
          return _super.prototype.concat.apply(this, arr);
        };
        MiddlewareArray2.prototype.prepend = function() {
          var arr = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
          }
          if (arr.length === 1 && Array.isArray(arr[0])) {
            return new (MiddlewareArray2.bind.apply(MiddlewareArray2, __spreadArray([void 0], arr[0].concat(this))))();
          }
          return new (MiddlewareArray2.bind.apply(MiddlewareArray2, __spreadArray([void 0], arr.concat(this))))();
        };
        return MiddlewareArray2;
      }(Array)
    );
    var EnhancerArray = (
      /** @class */
      function(_super) {
        __extends(EnhancerArray2, _super);
        function EnhancerArray2() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _this = _super.apply(this, args) || this;
          Object.setPrototypeOf(_this, EnhancerArray2.prototype);
          return _this;
        }
        Object.defineProperty(EnhancerArray2, Symbol.species, {
          get: function() {
            return EnhancerArray2;
          },
          enumerable: false,
          configurable: true
        });
        EnhancerArray2.prototype.concat = function() {
          var arr = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
          }
          return _super.prototype.concat.apply(this, arr);
        };
        EnhancerArray2.prototype.prepend = function() {
          var arr = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
          }
          if (arr.length === 1 && Array.isArray(arr[0])) {
            return new (EnhancerArray2.bind.apply(EnhancerArray2, __spreadArray([void 0], arr[0].concat(this))))();
          }
          return new (EnhancerArray2.bind.apply(EnhancerArray2, __spreadArray([void 0], arr.concat(this))))();
        };
        return EnhancerArray2;
      }(Array)
    );
    function freezeDraftable(val) {
      return (0, import_immer2.isDraftable)(val) ? (0, import_immer2.default)(val, function() {
      }) : val;
    }
    var isProduction = false;
    var prefix = "Invariant failed";
    function invariant(condition, message) {
      if (condition) {
        return;
      }
      if (isProduction) {
        throw new Error(prefix);
      }
      throw new Error(prefix + ": " + (message || ""));
    }
    function stringify(obj, serializer, indent, decycler) {
      return JSON.stringify(obj, getSerialize(serializer, decycler), indent);
    }
    function getSerialize(serializer, decycler) {
      var stack = [], keys = [];
      if (!decycler)
        decycler = function(_, value) {
          if (stack[0] === value)
            return "[Circular ~]";
          return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
        };
      return function(key, value) {
        if (stack.length > 0) {
          var thisPos = stack.indexOf(this);
          ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
          ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
          if (~stack.indexOf(value))
            value = decycler.call(this, key, value);
        } else
          stack.push(value);
        return serializer == null ? value : serializer.call(this, key, value);
      };
    }
    function isImmutableDefault(value) {
      return typeof value !== "object" || value == null || Object.isFrozen(value);
    }
    function trackForMutations(isImmutable, ignorePaths, obj) {
      var trackedProperties = trackProperties(isImmutable, ignorePaths, obj);
      return {
        detectMutations: function() {
          return detectMutations(isImmutable, ignorePaths, trackedProperties, obj);
        }
      };
    }
    function trackProperties(isImmutable, ignorePaths, obj, path, checkedObjects) {
      if (ignorePaths === void 0) {
        ignorePaths = [];
      }
      if (path === void 0) {
        path = "";
      }
      if (checkedObjects === void 0) {
        checkedObjects = /* @__PURE__ */ new Set();
      }
      var tracked = { value: obj };
      if (!isImmutable(obj) && !checkedObjects.has(obj)) {
        checkedObjects.add(obj);
        tracked.children = {};
        for (var key in obj) {
          var childPath = path ? path + "." + key : key;
          if (ignorePaths.length && ignorePaths.indexOf(childPath) !== -1) {
            continue;
          }
          tracked.children[key] = trackProperties(isImmutable, ignorePaths, obj[key], childPath);
        }
      }
      return tracked;
    }
    function detectMutations(isImmutable, ignoredPaths, trackedProperty, obj, sameParentRef, path) {
      if (ignoredPaths === void 0) {
        ignoredPaths = [];
      }
      if (sameParentRef === void 0) {
        sameParentRef = false;
      }
      if (path === void 0) {
        path = "";
      }
      var prevObj = trackedProperty ? trackedProperty.value : void 0;
      var sameRef = prevObj === obj;
      if (sameParentRef && !sameRef && !Number.isNaN(obj)) {
        return { wasMutated: true, path };
      }
      if (isImmutable(prevObj) || isImmutable(obj)) {
        return { wasMutated: false };
      }
      var keysToDetect = {};
      for (var key in trackedProperty.children) {
        keysToDetect[key] = true;
      }
      for (var key in obj) {
        keysToDetect[key] = true;
      }
      var hasIgnoredPaths = ignoredPaths.length > 0;
      var _loop_2 = function(key2) {
        var nestedPath = path ? path + "." + key2 : key2;
        if (hasIgnoredPaths) {
          var hasMatches = ignoredPaths.some(function(ignored) {
            if (ignored instanceof RegExp) {
              return ignored.test(nestedPath);
            }
            return nestedPath === ignored;
          });
          if (hasMatches) {
            return "continue";
          }
        }
        var result = detectMutations(isImmutable, ignoredPaths, trackedProperty.children[key2], obj[key2], sameRef, nestedPath);
        if (result.wasMutated) {
          return { value: result };
        }
      };
      for (var key in keysToDetect) {
        var state_1 = _loop_2(key);
        if (typeof state_1 === "object")
          return state_1.value;
      }
      return { wasMutated: false };
    }
    function createImmutableStateInvariantMiddleware(options) {
      if (options === void 0) {
        options = {};
      }
      if (false) {
        return function() {
          return function(next) {
            return function(action) {
              return next(action);
            };
          };
        };
      }
      var _c = options.isImmutable, isImmutable = _c === void 0 ? isImmutableDefault : _c, ignoredPaths = options.ignoredPaths, _d = options.warnAfter, warnAfter = _d === void 0 ? 32 : _d, ignore = options.ignore;
      ignoredPaths = ignoredPaths || ignore;
      var track = trackForMutations.bind(null, isImmutable, ignoredPaths);
      return function(_c2) {
        var getState = _c2.getState;
        var state = getState();
        var tracker = track(state);
        var result;
        return function(next) {
          return function(action) {
            var measureUtils = getTimeMeasureUtils(warnAfter, "ImmutableStateInvariantMiddleware");
            measureUtils.measureTime(function() {
              state = getState();
              result = tracker.detectMutations();
              tracker = track(state);
              invariant(!result.wasMutated, "A state mutation was detected between dispatches, in the path '" + (result.path || "") + "'.  This may cause incorrect behavior. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)");
            });
            var dispatchedAction = next(action);
            measureUtils.measureTime(function() {
              state = getState();
              result = tracker.detectMutations();
              tracker = track(state);
              result.wasMutated && invariant(!result.wasMutated, "A state mutation was detected inside a dispatch, in the path: " + (result.path || "") + ". Take a look at the reducer(s) handling the action " + stringify(action) + ". (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)");
            });
            measureUtils.warnIfExceeded();
            return dispatchedAction;
          };
        };
      };
    }
    function isPlain(val) {
      var type = typeof val;
      return val == null || type === "string" || type === "boolean" || type === "number" || Array.isArray(val) || isPlainObject(val);
    }
    function findNonSerializableValue(value, path, isSerializable, getEntries, ignoredPaths, cache) {
      if (path === void 0) {
        path = "";
      }
      if (isSerializable === void 0) {
        isSerializable = isPlain;
      }
      if (ignoredPaths === void 0) {
        ignoredPaths = [];
      }
      var foundNestedSerializable;
      if (!isSerializable(value)) {
        return {
          keyPath: path || "<root>",
          value
        };
      }
      if (typeof value !== "object" || value === null) {
        return false;
      }
      if (cache == null ? void 0 : cache.has(value))
        return false;
      var entries = getEntries != null ? getEntries(value) : Object.entries(value);
      var hasIgnoredPaths = ignoredPaths.length > 0;
      var _loop_3 = function(key2, nestedValue2) {
        var nestedPath = path ? path + "." + key2 : key2;
        if (hasIgnoredPaths) {
          var hasMatches = ignoredPaths.some(function(ignored) {
            if (ignored instanceof RegExp) {
              return ignored.test(nestedPath);
            }
            return nestedPath === ignored;
          });
          if (hasMatches) {
            return "continue";
          }
        }
        if (!isSerializable(nestedValue2)) {
          return { value: {
            keyPath: nestedPath,
            value: nestedValue2
          } };
        }
        if (typeof nestedValue2 === "object") {
          foundNestedSerializable = findNonSerializableValue(nestedValue2, nestedPath, isSerializable, getEntries, ignoredPaths, cache);
          if (foundNestedSerializable) {
            return { value: foundNestedSerializable };
          }
        }
      };
      for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _c = entries_1[_i], key = _c[0], nestedValue = _c[1];
        var state_2 = _loop_3(key, nestedValue);
        if (typeof state_2 === "object")
          return state_2.value;
      }
      if (cache && isNestedFrozen(value))
        cache.add(value);
      return false;
    }
    function isNestedFrozen(value) {
      if (!Object.isFrozen(value))
        return false;
      for (var _i = 0, _c = Object.values(value); _i < _c.length; _i++) {
        var nestedValue = _c[_i];
        if (typeof nestedValue !== "object" || nestedValue === null)
          continue;
        if (!isNestedFrozen(nestedValue))
          return false;
      }
      return true;
    }
    function createSerializableStateInvariantMiddleware(options) {
      if (options === void 0) {
        options = {};
      }
      if (false) {
        return function() {
          return function(next) {
            return function(action) {
              return next(action);
            };
          };
        };
      }
      var _c = options.isSerializable, isSerializable = _c === void 0 ? isPlain : _c, getEntries = options.getEntries, _d = options.ignoredActions, ignoredActions = _d === void 0 ? [] : _d, _e = options.ignoredActionPaths, ignoredActionPaths = _e === void 0 ? ["meta.arg", "meta.baseQueryMeta"] : _e, _f = options.ignoredPaths, ignoredPaths = _f === void 0 ? [] : _f, _g = options.warnAfter, warnAfter = _g === void 0 ? 32 : _g, _h = options.ignoreState, ignoreState = _h === void 0 ? false : _h, _j = options.ignoreActions, ignoreActions = _j === void 0 ? false : _j, _k = options.disableCache, disableCache = _k === void 0 ? false : _k;
      var cache = !disableCache && WeakSet ? /* @__PURE__ */ new WeakSet() : void 0;
      return function(storeAPI) {
        return function(next) {
          return function(action) {
            var result = next(action);
            var measureUtils = getTimeMeasureUtils(warnAfter, "SerializableStateInvariantMiddleware");
            if (!ignoreActions && !(ignoredActions.length && ignoredActions.indexOf(action.type) !== -1)) {
              measureUtils.measureTime(function() {
                var foundActionNonSerializableValue = findNonSerializableValue(action, "", isSerializable, getEntries, ignoredActionPaths, cache);
                if (foundActionNonSerializableValue) {
                  var keyPath = foundActionNonSerializableValue.keyPath, value = foundActionNonSerializableValue.value;
                  console.error("A non-serializable value was detected in an action, in the path: `" + keyPath + "`. Value:", value, "\nTake a look at the logic that dispatched this action: ", action, "\n(See https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)", "\n(To allow non-serializable values see: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data)");
                }
              });
            }
            if (!ignoreState) {
              measureUtils.measureTime(function() {
                var state = storeAPI.getState();
                var foundStateNonSerializableValue = findNonSerializableValue(state, "", isSerializable, getEntries, ignoredPaths, cache);
                if (foundStateNonSerializableValue) {
                  var keyPath = foundStateNonSerializableValue.keyPath, value = foundStateNonSerializableValue.value;
                  console.error("A non-serializable value was detected in the state, in the path: `" + keyPath + "`. Value:", value, "\nTake a look at the reducer(s) handling this action type: " + action.type + ".\n(See https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)");
                }
              });
              measureUtils.warnIfExceeded();
            }
            return result;
          };
        };
      };
    }
    function isBoolean(x) {
      return typeof x === "boolean";
    }
    function curryGetDefaultMiddleware() {
      return function curriedGetDefaultMiddleware(options) {
        return getDefaultMiddleware(options);
      };
    }
    function getDefaultMiddleware(options) {
      if (options === void 0) {
        options = {};
      }
      var _c = options.thunk, thunk = _c === void 0 ? true : _c, _d = options.immutableCheck, immutableCheck = _d === void 0 ? true : _d, _e = options.serializableCheck, serializableCheck = _e === void 0 ? true : _e, _f = options.actionCreatorCheck, actionCreatorCheck = _f === void 0 ? true : _f;
      var middlewareArray = new MiddlewareArray();
      if (thunk) {
        if (isBoolean(thunk)) {
          middlewareArray.push(import_redux_thunk.default);
        } else {
          middlewareArray.push(import_redux_thunk.default.withExtraArgument(thunk.extraArgument));
        }
      }
      if (true) {
        if (immutableCheck) {
          var immutableOptions = {};
          if (!isBoolean(immutableCheck)) {
            immutableOptions = immutableCheck;
          }
          middlewareArray.unshift(createImmutableStateInvariantMiddleware(immutableOptions));
        }
        if (serializableCheck) {
          var serializableOptions = {};
          if (!isBoolean(serializableCheck)) {
            serializableOptions = serializableCheck;
          }
          middlewareArray.push(createSerializableStateInvariantMiddleware(serializableOptions));
        }
        if (actionCreatorCheck) {
          var actionCreatorOptions = {};
          if (!isBoolean(actionCreatorCheck)) {
            actionCreatorOptions = actionCreatorCheck;
          }
          middlewareArray.unshift(createActionCreatorInvariantMiddleware(actionCreatorOptions));
        }
      }
      return middlewareArray;
    }
    var IS_PRODUCTION = false;
    function configureStore(options) {
      var curriedGetDefaultMiddleware = curryGetDefaultMiddleware();
      var _c = options || {}, _d = _c.reducer, reducer = _d === void 0 ? void 0 : _d, _e = _c.middleware, middleware = _e === void 0 ? curriedGetDefaultMiddleware() : _e, _f = _c.devTools, devTools = _f === void 0 ? true : _f, _g = _c.preloadedState, preloadedState = _g === void 0 ? void 0 : _g, _h = _c.enhancers, enhancers = _h === void 0 ? void 0 : _h;
      var rootReducer;
      if (typeof reducer === "function") {
        rootReducer = reducer;
      } else if (isPlainObject(reducer)) {
        rootReducer = (0, import_redux2.combineReducers)(reducer);
      } else {
        throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');
      }
      var finalMiddleware = middleware;
      if (typeof finalMiddleware === "function") {
        finalMiddleware = finalMiddleware(curriedGetDefaultMiddleware);
        if (!IS_PRODUCTION && !Array.isArray(finalMiddleware)) {
          throw new Error("when using a middleware builder function, an array of middleware must be returned");
        }
      }
      if (!IS_PRODUCTION && finalMiddleware.some(function(item) {
        return typeof item !== "function";
      })) {
        throw new Error("each middleware provided to configureStore must be a function");
      }
      var middlewareEnhancer = (0, import_redux2.applyMiddleware).apply(void 0, finalMiddleware);
      var finalCompose = import_redux2.compose;
      if (devTools) {
        finalCompose = composeWithDevTools(__spreadValues({
          trace: !IS_PRODUCTION
        }, typeof devTools === "object" && devTools));
      }
      var defaultEnhancers = new EnhancerArray(middlewareEnhancer);
      var storeEnhancers = defaultEnhancers;
      if (Array.isArray(enhancers)) {
        storeEnhancers = __spreadArray([middlewareEnhancer], enhancers);
      } else if (typeof enhancers === "function") {
        storeEnhancers = enhancers(defaultEnhancers);
      }
      var composedEnhancer = finalCompose.apply(void 0, storeEnhancers);
      return (0, import_redux2.createStore)(rootReducer, preloadedState, composedEnhancer);
    }
    var import_immer3 = __toModule(require_dist());
    function executeReducerBuilderCallback(builderCallback) {
      var actionsMap = {};
      var actionMatchers = [];
      var defaultCaseReducer;
      var builder = {
        addCase: function(typeOrActionCreator, reducer) {
          if (true) {
            if (actionMatchers.length > 0) {
              throw new Error("`builder.addCase` should only be called before calling `builder.addMatcher`");
            }
            if (defaultCaseReducer) {
              throw new Error("`builder.addCase` should only be called before calling `builder.addDefaultCase`");
            }
          }
          var type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
          if (!type) {
            throw new Error("`builder.addCase` cannot be called with an empty action type");
          }
          if (type in actionsMap) {
            throw new Error("`builder.addCase` cannot be called with two reducers for the same action type");
          }
          actionsMap[type] = reducer;
          return builder;
        },
        addMatcher: function(matcher, reducer) {
          if (true) {
            if (defaultCaseReducer) {
              throw new Error("`builder.addMatcher` should only be called before calling `builder.addDefaultCase`");
            }
          }
          actionMatchers.push({ matcher, reducer });
          return builder;
        },
        addDefaultCase: function(reducer) {
          if (true) {
            if (defaultCaseReducer) {
              throw new Error("`builder.addDefaultCase` can only be called once");
            }
          }
          defaultCaseReducer = reducer;
          return builder;
        }
      };
      builderCallback(builder);
      return [actionsMap, actionMatchers, defaultCaseReducer];
    }
    function isStateFunction(x) {
      return typeof x === "function";
    }
    var hasWarnedAboutObjectNotation = false;
    function createReducer(initialState2, mapOrBuilderCallback, actionMatchers, defaultCaseReducer) {
      if (actionMatchers === void 0) {
        actionMatchers = [];
      }
      if (true) {
        if (typeof mapOrBuilderCallback === "object") {
          if (!hasWarnedAboutObjectNotation) {
            hasWarnedAboutObjectNotation = true;
            console.warn("The object notation for `createReducer` is deprecated, and will be removed in RTK 2.0. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createReducer");
          }
        }
      }
      var _c = typeof mapOrBuilderCallback === "function" ? executeReducerBuilderCallback(mapOrBuilderCallback) : [mapOrBuilderCallback, actionMatchers, defaultCaseReducer], actionsMap = _c[0], finalActionMatchers = _c[1], finalDefaultCaseReducer = _c[2];
      var getInitialState;
      if (isStateFunction(initialState2)) {
        getInitialState = function() {
          return freezeDraftable(initialState2());
        };
      } else {
        var frozenInitialState_1 = freezeDraftable(initialState2);
        getInitialState = function() {
          return frozenInitialState_1;
        };
      }
      function reducer(state, action) {
        if (state === void 0) {
          state = getInitialState();
        }
        var caseReducers = __spreadArray([
          actionsMap[action.type]
        ], finalActionMatchers.filter(function(_c2) {
          var matcher = _c2.matcher;
          return matcher(action);
        }).map(function(_c2) {
          var reducer2 = _c2.reducer;
          return reducer2;
        }));
        if (caseReducers.filter(function(cr) {
          return !!cr;
        }).length === 0) {
          caseReducers = [finalDefaultCaseReducer];
        }
        return caseReducers.reduce(function(previousState, caseReducer) {
          if (caseReducer) {
            if ((0, import_immer3.isDraft)(previousState)) {
              var draft = previousState;
              var result = caseReducer(draft, action);
              if (result === void 0) {
                return previousState;
              }
              return result;
            } else if (!(0, import_immer3.isDraftable)(previousState)) {
              var result = caseReducer(previousState, action);
              if (result === void 0) {
                if (previousState === null) {
                  return previousState;
                }
                throw Error("A case reducer on a non-draftable value must not return undefined");
              }
              return result;
            } else {
              return (0, import_immer3.default)(previousState, function(draft2) {
                return caseReducer(draft2, action);
              });
            }
          }
          return previousState;
        }, state);
      }
      reducer.getInitialState = getInitialState;
      return reducer;
    }
    var hasWarnedAboutObjectNotation2 = false;
    function getType2(slice, actionKey) {
      return slice + "/" + actionKey;
    }
    function createSlice2(options) {
      var name = options.name;
      if (!name) {
        throw new Error("`name` is a required option for createSlice");
      }
      if (typeof process !== "undefined" && true) {
        if (options.initialState === void 0) {
          console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
        }
      }
      var initialState2 = typeof options.initialState == "function" ? options.initialState : freezeDraftable(options.initialState);
      var reducers = options.reducers || {};
      var reducerNames = Object.keys(reducers);
      var sliceCaseReducersByName = {};
      var sliceCaseReducersByType = {};
      var actionCreators = {};
      reducerNames.forEach(function(reducerName) {
        var maybeReducerWithPrepare = reducers[reducerName];
        var type = getType2(name, reducerName);
        var caseReducer;
        var prepareCallback;
        if ("reducer" in maybeReducerWithPrepare) {
          caseReducer = maybeReducerWithPrepare.reducer;
          prepareCallback = maybeReducerWithPrepare.prepare;
        } else {
          caseReducer = maybeReducerWithPrepare;
        }
        sliceCaseReducersByName[reducerName] = caseReducer;
        sliceCaseReducersByType[type] = caseReducer;
        actionCreators[reducerName] = prepareCallback ? createAction(type, prepareCallback) : createAction(type);
      });
      function buildReducer() {
        if (true) {
          if (typeof options.extraReducers === "object") {
            if (!hasWarnedAboutObjectNotation2) {
              hasWarnedAboutObjectNotation2 = true;
              console.warn("The object notation for `createSlice.extraReducers` is deprecated, and will be removed in RTK 2.0. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createSlice");
            }
          }
        }
        var _c = typeof options.extraReducers === "function" ? executeReducerBuilderCallback(options.extraReducers) : [options.extraReducers], _d = _c[0], extraReducers = _d === void 0 ? {} : _d, _e = _c[1], actionMatchers = _e === void 0 ? [] : _e, _f = _c[2], defaultCaseReducer = _f === void 0 ? void 0 : _f;
        var finalCaseReducers = __spreadValues(__spreadValues({}, extraReducers), sliceCaseReducersByType);
        return createReducer(initialState2, function(builder) {
          for (var key in finalCaseReducers) {
            builder.addCase(key, finalCaseReducers[key]);
          }
          for (var _i = 0, actionMatchers_1 = actionMatchers; _i < actionMatchers_1.length; _i++) {
            var m = actionMatchers_1[_i];
            builder.addMatcher(m.matcher, m.reducer);
          }
          if (defaultCaseReducer) {
            builder.addDefaultCase(defaultCaseReducer);
          }
        });
      }
      var _reducer;
      return {
        name,
        reducer: function(state, action) {
          if (!_reducer)
            _reducer = buildReducer();
          return _reducer(state, action);
        },
        actions: actionCreators,
        caseReducers: sliceCaseReducersByName,
        getInitialState: function() {
          if (!_reducer)
            _reducer = buildReducer();
          return _reducer.getInitialState();
        }
      };
    }
    function getInitialEntityState() {
      return {
        ids: [],
        entities: {}
      };
    }
    function createInitialStateFactory() {
      function getInitialState(additionalState) {
        if (additionalState === void 0) {
          additionalState = {};
        }
        return Object.assign(getInitialEntityState(), additionalState);
      }
      return { getInitialState };
    }
    function createSelectorsFactory() {
      function getSelectors(selectState) {
        var selectIds = function(state) {
          return state.ids;
        };
        var selectEntities = function(state) {
          return state.entities;
        };
        var selectAll = createDraftSafeSelector(selectIds, selectEntities, function(ids, entities) {
          return ids.map(function(id) {
            return entities[id];
          });
        });
        var selectId = function(_, id) {
          return id;
        };
        var selectById = function(entities, id) {
          return entities[id];
        };
        var selectTotal = createDraftSafeSelector(selectIds, function(ids) {
          return ids.length;
        });
        if (!selectState) {
          return {
            selectIds,
            selectEntities,
            selectAll,
            selectTotal,
            selectById: createDraftSafeSelector(selectEntities, selectId, selectById)
          };
        }
        var selectGlobalizedEntities = createDraftSafeSelector(selectState, selectEntities);
        return {
          selectIds: createDraftSafeSelector(selectState, selectIds),
          selectEntities: selectGlobalizedEntities,
          selectAll: createDraftSafeSelector(selectState, selectAll),
          selectTotal: createDraftSafeSelector(selectState, selectTotal),
          selectById: createDraftSafeSelector(selectGlobalizedEntities, selectId, selectById)
        };
      }
      return { getSelectors };
    }
    var import_immer4 = __toModule(require_dist());
    function createSingleArgumentStateOperator(mutator) {
      var operator = createStateOperator(function(_, state) {
        return mutator(state);
      });
      return function operation(state) {
        return operator(state, void 0);
      };
    }
    function createStateOperator(mutator) {
      return function operation(state, arg) {
        function isPayloadActionArgument(arg2) {
          return isFSA(arg2);
        }
        var runMutator = function(draft) {
          if (isPayloadActionArgument(arg)) {
            mutator(arg.payload, draft);
          } else {
            mutator(arg, draft);
          }
        };
        if ((0, import_immer4.isDraft)(state)) {
          runMutator(state);
          return state;
        } else {
          return (0, import_immer4.default)(state, runMutator);
        }
      };
    }
    function selectIdValue(entity, selectId) {
      var key = selectId(entity);
      if (key === void 0) {
        console.warn("The entity passed to the `selectId` implementation returned undefined.", "You should probably provide your own `selectId` implementation.", "The entity that was passed:", entity, "The `selectId` implementation:", selectId.toString());
      }
      return key;
    }
    function ensureEntitiesArray(entities) {
      if (!Array.isArray(entities)) {
        entities = Object.values(entities);
      }
      return entities;
    }
    function splitAddedUpdatedEntities(newEntities, selectId, state) {
      newEntities = ensureEntitiesArray(newEntities);
      var added = [];
      var updated = [];
      for (var _i = 0, newEntities_1 = newEntities; _i < newEntities_1.length; _i++) {
        var entity = newEntities_1[_i];
        var id = selectIdValue(entity, selectId);
        if (id in state.entities) {
          updated.push({ id, changes: entity });
        } else {
          added.push(entity);
        }
      }
      return [added, updated];
    }
    function createUnsortedStateAdapter(selectId) {
      function addOneMutably(entity, state) {
        var key = selectIdValue(entity, selectId);
        if (key in state.entities) {
          return;
        }
        state.ids.push(key);
        state.entities[key] = entity;
      }
      function addManyMutably(newEntities, state) {
        newEntities = ensureEntitiesArray(newEntities);
        for (var _i = 0, newEntities_2 = newEntities; _i < newEntities_2.length; _i++) {
          var entity = newEntities_2[_i];
          addOneMutably(entity, state);
        }
      }
      function setOneMutably(entity, state) {
        var key = selectIdValue(entity, selectId);
        if (!(key in state.entities)) {
          state.ids.push(key);
        }
        state.entities[key] = entity;
      }
      function setManyMutably(newEntities, state) {
        newEntities = ensureEntitiesArray(newEntities);
        for (var _i = 0, newEntities_3 = newEntities; _i < newEntities_3.length; _i++) {
          var entity = newEntities_3[_i];
          setOneMutably(entity, state);
        }
      }
      function setAllMutably(newEntities, state) {
        newEntities = ensureEntitiesArray(newEntities);
        state.ids = [];
        state.entities = {};
        addManyMutably(newEntities, state);
      }
      function removeOneMutably(key, state) {
        return removeManyMutably([key], state);
      }
      function removeManyMutably(keys, state) {
        var didMutate = false;
        keys.forEach(function(key) {
          if (key in state.entities) {
            delete state.entities[key];
            didMutate = true;
          }
        });
        if (didMutate) {
          state.ids = state.ids.filter(function(id) {
            return id in state.entities;
          });
        }
      }
      function removeAllMutably(state) {
        Object.assign(state, {
          ids: [],
          entities: {}
        });
      }
      function takeNewKey(keys, update, state) {
        var original2 = state.entities[update.id];
        var updated = Object.assign({}, original2, update.changes);
        var newKey = selectIdValue(updated, selectId);
        var hasNewKey = newKey !== update.id;
        if (hasNewKey) {
          keys[update.id] = newKey;
          delete state.entities[update.id];
        }
        state.entities[newKey] = updated;
        return hasNewKey;
      }
      function updateOneMutably(update, state) {
        return updateManyMutably([update], state);
      }
      function updateManyMutably(updates, state) {
        var newKeys = {};
        var updatesPerEntity = {};
        updates.forEach(function(update) {
          if (update.id in state.entities) {
            updatesPerEntity[update.id] = {
              id: update.id,
              changes: __spreadValues(__spreadValues({}, updatesPerEntity[update.id] ? updatesPerEntity[update.id].changes : null), update.changes)
            };
          }
        });
        updates = Object.values(updatesPerEntity);
        var didMutateEntities = updates.length > 0;
        if (didMutateEntities) {
          var didMutateIds = updates.filter(function(update) {
            return takeNewKey(newKeys, update, state);
          }).length > 0;
          if (didMutateIds) {
            state.ids = Object.keys(state.entities);
          }
        }
      }
      function upsertOneMutably(entity, state) {
        return upsertManyMutably([entity], state);
      }
      function upsertManyMutably(newEntities, state) {
        var _c = splitAddedUpdatedEntities(newEntities, selectId, state), added = _c[0], updated = _c[1];
        updateManyMutably(updated, state);
        addManyMutably(added, state);
      }
      return {
        removeAll: createSingleArgumentStateOperator(removeAllMutably),
        addOne: createStateOperator(addOneMutably),
        addMany: createStateOperator(addManyMutably),
        setOne: createStateOperator(setOneMutably),
        setMany: createStateOperator(setManyMutably),
        setAll: createStateOperator(setAllMutably),
        updateOne: createStateOperator(updateOneMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        upsertMany: createStateOperator(upsertManyMutably),
        removeOne: createStateOperator(removeOneMutably),
        removeMany: createStateOperator(removeManyMutably)
      };
    }
    function createSortedStateAdapter(selectId, sort) {
      var _c = createUnsortedStateAdapter(selectId), removeOne = _c.removeOne, removeMany = _c.removeMany, removeAll = _c.removeAll;
      function addOneMutably(entity, state) {
        return addManyMutably([entity], state);
      }
      function addManyMutably(newEntities, state) {
        newEntities = ensureEntitiesArray(newEntities);
        var models = newEntities.filter(function(model) {
          return !(selectIdValue(model, selectId) in state.entities);
        });
        if (models.length !== 0) {
          merge(models, state);
        }
      }
      function setOneMutably(entity, state) {
        return setManyMutably([entity], state);
      }
      function setManyMutably(newEntities, state) {
        newEntities = ensureEntitiesArray(newEntities);
        if (newEntities.length !== 0) {
          merge(newEntities, state);
        }
      }
      function setAllMutably(newEntities, state) {
        newEntities = ensureEntitiesArray(newEntities);
        state.entities = {};
        state.ids = [];
        addManyMutably(newEntities, state);
      }
      function updateOneMutably(update, state) {
        return updateManyMutably([update], state);
      }
      function updateManyMutably(updates, state) {
        var appliedUpdates = false;
        for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
          var update = updates_1[_i];
          var entity = state.entities[update.id];
          if (!entity) {
            continue;
          }
          appliedUpdates = true;
          Object.assign(entity, update.changes);
          var newId = selectId(entity);
          if (update.id !== newId) {
            delete state.entities[update.id];
            state.entities[newId] = entity;
          }
        }
        if (appliedUpdates) {
          resortEntities(state);
        }
      }
      function upsertOneMutably(entity, state) {
        return upsertManyMutably([entity], state);
      }
      function upsertManyMutably(newEntities, state) {
        var _c2 = splitAddedUpdatedEntities(newEntities, selectId, state), added = _c2[0], updated = _c2[1];
        updateManyMutably(updated, state);
        addManyMutably(added, state);
      }
      function areArraysEqual(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        for (var i = 0; i < a.length && i < b.length; i++) {
          if (a[i] === b[i]) {
            continue;
          }
          return false;
        }
        return true;
      }
      function merge(models, state) {
        models.forEach(function(model) {
          state.entities[selectId(model)] = model;
        });
        resortEntities(state);
      }
      function resortEntities(state) {
        var allEntities = Object.values(state.entities);
        allEntities.sort(sort);
        var newSortedIds = allEntities.map(selectId);
        var ids = state.ids;
        if (!areArraysEqual(ids, newSortedIds)) {
          state.ids = newSortedIds;
        }
      }
      return {
        removeOne,
        removeMany,
        removeAll,
        addOne: createStateOperator(addOneMutably),
        updateOne: createStateOperator(updateOneMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        setOne: createStateOperator(setOneMutably),
        setMany: createStateOperator(setManyMutably),
        setAll: createStateOperator(setAllMutably),
        addMany: createStateOperator(addManyMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertMany: createStateOperator(upsertManyMutably)
      };
    }
    function createEntityAdapter(options) {
      if (options === void 0) {
        options = {};
      }
      var _c = __spreadValues({
        sortComparer: false,
        selectId: function(instance) {
          return instance.id;
        }
      }, options), selectId = _c.selectId, sortComparer = _c.sortComparer;
      var stateFactory = createInitialStateFactory();
      var selectorsFactory = createSelectorsFactory();
      var stateAdapter = sortComparer ? createSortedStateAdapter(selectId, sortComparer) : createUnsortedStateAdapter(selectId);
      return __spreadValues(__spreadValues(__spreadValues({
        selectId,
        sortComparer
      }, stateFactory), selectorsFactory), stateAdapter);
    }
    var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
    var nanoid = function(size) {
      if (size === void 0) {
        size = 21;
      }
      var id = "";
      var i = size;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    };
    var commonProperties = [
      "name",
      "message",
      "stack",
      "code"
    ];
    var RejectWithValue = (
      /** @class */
      function() {
        function RejectWithValue2(payload, meta) {
          this.payload = payload;
          this.meta = meta;
        }
        return RejectWithValue2;
      }()
    );
    var FulfillWithMeta = (
      /** @class */
      function() {
        function FulfillWithMeta2(payload, meta) {
          this.payload = payload;
          this.meta = meta;
        }
        return FulfillWithMeta2;
      }()
    );
    var miniSerializeError = function(value) {
      if (typeof value === "object" && value !== null) {
        var simpleError = {};
        for (var _i = 0, commonProperties_1 = commonProperties; _i < commonProperties_1.length; _i++) {
          var property = commonProperties_1[_i];
          if (typeof value[property] === "string") {
            simpleError[property] = value[property];
          }
        }
        return simpleError;
      }
      return { message: String(value) };
    };
    var createAsyncThunk = function() {
      function createAsyncThunk2(typePrefix, payloadCreator, options) {
        var fulfilled = createAction(typePrefix + "/fulfilled", function(payload, requestId, arg, meta) {
          return {
            payload,
            meta: __spreadProps(__spreadValues({}, meta || {}), {
              arg,
              requestId,
              requestStatus: "fulfilled"
            })
          };
        });
        var pending = createAction(typePrefix + "/pending", function(requestId, arg, meta) {
          return {
            payload: void 0,
            meta: __spreadProps(__spreadValues({}, meta || {}), {
              arg,
              requestId,
              requestStatus: "pending"
            })
          };
        });
        var rejected = createAction(typePrefix + "/rejected", function(error, requestId, arg, payload, meta) {
          return {
            payload,
            error: (options && options.serializeError || miniSerializeError)(error || "Rejected"),
            meta: __spreadProps(__spreadValues({}, meta || {}), {
              arg,
              requestId,
              rejectedWithValue: !!payload,
              requestStatus: "rejected",
              aborted: (error == null ? void 0 : error.name) === "AbortError",
              condition: (error == null ? void 0 : error.name) === "ConditionError"
            })
          };
        });
        var displayedWarning = false;
        var AC = typeof AbortController !== "undefined" ? AbortController : (
          /** @class */
          function() {
            function class_1() {
              this.signal = {
                aborted: false,
                addEventListener: function() {
                },
                dispatchEvent: function() {
                  return false;
                },
                onabort: function() {
                },
                removeEventListener: function() {
                },
                reason: void 0,
                throwIfAborted: function() {
                }
              };
            }
            class_1.prototype.abort = function() {
              if (true) {
                if (!displayedWarning) {
                  displayedWarning = true;
                  console.info("This platform does not implement AbortController. \nIf you want to use the AbortController to react to `abort` events, please consider importing a polyfill like 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'.");
                }
              }
            };
            return class_1;
          }()
        );
        function actionCreator(arg) {
          return function(dispatch, getState, extra) {
            var requestId = (options == null ? void 0 : options.idGenerator) ? options.idGenerator(arg) : nanoid();
            var abortController = new AC();
            var abortReason;
            var started = false;
            function abort(reason) {
              abortReason = reason;
              abortController.abort();
            }
            var promise2 = function() {
              return __async(this, null, function() {
                var _a, _b, finalAction, conditionResult, abortedPromise, err_1, skipDispatch;
                return __generator(this, function(_c) {
                  switch (_c.label) {
                    case 0:
                      _c.trys.push([0, 4, , 5]);
                      conditionResult = (_a = options == null ? void 0 : options.condition) == null ? void 0 : _a.call(options, arg, { getState, extra });
                      if (!isThenable(conditionResult))
                        return [3, 2];
                      return [4, conditionResult];
                    case 1:
                      conditionResult = _c.sent();
                      _c.label = 2;
                    case 2:
                      if (conditionResult === false || abortController.signal.aborted) {
                        throw {
                          name: "ConditionError",
                          message: "Aborted due to condition callback returning false."
                        };
                      }
                      started = true;
                      abortedPromise = new Promise(function(_, reject) {
                        return abortController.signal.addEventListener("abort", function() {
                          return reject({
                            name: "AbortError",
                            message: abortReason || "Aborted"
                          });
                        });
                      });
                      dispatch(pending(requestId, arg, (_b = options == null ? void 0 : options.getPendingMeta) == null ? void 0 : _b.call(options, { requestId, arg }, { getState, extra })));
                      return [4, Promise.race([
                        abortedPromise,
                        Promise.resolve(payloadCreator(arg, {
                          dispatch,
                          getState,
                          extra,
                          requestId,
                          signal: abortController.signal,
                          abort,
                          rejectWithValue: function(value, meta) {
                            return new RejectWithValue(value, meta);
                          },
                          fulfillWithValue: function(value, meta) {
                            return new FulfillWithMeta(value, meta);
                          }
                        })).then(function(result) {
                          if (result instanceof RejectWithValue) {
                            throw result;
                          }
                          if (result instanceof FulfillWithMeta) {
                            return fulfilled(result.payload, requestId, arg, result.meta);
                          }
                          return fulfilled(result, requestId, arg);
                        })
                      ])];
                    case 3:
                      finalAction = _c.sent();
                      return [3, 5];
                    case 4:
                      err_1 = _c.sent();
                      finalAction = err_1 instanceof RejectWithValue ? rejected(null, requestId, arg, err_1.payload, err_1.meta) : rejected(err_1, requestId, arg);
                      return [3, 5];
                    case 5:
                      skipDispatch = options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition;
                      if (!skipDispatch) {
                        dispatch(finalAction);
                      }
                      return [2, finalAction];
                  }
                });
              });
            }();
            return Object.assign(promise2, {
              abort,
              requestId,
              arg,
              unwrap: function() {
                return promise2.then(unwrapResult);
              }
            });
          };
        }
        return Object.assign(actionCreator, {
          pending,
          rejected,
          fulfilled,
          typePrefix
        });
      }
      createAsyncThunk2.withTypes = function() {
        return createAsyncThunk2;
      };
      return createAsyncThunk2;
    }();
    function unwrapResult(action) {
      if (action.meta && action.meta.rejectedWithValue) {
        throw action.payload;
      }
      if (action.error) {
        throw action.error;
      }
      return action.payload;
    }
    function isThenable(value) {
      return value !== null && typeof value === "object" && typeof value.then === "function";
    }
    var matches = function(matcher, action) {
      if (hasMatchFunction(matcher)) {
        return matcher.match(action);
      } else {
        return matcher(action);
      }
    };
    function isAnyOf() {
      var matchers = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        matchers[_i] = arguments[_i];
      }
      return function(action) {
        return matchers.some(function(matcher) {
          return matches(matcher, action);
        });
      };
    }
    function isAllOf() {
      var matchers = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        matchers[_i] = arguments[_i];
      }
      return function(action) {
        return matchers.every(function(matcher) {
          return matches(matcher, action);
        });
      };
    }
    function hasExpectedRequestMetadata(action, validStatus) {
      if (!action || !action.meta)
        return false;
      var hasValidRequestId = typeof action.meta.requestId === "string";
      var hasValidRequestStatus = validStatus.indexOf(action.meta.requestStatus) > -1;
      return hasValidRequestId && hasValidRequestStatus;
    }
    function isAsyncThunkArray(a) {
      return typeof a[0] === "function" && "pending" in a[0] && "fulfilled" in a[0] && "rejected" in a[0];
    }
    function isPending() {
      var asyncThunks = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        asyncThunks[_i] = arguments[_i];
      }
      if (asyncThunks.length === 0) {
        return function(action) {
          return hasExpectedRequestMetadata(action, ["pending"]);
        };
      }
      if (!isAsyncThunkArray(asyncThunks)) {
        return isPending()(asyncThunks[0]);
      }
      return function(action) {
        var matchers = asyncThunks.map(function(asyncThunk) {
          return asyncThunk.pending;
        });
        var combinedMatcher = isAnyOf.apply(void 0, matchers);
        return combinedMatcher(action);
      };
    }
    function isRejected() {
      var asyncThunks = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        asyncThunks[_i] = arguments[_i];
      }
      if (asyncThunks.length === 0) {
        return function(action) {
          return hasExpectedRequestMetadata(action, ["rejected"]);
        };
      }
      if (!isAsyncThunkArray(asyncThunks)) {
        return isRejected()(asyncThunks[0]);
      }
      return function(action) {
        var matchers = asyncThunks.map(function(asyncThunk) {
          return asyncThunk.rejected;
        });
        var combinedMatcher = isAnyOf.apply(void 0, matchers);
        return combinedMatcher(action);
      };
    }
    function isRejectedWithValue() {
      var asyncThunks = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        asyncThunks[_i] = arguments[_i];
      }
      var hasFlag = function(action) {
        return action && action.meta && action.meta.rejectedWithValue;
      };
      if (asyncThunks.length === 0) {
        return function(action) {
          var combinedMatcher = isAllOf(isRejected.apply(void 0, asyncThunks), hasFlag);
          return combinedMatcher(action);
        };
      }
      if (!isAsyncThunkArray(asyncThunks)) {
        return isRejectedWithValue()(asyncThunks[0]);
      }
      return function(action) {
        var combinedMatcher = isAllOf(isRejected.apply(void 0, asyncThunks), hasFlag);
        return combinedMatcher(action);
      };
    }
    function isFulfilled() {
      var asyncThunks = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        asyncThunks[_i] = arguments[_i];
      }
      if (asyncThunks.length === 0) {
        return function(action) {
          return hasExpectedRequestMetadata(action, ["fulfilled"]);
        };
      }
      if (!isAsyncThunkArray(asyncThunks)) {
        return isFulfilled()(asyncThunks[0]);
      }
      return function(action) {
        var matchers = asyncThunks.map(function(asyncThunk) {
          return asyncThunk.fulfilled;
        });
        var combinedMatcher = isAnyOf.apply(void 0, matchers);
        return combinedMatcher(action);
      };
    }
    function isAsyncThunkAction() {
      var asyncThunks = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        asyncThunks[_i] = arguments[_i];
      }
      if (asyncThunks.length === 0) {
        return function(action) {
          return hasExpectedRequestMetadata(action, ["pending", "fulfilled", "rejected"]);
        };
      }
      if (!isAsyncThunkArray(asyncThunks)) {
        return isAsyncThunkAction()(asyncThunks[0]);
      }
      return function(action) {
        var matchers = [];
        for (var _i2 = 0, asyncThunks_1 = asyncThunks; _i2 < asyncThunks_1.length; _i2++) {
          var asyncThunk = asyncThunks_1[_i2];
          matchers.push(asyncThunk.pending, asyncThunk.rejected, asyncThunk.fulfilled);
        }
        var combinedMatcher = isAnyOf.apply(void 0, matchers);
        return combinedMatcher(action);
      };
    }
    var assertFunction = function(func, expected) {
      if (typeof func !== "function") {
        throw new TypeError(expected + " is not a function");
      }
    };
    var noop = function() {
    };
    var catchRejection = function(promise2, onError) {
      if (onError === void 0) {
        onError = noop;
      }
      promise2.catch(onError);
      return promise2;
    };
    var addAbortSignalListener = function(abortSignal, callback) {
      abortSignal.addEventListener("abort", callback, { once: true });
      return function() {
        return abortSignal.removeEventListener("abort", callback);
      };
    };
    var abortControllerWithReason = function(abortController, reason) {
      var signal = abortController.signal;
      if (signal.aborted) {
        return;
      }
      if (!("reason" in signal)) {
        Object.defineProperty(signal, "reason", {
          enumerable: true,
          value: reason,
          configurable: true,
          writable: true
        });
      }
      ;
      abortController.abort(reason);
    };
    var task = "task";
    var listener = "listener";
    var completed = "completed";
    var cancelled = "cancelled";
    var taskCancelled = "task-" + cancelled;
    var taskCompleted = "task-" + completed;
    var listenerCancelled = listener + "-" + cancelled;
    var listenerCompleted = listener + "-" + completed;
    var TaskAbortError = (
      /** @class */
      function() {
        function TaskAbortError2(code) {
          this.code = code;
          this.name = "TaskAbortError";
          this.message = task + " " + cancelled + " (reason: " + code + ")";
        }
        return TaskAbortError2;
      }()
    );
    var validateActive = function(signal) {
      if (signal.aborted) {
        throw new TaskAbortError(signal.reason);
      }
    };
    function raceWithSignal(signal, promise2) {
      var cleanup = noop;
      return new Promise(function(resolve, reject) {
        var notifyRejection = function() {
          return reject(new TaskAbortError(signal.reason));
        };
        if (signal.aborted) {
          notifyRejection();
          return;
        }
        cleanup = addAbortSignalListener(signal, notifyRejection);
        promise2.finally(function() {
          return cleanup();
        }).then(resolve, reject);
      }).finally(function() {
        cleanup = noop;
      });
    }
    var runTask = function(task2, cleanUp) {
      return __async(void 0, null, function() {
        var value, error_1;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              _c.trys.push([0, 3, 4, 5]);
              return [4, Promise.resolve()];
            case 1:
              _c.sent();
              return [4, task2()];
            case 2:
              value = _c.sent();
              return [2, {
                status: "ok",
                value
              }];
            case 3:
              error_1 = _c.sent();
              return [2, {
                status: error_1 instanceof TaskAbortError ? "cancelled" : "rejected",
                error: error_1
              }];
            case 4:
              cleanUp == null ? void 0 : cleanUp();
              return [
                7
                /*endfinally*/
              ];
            case 5:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    var createPause = function(signal) {
      return function(promise2) {
        return catchRejection(raceWithSignal(signal, promise2).then(function(output) {
          validateActive(signal);
          return output;
        }));
      };
    };
    var createDelay = function(signal) {
      var pause = createPause(signal);
      return function(timeoutMs) {
        return pause(new Promise(function(resolve) {
          return setTimeout(resolve, timeoutMs);
        }));
      };
    };
    var assign = Object.assign;
    var INTERNAL_NIL_TOKEN = {};
    var alm = "listenerMiddleware";
    var createFork = function(parentAbortSignal, parentBlockingPromises) {
      var linkControllers = function(controller) {
        return addAbortSignalListener(parentAbortSignal, function() {
          return abortControllerWithReason(controller, parentAbortSignal.reason);
        });
      };
      return function(taskExecutor, opts) {
        assertFunction(taskExecutor, "taskExecutor");
        var childAbortController = new AbortController();
        linkControllers(childAbortController);
        var result = runTask(function() {
          return __async(void 0, null, function() {
            var result2;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  validateActive(parentAbortSignal);
                  validateActive(childAbortController.signal);
                  return [4, taskExecutor({
                    pause: createPause(childAbortController.signal),
                    delay: createDelay(childAbortController.signal),
                    signal: childAbortController.signal
                  })];
                case 1:
                  result2 = _c.sent();
                  validateActive(childAbortController.signal);
                  return [2, result2];
              }
            });
          });
        }, function() {
          return abortControllerWithReason(childAbortController, taskCompleted);
        });
        if (opts == null ? void 0 : opts.autoJoin) {
          parentBlockingPromises.push(result);
        }
        return {
          result: createPause(parentAbortSignal)(result),
          cancel: function() {
            abortControllerWithReason(childAbortController, taskCancelled);
          }
        };
      };
    };
    var createTakePattern = function(startListening, signal) {
      var take = function(predicate, timeout) {
        return __async(void 0, null, function() {
          var unsubscribe, tuplePromise, promises, output;
          return __generator(this, function(_c) {
            switch (_c.label) {
              case 0:
                validateActive(signal);
                unsubscribe = function() {
                };
                tuplePromise = new Promise(function(resolve, reject) {
                  var stopListening = startListening({
                    predicate,
                    effect: function(action, listenerApi) {
                      listenerApi.unsubscribe();
                      resolve([
                        action,
                        listenerApi.getState(),
                        listenerApi.getOriginalState()
                      ]);
                    }
                  });
                  unsubscribe = function() {
                    stopListening();
                    reject();
                  };
                });
                promises = [
                  tuplePromise
                ];
                if (timeout != null) {
                  promises.push(new Promise(function(resolve) {
                    return setTimeout(resolve, timeout, null);
                  }));
                }
                _c.label = 1;
              case 1:
                _c.trys.push([1, , 3, 4]);
                return [4, raceWithSignal(signal, Promise.race(promises))];
              case 2:
                output = _c.sent();
                validateActive(signal);
                return [2, output];
              case 3:
                unsubscribe();
                return [
                  7
                  /*endfinally*/
                ];
              case 4:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return function(predicate, timeout) {
        return catchRejection(take(predicate, timeout));
      };
    };
    var getListenerEntryPropsFrom = function(options) {
      var type = options.type, actionCreator = options.actionCreator, matcher = options.matcher, predicate = options.predicate, effect = options.effect;
      if (type) {
        predicate = createAction(type).match;
      } else if (actionCreator) {
        type = actionCreator.type;
        predicate = actionCreator.match;
      } else if (matcher) {
        predicate = matcher;
      } else if (predicate) {
      } else {
        throw new Error("Creating or removing a listener requires one of the known fields for matching an action");
      }
      assertFunction(effect, "options.listener");
      return { predicate, type, effect };
    };
    var createListenerEntry = function(options) {
      var _c = getListenerEntryPropsFrom(options), type = _c.type, predicate = _c.predicate, effect = _c.effect;
      var id = nanoid();
      var entry = {
        id,
        effect,
        type,
        predicate,
        pending: /* @__PURE__ */ new Set(),
        unsubscribe: function() {
          throw new Error("Unsubscribe not initialized");
        }
      };
      return entry;
    };
    var cancelActiveListeners = function(entry) {
      entry.pending.forEach(function(controller) {
        abortControllerWithReason(controller, listenerCancelled);
      });
    };
    var createClearListenerMiddleware = function(listenerMap) {
      return function() {
        listenerMap.forEach(cancelActiveListeners);
        listenerMap.clear();
      };
    };
    var safelyNotifyError = function(errorHandler, errorToNotify, errorInfo) {
      try {
        errorHandler(errorToNotify, errorInfo);
      } catch (errorHandlerError) {
        setTimeout(function() {
          throw errorHandlerError;
        }, 0);
      }
    };
    var addListener = createAction(alm + "/add");
    var clearAllListeners = createAction(alm + "/removeAll");
    var removeListener = createAction(alm + "/remove");
    var defaultErrorHandler = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      console.error.apply(console, __spreadArray([alm + "/error"], args));
    };
    function createListenerMiddleware(middlewareOptions) {
      var _this = this;
      if (middlewareOptions === void 0) {
        middlewareOptions = {};
      }
      var listenerMap = /* @__PURE__ */ new Map();
      var extra = middlewareOptions.extra, _c = middlewareOptions.onError, onError = _c === void 0 ? defaultErrorHandler : _c;
      assertFunction(onError, "onError");
      var insertEntry = function(entry) {
        entry.unsubscribe = function() {
          return listenerMap.delete(entry.id);
        };
        listenerMap.set(entry.id, entry);
        return function(cancelOptions) {
          entry.unsubscribe();
          if (cancelOptions == null ? void 0 : cancelOptions.cancelActive) {
            cancelActiveListeners(entry);
          }
        };
      };
      var findListenerEntry = function(comparator) {
        for (var _i = 0, _c2 = Array.from(listenerMap.values()); _i < _c2.length; _i++) {
          var entry = _c2[_i];
          if (comparator(entry)) {
            return entry;
          }
        }
        return void 0;
      };
      var startListening = function(options) {
        var entry = findListenerEntry(function(existingEntry) {
          return existingEntry.effect === options.effect;
        });
        if (!entry) {
          entry = createListenerEntry(options);
        }
        return insertEntry(entry);
      };
      var stopListening = function(options) {
        var _c2 = getListenerEntryPropsFrom(options), type = _c2.type, effect = _c2.effect, predicate = _c2.predicate;
        var entry = findListenerEntry(function(entry2) {
          var matchPredicateOrType = typeof type === "string" ? entry2.type === type : entry2.predicate === predicate;
          return matchPredicateOrType && entry2.effect === effect;
        });
        if (entry) {
          entry.unsubscribe();
          if (options.cancelActive) {
            cancelActiveListeners(entry);
          }
        }
        return !!entry;
      };
      var notifyListener = function(entry, action, api, getOriginalState) {
        return __async(_this, null, function() {
          var internalTaskController, take, autoJoinPromises, listenerError_1;
          return __generator(this, function(_c2) {
            switch (_c2.label) {
              case 0:
                internalTaskController = new AbortController();
                take = createTakePattern(startListening, internalTaskController.signal);
                autoJoinPromises = [];
                _c2.label = 1;
              case 1:
                _c2.trys.push([1, 3, 4, 6]);
                entry.pending.add(internalTaskController);
                return [4, Promise.resolve(entry.effect(action, assign({}, api, {
                  getOriginalState,
                  condition: function(predicate, timeout) {
                    return take(predicate, timeout).then(Boolean);
                  },
                  take,
                  delay: createDelay(internalTaskController.signal),
                  pause: createPause(internalTaskController.signal),
                  extra,
                  signal: internalTaskController.signal,
                  fork: createFork(internalTaskController.signal, autoJoinPromises),
                  unsubscribe: entry.unsubscribe,
                  subscribe: function() {
                    listenerMap.set(entry.id, entry);
                  },
                  cancelActiveListeners: function() {
                    entry.pending.forEach(function(controller, _, set) {
                      if (controller !== internalTaskController) {
                        abortControllerWithReason(controller, listenerCancelled);
                        set.delete(controller);
                      }
                    });
                  }
                })))];
              case 2:
                _c2.sent();
                return [3, 6];
              case 3:
                listenerError_1 = _c2.sent();
                if (!(listenerError_1 instanceof TaskAbortError)) {
                  safelyNotifyError(onError, listenerError_1, {
                    raisedBy: "effect"
                  });
                }
                return [3, 6];
              case 4:
                return [4, Promise.allSettled(autoJoinPromises)];
              case 5:
                _c2.sent();
                abortControllerWithReason(internalTaskController, listenerCompleted);
                entry.pending.delete(internalTaskController);
                return [
                  7
                  /*endfinally*/
                ];
              case 6:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      var clearListenerMiddleware = createClearListenerMiddleware(listenerMap);
      var middleware = function(api) {
        return function(next) {
          return function(action) {
            if (!isAction(action)) {
              return next(action);
            }
            if (addListener.match(action)) {
              return startListening(action.payload);
            }
            if (clearAllListeners.match(action)) {
              clearListenerMiddleware();
              return;
            }
            if (removeListener.match(action)) {
              return stopListening(action.payload);
            }
            var originalState = api.getState();
            var getOriginalState = function() {
              if (originalState === INTERNAL_NIL_TOKEN) {
                throw new Error(alm + ": getOriginalState can only be called synchronously");
              }
              return originalState;
            };
            var result;
            try {
              result = next(action);
              if (listenerMap.size > 0) {
                var currentState = api.getState();
                var listenerEntries = Array.from(listenerMap.values());
                for (var _i = 0, listenerEntries_1 = listenerEntries; _i < listenerEntries_1.length; _i++) {
                  var entry = listenerEntries_1[_i];
                  var runListener = false;
                  try {
                    runListener = entry.predicate(action, currentState, originalState);
                  } catch (predicateError) {
                    runListener = false;
                    safelyNotifyError(onError, predicateError, {
                      raisedBy: "predicate"
                    });
                  }
                  if (!runListener) {
                    continue;
                  }
                  notifyListener(entry, action, api, getOriginalState);
                }
              }
            } finally {
              originalState = INTERNAL_NIL_TOKEN;
            }
            return result;
          };
        };
      };
      return {
        middleware,
        startListening,
        stopListening,
        clearListeners: clearListenerMiddleware
      };
    }
    var SHOULD_AUTOBATCH = "RTK_autoBatch";
    var prepareAutoBatched = function() {
      return function(payload) {
        var _c;
        return {
          payload,
          meta: (_c = {}, _c[SHOULD_AUTOBATCH] = true, _c)
        };
      };
    };
    var promise;
    var queueMicrotaskShim = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : globalThis) : function(cb) {
      return (promise || (promise = Promise.resolve())).then(cb).catch(function(err) {
        return setTimeout(function() {
          throw err;
        }, 0);
      });
    };
    var createQueueWithTimer = function(timeout) {
      return function(notify) {
        setTimeout(notify, timeout);
      };
    };
    var rAF = typeof window !== "undefined" && window.requestAnimationFrame ? window.requestAnimationFrame : createQueueWithTimer(10);
    var autoBatchEnhancer = function(options) {
      if (options === void 0) {
        options = { type: "raf" };
      }
      return function(next) {
        return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var store = next.apply(void 0, args);
          var notifying = true;
          var shouldNotifyAtEndOfTick = false;
          var notificationQueued = false;
          var listeners = /* @__PURE__ */ new Set();
          var queueCallback = options.type === "tick" ? queueMicrotaskShim : options.type === "raf" ? rAF : options.type === "callback" ? options.queueNotification : createQueueWithTimer(options.timeout);
          var notifyListeners = function() {
            notificationQueued = false;
            if (shouldNotifyAtEndOfTick) {
              shouldNotifyAtEndOfTick = false;
              listeners.forEach(function(l) {
                return l();
              });
            }
          };
          return Object.assign({}, store, {
            subscribe: function(listener2) {
              var wrappedListener = function() {
                return notifying && listener2();
              };
              var unsubscribe = store.subscribe(wrappedListener);
              listeners.add(listener2);
              return function() {
                unsubscribe();
                listeners.delete(listener2);
              };
            },
            dispatch: function(action) {
              var _a;
              try {
                notifying = !((_a = action == null ? void 0 : action.meta) == null ? void 0 : _a[SHOULD_AUTOBATCH]);
                shouldNotifyAtEndOfTick = !notifying;
                if (shouldNotifyAtEndOfTick) {
                  if (!notificationQueued) {
                    notificationQueued = true;
                    queueCallback(notifyListeners);
                  }
                }
                return store.dispatch(action);
              } finally {
                notifying = true;
              }
            }
          });
        };
      };
    };
    (0, import_immer5.enableES5)();
  }
});

// node_modules/@reduxjs/toolkit/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@reduxjs/toolkit/dist/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    if (process.env.NODE_ENV === "production") {
      module.exports = require_redux_toolkit_cjs_production_min();
    } else {
      module.exports = require_redux_toolkit_cjs_development();
    }
  }
});

// src/app.ts
init_cjs_shim();
var import_toolkit = __toESM(require_dist2(), 1);
var initialState = {
  password: "",
  email: "",
  error: "no_error"
};
var loginApp = (0, import_toolkit.createSlice)({
  name: "login app",
  initialState,
  reducers: {
    reset: (state) => {
      state.password = initialState.password;
      state.email = initialState.email;
      state.error = initialState.error;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    signIn: (state) => {
      state.error = checkForErrors(state);
    }
  }
});
var selectRoot = (storeState) => {
  return storeState;
};
var validateEmail = (email) => {
  return email.match(
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
var checkForErrors = (storeState) => {
  console.log("mark32");
  if (!validateEmail(storeState.email)) {
    return "invalidEmail";
  }
  if (storeState.password !== "password" && storeState.email !== "adam@email.com") {
    return "credentialFail";
  }
  return "no_error";
};
var loginPageSelection = (0, import_toolkit.createSelector)([selectRoot], (root) => {
  return {
    ...root,
    disableSubmit: root.email == "" || root.password == ""
  };
});
var app_default = () => {
  const store = (0, import_toolkit.createStore)(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store
  };
};

export {
  require_redux,
  loginApp,
  app_default
};
