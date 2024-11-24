import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { run } from "../cli";
import chalk from "chalk";
import * as InputParser from "../input-parser";
import * as NipseyLogic from "../nipsey-logic";

describe("cli should", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    inputParserSpy.mockRestore();
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
    inputParserSpy.mockRestore();
  });

  it("expect the user to enter an input to select an option", async () => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue("NB this is a test");

    await run();
    expect(inputParserSpy).toHaveBeenCalled();
    inputParserSpy.mockRestore();
  });

  it.each([
    ["NB this is a bar"],
    ["NX this is a bar"],
    ["NB times tense, rhymes immense"],
    ["NX this is a bar 16"],
  ])("parses a valid user input '%s'", async (command) => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue(command);
    const parseUserInputSpy = vi.spyOn(InputParser, "parseUserInput");
    await run();
    expect(parseUserInputSpy).toHaveBeenCalled();
    expect(parseUserInputSpy).toHaveBeenCalledWith(command);
    parseUserInputSpy.mockReset();
    inputParserSpy.mockRestore();
  });

  it.each([
    ["this is a bar"],
    ["XX this is a bar"],
    [""],
    ["NV this is a bar Y"],
    ["NA this is a bar  "],
    ["NP this is a bar \n"],
  ])("throws error when invalid user input '%s'", async (command) => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockImplementation(() => Promise.resolve(command));
    const promise = run();
    await expect(promise).rejects.toThrowError(
      "Error: Required 'queryType' is invalid."
    );
  });

  it("calls the runQuery method with the parsed user input", async () => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue("NB this is a test,This is a next bar ~2");
    const runQuerySpy = vi.spyOn(NipseyLogic, "runQuery");
    runQuerySpy.mockResolvedValue({} as any);
    await run();
    expect(runQuerySpy).toHaveBeenCalled();
    expect(runQuerySpy).toHaveBeenCalledWith({
      queryType: "WRITE_N_BARS",
      bars: ["this is a test", "This is a next bar"],
      nextBarsCount: 2,
    });
    inputParserSpy.mockRestore();
  });
});
