import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MyFirstContractTestInput,
  commonGivens,
  features,
  require_inherits,
  require_lib,
  require_lib10,
  require_lib11,
  require_lib12,
  require_lib13,
  require_lib14,
  require_lib15,
  require_lib2,
  require_lib3,
  require_lib4,
  require_lib5,
  require_lib6,
  require_lib7,
  require_lib8,
  require_lib9,
  require_minimalistic_assert,
  require_node_gyp_build
} from "../chunk-JYHLOLG4.mjs";
import {
  Node_default
} from "../chunk-PCRK6YWL.mjs";
import {
  assert
} from "../chunk-D2G2LC5R.mjs";
import "../chunk-SF4FRI4W.mjs";
import "../chunk-ECNFXUXQ.mjs";
import "../chunk-4CEWYGDD.mjs";
import {
  __commonJS,
  __require,
  __toESM,
  init_cjs_shim
} from "../chunk-4UNHOY6E.mjs";

// node_modules/@ethersproject/abstract-provider/lib/_version.js
var require_version = __commonJS({
  "node_modules/@ethersproject/abstract-provider/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "abstract-provider/5.7.0";
  }
});

// node_modules/@ethersproject/abstract-provider/lib/index.js
var require_lib16 = __commonJS({
  "node_modules/@ethersproject/abstract-provider/lib/index.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Provider = exports.TransactionOrderForkEvent = exports.TransactionForkEvent = exports.BlockForkEvent = exports.ForkEvent = void 0;
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version();
    var logger = new logger_1.Logger(_version_1.version);
    var ForkEvent = (
      /** @class */
      function(_super) {
        __extends(ForkEvent2, _super);
        function ForkEvent2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        ForkEvent2.isForkEvent = function(value) {
          return !!(value && value._isForkEvent);
        };
        return ForkEvent2;
      }(properties_1.Description)
    );
    exports.ForkEvent = ForkEvent;
    var BlockForkEvent = (
      /** @class */
      function(_super) {
        __extends(BlockForkEvent2, _super);
        function BlockForkEvent2(blockHash, expiry) {
          var _this = this;
          if (!(0, bytes_1.isHexString)(blockHash, 32)) {
            logger.throwArgumentError("invalid blockHash", "blockHash", blockHash);
          }
          _this = _super.call(this, {
            _isForkEvent: true,
            _isBlockForkEvent: true,
            expiry: expiry || 0,
            blockHash
          }) || this;
          return _this;
        }
        return BlockForkEvent2;
      }(ForkEvent)
    );
    exports.BlockForkEvent = BlockForkEvent;
    var TransactionForkEvent = (
      /** @class */
      function(_super) {
        __extends(TransactionForkEvent2, _super);
        function TransactionForkEvent2(hash, expiry) {
          var _this = this;
          if (!(0, bytes_1.isHexString)(hash, 32)) {
            logger.throwArgumentError("invalid transaction hash", "hash", hash);
          }
          _this = _super.call(this, {
            _isForkEvent: true,
            _isTransactionForkEvent: true,
            expiry: expiry || 0,
            hash
          }) || this;
          return _this;
        }
        return TransactionForkEvent2;
      }(ForkEvent)
    );
    exports.TransactionForkEvent = TransactionForkEvent;
    var TransactionOrderForkEvent = (
      /** @class */
      function(_super) {
        __extends(TransactionOrderForkEvent2, _super);
        function TransactionOrderForkEvent2(beforeHash, afterHash, expiry) {
          var _this = this;
          if (!(0, bytes_1.isHexString)(beforeHash, 32)) {
            logger.throwArgumentError("invalid transaction hash", "beforeHash", beforeHash);
          }
          if (!(0, bytes_1.isHexString)(afterHash, 32)) {
            logger.throwArgumentError("invalid transaction hash", "afterHash", afterHash);
          }
          _this = _super.call(this, {
            _isForkEvent: true,
            _isTransactionOrderForkEvent: true,
            expiry: expiry || 0,
            beforeHash,
            afterHash
          }) || this;
          return _this;
        }
        return TransactionOrderForkEvent2;
      }(ForkEvent)
    );
    exports.TransactionOrderForkEvent = TransactionOrderForkEvent;
    var Provider = (
      /** @class */
      function() {
        function Provider2() {
          var _newTarget = this.constructor;
          logger.checkAbstract(_newTarget, Provider2);
          (0, properties_1.defineReadOnly)(this, "_isProvider", true);
        }
        Provider2.prototype.getFeeData = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a, block, gasPrice, lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, (0, properties_1.resolveProperties)({
                    block: this.getBlock("latest"),
                    gasPrice: this.getGasPrice().catch(function(error) {
                      return null;
                    })
                  })];
                case 1:
                  _a = _b.sent(), block = _a.block, gasPrice = _a.gasPrice;
                  lastBaseFeePerGas = null, maxFeePerGas = null, maxPriorityFeePerGas = null;
                  if (block && block.baseFeePerGas) {
                    lastBaseFeePerGas = block.baseFeePerGas;
                    maxPriorityFeePerGas = bignumber_1.BigNumber.from("1500000000");
                    maxFeePerGas = block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas);
                  }
                  return [2, { lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas, gasPrice }];
              }
            });
          });
        };
        Provider2.prototype.addListener = function(eventName, listener) {
          return this.on(eventName, listener);
        };
        Provider2.prototype.removeListener = function(eventName, listener) {
          return this.off(eventName, listener);
        };
        Provider2.isProvider = function(value) {
          return !!(value && value._isProvider);
        };
        return Provider2;
      }()
    );
    exports.Provider = Provider;
  }
});

// node_modules/@ethersproject/abstract-signer/lib/_version.js
var require_version2 = __commonJS({
  "node_modules/@ethersproject/abstract-signer/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "abstract-signer/5.7.0";
  }
});

// node_modules/@ethersproject/abstract-signer/lib/index.js
var require_lib17 = __commonJS({
  "node_modules/@ethersproject/abstract-signer/lib/index.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VoidSigner = exports.Signer = void 0;
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version2();
    var logger = new logger_1.Logger(_version_1.version);
    var allowedTransactionKeys = [
      "accessList",
      "ccipReadEnabled",
      "chainId",
      "customData",
      "data",
      "from",
      "gasLimit",
      "gasPrice",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "nonce",
      "to",
      "type",
      "value"
    ];
    var forwardErrors = [
      logger_1.Logger.errors.INSUFFICIENT_FUNDS,
      logger_1.Logger.errors.NONCE_EXPIRED,
      logger_1.Logger.errors.REPLACEMENT_UNDERPRICED
    ];
    var Signer = (
      /** @class */
      function() {
        function Signer2() {
          var _newTarget = this.constructor;
          logger.checkAbstract(_newTarget, Signer2);
          (0, properties_1.defineReadOnly)(this, "_isSigner", true);
        }
        Signer2.prototype.getBalance = function(blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("getBalance");
                  return [4, this.provider.getBalance(this.getAddress(), blockTag)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.getTransactionCount = function(blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("getTransactionCount");
                  return [4, this.provider.getTransactionCount(this.getAddress(), blockTag)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.estimateGas = function(transaction) {
          return __awaiter(this, void 0, void 0, function() {
            var tx;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("estimateGas");
                  return [4, (0, properties_1.resolveProperties)(this.checkTransaction(transaction))];
                case 1:
                  tx = _a.sent();
                  return [4, this.provider.estimateGas(tx)];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.call = function(transaction, blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var tx;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("call");
                  return [4, (0, properties_1.resolveProperties)(this.checkTransaction(transaction))];
                case 1:
                  tx = _a.sent();
                  return [4, this.provider.call(tx, blockTag)];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.sendTransaction = function(transaction) {
          return __awaiter(this, void 0, void 0, function() {
            var tx, signedTx;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("sendTransaction");
                  return [4, this.populateTransaction(transaction)];
                case 1:
                  tx = _a.sent();
                  return [4, this.signTransaction(tx)];
                case 2:
                  signedTx = _a.sent();
                  return [4, this.provider.sendTransaction(signedTx)];
                case 3:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.getChainId = function() {
          return __awaiter(this, void 0, void 0, function() {
            var network;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("getChainId");
                  return [4, this.provider.getNetwork()];
                case 1:
                  network = _a.sent();
                  return [2, network.chainId];
              }
            });
          });
        };
        Signer2.prototype.getGasPrice = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("getGasPrice");
                  return [4, this.provider.getGasPrice()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.getFeeData = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("getFeeData");
                  return [4, this.provider.getFeeData()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.resolveName = function(name) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this._checkProvider("resolveName");
                  return [4, this.provider.resolveName(name)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype.checkTransaction = function(transaction) {
          for (var key in transaction) {
            if (allowedTransactionKeys.indexOf(key) === -1) {
              logger.throwArgumentError("invalid transaction key: " + key, "transaction", transaction);
            }
          }
          var tx = (0, properties_1.shallowCopy)(transaction);
          if (tx.from == null) {
            tx.from = this.getAddress();
          } else {
            tx.from = Promise.all([
              Promise.resolve(tx.from),
              this.getAddress()
            ]).then(function(result) {
              if (result[0].toLowerCase() !== result[1].toLowerCase()) {
                logger.throwArgumentError("from address mismatch", "transaction", transaction);
              }
              return result[0];
            });
          }
          return tx;
        };
        Signer2.prototype.populateTransaction = function(transaction) {
          return __awaiter(this, void 0, void 0, function() {
            var tx, hasEip1559, feeData, gasPrice;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, (0, properties_1.resolveProperties)(this.checkTransaction(transaction))];
                case 1:
                  tx = _a.sent();
                  if (tx.to != null) {
                    tx.to = Promise.resolve(tx.to).then(function(to) {
                      return __awaiter(_this, void 0, void 0, function() {
                        var address;
                        return __generator(this, function(_a2) {
                          switch (_a2.label) {
                            case 0:
                              if (to == null) {
                                return [2, null];
                              }
                              return [4, this.resolveName(to)];
                            case 1:
                              address = _a2.sent();
                              if (address == null) {
                                logger.throwArgumentError("provided ENS name resolves to null", "tx.to", to);
                              }
                              return [2, address];
                          }
                        });
                      });
                    });
                    tx.to.catch(function(error) {
                    });
                  }
                  hasEip1559 = tx.maxFeePerGas != null || tx.maxPriorityFeePerGas != null;
                  if (tx.gasPrice != null && (tx.type === 2 || hasEip1559)) {
                    logger.throwArgumentError("eip-1559 transaction do not support gasPrice", "transaction", transaction);
                  } else if ((tx.type === 0 || tx.type === 1) && hasEip1559) {
                    logger.throwArgumentError("pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas", "transaction", transaction);
                  }
                  if (!((tx.type === 2 || tx.type == null) && (tx.maxFeePerGas != null && tx.maxPriorityFeePerGas != null)))
                    return [3, 2];
                  tx.type = 2;
                  return [3, 5];
                case 2:
                  if (!(tx.type === 0 || tx.type === 1))
                    return [3, 3];
                  if (tx.gasPrice == null) {
                    tx.gasPrice = this.getGasPrice();
                  }
                  return [3, 5];
                case 3:
                  return [4, this.getFeeData()];
                case 4:
                  feeData = _a.sent();
                  if (tx.type == null) {
                    if (feeData.maxFeePerGas != null && feeData.maxPriorityFeePerGas != null) {
                      tx.type = 2;
                      if (tx.gasPrice != null) {
                        gasPrice = tx.gasPrice;
                        delete tx.gasPrice;
                        tx.maxFeePerGas = gasPrice;
                        tx.maxPriorityFeePerGas = gasPrice;
                      } else {
                        if (tx.maxFeePerGas == null) {
                          tx.maxFeePerGas = feeData.maxFeePerGas;
                        }
                        if (tx.maxPriorityFeePerGas == null) {
                          tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                        }
                      }
                    } else if (feeData.gasPrice != null) {
                      if (hasEip1559) {
                        logger.throwError("network does not support EIP-1559", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                          operation: "populateTransaction"
                        });
                      }
                      if (tx.gasPrice == null) {
                        tx.gasPrice = feeData.gasPrice;
                      }
                      tx.type = 0;
                    } else {
                      logger.throwError("failed to get consistent fee data", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                        operation: "signer.getFeeData"
                      });
                    }
                  } else if (tx.type === 2) {
                    if (tx.maxFeePerGas == null) {
                      tx.maxFeePerGas = feeData.maxFeePerGas;
                    }
                    if (tx.maxPriorityFeePerGas == null) {
                      tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                    }
                  }
                  _a.label = 5;
                case 5:
                  if (tx.nonce == null) {
                    tx.nonce = this.getTransactionCount("pending");
                  }
                  if (tx.gasLimit == null) {
                    tx.gasLimit = this.estimateGas(tx).catch(function(error) {
                      if (forwardErrors.indexOf(error.code) >= 0) {
                        throw error;
                      }
                      return logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", logger_1.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
                        error,
                        tx
                      });
                    });
                  }
                  if (tx.chainId == null) {
                    tx.chainId = this.getChainId();
                  } else {
                    tx.chainId = Promise.all([
                      Promise.resolve(tx.chainId),
                      this.getChainId()
                    ]).then(function(results) {
                      if (results[1] !== 0 && results[0] !== results[1]) {
                        logger.throwArgumentError("chainId address mismatch", "transaction", transaction);
                      }
                      return results[0];
                    });
                  }
                  return [4, (0, properties_1.resolveProperties)(tx)];
                case 6:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Signer2.prototype._checkProvider = function(operation) {
          if (!this.provider) {
            logger.throwError("missing provider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
              operation: operation || "_checkProvider"
            });
          }
        };
        Signer2.isSigner = function(value) {
          return !!(value && value._isSigner);
        };
        return Signer2;
      }()
    );
    exports.Signer = Signer;
    var VoidSigner = (
      /** @class */
      function(_super) {
        __extends(VoidSigner2, _super);
        function VoidSigner2(address, provider) {
          var _this = _super.call(this) || this;
          (0, properties_1.defineReadOnly)(_this, "address", address);
          (0, properties_1.defineReadOnly)(_this, "provider", provider || null);
          return _this;
        }
        VoidSigner2.prototype.getAddress = function() {
          return Promise.resolve(this.address);
        };
        VoidSigner2.prototype._fail = function(message, operation) {
          return Promise.resolve().then(function() {
            logger.throwError(message, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation });
          });
        };
        VoidSigner2.prototype.signMessage = function(message) {
          return this._fail("VoidSigner cannot sign messages", "signMessage");
        };
        VoidSigner2.prototype.signTransaction = function(transaction) {
          return this._fail("VoidSigner cannot sign transactions", "signTransaction");
        };
        VoidSigner2.prototype._signTypedData = function(domain, types, value) {
          return this._fail("VoidSigner cannot sign typed data", "signTypedData");
        };
        VoidSigner2.prototype.connect = function(provider) {
          return new VoidSigner2(this.address, provider);
        };
        return VoidSigner2;
      }(Signer)
    );
    exports.VoidSigner = VoidSigner;
  }
});

// node_modules/@ethersproject/contracts/lib/_version.js
var require_version3 = __commonJS({
  "node_modules/@ethersproject/contracts/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "contracts/5.7.0";
  }
});

// node_modules/@ethersproject/contracts/lib/index.js
var require_lib18 = __commonJS({
  "node_modules/@ethersproject/contracts/lib/index.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContractFactory = exports.Contract = exports.BaseContract = void 0;
    var abi_1 = require_lib14();
    var abstract_provider_1 = require_lib16();
    var abstract_signer_1 = require_lib17();
    var address_1 = require_lib6();
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var transactions_1 = require_lib10();
    var logger_1 = require_lib();
    var _version_1 = require_version3();
    var logger = new logger_1.Logger(_version_1.version);
    var allowedTransactionKeys = {
      chainId: true,
      data: true,
      from: true,
      gasLimit: true,
      gasPrice: true,
      nonce: true,
      to: true,
      value: true,
      type: true,
      accessList: true,
      maxFeePerGas: true,
      maxPriorityFeePerGas: true,
      customData: true,
      ccipReadEnabled: true
    };
    function resolveName(resolver, nameOrPromise) {
      return __awaiter(this, void 0, void 0, function() {
        var name, address;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, nameOrPromise];
            case 1:
              name = _a.sent();
              if (typeof name !== "string") {
                logger.throwArgumentError("invalid address or ENS name", "name", name);
              }
              try {
                return [2, (0, address_1.getAddress)(name)];
              } catch (error) {
              }
              if (!resolver) {
                logger.throwError("a provider or signer is needed to resolve ENS names", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                  operation: "resolveName"
                });
              }
              return [4, resolver.resolveName(name)];
            case 2:
              address = _a.sent();
              if (address == null) {
                logger.throwArgumentError("resolver or addr is not configured for ENS name", "name", name);
              }
              return [2, address];
          }
        });
      });
    }
    function resolveAddresses(resolver, value, paramType) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!Array.isArray(paramType))
                return [3, 2];
              return [4, Promise.all(paramType.map(function(paramType2, index) {
                return resolveAddresses(resolver, Array.isArray(value) ? value[index] : value[paramType2.name], paramType2);
              }))];
            case 1:
              return [2, _a.sent()];
            case 2:
              if (!(paramType.type === "address"))
                return [3, 4];
              return [4, resolveName(resolver, value)];
            case 3:
              return [2, _a.sent()];
            case 4:
              if (!(paramType.type === "tuple"))
                return [3, 6];
              return [4, resolveAddresses(resolver, value, paramType.components)];
            case 5:
              return [2, _a.sent()];
            case 6:
              if (!(paramType.baseType === "array"))
                return [3, 8];
              if (!Array.isArray(value)) {
                return [2, Promise.reject(logger.makeError("invalid value for array", logger_1.Logger.errors.INVALID_ARGUMENT, {
                  argument: "value",
                  value
                }))];
              }
              return [4, Promise.all(value.map(function(v) {
                return resolveAddresses(resolver, v, paramType.arrayChildren);
              }))];
            case 7:
              return [2, _a.sent()];
            case 8:
              return [2, value];
          }
        });
      });
    }
    function populateTransaction(contract, fragment, args) {
      return __awaiter(this, void 0, void 0, function() {
        var overrides, resolved, data, tx, ro, intrinsic, bytes, i, roValue, leftovers;
        var _this = this;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              overrides = {};
              if (args.length === fragment.inputs.length + 1 && typeof args[args.length - 1] === "object") {
                overrides = (0, properties_1.shallowCopy)(args.pop());
              }
              logger.checkArgumentCount(args.length, fragment.inputs.length, "passed to contract");
              if (contract.signer) {
                if (overrides.from) {
                  overrides.from = (0, properties_1.resolveProperties)({
                    override: resolveName(contract.signer, overrides.from),
                    signer: contract.signer.getAddress()
                  }).then(function(check) {
                    return __awaiter(_this, void 0, void 0, function() {
                      return __generator(this, function(_a2) {
                        if ((0, address_1.getAddress)(check.signer) !== check.override) {
                          logger.throwError("Contract with a Signer cannot override from", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                            operation: "overrides.from"
                          });
                        }
                        return [2, check.override];
                      });
                    });
                  });
                } else {
                  overrides.from = contract.signer.getAddress();
                }
              } else if (overrides.from) {
                overrides.from = resolveName(contract.provider, overrides.from);
              }
              return [4, (0, properties_1.resolveProperties)({
                args: resolveAddresses(contract.signer || contract.provider, args, fragment.inputs),
                address: contract.resolvedAddress,
                overrides: (0, properties_1.resolveProperties)(overrides) || {}
              })];
            case 1:
              resolved = _a.sent();
              data = contract.interface.encodeFunctionData(fragment, resolved.args);
              tx = {
                data,
                to: resolved.address
              };
              ro = resolved.overrides;
              if (ro.nonce != null) {
                tx.nonce = bignumber_1.BigNumber.from(ro.nonce).toNumber();
              }
              if (ro.gasLimit != null) {
                tx.gasLimit = bignumber_1.BigNumber.from(ro.gasLimit);
              }
              if (ro.gasPrice != null) {
                tx.gasPrice = bignumber_1.BigNumber.from(ro.gasPrice);
              }
              if (ro.maxFeePerGas != null) {
                tx.maxFeePerGas = bignumber_1.BigNumber.from(ro.maxFeePerGas);
              }
              if (ro.maxPriorityFeePerGas != null) {
                tx.maxPriorityFeePerGas = bignumber_1.BigNumber.from(ro.maxPriorityFeePerGas);
              }
              if (ro.from != null) {
                tx.from = ro.from;
              }
              if (ro.type != null) {
                tx.type = ro.type;
              }
              if (ro.accessList != null) {
                tx.accessList = (0, transactions_1.accessListify)(ro.accessList);
              }
              if (tx.gasLimit == null && fragment.gas != null) {
                intrinsic = 21e3;
                bytes = (0, bytes_1.arrayify)(data);
                for (i = 0; i < bytes.length; i++) {
                  intrinsic += 4;
                  if (bytes[i]) {
                    intrinsic += 64;
                  }
                }
                tx.gasLimit = bignumber_1.BigNumber.from(fragment.gas).add(intrinsic);
              }
              if (ro.value) {
                roValue = bignumber_1.BigNumber.from(ro.value);
                if (!roValue.isZero() && !fragment.payable) {
                  logger.throwError("non-payable method cannot override value", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: "overrides.value",
                    value: overrides.value
                  });
                }
                tx.value = roValue;
              }
              if (ro.customData) {
                tx.customData = (0, properties_1.shallowCopy)(ro.customData);
              }
              if (ro.ccipReadEnabled) {
                tx.ccipReadEnabled = !!ro.ccipReadEnabled;
              }
              delete overrides.nonce;
              delete overrides.gasLimit;
              delete overrides.gasPrice;
              delete overrides.from;
              delete overrides.value;
              delete overrides.type;
              delete overrides.accessList;
              delete overrides.maxFeePerGas;
              delete overrides.maxPriorityFeePerGas;
              delete overrides.customData;
              delete overrides.ccipReadEnabled;
              leftovers = Object.keys(overrides).filter(function(key) {
                return overrides[key] != null;
              });
              if (leftovers.length) {
                logger.throwError("cannot override " + leftovers.map(function(l) {
                  return JSON.stringify(l);
                }).join(","), logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                  operation: "overrides",
                  overrides: leftovers
                });
              }
              return [2, tx];
          }
        });
      });
    }
    function buildPopulate(contract, fragment) {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return populateTransaction(contract, fragment, args);
      };
    }
    function buildEstimate(contract, fragment) {
      var signerOrProvider = contract.signer || contract.provider;
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function() {
          var tx;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!signerOrProvider) {
                  logger.throwError("estimate require a provider or signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: "estimateGas"
                  });
                }
                return [4, populateTransaction(contract, fragment, args)];
              case 1:
                tx = _a.sent();
                return [4, signerOrProvider.estimateGas(tx)];
              case 2:
                return [2, _a.sent()];
            }
          });
        });
      };
    }
    function addContractWait(contract, tx) {
      var wait = tx.wait.bind(tx);
      tx.wait = function(confirmations) {
        return wait(confirmations).then(function(receipt) {
          receipt.events = receipt.logs.map(function(log) {
            var event = (0, properties_1.deepCopy)(log);
            var parsed = null;
            try {
              parsed = contract.interface.parseLog(log);
            } catch (e) {
            }
            if (parsed) {
              event.args = parsed.args;
              event.decode = function(data, topics) {
                return contract.interface.decodeEventLog(parsed.eventFragment, data, topics);
              };
              event.event = parsed.name;
              event.eventSignature = parsed.signature;
            }
            event.removeListener = function() {
              return contract.provider;
            };
            event.getBlock = function() {
              return contract.provider.getBlock(receipt.blockHash);
            };
            event.getTransaction = function() {
              return contract.provider.getTransaction(receipt.transactionHash);
            };
            event.getTransactionReceipt = function() {
              return Promise.resolve(receipt);
            };
            return event;
          });
          return receipt;
        });
      };
    }
    function buildCall(contract, fragment, collapseSimple) {
      var signerOrProvider = contract.signer || contract.provider;
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function() {
          var blockTag, overrides, tx, result, value;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                blockTag = void 0;
                if (!(args.length === fragment.inputs.length + 1 && typeof args[args.length - 1] === "object"))
                  return [3, 3];
                overrides = (0, properties_1.shallowCopy)(args.pop());
                if (!(overrides.blockTag != null))
                  return [3, 2];
                return [4, overrides.blockTag];
              case 1:
                blockTag = _a.sent();
                _a.label = 2;
              case 2:
                delete overrides.blockTag;
                args.push(overrides);
                _a.label = 3;
              case 3:
                if (!(contract.deployTransaction != null))
                  return [3, 5];
                return [4, contract._deployed(blockTag)];
              case 4:
                _a.sent();
                _a.label = 5;
              case 5:
                return [4, populateTransaction(contract, fragment, args)];
              case 6:
                tx = _a.sent();
                return [4, signerOrProvider.call(tx, blockTag)];
              case 7:
                result = _a.sent();
                try {
                  value = contract.interface.decodeFunctionResult(fragment, result);
                  if (collapseSimple && fragment.outputs.length === 1) {
                    value = value[0];
                  }
                  return [2, value];
                } catch (error) {
                  if (error.code === logger_1.Logger.errors.CALL_EXCEPTION) {
                    error.address = contract.address;
                    error.args = args;
                    error.transaction = tx;
                  }
                  throw error;
                }
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    }
    function buildSend(contract, fragment) {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function() {
          var txRequest, tx;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!contract.signer) {
                  logger.throwError("sending a transaction requires a signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: "sendTransaction"
                  });
                }
                if (!(contract.deployTransaction != null))
                  return [3, 2];
                return [4, contract._deployed()];
              case 1:
                _a.sent();
                _a.label = 2;
              case 2:
                return [4, populateTransaction(contract, fragment, args)];
              case 3:
                txRequest = _a.sent();
                return [4, contract.signer.sendTransaction(txRequest)];
              case 4:
                tx = _a.sent();
                addContractWait(contract, tx);
                return [2, tx];
            }
          });
        });
      };
    }
    function buildDefault(contract, fragment, collapseSimple) {
      if (fragment.constant) {
        return buildCall(contract, fragment, collapseSimple);
      }
      return buildSend(contract, fragment);
    }
    function getEventTag(filter) {
      if (filter.address && (filter.topics == null || filter.topics.length === 0)) {
        return "*";
      }
      return (filter.address || "*") + "@" + (filter.topics ? filter.topics.map(function(topic) {
        if (Array.isArray(topic)) {
          return topic.join("|");
        }
        return topic;
      }).join(":") : "");
    }
    var RunningEvent = (
      /** @class */
      function() {
        function RunningEvent2(tag, filter) {
          (0, properties_1.defineReadOnly)(this, "tag", tag);
          (0, properties_1.defineReadOnly)(this, "filter", filter);
          this._listeners = [];
        }
        RunningEvent2.prototype.addListener = function(listener, once) {
          this._listeners.push({ listener, once });
        };
        RunningEvent2.prototype.removeListener = function(listener) {
          var done = false;
          this._listeners = this._listeners.filter(function(item) {
            if (done || item.listener !== listener) {
              return true;
            }
            done = true;
            return false;
          });
        };
        RunningEvent2.prototype.removeAllListeners = function() {
          this._listeners = [];
        };
        RunningEvent2.prototype.listeners = function() {
          return this._listeners.map(function(i) {
            return i.listener;
          });
        };
        RunningEvent2.prototype.listenerCount = function() {
          return this._listeners.length;
        };
        RunningEvent2.prototype.run = function(args) {
          var _this = this;
          var listenerCount = this.listenerCount();
          this._listeners = this._listeners.filter(function(item) {
            var argsCopy = args.slice();
            setTimeout(function() {
              item.listener.apply(_this, argsCopy);
            }, 0);
            return !item.once;
          });
          return listenerCount;
        };
        RunningEvent2.prototype.prepareEvent = function(event) {
        };
        RunningEvent2.prototype.getEmit = function(event) {
          return [event];
        };
        return RunningEvent2;
      }()
    );
    var ErrorRunningEvent = (
      /** @class */
      function(_super) {
        __extends(ErrorRunningEvent2, _super);
        function ErrorRunningEvent2() {
          return _super.call(this, "error", null) || this;
        }
        return ErrorRunningEvent2;
      }(RunningEvent)
    );
    var FragmentRunningEvent = (
      /** @class */
      function(_super) {
        __extends(FragmentRunningEvent2, _super);
        function FragmentRunningEvent2(address, contractInterface, fragment, topics) {
          var _this = this;
          var filter = {
            address
          };
          var topic = contractInterface.getEventTopic(fragment);
          if (topics) {
            if (topic !== topics[0]) {
              logger.throwArgumentError("topic mismatch", "topics", topics);
            }
            filter.topics = topics.slice();
          } else {
            filter.topics = [topic];
          }
          _this = _super.call(this, getEventTag(filter), filter) || this;
          (0, properties_1.defineReadOnly)(_this, "address", address);
          (0, properties_1.defineReadOnly)(_this, "interface", contractInterface);
          (0, properties_1.defineReadOnly)(_this, "fragment", fragment);
          return _this;
        }
        FragmentRunningEvent2.prototype.prepareEvent = function(event) {
          var _this = this;
          _super.prototype.prepareEvent.call(this, event);
          event.event = this.fragment.name;
          event.eventSignature = this.fragment.format();
          event.decode = function(data, topics) {
            return _this.interface.decodeEventLog(_this.fragment, data, topics);
          };
          try {
            event.args = this.interface.decodeEventLog(this.fragment, event.data, event.topics);
          } catch (error) {
            event.args = null;
            event.decodeError = error;
          }
        };
        FragmentRunningEvent2.prototype.getEmit = function(event) {
          var errors = (0, abi_1.checkResultErrors)(event.args);
          if (errors.length) {
            throw errors[0].error;
          }
          var args = (event.args || []).slice();
          args.push(event);
          return args;
        };
        return FragmentRunningEvent2;
      }(RunningEvent)
    );
    var WildcardRunningEvent = (
      /** @class */
      function(_super) {
        __extends(WildcardRunningEvent2, _super);
        function WildcardRunningEvent2(address, contractInterface) {
          var _this = _super.call(this, "*", { address }) || this;
          (0, properties_1.defineReadOnly)(_this, "address", address);
          (0, properties_1.defineReadOnly)(_this, "interface", contractInterface);
          return _this;
        }
        WildcardRunningEvent2.prototype.prepareEvent = function(event) {
          var _this = this;
          _super.prototype.prepareEvent.call(this, event);
          try {
            var parsed_1 = this.interface.parseLog(event);
            event.event = parsed_1.name;
            event.eventSignature = parsed_1.signature;
            event.decode = function(data, topics) {
              return _this.interface.decodeEventLog(parsed_1.eventFragment, data, topics);
            };
            event.args = parsed_1.args;
          } catch (error) {
          }
        };
        return WildcardRunningEvent2;
      }(RunningEvent)
    );
    var BaseContract = (
      /** @class */
      function() {
        function BaseContract2(addressOrName, contractInterface, signerOrProvider) {
          var _newTarget = this.constructor;
          var _this = this;
          (0, properties_1.defineReadOnly)(this, "interface", (0, properties_1.getStatic)(_newTarget, "getInterface")(contractInterface));
          if (signerOrProvider == null) {
            (0, properties_1.defineReadOnly)(this, "provider", null);
            (0, properties_1.defineReadOnly)(this, "signer", null);
          } else if (abstract_signer_1.Signer.isSigner(signerOrProvider)) {
            (0, properties_1.defineReadOnly)(this, "provider", signerOrProvider.provider || null);
            (0, properties_1.defineReadOnly)(this, "signer", signerOrProvider);
          } else if (abstract_provider_1.Provider.isProvider(signerOrProvider)) {
            (0, properties_1.defineReadOnly)(this, "provider", signerOrProvider);
            (0, properties_1.defineReadOnly)(this, "signer", null);
          } else {
            logger.throwArgumentError("invalid signer or provider", "signerOrProvider", signerOrProvider);
          }
          (0, properties_1.defineReadOnly)(this, "callStatic", {});
          (0, properties_1.defineReadOnly)(this, "estimateGas", {});
          (0, properties_1.defineReadOnly)(this, "functions", {});
          (0, properties_1.defineReadOnly)(this, "populateTransaction", {});
          (0, properties_1.defineReadOnly)(this, "filters", {});
          {
            var uniqueFilters_1 = {};
            Object.keys(this.interface.events).forEach(function(eventSignature) {
              var event = _this.interface.events[eventSignature];
              (0, properties_1.defineReadOnly)(_this.filters, eventSignature, function() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
                }
                return {
                  address: _this.address,
                  topics: _this.interface.encodeFilterTopics(event, args)
                };
              });
              if (!uniqueFilters_1[event.name]) {
                uniqueFilters_1[event.name] = [];
              }
              uniqueFilters_1[event.name].push(eventSignature);
            });
            Object.keys(uniqueFilters_1).forEach(function(name) {
              var filters = uniqueFilters_1[name];
              if (filters.length === 1) {
                (0, properties_1.defineReadOnly)(_this.filters, name, _this.filters[filters[0]]);
              } else {
                logger.warn("Duplicate definition of " + name + " (" + filters.join(", ") + ")");
              }
            });
          }
          (0, properties_1.defineReadOnly)(this, "_runningEvents", {});
          (0, properties_1.defineReadOnly)(this, "_wrappedEmits", {});
          if (addressOrName == null) {
            logger.throwArgumentError("invalid contract address or ENS name", "addressOrName", addressOrName);
          }
          (0, properties_1.defineReadOnly)(this, "address", addressOrName);
          if (this.provider) {
            (0, properties_1.defineReadOnly)(this, "resolvedAddress", resolveName(this.provider, addressOrName));
          } else {
            try {
              (0, properties_1.defineReadOnly)(this, "resolvedAddress", Promise.resolve((0, address_1.getAddress)(addressOrName)));
            } catch (error) {
              logger.throwError("provider is required to use ENS name as contract address", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "new Contract"
              });
            }
          }
          this.resolvedAddress.catch(function(e) {
          });
          var uniqueNames = {};
          var uniqueSignatures = {};
          Object.keys(this.interface.functions).forEach(function(signature) {
            var fragment = _this.interface.functions[signature];
            if (uniqueSignatures[signature]) {
              logger.warn("Duplicate ABI entry for " + JSON.stringify(signature));
              return;
            }
            uniqueSignatures[signature] = true;
            {
              var name_1 = fragment.name;
              if (!uniqueNames["%" + name_1]) {
                uniqueNames["%" + name_1] = [];
              }
              uniqueNames["%" + name_1].push(signature);
            }
            if (_this[signature] == null) {
              (0, properties_1.defineReadOnly)(_this, signature, buildDefault(_this, fragment, true));
            }
            if (_this.functions[signature] == null) {
              (0, properties_1.defineReadOnly)(_this.functions, signature, buildDefault(_this, fragment, false));
            }
            if (_this.callStatic[signature] == null) {
              (0, properties_1.defineReadOnly)(_this.callStatic, signature, buildCall(_this, fragment, true));
            }
            if (_this.populateTransaction[signature] == null) {
              (0, properties_1.defineReadOnly)(_this.populateTransaction, signature, buildPopulate(_this, fragment));
            }
            if (_this.estimateGas[signature] == null) {
              (0, properties_1.defineReadOnly)(_this.estimateGas, signature, buildEstimate(_this, fragment));
            }
          });
          Object.keys(uniqueNames).forEach(function(name) {
            var signatures = uniqueNames[name];
            if (signatures.length > 1) {
              return;
            }
            name = name.substring(1);
            var signature = signatures[0];
            try {
              if (_this[name] == null) {
                (0, properties_1.defineReadOnly)(_this, name, _this[signature]);
              }
            } catch (e) {
            }
            if (_this.functions[name] == null) {
              (0, properties_1.defineReadOnly)(_this.functions, name, _this.functions[signature]);
            }
            if (_this.callStatic[name] == null) {
              (0, properties_1.defineReadOnly)(_this.callStatic, name, _this.callStatic[signature]);
            }
            if (_this.populateTransaction[name] == null) {
              (0, properties_1.defineReadOnly)(_this.populateTransaction, name, _this.populateTransaction[signature]);
            }
            if (_this.estimateGas[name] == null) {
              (0, properties_1.defineReadOnly)(_this.estimateGas, name, _this.estimateGas[signature]);
            }
          });
        }
        BaseContract2.getContractAddress = function(transaction) {
          return (0, address_1.getContractAddress)(transaction);
        };
        BaseContract2.getInterface = function(contractInterface) {
          if (abi_1.Interface.isInterface(contractInterface)) {
            return contractInterface;
          }
          return new abi_1.Interface(contractInterface);
        };
        BaseContract2.prototype.deployed = function() {
          return this._deployed();
        };
        BaseContract2.prototype._deployed = function(blockTag) {
          var _this = this;
          if (!this._deployedPromise) {
            if (this.deployTransaction) {
              this._deployedPromise = this.deployTransaction.wait().then(function() {
                return _this;
              });
            } else {
              this._deployedPromise = this.provider.getCode(this.address, blockTag).then(function(code) {
                if (code === "0x") {
                  logger.throwError("contract not deployed", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    contractAddress: _this.address,
                    operation: "getDeployed"
                  });
                }
                return _this;
              });
            }
          }
          return this._deployedPromise;
        };
        BaseContract2.prototype.fallback = function(overrides) {
          var _this = this;
          if (!this.signer) {
            logger.throwError("sending a transactions require a signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "sendTransaction(fallback)" });
          }
          var tx = (0, properties_1.shallowCopy)(overrides || {});
          ["from", "to"].forEach(function(key) {
            if (tx[key] == null) {
              return;
            }
            logger.throwError("cannot override " + key, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: key });
          });
          tx.to = this.resolvedAddress;
          return this.deployed().then(function() {
            return _this.signer.sendTransaction(tx);
          });
        };
        BaseContract2.prototype.connect = function(signerOrProvider) {
          if (typeof signerOrProvider === "string") {
            signerOrProvider = new abstract_signer_1.VoidSigner(signerOrProvider, this.provider);
          }
          var contract = new this.constructor(this.address, this.interface, signerOrProvider);
          if (this.deployTransaction) {
            (0, properties_1.defineReadOnly)(contract, "deployTransaction", this.deployTransaction);
          }
          return contract;
        };
        BaseContract2.prototype.attach = function(addressOrName) {
          return new this.constructor(addressOrName, this.interface, this.signer || this.provider);
        };
        BaseContract2.isIndexed = function(value) {
          return abi_1.Indexed.isIndexed(value);
        };
        BaseContract2.prototype._normalizeRunningEvent = function(runningEvent) {
          if (this._runningEvents[runningEvent.tag]) {
            return this._runningEvents[runningEvent.tag];
          }
          return runningEvent;
        };
        BaseContract2.prototype._getRunningEvent = function(eventName) {
          if (typeof eventName === "string") {
            if (eventName === "error") {
              return this._normalizeRunningEvent(new ErrorRunningEvent());
            }
            if (eventName === "event") {
              return this._normalizeRunningEvent(new RunningEvent("event", null));
            }
            if (eventName === "*") {
              return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
            }
            var fragment = this.interface.getEvent(eventName);
            return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment));
          }
          if (eventName.topics && eventName.topics.length > 0) {
            try {
              var topic = eventName.topics[0];
              if (typeof topic !== "string") {
                throw new Error("invalid topic");
              }
              var fragment = this.interface.getEvent(topic);
              return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment, eventName.topics));
            } catch (error) {
            }
            var filter = {
              address: this.address,
              topics: eventName.topics
            };
            return this._normalizeRunningEvent(new RunningEvent(getEventTag(filter), filter));
          }
          return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
        };
        BaseContract2.prototype._checkRunningEvents = function(runningEvent) {
          if (runningEvent.listenerCount() === 0) {
            delete this._runningEvents[runningEvent.tag];
            var emit = this._wrappedEmits[runningEvent.tag];
            if (emit && runningEvent.filter) {
              this.provider.off(runningEvent.filter, emit);
              delete this._wrappedEmits[runningEvent.tag];
            }
          }
        };
        BaseContract2.prototype._wrapEvent = function(runningEvent, log, listener) {
          var _this = this;
          var event = (0, properties_1.deepCopy)(log);
          event.removeListener = function() {
            if (!listener) {
              return;
            }
            runningEvent.removeListener(listener);
            _this._checkRunningEvents(runningEvent);
          };
          event.getBlock = function() {
            return _this.provider.getBlock(log.blockHash);
          };
          event.getTransaction = function() {
            return _this.provider.getTransaction(log.transactionHash);
          };
          event.getTransactionReceipt = function() {
            return _this.provider.getTransactionReceipt(log.transactionHash);
          };
          runningEvent.prepareEvent(event);
          return event;
        };
        BaseContract2.prototype._addEventListener = function(runningEvent, listener, once) {
          var _this = this;
          if (!this.provider) {
            logger.throwError("events require a provider or a signer with a provider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "once" });
          }
          runningEvent.addListener(listener, once);
          this._runningEvents[runningEvent.tag] = runningEvent;
          if (!this._wrappedEmits[runningEvent.tag]) {
            var wrappedEmit = function(log) {
              var event = _this._wrapEvent(runningEvent, log, listener);
              if (event.decodeError == null) {
                try {
                  var args = runningEvent.getEmit(event);
                  _this.emit.apply(_this, __spreadArray([runningEvent.filter], args, false));
                } catch (error) {
                  event.decodeError = error.error;
                }
              }
              if (runningEvent.filter != null) {
                _this.emit("event", event);
              }
              if (event.decodeError != null) {
                _this.emit("error", event.decodeError, event);
              }
            };
            this._wrappedEmits[runningEvent.tag] = wrappedEmit;
            if (runningEvent.filter != null) {
              this.provider.on(runningEvent.filter, wrappedEmit);
            }
          }
        };
        BaseContract2.prototype.queryFilter = function(event, fromBlockOrBlockhash, toBlock) {
          var _this = this;
          var runningEvent = this._getRunningEvent(event);
          var filter = (0, properties_1.shallowCopy)(runningEvent.filter);
          if (typeof fromBlockOrBlockhash === "string" && (0, bytes_1.isHexString)(fromBlockOrBlockhash, 32)) {
            if (toBlock != null) {
              logger.throwArgumentError("cannot specify toBlock with blockhash", "toBlock", toBlock);
            }
            filter.blockHash = fromBlockOrBlockhash;
          } else {
            filter.fromBlock = fromBlockOrBlockhash != null ? fromBlockOrBlockhash : 0;
            filter.toBlock = toBlock != null ? toBlock : "latest";
          }
          return this.provider.getLogs(filter).then(function(logs) {
            return logs.map(function(log) {
              return _this._wrapEvent(runningEvent, log, null);
            });
          });
        };
        BaseContract2.prototype.on = function(event, listener) {
          this._addEventListener(this._getRunningEvent(event), listener, false);
          return this;
        };
        BaseContract2.prototype.once = function(event, listener) {
          this._addEventListener(this._getRunningEvent(event), listener, true);
          return this;
        };
        BaseContract2.prototype.emit = function(eventName) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
          }
          if (!this.provider) {
            return false;
          }
          var runningEvent = this._getRunningEvent(eventName);
          var result = runningEvent.run(args) > 0;
          this._checkRunningEvents(runningEvent);
          return result;
        };
        BaseContract2.prototype.listenerCount = function(eventName) {
          var _this = this;
          if (!this.provider) {
            return 0;
          }
          if (eventName == null) {
            return Object.keys(this._runningEvents).reduce(function(accum, key) {
              return accum + _this._runningEvents[key].listenerCount();
            }, 0);
          }
          return this._getRunningEvent(eventName).listenerCount();
        };
        BaseContract2.prototype.listeners = function(eventName) {
          if (!this.provider) {
            return [];
          }
          if (eventName == null) {
            var result_1 = [];
            for (var tag in this._runningEvents) {
              this._runningEvents[tag].listeners().forEach(function(listener) {
                result_1.push(listener);
              });
            }
            return result_1;
          }
          return this._getRunningEvent(eventName).listeners();
        };
        BaseContract2.prototype.removeAllListeners = function(eventName) {
          if (!this.provider) {
            return this;
          }
          if (eventName == null) {
            for (var tag in this._runningEvents) {
              var runningEvent_1 = this._runningEvents[tag];
              runningEvent_1.removeAllListeners();
              this._checkRunningEvents(runningEvent_1);
            }
            return this;
          }
          var runningEvent = this._getRunningEvent(eventName);
          runningEvent.removeAllListeners();
          this._checkRunningEvents(runningEvent);
          return this;
        };
        BaseContract2.prototype.off = function(eventName, listener) {
          if (!this.provider) {
            return this;
          }
          var runningEvent = this._getRunningEvent(eventName);
          runningEvent.removeListener(listener);
          this._checkRunningEvents(runningEvent);
          return this;
        };
        BaseContract2.prototype.removeListener = function(eventName, listener) {
          return this.off(eventName, listener);
        };
        return BaseContract2;
      }()
    );
    exports.BaseContract = BaseContract;
    var Contract = (
      /** @class */
      function(_super) {
        __extends(Contract2, _super);
        function Contract2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return Contract2;
      }(BaseContract)
    );
    exports.Contract = Contract;
    var ContractFactory = (
      /** @class */
      function() {
        function ContractFactory2(contractInterface, bytecode, signer) {
          var _newTarget = this.constructor;
          var bytecodeHex = null;
          if (typeof bytecode === "string") {
            bytecodeHex = bytecode;
          } else if ((0, bytes_1.isBytes)(bytecode)) {
            bytecodeHex = (0, bytes_1.hexlify)(bytecode);
          } else if (bytecode && typeof bytecode.object === "string") {
            bytecodeHex = bytecode.object;
          } else {
            bytecodeHex = "!";
          }
          if (bytecodeHex.substring(0, 2) !== "0x") {
            bytecodeHex = "0x" + bytecodeHex;
          }
          if (!(0, bytes_1.isHexString)(bytecodeHex) || bytecodeHex.length % 2) {
            logger.throwArgumentError("invalid bytecode", "bytecode", bytecode);
          }
          if (signer && !abstract_signer_1.Signer.isSigner(signer)) {
            logger.throwArgumentError("invalid signer", "signer", signer);
          }
          (0, properties_1.defineReadOnly)(this, "bytecode", bytecodeHex);
          (0, properties_1.defineReadOnly)(this, "interface", (0, properties_1.getStatic)(_newTarget, "getInterface")(contractInterface));
          (0, properties_1.defineReadOnly)(this, "signer", signer || null);
        }
        ContractFactory2.prototype.getDeployTransaction = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var tx = {};
          if (args.length === this.interface.deploy.inputs.length + 1 && typeof args[args.length - 1] === "object") {
            tx = (0, properties_1.shallowCopy)(args.pop());
            for (var key in tx) {
              if (!allowedTransactionKeys[key]) {
                throw new Error("unknown transaction override " + key);
              }
            }
          }
          ["data", "from", "to"].forEach(function(key2) {
            if (tx[key2] == null) {
              return;
            }
            logger.throwError("cannot override " + key2, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: key2 });
          });
          if (tx.value) {
            var value = bignumber_1.BigNumber.from(tx.value);
            if (!value.isZero() && !this.interface.deploy.payable) {
              logger.throwError("non-payable constructor cannot override value", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "overrides.value",
                value: tx.value
              });
            }
          }
          logger.checkArgumentCount(args.length, this.interface.deploy.inputs.length, " in Contract constructor");
          tx.data = (0, bytes_1.hexlify)((0, bytes_1.concat)([
            this.bytecode,
            this.interface.encodeDeploy(args)
          ]));
          return tx;
        };
        ContractFactory2.prototype.deploy = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function() {
            var overrides, params, unsignedTx, tx, address, contract;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  overrides = {};
                  if (args.length === this.interface.deploy.inputs.length + 1) {
                    overrides = args.pop();
                  }
                  logger.checkArgumentCount(args.length, this.interface.deploy.inputs.length, " in Contract constructor");
                  return [4, resolveAddresses(this.signer, args, this.interface.deploy.inputs)];
                case 1:
                  params = _a.sent();
                  params.push(overrides);
                  unsignedTx = this.getDeployTransaction.apply(this, params);
                  return [4, this.signer.sendTransaction(unsignedTx)];
                case 2:
                  tx = _a.sent();
                  address = (0, properties_1.getStatic)(this.constructor, "getContractAddress")(tx);
                  contract = (0, properties_1.getStatic)(this.constructor, "getContract")(address, this.interface, this.signer);
                  addContractWait(contract, tx);
                  (0, properties_1.defineReadOnly)(contract, "deployTransaction", tx);
                  return [2, contract];
              }
            });
          });
        };
        ContractFactory2.prototype.attach = function(address) {
          return this.constructor.getContract(address, this.interface, this.signer);
        };
        ContractFactory2.prototype.connect = function(signer) {
          return new this.constructor(this.interface, this.bytecode, signer);
        };
        ContractFactory2.fromSolidity = function(compilerOutput, signer) {
          if (compilerOutput == null) {
            logger.throwError("missing compiler output", logger_1.Logger.errors.MISSING_ARGUMENT, { argument: "compilerOutput" });
          }
          if (typeof compilerOutput === "string") {
            compilerOutput = JSON.parse(compilerOutput);
          }
          var abi = compilerOutput.abi;
          var bytecode = null;
          if (compilerOutput.bytecode) {
            bytecode = compilerOutput.bytecode;
          } else if (compilerOutput.evm && compilerOutput.evm.bytecode) {
            bytecode = compilerOutput.evm.bytecode;
          }
          return new this(abi, bytecode, signer);
        };
        ContractFactory2.getInterface = function(contractInterface) {
          return Contract.getInterface(contractInterface);
        };
        ContractFactory2.getContractAddress = function(tx) {
          return (0, address_1.getContractAddress)(tx);
        };
        ContractFactory2.getContract = function(address, contractInterface, signer) {
          return new Contract(address, contractInterface, signer);
        };
        return ContractFactory2;
      }()
    );
    exports.ContractFactory = ContractFactory;
  }
});

// node_modules/@ethersproject/basex/lib/index.js
var require_lib19 = __commonJS({
  "node_modules/@ethersproject/basex/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Base58 = exports.Base32 = exports.BaseX = void 0;
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var BaseX = (
      /** @class */
      function() {
        function BaseX2(alphabet) {
          (0, properties_1.defineReadOnly)(this, "alphabet", alphabet);
          (0, properties_1.defineReadOnly)(this, "base", alphabet.length);
          (0, properties_1.defineReadOnly)(this, "_alphabetMap", {});
          (0, properties_1.defineReadOnly)(this, "_leader", alphabet.charAt(0));
          for (var i = 0; i < alphabet.length; i++) {
            this._alphabetMap[alphabet.charAt(i)] = i;
          }
        }
        BaseX2.prototype.encode = function(value) {
          var source = (0, bytes_1.arrayify)(value);
          if (source.length === 0) {
            return "";
          }
          var digits = [0];
          for (var i = 0; i < source.length; ++i) {
            var carry = source[i];
            for (var j = 0; j < digits.length; ++j) {
              carry += digits[j] << 8;
              digits[j] = carry % this.base;
              carry = carry / this.base | 0;
            }
            while (carry > 0) {
              digits.push(carry % this.base);
              carry = carry / this.base | 0;
            }
          }
          var string = "";
          for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) {
            string += this._leader;
          }
          for (var q = digits.length - 1; q >= 0; --q) {
            string += this.alphabet[digits[q]];
          }
          return string;
        };
        BaseX2.prototype.decode = function(value) {
          if (typeof value !== "string") {
            throw new TypeError("Expected String");
          }
          var bytes = [];
          if (value.length === 0) {
            return new Uint8Array(bytes);
          }
          bytes.push(0);
          for (var i = 0; i < value.length; i++) {
            var byte = this._alphabetMap[value[i]];
            if (byte === void 0) {
              throw new Error("Non-base" + this.base + " character");
            }
            var carry = byte;
            for (var j = 0; j < bytes.length; ++j) {
              carry += bytes[j] * this.base;
              bytes[j] = carry & 255;
              carry >>= 8;
            }
            while (carry > 0) {
              bytes.push(carry & 255);
              carry >>= 8;
            }
          }
          for (var k = 0; value[k] === this._leader && k < value.length - 1; ++k) {
            bytes.push(0);
          }
          return (0, bytes_1.arrayify)(new Uint8Array(bytes.reverse()));
        };
        return BaseX2;
      }()
    );
    exports.BaseX = BaseX;
    var Base32 = new BaseX("abcdefghijklmnopqrstuvwxyz234567");
    exports.Base32 = Base32;
    var Base58 = new BaseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
    exports.Base58 = Base58;
  }
});

// node_modules/@ethersproject/pbkdf2/lib/pbkdf2.js
var require_pbkdf2 = __commonJS({
  "node_modules/@ethersproject/pbkdf2/lib/pbkdf2.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pbkdf2 = void 0;
    var crypto_1 = __require("crypto");
    var bytes_1 = require_lib2();
    function bufferify(value) {
      return Buffer.from((0, bytes_1.arrayify)(value));
    }
    function pbkdf2(password, salt, iterations, keylen, hashAlgorithm) {
      return (0, bytes_1.hexlify)((0, crypto_1.pbkdf2Sync)(bufferify(password), bufferify(salt), iterations, keylen, hashAlgorithm));
    }
    exports.pbkdf2 = pbkdf2;
  }
});

// node_modules/@ethersproject/pbkdf2/lib/index.js
var require_lib20 = __commonJS({
  "node_modules/@ethersproject/pbkdf2/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pbkdf2 = void 0;
    var pbkdf2_1 = require_pbkdf2();
    Object.defineProperty(exports, "pbkdf2", { enumerable: true, get: function() {
      return pbkdf2_1.pbkdf2;
    } });
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/utils.js
var require_utils = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/utils.js"(exports) {
    "use strict";
    init_cjs_shim();
    var assert2 = require_minimalistic_assert();
    var inherits = require_inherits();
    exports.inherits = inherits;
    function isSurrogatePair(msg, i) {
      if ((msg.charCodeAt(i) & 64512) !== 55296) {
        return false;
      }
      if (i < 0 || i + 1 >= msg.length) {
        return false;
      }
      return (msg.charCodeAt(i + 1) & 64512) === 56320;
    }
    function toArray(msg, enc) {
      if (Array.isArray(msg))
        return msg.slice();
      if (!msg)
        return [];
      var res = [];
      if (typeof msg === "string") {
        if (!enc) {
          var p = 0;
          for (var i = 0; i < msg.length; i++) {
            var c = msg.charCodeAt(i);
            if (c < 128) {
              res[p++] = c;
            } else if (c < 2048) {
              res[p++] = c >> 6 | 192;
              res[p++] = c & 63 | 128;
            } else if (isSurrogatePair(msg, i)) {
              c = 65536 + ((c & 1023) << 10) + (msg.charCodeAt(++i) & 1023);
              res[p++] = c >> 18 | 240;
              res[p++] = c >> 12 & 63 | 128;
              res[p++] = c >> 6 & 63 | 128;
              res[p++] = c & 63 | 128;
            } else {
              res[p++] = c >> 12 | 224;
              res[p++] = c >> 6 & 63 | 128;
              res[p++] = c & 63 | 128;
            }
          }
        } else if (enc === "hex") {
          msg = msg.replace(/[^a-z0-9]+/ig, "");
          if (msg.length % 2 !== 0)
            msg = "0" + msg;
          for (i = 0; i < msg.length; i += 2)
            res.push(parseInt(msg[i] + msg[i + 1], 16));
        }
      } else {
        for (i = 0; i < msg.length; i++)
          res[i] = msg[i] | 0;
      }
      return res;
    }
    exports.toArray = toArray;
    function toHex(msg) {
      var res = "";
      for (var i = 0; i < msg.length; i++)
        res += zero2(msg[i].toString(16));
      return res;
    }
    exports.toHex = toHex;
    function htonl(w) {
      var res = w >>> 24 | w >>> 8 & 65280 | w << 8 & 16711680 | (w & 255) << 24;
      return res >>> 0;
    }
    exports.htonl = htonl;
    function toHex32(msg, endian) {
      var res = "";
      for (var i = 0; i < msg.length; i++) {
        var w = msg[i];
        if (endian === "little")
          w = htonl(w);
        res += zero8(w.toString(16));
      }
      return res;
    }
    exports.toHex32 = toHex32;
    function zero2(word) {
      if (word.length === 1)
        return "0" + word;
      else
        return word;
    }
    exports.zero2 = zero2;
    function zero8(word) {
      if (word.length === 7)
        return "0" + word;
      else if (word.length === 6)
        return "00" + word;
      else if (word.length === 5)
        return "000" + word;
      else if (word.length === 4)
        return "0000" + word;
      else if (word.length === 3)
        return "00000" + word;
      else if (word.length === 2)
        return "000000" + word;
      else if (word.length === 1)
        return "0000000" + word;
      else
        return word;
    }
    exports.zero8 = zero8;
    function join32(msg, start, end, endian) {
      var len = end - start;
      assert2(len % 4 === 0);
      var res = new Array(len / 4);
      for (var i = 0, k = start; i < res.length; i++, k += 4) {
        var w;
        if (endian === "big")
          w = msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3];
        else
          w = msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
        res[i] = w >>> 0;
      }
      return res;
    }
    exports.join32 = join32;
    function split32(msg, endian) {
      var res = new Array(msg.length * 4);
      for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
        var m = msg[i];
        if (endian === "big") {
          res[k] = m >>> 24;
          res[k + 1] = m >>> 16 & 255;
          res[k + 2] = m >>> 8 & 255;
          res[k + 3] = m & 255;
        } else {
          res[k + 3] = m >>> 24;
          res[k + 2] = m >>> 16 & 255;
          res[k + 1] = m >>> 8 & 255;
          res[k] = m & 255;
        }
      }
      return res;
    }
    exports.split32 = split32;
    function rotr32(w, b) {
      return w >>> b | w << 32 - b;
    }
    exports.rotr32 = rotr32;
    function rotl32(w, b) {
      return w << b | w >>> 32 - b;
    }
    exports.rotl32 = rotl32;
    function sum32(a, b) {
      return a + b >>> 0;
    }
    exports.sum32 = sum32;
    function sum32_3(a, b, c) {
      return a + b + c >>> 0;
    }
    exports.sum32_3 = sum32_3;
    function sum32_4(a, b, c, d) {
      return a + b + c + d >>> 0;
    }
    exports.sum32_4 = sum32_4;
    function sum32_5(a, b, c, d, e) {
      return a + b + c + d + e >>> 0;
    }
    exports.sum32_5 = sum32_5;
    function sum64(buf, pos, ah, al) {
      var bh = buf[pos];
      var bl = buf[pos + 1];
      var lo = al + bl >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      buf[pos] = hi >>> 0;
      buf[pos + 1] = lo;
    }
    exports.sum64 = sum64;
    function sum64_hi(ah, al, bh, bl) {
      var lo = al + bl >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      return hi >>> 0;
    }
    exports.sum64_hi = sum64_hi;
    function sum64_lo(ah, al, bh, bl) {
      var lo = al + bl;
      return lo >>> 0;
    }
    exports.sum64_lo = sum64_lo;
    function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
      var carry = 0;
      var lo = al;
      lo = lo + bl >>> 0;
      carry += lo < al ? 1 : 0;
      lo = lo + cl >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = lo + dl >>> 0;
      carry += lo < dl ? 1 : 0;
      var hi = ah + bh + ch + dh + carry;
      return hi >>> 0;
    }
    exports.sum64_4_hi = sum64_4_hi;
    function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
      var lo = al + bl + cl + dl;
      return lo >>> 0;
    }
    exports.sum64_4_lo = sum64_4_lo;
    function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var carry = 0;
      var lo = al;
      lo = lo + bl >>> 0;
      carry += lo < al ? 1 : 0;
      lo = lo + cl >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = lo + dl >>> 0;
      carry += lo < dl ? 1 : 0;
      lo = lo + el >>> 0;
      carry += lo < el ? 1 : 0;
      var hi = ah + bh + ch + dh + eh + carry;
      return hi >>> 0;
    }
    exports.sum64_5_hi = sum64_5_hi;
    function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var lo = al + bl + cl + dl + el;
      return lo >>> 0;
    }
    exports.sum64_5_lo = sum64_5_lo;
    function rotr64_hi(ah, al, num) {
      var r = al << 32 - num | ah >>> num;
      return r >>> 0;
    }
    exports.rotr64_hi = rotr64_hi;
    function rotr64_lo(ah, al, num) {
      var r = ah << 32 - num | al >>> num;
      return r >>> 0;
    }
    exports.rotr64_lo = rotr64_lo;
    function shr64_hi(ah, al, num) {
      return ah >>> num;
    }
    exports.shr64_hi = shr64_hi;
    function shr64_lo(ah, al, num) {
      var r = ah << 32 - num | al >>> num;
      return r >>> 0;
    }
    exports.shr64_lo = shr64_lo;
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/common.js
var require_common = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/common.js"(exports) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var assert2 = require_minimalistic_assert();
    function BlockHash() {
      this.pending = null;
      this.pendingTotal = 0;
      this.blockSize = this.constructor.blockSize;
      this.outSize = this.constructor.outSize;
      this.hmacStrength = this.constructor.hmacStrength;
      this.padLength = this.constructor.padLength / 8;
      this.endian = "big";
      this._delta8 = this.blockSize / 8;
      this._delta32 = this.blockSize / 32;
    }
    exports.BlockHash = BlockHash;
    BlockHash.prototype.update = function update(msg, enc) {
      msg = utils.toArray(msg, enc);
      if (!this.pending)
        this.pending = msg;
      else
        this.pending = this.pending.concat(msg);
      this.pendingTotal += msg.length;
      if (this.pending.length >= this._delta8) {
        msg = this.pending;
        var r = msg.length % this._delta8;
        this.pending = msg.slice(msg.length - r, msg.length);
        if (this.pending.length === 0)
          this.pending = null;
        msg = utils.join32(msg, 0, msg.length - r, this.endian);
        for (var i = 0; i < msg.length; i += this._delta32)
          this._update(msg, i, i + this._delta32);
      }
      return this;
    };
    BlockHash.prototype.digest = function digest(enc) {
      this.update(this._pad());
      assert2(this.pending === null);
      return this._digest(enc);
    };
    BlockHash.prototype._pad = function pad() {
      var len = this.pendingTotal;
      var bytes = this._delta8;
      var k = bytes - (len + this.padLength) % bytes;
      var res = new Array(k + this.padLength);
      res[0] = 128;
      for (var i = 1; i < k; i++)
        res[i] = 0;
      len <<= 3;
      if (this.endian === "big") {
        for (var t = 8; t < this.padLength; t++)
          res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = len >>> 24 & 255;
        res[i++] = len >>> 16 & 255;
        res[i++] = len >>> 8 & 255;
        res[i++] = len & 255;
      } else {
        res[i++] = len & 255;
        res[i++] = len >>> 8 & 255;
        res[i++] = len >>> 16 & 255;
        res[i++] = len >>> 24 & 255;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        for (t = 8; t < this.padLength; t++)
          res[i++] = 0;
      }
      return res;
    };
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/common.js
var require_common2 = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/common.js"(exports) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var rotr32 = utils.rotr32;
    function ft_1(s, x, y, z) {
      if (s === 0)
        return ch32(x, y, z);
      if (s === 1 || s === 3)
        return p32(x, y, z);
      if (s === 2)
        return maj32(x, y, z);
    }
    exports.ft_1 = ft_1;
    function ch32(x, y, z) {
      return x & y ^ ~x & z;
    }
    exports.ch32 = ch32;
    function maj32(x, y, z) {
      return x & y ^ x & z ^ y & z;
    }
    exports.maj32 = maj32;
    function p32(x, y, z) {
      return x ^ y ^ z;
    }
    exports.p32 = p32;
    function s0_256(x) {
      return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
    }
    exports.s0_256 = s0_256;
    function s1_256(x) {
      return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
    }
    exports.s1_256 = s1_256;
    function g0_256(x) {
      return rotr32(x, 7) ^ rotr32(x, 18) ^ x >>> 3;
    }
    exports.g0_256 = g0_256;
    function g1_256(x) {
      return rotr32(x, 17) ^ rotr32(x, 19) ^ x >>> 10;
    }
    exports.g1_256 = g1_256;
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/1.js
var require__ = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/1.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var common = require_common();
    var shaCommon = require_common2();
    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_5 = utils.sum32_5;
    var ft_1 = shaCommon.ft_1;
    var BlockHash = common.BlockHash;
    var sha1_K = [
      1518500249,
      1859775393,
      2400959708,
      3395469782
    ];
    function SHA1() {
      if (!(this instanceof SHA1))
        return new SHA1();
      BlockHash.call(this);
      this.h = [
        1732584193,
        4023233417,
        2562383102,
        271733878,
        3285377520
      ];
      this.W = new Array(80);
    }
    utils.inherits(SHA1, BlockHash);
    module.exports = SHA1;
    SHA1.blockSize = 512;
    SHA1.outSize = 160;
    SHA1.hmacStrength = 80;
    SHA1.padLength = 64;
    SHA1.prototype._update = function _update(msg, start) {
      var W = this.W;
      for (var i = 0; i < 16; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i++)
        W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      for (i = 0; i < W.length; i++) {
        var s = ~~(i / 20);
        var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
        e = d;
        d = c;
        c = rotl32(b, 30);
        b = a;
        a = t;
      }
      this.h[0] = sum32(this.h[0], a);
      this.h[1] = sum32(this.h[1], b);
      this.h[2] = sum32(this.h[2], c);
      this.h[3] = sum32(this.h[3], d);
      this.h[4] = sum32(this.h[4], e);
    };
    SHA1.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "big");
      else
        return utils.split32(this.h, "big");
    };
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/256.js
var require__2 = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/256.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var common = require_common();
    var shaCommon = require_common2();
    var assert2 = require_minimalistic_assert();
    var sum32 = utils.sum32;
    var sum32_4 = utils.sum32_4;
    var sum32_5 = utils.sum32_5;
    var ch32 = shaCommon.ch32;
    var maj32 = shaCommon.maj32;
    var s0_256 = shaCommon.s0_256;
    var s1_256 = shaCommon.s1_256;
    var g0_256 = shaCommon.g0_256;
    var g1_256 = shaCommon.g1_256;
    var BlockHash = common.BlockHash;
    var sha256_K = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    function SHA256() {
      if (!(this instanceof SHA256))
        return new SHA256();
      BlockHash.call(this);
      this.h = [
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ];
      this.k = sha256_K;
      this.W = new Array(64);
    }
    utils.inherits(SHA256, BlockHash);
    module.exports = SHA256;
    SHA256.blockSize = 512;
    SHA256.outSize = 256;
    SHA256.hmacStrength = 192;
    SHA256.padLength = 64;
    SHA256.prototype._update = function _update(msg, start) {
      var W = this.W;
      for (var i = 0; i < 16; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i++)
        W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);
      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      var f = this.h[5];
      var g = this.h[6];
      var h = this.h[7];
      assert2(this.k.length === W.length);
      for (i = 0; i < W.length; i++) {
        var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
        var T2 = sum32(s0_256(a), maj32(a, b, c));
        h = g;
        g = f;
        f = e;
        e = sum32(d, T1);
        d = c;
        c = b;
        b = a;
        a = sum32(T1, T2);
      }
      this.h[0] = sum32(this.h[0], a);
      this.h[1] = sum32(this.h[1], b);
      this.h[2] = sum32(this.h[2], c);
      this.h[3] = sum32(this.h[3], d);
      this.h[4] = sum32(this.h[4], e);
      this.h[5] = sum32(this.h[5], f);
      this.h[6] = sum32(this.h[6], g);
      this.h[7] = sum32(this.h[7], h);
    };
    SHA256.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "big");
      else
        return utils.split32(this.h, "big");
    };
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/224.js
var require__3 = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/224.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var SHA256 = require__2();
    function SHA224() {
      if (!(this instanceof SHA224))
        return new SHA224();
      SHA256.call(this);
      this.h = [
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ];
    }
    utils.inherits(SHA224, SHA256);
    module.exports = SHA224;
    SHA224.blockSize = 512;
    SHA224.outSize = 224;
    SHA224.hmacStrength = 192;
    SHA224.padLength = 64;
    SHA224.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h.slice(0, 7), "big");
      else
        return utils.split32(this.h.slice(0, 7), "big");
    };
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/512.js
var require__4 = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/512.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var common = require_common();
    var assert2 = require_minimalistic_assert();
    var rotr64_hi = utils.rotr64_hi;
    var rotr64_lo = utils.rotr64_lo;
    var shr64_hi = utils.shr64_hi;
    var shr64_lo = utils.shr64_lo;
    var sum64 = utils.sum64;
    var sum64_hi = utils.sum64_hi;
    var sum64_lo = utils.sum64_lo;
    var sum64_4_hi = utils.sum64_4_hi;
    var sum64_4_lo = utils.sum64_4_lo;
    var sum64_5_hi = utils.sum64_5_hi;
    var sum64_5_lo = utils.sum64_5_lo;
    var BlockHash = common.BlockHash;
    var sha512_K = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function SHA512() {
      if (!(this instanceof SHA512))
        return new SHA512();
      BlockHash.call(this);
      this.h = [
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ];
      this.k = sha512_K;
      this.W = new Array(160);
    }
    utils.inherits(SHA512, BlockHash);
    module.exports = SHA512;
    SHA512.blockSize = 1024;
    SHA512.outSize = 512;
    SHA512.hmacStrength = 192;
    SHA512.padLength = 128;
    SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
      var W = this.W;
      for (var i = 0; i < 32; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i += 2) {
        var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);
        var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
        var c1_hi = W[i - 14];
        var c1_lo = W[i - 13];
        var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);
        var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
        var c3_hi = W[i - 32];
        var c3_lo = W[i - 31];
        W[i] = sum64_4_hi(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo
        );
        W[i + 1] = sum64_4_lo(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo
        );
      }
    };
    SHA512.prototype._update = function _update(msg, start) {
      this._prepareBlock(msg, start);
      var W = this.W;
      var ah = this.h[0];
      var al = this.h[1];
      var bh = this.h[2];
      var bl = this.h[3];
      var ch = this.h[4];
      var cl = this.h[5];
      var dh = this.h[6];
      var dl = this.h[7];
      var eh = this.h[8];
      var el = this.h[9];
      var fh = this.h[10];
      var fl = this.h[11];
      var gh = this.h[12];
      var gl = this.h[13];
      var hh = this.h[14];
      var hl = this.h[15];
      assert2(this.k.length === W.length);
      for (var i = 0; i < W.length; i += 2) {
        var c0_hi = hh;
        var c0_lo = hl;
        var c1_hi = s1_512_hi(eh, el);
        var c1_lo = s1_512_lo(eh, el);
        var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
        var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
        var c3_hi = this.k[i];
        var c3_lo = this.k[i + 1];
        var c4_hi = W[i];
        var c4_lo = W[i + 1];
        var T1_hi = sum64_5_hi(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo,
          c4_hi,
          c4_lo
        );
        var T1_lo = sum64_5_lo(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo,
          c4_hi,
          c4_lo
        );
        c0_hi = s0_512_hi(ah, al);
        c0_lo = s0_512_lo(ah, al);
        c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
        c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
        var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
        var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        eh = sum64_hi(dh, dl, T1_hi, T1_lo);
        el = sum64_lo(dl, dl, T1_hi, T1_lo);
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
        al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
      }
      sum64(this.h, 0, ah, al);
      sum64(this.h, 2, bh, bl);
      sum64(this.h, 4, ch, cl);
      sum64(this.h, 6, dh, dl);
      sum64(this.h, 8, eh, el);
      sum64(this.h, 10, fh, fl);
      sum64(this.h, 12, gh, gl);
      sum64(this.h, 14, hh, hl);
    };
    SHA512.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "big");
      else
        return utils.split32(this.h, "big");
    };
    function ch64_hi(xh, xl, yh, yl, zh) {
      var r = xh & yh ^ ~xh & zh;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function ch64_lo(xh, xl, yh, yl, zh, zl) {
      var r = xl & yl ^ ~xl & zl;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function maj64_hi(xh, xl, yh, yl, zh) {
      var r = xh & yh ^ xh & zh ^ yh & zh;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function maj64_lo(xh, xl, yh, yl, zh, zl) {
      var r = xl & yl ^ xl & zl ^ yl & zl;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 28);
      var c1_hi = rotr64_hi(xl, xh, 2);
      var c2_hi = rotr64_hi(xl, xh, 7);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 28);
      var c1_lo = rotr64_lo(xl, xh, 2);
      var c2_lo = rotr64_lo(xl, xh, 7);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 14);
      var c1_hi = rotr64_hi(xh, xl, 18);
      var c2_hi = rotr64_hi(xl, xh, 9);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 14);
      var c1_lo = rotr64_lo(xh, xl, 18);
      var c2_lo = rotr64_lo(xl, xh, 9);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 1);
      var c1_hi = rotr64_hi(xh, xl, 8);
      var c2_hi = shr64_hi(xh, xl, 7);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 1);
      var c1_lo = rotr64_lo(xh, xl, 8);
      var c2_lo = shr64_lo(xh, xl, 7);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 19);
      var c1_hi = rotr64_hi(xl, xh, 29);
      var c2_hi = shr64_hi(xh, xl, 6);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 19);
      var c1_lo = rotr64_lo(xl, xh, 29);
      var c2_lo = shr64_lo(xh, xl, 6);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/384.js
var require__5 = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha/384.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var SHA512 = require__4();
    function SHA384() {
      if (!(this instanceof SHA384))
        return new SHA384();
      SHA512.call(this);
      this.h = [
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ];
    }
    utils.inherits(SHA384, SHA512);
    module.exports = SHA384;
    SHA384.blockSize = 1024;
    SHA384.outSize = 384;
    SHA384.hmacStrength = 192;
    SHA384.padLength = 128;
    SHA384.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h.slice(0, 12), "big");
      else
        return utils.split32(this.h.slice(0, 12), "big");
    };
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha.js
var require_sha = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/sha.js"(exports) {
    "use strict";
    init_cjs_shim();
    exports.sha1 = require__();
    exports.sha224 = require__3();
    exports.sha256 = require__2();
    exports.sha384 = require__5();
    exports.sha512 = require__4();
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/ripemd.js
var require_ripemd = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/ripemd.js"(exports) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var common = require_common();
    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_3 = utils.sum32_3;
    var sum32_4 = utils.sum32_4;
    var BlockHash = common.BlockHash;
    function RIPEMD160() {
      if (!(this instanceof RIPEMD160))
        return new RIPEMD160();
      BlockHash.call(this);
      this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
      this.endian = "little";
    }
    utils.inherits(RIPEMD160, BlockHash);
    exports.ripemd160 = RIPEMD160;
    RIPEMD160.blockSize = 512;
    RIPEMD160.outSize = 160;
    RIPEMD160.hmacStrength = 192;
    RIPEMD160.padLength = 64;
    RIPEMD160.prototype._update = function update(msg, start) {
      var A = this.h[0];
      var B = this.h[1];
      var C = this.h[2];
      var D = this.h[3];
      var E = this.h[4];
      var Ah = A;
      var Bh = B;
      var Ch = C;
      var Dh = D;
      var Eh = E;
      for (var j = 0; j < 80; j++) {
        var T = sum32(
          rotl32(
            sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
            s[j]
          ),
          E
        );
        A = E;
        E = D;
        D = rotl32(C, 10);
        C = B;
        B = T;
        T = sum32(
          rotl32(
            sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
            sh[j]
          ),
          Eh
        );
        Ah = Eh;
        Eh = Dh;
        Dh = rotl32(Ch, 10);
        Ch = Bh;
        Bh = T;
      }
      T = sum32_3(this.h[1], C, Dh);
      this.h[1] = sum32_3(this.h[2], D, Eh);
      this.h[2] = sum32_3(this.h[3], E, Ah);
      this.h[3] = sum32_3(this.h[4], A, Bh);
      this.h[4] = sum32_3(this.h[0], B, Ch);
      this.h[0] = T;
    };
    RIPEMD160.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "little");
      else
        return utils.split32(this.h, "little");
    };
    function f(j, x, y, z) {
      if (j <= 15)
        return x ^ y ^ z;
      else if (j <= 31)
        return x & y | ~x & z;
      else if (j <= 47)
        return (x | ~y) ^ z;
      else if (j <= 63)
        return x & z | y & ~z;
      else
        return x ^ (y | ~z);
    }
    function K(j) {
      if (j <= 15)
        return 0;
      else if (j <= 31)
        return 1518500249;
      else if (j <= 47)
        return 1859775393;
      else if (j <= 63)
        return 2400959708;
      else
        return 2840853838;
    }
    function Kh(j) {
      if (j <= 15)
        return 1352829926;
      else if (j <= 31)
        return 1548603684;
      else if (j <= 47)
        return 1836072691;
      else if (j <= 63)
        return 2053994217;
      else
        return 0;
    }
    var r = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8,
      3,
      10,
      14,
      4,
      9,
      15,
      8,
      1,
      2,
      7,
      0,
      6,
      13,
      11,
      5,
      12,
      1,
      9,
      11,
      10,
      0,
      8,
      12,
      4,
      13,
      3,
      7,
      15,
      14,
      5,
      6,
      2,
      4,
      0,
      5,
      9,
      7,
      12,
      2,
      10,
      14,
      1,
      3,
      8,
      11,
      6,
      15,
      13
    ];
    var rh = [
      5,
      14,
      7,
      0,
      9,
      2,
      11,
      4,
      13,
      6,
      15,
      8,
      1,
      10,
      3,
      12,
      6,
      11,
      3,
      7,
      0,
      13,
      5,
      10,
      14,
      15,
      8,
      12,
      4,
      9,
      1,
      2,
      15,
      5,
      1,
      3,
      7,
      14,
      6,
      9,
      11,
      8,
      12,
      2,
      10,
      0,
      4,
      13,
      8,
      6,
      4,
      1,
      3,
      11,
      15,
      0,
      5,
      12,
      2,
      13,
      9,
      7,
      10,
      14,
      12,
      15,
      10,
      4,
      1,
      5,
      8,
      7,
      6,
      2,
      13,
      14,
      0,
      3,
      9,
      11
    ];
    var s = [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8,
      7,
      6,
      8,
      13,
      11,
      9,
      7,
      15,
      7,
      12,
      15,
      9,
      11,
      7,
      13,
      12,
      11,
      13,
      6,
      7,
      14,
      9,
      13,
      15,
      14,
      8,
      13,
      6,
      5,
      12,
      7,
      5,
      11,
      12,
      14,
      15,
      14,
      15,
      9,
      8,
      9,
      14,
      5,
      6,
      8,
      6,
      5,
      12,
      9,
      15,
      5,
      11,
      6,
      8,
      13,
      12,
      5,
      12,
      13,
      14,
      11,
      8,
      5,
      6
    ];
    var sh = [
      8,
      9,
      9,
      11,
      13,
      15,
      15,
      5,
      7,
      7,
      8,
      11,
      14,
      14,
      12,
      6,
      9,
      13,
      15,
      7,
      12,
      8,
      9,
      11,
      7,
      7,
      12,
      7,
      6,
      15,
      13,
      11,
      9,
      7,
      15,
      11,
      8,
      6,
      6,
      14,
      12,
      13,
      5,
      14,
      13,
      13,
      7,
      5,
      15,
      5,
      8,
      11,
      14,
      14,
      6,
      14,
      6,
      9,
      12,
      9,
      12,
      5,
      15,
      8,
      8,
      5,
      12,
      9,
      12,
      5,
      14,
      6,
      8,
      13,
      6,
      5,
      15,
      13,
      11,
      11
    ];
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/hmac.js
var require_hmac = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash/hmac.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var utils = require_utils();
    var assert2 = require_minimalistic_assert();
    function Hmac(hash, key, enc) {
      if (!(this instanceof Hmac))
        return new Hmac(hash, key, enc);
      this.Hash = hash;
      this.blockSize = hash.blockSize / 8;
      this.outSize = hash.outSize / 8;
      this.inner = null;
      this.outer = null;
      this._init(utils.toArray(key, enc));
    }
    module.exports = Hmac;
    Hmac.prototype._init = function init(key) {
      if (key.length > this.blockSize)
        key = new this.Hash().update(key).digest();
      assert2(key.length <= this.blockSize);
      for (var i = key.length; i < this.blockSize; i++)
        key.push(0);
      for (i = 0; i < key.length; i++)
        key[i] ^= 54;
      this.inner = new this.Hash().update(key);
      for (i = 0; i < key.length; i++)
        key[i] ^= 106;
      this.outer = new this.Hash().update(key);
    };
    Hmac.prototype.update = function update(msg, enc) {
      this.inner.update(msg, enc);
      return this;
    };
    Hmac.prototype.digest = function digest(enc) {
      this.outer.update(this.inner.digest());
      return this.outer.digest(enc);
    };
  }
});

// node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash.js
var require_hash = __commonJS({
  "node_modules/@ethersproject/sha2/node_modules/hash.js/lib/hash.js"(exports) {
    init_cjs_shim();
    var hash = exports;
    hash.utils = require_utils();
    hash.common = require_common();
    hash.sha = require_sha();
    hash.ripemd = require_ripemd();
    hash.hmac = require_hmac();
    hash.sha1 = hash.sha.sha1;
    hash.sha256 = hash.sha.sha256;
    hash.sha224 = hash.sha.sha224;
    hash.sha384 = hash.sha.sha384;
    hash.sha512 = hash.sha.sha512;
    hash.ripemd160 = hash.ripemd.ripemd160;
  }
});

// node_modules/@ethersproject/sha2/lib/types.js
var require_types = __commonJS({
  "node_modules/@ethersproject/sha2/lib/types.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupportedAlgorithm = void 0;
    var SupportedAlgorithm;
    (function(SupportedAlgorithm2) {
      SupportedAlgorithm2["sha256"] = "sha256";
      SupportedAlgorithm2["sha512"] = "sha512";
    })(SupportedAlgorithm = exports.SupportedAlgorithm || (exports.SupportedAlgorithm = {}));
  }
});

// node_modules/@ethersproject/sha2/lib/_version.js
var require_version4 = __commonJS({
  "node_modules/@ethersproject/sha2/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "sha2/5.7.0";
  }
});

// node_modules/@ethersproject/sha2/lib/sha2.js
var require_sha2 = __commonJS({
  "node_modules/@ethersproject/sha2/lib/sha2.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.computeHmac = exports.sha512 = exports.sha256 = exports.ripemd160 = void 0;
    var crypto_1 = __require("crypto");
    var hash_js_1 = __importDefault(require_hash());
    var bytes_1 = require_lib2();
    var types_1 = require_types();
    var logger_1 = require_lib();
    var _version_1 = require_version4();
    var logger = new logger_1.Logger(_version_1.version);
    function ripemd160(data) {
      return "0x" + hash_js_1.default.ripemd160().update((0, bytes_1.arrayify)(data)).digest("hex");
    }
    exports.ripemd160 = ripemd160;
    function sha256(data) {
      return "0x" + (0, crypto_1.createHash)("sha256").update(Buffer.from((0, bytes_1.arrayify)(data))).digest("hex");
    }
    exports.sha256 = sha256;
    function sha512(data) {
      return "0x" + (0, crypto_1.createHash)("sha512").update(Buffer.from((0, bytes_1.arrayify)(data))).digest("hex");
    }
    exports.sha512 = sha512;
    function computeHmac(algorithm, key, data) {
      if (!types_1.SupportedAlgorithm[algorithm]) {
        logger.throwError("unsupported algorithm - " + algorithm, logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "computeHmac",
          algorithm
        });
      }
      return "0x" + (0, crypto_1.createHmac)(algorithm, Buffer.from((0, bytes_1.arrayify)(key))).update(Buffer.from((0, bytes_1.arrayify)(data))).digest("hex");
    }
    exports.computeHmac = computeHmac;
  }
});

// node_modules/@ethersproject/sha2/lib/index.js
var require_lib21 = __commonJS({
  "node_modules/@ethersproject/sha2/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupportedAlgorithm = exports.sha512 = exports.sha256 = exports.ripemd160 = exports.computeHmac = void 0;
    var sha2_1 = require_sha2();
    Object.defineProperty(exports, "computeHmac", { enumerable: true, get: function() {
      return sha2_1.computeHmac;
    } });
    Object.defineProperty(exports, "ripemd160", { enumerable: true, get: function() {
      return sha2_1.ripemd160;
    } });
    Object.defineProperty(exports, "sha256", { enumerable: true, get: function() {
      return sha2_1.sha256;
    } });
    Object.defineProperty(exports, "sha512", { enumerable: true, get: function() {
      return sha2_1.sha512;
    } });
    var types_1 = require_types();
    Object.defineProperty(exports, "SupportedAlgorithm", { enumerable: true, get: function() {
      return types_1.SupportedAlgorithm;
    } });
  }
});

// node_modules/@ethersproject/wordlists/lib/_version.js
var require_version5 = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "wordlists/5.7.0";
  }
});

// node_modules/@ethersproject/wordlists/lib/wordlist.js
var require_wordlist = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/wordlist.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Wordlist = exports.logger = void 0;
    var exportWordlist = false;
    var hash_1 = require_lib13();
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version5();
    exports.logger = new logger_1.Logger(_version_1.version);
    var Wordlist = (
      /** @class */
      function() {
        function Wordlist2(locale) {
          var _newTarget = this.constructor;
          exports.logger.checkAbstract(_newTarget, Wordlist2);
          (0, properties_1.defineReadOnly)(this, "locale", locale);
        }
        Wordlist2.prototype.split = function(mnemonic) {
          return mnemonic.toLowerCase().split(/ +/g);
        };
        Wordlist2.prototype.join = function(words) {
          return words.join(" ");
        };
        Wordlist2.check = function(wordlist) {
          var words = [];
          for (var i = 0; i < 2048; i++) {
            var word = wordlist.getWord(i);
            if (i !== wordlist.getWordIndex(word)) {
              return "0x";
            }
            words.push(word);
          }
          return (0, hash_1.id)(words.join("\n") + "\n");
        };
        Wordlist2.register = function(lang, name) {
          if (!name) {
            name = lang.locale;
          }
          if (exportWordlist) {
            try {
              var anyGlobal = window;
              if (anyGlobal._ethers && anyGlobal._ethers.wordlists) {
                if (!anyGlobal._ethers.wordlists[name]) {
                  (0, properties_1.defineReadOnly)(anyGlobal._ethers.wordlists, name, lang);
                }
              }
            } catch (error) {
            }
          }
        };
        return Wordlist2;
      }()
    );
    exports.Wordlist = Wordlist;
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-cz.js
var require_lang_cz = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-cz.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langCz = void 0;
    var wordlist_1 = require_wordlist();
    var words = "AbdikaceAbecedaAdresaAgreseAkceAktovkaAlejAlkoholAmputaceAnanasAndulkaAnekdotaAnketaAntikaAnulovatArchaAroganceAsfaltAsistentAspiraceAstmaAstronomAtlasAtletikaAtolAutobusAzylBabkaBachorBacilBaculkaBadatelBagetaBagrBahnoBakterieBaladaBaletkaBalkonBalonekBalvanBalzaBambusBankomatBarbarBaretBarmanBarokoBarvaBaterkaBatohBavlnaBazalkaBazilikaBazukaBednaBeranBesedaBestieBetonBezinkaBezmocBeztakBicyklBidloBiftekBikinyBilanceBiografBiologBitvaBizonBlahobytBlatouchBlechaBleduleBleskBlikatBliznaBlokovatBlouditBludBobekBobrBodlinaBodnoutBohatostBojkotBojovatBokorysBolestBorecBoroviceBotaBoubelBouchatBoudaBouleBouratBoxerBradavkaBramboraBrankaBratrBreptaBriketaBrkoBrlohBronzBroskevBrunetkaBrusinkaBrzdaBrzyBublinaBubnovatBuchtaBuditelBudkaBudovaBufetBujarostBukviceBuldokBulvaBundaBunkrBurzaButikBuvolBuzolaBydletBylinaBytovkaBzukotCapartCarevnaCedrCeduleCejchCejnCelaCelerCelkemCelniceCeninaCennostCenovkaCentrumCenzorCestopisCetkaChalupaChapadloCharitaChataChechtatChemieChichotChirurgChladChlebaChlubitChmelChmuraChobotChocholChodbaCholeraChomoutChopitChorobaChovChrapotChrlitChrtChrupChtivostChudinaChutnatChvatChvilkaChvostChybaChystatChytitCibuleCigaretaCihelnaCihlaCinkotCirkusCisternaCitaceCitrusCizinecCizostClonaCokolivCouvatCtitelCtnostCudnostCuketaCukrCupotCvaknoutCvalCvikCvrkotCyklistaDalekoDarebaDatelDatumDceraDebataDechovkaDecibelDeficitDeflaceDeklDekretDemokratDepreseDerbyDeskaDetektivDikobrazDiktovatDiodaDiplomDiskDisplejDivadloDivochDlahaDlouhoDluhopisDnesDobroDobytekDocentDochutitDodnesDohledDohodaDohraDojemDojniceDokladDokolaDoktorDokumentDolarDolevaDolinaDomaDominantDomluvitDomovDonutitDopadDopisDoplnitDoposudDoprovodDopustitDorazitDorostDortDosahDoslovDostatekDosudDosytaDotazDotekDotknoutDoufatDoutnatDovozceDozaduDoznatDozorceDrahotaDrakDramatikDravecDrazeDrdolDrobnostDrogerieDrozdDrsnostDrtitDrzostDubenDuchovnoDudekDuhaDuhovkaDusitDusnoDutostDvojiceDvorecDynamitEkologEkonomieElektronElipsaEmailEmiseEmoceEmpatieEpizodaEpochaEpopejEposEsejEsenceEskortaEskymoEtiketaEuforieEvoluceExekuceExkurzeExpediceExplozeExportExtraktFackaFajfkaFakultaFanatikFantazieFarmacieFavoritFazoleFederaceFejetonFenkaFialkaFigurantFilozofFiltrFinanceFintaFixaceFjordFlanelFlirtFlotilaFondFosforFotbalFotkaFotonFrakceFreskaFrontaFukarFunkceFyzikaGalejeGarantGenetikaGeologGilotinaGlazuraGlejtGolemGolfistaGotikaGrafGramofonGranuleGrepGrilGrogGroteskaGumaHadiceHadrHalaHalenkaHanbaHanopisHarfaHarpunaHavranHebkostHejkalHejnoHejtmanHektarHelmaHematomHerecHernaHesloHezkyHistorikHladovkaHlasivkyHlavaHledatHlenHlodavecHlohHloupostHltatHlubinaHluchotaHmatHmotaHmyzHnisHnojivoHnoutHoblinaHobojHochHodinyHodlatHodnotaHodovatHojnostHokejHolinkaHolkaHolubHomoleHonitbaHonoraceHoralHordaHorizontHorkoHorlivecHormonHorninaHoroskopHorstvoHospodaHostinaHotovostHoubaHoufHoupatHouskaHovorHradbaHraniceHravostHrazdaHrbolekHrdinaHrdloHrdostHrnekHrobkaHromadaHrotHroudaHrozenHrstkaHrubostHryzatHubenostHubnoutHudbaHukotHumrHusitaHustotaHvozdHybnostHydrantHygienaHymnaHysterikIdylkaIhnedIkonaIluzeImunitaInfekceInflaceInkasoInovaceInspekceInternetInvalidaInvestorInzerceIronieJablkoJachtaJahodaJakmileJakostJalovecJantarJarmarkJaroJasanJasnoJatkaJavorJazykJedinecJedleJednatelJehlanJekotJelenJelitoJemnostJenomJepiceJeseterJevitJezdecJezeroJinakJindyJinochJiskraJistotaJitrniceJizvaJmenovatJogurtJurtaKabaretKabelKabinetKachnaKadetKadidloKahanKajakKajutaKakaoKaktusKalamitaKalhotyKalibrKalnostKameraKamkolivKamnaKanibalKanoeKantorKapalinaKapelaKapitolaKapkaKapleKapotaKaprKapustaKapybaraKaramelKarotkaKartonKasaKatalogKatedraKauceKauzaKavalecKazajkaKazetaKazivostKdekolivKdesiKedlubenKempKeramikaKinoKlacekKladivoKlamKlapotKlasikaKlaunKlecKlenbaKlepatKlesnoutKlidKlimaKlisnaKloboukKlokanKlopaKloubKlubovnaKlusatKluzkostKmenKmitatKmotrKnihaKnotKoaliceKoberecKobkaKoblihaKobylaKocourKohoutKojenecKokosKoktejlKolapsKoledaKolizeKoloKomandoKometaKomikKomnataKomoraKompasKomunitaKonatKonceptKondiceKonecKonfeseKongresKoninaKonkursKontaktKonzervaKopanecKopieKopnoutKoprovkaKorbelKorektorKormidloKoroptevKorpusKorunaKorytoKorzetKosatecKostkaKotelKotletaKotoulKoukatKoupelnaKousekKouzloKovbojKozaKozorohKrabiceKrachKrajinaKralovatKrasopisKravataKreditKrejcarKresbaKrevetaKriketKritikKrizeKrkavecKrmelecKrmivoKrocanKrokKronikaKropitKroupaKrovkaKrtekKruhadloKrupiceKrutostKrvinkaKrychleKryptaKrystalKrytKudlankaKufrKujnostKuklaKulajdaKulichKulkaKulometKulturaKunaKupodivuKurtKurzorKutilKvalitaKvasinkaKvestorKynologKyselinaKytaraKyticeKytkaKytovecKyvadloLabradorLachtanLadnostLaikLakomecLamelaLampaLanovkaLasiceLasoLasturaLatinkaLavinaLebkaLeckdyLedenLedniceLedovkaLedvinaLegendaLegieLegraceLehceLehkostLehnoutLektvarLenochodLentilkaLepenkaLepidloLetadloLetecLetmoLetokruhLevhartLevitaceLevobokLibraLichotkaLidojedLidskostLihovinaLijavecLilekLimetkaLinieLinkaLinoleumListopadLitinaLitovatLobistaLodivodLogikaLogopedLokalitaLoketLomcovatLopataLopuchLordLososLotrLoudalLouhLoukaLouskatLovecLstivostLucernaLuciferLumpLuskLustraceLviceLyraLyrikaLysinaMadamMadloMagistrMahagonMajetekMajitelMajoritaMakakMakoviceMakrelaMalbaMalinaMalovatMalviceMaminkaMandleMankoMarnostMasakrMaskotMasopustMaticeMatrikaMaturitaMazanecMazivoMazlitMazurkaMdlobaMechanikMeditaceMedovinaMelasaMelounMentolkaMetlaMetodaMetrMezeraMigraceMihnoutMihuleMikinaMikrofonMilenecMilimetrMilostMimikaMincovnaMinibarMinometMinulostMiskaMistrMixovatMladostMlhaMlhovinaMlokMlsatMluvitMnichMnohemMobilMocnostModelkaModlitbaMohylaMokroMolekulaMomentkaMonarchaMonoklMonstrumMontovatMonzunMosazMoskytMostMotivaceMotorkaMotykaMouchaMoudrostMozaikaMozekMozolMramorMravenecMrkevMrtvolaMrzetMrzutostMstitelMudrcMuflonMulatMumieMuniceMusetMutaceMuzeumMuzikantMyslivecMzdaNabouratNachytatNadaceNadbytekNadhozNadobroNadpisNahlasNahnatNahodileNahraditNaivitaNajednouNajistoNajmoutNaklonitNakonecNakrmitNalevoNamazatNamluvitNanometrNaokoNaopakNaostroNapadatNapevnoNaplnitNapnoutNaposledNaprostoNaroditNarubyNarychloNasaditNasekatNaslepoNastatNatolikNavenekNavrchNavzdoryNazvatNebeNechatNeckyNedalekoNedbatNeduhNegaceNehetNehodaNejenNejprveNeklidNelibostNemilostNemocNeochotaNeonkaNepokojNerostNervNesmyslNesouladNetvorNeuronNevinaNezvykleNicotaNijakNikamNikdyNiklNikterakNitroNoclehNohaviceNominaceNoraNorekNositelNosnostNouzeNovinyNovotaNozdraNudaNudleNugetNutitNutnostNutrieNymfaObalObarvitObavaObdivObecObehnatObejmoutObezitaObhajobaObilniceObjasnitObjektObklopitOblastOblekOblibaOblohaObludaObnosObohatitObojekOboutObrazecObrnaObrubaObrysObsahObsluhaObstaratObuvObvazObvinitObvodObvykleObyvatelObzorOcasOcelOcenitOchladitOchotaOchranaOcitnoutOdbojOdbytOdchodOdcizitOdebratOdeslatOdevzdatOdezvaOdhadceOdhoditOdjetOdjinudOdkazOdkoupitOdlivOdlukaOdmlkaOdolnostOdpadOdpisOdploutOdporOdpustitOdpykatOdrazkaOdsouditOdstupOdsunOdtokOdtudOdvahaOdvetaOdvolatOdvracetOdznakOfinaOfsajdOhlasOhniskoOhradaOhrozitOhryzekOkapOkeniceOklikaOknoOkouzlitOkovyOkrasaOkresOkrsekOkruhOkupantOkurkaOkusitOlejninaOlizovatOmakOmeletaOmezitOmladinaOmlouvatOmluvaOmylOnehdyOpakovatOpasekOperaceOpiceOpilostOpisovatOporaOpoziceOpravduOprotiOrbitalOrchestrOrgieOrliceOrlojOrtelOsadaOschnoutOsikaOsivoOslavaOslepitOslnitOslovitOsnovaOsobaOsolitOspalecOstenOstrahaOstudaOstychOsvojitOteplitOtiskOtopOtrhatOtrlostOtrokOtrubyOtvorOvanoutOvarOvesOvlivnitOvoceOxidOzdobaPachatelPacientPadouchPahorekPaktPalandaPalecPalivoPalubaPamfletPamlsekPanenkaPanikaPannaPanovatPanstvoPantoflePaprikaParketaParodiePartaParukaParybaPasekaPasivitaPastelkaPatentPatronaPavoukPaznehtPazourekPeckaPedagogPejsekPekloPelotonPenaltaPendrekPenzePeriskopPeroPestrostPetardaPeticePetrolejPevninaPexesoPianistaPihaPijavicePiklePiknikPilinaPilnostPilulkaPinzetaPipetaPisatelPistolePitevnaPivnicePivovarPlacentaPlakatPlamenPlanetaPlastikaPlatitPlavidloPlazPlechPlemenoPlentaPlesPletivoPlevelPlivatPlnitPlnoPlochaPlodinaPlombaPloutPlukPlynPobavitPobytPochodPocitPoctivecPodatPodcenitPodepsatPodhledPodivitPodkladPodmanitPodnikPodobaPodporaPodrazPodstataPodvodPodzimPoeziePohankaPohnutkaPohovorPohromaPohybPointaPojistkaPojmoutPokazitPoklesPokojPokrokPokutaPokynPolednePolibekPolknoutPolohaPolynomPomaluPominoutPomlkaPomocPomstaPomysletPonechatPonorkaPonurostPopadatPopelPopisekPoplachPoprositPopsatPopudPoradcePorcePorodPoruchaPoryvPosaditPosedPosilaPoskokPoslanecPosouditPospoluPostavaPosudekPosypPotahPotkanPotleskPotomekPotravaPotupaPotvoraPoukazPoutoPouzdroPovahaPovidlaPovlakPovozPovrchPovstatPovykPovzdechPozdravPozemekPoznatekPozorPozvatPracovatPrahoryPraktikaPralesPraotecPraporekPrasePravdaPrincipPrknoProbuditProcentoProdejProfeseProhraProjektProlomitPromilePronikatPropadProrokProsbaProtonProutekProvazPrskavkaPrstenPrudkostPrutPrvekPrvohoryPsanecPsovodPstruhPtactvoPubertaPuchPudlPukavecPuklinaPukrlePultPumpaPuncPupenPusaPusinkaPustinaPutovatPutykaPyramidaPyskPytelRacekRachotRadiaceRadniceRadonRaftRagbyRaketaRakovinaRamenoRampouchRandeRarachRaritaRasovnaRastrRatolestRazanceRazidloReagovatReakceReceptRedaktorReferentReflexRejnokReklamaRekordRekrutRektorReputaceRevizeRevmaRevolverRezervaRiskovatRizikoRobotikaRodokmenRohovkaRokleRokokoRomanetoRopovodRopuchaRorejsRosolRostlinaRotmistrRotopedRotundaRoubenkaRouchoRoupRouraRovinaRovniceRozborRozchodRozdatRozeznatRozhodceRozinkaRozjezdRozkazRozlohaRozmarRozpadRozruchRozsahRoztokRozumRozvodRubrikaRuchadloRukaviceRukopisRybaRybolovRychlostRydloRypadloRytinaRyzostSadistaSahatSakoSamecSamizdatSamotaSanitkaSardinkaSasankaSatelitSazbaSazeniceSborSchovatSebrankaSeceseSedadloSedimentSedloSehnatSejmoutSekeraSektaSekundaSekvojeSemenoSenoServisSesaditSeshoraSeskokSeslatSestraSesuvSesypatSetbaSetinaSetkatSetnoutSetrvatSeverSeznamShodaShrnoutSifonSilniceSirkaSirotekSirupSituaceSkafandrSkaliskoSkanzenSkautSkeptikSkicaSkladbaSkleniceSkloSkluzSkobaSkokanSkoroSkriptaSkrzSkupinaSkvostSkvrnaSlabikaSladidloSlaninaSlastSlavnostSledovatSlepecSlevaSlezinaSlibSlinaSlizniceSlonSloupekSlovoSluchSluhaSlunceSlupkaSlzaSmaragdSmetanaSmilstvoSmlouvaSmogSmradSmrkSmrtkaSmutekSmyslSnadSnahaSnobSobotaSochaSodovkaSokolSopkaSotvaSoubojSoucitSoudceSouhlasSouladSoumrakSoupravaSousedSoutokSouvisetSpalovnaSpasitelSpisSplavSpodekSpojenecSpoluSponzorSpornostSpoustaSprchaSpustitSrandaSrazSrdceSrnaSrnecSrovnatSrpenSrstSrubStaniceStarostaStatikaStavbaStehnoStezkaStodolaStolekStopaStornoStoupatStrachStresStrhnoutStromStrunaStudnaStupniceStvolStykSubjektSubtropySucharSudostSuknoSundatSunoutSurikataSurovinaSvahSvalstvoSvetrSvatbaSvazekSvisleSvitekSvobodaSvodidloSvorkaSvrabSykavkaSykotSynekSynovecSypatSypkostSyrovostSyselSytostTabletkaTabuleTahounTajemnoTajfunTajgaTajitTajnostTaktikaTamhleTamponTancovatTanecTankerTapetaTaveninaTazatelTechnikaTehdyTekutinaTelefonTemnotaTendenceTenistaTenorTeplotaTepnaTeprveTerapieTermoskaTextilTichoTiskopisTitulekTkadlecTkaninaTlapkaTleskatTlukotTlupaTmelToaletaTopinkaTopolTorzoTouhaToulecTradiceTraktorTrampTrasaTraverzaTrefitTrestTrezorTrhavinaTrhlinaTrochuTrojiceTroskaTroubaTrpceTrpitelTrpkostTrubecTruchlitTruhliceTrusTrvatTudyTuhnoutTuhostTundraTuristaTurnajTuzemskoTvarohTvorbaTvrdostTvrzTygrTykevUbohostUbozeUbratUbrousekUbrusUbytovnaUchoUctivostUdivitUhraditUjednatUjistitUjmoutUkazatelUklidnitUklonitUkotvitUkrojitUliceUlitaUlovitUmyvadloUnavitUniformaUniknoutUpadnoutUplatnitUplynoutUpoutatUpravitUranUrazitUsednoutUsilovatUsmrtitUsnadnitUsnoutUsouditUstlatUstrnoutUtahovatUtkatUtlumitUtonoutUtopenecUtrousitUvalitUvolnitUvozovkaUzdravitUzelUzeninaUzlinaUznatVagonValchaValounVanaVandalVanilkaVaranVarhanyVarovatVcelkuVchodVdovaVedroVegetaceVejceVelbloudVeletrhVelitelVelmocVelrybaVenkovVerandaVerzeVeselkaVeskrzeVesniceVespoduVestaVeterinaVeverkaVibraceVichrVideohraVidinaVidleVilaViniceVisetVitalitaVizeVizitkaVjezdVkladVkusVlajkaVlakVlasecVlevoVlhkostVlivVlnovkaVloupatVnucovatVnukVodaVodivostVodoznakVodstvoVojenskyVojnaVojskoVolantVolbaVolitVolnoVoskovkaVozidloVozovnaVpravoVrabecVracetVrahVrataVrbaVrcholekVrhatVrstvaVrtuleVsaditVstoupitVstupVtipVybavitVybratVychovatVydatVydraVyfotitVyhledatVyhnoutVyhoditVyhraditVyhubitVyjasnitVyjetVyjmoutVyklopitVykonatVylekatVymazatVymezitVymizetVymysletVynechatVynikatVynutitVypadatVyplatitVypravitVypustitVyrazitVyrovnatVyrvatVyslovitVysokoVystavitVysunoutVysypatVytasitVytesatVytratitVyvinoutVyvolatVyvrhelVyzdobitVyznatVzaduVzbuditVzchopitVzdorVzduchVzdychatVzestupVzhledemVzkazVzlykatVznikVzorekVzpouraVztahVztekXylofonZabratZabydletZachovatZadarmoZadusitZafoukatZahltitZahoditZahradaZahynoutZajatecZajetZajistitZaklepatZakoupitZalepitZamezitZamotatZamysletZanechatZanikatZaplatitZapojitZapsatZarazitZastavitZasunoutZatajitZatemnitZatknoutZaujmoutZavalitZaveletZavinitZavolatZavrtatZazvonitZbavitZbrusuZbudovatZbytekZdalekaZdarmaZdatnostZdivoZdobitZdrojZdvihZdymadloZeleninaZemanZeminaZeptatZezaduZezdolaZhatitZhltnoutZhlubokaZhotovitZhrubaZimaZimniceZjemnitZklamatZkoumatZkratkaZkumavkaZlatoZlehkaZlobaZlomZlostZlozvykZmapovatZmarZmatekZmijeZmizetZmocnitZmodratZmrzlinaZmutovatZnakZnalostZnamenatZnovuZobrazitZotavitZoubekZoufaleZploditZpomalitZpravaZprostitZprudkaZprvuZradaZranitZrcadloZrnitostZrnoZrovnaZrychlitZrzavostZtichaZtratitZubovinaZubrZvednoutZvenkuZveselaZvonZvratZvukovodZvyk";
    var wordlist = null;
    function loadWords(lang) {
      if (wordlist != null) {
        return;
      }
      wordlist = words.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" ");
      if (wordlist_1.Wordlist.check(lang) !== "0x25f44555f4af25b51a711136e1c7d6e50ce9f8917d39d6b1f076b2bb4d2fac1a") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for en (English) FAILED");
      }
    }
    var LangCz = (
      /** @class */
      function(_super) {
        __extends(LangCz2, _super);
        function LangCz2() {
          return _super.call(this, "cz") || this;
        }
        LangCz2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangCz2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return wordlist.indexOf(word);
        };
        return LangCz2;
      }(wordlist_1.Wordlist)
    );
    var langCz = new LangCz();
    exports.langCz = langCz;
    wordlist_1.Wordlist.register(langCz);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-en.js
var require_lang_en = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-en.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langEn = void 0;
    var wordlist_1 = require_wordlist();
    var words = "AbandonAbilityAbleAboutAboveAbsentAbsorbAbstractAbsurdAbuseAccessAccidentAccountAccuseAchieveAcidAcousticAcquireAcrossActActionActorActressActualAdaptAddAddictAddressAdjustAdmitAdultAdvanceAdviceAerobicAffairAffordAfraidAgainAgeAgentAgreeAheadAimAirAirportAisleAlarmAlbumAlcoholAlertAlienAllAlleyAllowAlmostAloneAlphaAlreadyAlsoAlterAlwaysAmateurAmazingAmongAmountAmusedAnalystAnchorAncientAngerAngleAngryAnimalAnkleAnnounceAnnualAnotherAnswerAntennaAntiqueAnxietyAnyApartApologyAppearAppleApproveAprilArchArcticAreaArenaArgueArmArmedArmorArmyAroundArrangeArrestArriveArrowArtArtefactArtistArtworkAskAspectAssaultAssetAssistAssumeAsthmaAthleteAtomAttackAttendAttitudeAttractAuctionAuditAugustAuntAuthorAutoAutumnAverageAvocadoAvoidAwakeAwareAwayAwesomeAwfulAwkwardAxisBabyBachelorBaconBadgeBagBalanceBalconyBallBambooBananaBannerBarBarelyBargainBarrelBaseBasicBasketBattleBeachBeanBeautyBecauseBecomeBeefBeforeBeginBehaveBehindBelieveBelowBeltBenchBenefitBestBetrayBetterBetweenBeyondBicycleBidBikeBindBiologyBirdBirthBitterBlackBladeBlameBlanketBlastBleakBlessBlindBloodBlossomBlouseBlueBlurBlushBoardBoatBodyBoilBombBoneBonusBookBoostBorderBoringBorrowBossBottomBounceBoxBoyBracketBrainBrandBrassBraveBreadBreezeBrickBridgeBriefBrightBringBriskBroccoliBrokenBronzeBroomBrotherBrownBrushBubbleBuddyBudgetBuffaloBuildBulbBulkBulletBundleBunkerBurdenBurgerBurstBusBusinessBusyButterBuyerBuzzCabbageCabinCableCactusCageCakeCallCalmCameraCampCanCanalCancelCandyCannonCanoeCanvasCanyonCapableCapitalCaptainCarCarbonCardCargoCarpetCarryCartCaseCashCasinoCastleCasualCatCatalogCatchCategoryCattleCaughtCauseCautionCaveCeilingCeleryCementCensusCenturyCerealCertainChairChalkChampionChangeChaosChapterChargeChaseChatCheapCheckCheeseChefCherryChestChickenChiefChildChimneyChoiceChooseChronicChuckleChunkChurnCigarCinnamonCircleCitizenCityCivilClaimClapClarifyClawClayCleanClerkCleverClickClientCliffClimbClinicClipClockClogCloseClothCloudClownClubClumpClusterClutchCoachCoastCoconutCodeCoffeeCoilCoinCollectColorColumnCombineComeComfortComicCommonCompanyConcertConductConfirmCongressConnectConsiderControlConvinceCookCoolCopperCopyCoralCoreCornCorrectCostCottonCouchCountryCoupleCourseCousinCoverCoyoteCrackCradleCraftCramCraneCrashCraterCrawlCrazyCreamCreditCreekCrewCricketCrimeCrispCriticCropCrossCrouchCrowdCrucialCruelCruiseCrumbleCrunchCrushCryCrystalCubeCultureCupCupboardCuriousCurrentCurtainCurveCushionCustomCuteCycleDadDamageDampDanceDangerDaringDashDaughterDawnDayDealDebateDebrisDecadeDecemberDecideDeclineDecorateDecreaseDeerDefenseDefineDefyDegreeDelayDeliverDemandDemiseDenialDentistDenyDepartDependDepositDepthDeputyDeriveDescribeDesertDesignDeskDespairDestroyDetailDetectDevelopDeviceDevoteDiagramDialDiamondDiaryDiceDieselDietDifferDigitalDignityDilemmaDinnerDinosaurDirectDirtDisagreeDiscoverDiseaseDishDismissDisorderDisplayDistanceDivertDivideDivorceDizzyDoctorDocumentDogDollDolphinDomainDonateDonkeyDonorDoorDoseDoubleDoveDraftDragonDramaDrasticDrawDreamDressDriftDrillDrinkDripDriveDropDrumDryDuckDumbDuneDuringDustDutchDutyDwarfDynamicEagerEagleEarlyEarnEarthEasilyEastEasyEchoEcologyEconomyEdgeEditEducateEffortEggEightEitherElbowElderElectricElegantElementElephantElevatorEliteElseEmbarkEmbodyEmbraceEmergeEmotionEmployEmpowerEmptyEnableEnactEndEndlessEndorseEnemyEnergyEnforceEngageEngineEnhanceEnjoyEnlistEnoughEnrichEnrollEnsureEnterEntireEntryEnvelopeEpisodeEqualEquipEraEraseErodeErosionErrorEruptEscapeEssayEssenceEstateEternalEthicsEvidenceEvilEvokeEvolveExactExampleExcessExchangeExciteExcludeExcuseExecuteExerciseExhaustExhibitExileExistExitExoticExpandExpectExpireExplainExposeExpressExtendExtraEyeEyebrowFabricFaceFacultyFadeFaintFaithFallFalseFameFamilyFamousFanFancyFantasyFarmFashionFatFatalFatherFatigueFaultFavoriteFeatureFebruaryFederalFeeFeedFeelFemaleFenceFestivalFetchFeverFewFiberFictionFieldFigureFileFilmFilterFinalFindFineFingerFinishFireFirmFirstFiscalFishFitFitnessFixFlagFlameFlashFlatFlavorFleeFlightFlipFloatFlockFloorFlowerFluidFlushFlyFoamFocusFogFoilFoldFollowFoodFootForceForestForgetForkFortuneForumForwardFossilFosterFoundFoxFragileFrameFrequentFreshFriendFringeFrogFrontFrostFrownFrozenFruitFuelFunFunnyFurnaceFuryFutureGadgetGainGalaxyGalleryGameGapGarageGarbageGardenGarlicGarmentGasGaspGateGatherGaugeGazeGeneralGeniusGenreGentleGenuineGestureGhostGiantGiftGiggleGingerGiraffeGirlGiveGladGlanceGlareGlassGlideGlimpseGlobeGloomGloryGloveGlowGlueGoatGoddessGoldGoodGooseGorillaGospelGossipGovernGownGrabGraceGrainGrantGrapeGrassGravityGreatGreenGridGriefGritGroceryGroupGrowGruntGuardGuessGuideGuiltGuitarGunGymHabitHairHalfHammerHamsterHandHappyHarborHardHarshHarvestHatHaveHawkHazardHeadHealthHeartHeavyHedgehogHeightHelloHelmetHelpHenHeroHiddenHighHillHintHipHireHistoryHobbyHockeyHoldHoleHolidayHollowHomeHoneyHoodHopeHornHorrorHorseHospitalHostHotelHourHoverHubHugeHumanHumbleHumorHundredHungryHuntHurdleHurryHurtHusbandHybridIceIconIdeaIdentifyIdleIgnoreIllIllegalIllnessImageImitateImmenseImmuneImpactImposeImproveImpulseInchIncludeIncomeIncreaseIndexIndicateIndoorIndustryInfantInflictInformInhaleInheritInitialInjectInjuryInmateInnerInnocentInputInquiryInsaneInsectInsideInspireInstallIntactInterestIntoInvestInviteInvolveIronIslandIsolateIssueItemIvoryJacketJaguarJarJazzJealousJeansJellyJewelJobJoinJokeJourneyJoyJudgeJuiceJumpJungleJuniorJunkJustKangarooKeenKeepKetchupKeyKickKidKidneyKindKingdomKissKitKitchenKiteKittenKiwiKneeKnifeKnockKnowLabLabelLaborLadderLadyLakeLampLanguageLaptopLargeLaterLatinLaughLaundryLavaLawLawnLawsuitLayerLazyLeaderLeafLearnLeaveLectureLeftLegLegalLegendLeisureLemonLendLengthLensLeopardLessonLetterLevelLiarLibertyLibraryLicenseLifeLiftLightLikeLimbLimitLinkLionLiquidListLittleLiveLizardLoadLoanLobsterLocalLockLogicLonelyLongLoopLotteryLoudLoungeLoveLoyalLuckyLuggageLumberLunarLunchLuxuryLyricsMachineMadMagicMagnetMaidMailMainMajorMakeMammalManManageMandateMangoMansionManualMapleMarbleMarchMarginMarineMarketMarriageMaskMassMasterMatchMaterialMathMatrixMatterMaximumMazeMeadowMeanMeasureMeatMechanicMedalMediaMelodyMeltMemberMemoryMentionMenuMercyMergeMeritMerryMeshMessageMetalMethodMiddleMidnightMilkMillionMimicMindMinimumMinorMinuteMiracleMirrorMiseryMissMistakeMixMixedMixtureMobileModelModifyMomMomentMonitorMonkeyMonsterMonthMoonMoralMoreMorningMosquitoMotherMotionMotorMountainMouseMoveMovieMuchMuffinMuleMultiplyMuscleMuseumMushroomMusicMustMutualMyselfMysteryMythNaiveNameNapkinNarrowNastyNationNatureNearNeckNeedNegativeNeglectNeitherNephewNerveNestNetNetworkNeutralNeverNewsNextNiceNightNobleNoiseNomineeNoodleNormalNorthNoseNotableNoteNothingNoticeNovelNowNuclearNumberNurseNutOakObeyObjectObligeObscureObserveObtainObviousOccurOceanOctoberOdorOffOfferOfficeOftenOilOkayOldOliveOlympicOmitOnceOneOnionOnlineOnlyOpenOperaOpinionOpposeOptionOrangeOrbitOrchardOrderOrdinaryOrganOrientOriginalOrphanOstrichOtherOutdoorOuterOutputOutsideOvalOvenOverOwnOwnerOxygenOysterOzonePactPaddlePagePairPalacePalmPandaPanelPanicPantherPaperParadeParentParkParrotPartyPassPatchPathPatientPatrolPatternPausePavePaymentPeacePeanutPearPeasantPelicanPenPenaltyPencilPeoplePepperPerfectPermitPersonPetPhonePhotoPhrasePhysicalPianoPicnicPicturePiecePigPigeonPillPilotPinkPioneerPipePistolPitchPizzaPlacePlanetPlasticPlatePlayPleasePledgePluckPlugPlungePoemPoetPointPolarPolePolicePondPonyPoolPopularPortionPositionPossiblePostPotatoPotteryPovertyPowderPowerPracticePraisePredictPreferPreparePresentPrettyPreventPricePridePrimaryPrintPriorityPrisonPrivatePrizeProblemProcessProduceProfitProgramProjectPromoteProofPropertyProsperProtectProudProvidePublicPuddingPullPulpPulsePumpkinPunchPupilPuppyPurchasePurityPurposePursePushPutPuzzlePyramidQualityQuantumQuarterQuestionQuickQuitQuizQuoteRabbitRaccoonRaceRackRadarRadioRailRainRaiseRallyRampRanchRandomRangeRapidRareRateRatherRavenRawRazorReadyRealReasonRebelRebuildRecallReceiveRecipeRecordRecycleReduceReflectReformRefuseRegionRegretRegularRejectRelaxReleaseReliefRelyRemainRememberRemindRemoveRenderRenewRentReopenRepairRepeatReplaceReportRequireRescueResembleResistResourceResponseResultRetireRetreatReturnReunionRevealReviewRewardRhythmRibRibbonRiceRichRideRidgeRifleRightRigidRingRiotRippleRiskRitualRivalRiverRoadRoastRobotRobustRocketRomanceRoofRookieRoomRoseRotateRoughRoundRouteRoyalRubberRudeRugRuleRunRunwayRuralSadSaddleSadnessSafeSailSaladSalmonSalonSaltSaluteSameSampleSandSatisfySatoshiSauceSausageSaveSayScaleScanScareScatterSceneSchemeSchoolScienceScissorsScorpionScoutScrapScreenScriptScrubSeaSearchSeasonSeatSecondSecretSectionSecuritySeedSeekSegmentSelectSellSeminarSeniorSenseSentenceSeriesServiceSessionSettleSetupSevenShadowShaftShallowShareShedShellSheriffShieldShiftShineShipShiverShockShoeShootShopShortShoulderShoveShrimpShrugShuffleShySiblingSickSideSiegeSightSignSilentSilkSillySilverSimilarSimpleSinceSingSirenSisterSituateSixSizeSkateSketchSkiSkillSkinSkirtSkullSlabSlamSleepSlenderSliceSlideSlightSlimSloganSlotSlowSlushSmallSmartSmileSmokeSmoothSnackSnakeSnapSniffSnowSoapSoccerSocialSockSodaSoftSolarSoldierSolidSolutionSolveSomeoneSongSoonSorrySortSoulSoundSoupSourceSouthSpaceSpareSpatialSpawnSpeakSpecialSpeedSpellSpendSphereSpiceSpiderSpikeSpinSpiritSplitSpoilSponsorSpoonSportSpotSpraySpreadSpringSpySquareSqueezeSquirrelStableStadiumStaffStageStairsStampStandStartStateStaySteakSteelStemStepStereoStickStillStingStockStomachStoneStoolStoryStoveStrategyStreetStrikeStrongStruggleStudentStuffStumbleStyleSubjectSubmitSubwaySuccessSuchSuddenSufferSugarSuggestSuitSummerSunSunnySunsetSuperSupplySupremeSureSurfaceSurgeSurpriseSurroundSurveySuspectSustainSwallowSwampSwapSwarmSwearSweetSwiftSwimSwingSwitchSwordSymbolSymptomSyrupSystemTableTackleTagTailTalentTalkTankTapeTargetTaskTasteTattooTaxiTeachTeamTellTenTenantTennisTentTermTestTextThankThatThemeThenTheoryThereTheyThingThisThoughtThreeThriveThrowThumbThunderTicketTideTigerTiltTimberTimeTinyTipTiredTissueTitleToastTobaccoTodayToddlerToeTogetherToiletTokenTomatoTomorrowToneTongueTonightToolToothTopTopicToppleTorchTornadoTortoiseTossTotalTouristTowardTowerTownToyTrackTradeTrafficTragicTrainTransferTrapTrashTravelTrayTreatTreeTrendTrialTribeTrickTriggerTrimTripTrophyTroubleTruckTrueTrulyTrumpetTrustTruthTryTubeTuitionTumbleTunaTunnelTurkeyTurnTurtleTwelveTwentyTwiceTwinTwistTwoTypeTypicalUglyUmbrellaUnableUnawareUncleUncoverUnderUndoUnfairUnfoldUnhappyUniformUniqueUnitUniverseUnknownUnlockUntilUnusualUnveilUpdateUpgradeUpholdUponUpperUpsetUrbanUrgeUsageUseUsedUsefulUselessUsualUtilityVacantVacuumVagueValidValleyValveVanVanishVaporVariousVastVaultVehicleVelvetVendorVentureVenueVerbVerifyVersionVeryVesselVeteranViableVibrantViciousVictoryVideoViewVillageVintageViolinVirtualVirusVisaVisitVisualVitalVividVocalVoiceVoidVolcanoVolumeVoteVoyageWageWagonWaitWalkWallWalnutWantWarfareWarmWarriorWashWaspWasteWaterWaveWayWealthWeaponWearWeaselWeatherWebWeddingWeekendWeirdWelcomeWestWetWhaleWhatWheatWheelWhenWhereWhipWhisperWideWidthWifeWildWillWinWindowWineWingWinkWinnerWinterWireWisdomWiseWishWitnessWolfWomanWonderWoodWoolWordWorkWorldWorryWorthWrapWreckWrestleWristWriteWrongYardYearYellowYouYoungYouthZebraZeroZoneZoo";
    var wordlist = null;
    function loadWords(lang) {
      if (wordlist != null) {
        return;
      }
      wordlist = words.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" ");
      if (wordlist_1.Wordlist.check(lang) !== "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for en (English) FAILED");
      }
    }
    var LangEn = (
      /** @class */
      function(_super) {
        __extends(LangEn2, _super);
        function LangEn2() {
          return _super.call(this, "en") || this;
        }
        LangEn2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangEn2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return wordlist.indexOf(word);
        };
        return LangEn2;
      }(wordlist_1.Wordlist)
    );
    var langEn = new LangEn();
    exports.langEn = langEn;
    wordlist_1.Wordlist.register(langEn);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-es.js
var require_lang_es = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-es.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langEs = void 0;
    var strings_1 = require_lib11();
    var wordlist_1 = require_wordlist();
    var words = "A/bacoAbdomenAbejaAbiertoAbogadoAbonoAbortoAbrazoAbrirAbueloAbusoAcabarAcademiaAccesoAccio/nAceiteAcelgaAcentoAceptarA/cidoAclararAcne/AcogerAcosoActivoActoActrizActuarAcudirAcuerdoAcusarAdictoAdmitirAdoptarAdornoAduanaAdultoAe/reoAfectarAficio/nAfinarAfirmarA/gilAgitarAgoni/aAgostoAgotarAgregarAgrioAguaAgudoA/guilaAgujaAhogoAhorroAireAislarAjedrezAjenoAjusteAlacra/nAlambreAlarmaAlbaA/lbumAlcaldeAldeaAlegreAlejarAlertaAletaAlfilerAlgaAlgodo/nAliadoAlientoAlivioAlmaAlmejaAlmi/barAltarAltezaAltivoAltoAlturaAlumnoAlzarAmableAmanteAmapolaAmargoAmasarA/mbarA/mbitoAmenoAmigoAmistadAmorAmparoAmplioAnchoAncianoAnclaAndarAnde/nAnemiaA/nguloAnilloA/nimoAni/sAnotarAntenaAntiguoAntojoAnualAnularAnuncioA~adirA~ejoA~oApagarAparatoApetitoApioAplicarApodoAporteApoyoAprenderAprobarApuestaApuroAradoAra~aArarA/rbitroA/rbolArbustoArchivoArcoArderArdillaArduoA/reaA/ridoAriesArmoni/aArne/sAromaArpaArpo/nArregloArrozArrugaArteArtistaAsaAsadoAsaltoAscensoAsegurarAseoAsesorAsientoAsiloAsistirAsnoAsombroA/speroAstillaAstroAstutoAsumirAsuntoAtajoAtaqueAtarAtentoAteoA/ticoAtletaA/tomoAtraerAtrozAtu/nAudazAudioAugeAulaAumentoAusenteAutorAvalAvanceAvaroAveAvellanaAvenaAvestruzAvio/nAvisoAyerAyudaAyunoAzafra/nAzarAzoteAzu/carAzufreAzulBabaBaborBacheBahi/aBaileBajarBalanzaBalco/nBaldeBambu/BancoBandaBa~oBarbaBarcoBarnizBarroBa/sculaBasto/nBasuraBatallaBateri/aBatirBatutaBau/lBazarBebe/BebidaBelloBesarBesoBestiaBichoBienBingoBlancoBloqueBlusaBoaBobinaBoboBocaBocinaBodaBodegaBoinaBolaBoleroBolsaBombaBondadBonitoBonoBonsa/iBordeBorrarBosqueBoteBoti/nBo/vedaBozalBravoBrazoBrechaBreveBrilloBrincoBrisaBrocaBromaBronceBroteBrujaBruscoBrutoBuceoBucleBuenoBueyBufandaBufo/nBu/hoBuitreBultoBurbujaBurlaBurroBuscarButacaBuzo/nCaballoCabezaCabinaCabraCacaoCada/verCadenaCaerCafe/Cai/daCaima/nCajaCajo/nCalCalamarCalcioCaldoCalidadCalleCalmaCalorCalvoCamaCambioCamelloCaminoCampoCa/ncerCandilCanelaCanguroCanicaCantoCa~aCa~o/nCaobaCaosCapazCapita/nCapoteCaptarCapuchaCaraCarbo/nCa/rcelCaretaCargaCari~oCarneCarpetaCarroCartaCasaCascoCaseroCaspaCastorCatorceCatreCaudalCausaCazoCebollaCederCedroCeldaCe/lebreCelosoCe/lulaCementoCenizaCentroCercaCerdoCerezaCeroCerrarCertezaCe/spedCetroChacalChalecoChampu/ChanclaChapaCharlaChicoChisteChivoChoqueChozaChuletaChuparCiclo/nCiegoCieloCienCiertoCifraCigarroCimaCincoCineCintaCipre/sCircoCiruelaCisneCitaCiudadClamorClanClaroClaseClaveClienteClimaCli/nicaCobreCoccio/nCochinoCocinaCocoCo/digoCodoCofreCogerCoheteCoji/nCojoColaColchaColegioColgarColinaCollarColmoColumnaCombateComerComidaCo/modoCompraCondeConejoCongaConocerConsejoContarCopaCopiaCorazo/nCorbataCorchoCordo/nCoronaCorrerCoserCosmosCostaCra/neoCra/terCrearCrecerCrei/doCremaCri/aCrimenCriptaCrisisCromoCro/nicaCroquetaCrudoCruzCuadroCuartoCuatroCuboCubrirCucharaCuelloCuentoCuerdaCuestaCuevaCuidarCulebraCulpaCultoCumbreCumplirCunaCunetaCuotaCupo/nCu/pulaCurarCuriosoCursoCurvaCutisDamaDanzaDarDardoDa/tilDeberDe/bilDe/cadaDecirDedoDefensaDefinirDejarDelfi/nDelgadoDelitoDemoraDensoDentalDeporteDerechoDerrotaDesayunoDeseoDesfileDesnudoDestinoDesvi/oDetalleDetenerDeudaDi/aDiabloDiademaDiamanteDianaDiarioDibujoDictarDienteDietaDiezDifi/cilDignoDilemaDiluirDineroDirectoDirigirDiscoDise~oDisfrazDivaDivinoDobleDoceDolorDomingoDonDonarDoradoDormirDorsoDosDosisDrago/nDrogaDuchaDudaDueloDue~oDulceDu/oDuqueDurarDurezaDuroE/banoEbrioEcharEcoEcuadorEdadEdicio/nEdificioEditorEducarEfectoEficazEjeEjemploElefanteElegirElementoElevarElipseE/liteElixirElogioEludirEmbudoEmitirEmocio/nEmpateEmpe~oEmpleoEmpresaEnanoEncargoEnchufeEnci/aEnemigoEneroEnfadoEnfermoEnga~oEnigmaEnlaceEnormeEnredoEnsayoEnse~arEnteroEntrarEnvaseEnvi/oE/pocaEquipoErizoEscalaEscenaEscolarEscribirEscudoEsenciaEsferaEsfuerzoEspadaEspejoEspi/aEsposaEspumaEsqui/EstarEsteEstiloEstufaEtapaEternoE/ticaEtniaEvadirEvaluarEventoEvitarExactoExamenExcesoExcusaExentoExigirExilioExistirE/xitoExpertoExplicarExponerExtremoFa/bricaFa/bulaFachadaFa/cilFactorFaenaFajaFaldaFalloFalsoFaltarFamaFamiliaFamosoFarao/nFarmaciaFarolFarsaFaseFatigaFaunaFavorFaxFebreroFechaFelizFeoFeriaFerozFe/rtilFervorFesti/nFiableFianzaFiarFibraFiccio/nFichaFideoFiebreFielFieraFiestaFiguraFijarFijoFilaFileteFilialFiltroFinFincaFingirFinitoFirmaFlacoFlautaFlechaFlorFlotaFluirFlujoFlu/orFobiaFocaFogataFogo/nFolioFolletoFondoFormaForroFortunaForzarFosaFotoFracasoFra/gilFranjaFraseFraudeFrei/rFrenoFresaFri/oFritoFrutaFuegoFuenteFuerzaFugaFumarFuncio/nFundaFurgo/nFuriaFusilFu/tbolFuturoGacelaGafasGaitaGajoGalaGaleri/aGalloGambaGanarGanchoGangaGansoGarajeGarzaGasolinaGastarGatoGavila/nGemeloGemirGenGe/neroGenioGenteGeranioGerenteGermenGestoGiganteGimnasioGirarGiroGlaciarGloboGloriaGolGolfoGolosoGolpeGomaGordoGorilaGorraGotaGoteoGozarGradaGra/ficoGranoGrasaGratisGraveGrietaGrilloGripeGrisGritoGrosorGru/aGruesoGrumoGrupoGuanteGuapoGuardiaGuerraGui/aGui~oGuionGuisoGuitarraGusanoGustarHaberHa/bilHablarHacerHachaHadaHallarHamacaHarinaHazHaza~aHebillaHebraHechoHeladoHelioHembraHerirHermanoHe/roeHervirHieloHierroHi/gadoHigieneHijoHimnoHistoriaHocicoHogarHogueraHojaHombreHongoHonorHonraHoraHormigaHornoHostilHoyoHuecoHuelgaHuertaHuesoHuevoHuidaHuirHumanoHu/medoHumildeHumoHundirHuraca/nHurtoIconoIdealIdiomaI/doloIglesiaIglu/IgualIlegalIlusio/nImagenIma/nImitarImparImperioImponerImpulsoIncapazI/ndiceInerteInfielInformeIngenioInicioInmensoInmuneInnatoInsectoInstanteIntere/sI/ntimoIntuirInu/tilInviernoIraIrisIroni/aIslaIsloteJabali/Jabo/nJamo/nJarabeJardi/nJarraJaulaJazmi/nJefeJeringaJineteJornadaJorobaJovenJoyaJuergaJuevesJuezJugadorJugoJugueteJuicioJuncoJunglaJunioJuntarJu/piterJurarJustoJuvenilJuzgarKiloKoalaLabioLacioLacraLadoLadro/nLagartoLa/grimaLagunaLaicoLamerLa/minaLa/mparaLanaLanchaLangostaLanzaLa/pizLargoLarvaLa/stimaLataLa/texLatirLaurelLavarLazoLealLeccio/nLecheLectorLeerLegio/nLegumbreLejanoLenguaLentoLe~aLeo/nLeopardoLesio/nLetalLetraLeveLeyendaLibertadLibroLicorLi/derLidiarLienzoLigaLigeroLimaLi/miteLimo/nLimpioLinceLindoLi/neaLingoteLinoLinternaLi/quidoLisoListaLiteraLitioLitroLlagaLlamaLlantoLlaveLlegarLlenarLlevarLlorarLloverLluviaLoboLocio/nLocoLocuraLo/gicaLogroLombrizLomoLonjaLoteLuchaLucirLugarLujoLunaLunesLupaLustroLutoLuzMacetaMachoMaderaMadreMaduroMaestroMafiaMagiaMagoMai/zMaldadMaletaMallaMaloMama/MamboMamutMancoMandoManejarMangaManiqui/ManjarManoMansoMantaMa~anaMapaMa/quinaMarMarcoMareaMarfilMargenMaridoMa/rmolMarro/nMartesMarzoMasaMa/scaraMasivoMatarMateriaMatizMatrizMa/ximoMayorMazorcaMechaMedallaMedioMe/dulaMejillaMejorMelenaMelo/nMemoriaMenorMensajeMenteMenu/MercadoMerengueMe/ritoMesMeso/nMetaMeterMe/todoMetroMezclaMiedoMielMiembroMigaMilMilagroMilitarMillo/nMimoMinaMineroMi/nimoMinutoMiopeMirarMisaMiseriaMisilMismoMitadMitoMochilaMocio/nModaModeloMohoMojarMoldeMolerMolinoMomentoMomiaMonarcaMonedaMonjaMontoMo~oMoradaMorderMorenoMorirMorroMorsaMortalMoscaMostrarMotivoMoverMo/vilMozoMuchoMudarMuebleMuelaMuerteMuestraMugreMujerMulaMuletaMultaMundoMu~ecaMuralMuroMu/sculoMuseoMusgoMu/sicaMusloNa/carNacio/nNadarNaipeNaranjaNarizNarrarNasalNatalNativoNaturalNa/useaNavalNaveNavidadNecioNe/ctarNegarNegocioNegroNeo/nNervioNetoNeutroNevarNeveraNichoNidoNieblaNietoNi~ezNi~oNi/tidoNivelNoblezaNocheNo/minaNoriaNormaNorteNotaNoticiaNovatoNovelaNovioNubeNucaNu/cleoNudilloNudoNueraNueveNuezNuloNu/meroNutriaOasisObesoObispoObjetoObraObreroObservarObtenerObvioOcaOcasoOce/anoOchentaOchoOcioOcreOctavoOctubreOcultoOcuparOcurrirOdiarOdioOdiseaOesteOfensaOfertaOficioOfrecerOgroOi/doOi/rOjoOlaOleadaOlfatoOlivoOllaOlmoOlorOlvidoOmbligoOndaOnzaOpacoOpcio/nO/peraOpinarOponerOptarO/pticaOpuestoOracio/nOradorOralO/rbitaOrcaOrdenOrejaO/rganoOrgi/aOrgulloOrienteOrigenOrillaOroOrquestaOrugaOsadi/aOscuroOseznoOsoOstraOto~oOtroOvejaO/vuloO/xidoOxi/genoOyenteOzonoPactoPadrePaellaPa/ginaPagoPai/sPa/jaroPalabraPalcoPaletaPa/lidoPalmaPalomaPalparPanPanalPa/nicoPanteraPa~ueloPapa/PapelPapillaPaquetePararParcelaParedParirParoPa/rpadoParquePa/rrafoPartePasarPaseoPasio/nPasoPastaPataPatioPatriaPausaPautaPavoPayasoPeato/nPecadoPeceraPechoPedalPedirPegarPeinePelarPelda~oPeleaPeligroPellejoPeloPelucaPenaPensarPe~o/nPeo/nPeorPepinoPeque~oPeraPerchaPerderPerezaPerfilPericoPerlaPermisoPerroPersonaPesaPescaPe/simoPesta~aPe/taloPetro/leoPezPezu~aPicarPicho/nPiePiedraPiernaPiezaPijamaPilarPilotoPimientaPinoPintorPinzaPi~aPiojoPipaPirataPisarPiscinaPisoPistaPito/nPizcaPlacaPlanPlataPlayaPlazaPleitoPlenoPlomoPlumaPluralPobrePocoPoderPodioPoemaPoesi/aPoetaPolenPolici/aPolloPolvoPomadaPomeloPomoPompaPonerPorcio/nPortalPosadaPoseerPosiblePostePotenciaPotroPozoPradoPrecozPreguntaPremioPrensaPresoPrevioPrimoPri/ncipePrisio/nPrivarProaProbarProcesoProductoProezaProfesorProgramaProlePromesaProntoPropioPro/ximoPruebaPu/blicoPucheroPudorPuebloPuertaPuestoPulgaPulirPulmo/nPulpoPulsoPumaPuntoPu~alPu~oPupaPupilaPure/QuedarQuejaQuemarQuererQuesoQuietoQui/micaQuinceQuitarRa/banoRabiaRaboRacio/nRadicalRai/zRamaRampaRanchoRangoRapazRa/pidoRaptoRasgoRaspaRatoRayoRazaRazo/nReaccio/nRealidadReba~oReboteRecaerRecetaRechazoRecogerRecreoRectoRecursoRedRedondoReducirReflejoReformaRefra/nRefugioRegaloRegirReglaRegresoRehe/nReinoRei/rRejaRelatoRelevoRelieveRellenoRelojRemarRemedioRemoRencorRendirRentaRepartoRepetirReposoReptilResRescateResinaRespetoRestoResumenRetiroRetornoRetratoReunirReve/sRevistaReyRezarRicoRiegoRiendaRiesgoRifaRi/gidoRigorRinco/nRi~o/nRi/oRiquezaRisaRitmoRitoRizoRobleRoceRociarRodarRodeoRodillaRoerRojizoRojoRomeroRomperRonRoncoRondaRopaRoperoRosaRoscaRostroRotarRubi/RuborRudoRuedaRugirRuidoRuinaRuletaRuloRumboRumorRupturaRutaRutinaSa/badoSaberSabioSableSacarSagazSagradoSalaSaldoSaleroSalirSalmo/nSalo/nSalsaSaltoSaludSalvarSambaSancio/nSandi/aSanearSangreSanidadSanoSantoSapoSaqueSardinaSarte/nSastreSata/nSaunaSaxofo/nSeccio/nSecoSecretoSectaSedSeguirSeisSelloSelvaSemanaSemillaSendaSensorSe~alSe~orSepararSepiaSequi/aSerSerieSermo/nServirSesentaSesio/nSetaSetentaSeveroSexoSextoSidraSiestaSieteSigloSignoSi/labaSilbarSilencioSillaSi/mboloSimioSirenaSistemaSitioSituarSobreSocioSodioSolSolapaSoldadoSoledadSo/lidoSoltarSolucio/nSombraSondeoSonidoSonoroSonrisaSopaSoplarSoporteSordoSorpresaSorteoSoste/nSo/tanoSuaveSubirSucesoSudorSuegraSueloSue~oSuerteSufrirSujetoSulta/nSumarSuperarSuplirSuponerSupremoSurSurcoSure~oSurgirSustoSutilTabacoTabiqueTablaTabu/TacoTactoTajoTalarTalcoTalentoTallaTalo/nTama~oTamborTangoTanqueTapaTapeteTapiaTapo/nTaquillaTardeTareaTarifaTarjetaTarotTarroTartaTatuajeTauroTazaTazo/nTeatroTechoTeclaTe/cnicaTejadoTejerTejidoTelaTele/fonoTemaTemorTemploTenazTenderTenerTenisTensoTeori/aTerapiaTercoTe/rminoTernuraTerrorTesisTesoroTestigoTeteraTextoTezTibioTiburo/nTiempoTiendaTierraTiesoTigreTijeraTildeTimbreTi/midoTimoTintaTi/oTi/picoTipoTiraTiro/nTita/nTi/tereTi/tuloTizaToallaTobilloTocarTocinoTodoTogaToldoTomarTonoTontoToparTopeToqueTo/raxToreroTormentaTorneoToroTorpedoTorreTorsoTortugaTosToscoToserTo/xicoTrabajoTractorTraerTra/ficoTragoTrajeTramoTranceTratoTraumaTrazarTre/bolTreguaTreintaTrenTreparTresTribuTrigoTripaTristeTriunfoTrofeoTrompaTroncoTropaTroteTrozoTrucoTruenoTrufaTuberi/aTuboTuertoTumbaTumorTu/nelTu/nicaTurbinaTurismoTurnoTutorUbicarU/lceraUmbralUnidadUnirUniversoUnoUntarU~aUrbanoUrbeUrgenteUrnaUsarUsuarioU/tilUtopi/aUvaVacaVaci/oVacunaVagarVagoVainaVajillaValeVa/lidoValleValorVa/lvulaVampiroVaraVariarVaro/nVasoVecinoVectorVehi/culoVeinteVejezVelaVeleroVelozVenaVencerVendaVenenoVengarVenirVentaVenusVerVeranoVerboVerdeVeredaVerjaVersoVerterVi/aViajeVibrarVicioVi/ctimaVidaVi/deoVidrioViejoViernesVigorVilVillaVinagreVinoVi~edoVioli/nViralVirgoVirtudVisorVi/speraVistaVitaminaViudoVivazViveroVivirVivoVolca/nVolumenVolverVorazVotarVotoVozVueloVulgarYacerYateYeguaYemaYernoYesoYodoYogaYogurZafiroZanjaZapatoZarzaZonaZorroZumoZurdo";
    var lookup = {};
    var wordlist = null;
    function dropDiacritic(word) {
      wordlist_1.logger.checkNormalize();
      return (0, strings_1.toUtf8String)(Array.prototype.filter.call((0, strings_1.toUtf8Bytes)(word.normalize("NFD").toLowerCase()), function(c) {
        return c >= 65 && c <= 90 || c >= 97 && c <= 123;
      }));
    }
    function expand(word) {
      var output = [];
      Array.prototype.forEach.call((0, strings_1.toUtf8Bytes)(word), function(c) {
        if (c === 47) {
          output.push(204);
          output.push(129);
        } else if (c === 126) {
          output.push(110);
          output.push(204);
          output.push(131);
        } else {
          output.push(c);
        }
      });
      return (0, strings_1.toUtf8String)(output);
    }
    function loadWords(lang) {
      if (wordlist != null) {
        return;
      }
      wordlist = words.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" ").map(function(w) {
        return expand(w);
      });
      wordlist.forEach(function(word, index) {
        lookup[dropDiacritic(word)] = index;
      });
      if (wordlist_1.Wordlist.check(lang) !== "0xf74fb7092aeacdfbf8959557de22098da512207fb9f109cb526994938cf40300") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for es (Spanish) FAILED");
      }
    }
    var LangEs = (
      /** @class */
      function(_super) {
        __extends(LangEs2, _super);
        function LangEs2() {
          return _super.call(this, "es") || this;
        }
        LangEs2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangEs2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return lookup[dropDiacritic(word)];
        };
        return LangEs2;
      }(wordlist_1.Wordlist)
    );
    var langEs = new LangEs();
    exports.langEs = langEs;
    wordlist_1.Wordlist.register(langEs);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-fr.js
var require_lang_fr = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-fr.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langFr = void 0;
    var strings_1 = require_lib11();
    var wordlist_1 = require_wordlist();
    var words = "AbaisserAbandonAbdiquerAbeilleAbolirAborderAboutirAboyerAbrasifAbreuverAbriterAbrogerAbruptAbsenceAbsoluAbsurdeAbusifAbyssalAcade/mieAcajouAcarienAccablerAccepterAcclamerAccoladeAccrocheAccuserAcerbeAchatAcheterAcidulerAcierAcompteAcque/rirAcronymeActeurActifActuelAdepteAde/quatAdhe/sifAdjectifAdjugerAdmettreAdmirerAdopterAdorerAdoucirAdresseAdroitAdulteAdverbeAe/rerAe/ronefAffaireAffecterAfficheAffreuxAffublerAgacerAgencerAgileAgiterAgraferAgre/ableAgrumeAiderAiguilleAilierAimableAisanceAjouterAjusterAlarmerAlchimieAlerteAlge-breAlgueAlie/nerAlimentAlle/gerAlliageAllouerAllumerAlourdirAlpagaAltesseAlve/oleAmateurAmbiguAmbreAme/nagerAmertumeAmidonAmiralAmorcerAmourAmovibleAmphibieAmpleurAmusantAnalyseAnaphoreAnarchieAnatomieAncienAne/antirAngleAngoisseAnguleuxAnimalAnnexerAnnonceAnnuelAnodinAnomalieAnonymeAnormalAntenneAntidoteAnxieuxApaiserApe/ritifAplanirApologieAppareilAppelerApporterAppuyerAquariumAqueducArbitreArbusteArdeurArdoiseArgentArlequinArmatureArmementArmoireArmureArpenterArracherArriverArroserArsenicArte/rielArticleAspectAsphalteAspirerAssautAsservirAssietteAssocierAssurerAsticotAstreAstuceAtelierAtomeAtriumAtroceAttaqueAttentifAttirerAttraperAubaineAubergeAudaceAudibleAugurerAuroreAutomneAutrucheAvalerAvancerAvariceAvenirAverseAveugleAviateurAvideAvionAviserAvoineAvouerAvrilAxialAxiomeBadgeBafouerBagageBaguetteBaignadeBalancerBalconBaleineBalisageBambinBancaireBandageBanlieueBannie-reBanquierBarbierBarilBaronBarqueBarrageBassinBastionBatailleBateauBatterieBaudrierBavarderBeletteBe/lierBeloteBe/ne/ficeBerceauBergerBerlineBermudaBesaceBesogneBe/tailBeurreBiberonBicycleBiduleBijouBilanBilingueBillardBinaireBiologieBiopsieBiotypeBiscuitBisonBistouriBitumeBizarreBlafardBlagueBlanchirBlessantBlinderBlondBloquerBlousonBobardBobineBoireBoiserBolideBonbonBondirBonheurBonifierBonusBordureBorneBotteBoucleBoueuxBougieBoulonBouquinBourseBoussoleBoutiqueBoxeurBrancheBrasierBraveBrebisBre-cheBreuvageBricolerBrigadeBrillantBriocheBriqueBrochureBroderBronzerBrousseBroyeurBrumeBrusqueBrutalBruyantBuffleBuissonBulletinBureauBurinBustierButinerButoirBuvableBuvetteCabanonCabineCachetteCadeauCadreCafe/ineCaillouCaissonCalculerCalepinCalibreCalmerCalomnieCalvaireCamaradeCame/raCamionCampagneCanalCanetonCanonCantineCanularCapableCaporalCapriceCapsuleCapterCapucheCarabineCarboneCaresserCaribouCarnageCarotteCarreauCartonCascadeCasierCasqueCassureCauserCautionCavalierCaverneCaviarCe/dilleCeintureCe/lesteCelluleCendrierCensurerCentralCercleCe/re/bralCeriseCernerCerveauCesserChagrinChaiseChaleurChambreChanceChapitreCharbonChasseurChatonChaussonChavirerChemiseChenilleChe/quierChercherChevalChienChiffreChignonChime-reChiotChlorureChocolatChoisirChoseChouetteChromeChuteCigareCigogneCimenterCine/maCintrerCirculerCirerCirqueCiterneCitoyenCitronCivilClaironClameurClaquerClasseClavierClientClignerClimatClivageClocheClonageCloporteCobaltCobraCocasseCocotierCoderCodifierCoffreCognerCohe/sionCoifferCoincerCole-reColibriCollineColmaterColonelCombatCome/dieCommandeCompactConcertConduireConfierCongelerConnoterConsonneContactConvexeCopainCopieCorailCorbeauCordageCornicheCorpusCorrectCorte-geCosmiqueCostumeCotonCoudeCoupureCourageCouteauCouvrirCoyoteCrabeCrainteCravateCrayonCre/atureCre/diterCre/meuxCreuserCrevetteCriblerCrierCristalCrite-reCroireCroquerCrotaleCrucialCruelCrypterCubiqueCueillirCuille-reCuisineCuivreCulminerCultiverCumulerCupideCuratifCurseurCyanureCycleCylindreCyniqueDaignerDamierDangerDanseurDauphinDe/battreDe/biterDe/borderDe/briderDe/butantDe/calerDe/cembreDe/chirerDe/ciderDe/clarerDe/corerDe/crireDe/cuplerDe/daleDe/ductifDe/esseDe/fensifDe/filerDe/frayerDe/gagerDe/givrerDe/glutirDe/graferDe/jeunerDe/liceDe/logerDemanderDemeurerDe/molirDe/nicherDe/nouerDentelleDe/nuderDe/partDe/penserDe/phaserDe/placerDe/poserDe/rangerDe/roberDe/sastreDescenteDe/sertDe/signerDe/sobe/irDessinerDestrierDe/tacherDe/testerDe/tourerDe/tresseDevancerDevenirDevinerDevoirDiableDialogueDiamantDicterDiffe/rerDige/rerDigitalDigneDiluerDimancheDiminuerDioxydeDirectifDirigerDiscuterDisposerDissiperDistanceDivertirDiviserDocileDocteurDogmeDoigtDomaineDomicileDompterDonateurDonjonDonnerDopamineDortoirDorureDosageDoseurDossierDotationDouanierDoubleDouceurDouterDoyenDragonDraperDresserDribblerDroitureDuperieDuplexeDurableDurcirDynastieE/blouirE/carterE/charpeE/chelleE/clairerE/clipseE/cloreE/cluseE/coleE/conomieE/corceE/couterE/craserE/cre/merE/crivainE/crouE/cumeE/cureuilE/difierE/duquerEffacerEffectifEffigieEffortEffrayerEffusionE/galiserE/garerE/jecterE/laborerE/largirE/lectronE/le/gantE/le/phantE/le-veE/ligibleE/litismeE/logeE/luciderE/luderEmballerEmbellirEmbryonE/meraudeE/missionEmmenerE/motionE/mouvoirEmpereurEmployerEmporterEmpriseE/mulsionEncadrerEnche-reEnclaveEncocheEndiguerEndosserEndroitEnduireE/nergieEnfanceEnfermerEnfouirEngagerEnginEngloberE/nigmeEnjamberEnjeuEnleverEnnemiEnnuyeuxEnrichirEnrobageEnseigneEntasserEntendreEntierEntourerEntraverE/nume/rerEnvahirEnviableEnvoyerEnzymeE/olienE/paissirE/pargneE/patantE/pauleE/picerieE/pide/mieE/pierE/pilogueE/pineE/pisodeE/pitapheE/poqueE/preuveE/prouverE/puisantE/querreE/quipeE/rigerE/rosionErreurE/ruptionEscalierEspadonEspe-ceEspie-gleEspoirEspritEsquiverEssayerEssenceEssieuEssorerEstimeEstomacEstradeE/tage-reE/talerE/tancheE/tatiqueE/teindreE/tendoirE/ternelE/thanolE/thiqueEthnieE/tirerE/tofferE/toileE/tonnantE/tourdirE/trangeE/troitE/tudeEuphorieE/valuerE/vasionE/ventailE/videnceE/viterE/volutifE/voquerExactExage/rerExaucerExcellerExcitantExclusifExcuseExe/cuterExempleExercerExhalerExhorterExigenceExilerExisterExotiqueExpe/dierExplorerExposerExprimerExquisExtensifExtraireExulterFableFabuleuxFacetteFacileFactureFaiblirFalaiseFameuxFamilleFarceurFarfeluFarineFaroucheFascinerFatalFatigueFauconFautifFaveurFavoriFe/brileFe/conderFe/de/rerFe/linFemmeFe/murFendoirFe/odalFermerFe/roceFerveurFestivalFeuilleFeutreFe/vrierFiascoFicelerFictifFide-leFigureFilatureFiletageFilie-reFilleulFilmerFilouFiltrerFinancerFinirFioleFirmeFissureFixerFlairerFlammeFlasqueFlatteurFle/auFle-cheFleurFlexionFloconFloreFluctuerFluideFluvialFolieFonderieFongibleFontaineForcerForgeronFormulerFortuneFossileFoudreFouge-reFouillerFoulureFourmiFragileFraiseFranchirFrapperFrayeurFre/gateFreinerFrelonFre/mirFre/ne/sieFre-reFriableFrictionFrissonFrivoleFroidFromageFrontalFrotterFruitFugitifFuiteFureurFurieuxFurtifFusionFuturGagnerGalaxieGalerieGambaderGarantirGardienGarnirGarrigueGazelleGazonGe/antGe/latineGe/luleGendarmeGe/ne/ralGe/nieGenouGentilGe/ologieGe/ome-treGe/raniumGermeGestuelGeyserGibierGiclerGirafeGivreGlaceGlaiveGlisserGlobeGloireGlorieuxGolfeurGommeGonflerGorgeGorilleGoudronGouffreGoulotGoupilleGourmandGoutteGraduelGraffitiGraineGrandGrappinGratuitGravirGrenatGriffureGrillerGrimperGrognerGronderGrotteGroupeGrugerGrutierGruye-reGue/pardGuerrierGuideGuimauveGuitareGustatifGymnasteGyrostatHabitudeHachoirHalteHameauHangarHannetonHaricotHarmonieHarponHasardHe/liumHe/matomeHerbeHe/rissonHermineHe/ronHe/siterHeureuxHibernerHibouHilarantHistoireHiverHomardHommageHomoge-neHonneurHonorerHonteuxHordeHorizonHorlogeHormoneHorribleHouleuxHousseHublotHuileuxHumainHumbleHumideHumourHurlerHydromelHygie-neHymneHypnoseIdylleIgnorerIguaneIlliciteIllusionImageImbiberImiterImmenseImmobileImmuableImpactImpe/rialImplorerImposerImprimerImputerIncarnerIncendieIncidentInclinerIncoloreIndexerIndiceInductifIne/ditIneptieInexactInfiniInfligerInformerInfusionInge/rerInhalerInhiberInjecterInjureInnocentInoculerInonderInscrireInsecteInsigneInsoliteInspirerInstinctInsulterIntactIntenseIntimeIntrigueIntuitifInutileInvasionInventerInviterInvoquerIroniqueIrradierIrre/elIrriterIsolerIvoireIvresseJaguarJaillirJambeJanvierJardinJaugerJauneJavelotJetableJetonJeudiJeunesseJoindreJoncherJonglerJoueurJouissifJournalJovialJoyauJoyeuxJubilerJugementJuniorJuponJuristeJusticeJuteuxJuve/nileKayakKimonoKiosqueLabelLabialLabourerLace/rerLactoseLaguneLaineLaisserLaitierLambeauLamelleLampeLanceurLangageLanterneLapinLargeurLarmeLaurierLavaboLavoirLectureLe/galLe/gerLe/gumeLessiveLettreLevierLexiqueLe/zardLiasseLibe/rerLibreLicenceLicorneLie-geLie-vreLigatureLigoterLigueLimerLimiteLimonadeLimpideLine/aireLingotLionceauLiquideLisie-reListerLithiumLitigeLittoralLivreurLogiqueLointainLoisirLombricLoterieLouerLourdLoutreLouveLoyalLubieLucideLucratifLueurLugubreLuisantLumie-reLunaireLundiLuronLutterLuxueuxMachineMagasinMagentaMagiqueMaigreMaillonMaintienMairieMaisonMajorerMalaxerMale/ficeMalheurMaliceMalletteMammouthMandaterManiableManquantManteauManuelMarathonMarbreMarchandMardiMaritimeMarqueurMarronMartelerMascotteMassifMate/rielMatie-reMatraqueMaudireMaussadeMauveMaximalMe/chantMe/connuMe/dailleMe/decinMe/diterMe/duseMeilleurMe/langeMe/lodieMembreMe/moireMenacerMenerMenhirMensongeMentorMercrediMe/riteMerleMessagerMesureMe/talMe/te/oreMe/thodeMe/tierMeubleMiaulerMicrobeMietteMignonMigrerMilieuMillionMimiqueMinceMine/ralMinimalMinorerMinuteMiracleMiroiterMissileMixteMobileModerneMoelleuxMondialMoniteurMonnaieMonotoneMonstreMontagneMonumentMoqueurMorceauMorsureMortierMoteurMotifMoucheMoufleMoulinMoussonMoutonMouvantMultipleMunitionMurailleMure-neMurmureMuscleMuse/umMusicienMutationMuterMutuelMyriadeMyrtilleMyste-reMythiqueNageurNappeNarquoisNarrerNatationNationNatureNaufrageNautiqueNavireNe/buleuxNectarNe/fasteNe/gationNe/gligerNe/gocierNeigeNerveuxNettoyerNeuroneNeutronNeveuNicheNickelNitrateNiveauNobleNocifNocturneNoirceurNoisetteNomadeNombreuxNommerNormatifNotableNotifierNotoireNourrirNouveauNovateurNovembreNoviceNuageNuancerNuireNuisibleNume/roNuptialNuqueNutritifObe/irObjectifObligerObscurObserverObstacleObtenirObturerOccasionOccuperOce/anOctobreOctroyerOctuplerOculaireOdeurOdorantOffenserOfficierOffrirOgiveOiseauOisillonOlfactifOlivierOmbrageOmettreOnctueuxOndulerOne/reuxOniriqueOpaleOpaqueOpe/rerOpinionOpportunOpprimerOpterOptiqueOrageuxOrangeOrbiteOrdonnerOreilleOrganeOrgueilOrificeOrnementOrqueOrtieOscillerOsmoseOssatureOtarieOuraganOursonOutilOutragerOuvrageOvationOxydeOxyge-neOzonePaisiblePalacePalmare-sPalourdePalperPanachePandaPangolinPaniquerPanneauPanoramaPantalonPapayePapierPapoterPapyrusParadoxeParcelleParesseParfumerParlerParoleParrainParsemerPartagerParureParvenirPassionPaste-quePaternelPatiencePatronPavillonPavoiserPayerPaysagePeignePeintrePelagePe/licanPellePelousePeluchePendulePe/ne/trerPe/niblePensifPe/nuriePe/pitePe/plumPerdrixPerforerPe/riodePermuterPerplexePersilPertePeserPe/talePetitPe/trirPeuplePharaonPhobiePhoquePhotonPhrasePhysiquePianoPicturalPie-cePierrePieuvrePilotePinceauPipettePiquerPiroguePiscinePistonPivoterPixelPizzaPlacardPlafondPlaisirPlanerPlaquePlastronPlateauPleurerPlexusPliagePlombPlongerPluiePlumagePochettePoe/siePoe-tePointePoirierPoissonPoivrePolairePolicierPollenPolygonePommadePompierPonctuelPonde/rerPoneyPortiquePositionPosse/derPosturePotagerPoteauPotionPoucePoulainPoumonPourprePoussinPouvoirPrairiePratiquePre/cieuxPre/direPre/fixePre/ludePre/nomPre/sencePre/textePre/voirPrimitifPrincePrisonPriverProble-meProce/derProdigeProfondProgre-sProieProjeterProloguePromenerPropreProspe-reProte/gerProuesseProverbePrudencePruneauPsychosePublicPuceronPuiserPulpePulsarPunaisePunitifPupitrePurifierPuzzlePyramideQuasarQuerelleQuestionQuie/tudeQuitterQuotientRacineRaconterRadieuxRagondinRaideurRaisinRalentirRallongeRamasserRapideRasageRatisserRavagerRavinRayonnerRe/actifRe/agirRe/aliserRe/animerRecevoirRe/citerRe/clamerRe/colterRecruterReculerRecyclerRe/digerRedouterRefaireRe/flexeRe/formerRefrainRefugeRe/galienRe/gionRe/glageRe/gulierRe/ite/rerRejeterRejouerRelatifReleverReliefRemarqueReme-deRemiseRemonterRemplirRemuerRenardRenfortReniflerRenoncerRentrerRenvoiReplierReporterRepriseReptileRequinRe/serveRe/sineuxRe/soudreRespectResterRe/sultatRe/tablirRetenirRe/ticuleRetomberRetracerRe/unionRe/ussirRevancheRevivreRe/volteRe/vulsifRichesseRideauRieurRigideRigolerRincerRiposterRisibleRisqueRituelRivalRivie-reRocheuxRomanceRompreRonceRondinRoseauRosierRotatifRotorRotuleRougeRouilleRouleauRoutineRoyaumeRubanRubisRucheRuelleRugueuxRuinerRuisseauRuserRustiqueRythmeSablerSaboterSabreSacocheSafariSagesseSaisirSaladeSaliveSalonSaluerSamediSanctionSanglierSarcasmeSardineSaturerSaugrenuSaumonSauterSauvageSavantSavonnerScalpelScandaleSce/le/ratSce/narioSceptreSche/maScienceScinderScoreScrutinSculpterSe/anceSe/cableSe/cherSecouerSe/cre/terSe/datifSe/duireSeigneurSe/jourSe/lectifSemaineSemblerSemenceSe/minalSe/nateurSensibleSentenceSe/parerSe/quenceSereinSergentSe/rieuxSerrureSe/rumServiceSe/sameSe/virSevrageSextupleSide/ralSie-cleSie/gerSifflerSigleSignalSilenceSiliciumSimpleSince-reSinistreSiphonSiropSismiqueSituerSkierSocialSocleSodiumSoigneuxSoldatSoleilSolitudeSolubleSombreSommeilSomnolerSondeSongeurSonnetteSonoreSorcierSortirSosieSottiseSoucieuxSoudureSouffleSouleverSoupapeSourceSoutirerSouvenirSpacieuxSpatialSpe/cialSphe-reSpiralStableStationSternumStimulusStipulerStrictStudieuxStupeurStylisteSublimeSubstratSubtilSubvenirSucce-sSucreSuffixeSugge/rerSuiveurSulfateSuperbeSupplierSurfaceSuricateSurmenerSurpriseSursautSurvieSuspectSyllabeSymboleSyme/trieSynapseSyntaxeSyste-meTabacTablierTactileTaillerTalentTalismanTalonnerTambourTamiserTangibleTapisTaquinerTarderTarifTartineTasseTatamiTatouageTaupeTaureauTaxerTe/moinTemporelTenailleTendreTeneurTenirTensionTerminerTerneTerribleTe/tineTexteThe-meThe/orieThe/rapieThoraxTibiaTie-deTimideTirelireTiroirTissuTitaneTitreTituberTobogganTole/rantTomateToniqueTonneauToponymeTorcheTordreTornadeTorpilleTorrentTorseTortueTotemToucherTournageTousserToxineTractionTraficTragiqueTrahirTrainTrancherTravailTre-fleTremperTre/sorTreuilTriageTribunalTricoterTrilogieTriompheTriplerTriturerTrivialTromboneTroncTropicalTroupeauTuileTulipeTumulteTunnelTurbineTuteurTutoyerTuyauTympanTyphonTypiqueTyranUbuesqueUltimeUltrasonUnanimeUnifierUnionUniqueUnitaireUniversUraniumUrbainUrticantUsageUsineUsuelUsureUtileUtopieVacarmeVaccinVagabondVagueVaillantVaincreVaisseauValableValiseVallonValveVampireVanilleVapeurVarierVaseuxVassalVasteVecteurVedetteVe/ge/talVe/hiculeVeinardVe/loceVendrediVe/ne/rerVengerVenimeuxVentouseVerdureVe/rinVernirVerrouVerserVertuVestonVe/te/ranVe/tusteVexantVexerViaducViandeVictoireVidangeVide/oVignetteVigueurVilainVillageVinaigreViolonVipe-reVirementVirtuoseVirusVisageViseurVisionVisqueuxVisuelVitalVitesseViticoleVitrineVivaceVivipareVocationVoguerVoileVoisinVoitureVolailleVolcanVoltigerVolumeVoraceVortexVoterVouloirVoyageVoyelleWagonXe/nonYachtZe-breZe/nithZesteZoologie";
    var wordlist = null;
    var lookup = {};
    function dropDiacritic(word) {
      wordlist_1.logger.checkNormalize();
      return (0, strings_1.toUtf8String)(Array.prototype.filter.call((0, strings_1.toUtf8Bytes)(word.normalize("NFD").toLowerCase()), function(c) {
        return c >= 65 && c <= 90 || c >= 97 && c <= 123;
      }));
    }
    function expand(word) {
      var output = [];
      Array.prototype.forEach.call((0, strings_1.toUtf8Bytes)(word), function(c) {
        if (c === 47) {
          output.push(204);
          output.push(129);
        } else if (c === 45) {
          output.push(204);
          output.push(128);
        } else {
          output.push(c);
        }
      });
      return (0, strings_1.toUtf8String)(output);
    }
    function loadWords(lang) {
      if (wordlist != null) {
        return;
      }
      wordlist = words.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" ").map(function(w) {
        return expand(w);
      });
      wordlist.forEach(function(word, index) {
        lookup[dropDiacritic(word)] = index;
      });
      if (wordlist_1.Wordlist.check(lang) !== "0x51deb7ae009149dc61a6bd18a918eb7ac78d2775726c68e598b92d002519b045") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for fr (French) FAILED");
      }
    }
    var LangFr = (
      /** @class */
      function(_super) {
        __extends(LangFr2, _super);
        function LangFr2() {
          return _super.call(this, "fr") || this;
        }
        LangFr2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangFr2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return lookup[dropDiacritic(word)];
        };
        return LangFr2;
      }(wordlist_1.Wordlist)
    );
    var langFr = new LangFr();
    exports.langFr = langFr;
    wordlist_1.Wordlist.register(langFr);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-ja.js
var require_lang_ja = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-ja.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langJa = void 0;
    var bytes_1 = require_lib2();
    var strings_1 = require_lib11();
    var wordlist_1 = require_wordlist();
    var data = [
      // 4-kana words
      "AQRASRAGBAGUAIRAHBAghAURAdBAdcAnoAMEAFBAFCBKFBQRBSFBCXBCDBCHBGFBEQBpBBpQBIkBHNBeOBgFBVCBhBBhNBmOBmRBiHBiFBUFBZDBvFBsXBkFBlcBjYBwDBMBBTBBTRBWBBWXXaQXaRXQWXSRXCFXYBXpHXOQXHRXhRXuRXmXXbRXlXXwDXTRXrCXWQXWGaBWaKcaYgasFadQalmaMBacAKaRKKBKKXKKjKQRKDRKCYKCRKIDKeVKHcKlXKjHKrYNAHNBWNaRNKcNIBNIONmXNsXNdXNnBNMBNRBNrXNWDNWMNFOQABQAHQBrQXBQXFQaRQKXQKDQKOQKFQNBQNDQQgQCXQCDQGBQGDQGdQYXQpBQpQQpHQLXQHuQgBQhBQhCQuFQmXQiDQUFQZDQsFQdRQkHQbRQlOQlmQPDQjDQwXQMBQMDQcFQTBQTHQrDDXQDNFDGBDGQDGRDpFDhFDmXDZXDbRDMYDRdDTRDrXSAhSBCSBrSGQSEQSHBSVRShYShkSyQSuFSiBSdcSoESocSlmSMBSFBSFKSFNSFdSFcCByCaRCKcCSBCSRCCrCGbCEHCYXCpBCpQCIBCIHCeNCgBCgFCVECVcCmkCmwCZXCZFCdRClOClmClFCjDCjdCnXCwBCwXCcRCFQCFjGXhGNhGDEGDMGCDGCHGIFGgBGVXGVEGVRGmXGsXGdYGoSGbRGnXGwXGwDGWRGFNGFLGFOGFdGFkEABEBDEBFEXOEaBEKSENBENDEYXEIgEIkEgBEgQEgHEhFEudEuFEiBEiHEiFEZDEvBEsXEsFEdXEdREkFEbBEbRElFEPCEfkEFNYAEYAhYBNYQdYDXYSRYCEYYoYgQYgRYuRYmCYZTYdBYbEYlXYjQYRbYWRpKXpQopQnpSFpCXpIBpISphNpdBpdRpbRpcZpFBpFNpFDpFopFrLADLBuLXQLXcLaFLCXLEhLpBLpFLHXLeVLhILdHLdRLoDLbRLrXIABIBQIBCIBsIBoIBMIBRIXaIaRIKYIKRINBINuICDIGBIIDIIkIgRIxFIyQIiHIdRIbYIbRIlHIwRIMYIcRIRVITRIFBIFNIFQOABOAFOBQOaFONBONMOQFOSFOCDOGBOEQOpBOLXOIBOIFOgQOgFOyQOycOmXOsXOdIOkHOMEOMkOWWHBNHXNHXWHNXHDuHDRHSuHSRHHoHhkHmRHdRHkQHlcHlRHwBHWcgAEgAggAkgBNgBQgBEgXOgYcgLXgHjgyQgiBgsFgdagMYgWSgFQgFEVBTVXEVKBVKNVKDVKYVKRVNBVNYVDBVDxVSBVSRVCjVGNVLXVIFVhBVhcVsXVdRVbRVlRhBYhKYhDYhGShxWhmNhdahdkhbRhjohMXhTRxAXxXSxKBxNBxEQxeNxeQxhXxsFxdbxlHxjcxFBxFNxFQxFOxFoyNYyYoybcyMYuBQuBRuBruDMuCouHBudQukkuoBulVuMXuFEmCYmCRmpRmeDmiMmjdmTFmFQiADiBOiaRiKRiNBiNRiSFiGkiGFiERipRiLFiIFihYibHijBijEiMXiWBiFBiFCUBQUXFUaRUNDUNcUNRUNFUDBUSHUCDUGBUGFUEqULNULoUIRUeEUeYUgBUhFUuRUiFUsXUdFUkHUbBUjSUjYUwXUMDUcHURdUTBUrBUrXUrQZAFZXZZaRZKFZNBZQFZCXZGBZYdZpBZLDZIFZHXZHNZeQZVRZVFZmXZiBZvFZdFZkFZbHZbFZwXZcCZcRZRBvBQvBGvBLvBWvCovMYsAFsBDsaRsKFsNFsDrsSHsSFsCXsCRsEBsEHsEfspBsLBsLDsIgsIRseGsbRsFBsFQsFSdNBdSRdCVdGHdYDdHcdVbdySduDdsXdlRdwXdWYdWcdWRkBMkXOkaRkNIkNFkSFkCFkYBkpRkeNkgBkhVkmXksFklVkMBkWDkFNoBNoaQoaFoNBoNXoNaoNEoSRoEroYXoYCoYbopRopFomXojkowXorFbBEbEIbdBbjYlaRlDElMXlFDjKjjSRjGBjYBjYkjpRjLXjIBjOFjeVjbRjwBnXQnSHnpFnLXnINnMBnTRwXBwXNwXYwNFwQFwSBwGFwLXwLDweNwgBwuHwjDwnXMBXMpFMIBMeNMTHcaQcNBcDHcSFcCXcpBcLXcLDcgFcuFcnXcwXccDcTQcrFTQErXNrCHrpFrgFrbFrTHrFcWNYWNbWEHWMXWTR",
      // 5-kana words
      "ABGHABIJAEAVAYJQALZJAIaRAHNXAHdcAHbRAZJMAZJRAZTRAdVJAklmAbcNAjdRAMnRAMWYAWpRAWgRAFgBAFhBAFdcBNJBBNJDBQKBBQhcBQlmBDEJBYJkBYJTBpNBBpJFBIJBBIJDBIcABOKXBOEJBOVJBOiJBOZJBepBBeLXBeIFBegBBgGJBVJXBuocBiJRBUJQBlXVBlITBwNFBMYVBcqXBTlmBWNFBWiJBWnRBFGHBFwXXKGJXNJBXNZJXDTTXSHSXSVRXSlHXCJDXGQJXEhXXYQJXYbRXOfXXeNcXVJFXhQJXhEJXdTRXjdXXMhBXcQTXRGBXTEBXTnQXFCXXFOFXFgFaBaFaBNJaBCJaBpBaBwXaNJKaNJDaQIBaDpRaEPDaHMFamDJalEJaMZJaFaFaFNBaFQJaFLDaFVHKBCYKBEBKBHDKXaFKXGdKXEJKXpHKXIBKXZDKXwXKKwLKNacKNYJKNJoKNWcKDGdKDTRKChXKGaRKGhBKGbRKEBTKEaRKEPTKLMDKLWRKOHDKVJcKdBcKlIBKlOPKFSBKFEPKFpFNBNJNJBQNBGHNBEPNBHXNBgFNBVXNBZDNBsXNBwXNNaRNNJDNNJENNJkNDCJNDVDNGJRNJiDNZJNNsCJNJFNNFSBNFCXNFEPNFLXNFIFQJBFQCaRQJEQQLJDQLJFQIaRQOqXQHaFQHHQQVJXQVJDQhNJQmEIQZJFQsJXQJrFQWbRDJABDBYJDXNFDXCXDXLXDXZDDXsJDQqXDSJFDJCXDEPkDEqXDYmQDpSJDOCkDOGQDHEIDVJDDuDuDWEBDJFgSBNDSBSFSBGHSBIBSBTQSKVYSJQNSJQiSJCXSEqXSJYVSIiJSOMYSHAHSHaQSeCFSepQSegBSHdHSHrFShSJSJuHSJUFSkNRSrSrSWEBSFaHSJFQSFCXSFGDSFYXSFODSFgBSFVXSFhBSFxFSFkFSFbBSFMFCADdCJXBCXaFCXKFCXNFCXCXCXGBCXEJCXYBCXLDCXIBCXOPCXHXCXgBCXhBCXiBCXlDCXcHCJNBCJNFCDCJCDGBCDVXCDhBCDiDCDJdCCmNCpJFCIaRCOqXCHCHCHZJCViJCuCuCmddCJiFCdNBCdHhClEJCnUJCreSCWlgCWTRCFBFCFNBCFYBCFVFCFhFCFdSCFTBCFWDGBNBGBQFGJBCGBEqGBpBGBgQGNBEGNJYGNkOGNJRGDUFGJpQGHaBGJeNGJeEGVBlGVKjGiJDGvJHGsVJGkEBGMIJGWjNGFBFGFCXGFGBGFYXGFpBGFMFEASJEAWpEJNFECJVEIXSEIQJEOqXEOcFEeNcEHEJEHlFEJgFEhlmEmDJEmZJEiMBEUqXEoSREPBFEPXFEPKFEPSFEPEFEPpFEPLXEPIBEJPdEPcFEPTBEJnXEqlHEMpREFCXEFODEFcFYASJYJAFYBaBYBVXYXpFYDhBYCJBYJGFYYbRYeNcYJeVYiIJYZJcYvJgYvJRYJsXYsJFYMYMYreVpBNHpBEJpBwXpQxFpYEJpeNDpJeDpeSFpeCHpHUJpHbBpHcHpmUJpiiJpUJrpsJuplITpFaBpFQqpFGBpFEfpFYBpFpBpFLJpFIDpFgBpFVXpFyQpFuFpFlFpFjDpFnXpFwXpJFMpFTBLXCJLXEFLXhFLXUJLXbFLalmLNJBLSJQLCLCLGJBLLDJLHaFLeNFLeSHLeCXLepFLhaRLZsJLsJDLsJrLocaLlLlLMdbLFNBLFSBLFEHLFkFIBBFIBXFIBaQIBKXIBSFIBpHIBLXIBgBIBhBIBuHIBmXIBiFIBZXIBvFIBbFIBjQIBwXIBWFIKTRIQUJIDGFICjQIYSRIINXIJeCIVaRImEkIZJFIvJRIsJXIdCJIJoRIbBQIjYBIcqXITFVIreVIFKFIFSFIFCJIFGFIFLDIFIBIJFOIFgBIFVXIJFhIFxFIFmXIFdHIFbBIJFrIJFWOBGBOQfXOOKjOUqXOfXBOqXEOcqXORVJOFIBOFlDHBIOHXiFHNTRHCJXHIaRHHJDHHEJHVbRHZJYHbIBHRsJHRkDHWlmgBKFgBSBgBCDgBGHgBpBgBIBgBVJgBuBgBvFgKDTgQVXgDUJgGSJgOqXgmUMgZIJgTUJgWIEgFBFgFNBgFDJgFSFgFGBgFYXgJFOgFgQgFVXgFhBgFbHgJFWVJABVQKcVDgFVOfXVeDFVhaRVmGdViJYVMaRVFNHhBNDhBCXhBEqhBpFhBLXhNJBhSJRheVXhhKEhxlmhZIJhdBQhkIJhbMNhMUJhMZJxNJgxQUJxDEkxDdFxSJRxplmxeSBxeCXxeGFxeYXxepQxegBxWVcxFEQxFLXxFIBxFgBxFxDxFZtxFdcxFbBxFwXyDJXyDlcuASJuDJpuDIBuCpJuGSJuIJFueEFuZIJusJXudWEuoIBuWGJuFBcuFKEuFNFuFQFuFDJuFGJuFVJuFUtuFdHuFTBmBYJmNJYmQhkmLJDmLJomIdXmiJYmvJRmsJRmklmmMBymMuCmclmmcnQiJABiJBNiJBDiBSFiBCJiBEFiBYBiBpFiBLXiBTHiJNciDEfiCZJiECJiJEqiOkHiHKFieNDiHJQieQcieDHieSFieCXieGFieEFieIHiegFihUJixNoioNXiFaBiFKFiFNDiFEPiFYXitFOitFHiFgBiFVEiFmXiFitiFbBiFMFiFrFUCXQUIoQUIJcUHQJUeCEUHwXUUJDUUqXUdWcUcqXUrnQUFNDUFSHUFCFUFEfUFLXUtFOZBXOZXSBZXpFZXVXZEQJZEJkZpDJZOqXZeNHZeCDZUqXZFBQZFEHZFLXvBAFvBKFvBCXvBEPvBpHvBIDvBgFvBuHvQNJvFNFvFGBvFIBvJFcsXCDsXLXsXsXsXlFsXcHsQqXsJQFsEqXseIFsFEHsFjDdBxOdNpRdNJRdEJbdpJRdhZJdnSJdrjNdFNJdFQHdFhNkNJDkYaRkHNRkHSRkVbRkuMRkjSJkcqDoSJFoEiJoYZJoOfXohEBoMGQocqXbBAFbBXFbBaFbBNDbBGBbBLXbBTBbBWDbGJYbIJHbFQqbFpQlDgQlOrFlVJRjGEBjZJRnXvJnXbBnEfHnOPDngJRnxfXnUJWwXEJwNpJwDpBwEfXwrEBMDCJMDGHMDIJMLJDcQGDcQpHcqXccqNFcqCXcFCJRBSBRBGBRBEJRBpQTBNFTBQJTBpBTBVXTFABTFSBTFCFTFGBTFMDrXCJrXLDrDNJrEfHrFQJrFitWNjdWNTR",
      // 6-kana words
      "AKLJMANOPFASNJIAEJWXAYJNRAIIbRAIcdaAeEfDAgidRAdjNYAMYEJAMIbRAFNJBAFpJFBBIJYBDZJFBSiJhBGdEBBEJfXBEJqXBEJWRBpaUJBLXrXBIYJMBOcfXBeEfFBestXBjNJRBcDJOBFEqXXNvJRXDMBhXCJNYXOAWpXONJWXHDEBXeIaRXhYJDXZJSJXMDJOXcASJXFVJXaBQqXaBZJFasXdQaFSJQaFEfXaFpJHaFOqXKBNSRKXvJBKQJhXKEJQJKEJGFKINJBKIJjNKgJNSKVElmKVhEBKiJGFKlBgJKjnUJKwsJYKMFIJKFNJDKFIJFKFOfXNJBSFNJBCXNBpJFNJBvQNJBMBNJLJXNJOqXNJeCXNJeGFNdsJCNbTKFNwXUJQNFEPQDiJcQDMSJQSFpBQGMQJQJeOcQyCJEQUJEBQJFBrQFEJqDXDJFDJXpBDJXIMDGiJhDIJGRDJeYcDHrDJDVXgFDkAWpDkIgRDjDEqDMvJRDJFNFDJFIBSKclmSJQOFSJQVHSJQjDSJGJBSJGJFSECJoSHEJqSJHTBSJVJDSViJYSZJNBSJsJDSFSJFSFEfXSJFLXCBUJVCJXSBCJXpBCXVJXCJXsXCJXdFCJNJHCLIJgCHiJFCVNJMChCJhCUHEJCsJTRCJdYcCoQJCCFEfXCFIJgCFUJxCFstFGJBaQGJBIDGQJqXGYJNRGJHKFGeQqDGHEJFGJeLXGHIiJGHdBlGUJEBGkIJTGFQPDGJFEqEAGegEJIJBEJVJXEhQJTEiJNcEJZJFEJoEqEjDEqEPDsXEPGJBEPOqXEPeQFEfDiDEJfEFEfepQEfMiJEqXNBEqDIDEqeSFEqVJXEMvJRYXNJDYXEJHYKVJcYYJEBYJeEcYJUqXYFpJFYFstXpAZJMpBSJFpNBNFpeQPDpHLJDpHIJFpHgJFpeitFpHZJFpJFADpFSJFpJFCJpFOqXpFitBpJFZJLXIJFLIJgRLVNJWLVHJMLwNpJLFGJBLFLJDLFOqXLJFUJIBDJXIBGJBIJBYQIJBIBIBOqXIBcqDIEGJFILNJTIIJEBIOiJhIJeNBIJeIBIhiJIIWoTRIJFAHIJFpBIJFuHIFUtFIJFTHOSBYJOEcqXOHEJqOvBpFOkVJrObBVJOncqDOcNJkHhNJRHuHJuHdMhBgBUqXgBsJXgONJBgHNJDgHHJQgJeitgHsJXgJyNagyDJBgZJDrgsVJQgkEJNgkjSJgJFAHgFCJDgFZtMVJXNFVXQfXVJXDJVXoQJVQVJQVDEfXVDvJHVEqNFVeQfXVHpJFVHxfXVVJSRVVmaRVlIJOhCXVJhHjYkhxCJVhWVUJhWiJcxBNJIxeEqDxfXBFxcFEPxFSJFxFYJXyBDQJydaUJyFOPDuYCJYuLvJRuHLJXuZJLDuFOPDuFZJHuFcqXmKHJdmCQJcmOsVJiJAGFitLCFieOfXiestXiZJMEikNJQirXzFiFQqXiFIJFiFZJFiFvtFUHpJFUteIcUteOcUVCJkUhdHcUbEJEUJqXQUMNJhURjYkUFitFZDGJHZJIxDZJVJXZJFDJZJFpQvBNJBvBSJFvJxBrseQqDsVFVJdFLJDkEJNBkmNJYkFLJDoQJOPoGsJRoEAHBoEJfFbBQqDbBZJHbFVJXlFIJBjYIrXjeitcjjCEBjWMNBwXQfXwXOaFwDsJXwCJTRwrCZJMDNJQcDDJFcqDOPRYiJFTBsJXTQIJBTFEfXTFLJDrXEJFrEJXMrFZJFWEJdEWYTlm",
      // 7-kana words
      "ABCDEFACNJTRAMBDJdAcNJVXBLNJEBXSIdWRXErNJkXYDJMBXZJCJaXMNJaYKKVJKcKDEJqXKDcNJhKVJrNYKbgJVXKFVJSBNBYBwDNJeQfXNJeEqXNhGJWENJFiJRQlIJbEQJfXxDQqXcfXQFNDEJQFwXUJDYcnUJDJIBgQDIUJTRDJFEqDSJQSJFSJQIJFSOPeZtSJFZJHCJXQfXCTDEqFGJBSJFGJBOfXGJBcqXGJHNJDGJRLiJEJfXEqEJFEJPEFpBEJYJBZJFYBwXUJYiJMEBYJZJyTYTONJXpQMFXFpeGIDdpJFstXpJFcPDLBVSJRLHQJqXLJFZJFIJBNJDIJBUqXIBkFDJIJEJPTIYJGWRIJeQPDIJeEfHIJFsJXOqGDSFHXEJqXgJCsJCgGQJqXgdQYJEgFMFNBgJFcqDVJwXUJVJFZJchIgJCCxOEJqXxOwXUJyDJBVRuscisciJBiJBieUtqXiJFDJkiFsJXQUGEZJcUJFsJXZtXIrXZDZJDrZJFNJDZJFstXvJFQqXvJFCJEsJXQJqkhkNGBbDJdTRbYJMEBlDwXUJMEFiJFcfXNJDRcNJWMTBLJXC",
      // 8-kana words
      "BraFUtHBFSJFdbNBLJXVJQoYJNEBSJBEJfHSJHwXUJCJdAZJMGjaFVJXEJPNJBlEJfFiJFpFbFEJqIJBVJCrIBdHiJhOPFChvJVJZJNJWxGFNIFLueIBQJqUHEJfUFstOZJDrlXEASJRlXVJXSFwVJNJWD",
      // 9-kana words
      "QJEJNNJDQJEJIBSFQJEJxegBQJEJfHEPSJBmXEJFSJCDEJqXLXNJFQqXIcQsFNJFIFEJqXUJgFsJXIJBUJEJfHNFvJxEqXNJnXUJFQqD",
      // 10-kana words
      "IJBEJqXZJ"
    ];
    var mapping = "~~AzB~X~a~KN~Q~D~S~C~G~E~Y~p~L~I~O~eH~g~V~hxyumi~~U~~Z~~v~~s~~dkoblPjfnqwMcRTr~W~~~F~~~~~Jt";
    var wordlist = null;
    function hex(word) {
      return (0, bytes_1.hexlify)((0, strings_1.toUtf8Bytes)(word));
    }
    var KiYoKu = "0xe3818de38284e3818f";
    var KyoKu = "0xe3818de38283e3818f";
    function loadWords(lang) {
      if (wordlist !== null) {
        return;
      }
      wordlist = [];
      var transform = {};
      transform[(0, strings_1.toUtf8String)([227, 130, 154])] = false;
      transform[(0, strings_1.toUtf8String)([227, 130, 153])] = false;
      transform[(0, strings_1.toUtf8String)([227, 130, 133])] = (0, strings_1.toUtf8String)([227, 130, 134]);
      transform[(0, strings_1.toUtf8String)([227, 129, 163])] = (0, strings_1.toUtf8String)([227, 129, 164]);
      transform[(0, strings_1.toUtf8String)([227, 130, 131])] = (0, strings_1.toUtf8String)([227, 130, 132]);
      transform[(0, strings_1.toUtf8String)([227, 130, 135])] = (0, strings_1.toUtf8String)([227, 130, 136]);
      function normalize(word2) {
        var result = "";
        for (var i2 = 0; i2 < word2.length; i2++) {
          var kana = word2[i2];
          var target = transform[kana];
          if (target === false) {
            continue;
          }
          if (target) {
            kana = target;
          }
          result += kana;
        }
        return result;
      }
      function sortJapanese(a, b) {
        a = normalize(a);
        b = normalize(b);
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      }
      for (var length_1 = 3; length_1 <= 9; length_1++) {
        var d = data[length_1 - 3];
        for (var offset = 0; offset < d.length; offset += length_1) {
          var word = [];
          for (var i = 0; i < length_1; i++) {
            var k = mapping.indexOf(d[offset + i]);
            word.push(227);
            word.push(k & 64 ? 130 : 129);
            word.push((k & 63) + 128);
          }
          wordlist.push((0, strings_1.toUtf8String)(word));
        }
      }
      wordlist.sort(sortJapanese);
      if (hex(wordlist[442]) === KiYoKu && hex(wordlist[443]) === KyoKu) {
        var tmp = wordlist[442];
        wordlist[442] = wordlist[443];
        wordlist[443] = tmp;
      }
      if (wordlist_1.Wordlist.check(lang) !== "0xcb36b09e6baa935787fd762ce65e80b0c6a8dabdfbc3a7f86ac0e2c4fd111600") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for ja (Japanese) FAILED");
      }
    }
    var LangJa = (
      /** @class */
      function(_super) {
        __extends(LangJa2, _super);
        function LangJa2() {
          return _super.call(this, "ja") || this;
        }
        LangJa2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangJa2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return wordlist.indexOf(word);
        };
        LangJa2.prototype.split = function(mnemonic) {
          wordlist_1.logger.checkNormalize();
          return mnemonic.split(/(?:\u3000| )+/g);
        };
        LangJa2.prototype.join = function(words) {
          return words.join("\u3000");
        };
        return LangJa2;
      }(wordlist_1.Wordlist)
    );
    var langJa = new LangJa();
    exports.langJa = langJa;
    wordlist_1.Wordlist.register(langJa);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-ko.js
var require_lang_ko = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-ko.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langKo = void 0;
    var strings_1 = require_lib11();
    var wordlist_1 = require_wordlist();
    var data = [
      "OYAa",
      "ATAZoATBl3ATCTrATCl8ATDloATGg3ATHT8ATJT8ATJl3ATLlvATLn4ATMT8ATMX8ATMboATMgoAToLbAToMTATrHgATvHnAT3AnAT3JbAT3MTAT8DbAT8JTAT8LmAT8MYAT8MbAT#LnAUHT8AUHZvAUJXrAUJX8AULnrAXJnvAXLUoAXLgvAXMn6AXRg3AXrMbAX3JTAX3QbAYLn3AZLgvAZrSUAZvAcAZ8AaAZ8AbAZ8AnAZ8HnAZ8LgAZ8MYAZ8MgAZ8OnAaAboAaDTrAaFTrAaJTrAaJboAaLVoAaMXvAaOl8AaSeoAbAUoAbAg8AbAl4AbGnrAbMT8AbMXrAbMn4AbQb8AbSV8AbvRlAb8AUAb8AnAb8HgAb8JTAb8NTAb8RbAcGboAcLnvAcMT8AcMX8AcSToAcrAaAcrFnAc8AbAc8MgAfGgrAfHboAfJnvAfLV8AfLkoAfMT8AfMnoAfQb8AfScrAfSgrAgAZ8AgFl3AgGX8AgHZvAgHgrAgJXoAgJX8AgJboAgLZoAgLn4AgOX8AgoATAgoAnAgoCUAgoJgAgoLXAgoMYAgoSeAgrDUAgrJTAhrFnAhrLjAhrQgAjAgoAjJnrAkMX8AkOnoAlCTvAlCV8AlClvAlFg4AlFl6AlFn3AloSnAlrAXAlrAfAlrFUAlrFbAlrGgAlrOXAlvKnAlvMTAl3AbAl3MnAnATrAnAcrAnCZ3AnCl8AnDg8AnFboAnFl3AnHX4AnHbrAnHgrAnIl3AnJgvAnLXoAnLX4AnLbrAnLgrAnLhrAnMXoAnMgrAnOn3AnSbrAnSeoAnvLnAn3OnCTGgvCTSlvCTvAUCTvKnCTvNTCT3CZCT3GUCT3MTCT8HnCUCZrCULf8CULnvCU3HnCU3JUCY6NUCbDb8CbFZoCbLnrCboOTCboScCbrFnCbvLnCb8AgCb8HgCb$LnCkLfoClBn3CloDUDTHT8DTLl3DTSU8DTrAaDTrLXDTrLjDTrOYDTrOgDTvFXDTvFnDT3HUDT3LfDUCT9DUDT4DUFVoDUFV8DUFkoDUGgrDUJnrDULl8DUMT8DUMXrDUMX4DUMg8DUOUoDUOgvDUOg8DUSToDUSZ8DbDXoDbDgoDbGT8DbJn3DbLg3DbLn4DbMXrDbMg8DbOToDboJXGTClvGTDT8GTFZrGTLVoGTLlvGTLl3GTMg8GTOTvGTSlrGToCUGTrDgGTrJYGTrScGTtLnGTvAnGTvQgGUCZrGUDTvGUFZoGUHXrGULnvGUMT8GUoMgGXoLnGXrMXGXrMnGXvFnGYLnvGZOnvGZvOnGZ8LaGZ8LmGbAl3GbDYvGbDlrGbHX3GbJl4GbLV8GbLn3GbMn4GboJTGboRfGbvFUGb3GUGb4JnGgDX3GgFl$GgJlrGgLX6GgLZoGgLf8GgOXoGgrAgGgrJXGgrMYGgrScGgvATGgvOYGnAgoGnJgvGnLZoGnLg3GnLnrGnQn8GnSbrGnrMgHTClvHTDToHTFT3HTQT8HToJTHToJgHTrDUHTrMnHTvFYHTvRfHT8MnHT8SUHUAZ8HUBb4HUDTvHUoMYHXFl6HXJX6HXQlrHXrAUHXrMnHXrSbHXvFYHXvKXHX3LjHX3MeHYvQlHZrScHZvDbHbAcrHbFT3HbFl3HbJT8HbLTrHbMT8HbMXrHbMbrHbQb8HbSX3HboDbHboJTHbrFUHbrHgHbrJTHb8JTHb8MnHb8QgHgAlrHgDT3HgGgrHgHgrHgJTrHgJT8HgLX@HgLnrHgMT8HgMX8HgMboHgOnrHgQToHgRg3HgoHgHgrCbHgrFnHgrLVHgvAcHgvAfHnAloHnCTrHnCnvHnGTrHnGZ8HnGnvHnJT8HnLf8HnLkvHnMg8HnRTrITvFUITvFnJTAXrJTCV8JTFT3JTFT8JTFn4JTGgvJTHT8JTJT8JTJXvJTJl3JTJnvJTLX4JTLf8JTLhvJTMT8JTMXrJTMnrJTObrJTQT8JTSlvJT8DUJT8FkJT8MTJT8OXJT8OgJT8QUJT8RfJUHZoJXFT4JXFlrJXGZ8JXGnrJXLV8JXLgvJXMXoJXMX3JXNboJXPlvJXoJTJXoLkJXrAXJXrHUJXrJgJXvJTJXvOnJX4KnJYAl3JYJT8JYLhvJYQToJYrQXJY6NUJbAl3JbCZrJbDloJbGT8JbGgrJbJXvJbJboJbLf8JbLhrJbLl3JbMnvJbRg8JbSZ8JboDbJbrCZJbrSUJb3KnJb8LnJfRn8JgAXrJgCZrJgDTrJgGZrJgGZ8JgHToJgJT8JgJXoJgJgvJgLX4JgLZ3JgLZ8JgLn4JgMgrJgMn4JgOgvJgPX6JgRnvJgSToJgoCZJgoJbJgoMYJgrJXJgrJgJgrLjJg6MTJlCn3JlGgvJlJl8Jl4AnJl8FnJl8HgJnAToJnATrJnAbvJnDUoJnGnrJnJXrJnJXvJnLhvJnLnrJnLnvJnMToJnMT8JnMXvJnMX3JnMg8JnMlrJnMn4JnOX8JnST4JnSX3JnoAgJnoAnJnoJTJnoObJnrAbJnrAkJnrHnJnrJTJnrJYJnrOYJnrScJnvCUJnvFaJnvJgJnvJnJnvOYJnvQUJnvRUJn3FnJn3JTKnFl3KnLT6LTDlvLTMnoLTOn3LTRl3LTSb4LTSlrLToAnLToJgLTrAULTrAcLTrCULTrHgLTrMgLT3JnLULnrLUMX8LUoJgLVATrLVDTrLVLb8LVoJgLV8MgLV8RTLXDg3LXFlrLXrCnLXrLXLX3GTLX4GgLX4OYLZAXrLZAcrLZAgrLZAhrLZDXyLZDlrLZFbrLZFl3LZJX6LZJX8LZLc8LZLnrLZSU8LZoJTLZoJnLZrAgLZrAnLZrJYLZrLULZrMgLZrSkLZvAnLZvGULZvJeLZvOTLZ3FZLZ4JXLZ8STLZ8ScLaAT3LaAl3LaHT8LaJTrLaJT8LaJXrLaJgvLaJl4LaLVoLaMXrLaMXvLaMX8LbClvLbFToLbHlrLbJn4LbLZ3LbLhvLbMXrLbMnoLbvSULcLnrLc8HnLc8MTLdrMnLeAgoLeOgvLeOn3LfAl3LfLnvLfMl3LfOX8Lf8AnLf8JXLf8LXLgJTrLgJXrLgJl8LgMX8LgRZrLhCToLhrAbLhrFULhrJXLhvJYLjHTrLjHX4LjJX8LjLhrLjSX3LjSZ4LkFX4LkGZ8LkGgvLkJTrLkMXoLkSToLkSU8LkSZ8LkoOYLl3FfLl3MgLmAZrLmCbrLmGgrLmHboLmJnoLmJn3LmLfoLmLhrLmSToLnAX6LnAb6LnCZ3LnCb3LnDTvLnDb8LnFl3LnGnrLnHZvLnHgvLnITvLnJT8LnJX8LnJlvLnLf8LnLg6LnLhvLnLnoLnMXrLnMg8LnQlvLnSbrLnrAgLnrAnLnrDbLnrFkLnrJdLnrMULnrOYLnrSTLnvAnLnvDULnvHgLnvOYLnvOnLn3GgLn4DULn4JTLn4JnMTAZoMTAloMTDb8MTFT8MTJnoMTJnrMTLZrMTLhrMTLkvMTMX8MTRTrMToATMTrDnMTrOnMT3JnMT4MnMT8FUMT8FaMT8FlMT8GTMT8GbMT8GnMT8HnMT8JTMT8JbMT8OTMUCl8MUJTrMUJU8MUMX8MURTrMUSToMXAX6MXAb6MXCZoMXFXrMXHXrMXLgvMXOgoMXrAUMXrAnMXrHgMXrJYMXrJnMXrMTMXrMgMXrOYMXrSZMXrSgMXvDUMXvOTMX3JgMX3OTMX4JnMX8DbMX8FnMX8HbMX8HgMX8HnMX8LbMX8MnMX8OnMYAb8MYGboMYHTvMYHX4MYLTrMYLnvMYMToMYOgvMYRg3MYSTrMbAToMbAXrMbAl3MbAn8MbGZ8MbJT8MbJXrMbMXvMbMX8MbMnoMbrMUMb8AfMb8FbMb8FkMcJXoMeLnrMgFl3MgGTvMgGXoMgGgrMgGnrMgHT8MgHZrMgJnoMgLnrMgLnvMgMT8MgQUoMgrHnMgvAnMg8HgMg8JYMg8LfMloJnMl8ATMl8AXMl8JYMnAToMnAT4MnAZ8MnAl3MnAl4MnCl8MnHT8MnHg8MnJnoMnLZoMnLhrMnMXoMnMX3MnMnrMnOgvMnrFbMnrFfMnrFnMnrNTMnvJXNTMl8OTCT3OTFV8OTFn3OTHZvOTJXrOTOl3OT3ATOT3JUOT3LZOT3LeOT3MbOT8ATOT8AbOT8AgOT8MbOUCXvOUMX3OXHXvOXLl3OXrMUOXvDbOX6NUOX8JbOYFZoOYLbrOYLkoOYMg8OYSX3ObHTrObHT4ObJgrObLhrObMX3ObOX8Ob8FnOeAlrOeJT8OeJXrOeJnrOeLToOeMb8OgJXoOgLXoOgMnrOgOXrOgOloOgoAgOgoJbOgoMYOgoSTOg8AbOjLX4OjMnoOjSV8OnLVoOnrAgOn3DUPXQlrPXvFXPbvFTPdAT3PlFn3PnvFbQTLn4QToAgQToMTQULV8QURg8QUoJnQXCXvQbFbrQb8AaQb8AcQb8FbQb8MYQb8ScQeAlrQeLhrQjAn3QlFXoQloJgQloSnRTLnvRTrGURTrJTRUJZrRUoJlRUrQnRZrLmRZrMnRZrSnRZ8ATRZ8JbRZ8ScRbMT8RbST3RfGZrRfMX8RfMgrRfSZrRnAbrRnGT8RnvJgRnvLfRnvMTRn8AaSTClvSTJgrSTOXrSTRg3STRnvSToAcSToAfSToAnSToHnSToLjSToMTSTrAaSTrEUST3BYST8AgST8LmSUAZvSUAgrSUDT4SUDT8SUGgvSUJXoSUJXvSULTrSU8JTSU8LjSV8AnSV8JgSXFToSXLf8SYvAnSZrDUSZrMUSZrMnSZ8HgSZ8JTSZ8JgSZ8MYSZ8QUSaQUoSbCT3SbHToSbQYvSbSl4SboJnSbvFbSb8HbSb8JgSb8OTScGZrScHgrScJTvScMT8ScSToScoHbScrMTScvAnSeAZrSeAcrSeHboSeJUoSeLhrSeMT8SeMXrSe6JgSgHTrSkJnoSkLnvSk8CUSlFl3SlrSnSl8GnSmAboSmGT8SmJU8",
      "ATLnDlATrAZoATrJX4ATrMT8ATrMX4ATrRTrATvDl8ATvJUoATvMl8AT3AToAT3MX8AT8CT3AT8DT8AT8HZrAT8HgoAUAgFnAUCTFnAXoMX8AXrAT8AXrGgvAXrJXvAXrOgoAXvLl3AZvAgoAZvFbrAZvJXoAZvJl8AZvJn3AZvMX8AZvSbrAZ8FZoAZ8LZ8AZ8MU8AZ8OTvAZ8SV8AZ8SX3AbAgFZAboJnoAbvGboAb8ATrAb8AZoAb8AgrAb8Al4Ab8Db8Ab8JnoAb8LX4Ab8LZrAb8LhrAb8MT8Ab8OUoAb8Qb8Ab8ST8AcrAUoAcrAc8AcrCZ3AcrFT3AcrFZrAcrJl4AcrJn3AcrMX3AcrOTvAc8AZ8Ac8MT8AfAcJXAgoFn4AgoGgvAgoGnrAgoLc8AgoMXoAgrLnrAkrSZ8AlFXCTAloHboAlrHbrAlrLhrAlrLkoAl3CZrAl3LUoAl3LZrAnrAl4AnrMT8An3HT4BT3IToBX4MnvBb!Ln$CTGXMnCToLZ4CTrHT8CT3JTrCT3RZrCT#GTvCU6GgvCU8Db8CU8GZrCU8HT8CboLl3CbrGgrCbrMU8Cb8DT3Cb8GnrCb8LX4Cb8MT8Cb8ObrCgrGgvCgrKX4Cl8FZoDTrAbvDTrDboDTrGT6DTrJgrDTrMX3DTrRZrDTrRg8DTvAVvDTvFZoDT3DT8DT3Ln3DT4HZrDT4MT8DT8AlrDT8MT8DUAkGbDUDbJnDYLnQlDbDUOYDbMTAnDbMXSnDboAT3DboFn4DboLnvDj6JTrGTCgFTGTGgFnGTJTMnGTLnPlGToJT8GTrCT3GTrLVoGTrLnvGTrMX3GTrMboGTvKl3GZClFnGZrDT3GZ8DTrGZ8FZ8GZ8MXvGZ8On8GZ8ST3GbCnQXGbMbFnGboFboGboJg3GboMXoGb3JTvGb3JboGb3Mn6Gb3Qb8GgDXLjGgMnAUGgrDloGgrHX4GgrSToGgvAXrGgvAZvGgvFbrGgvLl3GgvMnvGnDnLXGnrATrGnrMboGnuLl3HTATMnHTAgCnHTCTCTHTrGTvHTrHTvHTrJX8HTrLl8HTrMT8HTrMgoHTrOTrHTuOn3HTvAZrHTvDTvHTvGboHTvJU8HTvLl3HTvMXrHTvQb4HT4GT6HT4JT8HT4Jb#HT8Al3HT8GZrHT8GgrHT8HX4HT8Jb8HT8JnoHT8LTrHT8LgvHT8SToHT8SV8HUoJUoHUoJX8HUoLnrHXrLZoHXvAl3HX3LnrHX4FkvHX4LhrHX4MXoHX4OnoHZrAZ8HZrDb8HZrGZ8HZrJnrHZvGZ8HZvLnvHZ8JnvHZ8LhrHbCXJlHbMTAnHboJl4HbpLl3HbrJX8HbrLnrHbrMnvHbvRYrHgoSTrHgrFV8HgrGZ8HgrJXoHgrRnvHgvBb!HgvGTrHgvHX4HgvHn!HgvLTrHgvSU8HnDnLbHnFbJbHnvDn8Hn6GgvHn!BTvJTCTLnJTQgFnJTrAnvJTrLX4JTrOUoJTvFn3JTvLnrJTvNToJT3AgoJT3Jn4JT3LhvJT3ObrJT8AcrJT8Al3JT8JT8JT8JnoJT8LX4JT8LnrJT8MX3JT8Rg3JT8Sc8JUoBTvJU8AToJU8GZ8JU8GgvJU8JTrJU8JXrJU8JnrJU8LnvJU8ScvJXHnJlJXrGgvJXrJU8JXrLhrJXrMT8JXrMXrJXrQUoJXvCTvJXvGZ8JXvGgrJXvQT8JX8Ab8JX8DT8JX8GZ8JX8HZvJX8LnrJX8MT8JX8MXoJX8MnvJX8ST3JYGnCTJbAkGbJbCTAnJbLTAcJboDT3JboLb6JbrAnvJbrCn3JbrDl8JbrGboJbrIZoJbrJnvJbrMnvJbrQb4Jb8RZrJeAbAnJgJnFbJgScAnJgrATrJgvHZ8JgvMn4JlJlFbJlLiQXJlLjOnJlRbOlJlvNXoJlvRl3Jl4AcrJl8AUoJl8MnrJnFnMlJnHgGbJnoDT8JnoFV8JnoGgvJnoIT8JnoQToJnoRg3JnrCZ3JnrGgrJnrHTvJnrLf8JnrOX8JnvAT3JnvFZoJnvGT8JnvJl4JnvMT8JnvMX8JnvOXrJnvPX6JnvSX3JnvSZrJn3MT8Jn3MX8Jn3RTrLTATKnLTJnLTLTMXKnLTRTQlLToGb8LTrAZ8LTrCZ8LTrDb8LTrHT8LT3PX6LT4FZoLT$CTvLT$GgrLUvHX3LVoATrLVoAgoLVoJboLVoMX3LVoRg3LV8CZ3LV8FZoLV8GTvLXrDXoLXrFbrLXvAgvLXvFlrLXvLl3LXvRn6LX4Mb8LX8GT8LYCXMnLYrMnrLZoSTvLZrAZvLZrAloLZrFToLZrJXvLZrJboLZrJl4LZrLnrLZrMT8LZrOgvLZrRnvLZrST4LZvMX8LZvSlvLZ8AgoLZ8CT3LZ8JT8LZ8LV8LZ8LZoLZ8Lg8LZ8SV8LZ8SbrLZ$HT8LZ$Mn4La6CTvLbFbMnLbRYFTLbSnFZLboJT8LbrAT9LbrGb3LbrQb8LcrJX8LcrMXrLerHTvLerJbrLerNboLgrDb8LgrGZ8LgrHTrLgrMXrLgrSU8LgvJTrLgvLl3Lg6Ll3LhrLnrLhrMT8LhvAl4LiLnQXLkoAgrLkoJT8LkoJn4LlrSU8Ll3FZoLl3HTrLl3JX8Ll3JnoLl3LToLmLeFbLnDUFbLnLVAnLnrATrLnrAZoLnrAb8LnrAlrLnrGgvLnrJU8LnrLZrLnrLhrLnrMb8LnrOXrLnrSZ8LnvAb4LnvDTrLnvDl8LnvHTrLnvHbrLnvJT8LnvJU8LnvJbrLnvLhvLnvMX8LnvMb8LnvNnoLnvSU8Ln3Al3Ln4FZoLn4GT6Ln4JgvLn4LhrLn4MT8Ln4SToMToCZrMToJX8MToLX4MToLf8MToRg3MTrEloMTvGb6MT3BTrMT3Lb6MT8AcrMT8AgrMT8GZrMT8JnoMT8LnrMT8MX3MUOUAnMXAbFnMXoAloMXoJX8MXoLf8MXoLl8MXrAb8MXrDTvMXrGT8MXrGgrMXrHTrMXrLf8MXrMU8MXrOXvMXrQb8MXvGT8MXvHTrMXvLVoMX3AX3MX3Jn3MX3LhrMX3MX3MX4AlrMX4OboMX8GTvMX8GZrMX8GgrMX8JT8MX8JX8MX8LhrMX8MT8MYDUFbMYMgDbMbGnFfMbvLX4MbvLl3Mb8Mb8Mb8ST4MgGXCnMg8ATrMg8AgoMg8CZrMg8DTrMg8DboMg8HTrMg8JgrMg8LT8MloJXoMl8AhrMl8JT8MnLgAUMnoJXrMnoLX4MnoLhrMnoMT8MnrAl4MnrDb8MnrOTvMnrOgvMnrQb8MnrSU8MnvGgrMnvHZ8Mn3MToMn4DTrMn4LTrMn4Mg8NnBXAnOTFTFnOToAToOTrGgvOTrJX8OT3JXoOT6MTrOT8GgrOT8HTpOT8MToOUoHT8OUoJT8OUoLn3OXrAgoOXrDg8OXrMT8OXvSToOX6CTvOX8CZrOX8OgrOb6HgvOb8AToOb8MT8OcvLZ8OgvAlrOgvHTvOgvJTrOgvJnrOgvLZrOgvLn4OgvMT8OgvRTrOg8AZoOg8DbvOnrOXoOnvJn4OnvLhvOnvRTrOn3GgoOn3JnvOn6JbvOn8OTrPTGYFTPbBnFnPbGnDnPgDYQTPlrAnvPlrETvPlrLnvPlrMXvPlvFX4QTMTAnQTrJU8QYCnJlQYJlQlQbGTQbQb8JnrQb8LZoQb8LnvQb8MT8Qb8Ml8Qb8ST4QloAl4QloHZvQloJX8QloMn8QnJZOlRTrAZvRTrDTrRTvJn4RTvLhvRT4Jb8RZrAZrRZ8AkrRZ8JU8RZ8LV8RZ8LnvRbJlQXRg3GboRg3MnvRg8AZ8Rg8JboRg8Jl4RnLTCbRnvFl3RnvQb8SToAl4SToCZrSToFZoSToHXrSToJU8SToJgvSToJl4SToLhrSToMX3STrAlvSTrCT9STrCgrSTrGgrSTrHXrSTrHboSTrJnoSTrNboSTvLnrST4AZoST8Ab8ST8JT8SUoJn3SU6HZ#SU6JTvSU8Db8SU8HboSU8LgrSV8JT8SZrAcrSZrAl3SZrJT8SZrJnvSZrMT8SZvLUoSZ4FZoSZ8JnoSZ8RZrScoLnrScoMT8ScoMX8ScrAT4ScrAZ8ScrLZ8ScrLkvScvDb8ScvLf8ScvNToSgrFZrShvKnrSloHUoSloLnrSlrMXoSl8HgrSmrJUoSn3BX6",
      "ATFlOn3ATLgrDYAT4MTAnAT8LTMnAYJnRTrAbGgJnrAbLV8LnAbvNTAnAeFbLg3AgOYMXoAlQbFboAnDboAfAnJgoJTBToDgAnBUJbAl3BboDUAnCTDlvLnCTFTrSnCYoQTLnDTwAbAnDUDTrSnDUHgHgrDX8LXFnDbJXAcrETvLTLnGTFTQbrGTMnGToGT3DUFbGUJlPX3GbQg8LnGboJbFnGb3GgAYGgAg8ScGgMbAXrGgvAbAnGnJTLnvGnvATFgHTDT6ATHTrDlJnHYLnMn8HZrSbJTHZ8LTFnHbFTJUoHgSeMT8HgrLjAnHgvAbAnHlFUrDlHnDgvAnHnHTFT3HnQTGnrJTAaMXvJTGbCn3JTOgrAnJXvAXMnJbMg8SnJbMnRg3Jb8LTMnJnAl3OnJnGYrQlJnJlQY3LTDlCn3LTJjLg3LTLgvFXLTMg3GTLV8HUOgLXFZLg3LXNXrMnLX8QXFnLX9AlMYLYLXPXrLZAbJU8LZDUJU8LZMXrSnLZ$AgFnLaPXrDULbFYrMnLbMn8LXLboJgJgLeFbLg3LgLZrSnLgOYAgoLhrRnJlLkCTrSnLkOnLhrLnFX%AYLnFZoJXLnHTvJbLnLloAbMTATLf8MTHgJn3MTMXrAXMT3MTFnMUITvFnMXFX%AYMXMXvFbMXrFTDbMYAcMX3MbLf8SnMb8JbFnMgMXrMTMgvAXFnMgvGgCmMnAloSnMnFnJTrOXvMXSnOX8HTMnObJT8ScObLZFl3ObMXCZoPTLgrQXPUFnoQXPU3RXJlPX3RkQXPbrJXQlPlrJbFnQUAhrDbQXGnCXvQYLnHlvQbLfLnvRTOgvJbRXJYrQlRYLnrQlRbLnrQlRlFT8JlRlFnrQXSTClCn3STHTrAnSTLZQlrSTMnGTrSToHgGbSTrGTDnSTvGXCnST3HgFbSU3HXAXSbAnJn3SbFT8LnScLfLnv",
      "AT3JgJX8AT8FZoSnAT8JgFV8AT8LhrDbAZ8JT8DbAb8GgLhrAb8SkLnvAe8MT8SnAlMYJXLVAl3GYDTvAl3LfLnvBUDTvLl3CTOn3HTrCT3DUGgrCU8MT8AbCbFTrJUoCgrDb8MTDTLV8JX8DTLnLXQlDT8LZrSnDUQb8FZ8DUST4JnvDb8ScOUoDj6GbJl4GTLfCYMlGToAXvFnGboAXvLnGgAcrJn3GgvFnSToGnLf8JnvGn#HTDToHTLnFXJlHTvATFToHTvHTDToHTvMTAgoHT3STClvHT4AlFl6HT8HTDToHUoDgJTrHUoScMX3HbRZrMXoHboJg8LTHgDb8JTrHgMToLf8HgvLnLnoHnHn3HT4Hn6MgvAnJTJU8ScvJT3AaQT8JT8HTrAnJXrRg8AnJbAloMXoJbrATFToJbvMnoSnJgDb6GgvJgDb8MXoJgSX3JU8JguATFToJlPYLnQlJlQkDnLbJlQlFYJlJl8Lf8OTJnCTFnLbJnLTHXMnJnLXGXCnJnoFfRg3JnrMYRg3Jn3HgFl3KT8Dg8LnLTRlFnPTLTvPbLbvLVoSbrCZLXMY6HT3LXNU7DlrLXNXDTATLX8DX8LnLZDb8JU8LZMnoLhrLZSToJU8LZrLaLnrLZvJn3SnLZ8LhrSnLaJnoMT8LbFlrHTvLbrFTLnrLbvATLlvLb6OTFn3LcLnJZOlLeAT6Mn4LeJT3ObrLg6LXFlrLhrJg8LnLhvDlPX4LhvLfLnvLj6JTFT3LnFbrMXoLnQluCTvLnrQXCY6LnvLfLnvLnvMgLnvLnvSeLf8MTMbrJn3MT3JgST3MT8AnATrMT8LULnrMUMToCZrMUScvLf8MXoDT8SnMX6ATFToMX8AXMT8MX8FkMT8MX8HTrDUMX8ScoSnMYJT6CTvMgAcrMXoMg8SToAfMlvAXLg3MnFl3AnvOT3AnFl3OUoATHT8OU3RnLXrOXrOXrSnObPbvFn6Og8HgrSnOg8OX8DbPTvAgoJgPU3RYLnrPXrDnJZrPb8CTGgvPlrLTDlvPlvFUJnoQUvFXrQlQeMnoAl3QlrQlrSnRTFTrJUoSTDlLiLXSTFg6HT3STJgoMn4STrFTJTrSTrLZFl3ST4FnMXoSUrDlHUoScvHTvSnSfLkvMXo",
      "AUoAcrMXoAZ8HboAg8AbOg6ATFgAg8AloMXoAl3AT8JTrAl8MX8MXoCT3SToJU8Cl8Db8MXoDT8HgrATrDboOT8MXoGTOTrATMnGT8LhrAZ8GnvFnGnQXHToGgvAcrHTvAXvLl3HbrAZoMXoHgBlFXLg3HgMnFXrSnHgrSb8JUoHn6HT8LgvITvATrJUoJUoLZrRnvJU8HT8Jb8JXvFX8QT8JXvLToJTrJYrQnGnQXJgrJnoATrJnoJU8ScvJnvMnvMXoLTCTLgrJXLTJlRTvQlLbRnJlQYvLbrMb8LnvLbvFn3RnoLdCVSTGZrLeSTvGXCnLg3MnoLn3MToLlrETvMT8SToAl3MbrDU6GTvMb8LX4LhrPlrLXGXCnSToLf8Rg3STrDb8LTrSTvLTHXMnSb3RYLnMnSgOg6ATFg",
      "HUDlGnrQXrJTrHgLnrAcJYMb8DULc8LTvFgGnCk3Mg8JbAnLX4QYvFYHnMXrRUoJnGnvFnRlvFTJlQnoSTrBXHXrLYSUJgLfoMT8Se8DTrHbDb",
      "AbDl8SToJU8An3RbAb8ST8DUSTrGnrAgoLbFU6Db8LTrMg8AaHT8Jb8ObDl8SToJU8Pb3RlvFYoJl"
    ];
    var codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    function getHangul(code) {
      if (code >= 40) {
        code = code + 168 - 40;
      } else if (code >= 19) {
        code = code + 97 - 19;
      }
      return (0, strings_1.toUtf8String)([225, (code >> 6) + 132, (code & 63) + 128]);
    }
    var wordlist = null;
    function loadWords(lang) {
      if (wordlist != null) {
        return;
      }
      wordlist = [];
      data.forEach(function(data2, length) {
        length += 4;
        for (var i = 0; i < data2.length; i += length) {
          var word = "";
          for (var j = 0; j < length; j++) {
            word += getHangul(codes.indexOf(data2[i + j]));
          }
          wordlist.push(word);
        }
      });
      wordlist.sort();
      if (wordlist_1.Wordlist.check(lang) !== "0xf9eddeace9c5d3da9c93cf7d3cd38f6a13ed3affb933259ae865714e8a3ae71a") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for ko (Korean) FAILED");
      }
    }
    var LangKo = (
      /** @class */
      function(_super) {
        __extends(LangKo2, _super);
        function LangKo2() {
          return _super.call(this, "ko") || this;
        }
        LangKo2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangKo2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return wordlist.indexOf(word);
        };
        return LangKo2;
      }(wordlist_1.Wordlist)
    );
    var langKo = new LangKo();
    exports.langKo = langKo;
    wordlist_1.Wordlist.register(langKo);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-it.js
var require_lang_it = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-it.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langIt = void 0;
    var wordlist_1 = require_wordlist();
    var words = "AbacoAbbaglioAbbinatoAbeteAbissoAbolireAbrasivoAbrogatoAccadereAccennoAccusatoAcetoneAchilleAcidoAcquaAcreAcrilicoAcrobataAcutoAdagioAddebitoAddomeAdeguatoAderireAdipeAdottareAdulareAffabileAffettoAffissoAffrantoAforismaAfosoAfricanoAgaveAgenteAgevoleAggancioAgireAgitareAgonismoAgricoloAgrumetoAguzzoAlabardaAlatoAlbatroAlberatoAlboAlbumeAlceAlcolicoAlettoneAlfaAlgebraAlianteAlibiAlimentoAllagatoAllegroAllievoAllodolaAllusivoAlmenoAlogenoAlpacaAlpestreAltalenaAlternoAlticcioAltroveAlunnoAlveoloAlzareAmalgamaAmanitaAmarenaAmbitoAmbratoAmebaAmericaAmetistaAmicoAmmassoAmmendaAmmirareAmmonitoAmoreAmpioAmpliareAmuletoAnacardoAnagrafeAnalistaAnarchiaAnatraAncaAncellaAncoraAndareAndreaAnelloAngeloAngolareAngustoAnimaAnnegareAnnidatoAnnoAnnuncioAnonimoAnticipoAnziApaticoAperturaApodeApparireAppetitoAppoggioApprodoAppuntoAprileArabicaArachideAragostaAraldicaArancioAraturaArazzoArbitroArchivioArditoArenileArgentoArgineArgutoAriaArmoniaArneseArredatoArringaArrostoArsenicoArsoArteficeArzilloAsciuttoAscoltoAsepsiAsetticoAsfaltoAsinoAsolaAspiratoAsproAssaggioAsseAssolutoAssurdoAstaAstenutoAsticeAstrattoAtavicoAteismoAtomicoAtonoAttesaAttivareAttornoAttritoAttualeAusilioAustriaAutistaAutonomoAutunnoAvanzatoAvereAvvenireAvvisoAvvolgereAzioneAzotoAzzimoAzzurroBabeleBaccanoBacinoBacoBadessaBadilataBagnatoBaitaBalconeBaldoBalenaBallataBalzanoBambinoBandireBaraondaBarbaroBarcaBaritonoBarlumeBaroccoBasilicoBassoBatostaBattutoBauleBavaBavosaBeccoBeffaBelgioBelvaBendaBenevoleBenignoBenzinaBereBerlinaBetaBibitaBiciBidoneBifidoBigaBilanciaBimboBinocoloBiologoBipedeBipolareBirbanteBirraBiscottoBisestoBisnonnoBisonteBisturiBizzarroBlandoBlattaBollitoBonificoBordoBoscoBotanicoBottinoBozzoloBraccioBradipoBramaBrancaBravuraBretellaBrevettoBrezzaBrigliaBrillanteBrindareBroccoloBrodoBronzinaBrulloBrunoBubboneBucaBudinoBuffoneBuioBulboBuonoBurloneBurrascaBussolaBustaCadettoCaducoCalamaroCalcoloCalesseCalibroCalmoCaloriaCambusaCamerataCamiciaCamminoCamolaCampaleCanapaCandelaCaneCaninoCanottoCantinaCapaceCapelloCapitoloCapogiroCapperoCapraCapsulaCarapaceCarcassaCardoCarismaCarovanaCarrettoCartolinaCasaccioCascataCasermaCasoCassoneCastelloCasualeCatastaCatenaCatrameCautoCavilloCedibileCedrataCefaloCelebreCellulareCenaCenoneCentesimoCeramicaCercareCertoCerumeCervelloCesoiaCespoCetoChelaChiaroChiccaChiedereChimeraChinaChirurgoChitarraCiaoCiclismoCifrareCignoCilindroCiottoloCircaCirrosiCitricoCittadinoCiuffoCivettaCivileClassicoClinicaCloroCoccoCodardoCodiceCoerenteCognomeCollareColmatoColoreColposoColtivatoColzaComaCometaCommandoComodoComputerComuneConcisoCondurreConfermaCongelareConiugeConnessoConoscereConsumoContinuoConvegnoCopertoCopioneCoppiaCopricapoCorazzaCordataCoricatoCorniceCorollaCorpoCorredoCorsiaCorteseCosmicoCostanteCotturaCovatoCratereCravattaCreatoCredereCremosoCrescitaCretaCricetoCrinaleCrisiCriticoCroceCronacaCrostataCrucialeCruscaCucireCuculoCuginoCullatoCupolaCuratoreCursoreCurvoCuscinoCustodeDadoDainoDalmataDamerinoDanielaDannosoDanzareDatatoDavantiDavveroDebuttoDecennioDecisoDeclinoDecolloDecretoDedicatoDefinitoDeformeDegnoDelegareDelfinoDelirioDeltaDemenzaDenotatoDentroDepositoDerapataDerivareDerogaDescrittoDesertoDesiderioDesumereDetersivoDevotoDiametroDicembreDiedroDifesoDiffusoDigerireDigitaleDiluvioDinamicoDinnanziDipintoDiplomaDipoloDiradareDireDirottoDirupoDisagioDiscretoDisfareDisgeloDispostoDistanzaDisumanoDitoDivanoDiveltoDividereDivoratoDobloneDocenteDoganaleDogmaDolceDomatoDomenicaDominareDondoloDonoDormireDoteDottoreDovutoDozzinaDragoDruidoDubbioDubitareDucaleDunaDuomoDupliceDuraturoEbanoEccessoEccoEclissiEconomiaEderaEdicolaEdileEditoriaEducareEgemoniaEgliEgoismoEgregioElaboratoElargireEleganteElencatoElettoElevareElficoElicaElmoElsaElusoEmanatoEmblemaEmessoEmiroEmotivoEmozioneEmpiricoEmuloEndemicoEnduroEnergiaEnfasiEnotecaEntrareEnzimaEpatiteEpilogoEpisodioEpocaleEppureEquatoreErarioErbaErbosoEredeEremitaErigereErmeticoEroeErosivoErranteEsagonoEsameEsanimeEsaudireEscaEsempioEsercitoEsibitoEsigenteEsistereEsitoEsofagoEsortatoEsosoEspansoEspressoEssenzaEssoEstesoEstimareEstoniaEstrosoEsultareEtilicoEtnicoEtruscoEttoEuclideoEuropaEvasoEvidenzaEvitatoEvolutoEvvivaFabbricaFaccendaFachiroFalcoFamigliaFanaleFanfaraFangoFantasmaFareFarfallaFarinosoFarmacoFasciaFastosoFasulloFaticareFatoFavolosoFebbreFecolaFedeFegatoFelpaFeltroFemminaFendereFenomenoFermentoFerroFertileFessuraFestivoFettaFeudoFiabaFiduciaFifaFiguratoFiloFinanzaFinestraFinireFioreFiscaleFisicoFiumeFlaconeFlamencoFleboFlemmaFloridoFluenteFluoroFobicoFocacciaFocosoFoderatoFoglioFolataFolcloreFolgoreFondenteFoneticoFoniaFontanaForbitoForchettaForestaFormicaFornaioForoFortezzaForzareFosfatoFossoFracassoFranaFrassinoFratelloFreccettaFrenataFrescoFrigoFrollinoFrondeFrugaleFruttaFucilataFucsiaFuggenteFulmineFulvoFumanteFumettoFumosoFuneFunzioneFuocoFurboFurgoneFuroreFusoFutileGabbianoGaffeGalateoGallinaGaloppoGamberoGammaGaranziaGarboGarofanoGarzoneGasdottoGasolioGastricoGattoGaudioGazeboGazzellaGecoGelatinaGelsoGemelloGemmatoGeneGenitoreGennaioGenotipoGergoGhepardoGhiaccioGhisaGialloGildaGineproGiocareGioielloGiornoGioveGiratoGironeGittataGiudizioGiuratoGiustoGlobuloGlutineGnomoGobbaGolfGomitoGommoneGonfioGonnaGovernoGracileGradoGraficoGrammoGrandeGrattareGravosoGraziaGrecaGreggeGrifoneGrigioGrinzaGrottaGruppoGuadagnoGuaioGuantoGuardareGufoGuidareIbernatoIconaIdenticoIdillioIdoloIdraIdricoIdrogenoIgieneIgnaroIgnoratoIlareIllesoIllogicoIlludereImballoImbevutoImboccoImbutoImmaneImmersoImmolatoImpaccoImpetoImpiegoImportoImprontaInalareInarcareInattivoIncantoIncendioInchinoIncisivoInclusoIncontroIncrocioIncuboIndagineIndiaIndoleIneditoInfattiInfilareInflittoIngaggioIngegnoIngleseIngordoIngrossoInnescoInodoreInoltrareInondatoInsanoInsettoInsiemeInsonniaInsulinaIntasatoInteroIntonacoIntuitoInumidireInvalidoInveceInvitoIperboleIpnoticoIpotesiIppicaIrideIrlandaIronicoIrrigatoIrrorareIsolatoIsotopoIstericoIstitutoIstriceItaliaIterareLabbroLabirintoLaccaLaceratoLacrimaLacunaLaddoveLagoLampoLancettaLanternaLardosoLargaLaringeLastraLatenzaLatinoLattugaLavagnaLavoroLegaleLeggeroLemboLentezzaLenzaLeoneLepreLesivoLessatoLestoLetteraleLevaLevigatoLiberoLidoLievitoLillaLimaturaLimitareLimpidoLineareLinguaLiquidoLiraLiricaLiscaLiteLitigioLivreaLocandaLodeLogicaLombareLondraLongevoLoquaceLorenzoLotoLotteriaLuceLucidatoLumacaLuminosoLungoLupoLuppoloLusingaLussoLuttoMacabroMacchinaMaceroMacinatoMadamaMagicoMagliaMagneteMagroMaiolicaMalafedeMalgradoMalintesoMalsanoMaltoMalumoreManaManciaMandorlaMangiareManifestoMannaroManovraMansardaMantideManubrioMappaMaratonaMarcireMarettaMarmoMarsupioMascheraMassaiaMastinoMaterassoMatricolaMattoneMaturoMazurcaMeandroMeccanicoMecenateMedesimoMeditareMegaMelassaMelisMelodiaMeningeMenoMensolaMercurioMerendaMerloMeschinoMeseMessereMestoloMetalloMetodoMettereMiagolareMicaMicelioMicheleMicroboMidolloMieleMiglioreMilanoMiliteMimosaMineraleMiniMinoreMirinoMirtilloMiscelaMissivaMistoMisurareMitezzaMitigareMitraMittenteMnemonicoModelloModificaModuloMoganoMogioMoleMolossoMonasteroMoncoMondinaMonetarioMonileMonotonoMonsoneMontatoMonvisoMoraMordereMorsicatoMostroMotivatoMotosegaMottoMovenzaMovimentoMozzoMuccaMucosaMuffaMughettoMugnaioMulattoMulinelloMultiploMummiaMuntoMuovereMuraleMusaMuscoloMusicaMutevoleMutoNababboNaftaNanometroNarcisoNariceNarratoNascereNastrareNaturaleNauticaNaviglioNebulosaNecrosiNegativoNegozioNemmenoNeofitaNerettoNervoNessunoNettunoNeutraleNeveNevroticoNicchiaNinfaNitidoNobileNocivoNodoNomeNominaNordicoNormaleNorvegeseNostranoNotareNotiziaNotturnoNovellaNucleoNullaNumeroNuovoNutrireNuvolaNuzialeOasiObbedireObbligoObeliscoOblioOboloObsoletoOccasioneOcchioOccidenteOccorrereOccultareOcraOculatoOdiernoOdorareOffertaOffrireOffuscatoOggettoOggiOgnunoOlandeseOlfattoOliatoOlivaOlogrammaOltreOmaggioOmbelicoOmbraOmegaOmissioneOndosoOnereOniceOnnivoroOnorevoleOntaOperatoOpinioneOppostoOracoloOrafoOrdineOrecchinoOreficeOrfanoOrganicoOrigineOrizzonteOrmaOrmeggioOrnativoOrologioOrrendoOrribileOrtensiaOrticaOrzataOrzoOsareOscurareOsmosiOspedaleOspiteOssaOssidareOstacoloOsteOtiteOtreOttagonoOttimoOttobreOvaleOvestOvinoOviparoOvocitoOvunqueOvviareOzioPacchettoPacePacificoPadellaPadronePaesePagaPaginaPalazzinaPalesarePallidoPaloPaludePandoroPannelloPaoloPaonazzoPapricaParabolaParcellaParerePargoloPariParlatoParolaPartireParvenzaParzialePassivoPasticcaPataccaPatologiaPattumePavonePeccatoPedalarePedonalePeggioPelosoPenarePendicePenisolaPennutoPenombraPensarePentolaPepePepitaPerbenePercorsoPerdonatoPerforarePergamenaPeriodoPermessoPernoPerplessoPersuasoPertugioPervasoPesatorePesistaPesoPestiferoPetaloPettinePetulantePezzoPiacerePiantaPiattinoPiccinoPicozzaPiegaPietraPifferoPigiamaPigolioPigroPilaPiliferoPillolaPilotaPimpantePinetaPinnaPinoloPioggiaPiomboPiramidePireticoPiritePirolisiPitonePizzicoPlaceboPlanarePlasmaPlatanoPlenarioPochezzaPoderosoPodismoPoesiaPoggiarePolentaPoligonoPollicePolmonitePolpettaPolsoPoltronaPolverePomicePomodoroPontePopolosoPorfidoPorosoPorporaPorrePortataPosaPositivoPossessoPostulatoPotassioPoterePranzoPrassiPraticaPreclusoPredicaPrefissoPregiatoPrelievoPremerePrenotarePreparatoPresenzaPretestoPrevalsoPrimaPrincipePrivatoProblemaProcuraProdurreProfumoProgettoProlungaPromessaPronomePropostaProrogaProtesoProvaPrudentePrugnaPruritoPsichePubblicoPudicaPugilatoPugnoPulcePulitoPulsantePuntarePupazzoPupillaPuroQuadroQualcosaQuasiQuerelaQuotaRaccoltoRaddoppioRadicaleRadunatoRafficaRagazzoRagioneRagnoRamarroRamingoRamoRandagioRantolareRapatoRapinaRappresoRasaturaRaschiatoRasenteRassegnaRastrelloRataRavvedutoRealeRecepireRecintoReclutaReconditoRecuperoRedditoRedimereRegalatoRegistroRegolaRegressoRelazioneRemareRemotoRennaReplicaReprimereReputareResaResidenteResponsoRestauroReteRetinaRetoricaRettificaRevocatoRiassuntoRibadireRibelleRibrezzoRicaricaRiccoRicevereRiciclatoRicordoRicredutoRidicoloRidurreRifasareRiflessoRiformaRifugioRigareRigettatoRighelloRilassatoRilevatoRimanereRimbalzoRimedioRimorchioRinascitaRincaroRinforzoRinnovoRinomatoRinsavitoRintoccoRinunciaRinvenireRiparatoRipetutoRipienoRiportareRipresaRipulireRisataRischioRiservaRisibileRisoRispettoRistoroRisultatoRisvoltoRitardoRitegnoRitmicoRitrovoRiunioneRivaRiversoRivincitaRivoltoRizomaRobaRoboticoRobustoRocciaRocoRodaggioRodereRoditoreRogitoRollioRomanticoRompereRonzioRosolareRospoRotanteRotondoRotulaRovescioRubizzoRubricaRugaRullinoRumineRumorosoRuoloRupeRussareRusticoSabatoSabbiareSabotatoSagomaSalassoSaldaturaSalgemmaSalivareSalmoneSaloneSaltareSalutoSalvoSapereSapidoSaporitoSaracenoSarcasmoSartoSassosoSatelliteSatiraSatolloSaturnoSavanaSavioSaziatoSbadiglioSbalzoSbancatoSbarraSbattereSbavareSbendareSbirciareSbloccatoSbocciatoSbrinareSbruffoneSbuffareScabrosoScadenzaScalaScambiareScandaloScapolaScarsoScatenareScavatoSceltoScenicoScettroSchedaSchienaSciarpaScienzaScindereScippoSciroppoScivoloSclerareScodellaScolpitoScompartoSconfortoScoprireScortaScossoneScozzeseScribaScrollareScrutinioScuderiaScultoreScuolaScuroScusareSdebitareSdoganareSeccaturaSecondoSedanoSeggiolaSegnalatoSegregatoSeguitoSelciatoSelettivoSellaSelvaggioSemaforoSembrareSemeSeminatoSempreSensoSentireSepoltoSequenzaSerataSerbatoSerenoSerioSerpenteSerraglioServireSestinaSetolaSettimanaSfaceloSfaldareSfamatoSfarzosoSfaticatoSferaSfidaSfilatoSfingeSfocatoSfoderareSfogoSfoltireSforzatoSfrattoSfruttatoSfuggitoSfumareSfusoSgabelloSgarbatoSgonfiareSgorbioSgrassatoSguardoSibiloSiccomeSierraSiglaSignoreSilenzioSillabaSimboloSimpaticoSimulatoSinfoniaSingoloSinistroSinoSintesiSinusoideSiparioSismaSistoleSituatoSlittaSlogaturaSlovenoSmarritoSmemoratoSmentitoSmeraldoSmilzoSmontareSmottatoSmussatoSnellireSnervatoSnodoSobbalzoSobrioSoccorsoSocialeSodaleSoffittoSognoSoldatoSolenneSolidoSollazzoSoloSolubileSolventeSomaticoSommaSondaSonettoSonniferoSopireSoppesoSopraSorgereSorpassoSorrisoSorsoSorteggioSorvolatoSospiroSostaSottileSpadaSpallaSpargereSpatolaSpaventoSpazzolaSpecieSpedireSpegnereSpelaturaSperanzaSpessoreSpettraleSpezzatoSpiaSpigolosoSpillatoSpinosoSpiraleSplendidoSportivoSposoSprangaSprecareSpronatoSpruzzoSpuntinoSquilloSradicareSrotolatoStabileStaccoStaffaStagnareStampatoStantioStarnutoStaseraStatutoSteloSteppaSterzoStilettoStimaStirpeStivaleStizzosoStonatoStoricoStrappoStregatoStriduloStrozzareStruttoStuccareStufoStupendoSubentroSuccosoSudoreSuggeritoSugoSultanoSuonareSuperboSupportoSurgelatoSurrogatoSussurroSuturaSvagareSvedeseSveglioSvelareSvenutoSveziaSviluppoSvistaSvizzeraSvoltaSvuotareTabaccoTabulatoTacciareTaciturnoTaleTalismanoTamponeTanninoTaraTardivoTargatoTariffaTarpareTartarugaTastoTatticoTavernaTavolataTazzaTecaTecnicoTelefonoTemerarioTempoTemutoTendoneTeneroTensioneTentacoloTeoremaTermeTerrazzoTerzettoTesiTesseratoTestatoTetroTettoiaTifareTigellaTimbroTintoTipicoTipografoTiraggioTiroTitanioTitoloTitubanteTizioTizzoneToccareTollerareToltoTombolaTomoTonfoTonsillaTopazioTopologiaToppaTorbaTornareTorroneTortoraToscanoTossireTostaturaTotanoTraboccoTracheaTrafilaTragediaTralcioTramontoTransitoTrapanoTrarreTraslocoTrattatoTraveTrecciaTremolioTrespoloTributoTrichecoTrifoglioTrilloTrinceaTrioTristezzaTrituratoTrivellaTrombaTronoTroppoTrottolaTrovareTruccatoTubaturaTuffatoTulipanoTumultoTunisiaTurbareTurchinoTutaTutelaUbicatoUccelloUccisoreUdireUditivoUffaUfficioUgualeUlisseUltimatoUmanoUmileUmorismoUncinettoUngereUnghereseUnicornoUnificatoUnisonoUnitarioUnteUovoUpupaUraganoUrgenzaUrloUsanzaUsatoUscitoUsignoloUsuraioUtensileUtilizzoUtopiaVacanteVaccinatoVagabondoVagliatoValangaValgoValicoVallettaValorosoValutareValvolaVampataVangareVanitosoVanoVantaggioVanveraVaporeVaranoVarcatoVarianteVascaVedettaVedovaVedutoVegetaleVeicoloVelcroVelinaVellutoVeloceVenatoVendemmiaVentoVeraceVerbaleVergognaVerificaVeroVerrucaVerticaleVescicaVessilloVestaleVeteranoVetrinaVetustoViandanteVibranteVicendaVichingoVicinanzaVidimareVigiliaVignetoVigoreVileVillanoViminiVincitoreViolaViperaVirgolaVirologoVirulentoViscosoVisioneVispoVissutoVisuraVitaVitelloVittimaVivandaVividoViziareVoceVogaVolatileVolereVolpeVoragineVulcanoZampognaZannaZappatoZatteraZavorraZefiroZelanteZeloZenzeroZerbinoZibettoZincoZirconeZittoZollaZoticoZuccheroZufoloZuluZuppa";
    var wordlist = null;
    function loadWords(lang) {
      if (wordlist != null) {
        return;
      }
      wordlist = words.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" ");
      if (wordlist_1.Wordlist.check(lang) !== "0x5c1362d88fd4cf614a96f3234941d29f7d37c08c5292fde03bf62c2db6ff7620") {
        wordlist = null;
        throw new Error("BIP39 Wordlist for it (Italian) FAILED");
      }
    }
    var LangIt = (
      /** @class */
      function(_super) {
        __extends(LangIt2, _super);
        function LangIt2() {
          return _super.call(this, "it") || this;
        }
        LangIt2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[index];
        };
        LangIt2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return wordlist.indexOf(word);
        };
        return LangIt2;
      }(wordlist_1.Wordlist)
    );
    var langIt = new LangIt();
    exports.langIt = langIt;
    wordlist_1.Wordlist.register(langIt);
  }
});

// node_modules/@ethersproject/wordlists/lib/lang-zh.js
var require_lang_zh = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/lang-zh.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.langZhTw = exports.langZhCn = void 0;
    var strings_1 = require_lib11();
    var wordlist_1 = require_wordlist();
    var data = "}aE#4A=Yv&co#4N#6G=cJ&SM#66|/Z#4t&kn~46#4K~4q%b9=IR#7l,mB#7W_X2*dl}Uo~7s}Uf&Iw#9c&cw~6O&H6&wx&IG%v5=IQ~8a&Pv#47$PR&50%Ko&QM&3l#5f,D9#4L|/H&tQ;v0~6n]nN<di,AM=W5%QO&ka&ua,hM^tm=zV=JA=wR&+X]7P&NB#4J#5L|/b[dA}tJ<Do&6m&u2[U1&Kb.HM&mC=w0&MW<rY,Hq#6M}QG,13&wP}Jp]Ow%ue&Kg<HP<D9~4k~9T&I2_c6$9T#9/[C5~7O~4a=cs&O7=KK=An&l9$6U$8A&uD&QI|/Y&bg}Ux&F2#6b}E2&JN&kW&kp=U/&bb=Xl<Cj}k+~5J#6L&5z&9i}b4&Fo,ho(X0_g3~4O$Fz&QE<HN=Ww]6/%GF-Vw=tj&/D&PN#9g=YO}cL&Of&PI~5I&Ip=vU=IW#9G;0o-wU}ss&QR<BT&R9=tk$PY_dh&Pq-yh]7T,nj.Xu=EP&76=cI&Fs*Xg}z7$Gb&+I=DF,AF=cA}rL#7j=Dz&3y<Aa$52=PQ}b0(iY$Fa}oL&xV#6U=ec=WZ,xh%RY<dp#9N&Fl&44=WH*A7=sh&TB&8P=07;u+&PK}uh}J5#72)V/=xC,AB$k0&f6;1E|+5=1B,3v]6n&wR%b+&xx]7f=Ol}fl;+D^wG]7E;nB;uh^Ir&l5=JL,nS=cf=g5;u6|/Q$Gc=MH%Hg#5d%M6^86=U+$Gz,l/,ir^5y&Ba&/F-IY&FI&be%IZ#77&PW_Nu$kE(Yf&NX]7Z,Jy&FJ(Xo&Nz#/d=y7&MX<Ag}Z+;nE]Dt(iG#4D=13&Pj~4c%v8&Zo%OL&/X#4W<HR&ie~6J_1O(Y2=y5=Ad*cv_eB#6k&PX:BU#7A;uk&Ft&Fx_dD=U2;vB=U5=4F}+O&GN.HH:9s=b0%NV(jO&IH=JT}Z9=VZ<Af,Kx^4m&uJ%c6,6r;9m#+L}cf%Kh&F3~4H=vP}bu,Hz|++,1w]nv}k6;uu$jw*Kl*WX&uM[x7&Fr[m7$NO&QN]hu=JN}nR^8g#/h(ps|KC;vd}xz=V0}p6&FD$G1#7K<bG_4p~8g&cf;u4=tl}+k%5/}fz;uw<cA=u1}gU}VM=LJ=eX&+L&Pr#4U}p2:nC,2K]7H:jF&9x}uX#9O=MB<fz~8X~5m&4D&kN&u5%E/(h7(ZF&VG<de(qM|/e-Wt=3x(a+,/R]f/&ND$Ro&nU}0g=KA%kH&NK$Ke<dS}cB&IX~5g$TN]6m=Uv,Is&Py=Ef%Kz#+/%bi&+A<F4$OG&4C&FL#9V<Zk=2I_eE&6c]nw&kq$HG}y+&A8$P3}OH=XP]70%IS(AJ_gH%GZ&tY&AZ=vb~6y&/r=VI=Wv<Zi=fl=xf&eL}c8}OL=MJ=g8$F7=YT}9u=0+^xC}JH&nL^N0~4T]K2,Cy%OC#6s;vG(AC^xe^cG&MF}Br#9P;wD-7h$O/&xA}Fn^PC]6i]7G&8V$Qs;vl(TB~73~4l<mW&6V=2y&uY&+3)aP}XF;LP&kx$wU=t7;uy<FN&lz)7E=Oo*Y+;wI}9q}le;J6&Ri&4t&Qr#8B=cb&vG=J5|Ql(h5<Yy~4+}QD,Lx=wn%K/&RK=dO&Pw,Q9=co%4u;9u}g0@6a^4I%b0=zo|/c&tX=dQ=OS#+b=yz_AB&wB&Pm=W9$HP_gR=62=AO=ti=hI,oA&jr&dH=tm&b6$P2(x8=zi;nG~7F;05]0n[Ix&3m}rg=Xp=cd&uz]7t;97=cN;vV<jf&FF&F1=6Q&Ik*Kk&P4,2z=fQ]7D&3u,H0=d/}Uw<ZN<7R}Kv;0f$H7,MD]7n$F0#88~9Z%da=by;+T#/u=VF&fO&kr^kf<AB]sU,I5$Ng&Pz;0i&QD&vM=Yl:BM;nJ_xJ]U7&Kf&30,3f|Z9*dC)je_jA&Q4&Kp$NH(Yz#6S&Id%Ib=KX,AD=KV%dP}tW&Pk^+E_Ni=cq,3R}VZ(Si=b+}rv;0j}rZ]uA,/w(Sx&Jv$w9&4d&wE,NJ$Gy=J/]Ls#7k<ZQ<Y/&uj]Ov$PM;v3,2F&+u:up=On&3e,Jv;90=J+&Qm]6q}bK#+d~8Y(h2]hA;99&AS=I/}qB&dQ}yJ-VM}Vl&ui,iB&G3|Dc]7d=eQ%dX%JC_1L~4d^NP;vJ&/1)ZI#7N]9X[bQ&PL=0L(UZ,Lm&kc&IR}n7(iR<AQ<dg=33=vN}ft}au]7I,Ba=x9=dR~6R&Tq=Xi,3d$Nr&Bc}DI&ku&vf]Dn,/F&iD,Ll&Nw=0y&I7=Ls=/A&tU=Qe}Ua&uk&+F=g4=gh=Vj#+1&Qn}Uy*44#5F,Pc&Rz*Xn=oh=5W;0n_Nf(iE<Y7=vr=Zu]oz#5Z%mI=kN=Bv_Jp(T2;vt_Ml<FS&uI=L/&6P]64$M7}86<bo%QX(SI%IY&VK=Al&Ux;vv;ut*E/%uh<ZE|O3,M2(yc]yu=Wk&tp:Ex}hr,Cl&WE)+Z=8U}I2_4Q,hA_si=iw=OM=tM=yZ%Ia=U7;wT}b+;uo=Za}yS!5x}HD}fb#5O_dA;Nv%uB(yB;01(Sf}Fk;v7}Pt#8v<mZ#7L,/r&Pl~4w&f5=Ph$Fw_LF&8m,bL=yJ&BH}p/*Jn}tU~5Q;wB(h6]Df]8p^+B;E4&Wc=d+;Ea&bw$8C&FN,DM=Yf}mP~5w=fT#6V=mC=Fi=AV}jB&AN}lW}aH#/D)dZ;hl;vE}/7,CJ;31&w8,hj%u9_Js=jJ&4M~8k=TN&eC}nL&uc-wi&lX}dj=Mv=e2#6u=cr$uq$6G]8W}Jb:nm=Yg<b3(UA;vX&6n&xF=KT,jC,De&R8&oY=Zv&oB]7/=Z2&Oa}bf,hh(4h^tZ&72&Nx;D2&xL~5h~40)ZG)h+=OJ&RA]Bv$yB=Oq=df,AQ%Jn}OJ;11,3z&Tl&tj;v+^Hv,Dh(id=s+]7N&N3)9Q~8f,S4=uW=w4&uX,LX&3d]CJ&yp&8x<b2_do&lP=y/<cy_dG=Oi=7R(VH(lt_1T,Iq_AA;12^6T%k6#8K[B1{oO<AU[Bt;1b$9S&Ps<8T=St{bY,jB(Zp&63&Uv$9V,PM]6v&Af}zW[bW_oq}sm}nB&Kq&gC&ff_eq_2m&5F&TI}rf}Gf;Zr_z9;ER&jk}iz_sn<BN~+n&vo=Vi%97|ZR=Wc,WE&6t]6z%85(ly#84=KY)6m_5/=aX,N3}Tm&he&6K]tR_B2-I3;u/&hU&lH<AP=iB&IA=XL;/5&Nh=wv<BH#79=vS=zl<AA=0X_RG}Bw&9p$NW,AX&kP_Lp&/Z(Tc]Mu}hs#6I}5B&cI<bq&H9#6m=K9}vH(Y1(Y0#4B&w6,/9&gG<bE,/O=zb}I4_l8<B/;wL%Qo<HO[Mq=XX}0v&BP&F4(mG}0i}nm,EC=9u{I3,xG&/9=JY*DK&hR)BX=EI=cx=b/{6k}yX%A+&wa}Xb=la;wi^lL;0t}jo&Qb=xg=XB}iO<qo{bR=NV&8f=a0&Jy;0v=uK)HK;vN#6h&jB(h/%ud&NI%wY.X7=Pt}Cu-uL&Gs_hl%mH,tm]78=Lb^Q0#7Y=1u<Bt&+Q=Co_RH,w3;1e}ux<aU;ui}U3&Q5%bt]63&UQ|0l&uL}O7&3o,AV&dm|Nj(Xt*5+(Uu&Hh(p7(UF=VR=Bp^Jl&Hd[ix)9/=Iq]C8<67]66}mB%6f}bb}JI]8T$HA}db=YM&pa=2J}tS&Y0=PS&y4=cX$6E,hX,XP&nR;04,FQ&l0&Vm_Dv#5Y~8Z=Bi%MA]6x=JO:+p,Az&9q,Hj~6/}SD=K1:EJ}nA;Qo#/E]9R,Ie&6X%W3]61&v4=xX_MC=0q;06(Xq=fs}IG}Dv=0l}o7$iZ;9v&LH&DP-7a&OY,SZ,Kz,Cv&dh=fx|Nh,F/~7q=XF&w+;9n&Gw;0h}Z7<7O&JK(S7&LS<AD<ac=wo<Dt&zw%4B=4v#8P;9o~6p*vV=Tm,Or&I6=1q}nY=P0=gq&Bl&Uu,Ch%yb}UY=zh}dh}rl(T4_xk(YA#8R*xH,IN}Jn]7V}C4&Ty}j3]7p=cL=3h&wW%Qv<Z3=f0&RI&+S(ic_zq}oN&/Y=z1;Td=LW=0e=OI(Vc,+b^ju(UL;0r:Za%8v=Rp=zw&58&73&wK}qX]6y&8E)a2}WR=wP^ur&nQ<cH}Re=Aq&wk}Q0&+q=PP,Gc|/d^k5,Fw]8Y}Pg]p3=ju=ed}r5_yf&Cs]7z$/G<Cm&Jp&54_1G_gP_Ll}JZ;0u]k8_7k(Sg]65{9i=LN&Sx&WK,iW&fD&Lk{9a}Em-9c#8N&io=sy]8d&nT&IK(lx#7/$lW(Td<s8~49,3o<7Y=MW(T+_Jr&Wd,iL}Ct=xh&5V;v4&8n%Kx=iF&l2_0B{B+,If(J0,Lv;u8=Kx-vB=HC&vS=Z6&fU&vE^xK;3D=4h=MR#45:Jw;0d}iw=LU}I5=I0]gB*im,K9}GU,1k_4U&Tt=Vs(iX&lU(TF#7y,ZO}oA&m5#5P}PN}Uz=hM<B1&FB<aG,e6~7T<tP(UQ_ZT=wu&F8)aQ]iN,1r_Lo&/g:CD}84{J1_Ki&Na&3n$jz&FE=dc;uv;va}in}ll=fv(h1&3h}fp=Cy}BM(+E~8m}lo%v7=hC(T6$cj=BQ=Bw(DR,2j=Ks,NS|F+;00=fU=70}Mb(YU;+G&m7&hr=Sk%Co]t+(X5_Jw}0r}gC(AS-IP&QK<Z2#8Q$WC]WX}T2&pG_Ka,HC=R4&/N;Z+;ch(C7,D4$3p_Mk&B2$8D=n9%Ky#5z(CT&QJ#7B]DC]gW}nf~5M;Iw#80}Tc_1F#4Z-aC}Hl=ph=fz,/3=aW}JM}nn;DG;vm}wn,4P}T3;wx&RG$u+}zK=0b;+J_Ek{re<aZ=AS}yY#5D]7q,Cp}xN=VP*2C}GZ}aG~+m_Cs=OY#6r]6g<GS}LC(UB=3A=Bo}Jy<c4}Is;1P<AG}Op<Z1}ld}nS=1Z,yM&95&98=CJ(4t:2L$Hk=Zo}Vc;+I}np&N1}9y=iv}CO*7p=jL)px]tb^zh&GS&Vl%v/;vR=14=zJ&49|/f]hF}WG;03=8P}o/&Gg&rp;DB,Kv}Ji&Pb;aA^ll(4j%yt}+K$Ht#4y&hY]7Y<F1,eN}bG(Uh%6Z]t5%G7;+F_RE;it}tL=LS&Da=Xx(S+(4f=8G=yI}cJ}WP=37=jS}pX}hd)fp<A8=Jt~+o$HJ=M6}iX=g9}CS=dv=Cj(mP%Kd,xq|+9&LD(4/=Xm&QP=Lc}LX&fL;+K=Op(lu=Qs.qC:+e&L+=Jj#8w;SL]7S(b+#4I=c1&nG_Lf&uH;+R)ZV<bV%B/,TE&0H&Jq&Ah%OF&Ss(p2,Wv&I3=Wl}Vq;1L&lJ#9b_1H=8r=b8=JH(SZ=hD=J2#7U,/U#/X~6P,FU<eL=jx,mG=hG=CE&PU=Se(qX&LY=X6=y4&tk&QQ&tf=4g&xI}W+&mZ=Dc#7w}Lg;DA;wQ_Kb(cJ=hR%yX&Yb,hw{bX_4X;EP;1W_2M}Uc=b5(YF,CM&Tp^OJ{DD]6s=vF=Yo~8q}XH}Fu%P5(SJ=Qt;MO]s8<F3&B3&8T(Ul-BS*dw&dR<87}/8]62$PZ]Lx<Au}9Q]7c=ja=KR,Go,Us&v6(qk}pG&G2=ev^GM%w4&H4]7F&dv]J6}Ew:9w=sj-ZL}Ym$+h(Ut(Um~4n=Xs(U7%eE=Qc_JR<CA#6t<Fv|/I,IS,EG<F2(Xy$/n<Fa(h9}+9_2o&N4#7X<Zq|+f_Dp=dt&na,Ca=NJ)jY=8C=YG=s6&Q+<DO}D3=xB&R1(lw;Qn<bF(Cu|/B}HV=SS&n7,10&u0]Dm%A6^4Q=WR(TD=Xo<GH,Rj(l8)bP&n/=LM&CF,F5&ml=PJ;0k=LG=tq,Rh,D6@4i=1p&+9=YC%er_Mh;nI;0q=Fw]80=xq=FM$Gv;v6&nc;wK%H2&Kj;vs,AA=YP,66}bI(qR~5U=6q~4b$Ni=K5.X3$So&Iu(p+]8G=Cf=RY(TS_O3(iH&57=fE=Dg_Do#9z#7H;FK{qd_2k%JR}en&gh_z8;Rx}9p<cN_Ne,DO;LN_7o~/p=NF=5Y}gN<ce<C1,QE]Wv=3u<BC}GK]yq}DY&u/_hj=II(pz&rC,jV&+Z}ut=NQ;Cg-SR_ZS,+o=u/;Oy_RK_QF(Fx&xP}Wr&TA,Uh&g1=yr{ax[VF$Pg(YB;Ox=Vy;+W(Sp}XV%dd&33(l/]l4#4Y}OE=6c=bw(A7&9t%wd&N/&mo,JH&Qe)fm=Ao}fu=tH";
    var deltaData = "FAZDC6BALcLZCA+GBARCW8wNCcDDZ8LVFBOqqDUiou+M42TFAyERXFb7EjhP+vmBFpFrUpfDV2F7eB+eCltCHJFWLFCED+pWTojEIHFXc3aFn4F68zqjEuKidS1QBVPDEhE7NA4mhMF7oThD49ot3FgtzHFCK0acW1x8DH1EmLoIlrWFBLE+y5+NA3Cx65wJHTaEZVaK1mWAmPGxgYCdxwOjTDIt/faOEhTl1vqNsKtJCOhJWuio2g07KLZEQsFBUpNtwEByBgxFslFheFbiEPvi61msDvApxCzB6rBCzox7joYA5UdDc+Cb4FSgIabpXFAj3bjkmFAxCZE+mD/SFf/0ELecYCt3nLoxC6WEZf2tKDB4oZvrEmqFkKk7BwILA7gtYBpsTq//D4jD0F0wEB9pyQ1BD5Ba0oYHDI+sbDFhvrHXdDHfgFEIJLi5r8qercNFBgFLC4bo5ERJtamWBDFy73KCEb6M8VpmEt330ygCTK58EIIFkYgF84gtGA9Uyh3m68iVrFbWFbcbqiCYHZ9J1jeRPbL8yswhMiDbhEhdNoSwFbZrLT740ABEqgCkO8J1BLd1VhKKR4sD1yUo0z+FF59Mvg71CFbyEhbHSFBKEIKyoQNgQppq9T0KAqePu0ZFGrXOHdKJqkoTFhYvpDNyuuznrN84thJbsCoO6Cu6Xlvntvy0QYuAExQEYtTUBf3CoCqwgGFZ4u1HJFzDVwEy3cjcpV4QvsPaBC3rCGyCF23o4K3pp2gberGgFEJEHo4nHICtyKH2ZqyxhN05KBBJIQlKh/Oujv/DH32VrlqFdIFC7Fz9Ct4kaqFME0UETLprnN9kfy+kFmtQBB0+5CFu0N9Ij8l/VvJDh2oq3hT6EzjTHKFN7ZjZwoTsAZ4Exsko6Fpa6WC+sduz8jyrLpegTv2h1EBeYpLpm2czQW0KoCcS0bCVXCmuWJDBjN1nQNLdF58SFJ0h7i3pC3oEOKy/FjBklL70XvBEEIWp2yZ04xObzAWDDJG7f+DbqBEA7LyiR95j7MDVdDViz2RE5vWlBMv5e4+VfhP3aXNPhvLSynb9O2x4uFBV+3jqu6d5pCG28/sETByvmu/+IJ0L3wb4rj9DNOLBF6XPIODr4L19U9RRofAG6Nxydi8Bki8BhGJbBAJKzbJxkZSlF9Q2Cu8oKqggB9hBArwLLqEBWEtFowy8XK8bEyw9snT+BeyFk1ZCSrdmgfEwFePTgCjELBEnIbjaDDPJm36rG9pztcEzT8dGk23SBhXBB1H4z+OWze0ooFzz8pDBYFvp9j9tvFByf9y4EFdVnz026CGR5qMr7fxMHN8UUdlyJAzlTBDRC28k+L4FB8078ljyD91tUj1ocnTs8vdEf7znbzm+GIjEZnoZE5rnLL700Xc7yHfz05nWxy03vBB9YGHYOWxgMQGBCR24CVYNE1hpfKxN0zKnfJDmmMgMmBWqNbjfSyFCBWSCGCgR8yFXiHyEj+VtD1FB3FpC1zI0kFbzifiKTLm9yq5zFmur+q8FHqjoOBWsBPiDbnCC2ErunV6cJ6TygXFYHYp7MKN9RUlSIS8/xBAGYLzeqUnBF4QbsTuUkUqGs6CaiDWKWjQK9EJkjpkTmNCPYXL";
    var wordlist = {
      zh_cn: null,
      zh_tw: null
    };
    var Checks = {
      zh_cn: "0x17bcc4d8547e5a7135e365d1ab443aaae95e76d8230c2782c67305d4f21497a1",
      zh_tw: "0x51e720e90c7b87bec1d70eb6e74a21a449bd3ec9c020b01d3a40ed991b60ce5d"
    };
    var codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var style = "~!@#$%^&*_-=[]{}|;:,.()<>?";
    function loadWords(lang) {
      if (wordlist[lang.locale] !== null) {
        return;
      }
      wordlist[lang.locale] = [];
      var deltaOffset = 0;
      for (var i = 0; i < 2048; i++) {
        var s = style.indexOf(data[i * 3]);
        var bytes = [
          228 + (s >> 2),
          128 + codes.indexOf(data[i * 3 + 1]),
          128 + codes.indexOf(data[i * 3 + 2])
        ];
        if (lang.locale === "zh_tw") {
          var common = s % 4;
          for (var i_1 = common; i_1 < 3; i_1++) {
            bytes[i_1] = codes.indexOf(deltaData[deltaOffset++]) + (i_1 == 0 ? 228 : 128);
          }
        }
        wordlist[lang.locale].push((0, strings_1.toUtf8String)(bytes));
      }
      if (wordlist_1.Wordlist.check(lang) !== Checks[lang.locale]) {
        wordlist[lang.locale] = null;
        throw new Error("BIP39 Wordlist for " + lang.locale + " (Chinese) FAILED");
      }
    }
    var LangZh = (
      /** @class */
      function(_super) {
        __extends(LangZh2, _super);
        function LangZh2(country) {
          return _super.call(this, "zh_" + country) || this;
        }
        LangZh2.prototype.getWord = function(index) {
          loadWords(this);
          return wordlist[this.locale][index];
        };
        LangZh2.prototype.getWordIndex = function(word) {
          loadWords(this);
          return wordlist[this.locale].indexOf(word);
        };
        LangZh2.prototype.split = function(mnemonic) {
          mnemonic = mnemonic.replace(/(?:\u3000| )+/g, "");
          return mnemonic.split("");
        };
        return LangZh2;
      }(wordlist_1.Wordlist)
    );
    var langZhCn = new LangZh("cn");
    exports.langZhCn = langZhCn;
    wordlist_1.Wordlist.register(langZhCn);
    wordlist_1.Wordlist.register(langZhCn, "zh");
    var langZhTw = new LangZh("tw");
    exports.langZhTw = langZhTw;
    wordlist_1.Wordlist.register(langZhTw);
  }
});

// node_modules/@ethersproject/wordlists/lib/wordlists.js
var require_wordlists = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/wordlists.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wordlists = void 0;
    var lang_cz_1 = require_lang_cz();
    var lang_en_1 = require_lang_en();
    var lang_es_1 = require_lang_es();
    var lang_fr_1 = require_lang_fr();
    var lang_ja_1 = require_lang_ja();
    var lang_ko_1 = require_lang_ko();
    var lang_it_1 = require_lang_it();
    var lang_zh_1 = require_lang_zh();
    exports.wordlists = {
      cz: lang_cz_1.langCz,
      en: lang_en_1.langEn,
      es: lang_es_1.langEs,
      fr: lang_fr_1.langFr,
      it: lang_it_1.langIt,
      ja: lang_ja_1.langJa,
      ko: lang_ko_1.langKo,
      zh: lang_zh_1.langZhCn,
      zh_cn: lang_zh_1.langZhCn,
      zh_tw: lang_zh_1.langZhTw
    };
  }
});

// node_modules/@ethersproject/wordlists/lib/index.js
var require_lib22 = __commonJS({
  "node_modules/@ethersproject/wordlists/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wordlists = exports.Wordlist = exports.logger = void 0;
    var wordlist_1 = require_wordlist();
    Object.defineProperty(exports, "logger", { enumerable: true, get: function() {
      return wordlist_1.logger;
    } });
    Object.defineProperty(exports, "Wordlist", { enumerable: true, get: function() {
      return wordlist_1.Wordlist;
    } });
    var wordlists_1 = require_wordlists();
    Object.defineProperty(exports, "wordlists", { enumerable: true, get: function() {
      return wordlists_1.wordlists;
    } });
  }
});

// node_modules/@ethersproject/hdnode/lib/_version.js
var require_version6 = __commonJS({
  "node_modules/@ethersproject/hdnode/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "hdnode/5.7.0";
  }
});

// node_modules/@ethersproject/hdnode/lib/index.js
var require_lib23 = __commonJS({
  "node_modules/@ethersproject/hdnode/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAccountPath = exports.isValidMnemonic = exports.entropyToMnemonic = exports.mnemonicToEntropy = exports.mnemonicToSeed = exports.HDNode = exports.defaultPath = void 0;
    var basex_1 = require_lib19();
    var bytes_1 = require_lib2();
    var bignumber_1 = require_lib3();
    var strings_1 = require_lib11();
    var pbkdf2_1 = require_lib20();
    var properties_1 = require_lib8();
    var signing_key_1 = require_lib9();
    var sha2_1 = require_lib21();
    var transactions_1 = require_lib10();
    var wordlists_1 = require_lib22();
    var logger_1 = require_lib();
    var _version_1 = require_version6();
    var logger = new logger_1.Logger(_version_1.version);
    var N = bignumber_1.BigNumber.from("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
    var MasterSecret = (0, strings_1.toUtf8Bytes)("Bitcoin seed");
    var HardenedBit = 2147483648;
    function getUpperMask(bits) {
      return (1 << bits) - 1 << 8 - bits;
    }
    function getLowerMask(bits) {
      return (1 << bits) - 1;
    }
    function bytes32(value) {
      return (0, bytes_1.hexZeroPad)((0, bytes_1.hexlify)(value), 32);
    }
    function base58check(data) {
      return basex_1.Base58.encode((0, bytes_1.concat)([data, (0, bytes_1.hexDataSlice)((0, sha2_1.sha256)((0, sha2_1.sha256)(data)), 0, 4)]));
    }
    function getWordlist(wordlist) {
      if (wordlist == null) {
        return wordlists_1.wordlists["en"];
      }
      if (typeof wordlist === "string") {
        var words = wordlists_1.wordlists[wordlist];
        if (words == null) {
          logger.throwArgumentError("unknown locale", "wordlist", wordlist);
        }
        return words;
      }
      return wordlist;
    }
    var _constructorGuard = {};
    exports.defaultPath = "m/44'/60'/0'/0/0";
    var HDNode = (
      /** @class */
      function() {
        function HDNode2(constructorGuard, privateKey, publicKey, parentFingerprint, chainCode, index, depth, mnemonicOrPath) {
          if (constructorGuard !== _constructorGuard) {
            throw new Error("HDNode constructor cannot be called directly");
          }
          if (privateKey) {
            var signingKey = new signing_key_1.SigningKey(privateKey);
            (0, properties_1.defineReadOnly)(this, "privateKey", signingKey.privateKey);
            (0, properties_1.defineReadOnly)(this, "publicKey", signingKey.compressedPublicKey);
          } else {
            (0, properties_1.defineReadOnly)(this, "privateKey", null);
            (0, properties_1.defineReadOnly)(this, "publicKey", (0, bytes_1.hexlify)(publicKey));
          }
          (0, properties_1.defineReadOnly)(this, "parentFingerprint", parentFingerprint);
          (0, properties_1.defineReadOnly)(this, "fingerprint", (0, bytes_1.hexDataSlice)((0, sha2_1.ripemd160)((0, sha2_1.sha256)(this.publicKey)), 0, 4));
          (0, properties_1.defineReadOnly)(this, "address", (0, transactions_1.computeAddress)(this.publicKey));
          (0, properties_1.defineReadOnly)(this, "chainCode", chainCode);
          (0, properties_1.defineReadOnly)(this, "index", index);
          (0, properties_1.defineReadOnly)(this, "depth", depth);
          if (mnemonicOrPath == null) {
            (0, properties_1.defineReadOnly)(this, "mnemonic", null);
            (0, properties_1.defineReadOnly)(this, "path", null);
          } else if (typeof mnemonicOrPath === "string") {
            (0, properties_1.defineReadOnly)(this, "mnemonic", null);
            (0, properties_1.defineReadOnly)(this, "path", mnemonicOrPath);
          } else {
            (0, properties_1.defineReadOnly)(this, "mnemonic", mnemonicOrPath);
            (0, properties_1.defineReadOnly)(this, "path", mnemonicOrPath.path);
          }
        }
        Object.defineProperty(HDNode2.prototype, "extendedKey", {
          get: function() {
            if (this.depth >= 256) {
              throw new Error("Depth too large!");
            }
            return base58check((0, bytes_1.concat)([
              this.privateKey != null ? "0x0488ADE4" : "0x0488B21E",
              (0, bytes_1.hexlify)(this.depth),
              this.parentFingerprint,
              (0, bytes_1.hexZeroPad)((0, bytes_1.hexlify)(this.index), 4),
              this.chainCode,
              this.privateKey != null ? (0, bytes_1.concat)(["0x00", this.privateKey]) : this.publicKey
            ]));
          },
          enumerable: false,
          configurable: true
        });
        HDNode2.prototype.neuter = function() {
          return new HDNode2(_constructorGuard, null, this.publicKey, this.parentFingerprint, this.chainCode, this.index, this.depth, this.path);
        };
        HDNode2.prototype._derive = function(index) {
          if (index > 4294967295) {
            throw new Error("invalid index - " + String(index));
          }
          var path = this.path;
          if (path) {
            path += "/" + (index & ~HardenedBit);
          }
          var data = new Uint8Array(37);
          if (index & HardenedBit) {
            if (!this.privateKey) {
              throw new Error("cannot derive child of neutered node");
            }
            data.set((0, bytes_1.arrayify)(this.privateKey), 1);
            if (path) {
              path += "'";
            }
          } else {
            data.set((0, bytes_1.arrayify)(this.publicKey));
          }
          for (var i = 24; i >= 0; i -= 8) {
            data[33 + (i >> 3)] = index >> 24 - i & 255;
          }
          var I = (0, bytes_1.arrayify)((0, sha2_1.computeHmac)(sha2_1.SupportedAlgorithm.sha512, this.chainCode, data));
          var IL = I.slice(0, 32);
          var IR = I.slice(32);
          var ki = null;
          var Ki = null;
          if (this.privateKey) {
            ki = bytes32(bignumber_1.BigNumber.from(IL).add(this.privateKey).mod(N));
          } else {
            var ek = new signing_key_1.SigningKey((0, bytes_1.hexlify)(IL));
            Ki = ek._addPoint(this.publicKey);
          }
          var mnemonicOrPath = path;
          var srcMnemonic = this.mnemonic;
          if (srcMnemonic) {
            mnemonicOrPath = Object.freeze({
              phrase: srcMnemonic.phrase,
              path,
              locale: srcMnemonic.locale || "en"
            });
          }
          return new HDNode2(_constructorGuard, ki, Ki, this.fingerprint, bytes32(IR), index, this.depth + 1, mnemonicOrPath);
        };
        HDNode2.prototype.derivePath = function(path) {
          var components = path.split("/");
          if (components.length === 0 || components[0] === "m" && this.depth !== 0) {
            throw new Error("invalid path - " + path);
          }
          if (components[0] === "m") {
            components.shift();
          }
          var result = this;
          for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.match(/^[0-9]+'$/)) {
              var index = parseInt(component.substring(0, component.length - 1));
              if (index >= HardenedBit) {
                throw new Error("invalid path index - " + component);
              }
              result = result._derive(HardenedBit + index);
            } else if (component.match(/^[0-9]+$/)) {
              var index = parseInt(component);
              if (index >= HardenedBit) {
                throw new Error("invalid path index - " + component);
              }
              result = result._derive(index);
            } else {
              throw new Error("invalid path component - " + component);
            }
          }
          return result;
        };
        HDNode2._fromSeed = function(seed, mnemonic) {
          var seedArray = (0, bytes_1.arrayify)(seed);
          if (seedArray.length < 16 || seedArray.length > 64) {
            throw new Error("invalid seed");
          }
          var I = (0, bytes_1.arrayify)((0, sha2_1.computeHmac)(sha2_1.SupportedAlgorithm.sha512, MasterSecret, seedArray));
          return new HDNode2(_constructorGuard, bytes32(I.slice(0, 32)), null, "0x00000000", bytes32(I.slice(32)), 0, 0, mnemonic);
        };
        HDNode2.fromMnemonic = function(mnemonic, password, wordlist) {
          wordlist = getWordlist(wordlist);
          mnemonic = entropyToMnemonic(mnemonicToEntropy(mnemonic, wordlist), wordlist);
          return HDNode2._fromSeed(mnemonicToSeed(mnemonic, password), {
            phrase: mnemonic,
            path: "m",
            locale: wordlist.locale
          });
        };
        HDNode2.fromSeed = function(seed) {
          return HDNode2._fromSeed(seed, null);
        };
        HDNode2.fromExtendedKey = function(extendedKey) {
          var bytes = basex_1.Base58.decode(extendedKey);
          if (bytes.length !== 82 || base58check(bytes.slice(0, 78)) !== extendedKey) {
            logger.throwArgumentError("invalid extended key", "extendedKey", "[REDACTED]");
          }
          var depth = bytes[4];
          var parentFingerprint = (0, bytes_1.hexlify)(bytes.slice(5, 9));
          var index = parseInt((0, bytes_1.hexlify)(bytes.slice(9, 13)).substring(2), 16);
          var chainCode = (0, bytes_1.hexlify)(bytes.slice(13, 45));
          var key = bytes.slice(45, 78);
          switch ((0, bytes_1.hexlify)(bytes.slice(0, 4))) {
            case "0x0488b21e":
            case "0x043587cf":
              return new HDNode2(_constructorGuard, null, (0, bytes_1.hexlify)(key), parentFingerprint, chainCode, index, depth, null);
            case "0x0488ade4":
            case "0x04358394 ":
              if (key[0] !== 0) {
                break;
              }
              return new HDNode2(_constructorGuard, (0, bytes_1.hexlify)(key.slice(1)), null, parentFingerprint, chainCode, index, depth, null);
          }
          return logger.throwArgumentError("invalid extended key", "extendedKey", "[REDACTED]");
        };
        return HDNode2;
      }()
    );
    exports.HDNode = HDNode;
    function mnemonicToSeed(mnemonic, password) {
      if (!password) {
        password = "";
      }
      var salt = (0, strings_1.toUtf8Bytes)("mnemonic" + password, strings_1.UnicodeNormalizationForm.NFKD);
      return (0, pbkdf2_1.pbkdf2)((0, strings_1.toUtf8Bytes)(mnemonic, strings_1.UnicodeNormalizationForm.NFKD), salt, 2048, 64, "sha512");
    }
    exports.mnemonicToSeed = mnemonicToSeed;
    function mnemonicToEntropy(mnemonic, wordlist) {
      wordlist = getWordlist(wordlist);
      logger.checkNormalize();
      var words = wordlist.split(mnemonic);
      if (words.length % 3 !== 0) {
        throw new Error("invalid mnemonic");
      }
      var entropy = (0, bytes_1.arrayify)(new Uint8Array(Math.ceil(11 * words.length / 8)));
      var offset = 0;
      for (var i = 0; i < words.length; i++) {
        var index = wordlist.getWordIndex(words[i].normalize("NFKD"));
        if (index === -1) {
          throw new Error("invalid mnemonic");
        }
        for (var bit = 0; bit < 11; bit++) {
          if (index & 1 << 10 - bit) {
            entropy[offset >> 3] |= 1 << 7 - offset % 8;
          }
          offset++;
        }
      }
      var entropyBits = 32 * words.length / 3;
      var checksumBits = words.length / 3;
      var checksumMask = getUpperMask(checksumBits);
      var checksum = (0, bytes_1.arrayify)((0, sha2_1.sha256)(entropy.slice(0, entropyBits / 8)))[0] & checksumMask;
      if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
        throw new Error("invalid checksum");
      }
      return (0, bytes_1.hexlify)(entropy.slice(0, entropyBits / 8));
    }
    exports.mnemonicToEntropy = mnemonicToEntropy;
    function entropyToMnemonic(entropy, wordlist) {
      wordlist = getWordlist(wordlist);
      entropy = (0, bytes_1.arrayify)(entropy);
      if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
        throw new Error("invalid entropy");
      }
      var indices = [0];
      var remainingBits = 11;
      for (var i = 0; i < entropy.length; i++) {
        if (remainingBits > 8) {
          indices[indices.length - 1] <<= 8;
          indices[indices.length - 1] |= entropy[i];
          remainingBits -= 8;
        } else {
          indices[indices.length - 1] <<= remainingBits;
          indices[indices.length - 1] |= entropy[i] >> 8 - remainingBits;
          indices.push(entropy[i] & getLowerMask(8 - remainingBits));
          remainingBits += 3;
        }
      }
      var checksumBits = entropy.length / 4;
      var checksum = (0, bytes_1.arrayify)((0, sha2_1.sha256)(entropy))[0] & getUpperMask(checksumBits);
      indices[indices.length - 1] <<= checksumBits;
      indices[indices.length - 1] |= checksum >> 8 - checksumBits;
      return wordlist.join(indices.map(function(index) {
        return wordlist.getWord(index);
      }));
    }
    exports.entropyToMnemonic = entropyToMnemonic;
    function isValidMnemonic(mnemonic, wordlist) {
      try {
        mnemonicToEntropy(mnemonic, wordlist);
        return true;
      } catch (error) {
      }
      return false;
    }
    exports.isValidMnemonic = isValidMnemonic;
    function getAccountPath(index) {
      if (typeof index !== "number" || index < 0 || index >= HardenedBit || index % 1) {
        logger.throwArgumentError("invalid account index", "index", index);
      }
      return "m/44'/60'/" + index + "'/0/0";
    }
    exports.getAccountPath = getAccountPath;
  }
});

// node_modules/@ethersproject/random/lib/random.js
var require_random = __commonJS({
  "node_modules/@ethersproject/random/lib/random.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomBytes = void 0;
    var crypto_1 = __require("crypto");
    var bytes_1 = require_lib2();
    function randomBytes(length) {
      return (0, bytes_1.arrayify)((0, crypto_1.randomBytes)(length));
    }
    exports.randomBytes = randomBytes;
  }
});

// node_modules/@ethersproject/random/lib/shuffle.js
var require_shuffle = __commonJS({
  "node_modules/@ethersproject/random/lib/shuffle.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shuffled = void 0;
    function shuffled(array) {
      array = array.slice();
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
      }
      return array;
    }
    exports.shuffled = shuffled;
  }
});

// node_modules/@ethersproject/random/lib/index.js
var require_lib24 = __commonJS({
  "node_modules/@ethersproject/random/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shuffled = exports.randomBytes = void 0;
    var random_1 = require_random();
    Object.defineProperty(exports, "randomBytes", { enumerable: true, get: function() {
      return random_1.randomBytes;
    } });
    var shuffle_1 = require_shuffle();
    Object.defineProperty(exports, "shuffled", { enumerable: true, get: function() {
      return shuffle_1.shuffled;
    } });
  }
});

// node_modules/aes-js/index.js
var require_aes_js = __commonJS({
  "node_modules/aes-js/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    (function(root) {
      function checkInt(value) {
        return parseInt(value) === value;
      }
      function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) {
          return false;
        }
        for (var i = 0; i < arrayish.length; i++) {
          if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
            return false;
          }
        }
        return true;
      }
      function coerceArray(arg, copy) {
        if (arg.buffer && ArrayBuffer.isView(arg) && arg.name === "Uint8Array") {
          if (copy) {
            if (arg.slice) {
              arg = arg.slice();
            } else {
              arg = Array.prototype.slice.call(arg);
            }
          }
          return arg;
        }
        if (Array.isArray(arg)) {
          if (!checkInts(arg)) {
            throw new Error("Array contains invalid value: " + arg);
          }
          return new Uint8Array(arg);
        }
        if (checkInt(arg.length) && checkInts(arg)) {
          return new Uint8Array(arg);
        }
        throw new Error("unsupported array-like object");
      }
      function createArray(length) {
        return new Uint8Array(length);
      }
      function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
          if (sourceArray.slice) {
            sourceArray = sourceArray.slice(sourceStart, sourceEnd);
          } else {
            sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
          }
        }
        targetArray.set(sourceArray, targetStart);
      }
      var convertUtf8 = function() {
        function toBytes(text) {
          var result = [], i = 0;
          text = encodeURI(text);
          while (i < text.length) {
            var c = text.charCodeAt(i++);
            if (c === 37) {
              result.push(parseInt(text.substr(i, 2), 16));
              i += 2;
            } else {
              result.push(c);
            }
          }
          return coerceArray(result);
        }
        function fromBytes(bytes) {
          var result = [], i = 0;
          while (i < bytes.length) {
            var c = bytes[i];
            if (c < 128) {
              result.push(String.fromCharCode(c));
              i++;
            } else if (c > 191 && c < 224) {
              result.push(String.fromCharCode((c & 31) << 6 | bytes[i + 1] & 63));
              i += 2;
            } else {
              result.push(String.fromCharCode((c & 15) << 12 | (bytes[i + 1] & 63) << 6 | bytes[i + 2] & 63));
              i += 3;
            }
          }
          return result.join("");
        }
        return {
          toBytes,
          fromBytes
        };
      }();
      var convertHex = function() {
        function toBytes(text) {
          var result = [];
          for (var i = 0; i < text.length; i += 2) {
            result.push(parseInt(text.substr(i, 2), 16));
          }
          return result;
        }
        var Hex = "0123456789abcdef";
        function fromBytes(bytes) {
          var result = [];
          for (var i = 0; i < bytes.length; i++) {
            var v = bytes[i];
            result.push(Hex[(v & 240) >> 4] + Hex[v & 15]);
          }
          return result.join("");
        }
        return {
          toBytes,
          fromBytes
        };
      }();
      var numberOfRounds = { 16: 10, 24: 12, 32: 14 };
      var rcon = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145];
      var S = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22];
      var Si = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125];
      var T1 = [3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157, 3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757, 3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813, 2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307, 1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063, 3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618, 1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420, 3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767, 134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301, 235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627, 2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582, 1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163, 2824099068, 1841019862, 739644986];
      var T2 = [2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027, 2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147, 434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938, 1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592, 3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988, 2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398, 1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525, 886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517, 201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806, 252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339, 1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112, 4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187, 1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008, 4238890068, 3597515707, 975967766];
      var T3 = [1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347, 4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298, 3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232, 2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228, 1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518, 911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325, 3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826, 3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552, 1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067, 795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910, 961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360, 4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739, 2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960, 1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568, 2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668, 3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003, 3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855, 2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534, 1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744, 2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008, 2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782, 1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650, 3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972, 2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893, 3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908, 3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164, 3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131, 3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261, 1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045, 2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777, 3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927, 3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796, 2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242, 1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488, 1425844308, 3151392187, 372911126];
      var T4 = [1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422, 4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983, 3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547, 2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643, 1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788, 909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625, 3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791, 3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667, 1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797, 791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535, 960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995, 4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214, 2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760, 1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408, 2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563, 3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573, 3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230, 2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284, 1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344, 2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123, 2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087, 1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855, 3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747, 2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873, 3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523, 3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419, 3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126, 3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401, 1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850, 2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042, 3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917, 3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891, 2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452, 1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443, 1414855848, 3149649517, 370555436];
      var T5 = [1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753, 2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485, 1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703, 1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843, 1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733, 3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074, 2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228, 1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562, 3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154, 4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474, 875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366, 2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327, 2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058, 463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234, 3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775, 1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960, 3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733, 3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396, 2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238, 2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012, 1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814, 2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619, 270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369, 2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889, 1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186, 1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980, 3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204, 25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971, 1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302, 3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761, 1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769, 3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627, 4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265, 3576870512, 1215061108, 3501741890];
      var T6 = [1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933, 2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900, 4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723, 2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473, 692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113, 3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529, 1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523, 1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824, 4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204, 4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614, 2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839, 106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461, 3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937, 3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980, 1893020342, 1950903388, 1120974935];
      var T7 = [2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173, 1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970, 3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698, 244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515, 1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868, 1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033, 1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914, 861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368, 1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827, 2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239, 2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009, 4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174, 1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224, 2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237, 1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968, 172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081, 1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047, 2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278, 2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665, 4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005, 4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898, 1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670, 3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556, 1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178, 188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442, 2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569, 2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044, 2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634, 2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639, 919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549, 1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196, 3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050, 81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974, 895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576, 1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897, 3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516, 935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519, 3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572, 2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195, 3060847922, 1551124588, 1463996600];
      var T8 = [4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623, 4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053, 3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835, 2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848, 3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143, 3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389, 1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913, 1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242, 529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424, 1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981, 1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582, 1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748, 2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234, 2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535, 1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070, 3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413, 3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325, 3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816, 4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628, 3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092, 2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814, 3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464, 410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844, 1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714, 1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454, 2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521, 3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700, 2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909, 2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841, 3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542, 1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736, 3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274, 1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712, 227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555, 850817237, 1817998408, 3092726480];
      var U1 = [0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554, 708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108, 1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990, 4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216, 2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058, 3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343, 3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029, 3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847, 226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775, 2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520, 3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422, 3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228, 4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434, 2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896, 800440835, 92987698, 193195065, 429456164, 395441711, 1984812685, 2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311, 1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657, 807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971, 2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805, 3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751, 3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483, 2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465, 599762354, 159417987, 126454664, 361929877, 463180190, 2709260871, 2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733, 2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971, 3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178, 2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284, 3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302, 3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384, 1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619, 3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487, 504459436, 875451293, 975658646, 675039627, 641025152, 2084704233, 1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972, 632953703, 260388950, 25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500, 1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226, 3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432, 4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150, 2438237621, 2203032232, 2370213795];
      var U2 = [0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694, 824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388, 2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410, 2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776, 3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918, 3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543, 1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569, 1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355, 3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933, 4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895, 3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975, 3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917, 2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523, 2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409, 1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751, 53458370, 839224033, 957055980, 605657339, 790073846, 2373340630, 2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216, 3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602, 4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369, 296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296, 1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598, 3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840, 2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386, 1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268, 1988838185, 533804130, 350174575, 164439672, 46346101, 870912086, 954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643, 2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929, 3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127, 3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309, 457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035, 2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597, 486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387, 2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917, 2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703, 3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473, 3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720, 1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122, 4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200, 3046200461, 2827177882, 2743944855];
      var U3 = [0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294, 590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588, 1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250, 3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176, 3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278, 2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663, 2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769, 3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195, 1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394, 428169201, 344873464, 935293895, 984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180, 2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772, 313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554, 2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636, 3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085, 3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771, 4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177, 2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631, 287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925, 1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571, 1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968, 3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150, 2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576, 1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613, 1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910, 331544205, 516552836, 1039717051, 821288114, 669961897, 719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299, 2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885, 3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634, 3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044, 2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702, 3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632, 1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938, 48394827, 369057872, 418672217, 1002783846, 919489135, 567498868, 752375421, 209336225, 24197544, 376187827, 459744698, 945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635, 1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881, 3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127, 4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285, 2377486676, 2594734927, 2544078150];
      var U4 = [0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204, 1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408, 1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100, 2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816, 3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748, 3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843, 377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315, 2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623, 2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475, 3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905, 1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837, 923313619, 740276417, 621982671, 439452389, 322734571, 137073913, 19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589, 3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641, 3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550, 1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376, 396673818, 514443284, 562755902, 679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866, 3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230, 2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026, 2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953, 3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765, 3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481, 1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413, 1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841, 425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674, 2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542, 2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834, 1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990, 349075736, 736970802, 585122620, 972512814, 821712160, 2595684844, 2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464, 2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212, 4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952, 292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068, 1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848, 2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775, 2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155, 4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211, 718002117, 367585007, 484830689, 133361907, 251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495, 1418573201, 1335535747, 1184342925];
      function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
          result.push(
            bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3]
          );
        }
        return result;
      }
      var AES = function(key) {
        if (!(this instanceof AES)) {
          throw Error("AES must be instanitated with `new`");
        }
        Object.defineProperty(this, "key", {
          value: coerceArray(key, true)
        });
        this._prepare();
      };
      AES.prototype._prepare = function() {
        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
          throw new Error("invalid key size (must be 16, 24 or 32 bytes)");
        }
        this._Ke = [];
        this._Kd = [];
        for (var i = 0; i <= rounds; i++) {
          this._Ke.push([0, 0, 0, 0]);
          this._Kd.push([0, 0, 0, 0]);
        }
        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;
        var tk = convertToInt32(this.key);
        var index;
        for (var i = 0; i < KC; i++) {
          index = i >> 2;
          this._Ke[index][i % 4] = tk[i];
          this._Kd[rounds - index][i % 4] = tk[i];
        }
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
          tt = tk[KC - 1];
          tk[0] ^= S[tt >> 16 & 255] << 24 ^ S[tt >> 8 & 255] << 16 ^ S[tt & 255] << 8 ^ S[tt >> 24 & 255] ^ rcon[rconpointer] << 24;
          rconpointer += 1;
          if (KC != 8) {
            for (var i = 1; i < KC; i++) {
              tk[i] ^= tk[i - 1];
            }
          } else {
            for (var i = 1; i < KC / 2; i++) {
              tk[i] ^= tk[i - 1];
            }
            tt = tk[KC / 2 - 1];
            tk[KC / 2] ^= S[tt & 255] ^ S[tt >> 8 & 255] << 8 ^ S[tt >> 16 & 255] << 16 ^ S[tt >> 24 & 255] << 24;
            for (var i = KC / 2 + 1; i < KC; i++) {
              tk[i] ^= tk[i - 1];
            }
          }
          var i = 0, r, c;
          while (i < KC && t < roundKeyCount) {
            r = t >> 2;
            c = t % 4;
            this._Ke[r][c] = tk[i];
            this._Kd[rounds - r][c] = tk[i++];
            t++;
          }
        }
        for (var r = 1; r < rounds; r++) {
          for (var c = 0; c < 4; c++) {
            tt = this._Kd[r][c];
            this._Kd[r][c] = U1[tt >> 24 & 255] ^ U2[tt >> 16 & 255] ^ U3[tt >> 8 & 255] ^ U4[tt & 255];
          }
        }
      };
      AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
          throw new Error("invalid plaintext size (must be 16 bytes)");
        }
        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
          t[i] ^= this._Ke[0][i];
        }
        for (var r = 1; r < rounds; r++) {
          for (var i = 0; i < 4; i++) {
            a[i] = T1[t[i] >> 24 & 255] ^ T2[t[(i + 1) % 4] >> 16 & 255] ^ T3[t[(i + 2) % 4] >> 8 & 255] ^ T4[t[(i + 3) % 4] & 255] ^ this._Ke[r][i];
          }
          t = a.slice();
        }
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
          tt = this._Ke[rounds][i];
          result[4 * i] = (S[t[i] >> 24 & 255] ^ tt >> 24) & 255;
          result[4 * i + 1] = (S[t[(i + 1) % 4] >> 16 & 255] ^ tt >> 16) & 255;
          result[4 * i + 2] = (S[t[(i + 2) % 4] >> 8 & 255] ^ tt >> 8) & 255;
          result[4 * i + 3] = (S[t[(i + 3) % 4] & 255] ^ tt) & 255;
        }
        return result;
      };
      AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
          throw new Error("invalid ciphertext size (must be 16 bytes)");
        }
        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
          t[i] ^= this._Kd[0][i];
        }
        for (var r = 1; r < rounds; r++) {
          for (var i = 0; i < 4; i++) {
            a[i] = T5[t[i] >> 24 & 255] ^ T6[t[(i + 3) % 4] >> 16 & 255] ^ T7[t[(i + 2) % 4] >> 8 & 255] ^ T8[t[(i + 1) % 4] & 255] ^ this._Kd[r][i];
          }
          t = a.slice();
        }
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
          tt = this._Kd[rounds][i];
          result[4 * i] = (Si[t[i] >> 24 & 255] ^ tt >> 24) & 255;
          result[4 * i + 1] = (Si[t[(i + 3) % 4] >> 16 & 255] ^ tt >> 16) & 255;
          result[4 * i + 2] = (Si[t[(i + 2) % 4] >> 8 & 255] ^ tt >> 8) & 255;
          result[4 * i + 3] = (Si[t[(i + 1) % 4] & 255] ^ tt) & 255;
        }
        return result;
      };
      var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
          throw Error("AES must be instanitated with `new`");
        }
        this.description = "Electronic Code Block";
        this.name = "ecb";
        this._aes = new AES(key);
      };
      ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);
        if (plaintext.length % 16 !== 0) {
          throw new Error("invalid plaintext size (must be multiple of 16 bytes)");
        }
        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);
        for (var i = 0; i < plaintext.length; i += 16) {
          copyArray(plaintext, block, 0, i, i + 16);
          block = this._aes.encrypt(block);
          copyArray(block, ciphertext, i);
        }
        return ciphertext;
      };
      ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);
        if (ciphertext.length % 16 !== 0) {
          throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");
        }
        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);
        for (var i = 0; i < ciphertext.length; i += 16) {
          copyArray(ciphertext, block, 0, i, i + 16);
          block = this._aes.decrypt(block);
          copyArray(block, plaintext, i);
        }
        return plaintext;
      };
      var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
          throw Error("AES must be instanitated with `new`");
        }
        this.description = "Cipher Block Chaining";
        this.name = "cbc";
        if (!iv) {
          iv = createArray(16);
        } else if (iv.length != 16) {
          throw new Error("invalid initialation vector size (must be 16 bytes)");
        }
        this._lastCipherblock = coerceArray(iv, true);
        this._aes = new AES(key);
      };
      ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);
        if (plaintext.length % 16 !== 0) {
          throw new Error("invalid plaintext size (must be multiple of 16 bytes)");
        }
        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);
        for (var i = 0; i < plaintext.length; i += 16) {
          copyArray(plaintext, block, 0, i, i + 16);
          for (var j = 0; j < 16; j++) {
            block[j] ^= this._lastCipherblock[j];
          }
          this._lastCipherblock = this._aes.encrypt(block);
          copyArray(this._lastCipherblock, ciphertext, i);
        }
        return ciphertext;
      };
      ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);
        if (ciphertext.length % 16 !== 0) {
          throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");
        }
        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);
        for (var i = 0; i < ciphertext.length; i += 16) {
          copyArray(ciphertext, block, 0, i, i + 16);
          block = this._aes.decrypt(block);
          for (var j = 0; j < 16; j++) {
            plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
          }
          copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }
        return plaintext;
      };
      var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
          throw Error("AES must be instanitated with `new`");
        }
        this.description = "Cipher Feedback";
        this.name = "cfb";
        if (!iv) {
          iv = createArray(16);
        } else if (iv.length != 16) {
          throw new Error("invalid initialation vector size (must be 16 size)");
        }
        if (!segmentSize) {
          segmentSize = 1;
        }
        this.segmentSize = segmentSize;
        this._shiftRegister = coerceArray(iv, true);
        this._aes = new AES(key);
      };
      ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if (plaintext.length % this.segmentSize != 0) {
          throw new Error("invalid plaintext size (must be segmentSize bytes)");
        }
        var encrypted = coerceArray(plaintext, true);
        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
          xorSegment = this._aes.encrypt(this._shiftRegister);
          for (var j = 0; j < this.segmentSize; j++) {
            encrypted[i + j] ^= xorSegment[j];
          }
          copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
          copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }
        return encrypted;
      };
      ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length % this.segmentSize != 0) {
          throw new Error("invalid ciphertext size (must be segmentSize bytes)");
        }
        var plaintext = coerceArray(ciphertext, true);
        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
          xorSegment = this._aes.encrypt(this._shiftRegister);
          for (var j = 0; j < this.segmentSize; j++) {
            plaintext[i + j] ^= xorSegment[j];
          }
          copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
          copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }
        return plaintext;
      };
      var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
          throw Error("AES must be instanitated with `new`");
        }
        this.description = "Output Feedback";
        this.name = "ofb";
        if (!iv) {
          iv = createArray(16);
        } else if (iv.length != 16) {
          throw new Error("invalid initialation vector size (must be 16 bytes)");
        }
        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;
        this._aes = new AES(key);
      };
      ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);
        for (var i = 0; i < encrypted.length; i++) {
          if (this._lastPrecipherIndex === 16) {
            this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
            this._lastPrecipherIndex = 0;
          }
          encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }
        return encrypted;
      };
      ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;
      var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
          throw Error("Counter must be instanitated with `new`");
        }
        if (initialValue !== 0 && !initialValue) {
          initialValue = 1;
        }
        if (typeof initialValue === "number") {
          this._counter = createArray(16);
          this.setValue(initialValue);
        } else {
          this.setBytes(initialValue);
        }
      };
      Counter.prototype.setValue = function(value) {
        if (typeof value !== "number" || parseInt(value) != value) {
          throw new Error("invalid counter value (must be an integer)");
        }
        for (var index = 15; index >= 0; --index) {
          this._counter[index] = value % 256;
          value = value >> 8;
        }
      };
      Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);
        if (bytes.length != 16) {
          throw new Error("invalid counter bytes size (must be 16 bytes)");
        }
        this._counter = bytes;
      };
      Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
          if (this._counter[i] === 255) {
            this._counter[i] = 0;
          } else {
            this._counter[i]++;
            break;
          }
        }
      };
      var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
          throw Error("AES must be instanitated with `new`");
        }
        this.description = "Counter";
        this.name = "ctr";
        if (!(counter instanceof Counter)) {
          counter = new Counter(counter);
        }
        this._counter = counter;
        this._remainingCounter = null;
        this._remainingCounterIndex = 16;
        this._aes = new AES(key);
      };
      ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);
        for (var i = 0; i < encrypted.length; i++) {
          if (this._remainingCounterIndex === 16) {
            this._remainingCounter = this._aes.encrypt(this._counter._counter);
            this._remainingCounterIndex = 0;
            this._counter.increment();
          }
          encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }
        return encrypted;
      };
      ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;
      function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - data.length % 16;
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
          result[i] = padder;
        }
        return result;
      }
      function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) {
          throw new Error("PKCS#7 invalid length");
        }
        var padder = data[data.length - 1];
        if (padder > 16) {
          throw new Error("PKCS#7 padding byte out of range");
        }
        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
          if (data[length + i] !== padder) {
            throw new Error("PKCS#7 invalid padding byte");
          }
        }
        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
      }
      var aesjs = {
        AES,
        Counter,
        ModeOfOperation: {
          ecb: ModeOfOperationECB,
          cbc: ModeOfOperationCBC,
          cfb: ModeOfOperationCFB,
          ofb: ModeOfOperationOFB,
          ctr: ModeOfOperationCTR
        },
        utils: {
          hex: convertHex,
          utf8: convertUtf8
        },
        padding: {
          pkcs7: {
            pad: pkcs7pad,
            strip: pkcs7strip
          }
        },
        _arrayTest: {
          coerceArray,
          createArray,
          copyArray
        }
      };
      if (typeof exports !== "undefined") {
        module.exports = aesjs;
      } else if (typeof define === "function" && define.amd) {
        define(aesjs);
      } else {
        if (root.aesjs) {
          aesjs._aesjs = root.aesjs;
        }
        root.aesjs = aesjs;
      }
    })(exports);
  }
});

// node_modules/@ethersproject/json-wallets/lib/_version.js
var require_version7 = __commonJS({
  "node_modules/@ethersproject/json-wallets/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "json-wallets/5.7.0";
  }
});

// node_modules/@ethersproject/json-wallets/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/@ethersproject/json-wallets/lib/utils.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uuidV4 = exports.searchPath = exports.getPassword = exports.zpad = exports.looseArrayify = void 0;
    var bytes_1 = require_lib2();
    var strings_1 = require_lib11();
    function looseArrayify(hexString) {
      if (typeof hexString === "string" && hexString.substring(0, 2) !== "0x") {
        hexString = "0x" + hexString;
      }
      return (0, bytes_1.arrayify)(hexString);
    }
    exports.looseArrayify = looseArrayify;
    function zpad(value, length) {
      value = String(value);
      while (value.length < length) {
        value = "0" + value;
      }
      return value;
    }
    exports.zpad = zpad;
    function getPassword(password) {
      if (typeof password === "string") {
        return (0, strings_1.toUtf8Bytes)(password, strings_1.UnicodeNormalizationForm.NFKC);
      }
      return (0, bytes_1.arrayify)(password);
    }
    exports.getPassword = getPassword;
    function searchPath(object, path) {
      var currentChild = object;
      var comps = path.toLowerCase().split("/");
      for (var i = 0; i < comps.length; i++) {
        var matchingChild = null;
        for (var key in currentChild) {
          if (key.toLowerCase() === comps[i]) {
            matchingChild = currentChild[key];
            break;
          }
        }
        if (matchingChild === null) {
          return null;
        }
        currentChild = matchingChild;
      }
      return currentChild;
    }
    exports.searchPath = searchPath;
    function uuidV4(randomBytes) {
      var bytes = (0, bytes_1.arrayify)(randomBytes);
      bytes[6] = bytes[6] & 15 | 64;
      bytes[8] = bytes[8] & 63 | 128;
      var value = (0, bytes_1.hexlify)(bytes);
      return [
        value.substring(2, 10),
        value.substring(10, 14),
        value.substring(14, 18),
        value.substring(18, 22),
        value.substring(22, 34)
      ].join("-");
    }
    exports.uuidV4 = uuidV4;
  }
});

// node_modules/@ethersproject/json-wallets/lib/crowdsale.js
var require_crowdsale = __commonJS({
  "node_modules/@ethersproject/json-wallets/lib/crowdsale.js"(exports) {
    "use strict";
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decrypt = exports.CrowdsaleAccount = void 0;
    var aes_js_1 = __importDefault(require_aes_js());
    var address_1 = require_lib6();
    var bytes_1 = require_lib2();
    var keccak256_1 = require_lib4();
    var pbkdf2_1 = require_lib20();
    var strings_1 = require_lib11();
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version7();
    var logger = new logger_1.Logger(_version_1.version);
    var utils_1 = require_utils2();
    var CrowdsaleAccount = (
      /** @class */
      function(_super) {
        __extends(CrowdsaleAccount2, _super);
        function CrowdsaleAccount2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        CrowdsaleAccount2.prototype.isCrowdsaleAccount = function(value) {
          return !!(value && value._isCrowdsaleAccount);
        };
        return CrowdsaleAccount2;
      }(properties_1.Description)
    );
    exports.CrowdsaleAccount = CrowdsaleAccount;
    function decrypt(json, password) {
      var data = JSON.parse(json);
      password = (0, utils_1.getPassword)(password);
      var ethaddr = (0, address_1.getAddress)((0, utils_1.searchPath)(data, "ethaddr"));
      var encseed = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "encseed"));
      if (!encseed || encseed.length % 16 !== 0) {
        logger.throwArgumentError("invalid encseed", "json", json);
      }
      var key = (0, bytes_1.arrayify)((0, pbkdf2_1.pbkdf2)(password, password, 2e3, 32, "sha256")).slice(0, 16);
      var iv = encseed.slice(0, 16);
      var encryptedSeed = encseed.slice(16);
      var aesCbc = new aes_js_1.default.ModeOfOperation.cbc(key, iv);
      var seed = aes_js_1.default.padding.pkcs7.strip((0, bytes_1.arrayify)(aesCbc.decrypt(encryptedSeed)));
      var seedHex = "";
      for (var i = 0; i < seed.length; i++) {
        seedHex += String.fromCharCode(seed[i]);
      }
      var seedHexBytes = (0, strings_1.toUtf8Bytes)(seedHex);
      var privateKey = (0, keccak256_1.keccak256)(seedHexBytes);
      return new CrowdsaleAccount({
        _isCrowdsaleAccount: true,
        address: ethaddr,
        privateKey
      });
    }
    exports.decrypt = decrypt;
  }
});

// node_modules/@ethersproject/json-wallets/lib/inspect.js
var require_inspect = __commonJS({
  "node_modules/@ethersproject/json-wallets/lib/inspect.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getJsonWalletAddress = exports.isKeystoreWallet = exports.isCrowdsaleWallet = void 0;
    var address_1 = require_lib6();
    function isCrowdsaleWallet(json) {
      var data = null;
      try {
        data = JSON.parse(json);
      } catch (error) {
        return false;
      }
      return data.encseed && data.ethaddr;
    }
    exports.isCrowdsaleWallet = isCrowdsaleWallet;
    function isKeystoreWallet(json) {
      var data = null;
      try {
        data = JSON.parse(json);
      } catch (error) {
        return false;
      }
      if (!data.version || parseInt(data.version) !== data.version || parseInt(data.version) !== 3) {
        return false;
      }
      return true;
    }
    exports.isKeystoreWallet = isKeystoreWallet;
    function getJsonWalletAddress(json) {
      if (isCrowdsaleWallet(json)) {
        try {
          return (0, address_1.getAddress)(JSON.parse(json).ethaddr);
        } catch (error) {
          return null;
        }
      }
      if (isKeystoreWallet(json)) {
        try {
          return (0, address_1.getAddress)(JSON.parse(json).address);
        } catch (error) {
          return null;
        }
      }
      return null;
    }
    exports.getJsonWalletAddress = getJsonWalletAddress;
  }
});

// node_modules/@ethersproject/json-wallets/node_modules/scrypt-js/scrypt.js
var require_scrypt = __commonJS({
  "node_modules/@ethersproject/json-wallets/node_modules/scrypt-js/scrypt.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    (function(root) {
      const MAX_VALUE = 2147483647;
      function SHA256(m) {
        const K = new Uint32Array([
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ]);
        let h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762;
        let h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225;
        const w = new Uint32Array(64);
        function blocks(p2) {
          let off = 0, len = p2.length;
          while (len >= 64) {
            let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7, u, i2, j, t1, t2;
            for (i2 = 0; i2 < 16; i2++) {
              j = off + i2 * 4;
              w[i2] = (p2[j] & 255) << 24 | (p2[j + 1] & 255) << 16 | (p2[j + 2] & 255) << 8 | p2[j + 3] & 255;
            }
            for (i2 = 16; i2 < 64; i2++) {
              u = w[i2 - 2];
              t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
              u = w[i2 - 15];
              t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
              w[i2] = (t1 + w[i2 - 7] | 0) + (t2 + w[i2 - 16] | 0) | 0;
            }
            for (i2 = 0; i2 < 64; i2++) {
              t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i2] + w[i2] | 0) | 0) | 0;
              t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
              h = g;
              g = f;
              f = e;
              e = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            }
            h0 = h0 + a | 0;
            h1 = h1 + b | 0;
            h2 = h2 + c | 0;
            h3 = h3 + d | 0;
            h4 = h4 + e | 0;
            h5 = h5 + f | 0;
            h6 = h6 + g | 0;
            h7 = h7 + h | 0;
            off += 64;
            len -= 64;
          }
        }
        blocks(m);
        let i, bytesLeft = m.length % 64, bitLenHi = m.length / 536870912 | 0, bitLenLo = m.length << 3, numZeros = bytesLeft < 56 ? 56 : 120, p = m.slice(m.length - bytesLeft, m.length);
        p.push(128);
        for (i = bytesLeft + 1; i < numZeros; i++) {
          p.push(0);
        }
        p.push(bitLenHi >>> 24 & 255);
        p.push(bitLenHi >>> 16 & 255);
        p.push(bitLenHi >>> 8 & 255);
        p.push(bitLenHi >>> 0 & 255);
        p.push(bitLenLo >>> 24 & 255);
        p.push(bitLenLo >>> 16 & 255);
        p.push(bitLenLo >>> 8 & 255);
        p.push(bitLenLo >>> 0 & 255);
        blocks(p);
        return [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 >>> 0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 >>> 0 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 >>> 0 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 >>> 0 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 >>> 0 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 >>> 0 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 >>> 0 & 255,
          h7 >>> 24 & 255,
          h7 >>> 16 & 255,
          h7 >>> 8 & 255,
          h7 >>> 0 & 255
        ];
      }
      function PBKDF2_HMAC_SHA256_OneIter(password, salt, dkLen) {
        password = password.length <= 64 ? password : SHA256(password);
        const innerLen = 64 + salt.length + 4;
        const inner = new Array(innerLen);
        const outerKey = new Array(64);
        let i;
        let dk = [];
        for (i = 0; i < 64; i++) {
          inner[i] = 54;
        }
        for (i = 0; i < password.length; i++) {
          inner[i] ^= password[i];
        }
        for (i = 0; i < salt.length; i++) {
          inner[64 + i] = salt[i];
        }
        for (i = innerLen - 4; i < innerLen; i++) {
          inner[i] = 0;
        }
        for (i = 0; i < 64; i++)
          outerKey[i] = 92;
        for (i = 0; i < password.length; i++)
          outerKey[i] ^= password[i];
        function incrementCounter() {
          for (let i2 = innerLen - 1; i2 >= innerLen - 4; i2--) {
            inner[i2]++;
            if (inner[i2] <= 255)
              return;
            inner[i2] = 0;
          }
        }
        while (dkLen >= 32) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
          dkLen -= 32;
        }
        if (dkLen > 0) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
        }
        return dk;
      }
      function blockmix_salsa8(BY, Yi, r, x, _X) {
        let i;
        arraycopy(BY, (2 * r - 1) * 16, _X, 0, 16);
        for (i = 0; i < 2 * r; i++) {
          blockxor(BY, i * 16, _X, 16);
          salsa20_8(_X, x);
          arraycopy(_X, 0, BY, Yi + i * 16, 16);
        }
        for (i = 0; i < r; i++) {
          arraycopy(BY, Yi + i * 2 * 16, BY, i * 16, 16);
        }
        for (i = 0; i < r; i++) {
          arraycopy(BY, Yi + (i * 2 + 1) * 16, BY, (i + r) * 16, 16);
        }
      }
      function R(a, b) {
        return a << b | a >>> 32 - b;
      }
      function salsa20_8(B, x) {
        arraycopy(B, 0, x, 0, 16);
        for (let i = 8; i > 0; i -= 2) {
          x[4] ^= R(x[0] + x[12], 7);
          x[8] ^= R(x[4] + x[0], 9);
          x[12] ^= R(x[8] + x[4], 13);
          x[0] ^= R(x[12] + x[8], 18);
          x[9] ^= R(x[5] + x[1], 7);
          x[13] ^= R(x[9] + x[5], 9);
          x[1] ^= R(x[13] + x[9], 13);
          x[5] ^= R(x[1] + x[13], 18);
          x[14] ^= R(x[10] + x[6], 7);
          x[2] ^= R(x[14] + x[10], 9);
          x[6] ^= R(x[2] + x[14], 13);
          x[10] ^= R(x[6] + x[2], 18);
          x[3] ^= R(x[15] + x[11], 7);
          x[7] ^= R(x[3] + x[15], 9);
          x[11] ^= R(x[7] + x[3], 13);
          x[15] ^= R(x[11] + x[7], 18);
          x[1] ^= R(x[0] + x[3], 7);
          x[2] ^= R(x[1] + x[0], 9);
          x[3] ^= R(x[2] + x[1], 13);
          x[0] ^= R(x[3] + x[2], 18);
          x[6] ^= R(x[5] + x[4], 7);
          x[7] ^= R(x[6] + x[5], 9);
          x[4] ^= R(x[7] + x[6], 13);
          x[5] ^= R(x[4] + x[7], 18);
          x[11] ^= R(x[10] + x[9], 7);
          x[8] ^= R(x[11] + x[10], 9);
          x[9] ^= R(x[8] + x[11], 13);
          x[10] ^= R(x[9] + x[8], 18);
          x[12] ^= R(x[15] + x[14], 7);
          x[13] ^= R(x[12] + x[15], 9);
          x[14] ^= R(x[13] + x[12], 13);
          x[15] ^= R(x[14] + x[13], 18);
        }
        for (let i = 0; i < 16; ++i) {
          B[i] += x[i];
        }
      }
      function blockxor(S, Si, D, len) {
        for (let i = 0; i < len; i++) {
          D[i] ^= S[Si + i];
        }
      }
      function arraycopy(src, srcPos, dest, destPos, length) {
        while (length--) {
          dest[destPos++] = src[srcPos++];
        }
      }
      function checkBufferish(o) {
        if (!o || typeof o.length !== "number") {
          return false;
        }
        for (let i = 0; i < o.length; i++) {
          const v = o[i];
          if (typeof v !== "number" || v % 1 || v < 0 || v >= 256) {
            return false;
          }
        }
        return true;
      }
      function ensureInteger(value, name) {
        if (typeof value !== "number" || value % 1) {
          throw new Error("invalid " + name);
        }
        return value;
      }
      function _scrypt(password, salt, N, r, p, dkLen, callback) {
        N = ensureInteger(N, "N");
        r = ensureInteger(r, "r");
        p = ensureInteger(p, "p");
        dkLen = ensureInteger(dkLen, "dkLen");
        if (N === 0 || (N & N - 1) !== 0) {
          throw new Error("N must be power of 2");
        }
        if (N > MAX_VALUE / 128 / r) {
          throw new Error("N too large");
        }
        if (r > MAX_VALUE / 128 / p) {
          throw new Error("r too large");
        }
        if (!checkBufferish(password)) {
          throw new Error("password must be an array or buffer");
        }
        password = Array.prototype.slice.call(password);
        if (!checkBufferish(salt)) {
          throw new Error("salt must be an array or buffer");
        }
        salt = Array.prototype.slice.call(salt);
        let b = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
        const B = new Uint32Array(p * 32 * r);
        for (let i = 0; i < B.length; i++) {
          const j = i * 4;
          B[i] = (b[j + 3] & 255) << 24 | (b[j + 2] & 255) << 16 | (b[j + 1] & 255) << 8 | (b[j + 0] & 255) << 0;
        }
        const XY = new Uint32Array(64 * r);
        const V = new Uint32Array(32 * r * N);
        const Yi = 32 * r;
        const x = new Uint32Array(16);
        const _X = new Uint32Array(16);
        const totalOps = p * N * 2;
        let currentOp = 0;
        let lastPercent10 = null;
        let stop = false;
        let state = 0;
        let i0 = 0, i1;
        let Bi;
        const limit = callback ? parseInt(1e3 / r) : 4294967295;
        const nextTick = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
        const incrementalSMix = function() {
          if (stop) {
            return callback(new Error("cancelled"), currentOp / totalOps);
          }
          let steps;
          switch (state) {
            case 0:
              Bi = i0 * 32 * r;
              arraycopy(B, Bi, XY, 0, Yi);
              state = 1;
              i1 = 0;
            case 1:
              steps = N - i1;
              if (steps > limit) {
                steps = limit;
              }
              for (let i = 0; i < steps; i++) {
                arraycopy(XY, 0, V, (i1 + i) * Yi, Yi);
                blockmix_salsa8(XY, Yi, r, x, _X);
              }
              i1 += steps;
              currentOp += steps;
              if (callback) {
                const percent10 = parseInt(1e3 * currentOp / totalOps);
                if (percent10 !== lastPercent10) {
                  stop = callback(null, currentOp / totalOps);
                  if (stop) {
                    break;
                  }
                  lastPercent10 = percent10;
                }
              }
              if (i1 < N) {
                break;
              }
              i1 = 0;
              state = 2;
            case 2:
              steps = N - i1;
              if (steps > limit) {
                steps = limit;
              }
              for (let i = 0; i < steps; i++) {
                const offset = (2 * r - 1) * 16;
                const j = XY[offset] & N - 1;
                blockxor(V, j * Yi, XY, Yi);
                blockmix_salsa8(XY, Yi, r, x, _X);
              }
              i1 += steps;
              currentOp += steps;
              if (callback) {
                const percent10 = parseInt(1e3 * currentOp / totalOps);
                if (percent10 !== lastPercent10) {
                  stop = callback(null, currentOp / totalOps);
                  if (stop) {
                    break;
                  }
                  lastPercent10 = percent10;
                }
              }
              if (i1 < N) {
                break;
              }
              arraycopy(XY, 0, B, Bi, Yi);
              i0++;
              if (i0 < p) {
                state = 0;
                break;
              }
              b = [];
              for (let i = 0; i < B.length; i++) {
                b.push(B[i] >> 0 & 255);
                b.push(B[i] >> 8 & 255);
                b.push(B[i] >> 16 & 255);
                b.push(B[i] >> 24 & 255);
              }
              const derivedKey = PBKDF2_HMAC_SHA256_OneIter(password, b, dkLen);
              if (callback) {
                callback(null, 1, derivedKey);
              }
              return derivedKey;
          }
          if (callback) {
            nextTick(incrementalSMix);
          }
        };
        if (!callback) {
          while (true) {
            const derivedKey = incrementalSMix();
            if (derivedKey != void 0) {
              return derivedKey;
            }
          }
        }
        incrementalSMix();
      }
      const lib = {
        scrypt: function(password, salt, N, r, p, dkLen, progressCallback) {
          return new Promise(function(resolve, reject) {
            let lastProgress = 0;
            if (progressCallback) {
              progressCallback(0);
            }
            _scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
              if (error) {
                reject(error);
              } else if (key) {
                if (progressCallback && lastProgress !== 1) {
                  progressCallback(1);
                }
                resolve(new Uint8Array(key));
              } else if (progressCallback && progress !== lastProgress) {
                lastProgress = progress;
                return progressCallback(progress);
              }
            });
          });
        },
        syncScrypt: function(password, salt, N, r, p, dkLen) {
          return new Uint8Array(_scrypt(password, salt, N, r, p, dkLen));
        }
      };
      if (typeof exports !== "undefined") {
        module.exports = lib;
      } else if (typeof define === "function" && define.amd) {
        define(lib);
      } else if (root) {
        if (root.scrypt) {
          root._scrypt = root.scrypt;
        }
        root.scrypt = lib;
      }
    })(exports);
  }
});

// node_modules/@ethersproject/json-wallets/lib/keystore.js
var require_keystore = __commonJS({
  "node_modules/@ethersproject/json-wallets/lib/keystore.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encrypt = exports.decrypt = exports.decryptSync = exports.KeystoreAccount = void 0;
    var aes_js_1 = __importDefault(require_aes_js());
    var scrypt_js_1 = __importDefault(require_scrypt());
    var address_1 = require_lib6();
    var bytes_1 = require_lib2();
    var hdnode_1 = require_lib23();
    var keccak256_1 = require_lib4();
    var pbkdf2_1 = require_lib20();
    var random_1 = require_lib24();
    var properties_1 = require_lib8();
    var transactions_1 = require_lib10();
    var utils_1 = require_utils2();
    var logger_1 = require_lib();
    var _version_1 = require_version7();
    var logger = new logger_1.Logger(_version_1.version);
    function hasMnemonic(value) {
      return value != null && value.mnemonic && value.mnemonic.phrase;
    }
    var KeystoreAccount = (
      /** @class */
      function(_super) {
        __extends(KeystoreAccount2, _super);
        function KeystoreAccount2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        KeystoreAccount2.prototype.isKeystoreAccount = function(value) {
          return !!(value && value._isKeystoreAccount);
        };
        return KeystoreAccount2;
      }(properties_1.Description)
    );
    exports.KeystoreAccount = KeystoreAccount;
    function _decrypt(data, key, ciphertext) {
      var cipher = (0, utils_1.searchPath)(data, "crypto/cipher");
      if (cipher === "aes-128-ctr") {
        var iv = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "crypto/cipherparams/iv"));
        var counter = new aes_js_1.default.Counter(iv);
        var aesCtr = new aes_js_1.default.ModeOfOperation.ctr(key, counter);
        return (0, bytes_1.arrayify)(aesCtr.decrypt(ciphertext));
      }
      return null;
    }
    function _getAccount(data, key) {
      var ciphertext = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "crypto/ciphertext"));
      var computedMAC = (0, bytes_1.hexlify)((0, keccak256_1.keccak256)((0, bytes_1.concat)([key.slice(16, 32), ciphertext]))).substring(2);
      if (computedMAC !== (0, utils_1.searchPath)(data, "crypto/mac").toLowerCase()) {
        throw new Error("invalid password");
      }
      var privateKey = _decrypt(data, key.slice(0, 16), ciphertext);
      if (!privateKey) {
        logger.throwError("unsupported cipher", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "decrypt"
        });
      }
      var mnemonicKey = key.slice(32, 64);
      var address = (0, transactions_1.computeAddress)(privateKey);
      if (data.address) {
        var check = data.address.toLowerCase();
        if (check.substring(0, 2) !== "0x") {
          check = "0x" + check;
        }
        if ((0, address_1.getAddress)(check) !== address) {
          throw new Error("address mismatch");
        }
      }
      var account = {
        _isKeystoreAccount: true,
        address,
        privateKey: (0, bytes_1.hexlify)(privateKey)
      };
      if ((0, utils_1.searchPath)(data, "x-ethers/version") === "0.1") {
        var mnemonicCiphertext = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "x-ethers/mnemonicCiphertext"));
        var mnemonicIv = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "x-ethers/mnemonicCounter"));
        var mnemonicCounter = new aes_js_1.default.Counter(mnemonicIv);
        var mnemonicAesCtr = new aes_js_1.default.ModeOfOperation.ctr(mnemonicKey, mnemonicCounter);
        var path = (0, utils_1.searchPath)(data, "x-ethers/path") || hdnode_1.defaultPath;
        var locale = (0, utils_1.searchPath)(data, "x-ethers/locale") || "en";
        var entropy = (0, bytes_1.arrayify)(mnemonicAesCtr.decrypt(mnemonicCiphertext));
        try {
          var mnemonic = (0, hdnode_1.entropyToMnemonic)(entropy, locale);
          var node = hdnode_1.HDNode.fromMnemonic(mnemonic, null, locale).derivePath(path);
          if (node.privateKey != account.privateKey) {
            throw new Error("mnemonic mismatch");
          }
          account.mnemonic = node.mnemonic;
        } catch (error) {
          if (error.code !== logger_1.Logger.errors.INVALID_ARGUMENT || error.argument !== "wordlist") {
            throw error;
          }
        }
      }
      return new KeystoreAccount(account);
    }
    function pbkdf2Sync(passwordBytes, salt, count, dkLen, prfFunc) {
      return (0, bytes_1.arrayify)((0, pbkdf2_1.pbkdf2)(passwordBytes, salt, count, dkLen, prfFunc));
    }
    function pbkdf2(passwordBytes, salt, count, dkLen, prfFunc) {
      return Promise.resolve(pbkdf2Sync(passwordBytes, salt, count, dkLen, prfFunc));
    }
    function _computeKdfKey(data, password, pbkdf2Func, scryptFunc, progressCallback) {
      var passwordBytes = (0, utils_1.getPassword)(password);
      var kdf = (0, utils_1.searchPath)(data, "crypto/kdf");
      if (kdf && typeof kdf === "string") {
        var throwError = function(name, value) {
          return logger.throwArgumentError("invalid key-derivation function parameters", name, value);
        };
        if (kdf.toLowerCase() === "scrypt") {
          var salt = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "crypto/kdfparams/salt"));
          var N = parseInt((0, utils_1.searchPath)(data, "crypto/kdfparams/n"));
          var r = parseInt((0, utils_1.searchPath)(data, "crypto/kdfparams/r"));
          var p = parseInt((0, utils_1.searchPath)(data, "crypto/kdfparams/p"));
          if (!N || !r || !p) {
            throwError("kdf", kdf);
          }
          if ((N & N - 1) !== 0) {
            throwError("N", N);
          }
          var dkLen = parseInt((0, utils_1.searchPath)(data, "crypto/kdfparams/dklen"));
          if (dkLen !== 32) {
            throwError("dklen", dkLen);
          }
          return scryptFunc(passwordBytes, salt, N, r, p, 64, progressCallback);
        } else if (kdf.toLowerCase() === "pbkdf2") {
          var salt = (0, utils_1.looseArrayify)((0, utils_1.searchPath)(data, "crypto/kdfparams/salt"));
          var prfFunc = null;
          var prf = (0, utils_1.searchPath)(data, "crypto/kdfparams/prf");
          if (prf === "hmac-sha256") {
            prfFunc = "sha256";
          } else if (prf === "hmac-sha512") {
            prfFunc = "sha512";
          } else {
            throwError("prf", prf);
          }
          var count = parseInt((0, utils_1.searchPath)(data, "crypto/kdfparams/c"));
          var dkLen = parseInt((0, utils_1.searchPath)(data, "crypto/kdfparams/dklen"));
          if (dkLen !== 32) {
            throwError("dklen", dkLen);
          }
          return pbkdf2Func(passwordBytes, salt, count, dkLen, prfFunc);
        }
      }
      return logger.throwArgumentError("unsupported key-derivation function", "kdf", kdf);
    }
    function decryptSync(json, password) {
      var data = JSON.parse(json);
      var key = _computeKdfKey(data, password, pbkdf2Sync, scrypt_js_1.default.syncScrypt);
      return _getAccount(data, key);
    }
    exports.decryptSync = decryptSync;
    function decrypt(json, password, progressCallback) {
      return __awaiter(this, void 0, void 0, function() {
        var data, key;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              data = JSON.parse(json);
              return [4, _computeKdfKey(data, password, pbkdf2, scrypt_js_1.default.scrypt, progressCallback)];
            case 1:
              key = _a.sent();
              return [2, _getAccount(data, key)];
          }
        });
      });
    }
    exports.decrypt = decrypt;
    function encrypt(account, password, options, progressCallback) {
      try {
        if ((0, address_1.getAddress)(account.address) !== (0, transactions_1.computeAddress)(account.privateKey)) {
          throw new Error("address/privateKey mismatch");
        }
        if (hasMnemonic(account)) {
          var mnemonic = account.mnemonic;
          var node = hdnode_1.HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path || hdnode_1.defaultPath);
          if (node.privateKey != account.privateKey) {
            throw new Error("mnemonic mismatch");
          }
        }
      } catch (e) {
        return Promise.reject(e);
      }
      if (typeof options === "function" && !progressCallback) {
        progressCallback = options;
        options = {};
      }
      if (!options) {
        options = {};
      }
      var privateKey = (0, bytes_1.arrayify)(account.privateKey);
      var passwordBytes = (0, utils_1.getPassword)(password);
      var entropy = null;
      var path = null;
      var locale = null;
      if (hasMnemonic(account)) {
        var srcMnemonic = account.mnemonic;
        entropy = (0, bytes_1.arrayify)((0, hdnode_1.mnemonicToEntropy)(srcMnemonic.phrase, srcMnemonic.locale || "en"));
        path = srcMnemonic.path || hdnode_1.defaultPath;
        locale = srcMnemonic.locale || "en";
      }
      var client = options.client;
      if (!client) {
        client = "ethers.js";
      }
      var salt = null;
      if (options.salt) {
        salt = (0, bytes_1.arrayify)(options.salt);
      } else {
        salt = (0, random_1.randomBytes)(32);
        ;
      }
      var iv = null;
      if (options.iv) {
        iv = (0, bytes_1.arrayify)(options.iv);
        if (iv.length !== 16) {
          throw new Error("invalid iv");
        }
      } else {
        iv = (0, random_1.randomBytes)(16);
      }
      var uuidRandom = null;
      if (options.uuid) {
        uuidRandom = (0, bytes_1.arrayify)(options.uuid);
        if (uuidRandom.length !== 16) {
          throw new Error("invalid uuid");
        }
      } else {
        uuidRandom = (0, random_1.randomBytes)(16);
      }
      var N = 1 << 17, r = 8, p = 1;
      if (options.scrypt) {
        if (options.scrypt.N) {
          N = options.scrypt.N;
        }
        if (options.scrypt.r) {
          r = options.scrypt.r;
        }
        if (options.scrypt.p) {
          p = options.scrypt.p;
        }
      }
      return scrypt_js_1.default.scrypt(passwordBytes, salt, N, r, p, 64, progressCallback).then(function(key) {
        key = (0, bytes_1.arrayify)(key);
        var derivedKey = key.slice(0, 16);
        var macPrefix = key.slice(16, 32);
        var mnemonicKey = key.slice(32, 64);
        var counter = new aes_js_1.default.Counter(iv);
        var aesCtr = new aes_js_1.default.ModeOfOperation.ctr(derivedKey, counter);
        var ciphertext = (0, bytes_1.arrayify)(aesCtr.encrypt(privateKey));
        var mac = (0, keccak256_1.keccak256)((0, bytes_1.concat)([macPrefix, ciphertext]));
        var data = {
          address: account.address.substring(2).toLowerCase(),
          id: (0, utils_1.uuidV4)(uuidRandom),
          version: 3,
          crypto: {
            cipher: "aes-128-ctr",
            cipherparams: {
              iv: (0, bytes_1.hexlify)(iv).substring(2)
            },
            ciphertext: (0, bytes_1.hexlify)(ciphertext).substring(2),
            kdf: "scrypt",
            kdfparams: {
              salt: (0, bytes_1.hexlify)(salt).substring(2),
              n: N,
              dklen: 32,
              p,
              r
            },
            mac: mac.substring(2)
          }
        };
        if (entropy) {
          var mnemonicIv = (0, random_1.randomBytes)(16);
          var mnemonicCounter = new aes_js_1.default.Counter(mnemonicIv);
          var mnemonicAesCtr = new aes_js_1.default.ModeOfOperation.ctr(mnemonicKey, mnemonicCounter);
          var mnemonicCiphertext = (0, bytes_1.arrayify)(mnemonicAesCtr.encrypt(entropy));
          var now = /* @__PURE__ */ new Date();
          var timestamp = now.getUTCFullYear() + "-" + (0, utils_1.zpad)(now.getUTCMonth() + 1, 2) + "-" + (0, utils_1.zpad)(now.getUTCDate(), 2) + "T" + (0, utils_1.zpad)(now.getUTCHours(), 2) + "-" + (0, utils_1.zpad)(now.getUTCMinutes(), 2) + "-" + (0, utils_1.zpad)(now.getUTCSeconds(), 2) + ".0Z";
          data["x-ethers"] = {
            client,
            gethFilename: "UTC--" + timestamp + "--" + data.address,
            mnemonicCounter: (0, bytes_1.hexlify)(mnemonicIv).substring(2),
            mnemonicCiphertext: (0, bytes_1.hexlify)(mnemonicCiphertext).substring(2),
            path,
            locale,
            version: "0.1"
          };
        }
        return JSON.stringify(data);
      });
    }
    exports.encrypt = encrypt;
  }
});

// node_modules/@ethersproject/json-wallets/lib/index.js
var require_lib25 = __commonJS({
  "node_modules/@ethersproject/json-wallets/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decryptJsonWalletSync = exports.decryptJsonWallet = exports.getJsonWalletAddress = exports.isKeystoreWallet = exports.isCrowdsaleWallet = exports.encryptKeystore = exports.decryptKeystoreSync = exports.decryptKeystore = exports.decryptCrowdsale = void 0;
    var crowdsale_1 = require_crowdsale();
    Object.defineProperty(exports, "decryptCrowdsale", { enumerable: true, get: function() {
      return crowdsale_1.decrypt;
    } });
    var inspect_1 = require_inspect();
    Object.defineProperty(exports, "getJsonWalletAddress", { enumerable: true, get: function() {
      return inspect_1.getJsonWalletAddress;
    } });
    Object.defineProperty(exports, "isCrowdsaleWallet", { enumerable: true, get: function() {
      return inspect_1.isCrowdsaleWallet;
    } });
    Object.defineProperty(exports, "isKeystoreWallet", { enumerable: true, get: function() {
      return inspect_1.isKeystoreWallet;
    } });
    var keystore_1 = require_keystore();
    Object.defineProperty(exports, "decryptKeystore", { enumerable: true, get: function() {
      return keystore_1.decrypt;
    } });
    Object.defineProperty(exports, "decryptKeystoreSync", { enumerable: true, get: function() {
      return keystore_1.decryptSync;
    } });
    Object.defineProperty(exports, "encryptKeystore", { enumerable: true, get: function() {
      return keystore_1.encrypt;
    } });
    function decryptJsonWallet(json, password, progressCallback) {
      if ((0, inspect_1.isCrowdsaleWallet)(json)) {
        if (progressCallback) {
          progressCallback(0);
        }
        var account = (0, crowdsale_1.decrypt)(json, password);
        if (progressCallback) {
          progressCallback(1);
        }
        return Promise.resolve(account);
      }
      if ((0, inspect_1.isKeystoreWallet)(json)) {
        return (0, keystore_1.decrypt)(json, password, progressCallback);
      }
      return Promise.reject(new Error("invalid JSON wallet"));
    }
    exports.decryptJsonWallet = decryptJsonWallet;
    function decryptJsonWalletSync(json, password) {
      if ((0, inspect_1.isCrowdsaleWallet)(json)) {
        return (0, crowdsale_1.decrypt)(json, password);
      }
      if ((0, inspect_1.isKeystoreWallet)(json)) {
        return (0, keystore_1.decryptSync)(json, password);
      }
      throw new Error("invalid JSON wallet");
    }
    exports.decryptJsonWalletSync = decryptJsonWalletSync;
  }
});

// node_modules/@ethersproject/wallet/lib/_version.js
var require_version8 = __commonJS({
  "node_modules/@ethersproject/wallet/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "wallet/5.7.0";
  }
});

// node_modules/@ethersproject/wallet/lib/index.js
var require_lib26 = __commonJS({
  "node_modules/@ethersproject/wallet/lib/index.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyTypedData = exports.verifyMessage = exports.Wallet = void 0;
    var address_1 = require_lib6();
    var abstract_provider_1 = require_lib16();
    var abstract_signer_1 = require_lib17();
    var bytes_1 = require_lib2();
    var hash_1 = require_lib13();
    var hdnode_1 = require_lib23();
    var keccak256_1 = require_lib4();
    var properties_1 = require_lib8();
    var random_1 = require_lib24();
    var signing_key_1 = require_lib9();
    var json_wallets_1 = require_lib25();
    var transactions_1 = require_lib10();
    var logger_1 = require_lib();
    var _version_1 = require_version8();
    var logger = new logger_1.Logger(_version_1.version);
    function isAccount(value) {
      return value != null && (0, bytes_1.isHexString)(value.privateKey, 32) && value.address != null;
    }
    function hasMnemonic(value) {
      var mnemonic = value.mnemonic;
      return mnemonic && mnemonic.phrase;
    }
    var Wallet = (
      /** @class */
      function(_super) {
        __extends(Wallet2, _super);
        function Wallet2(privateKey, provider) {
          var _this = _super.call(this) || this;
          if (isAccount(privateKey)) {
            var signingKey_1 = new signing_key_1.SigningKey(privateKey.privateKey);
            (0, properties_1.defineReadOnly)(_this, "_signingKey", function() {
              return signingKey_1;
            });
            (0, properties_1.defineReadOnly)(_this, "address", (0, transactions_1.computeAddress)(_this.publicKey));
            if (_this.address !== (0, address_1.getAddress)(privateKey.address)) {
              logger.throwArgumentError("privateKey/address mismatch", "privateKey", "[REDACTED]");
            }
            if (hasMnemonic(privateKey)) {
              var srcMnemonic_1 = privateKey.mnemonic;
              (0, properties_1.defineReadOnly)(_this, "_mnemonic", function() {
                return {
                  phrase: srcMnemonic_1.phrase,
                  path: srcMnemonic_1.path || hdnode_1.defaultPath,
                  locale: srcMnemonic_1.locale || "en"
                };
              });
              var mnemonic = _this.mnemonic;
              var node = hdnode_1.HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path);
              if ((0, transactions_1.computeAddress)(node.privateKey) !== _this.address) {
                logger.throwArgumentError("mnemonic/address mismatch", "privateKey", "[REDACTED]");
              }
            } else {
              (0, properties_1.defineReadOnly)(_this, "_mnemonic", function() {
                return null;
              });
            }
          } else {
            if (signing_key_1.SigningKey.isSigningKey(privateKey)) {
              if (privateKey.curve !== "secp256k1") {
                logger.throwArgumentError("unsupported curve; must be secp256k1", "privateKey", "[REDACTED]");
              }
              (0, properties_1.defineReadOnly)(_this, "_signingKey", function() {
                return privateKey;
              });
            } else {
              if (typeof privateKey === "string") {
                if (privateKey.match(/^[0-9a-f]*$/i) && privateKey.length === 64) {
                  privateKey = "0x" + privateKey;
                }
              }
              var signingKey_2 = new signing_key_1.SigningKey(privateKey);
              (0, properties_1.defineReadOnly)(_this, "_signingKey", function() {
                return signingKey_2;
              });
            }
            (0, properties_1.defineReadOnly)(_this, "_mnemonic", function() {
              return null;
            });
            (0, properties_1.defineReadOnly)(_this, "address", (0, transactions_1.computeAddress)(_this.publicKey));
          }
          if (provider && !abstract_provider_1.Provider.isProvider(provider)) {
            logger.throwArgumentError("invalid provider", "provider", provider);
          }
          (0, properties_1.defineReadOnly)(_this, "provider", provider || null);
          return _this;
        }
        Object.defineProperty(Wallet2.prototype, "mnemonic", {
          get: function() {
            return this._mnemonic();
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Wallet2.prototype, "privateKey", {
          get: function() {
            return this._signingKey().privateKey;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Wallet2.prototype, "publicKey", {
          get: function() {
            return this._signingKey().publicKey;
          },
          enumerable: false,
          configurable: true
        });
        Wallet2.prototype.getAddress = function() {
          return Promise.resolve(this.address);
        };
        Wallet2.prototype.connect = function(provider) {
          return new Wallet2(this, provider);
        };
        Wallet2.prototype.signTransaction = function(transaction) {
          var _this = this;
          return (0, properties_1.resolveProperties)(transaction).then(function(tx) {
            if (tx.from != null) {
              if ((0, address_1.getAddress)(tx.from) !== _this.address) {
                logger.throwArgumentError("transaction from address mismatch", "transaction.from", transaction.from);
              }
              delete tx.from;
            }
            var signature = _this._signingKey().signDigest((0, keccak256_1.keccak256)((0, transactions_1.serialize)(tx)));
            return (0, transactions_1.serialize)(tx, signature);
          });
        };
        Wallet2.prototype.signMessage = function(message) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, (0, bytes_1.joinSignature)(this._signingKey().signDigest((0, hash_1.hashMessage)(message)))];
            });
          });
        };
        Wallet2.prototype._signTypedData = function(domain, types, value) {
          return __awaiter(this, void 0, void 0, function() {
            var populated;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, hash_1._TypedDataEncoder.resolveNames(domain, types, value, function(name) {
                    if (_this.provider == null) {
                      logger.throwError("cannot resolve ENS names without a provider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                        operation: "resolveName",
                        value: name
                      });
                    }
                    return _this.provider.resolveName(name);
                  })];
                case 1:
                  populated = _a.sent();
                  return [2, (0, bytes_1.joinSignature)(this._signingKey().signDigest(hash_1._TypedDataEncoder.hash(populated.domain, types, populated.value)))];
              }
            });
          });
        };
        Wallet2.prototype.encrypt = function(password, options, progressCallback) {
          if (typeof options === "function" && !progressCallback) {
            progressCallback = options;
            options = {};
          }
          if (progressCallback && typeof progressCallback !== "function") {
            throw new Error("invalid callback");
          }
          if (!options) {
            options = {};
          }
          return (0, json_wallets_1.encryptKeystore)(this, password, options, progressCallback);
        };
        Wallet2.createRandom = function(options) {
          var entropy = (0, random_1.randomBytes)(16);
          if (!options) {
            options = {};
          }
          if (options.extraEntropy) {
            entropy = (0, bytes_1.arrayify)((0, bytes_1.hexDataSlice)((0, keccak256_1.keccak256)((0, bytes_1.concat)([entropy, options.extraEntropy])), 0, 16));
          }
          var mnemonic = (0, hdnode_1.entropyToMnemonic)(entropy, options.locale);
          return Wallet2.fromMnemonic(mnemonic, options.path, options.locale);
        };
        Wallet2.fromEncryptedJson = function(json, password, progressCallback) {
          return (0, json_wallets_1.decryptJsonWallet)(json, password, progressCallback).then(function(account) {
            return new Wallet2(account);
          });
        };
        Wallet2.fromEncryptedJsonSync = function(json, password) {
          return new Wallet2((0, json_wallets_1.decryptJsonWalletSync)(json, password));
        };
        Wallet2.fromMnemonic = function(mnemonic, path, wordlist) {
          if (!path) {
            path = hdnode_1.defaultPath;
          }
          return new Wallet2(hdnode_1.HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path));
        };
        return Wallet2;
      }(abstract_signer_1.Signer)
    );
    exports.Wallet = Wallet;
    function verifyMessage(message, signature) {
      return (0, transactions_1.recoverAddress)((0, hash_1.hashMessage)(message), signature);
    }
    exports.verifyMessage = verifyMessage;
    function verifyTypedData(domain, types, value, signature) {
      return (0, transactions_1.recoverAddress)(hash_1._TypedDataEncoder.hash(domain, types, value), signature);
    }
    exports.verifyTypedData = verifyTypedData;
  }
});

// node_modules/@ethersproject/networks/lib/_version.js
var require_version9 = __commonJS({
  "node_modules/@ethersproject/networks/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "networks/5.7.1";
  }
});

// node_modules/@ethersproject/networks/lib/index.js
var require_lib27 = __commonJS({
  "node_modules/@ethersproject/networks/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNetwork = void 0;
    var logger_1 = require_lib();
    var _version_1 = require_version9();
    var logger = new logger_1.Logger(_version_1.version);
    function isRenetworkable(value) {
      return value && typeof value.renetwork === "function";
    }
    function ethDefaultProvider(network) {
      var func = function(providers, options) {
        if (options == null) {
          options = {};
        }
        var providerList = [];
        if (providers.InfuraProvider && options.infura !== "-") {
          try {
            providerList.push(new providers.InfuraProvider(network, options.infura));
          } catch (error) {
          }
        }
        if (providers.EtherscanProvider && options.etherscan !== "-") {
          try {
            providerList.push(new providers.EtherscanProvider(network, options.etherscan));
          } catch (error) {
          }
        }
        if (providers.AlchemyProvider && options.alchemy !== "-") {
          try {
            providerList.push(new providers.AlchemyProvider(network, options.alchemy));
          } catch (error) {
          }
        }
        if (providers.PocketProvider && options.pocket !== "-") {
          var skip = ["goerli", "ropsten", "rinkeby", "sepolia"];
          try {
            var provider = new providers.PocketProvider(network, options.pocket);
            if (provider.network && skip.indexOf(provider.network.name) === -1) {
              providerList.push(provider);
            }
          } catch (error) {
          }
        }
        if (providers.CloudflareProvider && options.cloudflare !== "-") {
          try {
            providerList.push(new providers.CloudflareProvider(network));
          } catch (error) {
          }
        }
        if (providers.AnkrProvider && options.ankr !== "-") {
          try {
            var skip = ["ropsten"];
            var provider = new providers.AnkrProvider(network, options.ankr);
            if (provider.network && skip.indexOf(provider.network.name) === -1) {
              providerList.push(provider);
            }
          } catch (error) {
          }
        }
        if (providerList.length === 0) {
          return null;
        }
        if (providers.FallbackProvider) {
          var quorum = 1;
          if (options.quorum != null) {
            quorum = options.quorum;
          } else if (network === "homestead") {
            quorum = 2;
          }
          return new providers.FallbackProvider(providerList, quorum);
        }
        return providerList[0];
      };
      func.renetwork = function(network2) {
        return ethDefaultProvider(network2);
      };
      return func;
    }
    function etcDefaultProvider(url, network) {
      var func = function(providers, options) {
        if (providers.JsonRpcProvider) {
          return new providers.JsonRpcProvider(url, network);
        }
        return null;
      };
      func.renetwork = function(network2) {
        return etcDefaultProvider(url, network2);
      };
      return func;
    }
    var homestead = {
      chainId: 1,
      ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      name: "homestead",
      _defaultProvider: ethDefaultProvider("homestead")
    };
    var ropsten = {
      chainId: 3,
      ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      name: "ropsten",
      _defaultProvider: ethDefaultProvider("ropsten")
    };
    var classicMordor = {
      chainId: 63,
      name: "classicMordor",
      _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/mordor", "classicMordor")
    };
    var networks = {
      unspecified: { chainId: 0, name: "unspecified" },
      homestead,
      mainnet: homestead,
      morden: { chainId: 2, name: "morden" },
      ropsten,
      testnet: ropsten,
      rinkeby: {
        chainId: 4,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "rinkeby",
        _defaultProvider: ethDefaultProvider("rinkeby")
      },
      kovan: {
        chainId: 42,
        name: "kovan",
        _defaultProvider: ethDefaultProvider("kovan")
      },
      goerli: {
        chainId: 5,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "goerli",
        _defaultProvider: ethDefaultProvider("goerli")
      },
      kintsugi: { chainId: 1337702, name: "kintsugi" },
      sepolia: {
        chainId: 11155111,
        name: "sepolia",
        _defaultProvider: ethDefaultProvider("sepolia")
      },
      // ETC (See: #351)
      classic: {
        chainId: 61,
        name: "classic",
        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/etc", "classic")
      },
      classicMorden: { chainId: 62, name: "classicMorden" },
      classicMordor,
      classicTestnet: classicMordor,
      classicKotti: {
        chainId: 6,
        name: "classicKotti",
        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/kotti", "classicKotti")
      },
      xdai: { chainId: 100, name: "xdai" },
      matic: {
        chainId: 137,
        name: "matic",
        _defaultProvider: ethDefaultProvider("matic")
      },
      maticmum: { chainId: 80001, name: "maticmum" },
      optimism: {
        chainId: 10,
        name: "optimism",
        _defaultProvider: ethDefaultProvider("optimism")
      },
      "optimism-kovan": { chainId: 69, name: "optimism-kovan" },
      "optimism-goerli": { chainId: 420, name: "optimism-goerli" },
      arbitrum: { chainId: 42161, name: "arbitrum" },
      "arbitrum-rinkeby": { chainId: 421611, name: "arbitrum-rinkeby" },
      "arbitrum-goerli": { chainId: 421613, name: "arbitrum-goerli" },
      bnb: { chainId: 56, name: "bnb" },
      bnbt: { chainId: 97, name: "bnbt" }
    };
    function getNetwork(network) {
      if (network == null) {
        return null;
      }
      if (typeof network === "number") {
        for (var name_1 in networks) {
          var standard_1 = networks[name_1];
          if (standard_1.chainId === network) {
            return {
              name: standard_1.name,
              chainId: standard_1.chainId,
              ensAddress: standard_1.ensAddress || null,
              _defaultProvider: standard_1._defaultProvider || null
            };
          }
        }
        return {
          chainId: network,
          name: "unknown"
        };
      }
      if (typeof network === "string") {
        var standard_2 = networks[network];
        if (standard_2 == null) {
          return null;
        }
        return {
          name: standard_2.name,
          chainId: standard_2.chainId,
          ensAddress: standard_2.ensAddress,
          _defaultProvider: standard_2._defaultProvider || null
        };
      }
      var standard = networks[network.name];
      if (!standard) {
        if (typeof network.chainId !== "number") {
          logger.throwArgumentError("invalid network chainId", "network", network);
        }
        return network;
      }
      if (network.chainId !== 0 && network.chainId !== standard.chainId) {
        logger.throwArgumentError("network chainId mismatch", "network", network);
      }
      var defaultProvider = network._defaultProvider || null;
      if (defaultProvider == null && standard._defaultProvider) {
        if (isRenetworkable(standard._defaultProvider)) {
          defaultProvider = standard._defaultProvider.renetwork(network);
        } else {
          defaultProvider = standard._defaultProvider;
        }
      }
      return {
        name: network.name,
        chainId: standard.chainId,
        ensAddress: network.ensAddress || standard.ensAddress || null,
        _defaultProvider: defaultProvider
      };
    }
    exports.getNetwork = getNetwork;
  }
});

// node_modules/@ethersproject/web/lib/_version.js
var require_version10 = __commonJS({
  "node_modules/@ethersproject/web/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "web/5.7.1";
  }
});

// node_modules/@ethersproject/web/lib/geturl.js
var require_geturl = __commonJS({
  "node_modules/@ethersproject/web/lib/geturl.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUrl = void 0;
    var http_1 = __importDefault(__require("http"));
    var https_1 = __importDefault(__require("https"));
    var zlib_1 = __require("zlib");
    var url_1 = __require("url");
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version10();
    var logger = new logger_1.Logger(_version_1.version);
    function getResponse(request) {
      return new Promise(function(resolve, reject) {
        request.once("response", function(resp) {
          var response = {
            statusCode: resp.statusCode,
            statusMessage: resp.statusMessage,
            headers: Object.keys(resp.headers).reduce(function(accum, name) {
              var value = resp.headers[name];
              if (Array.isArray(value)) {
                value = value.join(", ");
              }
              accum[name] = value;
              return accum;
            }, {}),
            body: null
          };
          resp.on("data", function(chunk) {
            if (response.body == null) {
              response.body = new Uint8Array(0);
            }
            response.body = (0, bytes_1.concat)([response.body, chunk]);
          });
          resp.on("end", function() {
            if (response.headers["content-encoding"] === "gzip") {
              response.body = (0, bytes_1.arrayify)((0, zlib_1.gunzipSync)(response.body));
            }
            resolve(response);
          });
          resp.on("error", function(error) {
            error.response = response;
            reject(error);
          });
        });
        request.on("error", function(error) {
          reject(error);
        });
      });
    }
    function nonnull(value) {
      if (value == null) {
        return "";
      }
      return value;
    }
    function getUrl(href, options) {
      return __awaiter(this, void 0, void 0, function() {
        var url, request, req, response;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (options == null) {
                options = {};
              }
              url = (0, url_1.parse)(href);
              request = {
                protocol: nonnull(url.protocol),
                hostname: nonnull(url.hostname),
                port: nonnull(url.port),
                path: nonnull(url.pathname) + nonnull(url.search),
                method: options.method || "GET",
                headers: (0, properties_1.shallowCopy)(options.headers || {})
              };
              if (options.allowGzip) {
                request.headers["accept-encoding"] = "gzip";
              }
              req = null;
              switch (nonnull(url.protocol)) {
                case "http:":
                  req = http_1.default.request(request);
                  break;
                case "https:":
                  req = https_1.default.request(request);
                  break;
                default:
                  logger.throwError("unsupported protocol " + url.protocol, logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    protocol: url.protocol,
                    operation: "request"
                  });
              }
              if (options.body) {
                req.write(Buffer.from(options.body));
              }
              req.end();
              return [4, getResponse(req)];
            case 1:
              response = _a.sent();
              return [2, response];
          }
        });
      });
    }
    exports.getUrl = getUrl;
  }
});

// node_modules/@ethersproject/web/lib/index.js
var require_lib28 = __commonJS({
  "node_modules/@ethersproject/web/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.poll = exports.fetchJson = exports._fetchData = void 0;
    var base64_1 = require_lib12();
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var strings_1 = require_lib11();
    var logger_1 = require_lib();
    var _version_1 = require_version10();
    var logger = new logger_1.Logger(_version_1.version);
    var geturl_1 = require_geturl();
    function staller(duration) {
      return new Promise(function(resolve) {
        setTimeout(resolve, duration);
      });
    }
    function bodyify(value, type) {
      if (value == null) {
        return null;
      }
      if (typeof value === "string") {
        return value;
      }
      if ((0, bytes_1.isBytesLike)(value)) {
        if (type && (type.split("/")[0] === "text" || type.split(";")[0].trim() === "application/json")) {
          try {
            return (0, strings_1.toUtf8String)(value);
          } catch (error) {
          }
          ;
        }
        return (0, bytes_1.hexlify)(value);
      }
      return value;
    }
    function unpercent(value) {
      return (0, strings_1.toUtf8Bytes)(value.replace(/%([0-9a-f][0-9a-f])/gi, function(all, code) {
        return String.fromCharCode(parseInt(code, 16));
      }));
    }
    function _fetchData(connection, body, processFunc) {
      var attemptLimit = typeof connection === "object" && connection.throttleLimit != null ? connection.throttleLimit : 12;
      logger.assertArgument(attemptLimit > 0 && attemptLimit % 1 === 0, "invalid connection throttle limit", "connection.throttleLimit", attemptLimit);
      var throttleCallback = typeof connection === "object" ? connection.throttleCallback : null;
      var throttleSlotInterval = typeof connection === "object" && typeof connection.throttleSlotInterval === "number" ? connection.throttleSlotInterval : 100;
      logger.assertArgument(throttleSlotInterval > 0 && throttleSlotInterval % 1 === 0, "invalid connection throttle slot interval", "connection.throttleSlotInterval", throttleSlotInterval);
      var errorPassThrough = typeof connection === "object" ? !!connection.errorPassThrough : false;
      var headers = {};
      var url = null;
      var options = {
        method: "GET"
      };
      var allow304 = false;
      var timeout = 2 * 60 * 1e3;
      if (typeof connection === "string") {
        url = connection;
      } else if (typeof connection === "object") {
        if (connection == null || connection.url == null) {
          logger.throwArgumentError("missing URL", "connection.url", connection);
        }
        url = connection.url;
        if (typeof connection.timeout === "number" && connection.timeout > 0) {
          timeout = connection.timeout;
        }
        if (connection.headers) {
          for (var key in connection.headers) {
            headers[key.toLowerCase()] = { key, value: String(connection.headers[key]) };
            if (["if-none-match", "if-modified-since"].indexOf(key.toLowerCase()) >= 0) {
              allow304 = true;
            }
          }
        }
        options.allowGzip = !!connection.allowGzip;
        if (connection.user != null && connection.password != null) {
          if (url.substring(0, 6) !== "https:" && connection.allowInsecureAuthentication !== true) {
            logger.throwError("basic authentication requires a secure https url", logger_1.Logger.errors.INVALID_ARGUMENT, { argument: "url", url, user: connection.user, password: "[REDACTED]" });
          }
          var authorization = connection.user + ":" + connection.password;
          headers["authorization"] = {
            key: "Authorization",
            value: "Basic " + (0, base64_1.encode)((0, strings_1.toUtf8Bytes)(authorization))
          };
        }
        if (connection.skipFetchSetup != null) {
          options.skipFetchSetup = !!connection.skipFetchSetup;
        }
        if (connection.fetchOptions != null) {
          options.fetchOptions = (0, properties_1.shallowCopy)(connection.fetchOptions);
        }
      }
      var reData = new RegExp("^data:([^;:]*)?(;base64)?,(.*)$", "i");
      var dataMatch = url ? url.match(reData) : null;
      if (dataMatch) {
        try {
          var response = {
            statusCode: 200,
            statusMessage: "OK",
            headers: { "content-type": dataMatch[1] || "text/plain" },
            body: dataMatch[2] ? (0, base64_1.decode)(dataMatch[3]) : unpercent(dataMatch[3])
          };
          var result = response.body;
          if (processFunc) {
            result = processFunc(response.body, response);
          }
          return Promise.resolve(result);
        } catch (error) {
          logger.throwError("processing response error", logger_1.Logger.errors.SERVER_ERROR, {
            body: bodyify(dataMatch[1], dataMatch[2]),
            error,
            requestBody: null,
            requestMethod: "GET",
            url
          });
        }
      }
      if (body) {
        options.method = "POST";
        options.body = body;
        if (headers["content-type"] == null) {
          headers["content-type"] = { key: "Content-Type", value: "application/octet-stream" };
        }
        if (headers["content-length"] == null) {
          headers["content-length"] = { key: "Content-Length", value: String(body.length) };
        }
      }
      var flatHeaders = {};
      Object.keys(headers).forEach(function(key2) {
        var header = headers[key2];
        flatHeaders[header.key] = header.value;
      });
      options.headers = flatHeaders;
      var runningTimeout = function() {
        var timer = null;
        var promise = new Promise(function(resolve, reject) {
          if (timeout) {
            timer = setTimeout(function() {
              if (timer == null) {
                return;
              }
              timer = null;
              reject(logger.makeError("timeout", logger_1.Logger.errors.TIMEOUT, {
                requestBody: bodyify(options.body, flatHeaders["content-type"]),
                requestMethod: options.method,
                timeout,
                url
              }));
            }, timeout);
          }
        });
        var cancel = function() {
          if (timer == null) {
            return;
          }
          clearTimeout(timer);
          timer = null;
        };
        return { promise, cancel };
      }();
      var runningFetch = function() {
        return __awaiter(this, void 0, void 0, function() {
          var attempt, response2, location_1, tryAgain, stall, retryAfter, error_1, body_1, result2, error_2, tryAgain, timeout_1;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                attempt = 0;
                _a.label = 1;
              case 1:
                if (!(attempt < attemptLimit))
                  return [3, 20];
                response2 = null;
                _a.label = 2;
              case 2:
                _a.trys.push([2, 9, , 10]);
                return [4, (0, geturl_1.getUrl)(url, options)];
              case 3:
                response2 = _a.sent();
                if (!(attempt < attemptLimit))
                  return [3, 8];
                if (!(response2.statusCode === 301 || response2.statusCode === 302))
                  return [3, 4];
                location_1 = response2.headers.location || "";
                if (options.method === "GET" && location_1.match(/^https:/)) {
                  url = response2.headers.location;
                  return [3, 19];
                }
                return [3, 8];
              case 4:
                if (!(response2.statusCode === 429))
                  return [3, 8];
                tryAgain = true;
                if (!throttleCallback)
                  return [3, 6];
                return [4, throttleCallback(attempt, url)];
              case 5:
                tryAgain = _a.sent();
                _a.label = 6;
              case 6:
                if (!tryAgain)
                  return [3, 8];
                stall = 0;
                retryAfter = response2.headers["retry-after"];
                if (typeof retryAfter === "string" && retryAfter.match(/^[1-9][0-9]*$/)) {
                  stall = parseInt(retryAfter) * 1e3;
                } else {
                  stall = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                }
                return [4, staller(stall)];
              case 7:
                _a.sent();
                return [3, 19];
              case 8:
                return [3, 10];
              case 9:
                error_1 = _a.sent();
                response2 = error_1.response;
                if (response2 == null) {
                  runningTimeout.cancel();
                  logger.throwError("missing response", logger_1.Logger.errors.SERVER_ERROR, {
                    requestBody: bodyify(options.body, flatHeaders["content-type"]),
                    requestMethod: options.method,
                    serverError: error_1,
                    url
                  });
                }
                return [3, 10];
              case 10:
                body_1 = response2.body;
                if (allow304 && response2.statusCode === 304) {
                  body_1 = null;
                } else if (!errorPassThrough && (response2.statusCode < 200 || response2.statusCode >= 300)) {
                  runningTimeout.cancel();
                  logger.throwError("bad response", logger_1.Logger.errors.SERVER_ERROR, {
                    status: response2.statusCode,
                    headers: response2.headers,
                    body: bodyify(body_1, response2.headers ? response2.headers["content-type"] : null),
                    requestBody: bodyify(options.body, flatHeaders["content-type"]),
                    requestMethod: options.method,
                    url
                  });
                }
                if (!processFunc)
                  return [3, 18];
                _a.label = 11;
              case 11:
                _a.trys.push([11, 13, , 18]);
                return [4, processFunc(body_1, response2)];
              case 12:
                result2 = _a.sent();
                runningTimeout.cancel();
                return [2, result2];
              case 13:
                error_2 = _a.sent();
                if (!(error_2.throttleRetry && attempt < attemptLimit))
                  return [3, 17];
                tryAgain = true;
                if (!throttleCallback)
                  return [3, 15];
                return [4, throttleCallback(attempt, url)];
              case 14:
                tryAgain = _a.sent();
                _a.label = 15;
              case 15:
                if (!tryAgain)
                  return [3, 17];
                timeout_1 = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                return [4, staller(timeout_1)];
              case 16:
                _a.sent();
                return [3, 19];
              case 17:
                runningTimeout.cancel();
                logger.throwError("processing response error", logger_1.Logger.errors.SERVER_ERROR, {
                  body: bodyify(body_1, response2.headers ? response2.headers["content-type"] : null),
                  error: error_2,
                  requestBody: bodyify(options.body, flatHeaders["content-type"]),
                  requestMethod: options.method,
                  url
                });
                return [3, 18];
              case 18:
                runningTimeout.cancel();
                return [2, body_1];
              case 19:
                attempt++;
                return [3, 1];
              case 20:
                return [2, logger.throwError("failed response", logger_1.Logger.errors.SERVER_ERROR, {
                  requestBody: bodyify(options.body, flatHeaders["content-type"]),
                  requestMethod: options.method,
                  url
                })];
            }
          });
        });
      }();
      return Promise.race([runningTimeout.promise, runningFetch]);
    }
    exports._fetchData = _fetchData;
    function fetchJson(connection, json, processFunc) {
      var processJsonFunc = function(value, response) {
        var result = null;
        if (value != null) {
          try {
            result = JSON.parse((0, strings_1.toUtf8String)(value));
          } catch (error) {
            logger.throwError("invalid JSON", logger_1.Logger.errors.SERVER_ERROR, {
              body: value,
              error
            });
          }
        }
        if (processFunc) {
          result = processFunc(result, response);
        }
        return result;
      };
      var body = null;
      if (json != null) {
        body = (0, strings_1.toUtf8Bytes)(json);
        var updated = typeof connection === "string" ? { url: connection } : (0, properties_1.shallowCopy)(connection);
        if (updated.headers) {
          var hasContentType = Object.keys(updated.headers).filter(function(k) {
            return k.toLowerCase() === "content-type";
          }).length !== 0;
          if (!hasContentType) {
            updated.headers = (0, properties_1.shallowCopy)(updated.headers);
            updated.headers["content-type"] = "application/json";
          }
        } else {
          updated.headers = { "content-type": "application/json" };
        }
        connection = updated;
      }
      return _fetchData(connection, body, processJsonFunc);
    }
    exports.fetchJson = fetchJson;
    function poll(func, options) {
      if (!options) {
        options = {};
      }
      options = (0, properties_1.shallowCopy)(options);
      if (options.floor == null) {
        options.floor = 0;
      }
      if (options.ceiling == null) {
        options.ceiling = 1e4;
      }
      if (options.interval == null) {
        options.interval = 250;
      }
      return new Promise(function(resolve, reject) {
        var timer = null;
        var done = false;
        var cancel = function() {
          if (done) {
            return false;
          }
          done = true;
          if (timer) {
            clearTimeout(timer);
          }
          return true;
        };
        if (options.timeout) {
          timer = setTimeout(function() {
            if (cancel()) {
              reject(new Error("timeout"));
            }
          }, options.timeout);
        }
        var retryLimit = options.retryLimit;
        var attempt = 0;
        function check() {
          return func().then(function(result) {
            if (result !== void 0) {
              if (cancel()) {
                resolve(result);
              }
            } else if (options.oncePoll) {
              options.oncePoll.once("poll", check);
            } else if (options.onceBlock) {
              options.onceBlock.once("block", check);
            } else if (!done) {
              attempt++;
              if (attempt > retryLimit) {
                if (cancel()) {
                  reject(new Error("retry limit reached"));
                }
                return;
              }
              var timeout = options.interval * parseInt(String(Math.random() * Math.pow(2, attempt)));
              if (timeout < options.floor) {
                timeout = options.floor;
              }
              if (timeout > options.ceiling) {
                timeout = options.ceiling;
              }
              setTimeout(check, timeout);
            }
            return null;
          }, function(error) {
            if (cancel()) {
              reject(error);
            }
          });
        }
        check();
      });
    }
    exports.poll = poll;
  }
});

// node_modules/bech32/index.js
var require_bech32 = __commonJS({
  "node_modules/bech32/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    var ALPHABET_MAP = {};
    for (z = 0; z < ALPHABET.length; z++) {
      x = ALPHABET.charAt(z);
      if (ALPHABET_MAP[x] !== void 0)
        throw new TypeError(x + " is ambiguous");
      ALPHABET_MAP[x] = z;
    }
    var x;
    var z;
    function polymodStep(pre) {
      var b = pre >> 25;
      return (pre & 33554431) << 5 ^ -(b >> 0 & 1) & 996825010 ^ -(b >> 1 & 1) & 642813549 ^ -(b >> 2 & 1) & 513874426 ^ -(b >> 3 & 1) & 1027748829 ^ -(b >> 4 & 1) & 705979059;
    }
    function prefixChk(prefix) {
      var chk = 1;
      for (var i = 0; i < prefix.length; ++i) {
        var c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
          return "Invalid prefix (" + prefix + ")";
        chk = polymodStep(chk) ^ c >> 5;
      }
      chk = polymodStep(chk);
      for (i = 0; i < prefix.length; ++i) {
        var v = prefix.charCodeAt(i);
        chk = polymodStep(chk) ^ v & 31;
      }
      return chk;
    }
    function encode(prefix, words, LIMIT) {
      LIMIT = LIMIT || 90;
      if (prefix.length + 7 + words.length > LIMIT)
        throw new TypeError("Exceeds length limit");
      prefix = prefix.toLowerCase();
      var chk = prefixChk(prefix);
      if (typeof chk === "string")
        throw new Error(chk);
      var result = prefix + "1";
      for (var i = 0; i < words.length; ++i) {
        var x2 = words[i];
        if (x2 >> 5 !== 0)
          throw new Error("Non 5-bit word");
        chk = polymodStep(chk) ^ x2;
        result += ALPHABET.charAt(x2);
      }
      for (i = 0; i < 6; ++i) {
        chk = polymodStep(chk);
      }
      chk ^= 1;
      for (i = 0; i < 6; ++i) {
        var v = chk >> (5 - i) * 5 & 31;
        result += ALPHABET.charAt(v);
      }
      return result;
    }
    function __decode(str, LIMIT) {
      LIMIT = LIMIT || 90;
      if (str.length < 8)
        return str + " too short";
      if (str.length > LIMIT)
        return "Exceeds length limit";
      var lowered = str.toLowerCase();
      var uppered = str.toUpperCase();
      if (str !== lowered && str !== uppered)
        return "Mixed-case string " + str;
      str = lowered;
      var split = str.lastIndexOf("1");
      if (split === -1)
        return "No separator character for " + str;
      if (split === 0)
        return "Missing prefix for " + str;
      var prefix = str.slice(0, split);
      var wordChars = str.slice(split + 1);
      if (wordChars.length < 6)
        return "Data too short";
      var chk = prefixChk(prefix);
      if (typeof chk === "string")
        return chk;
      var words = [];
      for (var i = 0; i < wordChars.length; ++i) {
        var c = wordChars.charAt(i);
        var v = ALPHABET_MAP[c];
        if (v === void 0)
          return "Unknown character " + c;
        chk = polymodStep(chk) ^ v;
        if (i + 6 >= wordChars.length)
          continue;
        words.push(v);
      }
      if (chk !== 1)
        return "Invalid checksum for " + str;
      return { prefix, words };
    }
    function decodeUnsafe() {
      var res = __decode.apply(null, arguments);
      if (typeof res === "object")
        return res;
    }
    function decode(str) {
      var res = __decode.apply(null, arguments);
      if (typeof res === "object")
        return res;
      throw new Error(res);
    }
    function convert(data, inBits, outBits, pad) {
      var value = 0;
      var bits = 0;
      var maxV = (1 << outBits) - 1;
      var result = [];
      for (var i = 0; i < data.length; ++i) {
        value = value << inBits | data[i];
        bits += inBits;
        while (bits >= outBits) {
          bits -= outBits;
          result.push(value >> bits & maxV);
        }
      }
      if (pad) {
        if (bits > 0) {
          result.push(value << outBits - bits & maxV);
        }
      } else {
        if (bits >= inBits)
          return "Excess padding";
        if (value << outBits - bits & maxV)
          return "Non-zero padding";
      }
      return result;
    }
    function toWordsUnsafe(bytes) {
      var res = convert(bytes, 8, 5, true);
      if (Array.isArray(res))
        return res;
    }
    function toWords(bytes) {
      var res = convert(bytes, 8, 5, true);
      if (Array.isArray(res))
        return res;
      throw new Error(res);
    }
    function fromWordsUnsafe(words) {
      var res = convert(words, 5, 8, false);
      if (Array.isArray(res))
        return res;
    }
    function fromWords(words) {
      var res = convert(words, 5, 8, false);
      if (Array.isArray(res))
        return res;
      throw new Error(res);
    }
    module.exports = {
      decodeUnsafe,
      decode,
      encode,
      toWordsUnsafe,
      toWords,
      fromWordsUnsafe,
      fromWords
    };
  }
});

// node_modules/@ethersproject/providers/lib/_version.js
var require_version11 = __commonJS({
  "node_modules/@ethersproject/providers/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "providers/5.7.2";
  }
});

// node_modules/@ethersproject/providers/lib/formatter.js
var require_formatter = __commonJS({
  "node_modules/@ethersproject/providers/lib/formatter.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showThrottleMessage = exports.isCommunityResource = exports.isCommunityResourcable = exports.Formatter = void 0;
    var address_1 = require_lib6();
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var constants_1 = require_lib7();
    var properties_1 = require_lib8();
    var transactions_1 = require_lib10();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var Formatter = (
      /** @class */
      function() {
        function Formatter2() {
          this.formats = this.getDefaultFormats();
        }
        Formatter2.prototype.getDefaultFormats = function() {
          var _this = this;
          var formats = {};
          var address = this.address.bind(this);
          var bigNumber = this.bigNumber.bind(this);
          var blockTag = this.blockTag.bind(this);
          var data = this.data.bind(this);
          var hash = this.hash.bind(this);
          var hex = this.hex.bind(this);
          var number = this.number.bind(this);
          var type = this.type.bind(this);
          var strictData = function(v) {
            return _this.data(v, true);
          };
          formats.transaction = {
            hash,
            type,
            accessList: Formatter2.allowNull(this.accessList.bind(this), null),
            blockHash: Formatter2.allowNull(hash, null),
            blockNumber: Formatter2.allowNull(number, null),
            transactionIndex: Formatter2.allowNull(number, null),
            confirmations: Formatter2.allowNull(number, null),
            from: address,
            // either (gasPrice) or (maxPriorityFeePerGas + maxFeePerGas)
            // must be set
            gasPrice: Formatter2.allowNull(bigNumber),
            maxPriorityFeePerGas: Formatter2.allowNull(bigNumber),
            maxFeePerGas: Formatter2.allowNull(bigNumber),
            gasLimit: bigNumber,
            to: Formatter2.allowNull(address, null),
            value: bigNumber,
            nonce: number,
            data,
            r: Formatter2.allowNull(this.uint256),
            s: Formatter2.allowNull(this.uint256),
            v: Formatter2.allowNull(number),
            creates: Formatter2.allowNull(address, null),
            raw: Formatter2.allowNull(data)
          };
          formats.transactionRequest = {
            from: Formatter2.allowNull(address),
            nonce: Formatter2.allowNull(number),
            gasLimit: Formatter2.allowNull(bigNumber),
            gasPrice: Formatter2.allowNull(bigNumber),
            maxPriorityFeePerGas: Formatter2.allowNull(bigNumber),
            maxFeePerGas: Formatter2.allowNull(bigNumber),
            to: Formatter2.allowNull(address),
            value: Formatter2.allowNull(bigNumber),
            data: Formatter2.allowNull(strictData),
            type: Formatter2.allowNull(number),
            accessList: Formatter2.allowNull(this.accessList.bind(this), null)
          };
          formats.receiptLog = {
            transactionIndex: number,
            blockNumber: number,
            transactionHash: hash,
            address,
            topics: Formatter2.arrayOf(hash),
            data,
            logIndex: number,
            blockHash: hash
          };
          formats.receipt = {
            to: Formatter2.allowNull(this.address, null),
            from: Formatter2.allowNull(this.address, null),
            contractAddress: Formatter2.allowNull(address, null),
            transactionIndex: number,
            // should be allowNull(hash), but broken-EIP-658 support is handled in receipt
            root: Formatter2.allowNull(hex),
            gasUsed: bigNumber,
            logsBloom: Formatter2.allowNull(data),
            blockHash: hash,
            transactionHash: hash,
            logs: Formatter2.arrayOf(this.receiptLog.bind(this)),
            blockNumber: number,
            confirmations: Formatter2.allowNull(number, null),
            cumulativeGasUsed: bigNumber,
            effectiveGasPrice: Formatter2.allowNull(bigNumber),
            status: Formatter2.allowNull(number),
            type
          };
          formats.block = {
            hash: Formatter2.allowNull(hash),
            parentHash: hash,
            number,
            timestamp: number,
            nonce: Formatter2.allowNull(hex),
            difficulty: this.difficulty.bind(this),
            gasLimit: bigNumber,
            gasUsed: bigNumber,
            miner: Formatter2.allowNull(address),
            extraData: data,
            transactions: Formatter2.allowNull(Formatter2.arrayOf(hash)),
            baseFeePerGas: Formatter2.allowNull(bigNumber)
          };
          formats.blockWithTransactions = (0, properties_1.shallowCopy)(formats.block);
          formats.blockWithTransactions.transactions = Formatter2.allowNull(Formatter2.arrayOf(this.transactionResponse.bind(this)));
          formats.filter = {
            fromBlock: Formatter2.allowNull(blockTag, void 0),
            toBlock: Formatter2.allowNull(blockTag, void 0),
            blockHash: Formatter2.allowNull(hash, void 0),
            address: Formatter2.allowNull(address, void 0),
            topics: Formatter2.allowNull(this.topics.bind(this), void 0)
          };
          formats.filterLog = {
            blockNumber: Formatter2.allowNull(number),
            blockHash: Formatter2.allowNull(hash),
            transactionIndex: number,
            removed: Formatter2.allowNull(this.boolean.bind(this)),
            address,
            data: Formatter2.allowFalsish(data, "0x"),
            topics: Formatter2.arrayOf(hash),
            transactionHash: hash,
            logIndex: number
          };
          return formats;
        };
        Formatter2.prototype.accessList = function(accessList) {
          return (0, transactions_1.accessListify)(accessList || []);
        };
        Formatter2.prototype.number = function(number) {
          if (number === "0x") {
            return 0;
          }
          return bignumber_1.BigNumber.from(number).toNumber();
        };
        Formatter2.prototype.type = function(number) {
          if (number === "0x" || number == null) {
            return 0;
          }
          return bignumber_1.BigNumber.from(number).toNumber();
        };
        Formatter2.prototype.bigNumber = function(value) {
          return bignumber_1.BigNumber.from(value);
        };
        Formatter2.prototype.boolean = function(value) {
          if (typeof value === "boolean") {
            return value;
          }
          if (typeof value === "string") {
            value = value.toLowerCase();
            if (value === "true") {
              return true;
            }
            if (value === "false") {
              return false;
            }
          }
          throw new Error("invalid boolean - " + value);
        };
        Formatter2.prototype.hex = function(value, strict) {
          if (typeof value === "string") {
            if (!strict && value.substring(0, 2) !== "0x") {
              value = "0x" + value;
            }
            if ((0, bytes_1.isHexString)(value)) {
              return value.toLowerCase();
            }
          }
          return logger.throwArgumentError("invalid hash", "value", value);
        };
        Formatter2.prototype.data = function(value, strict) {
          var result = this.hex(value, strict);
          if (result.length % 2 !== 0) {
            throw new Error("invalid data; odd-length - " + value);
          }
          return result;
        };
        Formatter2.prototype.address = function(value) {
          return (0, address_1.getAddress)(value);
        };
        Formatter2.prototype.callAddress = function(value) {
          if (!(0, bytes_1.isHexString)(value, 32)) {
            return null;
          }
          var address = (0, address_1.getAddress)((0, bytes_1.hexDataSlice)(value, 12));
          return address === constants_1.AddressZero ? null : address;
        };
        Formatter2.prototype.contractAddress = function(value) {
          return (0, address_1.getContractAddress)(value);
        };
        Formatter2.prototype.blockTag = function(blockTag) {
          if (blockTag == null) {
            return "latest";
          }
          if (blockTag === "earliest") {
            return "0x0";
          }
          switch (blockTag) {
            case "earliest":
              return "0x0";
            case "latest":
            case "pending":
            case "safe":
            case "finalized":
              return blockTag;
          }
          if (typeof blockTag === "number" || (0, bytes_1.isHexString)(blockTag)) {
            return (0, bytes_1.hexValue)(blockTag);
          }
          throw new Error("invalid blockTag");
        };
        Formatter2.prototype.hash = function(value, strict) {
          var result = this.hex(value, strict);
          if ((0, bytes_1.hexDataLength)(result) !== 32) {
            return logger.throwArgumentError("invalid hash", "value", value);
          }
          return result;
        };
        Formatter2.prototype.difficulty = function(value) {
          if (value == null) {
            return null;
          }
          var v = bignumber_1.BigNumber.from(value);
          try {
            return v.toNumber();
          } catch (error) {
          }
          return null;
        };
        Formatter2.prototype.uint256 = function(value) {
          if (!(0, bytes_1.isHexString)(value)) {
            throw new Error("invalid uint256");
          }
          return (0, bytes_1.hexZeroPad)(value, 32);
        };
        Formatter2.prototype._block = function(value, format) {
          if (value.author != null && value.miner == null) {
            value.miner = value.author;
          }
          var difficulty = value._difficulty != null ? value._difficulty : value.difficulty;
          var result = Formatter2.check(format, value);
          result._difficulty = difficulty == null ? null : bignumber_1.BigNumber.from(difficulty);
          return result;
        };
        Formatter2.prototype.block = function(value) {
          return this._block(value, this.formats.block);
        };
        Formatter2.prototype.blockWithTransactions = function(value) {
          return this._block(value, this.formats.blockWithTransactions);
        };
        Formatter2.prototype.transactionRequest = function(value) {
          return Formatter2.check(this.formats.transactionRequest, value);
        };
        Formatter2.prototype.transactionResponse = function(transaction) {
          if (transaction.gas != null && transaction.gasLimit == null) {
            transaction.gasLimit = transaction.gas;
          }
          if (transaction.to && bignumber_1.BigNumber.from(transaction.to).isZero()) {
            transaction.to = "0x0000000000000000000000000000000000000000";
          }
          if (transaction.input != null && transaction.data == null) {
            transaction.data = transaction.input;
          }
          if (transaction.to == null && transaction.creates == null) {
            transaction.creates = this.contractAddress(transaction);
          }
          if ((transaction.type === 1 || transaction.type === 2) && transaction.accessList == null) {
            transaction.accessList = [];
          }
          var result = Formatter2.check(this.formats.transaction, transaction);
          if (transaction.chainId != null) {
            var chainId = transaction.chainId;
            if ((0, bytes_1.isHexString)(chainId)) {
              chainId = bignumber_1.BigNumber.from(chainId).toNumber();
            }
            result.chainId = chainId;
          } else {
            var chainId = transaction.networkId;
            if (chainId == null && result.v == null) {
              chainId = transaction.chainId;
            }
            if ((0, bytes_1.isHexString)(chainId)) {
              chainId = bignumber_1.BigNumber.from(chainId).toNumber();
            }
            if (typeof chainId !== "number" && result.v != null) {
              chainId = (result.v - 35) / 2;
              if (chainId < 0) {
                chainId = 0;
              }
              chainId = parseInt(chainId);
            }
            if (typeof chainId !== "number") {
              chainId = 0;
            }
            result.chainId = chainId;
          }
          if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
            result.blockHash = null;
          }
          return result;
        };
        Formatter2.prototype.transaction = function(value) {
          return (0, transactions_1.parse)(value);
        };
        Formatter2.prototype.receiptLog = function(value) {
          return Formatter2.check(this.formats.receiptLog, value);
        };
        Formatter2.prototype.receipt = function(value) {
          var result = Formatter2.check(this.formats.receipt, value);
          if (result.root != null) {
            if (result.root.length <= 4) {
              var value_1 = bignumber_1.BigNumber.from(result.root).toNumber();
              if (value_1 === 0 || value_1 === 1) {
                if (result.status != null && result.status !== value_1) {
                  logger.throwArgumentError("alt-root-status/status mismatch", "value", { root: result.root, status: result.status });
                }
                result.status = value_1;
                delete result.root;
              } else {
                logger.throwArgumentError("invalid alt-root-status", "value.root", result.root);
              }
            } else if (result.root.length !== 66) {
              logger.throwArgumentError("invalid root hash", "value.root", result.root);
            }
          }
          if (result.status != null) {
            result.byzantium = true;
          }
          return result;
        };
        Formatter2.prototype.topics = function(value) {
          var _this = this;
          if (Array.isArray(value)) {
            return value.map(function(v) {
              return _this.topics(v);
            });
          } else if (value != null) {
            return this.hash(value, true);
          }
          return null;
        };
        Formatter2.prototype.filter = function(value) {
          return Formatter2.check(this.formats.filter, value);
        };
        Formatter2.prototype.filterLog = function(value) {
          return Formatter2.check(this.formats.filterLog, value);
        };
        Formatter2.check = function(format, object) {
          var result = {};
          for (var key in format) {
            try {
              var value = format[key](object[key]);
              if (value !== void 0) {
                result[key] = value;
              }
            } catch (error) {
              error.checkKey = key;
              error.checkValue = object[key];
              throw error;
            }
          }
          return result;
        };
        Formatter2.allowNull = function(format, nullValue) {
          return function(value) {
            if (value == null) {
              return nullValue;
            }
            return format(value);
          };
        };
        Formatter2.allowFalsish = function(format, replaceValue) {
          return function(value) {
            if (!value) {
              return replaceValue;
            }
            return format(value);
          };
        };
        Formatter2.arrayOf = function(format) {
          return function(array) {
            if (!Array.isArray(array)) {
              throw new Error("not an array");
            }
            var result = [];
            array.forEach(function(value) {
              result.push(format(value));
            });
            return result;
          };
        };
        return Formatter2;
      }()
    );
    exports.Formatter = Formatter;
    function isCommunityResourcable(value) {
      return value && typeof value.isCommunityResource === "function";
    }
    exports.isCommunityResourcable = isCommunityResourcable;
    function isCommunityResource(value) {
      return isCommunityResourcable(value) && value.isCommunityResource();
    }
    exports.isCommunityResource = isCommunityResource;
    var throttleMessage = false;
    function showThrottleMessage() {
      if (throttleMessage) {
        return;
      }
      throttleMessage = true;
      console.log("========= NOTICE =========");
      console.log("Request-Rate Exceeded  (this message will not be repeated)");
      console.log("");
      console.log("The default API keys for each service are provided as a highly-throttled,");
      console.log("community resource for low-traffic projects and early prototyping.");
      console.log("");
      console.log("While your application will continue to function, we highly recommended");
      console.log("signing up for your own API keys to improve performance, increase your");
      console.log("request rate/limit and enable other perks, such as metrics and advanced APIs.");
      console.log("");
      console.log("For more details: https://docs.ethers.io/api-keys/");
      console.log("==========================");
    }
    exports.showThrottleMessage = showThrottleMessage;
  }
});

// node_modules/@ethersproject/providers/lib/base-provider.js
var require_base_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/base-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseProvider = exports.Resolver = exports.Event = void 0;
    var abstract_provider_1 = require_lib16();
    var base64_1 = require_lib12();
    var basex_1 = require_lib19();
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var constants_1 = require_lib7();
    var hash_1 = require_lib13();
    var networks_1 = require_lib27();
    var properties_1 = require_lib8();
    var sha2_1 = require_lib21();
    var strings_1 = require_lib11();
    var web_1 = require_lib28();
    var bech32_1 = __importDefault(require_bech32());
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var formatter_1 = require_formatter();
    var MAX_CCIP_REDIRECTS = 10;
    function checkTopic(topic) {
      if (topic == null) {
        return "null";
      }
      if ((0, bytes_1.hexDataLength)(topic) !== 32) {
        logger.throwArgumentError("invalid topic", "topic", topic);
      }
      return topic.toLowerCase();
    }
    function serializeTopics(topics) {
      topics = topics.slice();
      while (topics.length > 0 && topics[topics.length - 1] == null) {
        topics.pop();
      }
      return topics.map(function(topic) {
        if (Array.isArray(topic)) {
          var unique_1 = {};
          topic.forEach(function(topic2) {
            unique_1[checkTopic(topic2)] = true;
          });
          var sorted = Object.keys(unique_1);
          sorted.sort();
          return sorted.join("|");
        } else {
          return checkTopic(topic);
        }
      }).join("&");
    }
    function deserializeTopics(data) {
      if (data === "") {
        return [];
      }
      return data.split(/&/g).map(function(topic) {
        if (topic === "") {
          return [];
        }
        var comps = topic.split("|").map(function(topic2) {
          return topic2 === "null" ? null : topic2;
        });
        return comps.length === 1 ? comps[0] : comps;
      });
    }
    function getEventTag(eventName) {
      if (typeof eventName === "string") {
        eventName = eventName.toLowerCase();
        if ((0, bytes_1.hexDataLength)(eventName) === 32) {
          return "tx:" + eventName;
        }
        if (eventName.indexOf(":") === -1) {
          return eventName;
        }
      } else if (Array.isArray(eventName)) {
        return "filter:*:" + serializeTopics(eventName);
      } else if (abstract_provider_1.ForkEvent.isForkEvent(eventName)) {
        logger.warn("not implemented");
        throw new Error("not implemented");
      } else if (eventName && typeof eventName === "object") {
        return "filter:" + (eventName.address || "*") + ":" + serializeTopics(eventName.topics || []);
      }
      throw new Error("invalid event - " + eventName);
    }
    function getTime() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
    function stall(duration) {
      return new Promise(function(resolve) {
        setTimeout(resolve, duration);
      });
    }
    var PollableEvents = ["block", "network", "pending", "poll"];
    var Event = (
      /** @class */
      function() {
        function Event2(tag, listener, once) {
          (0, properties_1.defineReadOnly)(this, "tag", tag);
          (0, properties_1.defineReadOnly)(this, "listener", listener);
          (0, properties_1.defineReadOnly)(this, "once", once);
          this._lastBlockNumber = -2;
          this._inflight = false;
        }
        Object.defineProperty(Event2.prototype, "event", {
          get: function() {
            switch (this.type) {
              case "tx":
                return this.hash;
              case "filter":
                return this.filter;
            }
            return this.tag;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Event2.prototype, "type", {
          get: function() {
            return this.tag.split(":")[0];
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Event2.prototype, "hash", {
          get: function() {
            var comps = this.tag.split(":");
            if (comps[0] !== "tx") {
              return null;
            }
            return comps[1];
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Event2.prototype, "filter", {
          get: function() {
            var comps = this.tag.split(":");
            if (comps[0] !== "filter") {
              return null;
            }
            var address = comps[1];
            var topics = deserializeTopics(comps[2]);
            var filter = {};
            if (topics.length > 0) {
              filter.topics = topics;
            }
            if (address && address !== "*") {
              filter.address = address;
            }
            return filter;
          },
          enumerable: false,
          configurable: true
        });
        Event2.prototype.pollable = function() {
          return this.tag.indexOf(":") >= 0 || PollableEvents.indexOf(this.tag) >= 0;
        };
        return Event2;
      }()
    );
    exports.Event = Event;
    var coinInfos = {
      "0": { symbol: "btc", p2pkh: 0, p2sh: 5, prefix: "bc" },
      "2": { symbol: "ltc", p2pkh: 48, p2sh: 50, prefix: "ltc" },
      "3": { symbol: "doge", p2pkh: 30, p2sh: 22 },
      "60": { symbol: "eth", ilk: "eth" },
      "61": { symbol: "etc", ilk: "eth" },
      "700": { symbol: "xdai", ilk: "eth" }
    };
    function bytes32ify(value) {
      return (0, bytes_1.hexZeroPad)(bignumber_1.BigNumber.from(value).toHexString(), 32);
    }
    function base58Encode(data) {
      return basex_1.Base58.encode((0, bytes_1.concat)([data, (0, bytes_1.hexDataSlice)((0, sha2_1.sha256)((0, sha2_1.sha256)(data)), 0, 4)]));
    }
    var matcherIpfs = new RegExp("^(ipfs)://(.*)$", "i");
    var matchers = [
      new RegExp("^(https)://(.*)$", "i"),
      new RegExp("^(data):(.*)$", "i"),
      matcherIpfs,
      new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i")
    ];
    function _parseString(result, start) {
      try {
        return (0, strings_1.toUtf8String)(_parseBytes(result, start));
      } catch (error) {
      }
      return null;
    }
    function _parseBytes(result, start) {
      if (result === "0x") {
        return null;
      }
      var offset = bignumber_1.BigNumber.from((0, bytes_1.hexDataSlice)(result, start, start + 32)).toNumber();
      var length = bignumber_1.BigNumber.from((0, bytes_1.hexDataSlice)(result, offset, offset + 32)).toNumber();
      return (0, bytes_1.hexDataSlice)(result, offset + 32, offset + 32 + length);
    }
    function getIpfsLink(link) {
      if (link.match(/^ipfs:\/\/ipfs\//i)) {
        link = link.substring(12);
      } else if (link.match(/^ipfs:\/\//i)) {
        link = link.substring(7);
      } else {
        logger.throwArgumentError("unsupported IPFS format", "link", link);
      }
      return "https://gateway.ipfs.io/ipfs/" + link;
    }
    function numPad(value) {
      var result = (0, bytes_1.arrayify)(value);
      if (result.length > 32) {
        throw new Error("internal; should not happen");
      }
      var padded = new Uint8Array(32);
      padded.set(result, 32 - result.length);
      return padded;
    }
    function bytesPad(value) {
      if (value.length % 32 === 0) {
        return value;
      }
      var result = new Uint8Array(Math.ceil(value.length / 32) * 32);
      result.set(value);
      return result;
    }
    function encodeBytes(datas) {
      var result = [];
      var byteCount = 0;
      for (var i = 0; i < datas.length; i++) {
        result.push(null);
        byteCount += 32;
      }
      for (var i = 0; i < datas.length; i++) {
        var data = (0, bytes_1.arrayify)(datas[i]);
        result[i] = numPad(byteCount);
        result.push(numPad(data.length));
        result.push(bytesPad(data));
        byteCount += 32 + Math.ceil(data.length / 32) * 32;
      }
      return (0, bytes_1.hexConcat)(result);
    }
    var Resolver = (
      /** @class */
      function() {
        function Resolver2(provider, address, name, resolvedAddress) {
          (0, properties_1.defineReadOnly)(this, "provider", provider);
          (0, properties_1.defineReadOnly)(this, "name", name);
          (0, properties_1.defineReadOnly)(this, "address", provider.formatter.address(address));
          (0, properties_1.defineReadOnly)(this, "_resolvedAddress", resolvedAddress);
        }
        Resolver2.prototype.supportsWildcard = function() {
          var _this = this;
          if (!this._supportsEip2544) {
            this._supportsEip2544 = this.provider.call({
              to: this.address,
              data: "0x01ffc9a79061b92300000000000000000000000000000000000000000000000000000000"
            }).then(function(result) {
              return bignumber_1.BigNumber.from(result).eq(1);
            }).catch(function(error) {
              if (error.code === logger_1.Logger.errors.CALL_EXCEPTION) {
                return false;
              }
              _this._supportsEip2544 = null;
              throw error;
            });
          }
          return this._supportsEip2544;
        };
        Resolver2.prototype._fetch = function(selector, parameters) {
          return __awaiter(this, void 0, void 0, function() {
            var tx, parseBytes, result, error_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  tx = {
                    to: this.address,
                    ccipReadEnabled: true,
                    data: (0, bytes_1.hexConcat)([selector, (0, hash_1.namehash)(this.name), parameters || "0x"])
                  };
                  parseBytes = false;
                  return [4, this.supportsWildcard()];
                case 1:
                  if (_a.sent()) {
                    parseBytes = true;
                    tx.data = (0, bytes_1.hexConcat)(["0x9061b923", encodeBytes([(0, hash_1.dnsEncode)(this.name), tx.data])]);
                  }
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 5]);
                  return [4, this.provider.call(tx)];
                case 3:
                  result = _a.sent();
                  if ((0, bytes_1.arrayify)(result).length % 32 === 4) {
                    logger.throwError("resolver threw error", logger_1.Logger.errors.CALL_EXCEPTION, {
                      transaction: tx,
                      data: result
                    });
                  }
                  if (parseBytes) {
                    result = _parseBytes(result, 0);
                  }
                  return [2, result];
                case 4:
                  error_1 = _a.sent();
                  if (error_1.code === logger_1.Logger.errors.CALL_EXCEPTION) {
                    return [2, null];
                  }
                  throw error_1;
                case 5:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        Resolver2.prototype._fetchBytes = function(selector, parameters) {
          return __awaiter(this, void 0, void 0, function() {
            var result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._fetch(selector, parameters)];
                case 1:
                  result = _a.sent();
                  if (result != null) {
                    return [2, _parseBytes(result, 0)];
                  }
                  return [2, null];
              }
            });
          });
        };
        Resolver2.prototype._getAddress = function(coinType, hexBytes) {
          var coinInfo = coinInfos[String(coinType)];
          if (coinInfo == null) {
            logger.throwError("unsupported coin type: " + coinType, logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
              operation: "getAddress(" + coinType + ")"
            });
          }
          if (coinInfo.ilk === "eth") {
            return this.provider.formatter.address(hexBytes);
          }
          var bytes = (0, bytes_1.arrayify)(hexBytes);
          if (coinInfo.p2pkh != null) {
            var p2pkh = hexBytes.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/);
            if (p2pkh) {
              var length_1 = parseInt(p2pkh[1], 16);
              if (p2pkh[2].length === length_1 * 2 && length_1 >= 1 && length_1 <= 75) {
                return base58Encode((0, bytes_1.concat)([[coinInfo.p2pkh], "0x" + p2pkh[2]]));
              }
            }
          }
          if (coinInfo.p2sh != null) {
            var p2sh = hexBytes.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/);
            if (p2sh) {
              var length_2 = parseInt(p2sh[1], 16);
              if (p2sh[2].length === length_2 * 2 && length_2 >= 1 && length_2 <= 75) {
                return base58Encode((0, bytes_1.concat)([[coinInfo.p2sh], "0x" + p2sh[2]]));
              }
            }
          }
          if (coinInfo.prefix != null) {
            var length_3 = bytes[1];
            var version_1 = bytes[0];
            if (version_1 === 0) {
              if (length_3 !== 20 && length_3 !== 32) {
                version_1 = -1;
              }
            } else {
              version_1 = -1;
            }
            if (version_1 >= 0 && bytes.length === 2 + length_3 && length_3 >= 1 && length_3 <= 75) {
              var words = bech32_1.default.toWords(bytes.slice(2));
              words.unshift(version_1);
              return bech32_1.default.encode(coinInfo.prefix, words);
            }
          }
          return null;
        };
        Resolver2.prototype.getAddress = function(coinType) {
          return __awaiter(this, void 0, void 0, function() {
            var result, error_2, hexBytes, address;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (coinType == null) {
                    coinType = 60;
                  }
                  if (!(coinType === 60))
                    return [3, 4];
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 3, , 4]);
                  return [4, this._fetch("0x3b3b57de")];
                case 2:
                  result = _a.sent();
                  if (result === "0x" || result === constants_1.HashZero) {
                    return [2, null];
                  }
                  return [2, this.provider.formatter.callAddress(result)];
                case 3:
                  error_2 = _a.sent();
                  if (error_2.code === logger_1.Logger.errors.CALL_EXCEPTION) {
                    return [2, null];
                  }
                  throw error_2;
                case 4:
                  return [4, this._fetchBytes("0xf1cb7e06", bytes32ify(coinType))];
                case 5:
                  hexBytes = _a.sent();
                  if (hexBytes == null || hexBytes === "0x") {
                    return [2, null];
                  }
                  address = this._getAddress(coinType, hexBytes);
                  if (address == null) {
                    logger.throwError("invalid or unsupported coin data", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                      operation: "getAddress(" + coinType + ")",
                      coinType,
                      data: hexBytes
                    });
                  }
                  return [2, address];
              }
            });
          });
        };
        Resolver2.prototype.getAvatar = function() {
          return __awaiter(this, void 0, void 0, function() {
            var linkage, avatar, i, match, scheme, _a, selector, owner, _b, comps, addr, tokenId, tokenOwner, _c, _d, balance, _e, _f, tx, metadataUrl, _g, metadata, imageUrl, ipfs, error_3;
            return __generator(this, function(_h) {
              switch (_h.label) {
                case 0:
                  linkage = [{ type: "name", content: this.name }];
                  _h.label = 1;
                case 1:
                  _h.trys.push([1, 19, , 20]);
                  return [4, this.getText("avatar")];
                case 2:
                  avatar = _h.sent();
                  if (avatar == null) {
                    return [2, null];
                  }
                  i = 0;
                  _h.label = 3;
                case 3:
                  if (!(i < matchers.length))
                    return [3, 18];
                  match = avatar.match(matchers[i]);
                  if (match == null) {
                    return [3, 17];
                  }
                  scheme = match[1].toLowerCase();
                  _a = scheme;
                  switch (_a) {
                    case "https":
                      return [3, 4];
                    case "data":
                      return [3, 5];
                    case "ipfs":
                      return [3, 6];
                    case "erc721":
                      return [3, 7];
                    case "erc1155":
                      return [3, 7];
                  }
                  return [3, 17];
                case 4:
                  linkage.push({ type: "url", content: avatar });
                  return [2, { linkage, url: avatar }];
                case 5:
                  linkage.push({ type: "data", content: avatar });
                  return [2, { linkage, url: avatar }];
                case 6:
                  linkage.push({ type: "ipfs", content: avatar });
                  return [2, { linkage, url: getIpfsLink(avatar) }];
                case 7:
                  selector = scheme === "erc721" ? "0xc87b56dd" : "0x0e89341c";
                  linkage.push({ type: scheme, content: avatar });
                  _b = this._resolvedAddress;
                  if (_b)
                    return [3, 9];
                  return [4, this.getAddress()];
                case 8:
                  _b = _h.sent();
                  _h.label = 9;
                case 9:
                  owner = _b;
                  comps = (match[2] || "").split("/");
                  if (comps.length !== 2) {
                    return [2, null];
                  }
                  return [4, this.provider.formatter.address(comps[0])];
                case 10:
                  addr = _h.sent();
                  tokenId = (0, bytes_1.hexZeroPad)(bignumber_1.BigNumber.from(comps[1]).toHexString(), 32);
                  if (!(scheme === "erc721"))
                    return [3, 12];
                  _d = (_c = this.provider.formatter).callAddress;
                  return [4, this.provider.call({
                    to: addr,
                    data: (0, bytes_1.hexConcat)(["0x6352211e", tokenId])
                  })];
                case 11:
                  tokenOwner = _d.apply(_c, [_h.sent()]);
                  if (owner !== tokenOwner) {
                    return [2, null];
                  }
                  linkage.push({ type: "owner", content: tokenOwner });
                  return [3, 14];
                case 12:
                  if (!(scheme === "erc1155"))
                    return [3, 14];
                  _f = (_e = bignumber_1.BigNumber).from;
                  return [4, this.provider.call({
                    to: addr,
                    data: (0, bytes_1.hexConcat)(["0x00fdd58e", (0, bytes_1.hexZeroPad)(owner, 32), tokenId])
                  })];
                case 13:
                  balance = _f.apply(_e, [_h.sent()]);
                  if (balance.isZero()) {
                    return [2, null];
                  }
                  linkage.push({ type: "balance", content: balance.toString() });
                  _h.label = 14;
                case 14:
                  tx = {
                    to: this.provider.formatter.address(comps[0]),
                    data: (0, bytes_1.hexConcat)([selector, tokenId])
                  };
                  _g = _parseString;
                  return [4, this.provider.call(tx)];
                case 15:
                  metadataUrl = _g.apply(void 0, [_h.sent(), 0]);
                  if (metadataUrl == null) {
                    return [2, null];
                  }
                  linkage.push({ type: "metadata-url-base", content: metadataUrl });
                  if (scheme === "erc1155") {
                    metadataUrl = metadataUrl.replace("{id}", tokenId.substring(2));
                    linkage.push({ type: "metadata-url-expanded", content: metadataUrl });
                  }
                  if (metadataUrl.match(/^ipfs:/i)) {
                    metadataUrl = getIpfsLink(metadataUrl);
                  }
                  linkage.push({ type: "metadata-url", content: metadataUrl });
                  return [4, (0, web_1.fetchJson)(metadataUrl)];
                case 16:
                  metadata = _h.sent();
                  if (!metadata) {
                    return [2, null];
                  }
                  linkage.push({ type: "metadata", content: JSON.stringify(metadata) });
                  imageUrl = metadata.image;
                  if (typeof imageUrl !== "string") {
                    return [2, null];
                  }
                  if (imageUrl.match(/^(https:\/\/|data:)/i)) {
                  } else {
                    ipfs = imageUrl.match(matcherIpfs);
                    if (ipfs == null) {
                      return [2, null];
                    }
                    linkage.push({ type: "url-ipfs", content: imageUrl });
                    imageUrl = getIpfsLink(imageUrl);
                  }
                  linkage.push({ type: "url", content: imageUrl });
                  return [2, { linkage, url: imageUrl }];
                case 17:
                  i++;
                  return [3, 3];
                case 18:
                  return [3, 20];
                case 19:
                  error_3 = _h.sent();
                  return [3, 20];
                case 20:
                  return [2, null];
              }
            });
          });
        };
        Resolver2.prototype.getContentHash = function() {
          return __awaiter(this, void 0, void 0, function() {
            var hexBytes, ipfs, length_4, ipns, length_5, swarm, skynet, urlSafe_1, hash;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._fetchBytes("0xbc1c58d1")];
                case 1:
                  hexBytes = _a.sent();
                  if (hexBytes == null || hexBytes === "0x") {
                    return [2, null];
                  }
                  ipfs = hexBytes.match(/^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
                  if (ipfs) {
                    length_4 = parseInt(ipfs[3], 16);
                    if (ipfs[4].length === length_4 * 2) {
                      return [2, "ipfs://" + basex_1.Base58.encode("0x" + ipfs[1])];
                    }
                  }
                  ipns = hexBytes.match(/^0xe5010172(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
                  if (ipns) {
                    length_5 = parseInt(ipns[3], 16);
                    if (ipns[4].length === length_5 * 2) {
                      return [2, "ipns://" + basex_1.Base58.encode("0x" + ipns[1])];
                    }
                  }
                  swarm = hexBytes.match(/^0xe40101fa011b20([0-9a-f]*)$/);
                  if (swarm) {
                    if (swarm[1].length === 32 * 2) {
                      return [2, "bzz://" + swarm[1]];
                    }
                  }
                  skynet = hexBytes.match(/^0x90b2c605([0-9a-f]*)$/);
                  if (skynet) {
                    if (skynet[1].length === 34 * 2) {
                      urlSafe_1 = { "=": "", "+": "-", "/": "_" };
                      hash = (0, base64_1.encode)("0x" + skynet[1]).replace(/[=+\/]/g, function(a) {
                        return urlSafe_1[a];
                      });
                      return [2, "sia://" + hash];
                    }
                  }
                  return [2, logger.throwError("invalid or unsupported content hash data", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: "getContentHash()",
                    data: hexBytes
                  })];
              }
            });
          });
        };
        Resolver2.prototype.getText = function(key) {
          return __awaiter(this, void 0, void 0, function() {
            var keyBytes, hexBytes;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  keyBytes = (0, strings_1.toUtf8Bytes)(key);
                  keyBytes = (0, bytes_1.concat)([bytes32ify(64), bytes32ify(keyBytes.length), keyBytes]);
                  if (keyBytes.length % 32 !== 0) {
                    keyBytes = (0, bytes_1.concat)([keyBytes, (0, bytes_1.hexZeroPad)("0x", 32 - key.length % 32)]);
                  }
                  return [4, this._fetchBytes("0x59d1d43c", (0, bytes_1.hexlify)(keyBytes))];
                case 1:
                  hexBytes = _a.sent();
                  if (hexBytes == null || hexBytes === "0x") {
                    return [2, null];
                  }
                  return [2, (0, strings_1.toUtf8String)(hexBytes)];
              }
            });
          });
        };
        return Resolver2;
      }()
    );
    exports.Resolver = Resolver;
    var defaultFormatter = null;
    var nextPollId = 1;
    var BaseProvider = (
      /** @class */
      function(_super) {
        __extends(BaseProvider2, _super);
        function BaseProvider2(network) {
          var _newTarget = this.constructor;
          var _this = _super.call(this) || this;
          _this._events = [];
          _this._emitted = { block: -2 };
          _this.disableCcipRead = false;
          _this.formatter = _newTarget.getFormatter();
          (0, properties_1.defineReadOnly)(_this, "anyNetwork", network === "any");
          if (_this.anyNetwork) {
            network = _this.detectNetwork();
          }
          if (network instanceof Promise) {
            _this._networkPromise = network;
            network.catch(function(error) {
            });
            _this._ready().catch(function(error) {
            });
          } else {
            var knownNetwork = (0, properties_1.getStatic)(_newTarget, "getNetwork")(network);
            if (knownNetwork) {
              (0, properties_1.defineReadOnly)(_this, "_network", knownNetwork);
              _this.emit("network", knownNetwork, null);
            } else {
              logger.throwArgumentError("invalid network", "network", network);
            }
          }
          _this._maxInternalBlockNumber = -1024;
          _this._lastBlockNumber = -2;
          _this._maxFilterBlockRange = 10;
          _this._pollingInterval = 4e3;
          _this._fastQueryDate = 0;
          return _this;
        }
        BaseProvider2.prototype._ready = function() {
          return __awaiter(this, void 0, void 0, function() {
            var network, error_4;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(this._network == null))
                    return [3, 7];
                  network = null;
                  if (!this._networkPromise)
                    return [3, 4];
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 3, , 4]);
                  return [4, this._networkPromise];
                case 2:
                  network = _a.sent();
                  return [3, 4];
                case 3:
                  error_4 = _a.sent();
                  return [3, 4];
                case 4:
                  if (!(network == null))
                    return [3, 6];
                  return [4, this.detectNetwork()];
                case 5:
                  network = _a.sent();
                  _a.label = 6;
                case 6:
                  if (!network) {
                    logger.throwError("no network detected", logger_1.Logger.errors.UNKNOWN_ERROR, {});
                  }
                  if (this._network == null) {
                    if (this.anyNetwork) {
                      this._network = network;
                    } else {
                      (0, properties_1.defineReadOnly)(this, "_network", network);
                    }
                    this.emit("network", network, null);
                  }
                  _a.label = 7;
                case 7:
                  return [2, this._network];
              }
            });
          });
        };
        Object.defineProperty(BaseProvider2.prototype, "ready", {
          // This will always return the most recently established network.
          // For "any", this can change (a "network" event is emitted before
          // any change is reflected); otherwise this cannot change
          get: function() {
            var _this = this;
            return (0, web_1.poll)(function() {
              return _this._ready().then(function(network) {
                return network;
              }, function(error) {
                if (error.code === logger_1.Logger.errors.NETWORK_ERROR && error.event === "noNetwork") {
                  return void 0;
                }
                throw error;
              });
            });
          },
          enumerable: false,
          configurable: true
        });
        BaseProvider2.getFormatter = function() {
          if (defaultFormatter == null) {
            defaultFormatter = new formatter_1.Formatter();
          }
          return defaultFormatter;
        };
        BaseProvider2.getNetwork = function(network) {
          return (0, networks_1.getNetwork)(network == null ? "homestead" : network);
        };
        BaseProvider2.prototype.ccipReadFetch = function(tx, calldata, urls) {
          return __awaiter(this, void 0, void 0, function() {
            var sender, data, errorMessages, i, url, href, json, result, errorMessage;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (this.disableCcipRead || urls.length === 0) {
                    return [2, null];
                  }
                  sender = tx.to.toLowerCase();
                  data = calldata.toLowerCase();
                  errorMessages = [];
                  i = 0;
                  _a.label = 1;
                case 1:
                  if (!(i < urls.length))
                    return [3, 4];
                  url = urls[i];
                  href = url.replace("{sender}", sender).replace("{data}", data);
                  json = url.indexOf("{data}") >= 0 ? null : JSON.stringify({ data, sender });
                  return [4, (0, web_1.fetchJson)({ url: href, errorPassThrough: true }, json, function(value, response) {
                    value.status = response.statusCode;
                    return value;
                  })];
                case 2:
                  result = _a.sent();
                  if (result.data) {
                    return [2, result.data];
                  }
                  errorMessage = result.message || "unknown error";
                  if (result.status >= 400 && result.status < 500) {
                    return [2, logger.throwError("response not found during CCIP fetch: " + errorMessage, logger_1.Logger.errors.SERVER_ERROR, { url, errorMessage })];
                  }
                  errorMessages.push(errorMessage);
                  _a.label = 3;
                case 3:
                  i++;
                  return [3, 1];
                case 4:
                  return [2, logger.throwError("error encountered during CCIP fetch: " + errorMessages.map(function(m) {
                    return JSON.stringify(m);
                  }).join(", "), logger_1.Logger.errors.SERVER_ERROR, {
                    urls,
                    errorMessages
                  })];
              }
            });
          });
        };
        BaseProvider2.prototype._getInternalBlockNumber = function(maxAge) {
          return __awaiter(this, void 0, void 0, function() {
            var internalBlockNumber, result, error_5, reqTime, checkInternalBlockNumber;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._ready()];
                case 1:
                  _a.sent();
                  if (!(maxAge > 0))
                    return [3, 7];
                  _a.label = 2;
                case 2:
                  if (!this._internalBlockNumber)
                    return [3, 7];
                  internalBlockNumber = this._internalBlockNumber;
                  _a.label = 3;
                case 3:
                  _a.trys.push([3, 5, , 6]);
                  return [4, internalBlockNumber];
                case 4:
                  result = _a.sent();
                  if (getTime() - result.respTime <= maxAge) {
                    return [2, result.blockNumber];
                  }
                  return [3, 7];
                case 5:
                  error_5 = _a.sent();
                  if (this._internalBlockNumber === internalBlockNumber) {
                    return [3, 7];
                  }
                  return [3, 6];
                case 6:
                  return [3, 2];
                case 7:
                  reqTime = getTime();
                  checkInternalBlockNumber = (0, properties_1.resolveProperties)({
                    blockNumber: this.perform("getBlockNumber", {}),
                    networkError: this.getNetwork().then(function(network) {
                      return null;
                    }, function(error) {
                      return error;
                    })
                  }).then(function(_a2) {
                    var blockNumber = _a2.blockNumber, networkError = _a2.networkError;
                    if (networkError) {
                      if (_this._internalBlockNumber === checkInternalBlockNumber) {
                        _this._internalBlockNumber = null;
                      }
                      throw networkError;
                    }
                    var respTime = getTime();
                    blockNumber = bignumber_1.BigNumber.from(blockNumber).toNumber();
                    if (blockNumber < _this._maxInternalBlockNumber) {
                      blockNumber = _this._maxInternalBlockNumber;
                    }
                    _this._maxInternalBlockNumber = blockNumber;
                    _this._setFastBlockNumber(blockNumber);
                    return { blockNumber, reqTime, respTime };
                  });
                  this._internalBlockNumber = checkInternalBlockNumber;
                  checkInternalBlockNumber.catch(function(error) {
                    if (_this._internalBlockNumber === checkInternalBlockNumber) {
                      _this._internalBlockNumber = null;
                    }
                  });
                  return [4, checkInternalBlockNumber];
                case 8:
                  return [2, _a.sent().blockNumber];
              }
            });
          });
        };
        BaseProvider2.prototype.poll = function() {
          return __awaiter(this, void 0, void 0, function() {
            var pollId, runners, blockNumber, error_6, i;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  pollId = nextPollId++;
                  runners = [];
                  blockNumber = null;
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 3, , 4]);
                  return [4, this._getInternalBlockNumber(100 + this.pollingInterval / 2)];
                case 2:
                  blockNumber = _a.sent();
                  return [3, 4];
                case 3:
                  error_6 = _a.sent();
                  this.emit("error", error_6);
                  return [
                    2
                    /*return*/
                  ];
                case 4:
                  this._setFastBlockNumber(blockNumber);
                  this.emit("poll", pollId, blockNumber);
                  if (blockNumber === this._lastBlockNumber) {
                    this.emit("didPoll", pollId);
                    return [
                      2
                      /*return*/
                    ];
                  }
                  if (this._emitted.block === -2) {
                    this._emitted.block = blockNumber - 1;
                  }
                  if (Math.abs(this._emitted.block - blockNumber) > 1e3) {
                    logger.warn("network block skew detected; skipping block events (emitted=" + this._emitted.block + " blockNumber" + blockNumber + ")");
                    this.emit("error", logger.makeError("network block skew detected", logger_1.Logger.errors.NETWORK_ERROR, {
                      blockNumber,
                      event: "blockSkew",
                      previousBlockNumber: this._emitted.block
                    }));
                    this.emit("block", blockNumber);
                  } else {
                    for (i = this._emitted.block + 1; i <= blockNumber; i++) {
                      this.emit("block", i);
                    }
                  }
                  if (this._emitted.block !== blockNumber) {
                    this._emitted.block = blockNumber;
                    Object.keys(this._emitted).forEach(function(key) {
                      if (key === "block") {
                        return;
                      }
                      var eventBlockNumber = _this._emitted[key];
                      if (eventBlockNumber === "pending") {
                        return;
                      }
                      if (blockNumber - eventBlockNumber > 12) {
                        delete _this._emitted[key];
                      }
                    });
                  }
                  if (this._lastBlockNumber === -2) {
                    this._lastBlockNumber = blockNumber - 1;
                  }
                  this._events.forEach(function(event) {
                    switch (event.type) {
                      case "tx": {
                        var hash_2 = event.hash;
                        var runner = _this.getTransactionReceipt(hash_2).then(function(receipt) {
                          if (!receipt || receipt.blockNumber == null) {
                            return null;
                          }
                          _this._emitted["t:" + hash_2] = receipt.blockNumber;
                          _this.emit(hash_2, receipt);
                          return null;
                        }).catch(function(error) {
                          _this.emit("error", error);
                        });
                        runners.push(runner);
                        break;
                      }
                      case "filter": {
                        if (!event._inflight) {
                          event._inflight = true;
                          if (event._lastBlockNumber === -2) {
                            event._lastBlockNumber = blockNumber - 1;
                          }
                          var filter_1 = event.filter;
                          filter_1.fromBlock = event._lastBlockNumber + 1;
                          filter_1.toBlock = blockNumber;
                          var minFromBlock = filter_1.toBlock - _this._maxFilterBlockRange;
                          if (minFromBlock > filter_1.fromBlock) {
                            filter_1.fromBlock = minFromBlock;
                          }
                          if (filter_1.fromBlock < 0) {
                            filter_1.fromBlock = 0;
                          }
                          var runner = _this.getLogs(filter_1).then(function(logs) {
                            event._inflight = false;
                            if (logs.length === 0) {
                              return;
                            }
                            logs.forEach(function(log) {
                              if (log.blockNumber > event._lastBlockNumber) {
                                event._lastBlockNumber = log.blockNumber;
                              }
                              _this._emitted["b:" + log.blockHash] = log.blockNumber;
                              _this._emitted["t:" + log.transactionHash] = log.blockNumber;
                              _this.emit(filter_1, log);
                            });
                          }).catch(function(error) {
                            _this.emit("error", error);
                            event._inflight = false;
                          });
                          runners.push(runner);
                        }
                        break;
                      }
                    }
                  });
                  this._lastBlockNumber = blockNumber;
                  Promise.all(runners).then(function() {
                    _this.emit("didPoll", pollId);
                  }).catch(function(error) {
                    _this.emit("error", error);
                  });
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype.resetEventsBlock = function(blockNumber) {
          this._lastBlockNumber = blockNumber - 1;
          if (this.polling) {
            this.poll();
          }
        };
        Object.defineProperty(BaseProvider2.prototype, "network", {
          get: function() {
            return this._network;
          },
          enumerable: false,
          configurable: true
        });
        BaseProvider2.prototype.detectNetwork = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, logger.throwError("provider does not support network detection", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "provider.detectNetwork"
              })];
            });
          });
        };
        BaseProvider2.prototype.getNetwork = function() {
          return __awaiter(this, void 0, void 0, function() {
            var network, currentNetwork, error;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._ready()];
                case 1:
                  network = _a.sent();
                  return [4, this.detectNetwork()];
                case 2:
                  currentNetwork = _a.sent();
                  if (!(network.chainId !== currentNetwork.chainId))
                    return [3, 5];
                  if (!this.anyNetwork)
                    return [3, 4];
                  this._network = currentNetwork;
                  this._lastBlockNumber = -2;
                  this._fastBlockNumber = null;
                  this._fastBlockNumberPromise = null;
                  this._fastQueryDate = 0;
                  this._emitted.block = -2;
                  this._maxInternalBlockNumber = -1024;
                  this._internalBlockNumber = null;
                  this.emit("network", currentNetwork, network);
                  return [4, stall(0)];
                case 3:
                  _a.sent();
                  return [2, this._network];
                case 4:
                  error = logger.makeError("underlying network changed", logger_1.Logger.errors.NETWORK_ERROR, {
                    event: "changed",
                    network,
                    detectedNetwork: currentNetwork
                  });
                  this.emit("error", error);
                  throw error;
                case 5:
                  return [2, network];
              }
            });
          });
        };
        Object.defineProperty(BaseProvider2.prototype, "blockNumber", {
          get: function() {
            var _this = this;
            this._getInternalBlockNumber(100 + this.pollingInterval / 2).then(function(blockNumber) {
              _this._setFastBlockNumber(blockNumber);
            }, function(error) {
            });
            return this._fastBlockNumber != null ? this._fastBlockNumber : -1;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(BaseProvider2.prototype, "polling", {
          get: function() {
            return this._poller != null;
          },
          set: function(value) {
            var _this = this;
            if (value && !this._poller) {
              this._poller = setInterval(function() {
                _this.poll();
              }, this.pollingInterval);
              if (!this._bootstrapPoll) {
                this._bootstrapPoll = setTimeout(function() {
                  _this.poll();
                  _this._bootstrapPoll = setTimeout(function() {
                    if (!_this._poller) {
                      _this.poll();
                    }
                    _this._bootstrapPoll = null;
                  }, _this.pollingInterval);
                }, 0);
              }
            } else if (!value && this._poller) {
              clearInterval(this._poller);
              this._poller = null;
            }
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(BaseProvider2.prototype, "pollingInterval", {
          get: function() {
            return this._pollingInterval;
          },
          set: function(value) {
            var _this = this;
            if (typeof value !== "number" || value <= 0 || parseInt(String(value)) != value) {
              throw new Error("invalid polling interval");
            }
            this._pollingInterval = value;
            if (this._poller) {
              clearInterval(this._poller);
              this._poller = setInterval(function() {
                _this.poll();
              }, this._pollingInterval);
            }
          },
          enumerable: false,
          configurable: true
        });
        BaseProvider2.prototype._getFastBlockNumber = function() {
          var _this = this;
          var now = getTime();
          if (now - this._fastQueryDate > 2 * this._pollingInterval) {
            this._fastQueryDate = now;
            this._fastBlockNumberPromise = this.getBlockNumber().then(function(blockNumber) {
              if (_this._fastBlockNumber == null || blockNumber > _this._fastBlockNumber) {
                _this._fastBlockNumber = blockNumber;
              }
              return _this._fastBlockNumber;
            });
          }
          return this._fastBlockNumberPromise;
        };
        BaseProvider2.prototype._setFastBlockNumber = function(blockNumber) {
          if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
            return;
          }
          this._fastQueryDate = getTime();
          if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
            this._fastBlockNumber = blockNumber;
            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
          }
        };
        BaseProvider2.prototype.waitForTransaction = function(transactionHash, confirmations, timeout) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, this._waitForTransaction(transactionHash, confirmations == null ? 1 : confirmations, timeout || 0, null)];
            });
          });
        };
        BaseProvider2.prototype._waitForTransaction = function(transactionHash, confirmations, timeout, replaceable) {
          return __awaiter(this, void 0, void 0, function() {
            var receipt;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getTransactionReceipt(transactionHash)];
                case 1:
                  receipt = _a.sent();
                  if ((receipt ? receipt.confirmations : 0) >= confirmations) {
                    return [2, receipt];
                  }
                  return [2, new Promise(function(resolve, reject) {
                    var cancelFuncs = [];
                    var done = false;
                    var alreadyDone = function() {
                      if (done) {
                        return true;
                      }
                      done = true;
                      cancelFuncs.forEach(function(func) {
                        func();
                      });
                      return false;
                    };
                    var minedHandler = function(receipt2) {
                      if (receipt2.confirmations < confirmations) {
                        return;
                      }
                      if (alreadyDone()) {
                        return;
                      }
                      resolve(receipt2);
                    };
                    _this.on(transactionHash, minedHandler);
                    cancelFuncs.push(function() {
                      _this.removeListener(transactionHash, minedHandler);
                    });
                    if (replaceable) {
                      var lastBlockNumber_1 = replaceable.startBlock;
                      var scannedBlock_1 = null;
                      var replaceHandler_1 = function(blockNumber) {
                        return __awaiter(_this, void 0, void 0, function() {
                          var _this2 = this;
                          return __generator(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                if (done) {
                                  return [
                                    2
                                    /*return*/
                                  ];
                                }
                                return [4, stall(1e3)];
                              case 1:
                                _a2.sent();
                                this.getTransactionCount(replaceable.from).then(function(nonce) {
                                  return __awaiter(_this2, void 0, void 0, function() {
                                    var mined, block, ti, tx, receipt_1, reason;
                                    return __generator(this, function(_a3) {
                                      switch (_a3.label) {
                                        case 0:
                                          if (done) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          if (!(nonce <= replaceable.nonce))
                                            return [3, 1];
                                          lastBlockNumber_1 = blockNumber;
                                          return [3, 9];
                                        case 1:
                                          return [4, this.getTransaction(transactionHash)];
                                        case 2:
                                          mined = _a3.sent();
                                          if (mined && mined.blockNumber != null) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          if (scannedBlock_1 == null) {
                                            scannedBlock_1 = lastBlockNumber_1 - 3;
                                            if (scannedBlock_1 < replaceable.startBlock) {
                                              scannedBlock_1 = replaceable.startBlock;
                                            }
                                          }
                                          _a3.label = 3;
                                        case 3:
                                          if (!(scannedBlock_1 <= blockNumber))
                                            return [3, 9];
                                          if (done) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          return [4, this.getBlockWithTransactions(scannedBlock_1)];
                                        case 4:
                                          block = _a3.sent();
                                          ti = 0;
                                          _a3.label = 5;
                                        case 5:
                                          if (!(ti < block.transactions.length))
                                            return [3, 8];
                                          tx = block.transactions[ti];
                                          if (tx.hash === transactionHash) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          if (!(tx.from === replaceable.from && tx.nonce === replaceable.nonce))
                                            return [3, 7];
                                          if (done) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          return [4, this.waitForTransaction(tx.hash, confirmations)];
                                        case 6:
                                          receipt_1 = _a3.sent();
                                          if (alreadyDone()) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          reason = "replaced";
                                          if (tx.data === replaceable.data && tx.to === replaceable.to && tx.value.eq(replaceable.value)) {
                                            reason = "repriced";
                                          } else if (tx.data === "0x" && tx.from === tx.to && tx.value.isZero()) {
                                            reason = "cancelled";
                                          }
                                          reject(logger.makeError("transaction was replaced", logger_1.Logger.errors.TRANSACTION_REPLACED, {
                                            cancelled: reason === "replaced" || reason === "cancelled",
                                            reason,
                                            replacement: this._wrapTransaction(tx),
                                            hash: transactionHash,
                                            receipt: receipt_1
                                          }));
                                          return [
                                            2
                                            /*return*/
                                          ];
                                        case 7:
                                          ti++;
                                          return [3, 5];
                                        case 8:
                                          scannedBlock_1++;
                                          return [3, 3];
                                        case 9:
                                          if (done) {
                                            return [
                                              2
                                              /*return*/
                                            ];
                                          }
                                          this.once("block", replaceHandler_1);
                                          return [
                                            2
                                            /*return*/
                                          ];
                                      }
                                    });
                                  });
                                }, function(error) {
                                  if (done) {
                                    return;
                                  }
                                  _this2.once("block", replaceHandler_1);
                                });
                                return [
                                  2
                                  /*return*/
                                ];
                            }
                          });
                        });
                      };
                      if (done) {
                        return;
                      }
                      _this.once("block", replaceHandler_1);
                      cancelFuncs.push(function() {
                        _this.removeListener("block", replaceHandler_1);
                      });
                    }
                    if (typeof timeout === "number" && timeout > 0) {
                      var timer_1 = setTimeout(function() {
                        if (alreadyDone()) {
                          return;
                        }
                        reject(logger.makeError("timeout exceeded", logger_1.Logger.errors.TIMEOUT, { timeout }));
                      }, timeout);
                      if (timer_1.unref) {
                        timer_1.unref();
                      }
                      cancelFuncs.push(function() {
                        clearTimeout(timer_1);
                      });
                    }
                  })];
              }
            });
          });
        };
        BaseProvider2.prototype.getBlockNumber = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, this._getInternalBlockNumber(0)];
            });
          });
        };
        BaseProvider2.prototype.getGasPrice = function() {
          return __awaiter(this, void 0, void 0, function() {
            var result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, this.perform("getGasPrice", {})];
                case 2:
                  result = _a.sent();
                  try {
                    return [2, bignumber_1.BigNumber.from(result)];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "getGasPrice",
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype.getBalance = function(addressOrName, blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var params, result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({
                    address: this._getAddress(addressOrName),
                    blockTag: this._getBlockTag(blockTag)
                  })];
                case 2:
                  params = _a.sent();
                  return [4, this.perform("getBalance", params)];
                case 3:
                  result = _a.sent();
                  try {
                    return [2, bignumber_1.BigNumber.from(result)];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "getBalance",
                      params,
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype.getTransactionCount = function(addressOrName, blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var params, result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({
                    address: this._getAddress(addressOrName),
                    blockTag: this._getBlockTag(blockTag)
                  })];
                case 2:
                  params = _a.sent();
                  return [4, this.perform("getTransactionCount", params)];
                case 3:
                  result = _a.sent();
                  try {
                    return [2, bignumber_1.BigNumber.from(result).toNumber()];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "getTransactionCount",
                      params,
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype.getCode = function(addressOrName, blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var params, result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({
                    address: this._getAddress(addressOrName),
                    blockTag: this._getBlockTag(blockTag)
                  })];
                case 2:
                  params = _a.sent();
                  return [4, this.perform("getCode", params)];
                case 3:
                  result = _a.sent();
                  try {
                    return [2, (0, bytes_1.hexlify)(result)];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "getCode",
                      params,
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype.getStorageAt = function(addressOrName, position, blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var params, result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({
                    address: this._getAddress(addressOrName),
                    blockTag: this._getBlockTag(blockTag),
                    position: Promise.resolve(position).then(function(p) {
                      return (0, bytes_1.hexValue)(p);
                    })
                  })];
                case 2:
                  params = _a.sent();
                  return [4, this.perform("getStorageAt", params)];
                case 3:
                  result = _a.sent();
                  try {
                    return [2, (0, bytes_1.hexlify)(result)];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "getStorageAt",
                      params,
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype._wrapTransaction = function(tx, hash, startBlock) {
          var _this = this;
          if (hash != null && (0, bytes_1.hexDataLength)(hash) !== 32) {
            throw new Error("invalid response - sendTransaction");
          }
          var result = tx;
          if (hash != null && tx.hash !== hash) {
            logger.throwError("Transaction hash mismatch from Provider.sendTransaction.", logger_1.Logger.errors.UNKNOWN_ERROR, { expectedHash: tx.hash, returnedHash: hash });
          }
          result.wait = function(confirms, timeout) {
            return __awaiter(_this, void 0, void 0, function() {
              var replacement, receipt;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    if (confirms == null) {
                      confirms = 1;
                    }
                    if (timeout == null) {
                      timeout = 0;
                    }
                    replacement = void 0;
                    if (confirms !== 0 && startBlock != null) {
                      replacement = {
                        data: tx.data,
                        from: tx.from,
                        nonce: tx.nonce,
                        to: tx.to,
                        value: tx.value,
                        startBlock
                      };
                    }
                    return [4, this._waitForTransaction(tx.hash, confirms, timeout, replacement)];
                  case 1:
                    receipt = _a.sent();
                    if (receipt == null && confirms === 0) {
                      return [2, null];
                    }
                    this._emitted["t:" + tx.hash] = receipt.blockNumber;
                    if (receipt.status === 0) {
                      logger.throwError("transaction failed", logger_1.Logger.errors.CALL_EXCEPTION, {
                        transactionHash: tx.hash,
                        transaction: tx,
                        receipt
                      });
                    }
                    return [2, receipt];
                }
              });
            });
          };
          return result;
        };
        BaseProvider2.prototype.sendTransaction = function(signedTransaction) {
          return __awaiter(this, void 0, void 0, function() {
            var hexTx, tx, blockNumber, hash, error_7;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, Promise.resolve(signedTransaction).then(function(t) {
                    return (0, bytes_1.hexlify)(t);
                  })];
                case 2:
                  hexTx = _a.sent();
                  tx = this.formatter.transaction(signedTransaction);
                  if (tx.confirmations == null) {
                    tx.confirmations = 0;
                  }
                  return [4, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                case 3:
                  blockNumber = _a.sent();
                  _a.label = 4;
                case 4:
                  _a.trys.push([4, 6, , 7]);
                  return [4, this.perform("sendTransaction", { signedTransaction: hexTx })];
                case 5:
                  hash = _a.sent();
                  return [2, this._wrapTransaction(tx, hash, blockNumber)];
                case 6:
                  error_7 = _a.sent();
                  error_7.transaction = tx;
                  error_7.transactionHash = tx.hash;
                  throw error_7;
                case 7:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype._getTransactionRequest = function(transaction) {
          return __awaiter(this, void 0, void 0, function() {
            var values, tx, _a, _b;
            var _this = this;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, transaction];
                case 1:
                  values = _c.sent();
                  tx = {};
                  ["from", "to"].forEach(function(key) {
                    if (values[key] == null) {
                      return;
                    }
                    tx[key] = Promise.resolve(values[key]).then(function(v) {
                      return v ? _this._getAddress(v) : null;
                    });
                  });
                  ["gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "value"].forEach(function(key) {
                    if (values[key] == null) {
                      return;
                    }
                    tx[key] = Promise.resolve(values[key]).then(function(v) {
                      return v ? bignumber_1.BigNumber.from(v) : null;
                    });
                  });
                  ["type"].forEach(function(key) {
                    if (values[key] == null) {
                      return;
                    }
                    tx[key] = Promise.resolve(values[key]).then(function(v) {
                      return v != null ? v : null;
                    });
                  });
                  if (values.accessList) {
                    tx.accessList = this.formatter.accessList(values.accessList);
                  }
                  ["data"].forEach(function(key) {
                    if (values[key] == null) {
                      return;
                    }
                    tx[key] = Promise.resolve(values[key]).then(function(v) {
                      return v ? (0, bytes_1.hexlify)(v) : null;
                    });
                  });
                  _b = (_a = this.formatter).transactionRequest;
                  return [4, (0, properties_1.resolveProperties)(tx)];
                case 2:
                  return [2, _b.apply(_a, [_c.sent()])];
              }
            });
          });
        };
        BaseProvider2.prototype._getFilter = function(filter) {
          return __awaiter(this, void 0, void 0, function() {
            var result, _a, _b;
            var _this = this;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, filter];
                case 1:
                  filter = _c.sent();
                  result = {};
                  if (filter.address != null) {
                    result.address = this._getAddress(filter.address);
                  }
                  ["blockHash", "topics"].forEach(function(key) {
                    if (filter[key] == null) {
                      return;
                    }
                    result[key] = filter[key];
                  });
                  ["fromBlock", "toBlock"].forEach(function(key) {
                    if (filter[key] == null) {
                      return;
                    }
                    result[key] = _this._getBlockTag(filter[key]);
                  });
                  _b = (_a = this.formatter).filter;
                  return [4, (0, properties_1.resolveProperties)(result)];
                case 2:
                  return [2, _b.apply(_a, [_c.sent()])];
              }
            });
          });
        };
        BaseProvider2.prototype._call = function(transaction, blockTag, attempt) {
          return __awaiter(this, void 0, void 0, function() {
            var txSender, result, data, sender, urls, urlsOffset, urlsLength, urlsData, u, url, calldata, callbackSelector, extraData, ccipResult, tx, error_8;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (attempt >= MAX_CCIP_REDIRECTS) {
                    logger.throwError("CCIP read exceeded maximum redirections", logger_1.Logger.errors.SERVER_ERROR, {
                      redirects: attempt,
                      transaction
                    });
                  }
                  txSender = transaction.to;
                  return [4, this.perform("call", { transaction, blockTag })];
                case 1:
                  result = _a.sent();
                  if (!(attempt >= 0 && blockTag === "latest" && txSender != null && result.substring(0, 10) === "0x556f1830" && (0, bytes_1.hexDataLength)(result) % 32 === 4))
                    return [3, 5];
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 5]);
                  data = (0, bytes_1.hexDataSlice)(result, 4);
                  sender = (0, bytes_1.hexDataSlice)(data, 0, 32);
                  if (!bignumber_1.BigNumber.from(sender).eq(txSender)) {
                    logger.throwError("CCIP Read sender did not match", logger_1.Logger.errors.CALL_EXCEPTION, {
                      name: "OffchainLookup",
                      signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                      transaction,
                      data: result
                    });
                  }
                  urls = [];
                  urlsOffset = bignumber_1.BigNumber.from((0, bytes_1.hexDataSlice)(data, 32, 64)).toNumber();
                  urlsLength = bignumber_1.BigNumber.from((0, bytes_1.hexDataSlice)(data, urlsOffset, urlsOffset + 32)).toNumber();
                  urlsData = (0, bytes_1.hexDataSlice)(data, urlsOffset + 32);
                  for (u = 0; u < urlsLength; u++) {
                    url = _parseString(urlsData, u * 32);
                    if (url == null) {
                      logger.throwError("CCIP Read contained corrupt URL string", logger_1.Logger.errors.CALL_EXCEPTION, {
                        name: "OffchainLookup",
                        signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                        transaction,
                        data: result
                      });
                    }
                    urls.push(url);
                  }
                  calldata = _parseBytes(data, 64);
                  if (!bignumber_1.BigNumber.from((0, bytes_1.hexDataSlice)(data, 100, 128)).isZero()) {
                    logger.throwError("CCIP Read callback selector included junk", logger_1.Logger.errors.CALL_EXCEPTION, {
                      name: "OffchainLookup",
                      signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                      transaction,
                      data: result
                    });
                  }
                  callbackSelector = (0, bytes_1.hexDataSlice)(data, 96, 100);
                  extraData = _parseBytes(data, 128);
                  return [4, this.ccipReadFetch(transaction, calldata, urls)];
                case 3:
                  ccipResult = _a.sent();
                  if (ccipResult == null) {
                    logger.throwError("CCIP Read disabled or provided no URLs", logger_1.Logger.errors.CALL_EXCEPTION, {
                      name: "OffchainLookup",
                      signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                      transaction,
                      data: result
                    });
                  }
                  tx = {
                    to: txSender,
                    data: (0, bytes_1.hexConcat)([callbackSelector, encodeBytes([ccipResult, extraData])])
                  };
                  return [2, this._call(tx, blockTag, attempt + 1)];
                case 4:
                  error_8 = _a.sent();
                  if (error_8.code === logger_1.Logger.errors.SERVER_ERROR) {
                    throw error_8;
                  }
                  return [3, 5];
                case 5:
                  try {
                    return [2, (0, bytes_1.hexlify)(result)];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "call",
                      params: { transaction, blockTag },
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype.call = function(transaction, blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var resolved;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({
                    transaction: this._getTransactionRequest(transaction),
                    blockTag: this._getBlockTag(blockTag),
                    ccipReadEnabled: Promise.resolve(transaction.ccipReadEnabled)
                  })];
                case 2:
                  resolved = _a.sent();
                  return [2, this._call(resolved.transaction, resolved.blockTag, resolved.ccipReadEnabled ? 0 : -1)];
              }
            });
          });
        };
        BaseProvider2.prototype.estimateGas = function(transaction) {
          return __awaiter(this, void 0, void 0, function() {
            var params, result;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({
                    transaction: this._getTransactionRequest(transaction)
                  })];
                case 2:
                  params = _a.sent();
                  return [4, this.perform("estimateGas", params)];
                case 3:
                  result = _a.sent();
                  try {
                    return [2, bignumber_1.BigNumber.from(result)];
                  } catch (error) {
                    return [2, logger.throwError("bad result from backend", logger_1.Logger.errors.SERVER_ERROR, {
                      method: "estimateGas",
                      params,
                      result,
                      error
                    })];
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype._getAddress = function(addressOrName) {
          return __awaiter(this, void 0, void 0, function() {
            var address;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, addressOrName];
                case 1:
                  addressOrName = _a.sent();
                  if (typeof addressOrName !== "string") {
                    logger.throwArgumentError("invalid address or ENS name", "name", addressOrName);
                  }
                  return [4, this.resolveName(addressOrName)];
                case 2:
                  address = _a.sent();
                  if (address == null) {
                    logger.throwError("ENS name not configured", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                      operation: "resolveName(" + JSON.stringify(addressOrName) + ")"
                    });
                  }
                  return [2, address];
              }
            });
          });
        };
        BaseProvider2.prototype._getBlock = function(blockHashOrBlockTag, includeTransactions) {
          return __awaiter(this, void 0, void 0, function() {
            var blockNumber, params, _a, error_9;
            var _this = this;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _b.sent();
                  return [4, blockHashOrBlockTag];
                case 2:
                  blockHashOrBlockTag = _b.sent();
                  blockNumber = -128;
                  params = {
                    includeTransactions: !!includeTransactions
                  };
                  if (!(0, bytes_1.isHexString)(blockHashOrBlockTag, 32))
                    return [3, 3];
                  params.blockHash = blockHashOrBlockTag;
                  return [3, 6];
                case 3:
                  _b.trys.push([3, 5, , 6]);
                  _a = params;
                  return [4, this._getBlockTag(blockHashOrBlockTag)];
                case 4:
                  _a.blockTag = _b.sent();
                  if ((0, bytes_1.isHexString)(params.blockTag)) {
                    blockNumber = parseInt(params.blockTag.substring(2), 16);
                  }
                  return [3, 6];
                case 5:
                  error_9 = _b.sent();
                  logger.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", blockHashOrBlockTag);
                  return [3, 6];
                case 6:
                  return [2, (0, web_1.poll)(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var block, blockNumber_1, i, tx, confirmations, blockWithTxs;
                      var _this2 = this;
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            return [4, this.perform("getBlock", params)];
                          case 1:
                            block = _a2.sent();
                            if (block == null) {
                              if (params.blockHash != null) {
                                if (this._emitted["b:" + params.blockHash] == null) {
                                  return [2, null];
                                }
                              }
                              if (params.blockTag != null) {
                                if (blockNumber > this._emitted.block) {
                                  return [2, null];
                                }
                              }
                              return [2, void 0];
                            }
                            if (!includeTransactions)
                              return [3, 8];
                            blockNumber_1 = null;
                            i = 0;
                            _a2.label = 2;
                          case 2:
                            if (!(i < block.transactions.length))
                              return [3, 7];
                            tx = block.transactions[i];
                            if (!(tx.blockNumber == null))
                              return [3, 3];
                            tx.confirmations = 0;
                            return [3, 6];
                          case 3:
                            if (!(tx.confirmations == null))
                              return [3, 6];
                            if (!(blockNumber_1 == null))
                              return [3, 5];
                            return [4, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                          case 4:
                            blockNumber_1 = _a2.sent();
                            _a2.label = 5;
                          case 5:
                            confirmations = blockNumber_1 - tx.blockNumber + 1;
                            if (confirmations <= 0) {
                              confirmations = 1;
                            }
                            tx.confirmations = confirmations;
                            _a2.label = 6;
                          case 6:
                            i++;
                            return [3, 2];
                          case 7:
                            blockWithTxs = this.formatter.blockWithTransactions(block);
                            blockWithTxs.transactions = blockWithTxs.transactions.map(function(tx2) {
                              return _this2._wrapTransaction(tx2);
                            });
                            return [2, blockWithTxs];
                          case 8:
                            return [2, this.formatter.block(block)];
                        }
                      });
                    });
                  }, { oncePoll: this })];
              }
            });
          });
        };
        BaseProvider2.prototype.getBlock = function(blockHashOrBlockTag) {
          return this._getBlock(blockHashOrBlockTag, false);
        };
        BaseProvider2.prototype.getBlockWithTransactions = function(blockHashOrBlockTag) {
          return this._getBlock(blockHashOrBlockTag, true);
        };
        BaseProvider2.prototype.getTransaction = function(transactionHash) {
          return __awaiter(this, void 0, void 0, function() {
            var params;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, transactionHash];
                case 2:
                  transactionHash = _a.sent();
                  params = { transactionHash: this.formatter.hash(transactionHash, true) };
                  return [2, (0, web_1.poll)(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var result, tx, blockNumber, confirmations;
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            return [4, this.perform("getTransaction", params)];
                          case 1:
                            result = _a2.sent();
                            if (result == null) {
                              if (this._emitted["t:" + transactionHash] == null) {
                                return [2, null];
                              }
                              return [2, void 0];
                            }
                            tx = this.formatter.transactionResponse(result);
                            if (!(tx.blockNumber == null))
                              return [3, 2];
                            tx.confirmations = 0;
                            return [3, 4];
                          case 2:
                            if (!(tx.confirmations == null))
                              return [3, 4];
                            return [4, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                          case 3:
                            blockNumber = _a2.sent();
                            confirmations = blockNumber - tx.blockNumber + 1;
                            if (confirmations <= 0) {
                              confirmations = 1;
                            }
                            tx.confirmations = confirmations;
                            _a2.label = 4;
                          case 4:
                            return [2, this._wrapTransaction(tx)];
                        }
                      });
                    });
                  }, { oncePoll: this })];
              }
            });
          });
        };
        BaseProvider2.prototype.getTransactionReceipt = function(transactionHash) {
          return __awaiter(this, void 0, void 0, function() {
            var params;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, transactionHash];
                case 2:
                  transactionHash = _a.sent();
                  params = { transactionHash: this.formatter.hash(transactionHash, true) };
                  return [2, (0, web_1.poll)(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var result, receipt, blockNumber, confirmations;
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            return [4, this.perform("getTransactionReceipt", params)];
                          case 1:
                            result = _a2.sent();
                            if (result == null) {
                              if (this._emitted["t:" + transactionHash] == null) {
                                return [2, null];
                              }
                              return [2, void 0];
                            }
                            if (result.blockHash == null) {
                              return [2, void 0];
                            }
                            receipt = this.formatter.receipt(result);
                            if (!(receipt.blockNumber == null))
                              return [3, 2];
                            receipt.confirmations = 0;
                            return [3, 4];
                          case 2:
                            if (!(receipt.confirmations == null))
                              return [3, 4];
                            return [4, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                          case 3:
                            blockNumber = _a2.sent();
                            confirmations = blockNumber - receipt.blockNumber + 1;
                            if (confirmations <= 0) {
                              confirmations = 1;
                            }
                            receipt.confirmations = confirmations;
                            _a2.label = 4;
                          case 4:
                            return [2, receipt];
                        }
                      });
                    });
                  }, { oncePoll: this })];
              }
            });
          });
        };
        BaseProvider2.prototype.getLogs = function(filter) {
          return __awaiter(this, void 0, void 0, function() {
            var params, logs;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [4, (0, properties_1.resolveProperties)({ filter: this._getFilter(filter) })];
                case 2:
                  params = _a.sent();
                  return [4, this.perform("getLogs", params)];
                case 3:
                  logs = _a.sent();
                  logs.forEach(function(log) {
                    if (log.removed == null) {
                      log.removed = false;
                    }
                  });
                  return [2, formatter_1.Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs)];
              }
            });
          });
        };
        BaseProvider2.prototype.getEtherPrice = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.getNetwork()];
                case 1:
                  _a.sent();
                  return [2, this.perform("getEtherPrice", {})];
              }
            });
          });
        };
        BaseProvider2.prototype._getBlockTag = function(blockTag) {
          return __awaiter(this, void 0, void 0, function() {
            var blockNumber;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, blockTag];
                case 1:
                  blockTag = _a.sent();
                  if (!(typeof blockTag === "number" && blockTag < 0))
                    return [3, 3];
                  if (blockTag % 1) {
                    logger.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
                  }
                  return [4, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                case 2:
                  blockNumber = _a.sent();
                  blockNumber += blockTag;
                  if (blockNumber < 0) {
                    blockNumber = 0;
                  }
                  return [2, this.formatter.blockTag(blockNumber)];
                case 3:
                  return [2, this.formatter.blockTag(blockTag)];
              }
            });
          });
        };
        BaseProvider2.prototype.getResolver = function(name) {
          return __awaiter(this, void 0, void 0, function() {
            var currentName, addr, resolver, _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  currentName = name;
                  _b.label = 1;
                case 1:
                  if (false)
                    return [3, 6];
                  if (currentName === "" || currentName === ".") {
                    return [2, null];
                  }
                  if (name !== "eth" && currentName === "eth") {
                    return [2, null];
                  }
                  return [4, this._getResolver(currentName, "getResolver")];
                case 2:
                  addr = _b.sent();
                  if (!(addr != null))
                    return [3, 5];
                  resolver = new Resolver(this, addr, name);
                  _a = currentName !== name;
                  if (!_a)
                    return [3, 4];
                  return [4, resolver.supportsWildcard()];
                case 3:
                  _a = !_b.sent();
                  _b.label = 4;
                case 4:
                  if (_a) {
                    return [2, null];
                  }
                  return [2, resolver];
                case 5:
                  currentName = currentName.split(".").slice(1).join(".");
                  return [3, 1];
                case 6:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BaseProvider2.prototype._getResolver = function(name, operation) {
          return __awaiter(this, void 0, void 0, function() {
            var network, addrData, error_10;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (operation == null) {
                    operation = "ENS";
                  }
                  return [4, this.getNetwork()];
                case 1:
                  network = _a.sent();
                  if (!network.ensAddress) {
                    logger.throwError("network does not support ENS", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation, network: network.name });
                  }
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 5]);
                  return [4, this.call({
                    to: network.ensAddress,
                    data: "0x0178b8bf" + (0, hash_1.namehash)(name).substring(2)
                  })];
                case 3:
                  addrData = _a.sent();
                  return [2, this.formatter.callAddress(addrData)];
                case 4:
                  error_10 = _a.sent();
                  return [3, 5];
                case 5:
                  return [2, null];
              }
            });
          });
        };
        BaseProvider2.prototype.resolveName = function(name) {
          return __awaiter(this, void 0, void 0, function() {
            var resolver;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, name];
                case 1:
                  name = _a.sent();
                  try {
                    return [2, Promise.resolve(this.formatter.address(name))];
                  } catch (error) {
                    if ((0, bytes_1.isHexString)(name)) {
                      throw error;
                    }
                  }
                  if (typeof name !== "string") {
                    logger.throwArgumentError("invalid ENS name", "name", name);
                  }
                  return [4, this.getResolver(name)];
                case 2:
                  resolver = _a.sent();
                  if (!resolver) {
                    return [2, null];
                  }
                  return [4, resolver.getAddress()];
                case 3:
                  return [2, _a.sent()];
              }
            });
          });
        };
        BaseProvider2.prototype.lookupAddress = function(address) {
          return __awaiter(this, void 0, void 0, function() {
            var node, resolverAddr, name, _a, addr;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, address];
                case 1:
                  address = _b.sent();
                  address = this.formatter.address(address);
                  node = address.substring(2).toLowerCase() + ".addr.reverse";
                  return [4, this._getResolver(node, "lookupAddress")];
                case 2:
                  resolverAddr = _b.sent();
                  if (resolverAddr == null) {
                    return [2, null];
                  }
                  _a = _parseString;
                  return [4, this.call({
                    to: resolverAddr,
                    data: "0x691f3431" + (0, hash_1.namehash)(node).substring(2)
                  })];
                case 3:
                  name = _a.apply(void 0, [_b.sent(), 0]);
                  return [4, this.resolveName(name)];
                case 4:
                  addr = _b.sent();
                  if (addr != address) {
                    return [2, null];
                  }
                  return [2, name];
              }
            });
          });
        };
        BaseProvider2.prototype.getAvatar = function(nameOrAddress) {
          return __awaiter(this, void 0, void 0, function() {
            var resolver, address, node, resolverAddress, avatar_1, error_11, name_1, _a, error_12, avatar;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  resolver = null;
                  if (!(0, bytes_1.isHexString)(nameOrAddress))
                    return [3, 10];
                  address = this.formatter.address(nameOrAddress);
                  node = address.substring(2).toLowerCase() + ".addr.reverse";
                  return [4, this._getResolver(node, "getAvatar")];
                case 1:
                  resolverAddress = _b.sent();
                  if (!resolverAddress) {
                    return [2, null];
                  }
                  resolver = new Resolver(this, resolverAddress, node);
                  _b.label = 2;
                case 2:
                  _b.trys.push([2, 4, , 5]);
                  return [4, resolver.getAvatar()];
                case 3:
                  avatar_1 = _b.sent();
                  if (avatar_1) {
                    return [2, avatar_1.url];
                  }
                  return [3, 5];
                case 4:
                  error_11 = _b.sent();
                  if (error_11.code !== logger_1.Logger.errors.CALL_EXCEPTION) {
                    throw error_11;
                  }
                  return [3, 5];
                case 5:
                  _b.trys.push([5, 8, , 9]);
                  _a = _parseString;
                  return [4, this.call({
                    to: resolverAddress,
                    data: "0x691f3431" + (0, hash_1.namehash)(node).substring(2)
                  })];
                case 6:
                  name_1 = _a.apply(void 0, [_b.sent(), 0]);
                  return [4, this.getResolver(name_1)];
                case 7:
                  resolver = _b.sent();
                  return [3, 9];
                case 8:
                  error_12 = _b.sent();
                  if (error_12.code !== logger_1.Logger.errors.CALL_EXCEPTION) {
                    throw error_12;
                  }
                  return [2, null];
                case 9:
                  return [3, 12];
                case 10:
                  return [4, this.getResolver(nameOrAddress)];
                case 11:
                  resolver = _b.sent();
                  if (!resolver) {
                    return [2, null];
                  }
                  _b.label = 12;
                case 12:
                  return [4, resolver.getAvatar()];
                case 13:
                  avatar = _b.sent();
                  if (avatar == null) {
                    return [2, null];
                  }
                  return [2, avatar.url];
              }
            });
          });
        };
        BaseProvider2.prototype.perform = function(method, params) {
          return logger.throwError(method + " not implemented", logger_1.Logger.errors.NOT_IMPLEMENTED, { operation: method });
        };
        BaseProvider2.prototype._startEvent = function(event) {
          this.polling = this._events.filter(function(e) {
            return e.pollable();
          }).length > 0;
        };
        BaseProvider2.prototype._stopEvent = function(event) {
          this.polling = this._events.filter(function(e) {
            return e.pollable();
          }).length > 0;
        };
        BaseProvider2.prototype._addEventListener = function(eventName, listener, once) {
          var event = new Event(getEventTag(eventName), listener, once);
          this._events.push(event);
          this._startEvent(event);
          return this;
        };
        BaseProvider2.prototype.on = function(eventName, listener) {
          return this._addEventListener(eventName, listener, false);
        };
        BaseProvider2.prototype.once = function(eventName, listener) {
          return this._addEventListener(eventName, listener, true);
        };
        BaseProvider2.prototype.emit = function(eventName) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
          }
          var result = false;
          var stopped = [];
          var eventTag = getEventTag(eventName);
          this._events = this._events.filter(function(event) {
            if (event.tag !== eventTag) {
              return true;
            }
            setTimeout(function() {
              event.listener.apply(_this, args);
            }, 0);
            result = true;
            if (event.once) {
              stopped.push(event);
              return false;
            }
            return true;
          });
          stopped.forEach(function(event) {
            _this._stopEvent(event);
          });
          return result;
        };
        BaseProvider2.prototype.listenerCount = function(eventName) {
          if (!eventName) {
            return this._events.length;
          }
          var eventTag = getEventTag(eventName);
          return this._events.filter(function(event) {
            return event.tag === eventTag;
          }).length;
        };
        BaseProvider2.prototype.listeners = function(eventName) {
          if (eventName == null) {
            return this._events.map(function(event) {
              return event.listener;
            });
          }
          var eventTag = getEventTag(eventName);
          return this._events.filter(function(event) {
            return event.tag === eventTag;
          }).map(function(event) {
            return event.listener;
          });
        };
        BaseProvider2.prototype.off = function(eventName, listener) {
          var _this = this;
          if (listener == null) {
            return this.removeAllListeners(eventName);
          }
          var stopped = [];
          var found = false;
          var eventTag = getEventTag(eventName);
          this._events = this._events.filter(function(event) {
            if (event.tag !== eventTag || event.listener != listener) {
              return true;
            }
            if (found) {
              return true;
            }
            found = true;
            stopped.push(event);
            return false;
          });
          stopped.forEach(function(event) {
            _this._stopEvent(event);
          });
          return this;
        };
        BaseProvider2.prototype.removeAllListeners = function(eventName) {
          var _this = this;
          var stopped = [];
          if (eventName == null) {
            stopped = this._events;
            this._events = [];
          } else {
            var eventTag_1 = getEventTag(eventName);
            this._events = this._events.filter(function(event) {
              if (event.tag !== eventTag_1) {
                return true;
              }
              stopped.push(event);
              return false;
            });
          }
          stopped.forEach(function(event) {
            _this._stopEvent(event);
          });
          return this;
        };
        return BaseProvider2;
      }(abstract_provider_1.Provider)
    );
    exports.BaseProvider = BaseProvider;
  }
});

// node_modules/@ethersproject/providers/lib/json-rpc-provider.js
var require_json_rpc_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/json-rpc-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonRpcProvider = exports.JsonRpcSigner = void 0;
    var abstract_signer_1 = require_lib17();
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var hash_1 = require_lib13();
    var properties_1 = require_lib8();
    var strings_1 = require_lib11();
    var transactions_1 = require_lib10();
    var web_1 = require_lib28();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var base_provider_1 = require_base_provider();
    var errorGas = ["call", "estimateGas"];
    function spelunk(value, requireData) {
      if (value == null) {
        return null;
      }
      if (typeof value.message === "string" && value.message.match("reverted")) {
        var data = (0, bytes_1.isHexString)(value.data) ? value.data : null;
        if (!requireData || data) {
          return { message: value.message, data };
        }
      }
      if (typeof value === "object") {
        for (var key in value) {
          var result = spelunk(value[key], requireData);
          if (result) {
            return result;
          }
        }
        return null;
      }
      if (typeof value === "string") {
        try {
          return spelunk(JSON.parse(value), requireData);
        } catch (error) {
        }
      }
      return null;
    }
    function checkError(method, error, params) {
      var transaction = params.transaction || params.signedTransaction;
      if (method === "call") {
        var result = spelunk(error, true);
        if (result) {
          return result.data;
        }
        logger.throwError("missing revert data in call exception; Transaction reverted without a reason string", logger_1.Logger.errors.CALL_EXCEPTION, {
          data: "0x",
          transaction,
          error
        });
      }
      if (method === "estimateGas") {
        var result = spelunk(error.body, false);
        if (result == null) {
          result = spelunk(error, false);
        }
        if (result) {
          logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", logger_1.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
            reason: result.message,
            method,
            transaction,
            error
          });
        }
      }
      var message = error.message;
      if (error.code === logger_1.Logger.errors.SERVER_ERROR && error.error && typeof error.error.message === "string") {
        message = error.error.message;
      } else if (typeof error.body === "string") {
        message = error.body;
      } else if (typeof error.responseText === "string") {
        message = error.responseText;
      }
      message = (message || "").toLowerCase();
      if (message.match(/insufficient funds|base fee exceeds gas limit|InsufficientFunds/i)) {
        logger.throwError("insufficient funds for intrinsic transaction cost", logger_1.Logger.errors.INSUFFICIENT_FUNDS, {
          error,
          method,
          transaction
        });
      }
      if (message.match(/nonce (is )?too low/i)) {
        logger.throwError("nonce has already been used", logger_1.Logger.errors.NONCE_EXPIRED, {
          error,
          method,
          transaction
        });
      }
      if (message.match(/replacement transaction underpriced|transaction gas price.*too low/i)) {
        logger.throwError("replacement fee too low", logger_1.Logger.errors.REPLACEMENT_UNDERPRICED, {
          error,
          method,
          transaction
        });
      }
      if (message.match(/only replay-protected/i)) {
        logger.throwError("legacy pre-eip-155 transactions not supported", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
          error,
          method,
          transaction
        });
      }
      if (errorGas.indexOf(method) >= 0 && message.match(/gas required exceeds allowance|always failing transaction|execution reverted|revert/)) {
        logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", logger_1.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
          error,
          method,
          transaction
        });
      }
      throw error;
    }
    function timer(timeout) {
      return new Promise(function(resolve) {
        setTimeout(resolve, timeout);
      });
    }
    function getResult(payload) {
      if (payload.error) {
        var error = new Error(payload.error.message);
        error.code = payload.error.code;
        error.data = payload.error.data;
        throw error;
      }
      return payload.result;
    }
    function getLowerCase(value) {
      if (value) {
        return value.toLowerCase();
      }
      return value;
    }
    var _constructorGuard = {};
    var JsonRpcSigner = (
      /** @class */
      function(_super) {
        __extends(JsonRpcSigner2, _super);
        function JsonRpcSigner2(constructorGuard, provider, addressOrIndex) {
          var _this = _super.call(this) || this;
          if (constructorGuard !== _constructorGuard) {
            throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");
          }
          (0, properties_1.defineReadOnly)(_this, "provider", provider);
          if (addressOrIndex == null) {
            addressOrIndex = 0;
          }
          if (typeof addressOrIndex === "string") {
            (0, properties_1.defineReadOnly)(_this, "_address", _this.provider.formatter.address(addressOrIndex));
            (0, properties_1.defineReadOnly)(_this, "_index", null);
          } else if (typeof addressOrIndex === "number") {
            (0, properties_1.defineReadOnly)(_this, "_index", addressOrIndex);
            (0, properties_1.defineReadOnly)(_this, "_address", null);
          } else {
            logger.throwArgumentError("invalid address or index", "addressOrIndex", addressOrIndex);
          }
          return _this;
        }
        JsonRpcSigner2.prototype.connect = function(provider) {
          return logger.throwError("cannot alter JSON-RPC Signer connection", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "connect"
          });
        };
        JsonRpcSigner2.prototype.connectUnchecked = function() {
          return new UncheckedJsonRpcSigner(_constructorGuard, this.provider, this._address || this._index);
        };
        JsonRpcSigner2.prototype.getAddress = function() {
          var _this = this;
          if (this._address) {
            return Promise.resolve(this._address);
          }
          return this.provider.send("eth_accounts", []).then(function(accounts) {
            if (accounts.length <= _this._index) {
              logger.throwError("unknown account #" + _this._index, logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "getAddress"
              });
            }
            return _this.provider.formatter.address(accounts[_this._index]);
          });
        };
        JsonRpcSigner2.prototype.sendUncheckedTransaction = function(transaction) {
          var _this = this;
          transaction = (0, properties_1.shallowCopy)(transaction);
          var fromAddress = this.getAddress().then(function(address) {
            if (address) {
              address = address.toLowerCase();
            }
            return address;
          });
          if (transaction.gasLimit == null) {
            var estimate = (0, properties_1.shallowCopy)(transaction);
            estimate.from = fromAddress;
            transaction.gasLimit = this.provider.estimateGas(estimate);
          }
          if (transaction.to != null) {
            transaction.to = Promise.resolve(transaction.to).then(function(to) {
              return __awaiter(_this, void 0, void 0, function() {
                var address;
                return __generator(this, function(_a) {
                  switch (_a.label) {
                    case 0:
                      if (to == null) {
                        return [2, null];
                      }
                      return [4, this.provider.resolveName(to)];
                    case 1:
                      address = _a.sent();
                      if (address == null) {
                        logger.throwArgumentError("provided ENS name resolves to null", "tx.to", to);
                      }
                      return [2, address];
                  }
                });
              });
            });
          }
          return (0, properties_1.resolveProperties)({
            tx: (0, properties_1.resolveProperties)(transaction),
            sender: fromAddress
          }).then(function(_a) {
            var tx = _a.tx, sender = _a.sender;
            if (tx.from != null) {
              if (tx.from.toLowerCase() !== sender) {
                logger.throwArgumentError("from address mismatch", "transaction", transaction);
              }
            } else {
              tx.from = sender;
            }
            var hexTx = _this.provider.constructor.hexlifyTransaction(tx, { from: true });
            return _this.provider.send("eth_sendTransaction", [hexTx]).then(function(hash) {
              return hash;
            }, function(error) {
              if (typeof error.message === "string" && error.message.match(/user denied/i)) {
                logger.throwError("user rejected transaction", logger_1.Logger.errors.ACTION_REJECTED, {
                  action: "sendTransaction",
                  transaction: tx
                });
              }
              return checkError("sendTransaction", error, hexTx);
            });
          });
        };
        JsonRpcSigner2.prototype.signTransaction = function(transaction) {
          return logger.throwError("signing transactions is unsupported", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "signTransaction"
          });
        };
        JsonRpcSigner2.prototype.sendTransaction = function(transaction) {
          return __awaiter(this, void 0, void 0, function() {
            var blockNumber, hash, error_1;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.provider._getInternalBlockNumber(100 + 2 * this.provider.pollingInterval)];
                case 1:
                  blockNumber = _a.sent();
                  return [4, this.sendUncheckedTransaction(transaction)];
                case 2:
                  hash = _a.sent();
                  _a.label = 3;
                case 3:
                  _a.trys.push([3, 5, , 6]);
                  return [4, (0, web_1.poll)(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var tx;
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            return [4, this.provider.getTransaction(hash)];
                          case 1:
                            tx = _a2.sent();
                            if (tx === null) {
                              return [2, void 0];
                            }
                            return [2, this.provider._wrapTransaction(tx, hash, blockNumber)];
                        }
                      });
                    });
                  }, { oncePoll: this.provider })];
                case 4:
                  return [2, _a.sent()];
                case 5:
                  error_1 = _a.sent();
                  error_1.transactionHash = hash;
                  throw error_1;
                case 6:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        JsonRpcSigner2.prototype.signMessage = function(message) {
          return __awaiter(this, void 0, void 0, function() {
            var data, address, error_2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  data = typeof message === "string" ? (0, strings_1.toUtf8Bytes)(message) : message;
                  return [4, this.getAddress()];
                case 1:
                  address = _a.sent();
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 5]);
                  return [4, this.provider.send("personal_sign", [(0, bytes_1.hexlify)(data), address.toLowerCase()])];
                case 3:
                  return [2, _a.sent()];
                case 4:
                  error_2 = _a.sent();
                  if (typeof error_2.message === "string" && error_2.message.match(/user denied/i)) {
                    logger.throwError("user rejected signing", logger_1.Logger.errors.ACTION_REJECTED, {
                      action: "signMessage",
                      from: address,
                      messageData: message
                    });
                  }
                  throw error_2;
                case 5:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        JsonRpcSigner2.prototype._legacySignMessage = function(message) {
          return __awaiter(this, void 0, void 0, function() {
            var data, address, error_3;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  data = typeof message === "string" ? (0, strings_1.toUtf8Bytes)(message) : message;
                  return [4, this.getAddress()];
                case 1:
                  address = _a.sent();
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 5]);
                  return [4, this.provider.send("eth_sign", [address.toLowerCase(), (0, bytes_1.hexlify)(data)])];
                case 3:
                  return [2, _a.sent()];
                case 4:
                  error_3 = _a.sent();
                  if (typeof error_3.message === "string" && error_3.message.match(/user denied/i)) {
                    logger.throwError("user rejected signing", logger_1.Logger.errors.ACTION_REJECTED, {
                      action: "_legacySignMessage",
                      from: address,
                      messageData: message
                    });
                  }
                  throw error_3;
                case 5:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        JsonRpcSigner2.prototype._signTypedData = function(domain, types, value) {
          return __awaiter(this, void 0, void 0, function() {
            var populated, address, error_4;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, hash_1._TypedDataEncoder.resolveNames(domain, types, value, function(name) {
                    return _this.provider.resolveName(name);
                  })];
                case 1:
                  populated = _a.sent();
                  return [4, this.getAddress()];
                case 2:
                  address = _a.sent();
                  _a.label = 3;
                case 3:
                  _a.trys.push([3, 5, , 6]);
                  return [4, this.provider.send("eth_signTypedData_v4", [
                    address.toLowerCase(),
                    JSON.stringify(hash_1._TypedDataEncoder.getPayload(populated.domain, types, populated.value))
                  ])];
                case 4:
                  return [2, _a.sent()];
                case 5:
                  error_4 = _a.sent();
                  if (typeof error_4.message === "string" && error_4.message.match(/user denied/i)) {
                    logger.throwError("user rejected signing", logger_1.Logger.errors.ACTION_REJECTED, {
                      action: "_signTypedData",
                      from: address,
                      messageData: { domain: populated.domain, types, value: populated.value }
                    });
                  }
                  throw error_4;
                case 6:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        JsonRpcSigner2.prototype.unlock = function(password) {
          return __awaiter(this, void 0, void 0, function() {
            var provider, address;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  provider = this.provider;
                  return [4, this.getAddress()];
                case 1:
                  address = _a.sent();
                  return [2, provider.send("personal_unlockAccount", [address.toLowerCase(), password, null])];
              }
            });
          });
        };
        return JsonRpcSigner2;
      }(abstract_signer_1.Signer)
    );
    exports.JsonRpcSigner = JsonRpcSigner;
    var UncheckedJsonRpcSigner = (
      /** @class */
      function(_super) {
        __extends(UncheckedJsonRpcSigner2, _super);
        function UncheckedJsonRpcSigner2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        UncheckedJsonRpcSigner2.prototype.sendTransaction = function(transaction) {
          var _this = this;
          return this.sendUncheckedTransaction(transaction).then(function(hash) {
            return {
              hash,
              nonce: null,
              gasLimit: null,
              gasPrice: null,
              data: null,
              value: null,
              chainId: null,
              confirmations: 0,
              from: null,
              wait: function(confirmations) {
                return _this.provider.waitForTransaction(hash, confirmations);
              }
            };
          });
        };
        return UncheckedJsonRpcSigner2;
      }(JsonRpcSigner)
    );
    var allowedTransactionKeys = {
      chainId: true,
      data: true,
      gasLimit: true,
      gasPrice: true,
      nonce: true,
      to: true,
      value: true,
      type: true,
      accessList: true,
      maxFeePerGas: true,
      maxPriorityFeePerGas: true
    };
    var JsonRpcProvider = (
      /** @class */
      function(_super) {
        __extends(JsonRpcProvider2, _super);
        function JsonRpcProvider2(url, network) {
          var _this = this;
          var networkOrReady = network;
          if (networkOrReady == null) {
            networkOrReady = new Promise(function(resolve, reject) {
              setTimeout(function() {
                _this.detectNetwork().then(function(network2) {
                  resolve(network2);
                }, function(error) {
                  reject(error);
                });
              }, 0);
            });
          }
          _this = _super.call(this, networkOrReady) || this;
          if (!url) {
            url = (0, properties_1.getStatic)(_this.constructor, "defaultUrl")();
          }
          if (typeof url === "string") {
            (0, properties_1.defineReadOnly)(_this, "connection", Object.freeze({
              url
            }));
          } else {
            (0, properties_1.defineReadOnly)(_this, "connection", Object.freeze((0, properties_1.shallowCopy)(url)));
          }
          _this._nextId = 42;
          return _this;
        }
        Object.defineProperty(JsonRpcProvider2.prototype, "_cache", {
          get: function() {
            if (this._eventLoopCache == null) {
              this._eventLoopCache = {};
            }
            return this._eventLoopCache;
          },
          enumerable: false,
          configurable: true
        });
        JsonRpcProvider2.defaultUrl = function() {
          return "http://localhost:8545";
        };
        JsonRpcProvider2.prototype.detectNetwork = function() {
          var _this = this;
          if (!this._cache["detectNetwork"]) {
            this._cache["detectNetwork"] = this._uncachedDetectNetwork();
            setTimeout(function() {
              _this._cache["detectNetwork"] = null;
            }, 0);
          }
          return this._cache["detectNetwork"];
        };
        JsonRpcProvider2.prototype._uncachedDetectNetwork = function() {
          return __awaiter(this, void 0, void 0, function() {
            var chainId, error_5, error_6, getNetwork;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, timer(0)];
                case 1:
                  _a.sent();
                  chainId = null;
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 9]);
                  return [4, this.send("eth_chainId", [])];
                case 3:
                  chainId = _a.sent();
                  return [3, 9];
                case 4:
                  error_5 = _a.sent();
                  _a.label = 5;
                case 5:
                  _a.trys.push([5, 7, , 8]);
                  return [4, this.send("net_version", [])];
                case 6:
                  chainId = _a.sent();
                  return [3, 8];
                case 7:
                  error_6 = _a.sent();
                  return [3, 8];
                case 8:
                  return [3, 9];
                case 9:
                  if (chainId != null) {
                    getNetwork = (0, properties_1.getStatic)(this.constructor, "getNetwork");
                    try {
                      return [2, getNetwork(bignumber_1.BigNumber.from(chainId).toNumber())];
                    } catch (error) {
                      return [2, logger.throwError("could not detect network", logger_1.Logger.errors.NETWORK_ERROR, {
                        chainId,
                        event: "invalidNetwork",
                        serverError: error
                      })];
                    }
                  }
                  return [2, logger.throwError("could not detect network", logger_1.Logger.errors.NETWORK_ERROR, {
                    event: "noNetwork"
                  })];
              }
            });
          });
        };
        JsonRpcProvider2.prototype.getSigner = function(addressOrIndex) {
          return new JsonRpcSigner(_constructorGuard, this, addressOrIndex);
        };
        JsonRpcProvider2.prototype.getUncheckedSigner = function(addressOrIndex) {
          return this.getSigner(addressOrIndex).connectUnchecked();
        };
        JsonRpcProvider2.prototype.listAccounts = function() {
          var _this = this;
          return this.send("eth_accounts", []).then(function(accounts) {
            return accounts.map(function(a) {
              return _this.formatter.address(a);
            });
          });
        };
        JsonRpcProvider2.prototype.send = function(method, params) {
          var _this = this;
          var request = {
            method,
            params,
            id: this._nextId++,
            jsonrpc: "2.0"
          };
          this.emit("debug", {
            action: "request",
            request: (0, properties_1.deepCopy)(request),
            provider: this
          });
          var cache = ["eth_chainId", "eth_blockNumber"].indexOf(method) >= 0;
          if (cache && this._cache[method]) {
            return this._cache[method];
          }
          var result = (0, web_1.fetchJson)(this.connection, JSON.stringify(request), getResult).then(function(result2) {
            _this.emit("debug", {
              action: "response",
              request,
              response: result2,
              provider: _this
            });
            return result2;
          }, function(error) {
            _this.emit("debug", {
              action: "response",
              error,
              request,
              provider: _this
            });
            throw error;
          });
          if (cache) {
            this._cache[method] = result;
            setTimeout(function() {
              _this._cache[method] = null;
            }, 0);
          }
          return result;
        };
        JsonRpcProvider2.prototype.prepareRequest = function(method, params) {
          switch (method) {
            case "getBlockNumber":
              return ["eth_blockNumber", []];
            case "getGasPrice":
              return ["eth_gasPrice", []];
            case "getBalance":
              return ["eth_getBalance", [getLowerCase(params.address), params.blockTag]];
            case "getTransactionCount":
              return ["eth_getTransactionCount", [getLowerCase(params.address), params.blockTag]];
            case "getCode":
              return ["eth_getCode", [getLowerCase(params.address), params.blockTag]];
            case "getStorageAt":
              return ["eth_getStorageAt", [getLowerCase(params.address), (0, bytes_1.hexZeroPad)(params.position, 32), params.blockTag]];
            case "sendTransaction":
              return ["eth_sendRawTransaction", [params.signedTransaction]];
            case "getBlock":
              if (params.blockTag) {
                return ["eth_getBlockByNumber", [params.blockTag, !!params.includeTransactions]];
              } else if (params.blockHash) {
                return ["eth_getBlockByHash", [params.blockHash, !!params.includeTransactions]];
              }
              return null;
            case "getTransaction":
              return ["eth_getTransactionByHash", [params.transactionHash]];
            case "getTransactionReceipt":
              return ["eth_getTransactionReceipt", [params.transactionHash]];
            case "call": {
              var hexlifyTransaction = (0, properties_1.getStatic)(this.constructor, "hexlifyTransaction");
              return ["eth_call", [hexlifyTransaction(params.transaction, { from: true }), params.blockTag]];
            }
            case "estimateGas": {
              var hexlifyTransaction = (0, properties_1.getStatic)(this.constructor, "hexlifyTransaction");
              return ["eth_estimateGas", [hexlifyTransaction(params.transaction, { from: true })]];
            }
            case "getLogs":
              if (params.filter && params.filter.address != null) {
                params.filter.address = getLowerCase(params.filter.address);
              }
              return ["eth_getLogs", [params.filter]];
            default:
              break;
          }
          return null;
        };
        JsonRpcProvider2.prototype.perform = function(method, params) {
          return __awaiter(this, void 0, void 0, function() {
            var tx, feeData, args, error_7;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(method === "call" || method === "estimateGas"))
                    return [3, 2];
                  tx = params.transaction;
                  if (!(tx && tx.type != null && bignumber_1.BigNumber.from(tx.type).isZero()))
                    return [3, 2];
                  if (!(tx.maxFeePerGas == null && tx.maxPriorityFeePerGas == null))
                    return [3, 2];
                  return [4, this.getFeeData()];
                case 1:
                  feeData = _a.sent();
                  if (feeData.maxFeePerGas == null && feeData.maxPriorityFeePerGas == null) {
                    params = (0, properties_1.shallowCopy)(params);
                    params.transaction = (0, properties_1.shallowCopy)(tx);
                    delete params.transaction.type;
                  }
                  _a.label = 2;
                case 2:
                  args = this.prepareRequest(method, params);
                  if (args == null) {
                    logger.throwError(method + " not implemented", logger_1.Logger.errors.NOT_IMPLEMENTED, { operation: method });
                  }
                  _a.label = 3;
                case 3:
                  _a.trys.push([3, 5, , 6]);
                  return [4, this.send(args[0], args[1])];
                case 4:
                  return [2, _a.sent()];
                case 5:
                  error_7 = _a.sent();
                  return [2, checkError(method, error_7, params)];
                case 6:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        JsonRpcProvider2.prototype._startEvent = function(event) {
          if (event.tag === "pending") {
            this._startPending();
          }
          _super.prototype._startEvent.call(this, event);
        };
        JsonRpcProvider2.prototype._startPending = function() {
          if (this._pendingFilter != null) {
            return;
          }
          var self = this;
          var pendingFilter = this.send("eth_newPendingTransactionFilter", []);
          this._pendingFilter = pendingFilter;
          pendingFilter.then(function(filterId) {
            function poll() {
              self.send("eth_getFilterChanges", [filterId]).then(function(hashes) {
                if (self._pendingFilter != pendingFilter) {
                  return null;
                }
                var seq = Promise.resolve();
                hashes.forEach(function(hash) {
                  self._emitted["t:" + hash.toLowerCase()] = "pending";
                  seq = seq.then(function() {
                    return self.getTransaction(hash).then(function(tx) {
                      self.emit("pending", tx);
                      return null;
                    });
                  });
                });
                return seq.then(function() {
                  return timer(1e3);
                });
              }).then(function() {
                if (self._pendingFilter != pendingFilter) {
                  self.send("eth_uninstallFilter", [filterId]);
                  return;
                }
                setTimeout(function() {
                  poll();
                }, 0);
                return null;
              }).catch(function(error) {
              });
            }
            poll();
            return filterId;
          }).catch(function(error) {
          });
        };
        JsonRpcProvider2.prototype._stopEvent = function(event) {
          if (event.tag === "pending" && this.listenerCount("pending") === 0) {
            this._pendingFilter = null;
          }
          _super.prototype._stopEvent.call(this, event);
        };
        JsonRpcProvider2.hexlifyTransaction = function(transaction, allowExtra) {
          var allowed = (0, properties_1.shallowCopy)(allowedTransactionKeys);
          if (allowExtra) {
            for (var key in allowExtra) {
              if (allowExtra[key]) {
                allowed[key] = true;
              }
            }
          }
          (0, properties_1.checkProperties)(transaction, allowed);
          var result = {};
          ["chainId", "gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach(function(key2) {
            if (transaction[key2] == null) {
              return;
            }
            var value = (0, bytes_1.hexValue)(bignumber_1.BigNumber.from(transaction[key2]));
            if (key2 === "gasLimit") {
              key2 = "gas";
            }
            result[key2] = value;
          });
          ["from", "to", "data"].forEach(function(key2) {
            if (transaction[key2] == null) {
              return;
            }
            result[key2] = (0, bytes_1.hexlify)(transaction[key2]);
          });
          if (transaction.accessList) {
            result["accessList"] = (0, transactions_1.accessListify)(transaction.accessList);
          }
          return result;
        };
        return JsonRpcProvider2;
      }(base_provider_1.BaseProvider)
    );
    exports.JsonRpcProvider = JsonRpcProvider;
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    module.exports = {
      BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      EMPTY_BUFFER: Buffer.alloc(0),
      NOOP: () => {
      }
    };
  }
});

// node_modules/bufferutil/fallback.js
var require_fallback = __commonJS({
  "node_modules/bufferutil/fallback.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var mask = (source, mask2, output, offset, length) => {
      for (var i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask2[i & 3];
      }
    };
    var unmask = (buffer, mask2) => {
      const length = buffer.length;
      for (var i = 0; i < length; i++) {
        buffer[i] ^= mask2[i & 3];
      }
    };
    module.exports = { mask, unmask };
  }
});

// node_modules/bufferutil/index.js
var require_bufferutil = __commonJS({
  "node_modules/bufferutil/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    try {
      module.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module.exports = require_fallback();
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var { EMPTY_BUFFER } = require_constants();
    function concat(list, totalLength) {
      if (list.length === 0)
        return EMPTY_BUFFER;
      if (list.length === 1)
        return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength)
        return target.slice(0, offset);
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      const length = buffer.length;
      for (let i = 0; i < length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.byteLength === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data))
        return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    try {
      const bufferUtil = require_bufferutil();
      const bu = bufferUtil.BufferUtil || bufferUtil;
      module.exports = {
        concat,
        mask(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bu.mask(source, mask, output, offset, length);
        },
        toArrayBuffer,
        toBuffer,
        unmask(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bu.unmask(buffer, mask);
        }
      };
    } catch (e) {
      module.exports = {
        concat,
        mask: _mask,
        toArrayBuffer,
        toBuffer,
        unmask: _unmask
      };
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode, NOOP } = require_constants();
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {Buffer} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {Buffer} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("error", NOOP);
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin)
            data2 = data2.slice(0, data2.length - 4);
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/utf-8-validate/fallback.js
var require_fallback2 = __commonJS({
  "node_modules/utf-8-validate/fallback.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    function isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    module.exports = isValidUTF8;
  }
});

// node_modules/utf-8-validate/index.js
var require_utf_8_validate = __commonJS({
  "node_modules/utf-8-validate/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    try {
      module.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module.exports = require_fallback2();
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    try {
      let isValidUTF8 = require_utf_8_validate();
      if (typeof isValidUTF8 === "object") {
        isValidUTF8 = isValidUTF8.Validation.isValidUTF8;
      }
      module.exports = {
        isValidStatusCode,
        isValidUTF8(buf) {
          return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
        }
      };
    } catch (e) {
      module.exports = {
        isValidStatusCode,
        isValidUTF8: _isValidUTF8
      };
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var { Writable } = __require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var Receiver = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {String} [binaryType=nodebuffer] The type for binary data
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Boolean} [isServer=false] Specifies whether to operate in client or
       *     server mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(binaryType, extensions, isServer, maxPayload) {
        super();
        this._binaryType = binaryType || BINARY_TYPES[0];
        this[kWebSocket] = void 0;
        this._extensions = extensions || {};
        this._isServer = !!isServer;
        this._maxPayload = maxPayload | 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._state = GET_INFO;
        this._loop = false;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = buf.slice(n);
          return buf.slice(0, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = buf.slice(n);
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        let err;
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              err = this.getInfo();
              break;
            case GET_PAYLOAD_LENGTH_16:
              err = this.getPayloadLength16();
              break;
            case GET_PAYLOAD_LENGTH_64:
              err = this.getPayloadLength64();
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              err = this.getData(cb);
              break;
            default:
              this._loop = false;
              return;
          }
        } while (this._loop);
        cb(err);
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getInfo() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          this._loop = false;
          return error(RangeError, "RSV2 and RSV3 must be clear", true, 1002);
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          this._loop = false;
          return error(RangeError, "RSV1 must be clear", true, 1002);
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            this._loop = false;
            return error(RangeError, "RSV1 must be clear", true, 1002);
          }
          if (!this._fragmented) {
            this._loop = false;
            return error(RangeError, "invalid opcode 0", true, 1002);
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            this._loop = false;
            return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            this._loop = false;
            return error(RangeError, "FIN must be set", true, 1002);
          }
          if (compressed) {
            this._loop = false;
            return error(RangeError, "RSV1 must be clear", true, 1002);
          }
          if (this._payloadLength > 125) {
            this._loop = false;
            return error(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002
            );
          }
        } else {
          this._loop = false;
          return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            this._loop = false;
            return error(RangeError, "MASK must be set", true, 1002);
          }
        } else if (this._masked) {
          this._loop = false;
          return error(RangeError, "MASK must be clear", true, 1002);
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          return this.haveLength();
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getPayloadLength16() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        return this.haveLength();
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getPayloadLength64() {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          this._loop = false;
          return error(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009
          );
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.haveLength();
      }
      /**
       * Payload length has been read.
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      haveLength() {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            this._loop = false;
            return error(RangeError, "Max payload size exceeded", false, 1009);
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked)
            unmask(data, this._mask);
        }
        if (this._opcode > 7)
          return this.controlMessage(data);
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        return this.dataMessage();
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              return cb(
                error(RangeError, "Max payload size exceeded", false, 1009)
              );
            }
            this._fragments.push(buf);
          }
          const er = this.dataMessage();
          if (er)
            return cb(er);
          this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @return {(Error|undefined)} A possible error
       * @private
       */
      dataMessage() {
        if (this._fin) {
          const messageLength = this._messageLength;
          const fragments = this._fragments;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];
          if (this._opcode === 2) {
            let data;
            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else {
              data = fragments;
            }
            this.emit("message", data);
          } else {
            const buf = concat(fragments, messageLength);
            if (!isValidUTF8(buf)) {
              this._loop = false;
              return error(Error, "invalid UTF-8 sequence", true, 1007);
            }
            this.emit("message", buf.toString());
          }
        }
        this._state = GET_INFO;
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data) {
        if (this._opcode === 8) {
          this._loop = false;
          if (data.length === 0) {
            this.emit("conclude", 1005, "");
            this.end();
          } else if (data.length === 1) {
            return error(RangeError, "invalid payload length 1", true, 1002);
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              return error(RangeError, `invalid status code ${code}`, true, 1002);
            }
            const buf = data.slice(2);
            if (!isValidUTF8(buf)) {
              return error(Error, "invalid UTF-8 sequence", true, 1007);
            }
            this.emit("conclude", code, buf.toString());
            this.end();
          }
        } else if (this._opcode === 9) {
          this.emit("ping", data);
        } else {
          this.emit("pong", data);
        }
        this._state = GET_INFO;
      }
    };
    module.exports = Receiver;
    function error(ErrorCtor, message, prefix, statusCode) {
      const err = new ErrorCtor(
        prefix ? `Invalid WebSocket frame: ${message}` : message
      );
      Error.captureStackTrace(err, error);
      err[kStatusCode] = statusCode;
      return err;
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var { randomFillSync } = __require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER } = require_constants();
    var { isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var mask = Buffer.alloc(4);
    var Sender = class {
      /**
       * Creates a Sender instance.
       *
       * @param {net.Socket} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       */
      constructor(socket, extensions) {
        this._extensions = extensions || {};
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {Buffer} data The data to frame
       * @param {Object} options Options object
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {Buffer[]} The framed data as a list of `Buffer` instances
       * @public
       */
      static frame(data, options) {
        const merge = options.mask && options.readOnly;
        let offset = options.mask ? 6 : 2;
        let payloadLength = data.length;
        if (data.length >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (data.length > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(data.length, 2);
        } else if (payloadLength === 127) {
          target.writeUInt32BE(0, 2);
          target.writeUInt32BE(data.length, 6);
        }
        if (!options.mask)
          return [target, data];
        randomFillSync(mask, 0, 4);
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (merge) {
          applyMask(data, mask, target, offset, data.length);
          return [target];
        }
        applyMask(data, mask, data, 0, data.length);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {String} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask2, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || data === "") {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          buf.write(data, 2);
        }
        if (this._deflating) {
          this.enqueue([this.doClose, buf, mask2, cb]);
        } else {
          this.doClose(buf, mask2, cb);
        }
      }
      /**
       * Frames and sends a close message.
       *
       * @param {Buffer} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @private
       */
      doClose(data, mask2, cb) {
        this.sendFrame(
          Sender.frame(data, {
            fin: true,
            rsv1: false,
            opcode: 8,
            mask: mask2,
            readOnly: false
          }),
          cb
        );
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask2, cb) {
        const buf = toBuffer(data);
        if (buf.length > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        if (this._deflating) {
          this.enqueue([this.doPing, buf, mask2, toBuffer.readOnly, cb]);
        } else {
          this.doPing(buf, mask2, toBuffer.readOnly, cb);
        }
      }
      /**
       * Frames and sends a ping message.
       *
       * @param {Buffer} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
       * @param {Function} [cb] Callback
       * @private
       */
      doPing(data, mask2, readOnly, cb) {
        this.sendFrame(
          Sender.frame(data, {
            fin: true,
            rsv1: false,
            opcode: 9,
            mask: mask2,
            readOnly
          }),
          cb
        );
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask2, cb) {
        const buf = toBuffer(data);
        if (buf.length > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        if (this._deflating) {
          this.enqueue([this.doPong, buf, mask2, toBuffer.readOnly, cb]);
        } else {
          this.doPong(buf, mask2, toBuffer.readOnly, cb);
        }
      }
      /**
       * Frames and sends a pong message.
       *
       * @param {Buffer} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
       * @param {Function} [cb] Callback
       * @private
       */
      doPong(data, mask2, readOnly, cb) {
        this.sendFrame(
          Sender.frame(data, {
            fin: true,
            rsv1: false,
            opcode: 10,
            mask: mask2,
            readOnly
          }),
          cb
        );
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const buf = toBuffer(data);
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate) {
            rsv1 = buf.length >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        if (perMessageDeflate) {
          const opts = {
            fin: options.fin,
            rsv1,
            opcode,
            mask: options.mask,
            readOnly: toBuffer.readOnly
          };
          if (this._deflating) {
            this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
          } else {
            this.dispatch(buf, this._compress, opts, cb);
          }
        } else {
          this.sendFrame(
            Sender.frame(buf, {
              fin: options.fin,
              rsv1: false,
              opcode,
              mask: options.mask,
              readOnly: toBuffer.readOnly
            }),
            cb
          );
        }
      }
      /**
       * Dispatches a data message.
       *
       * @param {Buffer} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += data.length;
        this._deflating = true;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            if (typeof cb === "function")
              cb(err);
            for (let i = 0; i < this._queue.length; i++) {
              const callback = this._queue[i][4];
              if (typeof callback === "function")
                callback(err);
            }
            return;
          }
          this._bufferedBytes -= data.length;
          this._deflating = false;
          options.readOnly = false;
          this.sendFrame(Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (!this._deflating && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[1].length;
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[1].length;
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {Buffer[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender;
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @param {Object} target A reference to the target to which the event was
       *     dispatched
       */
      constructor(type, target) {
        this.target = target;
        this.type = type;
      }
    };
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
       * @param {WebSocket} target A reference to the target to which the event was
       *     dispatched
       */
      constructor(data, target) {
        super("message", target);
        this.data = data;
      }
    };
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {Number} code The status code explaining why the connection is being
       *     closed
       * @param {String} reason A human-readable string explaining why the
       *     connection is closing
       * @param {WebSocket} target A reference to the target to which the event was
       *     dispatched
       */
      constructor(code, reason, target) {
        super("close", target);
        this.wasClean = target._closeFrameReceived && target._closeFrameSent;
        this.reason = reason;
        this.code = code;
      }
    };
    var OpenEvent = class extends Event {
      /**
       * Create a new `OpenEvent`.
       *
       * @param {WebSocket} target A reference to the target to which the event was
       *     dispatched
       */
      constructor(target) {
        super("open", target);
      }
    };
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {Object} error The error that generated this event
       * @param {WebSocket} target A reference to the target to which the event was
       *     dispatched
       */
      constructor(error, target) {
        super("error", target);
        this.message = error.message;
        this.error = error;
      }
    };
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {Function} listener The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean`` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, listener, options) {
        if (typeof listener !== "function")
          return;
        function onMessage(data) {
          listener.call(this, new MessageEvent(data, this));
        }
        function onClose(code, message) {
          listener.call(this, new CloseEvent(code, message, this));
        }
        function onError(error) {
          listener.call(this, new ErrorEvent(error, this));
        }
        function onOpen() {
          listener.call(this, new OpenEvent(this));
        }
        const method = options && options.once ? "once" : "on";
        if (type === "message") {
          onMessage._listener = listener;
          this[method](type, onMessage);
        } else if (type === "close") {
          onClose._listener = listener;
          this[method](type, onClose);
        } else if (type === "error") {
          onError._listener = listener;
          this[method](type, onError);
        } else if (type === "open") {
          onOpen._listener = listener;
          this[method](type, onOpen);
        } else {
          this[method](type, listener);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {Function} listener The listener to remove
       * @public
       */
      removeEventListener(type, listener) {
        const listeners = this.listeners(type);
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i] === listener || listeners[i]._listener === listener) {
            this.removeListener(type, listeners[i]);
          }
        }
      }
    };
    module.exports = EventTarget;
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function push(dest, name, elem) {
      if (dest[name] === void 0)
        dest[name] = [elem];
      else
        dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      if (header === void 0 || header === "")
        return offers;
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1)
              start = i;
            else if (!mustUnescape)
              mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1)
                start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1)
        end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations))
          configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values))
                values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { URL } = __require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver = require_receiver();
    var Sender = require_sender();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var { addEventListener, removeEventListener } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var protocolVersions = [8, 13];
    var closeTimeout = 30 * 1e3;
    var WebSocket = class extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|url.URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = "";
        this._closeTimer = null;
        this._extensions = {};
        this._protocol = "";
        this._readyState = WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (Array.isArray(protocols)) {
            protocols = protocols.join(", ");
          } else if (typeof protocols === "object" && protocols !== null) {
            options = protocols;
            protocols = void 0;
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._isServer = true;
        }
      }
      /**
       * This deviates from the WHATWG interface since ws doesn't support the
       * required default "blob" type (instead we define a custom "nodebuffer"
       * type).
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {net.Socket} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Number} [maxPayload=0] The maximum allowed message size
       * @private
       */
      setSocket(socket, head, maxPayload) {
        const receiver = new Receiver(
          this.binaryType,
          this._extensions,
          this._isServer,
          maxPayload
        );
        this._sender = new Sender(socket, this._extensions);
        this._receiver = receiver;
        this._socket = socket;
        receiver[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        socket.setTimeout(0);
        socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {String} [data] A string explaining why the connection is closing
       * @public
       */
      close(code, data) {
        if (this.readyState === WebSocket.CLOSED)
          return;
        if (this.readyState === WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this.readyState === WebSocket.CLOSING) {
          if (this._closeFrameSent && this._closeFrameReceived)
            this._socket.end();
          return;
        }
        this._readyState = WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived)
            this._socket.end();
        });
        this._closeTimer = setTimeout(
          this._socket.destroy.bind(this._socket),
          closeTimeout
        );
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === WebSocket.CLOSED)
          return;
        if (this.readyState === WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this._socket) {
          this._readyState = WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    readyStates.forEach((readyState, i) => {
      const descriptor = { enumerable: true, value: i };
      Object.defineProperty(WebSocket.prototype, readyState, descriptor);
      Object.defineProperty(WebSocket, readyState, descriptor);
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket.prototype, `on${method}`, {
        configurable: true,
        enumerable: true,
        /**
         * Return the listener of the event.
         *
         * @return {(Function|undefined)} The event listener or `undefined`
         * @public
         */
        get() {
          const listeners = this.listeners(method);
          for (let i = 0; i < listeners.length; i++) {
            if (listeners[i]._listener)
              return listeners[i]._listener;
          }
          return void 0;
        },
        /**
         * Add a listener for the event.
         *
         * @param {Function} listener The listener to add
         * @public
         */
        set(listener) {
          const listeners = this.listeners(method);
          for (let i = 0; i < listeners.length; i++) {
            if (listeners[i]._listener)
              this.removeListener(method, listeners[i]);
          }
          this.addEventListener(method, listener);
        }
      });
    });
    WebSocket.prototype.addEventListener = addEventListener;
    WebSocket.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        createConnection: void 0,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: void 0,
        host: void 0,
        path: void 0,
        port: void 0
      };
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
        websocket._url = address.href;
      } else {
        parsedUrl = new URL(address);
        websocket._url = address;
      }
      const isUnixSocket = parsedUrl.protocol === "ws+unix:";
      if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
        throw new Error(`Invalid URL: ${websocket.url}`);
      }
      const isSecure = parsedUrl.protocol === "wss:" || parsedUrl.protocol === "https:";
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const get = isSecure ? https.get : http.get;
      let perMessageDeflate;
      opts.createConnection = isSecure ? tlsConnect : netConnect;
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket",
        ...opts.headers
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols) {
        opts.headers["Sec-WebSocket-Protocol"] = protocols;
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isUnixSocket) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req = websocket._req = get(opts);
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req.aborted)
          return;
        req = websocket._req = null;
        websocket._readyState = WebSocket.CLOSING;
        websocket.emit("error", err);
        websocket.emitClose();
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          const addr = new URL(location, address);
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket.CONNECTING)
          return;
        req = websocket._req = null;
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        const protList = (protocols || "").split(/, */);
        let protError;
        if (!protocols && serverProt) {
          protError = "Server sent a subprotocol but none was requested";
        } else if (protocols && !serverProt) {
          protError = "Server sent no subprotocol";
        } else if (serverProt && !protList.includes(serverProt)) {
          protError = "Server sent an invalid subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt)
          websocket._protocol = serverProt;
        if (perMessageDeflate) {
          try {
            const extensions = parse(res.headers["sec-websocket-extensions"]);
            if (extensions[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
              websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            abortHandshake(
              websocket,
              socket,
              "Invalid Sec-WebSocket-Extensions header"
            );
            return;
          }
        }
        websocket.setSocket(socket, head, opts.maxPayload);
      });
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        stream.once("abort", websocket.emitClose.bind(websocket));
        websocket.emit("error", err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = toBuffer(data).length;
        if (websocket._socket)
          websocket._sender._bufferedBytes += length;
        else
          websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        cb(err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._socket.removeListener("data", socketOnData);
      websocket._socket.resume();
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (code === 1005)
        websocket.close();
      else
        websocket.close(code, reason);
    }
    function receiverOnDrain() {
      this[kWebSocket]._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      websocket._socket.removeListener("data", socketOnData);
      websocket._readyState = WebSocket.CLOSING;
      websocket._closeCode = err[kStatusCode];
      websocket.emit("error", err);
      websocket._socket.destroy();
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data) {
      this[kWebSocket].emit("message", data);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      websocket.pong(data, !websocket._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket.CLOSING;
      websocket._socket.read();
      websocket._receiver.end();
      this.removeListener("data", socketOnData);
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream(ws, options) {
      let resumeOnReceiverDrain = true;
      function receiverOnDrain() {
        if (resumeOnReceiverDrain)
          ws._socket.resume();
      }
      if (ws.readyState === ws.CONNECTING) {
        ws.once("open", function open() {
          ws._receiver.removeAllListeners("drain");
          ws._receiver.on("drain", receiverOnDrain);
        });
      } else {
        ws._receiver.removeAllListeners("drain");
        ws._receiver.on("drain", receiverOnDrain);
      }
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg) {
        if (!duplex.push(msg)) {
          resumeOnReceiverDrain = false;
          ws._socket.pause();
        }
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed)
          return;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed)
          return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called)
            callback(err);
          process.nextTick(emitClose, duplex);
        });
        ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null)
          return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted)
            duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.readyState === ws.OPEN && !resumeOnReceiverDrain) {
          resumeOnReceiverDrain = true;
          if (!ws._receiver._writableState.needDrain)
            ws._socket.resume();
        }
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream;
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var EventEmitter = __require("events");
    var { createHash } = __require("crypto");
    var { createServer, STATUS_CODES } = __require("http");
    var PerMessageDeflate = require_permessage_deflate();
    var WebSocket = require_websocket();
    var { format, parse } = require_extension();
    var { GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var WebSocketServer = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {http.Server} [options.server] A pre-created HTTP/S server to use
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          maxPayload: 100 * 1024 * 1024,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer) {
          throw new TypeError(
            'One of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = createServer((req, res) => {
            const body = STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking)
          this.clients = /* @__PURE__ */ new Set();
        this.options = options;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      /**
       * Close the server.
       *
       * @param {Function} [cb] Callback
       * @public
       */
      close(cb) {
        if (cb)
          this.once("close", cb);
        if (this.clients) {
          for (const client of this.clients)
            client.terminate();
        }
        const server = this._server;
        if (server) {
          this._removeListeners();
          this._removeListeners = this._server = null;
          if (this.options.port != null) {
            server.close(() => this.emit("close"));
            return;
          }
        }
        process.nextTick(emitClose, this);
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {net.Socket} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"] !== void 0 ? req.headers["sec-websocket-key"].trim() : false;
        const version = +req.headers["sec-websocket-version"];
        const extensions = {};
        if (req.method !== "GET" || req.headers.upgrade.toLowerCase() !== "websocket" || !key || !keyRegex.test(key) || version !== 8 && version !== 13 || !this.shouldHandle(req)) {
          return abortHandshake(socket, 400);
        }
        if (this.options.perMessageDeflate) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = parse(req.headers["sec-websocket-extensions"]);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            return abortHandshake(socket, 400);
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(key, extensions, req, socket, head, cb);
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(key, extensions, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Object} extensions The accepted extensions
       * @param {http.IncomingMessage} req The request object
       * @param {net.Socket} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(key, extensions, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new WebSocket(null);
        let protocol = req.headers["sec-websocket-protocol"];
        if (protocol) {
          protocol = protocol.split(",").map(trim);
          if (this.options.handleProtocols) {
            protocol = this.options.handleProtocols(protocol, req);
          } else {
            protocol = protocol[0];
          }
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, this.options.maxPayload);
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => this.clients.delete(ws));
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer;
    function addListeners(server, map) {
      for (const event of Object.keys(map))
        server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      if (socket.writable) {
        message = message || STATUS_CODES[code];
        headers = {
          Connection: "close",
          "Content-Type": "text/html",
          "Content-Length": Buffer.byteLength(message),
          ...headers
        };
        socket.write(
          `HTTP/1.1 ${code} ${STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
        );
      }
      socket.removeListener("error", socketOnError);
      socket.destroy();
    }
    function trim(str) {
      return str.trim();
    }
  }
});

// node_modules/@ethersproject/providers/node_modules/ws/index.js
var require_ws = __commonJS({
  "node_modules/@ethersproject/providers/node_modules/ws/index.js"(exports, module) {
    "use strict";
    init_cjs_shim();
    var WebSocket = require_websocket();
    WebSocket.createWebSocketStream = require_stream();
    WebSocket.Server = require_websocket_server();
    WebSocket.Receiver = require_receiver();
    WebSocket.Sender = require_sender();
    module.exports = WebSocket;
  }
});

// node_modules/@ethersproject/providers/lib/ws.js
var require_ws2 = __commonJS({
  "node_modules/@ethersproject/providers/lib/ws.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebSocket = void 0;
    var ws_1 = __importDefault(require_ws());
    exports.WebSocket = ws_1.default;
  }
});

// node_modules/@ethersproject/providers/lib/websocket-provider.js
var require_websocket_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/websocket-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebSocketProvider = void 0;
    var bignumber_1 = require_lib3();
    var properties_1 = require_lib8();
    var json_rpc_provider_1 = require_json_rpc_provider();
    var ws_1 = require_ws2();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var NextId = 1;
    var WebSocketProvider = (
      /** @class */
      function(_super) {
        __extends(WebSocketProvider2, _super);
        function WebSocketProvider2(url, network) {
          var _this = this;
          if (network === "any") {
            logger.throwError("WebSocketProvider does not support 'any' network yet", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
              operation: "network:any"
            });
          }
          if (typeof url === "string") {
            _this = _super.call(this, url, network) || this;
          } else {
            _this = _super.call(this, "_websocket", network) || this;
          }
          _this._pollingInterval = -1;
          _this._wsReady = false;
          if (typeof url === "string") {
            (0, properties_1.defineReadOnly)(_this, "_websocket", new ws_1.WebSocket(_this.connection.url));
          } else {
            (0, properties_1.defineReadOnly)(_this, "_websocket", url);
          }
          (0, properties_1.defineReadOnly)(_this, "_requests", {});
          (0, properties_1.defineReadOnly)(_this, "_subs", {});
          (0, properties_1.defineReadOnly)(_this, "_subIds", {});
          (0, properties_1.defineReadOnly)(_this, "_detectNetwork", _super.prototype.detectNetwork.call(_this));
          _this.websocket.onopen = function() {
            _this._wsReady = true;
            Object.keys(_this._requests).forEach(function(id) {
              _this.websocket.send(_this._requests[id].payload);
            });
          };
          _this.websocket.onmessage = function(messageEvent) {
            var data = messageEvent.data;
            var result = JSON.parse(data);
            if (result.id != null) {
              var id = String(result.id);
              var request = _this._requests[id];
              delete _this._requests[id];
              if (result.result !== void 0) {
                request.callback(null, result.result);
                _this.emit("debug", {
                  action: "response",
                  request: JSON.parse(request.payload),
                  response: result.result,
                  provider: _this
                });
              } else {
                var error = null;
                if (result.error) {
                  error = new Error(result.error.message || "unknown error");
                  (0, properties_1.defineReadOnly)(error, "code", result.error.code || null);
                  (0, properties_1.defineReadOnly)(error, "response", data);
                } else {
                  error = new Error("unknown error");
                }
                request.callback(error, void 0);
                _this.emit("debug", {
                  action: "response",
                  error,
                  request: JSON.parse(request.payload),
                  provider: _this
                });
              }
            } else if (result.method === "eth_subscription") {
              var sub = _this._subs[result.params.subscription];
              if (sub) {
                sub.processFunc(result.params.result);
              }
            } else {
              console.warn("this should not happen");
            }
          };
          var fauxPoll = setInterval(function() {
            _this.emit("poll");
          }, 1e3);
          if (fauxPoll.unref) {
            fauxPoll.unref();
          }
          return _this;
        }
        Object.defineProperty(WebSocketProvider2.prototype, "websocket", {
          // Cannot narrow the type of _websocket, as that is not backwards compatible
          // so we add a getter and let the WebSocket be a public API.
          get: function() {
            return this._websocket;
          },
          enumerable: false,
          configurable: true
        });
        WebSocketProvider2.prototype.detectNetwork = function() {
          return this._detectNetwork;
        };
        Object.defineProperty(WebSocketProvider2.prototype, "pollingInterval", {
          get: function() {
            return 0;
          },
          set: function(value) {
            logger.throwError("cannot set polling interval on WebSocketProvider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
              operation: "setPollingInterval"
            });
          },
          enumerable: false,
          configurable: true
        });
        WebSocketProvider2.prototype.resetEventsBlock = function(blockNumber) {
          logger.throwError("cannot reset events block on WebSocketProvider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "resetEventBlock"
          });
        };
        WebSocketProvider2.prototype.poll = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, null];
            });
          });
        };
        Object.defineProperty(WebSocketProvider2.prototype, "polling", {
          set: function(value) {
            if (!value) {
              return;
            }
            logger.throwError("cannot set polling on WebSocketProvider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
              operation: "setPolling"
            });
          },
          enumerable: false,
          configurable: true
        });
        WebSocketProvider2.prototype.send = function(method, params) {
          var _this = this;
          var rid = NextId++;
          return new Promise(function(resolve, reject) {
            function callback(error, result) {
              if (error) {
                return reject(error);
              }
              return resolve(result);
            }
            var payload = JSON.stringify({
              method,
              params,
              id: rid,
              jsonrpc: "2.0"
            });
            _this.emit("debug", {
              action: "request",
              request: JSON.parse(payload),
              provider: _this
            });
            _this._requests[String(rid)] = { callback, payload };
            if (_this._wsReady) {
              _this.websocket.send(payload);
            }
          });
        };
        WebSocketProvider2.defaultUrl = function() {
          return "ws://localhost:8546";
        };
        WebSocketProvider2.prototype._subscribe = function(tag, param, processFunc) {
          return __awaiter(this, void 0, void 0, function() {
            var subIdPromise, subId;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  subIdPromise = this._subIds[tag];
                  if (subIdPromise == null) {
                    subIdPromise = Promise.all(param).then(function(param2) {
                      return _this.send("eth_subscribe", param2);
                    });
                    this._subIds[tag] = subIdPromise;
                  }
                  return [4, subIdPromise];
                case 1:
                  subId = _a.sent();
                  this._subs[subId] = { tag, processFunc };
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        WebSocketProvider2.prototype._startEvent = function(event) {
          var _this = this;
          switch (event.type) {
            case "block":
              this._subscribe("block", ["newHeads"], function(result) {
                var blockNumber = bignumber_1.BigNumber.from(result.number).toNumber();
                _this._emitted.block = blockNumber;
                _this.emit("block", blockNumber);
              });
              break;
            case "pending":
              this._subscribe("pending", ["newPendingTransactions"], function(result) {
                _this.emit("pending", result);
              });
              break;
            case "filter":
              this._subscribe(event.tag, ["logs", this._getFilter(event.filter)], function(result) {
                if (result.removed == null) {
                  result.removed = false;
                }
                _this.emit(event.filter, _this.formatter.filterLog(result));
              });
              break;
            case "tx": {
              var emitReceipt_1 = function(event2) {
                var hash = event2.hash;
                _this.getTransactionReceipt(hash).then(function(receipt) {
                  if (!receipt) {
                    return;
                  }
                  _this.emit(hash, receipt);
                });
              };
              emitReceipt_1(event);
              this._subscribe("tx", ["newHeads"], function(result) {
                _this._events.filter(function(e) {
                  return e.type === "tx";
                }).forEach(emitReceipt_1);
              });
              break;
            }
            case "debug":
            case "poll":
            case "willPoll":
            case "didPoll":
            case "error":
              break;
            default:
              console.log("unhandled:", event);
              break;
          }
        };
        WebSocketProvider2.prototype._stopEvent = function(event) {
          var _this = this;
          var tag = event.tag;
          if (event.type === "tx") {
            if (this._events.filter(function(e) {
              return e.type === "tx";
            }).length) {
              return;
            }
            tag = "tx";
          } else if (this.listenerCount(event.event)) {
            return;
          }
          var subId = this._subIds[tag];
          if (!subId) {
            return;
          }
          delete this._subIds[tag];
          subId.then(function(subId2) {
            if (!_this._subs[subId2]) {
              return;
            }
            delete _this._subs[subId2];
            _this.send("eth_unsubscribe", [subId2]);
          });
        };
        WebSocketProvider2.prototype.destroy = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(this.websocket.readyState === ws_1.WebSocket.CONNECTING))
                    return [3, 2];
                  return [4, new Promise(function(resolve) {
                    _this.websocket.onopen = function() {
                      resolve(true);
                    };
                    _this.websocket.onerror = function() {
                      resolve(false);
                    };
                  })];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  this.websocket.close(1e3);
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return WebSocketProvider2;
      }(json_rpc_provider_1.JsonRpcProvider)
    );
    exports.WebSocketProvider = WebSocketProvider;
  }
});

// node_modules/@ethersproject/providers/lib/url-json-rpc-provider.js
var require_url_json_rpc_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/url-json-rpc-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UrlJsonRpcProvider = exports.StaticJsonRpcProvider = void 0;
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var json_rpc_provider_1 = require_json_rpc_provider();
    var StaticJsonRpcProvider = (
      /** @class */
      function(_super) {
        __extends(StaticJsonRpcProvider2, _super);
        function StaticJsonRpcProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        StaticJsonRpcProvider2.prototype.detectNetwork = function() {
          return __awaiter(this, void 0, void 0, function() {
            var network;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  network = this.network;
                  if (!(network == null))
                    return [3, 2];
                  return [4, _super.prototype.detectNetwork.call(this)];
                case 1:
                  network = _a.sent();
                  if (!network) {
                    logger.throwError("no network detected", logger_1.Logger.errors.UNKNOWN_ERROR, {});
                  }
                  if (this._network == null) {
                    (0, properties_1.defineReadOnly)(this, "_network", network);
                    this.emit("network", network, null);
                  }
                  _a.label = 2;
                case 2:
                  return [2, network];
              }
            });
          });
        };
        return StaticJsonRpcProvider2;
      }(json_rpc_provider_1.JsonRpcProvider)
    );
    exports.StaticJsonRpcProvider = StaticJsonRpcProvider;
    var UrlJsonRpcProvider = (
      /** @class */
      function(_super) {
        __extends(UrlJsonRpcProvider2, _super);
        function UrlJsonRpcProvider2(network, apiKey) {
          var _newTarget = this.constructor;
          var _this = this;
          logger.checkAbstract(_newTarget, UrlJsonRpcProvider2);
          network = (0, properties_1.getStatic)(_newTarget, "getNetwork")(network);
          apiKey = (0, properties_1.getStatic)(_newTarget, "getApiKey")(apiKey);
          var connection = (0, properties_1.getStatic)(_newTarget, "getUrl")(network, apiKey);
          _this = _super.call(this, connection, network) || this;
          if (typeof apiKey === "string") {
            (0, properties_1.defineReadOnly)(_this, "apiKey", apiKey);
          } else if (apiKey != null) {
            Object.keys(apiKey).forEach(function(key) {
              (0, properties_1.defineReadOnly)(_this, key, apiKey[key]);
            });
          }
          return _this;
        }
        UrlJsonRpcProvider2.prototype._startPending = function() {
          logger.warn("WARNING: API provider does not support pending filters");
        };
        UrlJsonRpcProvider2.prototype.isCommunityResource = function() {
          return false;
        };
        UrlJsonRpcProvider2.prototype.getSigner = function(address) {
          return logger.throwError("API provider does not support signing", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "getSigner" });
        };
        UrlJsonRpcProvider2.prototype.listAccounts = function() {
          return Promise.resolve([]);
        };
        UrlJsonRpcProvider2.getApiKey = function(apiKey) {
          return apiKey;
        };
        UrlJsonRpcProvider2.getUrl = function(network, apiKey) {
          return logger.throwError("not implemented; sub-classes must override getUrl", logger_1.Logger.errors.NOT_IMPLEMENTED, {
            operation: "getUrl"
          });
        };
        return UrlJsonRpcProvider2;
      }(StaticJsonRpcProvider)
    );
    exports.UrlJsonRpcProvider = UrlJsonRpcProvider;
  }
});

// node_modules/@ethersproject/providers/lib/alchemy-provider.js
var require_alchemy_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/alchemy-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlchemyProvider = exports.AlchemyWebSocketProvider = void 0;
    var properties_1 = require_lib8();
    var formatter_1 = require_formatter();
    var websocket_provider_1 = require_websocket_provider();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    var defaultApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
    var AlchemyWebSocketProvider = (
      /** @class */
      function(_super) {
        __extends(AlchemyWebSocketProvider2, _super);
        function AlchemyWebSocketProvider2(network, apiKey) {
          var _this = this;
          var provider = new AlchemyProvider(network, apiKey);
          var url = provider.connection.url.replace(/^http/i, "ws").replace(".alchemyapi.", ".ws.alchemyapi.");
          _this = _super.call(this, url, provider.network) || this;
          (0, properties_1.defineReadOnly)(_this, "apiKey", provider.apiKey);
          return _this;
        }
        AlchemyWebSocketProvider2.prototype.isCommunityResource = function() {
          return this.apiKey === defaultApiKey;
        };
        return AlchemyWebSocketProvider2;
      }(websocket_provider_1.WebSocketProvider)
    );
    exports.AlchemyWebSocketProvider = AlchemyWebSocketProvider;
    var AlchemyProvider = (
      /** @class */
      function(_super) {
        __extends(AlchemyProvider2, _super);
        function AlchemyProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        AlchemyProvider2.getWebSocketProvider = function(network, apiKey) {
          return new AlchemyWebSocketProvider(network, apiKey);
        };
        AlchemyProvider2.getApiKey = function(apiKey) {
          if (apiKey == null) {
            return defaultApiKey;
          }
          if (apiKey && typeof apiKey !== "string") {
            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
          }
          return apiKey;
        };
        AlchemyProvider2.getUrl = function(network, apiKey) {
          var host = null;
          switch (network.name) {
            case "homestead":
              host = "eth-mainnet.alchemyapi.io/v2/";
              break;
            case "goerli":
              host = "eth-goerli.g.alchemy.com/v2/";
              break;
            case "matic":
              host = "polygon-mainnet.g.alchemy.com/v2/";
              break;
            case "maticmum":
              host = "polygon-mumbai.g.alchemy.com/v2/";
              break;
            case "arbitrum":
              host = "arb-mainnet.g.alchemy.com/v2/";
              break;
            case "arbitrum-goerli":
              host = "arb-goerli.g.alchemy.com/v2/";
              break;
            case "optimism":
              host = "opt-mainnet.g.alchemy.com/v2/";
              break;
            case "optimism-goerli":
              host = "opt-goerli.g.alchemy.com/v2/";
              break;
            default:
              logger.throwArgumentError("unsupported network", "network", arguments[0]);
          }
          return {
            allowGzip: true,
            url: "https://" + host + apiKey,
            throttleCallback: function(attempt, url) {
              if (apiKey === defaultApiKey) {
                (0, formatter_1.showThrottleMessage)();
              }
              return Promise.resolve(true);
            }
          };
        };
        AlchemyProvider2.prototype.isCommunityResource = function() {
          return this.apiKey === defaultApiKey;
        };
        return AlchemyProvider2;
      }(url_json_rpc_provider_1.UrlJsonRpcProvider)
    );
    exports.AlchemyProvider = AlchemyProvider;
  }
});

// node_modules/@ethersproject/providers/lib/ankr-provider.js
var require_ankr_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/ankr-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnkrProvider = void 0;
    var formatter_1 = require_formatter();
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var defaultApiKey = "9f7d929b018cdffb338517efa06f58359e86ff1ffd350bc889738523659e7972";
    function getHost(name) {
      switch (name) {
        case "homestead":
          return "rpc.ankr.com/eth/";
        case "ropsten":
          return "rpc.ankr.com/eth_ropsten/";
        case "rinkeby":
          return "rpc.ankr.com/eth_rinkeby/";
        case "goerli":
          return "rpc.ankr.com/eth_goerli/";
        case "matic":
          return "rpc.ankr.com/polygon/";
        case "arbitrum":
          return "rpc.ankr.com/arbitrum/";
      }
      return logger.throwArgumentError("unsupported network", "name", name);
    }
    var AnkrProvider = (
      /** @class */
      function(_super) {
        __extends(AnkrProvider2, _super);
        function AnkrProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        AnkrProvider2.prototype.isCommunityResource = function() {
          return this.apiKey === defaultApiKey;
        };
        AnkrProvider2.getApiKey = function(apiKey) {
          if (apiKey == null) {
            return defaultApiKey;
          }
          return apiKey;
        };
        AnkrProvider2.getUrl = function(network, apiKey) {
          if (apiKey == null) {
            apiKey = defaultApiKey;
          }
          var connection = {
            allowGzip: true,
            url: "https://" + getHost(network.name) + apiKey,
            throttleCallback: function(attempt, url) {
              if (apiKey.apiKey === defaultApiKey) {
                (0, formatter_1.showThrottleMessage)();
              }
              return Promise.resolve(true);
            }
          };
          if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
          }
          return connection;
        };
        return AnkrProvider2;
      }(url_json_rpc_provider_1.UrlJsonRpcProvider)
    );
    exports.AnkrProvider = AnkrProvider;
  }
});

// node_modules/@ethersproject/providers/lib/cloudflare-provider.js
var require_cloudflare_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/cloudflare-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CloudflareProvider = void 0;
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var CloudflareProvider = (
      /** @class */
      function(_super) {
        __extends(CloudflareProvider2, _super);
        function CloudflareProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        CloudflareProvider2.getApiKey = function(apiKey) {
          if (apiKey != null) {
            logger.throwArgumentError("apiKey not supported for cloudflare", "apiKey", apiKey);
          }
          return null;
        };
        CloudflareProvider2.getUrl = function(network, apiKey) {
          var host = null;
          switch (network.name) {
            case "homestead":
              host = "https://cloudflare-eth.com/";
              break;
            default:
              logger.throwArgumentError("unsupported network", "network", arguments[0]);
          }
          return host;
        };
        CloudflareProvider2.prototype.perform = function(method, params) {
          return __awaiter(this, void 0, void 0, function() {
            var block;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(method === "getBlockNumber"))
                    return [3, 2];
                  return [4, _super.prototype.perform.call(this, "getBlock", { blockTag: "latest" })];
                case 1:
                  block = _a.sent();
                  return [2, block.number];
                case 2:
                  return [2, _super.prototype.perform.call(this, method, params)];
              }
            });
          });
        };
        return CloudflareProvider2;
      }(url_json_rpc_provider_1.UrlJsonRpcProvider)
    );
    exports.CloudflareProvider = CloudflareProvider;
  }
});

// node_modules/@ethersproject/providers/lib/etherscan-provider.js
var require_etherscan_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/etherscan-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EtherscanProvider = void 0;
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var transactions_1 = require_lib10();
    var web_1 = require_lib28();
    var formatter_1 = require_formatter();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var base_provider_1 = require_base_provider();
    function getTransactionPostData(transaction) {
      var result = {};
      for (var key in transaction) {
        if (transaction[key] == null) {
          continue;
        }
        var value = transaction[key];
        if (key === "type" && value === 0) {
          continue;
        }
        if ({ type: true, gasLimit: true, gasPrice: true, maxFeePerGs: true, maxPriorityFeePerGas: true, nonce: true, value: true }[key]) {
          value = (0, bytes_1.hexValue)((0, bytes_1.hexlify)(value));
        } else if (key === "accessList") {
          value = "[" + (0, transactions_1.accessListify)(value).map(function(set) {
            return '{address:"' + set.address + '",storageKeys:["' + set.storageKeys.join('","') + '"]}';
          }).join(",") + "]";
        } else {
          value = (0, bytes_1.hexlify)(value);
        }
        result[key] = value;
      }
      return result;
    }
    function getResult(result) {
      if (result.status == 0 && (result.message === "No records found" || result.message === "No transactions found")) {
        return result.result;
      }
      if (result.status != 1 || typeof result.message !== "string" || !result.message.match(/^OK/)) {
        var error = new Error("invalid response");
        error.result = JSON.stringify(result);
        if ((result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
          error.throttleRetry = true;
        }
        throw error;
      }
      return result.result;
    }
    function getJsonResult(result) {
      if (result && result.status == 0 && result.message == "NOTOK" && (result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
        var error = new Error("throttled response");
        error.result = JSON.stringify(result);
        error.throttleRetry = true;
        throw error;
      }
      if (result.jsonrpc != "2.0") {
        var error = new Error("invalid response");
        error.result = JSON.stringify(result);
        throw error;
      }
      if (result.error) {
        var error = new Error(result.error.message || "unknown error");
        if (result.error.code) {
          error.code = result.error.code;
        }
        if (result.error.data) {
          error.data = result.error.data;
        }
        throw error;
      }
      return result.result;
    }
    function checkLogTag(blockTag) {
      if (blockTag === "pending") {
        throw new Error("pending not supported");
      }
      if (blockTag === "latest") {
        return blockTag;
      }
      return parseInt(blockTag.substring(2), 16);
    }
    function checkError(method, error, transaction) {
      if (method === "call" && error.code === logger_1.Logger.errors.SERVER_ERROR) {
        var e = error.error;
        if (e && (e.message.match(/reverted/i) || e.message.match(/VM execution error/i))) {
          var data = e.data;
          if (data) {
            data = "0x" + data.replace(/^.*0x/i, "");
          }
          if ((0, bytes_1.isHexString)(data)) {
            return data;
          }
          logger.throwError("missing revert data in call exception", logger_1.Logger.errors.CALL_EXCEPTION, {
            error,
            data: "0x"
          });
        }
      }
      var message = error.message;
      if (error.code === logger_1.Logger.errors.SERVER_ERROR) {
        if (error.error && typeof error.error.message === "string") {
          message = error.error.message;
        } else if (typeof error.body === "string") {
          message = error.body;
        } else if (typeof error.responseText === "string") {
          message = error.responseText;
        }
      }
      message = (message || "").toLowerCase();
      if (message.match(/insufficient funds/)) {
        logger.throwError("insufficient funds for intrinsic transaction cost", logger_1.Logger.errors.INSUFFICIENT_FUNDS, {
          error,
          method,
          transaction
        });
      }
      if (message.match(/same hash was already imported|transaction nonce is too low|nonce too low/)) {
        logger.throwError("nonce has already been used", logger_1.Logger.errors.NONCE_EXPIRED, {
          error,
          method,
          transaction
        });
      }
      if (message.match(/another transaction with same nonce/)) {
        logger.throwError("replacement fee too low", logger_1.Logger.errors.REPLACEMENT_UNDERPRICED, {
          error,
          method,
          transaction
        });
      }
      if (message.match(/execution failed due to an exception|execution reverted/)) {
        logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", logger_1.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
          error,
          method,
          transaction
        });
      }
      throw error;
    }
    var EtherscanProvider = (
      /** @class */
      function(_super) {
        __extends(EtherscanProvider2, _super);
        function EtherscanProvider2(network, apiKey) {
          var _this = _super.call(this, network) || this;
          (0, properties_1.defineReadOnly)(_this, "baseUrl", _this.getBaseUrl());
          (0, properties_1.defineReadOnly)(_this, "apiKey", apiKey || null);
          return _this;
        }
        EtherscanProvider2.prototype.getBaseUrl = function() {
          switch (this.network ? this.network.name : "invalid") {
            case "homestead":
              return "https://api.etherscan.io";
            case "goerli":
              return "https://api-goerli.etherscan.io";
            case "sepolia":
              return "https://api-sepolia.etherscan.io";
            case "matic":
              return "https://api.polygonscan.com";
            case "maticmum":
              return "https://api-testnet.polygonscan.com";
            case "arbitrum":
              return "https://api.arbiscan.io";
            case "arbitrum-goerli":
              return "https://api-goerli.arbiscan.io";
            case "optimism":
              return "https://api-optimistic.etherscan.io";
            case "optimism-goerli":
              return "https://api-goerli-optimistic.etherscan.io";
            default:
          }
          return logger.throwArgumentError("unsupported network", "network", this.network.name);
        };
        EtherscanProvider2.prototype.getUrl = function(module2, params) {
          var query = Object.keys(params).reduce(function(accum, key) {
            var value = params[key];
            if (value != null) {
              accum += "&" + key + "=" + value;
            }
            return accum;
          }, "");
          var apiKey = this.apiKey ? "&apikey=" + this.apiKey : "";
          return this.baseUrl + "/api?module=" + module2 + query + apiKey;
        };
        EtherscanProvider2.prototype.getPostUrl = function() {
          return this.baseUrl + "/api";
        };
        EtherscanProvider2.prototype.getPostData = function(module2, params) {
          params.module = module2;
          params.apikey = this.apiKey;
          return params;
        };
        EtherscanProvider2.prototype.fetch = function(module2, params, post) {
          return __awaiter(this, void 0, void 0, function() {
            var url, payload, procFunc, connection, payloadStr, result;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = post ? this.getPostUrl() : this.getUrl(module2, params);
                  payload = post ? this.getPostData(module2, params) : null;
                  procFunc = module2 === "proxy" ? getJsonResult : getResult;
                  this.emit("debug", {
                    action: "request",
                    request: url,
                    provider: this
                  });
                  connection = {
                    url,
                    throttleSlotInterval: 1e3,
                    throttleCallback: function(attempt, url2) {
                      if (_this.isCommunityResource()) {
                        (0, formatter_1.showThrottleMessage)();
                      }
                      return Promise.resolve(true);
                    }
                  };
                  payloadStr = null;
                  if (payload) {
                    connection.headers = { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" };
                    payloadStr = Object.keys(payload).map(function(key) {
                      return key + "=" + payload[key];
                    }).join("&");
                  }
                  return [4, (0, web_1.fetchJson)(connection, payloadStr, procFunc || getJsonResult)];
                case 1:
                  result = _a.sent();
                  this.emit("debug", {
                    action: "response",
                    request: url,
                    response: (0, properties_1.deepCopy)(result),
                    provider: this
                  });
                  return [2, result];
              }
            });
          });
        };
        EtherscanProvider2.prototype.detectNetwork = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, this.network];
            });
          });
        };
        EtherscanProvider2.prototype.perform = function(method, params) {
          return __awaiter(this, void 0, void 0, function() {
            var _a, postData, error_1, postData, error_2, args, topic0, logs, blocks, i, log, block, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  _a = method;
                  switch (_a) {
                    case "getBlockNumber":
                      return [3, 1];
                    case "getGasPrice":
                      return [3, 2];
                    case "getBalance":
                      return [3, 3];
                    case "getTransactionCount":
                      return [3, 4];
                    case "getCode":
                      return [3, 5];
                    case "getStorageAt":
                      return [3, 6];
                    case "sendTransaction":
                      return [3, 7];
                    case "getBlock":
                      return [3, 8];
                    case "getTransaction":
                      return [3, 9];
                    case "getTransactionReceipt":
                      return [3, 10];
                    case "call":
                      return [3, 11];
                    case "estimateGas":
                      return [3, 15];
                    case "getLogs":
                      return [3, 19];
                    case "getEtherPrice":
                      return [3, 26];
                  }
                  return [3, 28];
                case 1:
                  return [2, this.fetch("proxy", { action: "eth_blockNumber" })];
                case 2:
                  return [2, this.fetch("proxy", { action: "eth_gasPrice" })];
                case 3:
                  return [2, this.fetch("account", {
                    action: "balance",
                    address: params.address,
                    tag: params.blockTag
                  })];
                case 4:
                  return [2, this.fetch("proxy", {
                    action: "eth_getTransactionCount",
                    address: params.address,
                    tag: params.blockTag
                  })];
                case 5:
                  return [2, this.fetch("proxy", {
                    action: "eth_getCode",
                    address: params.address,
                    tag: params.blockTag
                  })];
                case 6:
                  return [2, this.fetch("proxy", {
                    action: "eth_getStorageAt",
                    address: params.address,
                    position: params.position,
                    tag: params.blockTag
                  })];
                case 7:
                  return [2, this.fetch("proxy", {
                    action: "eth_sendRawTransaction",
                    hex: params.signedTransaction
                  }, true).catch(function(error) {
                    return checkError("sendTransaction", error, params.signedTransaction);
                  })];
                case 8:
                  if (params.blockTag) {
                    return [2, this.fetch("proxy", {
                      action: "eth_getBlockByNumber",
                      tag: params.blockTag,
                      boolean: params.includeTransactions ? "true" : "false"
                    })];
                  }
                  throw new Error("getBlock by blockHash not implemented");
                case 9:
                  return [2, this.fetch("proxy", {
                    action: "eth_getTransactionByHash",
                    txhash: params.transactionHash
                  })];
                case 10:
                  return [2, this.fetch("proxy", {
                    action: "eth_getTransactionReceipt",
                    txhash: params.transactionHash
                  })];
                case 11:
                  if (params.blockTag !== "latest") {
                    throw new Error("EtherscanProvider does not support blockTag for call");
                  }
                  postData = getTransactionPostData(params.transaction);
                  postData.module = "proxy";
                  postData.action = "eth_call";
                  _c.label = 12;
                case 12:
                  _c.trys.push([12, 14, , 15]);
                  return [4, this.fetch("proxy", postData, true)];
                case 13:
                  return [2, _c.sent()];
                case 14:
                  error_1 = _c.sent();
                  return [2, checkError("call", error_1, params.transaction)];
                case 15:
                  postData = getTransactionPostData(params.transaction);
                  postData.module = "proxy";
                  postData.action = "eth_estimateGas";
                  _c.label = 16;
                case 16:
                  _c.trys.push([16, 18, , 19]);
                  return [4, this.fetch("proxy", postData, true)];
                case 17:
                  return [2, _c.sent()];
                case 18:
                  error_2 = _c.sent();
                  return [2, checkError("estimateGas", error_2, params.transaction)];
                case 19:
                  args = { action: "getLogs" };
                  if (params.filter.fromBlock) {
                    args.fromBlock = checkLogTag(params.filter.fromBlock);
                  }
                  if (params.filter.toBlock) {
                    args.toBlock = checkLogTag(params.filter.toBlock);
                  }
                  if (params.filter.address) {
                    args.address = params.filter.address;
                  }
                  if (params.filter.topics && params.filter.topics.length > 0) {
                    if (params.filter.topics.length > 1) {
                      logger.throwError("unsupported topic count", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { topics: params.filter.topics });
                    }
                    if (params.filter.topics.length === 1) {
                      topic0 = params.filter.topics[0];
                      if (typeof topic0 !== "string" || topic0.length !== 66) {
                        logger.throwError("unsupported topic format", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { topic0 });
                      }
                      args.topic0 = topic0;
                    }
                  }
                  return [4, this.fetch("logs", args)];
                case 20:
                  logs = _c.sent();
                  blocks = {};
                  i = 0;
                  _c.label = 21;
                case 21:
                  if (!(i < logs.length))
                    return [3, 25];
                  log = logs[i];
                  if (log.blockHash != null) {
                    return [3, 24];
                  }
                  if (!(blocks[log.blockNumber] == null))
                    return [3, 23];
                  return [4, this.getBlock(log.blockNumber)];
                case 22:
                  block = _c.sent();
                  if (block) {
                    blocks[log.blockNumber] = block.hash;
                  }
                  _c.label = 23;
                case 23:
                  log.blockHash = blocks[log.blockNumber];
                  _c.label = 24;
                case 24:
                  i++;
                  return [3, 21];
                case 25:
                  return [2, logs];
                case 26:
                  if (this.network.name !== "homestead") {
                    return [2, 0];
                  }
                  _b = parseFloat;
                  return [4, this.fetch("stats", { action: "ethprice" })];
                case 27:
                  return [2, _b.apply(void 0, [_c.sent().ethusd])];
                case 28:
                  return [3, 29];
                case 29:
                  return [2, _super.prototype.perform.call(this, method, params)];
              }
            });
          });
        };
        EtherscanProvider2.prototype.getHistory = function(addressOrName, startBlock, endBlock) {
          return __awaiter(this, void 0, void 0, function() {
            var params, result;
            var _a;
            var _this = this;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = {
                    action: "txlist"
                  };
                  return [4, this.resolveName(addressOrName)];
                case 1:
                  params = (_a.address = _b.sent(), _a.startblock = startBlock == null ? 0 : startBlock, _a.endblock = endBlock == null ? 99999999 : endBlock, _a.sort = "asc", _a);
                  return [4, this.fetch("account", params)];
                case 2:
                  result = _b.sent();
                  return [2, result.map(function(tx) {
                    ["contractAddress", "to"].forEach(function(key) {
                      if (tx[key] == "") {
                        delete tx[key];
                      }
                    });
                    if (tx.creates == null && tx.contractAddress != null) {
                      tx.creates = tx.contractAddress;
                    }
                    var item = _this.formatter.transactionResponse(tx);
                    if (tx.timeStamp) {
                      item.timestamp = parseInt(tx.timeStamp);
                    }
                    return item;
                  })];
              }
            });
          });
        };
        EtherscanProvider2.prototype.isCommunityResource = function() {
          return this.apiKey == null;
        };
        return EtherscanProvider2;
      }(base_provider_1.BaseProvider)
    );
    exports.EtherscanProvider = EtherscanProvider;
  }
});

// node_modules/@ethersproject/providers/lib/fallback-provider.js
var require_fallback_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/fallback-provider.js"(exports) {
    "use strict";
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
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
    };
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FallbackProvider = void 0;
    var abstract_provider_1 = require_lib16();
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var properties_1 = require_lib8();
    var random_1 = require_lib24();
    var web_1 = require_lib28();
    var base_provider_1 = require_base_provider();
    var formatter_1 = require_formatter();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    function now() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
    function checkNetworks(networks) {
      var result = null;
      for (var i = 0; i < networks.length; i++) {
        var network = networks[i];
        if (network == null) {
          return null;
        }
        if (result) {
          if (!(result.name === network.name && result.chainId === network.chainId && (result.ensAddress === network.ensAddress || result.ensAddress == null && network.ensAddress == null))) {
            logger.throwArgumentError("provider mismatch", "networks", networks);
          }
        } else {
          result = network;
        }
      }
      return result;
    }
    function median(values, maxDelta) {
      values = values.slice().sort();
      var middle = Math.floor(values.length / 2);
      if (values.length % 2) {
        return values[middle];
      }
      var a = values[middle - 1], b = values[middle];
      if (maxDelta != null && Math.abs(a - b) > maxDelta) {
        return null;
      }
      return (a + b) / 2;
    }
    function serialize(value) {
      if (value === null) {
        return "null";
      } else if (typeof value === "number" || typeof value === "boolean") {
        return JSON.stringify(value);
      } else if (typeof value === "string") {
        return value;
      } else if (bignumber_1.BigNumber.isBigNumber(value)) {
        return value.toString();
      } else if (Array.isArray(value)) {
        return JSON.stringify(value.map(function(i) {
          return serialize(i);
        }));
      } else if (typeof value === "object") {
        var keys = Object.keys(value);
        keys.sort();
        return "{" + keys.map(function(key) {
          var v = value[key];
          if (typeof v === "function") {
            v = "[function]";
          } else {
            v = serialize(v);
          }
          return JSON.stringify(key) + ":" + v;
        }).join(",") + "}";
      }
      throw new Error("unknown value type: " + typeof value);
    }
    var nextRid = 1;
    function stall(duration) {
      var cancel = null;
      var timer = null;
      var promise = new Promise(function(resolve) {
        cancel = function() {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          resolve();
        };
        timer = setTimeout(cancel, duration);
      });
      var wait = function(func) {
        promise = promise.then(func);
        return promise;
      };
      function getPromise() {
        return promise;
      }
      return { cancel, getPromise, wait };
    }
    var ForwardErrors = [
      logger_1.Logger.errors.CALL_EXCEPTION,
      logger_1.Logger.errors.INSUFFICIENT_FUNDS,
      logger_1.Logger.errors.NONCE_EXPIRED,
      logger_1.Logger.errors.REPLACEMENT_UNDERPRICED,
      logger_1.Logger.errors.UNPREDICTABLE_GAS_LIMIT
    ];
    var ForwardProperties = [
      "address",
      "args",
      "errorArgs",
      "errorSignature",
      "method",
      "transaction"
    ];
    function exposeDebugConfig(config, now2) {
      var result = {
        weight: config.weight
      };
      Object.defineProperty(result, "provider", { get: function() {
        return config.provider;
      } });
      if (config.start) {
        result.start = config.start;
      }
      if (now2) {
        result.duration = now2 - config.start;
      }
      if (config.done) {
        if (config.error) {
          result.error = config.error;
        } else {
          result.result = config.result || null;
        }
      }
      return result;
    }
    function normalizedTally(normalize, quorum) {
      return function(configs) {
        var tally = {};
        configs.forEach(function(c) {
          var value = normalize(c.result);
          if (!tally[value]) {
            tally[value] = { count: 0, result: c.result };
          }
          tally[value].count++;
        });
        var keys = Object.keys(tally);
        for (var i = 0; i < keys.length; i++) {
          var check = tally[keys[i]];
          if (check.count >= quorum) {
            return check.result;
          }
        }
        return void 0;
      };
    }
    function getProcessFunc(provider, method, params) {
      var normalize = serialize;
      switch (method) {
        case "getBlockNumber":
          return function(configs) {
            var values = configs.map(function(c) {
              return c.result;
            });
            var blockNumber = median(configs.map(function(c) {
              return c.result;
            }), 2);
            if (blockNumber == null) {
              return void 0;
            }
            blockNumber = Math.ceil(blockNumber);
            if (values.indexOf(blockNumber + 1) >= 0) {
              blockNumber++;
            }
            if (blockNumber >= provider._highestBlockNumber) {
              provider._highestBlockNumber = blockNumber;
            }
            return provider._highestBlockNumber;
          };
        case "getGasPrice":
          return function(configs) {
            var values = configs.map(function(c) {
              return c.result;
            });
            values.sort();
            return values[Math.floor(values.length / 2)];
          };
        case "getEtherPrice":
          return function(configs) {
            return median(configs.map(function(c) {
              return c.result;
            }));
          };
        case "getBalance":
        case "getTransactionCount":
        case "getCode":
        case "getStorageAt":
        case "call":
        case "estimateGas":
        case "getLogs":
          break;
        case "getTransaction":
        case "getTransactionReceipt":
          normalize = function(tx) {
            if (tx == null) {
              return null;
            }
            tx = (0, properties_1.shallowCopy)(tx);
            tx.confirmations = -1;
            return serialize(tx);
          };
          break;
        case "getBlock":
          if (params.includeTransactions) {
            normalize = function(block) {
              if (block == null) {
                return null;
              }
              block = (0, properties_1.shallowCopy)(block);
              block.transactions = block.transactions.map(function(tx) {
                tx = (0, properties_1.shallowCopy)(tx);
                tx.confirmations = -1;
                return tx;
              });
              return serialize(block);
            };
          } else {
            normalize = function(block) {
              if (block == null) {
                return null;
              }
              return serialize(block);
            };
          }
          break;
        default:
          throw new Error("unknown method: " + method);
      }
      return normalizedTally(normalize, provider.quorum);
    }
    function waitForSync(config, blockNumber) {
      return __awaiter(this, void 0, void 0, function() {
        var provider;
        return __generator(this, function(_a) {
          provider = config.provider;
          if (provider.blockNumber != null && provider.blockNumber >= blockNumber || blockNumber === -1) {
            return [2, provider];
          }
          return [2, (0, web_1.poll)(function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                if (provider.blockNumber >= blockNumber) {
                  return resolve(provider);
                }
                if (config.cancelled) {
                  return resolve(null);
                }
                return resolve(void 0);
              }, 0);
            });
          }, { oncePoll: provider })];
        });
      });
    }
    function getRunner(config, currentBlockNumber, method, params) {
      return __awaiter(this, void 0, void 0, function() {
        var provider, _a, filter;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              provider = config.provider;
              _a = method;
              switch (_a) {
                case "getBlockNumber":
                  return [3, 1];
                case "getGasPrice":
                  return [3, 1];
                case "getEtherPrice":
                  return [3, 2];
                case "getBalance":
                  return [3, 3];
                case "getTransactionCount":
                  return [3, 3];
                case "getCode":
                  return [3, 3];
                case "getStorageAt":
                  return [3, 6];
                case "getBlock":
                  return [3, 9];
                case "call":
                  return [3, 12];
                case "estimateGas":
                  return [3, 12];
                case "getTransaction":
                  return [3, 15];
                case "getTransactionReceipt":
                  return [3, 15];
                case "getLogs":
                  return [3, 16];
              }
              return [3, 19];
            case 1:
              return [2, provider[method]()];
            case 2:
              if (provider.getEtherPrice) {
                return [2, provider.getEtherPrice()];
              }
              return [3, 19];
            case 3:
              if (!(params.blockTag && (0, bytes_1.isHexString)(params.blockTag)))
                return [3, 5];
              return [4, waitForSync(config, currentBlockNumber)];
            case 4:
              provider = _b.sent();
              _b.label = 5;
            case 5:
              return [2, provider[method](params.address, params.blockTag || "latest")];
            case 6:
              if (!(params.blockTag && (0, bytes_1.isHexString)(params.blockTag)))
                return [3, 8];
              return [4, waitForSync(config, currentBlockNumber)];
            case 7:
              provider = _b.sent();
              _b.label = 8;
            case 8:
              return [2, provider.getStorageAt(params.address, params.position, params.blockTag || "latest")];
            case 9:
              if (!(params.blockTag && (0, bytes_1.isHexString)(params.blockTag)))
                return [3, 11];
              return [4, waitForSync(config, currentBlockNumber)];
            case 10:
              provider = _b.sent();
              _b.label = 11;
            case 11:
              return [2, provider[params.includeTransactions ? "getBlockWithTransactions" : "getBlock"](params.blockTag || params.blockHash)];
            case 12:
              if (!(params.blockTag && (0, bytes_1.isHexString)(params.blockTag)))
                return [3, 14];
              return [4, waitForSync(config, currentBlockNumber)];
            case 13:
              provider = _b.sent();
              _b.label = 14;
            case 14:
              if (method === "call" && params.blockTag) {
                return [2, provider[method](params.transaction, params.blockTag)];
              }
              return [2, provider[method](params.transaction)];
            case 15:
              return [2, provider[method](params.transactionHash)];
            case 16:
              filter = params.filter;
              if (!(filter.fromBlock && (0, bytes_1.isHexString)(filter.fromBlock) || filter.toBlock && (0, bytes_1.isHexString)(filter.toBlock)))
                return [3, 18];
              return [4, waitForSync(config, currentBlockNumber)];
            case 17:
              provider = _b.sent();
              _b.label = 18;
            case 18:
              return [2, provider.getLogs(filter)];
            case 19:
              return [2, logger.throwError("unknown method error", logger_1.Logger.errors.UNKNOWN_ERROR, {
                method,
                params
              })];
          }
        });
      });
    }
    var FallbackProvider = (
      /** @class */
      function(_super) {
        __extends(FallbackProvider2, _super);
        function FallbackProvider2(providers, quorum) {
          var _this = this;
          if (providers.length === 0) {
            logger.throwArgumentError("missing providers", "providers", providers);
          }
          var providerConfigs = providers.map(function(configOrProvider, index) {
            if (abstract_provider_1.Provider.isProvider(configOrProvider)) {
              var stallTimeout = (0, formatter_1.isCommunityResource)(configOrProvider) ? 2e3 : 750;
              var priority = 1;
              return Object.freeze({ provider: configOrProvider, weight: 1, stallTimeout, priority });
            }
            var config = (0, properties_1.shallowCopy)(configOrProvider);
            if (config.priority == null) {
              config.priority = 1;
            }
            if (config.stallTimeout == null) {
              config.stallTimeout = (0, formatter_1.isCommunityResource)(configOrProvider) ? 2e3 : 750;
            }
            if (config.weight == null) {
              config.weight = 1;
            }
            var weight = config.weight;
            if (weight % 1 || weight > 512 || weight < 1) {
              logger.throwArgumentError("invalid weight; must be integer in [1, 512]", "providers[" + index + "].weight", weight);
            }
            return Object.freeze(config);
          });
          var total = providerConfigs.reduce(function(accum, c) {
            return accum + c.weight;
          }, 0);
          if (quorum == null) {
            quorum = total / 2;
          } else if (quorum > total) {
            logger.throwArgumentError("quorum will always fail; larger than total weight", "quorum", quorum);
          }
          var networkOrReady = checkNetworks(providerConfigs.map(function(c) {
            return c.provider.network;
          }));
          if (networkOrReady == null) {
            networkOrReady = new Promise(function(resolve, reject) {
              setTimeout(function() {
                _this.detectNetwork().then(resolve, reject);
              }, 0);
            });
          }
          _this = _super.call(this, networkOrReady) || this;
          (0, properties_1.defineReadOnly)(_this, "providerConfigs", Object.freeze(providerConfigs));
          (0, properties_1.defineReadOnly)(_this, "quorum", quorum);
          _this._highestBlockNumber = -1;
          return _this;
        }
        FallbackProvider2.prototype.detectNetwork = function() {
          return __awaiter(this, void 0, void 0, function() {
            var networks;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, Promise.all(this.providerConfigs.map(function(c) {
                    return c.provider.getNetwork();
                  }))];
                case 1:
                  networks = _a.sent();
                  return [2, checkNetworks(networks)];
              }
            });
          });
        };
        FallbackProvider2.prototype.perform = function(method, params) {
          return __awaiter(this, void 0, void 0, function() {
            var results, i_1, result, processFunc, configs, currentBlockNumber, i, first, _loop_1, this_1, state_1;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(method === "sendTransaction"))
                    return [3, 2];
                  return [4, Promise.all(this.providerConfigs.map(function(c) {
                    return c.provider.sendTransaction(params.signedTransaction).then(function(result2) {
                      return result2.hash;
                    }, function(error) {
                      return error;
                    });
                  }))];
                case 1:
                  results = _a.sent();
                  for (i_1 = 0; i_1 < results.length; i_1++) {
                    result = results[i_1];
                    if (typeof result === "string") {
                      return [2, result];
                    }
                  }
                  throw results[0];
                case 2:
                  if (!(this._highestBlockNumber === -1 && method !== "getBlockNumber"))
                    return [3, 4];
                  return [4, this.getBlockNumber()];
                case 3:
                  _a.sent();
                  _a.label = 4;
                case 4:
                  processFunc = getProcessFunc(this, method, params);
                  configs = (0, random_1.shuffled)(this.providerConfigs.map(properties_1.shallowCopy));
                  configs.sort(function(a, b) {
                    return a.priority - b.priority;
                  });
                  currentBlockNumber = this._highestBlockNumber;
                  i = 0;
                  first = true;
                  _loop_1 = function() {
                    var t0, inflightWeight, _loop_2, waiting, results2, result2, errors;
                    return __generator(this, function(_b) {
                      switch (_b.label) {
                        case 0:
                          t0 = now();
                          inflightWeight = configs.filter(function(c) {
                            return c.runner && t0 - c.start < c.stallTimeout;
                          }).reduce(function(accum, c) {
                            return accum + c.weight;
                          }, 0);
                          _loop_2 = function() {
                            var config = configs[i++];
                            var rid = nextRid++;
                            config.start = now();
                            config.staller = stall(config.stallTimeout);
                            config.staller.wait(function() {
                              config.staller = null;
                            });
                            config.runner = getRunner(config, currentBlockNumber, method, params).then(function(result3) {
                              config.done = true;
                              config.result = result3;
                              if (_this.listenerCount("debug")) {
                                _this.emit("debug", {
                                  action: "request",
                                  rid,
                                  backend: exposeDebugConfig(config, now()),
                                  request: { method, params: (0, properties_1.deepCopy)(params) },
                                  provider: _this
                                });
                              }
                            }, function(error) {
                              config.done = true;
                              config.error = error;
                              if (_this.listenerCount("debug")) {
                                _this.emit("debug", {
                                  action: "request",
                                  rid,
                                  backend: exposeDebugConfig(config, now()),
                                  request: { method, params: (0, properties_1.deepCopy)(params) },
                                  provider: _this
                                });
                              }
                            });
                            if (this_1.listenerCount("debug")) {
                              this_1.emit("debug", {
                                action: "request",
                                rid,
                                backend: exposeDebugConfig(config, null),
                                request: { method, params: (0, properties_1.deepCopy)(params) },
                                provider: this_1
                              });
                            }
                            inflightWeight += config.weight;
                          };
                          while (inflightWeight < this_1.quorum && i < configs.length) {
                            _loop_2();
                          }
                          waiting = [];
                          configs.forEach(function(c) {
                            if (c.done || !c.runner) {
                              return;
                            }
                            waiting.push(c.runner);
                            if (c.staller) {
                              waiting.push(c.staller.getPromise());
                            }
                          });
                          if (!waiting.length)
                            return [3, 2];
                          return [4, Promise.race(waiting)];
                        case 1:
                          _b.sent();
                          _b.label = 2;
                        case 2:
                          results2 = configs.filter(function(c) {
                            return c.done && c.error == null;
                          });
                          if (!(results2.length >= this_1.quorum))
                            return [3, 5];
                          result2 = processFunc(results2);
                          if (result2 !== void 0) {
                            configs.forEach(function(c) {
                              if (c.staller) {
                                c.staller.cancel();
                              }
                              c.cancelled = true;
                            });
                            return [2, { value: result2 }];
                          }
                          if (!!first)
                            return [3, 4];
                          return [4, stall(100).getPromise()];
                        case 3:
                          _b.sent();
                          _b.label = 4;
                        case 4:
                          first = false;
                          _b.label = 5;
                        case 5:
                          errors = configs.reduce(function(accum, c) {
                            if (!c.done || c.error == null) {
                              return accum;
                            }
                            var code = c.error.code;
                            if (ForwardErrors.indexOf(code) >= 0) {
                              if (!accum[code]) {
                                accum[code] = { error: c.error, weight: 0 };
                              }
                              accum[code].weight += c.weight;
                            }
                            return accum;
                          }, {});
                          Object.keys(errors).forEach(function(errorCode) {
                            var tally = errors[errorCode];
                            if (tally.weight < _this.quorum) {
                              return;
                            }
                            configs.forEach(function(c) {
                              if (c.staller) {
                                c.staller.cancel();
                              }
                              c.cancelled = true;
                            });
                            var e = tally.error;
                            var props = {};
                            ForwardProperties.forEach(function(name) {
                              if (e[name] == null) {
                                return;
                              }
                              props[name] = e[name];
                            });
                            logger.throwError(e.reason || e.message, errorCode, props);
                          });
                          if (configs.filter(function(c) {
                            return !c.done;
                          }).length === 0) {
                            return [2, "break"];
                          }
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  this_1 = this;
                  _a.label = 5;
                case 5:
                  if (false)
                    return [3, 7];
                  return [5, _loop_1()];
                case 6:
                  state_1 = _a.sent();
                  if (typeof state_1 === "object")
                    return [2, state_1.value];
                  if (state_1 === "break")
                    return [3, 7];
                  return [3, 5];
                case 7:
                  configs.forEach(function(c) {
                    if (c.staller) {
                      c.staller.cancel();
                    }
                    c.cancelled = true;
                  });
                  return [2, logger.throwError("failed to meet quorum", logger_1.Logger.errors.SERVER_ERROR, {
                    method,
                    params,
                    //results: configs.map((c) => c.result),
                    //errors: configs.map((c) => c.error),
                    results: configs.map(function(c) {
                      return exposeDebugConfig(c);
                    }),
                    provider: this
                  })];
              }
            });
          });
        };
        return FallbackProvider2;
      }(base_provider_1.BaseProvider)
    );
    exports.FallbackProvider = FallbackProvider;
  }
});

// node_modules/@ethersproject/providers/lib/ipc-provider.js
var require_ipc_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/ipc-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IpcProvider = void 0;
    var net_1 = __require("net");
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var json_rpc_provider_1 = require_json_rpc_provider();
    var IpcProvider = (
      /** @class */
      function(_super) {
        __extends(IpcProvider2, _super);
        function IpcProvider2(path, network) {
          var _this = this;
          if (path == null) {
            logger.throwError("missing path", logger_1.Logger.errors.MISSING_ARGUMENT, { arg: "path" });
          }
          _this = _super.call(this, "ipc://" + path, network) || this;
          (0, properties_1.defineReadOnly)(_this, "path", path);
          return _this;
        }
        IpcProvider2.prototype.send = function(method, params) {
          var _this = this;
          var payload = JSON.stringify({
            method,
            params,
            id: 42,
            jsonrpc: "2.0"
          });
          return new Promise(function(resolve, reject) {
            var response = Buffer.alloc(0);
            var stream = (0, net_1.connect)(_this.path);
            stream.on("data", function(data) {
              response = Buffer.concat([response, data]);
            });
            stream.on("end", function() {
              try {
                resolve(JSON.parse(response.toString()).result);
                stream.destroy();
              } catch (error) {
                reject(error);
                stream.destroy();
              }
            });
            stream.on("error", function(error) {
              reject(error);
              stream.destroy();
            });
            stream.write(payload);
            stream.end();
          });
        };
        return IpcProvider2;
      }(json_rpc_provider_1.JsonRpcProvider)
    );
    exports.IpcProvider = IpcProvider;
  }
});

// node_modules/@ethersproject/providers/lib/infura-provider.js
var require_infura_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/infura-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InfuraProvider = exports.InfuraWebSocketProvider = void 0;
    var properties_1 = require_lib8();
    var websocket_provider_1 = require_websocket_provider();
    var formatter_1 = require_formatter();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    var defaultProjectId = "84842078b09946638c03157f83405213";
    var InfuraWebSocketProvider = (
      /** @class */
      function(_super) {
        __extends(InfuraWebSocketProvider2, _super);
        function InfuraWebSocketProvider2(network, apiKey) {
          var _this = this;
          var provider = new InfuraProvider(network, apiKey);
          var connection = provider.connection;
          if (connection.password) {
            logger.throwError("INFURA WebSocket project secrets unsupported", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
              operation: "InfuraProvider.getWebSocketProvider()"
            });
          }
          var url = connection.url.replace(/^http/i, "ws").replace("/v3/", "/ws/v3/");
          _this = _super.call(this, url, network) || this;
          (0, properties_1.defineReadOnly)(_this, "apiKey", provider.projectId);
          (0, properties_1.defineReadOnly)(_this, "projectId", provider.projectId);
          (0, properties_1.defineReadOnly)(_this, "projectSecret", provider.projectSecret);
          return _this;
        }
        InfuraWebSocketProvider2.prototype.isCommunityResource = function() {
          return this.projectId === defaultProjectId;
        };
        return InfuraWebSocketProvider2;
      }(websocket_provider_1.WebSocketProvider)
    );
    exports.InfuraWebSocketProvider = InfuraWebSocketProvider;
    var InfuraProvider = (
      /** @class */
      function(_super) {
        __extends(InfuraProvider2, _super);
        function InfuraProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        InfuraProvider2.getWebSocketProvider = function(network, apiKey) {
          return new InfuraWebSocketProvider(network, apiKey);
        };
        InfuraProvider2.getApiKey = function(apiKey) {
          var apiKeyObj = {
            apiKey: defaultProjectId,
            projectId: defaultProjectId,
            projectSecret: null
          };
          if (apiKey == null) {
            return apiKeyObj;
          }
          if (typeof apiKey === "string") {
            apiKeyObj.projectId = apiKey;
          } else if (apiKey.projectSecret != null) {
            logger.assertArgument(typeof apiKey.projectId === "string", "projectSecret requires a projectId", "projectId", apiKey.projectId);
            logger.assertArgument(typeof apiKey.projectSecret === "string", "invalid projectSecret", "projectSecret", "[REDACTED]");
            apiKeyObj.projectId = apiKey.projectId;
            apiKeyObj.projectSecret = apiKey.projectSecret;
          } else if (apiKey.projectId) {
            apiKeyObj.projectId = apiKey.projectId;
          }
          apiKeyObj.apiKey = apiKeyObj.projectId;
          return apiKeyObj;
        };
        InfuraProvider2.getUrl = function(network, apiKey) {
          var host = null;
          switch (network ? network.name : "unknown") {
            case "homestead":
              host = "mainnet.infura.io";
              break;
            case "goerli":
              host = "goerli.infura.io";
              break;
            case "sepolia":
              host = "sepolia.infura.io";
              break;
            case "matic":
              host = "polygon-mainnet.infura.io";
              break;
            case "maticmum":
              host = "polygon-mumbai.infura.io";
              break;
            case "optimism":
              host = "optimism-mainnet.infura.io";
              break;
            case "optimism-goerli":
              host = "optimism-goerli.infura.io";
              break;
            case "arbitrum":
              host = "arbitrum-mainnet.infura.io";
              break;
            case "arbitrum-goerli":
              host = "arbitrum-goerli.infura.io";
              break;
            default:
              logger.throwError("unsupported network", logger_1.Logger.errors.INVALID_ARGUMENT, {
                argument: "network",
                value: network
              });
          }
          var connection = {
            allowGzip: true,
            url: "https://" + host + "/v3/" + apiKey.projectId,
            throttleCallback: function(attempt, url) {
              if (apiKey.projectId === defaultProjectId) {
                (0, formatter_1.showThrottleMessage)();
              }
              return Promise.resolve(true);
            }
          };
          if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
          }
          return connection;
        };
        InfuraProvider2.prototype.isCommunityResource = function() {
          return this.projectId === defaultProjectId;
        };
        return InfuraProvider2;
      }(url_json_rpc_provider_1.UrlJsonRpcProvider)
    );
    exports.InfuraProvider = InfuraProvider;
  }
});

// node_modules/@ethersproject/providers/lib/json-rpc-batch-provider.js
var require_json_rpc_batch_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/json-rpc-batch-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonRpcBatchProvider = void 0;
    var properties_1 = require_lib8();
    var web_1 = require_lib28();
    var json_rpc_provider_1 = require_json_rpc_provider();
    var JsonRpcBatchProvider = (
      /** @class */
      function(_super) {
        __extends(JsonRpcBatchProvider2, _super);
        function JsonRpcBatchProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        JsonRpcBatchProvider2.prototype.send = function(method, params) {
          var _this = this;
          var request = {
            method,
            params,
            id: this._nextId++,
            jsonrpc: "2.0"
          };
          if (this._pendingBatch == null) {
            this._pendingBatch = [];
          }
          var inflightRequest = { request, resolve: null, reject: null };
          var promise = new Promise(function(resolve, reject) {
            inflightRequest.resolve = resolve;
            inflightRequest.reject = reject;
          });
          this._pendingBatch.push(inflightRequest);
          if (!this._pendingBatchAggregator) {
            this._pendingBatchAggregator = setTimeout(function() {
              var batch = _this._pendingBatch;
              _this._pendingBatch = null;
              _this._pendingBatchAggregator = null;
              var request2 = batch.map(function(inflight) {
                return inflight.request;
              });
              _this.emit("debug", {
                action: "requestBatch",
                request: (0, properties_1.deepCopy)(request2),
                provider: _this
              });
              return (0, web_1.fetchJson)(_this.connection, JSON.stringify(request2)).then(function(result) {
                _this.emit("debug", {
                  action: "response",
                  request: request2,
                  response: result,
                  provider: _this
                });
                batch.forEach(function(inflightRequest2, index) {
                  var payload = result[index];
                  if (payload.error) {
                    var error = new Error(payload.error.message);
                    error.code = payload.error.code;
                    error.data = payload.error.data;
                    inflightRequest2.reject(error);
                  } else {
                    inflightRequest2.resolve(payload.result);
                  }
                });
              }, function(error) {
                _this.emit("debug", {
                  action: "response",
                  error,
                  request: request2,
                  provider: _this
                });
                batch.forEach(function(inflightRequest2) {
                  inflightRequest2.reject(error);
                });
              });
            }, 10);
          }
          return promise;
        };
        return JsonRpcBatchProvider2;
      }(json_rpc_provider_1.JsonRpcProvider)
    );
    exports.JsonRpcBatchProvider = JsonRpcBatchProvider;
  }
});

// node_modules/@ethersproject/providers/lib/nodesmith-provider.js
var require_nodesmith_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/nodesmith-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodesmithProvider = void 0;
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var defaultApiKey = "ETHERS_JS_SHARED";
    var NodesmithProvider = (
      /** @class */
      function(_super) {
        __extends(NodesmithProvider2, _super);
        function NodesmithProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        NodesmithProvider2.getApiKey = function(apiKey) {
          if (apiKey && typeof apiKey !== "string") {
            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
          }
          return apiKey || defaultApiKey;
        };
        NodesmithProvider2.getUrl = function(network, apiKey) {
          logger.warn("NodeSmith will be discontinued on 2019-12-20; please migrate to another platform.");
          var host = null;
          switch (network.name) {
            case "homestead":
              host = "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc";
              break;
            case "ropsten":
              host = "https://ethereum.api.nodesmith.io/v1/ropsten/jsonrpc";
              break;
            case "rinkeby":
              host = "https://ethereum.api.nodesmith.io/v1/rinkeby/jsonrpc";
              break;
            case "goerli":
              host = "https://ethereum.api.nodesmith.io/v1/goerli/jsonrpc";
              break;
            case "kovan":
              host = "https://ethereum.api.nodesmith.io/v1/kovan/jsonrpc";
              break;
            default:
              logger.throwArgumentError("unsupported network", "network", arguments[0]);
          }
          return host + "?apiKey=" + apiKey;
        };
        return NodesmithProvider2;
      }(url_json_rpc_provider_1.UrlJsonRpcProvider)
    );
    exports.NodesmithProvider = NodesmithProvider;
  }
});

// node_modules/@ethersproject/providers/lib/pocket-provider.js
var require_pocket_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/pocket-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PocketProvider = void 0;
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    var defaultApplicationId = "62e1ad51b37b8e00394bda3b";
    var PocketProvider = (
      /** @class */
      function(_super) {
        __extends(PocketProvider2, _super);
        function PocketProvider2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        PocketProvider2.getApiKey = function(apiKey) {
          var apiKeyObj = {
            applicationId: null,
            loadBalancer: true,
            applicationSecretKey: null
          };
          if (apiKey == null) {
            apiKeyObj.applicationId = defaultApplicationId;
          } else if (typeof apiKey === "string") {
            apiKeyObj.applicationId = apiKey;
          } else if (apiKey.applicationSecretKey != null) {
            apiKeyObj.applicationId = apiKey.applicationId;
            apiKeyObj.applicationSecretKey = apiKey.applicationSecretKey;
          } else if (apiKey.applicationId) {
            apiKeyObj.applicationId = apiKey.applicationId;
          } else {
            logger.throwArgumentError("unsupported PocketProvider apiKey", "apiKey", apiKey);
          }
          return apiKeyObj;
        };
        PocketProvider2.getUrl = function(network, apiKey) {
          var host = null;
          switch (network ? network.name : "unknown") {
            case "goerli":
              host = "eth-goerli.gateway.pokt.network";
              break;
            case "homestead":
              host = "eth-mainnet.gateway.pokt.network";
              break;
            case "kovan":
              host = "poa-kovan.gateway.pokt.network";
              break;
            case "matic":
              host = "poly-mainnet.gateway.pokt.network";
              break;
            case "maticmum":
              host = "polygon-mumbai-rpc.gateway.pokt.network";
              break;
            case "rinkeby":
              host = "eth-rinkeby.gateway.pokt.network";
              break;
            case "ropsten":
              host = "eth-ropsten.gateway.pokt.network";
              break;
            default:
              logger.throwError("unsupported network", logger_1.Logger.errors.INVALID_ARGUMENT, {
                argument: "network",
                value: network
              });
          }
          var url = "https://" + host + "/v1/lb/" + apiKey.applicationId;
          var connection = { headers: {}, url };
          if (apiKey.applicationSecretKey != null) {
            connection.user = "";
            connection.password = apiKey.applicationSecretKey;
          }
          return connection;
        };
        PocketProvider2.prototype.isCommunityResource = function() {
          return this.applicationId === defaultApplicationId;
        };
        return PocketProvider2;
      }(url_json_rpc_provider_1.UrlJsonRpcProvider)
    );
    exports.PocketProvider = PocketProvider;
  }
});

// node_modules/@ethersproject/providers/lib/web3-provider.js
var require_web3_provider = __commonJS({
  "node_modules/@ethersproject/providers/lib/web3-provider.js"(exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Web3Provider = void 0;
    var properties_1 = require_lib8();
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    var json_rpc_provider_1 = require_json_rpc_provider();
    var _nextId = 1;
    function buildWeb3LegacyFetcher(provider, sendFunc) {
      var fetcher = "Web3LegacyFetcher";
      return function(method, params) {
        var _this = this;
        var request = {
          method,
          params,
          id: _nextId++,
          jsonrpc: "2.0"
        };
        return new Promise(function(resolve, reject) {
          _this.emit("debug", {
            action: "request",
            fetcher,
            request: (0, properties_1.deepCopy)(request),
            provider: _this
          });
          sendFunc(request, function(error, response) {
            if (error) {
              _this.emit("debug", {
                action: "response",
                fetcher,
                error,
                request,
                provider: _this
              });
              return reject(error);
            }
            _this.emit("debug", {
              action: "response",
              fetcher,
              request,
              response,
              provider: _this
            });
            if (response.error) {
              var error_1 = new Error(response.error.message);
              error_1.code = response.error.code;
              error_1.data = response.error.data;
              return reject(error_1);
            }
            resolve(response.result);
          });
        });
      };
    }
    function buildEip1193Fetcher(provider) {
      return function(method, params) {
        var _this = this;
        if (params == null) {
          params = [];
        }
        var request = { method, params };
        this.emit("debug", {
          action: "request",
          fetcher: "Eip1193Fetcher",
          request: (0, properties_1.deepCopy)(request),
          provider: this
        });
        return provider.request(request).then(function(response) {
          _this.emit("debug", {
            action: "response",
            fetcher: "Eip1193Fetcher",
            request,
            response,
            provider: _this
          });
          return response;
        }, function(error) {
          _this.emit("debug", {
            action: "response",
            fetcher: "Eip1193Fetcher",
            request,
            error,
            provider: _this
          });
          throw error;
        });
      };
    }
    var Web3Provider = (
      /** @class */
      function(_super) {
        __extends(Web3Provider2, _super);
        function Web3Provider2(provider, network) {
          var _this = this;
          if (provider == null) {
            logger.throwArgumentError("missing provider", "provider", provider);
          }
          var path = null;
          var jsonRpcFetchFunc = null;
          var subprovider = null;
          if (typeof provider === "function") {
            path = "unknown:";
            jsonRpcFetchFunc = provider;
          } else {
            path = provider.host || provider.path || "";
            if (!path && provider.isMetaMask) {
              path = "metamask";
            }
            subprovider = provider;
            if (provider.request) {
              if (path === "") {
                path = "eip-1193:";
              }
              jsonRpcFetchFunc = buildEip1193Fetcher(provider);
            } else if (provider.sendAsync) {
              jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.sendAsync.bind(provider));
            } else if (provider.send) {
              jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.send.bind(provider));
            } else {
              logger.throwArgumentError("unsupported provider", "provider", provider);
            }
            if (!path) {
              path = "unknown:";
            }
          }
          _this = _super.call(this, path, network) || this;
          (0, properties_1.defineReadOnly)(_this, "jsonRpcFetchFunc", jsonRpcFetchFunc);
          (0, properties_1.defineReadOnly)(_this, "provider", subprovider);
          return _this;
        }
        Web3Provider2.prototype.send = function(method, params) {
          return this.jsonRpcFetchFunc(method, params);
        };
        return Web3Provider2;
      }(json_rpc_provider_1.JsonRpcProvider)
    );
    exports.Web3Provider = Web3Provider;
  }
});

// node_modules/@ethersproject/providers/lib/index.js
var require_lib29 = __commonJS({
  "node_modules/@ethersproject/providers/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Formatter = exports.showThrottleMessage = exports.isCommunityResourcable = exports.isCommunityResource = exports.getNetwork = exports.getDefaultProvider = exports.JsonRpcSigner = exports.IpcProvider = exports.WebSocketProvider = exports.Web3Provider = exports.StaticJsonRpcProvider = exports.PocketProvider = exports.NodesmithProvider = exports.JsonRpcBatchProvider = exports.JsonRpcProvider = exports.InfuraWebSocketProvider = exports.InfuraProvider = exports.EtherscanProvider = exports.CloudflareProvider = exports.AnkrProvider = exports.AlchemyWebSocketProvider = exports.AlchemyProvider = exports.FallbackProvider = exports.UrlJsonRpcProvider = exports.Resolver = exports.BaseProvider = exports.Provider = void 0;
    var abstract_provider_1 = require_lib16();
    Object.defineProperty(exports, "Provider", { enumerable: true, get: function() {
      return abstract_provider_1.Provider;
    } });
    var networks_1 = require_lib27();
    Object.defineProperty(exports, "getNetwork", { enumerable: true, get: function() {
      return networks_1.getNetwork;
    } });
    var base_provider_1 = require_base_provider();
    Object.defineProperty(exports, "BaseProvider", { enumerable: true, get: function() {
      return base_provider_1.BaseProvider;
    } });
    Object.defineProperty(exports, "Resolver", { enumerable: true, get: function() {
      return base_provider_1.Resolver;
    } });
    var alchemy_provider_1 = require_alchemy_provider();
    Object.defineProperty(exports, "AlchemyProvider", { enumerable: true, get: function() {
      return alchemy_provider_1.AlchemyProvider;
    } });
    Object.defineProperty(exports, "AlchemyWebSocketProvider", { enumerable: true, get: function() {
      return alchemy_provider_1.AlchemyWebSocketProvider;
    } });
    var ankr_provider_1 = require_ankr_provider();
    Object.defineProperty(exports, "AnkrProvider", { enumerable: true, get: function() {
      return ankr_provider_1.AnkrProvider;
    } });
    var cloudflare_provider_1 = require_cloudflare_provider();
    Object.defineProperty(exports, "CloudflareProvider", { enumerable: true, get: function() {
      return cloudflare_provider_1.CloudflareProvider;
    } });
    var etherscan_provider_1 = require_etherscan_provider();
    Object.defineProperty(exports, "EtherscanProvider", { enumerable: true, get: function() {
      return etherscan_provider_1.EtherscanProvider;
    } });
    var fallback_provider_1 = require_fallback_provider();
    Object.defineProperty(exports, "FallbackProvider", { enumerable: true, get: function() {
      return fallback_provider_1.FallbackProvider;
    } });
    var ipc_provider_1 = require_ipc_provider();
    Object.defineProperty(exports, "IpcProvider", { enumerable: true, get: function() {
      return ipc_provider_1.IpcProvider;
    } });
    var infura_provider_1 = require_infura_provider();
    Object.defineProperty(exports, "InfuraProvider", { enumerable: true, get: function() {
      return infura_provider_1.InfuraProvider;
    } });
    Object.defineProperty(exports, "InfuraWebSocketProvider", { enumerable: true, get: function() {
      return infura_provider_1.InfuraWebSocketProvider;
    } });
    var json_rpc_provider_1 = require_json_rpc_provider();
    Object.defineProperty(exports, "JsonRpcProvider", { enumerable: true, get: function() {
      return json_rpc_provider_1.JsonRpcProvider;
    } });
    Object.defineProperty(exports, "JsonRpcSigner", { enumerable: true, get: function() {
      return json_rpc_provider_1.JsonRpcSigner;
    } });
    var json_rpc_batch_provider_1 = require_json_rpc_batch_provider();
    Object.defineProperty(exports, "JsonRpcBatchProvider", { enumerable: true, get: function() {
      return json_rpc_batch_provider_1.JsonRpcBatchProvider;
    } });
    var nodesmith_provider_1 = require_nodesmith_provider();
    Object.defineProperty(exports, "NodesmithProvider", { enumerable: true, get: function() {
      return nodesmith_provider_1.NodesmithProvider;
    } });
    var pocket_provider_1 = require_pocket_provider();
    Object.defineProperty(exports, "PocketProvider", { enumerable: true, get: function() {
      return pocket_provider_1.PocketProvider;
    } });
    var url_json_rpc_provider_1 = require_url_json_rpc_provider();
    Object.defineProperty(exports, "StaticJsonRpcProvider", { enumerable: true, get: function() {
      return url_json_rpc_provider_1.StaticJsonRpcProvider;
    } });
    Object.defineProperty(exports, "UrlJsonRpcProvider", { enumerable: true, get: function() {
      return url_json_rpc_provider_1.UrlJsonRpcProvider;
    } });
    var web3_provider_1 = require_web3_provider();
    Object.defineProperty(exports, "Web3Provider", { enumerable: true, get: function() {
      return web3_provider_1.Web3Provider;
    } });
    var websocket_provider_1 = require_websocket_provider();
    Object.defineProperty(exports, "WebSocketProvider", { enumerable: true, get: function() {
      return websocket_provider_1.WebSocketProvider;
    } });
    var formatter_1 = require_formatter();
    Object.defineProperty(exports, "Formatter", { enumerable: true, get: function() {
      return formatter_1.Formatter;
    } });
    Object.defineProperty(exports, "isCommunityResourcable", { enumerable: true, get: function() {
      return formatter_1.isCommunityResourcable;
    } });
    Object.defineProperty(exports, "isCommunityResource", { enumerable: true, get: function() {
      return formatter_1.isCommunityResource;
    } });
    Object.defineProperty(exports, "showThrottleMessage", { enumerable: true, get: function() {
      return formatter_1.showThrottleMessage;
    } });
    var logger_1 = require_lib();
    var _version_1 = require_version11();
    var logger = new logger_1.Logger(_version_1.version);
    function getDefaultProvider(network, options) {
      if (network == null) {
        network = "homestead";
      }
      if (typeof network === "string") {
        var match = network.match(/^(ws|http)s?:/i);
        if (match) {
          switch (match[1].toLowerCase()) {
            case "http":
            case "https":
              return new json_rpc_provider_1.JsonRpcProvider(network);
            case "ws":
            case "wss":
              return new websocket_provider_1.WebSocketProvider(network);
            default:
              logger.throwArgumentError("unsupported URL scheme", "network", network);
          }
        }
      }
      var n = (0, networks_1.getNetwork)(network);
      if (!n || !n._defaultProvider) {
        logger.throwError("unsupported getDefaultProvider network", logger_1.Logger.errors.NETWORK_ERROR, {
          operation: "getDefaultProvider",
          network
        });
      }
      return n._defaultProvider({
        FallbackProvider: fallback_provider_1.FallbackProvider,
        AlchemyProvider: alchemy_provider_1.AlchemyProvider,
        AnkrProvider: ankr_provider_1.AnkrProvider,
        CloudflareProvider: cloudflare_provider_1.CloudflareProvider,
        EtherscanProvider: etherscan_provider_1.EtherscanProvider,
        InfuraProvider: infura_provider_1.InfuraProvider,
        JsonRpcProvider: json_rpc_provider_1.JsonRpcProvider,
        NodesmithProvider: nodesmith_provider_1.NodesmithProvider,
        PocketProvider: pocket_provider_1.PocketProvider,
        Web3Provider: web3_provider_1.Web3Provider,
        IpcProvider: ipc_provider_1.IpcProvider
      }, options);
    }
    exports.getDefaultProvider = getDefaultProvider;
  }
});

// node_modules/@ethersproject/solidity/lib/_version.js
var require_version12 = __commonJS({
  "node_modules/@ethersproject/solidity/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "solidity/5.7.0";
  }
});

// node_modules/@ethersproject/solidity/lib/index.js
var require_lib30 = __commonJS({
  "node_modules/@ethersproject/solidity/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha256 = exports.keccak256 = exports.pack = void 0;
    var bignumber_1 = require_lib3();
    var bytes_1 = require_lib2();
    var keccak256_1 = require_lib4();
    var sha2_1 = require_lib21();
    var strings_1 = require_lib11();
    var regexBytes = new RegExp("^bytes([0-9]+)$");
    var regexNumber = new RegExp("^(u?int)([0-9]*)$");
    var regexArray = new RegExp("^(.*)\\[([0-9]*)\\]$");
    var Zeros = "0000000000000000000000000000000000000000000000000000000000000000";
    var logger_1 = require_lib();
    var _version_1 = require_version12();
    var logger = new logger_1.Logger(_version_1.version);
    function _pack(type, value, isArray) {
      switch (type) {
        case "address":
          if (isArray) {
            return (0, bytes_1.zeroPad)(value, 32);
          }
          return (0, bytes_1.arrayify)(value);
        case "string":
          return (0, strings_1.toUtf8Bytes)(value);
        case "bytes":
          return (0, bytes_1.arrayify)(value);
        case "bool":
          value = value ? "0x01" : "0x00";
          if (isArray) {
            return (0, bytes_1.zeroPad)(value, 32);
          }
          return (0, bytes_1.arrayify)(value);
      }
      var match = type.match(regexNumber);
      if (match) {
        var size = parseInt(match[2] || "256");
        if (match[2] && String(size) !== match[2] || size % 8 !== 0 || size === 0 || size > 256) {
          logger.throwArgumentError("invalid number type", "type", type);
        }
        if (isArray) {
          size = 256;
        }
        value = bignumber_1.BigNumber.from(value).toTwos(size);
        return (0, bytes_1.zeroPad)(value, size / 8);
      }
      match = type.match(regexBytes);
      if (match) {
        var size = parseInt(match[1]);
        if (String(size) !== match[1] || size === 0 || size > 32) {
          logger.throwArgumentError("invalid bytes type", "type", type);
        }
        if ((0, bytes_1.arrayify)(value).byteLength !== size) {
          logger.throwArgumentError("invalid value for " + type, "value", value);
        }
        if (isArray) {
          return (0, bytes_1.arrayify)((value + Zeros).substring(0, 66));
        }
        return value;
      }
      match = type.match(regexArray);
      if (match && Array.isArray(value)) {
        var baseType_1 = match[1];
        var count = parseInt(match[2] || String(value.length));
        if (count != value.length) {
          logger.throwArgumentError("invalid array length for " + type, "value", value);
        }
        var result_1 = [];
        value.forEach(function(value2) {
          result_1.push(_pack(baseType_1, value2, true));
        });
        return (0, bytes_1.concat)(result_1);
      }
      return logger.throwArgumentError("invalid type", "type", type);
    }
    function pack(types, values) {
      if (types.length != values.length) {
        logger.throwArgumentError("wrong number of values; expected ${ types.length }", "values", values);
      }
      var tight = [];
      types.forEach(function(type, index) {
        tight.push(_pack(type, values[index]));
      });
      return (0, bytes_1.hexlify)((0, bytes_1.concat)(tight));
    }
    exports.pack = pack;
    function keccak256(types, values) {
      return (0, keccak256_1.keccak256)(pack(types, values));
    }
    exports.keccak256 = keccak256;
    function sha256(types, values) {
      return (0, sha2_1.sha256)(pack(types, values));
    }
    exports.sha256 = sha256;
  }
});

// node_modules/@ethersproject/units/lib/_version.js
var require_version13 = __commonJS({
  "node_modules/@ethersproject/units/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "units/5.7.0";
  }
});

// node_modules/@ethersproject/units/lib/index.js
var require_lib31 = __commonJS({
  "node_modules/@ethersproject/units/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseEther = exports.formatEther = exports.parseUnits = exports.formatUnits = exports.commify = void 0;
    var bignumber_1 = require_lib3();
    var logger_1 = require_lib();
    var _version_1 = require_version13();
    var logger = new logger_1.Logger(_version_1.version);
    var names = [
      "wei",
      "kwei",
      "mwei",
      "gwei",
      "szabo",
      "finney",
      "ether"
    ];
    function commify(value) {
      var comps = String(value).split(".");
      if (comps.length > 2 || !comps[0].match(/^-?[0-9]*$/) || comps[1] && !comps[1].match(/^[0-9]*$/) || value === "." || value === "-.") {
        logger.throwArgumentError("invalid value", "value", value);
      }
      var whole = comps[0];
      var negative = "";
      if (whole.substring(0, 1) === "-") {
        negative = "-";
        whole = whole.substring(1);
      }
      while (whole.substring(0, 1) === "0") {
        whole = whole.substring(1);
      }
      if (whole === "") {
        whole = "0";
      }
      var suffix = "";
      if (comps.length === 2) {
        suffix = "." + (comps[1] || "0");
      }
      while (suffix.length > 2 && suffix[suffix.length - 1] === "0") {
        suffix = suffix.substring(0, suffix.length - 1);
      }
      var formatted = [];
      while (whole.length) {
        if (whole.length <= 3) {
          formatted.unshift(whole);
          break;
        } else {
          var index = whole.length - 3;
          formatted.unshift(whole.substring(index));
          whole = whole.substring(0, index);
        }
      }
      return negative + formatted.join(",") + suffix;
    }
    exports.commify = commify;
    function formatUnits(value, unitName) {
      if (typeof unitName === "string") {
        var index = names.indexOf(unitName);
        if (index !== -1) {
          unitName = 3 * index;
        }
      }
      return (0, bignumber_1.formatFixed)(value, unitName != null ? unitName : 18);
    }
    exports.formatUnits = formatUnits;
    function parseUnits(value, unitName) {
      if (typeof value !== "string") {
        logger.throwArgumentError("value must be a string", "value", value);
      }
      if (typeof unitName === "string") {
        var index = names.indexOf(unitName);
        if (index !== -1) {
          unitName = 3 * index;
        }
      }
      return (0, bignumber_1.parseFixed)(value, unitName != null ? unitName : 18);
    }
    exports.parseUnits = parseUnits;
    function formatEther(wei) {
      return formatUnits(wei, 18);
    }
    exports.formatEther = formatEther;
    function parseEther(ether) {
      return parseUnits(ether, 18);
    }
    exports.parseEther = parseEther;
  }
});

// node_modules/ethers/lib/utils.js
var require_utils3 = __commonJS({
  "node_modules/ethers/lib/utils.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatBytes32String = exports.Utf8ErrorFuncs = exports.toUtf8String = exports.toUtf8CodePoints = exports.toUtf8Bytes = exports._toEscapedUtf8String = exports.nameprep = exports.hexDataSlice = exports.hexDataLength = exports.hexZeroPad = exports.hexValue = exports.hexStripZeros = exports.hexConcat = exports.isHexString = exports.hexlify = exports.base64 = exports.base58 = exports.TransactionDescription = exports.LogDescription = exports.Interface = exports.SigningKey = exports.HDNode = exports.defaultPath = exports.isBytesLike = exports.isBytes = exports.zeroPad = exports.stripZeros = exports.concat = exports.arrayify = exports.shallowCopy = exports.resolveProperties = exports.getStatic = exports.defineReadOnly = exports.deepCopy = exports.checkProperties = exports.poll = exports.fetchJson = exports._fetchData = exports.RLP = exports.Logger = exports.checkResultErrors = exports.FormatTypes = exports.ParamType = exports.FunctionFragment = exports.EventFragment = exports.ErrorFragment = exports.ConstructorFragment = exports.Fragment = exports.defaultAbiCoder = exports.AbiCoder = void 0;
    exports.Indexed = exports.Utf8ErrorReason = exports.UnicodeNormalizationForm = exports.SupportedAlgorithm = exports.mnemonicToSeed = exports.isValidMnemonic = exports.entropyToMnemonic = exports.mnemonicToEntropy = exports.getAccountPath = exports.verifyTypedData = exports.verifyMessage = exports.recoverPublicKey = exports.computePublicKey = exports.recoverAddress = exports.computeAddress = exports.getJsonWalletAddress = exports.TransactionTypes = exports.serializeTransaction = exports.parseTransaction = exports.accessListify = exports.joinSignature = exports.splitSignature = exports.soliditySha256 = exports.solidityKeccak256 = exports.solidityPack = exports.shuffled = exports.randomBytes = exports.sha512 = exports.sha256 = exports.ripemd160 = exports.keccak256 = exports.computeHmac = exports.commify = exports.parseUnits = exports.formatUnits = exports.parseEther = exports.formatEther = exports.isAddress = exports.getCreate2Address = exports.getContractAddress = exports.getIcapAddress = exports.getAddress = exports._TypedDataEncoder = exports.id = exports.isValidName = exports.namehash = exports.hashMessage = exports.dnsEncode = exports.parseBytes32String = void 0;
    var abi_1 = require_lib14();
    Object.defineProperty(exports, "AbiCoder", { enumerable: true, get: function() {
      return abi_1.AbiCoder;
    } });
    Object.defineProperty(exports, "checkResultErrors", { enumerable: true, get: function() {
      return abi_1.checkResultErrors;
    } });
    Object.defineProperty(exports, "ConstructorFragment", { enumerable: true, get: function() {
      return abi_1.ConstructorFragment;
    } });
    Object.defineProperty(exports, "defaultAbiCoder", { enumerable: true, get: function() {
      return abi_1.defaultAbiCoder;
    } });
    Object.defineProperty(exports, "ErrorFragment", { enumerable: true, get: function() {
      return abi_1.ErrorFragment;
    } });
    Object.defineProperty(exports, "EventFragment", { enumerable: true, get: function() {
      return abi_1.EventFragment;
    } });
    Object.defineProperty(exports, "FormatTypes", { enumerable: true, get: function() {
      return abi_1.FormatTypes;
    } });
    Object.defineProperty(exports, "Fragment", { enumerable: true, get: function() {
      return abi_1.Fragment;
    } });
    Object.defineProperty(exports, "FunctionFragment", { enumerable: true, get: function() {
      return abi_1.FunctionFragment;
    } });
    Object.defineProperty(exports, "Indexed", { enumerable: true, get: function() {
      return abi_1.Indexed;
    } });
    Object.defineProperty(exports, "Interface", { enumerable: true, get: function() {
      return abi_1.Interface;
    } });
    Object.defineProperty(exports, "LogDescription", { enumerable: true, get: function() {
      return abi_1.LogDescription;
    } });
    Object.defineProperty(exports, "ParamType", { enumerable: true, get: function() {
      return abi_1.ParamType;
    } });
    Object.defineProperty(exports, "TransactionDescription", { enumerable: true, get: function() {
      return abi_1.TransactionDescription;
    } });
    var address_1 = require_lib6();
    Object.defineProperty(exports, "getAddress", { enumerable: true, get: function() {
      return address_1.getAddress;
    } });
    Object.defineProperty(exports, "getCreate2Address", { enumerable: true, get: function() {
      return address_1.getCreate2Address;
    } });
    Object.defineProperty(exports, "getContractAddress", { enumerable: true, get: function() {
      return address_1.getContractAddress;
    } });
    Object.defineProperty(exports, "getIcapAddress", { enumerable: true, get: function() {
      return address_1.getIcapAddress;
    } });
    Object.defineProperty(exports, "isAddress", { enumerable: true, get: function() {
      return address_1.isAddress;
    } });
    var base64 = __importStar(require_lib12());
    exports.base64 = base64;
    var basex_1 = require_lib19();
    Object.defineProperty(exports, "base58", { enumerable: true, get: function() {
      return basex_1.Base58;
    } });
    var bytes_1 = require_lib2();
    Object.defineProperty(exports, "arrayify", { enumerable: true, get: function() {
      return bytes_1.arrayify;
    } });
    Object.defineProperty(exports, "concat", { enumerable: true, get: function() {
      return bytes_1.concat;
    } });
    Object.defineProperty(exports, "hexConcat", { enumerable: true, get: function() {
      return bytes_1.hexConcat;
    } });
    Object.defineProperty(exports, "hexDataSlice", { enumerable: true, get: function() {
      return bytes_1.hexDataSlice;
    } });
    Object.defineProperty(exports, "hexDataLength", { enumerable: true, get: function() {
      return bytes_1.hexDataLength;
    } });
    Object.defineProperty(exports, "hexlify", { enumerable: true, get: function() {
      return bytes_1.hexlify;
    } });
    Object.defineProperty(exports, "hexStripZeros", { enumerable: true, get: function() {
      return bytes_1.hexStripZeros;
    } });
    Object.defineProperty(exports, "hexValue", { enumerable: true, get: function() {
      return bytes_1.hexValue;
    } });
    Object.defineProperty(exports, "hexZeroPad", { enumerable: true, get: function() {
      return bytes_1.hexZeroPad;
    } });
    Object.defineProperty(exports, "isBytes", { enumerable: true, get: function() {
      return bytes_1.isBytes;
    } });
    Object.defineProperty(exports, "isBytesLike", { enumerable: true, get: function() {
      return bytes_1.isBytesLike;
    } });
    Object.defineProperty(exports, "isHexString", { enumerable: true, get: function() {
      return bytes_1.isHexString;
    } });
    Object.defineProperty(exports, "joinSignature", { enumerable: true, get: function() {
      return bytes_1.joinSignature;
    } });
    Object.defineProperty(exports, "zeroPad", { enumerable: true, get: function() {
      return bytes_1.zeroPad;
    } });
    Object.defineProperty(exports, "splitSignature", { enumerable: true, get: function() {
      return bytes_1.splitSignature;
    } });
    Object.defineProperty(exports, "stripZeros", { enumerable: true, get: function() {
      return bytes_1.stripZeros;
    } });
    var hash_1 = require_lib13();
    Object.defineProperty(exports, "_TypedDataEncoder", { enumerable: true, get: function() {
      return hash_1._TypedDataEncoder;
    } });
    Object.defineProperty(exports, "dnsEncode", { enumerable: true, get: function() {
      return hash_1.dnsEncode;
    } });
    Object.defineProperty(exports, "hashMessage", { enumerable: true, get: function() {
      return hash_1.hashMessage;
    } });
    Object.defineProperty(exports, "id", { enumerable: true, get: function() {
      return hash_1.id;
    } });
    Object.defineProperty(exports, "isValidName", { enumerable: true, get: function() {
      return hash_1.isValidName;
    } });
    Object.defineProperty(exports, "namehash", { enumerable: true, get: function() {
      return hash_1.namehash;
    } });
    var hdnode_1 = require_lib23();
    Object.defineProperty(exports, "defaultPath", { enumerable: true, get: function() {
      return hdnode_1.defaultPath;
    } });
    Object.defineProperty(exports, "entropyToMnemonic", { enumerable: true, get: function() {
      return hdnode_1.entropyToMnemonic;
    } });
    Object.defineProperty(exports, "getAccountPath", { enumerable: true, get: function() {
      return hdnode_1.getAccountPath;
    } });
    Object.defineProperty(exports, "HDNode", { enumerable: true, get: function() {
      return hdnode_1.HDNode;
    } });
    Object.defineProperty(exports, "isValidMnemonic", { enumerable: true, get: function() {
      return hdnode_1.isValidMnemonic;
    } });
    Object.defineProperty(exports, "mnemonicToEntropy", { enumerable: true, get: function() {
      return hdnode_1.mnemonicToEntropy;
    } });
    Object.defineProperty(exports, "mnemonicToSeed", { enumerable: true, get: function() {
      return hdnode_1.mnemonicToSeed;
    } });
    var json_wallets_1 = require_lib25();
    Object.defineProperty(exports, "getJsonWalletAddress", { enumerable: true, get: function() {
      return json_wallets_1.getJsonWalletAddress;
    } });
    var keccak256_1 = require_lib4();
    Object.defineProperty(exports, "keccak256", { enumerable: true, get: function() {
      return keccak256_1.keccak256;
    } });
    var logger_1 = require_lib();
    Object.defineProperty(exports, "Logger", { enumerable: true, get: function() {
      return logger_1.Logger;
    } });
    var sha2_1 = require_lib21();
    Object.defineProperty(exports, "computeHmac", { enumerable: true, get: function() {
      return sha2_1.computeHmac;
    } });
    Object.defineProperty(exports, "ripemd160", { enumerable: true, get: function() {
      return sha2_1.ripemd160;
    } });
    Object.defineProperty(exports, "sha256", { enumerable: true, get: function() {
      return sha2_1.sha256;
    } });
    Object.defineProperty(exports, "sha512", { enumerable: true, get: function() {
      return sha2_1.sha512;
    } });
    var solidity_1 = require_lib30();
    Object.defineProperty(exports, "solidityKeccak256", { enumerable: true, get: function() {
      return solidity_1.keccak256;
    } });
    Object.defineProperty(exports, "solidityPack", { enumerable: true, get: function() {
      return solidity_1.pack;
    } });
    Object.defineProperty(exports, "soliditySha256", { enumerable: true, get: function() {
      return solidity_1.sha256;
    } });
    var random_1 = require_lib24();
    Object.defineProperty(exports, "randomBytes", { enumerable: true, get: function() {
      return random_1.randomBytes;
    } });
    Object.defineProperty(exports, "shuffled", { enumerable: true, get: function() {
      return random_1.shuffled;
    } });
    var properties_1 = require_lib8();
    Object.defineProperty(exports, "checkProperties", { enumerable: true, get: function() {
      return properties_1.checkProperties;
    } });
    Object.defineProperty(exports, "deepCopy", { enumerable: true, get: function() {
      return properties_1.deepCopy;
    } });
    Object.defineProperty(exports, "defineReadOnly", { enumerable: true, get: function() {
      return properties_1.defineReadOnly;
    } });
    Object.defineProperty(exports, "getStatic", { enumerable: true, get: function() {
      return properties_1.getStatic;
    } });
    Object.defineProperty(exports, "resolveProperties", { enumerable: true, get: function() {
      return properties_1.resolveProperties;
    } });
    Object.defineProperty(exports, "shallowCopy", { enumerable: true, get: function() {
      return properties_1.shallowCopy;
    } });
    var RLP = __importStar(require_lib5());
    exports.RLP = RLP;
    var signing_key_1 = require_lib9();
    Object.defineProperty(exports, "computePublicKey", { enumerable: true, get: function() {
      return signing_key_1.computePublicKey;
    } });
    Object.defineProperty(exports, "recoverPublicKey", { enumerable: true, get: function() {
      return signing_key_1.recoverPublicKey;
    } });
    Object.defineProperty(exports, "SigningKey", { enumerable: true, get: function() {
      return signing_key_1.SigningKey;
    } });
    var strings_1 = require_lib11();
    Object.defineProperty(exports, "formatBytes32String", { enumerable: true, get: function() {
      return strings_1.formatBytes32String;
    } });
    Object.defineProperty(exports, "nameprep", { enumerable: true, get: function() {
      return strings_1.nameprep;
    } });
    Object.defineProperty(exports, "parseBytes32String", { enumerable: true, get: function() {
      return strings_1.parseBytes32String;
    } });
    Object.defineProperty(exports, "_toEscapedUtf8String", { enumerable: true, get: function() {
      return strings_1._toEscapedUtf8String;
    } });
    Object.defineProperty(exports, "toUtf8Bytes", { enumerable: true, get: function() {
      return strings_1.toUtf8Bytes;
    } });
    Object.defineProperty(exports, "toUtf8CodePoints", { enumerable: true, get: function() {
      return strings_1.toUtf8CodePoints;
    } });
    Object.defineProperty(exports, "toUtf8String", { enumerable: true, get: function() {
      return strings_1.toUtf8String;
    } });
    Object.defineProperty(exports, "Utf8ErrorFuncs", { enumerable: true, get: function() {
      return strings_1.Utf8ErrorFuncs;
    } });
    var transactions_1 = require_lib10();
    Object.defineProperty(exports, "accessListify", { enumerable: true, get: function() {
      return transactions_1.accessListify;
    } });
    Object.defineProperty(exports, "computeAddress", { enumerable: true, get: function() {
      return transactions_1.computeAddress;
    } });
    Object.defineProperty(exports, "parseTransaction", { enumerable: true, get: function() {
      return transactions_1.parse;
    } });
    Object.defineProperty(exports, "recoverAddress", { enumerable: true, get: function() {
      return transactions_1.recoverAddress;
    } });
    Object.defineProperty(exports, "serializeTransaction", { enumerable: true, get: function() {
      return transactions_1.serialize;
    } });
    Object.defineProperty(exports, "TransactionTypes", { enumerable: true, get: function() {
      return transactions_1.TransactionTypes;
    } });
    var units_1 = require_lib31();
    Object.defineProperty(exports, "commify", { enumerable: true, get: function() {
      return units_1.commify;
    } });
    Object.defineProperty(exports, "formatEther", { enumerable: true, get: function() {
      return units_1.formatEther;
    } });
    Object.defineProperty(exports, "parseEther", { enumerable: true, get: function() {
      return units_1.parseEther;
    } });
    Object.defineProperty(exports, "formatUnits", { enumerable: true, get: function() {
      return units_1.formatUnits;
    } });
    Object.defineProperty(exports, "parseUnits", { enumerable: true, get: function() {
      return units_1.parseUnits;
    } });
    var wallet_1 = require_lib26();
    Object.defineProperty(exports, "verifyMessage", { enumerable: true, get: function() {
      return wallet_1.verifyMessage;
    } });
    Object.defineProperty(exports, "verifyTypedData", { enumerable: true, get: function() {
      return wallet_1.verifyTypedData;
    } });
    var web_1 = require_lib28();
    Object.defineProperty(exports, "_fetchData", { enumerable: true, get: function() {
      return web_1._fetchData;
    } });
    Object.defineProperty(exports, "fetchJson", { enumerable: true, get: function() {
      return web_1.fetchJson;
    } });
    Object.defineProperty(exports, "poll", { enumerable: true, get: function() {
      return web_1.poll;
    } });
    var sha2_2 = require_lib21();
    Object.defineProperty(exports, "SupportedAlgorithm", { enumerable: true, get: function() {
      return sha2_2.SupportedAlgorithm;
    } });
    var strings_2 = require_lib11();
    Object.defineProperty(exports, "UnicodeNormalizationForm", { enumerable: true, get: function() {
      return strings_2.UnicodeNormalizationForm;
    } });
    Object.defineProperty(exports, "Utf8ErrorReason", { enumerable: true, get: function() {
      return strings_2.Utf8ErrorReason;
    } });
  }
});

// node_modules/ethers/lib/_version.js
var require_version14 = __commonJS({
  "node_modules/ethers/lib/_version.js"(exports) {
    "use strict";
    init_cjs_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "ethers/5.7.2";
  }
});

// node_modules/ethers/lib/ethers.js
var require_ethers = __commonJS({
  "node_modules/ethers/lib/ethers.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Wordlist = exports.version = exports.wordlists = exports.utils = exports.logger = exports.errors = exports.constants = exports.FixedNumber = exports.BigNumber = exports.ContractFactory = exports.Contract = exports.BaseContract = exports.providers = exports.getDefaultProvider = exports.VoidSigner = exports.Wallet = exports.Signer = void 0;
    var contracts_1 = require_lib18();
    Object.defineProperty(exports, "BaseContract", { enumerable: true, get: function() {
      return contracts_1.BaseContract;
    } });
    Object.defineProperty(exports, "Contract", { enumerable: true, get: function() {
      return contracts_1.Contract;
    } });
    Object.defineProperty(exports, "ContractFactory", { enumerable: true, get: function() {
      return contracts_1.ContractFactory;
    } });
    var bignumber_1 = require_lib3();
    Object.defineProperty(exports, "BigNumber", { enumerable: true, get: function() {
      return bignumber_1.BigNumber;
    } });
    Object.defineProperty(exports, "FixedNumber", { enumerable: true, get: function() {
      return bignumber_1.FixedNumber;
    } });
    var abstract_signer_1 = require_lib17();
    Object.defineProperty(exports, "Signer", { enumerable: true, get: function() {
      return abstract_signer_1.Signer;
    } });
    Object.defineProperty(exports, "VoidSigner", { enumerable: true, get: function() {
      return abstract_signer_1.VoidSigner;
    } });
    var wallet_1 = require_lib26();
    Object.defineProperty(exports, "Wallet", { enumerable: true, get: function() {
      return wallet_1.Wallet;
    } });
    var constants = __importStar(require_lib7());
    exports.constants = constants;
    var providers = __importStar(require_lib29());
    exports.providers = providers;
    var providers_1 = require_lib29();
    Object.defineProperty(exports, "getDefaultProvider", { enumerable: true, get: function() {
      return providers_1.getDefaultProvider;
    } });
    var wordlists_1 = require_lib22();
    Object.defineProperty(exports, "Wordlist", { enumerable: true, get: function() {
      return wordlists_1.Wordlist;
    } });
    Object.defineProperty(exports, "wordlists", { enumerable: true, get: function() {
      return wordlists_1.wordlists;
    } });
    var utils = __importStar(require_utils3());
    exports.utils = utils;
    var logger_1 = require_lib();
    Object.defineProperty(exports, "errors", { enumerable: true, get: function() {
      return logger_1.ErrorCode;
    } });
    var _version_1 = require_version14();
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return _version_1.version;
    } });
    var logger = new logger_1.Logger(_version_1.version);
    exports.logger = logger;
  }
});

// node_modules/ethers/lib/index.js
var require_lib32 = __commonJS({
  "node_modules/ethers/lib/index.js"(exports) {
    "use strict";
    init_cjs_shim();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Wordlist = exports.version = exports.wordlists = exports.utils = exports.logger = exports.errors = exports.constants = exports.FixedNumber = exports.BigNumber = exports.ContractFactory = exports.Contract = exports.BaseContract = exports.providers = exports.getDefaultProvider = exports.VoidSigner = exports.Wallet = exports.Signer = exports.ethers = void 0;
    var ethers2 = __importStar(require_ethers());
    exports.ethers = ethers2;
    try {
      anyGlobal = window;
      if (anyGlobal._ethers == null) {
        anyGlobal._ethers = ethers2;
      }
    } catch (error) {
    }
    var anyGlobal;
    var ethers_1 = require_ethers();
    Object.defineProperty(exports, "Signer", { enumerable: true, get: function() {
      return ethers_1.Signer;
    } });
    Object.defineProperty(exports, "Wallet", { enumerable: true, get: function() {
      return ethers_1.Wallet;
    } });
    Object.defineProperty(exports, "VoidSigner", { enumerable: true, get: function() {
      return ethers_1.VoidSigner;
    } });
    Object.defineProperty(exports, "getDefaultProvider", { enumerable: true, get: function() {
      return ethers_1.getDefaultProvider;
    } });
    Object.defineProperty(exports, "providers", { enumerable: true, get: function() {
      return ethers_1.providers;
    } });
    Object.defineProperty(exports, "BaseContract", { enumerable: true, get: function() {
      return ethers_1.BaseContract;
    } });
    Object.defineProperty(exports, "Contract", { enumerable: true, get: function() {
      return ethers_1.Contract;
    } });
    Object.defineProperty(exports, "ContractFactory", { enumerable: true, get: function() {
      return ethers_1.ContractFactory;
    } });
    Object.defineProperty(exports, "BigNumber", { enumerable: true, get: function() {
      return ethers_1.BigNumber;
    } });
    Object.defineProperty(exports, "FixedNumber", { enumerable: true, get: function() {
      return ethers_1.FixedNumber;
    } });
    Object.defineProperty(exports, "constants", { enumerable: true, get: function() {
      return ethers_1.constants;
    } });
    Object.defineProperty(exports, "errors", { enumerable: true, get: function() {
      return ethers_1.errors;
    } });
    Object.defineProperty(exports, "logger", { enumerable: true, get: function() {
      return ethers_1.logger;
    } });
    Object.defineProperty(exports, "utils", { enumerable: true, get: function() {
      return ethers_1.utils;
    } });
    Object.defineProperty(exports, "wordlists", { enumerable: true, get: function() {
      return ethers_1.wordlists;
    } });
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return ethers_1.version;
    } });
    Object.defineProperty(exports, "Wordlist", { enumerable: true, get: function() {
      return ethers_1.Wordlist;
    } });
  }
});

// src/MyFirstContract.rpc.test.ts
init_cjs_shim();

// subPackages/solidity/Contract-rpc.testeranto.test.ts
init_cjs_shim();
var import_web3 = __toESM(require_lib15(), 1);
var import_ethers = __toESM(require_lib32(), 1);
import Ganache from "ganache";
var Contract_rpc_testeranto_test_default = (testImplementations, testSpecifications, testInput) => Node_default(
  testInput,
  testSpecifications,
  testImplementations,
  {
    // beforeAll: async () =>
    //   (await solCompile(contractName)).contracts.find(
    //     (c) => c.contractName === contractName
    //   ),
    beforeEach: (contract, i, artificer, testResource) => {
      return new Promise((res) => {
        const options = {};
        const port = testResource.ports[0];
        console.log("mark0", testResource);
        const server = Ganache.server(options);
        server.listen(port, async (err) => {
          console.log(`ganache listening on port ${port}...`);
          if (err)
            throw err;
          const providerFarSide = server.provider;
          const accounts = await providerFarSide.request({
            method: "eth_accounts",
            params: []
          });
          const web3NearSide = new import_web3.default(providerFarSide);
          const contractNearSide = await new web3NearSide.eth.Contract(
            contract.abi
          ).deploy({ data: contract.bytecode.bytes }).send({ from: accounts[0], gas: 7e6 });
          const web3FarSideProvider = new import_ethers.ethers.providers.JsonRpcProvider(
            `http://localhost:${port}`
          );
          const web3FarSideSigner = new import_ethers.ethers.Wallet(
            providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
            web3FarSideProvider
          );
          const contractFarSide = new import_ethers.ethers.Contract(
            contractNearSide.options.address,
            contract.abi,
            web3FarSideSigner
          );
          console.log("server", server);
          res({
            contractNearSide,
            contractFarSide,
            accounts,
            server
          });
        });
      });
    },
    afterEach: async ({ server }) => {
      console.log("serve!r", server);
    },
    andWhen: async ({ contractFarSide, accounts }, callback) => callback()({ contractFarSide, accounts }),
    afterAll: ({ server }) => {
      console.log("serve!r", server);
    }
  },
  { ports: 1 }
);

// src/MyFirstContract.rpc.test.ts
var testImplementation = {
  suites: {
    Default: "Testing a very simple smart contract"
  },
  givens: {
    Default: () => {
      return "MyFirstContract.sol";
    }
  },
  whens: {
    Increment: (asTestUser) => async ({ contractFarSide, accounts }) => {
      return await contractFarSide.inc({ gasLimit: 15e4 });
    },
    Decrement: (asTestUser) => async ({ contractFarSide, accounts }) => {
      return await contractFarSide.dec({ gasLimit: 15e4 });
    }
  },
  thens: {
    Get: ({ asTestUser, expectation }) => async ({ contractFarSide, accounts }) => assert.equal(
      expectation,
      parseInt(await contractFarSide.get({ gasLimit: 15e4 }))
    )
  },
  checks: {
    AnEmptyState: () => "MyFirstContract.sol"
  }
};
var MyFirstContractPlusRpcTesteranto = Contract_rpc_testeranto_test_default(
  testImplementation,
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing a very simple smart contract over RPC",
        commonGivens(Given, When, Then, features),
        [
          // Check.AnEmptyState(
          //   "imperative style",
          //   [`aloha`],
          //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
          //     await TheEmailIsSetTo("foo");
          //     await TheEmailIs("foo");
          //     const reduxPayload = await TheEmailIsSetTo("foobar");
          //     await TheEmailIs("foobar");
          //     // assert.deepEqual(reduxPayload, {
          //     //   type: "login app/setEmail",
          //     //   payload: "foobar",
          //     // });
          //   }
          // ),
        ]
      )
    ];
  },
  MyFirstContractTestInput
);
export {
  MyFirstContractPlusRpcTesteranto
};
