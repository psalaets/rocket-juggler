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
    del         = require('del'),
    filelog     = require('gulp-filelog'),
    imagemin    = require('gulp-imagemin'),
    mocha       = require('gulp-mocha');

function makeBundle(options) {
  options = options || {};
  var watchifyBundle = !!options.watchifyBundle;
  var inlineSourceMaps = !!options.inlineSourceMaps;

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
}

gulp.task('browserify', ['clean'], function() {
  return makeBundle();
});

gulp.task('watchify', ['clean'], function() {
  return makeBundle({
    watchifyBundle: true,
    inlineSourceMaps: true
  });
});

gulp.task('watch', ['watchify'], function(cb) {
  browserSync({
    server: {
      baseDir: './app/'
    }
  }, function() {
    gulp.watch([
      // reload when commonjs bundle changes
      'app/build/bundle.js',
      // reload when html page changes
      'app/index.html'
    ], {}, browserSync.reload);

    // signal to gulp that this task is done
    cb();
  });
});

gulp.task('prep-scripts', ['clean', 'browserify'], function() {
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
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('prep-html', ['clean', 'prep-scripts'], function() {
  var vendorFile = gulp.src('build/scripts/vendor-*.js', {read: false});
  var mainFile = gulp.src('build/scripts/main-*.js', {read: false});

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

// for now this just copies assets to build/
gulp.task('prep-assets', function() {
  return gulp.src('app/assets/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets'));
});

gulp.task('build', ['clean', 'test', 'prep-html', 'prep-assets']);

gulp.task('gh-pages', ['build'], function() {
  console.log('Copying files to project root:')

  // copy stuff in build dir to project root
  return gulp.src('build/**/*')
    .pipe(gulp.dest('.'))
    .pipe(filelog());
});

gulp.task('test', function() {
  return gulp.src('test/**/*.js')
    .pipe(mocha());
});

gulp.task('default', function() {
  console.log();
  console.log('Available tasks:');
  console.log();
  console.log('  watch      Serve page locally with auto-refresh');
  console.log('  build      Create minified files in build/');
  console.log('  gh-pages   Move minified files into gh-pages location');
  console.log('  test       Runs tests. Can also use `npm test`');
  console.log();
});
