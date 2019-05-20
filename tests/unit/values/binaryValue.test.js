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
import BinaryValue from '../../../src/values/binaryValue.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';

it('BinaryValue should be defined', () => {
	expect(BinaryValue).toBeDefined()
})

it('BinaryValue should provide a constructor from decoded data', () => {
	const value = BinaryValue.fromDecodedValue('Test123')

	expect(value instanceof BinaryValue).toBeTruthy()
	expect(value.rawValue).toEqual('VGVzdDEyMw==')
	expect(value.value).toEqual('Test123')
})

it('BinaryValue should provide a constructor from raw data', () => {
	const value = BinaryValue.fromRawValue('VGVzdDEyMw==')

	expect(value instanceof BinaryValue).toBeTruthy()
	expect(value.rawValue).toEqual('VGVzdDEyMw==')
	expect(value.value).toEqual('Test123')
})

it('BinaryValue should provide a constructor from ICAL.JS', () => {
	const icalValue = ICAL.Binary.fromString('VGVzdDEyMw==')
	const value = BinaryValue.fromICALJs(icalValue)

	expect(value instanceof BinaryValue).toBeTruthy()
	expect(value.rawValue).toEqual('VGVzdDEyMw==')
	expect(value.value).toEqual('Test123')
})

it('BinaryValue should be lockable - value', () => {
	const value = BinaryValue.fromDecodedValue('Test123')
	value.value = 'Test456'
	expect(value.rawValue).toEqual('VGVzdDQ1Ng==')
	expect(value.value).toEqual('Test456')

	value.lock()

	expect(() => {
		value.value = 'Test789'
	}).toThrow(ModificationNotAllowedError);
	expect(value.value).toEqual('Test456')

	expect(value.rawValue).toEqual('VGVzdDQ1Ng==')
	expect(value.value).toEqual('Test456')
	expect(value.isLocked()).toEqual(true)

	value.unlock()

	value.value = 'Test789'
	expect(value.rawValue).toEqual('VGVzdDc4OQ==')
	expect(value.value).toEqual('Test789')
	expect(value.isLocked()).toEqual(false)
})

it('BinaryValue should be lockable - rawValue', () => {
	const value = BinaryValue.fromRawValue('VGVzdDEyMw==')
	value.rawValue = 'VGVzdDQ1Ng=='
	expect(value.rawValue).toEqual('VGVzdDQ1Ng==')
	expect(value.value).toEqual('Test456')

	value.lock()

	expect(() => {
		value.rawValue = 'VGVzdDc4OQ=='
	}).toThrow(ModificationNotAllowedError);
	expect(value.rawValue).toEqual('VGVzdDQ1Ng==')

	expect(value.rawValue).toEqual('VGVzdDQ1Ng==')
	expect(value.value).toEqual('Test456')
	expect(value.isLocked()).toEqual(true)

	value.unlock()

	value.rawValue = 'VGVzdDc4OQ=='
	expect(value.rawValue).toEqual('VGVzdDc4OQ==')
	expect(value.value).toEqual('Test789')
	expect(value.isLocked()).toEqual(false)
})

it('BinaryValue should be able to return the inner ICAL.JS object', () => {
	const value = BinaryValue.fromDecodedValue('Test123')
	expect(value.toICALJs() instanceof ICAL.Binary).toEqual(true)
})

it('BinaryValue should allow to clone the value', () => {
	const value = BinaryValue.fromDecodedValue('Test123')
	expect(value.value).toEqual('Test123')

	const value2 = value.clone()
	expect(value2.value).toEqual('Test123')

	value.value = 'Test456'
	value.lock()

	expect(value.value).toEqual('Test456')
	expect(value.isLocked()).toEqual(true)
	expect(value2.value).toEqual('Test123')
	expect(value2.isLocked()).toEqual(false)
})
