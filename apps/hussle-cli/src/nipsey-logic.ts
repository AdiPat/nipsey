import { AI } from "./ai";

const computeNextBarCount = (
  nextBarsCount: number | undefined,
  bars: string[]
) => {
  if (!nextBarsCount || nextBarsCount == 0) {
    const currentBarCount = bars.length;

    if (currentBarCount < 8) {
      nextBarsCount = 8 - bars.length;
    } else if (currentBarCount % 8 == 0) {
      nextBarsCount = 8;
    } else {
      const pendingBars = 8 - (currentBarCount % 8);
      nextBarsCount = pendingBars;
    }
  }

  return nextBarsCount;
};

const validateQueryType = (queryType: string) => {
  if (!queryType || !queryType?.trim() || queryType == "NA") {
    throw new Error("Error: Required 'queryType' can't be NA. ");
  }
};

const buildPromopts = (
  bars: string[],
  context: string,
  nextBarsCount: number
): {
  prompt: string;
  system: string;
} => {
  let finalPrompt = `Bars: ${bars.join(",\n")}`;
  const finalSystem = `You are an AI Rap Agent. You are an expert in Hip Hop. You are a rapper. Given the bars, respond with the next ${nextBarsCount} bars.`;

  if (context) {
    finalPrompt += `\nContext: ${context}`;
  }

  return {
    prompt: finalPrompt,
    system: finalSystem,
  };
};

export async function runQuery(options: {
  queryType: "WRITE_NEXT_BAR" | "WRITE_N_BARS" | "NA";
  bars: string[];
  context?: string;
  nextBarsCount?: number;
}): Promise<{
  bars: string[];
}> {
  const { bars, context, queryType } = options;

  validateQueryType(queryType);

  if (queryType === "WRITE_N_BARS") {
    const nextBarsCount = computeNextBarCount(options.nextBarsCount, bars);

    const { prompt, system } = buildPromopts(
      bars,
      context ?? "",
      nextBarsCount
    );

    const { object } = await AI.generateObject({
      model: AI.models.GPT_4O_MINI,
      system,
      prompt,
      schema: AI.barsSchema,
    });

    const result = [...bars, ...object.bars];
    return {
      bars: result,
    };
  } else if (queryType === "WRITE_NEXT_BAR") {
    const nextBarsCount = 1;
    const { prompt, system } = buildPromopts(
      bars,
      context ?? "",
      nextBarsCount
    );

    const { object } = await AI.generateObject({
      model: AI.models.GPT_4O_MINI,
      prompt,
      system,
      schema: AI.barsSchema,
    });
    const result = [...bars, ...object.bars];
    return {
      bars: result,
    };
  }

  return null;
}
