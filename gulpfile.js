var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    react = require('gulp-react'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    locate = require('./lib/locate'),
    jsxs = ['react'].concat(locate.all(null, 'react', /jsx$/)),

bundleAll = function (b) {
    b.bundle()
    .on('error', function (E) {
        gutil.log('[browserify ERROR]', gutil.colors.red(E));
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('static/js/'));
},

buildJsx = function (watch) {
    var b = browserify({
        cache: {},
        packageCache: {},
        basedir: __dirname,
        paths: [__dirname],
        require: jsxs,
        bundleExternal: false,
        fullPaths: watch,
        debug: watch
    });

    b.transform('reactify');

    if (watch) {
        b = watchify(b);
        b.on('update', function () {
            gutil.log('[browserify] updated~');
            bundleAll(b);
        });
    }

    bundleAll(b);
};

gulp.task('build_jsx', function () {
    buildJsx(false);
});

gulp.task('watch_jsx', function () {
    buildJsx(true);
});

gulp.task('lint_js', function () {
    gulp.src(['ajax/*.js', 'data/*.js', 'module/*.js', 'page/*.js'])
    .pipe(jshint());
});

gulp.task('develop', ['watch_jsx', 'server']);

gulp.task('server', function( ) {
    nodemon({script: 'webtasks.js', ext: 'js'})
    .on('change', ['lint_js']);
});

gulp.task('buildall', ['build_jsx']);
gulp.task('default',['buildall']);
