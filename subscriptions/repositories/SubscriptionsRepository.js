const domain = require('../domain/Subscription')
const subscriptionKey = "subscription";

class SubscriptionsRepository {
    constructor(client) {
        this.client = client
    }

    async addOrReplaceSubscription(subscription) {
        let len = await this.client.hlen(subscriptionKey);

        if (len > 0) {
            await this.removeSubscription();
        }

        const data = this.transformToRepositoryFormat(subscription);
        await this.client.hmset(subscriptionKey, data);
    }

    async getSubscription() {
        let len = await this.client.hlen(subscriptionKey);
        let result;

        if (len <= 0) {
            result = {}
        } else {
            const data = await this.client.hgetall(subscriptionKey);
            result = this.transformToDomainFormat(data);
        }

        return result;
    }

    async removeSubscription() {
        let len = await this.client.hlen(subscriptionKey);
        if (len > 0) {
            let fields = await this.client.hkeys(subscriptionKey);
            return await this.client.hdel(subscriptionKey, fields);
        }
    }

    transformToRepositoryFormat(subscription) {

        return {
            "product": subscription.product,
            "monthsPurchased": subscription.monthsPurchased,
            "status": subscription.status,
            "datePurchased": subscription.datePurchased
        }
    }

    transformToDomainFormat(data) {

        const {product, monthsPurchased, datePurchased, status} = data;

        return new domain.Subscription(product, monthsPurchased, datePurchased, status)
    }
}

module.exports = (client) => new SubscriptionsRepository(client);
