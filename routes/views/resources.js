var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.noNav = true;
	locals.filters = {
    user: req.params.user,
		resource: req.params.id
	};
	locals.data = {
		posts: [],
		profile: {}
	};

	// set the view to be rendered
	var viewDir = 'resources';
	var viewUri = viewDir.concat('/', locals.filters.resource);
	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('UserProfile').model.findOne({
			username: locals.filters.user
		}).populate('user');
		q.exec(function(err, result) {
			locals.data.profile = result;
			next(err);
		});

	});

	// Render the view
	view.render(viewUri);

};
