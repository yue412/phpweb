var path = require('path');
let UglifyJsPlugin=require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [

    ],
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: true,
            }
          })
        ]
    }
};