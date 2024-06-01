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
import ExpectedICalJSError from "../../../src/errors/expectedICalJSError.js";
import ModificationNotAllowedError from "../../../src/errors/modificationNotAllowedError.js";
import Parameter from "../../../src/parameters/parameter.js";
import Property from "../../../src/properties/property.js"
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import { Timezone } from '@nextcloud/timezones';


it('Property should be defined', () => {
	expect(Property).toBeDefined()
})

it('Property should be creatable with one parameter', () => {
	const property = new Property('FOO')
	expect(property.name).toEqual('FOO')

	const property2 = new Property('foo')
	expect(property2.name).toEqual('FOO')
})

it('Property should be creatable with two parameters', () => {
	const property = new Property('FOO', 'VALUE1')

	expect(property.name).toEqual('FOO')
	expect(property.value).toEqual('VALUE1')
	expect(property.isMultiValue()).toEqual(false)
})

it('Property should be creatable with two parameters - multivalue', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])

	expect(property.name).toEqual('FOO')
	expect(property.value).toEqual(['VALUE1', 'VALUE2'])
	expect(property.isMultiValue()).toEqual(true)
})

it('Property should be creatable with three parameters', () => {
	const parameter1 = new Parameter('para1', 'value1')
	const property = new Property('FOO', 'VALUE1', [parameter1, ['para2', ['value2', 'value3']]])

	expect(property.name).toEqual('FOO')
	expect(property.value).toEqual('VALUE1')
	expect(property.isMultiValue()).toEqual(false)

	expect(property.hasParameter('PARA1')).toEqual(true)
	expect(property.hasParameter('PARA2')).toEqual(true)
})

it('Property should be creatable with four parameters', () => {
	const parameter1 = new Parameter('para1', 'value1')
	const fakeRoot = {}
	const property = new Property('FOO', 'VALUE1', [parameter1, ['para2', ['value2', 'value3']]], fakeRoot)

	expect(property.name).toEqual('FOO')
	expect(property.value).toEqual('VALUE1')
	expect(property.isMultiValue()).toEqual(false)

	expect(property.hasParameter('PARA1')).toEqual(true)
	expect(property.hasParameter('PARA2')).toEqual(true)
	expect(property.root).toEqual(fakeRoot)
})

it('Property should be creatable with five parameters', () => {
	const parameter1 = new Parameter('para1', 'value1')
	const fakeRoot = {}
	const fakeParent = {}
	const property = new Property('FOO', 'VALUE1', [parameter1, ['para2', ['value2', 'value3']]], fakeRoot, fakeParent)

	expect(property.name).toEqual('FOO')
	expect(property.value).toEqual('VALUE1')
	expect(property.isMultiValue()).toEqual(false)

	expect(property.hasParameter('PARA1')).toEqual(true)
	expect(property.hasParameter('PARA2')).toEqual(true)
	expect(property.root).toEqual(fakeRoot)
	expect(property.parent).toEqual(fakeParent)
})

it('Property should be lockable - value', () => {
	const parameter1 = new Parameter('para1', 'value1')
	const property = new Property('FOO', 'VALUE1', [parameter1, ['para2', ['value2', 'value3']]])

	expect(property.value).toEqual('VALUE1')

	property.value = 'VALUE2'
	expect(property.value).toEqual('VALUE2')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.value = 'VALUE3'
	}).toThrow(ModificationNotAllowedError);
	expect(property.value).toEqual('VALUE2')

	property.unlock()
	expect(property.isLocked()).toEqual(false)

	property.value = 'VALUE4'
	expect(property.value).toEqual('VALUE4')
})

it('Property should be lockable - root', () => {
	const parameter1 = new Parameter('para1', 'value1')
	const fakeRoot1 = {}
	const fakeRoot2 = {}
	const fakeRoot3 = {}
	const property = new Property('FOO', 'VALUE1', [parameter1, ['para2', ['value2', 'value3']]], fakeRoot1)

	expect(property.root).toEqual(fakeRoot1)

	property.root = fakeRoot2
	expect(property.root).toEqual(fakeRoot2)

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.root = fakeRoot3
	}).toThrow(ModificationNotAllowedError);
	expect(property.root).toEqual(fakeRoot2)

	property.unlock()
	expect(property.isLocked()).toEqual(false)

	property.root = fakeRoot1
	expect(property.root).toEqual(fakeRoot1)
})

it('Property should be lockable - parent', () => {
	const parameter1 = new Parameter('para1', 'value1')
	const fakeParent1 = {}
	const fakeParent2 = {}
	const fakeParent3 = {}
	const property = new Property('FOO', 'VALUE1', [parameter1, ['para2', ['value2', 'value3']]], {}, fakeParent1)

	expect(property.parent).toEqual(fakeParent1)

	property.parent = fakeParent2
	expect(property.parent).toEqual(fakeParent2)

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.parent = fakeParent3
	}).toThrow(ModificationNotAllowedError);
	expect(property.parent).toEqual(fakeParent2)

	property.unlock()
	expect(property.isLocked()).toEqual(false)

	property.parent = fakeParent1
	expect(property.parent).toEqual(fakeParent1)
})

it('Property should provide a method to get the first value - no multivalue', () => {
	const property = new Property('FOO', 'VALUE1')
	expect(property.getFirstValue()).toEqual('VALUE1')
})

it('Property should provide a method to get the first value - multivalue', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	expect(property.getFirstValue()).toEqual('VALUE1')
})

it('Property should provide a method to get the first value - empty multivalue', () => {
	const property = new Property('FOO', [])
	expect(property.getFirstValue()).toEqual(null)
})

it('Property should provide a method to get a value iterator - no multivalue', () => {
	const property = new Property('FOO', 'VALUE1')

	const iterator = property.getValueIterator()
	expect(iterator.next().value).toEqual('VALUE1')
	expect(iterator.next().value).toBeUndefined()
})

it('Property should provide a method to get a value iterator - multivalue', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])

	const iterator = property.getValueIterator()
	expect(iterator.next().value).toEqual('VALUE1')
	expect(iterator.next().value).toEqual('VALUE2')
	expect(iterator.next().value).toBeUndefined()
})

it('Property should provide a method to set a new parameter', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')
	const para2 = new Parameter('para1', 'p2')
	const para3 = new Parameter('para2', 'p3')
	const para4 = new Parameter('para3', 'p4')

	property.setParameter(para1)
	expect(property.hasParameter('para1')).toEqual(true)
	expect(property.getParameterFirstValue('para1')).toEqual('p1')

	property.setParameter(para2)
	expect(property.hasParameter('para1')).toEqual(true)
	expect(property.getParameterFirstValue('para1')).toEqual('p2')

	property.lock()

	expect(() => {
		property.setParameter(para3)
	}).toThrow(ModificationNotAllowedError);
	expect(property.hasParameter('para2')).toEqual(false)

	property.unlock()

	property.setParameter(para4)
	expect(property.hasParameter('para1')).toEqual(true)
	expect(property.getParameterFirstValue('para3')).toEqual('p4')
})

it('Property should provide a method to get a parameter', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')

	property.setParameter(para1)
	expect(property.getParameter('para1')).toEqual(para1)
})

it('Property should provide a method to get the first value of a parameter', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')
	const para2 = new Parameter('para2', ['p2', 'p3'])

	property.setParameter(para1)
	property.setParameter(para2)
	expect(property.getParameterFirstValue('para1')).toEqual('p1')
	expect(property.getParameterFirstValue('para2')).toEqual('p2')
	expect(property.getParameterFirstValue('para3')).toEqual(null)
})

it('Property should provide a method to get a parameter iterator', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')
	const para2 = new Parameter('para1', 'p2')
	const para3 = new Parameter('para2', 'p3')
	const para4 = new Parameter('para3', 'p4')

	property.setParameter(para1)
	property.setParameter(para2)
	property.setParameter(para3)
	property.setParameter(para4)

	const iterator = property.getParametersIterator()

	expect(iterator.next().value).toEqual(para2)
	expect(iterator.next().value).toEqual(para3)
	expect(iterator.next().value).toEqual(para4)
	expect(iterator.next().value).toBeUndefined()
})

it('Property should provide a method to check if it has a parameter', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')
	property.setParameter(para1)

	expect(property.hasParameter('para1')).toEqual(true)
	expect(property.hasParameter('para2')).toEqual(false)
})

it('Property should provide a method to delete a parameter', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')
	property.setParameter(para1)

	expect(property.hasParameter('para1')).toEqual(true)
	expect(property.hasParameter('para2')).toEqual(false)

	property.deleteParameter('para1')

	expect(property.hasParameter('para1')).toEqual(false)
	expect(property.hasParameter('para2')).toEqual(false)
})

it('Property should provide a method to update a parameter or create if it doesn\'t exist', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	const para1 = new Parameter('para1', 'p1')
	property.setParameter(para1)

	property.updateParameterIfExist('para1', 'p1-new')
	property.updateParameterIfExist('para2', 'p2')
	property.updateParameterIfExist('para3', ['p3', 'p4'])

	expect(property.hasParameter('para1')).toEqual(true)
	expect(property.hasParameter('para2')).toEqual(true)
	expect(property.hasParameter('para3')).toEqual(true)
	expect(property.getParameter('para1').value).toEqual('p1-new')
	expect(property.getParameter('para2').value).toEqual('p2')
	expect(property.getParameter('para3').value).toEqual(['p3', 'p4'])
})

it('Property should provide a method to check if the value is multivalue - no multivalue', () => {
	const property = new Property('FOO', 'VALUE1')
	expect(property.isMultiValue()).toEqual(false)
})

it('Property should provide a method to check if the value is multivalue - multivalue', () => {
	const property = new Property('FOO', ['VALUE1', 'VALUE2'])
	expect(property.isMultiValue()).toEqual(true)
})

it('Property should provide a method to check if the value is a decorated value - no multivalue', () => {
	const dateTimeValue = DateTimeValue.fromJSDate(new Date())
	const property = new Property('FOO', dateTimeValue)

	expect(property.isDecoratedValue()).toEqual(true)

	const property2 = new Property('FOO', 'VALUE1')
	expect(property2.isDecoratedValue()).toEqual(false)
})

it('Property should provide a method to check if the value is a decorated value - multivalue', () => {
	const dateTimeValue1 = DateTimeValue.fromJSDate(new Date())
	const dateTimeValue2 = DateTimeValue.fromJSDate(new Date())
	const property = new Property('FOO', [dateTimeValue1, dateTimeValue2])

	expect(property.isDecoratedValue()).toEqual(true)

	const property2 = new Property('FOO', ['VALUE1', 'VALUE2'])
	expect(property2.isDecoratedValue()).toEqual(false)
})

it('Property should lock all parameters and values on locking', () => {
	const dateTimeValue = DateTimeValue.fromJSDate(new Date())
	const parameter = new Parameter('para1', 'p1')
	const property = new Property('FOO', dateTimeValue, [parameter])

	expect(property.isLocked()).toEqual(false)
	expect(parameter.isLocked()).toEqual(false)
	expect(dateTimeValue.isLocked()).toEqual(false)

	property.lock()

	expect(property.isLocked()).toEqual(true)
	expect(parameter.isLocked()).toEqual(true)
	expect(dateTimeValue.isLocked()).toEqual(true)

	property.unlock()

	expect(property.isLocked()).toEqual(false)
	expect(parameter.isLocked()).toEqual(false)
	expect(dateTimeValue.isLocked()).toEqual(false)
})

it('Property should provide a method to clone it - undecorated - no multivalue', () => {
	const property = new Property('SUMMARY', 'Annual Employee Review')
	const property2 = property.clone()

	expect(property === property2).toEqual(false)

	property.value = 'new value'
	expect(property.value).toEqual('new value')
	expect(property2.value).toEqual('Annual Employee Review')
})

it('Property should provide a method to clone it - undecorated - multivalue', () => {
	const property = new Property('CATEGORIES', ['ANNIVERSARY', 'PERSONAL', 'SPECIAL OCCASION'])
	const property2 = property.clone()

	expect(property === property2).toEqual(false)

	property.value.push('new value')
	expect(property.value.includes('new value')).toEqual(true)
	expect(property2.value.includes('new value')).toEqual(false)
})

it('Property should provide a method to clone it - decorated - no multivalue', () => {
	const dateTimeValue = DateTimeValue.fromJSDate(new Date())
	const parameter = new Parameter('para1', 'p1')
	const property = new Property('FOO', dateTimeValue, [parameter])

	const property2 = property.clone()
	// To equal checks deep equality, we only check reference here to see if it's a different object
	expect(property === property2).toEqual(false)
	expect(property2.getFirstValue()).not.toEqual(null)
	expect(dateTimeValue === property2.getFirstValue()).toEqual(false)
	expect(property2.getParameter('para1')).not.toEqual(null)
	expect(parameter === property2.getParameter('para1')).toEqual(false)
})

it('Property should provide a method to clone it - decorated - multivalue', () => {
	const icalProperty = ICAL.Property.fromString('RDATE;VALUE=DATE:19970101,19970120,19970217,19970421')
	const property = Property.fromICALJs(icalProperty)
	const property2 = property.clone()

	property.value[0].year = 2019

	expect(property.toICALJs().toICALString()).toEqual('RDATE;VALUE=DATE:20190101,19970120,19970217,19970421')
	expect(property2.toICALJs().toICALString()).toEqual('RDATE;VALUE=DATE:19970101,19970120,19970217,19970421')
})

it('Property should be creatable from an ICAL.Property value - undecorated - no multivalue', () => {
	const icalProperty = ICAL.Property.fromString('SUMMARY:Annual Employee Review')
	const property = Property.fromICALJs(icalProperty)

	expect(property.name).toEqual('SUMMARY')
	expect(property.value).toEqual('Annual Employee Review')
	expect(property.isMultiValue()).toEqual(false)
	expect(property.isDecoratedValue()).toEqual(false)
})

it('Property should be creatable from an ICAL.Property value - undecorated - multivalue', () => {
	const icalProperty = ICAL.Property.fromString('CATEGORIES:ANNIVERSARY,PERSONAL,SPECIAL OCCASION')
	const property = Property.fromICALJs(icalProperty)

	expect(property.name).toEqual('CATEGORIES')
	expect(property.value).toEqual(['ANNIVERSARY', 'PERSONAL', 'SPECIAL OCCASION'])
	expect(property.isMultiValue()).toEqual(true)
	expect(property.isDecoratedValue()).toEqual(false)
})

it('Property should be creatable from an ICAL.Property value - decorated - no multivalue', () => {
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	ICAL.TimezoneService.register('America/New_York', tzNYC.toICALTimezone())

	const icalProperty = ICAL.Property.fromString('DTSTART;TZID=America/New_York:19980119T020000')
	const property = Property.fromICALJs(icalProperty)

	expect(property.name).toEqual('DTSTART')
	expect(property.value instanceof DateTimeValue).toEqual(true)
	expect(property.isMultiValue()).toEqual(false)
	expect(property.isDecoratedValue()).toEqual(true)
	expect(property.value.year).toEqual(1998)
	expect(property.value.month).toEqual(1)
	expect(property.value.day).toEqual(19)
	expect(property.value.hour).toEqual(2)
	expect(property.value.minute).toEqual(0)
	expect(property.value.second).toEqual(0)
	expect(property.value.timezoneId).toEqual('America/New_York')
})

it('Property should be creatable from an ICAL.Property value - decorated - multivalue', () => {
	const icalProperty = ICAL.Property.fromString('RDATE;VALUE=DATE:19970101,19970120,19970217,19970421')
	const property = Property.fromICALJs(icalProperty)

	expect(property.name).toEqual('RDATE')
	expect(property.value[0] instanceof DateTimeValue).toEqual(true)
	expect(property.isMultiValue()).toEqual(true)
	expect(property.isDecoratedValue()).toEqual(true)
	expect(property.value.length).toEqual(4)
})

it('Property should be convertable to an ICAL.Property object - undecorated - no multivalue', () => {
	const property = new Property('SUMMARY', 'This is the event\'s title 123')

	expect(property.toICALJs() instanceof ICAL.Property)
	expect(property.toICALJs().toICALString()).toEqual('SUMMARY:This is the event\'s title 123')
})

it('Property should be convertable to an ICAL.Property object - undecorated - multivalue', () => {
	const property = new Property('CATEGORIES', ['ANNIVERSARY', 'PERSONAL', 'SPECIAL OCCASION'])

	expect(property.toICALJs() instanceof ICAL.Property)
	expect(property.toICALJs().toICALString()).toEqual('CATEGORIES:ANNIVERSARY,PERSONAL,SPECIAL OCCASION')
})

it('Property should be convertable to an ICAL.Property object - decorated - no multivalue', () => {
	const tzNYC = new Timezone('America/New_York', getAsset('timezone-america-nyc'))
	ICAL.TimezoneService.register('America/New_York', tzNYC.toICALTimezone())

	const dateTimeValue = DateTimeValue.fromData({
		year: 1998,
		month: 1,
		day: 1,
		hour: 2,
		minute: 0,
		second: 0
	}, tzNYC)
	const property = new Property('RANDON-DATE-TIME-VALUE', dateTimeValue)

	expect(property.toICALJs() instanceof ICAL.Property)
	expect(property.toICALJs().toICALString()).toEqual('RANDON-DATE-TIME-VALUE;TZID=America/New_York;VALUE=DATE-TIME:19980101T020000')
})

it('Property should be convertable to an ICAL.Property object - decorated - multivalue', () => {
	const dateTimeValue1 = DateTimeValue.fromData({
		year: 1997,
		month: 1,
		day: 1,
		isDate: true
	})
	const dateTimeValue2 = DateTimeValue.fromData({
		year: 1997,
		month: 1,
		day: 20,
		isDate: true
	})
	const dateTimeValue3 = DateTimeValue.fromData({
		year: 1997,
		month: 2,
		day: 17,
		isDate: true
	})
	const dateTimeValue4 = DateTimeValue.fromData({
		year: 1997,
		month: 4,
		day: 21,
		isDate: true
	})

	const para1 = new Parameter('PARA1', 'paravalue1')
	const property = new Property('RDATE', [dateTimeValue1, dateTimeValue2, dateTimeValue3, dateTimeValue4], [para1])

	expect(property.toICALJs() instanceof ICAL.Property)
	expect(property.toICALJs().toICALString()).toEqual('RDATE;PARA1=paravalue1;VALUE=DATE:19970101,19970120,19970217,19970421')
})

it('Property should throw an exception when calling fromICALJs with wrong parameter', () => {
	expect(() => {
		Property.fromICALJs({})
	}).toThrow(ExpectedICalJSError);
})

it('Property should expose an addValue method', () => {
	const property = new Property('CATEGORIES', ['ANNIVERSARY', 'PERSONAL', 'SPECIAL OCCASION'])
	const listener = jest.fn()
	property.subscribe(listener)
	property.addValue('FOO')

	expect(listener.mock.calls.length).toEqual(1)
	expect(listener).toHaveBeenCalledWith()
})

it('Property should expose an addValue method - no multivalue', () => {
	const property = new Property('X-FOO', 'BAR')
	const listener = jest.fn()
	property.subscribe(listener)

	expect(() => {
		property.addValue('FOO')
	}).toThrow(TypeError)

	expect(listener.mock.calls.length).toEqual(0)
})

it('Property should expose an hasValue method', () => {
	const property = new Property('CATEGORIES', ['ANNIVERSARY', 'PERSONAL', 'SPECIAL OCCASION'])
	const listener = jest.fn()
	property.subscribe(listener)

	expect(property.hasValue('FOO')).toEqual(false)
	expect(property.hasValue('ANNIVERSARY')).toEqual(true)

	expect(listener.mock.calls.length).toEqual(0)
})

it('Property should expose an hasValue method - no multivalue', () => {
	const property = new Property('X-FOO', 'BAR')
	const listener = jest.fn()
	property.subscribe(listener)

	expect(() => {
		property.hasValue('FOO')
	}).toThrow(TypeError)

	expect(listener.mock.calls.length).toEqual(0)
})

it('Property should expose an removeValue method', () => {
	const property = new Property('CATEGORIES', ['ANNIVERSARY', 'PERSONAL', 'SPECIAL OCCASION'])
	const listener = jest.fn()
	property.subscribe(listener)

	property.removeValue('FOO')
	expect(listener.mock.calls.length).toEqual(0)

	property.removeValue('ANNIVERSARY')
	expect(listener.mock.calls.length).toEqual(1)
	expect(listener).toHaveBeenCalledWith()
})

it('Property should expose an removeValue method - no multivalue', () => {
	const property = new Property('X-FOO', 'BAR')
	const listener = jest.fn()
	property.subscribe(listener)

	expect(() => {
		property.removeValue('FOO')
	}).toThrow(TypeError)

	expect(listener.mock.calls.length).toEqual(0)
})
