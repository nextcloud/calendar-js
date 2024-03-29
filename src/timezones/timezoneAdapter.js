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

/**
 * @class TimezoneAdapter
 * @classdesc Connecting ICAL.TimezoneService with our TimezoneManager
 */
export default class TimezoneAdapter {

	/**
	 * Constructor
	 *
	 * @param {TimezoneManager} timezoneManager The timezone-manager to wrap
	 */
	constructor(timezoneManager) {

		/**
		 * TimezoneManager object
		 *
		 * @type {TimezoneManager}
		 * @private
		 */
		this._timezoneManager = timezoneManager
	}

	/**
	 * @param {string} timezoneId The id of the timezone
	 * @return {boolean}
	 */
	has(timezoneId) {
		return this._timezoneManager.hasTimezoneForId(timezoneId)
	}

	/**
	 * @param {string} timezoneId The id of the timezone
	 * @return {ICAL.Timezone|undefined}
	 */
	get(timezoneId) {
		const timezone = this._timezoneManager.getTimezoneForId(timezoneId)
		if (!timezone) {
			return undefined
		}

		return timezone.toICALTimezone()
	}

	/**
	 * @throws TypeError
	 */
	register() {
		throw new TypeError('Not allowed to register new timezone')
	}

	/**
	 * @throws TypeError
	 */
	remove() {
		throw new TypeError('Not allowed to remove timezone')
	}

	/**
	 * @throws TypeError
	 */
	reset() {
		throw new TypeError('Not allowed to reset TimezoneService')
	}

}
