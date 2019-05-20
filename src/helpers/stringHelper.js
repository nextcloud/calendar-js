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
 * Turns the entire string lowercase
 *
 * @param {String} str
 * @returns {string}
 */
export function lc(str) {
	return str.toLowerCase()
}

/**
 * Compares two strings, It is case-insensitive.
 *
 * @param {String} str1
 * @param {String} str2
 * @returns {Boolean}
 */
export function strcasecmp(str1, str2) {
	return uc(str1) === uc(str2)
}

/**
 * Turns the entire string uppercase
 *
 * @param {String} str
 * @returns {string}
 */
export function uc(str) {
	return str.toUpperCase()
}

/**
 * Capitalizes the string
 *
 * @param {String} str
 * @returns {string}
 */
export function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Makes sure that a string starts with a certain other string
 * This is mostly used in the attendeeProperty to assure the uri starts with mailto:
 *
 * @param {String} str
 * @param {String} startWith
 * @returns {string}
 */
export function startStringWith(str, startWith) {
	if (!str.startsWith(startWith)) {
		str = startWith + str
	}

	return str
}
