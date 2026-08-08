import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Fallback question bank for offline/keyless testing
const FALLBACK_QUESTIONS = {
  frontend: [
    { id: 1, text: "Explain the difference between Virtual DOM and Shadow DOM, and how React optimizes re-renders.", category: "React Architecture", hint: "Focus on reconciliation, diffing algorithm, and key prop usage." },
    { id: 2, text: "How would you diagnose and fix a memory leak in a large-scale React application?", category: "Performance & Debugging", hint: "Discuss event listeners, cleanup in useEffect, devtools, and detached DOM trees." },
    { id: 3, text: "Describe how browser rendering pipeline works (DOM, CSSOM, Render Tree, Layout, Paint).", category: "Browser Fundamentals", hint: "Explain reflow vs repaint and how to minimize layout thrashing." },
    { id: 4, text: "What are the trade-offs between Server-Side Rendering (SSR) and Client-Side Rendering (CSR)?", category: "Web Performance", hint: "Touch on TTFB, FCP, SEO, server overhead, and hydration." },
    { id: 5, text: "How do you manage complex asynchronous operations and side effects in modern JavaScript?", category: "Async JavaScript", hint: "Mention Promises, async/await, error handling, and cancellation." }
  ],
  backend: [
    { id: 1, text: "How would you design a rate-limiting middleware for an API receiving 50,000 requests per second?", category: "System Design", hint: "Consider Token Bucket / Leaky Bucket algorithms and Redis storing." },
    { id: 2, text: "Explain database indexing strategies and how B-Trees improve query lookup speeds.", category: "Databases", hint: "Discuss index overhead, composite indexes, and EXPLAIN query plans." },
    { id: 3, text: "How do you maintain data consistency across microservices without distributed transactions?", category: "Architecture", hint: "Mention Saga pattern, event-driven architecture, and two-phase commit trade-offs." },
    { id: 4, text: "What techniques do you use to prevent SQL Injection and XSS attacks in Node.js applications?", category: "Security", hint: "Mention parameterized queries, ORMs, content security policy (CSP), and input sanitization." },
    { id: 5, text: "Explain the Node.js Event Loop phases and how non-blocking I/O works under the hood.", category: "Node.js Core", hint: "Discuss libuv, microtask queue, macrotask queue, process.nextTick, and setImmediate." }
  ],
  fullstack: [
    { id: 1, text: "Walk through end-to-end authentication flow using JWTs vs Session Cookies, highlighting security implications.", category: "Auth & Security", hint: "Compare HttpOnly cookies, refresh token rotation, XSS, and CSRF protection." },
    { id: 2, text: "How do you design a real-time collaborative feature (like Google Docs) using WebSockets or SSE?", category: "Realtime Systems", hint: "Discuss Operational Transformation (OT) or CRDTs for conflict resolution." },
    { id: 3, text: "Explain how you structure global state management and caching across client and server.", category: "Architecture", hint: "Touch on React Query / RTK Query, server state vs UI state, and cache invalidation." },
    { id: 4, text: "How do you optimize an application that is slow both on initial load and during heavy API calls?", category: "Performance", hint: "Cover bundle splitting, CDN caching, database query optimization, and lazy loading." },
    { id: 5, text: "Describe your strategy for automated testing (Unit, Integration, End-to-End) in a CI/CD pipeline.", category: "DevOps & Quality", hint: "Explain testing pyramid balance, mock services, and deployment gates." }
  ],
  product: [
    { id: 1, text: "How do you prioritize features when sales, engineering, and users all demand different things?", category: "Prioritization", hint: "Mention frameworks like RICE, Kano model, MoSCoW, and business goals alignment." },
    { id: 2, text: "Define key metrics you would track for a SaaS product experiencing high user churn.", category: "Product Analytics", hint: "Discuss Retention curves, LTV/CAC ratio, active engagement metrics, and NPS." },
    { id: 3, text: "Describe a time a product launch failed or missed expectations. What did you learn?", category: "Leadership & Learning", hint: "Focus on root cause analysis, feedback loops, pivot strategies, and post-mortems." },
    { id: 4, text: "How do you balance technical debt reduction with shipping new user-facing features?", category: "Stakeholder Alignment", hint: "Discuss engineering capacity allocation, risk matrices, and ROI of refactoring." },
    { id: 5, text: "How do you conduct effective user research and translate qualitative feedback into product specifications?", category: "User Experience", hint: "Explain user personas, JTBD (Jobs to be Done), wireframing, and user stories." }
  ],
  data: [
    { id: 1, text: "Explain Window Functions in SQL (e.g., ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD) with a real scenario.", category: "Advanced SQL", hint: "Compare ranking behavior when ties occur and partitioned aggregations." },
    { id: 2, text: "How do you handle missing or noisy data in a large dataset before modeling or dashboard reporting?", category: "Data Cleaning", hint: "Discuss imputation techniques, outlier detection, and data lineage." },
    { id: 3, text: "What is the difference between Star Schema and Snowflake Schema in Data Warehousing?", category: "Data Architecture", hint: "Compare normalization level, query speed, JOIN complexity, and storage efficiency." },
    { id: 4, text: "How do you design an A/B test experiment and determine statistical significance?", category: "Experimentation", hint: "Touch on sample size calculation, p-values, confidence intervals, and bias prevention." },
    { id: 5, text: "Describe how you build scalable data pipelines for batch processing vs streaming data.", category: "Data Engineering", hint: "Compare ETL/ELT pipelines, Apache Spark vs Kafka, and monitoring data quality." }
  ]
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Interview Agent Server is running smoothly',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''
  });
});

// Endpoint: Generate Interview Questions
app.post('/api/questions', async (req, res) => {
  try {
    const { roleId, roleTitle, difficulty, count = 3 } = req.body;
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    console.log(`Generating ${count} questions for role=${roleTitle} (${difficulty})`);

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a Senior Technical Hiring Manager conducting a high-stakes job interview.
Generate exactly ${count} realistic, challenging, and role-specific interview questions for a "${roleTitle}" position at "${difficulty}" experience level.

Respond ONLY with a valid JSON array of objects, strictly in this format without markdown or extra commentary:
[
  {
    "id": 1,
    "text": "The actual question text",
    "category": "Category tag (e.g. Architecture, Debugging)",
    "hint": "Brief tip on what a stellar candidate answer should emphasize"
  }
]`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean markdown backticks if returned
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedQuestions = JSON.parse(cleanedText);

        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          return res.json({
            source: 'gemini-ai',
            roleTitle,
            difficulty,
            questions: parsedQuestions
          });
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed, falling back to curated question bank:', aiErr.message);
      }
    }

    // Fallback response
    const roleFallback = FALLBACK_QUESTIONS[roleId] || FALLBACK_QUESTIONS.frontend;
    const selectedQuestions = roleFallback.slice(0, Number(count));

    return res.json({
      source: 'fallback-bank',
      roleTitle,
      difficulty,
      questions: selectedQuestions
    });

  } catch (error) {
    console.error('Error in /api/questions:', error);
    res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server listening on http://127.0.0.1:${PORT}`);
});
