const gulp = require("gulp");
const awspublish = require("gulp-awspublish");
const parallelize = require("concurrent-transform");
const awsconfig = require("../src/config/aws");

/**
 * Publish JS, CSS and image assets to CloudFront.
 */
gulp.task("publish-assets", ["webpack"], () => {
  const publisher = awspublish.create({
    params: {
      Bucket: awsconfig.S3.bucket.name
    }
  });

  const headers = awsconfig.S3.headers;

  return gulp.src(["dist/assets/**/*"])
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers)))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
