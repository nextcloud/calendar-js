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
import ImageProperty from '../../../src/properties/imageProperty.js';
import Property from '../../../src/properties/property.js';
import AttachmentProperty from '../../../src/properties/attachmentProperty.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('ImageProperty should be defined', () => {
	expect(ImageProperty).toBeDefined()
})

it('ImageProperty should inherit from Property', () => {
	const property = new ImageProperty('')
	expect(property instanceof Property).toEqual(true)
})

it('ImageProperty should inherit from AttachmentProperty', () => {
	const property = new ImageProperty('')
	expect(property instanceof AttachmentProperty).toEqual(true)
})

it('ImageProperty should provide an easy setter/getter for display', () => {
	const property = new ImageProperty('IMAGE', 'http://example.com/image.jpg', [['fmttype', 'image/jpeg']])

	expect(property.display).toEqual('BADGE')

	property.display = 'FULLSIZE'
	expect(property.display).toEqual('FULLSIZE')

	property.lock()
	expect(property.isLocked()).toEqual(true)

	expect(() => {
		property.display = 'THUMBNAIL'
	}).toThrow(ModificationNotAllowedError);
	expect(property.display).toEqual('FULLSIZE')

	property.unlock()

	property.display = 'GRAPHIC'
	expect(property.display).toEqual('GRAPHIC')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE;FMTTYPE=image/jpeg;DISPLAY=GRAPHIC:http://example.com/image.jpg')
})

it('ImageProperty should provide a constructor from data', () => {
	const property = ImageProperty.fromData('data123')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE;ENCODING=BASE64;VALUE=BINARY:ZGF0YTEyMw==')
})

it('ImageProperty should provide a constructor from data with display', () => {
	const property = ImageProperty.fromData('data123', 'BADGE')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE;DISPLAY=BADGE;ENCODING=BASE64;VALUE=BINARY:ZGF0YTEyMw==')
})

it('ImageProperty should provide a constructor from data with display and formatType', () => {
	const property = ImageProperty.fromData('data123', 'FULLSCREEN', 'application/jpeg')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE;DISPLAY=FULLSCREEN;FMTTYPE=application/jpeg;ENCODING=BASE64;VALUE=BINARY:ZGF0YTEyMw==')
})

it('ImageProperty should provide a constructor from link', () => {
	const property = ImageProperty.fromLink('http://example.com/image.jpg')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE:http://example.com/image.jpg')
})

it('ImageProperty should provide a constructor from link with display', () => {
	const property = ImageProperty.fromLink('http://example.com/image.jpg', 'BADGE')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE;DISPLAY=BADGE:http://example.com/image.jpg')
})

it('ImageProperty should provide a constructor from link with display and formatType', () => {
	const property = ImageProperty.fromLink('http://example.com/image.jpg', 'FULLSCREEN', 'application/jpeg')

	expect(property.toICALJs().toICALString()).toEqual('IMAGE;DISPLAY=FULLSCREEN;FMTTYPE=application/jpeg:http://example.com/image.jpg')
})
