'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    livereload = require('gulp-livereload'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    clean = require('gulp-clean'),
    compass = require('gulp-compass'),
    cache = require('gulp-cache'),
    wiredep = require('wiredep').stream,
    path = {
        dist: {
            html: 'dist/',
            js: 'dist/js/',
            css: 'dist/css/',
            img: 'dist/img/',
            fonts: 'dist/fonts/'
        },
        build: {
            html: 'app/',
            js: 'app/js/',
            css: 'app/css/',
            sass: 'app/sass/',
            img: 'app/img/',
            fonts: 'app/fonts/'
        },
        app: {
            html: 'app/*.html',
            js: 'app/js/main.js',
            css: 'app/css/**/*.css',
            sass: 'app/sass/**/*.sass',
            img: 'app/img/**/*.*',
            fonts: 'app/fonts/**/*.*'
        },
        watch: {
            html: 'app/**/*.html',
            js: 'app/js/**/*.js',
            css: 'app/css/**/*.css',
            sass: 'app/sass/**/*.sass',
            img: 'app/img/**/*.*',
            fonts: 'app/fonts/**/*.*'
        },
        clean: './dist'
    };

// dist clean
gulp.task('dist-clean', function () {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

// cache clean
gulp.task('cache-clean', function () {
    return cache.clearAll();
});

// images
gulp.task('images', ['dist-clean'], function() {
    return gulp.src(path.app.img)
        .pipe(gulp.dest(path.dist.img));
});

// fonts
gulp.task('fonts', ['dist-clean'], function () {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
});

// fix to hard copy fonts from Bootstrap as they don't include their fonts in their bower.json file
// gulp.task('copy-bs-fonts', function(){
//     return gulp.src(wiredep.directory+'/bootstrap/fonts/*.*')
//         .pipe(gulp.dest(path.dist.fonts));
// });

// fix to hard copy fonts from font-awesome as they don't include their fonts in their bower.json file
// gulp.task('copy-fa-fonts', function(){
//     return gulp.src(wiredep.directory+'/font-awesome/fonts/*.*')
//         .pipe(gulp.dest(path.dist.fonts));
// });


// build
gulp.task('build', ['dist-clean', 'images', 'fonts'], function () {
    return gulp.src(path.app.html)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(path.dist.html));
});

// server connect
gulp.task('connect', function() {
    connect.server({
        root: 'app',
        port: 8000,
        livereload: true
    });

    opn('http://localhost:8000');
});

// connect library file to html
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory : "./app/bower_components"
        }))
        .pipe(gulp.dest('./app'));
});

// compass
gulp.task('compass', function() {
    gulp.src(path.app.sass)
        .pipe(compass({
            config_file: 'config.rb',
            css: path.build.css,
            sass: path.build.sass,
            js: path.build.js,
            image: path.build.img
        }))
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
            this.emit('end');
        })
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});

// html
gulp.task('html', function() {
    gulp.src(path.app.html)
        .pipe(connect.reload());
});

// watch
gulp.task('watch', function () {
    gulp.watch('bower.json', ['bower']);
    gulp.watch(path.watch.sass, ['compass']);
    gulp.watch(path.watch.html, ['html']);
});

// default
gulp.task('default', ['connect', 'watch']);