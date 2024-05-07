/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
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

import ICAL from 'ical.js'
import Timezone from './timezone.js'
import tzData from '../../resources/timezones/zones.json'

/**
 * @class TimezoneManager
 */
class TimezoneManager {

	/**
	 * Constructor
	 */
	constructor() {
		/**
		 * Map of aliases
		 * Alias name => timezoneId
		 *
		 * @type {Map<string, string>}
		 */
		this._aliases = new Map()

		/**
		 * List of aliases that were registered while their targets were missing
		 * [[aliasName, timezoneId], ...]
		 *
		 * @type {string[][]}
		 */
		this._pendingAliases = []

		/**
		 * Map of Timezones
		 * timezoneId => Timezone
		 *
		 * @type {Map<string, Timezone>}
		 * @private
		 */
		this._timezones = new Map()
	}

	/**
	 * Gets a timezone for the given id
	 *
	 * @param {string} timezoneId The id of the timezone
	 * @return {Timezone|null}
	 */
	getTimezoneForId(timezoneId) {
		return this._getTimezoneForIdRec(timezoneId, 0)
	}

	_getTimezoneForIdRec(timezoneId, level) {
		if (this._timezones.has(timezoneId)) {
			return this._timezones.get(timezoneId)
		}

		if (level >= 20) {
			// too much recursion
			console.error('TimezoneManager.getTimezoneForIdRec() exceeds recursion limits')
			return null
		}

		if (this._aliases.has(timezoneId)) {
			const resolvedTimezoneId = this._aliases.get(timezoneId)
			// can be a recursive alias:
			return this._getTimezoneForIdRec(resolvedTimezoneId, level + 1)
		}

		return null
	}

	/**
	 * Checks if there is a timezone for the given id stored in this manager
	 *
	 * @param {string} timezoneId The id of the timezone
	 * @return {boolean}
	 */
	hasTimezoneForId(timezoneId) {
		return this._timezones.has(timezoneId) || this._aliases.has(timezoneId)
	}

	/**
	 * Checks if the given timezone id is an alias
	 *
	 * @param {string} timezoneId The id of the timezone
	 * @return {boolean}
	 */
	isAlias(timezoneId) {
		return !this._timezones.has(timezoneId) && this._aliases.has(timezoneId)
	}

	/**
	 * Lists all timezones
	 *
	 * @param {boolean=} includeAliases Whether or not to include aliases
	 * @return {string[]}
	 */
	listAllTimezones(includeAliases = false) {
		const timezones = Array.from(this._timezones.keys())

		if (includeAliases) {
			return timezones.concat(Array.from(this._aliases.keys()))
		}

		return timezones
	}

	/**
	 * Registers a timezone
	 *
	 * @param {Timezone} timezone The timezone-object to register
	 */
	registerTimezone(timezone) {
		this._timezones.set(timezone.timezoneId, timezone)
		ICAL.TimezoneService.register(timezone.timezoneId, timezone.toICALTimezone())

		// Try to resolve pending aliases and remove them from the list
		this._pendingAliases = this._pendingAliases.filter(([aliasName, timezoneId]) => {
			if (timezoneId !== timezone.timezoneId) {
				return true
			}

			ICAL.TimezoneService.register(aliasName, timezone.toICALTimezone())
			return false
		})
	}

	registerDefaultTimezones() {
		console.debug(`@nextcloud/calendar-js app is using version ${tzData.version} of the timezone database`)

		for (const tzid in tzData.zones) {
			if (Object.prototype.hasOwnProperty.call(tzData.zones, [tzid])) {
				const ics = [
					'BEGIN:VTIMEZONE',
					'TZID:' + tzid,
					...tzData.zones[tzid].ics,
					'END:VTIMEZONE',
				].join('\r\n')
				this.registerTimezoneFromICS(tzid, ics)
			}
		}

		for (const tzid in tzData.aliases) {
			if (Object.prototype.hasOwnProperty.call(tzData.aliases, [tzid])) {
				this.registerAlias(tzid, tzData.aliases[tzid].aliasTo)
			}
		}
	}

	/**
	 * Registers a timezone based on ics data
	 *
	 * @param {string} timezoneId The id of the timezone
	 * @param {string} ics The iCalendar timezone definition
	 */
	registerTimezoneFromICS(timezoneId, ics) {
		const timezone = new Timezone(timezoneId, ics)
		this.registerTimezone(timezone)
	}

	/**
	 * Registers a new timezone-alias
	 *
	 * @param {string} aliasName The timezone-id of the alias
	 * @param {string} timezoneId The timezone-id to resolve the alias to
	 */
	registerAlias(aliasName, timezoneId) {
		this._aliases.set(aliasName, timezoneId)

		const resolvedTimezone = this.getTimezoneForId(timezoneId)
		if (!resolvedTimezone) {
			this._pendingAliases.push([aliasName, timezoneId])
			return
		}
		ICAL.TimezoneService.register(aliasName, resolvedTimezone.toICALTimezone())
	}

	/**
	 * Unregisters a timezone
	 *
	 * @param {string} timezoneId Unregisters a timezone by Id
	 */
	unregisterTimezones(timezoneId) {
		this._timezones.delete(timezoneId)
		ICAL.TimezoneService.remove(timezoneId)
	}

	/**
	 * Unregisters a timezone-alias
	 *
	 * @param {string} aliasName The alias to unregister
	 */
	unregisterAlias(aliasName) {
		this._aliases.delete(aliasName)
		this._pendingAliases = this._pendingAliases
			.filter(([pendingAliasName]) => pendingAliasName !== aliasName)
		ICAL.TimezoneService.remove(aliasName)
	}

	/**
	 * Clear all timezones
	 */
	clearAllTimezones() {
		this._aliases = new Map()
		this._pendingAliases = []
		this._timezones = new Map()

		ICAL.TimezoneService.reset()

		timezoneManager.registerTimezone(Timezone.utc)
		timezoneManager.registerTimezone(Timezone.floating)
		timezoneManager.registerAlias('GMT', Timezone.utc.timezoneId)
		timezoneManager.registerAlias('Z', Timezone.utc.timezoneId)
	}

}

const timezoneManager = new TimezoneManager()
timezoneManager.clearAllTimezones()

/**
 * Gets the default instance of the timezone manager
 *
 * @return {TimezoneManager}
 */
export function getTimezoneManager() {
	return timezoneManager
}

/**
 *
 * @param {string} tzName Name of the timezone to check
 * @return {boolean}
 */
export function isOlsonTimezone(tzName) {
	const hasSlash = tzName.indexOf('/') !== -1
	const hasSpace = tzName.indexOf(' ') !== -1
	const startsWithETC = tzName.startsWith('Etc')
	const startsWithUS = tzName.startsWith('US/')

	return hasSlash && !hasSpace && !startsWithETC && !startsWithUS
}
