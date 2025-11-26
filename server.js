import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname);

// Validate environment
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('[Server] Invalid PORT:', process.env.PORT);
  process.exit(1);
}

if (!fs.existsSync(DIST_DIR)) {
  console.error('[Server] DIST directory not found:', DIST_DIR);
  process.exit(1);
}

console.log('[Server] Starting...');
console.log('[Server] PORT:', PORT);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self'; connect-src 'self' https:;"
};

const server = http.createServer((req, res) => {
  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Health check - verify app is actually functional
  if (req.url === '/health') {
    fs.access(path.join(DIST_DIR, 'index.html'), fs.constants.R_OK, (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Service Unavailable');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');
    });
    return;
  }

  // Safely resolve requested path
  const requestPath = req.url === '/' ? 'index.html' : req.url;
  let filePath;
  try {
    filePath = path.resolve(path.join(DIST_DIR, requestPath));
    // Prevent path traversal: ensure resolved path is within DIST_DIR
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  const extname = path.extname(filePath).toLowerCase();

  // Try to serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found and not a static asset, serve index.html (SPA fallback)
      if (err.code === 'ENOENT' && !extname) {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error: index.html not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    } else {
      const contentType = mimeTypes[extname] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[Server] Listening on port', PORT);
  console.log('[Server] Ready to accept requests');
});

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[Server] Closed');
    process.exit(0);
  });
  // Force exit after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err.message, err.stack);
  process.exit(1);
});
