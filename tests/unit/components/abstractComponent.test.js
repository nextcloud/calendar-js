/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
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
import AbstractComponent from '../../../src/components/abstractComponent.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import Property from '../../../src/properties/property.js';
import ExpectedICalJSError from '../../../src/errors/expectedICalJSError.js';

it('AbstractComponent should be defined()', () => {
	expect(AbstractComponent).toBeDefined()
})

it('AbstractComponent should be instantiable with one argument', () => {
	const component = new AbstractComponent('Name123')
	expect(component.name).toEqual('NAME123')
})

it('AbstractComponent should be instantiable with two arguments', () => {
	const property1 = {
		name: 'PROP1',
		getFirstValue: jest.fn()
	}
	const property2 = {
		name: 'PROP2',
		getFirstValue: jest.fn()
	}
	const component = new AbstractComponent('Name456', [property1, property2])
	expect(component.name).toEqual('NAME456')
	expect(component.hasProperty('PROP1')).toEqual(true)
	expect(component.hasProperty('PROP2')).toEqual(true)
	expect(component.getFirstProperty('PROP1')).toEqual(property1)
	expect(component.getFirstProperty('PROP2')).toEqual(property2)
})

it('AbstractComponent should be instantiable with three arguments', () => {
	const property1 = {
		name: 'PROP1',
		getFirstValue: jest.fn()
	}
	const property2 = {
		name: 'PROP2',
		getFirstValue: jest.fn()
	}
	const subComp1 = {
		name: 'COMP1'
	}
	const subComp2 = {
		name: 'COMP2'
	}

	const component = new AbstractComponent('Name456', [property1, property2], [subComp1, subComp2])
	expect(component.name).toEqual('NAME456')
	expect(component.hasProperty('PROP1')).toEqual(true)
	expect(component.hasProperty('PROP2')).toEqual(true)
	expect(component.getFirstProperty('PROP1')).toEqual(property1)
	expect(component.getFirstProperty('PROP2')).toEqual(property2)
	expect(component.hasComponent('COMP1')).toEqual(true)
	expect(component.hasComponent('COMP2')).toEqual(true)
	expect(component.getFirstComponent('COMP1')).toEqual(subComp1)
	expect(component.getFirstComponent('COMP2')).toEqual(subComp2)
})

it('AbstractComponent should be instantiable with four arguments', () => {
	const property1 = {
		name: 'PROP1',
		getFirstValue: jest.fn()
	}
	const property2 = {
		name: 'PROP2',
		getFirstValue: jest.fn()
	}
	const subComp1 = {
		name: 'COMP1'
	}
	const subComp2 = {
		name: 'COMP2'
	}
	const root = {}

	const component = new AbstractComponent('Name456', [property1, property2], [subComp1, subComp2], root)
	expect(component.name).toEqual('NAME456')
	expect(component.hasProperty('PROP1')).toEqual(true)
	expect(component.hasProperty('PROP2')).toEqual(true)
	expect(component.getFirstProperty('PROP1')).toEqual(property1)
	expect(component.getFirstProperty('PROP2')).toEqual(property2)
	expect(component.hasComponent('COMP1')).toEqual(true)
	expect(component.hasComponent('COMP2')).toEqual(true)
	expect(component.getFirstComponent('COMP1')).toEqual(subComp1)
	expect(component.getFirstComponent('COMP2')).toEqual(subComp2)
	expect(component.root === root).toEqual(true)
})

it('AbstractComponent should be instantiable with five arguments', () => {
	const property1 = {
		name: 'PROP1',
		getFirstValue: jest.fn()
	}
	const property2 = {
		name: 'PROP2',
		getFirstValue: jest.fn()
	}
	const subComp1 = {
		name: 'COMP1'
	}
	const subComp2 = {
		name: 'COMP2'
	}
	const root = {}
	const parent = {}

	const component = new AbstractComponent('Name456', [property1, property2], [subComp1, subComp2], root, parent)
	expect(component.name).toEqual('NAME456')
	expect(component.hasProperty('PROP1')).toEqual(true)
	expect(component.hasProperty('PROP2')).toEqual(true)
	expect(component.getFirstProperty('PROP1')).toEqual(property1)
	expect(component.getFirstProperty('PROP2')).toEqual(property2)
	expect(component.hasComponent('COMP1')).toEqual(true)
	expect(component.hasComponent('COMP2')).toEqual(true)
	expect(component.getFirstComponent('COMP1')).toEqual(subComp1)
	expect(component.getFirstComponent('COMP2')).toEqual(subComp2)
	expect(component.root === root).toEqual(true)
	expect(component.parent === parent).toEqual(true)
})

it('AbstractComponent should provide a setter for root', () => {
	const root1 = {
		name: 'Root1'
	}
	const root2 = {
		name: 'Root2'
	}
	const root3 = {
		name: 'Root3'
	}
	const component = new AbstractComponent('COMP')

	expect(component.root).toEqual(null)

	component.root = root1
	expect(component.root).toEqual(root1)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.root = root2
	}).toThrow(ModificationNotAllowedError);
	expect(component.root).toEqual(root1)

	component.unlock()

	component.root = root3
	expect(component.root).toEqual(root3)
})

it('AbstractComponent should provide a setter for parent', () => {
	const parent1 = {
		name: 'parent1'
	}
	const parent2 = {
		name: 'parent2'
	}
	const parent3 = {
		name: 'parent3'
	}
	const component = new AbstractComponent('COMP')

	expect(component.parent).toEqual(null)

	component.parent = parent1
	expect(component.parent).toEqual(parent1)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.parent = parent2
	}).toThrow(ModificationNotAllowedError);
	expect(component.parent).toEqual(parent1)

	component.unlock()

	component.parent = parent3
	expect(component.parent).toEqual(parent3)
})

it('AbstractComponent should get the first property - existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		getFirstValue: jest.fn(() => 'Return value 1')
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		getFirstValue: jest.fn(() => 'Return value 2')
	}
	const component = new AbstractComponent('Name456', [property1, property2])
	expect(component.getFirstProperty('PROP1')).toEqual(property1)
})

it('AbstractComponent should get the first property - non-existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		getFirstValue: jest.fn()
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		getFirstValue: jest.fn()
	}
	const component = new AbstractComponent('Name456', [property1, property2])
	expect(component.getFirstProperty('PROP2')).toEqual(null)
})

it('AbstractComponent should get the first property\'s first value - existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		getFirstValue: jest.fn(() => 'Return value 1')
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		getFirstValue: jest.fn(() => 'Return value 2')
	}
	const component = new AbstractComponent('Name456', [property1, property2])
	expect(component.getFirstPropertyFirstValue('PROP1')).toEqual('Return value 1')
})

it('AbstractComponent should get the first property\'s first value - non-existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		getFirstValue: jest.fn(() => 'Return value 1')
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		getFirstValue: jest.fn(() => 'Return value 2')
	}
	const component = new AbstractComponent('Name456', [property1, property2])
	expect(component.getFirstPropertyFirstValue('PROP2')).toEqual(null)
})

it('AbstractComponent should update a property with value - existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456', [property1, property2])

	expect(property1.value).toEqual('Return value 1')
	expect(property2.value).toEqual('Return value 2')

	component.updatePropertyWithValue('PROP1', 'Return value 99')

	expect(property1.value).toEqual('Return value 99')
	expect(property2.value).toEqual('Return value 2')
})

it('AbstractComponent should update a property with value - non-existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456', [property1, property2])

	expect(property1.value).toEqual('Return value 1')
	expect(property2.value).toEqual('Return value 2')

	component.updatePropertyWithValue('PROP2', 'foobar 123')

	expect(property1.value).toEqual('Return value 1')
	expect(property2.value).toEqual('Return value 2')

	const property3 = component.getFirstProperty('PROP2')
	expect(property3.name).toEqual('PROP2')
	expect(property3.value).toEqual('foobar 123')
})

it('AbstractComponent should return a property iterator - by property name - existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const property3 = {
		name: 'PROP2',
		key: '_prop2_1',
		value: 'Return value 3'
	}

	const component = new AbstractComponent('Name456', [property1, property2, property3])

	const iterator = component.getPropertyIterator('PROP1')

	expect(iterator.next().value).toEqual(property1)
	expect(iterator.next().value).toEqual(property2)
	expect(iterator.next().value).toEqual(undefined)
})

it('AbstractComponent should return a property iterator - by property name - non-existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const property3 = {
		name: 'PROP2',
		key: '_prop2_1',
		value: 'Return value 3'
	}

	const component = new AbstractComponent('Name456', [property1, property2, property3])

	const iterator = component.getPropertyIterator('PROP3')

	expect(iterator.next().value).toEqual(undefined)
})

it('AbstractComponent should return a property iterator - without name', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const property3 = {
		name: 'PROP2',
		key: '_prop2_1',
		value: 'Return value 3'
	}

	const component = new AbstractComponent('Name456', [property1, property2, property3])

	const iterator = component.getPropertyIterator()

	expect(iterator.next().value).toEqual(property1)
	expect(iterator.next().value).toEqual(property2)
	expect(iterator.next().value).toEqual(property3)
	expect(iterator.next().value).toEqual(undefined)
})

it('AbstractComponent should add a property - first of name', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)
})

it('AbstractComponent should add a property - not first of name', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)
	expect(component.addProperty(property2)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)
})

it('AbstractComponent should add the same property twice', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)
	expect(component.addProperty(property1)).toEqual(false)

	expect(component.hasProperty('PROP1')).toEqual(true)
})

it('AbstractComponent should provide a method to check if it has a property', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)
})

it('AbstractComponent should provide a method to delete a property - non-existent key', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}

	const component = new AbstractComponent('Name456')

	expect(component.deleteProperty(property1)).toEqual(false)
})

it('AbstractComponent should provide a method to delete a property - non-existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)
	expect(component.addProperty(property2)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)

	expect(component.deleteProperty(property1)).toEqual(true)
	expect(component.deleteProperty(property1)).toEqual(false)
})

it('AbstractComponent should provide a method to delete a property - existent', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)
	expect(component.addProperty(property2)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)

	expect(component.deleteProperty(property1)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)
})

it('AbstractComponent should provide a method to delete a property - existent - last one', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)
	expect(component.addProperty(property2)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)

	expect(component.deleteProperty(property1)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)

	expect(component.deleteProperty(property2)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(false)
})

it('AbstractComponent should provide a method to delete all properties of a name', () => {
	const property1 = {
		name: 'PROP1',
		key: '_prop1_1',
		value: 'Return value 1'
	}
	const property2 = {
		name: 'PROP1',
		key: '_prop1_2',
		value: 'Return value 2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasProperty('PROP1')).toEqual(false)

	expect(component.addProperty(property1)).toEqual(true)
	expect(component.addProperty(property2)).toEqual(true)

	expect(component.hasProperty('PROP1')).toEqual(true)

	component.deleteAllProperties('PROP1')

	expect(component.hasProperty('PROP1')).toEqual(false)
})

it('AbstractComponent should get the first component - existent', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456', [], [component1, component2])
	expect(component.getFirstComponent('COMP1')).toEqual(component1)
})

it('AbstractComponent should get the first component - non-existent', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456', [], [component1, component2])
	expect(component.getFirstComponent('COMP2')).toEqual(null)
})


it('AbstractComponent should return a component iterator - by component name - existent', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component3 = {
		name: 'COMP2',
		key: '_comp2_1'
	}
	const component = new AbstractComponent('Name456', [], [component1, component2, component3])

	const iterator = component.getComponentIterator('COMP1')

	expect(iterator.next().value).toEqual(component1)
	expect(iterator.next().value).toEqual(component2)
	expect(iterator.next().value).toEqual(undefined)
})

it('AbstractComponent should return a component iterator - by component name - non-existent', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component3 = {
		name: 'COMP2',
		key: '_comp2_1'
	}
	const component = new AbstractComponent('Name456', [], [component1, component2, component3])

	const iterator = component.getComponentIterator('COMP3')

	expect(iterator.next().value).toEqual(undefined)
})

it('AbstractComponent should return a component iterator - without name', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component3 = {
		name: 'COMP2',
		key: '_comp2_1'
	}
	const component = new AbstractComponent('Name456', [], [component1, component2, component3])

	const iterator = component.getComponentIterator()

	expect(iterator.next().value).toEqual(component1)
	expect(iterator.next().value).toEqual(component2)
	expect(iterator.next().value).toEqual(component3)
	expect(iterator.next().value).toEqual(undefined)
})

it('AbstractComponent should add a component - first of name', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)
})

it('AbstractComponent should add a component - not first of name', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)
	expect(component.addComponent(component2)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)
})

it('AbstractComponent should add the same component twice', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)
	expect(component.addComponent(component1)).toEqual(false)

	expect(component.hasComponent('COMP1')).toEqual(true)
})

it('AbstractComponent should provide a method to check if it has a component', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)
})

it('AbstractComponent should provide a method to delete a component - non-existent key', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}

	const component = new AbstractComponent('Name456')

	expect(component.deleteComponent(component1)).toEqual(false)
})

it('AbstractComponent should provide a method to delete a component - non-existent', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)
	expect(component.addComponent(component2)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)

	expect(component.deleteComponent(component1)).toEqual(true)
	expect(component.deleteComponent(component1)).toEqual(false)

	expect(component.hasComponent('COMP1')).toEqual(true)
})

it('AbstractComponent should provide a method to delete a component - existent', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)
	expect(component.addComponent(component2)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)

	expect(component.deleteComponent(component1)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)
})

it('AbstractComponent should provide a method to delete a component - existent - last one', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)
	expect(component.addComponent(component2)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)

	expect(component.deleteComponent(component1)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)

	expect(component.deleteComponent(component2)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(false)
})

it('AbstractComponent should provide a method to delete all components of a name', () => {
	const component1 = {
		name: 'COMP1',
		key: '_comp1_1'
	}
	const component2 = {
		name: 'COMP1',
		key: '_comp1_2'
	}
	const component = new AbstractComponent('Name456')

	expect(component.hasComponent('COMP1')).toEqual(false)

	expect(component.addComponent(component1)).toEqual(true)
	expect(component.addComponent(component2)).toEqual(true)

	expect(component.hasComponent('COMP1')).toEqual(true)

	component.deleteAllComponents('COMP1')

	expect(component.hasComponent('COMP1')).toEqual(false)
})

it('AbstractComponent should be lockable - including all properties and components', () => {
	const property1 = {
		name: 'PROP1',
		lock: jest.fn(),
		unlock: jest.fn()
	}
	const property2 = {
		name: 'PROP2',
		lock: jest.fn(),
		unlock: jest.fn()
	}
	const subComp1 = {
		name: 'COMP1',
		lock: jest.fn(),
		unlock: jest.fn()
	}
	const subComp2 = {
		name: 'COMP2',
		lock: jest.fn(),
		unlock: jest.fn()
	}

	const component = new AbstractComponent('Name456', [property1, property2], [subComp1, subComp2])

	component.lock()

	expect(component.isLocked()).toEqual(true)

	expect(property1.lock.mock.calls.length).toEqual(1)
	expect(property2.lock.mock.calls.length).toEqual(1)
	expect(subComp1.lock.mock.calls.length).toEqual(1)
	expect(subComp2.lock.mock.calls.length).toEqual(1)
})

it('AbstractComponent should be unlockable - including all properties and components', () => {
	const property1 = {
		name: 'PROP1',
		lock: jest.fn(),
		unlock: jest.fn()
	}
	const property2 = {
		name: 'PROP2',
		lock: jest.fn(),
		unlock: jest.fn()
	}
	const subComp1 = {
		name: 'COMP1',
		lock: jest.fn(),
		unlock: jest.fn()
	}
	const subComp2 = {
		name: 'COMP2',
		lock: jest.fn(),
		unlock: jest.fn()
	}

	const component = new AbstractComponent('Name456', [property1, property2], [subComp1, subComp2])

	component.lock()

	expect(component.isLocked()).toEqual(true)

	expect(property1.lock.mock.calls.length).toEqual(1)
	expect(property2.lock.mock.calls.length).toEqual(1)
	expect(subComp1.lock.mock.calls.length).toEqual(1)
	expect(subComp2.lock.mock.calls.length).toEqual(1)

	component.unlock()

	expect(component.isLocked()).toEqual(false)

	expect(property1.unlock.mock.calls.length).toEqual(1)
	expect(property2.unlock.mock.calls.length).toEqual(1)
	expect(subComp1.unlock.mock.calls.length).toEqual(1)
	expect(subComp2.unlock.mock.calls.length).toEqual(1)
})

it('AbstractComponent should be cloneable', () => {
	const property1 = {
		name: 'PROP1',
		clone: jest.fn(() => ({
			name: 'PROP1',
			isCopy: true
		}))
	}
	const property2 = {
		name: 'PROP2',
		clone: jest.fn(() => ({
			name: 'PROP2',
			isCopy: true
		}))
	}
	const subComp1 = {
		name: 'COMP1',
		clone: jest.fn(() => ({
			name: 'COMP1',
			isCopy: true
		}))
	}
	const subComp2 = {
		name: 'COMP2',
		clone: jest.fn(() => ({
			name: 'COMP2',
			isCopy: true
		}))
	}

	const component = new AbstractComponent('Name456', [property1, property2], [subComp1, subComp2])

	const component2 = component.clone()

	expect(component === component2).toEqual(false)

	expect(property1.clone.mock.calls.length).toEqual(1)
	expect(property2.clone.mock.calls.length).toEqual(1)
	expect(subComp1.clone.mock.calls.length).toEqual(1)
	expect(subComp2.clone.mock.calls.length).toEqual(1)
})

it('AbstractComponent should provide a constructor from ICAL.JS', () => {
	const property1 = new Property('X-PROPERTY-1', 'x-prop-value-1')
	const property2 = new Property('X-PROPERTY-2', 'x-prop-value-2')

	const subComp1 = new AbstractComponent('COMP2')
	subComp1.addProperty(property2)

	const component = new AbstractComponent('Name456', [property1], [subComp1])

	expect(component.toICALJs().toString()).toEqual('BEGIN:NAME456\r\n' +
		'X-PROPERTY-1:x-prop-value-1\r\n' +
		'BEGIN:COMP2\r\n' +
		'X-PROPERTY-2:x-prop-value-2\r\n' +
		'END:COMP2\r\n' +
		'END:NAME456')
})

it('AbstractComponent should be convertible to ICAL.JS', () => {
	const ics = 'BEGIN:NAME456\r\n' +
		'X-PROPERTY-1:x-prop-value-1\r\n' +
		'BEGIN:COMP2\r\n' +
		'X-PROPERTY-2:x-prop-value-2\r\n' +
		'END:COMP2\r\n' +
		'END:NAME456'

	const jcal = ICAL.parse(ics)
	const icalComp = new ICAL.Component(jcal)

	const component = AbstractComponent.fromICALJs(icalComp)
	expect(component.toICALJs().toString()).toEqual(ics)
})

it('AbstractComponent should throw an error when fromICALJS is not called with ICAL.JS object', () => {
	expect(() => {
		AbstractComponent.fromICALJs(true)
	}).toThrow(ExpectedICalJSError);
})
