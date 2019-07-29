/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import ICalendarParser from './icalendarParser.js'

/**
 * @class ParserManager
 * @classdesc
 */
export default class ParserManager {

	/**
	 * Constructor
	 */
	constructor() {

		/**
		 * List of supported parsers
		 *
		 * @type {{new: AbstractParser, getMimeTypes():String[]}[]}
		 */
		this._parsers = []
	}

	/**
	 * Get a list of all supported file-types
	 *
	 * @returns {String[]}
	 */
	getAllSupportedFileTypes() {
		return this._parsers.reduce(
			(allFileTypes, parser) => allFileTypes.concat(parser.getMimeTypes()),
			[])
	}

	/**
	 * Get an instance of a parser for one specific file-type
	 *
	 * @param {String} fileType
	 * @param {Object} options
	 * @param {Boolean} options.removeRSVPForAttendees
	 * @returns {AbstractParser}
	 */
	getParserForFileType(fileType, options) {
		const parser = this._parsers.find(
			(parser) => parser.getMimeTypes().includes(fileType))

		if (!parser) {
			throw new TypeError('Unknown file-type.')
		}

		return new parser(options)
	}

	/**
	 * Registers a parser
	 *
	 * @param {{new: AbstractParser, getMimeTypes():String[]}} parser
	 */
	registerParser(parser) {
		this._parsers.push(parser)
	}

}

/**
 * Gets an instance of the ParserManager with all default parsers
 *
 * @returns {ParserManager}
 */
export function getParserManager() {
	const parserManager = new ParserManager()

	// We only support iCalendar for now.
	// JSON calendar and CSV will be supported soon,
	// but require some more work

	parserManager.registerParser(ICalendarParser)
	// parserManager.registerParser(JCalendarParser)
	// parserManager.registerParser(CSVParser)

	return parserManager
}
