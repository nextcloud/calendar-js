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

export default function observerTrait(baseClass) {

	/**
	 * @class ObserverTrait
	 */
	return class extends baseClass {

		/**
		 * Constructor
		 */
		constructor(...args) {
			super(...args)

			/**
			 * List of subscribers
			 *
			 * @type {Function[]}
			 * @private
			 */
			this._subscribers = []
		}

		/**
		 * Adds a new subscriber
		 *
		 * @param {Function} handler - Handler to be called when modification happens
		 */
		subscribe(handler) {
			this._subscribers.push(handler)
		}

		/**
		 * Removes a subscriber
		 *
		 * @param {Function} handler - Handler to be no longer called when modification happens
		 */
		unsubscribe(handler) {
			const index = this._subscribers.indexOf(handler)
			if (index === -1) {
				return
			}

			this._subscribers.splice(index, 1)
		}

		/**
		 * Notify all subscribed handlers
		 *
		 * @protected
		 */
		_notifySubscribers(...args) {
			for (const handler of this._subscribers) {
				handler(...args)
			}
		}

	}
}
