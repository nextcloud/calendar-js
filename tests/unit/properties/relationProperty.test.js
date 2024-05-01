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

import ICAL from 'ical.js'
import RelationProperty from '../../../src/properties/relationProperty.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import Property from '../../../src/properties/property.js';

it('RelationProperty should be defined', () => {
	expect(RelationProperty).toBeDefined()
})

it('RelationProperty should inherit from Property', () => {
	const property = new RelationProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('RelationProperty should provide a getter for the relation type - without param', () => {
	const icalProperty = ICAL.Property.fromString('RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com')
	const property = RelationProperty.fromICALJs(icalProperty)

	expect(property.relationType).toEqual('PARENT')
})

it('RelationProperty should provide a getter for the relation type - with param', () => {
	const icalProperty = ICAL.Property.fromString('RELATED-TO;RELTYPE=SIBLING:jsmith.part7.19960817T083000.xyzMail@example.com')
	const property = RelationProperty.fromICALJs(icalProperty)

	expect(property.relationType).toEqual('SIBLING')
})

it('RelationProperty should provide a getter for the relation type - with x-param', () => {
	const icalProperty = ICAL.Property.fromString('RELATED-TO;RELTYPE=X-RELATION:jsmith.part7.19960817T083000.xyzMail@example.com')
	const property = RelationProperty.fromICALJs(icalProperty)

	expect(property.relationType).toEqual('PARENT')
})

it('RelationProperty should provide a setter for relation type', () => {
	const icalProperty = ICAL.Property.fromString('RELATED-TO;RELTYPE=SIBLING:jsmith.part7.19960817T083000.xyzMail@example.com')
	const property = RelationProperty.fromICALJs(icalProperty)

	expect(property.relationType).toEqual('SIBLING')

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.relationType = 'CHILD'
	}).toThrow(ModificationNotAllowedError);
	expect(property.relationType).toEqual('SIBLING')

	property.unlock()

	property.relationType = 'PARENT'
	expect(property.relationType).toEqual('PARENT')

	expect(property.toICALJs().toICALString()).toEqual('RELATED-TO;RELTYPE=PARENT:jsmith.part7.19960817T083000.xyzMail@example.com')
})

it('RelationProperty should provide easy getter/setter for relatedId', () => {
	const icalProperty = ICAL.Property.fromString('RELATED-TO;RELTYPE=SIBLING:jsmith.part7.19960817T083000.xyzMail@example.com')
	const property = RelationProperty.fromICALJs(icalProperty)

	expect(property.relatedId).toEqual('jsmith.part7.19960817T083000.xyzMail@example.com')

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.relatedId = 'jsmith.part7.19960817T083000.abcMail@example.com'
	}).toThrow(ModificationNotAllowedError);
	expect(property.relatedId).toEqual('jsmith.part7.19960817T083000.xyzMail@example.com')

	property.unlock()

	property.relatedId = 'jsmith@example.com'
	expect(property.relatedId).toEqual('jsmith@example.com')

	expect(property.toICALJs().toICALString()).toEqual('RELATED-TO;RELTYPE=SIBLING:jsmith@example.com')
})

it('RelationProperty should provide a constructor from relation type and id', () => {
	const property = RelationProperty.fromRelTypeAndId('CHILD', 'id@foo.bar')

	expect(property.toICALJs().toICALString()).toEqual('RELATED-TO;RELTYPE=CHILD:id@foo.bar')
})
