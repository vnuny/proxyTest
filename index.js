const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const app = express();

app.use('/getWebsiteHTML', createProxyMiddleware({ 
    target: 'https://cdn43.t4ce4ma.shop/',
    changeOrigin: true,
    pathRewrite: {
      '^/getWebsiteHTML': '/',
    },
    selfHandleResponse: true, // Ensure self handle response is set to true
    on: {
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        if (!responseBuffer) {
          console.error('Response buffer is undefined');
          res.status(500).send('Internal Server Error');
          return;
        }
        
        let htmlData = responseBuffer.toString('utf8');
        console.log('HTML Content:', htmlData);
        res.setHeader('Content-Type', 'text/html'); // Set Content-Type header
        res.send(htmlData); // Send the response to the client
      }),
      error: (err, req, res) => {
        console.error(err);
        res.status(500).send('Proxy Error'); // Send an error response to the client
      },
    },
}));

// Start the server
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
