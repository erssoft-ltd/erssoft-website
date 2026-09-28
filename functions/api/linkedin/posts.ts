
interface Env {
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_COMPANY_ID: string;
  LINKEDIN_API_VERSION: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });

export const onRequestGet = async (
  context: PagesContext
): Promise<Response> => {
  const {
    LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_COMPANY_ID,
    LINKEDIN_API_VERSION,
  } = context.env;

  if (
    !LINKEDIN_ACCESS_TOKEN ||
    !LINKEDIN_COMPANY_ID ||
    !LINKEDIN_API_VERSION
  ) {
    return json(
      { error: "LinkedIn configuration is incomplete." },
      503
    );
  }

  const author = `urn:li:organization:${LINKEDIN_COMPANY_ID}`;

  const url = new URL(
    "https://api.linkedin.com/rest/posts"
  );

  url.searchParams.set("q", "author");
  url.searchParams.set("author", author);
  url.searchParams.set("count", "20");
  url.searchParams.set("start", "0");
  url.searchParams.set("sortBy", "CREATED");

  // Temporary diagnostic: never log the actual token.
  console.log("LinkedIn configuration check", {
    tokenPresent: Boolean(LINKEDIN_ACCESS_TOKEN),
    tokenLength: LINKEDIN_ACCESS_TOKEN?.length ?? 0,
    tokenHasWhitespace:
      LINKEDIN_ACCESS_TOKEN !== LINKEDIN_ACCESS_TOKEN?.trim(),
    companyId: LINKEDIN_COMPANY_ID,
    apiVersion: LINKEDIN_API_VERSION,
  });

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "LinkedIn-Version": LINKEDIN_API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const requestId =
        response.headers.get("x-li-uuid") ??
        response.headers.get("x-restli-id") ??
        "not-provided";

      let errorCode = "unknown";

      try {
        const details: any = await response.json();

        errorCode = String(
          details.serviceErrorCode ??
          details.code ??
          "unknown"
        );

        console.error("LinkedIn API diagnostic", {
          status: response.status,
          errorCode,
          requestId,
        });
      } catch {
        console.error("LinkedIn API diagnostic", {
          status: response.status,
          requestId,
        });
      }

      return json(
        {
          error: "LinkedIn API request failed.",
          status: response.status,
          errorCode,
        },
        502
      );
    }

    const data: any = await response.json();

    console.error("LinkedIn error details", {
  status: response.status,
  serviceErrorCode: details.serviceErrorCode,
  code: details.code,
  message: details.message,
});

    const posts = (data.elements ?? [])
      .filter((post: any) => {
        return (
          post.author === author &&
          post.lifecycleState === "PUBLISHED" &&
          post.visibility === "PUBLIC"
        );
      })
      .slice(0, 6)
      .map((post: any) => ({
        id: post.id,
        text: post.commentary ?? "",
        publishedAt: post.publishedAt ?? post.createdAt,
        mediaType: post.content?.media?.id
          ? "media"
          : "none",
        linkedinUrl: post.id
          ? `https://www.linkedin.com/feed/update/${post.id}/`
          : null,
      }));

    return json({
      company: "ErsSoft Limited",
      companyId: LINKEDIN_COMPANY_ID,
      count: posts.length,
      posts,
    });
  } catch {
    return json(
      { error: "Unable to retrieve LinkedIn posts." },
      502
    );
  }
};
