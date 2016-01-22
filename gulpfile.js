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



var paths = {
  'src': ['./models/**/*', './routes/**/*.js', 'app.js', 'package.json'],
  'style': {
    sass: './public/styles/**/*.scss',
    compiled: './public/dist/site.css',
    dist: './public/dist/'
  },
  'static': ['./public/dist/*.min.css', './templates/**/*.jade'],
  'templates': './templates/**/*.jade'
};

var subProcess = {
  watch: function() {
    console.log('gulp is watching scss and jade files');
    gulp.watch(paths.style.sass, ['sass']);
    gulp.watch(paths.templates, ['reload']);
  }
};

gulp.task('install', function() {
  gulp.src('./package.json')
  .pipe(gulp.dest('../'))
  .pipe(install({ignoreScripts: true}));
});


gulp.task('lint', function() {
  gulp.src(paths.src)
  .pipe(jshint())
  .pipe(jshint.reporter(jshintReporter));
});

gulp.task('sass', function() {
  gulp.src(paths.style.sass)
  .pipe(sass()
  .on('error', sass.logError))
  .pipe(gulp.dest(paths.style.dist))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifyCss({
    compatibility: 'ie9'
  }))
  .pipe(gulp.dest(paths.style.dist))
  .pipe(livereload());
});

gulp.task('reload', function() {
  livereload.reload();
});

gulp.task('nodemon', ['install', 'lint'], function() {
  livereload.listen();
  nodemon({
    script: './app.js',
    watch: '*',
    legacyWatch: true,
    ext: 'js json',
    tasks: function(changedFiles) {
      var tasks = [];
      console.log('file changed');
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
    // setTimeout(function () {
    //         livereload.changed();
    //     }, 2000);
    subProcess.watch();
  })
  .on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if (/^listening/.test(chunk)) {
        livereload.reload();
      }
      process.stdout.write(chunk);
    });
  });
});

gulp.task('default', ['nodemon']);
