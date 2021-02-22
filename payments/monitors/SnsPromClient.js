const promClient = require('prom-client');
const Counter = promClient.Counter;
const register = promClient.register;

snsPaymentsApiCallCounter = new Counter({
    name: 'snsPaymentsApiCallCounter',
    help: 'Payments API calls counter, grouped by HTTP method',
    labelNames: ['method']
});

class SnsPromClient {
     requestCounters(req, res, next) {
        if (req.path !== '/metrics') {
            snsPaymentsApiCallCounter.inc({ method: req.method });
        }
        next();
    };

    async handleGetMetrics(req, res) {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    }
}

module.exports = (app, logger) => {
    const snsPromClient = new SnsPromClient();
    const express = require('express');
    const router = express.Router();

    promClient.collectDefaultMetrics( );
    app.use(snsPromClient.requestCounters);

    router.get('/', function(req, res) {
        snsPromClient.handleGetMetrics(req, res);
    });

    return router;
};
