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
import Timezone from '../../../src/timezones/timezone.js';
import TimezoneComponent from '../../../src/components/root/timezoneComponent.js';

it('Timezone should be defined', () => {
	expect(Timezone).toBeDefined()
})

it('Timezone should take two parameters: timezoneId and ics', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(timezone.timezoneId).toEqual(name)
})

it('Timezone should take one parameters: icalValue (ICAL.Timezone)', () => {
	const ics = getAsset('timezone-europe-berlin')
	const jCal = ICAL.parse(ics)
	const icalComp = new ICAL.Component(jCal)
	const icalTimezone = new ICAL.Timezone(icalComp)

	const timezone = new Timezone(icalTimezone)

	expect(timezone.timezoneId).toEqual('Europe/Berlin')
})

it('Timezone should take one parameters: icalValue (ICAL.Component)', () => {
	const ics = getAsset('timezone-europe-berlin')
	const jCal = ICAL.parse(ics)
	const icalComp = new ICAL.Component(jCal)

	const timezone = new Timezone(icalComp)

	expect(timezone.timezoneId).toEqual('Europe/Berlin')
})

it('Timezone should support lazy loading', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(timezone.timezoneId).toEqual(name)
	expect(timezone._initialized).toEqual(false)

	expect(timezone.toICALJs() instanceof ICAL.Component).toEqual(true)
	expect(timezone._initialized).toEqual(true)

	expect(timezone.toICALTimezone() instanceof ICAL.Timezone).toEqual(true)
	expect(timezone._initialized).toEqual(true)
})

it('Timezone should provide an offsetForArray method', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(timezone.offsetForArray(2019, 1, 1, 15, 30, 20)).toEqual(3600)
})

it('Timezone should provide an timestampToArray method', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(timezone.timestampToArray(1560937459931)).toEqual([
		2019,
		6,
		19,
		11,
		44,
		19
	])
})

it('Timezone should provide an ICAL Timezone', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(timezone.toICALTimezone() instanceof ICAL.Timezone).toEqual(true)
})

it('Timezone should provide an ICAL.JS Component', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(timezone.toICALJs() instanceof ICAL.Component).toEqual(true)
})

it('Timezone should provide a calendar-js TimezoneComponent', () => {
	const name = 'Europe/Berlin'
	const ics = getAsset('timezone-europe-berlin')

	const timezone = new Timezone(name, ics)

	expect(TimezoneComponent.fromICALJs(timezone.toICALJs()) instanceof TimezoneComponent).toEqual(true)
})

it('Timezone should provide a default timezone for UTC', () => {
	expect(Timezone.utc).toBeDefined()
	expect(Timezone.utc.timezoneId).toEqual('UTC')
})

it('Timezone should provide a default timezone for floating times', () => {
	expect(Timezone.floating).toBeDefined()
	expect(Timezone.floating.timezoneId).toEqual('floating')
})
