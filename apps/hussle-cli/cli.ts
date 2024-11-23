import chalk from "chalk";
import { getUserInput } from "./input-parser";

const printBanner = () => {
  console.log(chalk.green("Welcome to Hussle CLI."));
};

const printMenuOptions = () => {
  console.log(chalk.blue("1. Write the next 3 bars. [curBar: current bar]"));
  console.log(chalk.blue("2. Write the next 7 bars. [curBar: current bar]"));
  console.log(
    chalk.blue("3. Write the entire verse of 16 bars. [curBar: current bar]")
  );
  console.log(
    chalk.blue(
      "4. Write the next verse. [curBar: current bar / verse: current verse]"
    )
  );
};

export async function run() {
  printBanner();
  printMenuOptions();

  const _answer = await getUserInput();
}
