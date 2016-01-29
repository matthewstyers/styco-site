var babelify = require('babelify');
var browserify = require('browserify-middleware');
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
// var rest = require('restful-keystone');
// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// var rest = require('restful-keystone')(
// 	keystone, {
// 		root: '/api/v0'
// 	});

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	// in development, do an 'on-the-fly' build of client-side
	// and make the scripts available at /js/_path_to_script_
	if (process.env.NODE_ENV === 'development') {
		app.use('/js', browserify('./client/js', {
			transform: [babelify.configure({
				plugins: ['object-assign']
			})]
		}));
	}

	// Views
	app.get('/', routes.views.index);
	app.get('/about', routes.views.about);
	app.all('/contact', routes.views.contact);
	app.get('/post/:slug', routes.views.post);
	app.all('/resources/:user/:id', routes.views.resources);
	app.all('/stuff', routes.views.stuff);
	app.get('/topic/:category', routes.views.topic);
	app.all('/:user/:resource', routes.views.profile);
	app.all('/:user', routes.views.profile);

	//start the api engine
	// rest.expose({
	// 	Post: true,
	// }).start();
};
