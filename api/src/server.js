import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dealsRouter from './routes/deals.js';
import placesRouter from './routes/places.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/deals', dealsRouter);
app.use('/api/places', placesRouter);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Happy Hunt API listening on http://localhost:${port}`);
});
