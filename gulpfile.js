var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream')

gulp.task('watch', function() {
  var bundler = browserify(watchify.args);
  bundler = watchify(bundler);

  bundler.add('./index.js');
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // convert regular node stream into gulp compatible stream
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./build'));
  }

  return rebundle();
});
