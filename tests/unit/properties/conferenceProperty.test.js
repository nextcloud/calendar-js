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
import ConferenceProperty from '../../../src/properties/conferenceProperty.js';
import Property from '../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('ConferenceProperty should be defined', () => {
	expect(ConferenceProperty).toBeDefined()
})

it('ConferenceProperty should inherit from Property', () => {
	const property = new ConferenceProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('ConferenceProperty should provide a feature iterator - without features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	const iterator = property.getFeatureIterator()
	expect(iterator.next().value).toBeUndefined()
})

it('ConferenceProperty should provide a feature iterator - with features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	const iterator = property.getFeatureIterator()
	expect(iterator.next().value).toEqual('AUDIO')
	expect(iterator.next().value).toEqual('VIDEO')
	expect(iterator.next().value).toBeUndefined()
})

it('ConferenceProperty should list all features - without features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.listAllFeatures()).toEqual([])
})

it('ConferenceProperty should list all features - with features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.listAllFeatures()).toEqual(['AUDIO', 'VIDEO'])
})

it('ConferenceProperty should add a new feature - no features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.hasParameter('FEATURE')).toEqual(false)

	property.addFeature('CHAT')

	expect(property.hasParameter('FEATURE')).toEqual(true)
	expect(property.listAllFeatures()).toEqual(['CHAT'])
})

it('ConferenceProperty should add a new feature - with features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	property.addFeature('CHAT')

	expect(property.listAllFeatures()).toEqual(['AUDIO', 'VIDEO', 'CHAT'])
})

it('ConferenceProperty should add a new feature - with features - do not add double', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	property.addFeature('VIDEO')

	expect(property.listAllFeatures()).toEqual(['AUDIO', 'VIDEO'])
})

it('ConferenceProperty should add a new feature - existent feature', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO,CHAT;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	property.removeFeature('VIDEO')

	expect(property.listAllFeatures()).toEqual(['AUDIO', 'CHAT'])
})

it('ConferenceProperty should add a new feature - non-existent feature', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO,CHAT;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	property.removeFeature('MODERATOR')

	expect(property.listAllFeatures()).toEqual(['AUDIO', 'VIDEO', 'CHAT'])
})

it('ConferenceProperty should provide a feature to check if it has a feature - with features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO,CHAT;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.hasFeature('AUDIO')).toEqual(true)
	expect(property.hasFeature('MODERATOR')).toEqual(false)
})

it('ConferenceProperty should provide a feature to check if it has a feature - without features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.hasFeature('AUDIO')).toEqual(false)
	expect(property.hasFeature('MODERATOR')).toEqual(false)
})

it('ConferenceProperty should provide a feature to check if it has a feature - broken features param', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO,CHAT;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)
	property.getParameter('FEATURE').value = 'test123'

	expect(property.hasFeature('AUDIO')).toEqual(false)
	expect(property.hasFeature('MODERATOR')).toEqual(false)
})

it('ConferenceProperty should provide a way to delete all features', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.hasParameter('FEATURE')).toEqual(true)

	property.clearAllFeatures()

	expect(property.hasParameter('FEATURE')).toEqual(false)
})

it('ConferenceProperty should provide getter/setter for label', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO,CHAT;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.label).toEqual('Attendee dial-in')

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.label = 'Landline'
	}).toThrow(ModificationNotAllowedError);
	expect(property.label).toEqual('Attendee dial-in')

	property.unlock()

	property.label = 'voip'
	expect(property.label).toEqual('voip')
})

it('ConferenceProperty should provide getter/setter for uri', () => {
	const icalProperty = ICAL.Property.fromString('CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO,CHAT;' +
		'LABEL=Attendee dial-in:https://chat.example.com/audio?id=123456')
	const property = ConferenceProperty.fromICALJs(icalProperty)

	expect(property.uri).toEqual('https://chat.example.com/audio?id=123456')

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.uri = 'https://chat.example.com/audio?id=123456789'
	}).toThrow(ModificationNotAllowedError);
	expect(property.uri).toEqual('https://chat.example.com/audio?id=123456')

	property.unlock()

	property.uri = 'https://chat.example.com/audio?id=123'
	expect(property.uri).toEqual('https://chat.example.com/audio?id=123')
})

// TODO: this needs upstream fixing
// it('ConferenceProperty should create a property from uri, label and feature', () => {
// 	const prop1 = ConferenceProperty.fromURILabelAndFeatures('URI1')
// 	const prop2 = ConferenceProperty.fromURILabelAndFeatures('URI1', 'label123')
// 	const prop3 = ConferenceProperty.fromURILabelAndFeatures('URI1', 'label123', ['FEATURE1', 'FEATURE2'])
// 	const prop4 = ConferenceProperty.fromURILabelAndFeatures('URI1', null, ['FEATURE1', 'FEATURE2'])
//
// 	expect(prop1.toICALJs().toICALString()).toEqual('CONFERENCE;VALUE=URI:URI1')
// 	expect(prop2.toICALJs().toICALString()).toEqual('CONFERENCE;LABEL=label123;VALUE=URI:URI1')
// 	expect(prop3.toICALJs().toICALString()).toEqual('CONFERENCE;LABEL=label123;FEATURE=FEATURE1,FEATURE2:URI1')
// 	expect(prop4.toICALJs().toICALString()).toEqual()
// })
