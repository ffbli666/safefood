var foodModel  = require('../models/food')(database);

exports.create = function(req, res) {
    console.log("create");
    //console.log(req.body);
    foodModel.create(req.body, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    });
};

exports.update = function(req, res) {
    console.log("update");
    foodModel.update(req.params.id, req.body, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    })
};

exports.get = function(req, res) {
    foodModel.get(req.params.id, function(err, response) {
        if (err) {
            res.status(404).json({status:404, msg:err});
            return;
        }

        res.json({status:200, msg:'ok', result: response});
    })
};

exports.search = function(req, res) {
    console.log(req.query);
    foodModel.search(req.query, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    })
};

exports.del = function(req, res) {
    foodModel.del(req.params.id, function(err, response) {
        if (err) {
            res.status(400).json({status:400, msg:err});
            return;
        }
        res.json({status:200, msg:'ok', result: response});
    })
};