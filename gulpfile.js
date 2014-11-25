var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    readable = require('stream').Readable,
    react = require('gulp-react'),
    jshint = require('gulp-jshint'),
    locate = require('./lib/locate'),
    code = locate.bundle(),
    stream = new readable,

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
        fullPaths: watch,
        debug: watch
    });

    b.transform('reactify');
    b.require(stream, {expose: '$R'});

    if (watch) {
        b = watchify(b);
        b.on('update', function () {
            gutil.log('[browserify] updated~');
            bundleAll(b);
        });
    }

    bundleAll(b);
};

stream.push(code);
stream.push(null);

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
    nodemon({script: require(process.cwd() + '/package.json').main, ext: 'js'})
    .on('change', ['lint_js']);
});

gulp.task('buildall', ['build_jsx']);
gulp.task('default',['buildall']);
