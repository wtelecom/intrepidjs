var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')

gulp.task('server', function () {
  nodemon({ script: 'app.js', ext: 'html js', ignore: ['ignored.js'] })
    .on('restart', function () {
      console.log('restarted!')
    })
})

// default gulp task
gulp.task('default', ['server'], function() {
});
