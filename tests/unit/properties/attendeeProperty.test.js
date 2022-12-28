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
import AttendeeProperty from '../../../src/properties/attendeeProperty.js';
import Property from '../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('AttendeeProperty should be defined', () => {
	expect(AttendeeProperty).toBeDefined()
})

it('AttendeeProperty should inherit from property', () => {
	const property = new AttendeeProperty('ATTENDEE')
	expect(property instanceof Property).toEqual(true)
})

it('AttendeeProperty should provide a getter for the role - no role', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.role).toEqual('REQ-PARTICIPANT')
})

it('AttendeeProperty should provide a getter for the role - allowed role', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;ROLE=CHAIR:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.role).toEqual('CHAIR')
})

it('AttendeeProperty should provide a getter for the role - x-role', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;ROLE=CHAIR123:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.role).toEqual('REQ-PARTICIPANT')
})

it('AttendeeProperty should provide a setter for the role', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.role).toEqual('REQ-PARTICIPANT')

	property.role = 'CHAIR'
	expect(property.role).toEqual('CHAIR')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.role = 'NON-PARTICIPANT'
	}).toThrow(ModificationNotAllowedError);
	expect(property.role).toEqual('CHAIR')

	property.unlock()

	property.role = 'OPT-PARTICIPANT'
	expect(property.role).toEqual('OPT-PARTICIPANT')
})

it('AttendeeProperty should provide a getter for the user-type - no user-type', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.userType).toEqual('INDIVIDUAL')
})

it('AttendeeProperty should provide a getter for the user-type - allowed user-type', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;CUTYPE=GROUP:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.userType).toEqual('GROUP')
})

it('AttendeeProperty should provide a getter for the user-type - x-user-type', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;CUTYPE=GROUP123:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.userType).toEqual('UNKNOWN')
})

it('AttendeeProperty should provide a setter for the user-type', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.userType).toEqual('INDIVIDUAL')

	property.userType = 'GROUP'
	expect(property.userType).toEqual('GROUP')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.userType = 'RESOURCE'
	}).toThrow(ModificationNotAllowedError);
	expect(property.userType).toEqual('GROUP')

	property.unlock()

	property.userType = 'ROOM'
	expect(property.userType).toEqual('ROOM')
})

it('AttendeeProperty should provide a getter for rsvp - no rsvp', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.rsvp).toEqual(false)
})

it('AttendeeProperty should provide a getter for rsvp - rsvp true', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;RSVP=TRUE:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.rsvp).toEqual(true)
})

it('AttendeeProperty should provide a getter for rsvp - rsvp false', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;RSVP=FALSE:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.rsvp).toEqual(false)
})

it('AttendeeProperty should provide a setter for rsvp', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.rsvp).toEqual(false)

	property.rsvp = true
	expect(property.rsvp).toEqual(true)

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.rsvp = false
	}).toThrow(ModificationNotAllowedError);
	expect(property.rsvp).toEqual(true)

	property.unlock()

	property.rsvp = false
	expect(property.rsvp).toEqual(false)
})

it('AttendeeProperty should provide a getter for the participation status - no value', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.participationStatus).toEqual('NEEDS-ACTION')
})

it('AttendeeProperty should provide a getter for the participation status - allowed value', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.participationStatus).toEqual('DECLINED')
})

it('AttendeeProperty should provide a getter for the participation status - x-value', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.participationStatus).toEqual('NEEDS-ACTION')
})

it('AttendeeProperty should provide a getter for the participation status - value with parent', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123:mailto:mrbig@example.com')
	const parent = {
		name: 'VEVENT'
	}
	const property = AttendeeProperty.fromICALJs(icalValue)
	property.parent = parent

	expect(property.participationStatus).toEqual('NEEDS-ACTION')
})

it('AttendeeProperty should provide a setter for the participation-status', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.participationStatus).toEqual('DECLINED')

	property.participationStatus = 'ACCEPTED'
	expect(property.participationStatus).toEqual('ACCEPTED')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.participationStatus = 'TENTATIVE'
	}).toThrow(ModificationNotAllowedError);
	expect(property.participationStatus).toEqual('ACCEPTED')

	property.unlock()

	property.participationStatus = 'DELEGATED'
	expect(property.participationStatus).toEqual('DELEGATED')
})

it('AttendeeProperty should provide easy getter/setter for language', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

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
})

it('AttendeeProperty should provide easy getter/setter for email', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;PARTSTAT=DECLINED123;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.email).toEqual('mailto:mrbig@example.com')

	property.email = 'foo@bar.com'
	expect(property.email).toEqual('mailto:foo@bar.com')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.email = 'mailto:mrbig123@example.com'
	}).toThrow(ModificationNotAllowedError);
	expect(property.email).toEqual('mailto:foo@bar.com')

	property.unlock()

	property.email = 'bar@example.com'
	expect(property.email).toEqual('mailto:bar@example.com')
})

it('AttendeeProperty should provide easy getter/setter for commonName', () => {
	const icalValue = ICAL.Property.fromString('ATTENDEE;CN=Foo;PARTSTAT=DECLINED123;LANGUAGE=EN:mailto:mrbig@example.com')
	const property = AttendeeProperty.fromICALJs(icalValue)

	expect(property.commonName).toEqual('Foo')

	property.commonName = 'Mrs. Foo'
	expect(property.commonName).toEqual('Mrs. Foo')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.commonName = 'FOO BAR 123'
	}).toThrow(ModificationNotAllowedError);
	expect(property.commonName).toEqual('Mrs. Foo')

	property.unlock()

	property.commonName = 'Señor 1337'
	expect(property.commonName).toEqual('Señor 1337')
})

it('AttendeeProperty should provide a method to see if this is an organizer', () => {
	const prop1 = new AttendeeProperty('ATTENDEE')
	const prop2 = new AttendeeProperty('ORGANIZER')

	expect(prop1.isOrganizer()).toEqual(false)
	expect(prop2.isOrganizer()).toEqual(true)
})

it('AttendeeProperty should provide a constructor from name and email - no organiser', () => {
	const property = AttendeeProperty.fromNameAndEMail('Bob', 'bob1@example.com')

	expect(property.toICALJs().toICALString()).toEqual('ATTENDEE;CN=Bob:mailto:bob1@example.com')
})

it('AttendeeProperty should provide a constructor from name and email - organiser', () => {
	const property = AttendeeProperty.fromNameAndEMail('Bob', 'bob1@example.com', true)

	expect(property.toICALJs().toICALString()).toEqual('ORGANIZER;CN=Bob:mailto:bob1@example.com')
})

it('AttendeeProperty should provide a constructor from name, email, role, userType, rsvp - no organiser', () => {
	const property = AttendeeProperty.fromNameEMailRoleUserTypeAndRSVP('Bob', 'bob1@example.com', 'CHAIR', 'ROOM', true)

	expect(property.toICALJs().toICALString()).toEqual('ATTENDEE;CN=Bob;ROLE=CHAIR;CUTYPE=ROOM;RSVP=TRUE:mailto:bob1@example.com')
})

it('AttendeeProperty should provide a constructor from name, email, role, userType, rsvp - organiser', () => {
	const property = AttendeeProperty.fromNameEMailRoleUserTypeAndRSVP('Bob', 'bob1@example.com', 'CHAIR', 'ROOM', false, true)

	expect(property.toICALJs().toICALString()).toEqual('ORGANIZER;CN=Bob;ROLE=CHAIR;CUTYPE=ROOM;RSVP=FALSE:mailto:bob1@example.com')
})
