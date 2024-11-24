import { describe, expect, it, vi } from "vitest";
import readline from "readline";
import { getUserInput, parseUserInput } from "../input-parser";

describe("input parser should", () => {
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

    it("should parse the user input string and return an object with the selected option and the input text", async () => {
      const input = "NB this is a test";
      const result = await parseUserInput(input);
      expect(result).toEqual({
        option: "WRITE_N_BARS",
        text: "this is a test",
      });
    });
  });
});
