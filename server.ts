import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';

// Middleware for parsing JSON and form bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Route Handlers
app.all('/api/health', async (req, res) => {
  try {
    const { default: handler } = await import('./api/health');
    return await handler(req, res);
  } catch (error) {
    console.error('[API] /api/health error:', error);
    return res.status(500).json({ success: false, error: 'Internal API Server Error' });
  }
});

app.all('/api/enquiry', async (req, res) => {
  try {
    const { default: handler } = await import('./api/enquiry');
    return await handler(req, res);
  } catch (error) {
    console.error('[API] /api/enquiry error:', error);
    return res.status(500).json({ success: false, error: 'Internal API Server Error' });
  }
});

app.all('/api/rfq', async (req, res) => {
  try {
    const { default: handler } = await import('./api/rfq');
    return await handler(req, res);
  } catch (error) {
    console.error('[API] /api/rfq error:', error);
    return res.status(500).json({ success: false, error: 'Internal API Server Error' });
  }
});

app.all('/api/callback', async (req, res) => {
  try {
    const { default: handler } = await import('./api/callback');
    return await handler(req, res);
  } catch (error) {
    console.error('[API] /api/callback error:', error);
    return res.status(500).json({ success: false, error: 'Internal API Server Error' });
  }
});

app.all('/api/chat', async (req, res) => {
  try {
    const { default: handler } = await import('./api/chat');
    return await handler(req, res);
  } catch (error) {
    console.error('[API] /api/chat error:', error);
    return res.status(500).json({ success: false, error: 'Internal API Server Error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host,
        port,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, host, () => {
    console.log(`Rajdeep Enterprises server running on http://${host}:${port}`);
  });
}

startServer();
