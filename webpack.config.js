module.exports = {
    entry: {
        stateMachine: './src/ex-machina.js',
    },
    resolve:{
        modulesDirectories: [
            'node_modules',
            'src'
        ]
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    output: {
        path: './dist',
        filename: '[name].js',
        library: 'exMachina',
        libraryTarget: 'umd'
    }
}
