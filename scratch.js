const http = require('http');

const data = JSON.stringify({
  slug: "test-slug-123",
  name: "Test Event",
  dateISO: "2026-05-10",
  city: "Test City",
  shortDescription: "A short description for testing",
  status: "upcoming"
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/events',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
