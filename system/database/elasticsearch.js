var elasticsearch = require('elasticsearch');

exports.start = function (config) {
    var search = elasticsearch.Client({
        host: config.host + ":" + config.port,
        log: 'trace'
    });
    return search;
};