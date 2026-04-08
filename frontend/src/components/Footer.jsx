export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-text">
        © {year} Instagram Downloader — Built by Văn Lợi
      </p>
      <p className="footer-disclaimer">
        Tool chỉ nghịch thôi con Chanh!
      </p>
    </footer>
  );
}
