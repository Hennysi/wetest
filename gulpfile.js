import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import nodeSass from 'node-sass';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import webpackStream from 'webpack-stream';
import streamToPromise from 'gulp-promisify';
import plumber from 'gulp-plumber';
import url from 'url';

const server = browserSync.create();
const sass = gulpSass(nodeSass);

// For browser sync
const siteUrl = 'http://startertheme.local/';
const siteTheme = 'rTheme';
const URL = url.parse(siteUrl);

// SCSS compile and minify
export function compileSass() {
    return gulp
        .src('assets/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(server.stream());
}

// JS compile and minify
export function minifyJS() {
    return streamToPromise(gulp.src('assets/js/scripts.js')
        .pipe(plumber()) // Использование gulp-plumber
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('assets/js')));
}


// Convert to WEBp
export function convertToWebP() {
    return gulp
        .src('assets/images/*.{jpg,jpeg,png}')
        .pipe(imagemin())
        .pipe(webp())
        .pipe(gulp.dest('assets/images'));
}

// BrowserSync
export function serve() {
    server.init({
        proxy: siteUrl,
        https: true,
        files: ["assets/js/scripts.js"],
        serveStatic: ["./"],
        rewriteRules: [{
                match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + siteTheme + "/assets/js/scripts.min.js"),
                fn: function () {
                    return "assets/js/scripts.min.js"
                }
            },
            {
                match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + siteTheme + "/assets/css/style.min.css"),
                fn: function () {
                    return "assets/css/style.min.css"
                }
            },
            {
                match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + siteTheme + "/.*\\.php"),
                fn: function (match) {
                    if (typeof match === 'string') {
                        let filename = match.split('/').pop();
                        return filename;
                    }
                    return match;
                }
            },
            {
                match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + siteTheme + "/templates/.*\\.php"),
                fn: function (match) {
                    if (typeof match === 'string') {
                        let filename = match.split('/templates/').pop();
                        return 'templates/' + filename;
                    }
                    return match;
                }
            },
            {
                match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + siteTheme + "/parts/.*\\.php"),
                fn: function (match) {
                    if (typeof match === 'string') {
                        let filename = match.split('/parts/').pop();
                        return 'parts/' + filename;
                    }
                    return match;
                }
            },
            {
                match: /AIzaSyBgg23TIs_tBSpNQa8RC0b7fuV4SOVN840/g,
                replace: "AIzaSyAZteVk16ICKxgLgH87g1D0nnG5_bC2xPI"
            }
        ],
    });

    gulp.watch('assets/scss/**/*.scss', compileSass);
    gulp.watch('assets/scss/inc/*.scss', compileSass);
    gulp.watch('assets/js/scripts.js', minifyJS);
}