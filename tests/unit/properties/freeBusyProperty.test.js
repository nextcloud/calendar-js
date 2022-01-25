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
import FreeBusyProperty from '../../../src/properties/freeBusyProperty.js';
import Property from '../../../src/properties/property.js';
import PeriodValue from '../../../src/values/periodValue.js';

it('FreeBusyProperty should be defined', () => {
	expect(FreeBusyProperty).toBeDefined()
})

it('FreeBusyProperty should inherit from property', () => {
	const property = new FreeBusyProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('FreeBusyProperty should provide a type property', () => {
	const icalValue = ICAL.Property.fromString('FREEBUSY;FBTYPE=BUSY:19980415T133000Z/19980415T170000Z')
	const property = FreeBusyProperty.fromICALJs(icalValue)

	expect(property.type).toEqual('BUSY')
})

it('FreeBusyProperty should return busy on unknown type', () => {
	const icalValue = ICAL.Property.fromString('FREEBUSY;FBTYPE=BUSY123:19980415T133000Z/19980415T170000Z')
	const property = FreeBusyProperty.fromICALJs(icalValue)

	expect(property.type).toEqual('BUSY')
})

it('FreeBusyProperty should return busy on no type', () => {
	const icalValue = ICAL.Property.fromString('FREEBUSY:19980415T133000Z/19980415T170000Z')
	const property = FreeBusyProperty.fromICALJs(icalValue)

	expect(property.type).toEqual('BUSY')
})

it('FreeBusyProperty should provide a setter for type', () => {
	const icalValue = ICAL.Property.fromString('FREEBUSY;FBTYPE=BUSY:19980415T133000Z/19980415T170000Z')
	const property = FreeBusyProperty.fromICALJs(icalValue)

	expect(property.type).toEqual('BUSY')
	property.type = 'FREE'

	expect(property.type).toEqual('FREE')

	expect(property.toICALJs().toICALString()).toEqual('FREEBUSY;FBTYPE=FREE:19980415T133000Z/19980415T170000Z')
})

it('FreeBusyProperty should provide a constructor from period and type', () => {
	const icalValue = ICAL.Period.fromString('1997-01-01T18:00:00Z/PT5H30M')
	const value = PeriodValue.fromICALJs(icalValue)
	const type = 'BUSY-TENTATIVE'

	const property = FreeBusyProperty.fromPeriodAndType(value, type)
	expect(property.toICALJs().toICALString()).toEqual('FREEBUSY;FBTYPE=BUSY-TENTATIVE:19970101T180000Z/PT5H30M')
})
