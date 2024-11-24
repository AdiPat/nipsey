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

const extractDetectedCode = (input: string) => {
  const curCode = input.split(" ")[0];
  const detectedCode = Object.values(menuMap).find((v) => v.code === curCode);
  return detectedCode?.option;
};

const extractCount = (input: string): number => {
  const tokens = input.split(" ");
  const count = parseInt(tokens[tokens.length - 1]);

  return count;
};

const extractText = (input: string, count: number): string[] => {
  let [_, ...text] = input.split(" ");

  let remainingText;

  if (isNaN(count)) {
    remainingText = text;
  } else {
    remainingText = text.slice(0, text.length - 1);
  }

  return remainingText;
};

const extractInputComponents = (
  input: string
): {
  detectedOption: QueryOptions;
  text: string[];
  count?: number;
} => {
  const count = extractCount(input);
  const text = extractText(input, count);
  const detectedOption = extractDetectedCode(input) as QueryOptions;

  return { detectedOption, text, count };
};

export const parseUserInput = async (
  input: string
): Promise<{
  option: QueryOptions;
  text: string;
  count?: number;
}> => {
  const { detectedOption, text, count } = extractInputComponents(input);

  if (!detectedOption) {
    throw new Error("Error: Required 'queryType' is invalid.");
  }

  let finalCount = count;

  if (detectedOption === "WRITE_N_BARS") {
    finalCount = count || 8;
  } else if (detectedOption === "WRITE_NEXT_BAR") {
    finalCount = 1;
  }

  return {
    option: detectedOption,
    text: text.join(" "),
    count: finalCount,
  };
};
