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
import TimezoneAdapter from '../../../src/timezones/timezoneAdapter.js';

it('should provide a has method', () => {
	const timezoneManager = {
		'hasTimezoneForId': jest.fn()
			.mockReturnValue(true)
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false)
	}

	const adapter = new TimezoneAdapter(timezoneManager)
	expect(adapter.has('foo1')).toEqual(true)
	expect(adapter.has('foo2')).toEqual(false)
	expect(adapter.has('foo3')).toEqual(true)
	expect(adapter.has('foo4')).toEqual(true)

	expect(timezoneManager.hasTimezoneForId.mock.calls.length).toEqual(4)
	expect(timezoneManager.hasTimezoneForId.mock.calls[0]).toEqual(['foo1'])
	expect(timezoneManager.hasTimezoneForId.mock.calls[1]).toEqual(['foo2'])
	expect(timezoneManager.hasTimezoneForId.mock.calls[2]).toEqual(['foo3'])
	expect(timezoneManager.hasTimezoneForId.mock.calls[3]).toEqual(['foo4'])
})

it('should provide a get method', () => {
	const timezone1 = {
		toICALTimezone: jest.fn().mockReturnValueOnce('timezone1')
	}
	const timezone3 = {
		toICALTimezone: jest.fn().mockReturnValueOnce('timezone3')
	}

	const timezoneManager = {
		'getTimezoneForId': jest.fn()
			.mockReturnValueOnce(timezone1)
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(timezone3)
	}

	const adapter = new TimezoneAdapter(timezoneManager)
	const receivedTimezone1 = adapter.get('foo1')
	const receivedTimezone2 = adapter.get('foo2')
	const receivedTimezone3 = adapter.get('foo3')

	expect(timezoneManager.getTimezoneForId.mock.calls.length).toEqual(3)
	expect(timezoneManager.getTimezoneForId.mock.calls[0]).toEqual(['foo1'])
	expect(timezoneManager.getTimezoneForId.mock.calls[1]).toEqual(['foo2'])
	expect(timezoneManager.getTimezoneForId.mock.calls[2]).toEqual(['foo3'])

	expect(receivedTimezone1).toEqual('timezone1')
	expect(receivedTimezone2).toEqual(undefined)
	expect(receivedTimezone3).toEqual('timezone3')

	expect(timezone1.toICALTimezone.mock.calls.length).toEqual(1)
	expect(timezone1.toICALTimezone.mock.calls[0]).toEqual([])

	expect(timezone3.toICALTimezone.mock.calls.length).toEqual(1)
	expect(timezone3.toICALTimezone.mock.calls[0]).toEqual([])
})

it('should throw an exception on register', () => {
	const adapter = new TimezoneAdapter({})

	expect(() => {
		adapter.register()
	}).toThrow(TypeError, 'Not allowed to register new timezone')
})

it('should throw an exception on remove', () => {
	const adapter = new TimezoneAdapter({})

	expect(() => {
		adapter.remove()
	}).toThrow(TypeError, 'Not allowed to remove timezone')
})

it('should throw an exception on reset', () => {
	const adapter = new TimezoneAdapter({})

	expect(() => {
		adapter.reset()
	}).toThrow(TypeError, 'Not allowed to reset TimezoneService')
})
