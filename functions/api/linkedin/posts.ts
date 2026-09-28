
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
}

interface Env {
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_COMPANY_ID: string;
  LINKEDIN_API_VERSION: string;
  LINKEDIN_CACHE: KVNamespace;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const API = "https://api.linkedin.com/rest";

const CACHE_KEY = "linkedin-posts-v2";
const RETRY_KEY = "linkedin-api-retry-after-v2";

const CACHE_SECONDS = 21600;
const RETRY_SECONDS = 3600;

type Post = Record<string, any>;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function apiHeaders(env: Env): HeadersInit {
  return {
    Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
    "LinkedIn-Version": env.LINKEDIN_API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
    Accept: "application/json",
  };
}

async function linkedinGet(
  url: string,
  env: Env
): Promise<any> {
  const response = await fetch(url, {
    method: "GET",
    headers: apiHeaders(env),
  });

  if (!response.ok) {
    const details = await response.text();

    console.error("LinkedIn API error", {
      status: response.status,
      endpoint: new URL(url).pathname,
      details: details.slice(0, 500),
    });

    const error = new Error(
      `LinkedIn API HTTP ${response.status}`
    );

    (error as any).status = response.status;

    throw error;
  }

  return response.json();
}

function validUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);

    return url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function mediaId(value: any): string | null {
  if (typeof value === "string") return value;

  if (typeof value?.id === "string") {
    return value.id;
  }

  return null;
}

async function resolveImage(
  urn: string,
  env: Env
): Promise<string | null> {
  try {
    const data = await linkedinGet(
      `${API}/images/${encodeURIComponent(urn)}`,
      env
    );

    return (
      validUrl(data?.downloadUrl) ??
      validUrl(data?.downloadUrl?.url) ??
      validUrl(data?.imageUrl) ??
      null
    );
  } catch (error) {
    console.error(
      "LinkedIn image resolution failed",
      String(error)
    );

    return null;
  }
}

async function resolveVideo(
  urn: string,
  env: Env
): Promise<{
  videoUrl: string | null;
  thumbnailUrl: string | null;
}> {
  try {
    const data = await linkedinGet(
      `${API}/videos/${encodeURIComponent(urn)}`,
      env
    );

    return {
      videoUrl:
        validUrl(data?.downloadUrl) ??
        validUrl(data?.downloadUrl?.url) ??
        validUrl(data?.videoUrl) ??
        null,

      thumbnailUrl:
        validUrl(data?.thumbnailUrl) ??
        validUrl(data?.thumbnail?.downloadUrl) ??
        validUrl(data?.thumbnail?.url) ??
        null,
    };
  } catch (error) {
    console.error(
      "LinkedIn video resolution failed",
      String(error)
    );

    return {
      videoUrl: null,
      thumbnailUrl: null,
    };
  }
}

async function resolveMedia(
  post: Post,
  env: Env
) {
  const content = post.content ?? {};

  const result = {
    mediaType: "none",
    imageUrl: null as string | null,
    videoUrl: null as string | null,
    images: [] as string[],
  };

  const multiImages = content.multiImage?.images;

  if (
    Array.isArray(multiImages) &&
    multiImages.length > 0
  ) {
    result.mediaType = "multiImage";

    const images: string[] = [];

    for (const item of multiImages) {
      const urn =
        mediaId(item?.id) ??
        mediaId(item?.image);

      if (!urn) continue;

      const url = await resolveImage(urn, env);

      if (url) images.push(url);
    }

    result.images = images;
    result.imageUrl = images[0] ?? null;

    return result;
  }

  const media = content.media;

  const urn =
    mediaId(media) ??
    mediaId(media?.image) ??
    mediaId(media?.video);

  if (!urn) return result;

  if (urn.startsWith("urn:li:image:")) {
    result.mediaType = "image";

    result.imageUrl = await resolveImage(
      urn,
      env
    );

    if (result.imageUrl) {
      result.images = [result.imageUrl];
    }

    return result;
  }

  if (urn.startsWith("urn:li:video:")) {
    result.mediaType = "video";

    const video = await resolveVideo(
      urn,
      env
    );

    result.videoUrl = video.videoUrl;
    result.imageUrl = video.thumbnailUrl;

    if (result.imageUrl) {
      result.images = [result.imageUrl];
    }

    return result;
  }

  result.mediaType = "other";

  return result;
}

async function fetchPosts(env: Env) {
  const author =
    `urn:li:organization:${env.LINKEDIN_COMPANY_ID}`;

  const url = new URL(`${API}/posts`);

  url.searchParams.set("q", "author");
  url.searchParams.set("author", author);
  url.searchParams.set("count", "20");
  url.searchParams.set("start", "0");

  const data = await linkedinGet(
    url.toString(),
    env
  );

  const elements = Array.isArray(data?.elements)
    ? data.elements
    : [];

  const published = elements
    .filter((post: Post) =>
      post.author === author &&
      post.lifecycleState === "PUBLISHED" &&
      post.visibility === "PUBLIC"
    )
    .sort((a: Post, b: Post) =>
      Number(b.publishedAt ?? b.createdAt ?? 0) -
      Number(a.publishedAt ?? a.createdAt ?? 0)
    );

  const posts: Post[] = [];

  for (const post of published) {
    const media = await resolveMedia(
      post,
      env
    );

    posts.push({
      id: post.id,

      text: post.commentary ?? "",

      publishedAt:
        post.publishedAt ??
        post.createdAt,

      url: post.id
        ? `https://www.linkedin.com/feed/update/${post.id}/`
        : null,

      ...media,
    });
  }

  return {
    company: "ErsSoft Limited",
    companyId: env.LINKEDIN_COMPANY_ID,
    count: posts.length,
    posts,
    updatedAt: new Date().toISOString(),
  };
}

export const onRequestGet = async (
  context: PagesContext
): Promise<Response> => {
  const env = context.env;

  if (!env.LINKEDIN_CACHE) {
    return json({
      error:
        "LINKEDIN_CACHE KV binding is missing.",
    }, 503);
  }

  const cachedRaw = await env.LINKEDIN_CACHE.get(
    CACHE_KEY
  );

  let cached: any = null;

  if (cachedRaw) {
    try {
      cached = JSON.parse(cachedRaw);
    } catch {
      console.error(
        "Invalid LinkedIn cache data"
      );
    }
  }

  const now = Date.now();

  // Return fresh cached posts.

  if (
    cached &&
    typeof cached.cachedAt === "number" &&
    now - cached.cachedAt < CACHE_SECONDS * 1000
  ) {
    return json({
      ...cached.data,
      cache: "HIT",
    });
  }

  // Avoid repeated requests after an API failure.

  const retryRaw = await env.LINKEDIN_CACHE.get(
    RETRY_KEY
  );

  const retryAfter = Number(retryRaw ?? 0);

  if (retryAfter > now) {
    if (cached?.data) {
      return json({
        ...cached.data,
        cache: "STALE",
      });
    }

    return json({
      error:
        "LinkedIn API is temporarily rate limited.",
      retryAfter:
        new Date(retryAfter).toISOString(),
    }, 503);
  }

  // Check configuration only when refreshing.

  if (
    !env.LINKEDIN_ACCESS_TOKEN ||
    !env.LINKEDIN_COMPANY_ID ||
    !env.LINKEDIN_API_VERSION
  ) {
    if (cached?.data) {
      return json({
        ...cached.data,
        cache: "STALE",
      });
    }

    return json({
      error:
        "LinkedIn configuration is incomplete.",
    }, 503);
  }

  try {
    const data = await fetchPosts(env);

    const payload = {
      cachedAt: Date.now(),
      data,
    };

    await env.LINKEDIN_CACHE.put(
      CACHE_KEY,
      JSON.stringify(payload)
    );

    return json({
      ...data,
      cache: "MISS",
    });
  } catch (error) {
    const status = (error as any)?.status;

    console.error(
      "LinkedIn refresh failed",
      String(error)
    );

    const retryUntil =
      Date.now() + RETRY_SECONDS * 1000;

    await env.LINKEDIN_CACHE.put(
      RETRY_KEY,
      String(retryUntil),
      {
        expirationTtl: RETRY_SECONDS,
      }
    );

    // Keep the last successful data.

    if (cached?.data) {
      return json({
        ...cached.data,
        cache: "STALE",
      });
    }

    return json({
      error:
        "Unable to retrieve LinkedIn posts.",

      detail:
        error instanceof Error
          ? error.message
          : "Unknown error",

      upstreamStatus: status ?? null,
    }, 503);
  }
};
