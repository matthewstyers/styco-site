var async = require('async');
var _ = require('lodash');
var keystone = require('keystone');
var jade = require('jade');
var jadepdf = require('jade-pdf-redline');
var fs = require('fs');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  var parentDir = keystone.get('views');
  var exportDir = 'exports';
  // Set local
  locals.sidebar = true;
  locals.noNav = true;
	locals.pdfLink = true;
  locals.filters = {
    user: req.params.user,
    resource: req.params.id
  };
  locals.data = {
    posts: [],
    profile: {},
    tools: []
  };



  // set the view to be rendered
  var viewDir = 'resources';
  var viewUri = viewDir.concat('/', locals.filters.resource);
  // Load the current post
  view.on('init', function(next) {
    var UserProfile = keystone.list('UserProfile');
    var q = UserProfile.model.findOne({
        username: locals.filters.user
      })
      .populate('user tools');
    q.exec(function(err, result) {
      async.waterfall(
        [
          function(cb) {
            var sortedTools = _.sortByAll(result.tools, ['category',
              'name'
            ]);
            cb(null, sortedTools);
          },
          function(sortedTools, cb) {
            // console.log(sortedTools);
            _.assign(result.tools, sortedTools);
            cb(null, result);
            // },
            // function(results, cb) {
            //
            // },
            // function(results, cb) {
            // 	var pages = _.chunk(results.tools, 10);
            // 	cb(null, pages);
            // },
            // function(pages, cb) {
            // 	locals.data.tools = pages;
            // 	cb(null, null);
          }
        ],
        function(err, results) {
          if (err) console.log(err);
          // console.log(results);
          locals.data.profile = results;
          next(err);
        }
      );
    });
  });
  view.on('post', function(next) {
		// var htmlOutput = '/images/matthew-resume.html';
		var outputPath = './matthew-resume.pdf';
    var pdfLink = parentDir.concat('/', exportDir, '/', locals.filters.resource, '.jade');
    // var compiledJade = jade.compileFile(pdfLink);
		// var renderedJade = jade.renderFile(pdfLink, locals);
		// console.log(html);
		var pdfOpts = {
			phantomPath: '../node_modules/phantomjs-prebuilt/bin/phantomjs',
			locals: locals,
			jadeFilePath: pdfLink,
			format: 'Letter'
		};
	async.waterfall(
		[
			function(cb) {
				fs.createReadStream(pdfLink)
					.pipe(jadepdf(pdfOpts))
					.pipe(fs.createWriteStream(outputPath));
				cb(null, '1');
			}, function(file) {
				async.setImmediate(function(err) {
					if (err) console.log(err);
					res.download(outputPath);
				});
			}
		]
	);



    // pdf.create(renderedJade, pdfOpts)
      // .toFile('./matthew-resume.pdf', function(err, result) {
			// 	console.log(result);
			// 	if (err) console.log(err);
      //   res.download(result.filename);
      // });
			// .toBuffer(function(err, stream) {
			// 	if (err) console.log(err);
			// 	console.log(stream);
			// 	stream.pipe(fs.createWriteStream(outputPath));
			// 	res.download(outputPath);
			// });
		// res.download(outputPath);
		next();
  });
  // Render the view
  view.render(viewUri);

};
