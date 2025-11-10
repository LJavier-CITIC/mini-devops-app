const express = require('express');
const client = require('prom-client');

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'route', 'status']
});

app.get('/', (req, res) => {
  requestCounter.inc({ method: req.method, route: '/', status: 200 });
  res.send('Hola Luis , tu mini app DevOps está corriendo!');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App escuchando en puerto ${port}`);
});