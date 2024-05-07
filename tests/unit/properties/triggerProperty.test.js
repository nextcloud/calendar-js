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
import TriggerProperty from '../../../src/properties/triggerProperty.js';
import Property from '../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import DurationValue from '../../../src/values/durationValue.js';

it('TriggerProperty should be defined', () => {
	expect(TriggerProperty).toBeDefined()
})

it('TriggerProperty should inherit from Property', () => {
	const property = new TriggerProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('TriggerProperty should provide a simple getter/setter for related', () => {
	const icalValue = ICAL.Property.fromString('TRIGGER;RELATED=END:PT5M')
	const property = TriggerProperty.fromICALJs(icalValue)

	expect(property.related).toEqual('END')

	property.related = 'START'
	expect(property.related).toEqual('START')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.related = 'END'
	}).toThrow(ModificationNotAllowedError);
	expect(property.related).toEqual('START')

	property.unlock()

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;RELATED=START:PT5M')
})

it('TriggerProperty should provide a simple getter/setter for related - no initial value', () => {
	const icalValue = ICAL.Property.fromString('TRIGGER:PT5M')
	const property = TriggerProperty.fromICALJs(icalValue)

	expect(property.related).toEqual('START')

	property.related = 'END'
	expect(property.related).toEqual('END')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.related = 'START'
	}).toThrow(ModificationNotAllowedError);
	expect(property.related).toEqual('END')

	property.unlock()

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;RELATED=END:PT5M')
})

it('TriggerProperty should clean up the RELATED parameter when setting a new value', () => {
	const icalValue = ICAL.Property.fromString('TRIGGER;RELATED=END:PT5M')
	const property = TriggerProperty.fromICALJs(icalValue)

	expect(property.related).toEqual('END')

	const absoluteValue = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 1, 0, 0, 0)), true)

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;RELATED=END:PT5M')

	property.value = absoluteValue

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;VALUE=DATE-TIME:20190901T000000Z')

	property.value = DurationValue.fromSeconds(0)

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER:PT0S')
})

it('TriggerProperty should provide a method to check whether the alarm is relative', () => {
	const icalValue1 = ICAL.Property.fromString('TRIGGER;RELATED=END:PT5M')
	const property1 = TriggerProperty.fromICALJs(icalValue1)

	const icalValue2 = ICAL.Property.fromString('TRIGGER;VALUE=DATE-TIME:20190901T020000Z')
	const property2 = TriggerProperty.fromICALJs(icalValue2)

	expect(property1.isRelative()).toEqual(true)
	expect(property2.isRelative()).toEqual(false)
})

it('TriggerProperty should provide a constructor from absolute', () => {
	const absoluteValue = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 1, 0, 0, 0)), true)
	const property = TriggerProperty.fromAbsolute(absoluteValue)

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;VALUE=DATE-TIME:20190901T000000Z')
})

it('TriggerProperty should provide a constructor from relative', () => {
	const relativeValue = DurationValue.fromSeconds(-60)
	const property = TriggerProperty.fromRelativeAndRelated(relativeValue)

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;RELATED=START:-PT1M')
})

it('TriggerProperty should provide a constructor from relative - related to start', () => {
	const relativeValue = DurationValue.fromSeconds(-60)
	const property = TriggerProperty.fromRelativeAndRelated(relativeValue, true)

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;RELATED=START:-PT1M')
})

it('TriggerProperty should provide a constructor from relative - related to false', () => {
	const relativeValue = DurationValue.fromSeconds(-60)
	const property = TriggerProperty.fromRelativeAndRelated(relativeValue, false)

	expect(property.toICALJs().toICALString()).toEqual('TRIGGER;RELATED=END:-PT1M')
})
