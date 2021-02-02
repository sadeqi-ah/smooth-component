import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'src/index.ts',
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
            babelHelpers: 'bundled',
            exclude: '/node_modules/**',
            extensions: ['.js', '.ts', '.tsx', '.jsx']
        }),
        resolve(),
        typescript(),
        commonjs()
    ],
    external: ['react', 'react-dom']
}
