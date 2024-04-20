const http = require('http');

// Configuración del servidor HTTP
const server = http.createServer((req, res) => {
  // Manejador de solicitudes
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola, este es un nodo en Node.js\n');
  } else {
    res.statusCode = 404;
    res.end('Ruta no encontrada\n');
  }
});

// Iniciar el servidor
const port = 3000;
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
