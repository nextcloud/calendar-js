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
import { getParserManager } from './parsers/parserManager.js'
import TimezoneAdapter from './timezones/timezoneAdapter.js'
import { getTimezoneManager } from './timezones/timezoneManager.js'
export { setConfig } from './config.js'
export { getParserManager }
export { getTimezoneManager, isOlsonTimezone } from './timezones/timezoneManager.js'
import uuid from 'uuid'
import DateTimeValue from './values/dateTimeValue.js';
import { dateFactory } from './factories/dateFactory.js';
import CalendarComponent from './components/calendarComponent.js';
import EventComponent from './components/root/eventComponent.js';
import RecurrenceManager from './recurrence/recurrenceManager.js';
import FreeBusyComponent from './components/root/freeBusyComponent.js';

if (!(ICAL.TimezoneService instanceof TimezoneAdapter)) {
	ICAL.TimezoneService = new TimezoneAdapter(getTimezoneManager())
}

/**
 * parses a single ICS and returns an iterator over all occurrences
 * in a given timeframe
 *
 * @param {String} ics
 * @param {DateTimeValue} start
 * @param {DateTimeValue} end
 * @returns {IterableIterator<AbstractRecurringComponent>}
 */
export function * parseICSAndGetAllOccurrencesBetween(ics, start, end) {
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	if (calendarComp === undefined) {
		return
	}

	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value
	if (firstVObject === undefined) {
		return
	}

	yield * firstVObject.recurrenceManager.getAllOccurrencesBetweenIterator(start, end)
}

/**
 * Creates a new event
 *
 * @param {DateTimeValue} start
 * @param {DateTimeValue} end
 * @returns {CalendarComponent}
 */
export function createEvent(start, end) {
	const calendar = CalendarComponent.fromEmpty()
	const eventComponent = new EventComponent('VEVENT')

	eventComponent.updatePropertyWithValue('CREATED', DateTimeValue.fromJSDate(dateFactory(), true))
	eventComponent.updatePropertyWithValue('DTSTAMP', DateTimeValue.fromJSDate(dateFactory(), true))
	eventComponent.updatePropertyWithValue('LAST-MODIFIED', DateTimeValue.fromJSDate(dateFactory(), true))
	eventComponent.updatePropertyWithValue('SEQUENCE', 0)
	eventComponent.updatePropertyWithValue('UID', uuid())
	eventComponent.updatePropertyWithValue('DTSTART', start)
	eventComponent.updatePropertyWithValue('DTEND', end)

	calendar.addComponent(eventComponent)
	eventComponent.recurrenceManager = new RecurrenceManager(eventComponent)

	return calendar
}

/**
 * Creates a FreeBusy Request to be used on the scheduling outbox
 *
 * @param {DateTimeValue} start
 * @param {DateTimeValue} end
 * @param {AttendeeProperty} organizer
 * @param {AttendeeProperty[]}attendees
 * @returns {CalendarComponent}
 */
export function createFreeBusyRequest(start, end, organizer, attendees) {
	const calendar = CalendarComponent.fromMethod('REQUEST')
	const freeBusyComponent = new FreeBusyComponent('VFREEBUSY')

	freeBusyComponent.updatePropertyWithValue('DTSTAMP', DateTimeValue.fromJSDate(dateFactory(), true))
	freeBusyComponent.updatePropertyWithValue('UID', uuid())
	freeBusyComponent.updatePropertyWithValue('DTSTART', start.clone().getInUTC())
	freeBusyComponent.updatePropertyWithValue('DTEND', end.clone().getInUTC())
	freeBusyComponent.addProperty(organizer.clone())

	for (const attendee of attendees) {
		const clonedAttendee = attendee.clone()
		clonedAttendee.deleteParameter('ROLE')
		clonedAttendee.deleteParameter('CUTYPE')
		clonedAttendee.deleteParameter('RSVP')
		clonedAttendee.deleteParameter('PARTSTAT')
		clonedAttendee.deleteParameter('REQUEST-STATUS')
		clonedAttendee.deleteParameter('LANGUAGE')

		freeBusyComponent.addProperty(clonedAttendee)
	}

	calendar.addComponent(freeBusyComponent)
	return calendar
}
