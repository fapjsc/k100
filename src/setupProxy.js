const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/j",
    createProxyMiddleware({
      target: "https://demo.k100u.com",
      //   target: window.location.hostname,
      changeOrigin: true,
    })
  );
};
