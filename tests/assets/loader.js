const fs = require('fs')

/**
 * global helper function to load an ics asset by name
 *
 * @param {string} assetName
 * @return {string}
 */
global.getAsset = (assetName) => {
	return fs.readFileSync('tests/assets/' + assetName + '.ics', 'UTF8')
}