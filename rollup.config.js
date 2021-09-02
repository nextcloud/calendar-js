const pkg = require('./package.json')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const commonjs = require('@rollup/plugin-commonjs')
const { babel } = require('@rollup/plugin-babel')
const { terser } = require('rollup-plugin-terser')

/**
 * Create a configuration for a rollup bundle using a custom output definition.
 *
 * @param {object} output Rollup config output definition.
 * @return {object} Full rollup config for a bundle.
 */
function createConfig(output) {
	return {
		input: 'src/index.js',
		output: {
			name: pkg.name,
			sourcemap: true,
			...output,
		},
		plugins: [
			nodeResolve(),
			json(),
			commonjs(),
			babel({
				babelHelpers: 'bundled',
			}),
			(process.env.NODE_ENV === 'production' && terser()),
		],
		external: Object.keys(pkg.dependencies),
	}
}

module.exports = [
	createConfig({
		file: pkg.main,
		format: 'umd',
	}),
	createConfig({
		file: pkg.module,
		format: 'esm',
	}),
]
