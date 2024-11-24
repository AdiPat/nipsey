import { AI } from "./ai";
import { z } from "zod";

export async function runQuery(options: {
  queryType: "WRITE_NEXT_BAR" | "WRITE_N_BARS" | "NA";
  bars: string[];
  context?: string;
  nextBarsCount?: number;
}) {
  const { bars, context, queryType } = options;

  if (!queryType || !queryType?.trim() || queryType == "NA") {
    throw new Error("Error: Error: Required 'queryType' can't be NA. ");
  }

  let prompt, system;

  if (queryType === "WRITE_N_BARS") {
    const nextBarsCount = options.nextBarsCount || 3;
    prompt = `Bars: ${bars.join(",\n")}`;
    system = `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${nextBarsCount} bars.`;

    const { object } = await AI.generateObject({
      model: AI.models.GPT_4O_MINI,
      system,
      prompt,
      schema: AI.barsSchema,
    });

    return {
      bars: [...bars, ...object.bars],
    };
  } else if (queryType === "WRITE_NEXT_BAR") {
    prompt = `Bar: ${bars[0]}`;

    if (context) {
      prompt += `\nContext: ${context}`;
    }

    system =
      "You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given a bar, respond with the next bar.";
  }

  const { object } = await AI.generateObject({
    model: AI.models.GPT_4O_MINI,
    prompt,
    system,
    schema: AI.barsSchema,
  });

  return {
    bars: [bars[0], object.bars[0]],
  };
}
