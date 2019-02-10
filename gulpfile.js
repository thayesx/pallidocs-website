const gulp = require('gulp');
const minify = require('gulp-minify');
const filter = require('gulp-filter');
const child = require('child_process');
const gutil = require('gulp-util');

const paths = {
  scripts: {
    src: 'scripts/src/*.js',
    dest: 'scripts/'
  }
};

gulp.task('formatScripts', done => {
  gulp
    .src(paths.scripts.src)
    .pipe(minify({ext: ".min.js"}))
    .pipe(filter('**/*.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));

    done();
});

gulp.task('jekyll', done => {
  const jekyll = child.spawn('jekyll', ['serve', '--watch', '--incremental', '--drafts']);

  const jekyllLogger = (buffer) => {
    buffer
      .toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll
    .stdout
    .on('data', jekyllLogger);
  jekyll
    .stderr
    .on('data', jekyllLogger);

  done();
});

gulp.task('default', gulp.task('formatScripts'));
gulp.task('serve', gulp.series('formatScripts', 'jekyll'));