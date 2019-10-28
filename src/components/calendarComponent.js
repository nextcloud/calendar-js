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
	advertiseSingleOccurrenceProperty
} from './abstractComponent.js'
import { getConstructorForComponentName } from './root'
import { getConfig } from '../config.js'
import ICAL from 'ical.js'

/**
 * This class represents one VCALENDAR block
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.4
 */
export default class CalendarComponent extends AbstractComponent {

	/**
	 * Constructor
	 *
	 * @param {String} name
	 * @param {Property[]} properties
	 * @param {AbstractComponent[]} components
	 */
	constructor(name = 'VCALENDAR', properties = [], components = []) {
		super(name, properties, components)
		this.root = this
		this.parent = null
	}

	/**
	 * Gets an iterator over all VTIMEZONE components
	 *
	 * @returns {IterableIterator<TimezoneComponent>}
	 */
	* getTimezoneIterator() {
		yield * this.getComponentIterator('vtimezone')
	}

	/**
	 * Gets an iterator over all VObject components
	 *
	 * @returns {IterableIterator<EventComponent|JournalComponent|ToDoComponent>}
	 */
	* getVObjectIterator() {
		yield * this.getEventIterator()
		yield * this.getJournalIterator()
		yield * this.getTodoIterator()
	}

	/**
	 * Gets an iterator over all VEVENT components
	 *
	 * @returns {IterableIterator<EventComponent>}
	 */
	* getEventIterator() {
		yield * this.getComponentIterator('vevent')
	}

	/**
	 * Gets an iterator over all VFREEBUSY components
	 *
	 * @returns {IterableIterator<FreeBusyComponent>}
	 */
	* getFreebusyIterator() {
		yield * this.getComponentIterator('vfreebusy')
	}

	/**
	 * Gets an iterator over all VJOURNAL components
	 *
	 * @returns {IterableIterator<JournalComponent>}
	 */
	* getJournalIterator() {
		yield * this.getComponentIterator('vjournal')
	}

	/**
	 * Gets an iterator over all VTODO components
	 *
	 * @returns {IterableIterator<ToDoComponent>}
	 */
	* getTodoIterator() {
		yield * this.getComponentIterator('vtodo')
	}

	/**
	 * @inheritDoc
	 */
	static _getConstructorForComponentName(componentName) {
		return getConstructorForComponentName(componentName)
	}

	/**
	 * Converts this calendar component into text/calendar
	 *
	 * @param {boolean} cleanUpTimezones Whether or not to clean up timezone data
	 * @returns {string}
	 */
	toICS(cleanUpTimezones = true) {
		for (const vObject of this.getVObjectIterator()) {
			vObject.undirtify()
		}

		const icalRoot = this.toICALJs()
		if (cleanUpTimezones) {
			ICAL.helpers.updateTimezones(icalRoot)
		}
		return icalRoot.toString()
	}

	/**
	 * Creates a new empty calendar-component
	 *
	 * @param {String[][]=} additionalProps
	 * @returns {CalendarComponent}
	 */
	static fromEmpty(additionalProps = []) {
		return new this('VCALENDAR', [
			['prodid', getConfig('PRODID', '-//IDN georgehrke.com//calendar-js//EN')],
			['calscale', 'GREGORIAN'],
			['version', '2.0'],
		].concat(additionalProps))
	}

	/**
	 * Creates a new calendar-component with a method
	 *
	 * @param {string} method
	 * @returns {CalendarComponent}
	 */
	static fromMethod(method) {
		return this.fromEmpty([['method', method]])
	}

	/**
	 * @inheritDoc
	 */
	static fromICALJs(icalValue) {
		const comp = super.fromICALJs(icalValue)
		comp.root = comp

		return comp
	}

}

/**
 * ProductId representing the software that created this calendar-document
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.7.3
 *
 * @name CalendarComponent#productId
 * @type {String}
 */
advertiseSingleOccurrenceProperty(CalendarComponent.prototype, {
	name: 'productId',
	iCalendarName: 'PRODID'
})

/**
 * iCalendar version of this calendar-document
 * minver and maxver parameters are not supported, since they
 * are virtually used by no calendaring-software
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.7.4
 *
 * @name CalendarComponent#version
 * @type {String}
 */

advertiseSingleOccurrenceProperty(CalendarComponent.prototype, {
	name: 'version'
})

/**
 * Calendar-scale used in this calendar-document
 * The default and only supported calendar-scale is GREGORIAN.
 * There is an iCalendar-extension about non-gregorian RRULES,
 * but that is not supported by calendar-js at the moment
 * @see https://tools.ietf.org/html/rfc7529
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.7.1
 *
 * @name CalendarComponent#calendarScale
 * @type {String}
 * @default "GREGORIAN"
 */
advertiseSingleOccurrenceProperty(CalendarComponent.prototype, {
	name: 'calendarScale',
	iCalendarName: 'CALSCALE',
	defaultValue: 'GREGORIAN'
})

/**
 * Method of this calendar-document when being used in an iTIP message
 * Please see https://tools.ietf.org/html/rfc5546#section-3.2 for more information
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.7.2
 *
 * @name CalendarComponent#method
 * @type {String}
 */
advertiseSingleOccurrenceProperty(CalendarComponent.prototype, {
	name: 'method'
})
