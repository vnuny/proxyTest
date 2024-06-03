const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Define a proxy route to fetch website HTML
app.use('/getWebsiteHTML', createProxyMiddleware({ 
  target: 'https://cdn43.t4ce4ma.shop/',
  changeOrigin: true,
  pathRewrite: {
    '^/getWebsiteHTML': '/',
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Request:');
    let htmlData = '';
    proxyRes.on('data', (chunk) => {
      htmlData += chunk;
    });
    proxyRes.on('end', () => {
      console.log('HTML Content:', htmlData);
    });
  }
}));

// Start the server
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});