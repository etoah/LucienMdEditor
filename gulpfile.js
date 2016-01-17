var gulp = require('gulp'),
  //  htmlmin = require('gulp-htmlmin'), //htmlѹ��
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');


// Ԥ������
gulp.task('default', ['clean'], function () {
    gulp.start('js', 'copy');
});


gulp.task('js', function () {
    return gulp.src('UploadImage.js')
        .pipe(uglify())
		.pipe(rename("UploadImage.min.js"))
        .pipe(gulp.dest('./'))
        .pipe(notify({message: 'js task complete'}));
});

gulp.task('copy', function () {
    return gulp.src(['UploadImage.js',"UploadImage.min.js"])
        .pipe(gulp.dest("./Sample/PasteImageSample/PasteImageSample"))
		.pipe(notify({message: 'copy task complete'}));
		
});

// ����
gulp.task('clean', function () {
    return gulp.src(['./Sample/PasteImageSample/PasteImageSample/UploadImage.js','./Sample/PasteImageSample/PasteImageSample/UploadImage.min.js'], {read: false})
        .pipe(clean());
});



// ����
gulp.task('watch', function () {

    //js
    gulp.watch('UploadImage.js', ['js']);


});