var jsdom = require('jsdom');
var url   = require("url");

exports.get = function(req, res) {
    var u = url.parse(req.query.url);
    var reqURL = u.protocol + "//" + u.host + "/" + encodeURIComponent(u.path.substr(1));
    jsdom.env (reqURL ,
            ["https://code.jquery.com/jquery-1.11.3.min.js"] ,
            function(err, window) {
                if (err) {
                    res.json({status:400, msg:err, result:{url:req.query.url, reqURL:reqURL}});
                    return;
                }
                var $ = window.jQuery;
                var title = $('title').text() || $('meta[property="og:title"]').attr("content") || "";
                var brief = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";
                var data = {
                    url   : req.query.url,
                    title : title.trim(),
                    brief : brief.trim(),
                };
                res.json({status:200, msg:'ok', result: data});
                window.close();
    });
};
