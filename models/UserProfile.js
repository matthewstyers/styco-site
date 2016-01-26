var keystone = require('keystone');
var Types = keystone.Field.Types;


var UserProfile = new keystone.List('UserProfile', {
  autokey: {
    from: 'username',
    path: 'key',
    unique: true
  },
  defaultColumns: 'name, belongsTo, twitter, github',
  hidden: false,
  label: 'User Profiles',
  nocreate: false,
  nodelete: false,
  noedit: false,
  path: 'profiles',
  plural: 'user profiles',
  singular: 'user profile',
  map: {
    name: 'username'
  }
});

UserProfile.add({
  belongsTo: {
    type: Types.Text,
    hidden: true
  },
  user: {
    type: Types.Relationship,
    ref: 'User',
    required: true,
    initial: true
  },
  username: {
    type: Types.Text,
    unique: true,
    required: true,
    initial: true,
    index: true
  }
}, 'Contact', {
  phone: {
    type: Types.Text,
    unique: true
  }
}, 'Skills', {
  tools: {
    type: Types.Relationship,
    ref: 'Tool',
    many: true,
    filters: {
      user: ':_id'
    }
  }
}, 'Handles', {
  twitter: {
    type: Types.Text
  },
  github: {
    type: Types.Text
  }
},
'Resources', {
  cv: {
    type: Types.Boolean,
  }
});

UserProfile.schema.pre('save', function (next) {
  var self = this;
  keystone.list('User').model
  .findById(this.user)
  .exec(function (err, user) {
    if (err) throw new Error(err);
    self.belongsTo = user.name.first.concat(' ', user.name.last);
    next();
  });
});
UserProfile.schema.virtual('cvUri')
  .get(function() {
    var resources = 'resources';
    return resources.concat('/', this.username, '/cv');
  });

// UserProfile.schema.virtual('posts')
// .get(function() {
//   keystone.list('Post').model.find()
//   .where('author', this.user)
//   .exec(function(err, posts) {
//     if (err) throw new Error(err);
//     return posts;
//   });
// });

UserProfile.register();
