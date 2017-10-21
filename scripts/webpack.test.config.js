// @ts-check
const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const autoprefixer = require('autoprefixer');

const root = path.join.bind(path, path.resolve(__dirname, '..'));

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test:watch';
const isTest = ENV === 'test' || isTestWatch;

module.exports = function makeWebpackConfig() {
    let config = {};

    if (isTest) {
        config.devtool = 'inline-source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    config.output = {}

    config.resolve = {
        // only discover files that have those extensions
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    };

    let atlOptions = '';
    if (isTest && !isTestWatch) {
        // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
        atlOptions = 'inlineSourceMap=true&sourceMap=false';
    }

    config.module = {
        rules: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?configFileName=./src/tsconfig.json&' + atlOptions, 'angular2-template-loader'],
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/],
            },

            // copy those assets to output
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
            },

            // Support for *.json files.
            {test: /\.json$/, loader: 'json-loader'},

            // scss support
            {
                test: /\.(scss|sass)$/,
                exclude: root('demo', 'style'),
                loader: 'raw-loader!postcss-loader!sass-loader'
            },

            {test: /\.html$/, loader: 'raw-loader', exclude: root('src', 'public')}
        ]
    };

    if (isTest && !isTestWatch) {
        // instrument only testing sources with Istanbul, covers ts files
        config.module.rules.push({
            test: /\.ts$/,
            enforce: 'post',
            include: path.resolve('src'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
        });
    }

    if (!isTest || !isTestWatch) {
        // tslint support
        config.module.rules.push({
            test: /\.ts$/,
            enforce: 'pre',
            loader: 'tslint-loader'
        });
    }

    config.plugins = [
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        }),

        // Workaround needed for angular 2 angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            root('./src/') // location of your src
        ),

        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: false,
                    failOnHint: false
                },
                sassLoader: {
                    //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
                },
                postcss: [
                    autoprefixer({
                        browsers: ['last 2 version']
                    })
                ]
            }
        })
    ];


    return config;
}();
