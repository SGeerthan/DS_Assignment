const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const cors = require('cors');
app.use(cors());

app.use('/api/todos', createProxyMiddleware({
  target: 'http://todo-service:5000',
  changeOrigin: true,
}));

app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:5001',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Auth Service Error:', err.message);
    res.status(503).json({ error: 'Auth service is unavailable' });
  }
}));

app.get('/work', (req, res) => res.send('Working'));    

app.listen(8080, () => {
  console.log('API Gateway running on port 8080');
});
