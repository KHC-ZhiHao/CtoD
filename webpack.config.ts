import ESLintPlugin from 'eslint-webpack-plugin'
import path from 'path'
import nodeExternals from 'webpack-node-externals'

export default {
    mode: 'production',
    entry: './lib/index.ts',
    output: {
        library: 'ctod',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'index.js',
        globalObject: 'this || (typeof window !== \'undefined\' ? window : global)'
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false
    },
    resolve: {
        extensions: ['.ts']
    },
    externalsPresets: {
        node: true
    },
    externals: [
        nodeExternals()
    ],
    plugins: [
        new ESLintPlugin({
            files: 'lib/**/*.ts',
            fix: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
}
