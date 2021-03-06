'use strict';

const internals = {};

internals.reporters = new Map([
    ['html', 'coverage.html'],
    ['junit', 'junit.xml'],
    ['clover', 'clover.xml'],
    ['console', 'stdout']
]);

const reporters = Array.from(internals.reporters.keys());
const reportersOutput = Array.from(internals.reporters.values());

module.exports.coverage = true;
module.exports.threshold = 100;
module.exports.lint = false;
module.exports.reporter = reporters;
module.exports.output = reportersOutput;
