/* eslint-disable */
// /**
//  * @copyright Copyright (c) 2019 Georg Ehrke
//  *
//  * @author Georg Ehrke <georg-nextcloud@ehrke.email>
//  *
//  * @license GNU AGPL version 3 or any later version
//  *
//  * This program is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU Affero General Public License as
//  * published by the Free Software Foundation, either version 3 of the
//  * License, or (at your option) any later version.
//  *
//  * This program is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  * GNU Affero General Public License for more details.
//  *
//  * You should have received a copy of the GNU Affero General Public License
//  * along with this program. If not, see <http://www.gnu.org/licenses/>.
//  *
//  */
// import ICalendarParser from './icalendarParser.js';
// import CalendarComponent from '../components/calendarComponent.js';
//
// /**
//  * @class JCalendarParser
//  */
// export default class JCalendarParser extends ICalendarParser {
//
// 	/**
// 	 * Parses the actual calendar-data
// 	 *
// 	 * @param {String|Object} json
// 	 */
// 	parse(json) {
// 		if (typeof json === 'string') {
// 			json = JSON.parse(json)
// 		}
//
// 		this._createCalendarComponent(json)
//
// 		if (this._getOption('extractGlobalProperties', false)) {
// 			this._extractProperties()
// 		}
//
// 		this._extractTimezones()
// 		this._registerTimezones()
// 		this._processVObjects()
// 	}
//
// 	/**
// 	 *
// 	 * @param {Object} json
// 	 * @private
// 	 */
// 	_createCalendarComponent(json) {
// 		const icalComp = new ICAL.Component(json)
// 		this._calendarComponent = CalendarComponent.fromICALJs(icalComp)
// 	}
//
// 	/**
// 	 * @inheritDoc
// 	 */
// 	static getMimeTypes() {
// 		return ['application/calendar+json']
// 	}
// }
