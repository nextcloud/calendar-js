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
 * @type {Map<String, *>}
 */
const GLOBAL_CONFIG = new Map()

/**
 * Sets a new config key
 *
 * @param {String} key The config-key to set
 * @param {*} value The value to set for given config-key
 */
export function setConfig(key, value) {
	GLOBAL_CONFIG.set(key, value)
}

/**
 * Checks if a config for a certain key is present
 *
 * @param {String} key The config-key to check
 * @return {boolean}
 */
export function hasConfig(key) {
	return GLOBAL_CONFIG.has(key)
}

/**
 * gets value of a config key
 *
 * @param {String} key The config-key to get
 * @param {*} defaultValue Default value of config does not exist
 * @return {*}
 */
export function getConfig(key, defaultValue) {
	return GLOBAL_CONFIG.get(key) || defaultValue
}

/**
 * deletes a config key
 *
 * @param {String} key The config-key to delete
 */
export function deleteConfig(key) {
	GLOBAL_CONFIG.delete(key)
}
