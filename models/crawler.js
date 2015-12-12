var url   = require("url");
var jsdom = require('jsdom');

module.exports = function() {
    return new crawler();
};

function crawler () {
     var get = function(queryURL, myCallback) {
        var u = url.parse(queryURL);
        var reqURL = u.protocol + "//" + u.host + "/" + encodeURIComponent(u.path.substr(1));
        jsdom.env (reqURL ,
            ["https://code.jquery.com/jquery-1.11.3.min.js"] ,
            function(err, window) {
                if (err) {
                    myCallback(err);
                    return;
                }
                var $ = window.jQuery;
                var title = $('title').text() || $('meta[property="og:title"]').attr("content") || "";
                var brief = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";
                var data = {
                    url   : queryURL,
                    title : title.trim(),
                    brief : brief.trim(),
                };
                window.close();
                myCallback(null, data);
        });
    }
    return {
        get: get
    };
}