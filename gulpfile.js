var gulp = require('gulp'),
  //  htmlmin = require('gulp-htmlmin'), //htmlѹ��
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    coffee = require('gulp-coffee'),
    coffeeify=require('gulp-coffeeify');

var config=
{
    coffee_files:"./src/*.coffee",
    build_dir:"./dist",
    bin_dir:"./dist/bin/",
    outjs:'LucienMardown.js',
    outminjs:'LucienMardown.min.js',
    netsample:'./Sample/dotnet/PasteImageSample/',
    nodesample:".//Sample/nodejs/public/"

}
//clean js
gulp.task('default', ['clean'], function () {
    gulp.start('clean','coffee','js', 'copy','watch');
});

//coffee
gulp.task('coffee', ['clean'], function() {
    gulp.src(config.coffee_files)
        .pipe(coffeeify())
        .pipe(gulp.dest(config.build_dir))
        .pipe(notify({message: 'coffee task complete'}));
});


gulp.task('js',function(){
    gulp.src(config.build_dir+"/*.js")
        .pipe(concat('LucienMardown.js'))
        .pipe(gulp.dest(config.bin_dir))

        .pipe(uglify())
        .pipe(rename(config.outminjs))
        .pipe(gulp.dest(config.bin_dir))

        .pipe(notify({message: 'js task complete'}));

})


//copy to demo
gulp.task('copy',['js'], function () {
    return gulp.src(config.bin_dir+"/*.js")
        .pipe(gulp.dest(config.netsample))
        .pipe(gulp.dest(config.nodesample))
		.pipe(notify({message: 'copy task complete'}));
		
});

gulp.task('clean', function () {
    return gulp.src(['config.build_dir','./Sample/PasteImageSample/PasteImageSample/UploadImage.js','./Sample/PasteImageSample/PasteImageSample/UploadImage.min.js'], {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {

    //coffee
    gulp.watch(config.coffee_files,['clean','coffee','js', 'copy'])



});