const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = merge(baseWebpackConfig, {
    mode: "production",
    devtool: false,
    target: "browserslist",
    module: {
        rules: [
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
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
                type: "asset",
                generator: {
                    filename: "assets/img/[contenthash][ext][query]",
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].[contenthash].css",
            chunkFilename: "[id].css",
        }),

        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
        }),
    ],
});
