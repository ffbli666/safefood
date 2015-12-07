module.exports = function(db) {
    return new food(db);
};

function food (db) {
    var create = function(data, myCallback) {
        var date = new Date();
        var cdata = {
            name: data.name,
            company: data.company,
            barcode: data.barcode,
            description: data.description,
            hyperlinks: data.hyperlinks,
            deleted: false,
            create_time: date,
            update_time: date
        };

        db.create({
            index: config.database.index,
            type: 'food',
            body: cdata
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            get(response._id, myCallback);
        });
    };

    var update = function(id, data, myCallback) {
        var cdata = {
            name: data.name,
            company: data.company,
            barcode: data.barcode,
            description: data.description,
            hyperlinks: data.hyperlinks,
            update_time: new Date()
        };

        db.update({
            index: config.database.index,
            type: 'food',
            id: id,
            body: {doc: cdata}
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            get(id, myCallback);
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

        console.log(condition);
        db.search({
            index: config.database.index,
            type: 'food',
            body: condition
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
        return {
            id: element._id,
            name: element._source.name,
            company: element._source.company,
            barcode: element._source.barcode,
            description: element._source.description,
            hyperlinks: element._source.hyperlinks,
            create_time: element._source.create_time,
            update_time: element._source.update_time
        };
    };

    var get = function(id, myCallback) {
        db.get({
            index: config.database.index,
            type: 'food',
            id: id
        }, function (error, response) {
            if (error) {
                myCallback(error);
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
            index: config.database.index,
            type: 'food',
            id: id,
            body: {doc: cdata}
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
        create: create,
        update: update,
        get: get,
        search: search,
        del: del
    };
};
