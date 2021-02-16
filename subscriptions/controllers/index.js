module.exports = (app, repositories, logger) => {
    const loadPaymentsController = require('./SubscriptionsController')
    app.use("/api/subscriptions", loadPaymentsController(repositories, logger))

    const loadSystemHealthController = require('./SystemHealthController')
    app.use("/system", loadSystemHealthController())
}

