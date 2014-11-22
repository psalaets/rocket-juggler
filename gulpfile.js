var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync')

gulp.task('watch-commonjs', function() {
  var bundler = browserify({
    // begin options required by watchify
    cache: {},
    packageCache: {},
    fullPaths: true,
    // end options required by watchify
    debug: true // generate inline source maps
  });
  bundler = watchify(bundler);

  bundler.add('./app/index.js');
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // convert regular node stream into gulp compatible stream
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./app/build'));
  }

  return rebundle();
});

gulp.task('browser-sync-server', function() {
  browserSync({
    server: {
      baseDir: './app/'
    }
  });
});

gulp.task('dev', ['watch-commonjs', 'browser-sync-server'], function() {
  gulp.watch([
    // reload when commonjs bundle changes
    'app/build/bundle.js',
    // reload when html page changes
    'app/index.html'
  ], {}, browserSync.reload);
});

gulp.task('default', ['dev']);
