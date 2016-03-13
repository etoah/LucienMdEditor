var gulp = require('gulp'),
  //  htmlmin = require('gulp-htmlmin'), //htmlѹ��
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    coffee = require('gulp-coffee'),
    coffeeify=require('gulp-coffeeify'),
 runSequence = require("run-sequence");//控制task顺序;

var config=
{
    coffee_files:"./src/*.coffee",
    build_dir:"./dist",
    bin_dir:"./dist/bin",
    outjs:'test.js',
    outminjs:'test.min.js',
    netsample:'./Sample/dotnet/PasteImageSample/',
    nodesample:".//Sample/nodejs/public/"

}
//clean js
gulp.task('default', function () {
    gulp.start('coffee','copy');
    gulp.start('copy','watch');
});

//coffee
gulp.task('coffee', function() {
    return  gulp.src(config.coffee_files)
        .pipe(coffeeify())
        .pipe(gulp.dest(config.build_dir))
      //  .pipe(notify({message: 'coffee task complete'}));
});


//gulp.task('js',['coffee'],function(){
//
//    gulp.src(config.build_dir+"/*.js")
//        .pipe(concat(config.outjs))
//        .pipe(gulp.dest(config.bin_dir))
//        .pipe(uglify())
//        .pipe(rename(config.outminjs))
//        .pipe(gulp.dest(config.bin_dir));
//
//    gulp.src(config.build_dir+'/test.js')
//        .pipe(gulp.dest(config.bin_dir));
//
//       // .pipe(notify({message: 'js task complete'}));
//
//})


//copy to demo
gulp.task('copy', function () {
    return gulp.src("./src"+"/test.coffee")
        .pipe(coffeeify())
        .pipe(gulp.dest(config.netsample))
        .pipe(gulp.dest(config.nodesample))
		.pipe(notify({message: 'copy task complete'}));
});

gulp.task('clean', function () {
    return gulp.src([config.build_dir+"/*.js",
            config. bin_dir+"/*.js",
        './Sample/PasteImageSample/PasteImageSample/'+config.outjs,
       // './Sample/PasteImageSample/PasteImageSample/'+config.outminjs,
        './Sample/nodejs/public/'+config.outjs,
        './Sample/nodejs/public/'+config.outminjs
    ], {read: false})
        .pipe(clean());
});

gulp.task('watch', function (cb) {

    //coffee
    gulp.watch(config.coffee_files, ['coffee', 'copy'])
    return cb();



});