module.exports = function(app) {
    return {
        server: {
            environment: 'staging', // staging or production
            port: 8888,
            post_json_limit: '1mb'
        },
        database: {
            driver   : 'elasticsearch',
            host     : '192.168.10.10',
            port     : '9200',
            index    : 'safefood',
        },
    };
};