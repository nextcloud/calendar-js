/**
 * @copyright Copyright (c) 2020 Georg Ehrke
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

import { parseICSAndGetAllOccurrencesBetween } from '../../../src';
import DateTimeValue from '../../../src/values/dateTimeValue.js';
jest.mock('../../../src/factories/dateFactory.js')

it('should properly handle complex recurrence-exceptions when querying events in time-range - no events expected', () => {
	const ics = getAsset('complex-recurrence-id-modifications')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 2, 25, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 3, 22, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	expect(iterator.next().done).toEqual(true)
});

it('should properly handle complex recurrence-exceptions when querying events in time-range', () => {
	const ics = getAsset('complex-recurrence-id-modifications')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 2, 25, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 3, 22, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	const event1 = iterator.next().value
	expect(event1.title).toEqual('TEST EX 1')
	expect(event1.startDate.jsDate.toISOString()).toEqual('2020-04-01T13:00:00.000Z')
	expect(event1.endDate.jsDate.toISOString()).toEqual('2020-04-01T14:00:00.000Z')

	const event2 = iterator.next().value
	expect(event2.title).toEqual('TEST')
	expect(event2.startDate.jsDate.toISOString()).toEqual('2020-03-29T13:00:00.000Z')
	expect(event2.endDate.jsDate.toISOString()).toEqual('2020-03-29T14:00:00.000Z')

	const event3 = iterator.next().value
	expect(event3.title).toEqual('TEST EX 3')
	expect(event3.startDate.jsDate.toISOString()).toEqual('2020-04-06T13:00:00.000Z')
	expect(event3.endDate.jsDate.toISOString()).toEqual('2020-04-06T14:00:00.000Z')

	const event4 = iterator.next().value
	expect(event4.title).toEqual('TEST')
	expect(event4.startDate.jsDate.toISOString()).toEqual('2020-04-19T13:00:00.000Z')
	expect(event4.endDate.jsDate.toISOString()).toEqual('2020-04-19T14:00:00.000Z')

	const event5 = iterator.next().value
	expect(event5.title).toEqual('TEST EX 5')
	expect(event5.startDate.jsDate.toISOString()).toEqual('2020-04-10T13:00:00.000Z')
	expect(event5.endDate.jsDate.toISOString()).toEqual('2020-04-10T14:00:00.000Z')

	expect(iterator.next().value).toEqual(undefined)
})

it('should not return an event outside time-range - before', () => {
	const ics = getAsset('very-long-event')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 0, 15, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 1, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	expect(iterator.next.value).toEqual(undefined)
})

it('should not return an event outside time-range - after', () => {
	const ics = getAsset('very-long-event')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 3, 15, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 4, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	expect(iterator.next.value).toEqual(undefined)
})

it('should not return an event outside time-range - covering all', () => {
	const ics = getAsset('very-long-event')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 1, 15, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 4, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	const event1 = iterator.next().value
	expect(event1.title).toEqual('TEST')

	expect(iterator.next.value).toEqual(undefined)
})

it('should not return an event outside time-range - covering start', () => {
	const ics = getAsset('very-long-event')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 1, 15, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 2, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	const event1 = iterator.next().value
	expect(event1.title).toEqual('TEST')

	expect(iterator.next.value).toEqual(undefined)
})

it('should not return an event outside time-range - covering end', () => {
	const ics = getAsset('very-long-event')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 2, 15, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2020, 4, 15, 23, 59, 59)))

	const iterator = parseICSAndGetAllOccurrencesBetween(ics, start, end)

	const event1 = iterator.next().value
	expect(event1.title).toEqual('TEST')

	expect(iterator.next.value).toEqual(undefined)
})
