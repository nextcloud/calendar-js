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
import { createCalendarComponent, createComponent, createProperty } from '../../../src/factories/icalFactory.js';
import { deleteConfig, setConfig } from '../../../src/config.js';

it('should create simple ICAL.Components', () => {
	const comp = createComponent('VFOOBAR')
	expect(comp.toString()).toEqual("BEGIN:VFOOBAR\r\nEND:VFOOBAR")
})

it('should create simple ICAL.Properties', () => {
	const prop = createProperty('X-NEXTCLOUD-FOO')
	expect(prop.toICALString()).toEqual('X-NEXTCLOUD-FOO:')
})

it('should create VCALENDAR components with all the mandatory properties - without method', () => {
	const comp = createCalendarComponent()
	expect(comp.toString()).toEqual("BEGIN:VCALENDAR\r\n" +
		"PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n" +
		"CALSCALE:GREGORIAN\r\n" +
		"VERSION:2.0\r\n" +
		"END:VCALENDAR")
})

it('should create VCALENDAR components with all the mandatory properties - with method', () => {
	const comp = createCalendarComponent('CANCEL')
	expect(comp.toString()).toEqual("BEGIN:VCALENDAR\r\n" +
		"PRODID:-//IDN georgehrke.com//calendar-js//EN\r\n" +
		"CALSCALE:GREGORIAN\r\n" +
		"VERSION:2.0\r\n" +
		"METHOD:CANCEL\r\n" +
		"END:VCALENDAR")
})

it('should create VCALENDAR components with all the mandatory properties - without method - with config', () => {
	// it's a pain to mock individual functions in jest, so we will just set the value here.
	setConfig('PRODID', '-//IDN nextcloud.com//Nextcloud v42 Calendar app v2.0.0//EN')
	const comp = createCalendarComponent()
	expect(comp.toString()).toEqual("BEGIN:VCALENDAR\r\n" +
		"PRODID:-//IDN nextcloud.com//Nextcloud v42 Calendar app v2.0.0//EN\r\n" +
		"CALSCALE:GREGORIAN\r\n" +
		"VERSION:2.0\r\n" +
		"END:VCALENDAR")
	deleteConfig('PRODID')
})

it('should create VCALENDAR components with all the mandatory properties - with method - with config', () => {
	setConfig('PRODID', '-//IDN nextcloud.com//Nextcloud v42 Calendar app v2.0.0//EN')
	const comp = createCalendarComponent('CANCEL')
	expect(comp.toString()).toEqual("BEGIN:VCALENDAR\r\n" +
		"PRODID:-//IDN nextcloud.com//Nextcloud v42 Calendar app v2.0.0//EN\r\n" +
		"CALSCALE:GREGORIAN\r\n" +
		"VERSION:2.0\r\n" +
		"METHOD:CANCEL\r\n" +
		"END:VCALENDAR")
	deleteConfig('PRODID')
})
