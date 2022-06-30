const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const del = require("del");
const pug = require("gulp-pug");
const include = require("gulp-include");
const webpack = require("webpack-stream");
const named = require("vinyl-named");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

const clean = path => cb => {
    del([path]);
    cb();
};

const sync = () =>
    browserSync.init({
        server: {
            baseDir: "dist",
        },
        ui: {
            port: 8080,
        },
    });

const jsTask = cb =>
    src("./src/js/pages/main.js")
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(
            webpack({
                mode: "development",
            }),
        )
        .pipe(sourcemaps.write("."))
        .pipe(dest("./dist"));

const pugTask = cb =>
    src("./src/pug/page/index.pug").pipe(pug()).pipe(dest("./dist"));

const sassTask = cb =>
    src("./src/style/page/style.sass")
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass())
        .pipe(sourcemaps.write("."))
        .pipe(dest("./dist"));

const watchTask = () => {
    watch("./src/js/pages/main.js", series(clean("./dist/main.js"), jsTask)).on(
        "change",
        browserSync.reload,
    );
    watch("./src/fitures/**/*", series(clean("./dist/*.html"), pugTask)).on(
        "change",
        browserSync.reload,
    );
    watch("./src/pug/page/*", series(clean("./dist/*.html"), pugTask)).on(
        "change",
        browserSync.reload,
    );
    watch("./src/**/*.sass", series(clean("./dist/*.css"), sassTask)).on(
        "change",
        browserSync.reload,
    );
};

exports.js = jsTask;

exports.watch = watchTask;

exports.browserSync = parallel(sync, watchTask);

exports.default = parallel(
    series(clean("./dist/main.js"), jsTask),
    series(clean("./dist/*.html"), pugTask),
    series(clean("./dist/*.css"), sassTask),
);
