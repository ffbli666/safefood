var foodModel  = require('./models/food')(database);

module.exports = function(app) {

    //router
    var food = require('./controllers/food');
    app.post   ('/api/food'    , food.create);
    app.put    ('/api/food/:id', food.update);
    app.get    ('/api/food/:id', food.get);
    app.get    ('/api/food'    , food.search);
    app.delete ('/api/food/:id', food.del);

    var crawler = require('./controllers/crawler');
    app.get ('/api/crawler', crawler.get);

    app.get('/', function(req, res) {
        res.render('index.html', {
            navbar: {index: 'active'},
            q: req.query.q
        });
    });

    app.get('/create', function(req, res) {
        res.render('create.html', {navbar: {create: 'active'}});
    });

    app.get('/food/:id', function(req, res) {
        foodModel.get(req.params.id, function(err, response) {
            if (err) {
            }
            response.hyperlinks_json = JSON.stringify(response.hyperlinks);
            res.render('food.html', {
                food: response
            });
        })
    });
    //app.put('/api/food', food.search);

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.status(404).send('Page Not Found');
}
