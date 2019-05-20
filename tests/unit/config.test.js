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
import { deleteConfig, setConfig, getConfig, hasConfig } from '../../src/config.js';

it('should provide a global config mechanism', () => {
	expect(hasConfig('key1')).toEqual(false)
	expect(getConfig('key1', 'defaultValue123')).toEqual('defaultValue123')

	setConfig('key1', 'FOO BAR')

	expect(hasConfig('key1')).toEqual(true)
	expect(getConfig('key1', 'defaultValue123')).toEqual('FOO BAR')

	deleteConfig('key1')

	expect(hasConfig('key1')).toEqual(false)
	expect(getConfig('key1', 'defaultValue123')).toEqual('defaultValue123')
})
