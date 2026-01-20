"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
async function main() {
    const browser = await puppeteer_1.default.connect({
        browserURL: 'http://web-builder:9222'
    });
    const page = await browser.newPage();
    await page.goto('about:blank');
    await browser.disconnect();
    return;
}
main();
