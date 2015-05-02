module.exports = function(config) {
    'use strict';

    config.set({
        basePath: '../',
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        files: [
            {pattern: 'dist/ex-machina.js', included: true},

            // test files
            {pattern: 'test/src/**/*.js', included: true},
        ],
        reporters: ['spec'],
        frameworks: ['jasmine'],
    });
};
