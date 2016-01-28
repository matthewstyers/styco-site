// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
// var browserSync = require('browser-sync');

keystone.init({

	'name': 'Styers.co',
	'brand': 'Styers.co',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'exports': 'templates/views/exports',
	'view engine': 'jade',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'port': process.env.PORT || 3000
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
	'users': ['users'/*, 'profiles'*/],
	'profile': ['profiles', 'tools']
});

//cloudinary config
keystone.set('cloudinary config', {
	'cloudinary folders': true,
	'cloudinary prefix': 'styco-site',
	'dev': false
});

keystone.set('site authors', ['matthew', 'taylor']);


keystone.start({
	onMount: function() {
		if (process.env.NODE_ENV === 'development') {
			keystone.app.use(require('connect-livereload')());
		}

  	}
	// socket.io config - for later
	// 	// var io = keystone.get('io');
	// 	// var session = keystone.get('express session');
	// 	// // Share session between express and socketio
	// 	// io.use(function(socket, next) {
	// 	// 	session(socket.handshake, {}, next);
	// 	// });
	// 	// io.on('connection', function(socket) {
	// 	// 	console.log('user connected');
	// 	// 	socket.on('chat message', function(msg) {
	// 	// 		console.log('message: ' + msg);
	// 	// 		io.emit('chat message', msg);
	// 	// 	});
	// 	// });
	// }
});
