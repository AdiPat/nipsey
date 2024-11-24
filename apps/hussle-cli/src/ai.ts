import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import z from "zod";

const models = {
  GPT_4O_MINI: openai("gpt-4o-mini"),
};

const barsSchema = z.object({
  bars: z.array(z.string()),
});

export const AI = {
  models,
  barsSchema,
  generateText,
  generateObject,
};
