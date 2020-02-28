/**
 * @copyright Copyright (c) 2020 Georg Ehrke
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

import { parseICSAndGetAllOccurrencesBetween } from '../../../src';
import DateTimeValue from '../../../src/values/dateTimeValue.js';

jest.mock('../../../src/factories/dateFactory.js')

it('should update lastModified after creating an alarm', () => {
	const ics = 'BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20000101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;VALUE=DATE:20190818\r\n' +
		'DTEND;VALUE=DATE:20190819\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR';
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 1, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 12, 31, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	/** EventComponent event1 */
	const event1 = iterator.next().value

	const alarmTime = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 6, 6, 0, 0, 0)), true)

	event1.addAbsoluteAlarm('DISPLAY', alarmTime)
	
	expect(event1.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;VALUE=DATE:20190818\r\n' +
		'DTEND;VALUE=DATE:20190819\r\n' +
		'BEGIN:VALARM\r\n' +
		'ACTION:DISPLAY\r\n' +
		'TRIGGER;VALUE=DATE-TIME:20190706T000000Z\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
});

it('should update lastModified after editing an alarm', () => {
	const ics = 'BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20000101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;VALUE=DATE:20190818\r\n' +
		'DTEND;VALUE=DATE:20190819\r\n' +
		'BEGIN:VALARM\r\n' +
		'ACTION:DISPLAY\r\n' +
		'TRIGGER:-P1D\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR'
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 1, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 12, 31, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event1 = iterator.next().value

	const alarmIterator = event1.getAlarmIterator()
	const alarm1 = alarmIterator.next().value

	const value = alarm1.getFirstPropertyFirstValue('TRIGGER')
	value.hours = 5

	expect(event1.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;VALUE=DATE:20190818\r\n' +
		'DTEND;VALUE=DATE:20190819\r\n' +
		'BEGIN:VALARM\r\n' +
		'ACTION:DISPLAY\r\n' +
		'TRIGGER:-P1DT5H\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
});

it('should update lastModified after deleting an alarm', () => {
	const ics = 'BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20000101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;VALUE=DATE:20190818\r\n' +
		'DTEND;VALUE=DATE:20190819\r\n' +
		'BEGIN:VALARM\r\n' +
		'ACTION:DISPLAY\r\n' +
		'TRIGGER:-P1D\r\n' +
		'END:VALARM\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR'
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 1, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 12, 31, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)
	const event1 = iterator.next().value

	const alarmIterator = event1.getAlarmIterator()
	const alarm1 = alarmIterator.next().value

	event1.removeAlarm(alarm1)

	expect(event1.toICSEntireSeries()).toEqual('BEGIN:VCALENDAR\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;VALUE=DATE:20190818\r\n' +
		'DTEND;VALUE=DATE:20190819\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
});
