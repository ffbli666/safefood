var foodModel  = require('../models/food')(database);

exports.create = function(req, res) {
    console.log("create");
    //console.log(req.body);
    foodModel.create(req.body, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:'error', result: err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    });
};

exports.update = function(req, res) {
    console.log("update");
    foodModel.update(req.params.id, req.body, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:'error', result: err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    })
};

exports.get = function(req, res) {
    foodModel.get(req.params.id, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:'error', result: err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    })
};

exports.search = function(req, res) {
    //console.log(req.body);
    //foodModel.create(req.body)
    res.json({status:200, msg:'ok', result: req.body});
};