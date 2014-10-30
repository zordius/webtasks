var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    locate = require('./lib/locate'),
    jsxs = locate.all(null, 'react');

gulp.task('jsx', function() {
    gulp.src('react/*.jsx', { read: false })
    .pipe(sourcemaps.init())
    .pipe(browserify({
        basedir: __dirname,
        require: jsxs,
        bundleExternal: false,
        transform: 'reactify'
    }))
    .pipe(gulp.dest('static/jsx/'))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('static/js/'));
});

gulp.task('react', function() {
    gulp.src('node_modules/react/react.js')
    .pipe(browserify({
        require: 'react'
    }))
    .pipe(gulp.dest('static/js/'));
});

gulp.task('lintjs', function() {
    gulp.src(['data/*.js', 'module/*.js', 'page/*.js'])
    .pipe(jshint())
});

gulp.task('develop', function() {
    nodemon({script: 'webtasks.js'})
    .on('change', ['lintjs'])
});

gulp.task('default',['jsx','react']);

gulp.task('watch', function() {
    gulp.watch('jsx/*.jsx', ['default']);
});
