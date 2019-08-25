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
import AlarmComponent from '../../../../src/components/nested/alarmComponent.js';
import AbstractComponent from '../../../../src/components/abstractComponent.js';
import Property from '../../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../../src/errors/modificationNotAllowedError.js';
import TriggerProperty from '../../../../src/properties/triggerProperty.js';
import DurationValue from '../../../../src/values/durationValue.js';
import DateTimeValue from '../../../../src/values/dateTimeValue.js';
import AttendeeProperty from '../../../../src/properties/attendeeProperty.js';

it('AlarmComponent should be defined', () => {
	expect(AlarmComponent).toBeDefined()
})

it('AlarmComponent should inherit from AbstractComponent', () => {
	const component = new AlarmComponent('VALARM')
	expect(component instanceof AbstractComponent).toEqual(true)
})

it('AlarmComponent should expose easy getter/setter for action', () => {
	const property = new Property('ACTION', 'AUDIO')
	const component = new AlarmComponent('VALARM', [property])

	expect(component.action).toEqual('AUDIO')

	component.action = 'DISPLAY'
	expect(component.action).toEqual('DISPLAY')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.action = 'EMAIL'
	}).toThrow(ModificationNotAllowedError);
	expect(component.action).toEqual('DISPLAY')

	component.unlock()

	component.action = 'EMAIL'
	expect(component.action).toEqual('EMAIL')
})

it('AlarmComponent should provide easy getter/setter for trigger', () => {
	const property1 = TriggerProperty.fromRelativeAndRelated(DurationValue.fromSeconds(-60))
	const property2 = TriggerProperty.fromAbsolute(DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 1, 0, 0, 0)), true))
	const property3 = TriggerProperty.fromRelativeAndRelated(DurationValue.fromSeconds(-60 * 60))
	const component = new AlarmComponent('VALARM', [property1])

	expect(component.trigger).toEqual(property1)

	component.action = property2
	expect(component.action).toEqual(property2)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.action = property3
	}).toThrow(ModificationNotAllowedError);
	expect(component.action).toEqual(property2)

	component.unlock()

	component.action = property1
	expect(component.action).toEqual(property1)
})

it('AlarmComponent should provide an easy setter for trigger with absolute alarm', () => {
	const component = new AlarmComponent('VALARM')
	component.setTriggerFromAbsolute(DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 1, 0, 0, 0)), true))

	expect(component.toICALJs().toString()).toEqual('BEGIN:VALARM\r\n' +
		'TRIGGER;VALUE=DATE-TIME:20190901T000000Z\r\n' +
		'END:VALARM')
})

it('AlarmComponent should provide an easy setter for trigger with relative alarm', () => {
	const component = new AlarmComponent('VALARM')
	component.setTriggerFromRelative(DurationValue.fromSeconds(-60 * 60))

	expect(component.toICALJs().toString()).toEqual('BEGIN:VALARM\r\n' +
		'TRIGGER;RELATED=START:-PT1H\r\n' +
		'END:VALARM')
})

it('AlarmComponent should expose easy getter/setter for description', () => {
	const property = new Property('DESCRIPTION', 'I\'m a description 123')
	const component = new AlarmComponent('VALARM', [property])

	expect(component.description).toEqual('I\'m a description 123')

	component.description = 'I\'m a description 456'
	expect(component.description).toEqual('I\'m a description 456')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.description = 'I\'m a description 567'
	}).toThrow(ModificationNotAllowedError);
	expect(component.description).toEqual('I\'m a description 456')

	component.unlock()

	component.description = 'I\'m a description 890'
	expect(component.description).toEqual('I\'m a description 890')
})

it('AlarmComponent should expose easy getter/setter for summary', () => {
	const property = new Property('SUMMARY', 'I\'m a summary 123')
	const component = new AlarmComponent('VALARM', [property])

	expect(component.summary).toEqual('I\'m a summary 123')

	component.summary = 'I\'m a summary 456'
	expect(component.summary).toEqual('I\'m a summary 456')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.summary = 'I\'m a summary 567'
	}).toThrow(ModificationNotAllowedError);
	expect(component.summary).toEqual('I\'m a summary 456')

	component.unlock()

	component.summary = 'I\'m a summary 890'
	expect(component.summary).toEqual('I\'m a summary 890')
})

it('AlarmComponent should expose easy getter/setter for duration', () => {
	const durationValue1 = DurationValue.fromSeconds(60 * 60)
	const durationValue2 = DurationValue.fromSeconds(60 * 60 * 24)
	const durationValue3 = DurationValue.fromSeconds(60 * 60 * 24 * 7)

	const component = new AlarmComponent('VALARM', [['DURATION', durationValue1]])

	expect(component.duration).toEqual(durationValue1)

	component.duration = durationValue2
	expect(component.duration).toEqual(durationValue2)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.duration = durationValue3
	}).toThrow(ModificationNotAllowedError);
	expect(component.duration).toEqual(durationValue2)

	component.unlock()

	component.duration = durationValue3
	expect(component.duration).toEqual(durationValue3)
})

it('AlarmComponent should expose easy getter/setter for repeat', () => {
	const property = new Property('REPEAT', 4)
	const component = new AlarmComponent('VALARM', [property])

	expect(component.repeat).toEqual(4)

	component.repeat = 42
	expect(component.repeat).toEqual(42)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.repeat = 99
	}).toThrow(ModificationNotAllowedError);
	expect(component.repeat).toEqual(42)

	component.unlock()

	component.repeat = 1337
	expect(component.repeat).toEqual(1337)
})

it('AlarmComponent should provide access methods for attendees', () => {
	const attendee1 = AttendeeProperty.fromNameAndEMail('Señor Email', 'email@example.com')
	const attendee2 = AttendeeProperty.fromNameAndEMail('Señor Email', 'email2@example.com')

	const component = new AlarmComponent('VALARM', [attendee1, attendee2])

	const iterator1 = component.getAttendeeIterator()
	expect(iterator1.next().value).toEqual(attendee1)
	expect(iterator1.next().value).toEqual(attendee2)
	expect(iterator1.next().value).toEqual(undefined)

	expect(component.getAttendeeList()).toEqual([attendee1, attendee2])

	component.removeAttendee(attendee1)

	const iterator2 = component.getAttendeeIterator()
	expect(iterator2.next().value).toEqual(attendee2)
	expect(iterator2.next().value).toEqual(undefined)

	expect(component.getAttendeeList()).toEqual([attendee2])

	component.clearAllAttendees()

	const iterator3 = component.getAttendeeIterator()
	expect(iterator3.next().value).toEqual(undefined)

	expect(component.getAttendeeList()).toEqual([])

	component.addAttendeeFromNameAndEMail('Bob', 'bob@example.com')
	component.addAttendeeFromNameAndEMail('John', 'john@example.com')

	const iterator4 = component.getAttendeeIterator()
	expect(iterator4.next().value.commonName).toEqual('Bob')
	expect(iterator4.next().value.commonName).toEqual('John')
	expect(iterator4.next().value).toEqual(undefined)
})
