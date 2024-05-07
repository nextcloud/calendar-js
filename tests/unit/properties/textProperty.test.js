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
import TextProperty from '../../../src/properties/textProperty.js';
import Property from '../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('TextProperty should be defined', () => {
	expect(TextProperty).toBeDefined()
})

it('TextProperty should inherit from property', () => {
	const property = new TextProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('TextProperty should provide an alternateText getter/setter', () => {
	const icalValue = ICAL.Property.fromString('COMMENT;LANGUAGE=EN;ALTREP="cid:part1.0001@example.org":COMMENT FOO BAR')
	const property = TextProperty.fromICALJs(icalValue)

	expect(property.alternateText).toEqual('cid:part1.0001@example.org')

	property.alternateText = 'cid:part1.0002@example.org'
	expect(property.alternateText).toEqual('cid:part1.0002@example.org')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.alternateText = 'cid:part1.0003@example.org'
	}).toThrow(ModificationNotAllowedError);
	expect(property.alternateText).toEqual('cid:part1.0002@example.org')

	property.unlock()

	property.alternateText = 'cid:part1.0042@example.org'
	expect(property.alternateText).toEqual('cid:part1.0042@example.org')

	expect(property.toICALJs().toICALString()).toEqual('COMMENT;LANGUAGE=EN;ALTREP="cid:part1.0042@example.org":COMMENT FOO BAR')
})

it('TextProperty should provide a language getter/setter', () => {
	const icalValue = ICAL.Property.fromString('COMMENT;LANGUAGE=EN;ALTREP="cid:part1.0001@example.org":COMMENT FOO BAR')
	const property = TextProperty.fromICALJs(icalValue)

	expect(property.language).toEqual('EN')

	property.language = 'DE'
	expect(property.language).toEqual('DE')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.language = 'FR'
	}).toThrow(ModificationNotAllowedError);
	expect(property.language).toEqual('DE')

	property.unlock()

	property.language = 'EN_US'
	expect(property.language).toEqual('EN_US')

	expect(property.toICALJs().toICALString()).toEqual('COMMENT;LANGUAGE=EN_US;ALTREP="cid:part1.0001@example.org":COMMENT FOO BAR')
})
