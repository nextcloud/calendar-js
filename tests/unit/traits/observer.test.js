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
import observerTrait from '../../../src/traits/observer.js';

it('should provide an observer interface', () => {
	const c = new (observerTrait(class {}))()

	const handler1 = jest.fn()
	const handler2 = jest.fn()
	const handler3 = jest.fn()

	c.subscribe(handler1)
	c.subscribe(handler2)
	c.subscribe(handler3)

	expect(handler1).not.toHaveBeenCalled()
	expect(handler2).not.toHaveBeenCalled()
	expect(handler3).not.toHaveBeenCalled()

	c._notifySubscribers('foo', 'bar', 123)

	c.unsubscribe(handler2)

	// Make sure unknown handlers don't cause errors
	c.unsubscribe(handler2)
	c.unsubscribe(() => {})

	c._notifySubscribers('bar', 'foo', 456)

	expect(handler1).toHaveBeenCalled()
	expect(handler2).toHaveBeenCalled()
	expect(handler3).toHaveBeenCalled()

	expect(handler1.mock.calls.length).toEqual(2)
	expect(handler2.mock.calls.length).toEqual(1)
	expect(handler3.mock.calls.length).toEqual(2)

	expect(handler1.mock.calls[0]).toEqual(['foo', 'bar', 123])
	expect(handler1.mock.calls[1]).toEqual(['bar', 'foo', 456])

	expect(handler2.mock.calls[0]).toEqual(['foo', 'bar', 123])

	expect(handler3.mock.calls[0]).toEqual(['foo', 'bar', 123])
	expect(handler3.mock.calls[1]).toEqual(['bar', 'foo', 456])
})
