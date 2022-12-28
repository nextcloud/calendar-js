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
import Property from '../../../src/properties/property.js';
import GeoProperty from '../../../src/properties/geoProperty.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import Parameter from '../../../src/parameters/parameter.js';

it('GeoProperty should be defined', () => {
	expect(GeoProperty).toBeDefined()
})

it('GeoProperty should inherit from Property', () => {
	const property = new GeoProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('GeoProperty should expose easy getter and setter for latitude', () => {
	const icalProperty = ICAL.Property.fromString('GEO:37.386013;-122.082932')
	const property = GeoProperty.fromICALJs(icalProperty)

	expect(property.latitude).toEqual(37.386013)

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.latitude = 38.386013
	}).toThrow(ModificationNotAllowedError);
	expect(property.latitude).toEqual(37.386013)

	property.unlock()

	property.latitude = '25.386013'
	expect(property.latitude).toEqual(25.386013)

	property.latitude = 39.386013
	expect(property.latitude).toEqual(39.386013)

	expect(property.toICALJs().toICALString()).toEqual('GEO:39.386013;-122.082932')
})

it('GeoProperty should expose easy getter and setter for longitude', () => {
	const icalProperty = ICAL.Property.fromString('GEO:37.386013;-122.082932')
	const property = GeoProperty.fromICALJs(icalProperty)

	expect(property.longitude).toEqual(-122.082932)

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.longitude = -123.082932
	}).toThrow(ModificationNotAllowedError);
	expect(property.longitude).toEqual(-122.082932)

	property.unlock()

	property.longitude = '-99.082932'
	expect(property.longitude).toEqual(-99.082932)

	property.longitude = -124.082932
	expect(property.longitude).toEqual(-124.082932)

	expect(property.toICALJs().toICALString()).toEqual('GEO:37.386013;-124.082932')
})

it('GeoProperty should provide a constructor from lat and long', () => {
	const property = GeoProperty.fromPosition(20.12345, -42.1337)
	const para = new Parameter('para1', 'paravalue1')
	property.setParameter(para)

	expect(property.toICALJs().toICALString()).toEqual('GEO;PARA1=paravalue1:20.12345;-42.1337')
})
