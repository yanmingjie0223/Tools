const path = require('path');

module.exports = {
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, '../com.genii.cutout/js'),
        filename: 'all.min.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    devServer: {
        compress: true,
        port: 8888,
        hot: true,
        historyApiFallback: true,
    },
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};