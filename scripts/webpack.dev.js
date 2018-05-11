const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const root = path.join.bind(path, path.resolve(__dirname, '..'));

const ENV = process.env.npm_lifecycle_event;
const isProd = ENV === 'build:demo';

module.exports = function makeWebpackConfig() {
    let config = {
        devtool: isProd ? 'source-map' : 'eval-source-map',
        mode: isProd ? 'production' : 'development',
        entry: {
            'polyfills': './demo/polyfills.ts',
            'app': './demo/main.ts',
        },
        output: {
            path: root('dist'),
            publicPath: isProd ? 'ng-select' : 'http://localhost:8080/',
            filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
            chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
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
                    loader: 'style-loader!css-loader!sass-loader'
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
                { test: /\.html$/, loader: ['raw-loader', 'ng-snippets-loader'], exclude: root('src', 'public') }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './demo/index.ejs',
                chunksSortMode: 'dependency',
                basePath: isProd ? '/ng-select' : '/',
                ngSelectVersion: require(root('./src/package.json')).version
            }),

            new CopyWebpackPlugin([{
                from: root('./demo/assets'), to: 'assets'
            }])
        ],
        devServer: {
            contentBase: './demo',
            historyApiFallback: true,
            quiet: false,
            stats: { colors: true }
        }
    };

    return config;
}();
