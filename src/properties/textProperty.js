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
import Property from './property.js'

/**
 * @class TextProperty
 * @classdesc
 */
export default class TextProperty extends Property {

	/**
	 * Gets the alternate text
	 *
	 * @return {string}
	 */
	get alternateText() {
		return this.getParameterFirstValue('ALTREP')
	}

	/**
	 * Sets the alternate text
	 *
	 * @param {string} altRep The alternative text
	 */
	set alternateText(altRep) {
		this.updateParameterIfExist('ALTREP', altRep)
	}

	/**
	 * Gets language of this property
	 *
	 * @return {string}
	 */
	get language() {
		return this.getParameterFirstValue('LANGUAGE')
	}

	/**
	 * Sets language of this property
	 *
	 * @param {string} language The language of the text
	 */
	set language(language) {
		this.updateParameterIfExist('LANGUAGE', language)
	}

}
