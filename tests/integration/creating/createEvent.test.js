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

import DateTimeValue from '../../../src/values/dateTimeValue.js'
import { createEvent } from '../../../src';
import { Timezone } from '@nextcloud/timezones';

jest.mock('../../../src/factories/dateFactory.js')

it('should create events based on parameters - allday', () => {
	const start = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 18,
		isDate: true
	})
	const end = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 19,
		isDate: true
	})

	const calendar = createEvent(start, end)
	expect(calendar.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
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
})

it('should create events based on parameters - timed floating', () => {
	const start = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 18,
		hour: 15,
		minute: 0,
		second: 0,
		isDate: false
	})
	const end = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 18,
		hour: 17,
		minute: 0,
		second: 0,
		isDate: false
	})

	const calendar = createEvent(start, end)
	expect(calendar.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART:20190818T150000\r\n' +
		'DTEND:20190818T170000\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})

it('should create events based on parameters - timed timezone', () => {
	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))

	const start = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 18,
		hour: 15,
		minute: 0,
		second: 0,
		isDate: false
	}, tzBerlin)
	const end = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 18,
		hour: 17,
		minute: 0,
		second: 0,
		isDate: false
	}, tzBerlin)

	const calendar = createEvent(start, end)
	expect(calendar.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'BEGIN:VEVENT\r\n' +
		'CREATED:20300101T000000Z\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'LAST-MODIFIED:20300101T000000Z\r\n' +
		'SEQUENCE:1\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART;TZID=Europe/Berlin:20190818T150000\r\n' +
		'DTEND;TZID=Europe/Berlin:20190818T170000\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR')
})
