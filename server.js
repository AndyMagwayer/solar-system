import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve static assets from root directory
app.use(express.static(__dirname));

// Serve jquery from node_modules if needed
app.use('/vendor/jquery', express.static(join(__dirname, 'node_modules/jquery/dist')));

// Fallback to index.html for SPA / static routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(Number(PORT), HOST, () => {
  console.log(`Solar System server running at http://${HOST}:${PORT}`);
});
