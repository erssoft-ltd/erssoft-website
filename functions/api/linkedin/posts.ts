
interface KVNamespace {
  get(key: string): Promise<string | null>;
}

interface Env {
  LINKEDIN_CACHE: KVNamespace;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const CACHE_KEY = "linkedin-posts-v3";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const onRequestGet = async (
  context: PagesContext
): Promise<Response> => {
  try {
    const kv = context.env.LINKEDIN_CACHE;

    if (!kv) {
      return json({
        error: "LinkedIn KV binding is missing.",
      }, 503);
    }

    const stored = await kv.get(CACHE_KEY);

    if (!stored) {
      return json({
        company: "ErsSoft Limited",
        count: 0,
        posts: [],
        error: "LinkedIn cache is not populated yet.",
      }, 503);
    }

    const data = JSON.parse(stored);

    if (!Array.isArray(data.posts)) {
      throw new Error("Invalid cache format");
    }

    return json({
      ...data,
      cache: "KV",
    });

  } catch (error) {
    console.error("LinkedIn KV error", error);

    return json({
      error: "Unable to read LinkedIn cache.",
    }, 503);
  }
};
