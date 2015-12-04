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

    var search = function(data, myCallback) {
        var cdata = {};

        db.search({
            index: config.database.index,
            type: 'food',
            body: cdata
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            myCallback(null, response);
        });
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

            var result = {
                id: response._id,
                name: response._source.name,
                company: response._source.company,
                barcode: response._source.barcode,
                description: response._source.description,
                hyperlinks: response._source.hyperlinks,
                create_time: response._source.create_time,
                update_time: response._source.update_time
            };
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
            body: cdata
        }, function (error, response) {
            if (error) {
                myCallback(error);
                return;
            }
            myCallback(null, response);
        });
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
    }

    return {
        create: create,
        update: update,
        get: get,
        search: search,
        del: del
    };
};
