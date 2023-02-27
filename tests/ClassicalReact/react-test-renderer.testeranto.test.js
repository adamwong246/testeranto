// This file defines the test of a classical react component
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Testeranto } from "testeranto";
export const ReactTestRendererTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
    beforeEach: function (CComponent, props) {
        let component;
        act(() => {
            component = renderer.create(React.createElement(CComponent, props, []));
        });
        return component;
    },
    andWhen: function (renderer, actioner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield act(() => actioner()(renderer));
            return renderer;
        });
    }
});
