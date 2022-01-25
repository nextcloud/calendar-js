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
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import Timezone from '../../../src/timezones/timezone.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import DurationValue from '../../../src/values/durationValue.js';

const tzBerlin = new Timezone('Europe/Berlin', getAsset('timezone-europe-berlin'))
const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
const tzLA = new Timezone('America/Los_Angeles', getAsset('timezone-america-la'))

it('DateTimeValue should be defined', () => {
	expect(DateTimeValue).toBeDefined()
})

it('DateTimeValue should provide a constructor from data', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)

	expect(value.toICALJs().toICALString()).toEqual('20190504T235523')
	expect(value.isFloatingTime()).toEqual(false)
	expect(value.toICALJs().zone.tzid).toEqual('America/New_York')
})

it('DateTimeValue should provide a constructor from data - utc', () => {
	const timezone = new Timezone(ICAL.Timezone.utcTimezone)
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, timezone)

	expect(value.toICALJs().toICALString()).toEqual('20190504T235523Z')
	expect(value.isFloatingTime()).toEqual(false)
	expect(value.toICALJs().zone.tzid).toEqual('UTC')
})

it('DateTimeValue should provide a constructor from data - floating', () => {
	const timezone = new Timezone(ICAL.Timezone.localTimezone)
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, timezone)

	expect(value.toICALJs().toICALString()).toEqual('20190504T235523')
	expect(value.isFloatingTime()).toEqual(true)
	expect(value.toICALJs().zone.tzid).toEqual('floating')
})

it('DateTimeValue should provide a constructor from data - isDate true', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23,
		isDate: true
	})

	expect(value.toICALJs().toICALString()).toEqual('20190504')
})

it('DateTimeValue should provide a constructor from a JS Date object - use utc', () => {
	const date = new Date(Date.UTC(1995, 11, 17, 3, 24, 0, 0))
	const value = DateTimeValue.fromJSDate(date, true)

	expect(value.toICALJs().toICALString()).toEqual('19951217T032400Z')
})

it('DateTimeValue should provide a constructor from a JS Date object - dont use utc', () => {
	const date = new Date('1995-12-17T03:24:00')
	const value = DateTimeValue.fromJSDate(date)

	expect(value.toICALJs().toICALString()).toEqual('19951217T032400')
})

it('DateTimeValue should provide a constructor from ICAL.JS', () => {
	const date = new Date('1995-12-17T03:24:00')
	const icalValue = ICAL.Time.fromJSDate(date)
	const value = DateTimeValue.fromICALJs(icalValue, tzBerlin)

	expect(value.toICALJs().toICALString()).toEqual('19951217T032400')
})

it('DateTimeValue should be lockable - year', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.year).toEqual(2019)

	value.year = 2020
	expect(value.year).toEqual(2020)

	value.lock()

	expect(() => {
		value.year = 2021
	}).toThrow(ModificationNotAllowedError);
	expect(value.year).toEqual(2020)

	value.unlock()

	value.year = 2022
	expect(value.year).toEqual(2022)
	expect(value.toICALJs().toICALString()).toEqual('20220504T235523')
})

it('DateTimeValue should be lockable - month', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.month).toEqual(5)

	value.month = 6
	expect(value.month).toEqual(6)

	value.lock()

	expect(() => {
		value.month = 7
	}).toThrow(ModificationNotAllowedError);
	expect(value.month).toEqual(6)

	value.unlock()

	value.month = 8
	expect(value.month).toEqual(8)
	expect(value.toICALJs().toICALString()).toEqual('20190804T235523')

	expect(() => {
		value.month = 0
	}).toThrow(TypeError, 'Month out of range');
	expect(value.month).toEqual(8)
	expect(() => {
		value.month = 13
	}).toThrow(TypeError, 'Month out of range');
	expect(value.month).toEqual(8)
})

it('DateTimeValue should be lockable - day', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.day).toEqual(4)

	value.day = 5
	expect(value.day).toEqual(5)

	value.lock()

	expect(() => {
		value.day = 6
	}).toThrow(ModificationNotAllowedError);
	expect(value.day).toEqual(5)

	value.unlock()

	value.day = 7
	expect(value.day).toEqual(7)
	expect(value.toICALJs().toICALString()).toEqual('20190507T235523')

	expect(() => {
		value.day = 0
	}).toThrow(TypeError, 'Day out of range');
	expect(value.day).toEqual(7)
	expect(() => {
		value.day = 32
	}).toThrow(TypeError, 'Day out of range');
	expect(value.day).toEqual(7)
})

it('DateTimeValue should be lockable - hour', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.hour).toEqual(23)

	value.hour = 5
	expect(value.hour).toEqual(5)

	value.lock()

	expect(() => {
		value.hour = 6
	}).toThrow(ModificationNotAllowedError);
	expect(value.hour).toEqual(5)

	value.unlock()

	value.hour = 7
	expect(value.hour).toEqual(7)
	expect(value.toICALJs().toICALString()).toEqual('20190504T075523')

	expect(() => {
		value.hour = -1
	}).toThrow(TypeError, 'Hour out of range');
	expect(value.hour).toEqual(7)
	expect(() => {
		value.hour = 60
	}).toThrow(TypeError, 'Hour out of range');
	expect(value.hour).toEqual(7)
})

it('DateTimeValue should be lockable - minute', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.minute).toEqual(55)

	value.minute = 5
	expect(value.minute).toEqual(5)

	value.lock()

	expect(() => {
		value.minute = 6
	}).toThrow(ModificationNotAllowedError);
	expect(value.minute).toEqual(5)

	value.unlock()

	value.minute = 7
	expect(value.minute).toEqual(7)
	expect(value.toICALJs().toICALString()).toEqual('20190504T230723')

	expect(() => {
		value.minute = -1
	}).toThrow(TypeError, 'Minute out of range');
	expect(value.minute).toEqual(7)
	expect(() => {
		value.minute = 60
	}).toThrow(TypeError, 'Minute out of range');
	expect(value.minute).toEqual(7)
})

it('DateTimeValue should be lockable - second', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.second).toEqual(23)

	value.second = 5
	expect(value.second).toEqual(5)

	value.lock()

	expect(() => {
		value.second = 6
	}).toThrow(ModificationNotAllowedError);
	expect(value.second).toEqual(5)

	value.unlock()

	value.second = 7
	expect(value.second).toEqual(7)
	expect(value.toICALJs().toICALString()).toEqual('20190504T235507')

	expect(() => {
		value.second = -1
	}).toThrow(TypeError, 'Second out of range');
	expect(value.second).toEqual(7)
	expect(() => {
		value.second = 60
	}).toThrow(TypeError, 'Second out of range');
	expect(value.second).toEqual(7)
})

it('DateTimeValue should provide a getter for the used timezoneId', () => {
	const value1 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	})

	expect(value1.timezoneId).toEqual('floating')

	const value2 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)

	expect(value2.timezoneId).toEqual('America/New_York')

	const timezone = new Timezone(ICAL.Timezone.utcTimezone)
	const value3 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, timezone)

	expect(value3.timezoneId).toEqual('UTC')
})

it('DateTimeValue should be lockable - isDate', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.isDate).toEqual(false)

	value.isDate = true
	expect(value.isDate).toEqual(true)

	value.lock()

	expect(() => {
		value.isDate = false
	}).toThrow(ModificationNotAllowedError);
	expect(value.isDate).toEqual(true)

	value.unlock()

	value.isDate = false
	expect(value.isDate).toEqual(false)
	expect(value.toICALJs().toICALString()).toEqual('20190504T000000')
})

it('DateTimeValue should provide a unixTime', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.unixTime).toEqual(1557028523)
})

it('DateTimeValue should provide a js date', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)
	expect(value.jsDate.toISOString()).toEqual('2019-05-05T03:55:23.000Z')
})

it('DateTimeValue should allow to add a duration', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)

	const duration = DurationValue.fromSeconds(60 * 60 * 5 + 60 * 5 + 55)
	value.addDuration(duration)

	expect(value.year).toEqual(2019)
	expect(value.month).toEqual(5)
	expect(value.day).toEqual(5)
	expect(value.hour).toEqual(5)
	expect(value.minute).toEqual(1)
	expect(value.second).toEqual(18)
})

it('DateTimeValue should allow to subtract another Date and get the difference as Duration', () => {
	const value1 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 3,
		hour: 15,
		minute: 55,
		second: 23
	}, tzLA)

	const difference = value1.subtractDateWithoutTimezone(value2)
	expect(difference instanceof DurationValue).toEqual(true)
	expect(difference.toICALJs().toICALString()).toEqual('P1DT8H')
})

it('DateTimeValue should allow to subtract another Date, taking timezones into account', () => {
	const value1 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 3,
		hour: 15,
		minute: 55,
		second: 23
	}, tzLA)

	const difference = value1.subtractDateWithTimezone(value2)
	expect(difference instanceof DurationValue).toEqual(true)
	expect(difference.toICALJs().toICALString()).toEqual('P1DT5H')
})

it('DateTimeValue should allow to compare to another Date', () => {
	const value1 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 23,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 3,
		hour: 15,
		minute: 55,
		second: 23
	}, tzLA)

	const value3 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 20,
		minute: 55,
		second: 23
	}, tzLA)

	expect(value1.compare(value2)).toEqual(1)
	expect(value2.compare(value1)).toEqual(-1)
	expect(value1.compare(value3)).toEqual(0)
})

it('DateTimeValue should allow to compare to another Date - comparing only the date part', () => {
	const value1 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 15,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 22,
		minute: 55,
		second: 23
	}, tzLA)

	const value3 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 12,
		minute: 55,
		second: 23
	}, tzLA)

	expect(value1.compareDateOnlyInGivenTimezone(value2, tzBerlin)).toEqual(-1)
	expect(value2.compareDateOnlyInGivenTimezone(value1, tzBerlin)).toEqual(1)
	expect(value1.compareDateOnlyInGivenTimezone(value3, tzBerlin)).toEqual(0)
})

it('DateTimeValue should allow to compare to convert DateTime into another timezone', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 15,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = value.getInTimezone(tzLA)
	expect(value.toICALJs().zone).toEqual(tzNYC.toICALTimezone())
	expect(value2.toICALJs().zone).toEqual(tzLA.toICALTimezone())

	expect(value2.year).toEqual(2019)
	expect(value2.month).toEqual(5)
	expect(value2.day).toEqual(4)
	expect(value2.hour).toEqual(12)
	expect(value2.minute).toEqual(55)
	expect(value2.second).toEqual(23)
})

it('DateTimeValue should provide a function to get the UTCOffset', () => {
	const value1 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 15,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 22,
		minute: 55,
		second: 23
	}, tzLA)

	const value3 = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 12,
		minute: 55,
		second: 23
	}, tzLA)

	expect(value1.utcOffset()).toEqual(-14400)
	expect(value2.utcOffset()).toEqual(-25200)
	expect(value3.utcOffset()).toEqual(-25200)
})

it('DateTimeValue should be able to return the inner ICAL.JS object', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 15,
		minute: 55,
		second: 23
	}, tzNYC)

	expect(value.toICALJs() instanceof ICAL.Time).toEqual(true)
})

it('DateTimeValue should allow to clone the value', () => {
	const value = DateTimeValue.fromData({
		year: 2019,
		month: 5,
		day: 4,
		hour: 15,
		minute: 55,
		second: 23
	}, tzNYC)

	const value2 = value.clone()

	value.month = 12
	expect(value.month).toEqual(12)
	expect(value2.month).toEqual(5)
})

it('DateTimeValue should provide static properties for weekdays', () => {
	expect(DateTimeValue.SUNDAY).toBeDefined()
	expect(DateTimeValue.MONDAY).toBeDefined()
	expect(DateTimeValue.TUESDAY).toBeDefined()
	expect(DateTimeValue.WEDNESDAY).toBeDefined()
	expect(DateTimeValue.THURSDAY).toBeDefined()
	expect(DateTimeValue.FRIDAY).toBeDefined()
	expect(DateTimeValue.SATURDAY).toBeDefined()
})

it('DateTimeValue should provide a static property for the first day of the week', () => {
	expect(DateTimeValue.DEFAULT_WEEK_START).toBeDefined()
})
