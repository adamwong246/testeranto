var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import renderer, { act } from "react-test-renderer";
import { Testeranto } from "testeranto";
export const ReactTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
    beforeEach: function (subject) {
        return __awaiter(this, void 0, void 0, function* () {
            let component;
            yield act(() => {
                component = renderer.create(subject());
            });
            return component;
        });
    },
    andWhen: function (renderer, actioner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield act(() => actioner()(renderer));
            return renderer;
        });
    },
});
