var async = require('async'),
keystone = require('keystone');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  // Set locals
  locals.section = 'about';
  locals.images = {};
  locals.Matthew = {
    profile: {},
    posts: []
  };
  locals.Taylor = {
    profile: {},
    posts: []
  };
  view.on('get', function(next) {
    async.parallel(
      [
        // get the hero image.
        function(cb) {
          keystone.list('Gallery')
          .model.findOne({
            name: 'about-header'
          })
          .exec(function(err, result) {
            locals.images.hero = result;
            cb(err, result);
          });
        },
        function(cb) {
          var authors = keystone.get('site authors');
          async.each(authors, function(author, callback) {
            keystone.list('UserProfile')
            .model.findOne()
            .where('belongsTo', author)
            .populate('user')
            .exec(function(err, result) {
              if (result) {
                locals[result.user.name.first].profile = result;
                console.log(locals[result.user.name.first].profile);
                keystone.list('Post')
                .model.find()
                .where('author', result.user)
                .sort('-publishedDate')
                .exec(function(err, posts) {
                  locals[result.user.name.first].posts = posts;
                  callback();
                });
              } else {
                callback();
              }
            });
          }, function(err) {
            cb(err, null);
          });
        }
      ],
      function(err) {
        if (err) req.flash(err);
        next(err);
      }
    );
  });
  // Render the view
  view.render('about');

};
