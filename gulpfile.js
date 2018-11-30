// dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revRewrite = require('gulp-rev-rewrite');
var gulpSequence = require('gulp-sequence');
var filter = require('gulp-filter');

// build sass
gulp.task('sass', function () {
	gulp.src('./css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/css'))
});

// watch sass files for changes, trigger build
gulp.task('sass:watch', function () {
	gulp.watch('./css/**/*.scss', ['sass']);
});

// build HTML and PHP files by copying them over to the build dir
gulp.task('html', function () {    
	return gulp.src('*.{html,php}')
		.pipe(gulp.dest('build'));
});

// watch HTML and PHP files for changes and trigger build
gulp.task('html:watch', function () {
	gulp.watch('*.{html,php}', ['html']);
});

// build images by copying them over to the build dir
gulp.task('images', function () {
	return gulp.src('./images/**')
		.pipe(gulp.dest('./build/images'));
});

// watch for changes to images and trigger build
gulp.task('images:watch', function () {
	gulp.watch('./images/**', ['images']);
});

// build JS by copying over to build dir
gulp.task('js', function () {
	return gulp.src('./js/**')
		.pipe(gulp.dest('./build/js'));
});

// watch JS files for changes and trigger build
gulp.task('js:watch', function () {
	gulp.watch('./js/**', ['js']);
});

// run a webserver with live reload
gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      host: '0.0.0.0',
      fallback: 'index.html',
      proxies: [{source: '/random-photo.php', target: 'http://127.0.0.1:8001/random-photo.php'}]
    }));
});

// delete the build dir
gulp.task('clean:build', function() {
	return gulp.src('build', {read: false})
    	.pipe(clean());
});

// delete the dist dir
gulp.task('clean:dist', function() {
	return gulp.src('dist', {read: false})
    	.pipe(clean());
});

// copy build dir over to dist
gulp.task('build:dist', function () {
	return gulp.src('./build/**')
		.pipe(gulp.dest('./dist'));
});

// hash static assets and edit references in the HTML inside dist
gulp.task('create-dist', function() {
	var assetFilter = filter(['dist/**/*.{js,css,html}', '!dist/**/index.html'], { restore: true });
	gulp.src('dist/**', {base: 'dist'})
		.pipe(assetFilter)
		.pipe(rev()) // Add hashes to the files' names
    	.pipe(assetFilter.restore)
    	.pipe(revRewrite())
    	.pipe(gulp.dest('dist')); // Write the manifest file (see note below)
});

// minify CSS inside dist
gulp.task('clean-css', function() {
	gulp.src('dist/css/**/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('dist/css'));
});

// developing
gulp.task('default', gulpSequence('clean:build', ['webserver', 'images', 'images:watch', 'html', 'html:watch', 'sass', 'sass:watch', 'js', 'js:watch']));

// building for production
gulp.task('dist', gulpSequence('clean:dist', ['images', 'html', 'sass', 'js'], 'build:dist', 'clean-css', 'create-dist'));