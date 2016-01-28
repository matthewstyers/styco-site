var async = require('async');
var _ = require('lodash');
var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set local
	locals.filters = {
    user: req.params.user,
		resource: req.params.id,
		format: req.params.format
	};
	locals.data = {
		posts: [],
		profile: {},
		tools: []
	};

	// set the view to be rendered
	var viewDir = 'exports';
	var viewUri = viewDir.concat('/', locals.filters.resource);
	// Load the current post
	view.on('init', function(next) {
		var UserProfile = keystone.list('UserProfile');
		var q = UserProfile.model.findOne({
			username: locals.filters.user
		}).populate('user tools');
		q.exec(function(err, result) {
			async.waterfall(
				[
					function(cb) {
						var sortedTools = _.sortByAll(result.tools, ['category', 'name']);
						cb(null, sortedTools);
					},
					function(sortedTools, cb) {
						// console.log(sortedTools);
						_.assign(result.tools, sortedTools);
						cb(null, result);
					}
				],
				function(err, results) {
					if (err) console.log(err);
					locals.data.profile = results;
					next(err);
				}
			);
		});
	});
	// Render the view
	view.render(viewUri);

};
