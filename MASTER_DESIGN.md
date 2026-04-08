# Instagram Downloader - MVP Design

## 1. Mục tiêu
- Nhập link Instagram
- Trả về ảnh/video để tải
- Không dùng web ngoài
- Chạy được demo

---

## 2. Kiến trúc (đơn giản)

Frontend (GitHub Pages)
        ↓
Backend API (Node.js)
        ↓
Puppeteer (crawl IG)
        ↓
Trả URL ảnh

---

## 3. Flow

1. User nhập link IG
2. Frontend gửi POST /download
3. Backend dùng Puppeteer mở link
4. Bắt request ảnh từ Network
5. Trả về URL ảnh
6. Frontend hiển thị + nút tải

---

## 4. API

POST /download

Body:
{
  "url": "https://www.instagram.com/p/XXXXX/"
}

Response:
{
  "images": ["url1", "url2"],
  "videos": []
}

---

## 5. Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Crawl: Puppeteer
- Deploy FE: GitHub Pages
- Deploy BE: Render / Railway

---

## 6. Code hướng xử lý (backend)

- Mở trang IG bằng Puppeteer
- Lắng nghe request/response
- Lọc URL chứa:
  - cdninstagram
  - .jpg / .webp / .mp4
- Trả về list URL

---

## 7. Giới hạn MVP

- Không hỗ trợ private account
- Không login
- Không queue
- Không cache

---

## 8. Hướng nâng cấp

- Thêm queue (BullMQ)
- Cache (Redis)
- Login account
- Proxy chống block
- Hỗ trợ reels / carousel tốt hơn

---

## 9. Kết luận

- MVP = đơn giản, chạy được
- Không tối ưu, không scale
- Phù hợp demo / đồ án