var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	}
});

Post.add({
	title: {
		type: String,
		required: true
	},
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true
	},
	author: {
		type: Types.Relationship,
		ref: 'User',
		index: true
	},
	publishedDate: {
		type: Types.Datetime,
		index: true,
		default: Date.now,
		format: 'MM-DD-YYYY h:m a',
		utc: true,
		dependsOn: {
			state: 'published'
		}
	},
	image: {
		type: Types.CloudinaryImage
	},
	content: {
		customPreview: {
			type: Types.Boolean,
			label: 'Customize Preview',
		},
		preview: {
			type: Types.Markdown,
			wysiwyg: true,
			height: 200,
			dependsOn: {
				'content.customPreview': true
			},
			note: 'Custom preview is not displayed in full post, but overrides Content Brief in preview'
		},
		brief: {
			type: Types.Markdown,
			wysiwyg: true,
			height: 200
		},
		extended: {
			type: Types.Markdown,
			wysiwyg: true,
			height: 450
		}
	},
	categories: {
		type: Types.Relationship,
		ref: 'PostCategory',
		many: true
	}
});

Post.schema.virtual('content.full')
	.get(function() {
		return this.content.extended || this.content.brief;
	});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
