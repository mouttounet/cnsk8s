const axios = require('axios').default;
const moment = require('moment');
const logger = require('pino')();
const config = require("../config")();

const pricePerMonth = config.pricePerMonth;
const paymentUrl = `${config.paymentUrlBase}/api/payment-methods/process`;

class Subscription {

    constructor(product, monthsPurchased, datePurchased = moment.utc().toISOString(), status = "pending") {
        this.product = product,
        this.monthsPurchased = monthsPurchased,
        this.datePurchasedInternal = moment(datePurchased)
        this.status = status
    }

    get datePurchased() {
        return this.datePurchasedInternal.toISOString()
    }

    get subscriptionEndDate() {
        return this.datePurchasedInternal.clone().add(this.monthsPurchased, 'months')
    }

    get dateExpires() {
        return this.subscriptionEndDate.toISOString()
    }

    get isActive() {
        
        if(!this.status || this.status !== "active") {
            return false
        }

        return this.datePurchasedInternal.isBefore(moment.utc())
    }


    get activeMonthsRemaining() {

        if(!this.isActive) {
            return 0
        }

        const diff = moment.duration(this.subscriptionEndDate.diff(moment.utc()));
        const months = diff.asMonths();

        if(months <= 0) {
            return 0
        }

        return months
    }

    async process(originalSubscription) {

        const currentMonths = this.monthsPurchased;
        let originalMonths = 0;

        if(originalSubscription != null && originalSubscription.isActive) {
            originalMonths = originalSubscription.monthsPurchased
        }

        const diff = currentMonths - originalMonths;

        if(diff === 0) {
            this.status = "active";
            return
        }

        if(diff < 0) {
            await this.processRefund(diff * -1 * pricePerMonth)
        } else {
            await this.processPayment(diff * pricePerMonth)
        }

        this.status = "active"
    }


    async cancel() {

        if(!this.isActive) {
            logger.info("Subscription is not active. Not cancelling.");
            return
        }

        const amount = this.activeMonthsRemaining * pricePerMonth;

        if(amount > 0) {
            logger.info(`Refunding: ${amount}`);
            await this.processRefund(amount)
        } else {
            logger.info("No refund.")
        }

        this.status = "cancelled"
    }


    async processPayment(amount) {
        const paymentBody = {
            "amount": amount,
            "type": "payment"
        };

        // Call payment service to make a payment.
        axios.post(paymentUrl, paymentBody)
            .then(response => {
                console.log(`Payment call response:  ${response}`);
            })
            .catch(error => {
                console.log(error);
            });
    }


    async processRefund(amount) {
        const refundBody = {
            "amount": amount,
            "type": "refund"
        };

        // Call the payment service to process the refund.
        axios.post(paymentUrl, refundBody)
            .then(response => {
                console.log(`Payment call response:  ${response}`);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = {
    Subscription
};
