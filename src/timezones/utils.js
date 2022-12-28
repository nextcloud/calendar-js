/**
 * @copyright Copyright (c) 2021 Christoph Wurst
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
 *
 * @param {string[]} timezoneList List of Olsen timezones
 * @param {Array} additionalTimezones List of additional timezones
 * @param {String} globalTimezoneName The localized name of the "Global" timezones
 * @return {[]}
 */
export function getSortedTimezoneList(timezoneList = [], additionalTimezones = [], globalTimezoneName = 'Global') {
	const sortedByContinent = {}
	const sortedList = []

	for (const timezoneId of timezoneList) {
		const components = timezoneId.split('/')
		let [continent, name] = [components.shift(), components.join('/')]
		if (!name) {
			name = continent
			continent = globalTimezoneName
		}

		sortedByContinent[continent] = sortedByContinent[continent] || {
			continent,
			regions: [],
		}

		sortedByContinent[continent].regions.push({
			label: getReadableTimezoneName(name),
			cities: [],
			timezoneId,
		})
	}

	for (const additionalTimezone of additionalTimezones) {
		const { continent, label, timezoneId } = additionalTimezone

		sortedByContinent[continent] = sortedByContinent[continent] || {
			continent,
			regions: [],
		}

		sortedByContinent[continent].regions.push({
			label,
			cities: [],
			timezoneId,
		})
	}

	for (const continent in sortedByContinent) {
		if (!Object.prototype.hasOwnProperty.call(sortedByContinent, continent)) {
			continue
		}

		sortedByContinent[continent].regions.sort((a, b) => {
			if (a.label < b.label) {
				return -1
			}

			return 1
		})
		sortedList.push(sortedByContinent[continent])
	}

	// Sort continents by name
	sortedList.sort((a, b) => {
		if (a.continent < b.continent) {
			return -1
		}

		return 1
	})

	return sortedList
}

/**
 * Get human-readable name for timezoneId
 *
 * @param {string} timezoneId TimezoneId to turn human-readable
 * @return {string}
 */
export function getReadableTimezoneName(timezoneId) {
	return timezoneId
		.split('_')
		.join(' ')
		.replace('St ', 'St. ')
		.split('/')
		.join(' - ')
}
