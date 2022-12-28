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
 * @class RelationProperty
 * @classdesc
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.5
 */
export default class RelationProperty extends Property {

	/**
	 * Get's the relation-type of this related-to property
	 *
	 * @return {string}
	 */
	get relationType() {
		const allowed = ['PARENT', 'CHILD', 'SIBLING']
		const defaultValue = 'PARENT'

		if (!this.hasParameter('RELTYPE')) {
			return defaultValue
		} else {
			const value = this.getParameterFirstValue('RELTYPE')
			if (allowed.includes(value)) {
				return value
			}

			return defaultValue
		}
	}

	/**
	 * Sets a new relation type
	 *
	 * @param {string} relationType The type of relation (e.g. SIBLING, PARENT, etc.)
	 */
	set relationType(relationType) {
		this.updateParameterIfExist('RELTYPE', relationType)
	}

	/**
	 * Gets Id of related object
	 *
	 * @return {string}
	 */
	get relatedId() {
		return this.value
	}

	/**
	 * Sets a new related id
	 *
	 * @param {string} relatedId The Id of the related document
	 */
	set relatedId(relatedId) {
		this.value = relatedId
	}

	/**
	 * Creates a new RELATED-TO property based on a relation-type and id
	 *
	 * @param {string} relType The type of the relation (e.g. SIBLING, CHILD)
	 * @param {string} relId The Id of the related document
	 * @return {RelationProperty}
	 */
	static fromRelTypeAndId(relType, relId) {
		return new RelationProperty('RELATED-TO', relId, [['RELTYPE', relType]])
	}

}
