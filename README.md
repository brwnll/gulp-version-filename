Gulp Version Filename ![circle ci](https://circleci.com/gh/brwnll/gulp-version-filename.svg?style=shield&circle-token=:circle-token) ![code climate](https://codeclimate.com/github/brwnll/gulp-version-filename/badges/gpa.svg)
=====================

Takes the version number from within a file and adds it to the filename. This
is specifically useful for pipelines outputting JS or CSS files. Allows for
versioning controlled by you, instead of a hash, allowing for the use of human
understandable sequencing (such as semver).

```
eg: myjslibrary-2.1.0.min.js
```


How to Use
----------

Install module.
```bash
npm install gulp-version-filename
```


Somewhere Within Your CSS/JS/etc File
```css
/**
 * My File
 * @version 8.12.12
 */
```

gulpfile.js

```javascript

var filever = require('gulp-version-filename');


/**
 * Takes the version number and adds it to the filename
 */
gulp.task('rename', function() {
  return gulp.src(['newcssfile.css'])
    .pipe(filever())
    .pipe(gulp.dest('dist'));
});

```

```bash
gulp rename
````

You should now have 
```bash
dist/newcssfile-8.12.12.css
```

Options
-------

- key

    Pass to change the version variable tag within the file, defaults to 'version'

- silent

    Pass to suppress errors thrown if the version parameter is not found within
    a file.


```javascript
gulp.task('rename', function() {
  return gulp.src(['*.css', '*.js'])
    .filever({
      key: 'package', // Searches for @package
      silent: true // Suppress errors if file is missing @package
    })
    .pipe(gulp.dest('dist'));
});
```
