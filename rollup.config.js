import babelPluginFactory from "rollup-plugin-babel";


// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/vue.js',
        format: 'umd',
        name: 'Vue',
        sourcemap: true
    },
    plugins: [
        babelPluginFactory({
            exclude: './node_modules/**'
        })
    ]
}