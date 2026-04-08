import { useState } from "react";

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (inputUrl) => {
    const pattern =
      /^https?:\/\/(www\.)?instagram\.com\/([\w.-]+\/)?(p|reel|reels|tv)\/[\w-]+/i;
    return pattern.test(inputUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Vui lòng nhập link Instagram");
      return;
    }

    if (!validateUrl(trimmed)) {
      setError(
        "Link không hợp lệ. Hãy dán link bài viết, reel hoặc IGTV từ Instagram"
      );
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <section className="url-section">
      <div className="url-card">
        <form className="url-form" onSubmit={handleSubmit} id="download-form">
          <div className="url-input-wrapper">
            <svg
              className="url-input-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <input
              id="url-input"
              className="url-input"
              type="text"
              placeholder="https://www.instagram.com/p/xxxxx/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            id="download-btn"
            className="url-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="url-error" id="url-error">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
