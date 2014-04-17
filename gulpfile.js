var args = require('yargs').argv,
    gulp = require('gulp'),
    prompt = require('gulp-prompt'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    pkg = require('./package.json'),
    inject = require('gulp-inject'),
    _ = require('lodash');

const BASE_DESTINATION = 'app/';
const SCRIPTS_DESTINATION = BASE_DESTINATION + 'scripts/';
const APP_NAME = pkg.name;

gulp.task('ng:init', function () {
    var data = {
        module: APP_NAME
    };

    gulp.src('templates/index.html')
        .pipe(template(data))
        .pipe(gulp.dest(BASE_DESTINATION));
});

gulp.task('ng:controller', function () {
    var data = {
        module: APP_NAME,
        controller: args.name + 'Ctrl'
    };

    gulp.src('templates/controller*.txt')
        .pipe(template(data))
        .pipe(rename(function (path) {
            path.dirname = '.';
            path.extname = path.basename.indexOf('.spec') > -1 ? '.spec.js' : '.js';
            path.basename = data.controller;
        }))
        .pipe(gulp.dest(SCRIPTS_DESTINATION + 'controllers/'))
        .on('close', ngInject);

    ngInject();
});

function ngInject() {
    var included = ['controllers/*.js'];
    included = _.map(included, function(pattern) {
        return SCRIPTS_DESTINATION + pattern;
    });

    var excluded = ['controllers/*.spec.js'];
    excluded = _.map(excluded, function(pattern) {
        return '!' + SCRIPTS_DESTINATION + pattern;
    });

    var src = gulp.src(included.concat(excluded), { read: false });
    console.log(included.concat(excluded));

    gulp.src(BASE_DESTINATION + 'index.html')
        .pipe(inject(src))
        .pipe(gulp.dest(BASE_DESTINATION));
};