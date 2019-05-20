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
import AbstractRecurringComponent from "./abstractRecurringComponent.js";
import {
	advertiseMultipleOccurrenceProperty,
	advertiseMultiValueStringPropertySeparatedByLang,
	advertiseSingleOccurrenceProperty
} from '../abstractComponent.js';
import {
	getAgeOfBirthday,
	getIconForBirthday,
	getTypeOfBirthdayEvent
} from '../../helpers/birthdayHelper.js';
import DurationValue from '../../values/durationValue.js';
import GeoProperty from '../../properties/geoProperty.js';
import ConferenceProperty from '../../properties/conferenceProperty.js';

/**
 * @class EventComponent
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.6.1
 */
export default class EventComponent extends AbstractRecurringComponent {

	/**
	 * Returns whether this event is an all-day event
	 *
	 * @returns {boolean}
	 */
	isAllDay() {
		return this.startDate.isDate && this.endDate.isDate
	}

	/**
	 * Checks whether it's possible to switch from date-time to date or vise-versa
	 *
	 * @returns {boolean}
	 */
	canModifyAllDay() {
		return !this.isRecurring()
	}

	/**
	 * Gets the calculated end-date of the event
	 *
	 * Quote from RFC 5545 3.6.1:
	 * The "DTSTART" property for a "VEVENT" specifies the inclusive
	 * start of the event.  For recurring events, it also specifies the
	 * very first instance in the recurrence set.  The "DTEND" property
	 * for a "VEVENT" calendar component specifies the non-inclusive end
	 * of the event.  For cases where a "VEVENT" calendar component
	 * specifies a "DTSTART" property with a DATE value type but no
	 * "DTEND" nor "DURATION" property, the event's duration is taken to
	 * be one day.  For cases where a "VEVENT" calendar component
	 * specifies a "DTSTART" property with a DATE-TIME value type but no
	 * "DTEND" property, the event ends on the same calendar date and
	 * time of day specified by the "DTSTART" property.
	 *
	 * @returns {DateTimeValue}
	 */
	get endDate() {
		if (this.hasProperty('dtend')) {
			return this.getFirstPropertyFirstValue('dtend')
		}

		const dtend = this.startDate().clone()

		if (this.hasProperty('duration')) {
			dtend.addDuration(this.getFirstPropertyFirstValue('duration'))
		} else if(this.isAllDay()) {
			dtend.addDuration(DurationValue.fromSeconds(60 * 60 * 24))
		} // There is nothing to do when this event is not allday

		return dtend
	}

	/**
	 * Sets the end time of the event
	 *
	 * @param {DateTimeValue} end
	 */
	set endDate(end) {
		this.deleteAllProperties('duration')
		this.updatePropertyWithValue('dtend', end)
	}

	/**
	 * Gets the calculated duration of the event
	 *
	 * @returns {DurationValue}
	 */
	get duration() {
		if (this.hasProperty('duration')) {
			return this.getFirstPropertyFirstValue('duration')
		}

		return this.startDate.subtractDateTz(this.endDate)
	}

	/**
	 * Sets the calculated duration of the event
	 *
	 * @param {DurationValue} duration
	 */
	set duration(duration) {
		this.deleteAllProperties('dtend')
		this.updatePropertyWithValue('duration', duration)
	}

	/**
	 * Sets the geographical position based on latitude and longitude
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.6
	 *
	 * @param {Number} lat - latitude
	 * @param {Number} long - longitude
	 */
	setGeographicalPositionFromLatitudeAndLongitude(lat, long) {
		this.deleteAllProperties('GEO')
		this.addProperty(GeoProperty.fromPosition(lat, long))
	}

	/**
	 * Adds a new conference property based on URI, label and features
	 *
	 * @url https://tools.ietf.org/html/rfc7986#section-5.11
	 *
	 * @param {String} uri
	 * @param {String=} label
	 * @param {String[]=} features
	 */
	addConference(uri, label=null, features=null) {
		this._modify()
		this.addProperty(ConferenceProperty.fromURILabelAndFeatures(uri, label, features))
	}

	// /**
	//  * Adds a given duration to the length of the event
	//  *
	//  * @param {DurationValue} duration
	//  */
	// addDuration(duration) {
	// 	if (this.hasProperty('DTEND')) {
	// 		this.endDate.addDuration(duration)
	// 	} else if (this.hasProperty('DURATION')) {
	// 		this.duration.addDuration(duration)
	// 	} else {
	// 		const calculatedEnd = this.endDate
	// 		calculatedEnd.addDuration(duration)
	//
	// 		this.endDate = calculatedEnd
	// 	}
	// }

	// /**
	//  * Shifts the entire event by the given duration
	//  *
	//  * @param {DurationValue} duration
	//  * @param {Boolean} allDay
	//  */
	// shiftByDuration(duration, allDay=false, timezone, ) {
	// 	this.startDate.addDuration(duration)
	//
	// 	if (this.hasProperty('DTEND')) {
	// 		this.endDate.addDuration(duration)
	// 	}
	//
	// 	if (allDay !== this.allDay) {
	//
	// 	} else {
	//
	// 	}
	// 	if (!this.canModifyAllDay()) {
	// 		throw new TypeError('Can\'t modify allDay of this event')
	// 	}
	//
	// 	// TODO - include allday
	// }

	/**
	 * Checks if this is a birthday event
	 *
	 * @returns {boolean}
	 */
	isBirthdayEvent() {
		return getTypeOfBirthdayEvent(this) === 'BDAY'
	}

	/**
	 * Gets the icon to the birthday event
	 *
	 * @returns {string}
	 */
	getIconForBirthdayEvent() {
		return getIconForBirthday(this)
	}

	/**
	 * Calculates the age of the birthday
	 *
	 * @returns {number}
	 */
	getAgeForBirthdayEvent() {
		return getAgeOfBirthday(this, this.startDate.year)
	}

	/**
	 * Serializes the entire series to ICS
	 *
	 * @returns {string}
	 */
	toICSEntireSeries() {
		return this.root.toICS()
	}

	/**
	 * Serializes exactly this recurrence to ICS
	 * It removes all recurrence information
	 *
	 * @returns {string}
	 */
	toICSThisOccurrence() {
		const clone = this.clone()

		clone.deleteAllProperties('RRULE')
		clone.deleteAllProperties('EXRULE')
		clone.deleteAllProperties('RDATE')
		clone.deleteAllProperties('EXDATE')
		clone.deleteAllProperties('RECURRENCE-ID')

		clone.root = clone.root.constructor.fromEmpty()
		clone.parent = clone.root
		clone.root.addComponent(clone)

		return root.toICS()
	}

	/**
	 * Checks if this event is in a given time-frame
	 *
	 * @param {DateTimeValue} start
	 * @param {DateTimeValue} end
	 * @returns {boolean}
	 */
	isInTimeFrame(start, end) {
		return start.compare(this.endDate) <= 0 && end.compare(this.startDate) >= 0
	}
}

/**
 * Time-transparency of this event.
 * If set to TRANSPARENT, this event will be ignored for FREE/BUSY calculations.
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.2.7
 *
 * @name EventComponent#timeTransparency
 * @type {String}
 */
advertiseSingleOccurrenceProperty(EventComponent.prototype, {
	name: 'timeTransparency',
	iCalendarName: 'TRANSP',
	allowedValues: ['OPAQUE', 'TRANSPARENT'],
	defaultValue: 'OPAQUE'
})

/**
 * Description of this event.
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name EventComponent#description
 * @type {String}
 */
advertiseSingleOccurrenceProperty(EventComponent.prototype, 'description')

/**
 * Geographical position of this event
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.6
 *
 * @name EventComponent#geographicalPosition
 * @type {String}
 */
advertiseSingleOccurrenceProperty(EventComponent.prototype, {
	name: 'geographicalPosition',
	iCalendarName: 'GEO'
})

/**
 * Location that this event takes place in
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.7
 *
 * @name EventComponent#location
 * @type {String}
 */
advertiseSingleOccurrenceProperty(EventComponent.prototype, 'location')

/**
 * Priority of this event
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.9
 *
 * @name EventComponent#priority
 * @type Number
 */
advertiseSingleOccurrenceProperty(EventComponent.prototype, {
	name: 'priority',
	allowedValues: Array(9).keys(),
	defaultValue: 0,
	unknownValue: 0
})

/**
 * Returns an iterator over all resources
 * If the parameter lang is given, it will only
 * return an iterator for Resources matching that language
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name EventComponent#getResourceIterator
 * @function
 * @param {String=} lang
 * @returns {IterableIterator<String>}
 */

/**
 * Returns a list of all resources
 * If the parameter lang is given, it will only
 * return an iterator for resources matching that language
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name EventComponent#getResourceList
 * @function
 * @param {String=} lang
 * @returns {String[]}
 */

/**
 * Adds a resource
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name EventComponent#addResource
 * @function
 * @param {String} resource
 * @param {String=} lang
 */

/**
 * Removes a resource
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name EventComponent#removeResource
 * @function
 * @param {String} resource
 * @param {String=} lang
 */

/**
 * Removes all resources from this event
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name EventComponent#clearAllResources
 * @function
 * @param {String=} lang
 */
advertiseMultiValueStringPropertySeparatedByLang(EventComponent.prototype, {
	name: 'resource',
	iCalendarName: 'RESOURCES'
})

/**
 * Gets an iterator over all conference properties
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name EventComponent#getConferenceIterator
 * @function
 * @returns {IterableIterator<ConferenceProperty>}
 */

/**
 * Gets a list of all conference properties
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name EventComponent#getConferenceList
 * @function
 * @returns {ConferenceProperty[]}
 */

/**
 * Removes a conference from this event
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name EventComponent#removeConference
 * @function
 * @param {ConferenceProperty} conference
 */

/**
 * Removes all conferences from this event
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name EventComponent#clearAllConferences
 * @function
 */
advertiseMultipleOccurrenceProperty(EventComponent.prototype, 'conference')
