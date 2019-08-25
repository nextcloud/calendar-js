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
import Property from '../properties/property.js'
import { uc } from '../helpers/stringHelper.js'
import DateTimeValue from '../values/dateTimeValue.js'
import ModificationNotAllowedError from '../errors/modificationNotAllowedError.js'
import PeriodValue from '../values/periodValue.js'
import ICAL from 'ical.js'

/**
 * @class RecurrenceHelper
 * @classdesc
 *
 * TODO: This needs caching
 */
export default class RecurrenceManager {

	/**
	 * Constructor
	 *
	 * @param {AbstractRecurringComponent} masterItem
	 */
	constructor(masterItem) {

		/**
		 *
		 * @type {AbstractRecurringComponent}
		 * @private
		 */
		this._masterItem = masterItem

		/**
		 * Set of Recurrence exception items
		 *
		 * Number is the unix time representation of the recurrence ID
		 *
		 * @type {Map<Number, AbstractRecurringComponent>}
		 * @private
		 */
		this._recurrenceExceptionItems = new Map()

		/**
		 * A sorted index of recurrence ids with range
		 *
		 * @type {Number[]}
		 * @private
		 */
		this._rangeRecurrenceExceptionItemsIndex = []

		/**
		 * Cached difference of dtstart and recurrenceId for recurrence exceptions with range
		 *
		 * @type {Map<Number, DurationValue>}
		 * @private
		 */
		this._rangeRecurrenceExceptionItemsDiffCache = new Map()

		/**
		 * Set of Recurrence exception items that have a RANGE of THISANDFUTURE
		 *
		 * Number is the unix time representation of the recurrence ID
		 *
		 * @type {Map<Number, AbstractRecurringComponent>}
		 * @private
		 */
		this._rangeRecurrenceExceptionItems = new Map()
	}

	/**
	 *
	 * @returns {AbstractRecurringComponent}
	 */
	get masterItem() {
		return this._masterItem
	}

	/**
	 *
	 * @param {AbstractRecurringComponent} masterItem
	 */
	set masterItem(masterItem) {
		this._masterItem = masterItem
	}

	/**
	 * Gets an iterator over all registered recurrence exceptions of this calendar-document
	 *
	 * @returns {IterableIterator<AbstractRecurringComponent>}
	 */
	* getRecurrenceExceptionIterator() {
		yield * this._recurrenceExceptionItems.values()
	}

	/**
	 * Gets a list of all registered recurrence-exceptions of this calendar-document
	 *
	 * @returns {AbstractRecurringComponent[]}
	 */
	getRecurrenceExceptionList() {
		return Array.from(this.getRecurrenceExceptionIterator())
	}

	/**
	 * Checks if there is a recurrence Exception for a given recurrenceId
	 *
	 * @param {DateTimeValue|Number} recurrenceId
	 * @returns {boolean}
	 */
	hasRecurrenceExceptionForId(recurrenceId) {
		if (recurrenceId instanceof DateTimeValue) {
			recurrenceId = recurrenceId.unixTime
		} else if (recurrenceId instanceof ICAL.Time) {
			recurrenceId = recurrenceId.toUnixTime()
		}

		return this._recurrenceExceptionItems.has(recurrenceId)
	}

	/**
	 * Gets the recurrence exception for a given recurrence Id
	 *
	 * @param {DateTimeValue|Number} recurrenceId
	 * @returns {AbstractRecurringComponent|null}
	 */
	getRecurrenceException(recurrenceId) {
		if (recurrenceId instanceof DateTimeValue) {
			recurrenceId = recurrenceId.unixTime
		} else if (recurrenceId instanceof ICAL.Time) {
			recurrenceId = recurrenceId.toUnixTime()
		}

		return this._recurrenceExceptionItems.get(recurrenceId) || null
	}

	/**
	 * Check if there is a recurrence-exception with a range for a given recurrence-id
	 *
	 * @param {DateTimeValue|Number} recurrenceId
	 * @returns {boolean}
	 */
	hasRangeRecurrenceExceptionForId(recurrenceId) {
		if (recurrenceId instanceof DateTimeValue) {
			recurrenceId = recurrenceId.unixTime
		} else if (recurrenceId instanceof ICAL.Time) {
			recurrenceId = recurrenceId.toUnixTime()
		}

		if (this._rangeRecurrenceExceptionItemsIndex.length === 0) {
			return false
		}

		return this._rangeRecurrenceExceptionItemsIndex[0] < recurrenceId
	}

	/**
	 * Get recurrence-exception with range that's affecting the given recurrence-id
	 *
	 * @param {DateTimeValue|Number} recurrenceId
	 * @returns {AbstractRecurringComponent|null}
	 */
	getRangeRecurrenceExceptionForId(recurrenceId) {
		if (recurrenceId instanceof DateTimeValue) {
			recurrenceId = recurrenceId.unixTime
		} else if (recurrenceId instanceof ICAL.Time) {
			recurrenceId = recurrenceId.toUnixTime()
		}

		const index = ICAL.helpers.binsearchInsert(
			this._rangeRecurrenceExceptionItemsIndex,
			recurrenceId,
			(a, b) => a - b
		)

		if (index === 0) {
			return null
		}

		const key = this._rangeRecurrenceExceptionItemsIndex[index - 1]
		return this._rangeRecurrenceExceptionItems.get(key)
	}

	/**
	 * Gets the difference between recurrence-id and start
	 * Mostly needed to handle recurrence-exceptions with range
	 *
	 * @param {DateTimeValue|Number} recurrenceId
	 * @returns {DurationValue|null}
	 */
	getRangeRecurrenceExceptionDiff(recurrenceId) {
		if (recurrenceId instanceof DateTimeValue) {
			recurrenceId = recurrenceId.unixTime
		} else if (recurrenceId instanceof ICAL.Time) {
			recurrenceId = recurrenceId.toUnixTime()
		}

		if (this._rangeRecurrenceExceptionItemsDiffCache.has(recurrenceId)) {
			return this._rangeRecurrenceExceptionItemsDiffCache.get(recurrenceId)
		}

		const recurrenceException = this.getRangeRecurrenceExceptionForId(recurrenceId)
		if (!recurrenceException) {
			return null
		}

		const originalRecurrenceId = recurrenceException.recurrenceId
		const originalModifiedStart = recurrenceException.startDate

		const difference = originalModifiedStart.subtractDateWithTimezone(originalRecurrenceId)
		difference.lock()

		this._rangeRecurrenceExceptionItemsDiffCache.set(recurrenceId, difference)
		return difference
	}

	/**
	 * Adds a new recurrence-exception to this calendar-document
	 *
	 * @param {AbstractRecurringComponent} recurrenceExceptionItem
	 */
	relateRecurrenceException(recurrenceExceptionItem) {
		this._modify()
		const key = this._getRecurrenceIdKey(recurrenceExceptionItem)

		this._recurrenceExceptionItems.set(key, recurrenceExceptionItem)
		if (recurrenceExceptionItem.modifiesFuture()) {
			this._rangeRecurrenceExceptionItems.set(key, recurrenceExceptionItem)
			const index = ICAL.helpers.binsearchInsert(
				this._rangeRecurrenceExceptionItemsIndex,
				key,
				(a, b) => a - b
			)

			this._rangeRecurrenceExceptionItemsIndex.splice(index, 0, key)
		}

		recurrenceExceptionItem.recurrenceManager = this
	}

	/**
	 * Removes a recurrence exception by the item itself
	 *
	 * @param {AbstractRecurringComponent} recurrenceExceptionItem
	 */
	removeRecurrenceException(recurrenceExceptionItem) {
		const key = this._getRecurrenceIdKey(recurrenceExceptionItem)
		this.removeRecurrenceExceptionByRecurrenceId(key)
	}

	/**
	 * Removes a recurrence exception by it's unix-time
	 *
	 * @param {Number} recurrenceId
	 */
	removeRecurrenceExceptionByRecurrenceId(recurrenceId) {
		this._modify()
		this._recurrenceExceptionItems.delete(recurrenceId)
		this._rangeRecurrenceExceptionItems.delete(recurrenceId)
		this._rangeRecurrenceExceptionItemsDiffCache.delete(recurrenceId)

		const index = this._rangeRecurrenceExceptionItemsIndex.indexOf(recurrenceId)
		if (index !== -1) {
			this._rangeRecurrenceExceptionItemsIndex.splice(index, 1)
		}
	}

	/**
	 *
	 * @param {AbstractRecurringComponent} recurrenceExceptionItem
	 * @returns {Number}
	 * @private
	 */
	_getRecurrenceIdKey(recurrenceExceptionItem) {
		return recurrenceExceptionItem
			.recurrenceId
			.unixTime
	}

	/**
	 * Gets an iterator over all recurrence rules
	 *
	 * @returns {IterableIterator<RecurValue>}
	 */
	* getRecurrenceRuleIterator() {
		for (const property of this._masterItem.getPropertyIterator('RRULE')) {
			yield property.getFirstValue()
		}
	}

	/**
	 * Gets a list of all recurrence rules
	 *
	 * @returns {RecurValue[]}
	 */
	getRecurrenceRuleList() {
		return Array.from(this.getRecurrenceRuleIterator())
	}

	/**
	 * Adds a new recurrence rule
	 *
	 * @param {RecurValue} recurrenceRule
	 */
	addRecurrenceRule(recurrenceRule) {
		this._modify()
		this.resetCache()

		const property = new Property('RRULE', recurrenceRule)
		this._masterItem.addProperty(property)
	}

	/**
	 * Removes a recurrence rule
	 *
	 * @param {RecurValue} recurrenceRule
	 */
	removeRecurrenceRule(recurrenceRule) {
		this._modify()
		this.resetCache()

		for (const property of this._masterItem.getPropertyIterator('RRULE')) {
			if (property.getFirstValue() === recurrenceRule) {
				this._masterItem.deleteProperty(property)
			}
		}
	}

	/**
	 * Removes all recurrence rules
	 */
	clearAllRecurrenceRules() {
		this._modify()
		this.resetCache()

		this._masterItem.deleteAllProperties('RRULE')
	}

	/**
	 * Gets an iterator over all recurrence
	 *
	 * @param {boolean} isNegative
	 * @param {String} valueType
	 * @returns {IterableIterator<DateTimeValue|PeriodValue>}
	 */
	* getRecurrenceDateIterator(isNegative = false, valueType = null) {
		for (const property of this._getPropertiesForRecurrenceDate(isNegative, valueType)) {
			yield * property.getValueIterator()
		}
	}

	/**
	 *
	 * @param {boolean} isNegative
	 * @param {String} valueType
	 * @returns {(DateTimeValue|PeriodValue)[]}
	 */
	listAllRecurrenceDates(isNegative = false, valueType = null) {
		return Array.from(this.getRecurrenceDateIterator(isNegative, valueType))
	}

	/**
	 * This adds a new recurrence-date value.
	 * It automatically adds it to the first property of the same value-type
	 * or creates a new one if necessary
	 *
	 * @param {DateTimeValue|PeriodValue} value
	 * @param {boolean} isNegative
	 */
	addRecurrenceDate(isNegative = false, value) {
		this._modify()
		this.resetCache()

		// Only add DateTime Value if its of the same timezone
		let timezoneId = null
		if (value instanceof DateTimeValue && !value.isDate) {
			timezoneId = value.timezoneId
		}

		const valueType = this._getValueTypeByValue(value)
		const iterator = this._getPropertiesForRecurrenceDate(isNegative, valueType, timezoneId)

		const first = iterator.next.value
		if (first instanceof Property) {
			const propertyValue = first.value
			propertyValue.push(value)
			this.masterItem.markPropertyAsDirty(isNegative ? 'EXDATE' : 'RDATE')
		} else {
			const propertyName = this._getPropertyNameByIsNegative(isNegative)
			const property = new Property(propertyName, value)
			this._masterItem.addProperty(property)
		}
	}

	/**
	 * Checks if a recurrenceID is an RDATE or EXDATE
	 *
	 * @param isNegative
	 * @param recurrenceId
	 */
	hasRecurrenceDate(isNegative = false, recurrenceId) {
		for (let value of this.getRecurrenceDateIterator(isNegative)) {
			if (value instanceof PeriodValue) {
				value = value.start
			}

			if (value.compare(recurrenceId) === 0) {
				return true
			}
		}

		return false
	}

	/**
	 *
	 * @param isNegative
	 * @param recurrenceId
	 * @returns {null|DateTimeValue|PeriodValue}
	 */
	getRecurrenceDate(isNegative = false, recurrenceId) {
		for (let value of this.getRecurrenceDateIterator(isNegative)) {
			let valueToCheck = value
			if (valueToCheck instanceof PeriodValue) {
				valueToCheck = valueToCheck.start
			}

			if (valueToCheck.compare(recurrenceId) === 0) {
				return value
			}
		}

		return null
	}

	/**
	 * This deletes a recurrence-date value from this recurrence-set
	 *
	 * @param {DateTimeValue|PeriodValue} value
	 * @param {boolean} isNegative
	 */
	removeRecurrenceDate(isNegative = false, value) {
		this._modify()
		this.resetCache()

		const valueType = this._getValueTypeByValue(value)
		for (const property of this._getPropertiesForRecurrenceDate(isNegative, valueType)) {
			for (const valueToCheck of property.getValueIterator()) {
				if (value === valueToCheck) {
					const allValues = property.value

					if (allValues.length === 1) {
						this.masterItem.deleteProperty(property)
						continue
					}

					const index = allValues.indexOf(value)
					allValues.splice(index, 1)
					this.masterItem.markPropertyAsDirty(isNegative ? 'EXDATE' : 'RDATE')
				}
			}
		}
	}

	/**
	 * Clears all recurrence-date information
	 *
	 * @param {String} valueType
	 * @param {boolean} isNegative
	 */
	clearAllRecurrenceDates(isNegative = false, valueType = null) {
		this._modify()
		this.resetCache()

		for (const property of this._getPropertiesForRecurrenceDate(isNegative, valueType)) {
			this._masterItem.deleteProperty(property)
		}
	}

	/**
	 * Gets the property name for recurrence dates based on the isNegative boolean
	 *
	 * @param {boolean} isNegative
	 * @returns {string}
	 * @private
	 */
	_getPropertyNameByIsNegative(isNegative) {
		return isNegative
			? 'EXDATE'
			: 'RDATE'
	}

	/**
	 * Gets the value type based on the provided value
	 *
	 * @param {PeriodValue|DateTimeValue} value
	 * @returns {string}
	 * @private
	 */
	_getValueTypeByValue(value) {
		if (value instanceof PeriodValue) {
			return 'PERIOD'
		} else if (value.isDate) {
			return 'DATE'
		} else {
			return 'DATETIME'
		}
	}

	/**
	 *
	 * @param {boolean} isNegative
	 * @param {String|null} valueType
	 * @param {ICAL.Timezone=} timezoneId
	 * @returns {IterableIterator<PeriodValue|DateTimeValue>}
	 * @private
	 */
	* _getPropertiesForRecurrenceDate(isNegative, valueType, timezoneId = null) {
		const propertyName = this._getPropertyNameByIsNegative(isNegative)

		for (const property of this._masterItem.getPropertyIterator(propertyName)) {
			if (valueType === null) {
				yield property
			} else if (uc(valueType) === 'PERIOD' && property.getFirstValue() instanceof PeriodValue) {
				yield property
			} else if (uc(valueType) === 'DATE' && property.getFirstValue().isDate) {
				yield property
			} else if (uc(valueType) === 'DATETIME' && !property.getFirstValue().isDate) {
				if (timezoneId === null || property.getFirstValue().timezoneId === timezoneId) {
					yield property
				}
			}
		}
	}

	/**
	 * Checks if the entire set of recurrence rules is finite
	 *
	 * @returns {boolean}
	 */
	isFinite() {
		return this.getRecurrenceRuleList().every((rule) => rule.isFinite())
	}

	/**
	 * @returns {boolean}
	 */
	isEmptyRecurrenceSet() {
		return this._getRecurExpansionObject().next() === undefined
	}

	/**
	 * Gets the occurrence at the exact given recurrenceId
	 *
	 * @param {DateTimeValue} recurrenceId
	 * @returns {AbstractRecurringComponent}
	 */
	getOccurrenceAtExactly(recurrenceId) {
		if (!this.masterItem.isRecurring()) {
			if (this.masterItem.getReferenceRecurrenceId().compare(recurrenceId) === 0) {
				return this.masterItem
			}

			return null
		}

		const iterator = this._getRecurExpansionObject()
		const icalRecurrenceId = recurrenceId.toICALJs()

		let next
		while ((next = iterator.next())) {
			if (next.compare(icalRecurrenceId) === 0) {
				// It's a match 🔥
				return this._getOccurrenceAtRecurrenceId(recurrenceId)
			}

			if (next.compare(icalRecurrenceId) === 1) {
				// We hit an occurrence in the future, return null
				return null
			}
		}

		const dateTimeValue = DateTimeValue.fromICALJs(previous)
		return this._getOccurrenceAtRecurrenceId(dateTimeValue)
	}

	/**
	 * Gets the closest occurrence to the given recurrenceId.
	 * That's either the closest in the future, or in case the
	 * recurrence-set ends before recurrenceId, the last one
	 *
	 * @param {DateTimeValue} recurrenceId
	 */
	getClosestOccurrence(recurrenceId) {
		if (!this.masterItem.isRecurring()) {
			return this.masterItem
		}

		const iterator = this._getRecurExpansionObject()
		recurrenceId = recurrenceId.toICALJs()

		let previous = null
		let next
		while ((next = iterator.next())) {
			if (next.compare(recurrenceId) === -1) {
				previous = next
			} else {

				// This is the case when it's either equal or in the future
				const dateTimeValue = DateTimeValue.fromICALJs(next)
				return this._getOccurrenceAtRecurrenceId(dateTimeValue)
			}
		}

		const dateTimeValue = DateTimeValue.fromICALJs(previous)
		return this._getOccurrenceAtRecurrenceId(dateTimeValue)
	}

	/**
	 * Get all occurrences between start and end
	 * Start and End are inclusive
	 *
	 * @param {DateTimeValue} start
	 * @param {DateTimeValue} end
	 */
	* getAllOccurrencesBetweenIterator(start, end) {
		if (!this.masterItem.isRecurring()) {
			if (typeof this.masterItem.isInTimeFrame !== 'function') {
				yield this.masterItem
			}
			if (this.masterItem.isInTimeFrame(start, end)) {
				yield this.masterItem
			}

			return
		}

		const iterator = this._getRecurExpansionObject()
		start = start.toICALJs()
		end = end.toICALJs()

		let next
		while ((next = iterator.next())) {
			if (next.compare(start) === -1) {
				continue
			}
			if (next.compare(end) === 1) {
				break
			}

			const dateTimeValue = DateTimeValue.fromICALJs(next)
			yield this._getOccurrenceAtRecurrenceId(dateTimeValue)
		}
	}

	/**
	 * Get all occurrences between start and end
	 *
	 * @param {DateTimeValue} start
	 * @param {DateTimeValue} end
	 * @returns {(*|null)[]}
	 */
	getAllOccurrencesBetween(start, end) {
		return Array.from(this.getAllOccurrencesBetweenIterator(start, end))
	}

	/**
	 * Update the UID of all components in the recurrence set
	 *
	 * @param {String} newUID
	 */
	updateUID(newUID) {
		this._masterItem.updatePropertyWithValue('UID', newUID)

		for (const recurrenceExceptionItem of this.getRecurrenceExceptionIterator()) {
			recurrenceExceptionItem.updatePropertyWithValue('UID', newUID)
		}
	}

	/**
	 * Updates the recurrence-information accordingly,
	 * whenever the start-date of the master-item changes
	 *
	 * @param {DateTimeValue} newStartDate
	 * @param {DateTimeValue} oldStartDate
	 */
	updateStartDateOfMasterItem(newStartDate, oldStartDate) {
		const difference = newStartDate.subtractDateWithTimezone(oldStartDate)

		// update EXDATE
		for (const exdate of this.getRecurrenceDateIterator(true)) {
			// If this EXDATE matches an RDATE, don't update, because we don't update RDATEs
			if (this.hasRecurrenceDate(false, exdate)) {
				continue
			}

			// EXDATE are always either DATE or DATETIME,
			// no need to check for PERIOD
			exdate.addDuration(difference)
		}

		for (const recurrenceException of this.getRecurrenceExceptionIterator()) {
			// We don't edit RDATES, so don't update recurrence-ids if they
			// are based on an RDATE
			if (this.hasRecurrenceDate(false, recurrenceException.recurrenceId)) {
				continue
			}

			this.removeRecurrenceException(recurrenceException)
			recurrenceException.recurrenceId.addDuration(difference)
			this.relateRecurrenceException(recurrenceException)
		}

		// update UNTIL of recurrence-rules
		for (const rrule of this.getRecurrenceRuleIterator()) {
			if (rrule.until) {
				rrule.until.addDuration(difference)
			}
		}
	}

	/**
	 * Gets an object for the given recurrenceId
	 * It does not verify that the given recurrenceId
	 * is actually a valid recurrence of this calendar-document
	 *
	 * @param {DateTimeValue} recurrenceId
	 * @returns {AbstractRecurringComponent}
	 * @private
	 */
	_getOccurrenceAtRecurrenceId(recurrenceId) {
		if (this.hasRecurrenceExceptionForId(recurrenceId)) {
			const recurrenceException = this.getRecurrenceException(recurrenceId)

			if (!recurrenceException.canCreateRecurrenceExceptions()) {
				return recurrenceException
			}

			return recurrenceException
				.forkItem(recurrenceId)
		} else if (this.hasRangeRecurrenceExceptionForId(recurrenceId)) {
			const rangeRecurrenceException = this.getRangeRecurrenceExceptionForId(recurrenceId)
			const difference = this.getRangeRecurrenceExceptionDiff(recurrenceId)

			return rangeRecurrenceException
				.forkItem(recurrenceId, difference)
		} else if (recurrenceId.compare(this._masterItem.startDate) === 0) {
			if (!this._masterItem.canCreateRecurrenceExceptions()) {
				return this._masterItem
			}

			return this._masterItem
				.forkItem(recurrenceId)
		} else {
			return this._masterItem
				.forkItem(recurrenceId)
		}
	}

	/**
	 * Resets the internal recur-expansion object.
	 * This is necessary after each modification of the
	 * recurrence-information
	 */
	resetCache() {
		// TODO - implement me
	}

	/**
	 * Gets a new ICAL.RecurExpansion object
	 *
	 * Inspired by how ICAL.JS RecurExpansion
	 * serialises and unserialises its state
	 *
	 * @returns {ICAL.RecurExpansion}
	 * @private
	 */
	_getRecurExpansionObject() {
		const dtstart = this._masterItem.startDate.toICALJs()
		let last = dtstart.clone()
		const ruleIterators = []
		let ruleDateInc
		let exDateInc
		const ruleDates = []
		let ruleDate = null
		const exDates = []
		let exDate
		const complete = false

		for (const ruleValue of this.getRecurrenceRuleIterator()) {
			ruleIterators.push(ruleValue.toICALJs().iterator(dtstart))
			ruleIterators[ruleIterators.length - 1].next()
		}

		for (let rDateValue of this.getRecurrenceDateIterator()) {
			if (rDateValue instanceof PeriodValue) {
				rDateValue = rDateValue.start
			}

			rDateValue = rDateValue.toICALJs()
			const index = ICAL.helpers.binsearchInsert(
				ruleDates,
				rDateValue,
				(a, b) => a.compare(b)
			)

			ruleDates.splice(index, 0, rDateValue)
		}

		// Is the first RDATE prior to our current DTSTART?
		if (ruleDates.length > 0 && ruleDates[0].compare(dtstart) === -1) {
			ruleDateInc = 0
			last = ruleDates[0].clone()
		} else {
			ruleDateInc = ICAL.helpers.binsearchInsert(
				ruleDates,
				dtstart,
				(a, b) => a.compare(b)
			)
			ruleDate = exDates[ruleDateInc]
		}

		for (let exDateValue of this.getRecurrenceDateIterator(true)) {
			exDateValue = exDateValue.toICALJs()
			const index = ICAL.helpers.binsearchInsert(
				exDates,
				exDateValue,
				(a, b) => a.compare(b)
			)
			exDates.splice(index, 0, exDateValue)
		}

		exDateInc = ICAL.helpers.binsearchInsert(
			exDates,
			dtstart,
			(a, b) => a.compare(b)
		)
		exDate = exDates[exDateInc]

		return new ICAL.RecurExpansion({
			dtstart,
			last,
			ruleIterators,
			ruleDateInc,
			exDateInc,
			ruleDates,
			ruleDate,
			exDates,
			exDate,
			complete
		})
	}

	/**
	 *
	 * @private
	 */
	_modify() {
		if (this._masterItem.isLocked()) {
			throw new ModificationNotAllowedError()
		}
	}

}
