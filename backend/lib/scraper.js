const puppeteer = require("puppeteer");

/**
 * Scrape Instagram post for media URLs
 * @param {string} url - Instagram post URL
 * @returns {Promise<{images: string[], videos: string[]}>}
 */
async function scrapeInstagram(url) {
  const images = new Set();
  const videos = new Set();

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--window-size=1920,1080",
      ],
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Intercept network responses to capture media URLs
    page.on("response", async (response) => {
      const resUrl = response.url();

      try {
        // Filter CDN Instagram URLs for media
        if (
          resUrl.includes("cdninstagram.com") ||
          resUrl.includes("fbcdn.net")
        ) {
          const contentType = response.headers()["content-type"] || "";

          if (
            contentType.includes("image") ||
            resUrl.match(/\.(jpg|jpeg|webp|png)/i)
          ) {
            // Skip thumbnails and small images (profile pics, etc.)
            if (
              !resUrl.includes("s150x150") &&
              !resUrl.includes("s320x320") &&
              !resUrl.includes("s240x240") &&
              !resUrl.includes("/s/") &&
              !resUrl.includes("_s.jpg")
            ) {
              images.add(resUrl);
            }
          }

          if (
            contentType.includes("video") ||
            resUrl.match(/\.(mp4|webm)/i)
          ) {
            videos.add(resUrl);
          }
        }
      } catch (e) {
        // Ignore response processing errors
      }
    });

    // Navigate to the Instagram post
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait extra time for lazy-loaded content
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Try to extract media from page DOM as fallback
    const domMedia = await page.evaluate(() => {
      const result = { images: [], videos: [] };

      // Get all images
      document.querySelectorAll("img").forEach((img) => {
        const src = img.src || img.getAttribute("srcset") || "";
        if (
          (src.includes("cdninstagram.com") || src.includes("fbcdn.net")) &&
          !src.includes("s150x150") &&
          !src.includes("s320x320") &&
          !src.includes("profile")
        ) {
          // Get the highest resolution from srcset if available
          const srcset = img.getAttribute("srcset");
          if (srcset) {
            const sources = srcset.split(",").map((s) => s.trim().split(" "));
            const highRes = sources[sources.length - 1];
            if (highRes && highRes[0]) {
              result.images.push(highRes[0]);
              return;
            }
          }
          result.images.push(src);
        }
      });

      // Get all videos
      document.querySelectorAll("video").forEach((video) => {
        const src =
          video.src ||
          video.querySelector("source")?.src ||
          video.getAttribute("src") ||
          "";
        if (src && (src.includes("cdninstagram.com") || src.includes("fbcdn.net"))) {
          result.videos.push(src);
        }
      });

      return result;
    });

    // Merge DOM results with network intercepted results
    domMedia.images.forEach((url) => images.add(url));
    domMedia.videos.forEach((url) => videos.add(url));

    return {
      images: [...images],
      videos: [...videos],
    };
  } catch (error) {
    console.error("Lỗi cào dữ liệu:", error.message);
    throw new Error(`Không thể cào dữ liệu: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { scrapeInstagram };
