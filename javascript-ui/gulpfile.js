"use strict";

/*jslint node: true */
const gulp = require('gulp');
const del = require("del");
const _ = require("lodash");
const jshint = require('gulp-jshint');
const jshintXMLReporter = require('gulp-jshint-xml-file-reporter');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat');


gulp.task("clean", function(cb) {
    del([
        "dist/**/*.js"
    ], cb);
});

gulp.task("scripts", () => {
    gulp.src([
        'src/skynet.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'checkstyle',
            filePath: './jshint.xml',
            alwaysReport: true
        }))
        .pipe(concat('skynet-ui.js'))
        .pipe(gulp.dest("dist"))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("dist"));
});

gulp.task("default", () => {
    gulp.start("scripts");

    gulp.watch(["src/**/*.js"], ["scripts"]);
});
