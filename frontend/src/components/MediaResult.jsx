export default function MediaResult({ result, loading }) {
  // Loading skeleton
  if (loading) {
    return (
      <section className="loading-section">
        <div className="loading-card">
          <div className="loading-spinner" />
          <p className="loading-text">Đang crawl dữ liệu từ Instagram...</p>
          <p className="loading-subtext">Quá trình này có thể mất 10-30 giây</p>
        </div>
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-image" />
              <div className="skeleton-bar" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // No result yet
  if (!result) {
    return (
      <section className="empty-state">
        <div className="empty-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <h2 className="empty-title">Chưa có kết quả</h2>
        <p className="empty-desc">
          Dán link Instagram ở trên và nhấn Download để bắt đầu
        </p>
      </section>
    );
  }

  const totalMedia = result.images.length + result.videos.length;

  if (totalMedia === 0) {
    return (
      <section className="empty-state">
        <div className="empty-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <h2 className="empty-title">Không tìm thấy media</h2>
        <p className="empty-desc">
          Bài đăng có thể ở chế độ riêng tư hoặc link không hợp lệ
        </p>
      </section>
    );
  }

  const API_URL = `${window.location.protocol}//${window.location.hostname}:3001`;

  const handleDownload = async (mediaUrl, filename) => {
    try {
      // Use backend proxy to force download with proper headers
      // This works on iOS Safari, Android Chrome, and all desktop browsers
      const proxyUrl = `${API_URL}/proxy-download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(filename)}`;
      
      // Create a hidden anchor and trigger download
      const link = document.createElement("a");
      link.href = proxyUrl;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <section className="results-section" id="results-section">
      <div className="results-header">
        <h2 className="results-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Kết quả
        </h2>
        <span className="results-badge">
          {totalMedia} file{totalMedia > 1 ? "s" : ""}
        </span>
      </div>

      <div className="results-grid" id="results-grid">
        {/* Images */}
        {result.images.map((url, index) => (
          <div
            className="media-card"
            key={`img-${index}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="media-preview">
              <img
                src={url}
                alt={`Instagram image ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="media-type-badge">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                IMG
              </span>
            </div>
            <div className="media-actions">
              <button
                className="download-btn"
                onClick={() => handleDownload(url, `ig_image_${index + 1}.jpg`)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Tải ảnh</span>
              </button>
            </div>
          </div>
        ))}

        {/* Videos */}
        {result.videos.map((url, index) => (
          <div
            className="media-card"
            key={`vid-${index}`}
            style={{
              animationDelay: `${(result.images.length + index) * 0.08}s`,
            }}
          >
            <div className="media-preview">
              <video src={url} muted preload="metadata" />
              <span className="media-type-badge">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                VIDEO
              </span>
            </div>
            <div className="media-actions">
              <button
                className="download-btn"
                onClick={() =>
                  handleDownload(url, `ig_video_${index + 1}.mp4`)
                }
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Tải video</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
