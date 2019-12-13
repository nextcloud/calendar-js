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

import { createFreeBusyRequest } from '../../../src';
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import AttendeeProperty from '../../../src/properties/attendeeProperty.js';
jest.mock('../../../src/factories/dateFactory.js')

it('should create a freeBusy request', () => {
	const start = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 18,
		hour: 2,
		minute: 0,
		second: 0,
		isDate: false
	})
	const end = DateTimeValue.fromData({
		year: 2019,
		month: 8,
		day: 25,
		hour: 2,
		minute: 0,
		second: 0,
		isDate: false
	})

	const organizer = AttendeeProperty.fromNameAndEMail('Foo', 'mailto:foo@bar.com', true)
	const attendee1 = AttendeeProperty.fromNameAndEMail('Foo 2', 'mailto:foo2@bar.com')
	const attendee2 = AttendeeProperty.fromNameAndEMail('Foo 2', 'mailto:foo3@bar.com')
	const attendee3 = AttendeeProperty.fromNameAndEMail('Foo 2', 'mailto:foo4@bar.com')

	const calendar = createFreeBusyRequest(start, end, organizer, [attendee1, attendee2, attendee3])
	expect(calendar.toICS()).toEqual('BEGIN:VCALENDAR\r\n' +
		'PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'VERSION:2.0\r\n' +
		'METHOD:REQUEST\r\n' +
		'BEGIN:VFREEBUSY\r\n' +
		'DTSTAMP:20300101T000000Z\r\n' +
		'UID:RANDOM UUID 123\r\n' +
		'DTSTART:20190818T020000Z\r\n' +
		'DTEND:20190825T020000Z\r\n' +
		'ORGANIZER;CN=Foo:mailto:foo@bar.com\r\n' +
		'ATTENDEE;CN=Foo 2:mailto:foo2@bar.com\r\n' +
		'ATTENDEE;CN=Foo 2:mailto:foo3@bar.com\r\n' +
		'ATTENDEE;CN=Foo 2:mailto:foo4@bar.com\r\n' +
		'END:VFREEBUSY\r\n' +
		'END:VCALENDAR')
})
