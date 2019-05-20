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

/**
 * @class AbstractParser
 * @classdesc
 */
export default class AbstractParser {

	/**
	 * @constructor
	 *
	 * @param {Object} options
	 * @param {Boolean} options.extractGlobalProperties (defaults to false)
	 * @param {Boolean} options.removeRSVPForAttendees (defaults to false)
	 * @param {Boolean} options.includeTimezones (defaults to false)
	 */
	constructor(options={}) {
		if (new.target === AbstractParser) {
			throw new TypeError('Cannot instantiate abstract class AbstractParser');
		}

		/**
		 * Options for the parser
		 *
		 * @type {{removeRSVPForAttendees: Boolean}}
		 * @private
		 */
		this._options = Object.assign({}, options)

		/**
		 * A name extracted from the calendar-data
		 *
		 * @type {String|null}
		 * @protected
		 */
		this._name = null

		/**
		 * A color extracted from the calendar-data
		 *
		 * @type {String|null}
		 * @protected
		 */
		this._color = null

		/**
		 * Gets the url that this icalendar file can be updated from
		 *
		 * @type {String}
		 * @protected
		 */
		this._sourceURL = null

		/**
		 * Gets the update interval if this icalendar file can be updated from a source
		 *
		 * @type {String}
		 * @protected
		 */
		this._refreshInterval = null

		/**
		 * Gets the default timezone of this calendar
		 *
		 * @type {String}
		 * @protected
		 */
		this._calendarTimezone = null

		/**
		 * Error count during parsing
		 *
		 * @type {Array}
		 * @protected
		 */
		this._errors = []
	}

	/**
	 * Gets the name extracted from the calendar-data
	 *
	 * @returns {String|null}
	 */
	getName() {
		return this._name
	}

	/**
	 * Gets the color extracted from the calendar-data
	 *
	 * @returns {String|null}
	 */
	getColor() {
		return this._color
	}

	/**
	 * Gets whether this import can be converted into a webcal subscription
	 *
	 * @returns {boolean}
	 */
	offersWebcalFeed() {
		return this._sourceURL !== null
	}

	/**
	 * Gets the url pointing to the webcal source
	 *
	 * @returns {String|null}
	 */
	getSourceURL() {
		return this._sourceURL
	}

	/**
	 * Gets the recommended refresh rate to update this subscription
	 *
	 * @returns {String|null}
	 */
	getRefreshInterval() {
		return this._refreshInterval
	}

	/**
	 * Gets the default timezone of this calendar
	 *
	 * @returns {String}
	 */
	getCalendarTimezone() {
		return this._calendarTimezone
	}

	/**
	 * {String|Object} data
	 *
	 * @throws TODO
	 */
	parse(data) {
		throw new TypeError('Abstract method not implemented by subclass');
	}

	/**
	 * Returns one CalendarComponent at a time
	 *
	 * @returns {IterableIterator<CalendarComponent>}
	 */
	*getItemIterator() {
		throw new TypeError('Abstract method not implemented by subclass');
	}

	/**
	 * Get an array of all items
	 *
	 * @returns {CalendarComponent[]}
	 */
	getAllItems() {
		return Array.from(this.getItemIterator())
	}

	/**
	 * Returns a boolean whether or not the parsed data contains vevents
	 *
	 * @returns {boolean}
	 */
	containsVEvents() {
		return false
	}

	/**
	 * Returns a boolean whether or not the parsed data contains vjournals
	 *
	 * @returns {boolean}
	 */
	containsVJournals() {
		return false
	}

	/**
	 * Returns a boolean whether or not the parsed data contains vtodos
	 *
	 * @returns {boolean}
	 */
	containsVTodos() {
		return false
	}

	/**
	 * Returns a boolean whether
	 *
	 * @returns {boolean}
	 */
	hasErrors() {
		return this._errors.length !== 0
	}

	/**
	 * Get a list of all errors that occurred
	 *
	 * @returns {*[]}
	 */
	getErrorList() {
		return this._errors.slice()
	}

	/**
	 * Gets an option provided
	 *
	 * @param {String} name
	 * @param {*} defaultValue
	 * @protected
	 */
	_getOption(name, defaultValue) {
		return this._options.hasOwnProperty(name)
			? this._options[name]
			: defaultValue
	}

	/**
	 * Return list of supported mime types
	 *
	 * @static
	 * @returns {string[]}
	 */
	static getMimeTypes() {
		throw new TypeError('Abstract method not implemented by subclass');
	}
}
