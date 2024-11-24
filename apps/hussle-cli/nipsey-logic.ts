import { AI } from "./ai";
import { z } from "zod";

export async function runQuery(options: {
  queryType: "WRITE_NEXT_BAR" | "NA";
  bars: string[];
  context?: string;
}) {
  const { bars, context, queryType } = options;

  if (!queryType || !queryType?.trim() || queryType == "NA") {
    throw new Error("Error: Error: Required 'queryType' can't be NA. ");
  }

  let prompt = `Bar: ${bars[0]}`;

  if (context) {
    prompt += `\nContext: ${context}`;
  }

  const { object } = await AI.generateObject({
    model: AI.models.GPT_4O_MINI,
    system:
      "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given a bar, respond with the next bar.",
    prompt,
    schema: AI.barsSchema,
  });

  return {
    bars: [bars[0], object.bars[0]],
  };
}
