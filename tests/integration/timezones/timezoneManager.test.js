/**
 * @copyright Copyright (c) 2024 Richard Steinmetz <richard@steinmetz.cloud>
 *
 * @author Richard Steinmetz <richard@steinmetz.cloud>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import ICAL from 'ical.js'
import { getTimezoneManager } from '../../../src/timezones/timezoneManager.js'
import Timezone from '../../../src/timezones/timezone.js'

beforeEach(() => {
	getTimezoneManager().clearAllTimezones()
})

it('TimezoneManager should propagate built-in time zones to ICAL.TimezoneService by default', () => {
	const timezoneManager = getTimezoneManager()

	for (const timezoneId of ['UTC', 'floating', 'GMT', 'Z']) {
		expect(timezoneManager.getTimezoneForId(timezoneId).toICALTimezone()).toEqual(ICAL.TimezoneService.get(timezoneId))
	}
})

it('TimezoneManager should propagate built-in time zones to ICAL.TimezoneService after clearing', () => {
	const timezoneManager = getTimezoneManager()

	timezoneManager.clearAllTimezones()

	for (const timezoneId of ['UTC', 'floating', 'GMT', 'Z']) {
		expect(timezoneManager.getTimezoneForId(timezoneId).toICALTimezone()).toEqual(ICAL.TimezoneService.get(timezoneId))
	}
})

it('TimezoneManager should propagate time zones to ICAL.TimezoneService', () => {
	const timezoneManager = getTimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)

	for (const timezone of [tzBerlin, tzNYC, tzLA]) {
		expect(ICAL.TimezoneService.has(timezone.timezoneId)).toBe(true)
		expect(ICAL.TimezoneService.get(timezone.timezoneId)).toEqual(timezone.toICALTimezone())
	}
})

it('TimezoneManager should propagate aliases to ICAL.TimezoneService', () => {
	const timezoneManager = getTimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')
	timezoneManager.registerAlias('foobar/Stuttgart', 'unknown')

	expect(ICAL.TimezoneService.has('foobar/Berlin')).toBe(true)
	expect(ICAL.TimezoneService.get('foobar/Berlin')).toEqual(tzBerlin.toICALTimezone())
	expect(ICAL.TimezoneService.get('foobar/Berlin')).toEqual(ICAL.TimezoneService.get('Europe/Berlin'))
})

it('TimezoneManager should propagate pending aliases to ICAL.TimezoneService', () => {
	const timezoneManager = getTimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(ICAL.TimezoneService.has('foobar/Berlin')).toBe(false)
	expect(ICAL.TimezoneService.get('foobar/Berlin')).toBeFalsy()

	timezoneManager.registerTimezone(tzBerlin)

	expect(ICAL.TimezoneService.has('foobar/Berlin')).toBe(true)
	expect(ICAL.TimezoneService.get('foobar/Berlin')).toEqual(tzBerlin.toICALTimezone())
})

it('TimezoneManager should clear all time zones (except default ones) of ICAL.TimezoneService', () => {
	const timezoneManager = getTimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)

	expect(ICAL.TimezoneService.count).toBe(7)

	timezoneManager.clearAllTimezones()

	expect(ICAL.TimezoneService.count).toBe(4)
})
