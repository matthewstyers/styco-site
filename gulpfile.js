var gulp = require('gulp');
var install = require('gulp-install');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-cssnano');
var nodemon = require('gulp-nodemon');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// single reference point for all relevant paths.

/*
NOTE: Use paths to limit the number of files being watched by any single stream.
Requiring streams to poll irrelevant files will eat up CPU useage, and if
legacyWatch is enabled within nodemon, can block the event loop.
*/
var paths = {
  'package': './package.json',
  'src': ['models/**/*.js', 'routes/**/*.js', 'app.js', 'package.json'],
  'static': ['./templates/**/*.jade', './client/js', './public/images/**/*',
    './public/fonts/**/*', './public/js/**/*'
  ],
  'style': {
    sass: './public/styles/**/*.scss',
    compiled: './public/dist/site.min.css',
    dist: './public/dist/'
  }

};

// any child processes that need to be run (particularly within nodemon) that
// don't need a standalone gulp task
var subProcess = {
  // filepaths that need some update on change but don't require a full restart
  watch: function() {
    console.log('Gulp is now watching static files.');
    // watch sass and run compile task on change
    gulp.watch(paths.style.sass, ['sass']);
    // watch static file dirs (templates, images, etc.) and do a simple page
    //reload on change
    gulp.watch(paths.static, ['reload']);
  }
};

// checks the node_modules dir for differences from the current package.json
// and runs an npm install when differences are found
/* TODO: figure out some way to set the loglevel. It's super chatty.*/
gulp.task('install', function() {
  gulp.src(paths.package)
    // NOTE: currently points to a node_modules dir in the parent.
    // a 'typical' confiruation would would use './'
    .pipe(gulp.dest('../'))
    .pipe(install({
      ignoreScripts: true
    }));
});
/*
NOTE: the install task is async on purpose. If it's run synchronously, it slows
the build/restart process dramatically due to npm's post-install checks that take
several seconds.

If a large install occurs when nodemon starts, the app may crash with a
'module not found' error. If this occurs, just wait for install to print
'npm info is okay' and then emit a restart by simply touching any file nodemon
is watching.
*/

// reads the the source javascript and return a report of any errors.
gulp.task('lint', function() {
  var stream = gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintReporter));
  return stream;
});

// sass compilation process
gulp.task('sass', function(cb) {
  gulp.src(paths.style.sass)
    //compile the sass and announce any errors
    .pipe(sass()
      .on('error', function() {
        sass.logError();
        cb();
      }))
    // save an un-minified version at dist.
    // uncomment the next line if you'd like a human-readable version.
    // .pipe(gulp.dest(paths.style.dist))

  // add the standard '.min' suffix to file name, denoting minified css.
  .pipe(rename({
      suffix: '.min'
    }))
    // crunch it up
    .pipe(minifyCss({
      compatibility: 'ie9'
    }))
    .pipe(gulp.dest(paths.style.dist))
    // wait til the new file is saved before reloading the page or moving on.
    .on('end', function(err) {
      livereload.reload(); //page reload
      if (err) cb(err);
      cb();
    });
});

// simple page refresh
gulp.task('reload', function(cb) {
  livereload.reload();
  cb();
});

// core task. monitors/restarts app automatically, and handles crashes without
// killing the container.
/*
NOTE re legacyWatch: by default, nodemon uses inotify to get updates on file
changes, but since nodemon and the files in question are on different servers,
it's:
A) unlikely that the system clocks will start or stay in sync.
B) impossible for a docker container running a boot2docker image stream intotify
messages.
to solve this problem, we simply set legacyWatch to true, thereby instructing
nodemon to poll necessary files and identify changes.
*/
gulp.task('nodemon', ['install', 'lint'], function() {
  // start the livereload server.
  livereload.listen();
  nodemon({
      script: 'app.js',
      watch: paths.src,
      legacyWatch: true,
      ext: 'js json',
      tasks: function(changedFiles) {
        console.log('file changed');
        var tasks = [];
        changedFiles.forEach(function(file) {
          if (path.extname(file) === '.js') {
            tasks.push('lint');
          }
          if (path.extname(file) === '.json') {
            tasks.push('install');
          }
        });
        return tasks;
      }
    })
    .on('start', function() {
      // start the child watch processes. also runs on restart.
      subProcess.watch();
    })
    .on('readable', function() {
      // On start/restart, watit til stdout and stdin streams are ready,
      // test to see if  livereload is listening, and then fire a page reload.
      this.stdout.on('data', function(chunk) {
        if (/^listening/.test(chunk)) {
          livereload.reload();
        }
        process.stdout.write(chunk);
      });
    });
});

// default task (also the command Docker passes when the container starts,
// so DON'T REMOVE IT.)
gulp.task('default', ['nodemon']);

/*
TODO:
- synchronous build task for client components (currently using browserify middleware)
*/
