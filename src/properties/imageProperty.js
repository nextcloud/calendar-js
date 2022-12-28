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
import AttachmentProperty from './attachmentProperty.js'
import BinaryValue from '../values/binaryValue.js'

/**
 * @class ImageProperty
 *
 * @url https://tools.ietf.org/html/rfc7986#section-5.10
 */
export default class ImageProperty extends AttachmentProperty {

	/**
	 * Gets the image-type
	 */
	get display() {
		return this.getParameterFirstValue('DISPLAY') || 'BADGE'
	}

	/**
	 * Gets the image-type
	 *
	 * @param {String} display The display-type image is optimized for
	 */
	set display(display) {
		this.updateParameterIfExist('DISPLAY', display)
	}

	/**
	 * Creates a new ImageProperty based on data
	 *
	 * @param {String} data The data of the image
	 * @param {String=} display The display-type it's optimized for
	 * @param {String=} formatType The mime-type of the image
	 * @returns {ImageProperty}
	 */
	static fromData(data, display = null, formatType = null) {
		const binaryValue = BinaryValue.fromDecodedValue(data)
		const property = new ImageProperty('IMAGE', binaryValue)

		if (display) {
			property.display = display
		}

		if (formatType) {
			property.formatType = formatType
		}

		return property
	}

	/**
	 * Creates a new ImageProperty based on a link
	 *
	 * @param {String} uri The uri of the image
	 * @param {String=} display The display-type it's optimized for
	 * @param {String=} formatType The mime-type of the image
	 * @returns {ImageProperty}
	 */
	static fromLink(uri, display = null, formatType = null) {
		const property = new ImageProperty('IMAGE', uri)

		if (display) {
			property.display = display
		}

		if (formatType) {
			property.formatType = formatType
		}

		return property
	}

}
