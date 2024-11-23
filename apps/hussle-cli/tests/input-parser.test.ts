import { describe, expect, it, vi } from "vitest";
import readline from "readline";
import { getUserInput } from "../input-parser";

describe("input parser should", () => {
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
