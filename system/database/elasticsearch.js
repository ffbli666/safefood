var elasticsearch = require('elasticsearch');

exports.start = function (config) {
    var log;
    if (config.server.environment == 'staging') {
        log = {
            type: 'file',
            level: 'trace',
            path: './log/elasticsearch.log'
        }
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