module.exports = function(config) {
    'use strict';

    config.set({
        basePath: '../',
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        files: [
            {pattern: 'test/bind.polyfill.js', included: true},
            {pattern: 'test/assign.polyfill.js', included: true},
            {pattern: 'dist/ex-machina.js', included: true},

            // test files
            {pattern: 'test/src/**/*.js', included: true},
        ],
        reporters: ['spec'],
        frameworks: ['jasmine'],
    });
};
