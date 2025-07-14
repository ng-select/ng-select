// Karma configuration file for ng-option-highlight library
module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-coverage'),
			require('karma-jasmine-html-reporter'),
			require('@angular/build'),
		],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
		},
		coverageReporter: {
			dir: require('path').join(__dirname, '../../coverage/'),
			subdir: 'ng-option-highlight',
			reporters: [
				{ type: 'html' },
				{ type: 'lcovonly' },
				{ type: 'text-summary' }
			],
			fixWebpackSourcePaths: true,
		},
		reporters: ['progress', 'kjhtml', 'coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false,
		restartOnFileChange: true,
	});
};
