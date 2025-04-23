const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const cors = require('cors');
app.use(cors());

app.use('/api/todos', createProxyMiddleware({
  target: 'http://todo-service:5000',
  changeOrigin: true,
}));

app.get('/work', (req, res) => res.send('Working'));    

app.listen(8080, () => {
  console.log('API Gateway running on port 8080');
});
