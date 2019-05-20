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
import RequestStatusProperty from '../../../src/properties/requestStatusProperty.js';
import Property from '../../../src/properties/property.js';
import ModificationNotAllowedError from '../../../src/errors/modificationNotAllowedError.js';
import Parameter from '../../../src/parameters/parameter.js';

it('RequestStatusProperty should be defined', () => {
	expect(RequestStatusProperty).toBeDefined()
})

it('RequestStatusProperty should ', () => {
	const property = new RequestStatusProperty('REQUEST-STATUS')
	expect(property instanceof Property).toEqual(true)
})

it('RequestStatusProperty should provide easy getter/setter for status code', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:2.0;Success')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.statusCode).toEqual(2.0)

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.statusCode = 2.1
	}).toThrow(ModificationNotAllowedError);
	expect(property.statusCode).toEqual(2.0)

	property.unlock()

	property.statusCode = 2.4
	expect(property.statusCode).toEqual(2.4)

	expect(property.toICALJs().toICALString()).toEqual('REQUEST-STATUS:2.4;Success')

	property.statusCode = 3
	expect(property.statusCode).toEqual(3.0)
	expect(property.toICALJs().toICALString()).toEqual('REQUEST-STATUS:3.0;Success')
})

it('RequestStatusProperty should provide an easy getter/setter for status message', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:2.0;Success')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.statusMessage).toEqual('Success')

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.statusMessage = 'MESSAGE3'
	}).toThrow(ModificationNotAllowedError);
	expect(property.statusMessage).toEqual('Success')

	property.unlock()

	property.statusMessage = 'MESSAGE4'
	expect(property.statusMessage).toEqual('MESSAGE4')

	expect(property.toICALJs().toICALString()).toEqual('REQUEST-STATUS:2.0;MESSAGE4')
})

it('RequestStatusProperty should provide an easy getter/setter for exceptionData', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:2.0;Success')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.exceptionData).toEqual(null)

	property.lock()
	expect(property.isLocked())

	expect(() => {
		property.exceptionData = 'EXCEPTION3'
	}).toThrow(ModificationNotAllowedError);
	expect(property.exceptionData).toEqual(null)

	property.unlock()

	property.exceptionData = 'EXCEPTION4'
	expect(property.exceptionData).toEqual('EXCEPTION4')

	expect(property.toICALJs().toICALString()).toEqual('REQUEST-STATUS:2.0;Success;EXCEPTION4')
})

it('RequestStatusProperty should check if a status-code is pending', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:1.0;Pending')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.isPending()).toEqual(true)
	expect(property.isSuccessful()).toEqual(false)
	expect(property.isClientError()).toEqual(false)
	expect(property.isSchedulingError()).toEqual(false)
})

it('RequestStatusProperty should check if a status-code is successful', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:2.4;Pending')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.isPending()).toEqual(false)
	expect(property.isSuccessful()).toEqual(true)
	expect(property.isClientError()).toEqual(false)
	expect(property.isSchedulingError()).toEqual(false)
})

it('RequestStatusProperty should check if a status-code is a client error', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:3.5;Pending')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.isPending()).toEqual(false)
	expect(property.isSuccessful()).toEqual(false)
	expect(property.isClientError()).toEqual(true)
	expect(property.isSchedulingError()).toEqual(false)
})

it('RequestStatusProperty should check if a status code is a scheduling error', () => {
	const icalProperty = ICAL.Property.fromString('REQUEST-STATUS:4.999;Pending')
	const property = RequestStatusProperty.fromICALJs(icalProperty)

	expect(property.isPending()).toEqual(false)
	expect(property.isSuccessful()).toEqual(false)
	expect(property.isClientError()).toEqual(false)
	expect(property.isSchedulingError()).toEqual(true)
})

it('RequestStatusProperty should provide a constructor from code and message', () => {
	const property = RequestStatusProperty.fromCodeAndMessage(2, 'Success')
	const para1 = new Parameter('para1', 'paravalue1')

	property.setParameter(para1)

	expect(property.toICALJs().toICALString()).toEqual('REQUEST-STATUS;PARA1=paravalue1:2;Success')
})
