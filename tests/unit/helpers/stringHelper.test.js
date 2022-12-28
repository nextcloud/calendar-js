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

import { lc, strcasecmp, uc, startStringWith, ucFirst } from '../../../src/helpers/stringHelper.js';

it('lc should turn a string lowercase', () => {
	expect(lc('ABC')).toEqual('abc')
	expect(lc('aBc')).toEqual('abc')
	expect(lc('abc')).toEqual('abc')
	expect(lc('AbC123')).toEqual('abc123')
})

it('uc should turn a string uppercase', () => {
	expect(uc('ABC')).toEqual('ABC')
	expect(uc('aBc')).toEqual('ABC')
	expect(uc('abc')).toEqual('ABC')
	expect(uc('AbC123')).toEqual('ABC123')
})

it('ucFirst should turn the first character uppercase', () => {
	expect(ucFirst('ABC')).toEqual('ABC')
	expect(ucFirst('aBc')).toEqual('ABc')
	expect(ucFirst('abc')).toEqual('Abc')
	expect(ucFirst('AbC123')).toEqual('AbC123')
})

it('startStringWith should make sure a string starts with a certain string', () => {
	expect(startStringWith('abc:123', 'abc:')).toEqual('abc:123')
	expect(startStringWith('123', 'abc:')).toEqual('abc:123')
	expect(startStringWith('123:abc', 'abc:')).toEqual('abc:123:abc')
})

it('strcasecmp should compare strings ignoring their case', () => {
	expect(strcasecmp('abc', 'abc')).toEqual(true)
	expect(strcasecmp('abc', 'ABC')).toEqual(true)
})
