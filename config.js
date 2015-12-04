module.exports = function(app) {
    return {
        server: {
            port: 8888
        },
        database: {
            driver   : 'elasticsearch',
            host     : '192.168.10.10',
            port     : '9200',
            index    : 'safefood',
        },
    };
};