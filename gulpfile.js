var gulp = require('gulp');

var coffee = require('gulp-coffee');

var version = '0.1.1'

var paths = {
  scripts: [
  	'src/**/*.coffee'
  ]
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('public/js'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch']);
