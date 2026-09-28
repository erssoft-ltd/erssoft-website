
/* ==========================================
   ERSSOFT - LINKEDIN POSTS API
   Cloudflare Pages Functions
   ========================================== */

interface Env {
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_COMPANY_ID: string;
  LINKEDIN_API_VERSION: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

type LinkedInPost = Record<string, any>;

const API = "https://api.linkedin.com/rest";

const PAGE_SIZE = 20;
const MAX_PAGES = 5;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        status === 200
          ? "public, max-age=300"
          : "no-store",
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

/* ==========================================
   LINKEDIN REQUEST
   ========================================== */

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

    throw new Error(
      `LinkedIn API HTTP ${response.status}`
    );
  }

  return response.json();
}

/* ==========================================
   URL HELPERS
   ========================================== */

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

  if (typeof value === "string") {
    return value;
  }

  if (typeof value?.id === "string") {
    return value.id;
  }

  return null;
}

/* ==========================================
   IMAGE RESOLUTION
   ========================================== */

function selectImage(data: any): string | null {

  const candidates = [
    data?.downloadUrl,
    data?.downloadUrl?.url,
    data?.imageUrl,
    data?.url,
    data?.image?.downloadUrl,
  ];

  for (const candidate of candidates) {

    const url = validUrl(candidate);

    if (url) return url;
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

    const imageUrl = selectImage(data);

    if (!imageUrl) {
      console.error(
        "LinkedIn image URL unavailable",
        urn
      );
    }

    return imageUrl;

  } catch (error) {

    console.error(
      "LinkedIn image resolution failed",
      urn,
      error
    );

    return null;
  }
}

/* ==========================================
   VIDEO RESOLUTION
   ========================================== */

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

    const videoUrl =
      validUrl(data?.downloadUrl) ??
      validUrl(data?.downloadUrl?.url) ??
      validUrl(data?.videoUrl) ??
      validUrl(data?.streamingUrl) ??
      null;

    const thumbnailUrl =
      validUrl(data?.thumbnailUrl) ??
      validUrl(data?.thumbnail?.downloadUrl) ??
      validUrl(data?.thumbnail?.url) ??
      null;

    return {
      videoUrl,
      thumbnailUrl,
    };

  } catch (error) {

    console.error(
      "LinkedIn video resolution failed",
      urn,
      error
    );

    return {
      videoUrl: null,
      thumbnailUrl: null,
    };
  }
}

/* ==========================================
   POST MEDIA
   ========================================== */

async function resolveMedia(
  post: LinkedInPost,
  env: Env
) {

  const content = post.content ?? {};

  const result = {
    mediaType: "none",
    imageUrl: null as string | null,
    videoUrl: null as string | null,
    images: [] as string[],
  };

  // Multiple images

  const multiImages = content.multiImage?.images;

  if (
    Array.isArray(multiImages) &&
    multiImages.length > 0
  ) {

    result.mediaType = "multiImage";

    const resolved = await Promise.all(
      multiImages.map(async (item: any) => {

        const urn =
          mediaId(item?.id) ??
          mediaId(item?.image);

        if (!urn) return null;

        return resolveImage(urn, env);
      })
    );

    result.images = resolved.filter(
      (url): url is string => Boolean(url)
    );

    result.imageUrl = result.images[0] ?? null;

    return result;
  }

  // Single media

  const media = content.media;

  const urn =
    mediaId(media) ??
    mediaId(media?.image) ??
    mediaId(media?.video);

  if (!urn) return result;

  // Image

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

  // Video

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

/* ==========================================
   FETCH COMPANY POSTS
   ========================================== */

async function getAllPosts(
  author: string,
  env: Env
): Promise<LinkedInPost[]> {

  const all: LinkedInPost[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {

    const url = new URL(`${API}/posts`);

    url.searchParams.set("q", "author");
    url.searchParams.set("author", author);
    url.searchParams.set(
      "count",
      String(PAGE_SIZE)
    );

    url.searchParams.set(
      "start",
      String(page * PAGE_SIZE)
    );

    let data: any;

    try {

      data = await linkedinGet(
        url.toString(),
        env
      );

    } catch (error) {

      console.error(
        "LinkedIn pagination error",
        page,
        error
      );

      // Do not discard previously fetched posts.

      if (all.length === 0) {
        throw error;
      }

      break;
    }

    const elements = Array.isArray(data?.elements)
      ? data.elements
      : [];

    all.push(...elements);

    if (elements.length < PAGE_SIZE) {
      break;
    }
  }

  return all;
}

/* ==========================================
   CLOUDFLARE ENTRY POINT
   ========================================== */

export const onRequestGet = async (
  context: PagesContext
): Promise<Response> => {

  const env = context.env;

  // Validate configuration

  if (
    !env.LINKEDIN_ACCESS_TOKEN ||
    !env.LINKEDIN_COMPANY_ID ||
    !env.LINKEDIN_API_VERSION
  ) {

    return json(
      {
        error:
          "LinkedIn configuration is incomplete.",
      },
      503
    );
  }

  const author =
    `urn:li:organization:${env.LINKEDIN_COMPANY_ID}`;

  try {

    // Fetch posts

    const rawPosts = await getAllPosts(
      author,
      env
    );

    // Published public company posts

    const published = rawPosts
      .filter((post) => {

        return (
          post.author === author &&
          post.lifecycleState === "PUBLISHED" &&
          post.visibility === "PUBLIC"
        );

      })
      .sort((a, b) => {

        const dateA = Number(
          a.publishedAt ??
          a.createdAt ??
          0
        );

        const dateB = Number(
          b.publishedAt ??
          b.createdAt ??
          0
        );

        return dateB - dateA;
      });

    const posts: any[] = [];

    // Process media in small batches

    for (
      let i = 0;
      i < published.length;
      i += 5
    ) {

      const batch = published.slice(
        i,
        i + 5
      );

      const mapped = await Promise.all(
        batch.map(async (post) => {

          const media = await resolveMedia(
            post,
            env
          );

          return {

            id: post.id,

            text:
              post.commentary ?? "",

            publishedAt:
              post.publishedAt ??
              post.createdAt,

            url: post.id
              ? `https://www.linkedin.com/feed/update/${post.id}/`
              : null,

            ...media,

          };
        })
      );

      posts.push(...mapped);
    }

    // Successful response

    return json({

      company: "ErsSoft Limited",

      companyId:
        env.LINKEDIN_COMPANY_ID,

      count: posts.length,

      posts,

    });

  } catch (error) {

    console.error(
      "LinkedIn posts retrieval failed",
      error
    );

    return json(
      {
        error:
          "Unable to retrieve LinkedIn posts.",

        detail:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      502
    );
  }
};
