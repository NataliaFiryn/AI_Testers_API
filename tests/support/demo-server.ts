import { createServer } from 'node:http';

const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');

  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200);
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3100, '127.0.0.1');
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
