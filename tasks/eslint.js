const gulp = require("gulp");
const eslint = require("gulp-eslint");

gulp.task("eslint", () => {
  return gulp.src([
    "**/*.js",
    "**/*.jsx",
    "!dist/**",
    "!node_modules/**"
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});
