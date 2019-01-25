const gulp = require('gulp');
const minify = require('gulp-minify');
var concat = require('gulp-concat');
const filter = require('gulp-filter');

const paths = {
  scripts: {
    src: 'src/*.js',
    dest: 'scripts/'
  }
};

function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(minify({ext: ".min.js"}))
    .pipe(filter('**/*.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

gulp.task('default', scripts);