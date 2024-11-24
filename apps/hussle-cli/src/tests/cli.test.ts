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
    inputParserSpy.mockResolvedValue("1. this is a test");
    const bannerSpy = vi.spyOn(console, "log");

    await run();
    expect(bannerSpy).toHaveBeenCalled();
    expect(bannerSpy).toHaveBeenCalledWith(
      chalk.green("Welcome to Hussle CLI.")
    );
  });

  it("prints the basic menu options", async () => {
    const inputParserSpy = vi.spyOn(InputParser, "getUserInput");
    inputParserSpy.mockResolvedValue("1. this is a test");

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
    inputParserSpy.mockResolvedValue("1. this is a test");

    await run();
    expect(inputParserSpy).toHaveBeenCalled();
  });
});
