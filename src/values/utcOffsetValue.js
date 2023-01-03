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
import AbstractValue from './abstractValue.js'
import ICAL from 'ical.js'

/**
 * @class UTCOffsetValue
 * @classdesc Wrapper for ICAL.UtcOffset
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.3.14
 * @url https://github.com/mozilla-comm/ical.js/blob/master/lib/ical/utc_offset.js
 */
export default class UTCOffsetValue extends AbstractValue {

	/**
	 * Gets the hour part of the offset-value
	 *
	 * @return {number}
	 */
	get hours() {
		return this._innerValue.hours
	}

	/**
	 * Sets the hour part of the offset-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {number} hours - New hours to set
	 */
	set hours(hours) {
		this._modifyContent()
		this._innerValue.hours = hours
	}

	/**
	 * Gets the minute part of the offset-value
	 *
	 * @return {number}
	 */
	get minutes() {
		return this._innerValue.minutes
	}

	/**
	 * Sets the minute part of the offset-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {number} minutes - New minutes to set
	 */
	set minutes(minutes) {
		this._modifyContent()
		this._innerValue.minutes = minutes
	}

	/**
	 * Gets the factor
	 *
	 * @return {number}
	 */
	get factor() {
		return this._innerValue.factor
	}

	/**
	 * Sets the factor
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if factor is neither 1 nor -1
	 * @param {number} factor - New factor to set, 1 for positive, -1 for negative
	 */
	set factor(factor) {
		this._modifyContent()
		if (factor !== 1 && factor !== -1) {
			throw new TypeError('Factor may only be set to 1 or -1')
		}

		this._innerValue.factor = factor
	}

	/**
	 * Gets the total amount of seconds
	 *
	 * @return {number}
	 */
	get totalSeconds() {
		return this._innerValue.toSeconds()
	}

	/**
	 * Sets the total amount of seconds
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {number} totalSeconds - New number of total seconds to set
	 */
	set totalSeconds(totalSeconds) {
		this._modifyContent()
		this._innerValue.fromSeconds(totalSeconds)
	}

	/**
	 * Compares this UTCOffset to another one
	 *
	 * @param {UTCOffsetValue} other - The other UTCOffsetValue to compare with
	 * @return {number} -1, 0 or 1 for less/equal/greater
	 */
	compare(other) {
		return this._innerValue.compare(other.toICALJs())
	}

	/**
	 * Clones this value
	 *
	 * @return {UTCOffsetValue}
	 */
	clone() {
		return UTCOffsetValue.fromICALJs(this._innerValue.clone())
	}

	/**
	 * Create a new UTCOffsetValue object from a ICAL.UTCOffset object
	 *
	 * @param {ICAL.UtcOffset} icalValue - The ICAL.UtcOffset object to initialize this object from
	 * @return {UTCOffsetValue}
	 */
	static fromICALJs(icalValue) {
		return new UTCOffsetValue(icalValue)
	}

	/**
	 * Create a new UTCOffsetValue object from a data object
	 *
	 * @param {object} data - Object with data to create UTCOffsetValue object from
	 * @param {number=} data.hours - The number of hours to set
	 * @param {number=} data.minutes - The number of minutes to set
	 * @param {number=} data.factor - The factor to use, 1 for positive, -1 for negative
	 * @return {UTCOffsetValue}
	 */
	static fromData(data) {
		const icalUTCOffset = new ICAL.UtcOffset()
		icalUTCOffset.fromData(data)
		return UTCOffsetValue.fromICALJs(icalUTCOffset)
	}

	/**
	 * Create a new UTCOffsetValue object from an amount of seconds
	 *w
	 *
	 * @param {number} seconds - The total number of seconds to create the UTCOffsetValue object from
	 * @return {UTCOffsetValue}
	 */
	static fromSeconds(seconds) {
		const icalUTCOffset = ICAL.UtcOffset.fromSeconds(seconds)
		return UTCOffsetValue.fromICALJs(icalUTCOffset)
	}

}
