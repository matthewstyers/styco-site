var keystone = require('keystone');
var Types = keystone.Field.Types;

var Gallery = new keystone.List('Gallery', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
	map: {
		publicId: 'key',

	},
	path: 'media',
	singular: 'media item',
	plural: 'media items',
	label: 'Media Items'
});
Gallery.add({
	name: {
		type: Types.Text,
		required: true
	},
	mediaType: {
		type: Types.Select,
		options: ['single image', 'image collection']
	},
	publishedDate: {
		type: Date,
		default: Date.now,
		noedit: true
	},
	image: {
		type: Types.CloudinaryImage,
		dependsOn: {
			mediaType: 'single image'
		},
		folder: 'styco-site'
	},
	images: {
		type: Types.CloudinaryImages,
		dependsOn: {
			mediaType: 'image collection'
		}
	},
	altText: {
		type: Types.Text,
		note: 'Text that displays on hover. Mostly for SEO.'
	}
});

Gallery.register();
