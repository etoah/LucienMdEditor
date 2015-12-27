var gulp = require('gulp'),
  //  htmlmin = require('gulp-htmlmin'), //html压缩
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');


// 预设任务
gulp.task('default', ['clean'], function () {
    gulp.start('js', 'copy');
});


gulp.task('js', function () {
    return gulp.src('PasteImage.js')
        .pipe(uglify())
		//.pilpe(rename("PasteImage.min.js"))
        .pipe(gulp.dest('/'))
        .pipe(notify({message: 'js task complete'}));
});

gulp.task('copy', function () {
    return gulp.src(['PasteImage.js',"PasteImage.min.js"])
        .pipe(gulp.dest("Sample\PasteImageSample\PasteImageSample"))
		.pipe(notify({message: 'copy task complete'}));
		
});

// 清理
gulp.task('clean', function () {
    return gulp.src(['Sample\PasteImageSample\PasteImageSample\PasteImage.js','Sample\PasteImageSample\PasteImageSample\PasteImage.min.js'], {read: false})
        .pipe(clean());
});



// 看手
gulp.task('watch', function () {

    //js
    gulp.watch('PasteImage.js', ['js']);


});