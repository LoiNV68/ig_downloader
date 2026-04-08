const express = require("express");
const cors = require("cors");
const { scrapeInstagram } = require("./lib/scraper");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Instagram Downloader API is running",
  });
});

// Download endpoint
app.post("/download", async (req, res) => {
  const { url } = req.body;

  // Validate URL
  if (!url) {
    return res.status(400).json({
      error: "URL is required",
      message: "Please provide an Instagram URL",
    });
  }

  // Check if URL is a valid Instagram URL
  const igPattern = /^https?:\/\/(www\.)?instagram\.com\/([\w.-]+\/)?(p|reel|reels|tv)\/[\w-]+/i;
  if (!igPattern.test(url)) {
    return res.status(400).json({
      error: "Invalid URL",
      message: "Please provide a valid Instagram post, reel, or TV URgit commit -m "first commit"L",
    });
  }

  console.log(`[${new Date().toISOString()}] Scraping: ${url}`);

  try {
    const result = await scrapeInstagram(url);

    if (result.images.length === 0 && result.videos.length === 0) {
      return res.status(404).json({
        error: "No media found",
        message:
          "Could not find any media. The post may be private or the URL may be incorrect.",
      });
    }

    console.log(
      `[${new Date().toISOString()}] Found ${result.images.length} images, ${result.videos.length} videos`
    );

    return res.json({
      success: true,
      images: result.images,
      videos: result.videos,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    return res.status(500).json({
      error: "Scrape failed",
      message: error.message,
    });
  }
});

// Proxy download - streams media with download headers
// This makes the browser download the file instead of opening it in a new tab
// Works on iOS Safari, Android Chrome, and all desktop browsers
app.get("/proxy-download", async (req, res) => {
  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Only allow Instagram CDN URLs
  if (!url.includes("cdninstagram.com") && !url.includes("fbcdn.net")) {
    return res.status(400).json({ error: "Invalid media URL" });
  }

  console.log(`[${new Date().toISOString()}] Proxy download: ${filename || "media"}`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://www.instagram.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`CDN responded with ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const safeName = (filename || "ig_media").replace(/[^a-zA-Z0-9._-]/g, "_");

    // Set headers for forced download
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    res.setHeader("Cache-Control", "no-cache");

    // Stream the response body to client
    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    };
    await pump();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Proxy error:`, error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download failed", message: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Instagram Downloader API running on http://localhost:${PORT}`);
  console.log(`   POST /download        - Scrape Instagram media`);
  console.log(`   GET  /proxy-download  - Proxy download media\n`);
});
