/**
 * Created by sasoli on 2018/2/9.
 */
const gulp = require('gulp'),
    bs = require('browser-sync'),
    reload = bs.reload;

gulp.task('default',() => {
    bs.init({
    server: {
        // baseDir: "./"
    }
});
gulp.watch("css/*.css").on('change', reload);
gulp.watch("js/*.js").on('change', reload);
gulp.watch("*.html").on('change', reload);
});