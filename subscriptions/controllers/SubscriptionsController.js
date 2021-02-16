const v = require('./Validation')
const domain = require('../domain/Subscription')

class SubscriptionsController {
    constructor(subscriptionRepository, logger) {
        this.subscriptionRepository = subscriptionRepository
        this.logger = logger
    }

    async handleGetSubscription(req, res) {
        const subscriptionData = await this.subscriptionRepository.getSubscription();
        let result;

        if (Object.entries(subscriptionData).length === 0) {
            res.status(404);
            result = { "error": "subscription not found" };
        } else {
             result = this.transformToApiFormat(subscriptionData);
        }

        res.send(result);
    }

    async handleAddSubscription(req, res) {
        const subscription = this.transformToDomainFormat(req.body);

        if (subscription.error) {
            res.status(400);
            res.send(subscription.errors);
            return
        }

        await subscription.subscription.process(subscription.subscription);
        await this.subscriptionRepository.addOrReplaceSubscription(subscription.subscription);
        const result = this.transformToApiFormat(subscription.subscription);
        res.send(result);
    }

    async handleCancelSubscription(req, res) {
        const subscriptionData = await this.subscriptionRepository.getSubscription();
        await subscriptionData.cancel();
        await this.subscriptionRepository.removeSubscription();

        // Return 204 "no content"
        res.status(204);
        res.send();
    }

    transformToDomainFormat(body) {
        const {product, monthsPurchased} = body;
        const subscriptionErrors = v.validateSubscription(product, monthsPurchased);
        let foundError = false;

        if(subscriptionErrors.length > 0) {
            this.logger.error(`Card validation errors: ${subscriptionErrors}`);
            foundError = true
        }

        if(foundError) {
            return {
                "error": true,
                "errors": {
                    "subscription": subscriptionErrors
                }
            }
        }

        const subscription = new domain.Subscription(product, monthsPurchased);

        return {
            "error": false,
            "subscription": subscription
        }
    }    

    transformToApiFormat(subscription) {
        return {
            "product": subscription.product,
            "monthsPurchased": subscription.monthsPurchased,
            "status": subscription.status,
            "datePurchased": subscription.datePurchased,
            "dateExpires": subscription.dateExpires
        }
    }
}

module.exports = (repositories, logger) => {

    const controller = new SubscriptionsController(repositories.subscriptionsRepository, logger);
    const express = require('express');
    const router = express.Router();

    router.get('/', function (req, res) {
        controller.handleGetSubscription(req, res)
    });

    router.post('/', function (req, res) {
        controller.handleAddSubscription(req, res)
    });

    router.delete('/', function (req, res) {
        controller.handleCancelSubscription(req, res)
    });

    return router;
};