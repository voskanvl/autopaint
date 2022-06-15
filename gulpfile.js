const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const del = require("del");
const pug = require("gulp-pug");
const include = require("gulp-include");
const fileinclude = require("gulp-file-include");
const webpack = require("webpack-stream");
const named = require("vinyl-named");
const sourcemaps = require("gulp-sourcemaps");

const DIST = "./dist";

function clean(cb) {
    del(["./dist"]);
    cb();
}

const jsTask = cb =>
    src("./src/js/pages/main.js")
        .pipe(sourcemaps.init())
        .pipe(
            webpack({
                mode: "development",
            }),
        )
        .pipe(sourcemaps.write())
        .pipe(dest("./dist"));

const pugTask = cb =>
    src("./src/pug/page/index.pug").pipe(pug()).pipe(dest("./dist"));

const sassTask = cb =>
    src("./src/style/page/style.sass")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(dest("./dist"));

exports.watch = () => {
    watch("./src/js/pages/index.js", jsTask);
    watch("./src/pug/page/*", pugTask);
    watch("./src/**/*.sass", sassTask);
};
exports.js = jsTask;

exports.default = parallel(jsTask, pugTask, sassTask);
