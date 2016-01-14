var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
  defaultColumns: 'name, email, isAdmin'
});

User.add({
  name: {
    type: Types.Name,
    required: true,
    index: true
  },
  email: {
    type: Types.Email,
    initial: true,
    required: true,
    index: true
  },
  password: {
    type: Types.Password,
    initial: true,
    required: true
  }
}, 'Handles', {
  twitter: {
    type: Types.Text
  },
  github: {
    type: Types.Text
  }
}, 'Resources', {
  cv: {
    type: Types.Url
  }
}, 'Permissions', {
  isAdmin: {
    type: Boolean,
    label: 'Can access Keystone',
    index: true
  }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone')
  .get(function() {
    return this.isAdmin;
  });

User.relationship({
  ref: 'Post',
  path: 'posts',
  refPath: 'author'
});
// User.relationship({
//   ref: 'UserProfile',
//   path: 'profile',
//   refPath: 'user'
// });

User.register();
