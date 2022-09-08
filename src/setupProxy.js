const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware(["/", "/document", "/document/upload", "/document/dialogflow/add"], { target: "https://vwnepal-backend.herokuapp.com" })
    );
};