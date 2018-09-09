var gulp = require('gulp');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

gulp.task('copyLibraries', function () {
	var sources = [
		'./bower_components/jquery/dist/jquery.min.js',
		'./bower_components/jquery-mask-plugin/dist/jquery.mask.min.js'
	];
    gulp.src(sources)
        .pipe(gulp.dest('./js/'));
});

gulp.task('minifyJS', function () {
	var sources = ['./js/main.js'];
	gulp.src(sources)
		.pipe(minify({
			ext: {
				min: '.min.js',
			},
			mangle: false,
		}))
		.pipe(gulp.dest('./js/'));
});

gulp.task('minifyCSS', function () {
	var sources = ['./css/fontawesome.css'];
	gulp.src(sources)
	    .pipe(cleanCSS())
		.pipe(rename({
	    	suffix: '.min'
	    }))
	    .pipe(gulp.dest('./css/'));
});

gulp.task('default', ['copyLibraries', 'minifyJS', 'minifyCSS']);
