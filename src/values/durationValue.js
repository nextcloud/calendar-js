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
 * @class DurationValue
 * @classdesc Wrapper for ICAL.Duration
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.3.6
 * @url https://github.com/mozilla-comm/ical.js/blob/master/lib/ical/duration.js
 */
export default class DurationValue extends AbstractValue {

	/**
	 * Gets the weeks of the stored duration-value
	 *
	 * @return {number}
	 */
	get weeks() {
		return this._innerValue.weeks
	}

	/**
	 * Sets the weeks of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if value is negative
	 * @param {number} weeks Amount of weeks
	 */
	set weeks(weeks) {
		this._modifyContent()
		if (weeks < 0) {
			throw new TypeError('Weeks cannot be negative, use isNegative instead')
		}

		this._innerValue.weeks = weeks
	}

	/**
	 * Gets the days of the stored duration-value
	 *
	 * @return {number}
	 */
	get days() {
		return this._innerValue.days
	}

	/**
	 * Sets the days of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if value is negative
	 * @param {number} days Amount of days
	 */
	set days(days) {
		this._modifyContent()
		if (days < 0) {
			throw new TypeError('Days cannot be negative, use isNegative instead')
		}

		this._innerValue.days = days
	}

	/**
	 * Gets the hours of the stored duration-value
	 *
	 * @return {number}
	 */
	get hours() {
		return this._innerValue.hours
	}

	/**
	 * Sets the weeks of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if value is negative
	 * @param {number} hours Amount of hours
	 */
	set hours(hours) {
		this._modifyContent()
		if (hours < 0) {
			throw new TypeError('Hours cannot be negative, use isNegative instead')
		}

		this._innerValue.hours = hours
	}

	/**
	 * Gets the minutes of the stored duration-value
	 *
	 * @return {number}
	 */
	get minutes() {
		return this._innerValue.minutes
	}

	/**
	 * Sets the minutes of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if value is negative
	 * @param {number} minutes Amount of minutes
	 */
	set minutes(minutes) {
		this._modifyContent()
		if (minutes < 0) {
			throw new TypeError('Minutes cannot be negative, use isNegative instead')
		}

		this._innerValue.minutes = minutes
	}

	/**
	 * Gets the seconds of the stored duration-value
	 *
	 * @return {number}
	 */
	get seconds() {
		return this._innerValue.seconds
	}

	/**
	 * Sets the seconds of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if value is negative
	 * @param {number} seconds Amount of seconds
	 */
	set seconds(seconds) {
		this._modifyContent()
		if (seconds < 0) {
			throw new TypeError('Seconds cannot be negative, use isNegative instead')
		}

		this._innerValue.seconds = seconds
	}

	/**
	 * Gets the negative-indicator of the stored duration-value
	 *
	 * @return {boolean}
	 */
	get isNegative() {
		return this._innerValue.isNegative
	}

	/**
	 * Gets the negative-indicator of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {boolean} isNegative Whether or not the duration is negative
	 */
	set isNegative(isNegative) {
		this._modifyContent()
		this._innerValue.isNegative = !!isNegative
	}

	/**
	 * Gets the amount of total seconds of the stored duration-value
	 *
	 * @return {* | number}
	 */
	get totalSeconds() {
		return this._innerValue.toSeconds()
	}

	/**
	 * Sets the amount of total seconds of the stored duration-value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {number} totalSeconds The total amounts of seconds to set
	 */
	set totalSeconds(totalSeconds) {
		this._modifyContent()
		this._innerValue.fromSeconds(totalSeconds)
	}

	/**
	 * Compares this duration to another one
	 *
	 * @param {DurationValue} otherDuration The duration to compare to
	 * @return {number} -1, 0 or 1 for less/equal/greater
	 */
	compare(otherDuration) {
		return this._innerValue.compare(otherDuration.toICALJs())
	}

	/**
	 * Adds the value of another duration to this one
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {DurationValue} otherDuration The duration to add
	 */
	addDuration(otherDuration) {
		this._modifyContent()
		this.totalSeconds += otherDuration.totalSeconds
		this._innerValue.normalize()
	}

	/**
	 * Subtract the value of another duration from this one
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {DurationValue} otherDuration The duration to subtract
	 */
	subtractDuration(otherDuration) {
		this._modifyContent()
		this.totalSeconds -= otherDuration.totalSeconds
		this._innerValue.normalize()
	}

	/**
	 * clones this value
	 *
	 * @return {DurationValue}
	 */
	clone() {
		return DurationValue.fromICALJs(this._innerValue.clone())
	}

	/**
	 * Create a new DurationValue object from an ICAL.Duration object
	 *
	 * @param {ICAL.Duration} icalValue The ical.js duration value
	 * @return {DurationValue}
	 */
	static fromICALJs(icalValue) {
		return new DurationValue(icalValue)
	}

	/**
	 * Create a new DurationValue object from a number of seconds
	 *
	 * @param {number} seconds Total amount of seconds
	 * @return {DurationValue}
	 */
	static fromSeconds(seconds) {
		const icalDuration = ICAL.Duration.fromSeconds(seconds)
		return new DurationValue(icalDuration)

	}

	/**
	 * Create a new DurationValue object from data
	 *
	 * @param {object} data The destructuring object
	 * @param {number=} data.weeks Number of weeks to set
	 * @param {number=} data.days Number of days to set
	 * @param {number=} data.hours Number of hours to set
	 * @param {number=} data.minutes Number of minutes to set
	 * @param {number=} data.seconds Number of seconds to set
	 * @param {boolean=} data.isNegative Whether or not duration is negative
	 * @return {DurationValue}
	 */
	static fromData(data) {
		const icalDuration = ICAL.Duration.fromData(data)
		return new DurationValue(icalDuration)
	}

}
