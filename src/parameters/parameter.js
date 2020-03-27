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

import { uc } from '../helpers/stringHelper.js'
import lockableTrait from '../traits/lockable.js'
import observerTrait from '../traits/observer.js'

/**
 * @class Parameter
 * @classdesc This class represents a property parameters as defined in RFC 5545 Section 3.2
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.2
 * @url
 */
export default class Parameter extends observerTrait(lockableTrait(class {})) {

	/**
	 * Constructor
	 *
	 * @param {string} name The name of the parameter
	 * @param {string|Array|null} value The value of the parameter
	 */
	constructor(name, value = null) {
		super()

		/**
		 * Name of the parameter
		 *
		 * @type {string}
		 * @private
		 */
		this._name = uc(name)

		/**
		 * Value of the parameter
		 *
		 * @type {string|Array|null}
		 * @private
		 */
		this._value = value
	}

	/**
	 * Get parameter name
	 *
	 * @readonly
	 * @returns {String}
	 */
	get name() {
		return this._name
	}

	/**
	 * Get parameter value
	 *
	 * @returns {String|Array}
	 */
	get value() {
		return this._value
	}

	/**
	 * Set new parameter value
	 *
	 * @throws {ModificationNotAllowedError} if parameter is locked for modification
	 * @param {String|Array} value The new value to set
	 */
	set value(value) {
		this._modifyContent()
		this._value = value
	}

	/**
	 * Gets the first value of this parameter
	 *
	 * @returns {String|null}
	 */
	getFirstValue() {
		if (!this.isMultiValue()) {
			return this.value
		} else {
			if (this.value.length > 0) {
				return this.value[0]
			}
		}

		return null
	}

	/**
	 * Gets an iterator for all values
	 */
	* getValueIterator() {
		if (this.isMultiValue()) {
			yield * this.value.slice()[Symbol.iterator]()
		} else {
			yield this.value
		}
	}

	/**
	 * Returns whether or not the value is a multivalue
	 *
	 * @returns {Boolean}
	 */
	isMultiValue() {
		return Array.isArray(this._value)
	}

	/**
	 * Creates a copy of this parameter
	 *
	 * @returns {Parameter}
	 */
	clone() {
		const parameter = new this.constructor(this._name)
		if (this.isMultiValue()) {
			// only copy array values, don't copy array reference
			parameter.value = this._value.slice()
		} else {
			parameter.value = this._value
		}

		// cloned parameters are always mutable
		return parameter
	}

	/**
	 * @inheritDoc
	 */
	_modifyContent() {
		super._modifyContent()
		this._notifySubscribers()
	}

}
