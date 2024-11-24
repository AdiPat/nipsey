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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const nipsey_logic_1 = require("../nipsey-logic");
const ai_1 = require("../ai");
(0, vitest_1.describe)("nipsey-logic should", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.describe)("runQuery should", () => {
        (0, vitest_1.it)("be defined", () => {
            (0, vitest_1.expect)(nipsey_logic_1.runQuery).toBeDefined();
        });
        (0, vitest_1.it)("should write the next bar if query type is 'WRITE_NEXT_BAR'", () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                queryType: "WRITE_NEXT_BAR",
                bars: ["this is a test"],
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            generateObjectMock.mockResolvedValue({
                object: {
                    bars: ["this is the next bar"],
                },
            });
            const result = yield (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result.bars).toEqual(["this is a test", "this is the next bar"]);
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalled();
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalledWith({
                model: ai_1.AI.models.GPT_4O_MINI,
                system: "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next 1 bars.",
                prompt: "Bars: this is a test",
                schema: ai_1.AI.barsSchema,
            });
            generateObjectMock.mockReset();
        }));
        (0, vitest_1.it)("should write the next bar if query type is 'WRITE_NEXT_BAR' and 'context' is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const context = "This is a motivational rap song.";
            const options = {
                queryType: "WRITE_NEXT_BAR",
                bars: ["this is a test"],
                context,
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            generateObjectMock.mockResolvedValue({
                object: {
                    bars: ["this is the next bar"],
                },
            });
            const result = yield (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result.bars).toEqual(["this is a test", "this is the next bar"]);
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalled();
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalledWith({
                model: ai_1.AI.models.GPT_4O_MINI,
                system: "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next 1 bars.",
                prompt: `Bars: this is a test\nContext: ${context}`,
                schema: ai_1.AI.barsSchema,
            });
            generateObjectMock.mockReset();
        }));
        (0, vitest_1.it)("throws an error if queryType is NA", () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                queryType: "NA",
                bars: ["this is a test"],
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            const result = (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result).rejects.toThrowError("Error: Required 'queryType' can't be NA. ");
            (0, vitest_1.expect)(generateObjectMock).not.toHaveBeenCalled();
            generateObjectMock.mockReset();
        }));
        vitest_1.it.each([null, undefined, "", " ", "\n"])("throws an error if queryType is not specified. ", (queryType) => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                queryType,
                bars: ["this is a test"],
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            const result = (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result).rejects.toThrowError("Error: Required 'queryType' can't be NA. ");
            (0, vitest_1.expect)(generateObjectMock).not.toHaveBeenCalled();
            generateObjectMock.mockReset();
        }));
        (0, vitest_1.it)("returns the next N bars if queryType is 'WRITE_NEXT_N_BARS' and the first bar is provided with no context", () => __awaiter(void 0, void 0, void 0, function* () {
            const initialBars = ["bar 1", "bar 2", "bar 3"];
            const resultBars = ["bar 4", "bar 5", "bar 6", "bar 7", "bar 8"];
            const nextBarsCount = 5;
            const options = {
                queryType: "WRITE_N_BARS",
                bars: initialBars,
                nextBarsCount,
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            generateObjectMock.mockResolvedValue({
                object: {
                    bars: resultBars,
                },
            });
            const result = yield (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result.bars).toEqual([...initialBars, ...resultBars]);
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalled();
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalledWith({
                model: ai_1.AI.models.GPT_4O_MINI,
                system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${nextBarsCount} bars.`,
                prompt: `Bars: ${initialBars.join(",\n")}`,
                schema: ai_1.AI.barsSchema,
            });
            generateObjectMock.mockReset();
        }));
        (0, vitest_1.it)("returns the next N bars if queryType is 'WRITE_NEXT_N_BARS' and the first bar is provided with a valid context", () => __awaiter(void 0, void 0, void 0, function* () {
            const context = "This is a motivational rap song.";
            const initialBars = ["bar 1", "bar 2", "bar 3"];
            const resultBars = ["bar 4", "bar 5", "bar 6", "bar 7", "bar 8"];
            const nextBarsCount = 5;
            const options = {
                queryType: "WRITE_N_BARS",
                bars: initialBars,
                nextBarsCount,
                context,
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            generateObjectMock.mockResolvedValue({
                object: {
                    bars: resultBars,
                },
            });
            const result = yield (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result.bars).toEqual([...initialBars, ...resultBars]);
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalled();
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalledWith({
                model: ai_1.AI.models.GPT_4O_MINI,
                system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${nextBarsCount} bars.`,
                prompt: `Bars: ${initialBars.join(",\n")}\nContext: ${context}`,
                schema: ai_1.AI.barsSchema,
            });
            generateObjectMock.mockReset();
        }));
        (0, vitest_1.it)("returns a total of 8 bars if nextBarsCount is not specified, queryType is 'WRITE_NEXT_N_BARS' and the first k bars (k < 8) are provided with no valid context", () => __awaiter(void 0, void 0, void 0, function* () {
            const initialBars = ["bar 1", "bar 2", "bar 3", "bar 4", "bar 5"];
            const resultBars = ["bar 6", "bar 7", "bar 8"];
            const options = {
                queryType: "WRITE_N_BARS",
                bars: initialBars,
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            generateObjectMock.mockResolvedValue({
                object: {
                    bars: resultBars,
                },
            });
            const result = yield (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result.bars).toEqual([...initialBars, ...resultBars]);
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalled();
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalledWith({
                model: ai_1.AI.models.GPT_4O_MINI,
                system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next 3 bars.`,
                prompt: `Bars: ${initialBars.join(",\n")}`,
                schema: ai_1.AI.barsSchema,
            });
            generateObjectMock.mockReset();
        }));
        vitest_1.it.each([
            [9, 7],
            [17, 7],
            [20, 4],
            [32, 8],
            [40, 8],
        ])("returns the next closest multiple if nextBarsCount is not specified, queryType is 'WRITE_NEXT_N_BARS' and the first %s bars are provided with no valid context", (startingBarsCount, pendingBarsCount) => __awaiter(void 0, void 0, void 0, function* () {
            const initialBars = new Array(startingBarsCount)
                .fill("bar")
                .map((_, i) => `bar ${i + 1}`);
            const resultBars = new Array(pendingBarsCount)
                .fill("bar")
                .map((_, i) => `bar ${startingBarsCount + i + 1}`);
            const options = {
                queryType: "WRITE_N_BARS",
                bars: initialBars,
            };
            const generateObjectMock = vitest_1.vi.spyOn(ai_1.AI, "generateObject");
            generateObjectMock.mockResolvedValue({
                object: {
                    bars: resultBars,
                },
            });
            const result = yield (0, nipsey_logic_1.runQuery)(options);
            (0, vitest_1.expect)(result.bars).toEqual([...initialBars, ...resultBars]);
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalled();
            (0, vitest_1.expect)(generateObjectMock).toHaveBeenCalledWith({
                model: ai_1.AI.models.GPT_4O_MINI,
                system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${pendingBarsCount} bars.`,
                prompt: `Bars: ${initialBars.join(",\n")}`,
                schema: ai_1.AI.barsSchema,
            });
            generateObjectMock.mockReset();
        }));
    });
});
