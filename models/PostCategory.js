var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
	label: 'Topics',
	path: 'topics',
	singular: 'topic',
	plural: 'topics',
	sortable: 'true'
});

PostCategory.add({
	name: {
		type: String,
		required: true,
		label: 'topic'
	}
});

PostCategory.relationship({
	ref: 'Post',
	path: 'categories'
});

PostCategory.register();
