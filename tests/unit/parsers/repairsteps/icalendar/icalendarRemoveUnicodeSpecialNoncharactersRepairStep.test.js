/**
 * @copyright Copyright (c) 2019 Richard Steinmetz <richard@steinmetz.cloud>
 *
 * @author 2024 Richard Steinmetz <richard@steinmetz.cloud>
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

import AbstractRepairStep from '../../../../../src/parsers/repairsteps/abstractRepairStep.js';
import ICalendarRemoveUnicodeSpecialNoncharactersRepairStep
	from '../../../../../src/parsers/repairsteps/icalendar/icalendarRemoveUnicodeSpecialNoncharactersRepairStep.js';

it('The repair step should inherit from AbstractRepairStep', () => {
	expect((new ICalendarRemoveUnicodeSpecialNoncharactersRepairStep() instanceof AbstractRepairStep)).toEqual(true)
})

it('The repair step should have a priority', () => {
	expect(ICalendarRemoveUnicodeSpecialNoncharactersRepairStep.priority()).toEqual(0)
})

it('The repair step should remove U+FFFE non-characters', () => {
	const repairStep = new ICalendarRemoveUnicodeSpecialNoncharactersRepairStep()
	const brokenICS = getAsset('unicode-non-character-fffe-before')
	const fixedICS = getAsset('unicode-non-character-fffe-after')

	expect(repairStep.repair(brokenICS)).toEqual(fixedICS)
})

it('The repair step should remove U+FFFF non-characters', () => {
	const repairStep = new ICalendarRemoveUnicodeSpecialNoncharactersRepairStep()
	const brokenICS = getAsset('unicode-non-character-ffff-before')
	const fixedICS = getAsset('unicode-non-character-ffff-after')

	expect(repairStep.repair(brokenICS)).toEqual(fixedICS)
})

it('The repair step should not change valid calendar data', () => {
	const repairStep = new ICalendarRemoveUnicodeSpecialNoncharactersRepairStep()
	const ics = getAsset('simple-date-time-europe-berlin-dtstart-dtend')

	expect(repairStep.repair(ics)).toEqual(ics)
})
