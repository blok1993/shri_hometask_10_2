const production = false;

module.exports = {
    entry: './app/suggest.js',
    devtool: production ? false : "inline-sourcemap",
    output: {
        path: __dirname + "/dist",
        filename: 'main.bundle.js'
    }
};