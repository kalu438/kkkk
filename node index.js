const http = require('http');

// Configuración del servidor HTTP
const server = http.createServer((req, res) => {
  // Manejador de solicitudes
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola, este es un nodo en Node.js\n');
  } else if (req.url === '/api/datos') {
    // Simulación de datos
    let datos = [
  {
    id: 1,
    temperatura: 25,
    humedad: 60,
    ubicacion: 'Ciudad de México'
  }
];

// Credenciales de autenticación
const credenciales = {
  username: 'usuario',
  password: 'contraseña'
};

// Middleware de autenticación
const authenticateMiddleware = (req, res, next) => {
  const credentials = auth(req);

  if (!credentials || credentials.name !== credenciales.username || credentials.pass !== credenciales.password) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Acceso restringido"');
    res.end('Acceso no autorizado');
  } else {
    next();
  }
};

// Configuración del servidor HTTP
const server = http.createServer((req, res) => {
  // Rutas públicas
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola, este es un nodo en Node.js\n');
  } else {
    // Rutas protegidas
    authenticateMiddleware(req, res, () => {
      if (req.url === '/api/datos') {
        // Simulación de datos
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(datos));
      } else if (req.url.match(/\/api\/datos\/\d+/) && req.method === 'PUT') {
        // Manejo de solicitudes PUT
        const id = parseInt(req.url.split('/')[3], 10);
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const nuevosDatos = JSON.parse(body);
          const indice = datos.findIndex((dato) => dato.id === id);
          if (indice !== -1) {
            datos[indice] = { id, ...nuevosDatos };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(datos[indice]));
          } else {
            res.statusCode = 404;
            res.end('Dato no encontrado\n');
          }
        });
      } else if (req.url.match(/\/api\/datos\/\d+/) && req.method === 'DELETE') {
        // Manejo de solicitudes DELETE
        const id = parseInt(req.url.split('/')[3], 10);
        const indice = datos.findIndex((dato) => dato.id === id);
        if (indice !== -1) {
          const datoEliminado = datos.splice(indice, 1)[0];
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(datoEliminado));
        } else {
          res.statusCode = 404;
          res.end('Dato no encontrado\n');
        }
      } else if (req.url === '/api/datos' && req.method === 'POST') {
        // Manejo de solicitudes POST
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const nuevosDatos = JSON.parse(body);
          nuevosDatos.id = datos.length + 1;
          datos.push(nuevosDatos);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(nuevosDatos));
        });
      } else {
        res.statusCode = 404;
        res.end('Ruta no encontrada\n');
      }
    });
  }
});

// Iniciar el servidor
const port = 3000;
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
