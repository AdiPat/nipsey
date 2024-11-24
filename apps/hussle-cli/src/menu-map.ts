import { QueryOptions } from "./models";

export const menuMap: {
  [key: string]: { code: string; option: QueryOptions; text: string };
} = {
  "1": {
    code: "NB",
    option: "WRITE_N_BARS",
    text: "Write the next N bars. [format: NB <number> <curBar>]",
  },
  "2": {
    code: "NX",
    option: "WRITE_NEXT_BAR",
    text: "Write the next bar. [format: XB <curBar>]",
  },
};
