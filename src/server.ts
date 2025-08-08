import express from 'express';
import cors from 'cors';
import { searchRouter } from './routes/search.route';
import { detailsRouter } from './routes/details.route';
import { episodesRouter } from './routes/episodes.route';
import { homepageRouter } from './routes/homepage.route';
import { streamRouter } from './routes/stream.route';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRouter);
app.use('/api/anime', detailsRouter);
app.use('/api/episodes', episodesRouter);
app.use('/api/home', homepageRouter);
app.use('/api/stream', streamRouter);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'HiAnime API is running 🚀',
    endpoints: {
      search: 'GET /api/search (Example: /api/search?keyword=naruto&page=1)',
      details: 'GET /api/anime/{id}',
      episodes: 'GET /api/episodes/{id}',
      home: 'GET /api/home',
      stream: 'GET /api/stream/{episodeId}/{language} (language: sub|dub, optional)'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅  HiAnime API server listening on http://localhost:${PORT}`);
});
