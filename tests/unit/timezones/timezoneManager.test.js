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
import { getTimezoneManager, isOlsonTimezone, TimezoneManager } from '../../../src/timezones/timezoneManager.js';
import Timezone from '../../../src/timezones/timezone.js';

it('TimezoneManager should be defined', () => {
	expect(TimezoneManager).toBeDefined()
})

it('TimezoneManager should provide a method to get a timezone by id - existing timezone', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')
	timezoneManager.registerAlias('foobar/Stuttgart', 'unknown')

	expect(timezoneManager.getTimezoneForId('Europe/Berlin')).toEqual(tzBerlin)
})

it('TimezoneManager should be able to self-register a default set of timezones', () => {
	const timezoneManager = new TimezoneManager()

	timezoneManager.registerDefaultTimezones()

	expect(timezoneManager.listAllTimezones().length).toBeGreaterThan(400)
})

it('TimezoneManager should provide a method to get a timezone by id - by alias', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')
	timezoneManager.registerAlias('foobar/Stuttgart', 'unknown')

	expect(timezoneManager.getTimezoneForId('foobar/Berlin')).toEqual(tzBerlin)
})

it('TimezoneManager should provide a method to get a timezone by id - by alias non-existant', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')
	timezoneManager.registerAlias('foobar/Stuttgart', 'unknown')

	expect(timezoneManager.getTimezoneForId('foobar/Stuttgart')).toEqual(null)
})

it('TimezoneManager should provide a method to get a timezone by id - unknown', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')
	timezoneManager.registerAlias('foobar/Stuttgart', 'unknown')

	expect(timezoneManager.getTimezoneForId('unknown')).toEqual(null)
})

it('TimezoneManager should provide a method to check if a certain timezone is known', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(true)
	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(true)
	expect(timezoneManager.hasTimezoneForId('America/Los_Angeles')).toEqual(true)
	expect(timezoneManager.hasTimezoneForId('foobar/Berlin')).toEqual(true)
})

it('TimezoneManager should provide a list of all timezones', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(timezoneManager.listAllTimezones()).toEqual(["Europe/Berlin", "America/New_York", "America/Los_Angeles"])
})

it('TimezoneManager should provide a list of all timezones to include all aliases', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(timezoneManager.listAllTimezones(true)).toEqual(["Europe/Berlin", "America/New_York", "America/Los_Angeles", 'foobar/Berlin'])

})

it('TimezoneManager should provide a method to unregister timezones', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(true)

	timezoneManager.unregisterTimezones('Europe/Berlin')

	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(false)
})

it('TimezoneManager should provide a method to unregister an alias', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(timezoneManager.hasTimezoneForId('foobar/Berlin')).toEqual(true)

	timezoneManager.unregisterAlias('foobar/Berlin')

	expect(timezoneManager.hasTimezoneForId('foobar/Berlin')).toEqual(false)
})

it('TimezoneManager should provide a method to register timezone from is', () => {
	const timezoneManager = new TimezoneManager()

	timezoneManager.registerTimezoneFromICS('Europe/Berlin', getAsset('timezone-europe-berlin'))
	timezoneManager.registerTimezoneFromICS('America/New_York', getAsset('timezone-america-nyc'))
	timezoneManager.registerTimezoneFromICS('America/Los_Angeles', getAsset('timezone-america-la'))

	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(true)
})

it('TimezoneManager should provide a method to clear all timezones', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')

	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(true)
	expect(timezoneManager.hasTimezoneForId('foobar/Berlin')).toEqual(true)

	timezoneManager.clearAllTimezones()

	expect(timezoneManager.hasTimezoneForId('Europe/Berlin')).toEqual(false)
	expect(timezoneManager.hasTimezoneForId('foobar/Berlin')).toEqual(false)
})

it('TimezoneManager should provide a default instance', () => {
	const tzManager1 = getTimezoneManager()
	const tzManager2 = getTimezoneManager()

	expect(tzManager1.getTimezoneForId('UTC')).toEqual(Timezone.utc)
	expect(tzManager1.getTimezoneForId('GMT')).toEqual(Timezone.utc)
	expect(tzManager1.getTimezoneForId('Z')).toEqual(Timezone.utc)
	expect(tzManager1.getTimezoneForId('floating')).toEqual(Timezone.floating)

	expect(tzManager1).toEqual(tzManager2)

	expect(tzManager1.hasTimezoneForId('Europe/Berlin')).toEqual(false)
	expect(tzManager2.hasTimezoneForId('Europe/Berlin')).toEqual(false)

	tzManager1.registerTimezone(new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin')))

	expect(tzManager1.hasTimezoneForId('Europe/Berlin')).toEqual(true)
	expect(tzManager2.hasTimezoneForId('Europe/Berlin')).toEqual(true)
})

it('TimezoneManager should provide a method to check if a name is an alias', () => {
	const timezoneManager = new TimezoneManager()

	const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

	timezoneManager.registerTimezone(tzBerlin)
	timezoneManager.registerTimezone(tzNYC)
	timezoneManager.registerTimezone(tzLA)
	timezoneManager.registerAlias('foobar/Berlin', 'Europe/Berlin')
	timezoneManager.registerAlias('foobar/Stuttgart', 'unknown')

	expect(timezoneManager.isAlias('Europe/Berlin')).toEqual(false)
	expect(timezoneManager.isAlias('foobar/Berlin')).toEqual(true)
})

it('TimezoneManager should provide method to check if a given timezone is an Olson timezone', () => {
	expect(isOlsonTimezone('Europe/Berlin')).toEqual(true)
	expect(isOlsonTimezone('US/Western')).toEqual(false)
})
