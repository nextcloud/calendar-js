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
import {
	getAgeOfBirthday,
	getIconForBirthday,
	getNameForBirthday,
	getTypeOfBirthdayEvent
} from '../../../src/helpers/birthdayHelper.js';

it('should provide a function to get the type of the birthday', () => {
	const eventComp1 = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue('BDAY')
	}
	const eventComp2 = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue(null)
	}

	expect(getTypeOfBirthdayEvent(eventComp1)).toEqual('BDAY')
	expect(getTypeOfBirthdayEvent(eventComp2)).toEqual(null)
})

it('should provide a function to get the birthday icon', () => {
	const bdayComp = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue('BDAY')
	}
	const deathComp = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue('DEATHDATE')
	}
	const anniversaryComp = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue('ANNIVERSARY')
	}
	const noComp = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue(null)
	}

	expect(getIconForBirthday(bdayComp)).toEqual('🎂')
	expect(getIconForBirthday(deathComp)).toEqual('⚰️')
	expect(getIconForBirthday(anniversaryComp)).toEqual('💍')
	expect(getIconForBirthday(noComp)).toEqual(null)
})

it('should get the age for a birthday', () => {
	const bdayComp = {
		hasProperty: jest.fn().mockReturnValue(true),
		getFirstPropertyFirstValue: jest.fn().mockReturnValue('1990')
	}
	const noComp = {
		hasProperty: jest.fn().mockReturnValue(false)
	}

	expect(getAgeOfBirthday(bdayComp, 2019)).toEqual(29)
	expect(getAgeOfBirthday(noComp, 2019)).toEqual(null)

	expect(bdayComp.hasProperty.mock.calls.length).toEqual(1)
	expect(bdayComp.hasProperty.mock.calls[0][0]).toEqual('X-NEXTCLOUD-BC-YEAR')
	expect(bdayComp.getFirstPropertyFirstValue.mock.calls.length).toEqual(1)
	expect(bdayComp.getFirstPropertyFirstValue.mock.calls[0][0]).toEqual('X-NEXTCLOUD-BC-YEAR')
	expect(noComp.hasProperty.mock.calls.length).toEqual(1)
	expect(noComp.hasProperty.mock.calls[0][0]).toEqual('X-NEXTCLOUD-BC-YEAR')
})

it('should get the name for a birthday', () => {
	const bdayComp = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue('Pete')
	}
	const noComp = {
		getFirstPropertyFirstValue: jest.fn().mockReturnValue(null)
	}

	expect(getNameForBirthday(bdayComp)).toEqual('Pete')
	expect(getNameForBirthday(noComp)).toEqual(null)
})
