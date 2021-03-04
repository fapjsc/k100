const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy({
            target: 'http://10.168.192.1:3000',
            changeOrigin: true,
        })
    );
};
