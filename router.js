var foodModel  = require('./models/food')(database);

module.exports = function(app) {
    var food = require('./controllers/food');
    //router
    app.post   ('/api/food'    , food.create);
    app.put    ('/api/food/:id', food.update);
    app.get    ('/api/food/:id', food.get);
    app.get    ('/api/food'    , food.search);
    app.delete ('/api/food/:id', food.del);

    app.get('/', function(req, res) {
        res.render('index.html', {navbar: {index: 'active'}});
    });
    app.get('/create', function(req, res) {
        res.render('create.html', {navbar: {create: 'active'}});
    });

    app.get('/food/:id', function(req, res) {
        console.log(req.params.id);
        foodModel.get(req.params.id, function(err, response) {
            if (err) {
            }
            res.render('food.html', {
                food: response,
                navbar: {create: 'active'}
            });
        })
    });
    //app.put('/api/food', food.search);

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}
