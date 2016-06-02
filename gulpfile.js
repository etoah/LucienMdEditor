var gulp = require('gulp'),
//  htmlmin = require('gulp-htmlmin'), //htmlѹ��
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    coffee = require('gulp-coffee'),
    coffeeify = require('gulp-coffeeify'),
    coffee = require('gulp-coffee'),
    nodemon=require('gulp-nodemon'),
    runSequence = require("run-sequence");//控制task顺序;

var config =
{
    coffee_files: "./src/**/*.*",
    build_dir: "./dist",
    bin_dir: "./dist/bin",
    outjs: 'LucienMarkdown.js',
    outminjs: 'LucienMarkdown.min.js',
    netsample: './demo/dotnet/PasteImageSample/',
    nodedemosrc:'./demo/nodejs/',
    nodesample: "./demo/nodejs/public/"

}
//clean js
gulp.task('default', function () {
    console.log(config.nodesample);
    gulp.start('clean','compile', 'watch','develop');
});

//coffee
gulp.task('compile', function () {
    return gulp.src(config.coffee_files)
        .pipe(coffeeify())
        .pipe(gulp.dest(config.build_dir))
        .pipe(gulp.dest(config.netsample))
        .pipe(gulp.dest(config.nodesample))
        .pipe(uglify())
        .pipe(rename(config.outminjs))
        .pipe(gulp.dest(config.netsample))
        .pipe(gulp.dest(config.nodesample))
        .pipe(notify({message: 'compile server restarted'}))
});

gulp.task('develop',['compile'],function(){
    nodemon({ script: config.nodedemosrc+'app.js'
        , ext: 'html js'
         })
        .on('restart', function () {
            console.log( ' demo server restarted!');
        })
});

gulp.task('clean', function () {
    return gulp.src([config.build_dir + "/*.js",
            config.bin_dir + "/*.js",
            config.netsample + config.outjs,
            config.netsample + config.outminjs,
            config.nodesample + config.outjs,
            config.nodesample + config.outminjs
        ], {read: false})
        .pipe(clean());
});

gulp.task('watch', function (cb) {
    //coffee
    gulp.watch(config.coffee_files, ['compile'])
    return cb();
});