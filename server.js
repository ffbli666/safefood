var express = require('express');
var bodyParser = require('body-parser');
var nunjucks  = require('nunjucks');

exports.start = function (config) {
    var app = express();
    //var env = process.env.NODE_ENV || 'development';
    console.log("Environment: " + config.environment);
    if (config.environment == 'staging') {
        nunjucks.configure('views', {
            autoescape: true,
            express: app,
            noCache: true
        });
    }
    else {
        nunjucks.configure('views', {
            autoescape: true,
            express: app
        });
    }

    app.use(function(req, res, next){
        console.log('%s %s', req.method, req.url);
        next();
    });

    app.use(bodyParser.json({type: 'application/json'}));
    app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', extended:false}));
    app.use(express.static( __dirname + '/public'));

    require('./router')(app);

    var server = app.listen(config.port, function() {
        console.log('Listening on port %d', server.address().port);
    });
}
