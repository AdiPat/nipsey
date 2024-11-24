import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import readline from "readline";
import { getUserInput, parseUserInput, prettyFormat } from "../input-parser";
import { AI } from "../ai";

describe("input parser should", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getUserInput should", () => {
    it("be defined", () => {
      expect(getUserInput).toBeDefined();
    });

    it("should take user input and return it as a string", async () => {
      const expectedOutput = "1 this is a test";
      const rl = {
        question: vi.fn((_questionText, callback) => {
          callback(expectedOutput);
        }),
        close: vi.fn(),
      };

      vi.spyOn(readline, "createInterface").mockReturnValue(
        rl as unknown as readline.Interface
      );
      const answer = await getUserInput();
      expect(answer).toBe(expectedOutput);
    });
  });

  describe("parseUserInput should", () => {
    it("be defined", () => {
      expect(parseUserInput).toBeDefined();
    });

    it.each([
      ["NB", "WRITE_N_BARS", 8],
      ["NX", "WRITE_NEXT_BAR", 1],
    ])(
      "should parse the user input string and return an object with the selected option %s (%s) and the input text",
      async (code, option, count) => {
        const input = `${code} this is a test ~${count}`;
        const result = await parseUserInput(input);
        expect(result).toEqual({
          option: option,
          text: "this is a test",
          count,
          context: "",
        });
      }
    );

    it.each([
      ["NA", "this is a test"],
      ["XX", "this is a test"],
      ["", "this is a test"],
      [" ", "this is a test"],
      ["\n", "this is a test"],
    ])(
      "should throw an error if queryType is invalid if the code is [%s] and the text is [%s]",
      async (code, bar) => {
        const input = `${code} ${bar}`;
        const result = parseUserInput(input);
        await expect(result).rejects.toThrowError(
          "Error: Required 'queryType' is invalid."
        );
      }
    );

    it.each([
      ["NB", 5],
      ["NB", 3],
      ["NB", 16],
      ["NB", 20],
      ["NB", 8],
      ["NB", 30],
    ])(
      "should parse the user input for code = %s  next %s bars with given count and current bar",
      async (code, count) => {
        const input = `${code} this is a test ~${count}`;
        const result = await parseUserInput(input);
        expect(result).toEqual({
          option: code === "NB" ? "WRITE_N_BARS" : "WRITE_NEXT_BAR",
          text: "this is a test",
          count,
          context: "",
        });
      }
    );

    it.each([
      ["NB this is a bar ~15 | context", "context", 15],
      ["NB this is a bar | context multi line", "context multi line", 1],
      ["NX this is a bar | context", "context", 1],
      ["NX this is a bar | context", "context", 1],
    ])(
      "run command '%s' and extracts the context '%s' along with other details like count '%s",
      async (command, context, count) => {
        const input = command;
        const result = await parseUserInput(input);
        expect(result).toEqual({
          option: command.includes("NB") ? "WRITE_N_BARS" : "WRITE_NEXT_BAR",
          text: "this is a bar",
          count,
          context,
        });
      }
    );

    it("extracts the text correctly from a large bar", async () => {
      const input =
        "NX rhymes immense, lines intense, I'm coming off the top to blast off your defence";

      const result = await parseUserInput(input);
      expect(result).toEqual({
        option: "WRITE_NEXT_BAR",
        text: "rhymes immense, lines intense, I'm coming off the top to blast off your defence",
        count: 1,
        context: "",
      });
    });
  });

  describe("prettyFormat should", () => {
    it("pretty formats the output for the user", async () => {
      const generateTextMock = vi.spyOn(AI, "generateText");
      generateTextMock.mockResolvedValue({
        text: "This is a well formatted string.",
      } as any);

      const output = "This\nis a well\n formatted string";

      const result: any = await prettyFormat(output);

      expect(result).toEqual("This is a well formatted string.");
      expect(generateTextMock).toHaveBeenCalled();
      expect(generateTextMock).toHaveBeenCalledWith({
        model: AI.models.GPT_4O_MINI,
        system:
          "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, format and organize the bars properly for the user. Don't edit the content or make changes. Just format it.",
        prompt: `Output: ${output}`,
      });
      generateTextMock.mockReset();
    });
  });
});
