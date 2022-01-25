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
import JournalComponent from '../../../../src/components/root/journalComponent.js';
import AbstractComponent from '../../../../src/components/abstractComponent.js';
import AbstractRecurringComponent from '../../../../src/components/root/abstractRecurringComponent.js';
import TextProperty from '../../../../src/properties/textProperty.js'

it('JournalComponent should be defined', () => {
	expect(JournalComponent).toBeDefined()
})

it('JournalComponent should inherit from AbstractComponent', () => {
	const component = new JournalComponent('VJOURNAL')
	expect(component instanceof AbstractComponent).toEqual(true)
})

it('JournalComponent should inherit from AbstractRecurringComponent', () => {
	const component = new JournalComponent('VJOURNAL')
	expect(component instanceof AbstractRecurringComponent).toEqual(true)
})

it('JournalComponent should provide access methods for descriptions', () => {
	const component = new JournalComponent('VJOURNAL', [
		['DESCRIPTION', 'I\'m a description 123'],
		['DESCRIPTION', 'I\'m a description 456'],
		['DESCRIPTION', 'I\'m a description 789']
	])

	const iterator = component.getDescriptionIterator()
	const description1 = iterator.next().value
	const description2 = iterator.next().value
	const description3 = iterator.next().value
	const description4 = iterator.next().value

	expect(description1 instanceof TextProperty).toEqual(true)
	expect(description1.value).toEqual('I\'m a description 123')
	expect(description2 instanceof TextProperty).toEqual(true)
	expect(description2.value).toEqual('I\'m a description 456')
	expect(description3 instanceof TextProperty).toEqual(true)
	expect(description3.value).toEqual('I\'m a description 789')

	expect(description4).toEqual(undefined)

	expect(component.getDescriptionList()).toEqual([description1, description2, description3])

	component.removeDescription(description2)

	expect(component.getDescriptionList()).toEqual([description1, description3])

	component.clearAllDescriptions()

	expect(component.getDescriptionList()).toEqual([])

	component.addDescription('I\'m yet another description')

	const descriptions = component.getDescriptionList()
	expect(descriptions.length).toEqual(1)
	expect(descriptions[0] instanceof TextProperty).toEqual(true)
	expect(descriptions[0].value).toEqual('I\'m yet another description')
})
