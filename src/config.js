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

/**
 * @type {Map<String, *>}
 */
const global_config = new Map()

/**
 * Sets a new config key
 *
 * @param {String} key
 * @param {*} value
 */
export function setConfig(key, value) {
	global_config.set(key, value)
}

/**
 * Checks if a config for a certain key is present
 *
 * @param {String} key
 * @returns {boolean}
 */
export function hasConfig(key) {
	return global_config.has(key)
}

/**
 * gets value of a config key
 *
 * @param {String} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getConfig(key, defaultValue) {
	return global_config.get(key) || defaultValue
}

/**
 * deletes a config key
 *
 * @param {String} key
 */
export function deleteConfig(key) {
	global_config.delete(key)
}
