// @ts-check
// Helper: root() is defined at the bottom

const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const autoprefixer = require('autoprefixer');


/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';
const isTest = ENV === 'test' || isTestWatch;
const isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let config = {};

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isProd) {
        config.devtool = 'source-map';
    } else if (isTest) {
        config.devtool = 'inline-source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = {}

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        // only discover files that have those extensions
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    };

    let atlOptions = '';
    if (isTest && !isTestWatch) {
        // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
        atlOptions = 'inlineSourceMap=true&sourceMap=false';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        rules: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?configFileName=./src/lib/tsconfig.json&' + atlOptions, 'angular2-template-loader', '@angularclass/hmr-loader'],
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
                exclude: root('src', 'demo', 'style'),
                loader: 'raw-loader!postcss-loader!sass-loader'
            },

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
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

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Define env constiables to help with builds
        // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
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
            root('./src/demo/') // location of your src
        ),

        // Tslint configuration for webpack 2
        new webpack.LoaderOptionsPlugin({
            options: {
                /**
                 * Apply the tslint loader as pre/postLoader
                 * Reference: https://github.com/wbuchwalter/tslint-loader
                 */
                tslint: {
                    emitErrors: false,
                    failOnHint: false
                },
                /**
                 * Sass
                 * Reference: https://github.com/jtangelder/sass-loader
                 * Transforms .scss files to .css
                 */
                sassLoader: {
                    //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
                },
                /**
                 * PostCSS
                 * Reference: https://github.com/postcss/autoprefixer-core
                 * Add vendor prefixes to your css
                 */
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

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}