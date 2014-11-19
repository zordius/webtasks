var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    locate = require('./lib/locate'),
    jsxs = locate.all(null, 'react', /jsx$/);

gulp.task('jsx', function() {
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

gulp.task('react', function() {
    gulp.src('node_modules/react/react.js')
    .pipe(browserify({
        require: 'react'
    }))
    .pipe(gulp.dest('static/js/'));
});

gulp.task('lintjs', function() {
    gulp.src(['data/*.js', 'module/*.js', 'page/*.js'])
    .pipe(jshint());
});

gulp.task('develop', ['watch', 'server']);

gulp.task('server', function() {
    nodemon({script: 'webtasks.js'})
    .on('change', ['lintjs']);
});

gulp.task('buildall', ['jsx', 'react']);
gulp.task('default',['jsx','react']);

gulp.task('watch', function() {
    watch('react/*.jsx', function () {
        gulp.start('jsx');
    });
});
