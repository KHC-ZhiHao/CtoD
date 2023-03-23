import ESLintPlugin from 'eslint-webpack-plugin'
import path from 'path'

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
    plugins: [
        new ESLintPlugin({
            files: 'lib/**/*.ts'
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
