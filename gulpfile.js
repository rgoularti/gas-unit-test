let gulp = require('gulp');
let fs = require('fs');
let path = require('path');
var dependecy = require('./src/utils/gulp-dependency')

gulp.task('build', function() {
  let serverFiles = walkSync('src/server', undefined, true);
  console.log('copying ' + serverFiles.length + ' server files...');
  return gulp.src(serverFiles)
    .pipe(gulp.dest('./dist'));
});

gulp.task('buildTestSources', function() {
  let addonFiles = walkSync('src/server', undefined, true);
  let mappingFiles = walkSync('spec/mapping', undefined, true).filter(function(file) {
    return path.basename(file).includes('.map.js');
  });
  console.log('copying ' + addonFiles.length + ' testing files...');
  return gulp.src(addonFiles)
    .pipe(dependecy.inject(mappingFiles))
    .pipe(gulp.dest('./test_src'));
});

let walkSync = (dir, filelist, includeJs) => {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist, includeJs);
    } else {
      if (includeJs) {
        filelist.push(path.join(dir, file));
      } else if (!file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};