export const menuMap: {
  [key: string]: { option: string; text: string };
} = {
  "1": {
    option: "WRITE_N_BARS",
    text: "Write the next N bars. [format: NB <number> <curBar>]",
  },
  "2": {
    option: "WRITE_NEXT_BAR",
    text: "Write the next bar. [format: XB <curBar>]",
  },
};
