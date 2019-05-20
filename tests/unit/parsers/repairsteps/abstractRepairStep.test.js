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
import AbstractRepairStep from '../../../../src/parsers/repairsteps/abstractRepairStep.js';

it('AbstractRepairStep should not be instantiable', () => {
	expect(() => {
		new AbstractRepairStep({})
	}).toThrow(TypeError, 'Cannot instantiate abstract class AbstractValue');
})

it('AbstractRepairStep should force subclasses to implement repair', () => {
	class TestRepairStep extends AbstractRepairStep {}

	const test = new TestRepairStep()
	expect(() => {
		test.repair('')
	}).toThrow(TypeError, 'Abstract method not implemented by subclass');
})

it('AbstractRepairStep should include a default priority of zero', () => {
	expect(AbstractRepairStep.priority()).toEqual(0)
})
