var elasticsearch = require('elasticsearch');

exports.start = function (config) {
    var log;
    if (config.server.environment == 'staging') {
        log = 'trace'
    }
    else {
        log = {
            type: 'file',
            level: 'error',
            path: './log/elasticsearch.log'
        }
    }
    return search = elasticsearch.Client({
            host: config.database.host + ":" + config.database.port,
            log: log
    });
};