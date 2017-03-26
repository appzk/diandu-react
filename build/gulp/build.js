'use strict'
var gulp = require('gulp')
var gutil = require('gulp-util')
var stylus = require('gulp-stylus')
var nib = require('nib')
var mincss = require('gulp-cssnano')
var replace = require('gulp-replace')
var plumber = require('gulp-plumber')
var include = require('gulp-include')
var gulpif = require('gulp-if')
var sourcemaps = require('gulp-sourcemaps')
var cache = require('gulp-cached')
var livereload = require('gulp-livereload')
var webpack = require("webpack")

var svginline = require('./svginline')
var webpackConfig = require("../../webpack.config.js")
var config = require('../config.js')

var REGEX = global.REGEX
var REG_BUILD = global.REG_BUILD
var IMG_FILE = global.IMG_FILE

//把图片移动构建目录
gulp.task('build-img', function () {
    return gulp.src(IMG_FILE, { base: 'src' })
        .pipe(gulpif(!global.is_production, cache()))
        .pipe(gulp.dest(config.output))
})

//把css文件移动到发布目录
gulp.task('move-css', function () {
    return gulp.src(['src/**/*.css', '!src/**/_*.css'], { base: 'src' })
        .pipe(gulpif(!global.is_production, cache()))
        .pipe(gulp.dest(config.output))
})

//把js文件移动到发布目录
gulp.task('move-js', function () {
    return gulp.src(['src/**/*.js', '!src/**/_*.js'], { base: 'src' })
        .pipe(gulpif(!global.is_production, cache()))
        .pipe(gulp.dest(config.output))
})

//把php文件移动到发布目录
gulp.task('move-php', function () {
    return gulp.src(['src/php/**/*.*'], { base: 'src' })
        .pipe(gulpif(!global.is_production, cache()))
        .pipe(gulp.dest(config.output))
})

//替换html中的路径
gulp.task('build-html', function () {
    return gulp.src('src/**/*.html', { base: 'src' })
        .pipe(gulpif(!global.is_production, cache()))
        .pipe(svginline({ basePath: './src' }))
        .pipe(gulpif(!global.is_production, replace(REGEX, REG_BUILD)))
        .pipe(gulp.dest(config.output))
        .pipe(gulpif(!global.is_production, livereload()))
})

//打包js
gulp.task("webpack:build-js", ['move-js'], function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-js", err)
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }))
        callback()
    })
})

//替换 js 里面的路径，依赖 webpack:build-js
gulp.task('webpack-js', ['webpack:build-js'], function () {
    return gulp.src('dist/**/*.js', { base: 'dist' })
        .pipe(gulpif(!global.is_production, cache()))
        .pipe(svginline({ basePath: './dist' }))
        .pipe(gulpif(!global.is_production, replace(REGEX, REG_BUILD)))
        .pipe(gulp.dest(config.output))
        .pipe(gulpif(!global.is_production, livereload()))
})
