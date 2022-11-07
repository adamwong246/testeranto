/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Given\": () => (/* binding */ Given),\n/* harmony export */   \"Suite\": () => (/* binding */ Suite),\n/* harmony export */   \"TesterantoFactory\": () => (/* binding */ TesterantoFactory),\n/* harmony export */   \"TesterantoGiven\": () => (/* binding */ TesterantoGiven),\n/* harmony export */   \"TesterantoSuite\": () => (/* binding */ TesterantoSuite),\n/* harmony export */   \"TesterantoThen\": () => (/* binding */ TesterantoThen),\n/* harmony export */   \"TesterantoWhen\": () => (/* binding */ TesterantoWhen),\n/* harmony export */   \"Then\": () => (/* binding */ Then),\n/* harmony export */   \"When\": () => (/* binding */ When)\n/* harmony export */ });\nclass TesterantoSuite {\n    constructor(name, subject, givens) {\n        this.name = name;\n        this.subject = subject;\n        this.givens = givens;\n    }\n    run() {\n        console.log(\"\\nSuite:\", this.name);\n        this.givens.forEach((g) => {\n            g.run(this.subject);\n        });\n    }\n}\nclass TesterantoGiven {\n    constructor(name, whens, thens, feature) {\n        this.name = name;\n        this.whens = whens;\n        this.thens = thens;\n        this.feature = feature;\n    }\n    run(subject) {\n        console.log(`\\n - ${this.feature} - \\n\\nGiven: ${this.name}`);\n        const store = this.given(subject);\n        this.whens.forEach((when) => {\n            when.run(store);\n        });\n        this.thens.forEach((then) => {\n            then.run(store);\n        });\n    }\n}\nclass TesterantoWhen {\n    constructor(name, actionCreator, payload = {}) {\n        this.name = name;\n        this.actionCreator = actionCreator;\n        this.payload = payload;\n    }\n    run(store) {\n        console.log(\" When:\", this.name);\n        const action = this.actionCreator;\n        action(store);\n        this.when(store, action);\n    }\n}\n;\nclass TesterantoThen {\n    constructor(name, callback) {\n        this.name = name;\n        this.callback = callback;\n    }\n    run(store) {\n        console.log(\" Then:\", this.name);\n        this.callback(this.then(store));\n    }\n}\n;\nclass Suite extends TesterantoSuite {\n}\n;\nclass Given extends TesterantoGiven {\n    constructor(name, whens, thens, feature, thing) {\n        super(name, whens, thens, feature);\n        this.thing = thing;\n    }\n    given() {\n        return this.thing;\n    }\n}\nclass When extends TesterantoWhen {\n    constructor(name, actionCreator, payload = {}) {\n        super(name, actionCreator, payload);\n    }\n    when(thing) {\n        return thing;\n    }\n}\n;\nclass Then extends TesterantoThen {\n    constructor(name, callback) {\n        super(name, callback);\n    }\n    then(rectangle) {\n        return rectangle;\n    }\n}\n;\nconst TesterantoFactory = {\n    Suite: Suite,\n    Given: Given,\n    When: When,\n    Then: Then,\n};\n\n\n//# sourceURL=webpack://testeranto.ts/./index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});