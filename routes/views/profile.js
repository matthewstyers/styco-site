var _ = require('lodash');

exports = module.exports = function(req, res) {
	var locals = res.locals;

	// Set local
	locals.sidebar = true;
	locals.noNav = true;
	locals.filters = {
    user: req.params.user,
		resource: req.params.resource
	};

  //set default resource
  if (!locals.filters.resource) {
    _.defaults(locals.filters, {
      resource: 'cv'
    });
  }
	// set the view to be rendered
	var viewDir = '/resources';
	var viewUri = viewDir.concat('/', locals.filters.user, '/', locals.filters.resource);

	// Load the current post
	res.redirect(viewUri);
  res.end();
};
