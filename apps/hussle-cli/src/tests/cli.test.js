"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const cli_1 = require("../cli");
const chalk_1 = __importDefault(require("chalk"));
const InputParser = __importStar(require("../input-parser"));
(0, vitest_1.describe)("cli should", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.it)("have a run method", () => {
        (0, vitest_1.expect)(cli_1.run).toBeDefined();
    });
    (0, vitest_1.it)("print a banner title", () => __awaiter(void 0, void 0, void 0, function* () {
        const inputParserSpy = vitest_1.vi.spyOn(InputParser, "getUserInput");
        inputParserSpy.mockResolvedValue("1. this is a test");
        const bannerSpy = vitest_1.vi.spyOn(console, "log");
        yield (0, cli_1.run)();
        (0, vitest_1.expect)(bannerSpy).toHaveBeenCalled();
        (0, vitest_1.expect)(bannerSpy).toHaveBeenCalledWith(chalk_1.default.green("Welcome to Hussle CLI."));
    }));
    (0, vitest_1.it)("prints the basic menu options", () => __awaiter(void 0, void 0, void 0, function* () {
        const inputParserSpy = vitest_1.vi.spyOn(InputParser, "getUserInput");
        inputParserSpy.mockResolvedValue("1. this is a test");
        const menuSpy = vitest_1.vi.spyOn(console, "log");
        yield (0, cli_1.run)();
        (0, vitest_1.expect)(menuSpy).toHaveBeenCalled();
        (0, vitest_1.expect)(menuSpy).toHaveBeenCalledWith("1. Write the next N bars. [format: NB <number> <curBar>]");
        (0, vitest_1.expect)(menuSpy).toHaveBeenCalledWith("2. Write the next bar. [format: XB <curBar>]");
    }));
    (0, vitest_1.it)("expect the user to enter an input to select an option", () => __awaiter(void 0, void 0, void 0, function* () {
        const inputParserSpy = vitest_1.vi.spyOn(InputParser, "getUserInput");
        inputParserSpy.mockResolvedValue("1. this is a test");
        yield (0, cli_1.run)();
        (0, vitest_1.expect)(inputParserSpy).toHaveBeenCalled();
    }));
});
