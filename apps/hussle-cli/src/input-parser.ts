import readline from "readline";

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

export const parseUserInput = (input: string) => {
  const [option, ...text] = input.split(" ");
  return {
    option,
    text: text.join(" "),
  };
};
