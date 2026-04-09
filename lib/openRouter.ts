const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "meta-llama/llama-3-8b-instruct";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenRouterContentPart = {
  text?: string;
  type?: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | OpenRouterContentPart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

function getOpenRouterHeaders() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const headers = new Headers({
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  });

  const referer =
    process.env.OPENROUTER_HTTP_REFERER ?? process.env.NEXT_PUBLIC_APP_URL;
  const appName = process.env.OPENROUTER_APP_NAME ?? "Customer Support Bot";

  if (referer) {
    headers.set("HTTP-Referer", referer);
  }

  if (appName) {
    headers.set("X-Title", appName);
  }

  return headers;
}

function extractContent(
  content: string | OpenRouterContentPart[] | undefined
): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();
  }

  return "";
}

export async function createChatCompletion({
  messages,
  temperature,
  maxTokens,
  model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
}: {
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  model?: string;
}) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: getOpenRouterHeaders(),
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    const message =
      data.error?.message ||
      `OpenRouter request failed with status ${response.status}`;
    throw Object.assign(new Error(message), { status: response.status });
  }

  const reply = extractContent(data.choices?.[0]?.message?.content);

  if (!reply) {
    throw new Error("No response returned from OpenRouter");
  }

  return reply;
}

export async function summarizeMarkdown(markdown: string) {
  try {
    return await createChatCompletion({
      messages: [
        {
          role: "system",
          content: `
You are a data summarization engine for an AI chatbot.

Your task:

- Convert the input website markdown or text or csv files data into a CLEAN, DENSE SUMMARY for LLM context usage.

STRICT RULES:

- Output ONLY plain text (no markdown, no bullet points, no headings).
- Write as ONE continuous paragraph.
- Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
- Remove repetition and marketing language.
- Keep ONLY factual, informational content that helps answer customer support questions.
- Do NOT copy sentences verbatim unless absolutely necessary.
- Compress aggressively while preserving meaning.
- The final output MUST be under 2000 words.

The result will be stored as long-term context for a chatbot.
          `.trim(),
        },
        {
          role: "user",
          content: markdown,
        },
      ],
      temperature: 0.1,
      maxTokens: 900,
    });
  } catch (error) {
    console.error("Error in summarizeMarkdown:", error);
    throw error;
  }
}

export async function summarizeConversation(messages: ChatMessage[]) {
  try {
    return await createChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "Summarize the following conversation history into a concise paragraph, preserving key details and user intent. The final output MUST be under 2000 words.",
        },
        ...messages,
      ],
      temperature: 0.3,
      maxTokens: 500,
    });
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    throw error;
  }
}
