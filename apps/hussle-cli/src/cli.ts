import chalk from "chalk";
import { getUserInput, parseUserInput } from "./input-parser";
import { menuMap } from "./menu-map";
import { runQuery } from "./nipsey-logic";

const printBanner = () => {
  console.log(chalk.green("Welcome to Hussle CLI."));
};

const printMenuOptions = () => {
  const keys = Object.keys(menuMap).sort((a, b) => parseInt(a) - parseInt(b));

  keys.forEach((key) => {
    console.log(chalk.blue(`${key}. ${menuMap[key].text}`));
  });
};

export async function run() {
  printBanner();
  printMenuOptions();

  const command = await getUserInput();
  const parsedCommand = await parseUserInput(command);
  const { bars } = await runQuery({
    queryType: parsedCommand.option,
    bars: parsedCommand.text.split(","),
    nextBarsCount: parsedCommand.count,
  });
  const output = bars.join(",\n");
  console.log(chalk.cyan(output));
}
