import readline from "readline";
import { menuMap } from "./menu-map";
import { QueryOptions } from "./models";

const DEFAULT_COUNT = 1;

export const getUserInput = (): Promise<string> => {
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
  const match = input.match(/~(\d+)/);
  return match ? parseInt(match[1], 10) : DEFAULT_COUNT;
};

const extractText = (input: string, count: number): string[] => {
  let [_, ...text] = input.split(" ");
  let remainingText;

  if (isNaN(count)) {
    remainingText = text.filter((t) => !t.includes("~"));
  } else {
    remainingText = text
      .map((t) => t.trim())
      .filter((t) => !t.includes("~"))
      .slice(0, text.length);
  }

  return remainingText;
};

const removeContextFromText = (allText: string): string => {
  const tokens = allText.split("|");
  return tokens[0].trim();
};

const extractContext = (allText: string): string => {
  const tokens = allText.split("|");

  if (tokens.length === 1) {
    return "";
  }

  return tokens[1].trim();
};

const extractInputComponents = (
  input: string
): {
  detectedOption: QueryOptions;
  text: string[];
  count?: number;
  context?: string;
} => {
  const count = extractCount(input);
  const text = extractText(input, count);
  const detectedOption = extractDetectedCode(input) as QueryOptions;
  const context = extractContext(input);
  return { detectedOption, text, count, context };
};

const setCountDefaultsIfNotProvided = (
  count: number | undefined,
  detectedOption: QueryOptions
) => {
  let finalCount;

  if (detectedOption === "WRITE_N_BARS") {
    finalCount = count || 8;
  } else if (detectedOption === "WRITE_NEXT_BAR") {
    finalCount = 1;
  }

  return finalCount;
};

export const parseUserInput = async (
  input: string
): Promise<{
  option: QueryOptions;
  text: string;
  count?: number;
  context?: string;
}> => {
  const inputComponents = extractInputComponents(input);
  const text = removeContextFromText(inputComponents.text.join(" "));
  const option = inputComponents.detectedOption;

  if (!option) {
    throw new Error("Error: Required 'queryType' is invalid.");
  }

  const count = setCountDefaultsIfNotProvided(
    inputComponents.count,
    inputComponents.detectedOption
  );

  return {
    option,
    text,
    count,
    context: inputComponents.context,
  };
};
