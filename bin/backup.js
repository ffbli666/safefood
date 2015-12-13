#!/usr/bin/env node
var async    = require("async");
var config   = require("../config")();
var spawn    = require("child_process").spawn;
var fs       = require("fs");
var archiver = require("archiver");
var moment   = require("moment");

var log = function(str) {
    console.log((new Date).toString() + ": " + str);
};


log("backup starting");
async.waterfall([
        function(callback) {
            //dump elasticsearch mapping
            log("dump elasticsearch mapping starting");
            var elasticdump = spawn("../node_modules/elasticdump/bin/elasticdump",
                        ["--input=http://" + config.database.host + ":" + config.database.port + "/safefood" ,
                         "--output="+ __dirname + "/../backup/elasticsearch/safefood_mapping.json",
                         "--type=mapping"]);
            elasticdump.stdout.on("data", function (data) {
                log("" + data);
            });
            elasticdump.stderr.on("data", function (data) {
                log("" + data);
            });
            elasticdump.on("close", function (code) {
                if (code !== 0) {
                    callback("dump elasticsearch mapping error code: " + code);
                    return;
                }
                log("dump elasticsearch mapping end");
                callback(null);
            });
        },
        function(callback) {
            //dump elasticsearch data
            log("dump elasticsearch data starting");
            var elasticdump = spawn("../node_modules/elasticdump/bin/elasticdump",
                                    ["--input=http://" + config.database.host + ":" + config.database.port + "/safefood"  ,
                                     "--output=" + __dirname + "/../backup/elasticsearch/safefood_index.json",
                                     "--type=data"]);
            elasticdump.stdout.on("data", function (data) {
                log("" + data);
            });
            elasticdump.stderr.on("data", function (data) {
                log("" + data);
            });
            elasticdump.on("close", function (code) {
                if (code !== 0) {
                    callback("dump elasticsearch data error code: " + code);
                    return;
                }
                log("dump elasticsearch data end");
                callback(null);
            });
        },
        function(callback) {
            log("zip starting");
            var date = moment(new Date()).format("YYYY-MM-DD");
            var dest_filename = "backup_" + date+ ".zip";
            var output = fs.createWriteStream(__dirname + "/../backup/" + dest_filename);
            var archive = archiver("zip");

            output.on("close", function() {
                log(archive.pointer() + " total bytes");
                log("archiver has been finalized and the output file descriptor has closed.");
                log("zip end");
                //copy
                fs.createReadStream(__dirname + "/../backup/" + dest_filename)
                    .pipe(fs.createWriteStream(__dirname + "/../public/download/backup.zip"));
                callback(null);
            });

            archive.on("error", function(err) {
                throw err;
            });

            archive.pipe(output);

            archive
                .directory(__dirname + "/../backup/elasticsearch", "./elasticsearch")
                .directory(__dirname + "/../public/upload", "./upload")
                .finalize();
        },
    ], function (err, result) {
        if (err) {
            log(err);
            return;
        }
        log("backup end");
    });