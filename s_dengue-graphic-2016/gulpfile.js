var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    path = require('path'),
    ftp = require('vinyl-ftp'),
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
    'development/sass/js/leaflet-src.js',
    'development/sass/js/leaflet-search.js',
    'development/sass/js/jqloader.js',
    // 'development/sass/js/highcharts.js',
    // 'development/sass/js/parallax.js',
    // 'development/sass/js/st-scroll-animate.js',
    // 'development/sass/js/jquery.sliderPro.js',
    // 'development/sass/js/tab.js',

    'development/sass/js/functions.js',
    'development/sass/js/file.js',
    'development/sass/js/nano.js'
];
jsLibrary = [];

sassSources = ['development/sass/scss/file.scss', 'development/sass/scss/componentes.scss'];
htmlSources = [outputDir + '*.html'];
/*End define all html, scss and js files*/

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('file.js'))
        .pipe(gulpif(env === 'development', browserify({
            shim: {
                // TweenMax: {
                //     path: "./node_modules/gsap/src/uncompressed/TweenMax.js",
                //     exports: "TweenMax"
                // },
                // TimelineMax: {
                //     path: './node_modules/gsap/src/uncompressed/TimelineMax.js',
                //     exports: 'TimelineMax',
                //     depends: {
                //         TweenMax: "TweenMax"
                //     }
                // },
                // ScrollMagic: {
                //     path: './node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
                //     exports: 'ScrollMagic'
                // },
                // addIndicators: {
                //     path: './node_modules/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
                //     exports: 'addIndicators'
                // },
                // gsap: {
                //     path: './node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
                //     exports: 'gsap',
                //     depends: {
                //         ScrollMagic: "ScrollMagic",
                //         TimelineMax: "TimelineMax",
                //         addIndicators: "addIndicators"
                //     }
                // }
            }
        })))
        .pipe(gulpif(env === 'production', browserify({
            shim: {
                // TweenMax: {
                //     path: "./node_modules/gsap/src/uncompressed/TweenMax.js",
                //     exports: "TweenMax"
                // },
                // TimelineMax: {
                //     path: './node_modules/gsap/src/uncompressed/TimelineMax.js',
                //     exports: 'TimelineMax',
                //     depends: {
                //         TweenMax: "TweenMax"
                //     }
                // },
                // ScrollMagic: {
                //     path: './node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
                //     exports: 'ScrollMagic'
                // },
                // gsap: {
                //     path: './node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
                //     exports: 'gsap',
                //     depends: {
                //         ScrollMagic: "ScrollMagic",
                //         TimelineMax: "TimelineMax"
                //     }
                // }
            }
        })))
        .on('error', gutil.log)
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());

    gulp.src(jsLibrary)
        .on('error', gutil.log)
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
                sass: 'development/sass/scss',
                css: outputDir + 'css',
                image: outputDir + 'images',
                style: sassStyle,
                font: outputDir + 'fonts',
                require: ['susy', 'breakpoint']
            })
            .on('error', gutil.log))
        //    .pipe(gulp.dest( outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(['development/sass/scss/*.scss', 'development/sass/scss/*/*.scss'], ['compass']);
    gulp.watch('development/*.html', ['html']);
    // gulp.watch('../production/*', ['deploy']);
});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true,
        port: 8888
    });
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
    gulp.src('./../fonts/*.*')
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

gulp.task('default', ['watch', 'html', 'js', 'compass', 'move', 'connect']);