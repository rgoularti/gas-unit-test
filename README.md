# gas-unit-test
Sample Google Apps Script project that provides an alternative for the development of unit tests and code coverage checks.
The Unit tests were written using Jasmine and Code Coverage checked by Istanbul.

## Requirements
- Create a Google Apps Script Project and setup your script id on the **.clasp.json** file.
- Install [Clasp](https://github.com/google/clasp)
- Install [Gulp](https://github.com/gulpjs/gulp)

## NPM Tasks (Scripts)
- **_npm run build_**
Runs a gulp task that will get all sources that should be deployed, on a given app script project, and put on the _/dist_ folder.
- **_npm run deploy_**
Runs the build task and after a successfull execution push the files of the _/dist_ folder to the app script project.
- **_npm run test_**
Runs a gulp task that will update all sources that should be tested adding to each file a _Import / Export_ statement, based on the **map.js** files, and copying then to the _/test_src_ folder. After this, runs instanbul and jasmine on the generated folder.

## TODO's
- Publish the **gulp-dependency.js** file on the _NPM_ as a custom pipe for _Gulp_.