var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    locate = require('./lib/locate'),
    jsxs = locate.all(null, 'react', /jsx$/);

gulp.task('build_jsx', function() {
    gulp.src('react/*.jsx', { read: false })
    .pipe(sourcemaps.init())
    .pipe(browserify({
        basedir: __dirname,
        require: jsxs,
        bundleExternal: false,
        transform: 'reactify'
    }))
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('static/jsx/'))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('static/js/'));
});

gulp.task('build_react_core', function() {
    gulp.src('node_modules/react/react.js')
    .pipe(browserify({
        require: 'react'
    }))
    .pipe(gulp.dest('static/js/'));
});

gulp.task('lint_js', function() {
    gulp.src(['ajax/*.js', 'data/*.js', 'module/*.js', 'page/*.js'])
    .pipe(jshint());
});

gulp.task('develop', ['watch', 'server']);

gulp.task('server', function() {
    nodemon({script: 'webtasks.js', ext: 'js'})
    .on('change', ['lint_js']);
});

gulp.task('buildall', ['build_react_core', 'build_jsx']);
gulp.task('default',['buildall']);

gulp.task('watch', function() {
    gulp.watch('react/*.jsx', ['build_jsx']);
});
