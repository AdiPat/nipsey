import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { run } from "../cli";
import chalk from "chalk";
import * as InputParser from "../input-parser";

describe("cli should", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("have a run method", () => {
    expect(run).toBeDefined();
  });

  it("print a banner title", async () => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue("NB this is a test");
    const bannerSpy = vi.spyOn(console, "log");

    await run();
    expect(bannerSpy).toHaveBeenCalled();
    expect(bannerSpy).toHaveBeenCalledWith(
      chalk.green("Welcome to Hussle CLI.")
    );
  });

  it("prints the basic menu options", async () => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue("NX this is a test");

    const menuSpy = vi.spyOn(console, "log");
    await run();
    expect(menuSpy).toHaveBeenCalled();
    expect(menuSpy).toHaveBeenCalledWith(
      "1. Write the next N bars. [format: NB <number> <curBar>]"
    );
    expect(menuSpy).toHaveBeenCalledWith(
      "2. Write the next bar. [format: NX <curBar>]"
    );
  });

  it("expect the user to enter an input to select an option", async () => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue("NB this is a test");

    await run();
    expect(inputParserSpy).toHaveBeenCalled();
  });

  it.each([
    ["NB this is a bar"],
    ["NX this is a bar"],
    ["NB times tense, rhymes immense"],
    ["NX this is a bar 16"],
  ])("parses a valid user input %s with count %s", async (command) => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue(command);
    const parseUserInputSpy = vi.spyOn(InputParser, "parseUserInput");
    await run();
    expect(parseUserInputSpy).toHaveBeenCalled();
    expect(parseUserInputSpy).toHaveBeenCalledWith(command);
  });
});
