const pkg = require('./package.json')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const commonjs = require('@rollup/plugin-commonjs')
const { babel } = require('@rollup/plugin-babel')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')

module.exports = {
	input: 'src/index.js',
	output: [
		{
			name: pkg.name,
			file: pkg.main,
			format: 'umd',
			sourcemap: true,
		},
		{
			name: pkg.name,
			file: pkg.module,
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [
		peerDepsExternal(),
		nodeResolve(),
		json(),
		commonjs(),
		babel({
			babelHelpers: 'bundled',
		}),
	],
}
