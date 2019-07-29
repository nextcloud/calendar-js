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
	advertiseMultipleOccurrenceProperty,
	advertiseSingleOccurrenceProperty
} from '../abstractComponent.js'
import AttendeeProperty from '../../properties/attendeeProperty.js'
import TriggerProperty from '../../properties/triggerProperty.js'

/**
 * @class AlarmComponent
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.6.6
 */
export default class AlarmComponent extends AbstractComponent {

	/**
	 * Adds a new attendee based on their name and email-address
	 *
	 * @param {String} name
	 * @param {String} email
	 * @returns {boolean}
	 */
	addAttendeeFromNameAndEMail(name, email) {
		const attendeeProperty = AttendeeProperty.fromNameAndEMail(name, email)
		return this.addProperty(attendeeProperty)
	}

	/**
	 * Gets the trigger property
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.6.3
	 *
	 * @returns {TriggerProperty}
	 */
	get trigger() {
		return this.getFirstProperty('TRIGGER')
	}

	/**
	 * Sets an absolute alarm
	 *
	 * @param {DateTimeValue} alarmTime
	 */
	setTriggerFromAbsolute(alarmTime) {
		const triggerProperty = TriggerProperty.fromAbsolute(alarmTime)
		this.deleteAllProperties('TRIGGER')
		this.addProperty(triggerProperty)
	}

	/**
	 * Sets a relative trigger
	 *
	 * @param {DurationValue} alarmOffset
	 * @param {Boolean=} relatedToStart Related to Start or end?
	 */
	setTriggerFromRelative(alarmOffset, relatedToStart = true) {
		const triggerProperty = TriggerProperty.fromRelativeAndRelated(alarmOffset, relatedToStart)
		this.deleteAllProperties('TRIGGER')
		this.addProperty(triggerProperty)
	}

}

/**
 * Action to be taken when this Alarm is due
 * Possible values:
 * - AUDIO
 * - DISPLAY
 * - EMAIL
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.6.1
 *
 * @name AlarmComponent#action
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AlarmComponent.prototype, 'action')

/**
 * Description for this alarm
 * Can only be used in combination with action DISPLAY and EMAIL
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name AlarmComponent#description
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AlarmComponent.prototype, 'description')

/**
 * Summary for this alarm
 * Can only be used in combination with action EMAIL
 * Will be used as the EMAIL's subject
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.12
 *
 * @name AlarmComponent#summary
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AlarmComponent.prototype, 'summary')

/**
 * The duration specifies the delay period between repeated alarms.
 * This property must be specified along with the repeat property
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.2.5
 *
 * @name AlarmComponent#duration
 * @type {String}
 */
advertiseSingleOccurrenceProperty(AlarmComponent.prototype, 'duration')

/**
 * The number of times an alarm should be repeated.
 * This property must be specified along with the duration property
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.6.2
 *
 * @name AlarmComponent#repeat
 * @type {Number}
 */
advertiseSingleOccurrenceProperty(AlarmComponent.prototype, 'repeat')

/**
 * This attachment points to a sound file, can only be used in combination
 * with ACTION AUDIO
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.1
 *
 * @name AlarmComponent#attachment
 * @type {AttachmentProperty}
 */
advertiseSingleOccurrenceProperty(AlarmComponent.prototype, {
	name: 'attachment',
	iCalendarName: 'ATTACH'
})

/**
 * Get an iterator over all attendees
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name AlarmComponent#getAttendeeIterator
 * @function
 * @returns {IterableIterator<AttendeeProperty>}
 */

/**
 * Get a list of all attendees
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name AlarmComponent#getAttendeeList
 * @function
 * @returns {AttendeeProperty[]}
 */

/**
 * Adds a new attendee to this alarm-component
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name AlarmComponent#addAttendee
 * @function
 * @param {AttendeeProperty} attendee
 */

/**
 * Removes an attendee from this alarm-component
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name AlarmComponent#removeAttendee
 * @function
 * @param {AttendeeProperty} attendee
 */

/**
 * Removes all attendees from this alarm-component
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name AlarmComponent#clearAllAttendees
 * @function
 */
advertiseMultipleOccurrenceProperty(AlarmComponent.prototype, 'attendee')
