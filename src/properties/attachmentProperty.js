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
import Property from './property.js'
import BinaryValue from '../values/binaryValue.js'

/**
 * @class AttachmentProperty
 * @classdesc This class represents an attachment property as defined in RFC 5545 Section 3.8.1.1
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.1
 */
export default class AttachmentProperty extends Property {

	/**
	 * Gets the format-type of this attachment
	 *
	 * @returns {String}
	 */
	get formatType() {
		return this.getParameterFirstValue('FMTTYPE')
	}

	/**
	 * Sets the format-type of this attachment
	 *
	 * @param {String} fmtType
	 */
	set formatType(fmtType) {
		this.updateParameterIfExist('FMTTYPE', fmtType)
	}

	/**
	 * Gets the uri of this attachment
	 *
	 * @returns {String|null}
	 */
	get uri() {
		if (this._value instanceof BinaryValue) {
			return null
		}

		return this._value
	}

	/**
	 * Sets the uri of this attachment
	 *
	 * @param {String} uri
	 */
	set uri(uri) {
		this.value = uri
	}

	/**
	 * Gets the encoding of this attachment
	 *
	 * @returns {string|null}
	 */
	get encoding() {
		if (this._value instanceof BinaryValue) {
			return 'BASE64'
		}

		return null
	}

	/**
	 * Gets the data stored in this attachment
	 *
	 * @returns {String|null}
	 */
	get data() {
		if (this._value instanceof BinaryValue) {
			return this._value.value
		}

		return null
	}

	/**
	 * Sets the data stored in this attachment
	 *
	 * @param {String} data
	 */
	set data(data) {
		if (this.value instanceof BinaryValue) {
			this.value.value = data
		} else {
			this.value = BinaryValue.fromDecodedValue(data)
		}
	}

	/**
	 * @inheritDoc
	 */
	toICALJs() {
		const icalProperty = super.toICALJs()
		if (this._value instanceof BinaryValue) {
			icalProperty.setParameter('ENCODING', 'BASE64')
		}

		return icalProperty
	}

	/**
	 * Creates a new AttachmentProperty based on data
	 *
	 * @param {String} data
	 * @param {String=} formatType
	 * @returns {AttachmentProperty}
	 */
	static fromData(data, formatType = null) {
		const binaryValue = BinaryValue.fromDecodedValue(data)
		const property = new AttachmentProperty('ATTACH', binaryValue)

		if (formatType) {
			property.formatType = formatType
		}

		return property
	}

	/**
	 * Creates a new AttachmentProperty based on a link
	 *
	 * @param {String} uri
	 * @param {String=} formatType
	 * @returns {AttachmentProperty}
	 */
	static fromLink(uri, formatType = null) {
		const property = new AttachmentProperty('ATTACH', uri)

		if (formatType) {
			property.formatType = formatType
		}

		return property
	}

}
