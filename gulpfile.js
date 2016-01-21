var gulp = require('gulp');
var install = require('gulp-install');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var minifyCss = require('gulp-cssnano');
var nodemon = require('gulp-nodemon');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
// var watch = require('gulp-watch');
// var shell = require('gulp-shell');

var paths = {
  'src': ['./models/**/*', './routes/**/*.js', 'app.js', 'package.json'],
  'style': {
    all: './public/styles/**/*.scss',
    compiled: './public/dist/site.css',
		dist: './public/dist/'
  }
};

// install
gulp.task('install', function() {
	gulp.src('./package.json')
   .pipe(gulp.dest('../'))
  //  .pipe(install({ignoreScripts: true}));
   .pipe(install());
});

// gulp lint
gulp.task('lint', function() {
  gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintReporter));
});

gulp.task('sass', function() {
  gulp.src(paths.style.all)
    .pipe(sass()
      .on('error', sass.logError))
    .pipe(gulp.dest(paths.style.dist))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifyCss({
      compatibility: 'ie9'
    }))
    .pipe(gulp.dest(paths.style.dist));
});

gulp.task('app:start', ['install', 'lint', 'sass'], function() {
	nodemon({
    script: './app.js',
    watch: '*',
    legacyWatch: true,
    ext: 'js scss json sass',
    tasks: function(changedFiles) {
      var tasks = [];
			console.log('file changed');
      changedFiles.forEach(function(file) {
        if (path.extname(file) === '.js') {
					tasks.push('lint');
				}
        if (path.extname(file) === '.scss') {
					tasks.push('sass');
				}
        if (path.extname(file) === '.json') {
					tasks.push('install');
				}
      });
      return tasks;
    }
  })
  .on('start', function() {
  })
  .on('restart', function() {
    console.log('app restarted');
  })
  .on('exit', function() {
  });
});

gulp.task('default', ['app:start']);
