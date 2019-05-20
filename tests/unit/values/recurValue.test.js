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
import RecurValue from '../../../src/values/recurValue.js';
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('RecurValue should be defined', () => {
	expect(RecurValue).toBeDefined()
})

it('RecurValue should provide a constructor from data', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value.interval).toEqual(2)
	expect(value.weekStart).toEqual(3)
	expect(value.count).toEqual(5)
	expect(value.frequency).toEqual('YEARLY')
	expect(value.getComponent('BYDAY')).toEqual(['TU'])
	expect(value.getComponent('BYMONTH')).toEqual(['1'])
})

it('RecurValue should provide a constructor from data - including until', () => {
	const until = DateTimeValue.fromJSDate(new Date(2019, 0, 1, 15, 20, 30))
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		until,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value.interval).toEqual(2)
	expect(value.weekStart).toEqual(3)
	expect(value.until).toEqual(until)
	expect(value.frequency).toEqual('YEARLY')
	expect(value.getComponent('BYDAY')).toEqual(['TU'])
	expect(value.getComponent('BYMONTH')).toEqual(['1'])
})

it('RecurValue should provide a constructor from ICAL.js', () => {
	const icalValue = ICAL.Recur.fromData({
		interval: 2,
		wkst: 3,
		until: ICAL.Time.fromJSDate(new Date(2019, 0, 1, 15, 20, 30)),
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})
	const value = RecurValue.fromICALJs(icalValue)

	expect(value.interval).toEqual(2)
	expect(value.weekStart).toEqual(3)
	expect(value.frequency).toEqual('YEARLY')
	expect(value.getComponent('BYDAY')).toEqual(['TU'])
	expect(value.getComponent('BYMONTH')).toEqual(['1'])
	expect(value.until.toICALJs().toICALString()).toEqual('20190101T152030')
})

it('RecurValue should be lockable - interval', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})
	expect(value.interval).toEqual(2)

	value.interval = 3
	expect(value.interval).toEqual(3)

	value.lock()

	expect(() => {
		value.interval = 4
	}).toThrow(ModificationNotAllowedError);
	expect(value.interval).toEqual(3)

	value.unlock()

	value.interval = 5
	expect(value.interval).toEqual(5)

	expect(value.toICALJs().toString()).toEqual('FREQ=YEARLY;COUNT=5;INTERVAL=5;BYDAY=TU;BYMONTH=1;WKST=TU')
})

it('RecurValue should be lockable - weekStart', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})
	expect(value.weekStart).toEqual(3)

	value.weekStart = 4
	expect(value.weekStart).toEqual(4)

	value.lock()

	expect(() => {
		value.weekStart = 1
	}).toThrow(ModificationNotAllowedError);
	expect(value.weekStart).toEqual(4)

	value.unlock()

	value.weekStart = 2
	expect(value.weekStart).toEqual(2)

	expect(value.toICALJs().toString()).toEqual('FREQ=YEARLY;COUNT=5;INTERVAL=2;BYDAY=TU;BYMONTH=1')

	expect(() => {
		value.weekStart = 0
	}).toThrow(TypeError, 'Weekstart out of range');
	expect(value.weekStart).toEqual(2)
	expect(() => {
		value.weekStart = 8
	}).toThrow(TypeError, 'Weekstart out of range');
	expect(value.weekStart).toEqual(2)
})

it('RecurValue should be lockable - until', () => {
	const until = DateTimeValue.fromJSDate(new Date(2019, 0, 1, 15, 20, 30))
	const until2 = DateTimeValue.fromJSDate(new Date(2019, 0, 2, 15, 20, 30))
	const until3 = DateTimeValue.fromJSDate(new Date(2019, 0, 3, 15, 20, 30))
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		until,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value.until).toEqual(until)

	value.until = until2
	expect(value.until).toEqual(until2)
	expect(until.isLocked()).toEqual(true)

	value.lock()

	expect(() => {
		value.until = until3
	}).toThrow(ModificationNotAllowedError);
	expect(value.until).toEqual(until2)
	expect(value.until.isLocked()).toEqual(true)

	value.unlock()
	expect(value.until.isLocked()).toEqual(false)

	value.until = until3
	expect(value.until).toEqual(until3)
})

it('RecurValue should lock and remove until when setting count', () => {
	const until = DateTimeValue.fromJSDate(new Date(2019, 0, 1, 15, 20, 30))
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		until,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value.until).toEqual(until)

	value.count = 5

	expect(value.count).toEqual(5)
	expect(value.until).toEqual(null)
	expect(until.isLocked()).toEqual(true)
})

it('RecurValue should be lockable  - count', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})
	expect(value.count).toEqual(5)

	value.count = 6
	expect(value.count).toEqual(6)

	value.lock()

	expect(() => {
		value.count = 7
	}).toThrow(ModificationNotAllowedError);
	expect(value.count).toEqual(6)

	value.unlock()

	value.count = 8
	expect(value.count).toEqual(8)

	expect(value.toICALJs().toString()).toEqual('FREQ=YEARLY;COUNT=8;INTERVAL=2;BYDAY=TU;BYMONTH=1;WKST=TU')
})

it('RecurValue should be lockable  - frequency', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})
	expect(value.frequency).toEqual('YEARLY')

	value.frequency = 'MONTHLY'
	expect(value.frequency).toEqual('MONTHLY')

	value.lock()

	expect(() => {
		value.frequency = 'WEEKLY'
	}).toThrow(ModificationNotAllowedError);
	expect(value.frequency).toEqual('MONTHLY')

	value.unlock()

	value.frequency = 'DAILY'
	expect(value.frequency).toEqual('DAILY')

	expect(value.toICALJs().toString()).toEqual('FREQ=DAILY;COUNT=5;INTERVAL=2;BYDAY=TU;BYMONTH=1;WKST=TU')
	expect(() => {
		value.frequency = 'BIDAILY'
	}).toThrow(TypeError, 'Unknown frequency');
	expect(value.frequency).toEqual('DAILY')
	expect(() => {
		value.frequency = 'BIWEEKLY'
	}).toThrow(TypeError, 'Unknown frequency');
	expect(value.frequency).toEqual('DAILY')
})

it('RecurValue should be able to add a single new component', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	value.addComponent('BYDAY', 'FR')
	expect(value.getComponent('BYDAY')).toEqual(["TU", "FR"])
})

it('RecurValue should be able to set components altogether', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	value.setComponent('BYDAY', ['MO', 'TU'])
	expect(value.getComponent('BYDAY')).toEqual(["MO", "TU"])
})

it('RecurValue should be able to remove a component', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	value.removeComponent('BYDAY')
	expect(value.toICALJs().toString()).toEqual('FREQ=YEARLY;COUNT=5;INTERVAL=2;BYMONTH=1;WKST=TU')
})

it('RecurValue should not modify _until when setting a count if not set', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	value.count = 5
	expect(value.count).toEqual(5)
	expect(value.until).toEqual(null)
})

it('RecurValue should not modify _until when setting until if not set', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	const until = DateTimeValue.fromJSDate(new Date(2019, 0, 1, 15, 20, 30))
	value.until = until
	expect(value.until).toEqual(until)
})

it('RecurValue should provide a method to check if this recurrence rule is limited by count', () => {
	const value1 = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	const until = DateTimeValue.fromJSDate(new Date(2019, 0, 1, 15, 20, 30))
	const value2 = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		until,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	const value3 = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value1.isByCount()).toEqual(false)
	expect(value2.isByCount()).toEqual(false)
	expect(value3.isByCount()).toEqual(true)
})

it('RecurValue should provide a method to check if this recurrence rule is finite', () => {
	const value1 = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	const until = DateTimeValue.fromJSDate(new Date(2019, 0, 1, 15, 20, 30))
	const value2 = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		until,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	const value3 = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value1.isFinite()).toEqual(false)
	expect(value2.isFinite()).toEqual(true)
	expect(value3.isFinite()).toEqual(true)

})

it('RecurValue should provide a method to check if the given rule is valid', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value.isRuleValid()).toEqual(true)

	// TODO - fix me
})

it('RecurValue should be able to return the inner ICAL.JS object', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	expect(value.toICALJs() instanceof ICAL.Recur).toEqual(true)
})

it('RecurValue should allow to clone the value', () => {
	const value = RecurValue.fromData({
		interval: 2,
		wkst: 3,
		count: 5,
		freq: 'YEARLY',
		parts: {
			'BYDAY': ['TU'],
			'BYMONTH': ['1']
		}
	})

	const value2 = value.clone()
	value.interval = 99

	expect(value.interval).toEqual(99)
	expect(value2.interval).toEqual(2)
})
