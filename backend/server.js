import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Interview Agent Server is running smoothly',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server listening on http://127.0.0.1:${PORT}`);
});
