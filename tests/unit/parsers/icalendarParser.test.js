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
import ICalendarParser from '../../../src/parsers/icalendarParser.js';
import AbstractParser from '../../../src/parsers/abstractParser.js';
import { Timezone, getTimezoneManager } from '@nextcloud/timezones';

jest.mock('../../../src/factories/dateFactory')

afterEach(() => {
	getTimezoneManager().clearAllTimezones()
})

it('ICalendarParser should be defined', () => {
	expect(ICalendarParser).toBeDefined()
})

it('ICalendarParser should inherit from AbstractParser', () => {
	const parser = new ICalendarParser()
	expect(parser instanceof AbstractParser).toEqual(true)
})

it('ICalendarParser should properly detected used object types - vevent', () => {
	const asset = getAsset('import-vevent')

	const parser = new ICalendarParser()
	parser.parse(asset)

	expect(parser.containsVEvents()).toEqual(true)
	expect(parser.containsVJournals()).toEqual(false)
	expect(parser.containsVTodos()).toEqual(false)
})

it('ICalendarParser should properly detected used object types - vevent / vtodo', () => {
	const asset = getAsset('import-vevent-vtodo')

	const parser = new ICalendarParser()
	parser.parse(asset)

	expect(parser.containsVEvents()).toEqual(true)
	expect(parser.containsVJournals()).toEqual(false)
	expect(parser.containsVTodos()).toEqual(true)
})

it('ICalendarParser should properly detected used object types - vjournal / vtodo', () => {
	const asset = getAsset('import-vjournal-vtodo')

	const parser = new ICalendarParser()
	parser.parse(asset)

	expect(parser.containsVEvents()).toEqual(false)
	expect(parser.containsVJournals()).toEqual(true)
	expect(parser.containsVTodos()).toEqual(true)
})

it('ICalendarParser should return different objects in different calendar-objects', () => {
	const asset = getAsset('import-vevent')

	const parser = new ICalendarParser()
	parser.parse(asset)

	expect(parser.getItemCount()).toEqual(4)

	const itemIterator = parser.getItemIterator()
	const item1 = itemIterator.next().value
	const item2 = itemIterator.next().value
	const item3 = itemIterator.next().value
	const item4 = itemIterator.next().value
	const item5 = itemIterator.next().value

	expect(item1.root).not.toMatchObject(item2.root)
	expect(item2.root).not.toMatchObject(item3.root)
	expect(item3.root).not.toMatchObject(item4.root)
	expect(item5).toEqual(undefined)

	expect(item1.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'UID:19970901T130000Z-123401@example.com\r\n' +
		'DTSTAMP:19970901T130000Z\r\n' +
		'DTSTART:19970903T163000Z\r\n' +
		'DTEND:19970903T190000Z\r\n' +
		'SUMMARY:Annual Employee Review\r\n' +
		'CLASS:PRIVATE\r\n' +
		'CATEGORIES:BUSINESS,HUMAN RESOURCES\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
	expect(item2.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'UID:20070423T123432Z-541111@example.com\r\n' +
		'DTSTAMP:20070423T123432Z\r\n' +
		'DTSTART;VALUE=DATE:20070628\r\n' +
		'DTEND;VALUE=DATE:20070709\r\n' +
		'SUMMARY:Festival International de Jazz de Montreal\r\n' +
		'TRANSP:TRANSPARENT\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
	expect(item3.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'DTSTAMP:19980309T231000Z\r\n' +
		'UID:guid-1.example.com\r\n' +
		'ORGANIZER:mailto:mrbig@example.com\r\n' +
		'ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;CUTYPE=GROUP:mailto:employee-A@exam\r\n' +
		' ple.com\r\n' +
		'DESCRIPTION:Project XYZ Review Meeting\r\n' +
		'CATEGORIES:MEETING\r\n' +
		'CLASS:PUBLIC\r\n' +
		'CREATED:19980309T130000Z\r\n' +
		'SUMMARY:XYZ Project Review\r\n' +
		'DTSTART;TZID=America/New_York:19980312T083000\r\n' +
		'DTEND;TZID=America/Los_Angeles:19980312T093000\r\n' +
		'LOCATION:1CP Conference Room 4350\r\n' +
		'BEGIN:VALARM\r\n' +
		'TRIGGER;VALUE=DATE-TIME:19970317T133000Z\r\n' +
		'REPEAT:4\r\n' +
		'DURATION:PT15M\r\n' +
		'ACTION:AUDIO\r\n' +
		'ATTACH;FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
	expect(item4.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'DTSTAMP:19970324T120000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'UID:uid3@example.com\r\n' +
		'ORGANIZER:mailto:jdoe@example.com\r\n' +
		'ATTENDEE;RSVP=TRUE:mailto:jsmith@example.com\r\n' +
		'DTSTART:19970324T123000Z\r\n' +
		'DTEND:19970324T210000Z\r\n' +
		'CATEGORIES:MEETING,PROJECT\r\n' +
		'CLASS:PUBLIC\r\n' +
		'SUMMARY:Calendaring Interoperability Planning Meeting\r\n' +
		'DESCRIPTION:Discuss how we can test c&s interoperability\\nusing iCalendar a\r\n' +
		' nd other IETF standards.\r\n' +
		'LOCATION:LDB Lobby\r\n' +
		'ATTACH;FMTTYPE=application/postscript:ftp://example.com/pub/conf/bkgrnd.ps\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('ICalendarParser should create forged master items when parsed object only contains recurrence-exceptions', () => {
	const ics = getAsset('recurring-recurrence-id-only')

	const parser = new ICalendarParser()
	parser.parse(ics)

	const iterator = parser.getItemIterator()

	const item1 = iterator.next().value
	const item2 = iterator.next().value
	expect(iterator.next().value).toEqual(undefined)

	expect(item1.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190701T131123Z\r\n' +
		'UID:24C45485-7943-4A1A-9551-12AD83DF1F6D\r\n' +
		'DTEND;TZID=Europe/Berlin:20190721T100000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:recurring event exception 1\r\n' +
		'LAST-MODIFIED:20190701T131139Z\r\n' +
		'DTSTAMP:20190701T131130Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190721T090000\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID;TZID=Europe/Berlin:20190720T090000\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'UID:24C45485-7943-4A1A-9551-12AD83DF1F6D\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190720T090000\r\n' +
		'RDATE;TZID=Europe/Berlin:20190720T090000\r\n' +
		'SEQUENCE:1\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
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
	expect(item2.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Apple Inc.//Mac OS X 10.14.5//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20190703T172822Z\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTEND;TZID=Europe/Berlin:20190719T230000\r\n' +
		'TRANSP:OPAQUE\r\n' +
		'X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\r\n' +
		'SUMMARY:recurring event exception 2\r\n' +
		'LAST-MODIFIED:20190703T172914Z\r\n' +
		'DTSTAMP:20190703T172836Z\r\n' +
		'DTSTART:20190824T110000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'RECURRENCE-ID:20190824T070000Z\r\n' +
		'END:VEVENT\r\n' +
		'BEGIN:VEVENT\r\n' +
		'UID:41CBE812-F77C-471A-A481-D6A18CCAAA99\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'DTSTART:20190824T070000Z\r\n' +
		'RDATE:20190824T070000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
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

it('ICalendarParser should fill up missing timezones', () => {
	const timezoneManager = getTimezoneManager()
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	timezoneManager.registerTimezone(tzNYC)

	const asset = getAsset('import-vevent')
	const parser = new ICalendarParser({includeTimezones: true})
	parser.parse(asset)

	const itemIterator = parser.getItemIterator()
	itemIterator.next().value
	itemIterator.next().value
	const item3 = itemIterator.next().value
	const item4 = itemIterator.next().value

	expect(item3.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
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
		'BEGIN:VEVENT\r\n' +
		'DTSTAMP:19980309T231000Z\r\n' +
		'UID:guid-1.example.com\r\n' +
		'ORGANIZER:mailto:mrbig@example.com\r\n' +
		'ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;CUTYPE=GROUP:mailto:employee-A@exam\r\n' +
		' ple.com\r\n' +
		'DESCRIPTION:Project XYZ Review Meeting\r\n' +
		'CATEGORIES:MEETING\r\n' +
		'CLASS:PUBLIC\r\n' +
		'CREATED:19980309T130000Z\r\n' +
		'SUMMARY:XYZ Project Review\r\n' +
		'DTSTART;TZID=America/New_York:19980312T083000\r\n' +
		'DTEND;TZID=America/Los_Angeles:19980312T093000\r\n' +
		'LOCATION:1CP Conference Room 4350\r\n' +
		'BEGIN:VALARM\r\n' +
		'TRIGGER;VALUE=DATE-TIME:19970317T133000Z\r\n' +
		'REPEAT:4\r\n' +
		'DURATION:PT15M\r\n' +
		'ACTION:AUDIO\r\n' +
		'ATTACH;FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')

	timezoneManager.unregisterTimezones(tzNYC)
})

it('ICalendarParser should replace alias timezones with the real timezone', () => {
	const timezoneManager = getTimezoneManager()
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerAlias('This_timezone_is_New_York', 'America/New_York')

	const ics = getAsset('import-vevent-replace-alias')
	const parser = new ICalendarParser({includeTimezones: true})
	parser.parse(ics)

	const itemIterator = parser.getItemIterator()
	expect(itemIterator.next().value.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
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
		'BEGIN:VEVENT\r\n' +
		'DTSTAMP:19980309T231000Z\r\n' +
		'UID:guid-1.example.com\r\n' +
		'ORGANIZER:mailto:mrbig@example.com\r\n' +
		'ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;CUTYPE=GROUP:mailto:employee-A@exam\r\n' +
		' ple.com\r\n' +
		'DESCRIPTION:Project XYZ Review Meeting\r\n' +
		'CATEGORIES:MEETING\r\n' +
		'CLASS:PUBLIC\r\n' +
		'CREATED:19980309T130000Z\r\n' +
		'SUMMARY:XYZ Project Review\r\n' +
		'DTSTART;TZID=America/New_York:19980312T083000\r\n' +
		'DTEND;TZID=America/Los_Angeles:19980312T093000\r\n' +
		'LOCATION:1CP Conference Room 4350\r\n' +
		'BEGIN:VALARM\r\n' +
		'TRIGGER;VALUE=DATE-TIME:19970317T133000Z\r\n' +
		'REPEAT:4\r\n' +
		'DURATION:PT15M\r\n' +
		'ACTION:AUDIO\r\n' +
		'ATTACH;FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('ICalendarParser should initialise the recurrence-manager and relate exceptions', () => {
	const ics = getAsset('recurring-infinitely-with-rdates')

	const parser = new ICalendarParser()
	parser.parse(ics)

	const iterator = parser.getItemIterator()
	const itemList = Array.from(iterator)
	expect(itemList.length).toEqual(1)

	const vObjectIterator = itemList[0].getVObjectIterator()
	const vobjectList = Array.from(vObjectIterator)

	// All items should be exposed
	// All should have the same master item
	expect(vobjectList.length).toEqual(6)
	expect(vobjectList[0].masterItem).toEqual(vobjectList[1].masterItem)
	expect(vobjectList[1].masterItem).toEqual(vobjectList[2].masterItem)
	expect(vobjectList[2].masterItem).toEqual(vobjectList[3].masterItem)
	expect(vobjectList[3].masterItem).toEqual(vobjectList[4].masterItem)
	expect(vobjectList[4].masterItem).toEqual(vobjectList[5].masterItem)

	// All should have the same recurrence manager
	expect(vobjectList[0].recurrenceManager).toEqual(vobjectList[1].recurrenceManager)
	expect(vobjectList[1].recurrenceManager).toEqual(vobjectList[2].recurrenceManager)
	expect(vobjectList[2].recurrenceManager).toEqual(vobjectList[3].recurrenceManager)
	expect(vobjectList[3].recurrenceManager).toEqual(vobjectList[4].recurrenceManager)
	expect(vobjectList[4].recurrenceManager).toEqual(vobjectList[5].recurrenceManager)

	expect(vobjectList[0].masterItem).toEqual(vobjectList[0])
	const recurrenceExceptionList = vobjectList[1].recurrenceManager.getRecurrenceExceptionList()
	expect(recurrenceExceptionList.length).toEqual(5)
})

it('ICalendarParser should extract global properties - name - x-wr-calname', () => {
	const ics1 = "BEGIN:VCALENDAR\r\n" +
		"END:VCALENDAR"

	const ics2 = "BEGIN:VCALENDAR\r\n" +
		"X-WR-CALNAME:Name123\r\n" +
		"END:VCALENDAR"

	const ics3 = "BEGIN:VCALENDAR\r\n" +
		"X-WR-CALNAME:Name123\r\n" +
		"NAME:Name456\r\n" +
		"END:VCALENDAR"

	const parser1 = new ICalendarParser({extractGlobalProperties: true})
	parser1.parse(ics1)
	expect(parser1.getName()).toEqual(null)

	const parser2 = new ICalendarParser({extractGlobalProperties: true})
	parser2.parse(ics2)
	expect(parser2.getName()).toEqual('Name123')

	const parser3 = new ICalendarParser({extractGlobalProperties: true})
	parser3.parse(ics3)
	expect(parser3.getName()).toEqual('Name456')
})

it('ICalendarParser should extract global properties - color - x-apple-calendar-color', () => {
	const ics1 = "BEGIN:VCALENDAR\r\n" +
		"END:VCALENDAR"

	const ics2 = "BEGIN:VCALENDAR\r\n" +
		"X-APPLE-CALENDAR-COLOR:#ffffff\r\n" +
		"END:VCALENDAR"

	const ics3 = "BEGIN:VCALENDAR\r\n" +
		"X-APPLE-CALENDAR-COLOR:#ffffff\r\n" +
		"COLOR:#000000\r\n" +
		"END:VCALENDAR"

	const parser1 = new ICalendarParser({extractGlobalProperties: true})
	parser1.parse(ics1)
	expect(parser1.getName()).toEqual(null)

	const parser2 = new ICalendarParser({extractGlobalProperties: true})
	parser2.parse(ics2)
	expect(parser2.getColor()).toEqual('#ffffff')

	const parser3 = new ICalendarParser({extractGlobalProperties: true})
	parser3.parse(ics3)
	expect(parser3.getColor()).toEqual('#000000')
})

it('ICalendarParser should extract global properties - source', () => {
	const ics1 = "BEGIN:VCALENDAR\r\n" +
		"END:VCALENDAR"

	const ics2 = "BEGIN:VCALENDAR\r\n" +
		"SOURCE:http://example.com/file.ics\r\n" +
		"END:VCALENDAR"

	const parser1 = new ICalendarParser({extractGlobalProperties: true})
	parser1.parse(ics1)
	expect(parser1.getSourceURL()).toEqual(null)

	const parser2 = new ICalendarParser({extractGlobalProperties: true})
	parser2.parse(ics2)
	expect(parser2.getSourceURL()).toEqual('http://example.com/file.ics')
})

it('ICalendarParser should extract global properties - refreshrate - x-published-ttl', () => {
	const ics1 = "BEGIN:VCALENDAR\r\n" +
		"END:VCALENDAR"

	const ics2 = "BEGIN:VCALENDAR\r\n" +
		"X-PUBLISHED-TTL:P1D\r\n" +
		"END:VCALENDAR"

	const ics3 = "BEGIN:VCALENDAR\r\n" +
		"X-PUBLISHED-TTL:P1D\r\n" +
		"REFRESH-INTERVAL:P2D\r\n" +
		"END:VCALENDAR"

	const parser1 = new ICalendarParser({extractGlobalProperties: true})
	parser1.parse(ics1)
	expect(parser1.getRefreshInterval()).toEqual(null)

	const parser2 = new ICalendarParser({extractGlobalProperties: true})
	parser2.parse(ics2)
	expect(parser2.getRefreshInterval()).toEqual('P1D')

	const parser3 = new ICalendarParser({extractGlobalProperties: true})
	parser3.parse(ics3)
	expect(parser3.getRefreshInterval()).toEqual('P2D')
})

it('ICalendarParser should extract global properties - x-wr-timezone', () => {
	const ics1 = "BEGIN:VCALENDAR\r\n" +
		"END:VCALENDAR"

	const ics2 = "BEGIN:VCALENDAR\r\n" +
		"X-WR-TIMEZONE:Europe/Berlin\r\n" +
		"END:VCALENDAR"

	const parser1 = new ICalendarParser({extractGlobalProperties: true})
	parser1.parse(ics1)
	expect(parser1.getCalendarTimezone()).toEqual(null)

	const parser2 = new ICalendarParser({extractGlobalProperties: true})
	parser2.parse(ics2)
	expect(parser2.getCalendarTimezone()).toEqual('Europe/Berlin')
})

it('ICalendarParser should remove RSVP - removeRSVPForAttendees', () => {
	const asset = getAsset('import-vevent')

	const parser = new ICalendarParser({removeRSVPForAttendees: true})
	parser.parse(asset)

	const itemIterator = parser.getItemIterator()
	itemIterator.next().value
	itemIterator.next().value
	const item3 = itemIterator.next().value
	const item4 = itemIterator.next().value

	expect(item3.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'DTSTAMP:19980309T231000Z\r\n' +
		'UID:guid-1.example.com\r\n' +
		'ORGANIZER:mailto:mrbig@example.com\r\n' +
		'ATTENDEE;ROLE=REQ-PARTICIPANT;CUTYPE=GROUP:mailto:employee-A@example.com\r\n' +
		'DESCRIPTION:Project XYZ Review Meeting\r\n' +
		'CATEGORIES:MEETING\r\n' +
		'CLASS:PUBLIC\r\n' +
		'CREATED:19980309T130000Z\r\n' +
		'SUMMARY:XYZ Project Review\r\n' +
		'DTSTART;TZID=America/New_York:19980312T083000\r\n' +
		'DTEND;TZID=America/Los_Angeles:19980312T093000\r\n' +
		'LOCATION:1CP Conference Room 4350\r\n' +
		'BEGIN:VALARM\r\n' +
		'TRIGGER;VALUE=DATE-TIME:19970317T133000Z\r\n' +
		'REPEAT:4\r\n' +
		'DURATION:PT15M\r\n' +
		'ACTION:AUDIO\r\n' +
		'ATTACH;FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
	expect(item4.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'DTSTAMP:19970324T120000Z\r\n' +
		'SEQUENCE:0\r\n' +
		'UID:uid3@example.com\r\n' +
		'ORGANIZER:mailto:jdoe@example.com\r\n' +
		'ATTENDEE:mailto:jsmith@example.com\r\n' +
		'DTSTART:19970324T123000Z\r\n' +
		'DTEND:19970324T210000Z\r\n' +
		'CATEGORIES:MEETING,PROJECT\r\n' +
		'CLASS:PUBLIC\r\n' +
		'SUMMARY:Calendaring Interoperability Planning Meeting\r\n' +
		'DESCRIPTION:Discuss how we can test c&s interoperability\\nusing iCalendar a\r\n' +
		' nd other IETF standards.\r\n' +
		'LOCATION:LDB Lobby\r\n' +
		'ATTACH;FMTTYPE=application/postscript:ftp://example.com/pub/conf/bkgrnd.ps\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('ICalendarParser should provide correct set of mime-types', () => {
	expect(ICalendarParser.getMimeTypes()).toEqual(['text/calendar'])
})
