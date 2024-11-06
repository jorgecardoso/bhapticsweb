const path = require('path');

module.exports = {
    devServer: {
        disableHostCheck: true
    },
    entry: ['./index.js', './bundle.js'],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    output: {
        globalObject: 'this',
        path: __dirname + '/dist',
        filename: process.env.NODE_ENV === 'production' ? 'aframe-bhaptics-component.min.js' : 'aframe-bhaptics-component.js',
        libraryTarget: 'umd'
    },
    resolve: {
        modules: [path.join(__dirname, 'node_modules')]
    }
};
