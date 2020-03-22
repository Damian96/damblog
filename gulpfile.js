var package = require('./package'),
	gulp = require('gulp'),
	sass = require('sass'),
	shell = require('shell-exec'),
	print = require('gulp-print'),
	fs = require('fs'),
	del = require('del');

require('console-stamp')(console, 'HH:MM:ss.l')

var paths = {
	layouts: "./layouts/",
	includes: "./includes/",
	out: {
		css: "./_site/assets/main.css"
	}
};

// var clean = function () {
// 	return del([
// 		"./_site/*.*",
// 		"./_site/about/",
// 		"./_site/assets/",
// 		"./_site/jekyll/",
// 		"!./_site/_*/"
// 	]);
// };

var serve = function () {
	return shell("jekyll build --trace --watch").then(() => {
		console.info("Jekyll up and running! :)");
	}).catch((error) => {
		throw error;
	});
};

var compileSass = function () {
	return new Promise((resolve, reject) => {
		sass.render({
			outputStyle: "compressed",
			file: "./minima/_sass/minima.scss",
			sourceMap: true,
			outFile: paths.out.css // only for sourceMap
		}, function (error, result) {
			if (!error) { // No errors during the compilation, write this result on the disk
				fs.writeFile(paths.out.css, result.css, function (err) {
					if (err) {
						throw err;
						// reject();
					} else {
						console.info("Succesfully compiled Sass! :)");
						resolve();
					}
				});
			} else throw error;
		});
	});
};

gulp.task('serve', serve);
// gulp.task('clean', clean);
gulp.task('sass', compileSass);
// gulp.task('build', gulp.series('clean', 'sass'));
gulp.task('watch', function () {
	gulp.watch(paths.sass, compileSass);
});
gulp.task('default', gulp.series('serve', 'watch'));