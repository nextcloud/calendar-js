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
import ExpectedICalJSError from "../errors/expectedICalJSError.js";
import ModificationNotAllowedError from "../errors/modificationNotAllowedError.js";
import Parameter from "../parameters/parameter.js";
import { createProperty } from "../factories/icalFactory.js";
import { lc, uc } from '../helpers/stringHelper.js';
import { getConstructorForICALType } from '../values';
import AbstractValue from '../values/abstractValue.js';
import DateTimeValue from '../values/dateTimeValue.js';
import lockableTrait from '../traits/lockable.js';
import observerTrait from '../traits/observer.js';

/**
 * @class Property
 * @classdesc This class represents a property as defined in RFC 5545 Section 3.5
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.5
 * @url https://github.com/mozilla-comm/ical.js/blob/master/lib/ical/property.js
 */
export default class Property extends observerTrait(lockableTrait(class {})) {

	/**
	 * Constructor
	 *
	 * @param {String} name
	 * @param {String|Number|AbstractValue|String[]|Number[]|AbstractValue[]|null} value
	 * @param {Parameter[]|[String, String|Array][]} parameters
	 * @param {CalendarComponent|null} root
	 * @param {AbstractComponent|null} parent
	 */
	constructor(name, value=null, parameters=[], root=null, parent=null) {
		super()

		/**
		 * Name of the property
		 *
		 * @type {String}
		 * @protected
		 */
		this._name = uc(name)

		/**
		 * Value of the property
		 *
		 * @type {String|Number|AbstractValue|String[]|Number[]|AbstractValue[]|null}
		 * @protected
		 */
		this._value = value

		/**
		 * List of parameters associated with this parameter
		 *
		 * @type {Map<String, Parameter>}
		 */
		this._parameters = new Map()

		/**
		 * Root node of ical document
		 *
		 * @type {CalendarComponent|null}
		 * @protected
		 */
		this._root = root

		/**
		 * Parent node
		 *
		 * @type {AbstractComponent|null}
		 * @protected
		 */
		this._parent = parent

		this._setParametersFromConstructor(parameters);
		if (value instanceof AbstractValue) {
			value.subscribe(() => this._notifySubscribers())
		}
	}

	/**
	 * Get property name
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
	 * @returns {String|Number|AbstractValue|String[]|Number[]|AbstractValue[]|null}
	 */
	get value() {
		return this._value
	}

	/**
	 * Set new parameter value
	 *
	 * @param {String|Number|AbstractValue|String[]|Number[]|AbstractValue[]|null} value
	 * @throws {ModificationNotAllowedError} if property is locked for modification
	 */
	set value(value) {
		this._modifyContent()
		this._value = value

		if (value instanceof AbstractValue) {
			value.subscribe(() => this._notifySubscribers())
		}
	}

	/**
	 * Gets the root of this property
	 *
	 * @returns {CalendarComponent|null}
	 */
	get root() {
		return this._root
	}

	/**
	 * Sets the root of this property
	 *
	 * @param {CalendarComponent|null} root
	 * @throws {ModificationNotAllowedError} if property is locked for modification
	 */
	set root(root) {
		this._modify()
		this._root = root
	}

	/**
	 * Gets the direct parent element of this property
	 *
	 * @returns {AbstractComponent}
	 */
	get parent() {
		return this._parent
	}

	/**
	 * Sets the direct parent element of this property
	 *
	 * @param {AbstractComponent|null} parent
	 * @throws {ModificationNotAllowedError} if property is locked for modification
	 */
	set parent(parent) {
		this._modify()
		this._parent = parent
	}

	/**
	 * Gets the first value of this property
	 *
	 * @returns {null|String|Number|AbstractValue}
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
	 * Gets an iterator over all values
	 *
	 * @returns {IterableIterator<String|AbstractValue>}
	 */
	*getValueIterator() {
		if (this.isMultiValue()) {
			yield* this.value.slice()[Symbol.iterator]()
		} else {
			yield this.value
		}
	}

	/**
	 * Sets a parameter on this property
	 *
	 * @param {Parameter} parameter
	 * @throws {ModificationNotAllowedError} if property is locked for modification
	 */
	setParameter(parameter) {
		this._modify()
		this._parameters.set(parameter.name, parameter)
		parameter.subscribe(() => this._notifySubscribers())
	}

	/**
	 * Gets a parameter on this property by its name
	 *
	 * @param {String} parameterName
	 * @returns {Parameter}
	 */
	getParameter(parameterName) {
		return this._parameters.get(uc(parameterName))
	}

	/**
	 * Gets an iterator over all available parameters
	 *
	 * @returns {IterableIterator<*>}
	 */
	*getParametersIterator() {
		yield* this._parameters.values()
	}

	/**
	 * Get first value of a parameter
	 *
	 * @param parameterName
	 * @returns {null|String}
	 */
	getParameterFirstValue(parameterName) {
		const parameter = this.getParameter(parameterName)
		if (parameter instanceof Parameter) {
			if (parameter.isMultiValue()) {
				return parameter.value[0]
			} else {
				return parameter.value
			}
		}

		return null
	}

	/**
	 * Returns whether a parameter exists on this property
	 *
	 * @param {String} parameterName
	 * @returns {boolean}
	 */
	hasParameter(parameterName) {
		return this._parameters.has(uc(parameterName))
	}

	/**
	 * Deletes a parameter on this property
	 *
	 * @param {String} parameterName
	 * @throws {ModificationNotAllowedError} if property is locked for modification
	 */
	deleteParameter(parameterName) {
		this._modify()
		this._parameters.delete(uc(parameterName))
	}

	/**
	 * update a parameter if it exists,
	 * create a new one if it doesn't
	 *
	 * @param {String} parameterName
	 * @throws {ModificationNotAllowedError} if property is locked for modification
	 * @param {string|Array|null} value
	 */
	updateParameterIfExist(parameterName, value) {
		this._modify()
		if (this.hasParameter(parameterName)) {
			const parameter = this.getParameter(parameterName)
			parameter.value = value
		} else {
			const parameter = new Parameter(uc(parameterName), value)
			this.setParameter(parameter)
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
	 * Returns whether or not this valus is decorated
	 *
	 * @returns {boolean}
	 */
	isDecoratedValue() {
		if (this.isMultiValue()) {
			return this._value[0] instanceof AbstractValue
		} else {
			return this._value instanceof AbstractValue
		}
	}

	/**
	 * Marks this parameter is immutable
	 * locks it against further modification
	 *
	 * @returns void
	 */
	lock() {
		super.lock()

		for (const parameter of this.getParametersIterator()) {
			parameter.lock()
		}

		if (this.isDecoratedValue()) {
			for (const value of this.getValueIterator()) {
				value.lock()
			}
		}
	}

	/**
	 * Marks this parameter as mutable
	 * allowing further modification
	 *
	 * @returns void
	 */
	unlock() {
		super.unlock()

		for (const parameter of this.getParametersIterator()) {
			parameter.unlock()
		}

		if (this.isDecoratedValue()) {
			for (const value of this.getValueIterator()) {
				value.unlock()
			}
		}
	}

	/**
	 * Creates a copy of this parameter
	 *
	 * @returns {Property}
	 */
	clone() {
		const parameters = []
		for (const parameter of this.getParametersIterator()) {
			parameters.push(parameter.clone())
		}

		return new this.constructor(this.name, this._cloneValue(), parameters, this.root, this.parent)
	}

	/**
	 * Copies the values of this property
	 *
	 * @returns {String|Number|AbstractValue|String[]|Number[]|AbstractValue[]|null}
	 * @protected
	 */
	_cloneValue() {
		if (this.isDecoratedValue()) {
			if (this.isMultiValue()) {
				return this._value.map((val) => val.clone())
			} else {
				return this._value.clone()
			}
		} else {
			if (this.isMultiValue()) {
				// only copy array values, don't copy array reference
				return this._value.slice()
			} else {
				return this._value
			}
		}
	}

	/**
	 * Sets parameters from the constructor
	 *
	 * @param {Parameter[]|[String, String|Array][]} parameters
	 * @private
	 */
	_setParametersFromConstructor(parameters) {
		parameters.forEach((parameter) => {
			if (!(parameter instanceof Parameter)) {
				parameter = new Parameter(parameter[0], parameter[1]);
			}

			this.setParameter(parameter)
		});
	}

	/**
	 * Creates a new Component based on an ical object
	 *
	 * @param {ICAL.Property} icalProperty
	 * @param {CalendarComponent=} root
	 * @param {AbstractComponent=} parent
	 * @returns {Property}
	 */
	static fromICALJs(icalProperty, root=null, parent=null) {
		if (!(icalProperty instanceof ICAL.Property)) {
			throw new ExpectedICalJSError()
		}

		let value
		if (icalProperty.isDecorated) {
			const constructor = getConstructorForICALType(icalProperty.getFirstValue().icaltype)
			if (icalProperty.isMultiValue) {
				value = icalProperty.getValues().map((val) => constructor.fromICALJs(val))
			} else {
				value = constructor.fromICALJs(icalProperty.getFirstValue())
			}
		} else {
			if (icalProperty.isMultiValue) {
				value = icalProperty.getValues()
			} else {
				value = icalProperty.getFirstValue()
			}
		}

		const parameters = []
		const paramNames = Object.keys(Object.assign({}, icalProperty.toJSON()[1]))
		paramNames.forEach((paramName) => {
			// Timezone id is handled by DateTimeValue
			if (uc(paramName) === 'TZID') {
				return
			}

			parameters.push([paramName, icalProperty.getParameter(paramName)])
		})

		return new this(icalProperty.name, value, parameters, root, parent)
	}

	/**
	 * Returns an ICAL.js property based on this Property
	 *
	 * @returns {ICAL.Property}
	 */
	toICALJs() {
		const icalProperty = createProperty(lc(this.name))

		if (this.isMultiValue()) {
			if (this.isDecoratedValue()) {
				icalProperty.setValues(this.value.map((val) => val.toICALJs()))
			} else {
				icalProperty.setValues(this.value)
			}
		} else {
			if (this.isDecoratedValue()) {
				icalProperty.setValue(this.value.toICALJs())
			} else {
				icalProperty.setValue(this.value)

			}
		}

		for (const parameter of this.getParametersIterator()) {
			icalProperty.setParameter(lc(parameter.name), parameter.value)
		}

		const firstValue = this.getFirstValue()
		if (firstValue instanceof DateTimeValue &&
			firstValue.timezoneId !== 'floating' &&
			firstValue.timezoneId !== 'UTC') {
			icalProperty.setParameter('tzid', firstValue.timezoneId)
		}

		return icalProperty
	}

	/**
	 * @inheritDoc
	 */
	_modifyContent() {
		super._modifyContent()
		this._notifySubscribers()
	}
}
