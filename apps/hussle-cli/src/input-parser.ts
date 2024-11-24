import readline from "readline";
import { menuMap } from "./menu-map";
import { QueryOptions } from "./models";

export const getUserInput = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter your choice as input:", (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

export const parseUserInput = (
  input: string
): {
  option: QueryOptions;
  text: string;
} => {
  const [detectedCode, ...text] = input.split(" ");

  const detectedOption = Object.values(menuMap).find(
    (menuItem) => menuItem.code === detectedCode
  )?.option as QueryOptions;

  return {
    option: detectedOption,
    text: text.join(" "),
  };
};
