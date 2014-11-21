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
    jsxs = locate.all(null, 'react', /jsx$/),

bundleAll = function (b) {
    b.bundle()
    .on('error', function (E) {
        console.log(E);
    })
    .pipe(source('static/js/main.js'))
    .pipe(gulp.dest(''));
//    .pipe(concat('main.js'))
//    .pipe(sourcemaps.write())
//    .pipe(gulp.dest('static/js/'));
},

buildJsx = function (watch) {
    var b = browserify({
        cache: {},
        basedir: __dirname,
        require: jsxs,
        files: jsxs,
        bundleExternal: false,
        fullPaths: watch,
        debug: watch
    });

    b.transform('reactify');

    if (watch) {
        b = watchify(b);
        b.on('update', function () {
            bundleAll(b);
        });
    }

    bundleAll(b);
};

gulp.task('buildJsxJs', function () {
    gulp.src('react/*.jsx')
    .pipe(react({sourceMap: true}))
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('static/jsx/'));
});

gulp.task('build_jsx', function () {
    buildJsx(false);
});

gulp.task('watch_jsx', function () {
    buildJsx(true);
});

gulp.task('build_react_core', function () {
    browserify({require: 'react'})
    .bundle()
    .pipe(source('node_modules/react/react.js'))
    .pipe(gulp.dest('static/js/'));
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

gulp.task('buildall', ['build_react_core', 'build_jsx']);
gulp.task('default',['buildall']);
