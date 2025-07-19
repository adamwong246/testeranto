"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockTestSpecification = void 0;
const mockTestSpecification = () => {
    return () => {
        return new BaseSuite();
    };
};
exports.mockTestSpecification = mockTestSpecification;
