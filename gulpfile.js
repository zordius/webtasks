var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    locate = require('./lib/locate'),
    concat = require('gulp-concat'),
    jsxs = locate.all(null, 'react');

//jsxs.push('react');

gulp.task('jsx', function() {
    gulp.src('react/*.jsx', { read: false })
    .pipe(sourcemaps.init())
    .pipe(browserify({
        basedir: __dirname,
        require: jsxs,
        bundleExternal: false,
        transform: 'reactify'
    }))
//    .on('prebundle', function (bundle) {
//        bundle.external('react');
//    })
    .pipe(gulp.dest('static/js/'))
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
