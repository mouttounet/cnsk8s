class SystemHealthController {

    async handleLiveness(req, res) {
        res.send({
            "serviceName": "subscription",
            "status": true
        } );
    }

    async handleReadiness(req, res) {
        res.send({
            "serviceName": "subscription",
            "status": true
        });
    }

}

//
// Export system health controller REST API
//
module.exports = (repositories) => {
    const controller = new SystemHealthController();
    const express = require('express');
    const router = express.Router();

    router.get('/liveness', function(req, res) {
       controller.handleLiveness(req, res);
    });
    router.get('/readiness', function(req, res) {
        controller.handleReadiness(req, res);
    });

    return router;
};
