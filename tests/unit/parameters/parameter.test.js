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
import Parameter from "../../../src/parameters/parameter.js";
import ModificationNotAllowedError from "../../../src/errors/modificationNotAllowedError.js";

it('Parameter should be defined', () => {
	expect(Parameter).toBeDefined()
})

it('Parameter should take two parameters', () => {
	const parameter1 = new Parameter('name1', 'value1')
	expect(parameter1.name).toEqual('NAME1')
	expect(parameter1.value).toEqual('value1')

	const parameter2 = new Parameter('NAME2', ['value2-1', 'value2-2'])
	expect(parameter2.name).toEqual('NAME2')
	expect(parameter2.value).toEqual(['value2-1', 'value2-2'])
})

it('Parameter should be callable with one parameter', () => {
	const parameter1 = new Parameter('name1')
	expect(parameter1.name).toEqual('NAME1')
	expect(parameter1.value).toBeNull()
})

it('Parameter should provide a method saying whether it\'s multivalue', () => {
	const parameter1 = new Parameter('name1', 'value1')
	expect(parameter1.isMultiValue()).toEqual(false)

	const parameter2 = new Parameter('NAME2', ['value2-1', 'value2-2'])
	expect(parameter2.isMultiValue()).toEqual(true)
})

it('Parameter should be lockable', () => {
	const parameter1 = new Parameter('name1', 'value1')

	expect(parameter1.isLocked()).toEqual(false)

	parameter1.lock()
	expect(parameter1.isLocked()).toEqual(true)

	parameter1.unlock()
	expect(parameter1.isLocked()).toEqual(false)
})

it('Parameter should throw an error when trying to edit the name', () => {
	const parameter1 = new Parameter('name1', 'value1')
	expect(parameter1.name).toEqual('NAME1')

	expect(() => {
		parameter1.name = 'name2'
	}).toThrow(TypeError);
})

it('Parameter should throw an error when trying to edit a locked parameter - value setter', () => {
	const parameter1 = new Parameter('name1', 'value1')
	expect(parameter1.name).toEqual('NAME1')

	parameter1.value = 'value2'
	expect(parameter1.value).toEqual('value2')

	parameter1.lock()

	expect(() => {
		parameter1.value = 'value3'
	}).toThrow(ModificationNotAllowedError);
	expect(parameter1.value).toEqual('value2')
})

it('Parameter should be cloneable - single value', () => {
	const parameter1 = new Parameter('name1', 'value1')

	const parameter2 = parameter1.clone()
	expect(parameter2.name).toEqual('NAME1')
	expect(parameter2.value).toEqual('value1')
	expect(parameter2.isLocked()).toEqual(false)

	parameter1.lock()

	const parameter3 = parameter1.clone()
	expect(parameter3.name).toEqual('NAME1')
	expect(parameter3.value).toEqual('value1')
	expect(parameter3.isLocked()).toEqual(false)
})

it('Parameter should be cloneable - multiple value', () => {
	const parameter1 = new Parameter('name1', ['value1-1', 'value1-2'])

	const parameter2 = parameter1.clone()
	expect(parameter2.name).toEqual('NAME1')
	expect(parameter2.value).toEqual(['value1-1', 'value1-2'])
	expect(parameter2.isLocked()).toEqual(false)

	parameter1.lock()

	const parameter3 = parameter1.clone()
	expect(parameter3.name).toEqual('NAME1')
	expect(parameter3.value).toEqual(['value1-1', 'value1-2'])
	expect(parameter3.isLocked()).toEqual(false)

	expect(parameter1.value).not.toBe(parameter2.value)
	expect(parameter1.value).not.toBe(parameter3.value)
})

it('Parameter should provide a getFirstValue method - no multivalue', () => {
	const parameter1 = new Parameter('name1', 'value1')

	expect(parameter1.getFirstValue()).toEqual('value1')
})

it('Parameter should provide a getFirstValue method - multivalue', () => {
	const parameter1 = new Parameter('name1', ['value1-1', 'value1-2'])

	expect(parameter1.getFirstValue()).toEqual('value1-1')
})

it('Parameter should provide a getFirstValue method - multivalue but empty', () => {
	const parameter1 = new Parameter('name1', [])

	expect(parameter1.getFirstValue()).toEqual(null)
})

it('Parameter should provide a value iterator - no multivalue', () => {
	const parameter1 = new Parameter('name1', 'value1')

	const iterator = parameter1.getValueIterator()

	expect(iterator.next().value).toEqual('value1')
	expect(iterator.next().value).toEqual(undefined)
})

it('Parameter should provide a getFirstValue method - multivalue', () => {
	const parameter1 = new Parameter('name1', ['value1-1', 'value1-2'])

	const iterator = parameter1.getValueIterator()

	expect(iterator.next().value).toEqual('value1-1')
	expect(iterator.next().value).toEqual('value1-2')
	expect(iterator.next().value).toEqual(undefined)
})
