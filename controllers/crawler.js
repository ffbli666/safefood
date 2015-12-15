var crawlerModel  = require('../models/crawler')();

exports.get = function(req, res) {
    crawlerModel.get(req.query.url, function(err, data) {
        if (err) {
            res.json({status:400, msg:err, result:{url:req.query.url, reqURL:reqURL}});
            return;
        }
        res.json({status:200, msg:'ok', result: data});
    });
};
