const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {TsConfigPathsPlugin} = require('awesome-typescript-loader');

const root = path.join.bind(path, path.resolve(__dirname, '..'));

const ENV = process.env.npm_lifecycle_event;
const isProd = ENV === 'build:demo';

module.exports = function makeWebpackConfig() {
    let config = {
        mode: isProd ? 'production' : "development",
        devtool: isProd ? 'source-map' : 'eval-source-map',
        entry: {
            'app': './demo/main.ts',
            'polyfills': './demo/polyfills.ts'
        },
        output: {
            path: root('dist'),
            publicPath: isProd ? 'ng-select' : 'http://localhost:8080/',
            filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
            chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]polyfills[\\/]/,
                        name: 'polyfills',
                        chunks: 'all'
                    }
                }
            },
            minimize: isProd
        },
        resolve: {
            extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
            plugins: [
                new TsConfigPathsPlugin({
                    configFileName: './demo/tsconfig.json',
                    compiler: 'typescript'
                })
            ]
        },
        module: {
            rules: [
            {
                test: /\.ts$/,
                loader: ['awesome-typescript-loader?configFileName=./demo/tsconfig.json', 'angular2-template-loader', 'ng-snippets-loader'],
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/],
            },

            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader'
            },

                // copy those assets to output
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
                },

                // all scss files in app demo style will be merged to index.html
                {
                    test: /\.scss$/,
                    include: root('demo', 'style'),
                    use: [
                    {
                            loader: "style-loader" // creates style nodes from JS strings
                        },
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: "sass-loader" // compiles Sass to CSS
                        }
                        ]
                    },

                // all themes will be added to bundle as usable
                {
                    test: /(theme)\.scss$/,
                    loader: 'style-loader/useable!css-loader!sass-loader'
                },

                // all css required in ng-select files will be merged in js files
                {
                    test: /\.(scss|sass)$/,
                    exclude: [root('demo', 'style'), root('src', 'themes')],
                    loader: 'raw-loader!sass-loader'
                },
                
                // support for .html as raw text
                {test: /\.html$/, loader: ['raw-loader', 'ng-snippets-loader'], exclude: root('src', 'public')}
                ]
            },
            plugins: [
                // Workaround needed for angular 2 angular/angular#11580
                new webpack.ContextReplacementPlugin(
                    // The (\\|\/) piece accounts for path separators in *nix and Windows
                    /(.+)?angular(\\|\/)core(.+)?/,
                    root('./demo/') // location of your src
                    ),

                // Tslint configuration for webpack 2
                new webpack.LoaderOptionsPlugin({
                    options: {
                        tslint: {
                            emitErrors: false,
                            failOnHint: false
                        }
                    }
                }),

                new HtmlWebpackPlugin({
                    template: './demo/index.ejs',
                    chunksSortMode: 'dependency',
                    basePath: isProd ? '/ng-select' : '/',
                    ngSelectVersion: require(root('./src/package.json')).version
                }),

                new CopyWebpackPlugin([
                    {
                        from: root('./demo/assets'), to: 'assets'
                    }
                ])
            ],
            devServer: {
                contentBase: './demo',
                historyApiFallback: true,
                quiet: false,
                stats: { colors: true }
            }
        };


    // Add build specific plugins
    if (isProd) {
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    }

    return config;
}();
