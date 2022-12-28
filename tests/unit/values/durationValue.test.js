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
import DurationValue from '../../../src/values/durationValue.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('DurationValue should be defined', () => {
	expect(DurationValue).toBeDefined()
})

it('DurationValue should provide a constructor from data', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.weeks).toEqual(8)
	expect(value.days).toEqual(5)
	expect(value.hours).toEqual(2)
	expect(value.minutes).toEqual(15)
	expect(value.seconds).toEqual(4)
	expect(value.isNegative).toEqual(true)
})

it('DurationValue should provide a constructor from seconds', () => {
	const value = DurationValue.fromSeconds(-4321684)
	expect(value.weeks).toEqual(0)
	expect(value.days).toEqual(50)
	expect(value.hours).toEqual(0)
	expect(value.minutes).toEqual(28)
	expect(value.seconds).toEqual(4)
	expect(value.isNegative).toEqual(true)
})

it('DurationValue should provide a constructor from ICAL.js', () => {
	const icalValue = ICAL.Duration.fromSeconds(-4321684)
	const value = DurationValue.fromICALJs(icalValue)
	expect(value.weeks).toEqual(0)
	expect(value.days).toEqual(50)
	expect(value.hours).toEqual(0)
	expect(value.minutes).toEqual(28)
	expect(value.seconds).toEqual(4)
	expect(value.isNegative).toEqual(true)
})

it('DurationValue should be lockable - weeks', () => {
	const value = DurationValue.fromSeconds(3600)
	expect(value.weeks).toEqual(0)

	value.lock()

	expect(() => {
		value.weeks = 1
	}).toThrow(ModificationNotAllowedError);
	expect(value.weeks).toEqual(0)

	value.unlock()

	value.weeks = 1
	expect(value.weeks).toEqual(1)
})

it('DurationValue should throw an error when setting negative weeks', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.weeks).toEqual(8)

	expect(() => {
		value.weeks = -10
	}).toThrow(TypeError, 'Weeks cannot be negative, use isNegative instead');
	expect(value.weeks).toEqual(8)
})

it('DurationValue should be lockable - days', () => {
	const value = DurationValue.fromSeconds(3600)
	expect(value.days).toEqual(0)

	value.lock()

	expect(() => {
		value.days = 1
	}).toThrow(ModificationNotAllowedError);
	expect(value.days).toEqual(0)

	value.unlock()

	value.days = 1
	expect(value.days).toEqual(1)
})

it('DurationValue should throw an error when setting negative days', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.days).toEqual(5)

	expect(() => {
		value.days = -10
	}).toThrow(TypeError, 'Days cannot be negative, use isNegative instead');
	expect(value.days).toEqual(5)
})

it('DurationValue should be lockable - hours', () => {
	const value = DurationValue.fromSeconds(3600)
	expect(value.hours).toEqual(1)

	value.lock()

	expect(() => {
		value.hours = 2
	}).toThrow(ModificationNotAllowedError);
	expect(value.hours).toEqual(1)

	value.unlock()

	value.hours = 2
	expect(value.hours).toEqual(2)
})

it('DurationValue should throw an error when setting negative hours', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.hours).toEqual(2)

	expect(() => {
		value.hours = -20
	}).toThrow(TypeError, 'Hours cannot be negative, use isNegative instead');
	expect(value.hours).toEqual(2)
})

it('DurationValue should be lockable - minutes', () => {
	const value = DurationValue.fromSeconds(1800)
	expect(value.minutes).toEqual(30)

	value.lock()

	expect(() => {
		value.minutes = 45
	}).toThrow(ModificationNotAllowedError);
	expect(value.minutes).toEqual(30)

	value.unlock()

	value.minutes = 45
	expect(value.minutes).toEqual(45)
})

it('DurationValue should throw an error when setting negative minutes', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.minutes).toEqual(15)

	expect(() => {
		value.minutes = -45
	}).toThrow(TypeError, 'Minutes cannot be negative, use isNegative instead');
	expect(value.minutes).toEqual(15)
})

it('DurationValue should be lockable - seconds', () => {
	const value = DurationValue.fromSeconds(25)
	expect(value.seconds).toEqual(25)

	value.lock()

	expect(() => {
		value.seconds = 45
	}).toThrow(ModificationNotAllowedError);
	expect(value.seconds).toEqual(25)

	value.unlock()

	value.seconds = 45
	expect(value.seconds).toEqual(45)
})

it('DurationValue should throw an error when setting negative seconds', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.seconds).toEqual(4)

	expect(() => {
		value.seconds = -45
	}).toThrow(TypeError, 'Seconds cannot be negative, use isNegative instead');
	expect(value.seconds).toEqual(4)
})

it('DurationValue should be lockable - isNegative', () => {
	const value = DurationValue.fromSeconds(-25)
	expect(value.isNegative).toEqual(true)

	value.lock()

	expect(() => {
		value.isNegative = false
	}).toThrow(ModificationNotAllowedError);
	expect(value.isNegative).toEqual(true)

	value.unlock()

	value.isNegative = false
	expect(value.isNegative).toEqual(false)
	expect(value.totalSeconds).toEqual(25)
})

it('DurationValue should be lockable - totalSeconds', () => {
	const value = DurationValue.fromSeconds(-3600)
	expect(value.totalSeconds).toEqual(-3600)
	expect(value.isNegative).toEqual(true)

	value.lock()

	expect(() => {
		value.totalSeconds = 1800
	}).toThrow(ModificationNotAllowedError);
	expect(value.totalSeconds).toEqual(-3600)

	value.unlock()

	value.totalSeconds = 1800
	expect(value.totalSeconds).toEqual(1800)
	expect(value.isNegative).toEqual(false)
})

it('DurationValue should compare different durations', () => {
	const duration1 = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: false
	})

	const duration2 = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	const duration3 = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(duration2.compare(duration3)).toEqual(0)
	expect(duration1.compare(duration2)).toEqual(1)
	expect(duration2.compare(duration1)).toEqual(-1)
})

it('DurationValue should be able to add durations - add positive value', () => {
	const duration1 = DurationValue.fromData({
		weeks: 0,
		days: 5,
		hours: 2,
		minutes: 0,
		seconds: 0,
		isNegative: false
	})

	const duration2 = DurationValue.fromData({
		weeks: 1,
		days: 2,
		hours: 8,
		minutes: 0,
		seconds: 0,
		isNegative: false
	})

	duration1.addDuration(duration2)

	expect(duration1.weeks).toEqual(2)
	expect(duration1.days).toEqual(0)
	expect(duration1.hours).toEqual(10)
	expect(duration1.minutes).toEqual(0)
	expect(duration1.seconds).toEqual(0)
	expect(duration1.isNegative).toEqual(false)
})

it('DurationValue should be able to add durations - add negative value', () => {
	const duration1 = DurationValue.fromData({
		weeks: 0,
		days: 5,
		hours: 2,
		minutes: 0,
		seconds: 0,
		isNegative: false
	})

	const duration2 = DurationValue.fromData({
		weeks: 1,
		days: 2,
		hours: 8,
		minutes: 0,
		seconds: 0,
		isNegative: true
	})

	duration1.addDuration(duration2)

	expect(duration1.weeks).toEqual(0)
	expect(duration1.days).toEqual(4)
	expect(duration1.hours).toEqual(6)
	expect(duration1.minutes).toEqual(0)
	expect(duration1.seconds).toEqual(0)
	expect(duration1.isNegative).toEqual(true)
})

it('DurationValue should be able to subtract durations - subtract positive value', () => {
	const duration1 = DurationValue.fromData({
		weeks: 0,
		days: 5,
		hours: 2,
		minutes: 0,
		seconds: 0,
		isNegative: false
	})

	const duration2 = DurationValue.fromData({
		weeks: 1,
		days: 2,
		hours: 8,
		minutes: 0,
		seconds: 0,
		isNegative: false
	})

	duration1.subtractDuration(duration2)

	expect(duration1.weeks).toEqual(0)
	expect(duration1.days).toEqual(4)
	expect(duration1.hours).toEqual(6)
	expect(duration1.minutes).toEqual(0)
	expect(duration1.seconds).toEqual(0)
	expect(duration1.isNegative).toEqual(true)
})

it('DurationValue should be able to subtract durations - subtract negative value', () => {
	const duration1 = DurationValue.fromData({
		weeks: 0,
		days: 5,
		hours: 2,
		minutes: 0,
		seconds: 0,
		isNegative: false
	})

	const duration2 = DurationValue.fromData({
		weeks: 1,
		days: 2,
		hours: 8,
		minutes: 0,
		seconds: 0,
		isNegative: true
	})

	duration1.subtractDuration(duration2)

	expect(duration1.weeks).toEqual(2)
	expect(duration1.days).toEqual(0)
	expect(duration1.hours).toEqual(10)
	expect(duration1.minutes).toEqual(0)
	expect(duration1.seconds).toEqual(0)
	expect(duration1.isNegative).toEqual(false)
})

it('DurationValue should be able to return the inner ICAL.JS object', () => {
	const value = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	expect(value.toICALJs().toString()).toEqual('-P8W5DT2H15M4S')
})

it('DurationValue should allow to clone the value', () => {
	const value1 = DurationValue.fromData({
		weeks: 8,
		days: 5,
		hours: 2,
		minutes: 15,
		seconds: 4,
		isNegative: true
	})

	const value2 = value1.clone()

	value1.weeks = 5
	expect(value1.weeks).toEqual(5)
	expect(value2.weeks).toEqual(8)
})
