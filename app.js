// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

keystone.init({

	'name': 'Styers.co',
	'brand': 'Styers.co',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User'
});

keystone.import('models');

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'posts': ['posts', 'topics'],
	'media': 'media',
	'enquiries': 'enquiries',
	'users': ['users'/*, 'profiles'*/]
});

//cloudinary config
keystone.set('cloudinary config', {
	'cloudinary folders': true,
	'cloudinary prefix': 'styco-site',
	'dev': false
});

keystone.set('site authors', ['Matthew Styers', 'Taylor Styers']);


keystone.start();
