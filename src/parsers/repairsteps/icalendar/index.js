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
import ICalendarAddMissingUIDRepairStep from './icalendarAddMissingUIDRepairStep.js'
import ICalendarAddMissingValueDateDoubleColonRepairStep from './icalendarAddMissingValueDateDoubleColonRepairStep.js'
import ICalendarAddMissingValueDateRepairStep from './icalendarAddMissingValueDateRepairStep.js'
import ICalendarEmptyTriggerRepairStep from './icalendarEmptyTriggerRepairStep.js'
import ICalendarIllegalCreatedRepairStep from './icalendarIllegalCreatedRepairStep.js'
import ICalendarMultipleVCalendarBlocksRepairStep from './icalendarMultipleVCalendarBlocksRepairStep.js'
import ICalendarRemoveXNCGroupIdRepairStep from './icalendarRemoveXNCGroupIdRepairStep.js'
import ICalendarRemoveEmptyRDate from './icalendarRemoveEmptyRDate.js'

/**
 * Get an iterator over all repair steps for iCalendar documents
 */
export function * getRepairSteps() {
	yield ICalendarAddMissingUIDRepairStep
	yield ICalendarAddMissingValueDateDoubleColonRepairStep
	yield ICalendarAddMissingValueDateRepairStep
	yield ICalendarEmptyTriggerRepairStep
	yield ICalendarIllegalCreatedRepairStep
	yield ICalendarMultipleVCalendarBlocksRepairStep
	yield ICalendarRemoveXNCGroupIdRepairStep
	yield ICalendarRemoveEmptyRDate
}
