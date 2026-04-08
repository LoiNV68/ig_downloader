import { useState } from "react";
import Header from "./components/Header";
import UrlInput from "./components/UrlInput";
import MediaResult from "./components/MediaResult";
import Footer from "./components/Footer";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3001`;

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDownload = async (url) => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(`${API_URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi tải dữ liệu");
      }

      setResult({
        images: data.images || [],
        videos: data.videos || [],
      });
    } catch (err) {
      if (err.message === "Failed to fetch" || err.message === "Load failed") {
        setError(
          "Không thể kết nối đến máy chủ. Đang truy cập từ điên thoại, hãy chắc chắn đã cấp quyền Firewall cho Node.js qua Port 3001."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <UrlInput onSubmit={handleDownload} loading={loading} />
        {error && (
          <div className="url-section">
            <div className="url-error" style={{ marginBottom: 24 }}>
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
          </div>
        )}
        <MediaResult result={result} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
