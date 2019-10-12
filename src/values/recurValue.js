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
import AbstractValue from './abstractValue.js'
import DateTimeValue from './dateTimeValue.js'
import { uc } from '../helpers/stringHelper.js'
import ICAL from 'ical.js'

const ALLOWED_FREQ = ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']

/**
 * @class RecurValue
 * @classdesc Wrapper for ICAL.Recur
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.3.10
 * @url https://github.com/mozilla-comm/ical.js/blob/master/lib/ical/recur.js
 */
export default class RecurValue extends AbstractValue {

	/**
	 * Constructor
	 *
	 * @param {ICAL.Recur} icalValue
	 * @param {DateTimeValue?} until
	 */
	constructor(icalValue, until) {
		super(icalValue)

		/**
		 * DateTimeValue object for Until
		 *
		 * @type {DateTimeValue}
		 * @private
		 */
		this._until = until
	}

	/**
	 * Gets the stored interval of this recurrence rule
	 *
	 * @returns {Number}
	 */
	get interval() {
		return this._innerValue.interval
	}

	/**
	 * Sets the stored interval of this recurrence rule
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {Number} interval
	 */
	set interval(interval) {
		this._modifyContent()
		this._innerValue.interval = parseInt(interval, 10)
	}

	/**
	 * Gets the weekstart used to calculate the recurrence expansion
	 *
	 * @returns {Number}
	 */
	get weekStart() {
		return this._innerValue.wkst
	}

	/**
	 * Sets the weekstart used to calculate the recurrence expansion
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if weekstart out of range
	 * @param {Number} weekStart
	 */
	set weekStart(weekStart) {
		this._modifyContent()
		if (weekStart < DateTimeValue.SUNDAY || weekStart > DateTimeValue.SATURDAY) {
			throw new TypeError('Weekstart out of range')
		}

		this._innerValue.wkst = weekStart
	}

	/**
	 * Gets the until value if set
	 * The value is automatically locked.
	 * If you want to edit the value, clone it and it as new until
	 *
	 * @returns {null|DateTimeValue}
	 */
	get until() {
		if (!this._until && this._innerValue.until) {
			this._until = DateTimeValue.fromICALJs(this._innerValue.until)
		}

		return this._until
	}

	/**
	 * Sets the until value, automatically removes count
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {DateTimeValue} until
	 */
	set until(until) {
		this._modifyContent()

		if (this._until) {
			this._until.lock()
		}

		this._until = until
		this._innerValue.count = null
		this._innerValue.until = until.toICALJs()
	}

	/**
	 * Gets the count value if set
	 *
	 * @returns {null|Number}
	 */
	get count() {
		return this._innerValue.count
	}

	/**
	 * Sets the count value, automatically removes until
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {Number} count
	 */
	set count(count) {
		this._modifyContent()

		if (this._until) {
			this._until.lock()
			this._until = null
		}

		this._innerValue.until = null
		this._innerValue.count = parseInt(count, 10)
	}

	/**
	 * Gets the frequency of the recurrence rule
	 *
	 * @returns {String} see
	 */
	get frequency() {
		return this._innerValue.freq
	}

	/**
	 * Sets the frequency of the recurrence rule
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @throws {TypeError} if frequency is unknown
	 * @param freq
	 */
	set frequency(freq) {
		this._modifyContent()
		if (!ALLOWED_FREQ.includes(freq)) {
			throw new TypeError('Unknown frequency')
		}

		this._innerValue.freq = freq
	}

	/**
	 * Modifies this recurrence-value to unset count and until
	 */
	setToInfinite() {
		this._modifyContent()

		if (this._until) {
			this._until.lock()
			this._until = null
		}

		this._innerValue.until = null
		this._innerValue.count = null
	}

	/**
	 * Checks whether the stored rule is finite
	 *
	 * @returns {Boolean}
	 */
	isFinite() {
		return this._innerValue.isFinite()
	}

	/**
	 * Checks whether the recurrence rule is limited by count
	 *
	 * @returns {Boolean}
	 */
	isByCount() {
		return this._innerValue.isByCount()
	}

	/**
	 * Adds a part to a component to the recurrence-rule
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {String} componentName
	 * @param {String|Number}value
	 */
	addComponent(componentName, value) {
		this._modifyContent()
		this._innerValue.addComponent(componentName, value)
	}

	/**
	 * Sets / overwrites a component to the recurrence-rule
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {String} componentName
	 * @param {Number[]|String[]}value
	 */
	setComponent(componentName, value) {
		this._modifyContent()

		if (value.length === 0) {
			delete this._innerValue.parts[componentName.toUpperCase()]
		} else {
			this._innerValue.setComponent(componentName, value)
		}
	}

	/**
	 * Removes all parts of a component
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {String} componentName
	 */
	removeComponent(componentName) {
		delete this._innerValue.parts[uc(componentName)]
	}

	/**
	 * Gets all parts of a component
	 *
	 * @param {String} componentName
	 */
	getComponent(componentName) {
		return this._innerValue.getComponent(componentName)
	}

	/**
	 * Checks if this recurrence rule is valid according to RFC 5545
	 *
	 * @returns {boolean}
	 */
	isRuleValid() {
		return true
	}

	/**
	 * @inheritDoc
	 */
	lock() {
		super.lock()

		if (this._until) {
			this._until.lock()
		}
	}

	/**
	 * @inheritDoc
	 */
	unlock() {
		super.unlock()

		if (this._until) {
			this._until.unlock()
		}
	}

	/**
	 * clones this value
	 *
	 * @returns {RecurValue}
	 */
	clone() {
		return RecurValue.fromICALJs(this._innerValue.clone())
	}

	/**
	 * Create a new RecurValue object from a ICAL.Recur object
	 *
	 * @param {ICAL.Recur} icalValue
	 * @param {DateTimeValue?} until
	 * @returns {RecurValue}
	 */
	static fromICALJs(icalValue, until = null) {
		return new RecurValue(icalValue, until)
	}

	/**
	 * Create a new RecurValue object from a data object
	 *
	 * @param {Object} data
	 * @param {String=} data.freq
	 * @param {Number=} data.interval
	 * @param {Number=} data.wkst
	 * @param {DateTimeValue=} data.until
	 * @param {Number=} data.count
	 * @param {Number[]=} data.bysecond
	 * @param {Number[]=} data.byminute
	 * @param {Number[]=} data.byhour
	 * @param {String[]=} data.byday
	 * @param {Number[]=} data.bymonthday
	 * @param {Number[]=} data.byyearday
	 * @param {Number[]=} data.byweekno
	 * @param {Number[]=} data.bymonth
	 * @param {Number[]=} data.bysetpos
	 * @returns {RecurValue}
	 */
	static fromData(data) {
		let until = null

		if (data.until) {
			until = data.until
			data.until = data.until.toICALJs()
		}

		const icalRecur = ICAL.Recur.fromData(data)
		return RecurValue.fromICALJs(icalRecur, until)
	}

}
