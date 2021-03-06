module.exports = (app, repositories, logger) => {
    const loadPaymentsController = require('./PaymentsController')
    app.use("/api/payment-methods", loadPaymentsController(repositories, logger))

    const loadSystemHealthController = require('./SystemHealthController');
    app.use("/system", loadSystemHealthController());
}

