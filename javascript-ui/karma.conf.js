// Karma configuration
// Generated on Wed Aug 03 2016 09:47:55 GMT-0400 (EDT)
"use strict";

module.exports = function(config) {
    // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 55,
      platform: 'Windows 10'
    }
  };

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
        'test/libs/jquery.js',
        'src/skynet.js',
        'test/methods/**/*.js',

        'test/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        // 'test/fixtures/*.html': ['html2js'],
        'src/**/*.js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'junit', 'spec', 'saucelabs'],

    // the default configuration
    junitReporter: {
        outputDir: '', // results will be saved as $outputDir/$browserName.xml
        outputFile: 'junit.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
        suite: '', // suite will become the package name attribute in xml testsuite element
        useBrowserName: false, // add browser name to report and classes names
        nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
        classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
        properties: {} // key value pair of properties to add to the <properties> section of the report
    },

    coverageReporter: {
        reporters: [
            {type: 'text'},
            {type: 'clover', dir: 'coverage/', subdir: '.', file: 'clover.xml'},
            {type : 'html', dir : 'coverage/' }
        ],
        check: {
            global: {
                statements: 90,
                branches: 80,
                functions: 90,
                lines: 90
            }
        }
    },

    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'], // Chrome is an option for local use
      browserDisconnectTolerance: 5, //option allows you to define a tolerance level with flaky network-link between Karma and browsers
      browserNoActivityTimeout: 20000, //wait for a message from a browser before disconnecting from it (in ms).
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true
  });

    // Continuous Integration mode
    if (!!process.env.TUNNEL_IDENTIFIER) {
        // if true, Karma captures browsers, runs the tests and exits
        config.singleRun = true;
        // enable / disable watching file and executing tests whenever any file changes
        config.autoWatch = false;

        config.sauceLabs = {
            testName: 'Skynet-UI Unit Tests',
            recordScreenshots: false,
            startConnect: false,
            build: process.env.bamboo_buildNumber,
            connectOptions: {
                tunnelIdentifier: process.env.TUNNEL_IDENTIFIER
            }
        };

        // Browsers to run on Sauce Labs
        // Check out https://saucelabs.com/platforms for all browser/OS combos
        config.customLaunchers = customLaunchers;
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        config.browsers = Object.keys(customLaunchers);
        // Increase timeout in case connection in CI is slow
        config.captureTimeout = 120000;
    } else {
        // Concurrency level
        // how many browser should be started simultaneous
        config.concurrency = Infinity;
    }
}
