import dotenv from "dotenv";
dotenv.config();
import { run } from "./cli";

const main = async () => {
  while (true) {
    await run();
  }
};

main();
