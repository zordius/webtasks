var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
//    locate = require('./lib/locate'),
    concat = require('gulp-concat');
//    jsxs = locate.all(null, 'react');

//jsxs.push('react');

gulp.task('jsx', function() {
    gulp.src('react/*.jsx')
    .pipe(sourcemaps.init())
    .pipe(browserify({
        bundleExternal: false,
        transform: 'reactify'
    }))
    .pipe(gulp.dest('static/js/'))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('static/js/'))
});

gulp.task('default',['jsx']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});
