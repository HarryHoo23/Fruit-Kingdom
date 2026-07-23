import OpenAI from "openai";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

interface ApiRequest extends AsyncIterable<Buffer> {
  method?: string;
  url?: string;
}

interface ApiResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body: string): void;
}

const createAiApiPlugin = (mode: string): Plugin => {
  const env = loadEnv(mode, process.cwd(), "");
  const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

  const handler = async (request: ApiRequest, response: ApiResponse, next: () => void) => {
    if (request.method !== "POST" || request.url !== "/api/generate-text") {
      next();
      return;
    }

    if (!client) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server." }));
      return;
    }

    try {
      const chunks: Buffer[] = [];
      for await (const chunk of request) chunks.push(Buffer.from(chunk));
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
        prompt?: string;
        system?: string;
      };
      if (!body.prompt?.trim()) {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "prompt is required" }));
        return;
      }

      const completion = await client.chat.completions.create({
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: body.system || "You help write warm, imaginative text for the Fruit Kingdom app.",
          },
          { role: "user", content: body.prompt.trim() },
        ],
      });

      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ text: completion.choices[0]?.message.content || "" }));
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({ error: error instanceof Error ? error.message : "Unable to generate text" }),
      );
    }
  };

  const memoryDescriptionHandler = async (
    request: ApiRequest,
    response: ApiResponse,
    next: () => void,
  ) => {
    if (request.method !== "POST" || request.url !== "/api/generate-memory-description") {
      next();
      return;
    }

    if (!client) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server." }));
      return;
    }

    try {
      const chunks: Buffer[] = [];
      for await (const chunk of request) chunks.push(Buffer.from(chunk));
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
        imageDataUrl?: string;
        language?: "en" | "zh";
      };
      if (!body.imageDataUrl?.startsWith("data:image/")) {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "imageDataUrl is required" }));
        return;
      }

      const languageInstruction = body.language === "zh" ? "Chinese" : "English";
      const completion = await client.chat.completions.create({
        model: env.OPENAI_VISION_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              `You write gentle, family-friendly memory text in ${languageInstruction}. Return only valid JSON with exactly three fields: title (a warm title of at most eight words), description (one short sentence, at most 30 words), and tags (an array of exactly 3 short, lowercase English keywords). Tags must always be in English, even when the title and description are Chinese. Do not invent names, dates, locations, or facts that are not visible in the photo.`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Create a title, short description, and three English tags for this family memory photo." },
              { type: "image_url", image_url: { url: body.imageDataUrl, detail: "low" } },
            ],
          },
        ],
      });

      const raw = completion.choices[0]?.message.content || "{}";
      const parsed = JSON.parse(raw) as { title?: string; description?: string; tags?: unknown };
      const tags = Array.isArray(parsed.tags)
        ? parsed.tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean).slice(0, 3)
        : [];
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ title: parsed.title?.trim() || "", description: parsed.description?.trim() || "", tags }));
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({ error: error instanceof Error ? error.message : "Unable to describe this photo" }),
      );
    }
  };

  const storyGeneratorHandler = async (
    request: ApiRequest,
    response: ApiResponse,
    next: () => void,
  ) => {
    if (request.method !== "POST" || request.url !== "/api/generate-story") {
      next();
      return;
    }

    if (!client) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server." }));
      return;
    }

    try {
      const chunks: Buffer[] = [];
      for await (const chunk of request) chunks.push(Buffer.from(chunk));
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
        prompt?: string;
        language?: "en" | "zh";
      };
      if (!body.prompt?.trim()) {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "prompt is required" }));
        return;
      }

      const language = body.language === "zh" ? "Chinese" : "English";
      const completion = await client.chat.completions.create({
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You write warm, age-appropriate bedtime stories in ${language}. Return only valid JSON with exactly four string fields: title (at most 80 characters), summary (at most 160 characters), content (a complete bedtime story), and moralLesson (a gentle lesson at most 120 characters). Follow the user's prompt without inventing personal facts.`,
          },
          { role: "user", content: body.prompt.trim() },
        ],
      });
      const raw = completion.choices[0]?.message.content || "{}";
      const parsed = JSON.parse(raw) as {
        title?: string;
        summary?: string;
        content?: string;
        moralLesson?: string;
      };
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({
        title: parsed.title?.trim() || "",
        summary: parsed.summary?.trim() || "",
        content: parsed.content?.trim() || "",
        moralLesson: parsed.moralLesson?.trim() || "",
      }));
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: error instanceof Error ? error.message : "Unable to generate story" }));
    }
  };

  return {
    name: "fruit-kingdom-ai-api",
    configureServer(server) {
      server.middlewares.use(handler);
      server.middlewares.use(memoryDescriptionHandler);
      server.middlewares.use(storyGeneratorHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
      server.middlewares.use(memoryDescriptionHandler);
      server.middlewares.use(storyGeneratorHandler);
    },
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [react(), createAiApiPlugin(mode)],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
        },
      },
    },
  },
}));
