const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
const paths = require("./webpack.paths");

module.exports = merge(baseWebpackConfig, {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    target: "web",
    devServer: {
        static: paths.dist,
        compress: true,
        port: 9100,
        open: false,
        historyApiFallback: true,
        allowedHosts: "all",
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    module: {
        rules: [
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    { loader: "resolve-url-loader" },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|ico|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/img/[contenthash][ext][query]",
                },
            },
        ],
    },
});
