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
import AttachmentProperty from '../../../src/properties/attachmentProperty.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import Property from '../../../src/properties/property.js';

it('AttachmentProperty should be defined', () => {
	expect(AttachmentProperty).toBeDefined()
})

it('AttachmentProperty should inherit from Property', () => {
	const property = new AttachmentProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('AttachmentProperty should provide an easy getter for the formatType', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.formatType).toEqual('text/plain')
})

it('AttachmentProperty should provide an easy setter for formatType', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.formatType).toEqual('text/plain')

	property.formatType = 'text/csv'
	expect(property.formatType).toEqual('text/csv')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.formatType = 'application/json'
	}).toThrow(ModificationNotAllowedError);
	expect(property.formatType).toEqual('text/csv')

	property.unlock()

	property.formatType = 'text/plain'
	expect(property.formatType).toEqual('text/plain')
})

it('AttachmentProperty should provide an easy getter for uri - undecorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.uri).toEqual('ftp://example.com/pub/docs/agenda.doc')
})

it('AttachmentProperty should provide an easy getter for uri - decorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.uri).toEqual(null)
})

it('AttachmentProperty should provide an easy setter for uri - undecorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.uri).toEqual('ftp://example.com/pub/docs/agenda.doc')

	property.uri = 'uri1'
	expect(property.uri).toEqual('uri1')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.uri = 'uri2'
	}).toThrow(ModificationNotAllowedError);
	expect(property.uri).toEqual('uri1')

	property.unlock()

	property.uri = 'uri3'
	expect(property.uri).toEqual('uri3')
})

it('AttachmentProperty should provide an easy setter for uri - decorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.uri).toEqual(null)

	property.uri = 'uri1'
	expect(property.uri).toEqual('uri1')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.uri = 'uri2'
	}).toThrow(ModificationNotAllowedError);
	expect(property.uri).toEqual('uri1')

	property.unlock()

	property.uri = 'uri3'
	expect(property.uri).toEqual('uri3')
})

it('AttachmentProperty should provide an easy getter for the encoding - undecorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.encoding).toEqual(null)
})

it('AttachmentProperty should provide an easy getter for the encoding - decorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)


	expect(property.encoding).toEqual('BASE64')
})

it('AttachmentProperty should provide an easy getter for data - undecorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.data).toEqual(null)
})

it('AttachmentProperty should provide an easy getter for data - decorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.data).toEqual('The quick brown fox jumps over the lazy dog.')
})

it('AttachmentProperty should provide an easy setter for data - undecorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.data).toEqual(null)

	property.data = 'The quick brown fox jumps over the lazy dog.'

	expect(property.data).toEqual('The quick brown fox jumps over the lazy dog.')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.data = 'The lazy dog jumps over the quick brown fox.'
	}).toThrow(ModificationNotAllowedError);
	expect(property.data).toEqual('The quick brown fox jumps over the lazy dog.')

	property.unlock()

	property.data = 'data123'
	expect(property.data).toEqual('data123')
})

it('AttachmentProperty should provide an easy setter for data - decorated', () => {
	const icalProperty = ICAL.Property.fromString('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGhlIH' +
		'F1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=')
	const property = AttachmentProperty.fromICALJs(icalProperty)

	expect(property.data).toEqual('The quick brown fox jumps over the lazy dog.')


	property.data = 'data123'
	expect(property.data).toEqual('data123')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.data = 'The lazy dog jumps over the quick brown fox.'
	}).toThrow(ModificationNotAllowedError);
	expect(property.data).toEqual('data123')

	property.unlock()

	property.data = 'data456'
	expect(property.data).toEqual('data456')
})

it('AttachmentProperty should provide a constructor from data - without formattype', () => {
	const property = AttachmentProperty.fromData('Test123')

	expect(property.toICALJs().toICALString()).toEqual('ATTACH;ENCODING=BASE64;VALUE=BINARY:VGVzdDEyMw==')
})

it('AttachmentProperty should provide a constructor from data - with formattype', () => {
	const property = AttachmentProperty.fromData('Test123', 'text/plain')

	expect(property.toICALJs().toICALString()).toEqual('ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY:VGVzdDEyMw==')
})

it('AttachmentProperty should provide a constructor from link - without formattype', () => {
	const property = AttachmentProperty.fromLink('http://nextcloud.com')

	expect(property.toICALJs().toICALString()).toEqual('ATTACH:http://nextcloud.com')
})

it('AttachmentProperty should provide a constructor from link - with formattype', () => {
	const property = AttachmentProperty.fromLink('http://nextcloud.com', 'text/calendar')

	expect(property.toICALJs().toICALString()).toEqual('ATTACH;FMTTYPE=text/calendar:http://nextcloud.com')
})

