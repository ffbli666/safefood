var elasticsearch = require('elasticsearch');

exports.start = function (config) {
    return elasticsearch.Client({
        host: config.host + ":" + config.port,
        log: 'trace'
    });
};