var keystone = require('keystone');
var Types = keystone.Field.Types;

var Tool = new keystone.List('Tool', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
	label: 'Tools',
	path: 'tools',
	singular: 'tool',
	plural: 'tools',
	sortable: true,
	defaultColumns: 'name, category, url, isFavorite',
	defaultSort: 'name'
});

Tool.add({
	name: {
		type: Types.Text,
		required: true,
		initial: true,
		label: 'Tool',
		index: true
	},
	category: {
    type: Types.Select,
    options: [{
      value: 'frontend',
      label: 'Frontend'
    }, {
      value: 'backend',
      label: 'Backend'
    }, {
      value: 'infrastructure',
      label: 'Infrastructure'
    }, {
      value: 'miscellaneous',
      label: 'Miscellaneous'
    }],
		default: 'backend',
		index: true,
		initial: true
},
	description: {
		type: Types.Text,
		required: true,
		initial: true,
	},
	url: {
		type: Types.Url,
		initial: true
	},
	isFavorite: {
		type: Types.Boolean,
		label: 'favorite',
		default: false,
		initial: true
	}
});

Tool.relationship({
	ref: 'UserProfile',
	path: 'profiles',
	refPath: 'tools'
});

Tool.register();
