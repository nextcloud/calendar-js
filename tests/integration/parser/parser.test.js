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

import { getParserManager, parseICSAndGetAllOccurrencesBetween } from '../../../src/index.js';
import ICalendarParser from '../../../src/parsers/icalendarParser.js';
import DateTimeValue from '../../../src/values/dateTimeValue.js'
import DurationValue from '../../../src/values/durationValue.js';

jest.mock('../../../src/factories/dateFactory.js')

it('ParserManager should provide a list of supported file-types', () => {
	const parserManager = getParserManager()
	expect(parserManager.getAllSupportedFileTypes()).toEqual(['text/calendar'])
})

it('ParserManager should provide a parser for text/calendar', () => {
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')

	expect(icsParser instanceof ICalendarParser).toEqual(true)
})

it('Parser + Expansion + RDATE + RDATE-Period + Recurrence-Exceptions', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 7, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	/** @type {EventComponent} */
	const event1 = iterator.next().value
	expect(event1.title).toEqual('weekly recurring event')
	expect(event1.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1561964400')
	expect(event1.startDate.jsDate.toISOString()).toEqual('2019-07-01T07:00:00.000Z')
	expect(event1.endDate.jsDate.toISOString()).toEqual('2019-07-01T08:00:00.000Z')
	expect(event1.isRecurring()).toEqual(true)
	expect(event1.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event1.isRecurrenceException()).toEqual(false)
	expect(event1.modifiesFuture()).toEqual(false)
	expect(event1.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event2 = iterator.next().value
	expect(event2.title).toEqual('weekly recurring event')
	expect(event2.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1562569200')
	expect(event2.startDate.jsDate.toISOString()).toEqual('2019-07-08T07:00:00.000Z')
	expect(event2.endDate.jsDate.toISOString()).toEqual('2019-07-08T08:00:00.000Z')
	expect(event2.isRecurring()).toEqual(true)
	expect(event2.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event2.isRecurrenceException()).toEqual(false)
	expect(event2.modifiesFuture()).toEqual(false)
	expect(event2.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event3 = iterator.next().value
	expect(event3.title).toEqual('weekly recurring event exception 1')
	expect(event3.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563174000')
	expect(event3.startDate.jsDate.toISOString()).toEqual('2019-07-17T07:00:00.000Z')
	expect(event3.endDate.jsDate.toISOString()).toEqual('2019-07-17T08:00:00.000Z')
	expect(event3.isRecurring()).toEqual(false)
	expect(event3.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event3.isRecurrenceException()).toEqual(true)
	expect(event3.modifiesFuture()).toEqual(false)
	expect(event3.canModifyAllDay()).toEqual(false)

	// RDATE;TZID=Europe/Berlin:20190719T080000
	/** @type {EventComponent} */
	const event4 = iterator.next().value
	expect(event4.title).toEqual('weekly recurring event')
	expect(event4.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563516000')
	expect(event4.startDate.jsDate.toISOString()).toEqual('2019-07-19T06:00:00.000Z')
	expect(event4.endDate.jsDate.toISOString()).toEqual('2019-07-19T07:00:00.000Z')
	expect(event4.isRecurring()).toEqual(true)
	expect(event4.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event4.isRecurrenceException()).toEqual(false)
	expect(event4.modifiesFuture()).toEqual(false)
	expect(event4.canModifyAllDay()).toEqual(false)

	// RDATE;TZID=America/New_York:20190719T090000 and RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000
	/** @type {EventComponent} */
	const event5 = iterator.next().value
	expect(event5.title).toEqual('weekly recurring event exception - recurrence-id with different timezone')
	expect(event5.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563541200')
	expect(event5.startDate.jsDate.toISOString()).toEqual('2019-07-20T14:00:00.000Z')
	expect(event5.endDate.jsDate.toISOString()).toEqual('2019-07-21T02:00:00.000Z')
	expect(event5.isRecurring()).toEqual(false)
	expect(event5.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event5.isRecurrenceException()).toEqual(true)
	expect(event5.modifiesFuture()).toEqual(false)
	expect(event5.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event6 = iterator.next().value
	expect(event6.title).toEqual('weekly recurring event')
	expect(event6.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563778800')
	expect(event6.startDate.jsDate.toISOString()).toEqual('2019-07-22T07:00:00.000Z')
	expect(event6.endDate.jsDate.toISOString()).toEqual('2019-07-22T08:00:00.000Z')
	expect(event6.isRecurring()).toEqual(true)
	expect(event6.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event6.isRecurrenceException()).toEqual(false)
	expect(event6.modifiesFuture()).toEqual(false)
	expect(event6.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event7 = iterator.next().value
	expect(event7.title).toEqual('weekly recurring event exception 2')
	expect(event7.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564383600')
	expect(event7.startDate.jsDate.toISOString()).toEqual('2019-07-31T07:00:00.000Z')
	expect(event7.endDate.jsDate.toISOString()).toEqual('2019-07-31T08:00:00.000Z')
	expect(event7.isRecurring()).toEqual(false)
	expect(event7.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event7.isRecurrenceException()).toEqual(true)
	expect(event7.modifiesFuture()).toEqual(false)
	expect(event7.canModifyAllDay()).toEqual(false)

	// RDATE;VALUE=PERIOD:20190801T070000Z/PT3H
	/** @type {EventComponent} */
	const event8 = iterator.next().value
	expect(event8.title).toEqual('weekly recurring event')
	expect(event8.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564642800')
	expect(event8.startDate.jsDate.toISOString()).toEqual('2019-08-01T07:00:00.000Z')
	expect(event8.endDate.jsDate.toISOString()).toEqual('2019-08-01T10:00:00.000Z')
	expect(event8.isRecurring()).toEqual(true)
	expect(event8.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event8.isRecurrenceException()).toEqual(false)
	expect(event8.modifiesFuture()).toEqual(false)
	expect(event8.canModifyAllDay()).toEqual(false)

	// RDATE;VALUE=PERIOD:20190802T070000Z/20190802T083000Z
	/** @type {EventComponent} */
	const event9 = iterator.next().value
	expect(event9.title).toEqual('weekly recurring event')
	expect(event9.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564729200')
	expect(event9.startDate.jsDate.toISOString()).toEqual('2019-08-02T07:00:00.000Z')
	expect(event9.endDate.jsDate.toISOString()).toEqual('2019-08-02T08:30:00.000Z')
	expect(event9.isRecurring()).toEqual(true)
	expect(event9.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event9.isRecurrenceException()).toEqual(false)
	expect(event9.modifiesFuture()).toEqual(false)
	expect(event9.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event10 = iterator.next().value
	expect(event10.title).toEqual('weekly recurring event')
	expect(event10.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564988400')
	expect(event10.startDate.jsDate.toISOString()).toEqual('2019-08-05T07:00:00.000Z')
	expect(event10.endDate.jsDate.toISOString()).toEqual('2019-08-05T08:00:00.000Z')
	expect(event10.isRecurring()).toEqual(true)
	expect(event10.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event10.isRecurrenceException()).toEqual(false)
	expect(event10.modifiesFuture()).toEqual(false)
	expect(event10.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event11 = iterator.next().value
	expect(event11.title).toEqual('weekly recurring event')
	expect(event11.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1565593200')
	expect(event11.startDate.jsDate.toISOString()).toEqual('2019-08-12T07:00:00.000Z')
	expect(event11.endDate.jsDate.toISOString()).toEqual('2019-08-12T08:00:00.000Z')
	expect(event11.isRecurring()).toEqual(true)
	expect(event11.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event11.isRecurrenceException()).toEqual(false)
	expect(event11.modifiesFuture()).toEqual(false)
	expect(event11.canModifyAllDay()).toEqual(false)

	// EXDATE;TZID=Europe/Berlin:20190819T090000

	// RDATE;VALUE=PERIOD:20190824T070000Z/PT3H
	/** @type {EventComponent} */
	const event12 = iterator.next().value
	expect(event12.title).toEqual('weekly recurring event exception for VALUE=PERIOD')
	expect(event12.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1566630000')
	expect(event12.startDate.jsDate.toISOString()).toEqual('2019-08-24T11:00:00.000Z')
	expect(event12.endDate.jsDate.toISOString()).toEqual('2019-08-30T21:00:00.000Z')
	expect(event12.isRecurring()).toEqual(false)
	expect(event12.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event12.isRecurrenceException()).toEqual(true)
	expect(event12.modifiesFuture()).toEqual(false)
	expect(event12.canModifyAllDay()).toEqual(false)

	/** @type {EventComponent} */
	const event13 = iterator.next().value
	expect(event13.title).toEqual('weekly recurring event')
	expect(event13.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1566802800')
	expect(event13.startDate.jsDate.toISOString()).toEqual('2019-08-26T07:00:00.000Z')
	expect(event13.endDate.jsDate.toISOString()).toEqual('2019-08-26T08:00:00.000Z')
	expect(event13.isRecurring()).toEqual(true)
	expect(event13.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event13.isRecurrenceException()).toEqual(false)
	expect(event13.modifiesFuture()).toEqual(false)
	expect(event13.canModifyAllDay()).toEqual(false)

	// Verify there are no more events
	expect(iterator.next().value).toEqual(undefined)
})

it('Parser + Expansion + RDATE + RDATE-Period + Recurrence-Exceptions with range THISANDFUTURE', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	/** @type {EventComponent} */
	const event1 = iterator.next().value
	expect(event1.title).toEqual('weekly recurring event')
	expect(event1.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1561964400')
	expect(event1.startDate.jsDate.toISOString()).toEqual('2019-07-01T07:00:00.000Z')
	expect(event1.endDate.jsDate.toISOString()).toEqual('2019-07-01T08:00:00.000Z')
	expect(event1.isRecurring()).toEqual(true)
	expect(event1.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event1.isRecurrenceException()).toEqual(false)
	expect(event1.modifiesFuture()).toEqual(false)

	/** @type {EventComponent} */
	const event2 = iterator.next().value
	expect(event2.title).toEqual('weekly recurring event')
	expect(event2.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1562569200')
	expect(event2.startDate.jsDate.toISOString()).toEqual('2019-07-08T07:00:00.000Z')
	expect(event2.endDate.jsDate.toISOString()).toEqual('2019-07-08T08:00:00.000Z')
	expect(event2.isRecurring()).toEqual(true)
	expect(event2.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event2.isRecurrenceException()).toEqual(false)
	expect(event2.modifiesFuture()).toEqual(false)

	/** @type {EventComponent} */
	const event3 = iterator.next().value
	expect(event3.title).toEqual('weekly recurring event exception 1')
	expect(event3.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563174000')
	expect(event3.startDate.jsDate.toISOString()).toEqual('2019-07-17T07:00:00.000Z')
	expect(event3.endDate.jsDate.toISOString()).toEqual('2019-07-17T08:00:00.000Z')
	expect(event3.isRecurring()).toEqual(false)
	expect(event3.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event3.isRecurrenceException()).toEqual(true)
	expect(event3.modifiesFuture()).toEqual(false)

	// RDATE;TZID=Europe/Berlin:20190719T080000
	/** @type {EventComponent} */
	const event4 = iterator.next().value
	expect(event4.title).toEqual('weekly recurring event')
	expect(event4.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563516000')
	expect(event4.startDate.jsDate.toISOString()).toEqual('2019-07-19T06:00:00.000Z')
	expect(event4.endDate.jsDate.toISOString()).toEqual('2019-07-19T07:00:00.000Z')
	expect(event4.isRecurring()).toEqual(true)
	expect(event4.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event4.isRecurrenceException()).toEqual(false)
	expect(event4.modifiesFuture()).toEqual(false)

	// RDATE;TZID=America/New_York:20190719T090000 and RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000
	/** @type {EventComponent} */
	const event5 = iterator.next().value
	expect(event5.title).toEqual('weekly recurring event exception - recurrence-id with different timezone')
	expect(event5.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563541200')
	expect(event5.startDate.jsDate.toISOString()).toEqual('2019-07-20T14:00:00.000Z')
	expect(event5.endDate.jsDate.toISOString()).toEqual('2019-07-21T02:00:00.000Z')
	expect(event5.isRecurring()).toEqual(false)
	expect(event5.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event5.isRecurrenceException()).toEqual(true)
	expect(event5.modifiesFuture()).toEqual(false)

	/** @type {EventComponent} */
	const event6 = iterator.next().value
	expect(event6.title).toEqual('weekly recurring event')
	expect(event6.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563778800')
	expect(event6.startDate.jsDate.toISOString()).toEqual('2019-07-22T07:00:00.000Z')
	expect(event6.endDate.jsDate.toISOString()).toEqual('2019-07-22T08:00:00.000Z')
	expect(event6.isRecurring()).toEqual(true)
	expect(event6.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event6.isRecurrenceException()).toEqual(false)
	expect(event6.modifiesFuture()).toEqual(false)

	/** @type {EventComponent} */
	const event7 = iterator.next().value
	expect(event7.title).toEqual('weekly recurring event exception 2')
	expect(event7.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564383600')
	expect(event7.startDate.jsDate.toISOString()).toEqual('2019-07-31T07:00:00.000Z')
	expect(event7.endDate.jsDate.toISOString()).toEqual('2019-07-31T08:00:00.000Z')
	expect(event7.isRecurring()).toEqual(false)
	expect(event7.canCreateRecurrenceExceptions()).toEqual(false)
	expect(event7.isRecurrenceException()).toEqual(true)
	expect(event7.modifiesFuture()).toEqual(false)

	// RDATE;VALUE=PERIOD:20190801T070000Z/PT3H
	/** @type {EventComponent} */
	const event8 = iterator.next().value
	expect(event8.title).toEqual('weekly recurring event')
	expect(event8.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564642800')
	expect(event8.startDate.jsDate.toISOString()).toEqual('2019-08-01T07:00:00.000Z')
	expect(event8.endDate.jsDate.toISOString()).toEqual('2019-08-01T10:00:00.000Z')
	expect(event8.isRecurring()).toEqual(true)
	expect(event8.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event8.isRecurrenceException()).toEqual(false)
	expect(event8.modifiesFuture()).toEqual(false)

	// RDATE;VALUE=PERIOD:20190802T070000Z/20190802T083000Z
	/** @type {EventComponent} */
	const event9 = iterator.next().value
	expect(event9.title).toEqual('weekly recurring event')
	expect(event9.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564729200')
	expect(event9.startDate.jsDate.toISOString()).toEqual('2019-08-02T07:00:00.000Z')
	expect(event9.endDate.jsDate.toISOString()).toEqual('2019-08-02T08:30:00.000Z')
	expect(event9.isRecurring()).toEqual(true)
	expect(event9.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event9.isRecurrenceException()).toEqual(false)
	expect(event9.modifiesFuture()).toEqual(false)

	/** @type {EventComponent} */
	const event10 = iterator.next().value
	expect(event10.title).toEqual('weekly recurring event')
	expect(event10.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1564988400')
	expect(event10.startDate.jsDate.toISOString()).toEqual('2019-08-05T07:00:00.000Z')
	expect(event10.endDate.jsDate.toISOString()).toEqual('2019-08-05T08:00:00.000Z')
	expect(event10.isRecurring()).toEqual(true)
	expect(event10.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event10.isRecurrenceException()).toEqual(false)
	expect(event10.modifiesFuture()).toEqual(false)

	/** @type {EventComponent} */
	const event11 = iterator.next().value
	expect(event11.title).toEqual('weekly recurring event')
	expect(event11.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1565593200')
	expect(event11.startDate.jsDate.toISOString()).toEqual('2019-08-12T07:00:00.000Z')
	expect(event11.endDate.jsDate.toISOString()).toEqual('2019-08-12T08:00:00.000Z')
	expect(event11.isRecurring()).toEqual(true)
	expect(event11.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event11.isRecurrenceException()).toEqual(false)
	expect(event11.modifiesFuture()).toEqual(false)

	// EXDATE;TZID=Europe/Berlin:20190819T090000

	// RDATE;VALUE=PERIOD:20190824T070000Z/PT3H
	/** @type {EventComponent} */
	const event12 = iterator.next().value
	expect(event12.title).toEqual('weekly recurring event exception for VALUE=PERIOD')
	expect(event12.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1566630000')
	expect(event12.startDate.jsDate.toISOString()).toEqual('2019-08-24T11:00:00.000Z')
	expect(event12.endDate.jsDate.toISOString()).toEqual('2019-08-30T21:00:00.000Z')
	expect(event12.isRecurring()).toEqual(false)
	expect(event12.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event12.isRecurrenceException()).toEqual(true)
	expect(event12.modifiesFuture()).toEqual(true)

	/** @type {EventComponent} */
	const event13 = iterator.next().value
	expect(event13.title).toEqual('weekly recurring event exception for VALUE=PERIOD')
	expect(event13.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1566802800')
	expect(event13.startDate.jsDate.toISOString()).toEqual('2019-08-26T11:00:00.000Z')
	expect(event13.endDate.jsDate.toISOString()).toEqual('2019-09-01T21:00:00.000Z')
	expect(event13.isRecurring()).toEqual(false)
	expect(event13.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event13.isRecurrenceException()).toEqual(true)
	expect(event13.modifiesFuture()).toEqual(true)

	/** @type {EventComponent} */
	const event14 = iterator.next().value
	expect(event14.title).toEqual('weekly recurring event exception for VALUE=PERIOD')
	expect(event14.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1567407600')
	expect(event14.startDate.jsDate.toISOString()).toEqual('2019-09-02T11:00:00.000Z')
	expect(event14.endDate.jsDate.toISOString()).toEqual('2019-09-08T21:00:00.000Z')
	expect(event14.isRecurring()).toEqual(false)
	expect(event14.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event14.isRecurrenceException()).toEqual(true)
	expect(event14.modifiesFuture()).toEqual(true)

	/** @type {EventComponent} */
	const event15 = iterator.next().value
	expect(event15.title).toEqual('weekly recurring event exception for VALUE=PERIOD')
	expect(event15.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1568012400')
	expect(event15.startDate.jsDate.toISOString()).toEqual('2019-09-09T11:00:00.000Z')
	expect(event15.endDate.jsDate.toISOString()).toEqual('2019-09-15T21:00:00.000Z')
	expect(event15.isRecurring()).toEqual(false)
	expect(event15.canCreateRecurrenceExceptions()).toEqual(true)
	expect(event15.isRecurrenceException()).toEqual(true)
	expect(event15.modifiesFuture()).toEqual(true)

	// Verify there are no more events
	expect(iterator.next().value).toEqual(undefined)
})

it('Delete simple recurrence - this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value
	expect(event15.removeThisOccurrence()).toEqual(false)

	expect(event15.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190909T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete simple recurrence - this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value
	expect(event15.removeThisOccurrence(true)).toEqual(false)

	expect(event15.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190909T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete first item this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event1 = iterator.next().value
	expect(event1.removeThisOccurrence()).toEqual(false)

	expect(event1.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190701T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/PT3H,20190802T070000Z/20190802T083000Z,\r\n' +
		' 20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete first item this and future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event1 = iterator.next().value
	expect(event1.removeThisOccurrence(true)).toEqual(true)
})

it('Delete no-range recurrence-exception this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 2; i++) {
		iterator.next()
	}

	const event3 = iterator.next().value
	expect(event3.removeThisOccurrence()).toEqual(false)

	expect(event3.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190715T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/PT3H,20190802T070000Z/20190802T083000Z,\r\n' +
		' 20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete no-range recurrence-exception this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 2; i++) {
		iterator.next()
	}

	const event3 = iterator.next().value
	expect(event3.removeThisOccurrence(true)).toEqual(false)

	expect(event3.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190715T065959Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete range recurrence-exception this (exact match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 11; i++) {
		iterator.next()
	}

	const event12 = iterator.next().value
	expect(event12.removeThisOccurrence()).toEqual(false)

	expect(event12.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;RANGE=THISANDFUTURE:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete range recurrence-exception this and all future (exact match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 11; i++) {
		iterator.next()
	}

	const event12 = iterator.next().value
	expect(event12.removeThisOccurrence(true)).toEqual(false)

	expect(event12.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190824T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete range recurrence-exception this (non-first match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value
	expect(event15.removeThisOccurrence()).toEqual(false)

	expect(event15.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'EXDATE:20190909T070000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;RANGE=THISANDFUTURE:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete range recurrence-exception this and all future (non-first match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value
	expect(event15.removeThisOccurrence(true)).toEqual(false)

	expect(event15.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190909T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;RANGE=THISANDFUTURE:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete rdate-based recurrence-exception this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 4; i++) {
		iterator.next()
	}

	const event5 = iterator.next().value
	expect(event5.removeThisOccurrence()).toEqual(false)

 	expect(event5.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/PT3H,20190802T070000Z/20190802T083000Z,\r\n' +
		' 20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete rdate-based recurrence-exception this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 4; i++) {
		iterator.next()
	}

	const event5 = iterator.next().value
	expect(event5.removeThisOccurrence(true)).toEqual(false)

 	expect(event5.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190719T125959Z\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete RDATE only - this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 7; i++) {
		iterator.next()
	}

	const event8 = iterator.next().value
	expect(event8.removeThisOccurrence()).toEqual(false)

 	expect(event8.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190802T070000Z/20190802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Delete RDATE - this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 7; i++) {
		iterator.next()
	}

	const event8 = iterator.next().value
	expect(event8.removeThisOccurrence(true)).toEqual(false)

 	expect(event8.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190801T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('should be able to modify all-day of a non-recurring event', () => {
	const ics = getAsset('simple-date-dtstart-dtend')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2016, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event = iterator.next().value

	expect(event.canModifyAllDay()).toEqual(true)
})

it('should delete a non-recurring event - this', () => {
	const ics = getAsset('simple-date-dtstart-dtend')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2016, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event = iterator.next().value

	expect(event.removeThisOccurrence()).toEqual(true)
})

it('should delete a non-recurring event - this and future', () => {
	const ics = getAsset('simple-date-dtstart-dtend')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2016, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event = iterator.next().value

	expect(event.removeThisOccurrence(true)).toEqual(true)
})

it ('edit first occurrence - this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	const event1 = iterator.next().value

	event1.title = 'This is a recurrence-exception created with calendar-js'
	event1.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event1.createRecurrenceException()
	expect(original.root).toEqual(exception.root)
	expect(exception).toEqual(event1)

	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'SEQUENCE:0\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/PT3H,20190802T070000Z/20190802T083000Z,\r\n' +
		' 20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T100000\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190701T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it ('edit first occurrence - this and future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	const event1 = iterator.next().value

	event1.title = 'This is a recurrence-exception created with calendar-js'
	event1.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event1.createRecurrenceException(true)
	expect(original.root).toEqual(exception.root)
	expect(exception).toEqual(event1)

	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T100000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T100000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/PT3H,20190802T070000Z/20190802T083000Z,\r\n' +
		' 20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T080000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190801T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T080000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('edit simple recurrence - this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value

	event15.title = 'This is a recurrence-exception created with calendar-js'
	event15.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event15.createRecurrenceException()

	expect(original.root).toEqual(exception.root)
	expect(exception).toEqual(event15)
	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'SEQUENCE:0\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190909T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190909T100000\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190909T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit simple recurrence - this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value

	event15.title = 'This is a recurrence-exception created with calendar-js'
	event15.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event15.createRecurrenceException(true)

	expect(original.root).not.toEqual(exception.root)
	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190909T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:RANDOM UUID 123\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')

	expect(exception.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190909T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190909T100000\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit range recurrence-exception this (exact-match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 11; i++) {
		iterator.next()
	}

	const event12 = iterator.next().value

	event12.title = 'This is a recurrence-exception created with calendar-js'
	event12.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event12.createRecurrenceException()
	expect(original.root).toEqual(exception.root)
	expect(exception).toEqual(event12)

	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z\r\n' +
		'RDATE:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;RANGE=THISANDFUTURE:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART:20190824T120000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit range recurrence-exception this and all future (exact-match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 11; i++) {
		iterator.next()
	}

	const event12 = iterator.next().value

	event12.title = 'This is a recurrence-exception created with calendar-js'
	event12.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event12.createRecurrenceException(true)
	expect(original.root).not.toEqual(exception.root)
	expect(exception).toEqual(event12)

	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190824T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')

	expect(exception.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART:20190824T120000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit range recurrence-exception this (non-first-match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value

	event15.title = 'This is a recurrence-exception created with calendar-js'
	event15.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event15.createRecurrenceException()
	expect(original.root).toEqual(exception.root)
	expect(exception).toEqual(event15)

	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'SEQUENCE:0\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;RANGE=THISANDFUTURE:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND:20190915T210000Z\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART:20190909T120000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'RECURRENCE-ID:20190909T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit range recurrence-exception this and all future (non-first-match)', () => {
	const ics = getAsset('recurring-with-recurrence-id-range')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 14; i++) {
		iterator.next()
	}

	const event15 = iterator.next().value

	event15.title = 'This is a recurrence-exception created with calendar-js'
	event15.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event15.createRecurrenceException(true)
	expect(original.root).not.toEqual(exception.root)
	expect(exception).toEqual(event15)

	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190909T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z,20190824T070000Z/PT3H\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;RANGE=THISANDFUTURE:20190824T070000Z\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:RANDOM UUID 123\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')

	expect(exception.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTEND:20190915T210000Z\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART:20190909T120000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('Edit rdate-based recurrence-exception this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 4; i++) {
		iterator.next()
	}

	const event5 = iterator.next().value

	expect(() => {
		event5.createRecurrenceException()
	}).toThrow(Error, 'Can\'t create recurrence-exception for this item')
})

it('Edit rdate-based recurrence-exception this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 4; i++) {
		iterator.next()
	}

	const event5 = iterator.next().value

	expect(() => {
		event5.createRecurrenceException(true)
	}).toThrow(Error, 'Can\'t create recurrence-exception for this item')
})

it('Edit RDATE - this', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 7; i++) {
		iterator.next()
	}

	const event8 = iterator.next().value

	event8.title = 'This is a recurrence-exception created with calendar-js'
	event8.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event8.createRecurrenceException()

	expect(original.root).toEqual(exception.root)
	expect(exception).toEqual(event8)
	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'EXDATE;TZID=Europe/Berlin:20190819T090000\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190802T070000Z/20190802T083000Z,20190824T070000Z/PT3H\r\n' +
		'RDATE:20190801T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190830T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception for VALUE=PERIOD\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190801T100000\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTEND:20190801T100000Z\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190801T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit RDATE - this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 7; i++) {
		iterator.next()
	}

	const event8 = iterator.next().value

	event8.title = 'This is a recurrence-exception created with calendar-js'
	event8.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event8.createRecurrenceException(true)

	expect(original.root).not.toEqual(exception.root)
	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190801T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:RANDOM UUID 123\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')


	expect(exception.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190801T100000\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'DTEND:20190801T100000Z\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('Edit simple recurrence (test do not copy RDATEs / EXDATES) - this and all future', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 30, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	for (let i = 0; i < 9; i++) {
		iterator.next()
	}

	const event10 = iterator.next().value

	event10.title = 'This is a recurrence-exception created with calendar-js'
	event10.startDate.addDuration(DurationValue.fromSeconds(60 * 60))

	const [original, exception] = event10.createRecurrenceException(true)

	expect(original.root).not.toEqual(exception.root)
	expect(original.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190701T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190701T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'RRULE:FREQ=WEEKLY;UNTIL=20190805T065959Z\r\n' +
		'RDATE;TZID=America/New_York:20190719T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190719T080000\r\n' +
		'RDATE;VALUE=PERIOD:20190801T070000Z/20190801T100000Z,20190802T070000Z/20190\r\n' +
		' 802T083000Z\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:RANDOM UUID 123\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190717T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190703T172903Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190717T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190715T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190731T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190731T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190729T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190714T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception bogus - recurrence-id doesn\'t matc\r\n' +
		' h\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190714T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190703T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=America/New_York:20190720T220000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:weekly recurring event exception - recurrence-id with different tim\r\n' +
		' ezone\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T160000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190719T150000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:America/New_York\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:-0500\r\n' +
		'TZOFFSETTO:-0400\r\n' +
		'TZNAME:EDT\r\n' +
		'DTSTART:19700308T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:-0400\r\n' +
		'TZOFFSETTO:-0500\r\n' +
		'TZNAME:EST\r\n' +
		'DTSTART:19701101T020000\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')

	expect(exception.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190805T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'SUMMARY:This is a recurrence-exception created with calendar-js\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190805T100000\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'RRULE:FREQ=WEEKLY\r\n' +
		'RELATED-TO;RELTYPE=SIBLING:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('getOccurrenceAtExactly non-recurring matching start-date', () => {
	const ics = getAsset('simple-date-time-europe-berlin-dtstart-dtend')
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value

	const recurrenceManager = firstVObject.recurrenceManager

	const recurrenceId = DateTimeValue.fromJSDate(new Date(1471330800 * 1000), true)
	expect(recurrenceManager.getOccurrenceAtExactly(recurrenceId)).toEqual(firstVObject)
})

it('getOccurrenceAtExactly non-recurring not matching start-date', () => {
	const ics = getAsset('simple-date-time-europe-berlin-dtstart-dtend')
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value

	const recurrenceManager = firstVObject.recurrenceManager

	const recurrenceId = DateTimeValue.fromJSDate(new Date(1471330801 * 1000), true)
	expect(recurrenceManager.getOccurrenceAtExactly(recurrenceId)).toEqual(null)
})

it('getOccurrenceAtExactly recurring matching date', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value

	const recurrenceManager = firstVObject.recurrenceManager
	const recurrenceId = DateTimeValue.fromJSDate(new Date(1562569200 * 1000), true)
	const event = recurrenceManager.getOccurrenceAtExactly(recurrenceId)

	expect(event.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1562569200')
	expect(event.startDate.jsDate.toISOString()).toEqual('2019-07-08T07:00:00.000Z')
	expect(event.endDate.jsDate.toISOString()).toEqual('2019-07-08T08:00:00.000Z')
	expect(event.toICSThisOccurrence()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'DTEND;TZID=Europe/Berlin:20190708T100000\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'SUMMARY:weekly recurring event\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190708T090000\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VTIMEZONE\r\n' +
		'TZID:Europe/Berlin\r\n' +
		'BEGIN:DAYLIGHT\r\n' +
		'TZOFFSETFROM:+0100\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\n' +
		'DTSTART:19810329T020000\r\n' +
		'TZNAME:CEST\r\n' +
		'TZOFFSETTO:+0200\r\n' +
		'END:DAYLIGHT\r\n' +
		'BEGIN:STANDARD\r\n' +
		'TZOFFSETFROM:+0200\r\n' +
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\n' +
		'DTSTART:19961027T030000\r\n' +
		'TZNAME:CET\r\n' +
		'TZOFFSETTO:+0100\r\n' +
		'END:STANDARD\r\n' +
		'END:VTIMEZONE\r\n' +
		'END:VCALENDAR')
})

it('getOccurrenceAtExactly recurring matching date with recurrence-exception', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value

	const recurrenceManager = firstVObject.recurrenceManager
	const recurrenceId = DateTimeValue.fromJSDate(new Date(1563174000 * 1000), true)
	const event = recurrenceManager.getOccurrenceAtExactly(recurrenceId)

	expect(event.id).toEqual('41CBE812-F77C-471A-A481-D6A18CCAAA99###1563174000')
	expect(event.startDate.jsDate.toISOString()).toEqual('2019-07-17T07:00:00.000Z')
	expect(event.endDate.jsDate.toISOString()).toEqual('2019-07-17T08:00:00.000Z')

	expect(event.root).toEqual(calendarComp)
})

it('getOccurrenceAtExactly recurring not matching date', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value

	const recurrenceManager = firstVObject.recurrenceManager
	const recurrenceId = DateTimeValue.fromJSDate(new Date(1563174123 * 1000), true)
	const event = recurrenceManager.getOccurrenceAtExactly(recurrenceId)

	expect(event).toEqual(null)
})
