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
import ToDoComponent from '../../../../src/components/root/toDoComponent.js';
import AbstractComponent from '../../../../src/components/abstractComponent.js';
import AbstractRecurringComponent from '../../../../src/components/root/abstractRecurringComponent.js';
import Property from '../../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../../src/errors/modificationNotAllowedError.js';
import DateTimeValue from '../../../../src/values/dateTimeValue.js';
import DurationValue from '../../../../src/values/durationValue.js';
import GeoProperty from '../../../../src/properties/geoProperty.js';

it('ToDoComponent should be defined', () => {
	expect(ToDoComponent).toBeDefined()
})

it('ToDoComponent should inherit from AbstractComponent', () => {
	const component = new ToDoComponent('VTODO')
	expect(component instanceof AbstractComponent).toEqual(true)
})

it('ToDoComponent should inherit from AbstractRecurringComponent', () => {
	const component = new ToDoComponent('VTODO')
	expect(component instanceof AbstractRecurringComponent).toEqual(true)
})

it('ToDoComponent should expose easy getter/setter for COMPLETED', () => {
	const value1 = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 1, 0, 0, 0)))
	const value2 = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 2, 0, 0, 0)))
	const value3 = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 3, 0, 0, 0)))
	const component = new ToDoComponent('VTODO', [['COMPLETED', value1]])

	expect(component.completedTime.jsDate.toISOString()).toEqual('2019-09-01T00:00:00.000Z')

	component.completedTime = value2
	expect(component.completedTime.jsDate.toISOString()).toEqual('2019-09-02T00:00:00.000Z')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.completedTime = value3
	}).toThrow(ModificationNotAllowedError);
	expect(component.completedTime.jsDate.toISOString()).toEqual('2019-09-02T00:00:00.000Z')

	component.unlock()

	component.completedTime = value1
	expect(component.completedTime.jsDate.toISOString()).toEqual('2019-09-01T00:00:00.000Z')
})

it('ToDoComponent should expose easy getter/setter for DUE', () => {
	const value1 = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 1, 0, 0, 0)))
	const value2 = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 2, 0, 0, 0)))
	const value3 = DateTimeValue.fromJSDate(new Date(Date.UTC(2019, 8, 3, 0, 0, 0)))
	const component = new ToDoComponent('VTODO', [['DUE', value1]])

	expect(component.dueTime.jsDate.toISOString()).toEqual('2019-09-01T00:00:00.000Z')

	component.dueTime = value2
	expect(component.dueTime.jsDate.toISOString()).toEqual('2019-09-02T00:00:00.000Z')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.dueTime = value3
	}).toThrow(ModificationNotAllowedError);
	expect(component.dueTime.jsDate.toISOString()).toEqual('2019-09-02T00:00:00.000Z')

	component.unlock()

	component.dueTime = value1
	expect(component.dueTime.jsDate.toISOString()).toEqual('2019-09-01T00:00:00.000Z')
})

it('ToDoComponent should expose easy getter/setter for DURATION', () => {
	const value1 = DurationValue.fromSeconds(60)
	const value2 = DurationValue.fromSeconds(60 * 60)
	const value3 = DurationValue.fromSeconds(60 * 60 * 24)
	const component = new ToDoComponent('VTODO', [['DURATION', value1]])

	expect(component.duration.totalSeconds).toEqual(60)

	component.duration = value2
	expect(component.duration.totalSeconds).toEqual(3600)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.duration = value3
	}).toThrow(ModificationNotAllowedError);
	expect(component.duration.totalSeconds).toEqual(3600)

	component.unlock()

	component.duration = value1
	expect(component.duration.totalSeconds).toEqual(60)
})

it('ToDoComponent should expose easy getter/setter for PERCENT', () => {
	const property = new Property('DESCRIPTION', 'I\'m a description 123')
	const component = new ToDoComponent('VTODO', [['PERCENT-COMPLETE', 40]])

	expect(component.percent).toEqual(40)

	component.percent = 50
	expect(component.percent).toEqual(50)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.percent = 60
	}).toThrow(ModificationNotAllowedError);
	expect(component.percent).toEqual(50)

	component.unlock()

	component.percent = 100
	expect(component.percent).toEqual(100)
})

it('ToDoComponent should expose easy getter/setter for DESCRIPTION', () => {
	const property = new Property('DESCRIPTION', 'I\'m a description 123')
	const component = new ToDoComponent('VTODO', [property])

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

it('ToDoComponent should expose easy getter/setter for LOCATION', () => {
	const property = new Property('LOCATION', 'I\'m a location 123')
	const component = new ToDoComponent('VTODO', [property])

	expect(component.location).toEqual('I\'m a location 123')

	component.location = 'I\'m a location 456'
	expect(component.location).toEqual('I\'m a location 456')

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.location = 'I\'m a location 567'
	}).toThrow(ModificationNotAllowedError);
	expect(component.location).toEqual('I\'m a location 456')

	component.unlock()

	component.location = 'I\'m a location 890'
	expect(component.location).toEqual('I\'m a location 890')
})

it('ToDoComponent should expose easy getter/setter for PRIORITY', () => {
	const property = new Property('PRIORITY', 0)
	const component = new ToDoComponent('VTODO', [property])

	expect(component.priority).toEqual(0)

	component.priority = 5
	expect(component.priority).toEqual(5)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.priority = 7
	}).toThrow(ModificationNotAllowedError);
	expect(component.priority).toEqual(5)

	component.unlock()

	component.priority = 9
	expect(component.priority).toEqual(9)

	expect(() => {
		component.priority = 99
	}).toThrow(TypeError);
	expect(component.priority).toEqual(9)
})

it('ToDoComponent should expose easy getter/setter for GEO', () => {
	const property = GeoProperty.fromPosition(54.32133, 10.13489)
	const component = new ToDoComponent('VTODO', [property])

	expect(component.geographicalPosition.latitude).toEqual(54.32133)
	expect(component.geographicalPosition.longitude).toEqual(10.13489)

	component.geographicalPosition.latitude = 42
	expect(component.geographicalPosition.latitude).toEqual(42)
	expect(component.geographicalPosition.longitude).toEqual(10.13489)

	component.lock()
	expect(component.isLocked()).toEqual(true)

	expect(() => {
		component.geographicalPosition.longitude = 55
	}).toThrow(ModificationNotAllowedError);
	expect(component.geographicalPosition.latitude).toEqual(42)
	expect(component.geographicalPosition.longitude).toEqual(10.13489)

	component.unlock()

	component.setGeographicalPositionFromLatitudeAndLongitude(12.34, 24.68)
	expect(component.geographicalPosition.latitude).toEqual(12.34)
	expect(component.geographicalPosition.longitude).toEqual(24.68)
})

it('ToDoComponent should provide access methods for RESOURCES', () => {
	const component = new ToDoComponent('VTODO')

	component.addResource('Chairs', 'en_US')
	component.addResource('Speaker phone', 'en_US')
	component.addResource('Table', 'en_US')

	component.addResource('Stühle', 'de')
	component.addResource('Freisprecheinrichtung', 'de')
	component.addResource('Tisch', 'de')

	component.addResource('Vehicle')
	component.addResource('VCR')
	component.addResource('Overhead projector')

	const englishIterator = component.getResourceIterator('en_US')
	const germanIterator = component.getResourceIterator('de')
	const noLangIterator = component.getResourceIterator()
	const unknownLangIterator = component.getResourceIterator('es')

	expect(component.toICALJs().toString()).toEqual('BEGIN:VTODO\r\n' +
		'RESOURCES;LANGUAGE=en_US:Chairs,Speaker phone,Table\r\n' +
		'RESOURCES;LANGUAGE=de:Stühle,Freisprecheinrichtung,Tisch\r\n' +
		'RESOURCES:Vehicle,VCR,Overhead projector\r\n' +
		'END:VTODO')

	expect(englishIterator.next().value).toEqual('Chairs')
	expect(englishIterator.next().value).toEqual('Speaker phone')
	expect(englishIterator.next().value).toEqual('Table')
	expect(englishIterator.next().value).toEqual(undefined)

	expect(germanIterator.next().value).toEqual('Stühle')
	expect(germanIterator.next().value).toEqual('Freisprecheinrichtung')
	expect(germanIterator.next().value).toEqual('Tisch')
	expect(germanIterator.next().value).toEqual(undefined)

	expect(noLangIterator.next().value).toEqual('Vehicle')
	expect(noLangIterator.next().value).toEqual('VCR')
	expect(noLangIterator.next().value).toEqual('Overhead projector')
	expect(noLangIterator.next().value).toEqual(undefined)

	expect(unknownLangIterator.next().value).toEqual(undefined)

	expect(component.getResourceList('en_US')).toEqual(['Chairs', 'Speaker phone', 'Table'])
	expect(component.getResourceList('de')).toEqual(['Stühle', 'Freisprecheinrichtung', 'Tisch'])
	expect(component.getResourceList()).toEqual(['Vehicle', 'VCR', 'Overhead projector'])
	expect(component.getResourceList('es')).toEqual([])

	expect(component.removeResource('Stühle', 'de')).toEqual(true)
	expect(component.removeResource('Table', 'de')).toEqual(false)

	expect(component.getResourceList('en_US')).toEqual(['Chairs', 'Speaker phone', 'Table'])
	expect(component.getResourceList('de')).toEqual(['Freisprecheinrichtung', 'Tisch'])
	expect(component.getResourceList()).toEqual(['Vehicle', 'VCR', 'Overhead projector'])
	expect(component.getResourceList('es')).toEqual([])

	component.clearAllResources('de')

	expect(component.getResourceList('en_US')).toEqual(['Chairs', 'Speaker phone', 'Table'])
	expect(component.getResourceList('de')).toEqual([])
	expect(component.getResourceList()).toEqual(['Vehicle', 'VCR', 'Overhead projector'])
	expect(component.getResourceList('es')).toEqual([])

	component.clearAllResources()

	expect(component.getResourceList('en_US')).toEqual(['Chairs', 'Speaker phone', 'Table'])
	expect(component.getResourceList('de')).toEqual([])
	expect(component.getResourceList()).toEqual([])
	expect(component.getResourceList('es')).toEqual([])

	expect(component.toICALJs().toString()).toEqual('BEGIN:VTODO\r\n' +
		'RESOURCES;LANGUAGE=en_US:Chairs,Speaker phone,Table\r\n' +
		'END:VTODO')

	component.removeResource('Chairs', 'en_US')
	component.removeResource('Speaker phone', 'en_US')
	component.removeResource('Table', 'en_US')

	expect(component.toICALJs().toString()).toEqual('BEGIN:VTODO\r\n' +
		'END:VTODO')
})

it('ToDoComponent should provide access methods for CONFERENCE', () => {
	const component = new ToDoComponent('VTODO')

	expect(component.getConferenceIterator().next().value).toEqual(undefined)
	expect(component.getConferenceList()).toEqual([])

	component.addConference('http://example.com/conference-system')
	component.addConference('http://example.com/conference-system123', 'Dial-In 123')
	component.addConference('http://example.com/conference-system456', 'Dial-In 456', ['AUDIO', 'SCREEN'])

	expect(component.getConferenceList().length).toEqual(3)

	const iterator = component.getConferenceIterator()
	const conf1 = iterator.next().value
	const conf2 = iterator.next().value
	const conf3 = iterator.next().value
	const conf4 = iterator.next().value

	expect(conf1.uri).toEqual('http://example.com/conference-system')

	expect(conf2.uri).toEqual('http://example.com/conference-system123')
	expect(conf2.label).toEqual('Dial-In 123')

	expect(conf3.uri).toEqual('http://example.com/conference-system456')
	expect(conf3.label).toEqual('Dial-In 456')
	expect(conf3.listAllFeatures()).toEqual(['AUDIO', 'SCREEN'])

	expect(conf4).toEqual(undefined)

	component.removeConference(conf2)
	// removing the same twice should not cause an error
	component.removeConference(conf2)

	expect(component.getConferenceList().length).toEqual(2)
	expect(component.getConferenceList()).toEqual([conf1, conf3])

	component.clearAllConferences()

	expect(component.getConferenceList().length).toEqual(0)
	expect(component.getConferenceList()).toEqual([])
})

it.each([
	[
		'none',
		undefined,
		undefined,
		undefined,
		true,
		true,
		true,
		true,
	],
	[
		'DTSTART only',
		DateTimeValue.fromJSDate(new Date('2025-01-01T10:30:00Z')),
		undefined,
		undefined,
		false,
		true,
		true,
		true,
	],
	[
		'DTSTART and DUE',
		DateTimeValue.fromJSDate(new Date('2025-01-01T10:30:00Z')),
		undefined,
		DateTimeValue.fromJSDate(new Date('2025-01-01T10:50:00Z')),
		false,
		true,
		false,
		false,
	],
	[
		'DTSTART and DUE (overlapping)',
		DateTimeValue.fromJSDate(new Date('2025-01-01T10:30:00Z')),
		undefined,
		DateTimeValue.fromJSDate(new Date('2025-01-01T11:50:00Z')),
		false,
		true,
		true,
		false,
	],
	[
		'DTSTART and DURATION',
		DateTimeValue.fromJSDate(new Date('2025-01-01T10:30:00Z')),
		DurationValue.fromSeconds(900),
		undefined,
		false,
		true,
		false,
		false,
	],
	[
		'DTSTART and DURATION (overlapping)',
		DateTimeValue.fromJSDate(new Date('2025-01-01T10:30:00Z')),
		DurationValue.fromSeconds(3600),
		undefined,
		false,
		true,
		true,
		false,
	],
])('ToDoComponent should report being inside a time frame - %s', (name, dtstart, duration, due, expectInTimeFrame1, expectInTimeFrame2, expectInTimeFrame3, expectInTimeFrame4) => {
	const component = new ToDoComponent('VTODO')

	if (dtstart) {
		component.addProperty(new Property('dtstart', dtstart))
	}
	if (duration) {
		component.addProperty(new Property('duration', duration))
	}
	if (due) {
		component.addProperty(new Property('due', due))
	}

	const date1 = DateTimeValue.fromJSDate(new Date('2025-01-01T09:00:00Z'))
	const date2 = DateTimeValue.fromJSDate(new Date('2025-01-01T09:59:59Z'))
	expect(component.isInTimeFrame(date1, date2)).toEqual(expectInTimeFrame1)

	const date3 = DateTimeValue.fromJSDate(new Date('2025-01-01T10:00:00Z'))
	const date4 = DateTimeValue.fromJSDate(new Date('2025-01-01T10:59:59Z'))
	expect(component.isInTimeFrame(date3, date4)).toEqual(expectInTimeFrame2)

	const date5 = DateTimeValue.fromJSDate(new Date('2025-01-01T11:00:00Z'))
	const date6 = DateTimeValue.fromJSDate(new Date('2025-01-01T11:59:59Z'))
	expect(component.isInTimeFrame(date5, date6)).toEqual(expectInTimeFrame3)

	const date7 = DateTimeValue.fromJSDate(new Date('2025-01-01T12:00:00Z'))
	const date8 = DateTimeValue.fromJSDate(new Date('2025-01-01T13:00:00Z'))
	expect(component.isInTimeFrame(date7, date8)).toEqual(expectInTimeFrame4)
})
