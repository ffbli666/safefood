module.exports = function(app) {

    var food = require('./controllers/food');

    //router
    app.post('/api/food'    , food.create);
    app.put ('/api/food/:id', food.update);
    app.get ('/api/food/:id', food.get);
    app.get ('/api/food'    , food.search);

    //app.put('/api/food', food.search);



    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}
