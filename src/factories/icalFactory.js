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

import { lc } from '../helpers/stringHelper.js'
import { getConfig } from '../config.js'
import ICAL from 'ical.js'

/**
 * creates a new ICAL.Component object
 *
 * @param {string} componentName The name of the component to create
 * @return {ICAL.Component}
 */
export function createComponent(componentName) {
	return new ICAL.Component(lc(componentName))
}

/**
 * creates a new ICAL.Property object
 *
 * @param {string} propertyName The name of the property to create
 * @return {ICAL.Property}
 */
export function createProperty(propertyName) {
	return new ICAL.Property(lc(propertyName))
}

/**
 * creates a new calendar component
 *
 * @param {String=} method Name of the method to include in VCALENDAR component
 * @return {ICAL.Component}
 */
export function createCalendarComponent(method = null) {
	const calendarComp = createComponent('VCALENDAR')

	calendarComp.addPropertyWithValue('prodid', getConfig('PRODID', '-//IDN georgehrke.com//calendar-js//EN'))
	calendarComp.addPropertyWithValue('calscale', 'GREGORIAN')
	calendarComp.addPropertyWithValue('version', '2.0')

	if (method) {
		calendarComp.addPropertyWithValue('method', method)
	}

	return calendarComp
}
