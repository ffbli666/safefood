var moment = require('moment');
var fs = require("fs");
var htmlFilter = require('../system/libs/html-filter');

module.exports = function(db) {
    return new food(db);
};

function food (db) {
    var saveImage = function (imageData, fileName) {
        var base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, "");
        fs.writeFileSync(fileName, base64Data, 'base64');
    };

    var create = function(data, myCallback) {
        var date = new Date();
        var cdata = {
            deleted     : false,
            create_time : date,
            update_time : date
        };

        db.create({
            index : config.database.index,
            type  : 'food',
            body  : cdata
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            update(response._id, data, myCallback);
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
            var name = htmlFilter(data.name);
            var company = htmlFilter(data.company);
            var barcode = htmlFilter(data.barcode);
            var description = htmlFilter(data.description);
            if (!name || !company || !description) {
                myCallback("需要填寫食品名稱、公司名稱、原因");
                return;
            }
            var cdata = {
                name        : name,
                company     : company,
                barcode     : barcode,
                description : description,
                hyperlinks  : [],
                update_time : new Date()
            };

            data.hyperlinks.forEach(function(element, index, array) {
                var url = htmlFilter(element.url);
                cdata.hyperlinks.push({
                    url   : url,
                    title : htmlFilter(element.title),
                    brief : htmlFilter(element.brief)
                });
            });

            if (data.image && data.image != "") {
                var imageName = response.id + ".jpg";
                saveImage(data.image, "./public/upload/" + imageName);
                cdata.image = "/upload/" + imageName;
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
