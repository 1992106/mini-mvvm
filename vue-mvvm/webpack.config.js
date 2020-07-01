const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 删除插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

var babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,
    }
};

module.exports = {
    //入口文件配置
    entry: {
        app: './src/index.tsx'
    },
    //文件导出的配置
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        libraryTarget: 'umd',
    },
    devtool: 'source-map',
    //模块配置
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: "vue-loader"
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    babelLoader,
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: [
                    babelLoader
                ]
            }
        ]
    },
    resolve: {
        //默认后缀
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    // 不打包的文件
    externals: {
        jquery: '$',
    },
    //插件配置
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            dry: false
        }),
        new VueLoaderPlugin()
    ],
}

