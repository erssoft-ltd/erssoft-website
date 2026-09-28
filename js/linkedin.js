
/* ==========================================
   ERSSOFT - LINKEDIN POSTS
   ========================================== */

(() => {
  "use strict";

  const API_URL = "/api/linkedin/posts";
  const PAGE_SIZE = 3;

  const grid = document.getElementById("linkedin-posts");
  const status = document.getElementById("linkedin-status");
  const pagination = document.getElementById("linkedin-pagination");

  const previous = document.getElementById("linkedin-prev");
  const next = document.getElementById("linkedin-next");
  const counter = document.getElementById("linkedin-page-counter");

  if (!grid || !status || !pagination || !previous || !next || !counter) {
    return;
  }

  let posts = [];
  let currentPage = 0;

  const companyUrl =
    "https://www.linkedin.com/company/77574975/";

  /* ==========================================
     DATE FORMAT
     ========================================== */

  function formatDate(value) {
    if (!value) return "";

    const numeric = Number(value);

    const date = Number.isFinite(numeric) && numeric > 0
      ? new Date(numeric < 1e12 ? numeric * 1000 : numeric)
      : new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  /* ==========================================
     LINKEDIN TEXT FORMAT
     ========================================== */

  function formatLinkedInText(value) {
    if (typeof value !== "string") return "";

    return value
      // LinkedIn hashtag format
      .replace(/\{hashtag\\?\|([^}]+)\}/gi, "$1")

      // Normalise line breaks
      .replace(/\r\n/g, "\n")

      // Remove excessive blank lines
      .replace(/\n{3,}/g, "\n\n")

      .trim();
  }

  /* ==========================================
     SAFE URL
     ========================================== */

  function safeUrl(value) {
    if (typeof value !== "string") return null;

    try {
      const url = new URL(value, window.location.origin);

      if (!["https:", "http:"].includes(url.protocol)) {
        return null;
      }

      return url.href;

    } catch {
      return null;
    }
  }

  /* ==========================================
     NORMALISE POST
     ========================================== */

  function normalisePost(post) {
    const commentary = post.commentary;

    const rawText =
      typeof commentary === "string"
        ? commentary
        : commentary?.text ??
          post.text ??
          post.content ??
          "";

    const image =
      post.imageUrl ??
      post.image ??
      post.media?.url ??
      post.media?.imageUrl ??
      null;

    const video =
      post.videoUrl ??
      post.video?.url ??
      post.media?.videoUrl ??
      null;

    const url =
      post.permalink ??
      post.url ??
      null;

    return {
      text: formatLinkedInText(rawText),

      image,
      video,
      url,

      date: formatDate(
        post.createdAt ??
        post.created_at ??
        post.date ??
        post.publishedAt
      )
    };
  }

  /* ==========================================
     CREATE MEDIA
     ========================================== */

  function createMedia(post) {
    const videoUrl = safeUrl(post.video);
    const imageUrl = safeUrl(post.image);

    // Video has priority
    if (videoUrl) {
      const video = document.createElement("video");

      video.className = "linkedin-card__image";
      video.src = videoUrl;

      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;

      if (imageUrl) {
        video.poster = imageUrl;
      }

      return video;
    }

    // Image
    if (imageUrl) {
      const image = document.createElement("img");

      image.className = "linkedin-card__image";
      image.src = imageUrl;
      image.alt = "ERSSOFT LinkedIn post";

      image.loading = "lazy";
      image.decoding = "async";

      return image;
    }

    return null;
  }

  /* ==========================================
     CREATE POST CARD
     ========================================== */

  function createCard(post) {
    const article = document.createElement("article");

    article.className = "linkedin-card";

    // Media
    const media = createMedia(post);

    if (media) {
      article.appendChild(media);
    }

    // Body
    const body = document.createElement("div");

    body.className = "linkedin-card__body";

    // Date
    if (post.date) {
      const date = document.createElement("span");

      date.className = "linkedin-card__date";
      date.textContent = post.date;

      body.appendChild(date);
    }

    // Text
    const content = document.createElement("p");

    content.className = "linkedin-card__text";
    content.textContent = post.text;

    body.appendChild(content);

    // LinkedIn link
    const link = document.createElement("a");

    link.className = "linkedin-card__link";

    link.href = safeUrl(post.url) ?? companyUrl;

    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.textContent = "View on LinkedIn ↗";

    body.appendChild(link);

    article.appendChild(body);

    return article;
  }

  /* ==========================================
     RENDER POSTS
     ========================================== */

  function renderPosts() {
    grid.replaceChildren();

    const totalPages = Math.ceil(posts.length / PAGE_SIZE);

    const start = currentPage * PAGE_SIZE;

    const visible = posts.slice(
      start,
      start + PAGE_SIZE
    );

    visible.forEach(post => {
      grid.appendChild(createCard(post));
    });

    grid.hidden = false;

    pagination.hidden = totalPages <= 1;

    counter.textContent =
      `${currentPage + 1} / ${totalPages}`;

    previous.disabled = currentPage === 0;

    next.disabled = currentPage >= totalPages - 1;
  }

  /* ==========================================
     LOAD LINKEDIN POSTS
     ========================================== */

  async function loadPosts() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(
          `LinkedIn API: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const items = Array.isArray(data)
        ? data
        : data.posts ?? data.elements ?? [];

      if (!Array.isArray(items)) {
        throw new Error("Invalid API response");
      }

      posts = items.map(normalisePost);

      if (!posts.length) {
        status.textContent =
          "No LinkedIn updates available at the moment.";

        return;
      }

      status.hidden = true;

      renderPosts();

    } catch (error) {
      console.error(
        "LinkedIn loading error:",
        error
      );

      status.textContent =
        "LinkedIn updates are temporarily unavailable.";
    }
  }

  /* ==========================================
     PAGINATION
     ========================================== */

  previous.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;

      renderPosts();
    }
  });

  next.addEventListener("click", () => {
    if ((currentPage + 1) * PAGE_SIZE < posts.length) {
      currentPage++;

      renderPosts();
    }
  });

  /* ==========================================
     INITIALISE
     ========================================== */

  loadPosts();

})();
