import typescript from 'rollup-plugin-typescript3'
import pkg from './package.json'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'

export default {
    input: 'src/index.tsx',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
            strict: false
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    plugins: [
        postcss({
            modules: true
        }),
        babel({
            exclude: '/node_modules/**'
        }),
        resolve(),
        typescript()
    ],
    external: ['react', 'react-dom', '@material-ui/core']
}
