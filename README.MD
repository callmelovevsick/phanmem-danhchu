# AI Translation Practice App  
**Dịch tiếng Anh – Đoạn văn mới mỗi lần – Chấm điểm bằng ChatGPT**

---

## Tính năng nổi bật

| Tính năng | Mô tả |
|---------|------|
| **Đoạn văn sinh tự động** | Mỗi lần vào hoặc nộp bài → đoạn văn tiếng Việt **mới 100%** từ **ChatGPT** |
| **Chấm điểm bằng AI** | Gửi bản dịch → **ChatGPT** chấm điểm + feedback + gợi ý sửa |
| **Leaderboard** | Top 10 người chơi có điểm cao nhất |
| **Animation siêu đẹp** | Glassmorphism, particle, typing text, confetti, glow |
| **Responsive** | Đẹp trên điện thoại, máy tính |

---


---

## Yêu cầu

- **Node.js** (v16 trở lên)
- **OpenAI API Key** (tạo tại [platform.openai.com](https://platform.openai.com))

---

## Cài đặt & Chạy

```bash
# 1. Clone repo
git clone https://github.com/callmelovevsick/phanmem-danhchu.git
cd danhchu

# 2. Cài dependencies
npm install

# 3. Thêm apiKey của openai sửa trực tiếp trong server.js
# Thêm API Key vào server.js:
# apiKey: 'sk-...'

# 4. Tạo file leaderboard (có sẵn)
mkdir data
echo "[]" > data/leaderboard.json

# 5. Chạy server
node server.js