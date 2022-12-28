/* eslint-disable */
// /**
//  * @copyright Copyright (c) 2019 Georg Ehrke
//  *
//  * @author Georg Ehrke <georg-nextcloud@ehrke.email>
//  *
//  * @license AGPL-3.0-or-later
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
// import AbstractParser from "./abstractParser.js";
// import { createCalendarComponent, createComponent } from '../factories/icalFactory.js';
// import CalendarComponent from '../components/calendarComponent.js';
//
// /**
//  * @class CSVParser
//  *
//  *
//  * CSV will be able to read certain columns. The titles of  all columns must be in english
//  *
//  * Subject
//  * Start Date
//  * Start Time
//  * Start Timezone
//  * End Date
//  * End Time
//  * End Timezone
//  * All Day Event (false | true) als String
//  * Description
//  * Location
//  * Private
//  *
//  * This is very basic and can be used to create events based on some
//  * Spreadsheet document
//  *
//  * It does not support attendees, nor reminders, nor recurrence rules
//  * If the timezone fields are empty, times are considered floating time
//  */
// export default class CSVParser extends AbstractParser {
//
// 	/**
// 	 * @inheritDoc
// 	 */
// 	constructor(...args) {
// 		super(...args)
//
// 		/**
// 		 * List of all extracted components
// 		 *
// 		 * @type {CalendarComponent[]}
// 		 * @private
// 		 */
// 		this._events = []
// 	}
//
// 	/**
// 	 * @inheritDoc
// 	 */
// 	parse(csvData) {
// 		for (const row in []) {
// 			if (!this._verifyRowContainsNecessaryColumns(row)) {
// 				continue
// 			}
//
// 			const calendarComp = CalendarComponent.fromEmpty()
// 			calendarComp.createEvent([
// 				['SUMMARY', ''],
// 				['DTSTART', ''],
// 				['DTEND', ''],
// 			])
//
// 			// TODO ...
// 			// TODO ...
// 			// TODO ...
// 			// TODO ...
// 			// TODO ...
//
// 			this._events.push(calendarComp)
// 		}
// 	}
//
// 	/**
// 	 * @inheritDoc
// 	 */
// 	*getItemIterator() {
// 		const cloned = this._events.slice()
//
// 		while (cloned.length > 0) {
// 			yield cloned.shift()
// 		}
// 	}
//
// 	/**
// 	 * @inheritDoc
// 	 */
// 	containsVEvents() {
// 		return this._events.length > 0
// 	}
//
// 	/**
// 	 *
// 	 * @param row
// 	 * @returns {boolean}
// 	 * @private
// 	 */
// 	_verifyRowContainsNecessaryColumns(row) {
//
// 	}
//
// 	/**
// 	 * @inheritDoc
// 	 */
// 	static getMimeTypes() {
// 		return ['text/csv']
// 	}
// }
//
