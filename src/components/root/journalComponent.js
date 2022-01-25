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
import AbstractRecurringComponent from './abstractRecurringComponent.js'
import { advertiseMultipleOccurrenceProperty } from '../abstractComponent.js'
import TextProperty from '../../properties/textProperty.js'

/**
 * @class JournalComponent
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.6.3
 */
export default class JournalComponent extends AbstractRecurringComponent {

	/**
	 * Adds a new description property
	 *
	 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
	 *
	 * @param {String} description The description text
	 */
	addDescription(description) {
		this.addProperty(new TextProperty('DESCRIPTION', description))
	}

}

/**
 * Gets an iterator over all description properties
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name JournalComponent#getDescriptionIterator
 * @function
 * @returns {IterableIterator<ConferenceProperty>}
 */

/**
 * Gets a list of all description properties
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name JournalComponent#getDescriptionList
 * @function
 * @returns {ConferenceProperty[]}
 */

/**
 * Removes a description from this event
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name JournalComponent#removeDescription
 * @function
 * @param {ConferenceProperty} conference
 */

/**
 * Removes all descriptions from this event
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.1.5
 *
 * @name JournalComponent#clearAllDescriptions
 * @function
 */
advertiseMultipleOccurrenceProperty(JournalComponent.prototype, 'description')
