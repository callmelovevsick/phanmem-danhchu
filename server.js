const express = require('express');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const openai = new OpenAI({
  apiKey: 'API_KEY_CUA_BAN_LAY_TREN_OPENAI',
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

const leaderboardFile = path.join(__dirname, 'data', 'leaderboard.json');

function loadLeaderboard() {
  if (fs.existsSync(leaderboardFile)) {
    return JSON.parse(fs.readFileSync(leaderboardFile, 'utf8'));
  }
  return [];
}

function saveLeaderboard(data) {
  fs.writeFileSync(leaderboardFile, JSON.stringify(data, null, 2));
}

async function generateParagraph() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Bạn là nhà văn tiếng Việt. Hãy viết một đoạn văn ngắn (100-180 từ) về chủ đề cuộc sống, cảm xúc, thiên nhiên, hoặc kỷ niệm. Viết tự nhiên, giàu hình ảnh, không dùng từ ngữ sáo rỗng. Chỉ trả về đoạn văn, không giải thích."
        }
      ],
      max_tokens: 300,
      temperature: 0.9
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Lỗi sinh đoạn văn:", error.message);
    return "Hôm nay là một ngày đẹp trời. Tôi thức dậy sớm, pha một tách cà phê nóng. Ánh nắng chiếu qua cửa sổ, làm sáng bừng căn phòng nhỏ. Tôi quyết định ra công viên gần nhà. Ở đó, tôi thấy một chú chim nhỏ đang nhảy nhót trên cành cây. Tiếng hót của nó thật vui tai. Tôi mỉm cười, cảm thấy lòng mình nhẹ nhàng hơn. Cuộc sống đôi khi chỉ cần những khoảnh khắc nhỏ như vậy để trở nên ý nghĩa.";
  }
}

app.get('/', async (req, res) => {
  const paragraph = await generateParagraph();
  const leaderboard = loadLeaderboard()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.render('index', {
    paragraph,
    leaderboard,
    showFeedback: false,
    submittedName: null,
    error: null
  });
});

app.post('/submit', async (req, res) => {
  const { translation, name } = req.body;

  const original = await generateParagraph();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Bạn là giáo viên tiếng Anh chuyên nghiệp. Đánh giá bản dịch:

Đoạn gốc (tiếng Việt): "${original}"
Bản dịch (tiếng Anh): "${translation}"

Trả về đúng JSON:
{
  "score": số từ 0-100,
  "feedback": "nhận xét ngắn bằng tiếng Việt",
  "correct": true nếu ≥90, false nếu không,
  "suggestion": "1 câu gợi ý sửa (nếu có, không thì để rỗng)"
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    result.translation = translation;

    if (name && result.score > 0) {
      const leaderboard = loadLeaderboard();
      leaderboard.push({
        name: name.trim(),
        score: result.score,
        date: new Date().toLocaleDateString('vi-VN')
      });
      saveLeaderboard(leaderboard);
    }

    const updatedLeaderboard = loadLeaderboard()
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.render('index', {
      paragraph: original,
      userTranslation: translation,
      feedback: result,
      leaderboard: updatedLeaderboard,
      showFeedback: true,
      submittedName: name || null,
      error: null
    });

  } catch (error) {
    console.error("Lỗi chấm bài:", error.message);
    res.render('index', {
      paragraph: await generateParagraph(),
      leaderboard: loadLeaderboard().sort((a, b) => b.score - a.score).slice(0, 10),
      showFeedback: false,
      submittedName: null,
      error: "Không thể chấm bài. Vui lòng thử lại."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});