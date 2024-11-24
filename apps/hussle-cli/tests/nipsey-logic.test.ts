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
          "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given a bar, respond with the next bar.",
        prompt: "Bar: this is a test",
        schema: AI.barsSchema,
      });
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
          "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given a bar, respond with the next bar.",
        prompt: `Bar: this is a test\nContext: ${context}`,
        schema: AI.barsSchema,
      });
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
      }
    );

    it.skip("returns the next N bars if queryType is 'WRITE_NEXT_N_BARS' and the first bar is provided", async () => {
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
          "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given a bar, respond with the next bar.",
        prompt: `Bar: this is a test\nContext: ${context}`,
        schema: AI.barsSchema,
      });
    });
  });
});
