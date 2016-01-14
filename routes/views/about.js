var async = require('async'),
  keystone = require('keystone');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  // Set locals
  locals.section = 'about';
  locals.images = {};
  locals.posts = {};
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
          keystone.list('Post')
            .model.find()
            .where('state', 'published')
            .sort('-publishedDate')
            .populate('author categories')
            .exec(function(err, results) {
              locals.posts.matthew = results;
              cb(err, results);
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
