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
import ICalendarAddMissingUIDRepairStep
	from '../../../../../src/parsers/repairsteps/icalendar/icalendarAddMissingUIDRepairStep.js';
import AbstractRepairStep from '../../../../../src/parsers/repairsteps/abstractRepairStep.js';

jest.mock('../../../../../src/helpers/cryptoHelper.js')

it('The repair step should inherit from AbstractRepairStep', () => {
	expect((new ICalendarAddMissingUIDRepairStep() instanceof AbstractRepairStep)).toEqual(true)
})

it('The repair step should have a priority', () => {
	expect(ICalendarAddMissingUIDRepairStep.priority()).toEqual(0)
})

it('The repair step should repair broken calendar data', () => {
	const repairStep = new ICalendarAddMissingUIDRepairStep()
	const brokenICS = getAsset('missing-uid')
	const fixedICS = getAsset('missing-uid-sanitized')

	expect(repairStep.repair(brokenICS).replace(/(\r\n|\n|\r)/gm,"\r\n")).toEqual(fixedICS.replace(/(\r\n|\n|\r)/gm,"\r\n"))
})

it('The repair step should not change valid calendar data', () => {
	const repairStep = new ICalendarAddMissingUIDRepairStep()
	const ics = getAsset('simple-date-time-europe-berlin-dtstart-dtend')

	expect(repairStep.repair(ics)).toEqual(ics)
})
