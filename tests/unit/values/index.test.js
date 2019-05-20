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
import { getConstructorForICALType } from '../../../src/values';
import BinaryValue from '../../../src/values/binaryValue.js';
import DateTimeValue from '../../../src/values/dateTimeValue.js';
import DurationValue from '../../../src/values/durationValue.js';
import PeriodValue from '../../../src/values/periodValue.js';
import RecurValue from '../../../src/values/recurValue.js';
import UTCOffsetValue from '../../../src/values/utcOffsetValue.js';
import UnknownICALTypeError from '../../../src/errors/unknownICALTypeError.js';

it('should provide a constructor for different ical-types - binary', () => {
	expect(getConstructorForICALType('binary')).toEqual(BinaryValue)
	expect(getConstructorForICALType('BINARY')).toEqual(BinaryValue)
	expect(getConstructorForICALType('bInArY')).toEqual(BinaryValue)
})

it('should provide a constructor for different ical-tyoes - date', () => {
	expect(getConstructorForICALType('date')).toEqual(DateTimeValue)
})

it('should provide a constructor for different ical-tyoes - date-time', () => {
	expect(getConstructorForICALType('date-time')).toEqual(DateTimeValue)
})

it('should provide a constructor for different ical-tyoes - duration', () => {
	expect(getConstructorForICALType('duration')).toEqual(DurationValue)
})

it('should provide a constructor for different ical-tyoes - period', () => {
	expect(getConstructorForICALType('period')).toEqual(PeriodValue)
})

it('should provide a constructor for different ical-tyoes - recur', () => {
	expect(getConstructorForICALType('recur')).toEqual(RecurValue)
})

it('should provide a constructor for different ical-tyoes - utc-offset', () => {
	expect(getConstructorForICALType('utc-offset')).toEqual(UTCOffsetValue)
})

it('should provide a constructor for different ical-tyoes - unknown', () => {
	expect(() => {
		getConstructorForICALType('other')
	}).toThrow(UnknownICALTypeError)
})
