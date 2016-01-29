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
	'emails': 'templates/emails',
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

// email locals, required by Keystone's default email templates
keystone.set('email locals', {
	logo_src: '/images/matthew-styers.jpg',
	logo_width: 25,
	logo_height: 25,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});
keystone.set('mandrill api key', process.env.MANDRILL_API_KEY);
keystone.set('mandrill username', process.env.MANDRILL_USERNAME || 'mattysty@gmail.com');

// replacement rules for emails.
keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') === 'production') ?
		'http://www.your-server.com/keystone/' : 'http://styers.co'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') === 'production') ?
		'http://www.your-server.com/images/' : 'http://styers.co'
}]);

//email test routes
keystone.set('email tests', require('./routes/emails'));


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
