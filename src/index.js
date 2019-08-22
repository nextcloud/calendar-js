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
import { getParserManager } from './parsers/parserManager.js'

import TimezoneAdapter from './timezones/timezoneAdapter.js'
import { getTimezoneManager } from './timezones/timezoneManager.js'
export { setConfig } from './config.js'
export { getParserManager }
export { getTimezoneManager, isOlsonTimezone } from './timezones/timezoneManager.js'
if (!(ICAL.TimezoneService instanceof TimezoneAdapter)) {
	ICAL.TimezoneService = new TimezoneAdapter(getTimezoneManager())
}

/**
 * parses a single ICS and returns an iterator over all occurrences
 * in a given timeframe
 *
 * @param {String} ics
 * @param {DateTimeValue} start
 * @param {DateTimeValue} end
 * @returns {IterableIterator<AbstractRecurringComponent>}
 */
export function * parseICSAndGetAllOccurrencesBetween(ics, start, end) {
	const parserManager = getParserManager()
	const icsParser = parserManager.getParserForFileType('text/calendar')
	icsParser.parse(ics)

	const objectIterator = icsParser.getItemIterator()
	const calendarComp = objectIterator.next().value
	if (calendarComp === undefined) {
		return
	}

	const vObjectIterator = calendarComp.getVObjectIterator()
	const firstVObject = vObjectIterator.next().value
	if (firstVObject === undefined) {
		return
	}

	yield * firstVObject.recurrenceManager.getAllOccurrencesBetweenIterator(start, end)
}
