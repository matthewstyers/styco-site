var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: {
		type: Types.Name,
		required: true
	},
	email: {
		type: Types.Email,
		required: true
	},
	phone: {
		type: String
	},
	enquiryType: {
		type: Types.Select,
		options: [{
			value: 'taylor',
			label: 'Taylor'
		}, {
			value: 'matthew',
			label: 'Matthew'
		}, {
			value: 'both',
			label: 'Couldn\'t care less'
		}]
	},
	message: {
		type: Types.Markdown,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
