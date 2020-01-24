/**
 * @copyright Copyright (c) 2020 Georg Ehrke
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

import { parseICSAndGetAllOccurrencesBetween } from '../../../src/index.js';
import DateTimeValue from '../../../src/values/dateTimeValue.js'

jest.mock('../../../src/factories/dateFactory.js')

it('parseICSAndGetAllOccurrencesBetween should work for events with DTSTART only', () => {
	// This test makes sure we don't break https://github.com/nextcloud/calendar/issues/1899 again
	// It was caused by an infinite loop of isAllDay and get endDate
	const ics = getAsset('dtstart-only-is-all-day')
	const start = DateTimeValue.fromJSDate(new Date(Date.UTC(2010, 0, 1, 0, 0, 0)))
	const end = DateTimeValue.fromJSDate(new Date(Date.UTC(2022, 11, 31, 23, 59, 59)))

	// Just verify that it doesn't error
	parseICSAndGetAllOccurrencesBetween(ics, start, end)
})
