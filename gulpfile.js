const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
  gulp
    .src('./src/**/*.ts')
    .pipe(
      // 使用 .babelrc 配置
      babel()
    )
    .pipe(gulp.dest('./dist/'))
);

if (process.env.NODE_ENV !== 'production') {
  gulp.watch('./src/**/*.ts', gulp.series('default'));
}
