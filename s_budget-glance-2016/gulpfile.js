"use strict";

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    streamify = require('gulp-streamify'),
    browserify = require('browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    open = require("gulp-open"),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    source = require('vinyl-source-stream'),
    path = require('path'),
    ftp = require('vinyl-ftp'),
    reactify = require('reactify'),
    lint = require('gulp-eslint'),
    infoserver = require('../infoserver.json');





var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

env = 'development';

if (env === 'development') {
    outputDir = 'development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'production/';
    sassStyle = 'compressed';
}

/*Start define all html, scss and js files*/
jsSources = [
    // 'development/pre/js/leaflet-src.js',
    // 'development/pre/js/leaflet-search.js',
    // 'development/sass/js/highcharts.js',
    // 'development/sass/js/parallax.js',
    // 'development/sass/js/st-scroll-animate.js',
    // 'development/sass/js/jquery.sliderPro.js',
    // 'development/pre/js/libraries/tab.js',
    // 'development/pre/js/jqloader.js',
    'development/pre/js/functions.js',
    'development/pre/js/app.js'
    // 'development/pre/js/nano.js'
];
// jsLibrary = [''];

sassSources = ['development/pre/scss/app.scss', 'development/pre/scss/componentes.scss'];
htmlSources = [outputDir + '*.html'];
/*End define all html, scss and js files*/

gulp.task('js', function() {
    var b = browserify();
    b.add(jsSources);
    b.transform(reactify)
        .bundle()
        .pipe(source('app.js'))
        .on('error', console.error.bind(console))
        .pipe(gulpif(env === 'production', streamify(uglify())))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
                sass: 'development/pre/scss',
                css: outputDir + 'css',
                image: outputDir + 'images',
                style: sassStyle,
                font: outputDir + 'fonts',
                require: ['susy', 'breakpoint']
            })
            .on('error', gutil.log))
        //    .pipe(gulp.dest( outputDir + 'css'))
        .pipe(connect.reload());
});

gulp.task('lint', function() {
    return gulp.src(outputDir + 'js')
        .pipe(lint({ config: 'eslint.config.json' }))
        .pipe(lint.format());
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js', 'lint']);
    gulp.watch(['development/pre/scss/*.scss', 'development/pre/scss/*/*.scss'], ['compass']);
    gulp.watch('development/*.html', ['html']);
    // gulp.watch('../production/*', ['deploy']);
});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true,
        port: 8080
    });
});


gulp.task('open', function() {
    var o="http://localhost/2016/"+ path.parse(__dirname).base +"/"+ outputDir;
    gulp.src(outputDir+'/index.html')
        .pipe(open({ uri: o}));
});


gulp.task('html', function() {
    gulp.src('development/*.html')
        .pipe(gulpif(env === 'production', htmlmin({
            collapseWhitespace: true,
            removeComments: true
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

// Copy images to production
gulp.task('move', function() {
    gulp.src('./../fonts/**/*.*')
        .pipe(gulp.dest(outputDir + 'fonts'));

    gulp.src('development/images/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')));
    gulp.src('development/csv/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'csv')));
    gulp.src('development/svg/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'svg')));
    gulp.src('development/videos/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'videos')));
});

gulp.task('deploy', function() {
    var conn = ftp.create({
        host: infoserver.servers.development.serverhost,
        user: infoserver.servers.development.username,
        password: infoserver.servers.development.password,
        log: gutil.log
    });
    var globs = [
        outputDir + '*.html',
        outputDir + 'css/*',
        outputDir + 'csv/*',
        outputDir + 'fonts/*',
        outputDir + 'images/**/*',
        outputDir + 'js/*',
        outputDir + 'svg/*',
        outputDir + 'videos/*',
    ];

    return gulp.src(globs, {
            base: outputDir,
            buffer: false
        })
        .pipe(conn.newerOrDifferentSize('infographics/' + path.parse(__dirname).base)) // only upload newer files
        .pipe(conn.dest('infographics/' + path.parse(__dirname).base));

    // .pipe(conn.newerOrDifferentSize('infographics/' + path.parse(path.dirname(path.normalize(__dirname))).base)) // only upload newer files
    // .pipe(conn.dest('infographics/' + path.parse(path.dirname(path.normalize(__dirname))).base));
});

gulp.task('default', ['watch', 'html', 'js', 'lint', 'compass', 'move','open']);
