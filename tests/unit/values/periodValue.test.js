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
import PeriodValue from '../../../src/values/periodValue.js';
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import DurationValue from '../../../src/values/durationValue.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('PeriodValue should be defined', () => {
	expect(PeriodValue).toBeDefined()
})

it('PeriodValue should provide a constructor from data with end', () => {
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 1, 18)), true)
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 2, 7)), true)
	const value = PeriodValue.fromDataWithEnd({
		start,
		end
	})

	expect(value.start.jsDate.toISOString()).toEqual('1997-01-01T18:00:00.000Z')
	expect(value.end.jsDate.toISOString()).toEqual('1997-01-02T07:00:00.000Z')
	expect(value.duration.totalSeconds).toEqual(46800)
})

it('PeriodValue should provide a constructor from data with duration', () => {
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 1, 18)), true)
	const duration = DurationValue.fromSeconds(19800)
	const value = PeriodValue.fromDataWithDuration({
		start,
		duration
	})

	expect(value.start.jsDate.toISOString()).toEqual('1997-01-01T18:00:00.000Z')
	expect(value.end.jsDate.toISOString()).toEqual('1997-01-01T23:30:00.000Z')
	expect(value.duration.totalSeconds).toEqual(19800)
})

it('PeriodValue should provide a constructor from ICAL.js', () => {
	// fromString does not expect the ical format but something different
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)

	expect(value.start.jsDate.toISOString()).toEqual('1997-01-01T18:00:00.000Z')
	expect(value.end.jsDate.toISOString()).toEqual('1997-01-01T23:30:00.000Z')
	expect(value.duration.totalSeconds).toEqual(19800)
})

it('PeriodValue should be lockable - start', () => {
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)
	const originalTime = value.start
	const differentTime = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 0, 1, 18)), true)

	expect(value.start.isLocked()).toEqual(false)
	value.start = differentTime
	expect(value.toICALJs().toICALString()).toEqual('20190101T180000Z/PT5H30M')

	value.lock()

	expect(() => {
		value.start = originalTime
	}).toThrow(ModificationNotAllowedError);
	expect(() => {
		value.start.year = 2018
	}).toThrow(ModificationNotAllowedError);
	expect(value.start).toEqual(differentTime)
	expect(value.start.year).toEqual(2019)

	value.unlock()

	value.start = originalTime
	expect(value.start).toEqual(originalTime)
	expect(value.start).not.toEqual(differentTime)

	value.start.year = 2018
	expect(value.start.year).toEqual(2018)
})

it('PeriodValue should be lockable - end', () => {
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 1, 18)), true)
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 2, 7)), true)
	const differentTime = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 0, 1, 18)), true)
	const value = PeriodValue.fromDataWithEnd({
		start,
		end
	})

	expect(value.start.isLocked()).toEqual(false)
	expect(value.end.isLocked()).toEqual(false)
	value.end = differentTime
	expect(value.toICALJs().toICALString()).toEqual('19970101T180000Z/20190101T180000Z')

	value.lock()

	expect(() => {
		value.end = end
	}).toThrow(ModificationNotAllowedError);
	expect(() => {
		value.end.year = 2018
	}).toThrow(ModificationNotAllowedError);
	expect(value.end).toEqual(differentTime)
	expect(value.end.year).toEqual(2019)
	//
	value.unlock()

	value.end = end
	expect(value.end).toEqual(end)
	expect(value.end).not.toEqual(differentTime)

	value.end.year = 2018
	expect(value.end.year).toEqual(2018)
	expect(value.duration.toICALJs().toICALString()).toEqual('P7670DT13H')
})

it('PeriodValue should be lockable - duration', () => {
	// fromString does not expect the ical format but something different
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)
	const originalDuration = value.duration
	const differentDuration = DurationValue.fromSeconds(60 * 60 * 24)

	expect(value.start.isLocked()).toEqual(false)
	expect(value.duration.isLocked()).toEqual(false)
	value.duration = differentDuration
	expect(value.toICALJs().toICALString()).toEqual('19970101T180000Z/P1D')

	value.lock()

	expect(() => {
		value.duration = originalDuration
	}).toThrow(ModificationNotAllowedError);
	expect(() => {
		value.duration.hours = 2
	}).toThrow(ModificationNotAllowedError);
	expect(value.duration).toEqual(differentDuration)
	expect(value.duration.hours).toEqual(0)
	//
	value.unlock()

	value.duration = originalDuration
	expect(value.duration).toEqual(originalDuration)
	expect(value.duration).not.toEqual(differentDuration)

	value.duration.hours = 2
	expect(value.duration.hours).toEqual(2)
	expect(value.duration.toICALJs().toICALString()).toEqual('PT2H30M')
})

it('PeriodValue should automatically lock end if value is already locked', () => {
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 1, 18)), true)
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 2, 7)), true)
	const value = PeriodValue.fromDataWithEnd({
		start,
		end
	})

	value.lock()

	expect(value.start.isLocked()).toEqual(true)
	expect(value.end.isLocked()).toEqual(true)
})

it('PeriodValue should automatically lock duration if value is already locked()', () => {
	// fromString does not expect the ical format but something different
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)

	value.lock()

	expect(value.start.isLocked()).toEqual(true)
	expect(value.duration.isLocked()).toEqual(true)
})

it('PeriodValue should lock duration after getting end', () => {
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)
	const originalDuration = value.duration

	expect(originalDuration.isLocked()).toEqual(false)

	const foo = value.end

	expect(originalDuration.isLocked()).toEqual(true)
})

it('PeriodValue should lock end after getting duration', () => {
	const value = PeriodValue.fromDataWithEnd({
		start: DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 1, 18)), true),
		end: DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 2, 7)), true)
	})
	const end = value.end

	expect(end.isLocked()).toEqual(false)

	const foo = value.duration

	expect(end.isLocked()).toEqual(true)

})

it('PeriodValue should remove duration if end is set', () => {
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 1, 18)), true)
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 2, 7)), true)
	const value = PeriodValue.fromDataWithEnd({
		start,
		end
	})

	expect(value.toICALJs().toICALString()).toEqual('19970101T180000Z/19970102T070000Z')

	value.duration = DurationValue.fromSeconds(60 * 60 * 24)

	expect(value.toICALJs().toICALString()).toEqual('19970101T180000Z/P1D')
})

it('PeriodValue should remove end if duration is set', () => {
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)

	expect(value.toICALJs().toICALString()).toEqual('19970101T180000Z/PT5H30M')

	value.end = DateTimeValue.fromJSDate(new Date(Date.UTC(1997, 0, 2, 7)), true)

	expect(value.toICALJs().toICALString()).toEqual('19970101T180000Z/19970102T070000Z')
})

it('PeriodValue should be able to return the inner ICAL.JS object', () => {
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)

	expect(value.toICALJs() instanceof ICAL.Period).toEqual(true)
})

it('PeriodValue should allow to clone the value', () => {
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value1 = PeriodValue.fromICALJs(icalValue)
	const value2 = value1.clone()

	value1.duration.addDuration(DurationValue.fromSeconds(60 * 60 * 24 * 2))

	expect(value1.toICALJs().toICALString()).toEqual('19970101T180000Z/P2DT5H30M')
	expect(value2.toICALJs().toICALString()).toEqual('19970101T180000Z/PT5H30M')
})
