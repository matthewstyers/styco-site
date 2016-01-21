var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/about', routes.views.about);
	app.all('/contact', routes.views.contact);
	app.get('/post/:slug', routes.views.post);
	app.get('/resources/:user/:id', routes.views.resources);
	app.all('/stuff', routes.views.stuff);
	app.get('/topic/:category', routes.views.topic);

};
