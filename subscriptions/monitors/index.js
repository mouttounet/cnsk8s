
module.exports = (app, logger) => {
    const loadSnsPromClient = require('./SnsPromClient');
    app.use("/metrics", loadSnsPromClient(app, logger));
};
