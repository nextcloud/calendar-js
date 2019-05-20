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
import ConferenceProperty from '../../properties/conferenceProperty.js';
import GeoProperty from '../../properties/geoProperty.js';

/**
 * @class ToDoComponent
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.6.2
 */
export default class ToDoComponent extends AbstractRecurringComponent {

	/**
	 * Gets the geographical position property
	 *
	 * @returns {GeoProperty}
	 */
	get geographicalPosition() {
		return this.getFirstProperty('GEO')
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
		this.addProperty(ConferenceProperty.fromURILabelAndFeatures(uri, label, features))
	}
}

/**
 * The time when a task was completed
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.2.1
 *
 * @name ToDoComponent#completedTime
 * @type {DateTimeValue}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, {
	name: 'completedTime',
	iCalendarName: 'COMPLETED',
})

/**
 * The time when a task is due
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.2.3
 *
 * @name ToDoComponent#dueTime
 * @type {DateTimeValue}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, {
	name: 'dueTime',
	iCalendarName: 'DUE',
})

/**
 * The time when a task was completed
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.2.2
 *
 * @name ToDoComponent#endTime
 * @type {DateTimeValue}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, {
	name: 'endTime',
	iCalendarName: 'DTEND',
})

/**
 * The time when a task was completed
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.2.5
 *
 * @name ToDoComponent#duration
 * @type {DurationValue}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, {
	name: 'duration',
})

/**
 * The percentage a task was already fulfilled
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.8
 *
 * @name ToDoComponent#percent
 * @type {Number}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, {
	name: 'percent',
	iCalendarName: 'PERCENT-COMPLETE'
})

/**
 * Description of this task.
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name ToDoComponent#description
 * @type {String}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, 'description')

/**
 * Location of this task.
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.7
 *
 * @name ToDoComponent#location
 * @type {String}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, 'location')

/**
 * Priority of this task.
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.9
 *
 * @name ToDoComponent#priority
 * @type {String}
 */
advertiseSingleOccurrenceProperty(ToDoComponent.prototype, {
	name: 'priority',
	allowedValues: Array.from(Array(10).keys()),
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
 * @name ToDoComponent#getResourceIterator
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
 * @name ToDoComponent#getResourceList
 * @function
 * @param {String=} lang
 * @returns {String[]}
 */

/**
 * Adds a resource
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name ToDoComponent#addResource
 * @function
 * @param {String} resource
 * @param {String=} lang
 */

/**
 * Removes a resource
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name ToDoComponent#removeResource
 * @function
 * @param {String} resource
 * @param {String=} lang
 */

/**
 * Removes all resources from this task
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.10
 *
 * @name ToDoComponent#clearAllResources
 * @function
 * @param {String=} lang
 */
advertiseMultiValueStringPropertySeparatedByLang(ToDoComponent.prototype, {
	name: 'resource',
	iCalendarName: 'RESOURCES'
})

/**
 * Gets an iterator over all conference properties
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name ToDoComponent#getConferenceIterator
 * @function
 * @returns {IterableIterator<ConferenceProperty>}
 */

/**
 * Gets a list of all conference properties
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name ToDoComponent#getConferenceList
 * @function
 * @returns {ConferenceProperty[]}
 */

/**
 * Removes a conference from this event
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name ToDoComponent#removeConference
 * @function
 * @param {ConferenceProperty} conference
 */

/**
 * Removes all conferences from this event
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.11
 *
 * @name ToDoComponent#clearAllConferences
 * @function
 */
advertiseMultipleOccurrenceProperty(ToDoComponent.prototype, 'conference')
