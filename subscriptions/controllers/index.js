module.exports = (app, repositories, logger) => {
    const loadSubscriptionsController = require('./SubscriptionsController')
    app.use("/api/subscriptions", loadSubscriptionsController(repositories, logger))

    const loadSystemHealthController = require('./SystemHealthController')
    app.use("/system", loadSystemHealthController())
}

