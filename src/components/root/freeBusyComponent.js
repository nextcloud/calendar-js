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
import AbstractComponent, {
	advertiseMultipleOccurrenceProperty,
	advertiseSingleOccurrenceProperty,
} from '../abstractComponent.js'
import Timezone from '../../timezones/timezone.js'
import AttendeeProperty from '../../properties/attendeeProperty.js'

/**
 * @class FreeBusyComponent
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.6.4
 */
export default class FreeBusyComponent extends AbstractComponent {

	/**
	 * Gets the start-date of the FreeBusy component
	 *
	 * @return {DateTimeValue}
	 */
	get startDate() {
		return this.getFirstPropertyFirstValue('DTSTART')
	}

	/**
	 * Sets the start-date of the FreeBusy component
	 *
	 * @param {DateTimeValue} startDate The start of the queried time-range
	 */
	set startDate(startDate) {
		this._modify()
		this.updatePropertyWithValue('DTSTART', startDate.getInTimezone(Timezone.utc))
	}

	/**
	 * Gets the end-date of the FreeBusy component
	 *
	 * @return {DateTimeValue}
	 */
	get endDate() {
		return this.getFirstPropertyFirstValue('DTEND')
	}

	/**
	 * Sets the start-date of the FreeBusy component
	 *
	 * @param {DateTimeValue} endDate The end of the queried time-range
	 */
	set endDate(endDate) {
		this._modify()
		this.updatePropertyWithValue('DTEND', endDate.getInTimezone(Timezone.utc))
	}

	/**
	 * Gets an iterator over all FreeBusyProperties
	 */
	* getFreeBusyIterator() {
		yield * this.getPropertyIterator('FREEBUSY')
	}

	/**
	 * Adds a new attendee based on their name and email-address
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
	 *
	 * @param {string} name The name of the attendee to add
	 * @param {string} email The email-address of the attendee to add
	 */
	addAttendeeFromNameAndEMail(name, email) {
		this._modify()
		this.addProperty(AttendeeProperty.fromNameAndEMail(name, email))
	}

	/**
	 * Sets the organiser property from common-name and email address
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.3
	 *
	 * @param {string} name The name of the organizer
	 * @param {string} email The email-address of the organizer
	 */
	setOrganizerFromNameAndEMail(name, email) {
		this._modify()
		this.deleteAllProperties('ORGANIZER')
		this.addProperty(AttendeeProperty.fromNameAndEMail(name, email, true))
	}

}

/**
 * The organizer of this FreeBusy component
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.3
 *
 * @name FreeBusyComponent#organizer
 * @type {AttendeeProperty}
 */
advertiseSingleOccurrenceProperty(FreeBusyComponent.prototype, 'organizer')

/**
 * The UID of this FreeBusy component
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.7
 *
 * @name FreeBusyComponent#organizer
 * @type {AttendeeProperty}
 */
advertiseSingleOccurrenceProperty(FreeBusyComponent.prototype, 'uid')

/**
 * Returns an iterator of all attendees
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name FreeBusyComponent#getAttendeeIterator
 * @function
 * @return {IterableIterator<AttendeeProperty>}
 */

/**
 * Returns a list of all attendees
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name FreeBusyComponent#getAttendeeList
 * @function
 * @return {AttendeeProperty[]}
 */

/**
 * Removes an attendee
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name FreeBusyComponent#removeAttendee
 * @function
 * @param {AttendeeProperty} attendee
 */

/**
 * Removes all attendees
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 *
 * @name FreeBusyComponent#clearAllAttendees
 * @function
 */
advertiseMultipleOccurrenceProperty(FreeBusyComponent.prototype, 'attendee')
