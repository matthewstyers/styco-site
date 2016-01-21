var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.noNav = 'home';
	locals.filters = {
    user: req.params.user,
		resource: req.params.id
	};
	locals.data = {
		posts: [],
		profile: {}
	};

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
	view.render('resource');

};
