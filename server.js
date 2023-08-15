const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/installpackage') {
      const filepath = path.join(__dirname, 'package.js');
      fs.readFile(filepath, 'utf-8', (err, content) => {
        if (err) {
          console.error('Error occurred:', err);
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Internal Server Error: Could not read the file.');
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/javascript',
            'Content-Disposition': 'attachment; filename="package.js"'
          });
          res.end(content);
        }
      });
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not Found');
    }
  } else {
    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end('Method Not Allowed');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
