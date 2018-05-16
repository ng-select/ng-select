// @ts-check
const path = require('path');
const webpack = require('webpack');
const root = path.join.bind(path, path.resolve(__dirname, '..'));

const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test:watch';
const isTest = ENV === 'test';

module.exports = function makeWebpackConfig() {
    let config = {
        devtool: 'inline-source-map',
        mode: 'development',
        output: {},
        resolve: {
            extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
        }
    };

    let atlOptions = '';
    if (isTest && !isTestWatch) {
        atlOptions = 'inlineSourceMap=true&sourceMap=false';
    }

    config.module = {
        rules: [
            {
                test: /\.ts$/,
                loader: ['awesome-typescript-loader?configFileName=./tsconfig.test.json&' + atlOptions, 'angular2-template-loader'],
                exclude: [/node_modules\/(?!(ng2-.+))/],
            },

            {
                test: /\.(scss|sass)$/,
                exclude: root('demo', 'style'),
                loader: 'raw-loader!sass-loader'
            },

            { test: /\.html$/, loader: 'raw-loader', exclude: root('src', 'public') }
        ]
    };

    if (isTest) {
        // instrument only testing sources with Istanbul, covers ts files
        config.module.rules.push({
            test: /\.ts$/,
            enforce: 'post',
            include: path.resolve('src'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/, /(search-helper|(window|console)\.service)\.ts$/, /testing/]
        });
    }

    config.module.rules.push({
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader'
    });

    config.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('TEST')
            },
        }),
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            root('./src/') // location of your src
        ),
    ];

    return config;
}();
