
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

  if (!grid || !status || !pagination ||
      !previous || !next || !counter) return;

  const companyUrl =
    "https://www.linkedin.com/company/77574975/";

  let posts = [];
  let currentPage = 0;

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

  function formatLinkedInText(value) {
    if (typeof value !== "string") return "";

    return value
      .replace(/\{hashtag\\?\|([^}]+)\}/gi, "$1")
      .replace(/\\+#\|/g, "#")
      .replace(/#\|/g, "#")
      .replace(/\\+#/g, "#")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function safeUrl(value) {
    if (typeof value !== "string") return null;

    try {
      const url = new URL(value, window.location.origin);

      return url.protocol === "https:" ||
             url.protocol === "http:"
        ? url.href
        : null;
    } catch {
      return null;
    }
  }

  function normalisePost(post) {
    const commentary = post.commentary;

    const rawText =
      typeof commentary === "string"
        ? commentary
        : commentary?.text ??
          post.text ??
          post.content ??
          "";

    const images = Array.isArray(post.images)
      ? post.images.map(safeUrl).filter(Boolean)
      : [];

    const imageUrl = safeUrl(
      post.imageUrl ?? post.image
    );

    if (imageUrl && !images.includes(imageUrl)) {
      images.unshift(imageUrl);
    }

    return {
      text: formatLinkedInText(rawText),
      date: formatDate(
        post.publishedAt ??
        post.createdAt ??
        post.date
      ),
      url: safeUrl(
        post.url ?? post.permalink ?? post.linkedinUrl
      ) ?? companyUrl,
      images,
      videoUrl: safeUrl(post.videoUrl),
      mediaType: post.mediaType ?? "none"
    };
  }

  function createImage(url) {
    const image = document.createElement("img");

    image.className = "linkedin-card__image";
    image.src = url;
    image.alt = "ERSSOFT LinkedIn post image";
    image.loading = "lazy";
    image.decoding = "async";

    return image;
  }

  function createGallery(images) {
    const gallery = document.createElement("div");
    gallery.className = "linkedin-card__gallery";

    let index = 0;

    const image = createImage(images[0]);
    gallery.appendChild(image);

    if (images.length > 1) {
      const controls = document.createElement("div");
      controls.className = "linkedin-card__gallery-controls";

      const prev = document.createElement("button");
      prev.type = "button";
      prev.textContent = "←";
      prev.setAttribute("aria-label", "Previous image");

      const count = document.createElement("span");

      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "→";
      next.setAttribute("aria-label", "Next image");

      function update() {
        image.src = images[index];
        count.textContent = `${index + 1} / ${images.length}`;
        prev.disabled = index === 0;
        next.disabled = index === images.length - 1;
      }

      prev.addEventListener("click", () => {
        if (index > 0) {
          index--;
          update();
        }
      });

      next.addEventListener("click", () => {
        if (index < images.length - 1) {
          index++;
          update();
        }
      });

      controls.append(prev, count, next);
      gallery.appendChild(controls);
      update();
    }

    return gallery;
  }

  function createMedia(post) {
    if (post.videoUrl) {
      const video = document.createElement("video");

      video.className = "linkedin-card__image";
      video.src = post.videoUrl;
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;

      if (post.images.length) {
        video.poster = post.images[0];
      }

      return video;
    }

    if (post.images.length) {
      return createGallery(post.images);
    }

    return null;
  }

  function createCard(post) {
    const article = document.createElement("article");
    article.className = "linkedin-card";

    const media = createMedia(post);

    if (media) {
      article.appendChild(media);
    }

    const body = document.createElement("div");
    body.className = "linkedin-card__body";

    if (post.date) {
      const date = document.createElement("span");
      date.className = "linkedin-card__date";
      date.textContent = post.date;
      body.appendChild(date);
    }

    const content = document.createElement("p");
    content.className = "linkedin-card__text";
    content.textContent = post.text;
    body.appendChild(content);

    const link = document.createElement("a");
    link.className = "linkedin-card__link";
    link.href = post.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on LinkedIn ↗";

    body.appendChild(link);
    article.appendChild(body);

    return article;
  }

  function renderPosts() {
    grid.replaceChildren();

    const totalPages = Math.ceil(posts.length / PAGE_SIZE);
    const start = currentPage * PAGE_SIZE;

    posts.slice(start, start + PAGE_SIZE).forEach(post => {
      grid.appendChild(createCard(post));
    });

    grid.hidden = false;
    pagination.hidden = totalPages <= 1;

    counter.textContent =
      `${currentPage + 1} / ${totalPages}`;

    previous.disabled = currentPage === 0;
    next.disabled = currentPage >= totalPages - 1;
  }

  async function loadPosts() {
    try {
      const response = await fetch(API_URL, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) throw new Error(data.error);

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
      console.error("LinkedIn loading error:", error);

      status.textContent =
        "LinkedIn updates are temporarily unavailable.";
    }
  }

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

  loadPosts();
})();
