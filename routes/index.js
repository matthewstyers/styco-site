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
	app.get('/topic/:category', routes.views.topic);
	app.get('/post/:slug', routes.views.post);
	app.get('/about', routes.views.about);
	app.all('/contact', routes.views.contact);
	app.all('/stuff', routes.views.stuff);

};
