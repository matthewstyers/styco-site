var keystone = require('keystone');
var Types = keystone.Field.Types;


var UserProfile = new keystone.List('UserProfile', {
  autokey: {
    from: 'user.name.full',
    path: 'key',
    unique: true
  },
  defaultColumns: 'name, user',
  hidden: false,
  label: 'User Profiles',
  nocreate: false,
  nodelete: false,
  noedit: false,
  path: 'profiles',
  plural: 'user profiles',
  singular: 'user profile',
});
UserProfile.add({
  name: {
    type: Types.Text,
    required: true,
    initial: true
  },
  user: {
    type: Types.Relationship,
    ref: 'User',
    required: true,
    initial: true
  },
  experience: {
    type: Types.TextArray
  },
  toolbelt: {
    type: Types.TextArray
  },

});

// UserProfile.register();
