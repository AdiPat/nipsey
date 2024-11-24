import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { runQuery } from "../nipsey-logic";
import { AI } from "../ai";
import z from "zod";

describe("nipsey-logic should", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("runQuery should", () => {
    it("be defined", () => {
      expect(runQuery).toBeDefined();
    });

    it("should write the next bar if query type is 'WRITE_NEXT_BAR'", async () => {
      const options: any = {
        queryType: "WRITE_NEXT_BAR",
        bars: ["this is a test"],
      };

      const generateObjectMock = vi.spyOn(AI, "generateObject");
      generateObjectMock.mockResolvedValue({
        object: {
          bars: ["this is the next bar"],
        },
      } as any);

      const result: any = await runQuery(options);

      expect(result.bars).toEqual(["this is a test", "this is the next bar"]);
      expect(generateObjectMock).toHaveBeenCalled();
      expect(generateObjectMock).toHaveBeenCalledWith({
        model: AI.models.GPT_4O_MINI,
        system:
          "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next 1 bars.",
        prompt: "Bars: this is a test",
        schema: AI.barsSchema,
      });
      generateObjectMock.mockReset();
    });

    it("should write the next bar if query type is 'WRITE_NEXT_BAR' and 'context' is provided", async () => {
      const context = "This is a motivational rap song.";
      const options: any = {
        queryType: "WRITE_NEXT_BAR",
        bars: ["this is a test"],
        context,
      };

      const generateObjectMock = vi.spyOn(AI, "generateObject");
      generateObjectMock.mockResolvedValue({
        object: {
          bars: ["this is the next bar"],
        },
      } as any);

      const result: any = await runQuery(options);

      expect(result.bars).toEqual(["this is a test", "this is the next bar"]);
      expect(generateObjectMock).toHaveBeenCalled();
      expect(generateObjectMock).toHaveBeenCalledWith({
        model: AI.models.GPT_4O_MINI,
        system:
          "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next 1 bars.",
        prompt: `Bars: this is a test\nContext: ${context}`,
        schema: AI.barsSchema,
      });
      generateObjectMock.mockReset();
    });

    it("throws an error if queryType is NA", async () => {
      const options: any = {
        queryType: "NA",
        bars: ["this is a test"],
      };

      const generateObjectMock = vi.spyOn(AI, "generateObject");

      const result: any = runQuery(options);

      expect(result).rejects.toThrowError(
        "Error: Required 'queryType' can't be NA. "
      );
      expect(generateObjectMock).not.toHaveBeenCalled();
      generateObjectMock.mockReset();
    });

    it.each([null, undefined, "", " ", "\n"])(
      "throws an error if queryType is not specified. ",
      async (queryType: any) => {
        const options: any = {
          queryType,
          bars: ["this is a test"],
        };

        const generateObjectMock = vi.spyOn(AI, "generateObject");

        const result: any = runQuery(options);

        expect(result).rejects.toThrowError(
          "Error: Required 'queryType' can't be NA. "
        );
        expect(generateObjectMock).not.toHaveBeenCalled();
        generateObjectMock.mockReset();
      }
    );

    it("returns the next N bars if queryType is 'WRITE_NEXT_N_BARS' and the first bar is provided with no context", async () => {
      const initialBars = ["bar 1", "bar 2", "bar 3"];
      const resultBars = ["bar 4", "bar 5", "bar 6", "bar 7", "bar 8"];
      const nextBarsCount = 5;

      const options: any = {
        queryType: "WRITE_N_BARS",
        bars: initialBars,
        nextBarsCount,
      };

      const generateObjectMock = vi.spyOn(AI, "generateObject");
      generateObjectMock.mockResolvedValue({
        object: {
          bars: resultBars,
        },
      } as any);

      const result: any = await runQuery(options);

      expect(result.bars).toEqual([...initialBars, ...resultBars]);
      expect(generateObjectMock).toHaveBeenCalled();
      expect(generateObjectMock).toHaveBeenCalledWith({
        model: AI.models.GPT_4O_MINI,
        system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${nextBarsCount} bars.`,
        prompt: `Bars: ${initialBars.join(",\n")}`,
        schema: AI.barsSchema,
      });
      generateObjectMock.mockReset();
    });

    it("returns the next N bars if queryType is 'WRITE_NEXT_N_BARS' and the first bar is provided with a valid context", async () => {
      const context = "This is a motivational rap song.";
      const initialBars = ["bar 1", "bar 2", "bar 3"];
      const resultBars = ["bar 4", "bar 5", "bar 6", "bar 7", "bar 8"];
      const nextBarsCount = 5;

      const options: any = {
        queryType: "WRITE_N_BARS",
        bars: initialBars,
        nextBarsCount,
        context,
      };

      const generateObjectMock = vi.spyOn(AI, "generateObject");
      generateObjectMock.mockResolvedValue({
        object: {
          bars: resultBars,
        },
      } as any);

      const result: any = await runQuery(options);

      expect(result.bars).toEqual([...initialBars, ...resultBars]);
      expect(generateObjectMock).toHaveBeenCalled();
      expect(generateObjectMock).toHaveBeenCalledWith({
        model: AI.models.GPT_4O_MINI,
        system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${nextBarsCount} bars.`,
        prompt: `Bars: ${initialBars.join(",\n")}\nContext: ${context}`,
        schema: AI.barsSchema,
      });
      generateObjectMock.mockReset();
    });

    it("returns a total of 8 bars if nextBarsCount is not specified, queryType is 'WRITE_NEXT_N_BARS' and the first k bars (k < 8) are provided with no valid context", async () => {
      const initialBars = ["bar 1", "bar 2", "bar 3", "bar 4", "bar 5"];
      const resultBars = ["bar 6", "bar 7", "bar 8"];

      const options: any = {
        queryType: "WRITE_N_BARS",
        bars: initialBars,
      };

      const generateObjectMock = vi.spyOn(AI, "generateObject");
      generateObjectMock.mockResolvedValue({
        object: {
          bars: resultBars,
        },
      } as any);

      const result: any = await runQuery(options);

      expect(result.bars).toEqual([...initialBars, ...resultBars]);
      expect(generateObjectMock).toHaveBeenCalled();
      expect(generateObjectMock).toHaveBeenCalledWith({
        model: AI.models.GPT_4O_MINI,
        system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next 3 bars.`,
        prompt: `Bars: ${initialBars.join(",\n")}`,
        schema: AI.barsSchema,
      });
      generateObjectMock.mockReset();
    });

    it.each([
      [9, 7],
      [17, 7],
      [20, 4],
      [32, 8],
      [40, 8],
    ])(
      "returns the next closest multiple if nextBarsCount is not specified, queryType is 'WRITE_NEXT_N_BARS' and the first %s bars are provided with no valid context",
      async (startingBarsCount, pendingBarsCount) => {
        const initialBars = new Array(startingBarsCount)
          .fill("bar")
          .map((_, i) => `bar ${i + 1}`);
        const resultBars = new Array(pendingBarsCount)
          .fill("bar")
          .map((_, i) => `bar ${startingBarsCount + i + 1}`);

        const options: any = {
          queryType: "WRITE_N_BARS",
          bars: initialBars,
        };

        const generateObjectMock = vi.spyOn(AI, "generateObject");
        generateObjectMock.mockResolvedValue({
          object: {
            bars: resultBars,
          },
        } as any);

        const result: any = await runQuery(options);

        expect(result.bars).toEqual([...initialBars, ...resultBars]);
        expect(generateObjectMock).toHaveBeenCalled();
        expect(generateObjectMock).toHaveBeenCalledWith({
          model: AI.models.GPT_4O_MINI,
          system: `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${pendingBarsCount} bars.`,
          prompt: `Bars: ${initialBars.join(",\n")}`,
          schema: AI.barsSchema,
        });
        generateObjectMock.mockReset();
      }
    );
  });
});
