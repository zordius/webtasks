var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
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

gulp.task('default',['jsx','react']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});
