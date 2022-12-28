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
 * Turns the entire string lowercase
 *
 * @param {string} str The string to turn lowercase
 * @return {string}
 */
export function lc(str) {
	return str.toLowerCase()
}

/**
 * Compares two strings, It is case-insensitive.
 *
 * @param {string} str1 String 1 to compare
 * @param {string} str2 String 2 to compare
 * @return {boolean}
 */
export function strcasecmp(str1, str2) {
	return uc(str1) === uc(str2)
}

/**
 * Turns the entire string uppercase
 *
 * @param {string} str The string to turn uppercase
 * @return {string}
 */
export function uc(str) {
	return str.toUpperCase()
}

/**
 * Capitalizes the string
 *
 * @param {string} str The string of which the first character will be turned uppercase
 * @return {string}
 */
export function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Makes sure that a string starts with a certain other string
 * This is mostly used in the attendeeProperty to assure the uri starts with mailto:
 *
 * @param {string} str The string to check for the prefix and prepend if necessary
 * @param {string} startWith The prefix to be added if necessary
 * @return {string}
 */
export function startStringWith(str, startWith) {
	if (!str.startsWith(startWith)) {
		str = startWith + str
	}

	return str
}
