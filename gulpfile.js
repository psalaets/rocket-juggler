var gulp        = require('gulp'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    source      = require('vinyl-source-stream'),
    browserSync = require('browser-sync'),
    useref      = require('gulp-useref'),
    filter      = require('gulp-filter'),
    uglify      = require('gulp-uglify'),
    rev         = require('gulp-rev'),
    inject      = require('gulp-inject'),
    del         = require('del');

// when true bundle node modules with watchify, when false browserify
var watchifyBundle = true;
// when true include source maps with commonjs bundle
var inlineSourceMaps = true;

gulp.task('browserify', function() {
  var bundler = browserify({
    // begin options required by watchify
    cache: {},
    packageCache: {},
    fullPaths: true,
    // end options required by watchify
    debug: inlineSourceMaps // generate inline source maps
  });

  if (watchifyBundle) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }

  // index.js is code's entry point to requiring node modules
  bundler.add('./app/index.js');

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

gulp.task('dev', ['browserify', 'browser-sync-server'], function() {
  gulp.watch([
    // reload when commonjs bundle changes
    'app/build/bundle.js',
    // reload when html page changes
    'app/index.html'
  ], {}, browserSync.reload);
});

gulp.task('set-prod-flags', function() {
  watchifyBundle = false;
  inlineSourceMaps = false;
});

gulp.task('prep-scripts', ['browserify'], function() {
  var jsFilter = filter('**/*.js');

  return gulp.src('app/index.html')
    // read files between build/endbuild marker comments and concat them into
    // file with name specified by marker comment
    .pipe(useref.assets())
    // filter that down to just js files (there's no css yet so this isn't
    // necessary right now)
    .pipe(jsFilter)
    // minify
    .pipe(uglify())
    // assign unique filename based on content
    .pipe(rev())
    .pipe(gulp.dest('build'));
});

gulp.task('prep-html', ['prep-scripts'], function() {
  var vendorFile = gulp.src('build/vendor-*.js', {read: false});
  var mainFile = gulp.src('build/main-*.js', {read: false});

  return gulp.src('app/index.html')
    .pipe(inject(vendorFile, {
      addRootSlash: false,
      ignorePath: 'build/',
      name: 'inject-vendor'
    }))
    .pipe(inject(mainFile, {
      addRootSlash: false,
      ignorePath: 'build/',
      name: 'inject-main'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  del([
    'build',
    'app/build'
  ], cb);
});

gulp.task('prod', ['set-prod-flags', 'clean', 'prep-html']);
gulp.task('default', ['dev']);
