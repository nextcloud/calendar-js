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
import AbstractValue from './abstractValue.js'
import ICAL from 'ical.js'

/**
 * @class BinaryValue
 * @classdesc Wrapper for ICAL.Binary
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.1.3
 * @url https://github.com/mozilla-comm/ical.js/blob/master/lib/ical/binary.js
 */
export default class BinaryValue extends AbstractValue {

	/**
	 * Sets the raw b64 encoded value
	 *
	 * @return {String}
	 */
	get rawValue() {
		return this._innerValue.value
	}

	/**
	 * Gets the raw b64 encoded value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param {String} value - The new raw value
	 */
	set rawValue(value) {
		this._modifyContent()
		this._innerValue.value = value
	}

	/**
	 * Gets the decoded value
	 *
	 * @return {String}
	 */
	get value() {
		return this._innerValue.decodeValue()
	}

	/**
	 * Sets the decoded Value
	 *
	 * @throws {ModificationNotAllowedError} if value is locked for modification
	 * @param  {String} decodedValue - The new encoded value
	 */
	set value(decodedValue) {
		this._modifyContent()
		this._innerValue.setEncodedValue(decodedValue)
	}

	/**
	 * clones this value
	 *
	 * @return {BinaryValue}
	 */
	clone() {
		return BinaryValue.fromRawValue(this._innerValue.value)
	}

	/**
	 * Create a new BinaryValue object from an ICAL.Binary object
	 *
	 * @param {ICAL.Binary} icalValue - The ICAL.Binary object
	 * @return {BinaryValue}
	 */
	static fromICALJs(icalValue) {
		return new BinaryValue(icalValue)
	}

	/**
	 * Create a new BinaryValue object from a raw b64 encoded value
	 *
	 * @param {String} rawValue - The raw value
	 * @return {BinaryValue}
	 */
	static fromRawValue(rawValue) {
		const icalBinary = new ICAL.Binary(rawValue)
		return BinaryValue.fromICALJs(icalBinary)
	}

	/**
	 * Create a new BinaryValue object from decoded value
	 *
	 * @param {String} decodedValue - The encoded value
	 * @return {BinaryValue}
	 */
	static fromDecodedValue(decodedValue) {
		const icalBinary = new ICAL.Binary()
		icalBinary.setEncodedValue(decodedValue)
		return BinaryValue.fromICALJs(icalBinary)
	}

}
