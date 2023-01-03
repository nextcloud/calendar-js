/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license AGPL-3.0-or-later
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

import ICAL from 'ical.js'

/**
 * @class Timezone
 */
export default class Timezone {

	/**
	 * Constructor
	 *
	 * @param {string | ICAL.Timezone | ICAL.Component} timezoneId Id of the timezone
	 * @param {string?} ics The iCalendar timezone definition
	 */
	constructor(timezoneId, ics) {

		/**
		 * Id of the timezone, used before initialising
		 *
		 * @type {string}
		 * @private
		 */
		this._timezoneId = null

		/**
		 * ICS representation of the timezone, used before initialising
		 *
		 * @type {string}
		 * @private
		 */
		this._ics = null

		/**
		 * @type {ICAL.Timezone|null}
		 */
		this._innerValue = null

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._initialized = false

		// If the first parameter is already
		// an instance of ICAL.Timezone,
		// skip lazy loading
		if (timezoneId instanceof ICAL.Timezone) {
			this._innerValue = timezoneId
			this._initialized = true
		} else if (timezoneId instanceof ICAL.Component) {
			this._innerValue = new ICAL.Timezone(timezoneId)
			this._initialized = true
		} else {
			this._timezoneId = timezoneId
			this._ics = ics
		}
	}

	/**
	 * Gets the timezone id
	 *
	 * @return {string}
	 */
	get timezoneId() {
		if (this._initialized) {
			return this._innerValue.tzid
		}

		return this._timezoneId
	}

	/**
	 * Gets the UTC Offset for a given date in this timezone
	 *
	 * @param {number} year Year of the date
	 * @param {number} month Month of the date (1-based)
	 * @param {number} day Day of the date
	 * @param {number} hour Hour of the date
	 * @param {number} minute Minute of the date
	 * @param {number} second Second of the date
	 * @return {number}
	 */
	offsetForArray(year, month, day, hour, minute, second) {
		this._initialize()

		const time = new ICAL.Time({
			year,
			month,
			day,
			hour,
			minute,
			second,
			isDate: false,
		})
		return this._innerValue.utcOffset(time)
	}

	/**
	 * Converts a timestamp to an array of year, month, day, hour, minute, second.
	 *
	 * @param {number} ms Timestamp in milliseconds
	 * @return {number[]}
	 */
	timestampToArray(ms) {
		this._initialize()

		// just create a dummy object because fromUnixTime is not exposed on ICAL.Time
		const time = ICAL.Time.fromData({
			year: 1970,
			month: 1,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
		})
		time.fromUnixTime(Math.floor(ms / 1000))

		const local = time.convertToZone(this._innerValue)
		return [
			local.year,
			local.month, // THIS is 1-based !
			local.day,
			local.hour,
			local.minute,
			local.second,
		]
	}

	/**
	 * Returns
	 *
	 * @return {ICAL.Timezone}
	 */
	toICALTimezone() {
		this._initialize()
		return this._innerValue
	}

	/**
	 * Returns the corresponding ICAL.
	 *
	 * @return {ICAL.Component}
	 */
	toICALJs() {
		this._initialize()
		return this._innerValue.component
	}

	/**
	 * Initialises the inner ICAL.Timezone component
	 *
	 * @private
	 */
	_initialize() {
		if (!this._initialized) {
			const jCal = ICAL.parse(this._ics)
			const icalComp = new ICAL.Component(jCal)
			this._innerValue = new ICAL.Timezone(icalComp)
			this._initialized = true
		}
	}

}

Timezone.utc = new Timezone(ICAL.Timezone.utcTimezone)
Timezone.floating = new Timezone(ICAL.Timezone.localTimezone)
