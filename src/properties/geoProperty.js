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
import Property from "./property.js";
import { createProperty } from '../factories/icalFactory.js';
import { lc } from '../helpers/stringHelper.js';

/**
 * @class GeoProperty
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.6
 */
export default class GeoProperty extends Property {

	/**
	 * @inheritDoc
	 */
	constructor(name, value=[0, 0], parameters=[], root=null, parent=null) {
		super(name, value, parameters, root, parent)
	}

	/**
	 * Gets the latitude stored in this property
	 *
	 * @returns {Number}
	 */
	get latitude() {
		return this._value[0]
	}

	/**
	 * Sets the latitude stored in this property
	 *
	 * @param {String|Number} lat
	 */
	set latitude(lat) {
		this._modifyContent()
		if (typeof lat !== 'number') {
			lat = parseFloat(lat)
		}

		this._value[0] = lat
	}

	/**
	 * Gets the longitude stored in this property
	 */
	get longitude() {
		return this._value[1]
	}

	/**
	 * Sets the longitude stored in this property
	 *
	 * @param {String|Number} long
	 */
	set longitude(long) {
		this._modifyContent()
		if (typeof long !== 'number') {
			long = parseFloat(long)
		}

		this._value[1] = long
	}

	/**
	 * @inheritDoc
	 *
	 * TODO: this is an ugly hack right now.
	 * As soon as the value is an array, we assume it's multivalue
	 * but GEO is a (the one and only besides request-status) structured value and is also
	 * stored inside an array.
	 *
	 * Calling icalProperty.setValues will throw an error
	 */
	toICALJs() {
		const icalProperty = createProperty(lc(this.name))
		icalProperty.setValue(this.value)

		this._parameters.forEach((parameter) => {
			icalProperty.setParameter(lc(parameter.name), parameter.value)
		})

		return icalProperty
	}

	/**
	 * Creates a new GeoProperty based on a latitude and a longitude value
	 *
	 * @param {Number} lat - latitude
	 * @param {Number} long - longitude
	 * @returns {GeoProperty}
	 */
	static fromPosition(lat, long) {
		return new GeoProperty('GEO', [lat, long])
	}
}
