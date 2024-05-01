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

import ICAL from 'ical.js'
import UTCOffsetValue from '../../../src/values/utcOffsetValue.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('UTCOffsetValue should be defined', () => {
	expect(UTCOffsetValue).toBeDefined()
})

it('UTCOffsetValue should provide a constructor from data', () => {
	const value = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	expect(value.hours).toEqual(2)
	expect(value.minutes).toEqual(30)
	expect(value.factor).toEqual(-1)
})

it('UTCOffsetValue should provide a constructor from seconds', () => {
	const value = UTCOffsetValue.fromSeconds(-9000)

	expect(value.hours).toEqual(2)
	expect(value.minutes).toEqual(30)
	expect(value.factor).toEqual(-1)
})

it('UTCOffsetValue should provide a constructor from ICAL.JS', () => {
	const icalValue = new ICAL.UtcOffset({
		hours: 2,
		minutes: 30,
		factor: -1
	})
	const value = UTCOffsetValue.fromICALJs(icalValue)

	expect(value.hours).toEqual(2)
	expect(value.minutes).toEqual(30)
	expect(value.factor).toEqual(-1)
})

it('UTCOffsetValue should be lockable - hours', () => {
	const value = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	value.hours = 3
	expect(value.hours).toEqual(3)

	value.lock()

	expect(() => {
		value.hours = 4
	}).toThrow(ModificationNotAllowedError);
	expect(value.hours).toEqual(3)

	value.unlock()

	value.hours = 4
	expect(value.hours).toEqual(4)
})

it('UTCOffsetValue should be lockable - minutes', () => {
	const value = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	value.minutes = 45
	expect(value.minutes).toEqual(45)

	value.lock()

	expect(() => {
		value.minutes = 15
	}).toThrow(ModificationNotAllowedError);
	expect(value.minutes).toEqual(45)

	value.unlock()

	value.minutes = 15
	expect(value.minutes).toEqual(15)
})

it('UTCOffsetValue should be lockable - factor', () => {
	const value = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	value.factor = 1
	expect(value.factor).toEqual(1)

	value.lock()

	expect(() => {
		value.factor = -1
	}).toThrow(ModificationNotAllowedError);
	expect(value.factor).toEqual(1)

	value.unlock()

	value.factor = -1
	expect(value.factor).toEqual(-1)
})

it('UTCOffsetValue should limit factor to 1 and -1', () => {
	const value = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	value.factor = 1
	expect(value.factor).toEqual(1)

	value.factor = -1
	expect(value.factor).toEqual(-1)

	expect(() => {
		value.factor = 0
	}).toThrow(TypeError, 'Factor may only be set to 1 or -1');
	expect(value.factor).toEqual(-1)

	expect(() => {
		value.factor = 99
	}).toThrow(TypeError, 'Factor may only be set to 1 or -1');
	expect(value.factor).toEqual(-1)

	expect(() => {
		value.factor = -99
	}).toThrow(TypeError, 'Factor may only be set to 1 or -1');
	expect(value.factor).toEqual(-1)
})

it('UTCOffsetValue should be lockable - totalSeconds', () => {
	const value = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	expect(value.totalSeconds).toEqual(-9000)

	value.lock()

	expect(() => {
		value.totalSeconds = 3600
	}).toThrow(ModificationNotAllowedError);
	expect(value.totalSeconds).toEqual(-9000)

	value.unlock()

	value.totalSeconds = 3600
	expect(value.totalSeconds).toEqual(3600)
	expect(value.hours).toEqual(1)
	expect(value.minutes).toEqual(0)
	expect(value.factor).toEqual(1)
})

it('UTCOffsetValue should compare to other UTCOffsetValues', () => {
	const value1 = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	const value2 = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 15,
		factor: -1
	})

	expect(value1.compare(value2)).toEqual(-1)
})

it('UTCOffsetValue should be able to return the inner ICAL.JS object', () => {
	const value1 = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	expect(value1.toICALJs().toString()).toEqual('-02:30')
})

it('UTCOffsetValue should allow to clone the value', () => {
	const value1 = UTCOffsetValue.fromData({
		hours: 2,
		minutes: 30,
		factor: -1
	})

	const value2 = value1.clone()

	value1.hours = 6
	expect(value1.hours).toEqual(6)
	expect(value2.hours).toEqual(2)
})
