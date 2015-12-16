var moment = require('moment');
var fs = require("fs");
var htmlFilter = require('../system/libs/html-filter');
var validator = require('validator');

module.exports = function(db) {
    return new food(db);
};

function food (db) {
    var saveImage = function (imageData, fileName) {
        var ext = (imageData.indexOf("png") > 0) ? ".png" : ".jpg";
        var newName = fileName + ext;
        var base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, "");
        fs.writeFileSync(newName, base64Data, 'base64');
        return newName;
    };

    var dataValidator = function (data) {
        var name = htmlFilter(data.name);
        var company = htmlFilter(data.company);
        var barcode = htmlFilter(data.barcode);
        var description = htmlFilter(data.description);
        if (!name || !company || !description) {
            return {
                valid : false,
                msg   : "需要填寫食品名稱、公司名稱、原因"
            };
        }
        var cdata = {
            name        : name,
            company     : company,
            barcode     : barcode,
            description : description,
            hyperlinks  : []
        };
        data.hyperlinks.forEach(function(element, index, array) {
            var url = htmlFilter(element.url);
            if (!url) {
                return;
            }
            if (!validator.isURL(url)) {
                return;
            }
            cdata.hyperlinks.push({
                url   : url,
                title : htmlFilter(element.title),
                brief : htmlFilter(element.brief)
            });
        });

        return {
            valid  : true,
            data : cdata
        };
    };

    var create = function(data, myCallback) {
        var date = new Date();
        var result = dataValidator(data);
        if (!result.valid) {
            myCallback(result.msg);
            return
        };
        var cdata = result.data;
        cdata.deleted     = false;
        cdata.create_time = date;
        cdata.update_time = date;

        db.create({
            index : config.database.index,
            type  : 'food',
            body  : cdata
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            var id = response._id;
            // save image
            if (data.image && data.image != "") {
                var name = saveImage(data.image, "./public/upload/" + id);
                db.update({
                    index : config.database.index,
                    type  : 'food',
                    id    : id,
                    body  : {
                        doc: {
                            image: name.replace(/^\.\/public/, "")
                        }
                    }
                }, function (error, response) {
                    if (error) {
                        myCallback(error);
                        return;
                    }
                    get(id, myCallback);
                });
            } else {
                get(id, myCallback);
            }
        });
    };

    var update = function(id, data, myCallback) {
        get(id, function(error, response) {
            if (error) {
                myCallback(error);
                return;
            }

            if (!response.id) {
                myCallback(error);
                return;
            }
            var result = dataValidator(data);
            if (!result.valid) {
                myCallback(result.msg);
                return
            };
            var cdata = result.data;
            cdata.update_time = new Date();

            if (data.image && data.image != "") {
                var name = saveImage(data.image, "./public/upload/" + response.id);
                cdata.image = name.replace(/^\.\/public/, "");
            }

            db.update({
                index : config.database.index,
                type  : 'food',
                id    : id,
                body  : {doc: cdata}
            }, function (error, response) {
                if (error) {
                    myCallback(error);
                    return;
                }
                get(id, myCallback);
            });
        });
    };

    var search = function(query, myCallback) {
        var condition = {
            query: {
                bool: {
                }
            },
            filter: {
                term: {
                    deleted : false
                }
            },
            sort: {
                update_time: {
                    order: 'desc'
                }
            },
            size: 10,
            from: 0
        };

        if (query.q) {
            condition.query.bool.should = [
                {match: {name   : query.q}},
                {match: {company: query.q}},
                {match: {barcode: query.q}}
            ];
        }

        if (query.size) {
            condition.size = query.size;
        }

        if (query.from) {
            condition.from = query.from;
        }

        db.search({
            index : config.database.index,
            type  : 'food',
            body  : condition
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            var list = listFormat(response);
            myCallback(null, list);
        });
    };

    var listFormat = function(response) {
        var result = {
            total: response.hits.total,
            list:[]
        };
        response.hits.hits.forEach(function(element, index, array) {
            var data = dataFormat(element);
            result.list.push(data);
        })
        return result;
    };

    var dataFormat = function(element) {
        var create = moment(element._source.create_time).format("YYYY-MM-DD HH:mm:ss");
        var update = moment(element._source.update_time).format("YYYY-MM-DD HH:mm:ss");
        return {
            id          : element._id,
            name        : element._source.name,
            company     : element._source.company,
            barcode     : element._source.barcode,
            description : element._source.description,
            image       : element._source.image,
            hyperlinks  : element._source.hyperlinks,
            create_time : create,
            update_time : update,
        };
    };

    var get = function(id, myCallback) {
        db.get({
            index : config.database.index,
            type  : 'food',
            id    : id
        }, function (error, response) {
            if (error) {
                if (error.status == "404") {
                    myCallback("Not Found");
                    return;
                }
                myCallback(error);
                return;
            }
            if (response._source.deleted == true) {
                myCallback("Not Found");
                return;
            }
            var result = dataFormat(response);
            myCallback(null, result);
        });
    };

    var del = function(id, myCallback) {
        var cdata = {deleted: true};
        //soft delete
        db.update({
            index : config.database.index,
            type  : 'food',
            id    : id,
            body  : {doc: cdata}
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            myCallback(null, {id: id});
        });
        // real delete
        // client.delete({
        //     index: config.database.index,
        //     type: 'food',
        //     id: id
        // }, function (error, response) {
        //     if (err) {
        //         myCallback(err);
        //         return;
        //     }
        //     myCallback(null, result);
        // });
    };

    return {
        create  : create,
        update  : update,
        get     : get,
        search  : search,
        del     : del
    };
};
