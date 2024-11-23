import { describe, expect, it, vi } from "vitest";
import { run } from "../cli";
import chalk from "chalk";
import readline from "readline";

describe("cli should", () => {
  it("have a run method", () => {
    expect(run).toBeDefined();
  });

  it("print a banner title", async () => {
    const bannerSpy = vi.spyOn(console, "log");

    await run();
    expect(bannerSpy).toHaveBeenCalled();
    expect(bannerSpy).toHaveBeenCalledWith(
      chalk.green("Welcome to Hussle CLI.")
    );
  });

  it("prints the basic menu options", async () => {
    const menuSpy = vi.spyOn(console, "log");
    await run();
    expect(menuSpy).toHaveBeenCalled();
    expect(menuSpy).toHaveBeenCalledWith(
      "1. Write the next 3 bars. [curBar: current bar]"
    );
    expect(menuSpy).toHaveBeenCalledWith(
      "2. Write the next 7 bars. [curBar: current bar]"
    );
    expect(menuSpy).toHaveBeenCalledWith(
      "3. Write the entire verse of 16 bars. [curBar: current bar]"
    );
    expect(menuSpy).toHaveBeenCalledWith(
      "4. Write the next verse. [curBar: current bar / verse: current verse]"
    );
  });

  it("expect the user to enter an input to select an option", async () => {
    const questionMock = vi.fn();
    const readlineSpy = vi.spyOn(readline, "createInterface").mockReturnValue({
      question: questionMock,
      close: vi.fn(),
    } as any);

    await run();
    expect(readlineSpy).toHaveBeenCalled();
    expect(questionMock).toHaveBeenCalled();
    expect(questionMock).toHaveBeenCalledWith(
      "Enter your voice as input",
      expect.any(Function)
    );
  });
});
