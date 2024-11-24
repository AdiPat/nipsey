"use strict";
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
const readline_1 = __importDefault(require("readline"));
const input_parser_1 = require("../input-parser");
(0, vitest_1.describe)("input parser should", () => {
    (0, vitest_1.describe)("getUserInput should", () => {
        (0, vitest_1.it)("be defined", () => {
            (0, vitest_1.expect)(input_parser_1.getUserInput).toBeDefined();
        });
        (0, vitest_1.it)("should take user input and return it as a string", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedOutput = "1 this is a test";
            const rl = {
                question: vitest_1.vi.fn((_questionText, callback) => {
                    callback(expectedOutput);
                }),
                close: vitest_1.vi.fn(),
            };
            vitest_1.vi.spyOn(readline_1.default, "createInterface").mockReturnValue(rl);
            const answer = yield (0, input_parser_1.getUserInput)();
            (0, vitest_1.expect)(answer).toBe(expectedOutput);
        }));
    });
    (0, vitest_1.describe)("parseUserInput should", () => {
        (0, vitest_1.it)("be defined", () => {
            (0, vitest_1.expect)(input_parser_1.parseUserInput).toBeDefined();
        });
        (0, vitest_1.it)("should parse the user input string and return an object with the selected option and the input text", () => __awaiter(void 0, void 0, void 0, function* () {
            const input = "1 this is a test";
            const result = yield (0, input_parser_1.parseUserInput)(input);
            (0, vitest_1.expect)(result).toEqual({
                option: "1",
                text: "this is a test",
            });
        }));
    });
});
