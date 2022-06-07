const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const paths = require("./webpack.paths");
const fs = require("fs");
const path = require("path");

const PAGES_DIR = `${paths.src}/pug/page/`;
const PAGES = fs
    .readdirSync(PAGES_DIR)
    .filter(filename => filename.endsWith(".pug"));
PAGES.map(page => console.log(`${page.split(".")[0]}`));
module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendors",
                    test: /node_modules/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    //entry: `${paths.src}/index.js`,
    entry: {
        index: `${paths.src}/js/pages/index.js`,
    },
    output: {
        path: paths.dist,
        filename: "assets/js/[name].[contenthash].js",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                // test: /\.pug$/,
                // use: [
                //     {
                //         loader: "pug-loader",
                //     },
                // ],
                test: /\.pug$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                    {
                        loader: "pug-html-loader",
                        options: {
                            exports: false,
                        },
                    },
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[contenthash][ext][query]",
                },
            },
            // {
            //     test: /\.svg$/,
            //     use: [
            //         {
            //             loader: 'svg-sprite-loader',
            //             options: {
            //                 extract: true,
            //                 spriteFilename: `/assets/img/sprite.svg`,
            //             },
            //         },
            //         {
            //             loader: 'svgo-loader',
            //             options: {
            //                 plugins: [
            //                     {
            //                         name: 'removeAttrs',
            //                         params: {
            //                             attrs: [
            //                                 'fill',
            //                                 'fill-rule',
            //                                 'path:fill',
            //                                 'path:class',
            //                                 'path:stroke',
            //                             ],
            //                         },
            //                     },
            //                 ],
            //             },
            //         },
            //     ],
            // },
        ],
    },
    resolve: {
        alias: {
            assets: path.resolve(__dirname, "src/assets"),
            sass: path.join(__dirname, "src/sass"),
            img: path.resolve(__dirname, "src/assets/img"),
            svg: path.resolve(__dirname, "src/assets/svg"),
            components: path.resolve(__dirname, "src/components"),
        },
    },
    plugins: [
        ...PAGES.map(
            page =>
                new HtmlWebpackPlugin({
                    template: `${PAGES_DIR}/${page}`,
                    filename: `${page.replace(/\.pug/, ".html")}`,
                    inject: true,
                    chunks: ["vendors", `${page.split(".")[0]}`],
                }),
        ),
        new SpriteLoaderPlugin({
            plainSprite: true,
        }),
    ],
};
