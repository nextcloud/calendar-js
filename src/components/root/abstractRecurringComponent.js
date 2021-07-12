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
import AbstractComponent, {
	advertiseComponent,
	advertiseMultipleOccurrenceProperty,
	advertiseMultiValueStringPropertySeparatedByLang,
	advertiseSingleOccurrenceProperty,
} from '../abstractComponent.js'
import DateTimeValue from '../../values/dateTimeValue.js'
import DurationValue from '../../values/durationValue.js'
import PeriodValue from '../../values/periodValue.js'
import { dateFactory } from '../../factories/dateFactory.js'
import { uc } from '../../helpers/stringHelper.js'
import RecurrenceManager from '../../recurrence/recurrenceManager.js'
import { v4 as uuid } from 'uuid'
import RelationProperty from '../../properties/relationProperty.js'
import AttendeeProperty from '../../properties/attendeeProperty.js'
import Timezone from '../../timezones/timezone.js'
import RequestStatusProperty from '../../properties/requestStatusProperty.js'
import AttachmentProperty from '../../properties/attachmentProperty.js'
import ImageProperty from '../../properties/imageProperty.js'
import TextProperty from '../../properties/textProperty.js'
import AlarmComponent from '../nested/alarmComponent.js'
import TriggerProperty from '../../properties/triggerProperty.js'
import { getConfig } from '../../config.js'
import { getConstructorForComponentName } from '../nested'

/**
 * @class AbstractRecurringComponent
 * @classdesc AbstractRecurringComponent is the basis for
 * EventComponent, JournalComponent and TodoComponent.
 *
 * It contains all the logic for recurrence-expansion and
 * recurrence-management plus all management for all
 * properties and all subcomponents that the three
 * components mentioned before have in common
 */
export default class AbstractRecurringComponent extends AbstractComponent {

	/**
	 * @inheritDoc
	 */
	constructor(...args) {
		super(...args)

		/**
		 * In case this object is virtual, primary item refers to the master object
		 * that this object was forked from.
		 *
		 * Otherwise primary item is null
		 *
		 * @type {AbstractRecurringComponent}
		 * @private
		 */
		this._primaryItem = null

		/**
		 * Indicator whether this is a direct fork of a primary item, representing
		 * the very same recurrence id
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isExactForkOfPrimary = false

		/**
		 * The original recurrence-id of this occurrence.
		 * Mostly needed for range exceptions with a range
		 *
		 * @type {DateTimeValue|null}
		 * @private
		 */
		this._originalRecurrenceId = null

		/**
		 * Instance of the recurrence manager.
		 * This object is shared among all instances
		 * of a recurrence-set
		 *
		 * @type {RecurrenceManager}
		 * @private
		 */
		this._recurrenceManager = null

		/**
		 * Indicator whether this component was modified
		 * In case it was, the last-modified property
		 * needs to be updated before saving the event
		 *
		 * @type {boolean}
		 * @private
		 */
		this._dirty = false

		/**
		 * Indicator whether there have been significant changes
		 * In case the changes are considered significant,
		 * the sequence needs to be incremented
		 *
		 * @type {boolean}
		 * @private
		 */
		this._significantChange = false

		/**
		 * Id of this AbstractRecurringComponent
		 *
		 * @type {String|null}
		 * @private
		 */
		this._cachedId = null
	}

	/**
	 * Gets the primary-item of this recurring item
	 *
	 * @returns {AbstractRecurringComponent}
	 */
	get primaryItem() {
		return this._primaryItem
	}

	/**
	 * Sets the primary-item of this recurring item
	 *
	 * @param {AbstractRecurringComponent} primaryItem The new primary-item
	 */
	set primaryItem(primaryItem) {
		this._modify()
		this._primaryItem = primaryItem
	}

	/**
	 * Gets whether or not this is a fork of the primary item
	 * for the same recurrence-id
	 *
	 * @returns {boolean}
	 */
	get isExactForkOfPrimary() {
		return this._isExactForkOfPrimary
	}

	/**
	 * Sets the isExactForkOfPrimary indicator, see getter for description
	 *
	 * @param {boolean} isExactForkOfPrimary Whether or not this is an exact fork
	 */
	set isExactForkOfPrimary(isExactForkOfPrimary) {
		this._isExactForkOfPrimary = isExactForkOfPrimary
	}

	/**
	 * Gets the original recurrence-id
	 *
	 * @returns {DateTimeValue}
	 */
	get originalRecurrenceId() {
		return this._originalRecurrenceId
	}

	/**
	 * Sets the original recurrence-id
	 *
	 * @param {DateTimeValue} originalRecurrenceId The new original recurrence-id
	 */
	set originalRecurrenceId(originalRecurrenceId) {
		this._originalRecurrenceId = originalRecurrenceId
	}

	/**
	 * Gets the recurrence-manager of this recurrence-set
	 *
	 * @returns {RecurrenceManager}
	 */
	get recurrenceManager() {
		return this._recurrenceManager
	}

	/**
	 * Sets the recurrence-manager of this recurrence-set
	 *
	 * @param {RecurrenceManager} recurrenceManager The new recurrence-manager
	 */
	set recurrenceManager(recurrenceManager) {
		this._recurrenceManager = recurrenceManager
	}

	/**
	 * Gets the master-item of this recurring item
	 *
	 * @returns {AbstractRecurringComponent}
	 */
	get masterItem() {
		return this.recurrenceManager.masterItem
	}

	/**
	 * Returns whether this item is the master item
	 *
	 * @returns {boolean}
	 */
	isMasterItem() {
		return this.masterItem === this
	}

	/**
	 * Gets a unique ID for this occurrence of the event
	 *
	 * Please note that if the same event occurs in multiple calendars,
	 * this id will not be unique. Software using this library will have to
	 * manually mix in the calendar id into this id
	 *
	 * @returns {String}
	 */
	get id() {
		if (this._cachedId) {
			return this._cachedId
		}

		if (this.startDate === null) {
			this._cachedId = encodeURIComponent(this.uid)
			return this._cachedId
		}

		this._cachedId = [
			encodeURIComponent(this.uid),
			encodeURIComponent(this.getReferenceRecurrenceId().unixTime.toString()),
		].join('###')

		return this._cachedId
	}

	/**
	 * Gets the UID property
	 *
	 * @returns {String|null}
	 */
	get uid() {
		return this.getFirstPropertyFirstValue('UID')
	}

	/**
	 * Sets the UID property and the UID property of all related exceptions
	 *
	 * @param {String} uid The new UID
	 */
	set uid(uid) {
		this._recurrenceManager.updateUID(uid)
	}

	/**
	 * Gets the start date of the event
	 *
	 * @returns {DateTimeValue}
	 */
	get startDate() {
		return this.getFirstPropertyFirstValue('dtstart')
	}

	/**
	 * Sets the start date of the event
	 *
	 * @param {DateTimeValue} start The new start-date to set
	 */
	set startDate(start) {
		const oldStartDate = this.startDate
		this.updatePropertyWithValue('dtstart', start)

		if (this.isMasterItem()) {
			this._recurrenceManager.updateStartDateOfMasterItem(start, oldStartDate)
		}
	}

	/**
	 * Checks whether this item is part of a recurring set
	 *
	 * @returns {boolean}
	 */
	isPartOfRecurrenceSet() {
		return this.masterItem.isRecurring()
	}

	/**
	 * Checks whether this component is recurring
	 *
	 * @returns {boolean}
	 */
	isRecurring() {
		return this.hasProperty('RRULE') || this.hasProperty('RDATE')
	}

	/**
	 * Checks whether this component is a recurrence-exception
	 *
	 * @returns {boolean}
	 */
	isRecurrenceException() {
		return this.hasProperty('RECURRENCE-ID')
	}

	/**
	 * Checks wether this component is a recurrence-exception
	 * and whether it's modifying the future
	 *
	 * @returns {boolean}
	 */
	modifiesFuture() {
		if (!this.isRecurrenceException()) {
			return false
		}

		const property = this.getFirstProperty('RECURRENCE-ID')
		return property.getParameterFirstValue('RANGE') === 'THISANDFUTURE'
	}

	/**
	 * Creates an occurrence at the given time
	 *
	 * This is an internal function for calendar-js, used by the recurrence-manager
	 * Do not call from outside
	 *
	 * @param {DateTimeValue} recurrenceId The recurrence-Id of the forked item
	 * @param {DurationValue=} startDiff to be used when The start-diff (used for RECURRENCE-ID;RANGE=THISANDFUTURE)
	 * @returns {AbstractRecurringComponent}
	 */
	forkItem(recurrenceId, startDiff = null) {
		const occurrence = this.clone()

		occurrence.recurrenceManager = this.recurrenceManager
		occurrence.primaryItem = this

		// Exact match for master item or recurrence-exception
		if (occurrence.getReferenceRecurrenceId().compare(recurrenceId) === 0) {
			occurrence.isExactForkOfPrimary = true
		}

		if (!occurrence.hasProperty('DTSTART')) {
			throw new TypeError('Can\'t fork item without a DTSTART')
		}

		if (occurrence.getFirstPropertyFirstValue('DTSTART').timezoneId !== recurrenceId.timezoneId) {
			const originalTimezone = occurrence.getFirstPropertyFirstValue('DTSTART').getICALTimezone()
			recurrenceId = recurrenceId.getInICALTimezone(originalTimezone)
		}

		occurrence.originalRecurrenceId = recurrenceId.clone()

		const dtStartValue = occurrence.getFirstPropertyFirstValue('DTSTART')

		let period = null
		if (this._recurrenceManager.hasRecurrenceDate(false, recurrenceId)) {
			const recurrenceDate = this._recurrenceManager.getRecurrenceDate(false, recurrenceId)
			if (recurrenceDate instanceof PeriodValue) {
				period = recurrenceDate
			}
		}

		let duration
		if (occurrence.hasProperty('DTEND')) {
			const dtEndValue = occurrence.getFirstPropertyFirstValue('DTEND')
			duration = dtEndValue.subtractDateWithTimezone(dtStartValue)
		} else if (occurrence.hasProperty('DUE')) {
			const dueValue = occurrence.getFirstPropertyFirstValue('DUE')
			duration = dueValue.subtractDateWithTimezone(dtStartValue)
		}

		if (!(occurrence.isRecurrenceException() && occurrence.isExactForkOfPrimary)) {
			occurrence.updatePropertyWithValue('DTSTART', recurrenceId.clone())

			if (startDiff) {
				occurrence.startDate.addDuration(startDiff)
			}

			if (occurrence.hasProperty('DTEND')) {
				const dtEnd = occurrence.startDate.clone()
				dtEnd.addDuration(duration)
				occurrence.updatePropertyWithValue('DTEND', dtEnd)
			} else if (occurrence.hasProperty('DUE')) {
				const due = occurrence.startDate.clone()
				due.addDuration(duration)
				occurrence.updatePropertyWithValue('DUE', due)
			}

			if (period) {
				occurrence.deleteAllProperties('DTEND')
				occurrence.deleteAllProperties('DURATION')

				occurrence.updatePropertyWithValue('DTEND', period.end.clone())
			}
		}

		occurrence.resetDirty()

		return occurrence
	}

	/**
	 * Checks whether it's possible to create a recurrence exception for this event
	 * It is possible
	 *
	 * @returns {boolean}
	 */
	canCreateRecurrenceExceptions() {
		const primaryIsRecurring = this.primaryItem?.isRecurring() ?? false
		return this.isRecurring() || this.modifiesFuture() || (!this.isRecurring() && primaryIsRecurring)
	}

	/**
	 * creates a recurrence exception based on this event
	 * If the parameter thisAndAllFuture is set to true,
	 * it will apply changes to this and all future occurrences
	 *
	 * @param {boolean} thisAndAllFuture Whether to create an exception for this and all future
	 * @returns {AbstractRecurringComponent[]} the AbstractRecurringComponent of the future events.
	 * In case you set `thisAndAllFuture` to true, this will be an
	 * AbstractRecurringComponent inside a entirely new calendar component
	 */
	createRecurrenceException(thisAndAllFuture = false) {
		if (!this.canCreateRecurrenceExceptions()) {
			throw new Error('Can\'t create recurrence-exceptions for non-recurring items')
		}

		const previousPrimaryItem = this.primaryItem

		/**
		 * The overall support for RANGE=THISANDFUTURE is really bad.
		 * Instead, we have to create a new event/journal/task and
		 * set an until date on the old one.
		 *
		 * Also see:
		 * - https://github.com/nextcloud/calendar/issues/7#issuecomment-292574813
		 * - https://github.com/nextcloud/calendar/issues/7#issuecomment-299169143
		 *
		 * Right now, this replaces all future occurrence modifications,
		 * including recurrence-exceptions, RDATES and EXDATES.
		 * This is also how other CUAs handle it, but i would be happy
		 * to put that up for discussion.
		 *
		 * Keeping future RDates + their recurrence-exceptions would be rather easy.
		 * Updating recurrence-exceptions, that are based off normal recurrence rules,
		 * could be very expensive.
		 */
		if (thisAndAllFuture) {
			if (this.isExactForkOfPrimary) {
				// master item
				if (this.primaryItem.isMasterItem()) {
					this._overridePrimaryItem()
					return [this, this]
				}
			}

			this.removeThisOccurrence(true)
			this.recurrenceManager = new RecurrenceManager(this)
			this._originalRecurrenceId = null

			this.primaryItem = this
			this.updatePropertyWithValue('UID', uuid())
			this._cachedId = null

			this.addRelation('SIBLING', previousPrimaryItem.uid)
			previousPrimaryItem.addRelation('SIBLING', this.uid)

			// delete to make sure all parameters are gone
			this.deleteAllProperties('RECURRENCE-ID')
			this.deleteAllProperties('RDATE')
			this.deleteAllProperties('EXDATE')
			this.updatePropertyWithValue('CREATED', DateTimeValue.fromJSDate(dateFactory(), true))
			this.updatePropertyWithValue('DTSTAMP', DateTimeValue.fromJSDate(dateFactory(), true))
			this.updatePropertyWithValue('LAST-MODIFIED', DateTimeValue.fromJSDate(dateFactory(), true))
			this.updatePropertyWithValue('SEQUENCE', 0)
			this._significantChange = false
			this._dirty = false

			this.root = this.root.constructor.fromEmpty()
			this.root.addComponent(this)
			this.parent = this.root

			// this is a completely new event, we should set the RSVP of all attendees to true,
			// so that they receive an invitation to the new event, not only the cancellation of the old one
			for (const attendee of this.getAttendeeIterator()) {
				attendee.rsvp = true
			}
		} else {
			// delete to make sure all parameters are gone
			this.deleteAllProperties('RECURRENCE-ID')
			this.recurrenceId = this.getReferenceRecurrenceId().clone()
			this.root.addComponent(this)
			this.recurrenceManager.relateRecurrenceException(this)
			this.primaryItem = this

			this.deleteAllProperties('RDATE')
			this.deleteAllProperties('RRULE')
			this.deleteAllProperties('EXDATE')
			this.updatePropertyWithValue('CREATED', DateTimeValue.fromJSDate(dateFactory(), true))
			this.updatePropertyWithValue('DTSTAMP', DateTimeValue.fromJSDate(dateFactory(), true))
			this.updatePropertyWithValue('LAST-MODIFIED', DateTimeValue.fromJSDate(dateFactory(), true))
			this.updatePropertyWithValue('SEQUENCE', 0)

			if (this.recurrenceManager.hasRecurrenceDate(false, this.getReferenceRecurrenceId())) {
				const recurDate = this.recurrenceManager.getRecurrenceDate(false, this.getReferenceRecurrenceId())
				if (recurDate instanceof PeriodValue) {
					const valueDateTimeRecurDate = recurDate.start
					this.recurrenceManager.removeRecurrenceDate(false, recurDate)
					this.recurrenceManager.addRecurrenceDate(false, valueDateTimeRecurDate)
				}
			}

			this.originalRecurrenceId = null
		}

		return [previousPrimaryItem, this]
	}

	/**
	 * Deletes this occurrence from the series of recurring events
	 * If the parameter thisAndAllFuture is set to true,
	 * it will remove this and all future occurrences
	 *
	 * @param {Boolean} thisAndAllFuture Whether to create an exception for this and all future
	 * @throws EmptyRecurrenceSetError Thrown, when deleting an occurrence results in no more events
	 * @returns {Boolean} true if this deleted the last occurrence in set, false if there are occurrences left
	 */
	removeThisOccurrence(thisAndAllFuture = false) {
		if (!this.isPartOfRecurrenceSet()) {
			// When deleting an object, that's not part of a recurring set,
			// the calendar-document would be empty.
			return true
		}

		if (thisAndAllFuture) {
			// To get the UNTIL date, just deduct one second.
			// That's also how macOS does it, so this should be fairly
			// well supported among all clients
			const recurrenceId = this.getReferenceRecurrenceId().clone()

			const until = recurrenceId.getInTimezone(Timezone.utc)
			until.addDuration(DurationValue.fromSeconds(-1))

			for (const recurValue of this.recurrenceManager.getRecurrenceRuleIterator()) {
				recurValue.until = until.clone()
			}

			for (const recurDate of this.recurrenceManager.getRecurrenceDateIterator()) {
				let valueToCheck = recurDate
				if (recurDate instanceof PeriodValue) {
					valueToCheck = valueToCheck.start
				}

				if (recurrenceId.compare(valueToCheck) <= 0) {
					this.recurrenceManager.removeRecurrenceDate(false, recurDate)
				}
			}

			for (const exceptionDate of this.recurrenceManager.getRecurrenceDateIterator(true)) {
				if (recurrenceId.compare(exceptionDate) <= 0) {
					this.recurrenceManager.removeRecurrenceDate(true, exceptionDate)
				}
			}

			for (const exception of this.recurrenceManager.getRecurrenceExceptionList()) {
				if (recurrenceId.compare(exception.recurrenceId) <= 0) {
					this.root.deleteComponent(exception)
					this.recurrenceManager.removeRecurrenceException(exception)
				}
			}
		} else {
			// Make sure we don't leave orphaned recurrence-exceptions
			if (this.isRecurrenceException() && !this.modifiesFuture()) {
				this.root.deleteComponent(this)
				this.recurrenceManager.removeRecurrenceException(this)
			}

			// If this is based on a recurrence-date, simply delete it
			// otherwise add an exception-date
			if (this.recurrenceManager.hasRecurrenceDate(false, this.getReferenceRecurrenceId())) {
				const recurDate = this.recurrenceManager.getRecurrenceDate(false, this.getReferenceRecurrenceId())
				this.recurrenceManager.removeRecurrenceDate(false, recurDate)
			} else {
				this.recurrenceManager.addRecurrenceDate(true, this.getReferenceRecurrenceId().clone())
			}
		}

		return this.recurrenceManager.isEmptyRecurrenceSet()
	}

	/**
	 * @inheritDoc
	 */
	clone() {
		const comp = super.clone()
		comp.resetDirty()

		return comp
	}

	/**
	 * Adds a new attendee
	 *
	 * @param {AttendeeProperty} attendee The attendee property to add
	 * @private
	 * @returns {boolean}
	 */
	_addAttendee(attendee) {
		// Check for different Attendee objects with the same uri
		for (const a of this.getAttendeeIterator()) {
			if (a.email === attendee.email) {
				return false
			}
		}

		this.addProperty(attendee)
		return true
	}

	/**
	 * Adds a new attendee based on their name and email-address
	 *
	 * @param {String} name The name of the attendee to add
	 * @param {String} email The email-address of the attendee to add
	 * @returns {boolean}
	 */
	addAttendeeFromNameAndEMail(name, email) {
		const attendeeProperty = AttendeeProperty.fromNameAndEMail(name, email)
		return this._addAttendee(attendeeProperty)
	}

	/**
	 * Adds a new attendee based on their properties
	 *
	 * @param {String} name The name of the attendee to add
	 * @param {String} email The email-address of the attendee to add
	 * @param {String} role The role of the attendee to add
	 * @param {String} userType The type of attendee to add
	 * @param {Boolean} rsvp Whether or not to request a response from the attendee
	 * @returns {boolean}
	 */
	addAttendeeFromNameEMailRoleUserTypeAndRSVP(name, email, role, userType, rsvp) {
		const attendeeProperty = AttendeeProperty.fromNameEMailRoleUserTypeAndRSVP(name, email, role, userType, rsvp, false)
		return this._addAttendee(attendeeProperty)
	}

	/**
	 * Sets the organiser property from common-name and email address
	 *
	 * @param {String} name The name of the organizer
	 * @param {String} email The email-address of the organizer
	 */
	setOrganizerFromNameAndEMail(name, email) {
		this.deleteAllProperties('ORGANIZER')
		this.addProperty(AttendeeProperty.fromNameAndEMail(name, email, true))
	}

	/**
	 * Adds a new attachment from raw data
	 *
	 * @param {String} data The data of the attachment
	 * @param {String} formatType The mime-type of the attachment
	 */
	addAttachmentFromData(data, formatType = null) {
		this.addProperty(AttachmentProperty.fromData(data, formatType))
	}

	/**
	 * Adds a new attachment from a link
	 *
	 * @param {String} uri The URI of the attachment
	 * @param {String} formatType The mime-type of the attachment
	 */
	addAttachmentFromLink(uri, formatType = null) {
		this.addProperty(AttachmentProperty.fromLink(uri, formatType))
	}

	/**
	 * Adds a new contact
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.2
	 *
	 * @param {String} contact The textual contact description to add
	 */
	addContact(contact) {
		this.addProperty(new TextProperty('CONTACT', contact))
	}

	/**
	 * Adds a new comment
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.4
	 *
	 * @param {String} comment The comment to add
	 */
	addComment(comment) {
		this.addProperty(new TextProperty('COMMENT', comment))
	}

	/**
	 * Adds a new image from raw data
	 *
	 * @param {String} data Data of the image to add
	 * @param {String=} display What display-type the image is optimized for
	 * @param {String=} formatType The mime-type of the image
	 */
	addImageFromData(data, display = null, formatType = null) {
		this.addProperty(ImageProperty.fromData(data, display, formatType))
	}

	/**
	 * Adds a new image from a link
	 *
	 * @param {String} uri The URI of the image to add
	 * @param {String=} display What display-type the image is optimized for
	 * @param {String=} formatType The mime-type of the image
	 */
	addImageFromLink(uri, display = null, formatType = null) {
		this.addProperty(ImageProperty.fromLink(uri, display, formatType))
	}

	/**
	 * Creates a new RELATED-TO property based on a relation-type and id
	 * and adds it to this object
	 *
	 * @param {String} relType The type of relation to add
	 * @param {String} relId The id of the related calendar-document
	 */
	addRelation(relType, relId) {
		this.addProperty(RelationProperty.fromRelTypeAndId(relType, relId))
	}

	/**
	 * Creates a new REQUEST-STATUS property based on code and message
	 * and adds it to this object
	 *
	 * @param {Number} code The status-code of the request status
	 * @param {String} message The message of the request status
	 */
	addRequestStatus(code, message) {
		this.addProperty(RequestStatusProperty.fromCodeAndMessage(code, message))
	}

	/**
	 * Adds a new absolute alarm based on action and trigger time
	 *
	 * @param {String} action The type of alarm Action
	 * @param {DateTimeValue} alarmTime The trigger time of the alarm
	 * @returns {AlarmComponent}
	 */
	addAbsoluteAlarm(action, alarmTime) {
		const alarmComp = new AlarmComponent('VALARM', [
			['action', action],
			TriggerProperty.fromAbsolute(alarmTime),
		])

		this.addComponent(alarmComp)
		return alarmComp
	}

	/**
	 * Adds a new relative alarm based on action, trigger time and relativeTo parameter
	 *
	 * @param {String} action The type of alarm Action
	 * @param {DurationValue} alarmOffset The trigger time of the alarm
	 * @param {Boolean=} relatedToStart Whether or not the alarm is related to the event's start
	 * @returns {AlarmComponent}
	 */
	addRelativeAlarm(action, alarmOffset, relatedToStart = true) {
		const alarmComp = new AlarmComponent('VALARM', [
			['action', action],
			TriggerProperty.fromRelativeAndRelated(alarmOffset, relatedToStart),
		])

		this.addComponent(alarmComp)
		return alarmComp
	}

	/**
	 * Marks a certain property as edited
	 *
	 * @param {String} propertyName The name of the property
	 */
	markPropertyAsDirty(propertyName) {
		this.markDirty()

		// Properties that must be considered a significant change
		// according to RFC 5546 Section 2.1.4
		const props = [
			'DTSTART',
			'DTEND',
			'DURATION',
			'RRULE',
			'RDATE',
			'EXDATE',
			'STATUS',
			...getConfig('property-list-significant-change', []),
		]

		if (props.includes(uc(propertyName))) {
			this.markChangesAsSignificant()
		}
	}

	/**
	 * Marks a certain component as edited
	 *
	 * @param {String} componentName The name of the component
	 */
	markSubComponentAsDirty(componentName) {
		this.markDirty()

		if (getConfig('component-list-significant-change', []).includes(componentName)) {
			this.markChangesAsSignificant()
		}
	}

	/**
	 * Returns whether or not this component is dirty
	 *
	 * @returns {boolean}
	 */
	isDirty() {
		return this._dirty || this._significantChange
	}

	/**
	 * Marks this object as dirty
	 */
	markDirty() {
		this._dirty = true
	}

	/**
	 * Marks changes as significant. Can be called by the program using this lib
	 */
	markChangesAsSignificant() {
		this._significantChange = true
	}

	/**
	 * Updates the event after modifications.
	 *
	 * @returns {boolean} true if last-modified was updated
	 */
	undirtify() {
		if (!this.isDirty()) {
			return false
		}

		if (!this.hasProperty('SEQUENCE')) {
			this.sequence = 0
		}

		this.updatePropertyWithValue('DTSTAMP', DateTimeValue.fromJSDate(dateFactory(), true))
		this.updatePropertyWithValue('LAST-MODIFIED', DateTimeValue.fromJSDate(dateFactory(), true))
		if (this._significantChange) {
			this.sequence++
		}

		this.resetDirty()

		return true
	}

	/**
	 * Resets the dirty indicators without updating DTSTAMP or LAST-MODIFIED
	 */
	resetDirty() {
		this._dirty = false
		this._significantChange = false
	}

	/**
	 * @inheritDoc
	 */
	updatePropertyWithValue(propertyName, value) {
		super.updatePropertyWithValue(propertyName, value)

		if (uc(propertyName) === 'UID') {
			this._cachedId = null
		}

		this.markPropertyAsDirty(propertyName)
	}

	/**
	 * @inheritDoc
	 */
	addProperty(property) {
		this.markPropertyAsDirty(property.name)
		property.subscribe(() => this.markPropertyAsDirty(property.name))
		return super.addProperty(property)
	}

	/**
	 * @inheritDoc
	 */
	deleteProperty(property) {
		this.markPropertyAsDirty(property.name)
		return super.deleteProperty(property)
	}

	/**
	 * @inheritDoc
	 */
	deleteAllProperties(propertyName) {
		this.markPropertyAsDirty(propertyName)
		return super.deleteAllProperties(propertyName)
	}

	/**
	 * @inheritDoc
	 */
	addComponent(component) {
		this.markSubComponentAsDirty(component.name)
		component.subscribe(() => this.markSubComponentAsDirty(component.name))
		return super.addComponent(component)
	}

	/**
	 * @inheritDoc
	 */
	deleteComponent(component) {
		this.markSubComponentAsDirty(component.name)
		return super.deleteComponent(component)
	}

	/**
	 * @inheritDoc
	 */
	deleteAllComponents(componentName) {
		this.markSubComponentAsDirty(componentName)
		return super.deleteAllComponents(componentName)
	}

	/**
	 * Gets a recurrence-id that has to be used to refer to this event.
	 * This is used for recurrence-management
	 *
	 * @returns {DateTimeValue}
	 */
	getReferenceRecurrenceId() {
		if (this.originalRecurrenceId) {
			return this.originalRecurrenceId
		} else if (this.recurrenceId) {
			return this.recurrenceId
		} else {
			return this.startDate
		}
	}

	/**
	 * Overrides the master item with this one
	 *
	 * @private
	 */
	_overridePrimaryItem() {
		const oldStartDate = this.primaryItem.startDate

		for (const property of this.primaryItem.getPropertyIterator()) {
			this.primaryItem.deleteProperty(property)
		}

		for (const property of this.getPropertyIterator()) {
			this.primaryItem.addProperty(property)
		}

		this.recurrenceManager.resetCache()
		if (this.startDate.compare(oldStartDate) !== 0) {
			this.recurrenceManager.updateStartDateOfMasterItem(this.startDate, oldStartDate)
		}
	}

	/**
	 * @inheritDoc
	 */
	static _getConstructorForComponentName(componentName) {
		return getConstructorForComponentName(componentName)
	}

	/**
	 * @inheritDoc
	 */
	static fromICALJs(...args) {
		const comp = super.fromICALJs(...args)
		comp.resetDirty()

		return comp
	}

}

/**
 * Date-Time stamp of this object.
 * It has different meaning, based on whether or not a method is defined
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.7.2
 *
 * @name EventComponent#stampTime
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'stampTime',
	iCalendarName: 'DTSTAMP',
})

/**
 * Recurrence-ID of this object, used for recurrence-exceptions
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.4
 *
 * @name EventComponent#recurrenceId
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'recurrenceId',
	iCalendarName: 'RECURRENCE-ID',
})

/**
 * Special color for this event / journal / task
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.9
 *
 * @name EventComponent#color
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, 'color')

/**
 * Creation Time of this event / journal / task
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.7.1
 *
 * @name EventComponent#creationTime
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'creationTime',
	iCalendarName: 'CREATED',
})

/**
 * The time this event / journal / task
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.7.3
 *
 * @name EventComponent#modificationTime
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'modificationTime',
	iCalendarName: 'LAST-MODIFIED',
})

/**
 * Organizer of this event / journal / task
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.3
 *
 * @name EventComponent#organizer
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, 'organizer')

/**
 * Revision of this this event / journal / task
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.7.4
 *
 * @name EventComponent#sequence
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, 'sequence')

/**
 * Status of this event / journal / task
 * This indicates whether an event is tentative / confirmed / cancelled
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.11
 *
 * @name EventComponent#status
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, 'status')

/**
 * URL of a more dynamic rendition of this event / journal / task
 * DO NOT use this to simply point to a website merely related.
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.6
 *
 * @name EventComponent#url
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, 'url')

/**
 * Title of this event / journal / task
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.12
 *
 * @name EventComponent#title
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'title',
	iCalendarName: 'SUMMARY',
})

/**
 * Access class of this event / journal / task
 * This determines what other users can see when sharing
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.3
 *
 * @name EventComponent#accessClass
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'accessClass',
	iCalendarName: 'class',
	allowedValues: ['PUBLIC', 'PRIVATE', 'CONFIDENTIAL'],
	defaultValue: 'PUBLIC',
	unknownValue: 'PRIVATE',
})

/**
 * Returns an iterator over all categories
 * If the parameter lang is given, it will only
 * return an iterator for Categories matching that language
 *
 * @name AbstractRecurringComponent#getCategoryIterator
 * @function
 * @param {String=} lang
 * @returns {IterableIterator<String>}
 */

/**
 * Returns a list of all categories
 * If the parameter lang is given, it will only
 * return an iterator for Categories matching that language
 *
 * @name AbstractRecurringComponent#getCategoryList
 * @function
 * @param {String=} lang
 * @returns {String[]}
 */

/**
 * Adds a new category
 *
 * @name AbstractRecurringComponent#addCategory
 * @function
 * @param {String} category
 * @param {String=} lang
 */

/**
 * Removes a category
 *
 * @name AbstractRecurringComponent#removeCategory
 * @function
 * @param {String} category
 * @param {String=} lang
 */

/**
 * Clear all categories of a given language
 *
 * @name AbstractRecurringComponent#clearAllCategories
 * @function
 */
advertiseMultiValueStringPropertySeparatedByLang(AbstractRecurringComponent.prototype, {
	name: 'category',
	pluralName: 'categories',
	iCalendarName: 'CATEGORIES',
})

/**
 * Returns an iterator over all attendees
 *
 * @name AbstractRecurringComponent#getAttendeeIterator
 * @function
 * @returns {IterableIterator<AttendeeProperty>}
 */

/**
 * Gets a list of all attendees
 *
 * @name AbstractRecurringComponent#getAttendeeList
 * @function
 * @returns {AttachmentProperty[]}
 */

/**
 * Removes an attendee from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeAttendee
 * @function
 * @param {AttendeeProperty} attendee
 */

/**
 * Removes all attendees from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllAttendees
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'attendee',
})

/**
 * Returns an iterator over all attachments
 *
 * @name AbstractRecurringComponent#getAttachmentIterator
 * @function
 * @returns {IterableIterator<AttachmentProperty>}
 */

/**
 * Gets a list of all attachments
 *
 * @name AbstractRecurringComponent#getAttachmentList
 * @function
 * @returns {AttachmentProperty[]}
 */

/**
 * Removes one attachment from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeAttachment
 * @function
 * @param {AttachmentProperty} attachment
 */

/**
 * Removes all attachments from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllAttachments
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'attachment',
	iCalendarName: 'ATTACH',
})

/**
 * Returns an iterator over all relation properties
 *
 * @name AbstractRecurringComponent#getRelationIterator
 * @function
 * @returns {IterableIterator<RelationProperty>}
 */

/**
 * Returns a list of all relation properties
 *
 * @name AbstractRecurringComponent#getRelationList
 * @function
 * @returns {RelationProperty[]}
 */

/**
 * Removes a relation from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeRelation
 * @function
 * @param {RelationProperty} relation
 */

/**
 * Removes all relations from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllRelations
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'relation',
	iCalendarName: 'RELATED-TO',
})

/**
 * Returns an iterator over all comments in this event / journal / task
 *
 * @name AbstractRecurringComponent#getCommentIterator
 * @function
 * @returns {IterableIterator<TextProperty>}
 */

/**
 * Returns a list of all comments in this event / journal / task
 *
 * @name AbstractRecurringComponent#getCommentList
 * @function
 * @returns {TextProperty[]}
 */

/**
 * Removes a comment from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeComment
 * @function
 * @param {TextProperty} comment
 */

/**
 * Removes all comments from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllComments
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, 'comment')

/**
 * Returns an iterator over all contacts referenced in this event / journal / task
 *
 * @name AbstractRecurringComponent#getContactIterator
 * @function
 * @returns {IterableIterator<TextProperty>}
 */

/**
 * Returns a list of all contacts referenced in this event / journal / task
 *
 * @name AbstractRecurringComponent#getContactList
 * @function
 * @returns {TextProperty[]}
 */

/**
 * Removes one contact from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeContact
 * @function
 * @param {TextProperty} contact
 */

/**
 * Removes all contacts from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllContacts
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, 'contact')

/**
 * Returns an iterator over all image properties
 *
 * @name AbstractRecurringComponent#getImageIterator
 * @function
 * @returns {IterableIterator<ImageProperty>}
 */

/**
 * Returns a list of all image properties
 *
 * @name AbstractRecurringComponent#getImageList
 * @function
 * @returns {ImageProperty[]}
 */

/**
 * Removes one image from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeImage
 * @function
 * @param {ImageProperty} image
 */

/**
 * Removes all images from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllImages
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, 'image')

/**
 * Returns an iterator over all request status
 *
 * @name AbstractRecurringComponent#getRequestStatusIterator
 * @function
 * @returns {IterableIterator<RequestStatusProperty>}
 */

/**
 * Returns a list of all request status
 *
 * @name AbstractRecurringComponent#getRequestStatusList
 * @function
 * @returns {RequestStatusProperty[]}
 */

/**
 * Removes one request status from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeRequestStatus
 * @function
 * @param {RequestStatusProperty} requestStatus
 */

/**
 * Removes all request status from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllRequestStatus
 * @function
 */
advertiseMultipleOccurrenceProperty(AbstractRecurringComponent.prototype, {
	name: 'requestStatus',
	pluralName: 'requestStatus',
	iCalendarName: 'REQUEST-STATUS',
})

/**
 * Returns an iterator of all alarms
 *
 * @name AbstractRecurringComponent#getAlarmIterator
 * @function
 * @returns {IterableIterator<AlarmComponent>}
 */

/**
 * Returns a list of all alarms
 *
 * @name AbstractRecurringComponent#getAlarmList
 * @function
 * @returns {AlarmComponent[]}
 */

/**
 * Removes an alarm from this event / journal / task
 *
 * @name AbstractRecurringComponent#removeAlarm
 * @function
 * @param {AlarmComponent} alarm
 */

/**
 * Removes all alarms from this event / journal / task
 *
 * @name AbstractRecurringComponent#clearAllAlarms
 * @function
 */
advertiseComponent(AbstractRecurringComponent.prototype, 'alarm')
