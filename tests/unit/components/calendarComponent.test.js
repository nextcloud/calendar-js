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

import ICAL from 'ical.js'
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import CalendarComponent from '../../../src/components/calendarComponent.js';
import AbstractComponent from '../../../src/components/abstractComponent.js';
import Property from '../../../src/properties/property.js';
import EventComponent from '../../../src/components/root/eventComponent.js';
import { setConfig } from '../../../src';

jest.mock('../../../src/factories/dateFactory')

it('CalendarComponent should be defined', () => {
	expect(CalendarComponent).toBeDefined()
})

it('CalendarComponent should inherit from AbstractComponent', () => {
	const comp = new CalendarComponent()
	expect(comp instanceof AbstractComponent).toEqual(true)
})

it('CalendarComponent should expose easy getter/setter for productId', () => {
	const property = new Property('PRODID', '--// product ID foo bar //EN')
	const component = new CalendarComponent('VCALENDAR', [property])

	expect(component.productId).toEqual('--// product ID foo bar //EN')

	component.productId = '--// product ID foo bar //EN123'
	expect(component.productId).toEqual('--// product ID foo bar //EN123')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.productId = '--// product ID foo bar //EN456'
	}).toThrow(ModificationNotAllowedError);
	expect(component.productId).toEqual('--// product ID foo bar //EN123')

	component.unlock()

	component.productId = '--// product ID foo bar //EN789'
	expect(component.productId).toEqual('--// product ID foo bar //EN789')
})

it('CalendarComponent should expose easy getter/setter for version', () => {
	const property = new Property('VERSION', '2.0')
	const component = new CalendarComponent('VCALENDAR', [property])

	expect(component.version).toEqual('2.0')

	component.version = '1.0'
	expect(component.version).toEqual('1.0')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.version = '2.5'
	}).toThrow(ModificationNotAllowedError);
	expect(component.version).toEqual('1.0')

	component.unlock()

	component.version = '3.0'
	expect(component.version).toEqual('3.0')
})

it('CalendarComponent should expose easy getter/setter for calendarScale', () => {
	const component = new CalendarComponent()

	expect(component.calendarScale).toEqual('GREGORIAN')

	component.calendarScale = 'GREGORIAN123'
	expect(component.calendarScale).toEqual('GREGORIAN123')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.calendarScale = 'GREGORIAN456'
	}).toThrow(ModificationNotAllowedError);
	expect(component.calendarScale).toEqual('GREGORIAN123')

	component.unlock()

	component.calendarScale = 'GREGORIAN789'
	expect(component.calendarScale).toEqual('GREGORIAN789')
})

it('CalendarComponent should expose easy getter/setter for method', () => {
	const property = new Property('METHOD', 'PUBLISH')
	const component = new CalendarComponent('VCALENDAR', [property])

	expect(component.method).toEqual('PUBLISH')

	component.method = 'REQUEST'
	expect(component.method).toEqual('REQUEST')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.method = 'CANCEL'
	}).toThrow(ModificationNotAllowedError);
	expect(component.method).toEqual('REQUEST')

	component.unlock()

	component.method = 'COUNTER'
	expect(component.method).toEqual('COUNTER')
})

it('CalendarComponent should provide an iterator for timezones', () => {
	const subComponent1 = new AbstractComponent('VTIMEZONE')
	const subComponent2 = new AbstractComponent('VTIMEZONE')
	const subComponent3 = new AbstractComponent('VEVENT')

	const component = new CalendarComponent('VCALENDAR', [], [subComponent1, subComponent2, subComponent3])

	const iterator = component.getTimezoneIterator()

	expect(iterator.next().value).toEqual(subComponent1)
	expect(iterator.next().value).toEqual(subComponent2)
	expect(iterator.next().value).toEqual(undefined)
})

it('CalendarComponent should provide an iterator for events', () => {
	const subComponent1 = new AbstractComponent('VEVENT')
	const subComponent2 = new AbstractComponent('VEVENT')
	const subComponent3 = new AbstractComponent('VTIMEZONE')

	const component = new CalendarComponent('VCALENDAR', [], [subComponent1, subComponent2, subComponent3])

	const iterator = component.getEventIterator()

	expect(iterator.next().value).toEqual(subComponent1)
	expect(iterator.next().value).toEqual(subComponent2)
	expect(iterator.next().value).toEqual(undefined)
})

it('CalendarComponent should provide an iterator for freebusy', () => {
	const subComponent1 = new AbstractComponent('VFREEBUSY')
	const subComponent2 = new AbstractComponent('VFREEBUSY')
	const subComponent3 = new AbstractComponent('VTIMEZONE')

	const component = new CalendarComponent('VCALENDAR', [], [subComponent1, subComponent2, subComponent3])

	const iterator = component.getFreebusyIterator()

	expect(iterator.next().value).toEqual(subComponent1)
	expect(iterator.next().value).toEqual(subComponent2)
	expect(iterator.next().value).toEqual(undefined)
})

it('CalendarComponent should provide an iterator for journals', () => {
	const subComponent1 = new AbstractComponent('VJOURNAL')
	const subComponent2 = new AbstractComponent('VJOURNAL')
	const subComponent3 = new AbstractComponent('VTIMEZONE')

	const component = new CalendarComponent('VCALENDAR', [], [subComponent1, subComponent2, subComponent3])

	const iterator = component.getJournalIterator()

	expect(iterator.next().value).toEqual(subComponent1)
	expect(iterator.next().value).toEqual(subComponent2)
	expect(iterator.next().value).toEqual(undefined)
})

it('CalendarComponent should provide an iterator for todos', () => {
	const subComponent1 = new AbstractComponent('VTODO')
	const subComponent2 = new AbstractComponent('VTODO')
	const subComponent3 = new AbstractComponent('VTIMEZONE')

	const component = new CalendarComponent('VCALENDAR', [], [subComponent1, subComponent2, subComponent3])

	const iterator = component.getTodoIterator()

	expect(iterator.next().value).toEqual(subComponent1)
	expect(iterator.next().value).toEqual(subComponent2)
	expect(iterator.next().value).toEqual(undefined)
})

it('CalendarComponent should provide a method to generate ICS', () => {
	const property = new Property('PROP-NAME', 'prop-value')
	const component = new CalendarComponent()
	component.addProperty(property)

	expect(component.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PROP-NAME:prop-value\r\n' +
		'END:VCALENDAR')
})

it('CalendarComponent should provide a method to generate ICS - with children', () => {
	const property = new Property('PROP-NAME', 'prop-value')
	const subComponent = new EventComponent('VEVENT')
	const component = new CalendarComponent()
	component.addProperty(property)
	component.addComponent(subComponent)

	expect(component.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PROP-NAME:prop-value\r\n' +
		'BEGIN:VEVENT\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('CalendarComponent should provide a method to generate ICS - with dirty children', () => {
	const property = new Property('PROP-NAME', 'prop-value')
	const subComponent = new EventComponent('VEVENT')
	subComponent.markDirty()
	const component = new CalendarComponent()
	component.addProperty(property)
	component.addComponent(subComponent)

	expect(component.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PROP-NAME:prop-value\r\n' +
		'BEGIN:VEVENT\r\n' +
		'SEQUENCE:0\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('CalendarComponent should provide a method for ICAL.js', () => {
	const ics = getAsset('simple-date-dtstart-only')
	const jcal = ICAL.parse(ics)
	const icalComp = new ICAL.Component(jcal)

	const calendarComponent = CalendarComponent.fromICALJs(icalComp)
	expect(calendarComponent.getFirstComponent('vevent') instanceof EventComponent).toEqual(true)
})

it('CalendarComponent should provide an vobject iterator', () => {
	const subComponent1 = new AbstractComponent('VEVENT')
	const subComponent2 = new AbstractComponent('VEVENT')
	const subComponent3 = new AbstractComponent('VJOURNAL')
	const subComponent4 = new AbstractComponent('VJOURNAL')
	const subComponent5 = new AbstractComponent('VTODO')
	const subComponent6 = new AbstractComponent('VTODO')
	const subComponent7 = new AbstractComponent('VTIMEZONE')

	const component = new CalendarComponent('VCALENDAR', [], [
		subComponent1, subComponent2, subComponent3, subComponent4, subComponent5, subComponent6, subComponent7
	])

	const iterator = component.getVObjectIterator()

	expect(iterator.next().value).toEqual(subComponent1)
	expect(iterator.next().value).toEqual(subComponent2)
	expect(iterator.next().value).toEqual(subComponent3)
	expect(iterator.next().value).toEqual(subComponent4)
	expect(iterator.next().value).toEqual(subComponent5)
	expect(iterator.next().value).toEqual(subComponent6)
	expect(iterator.next().value).toEqual(undefined)
})

it('CalendarComponent should provide a constructor from empty', () => {
	const component = CalendarComponent.fromEmpty()

	expect(component.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'END:VCALENDAR')
})

it('CalendarComponent should provide a constructor with method', () => {
	const component = CalendarComponent.fromMethod('REPLY')

	expect(component.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'METHOD:REPLY\r\n' +
		'END:VCALENDAR')
})
