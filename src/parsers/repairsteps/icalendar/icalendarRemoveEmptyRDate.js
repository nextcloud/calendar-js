/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Christoph Timmermann <christoph.timmermann98@gmail.com>
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
import AbstractRepairStep from '../abstractRepairStep.js'

/**
 * @class ICalendarRemoveEmptyRDate
 */
export default class ICalendarRemoveEmptyRDate extends AbstractRepairStep {

	/**
	 * Please see the corresponding test file for an example of broken calendar-data
	 *
	 * @inheritDoc
	 */
	repair(ics) {
		return ics
			.replace(/RDATE:\n/gm, (match, propName, parameters, date) => {
				return '';
			})
	}

}
